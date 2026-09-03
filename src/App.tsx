import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Globe3D } from './components/Globe3D';
import { Map2D } from './components/Map2D';
import { Sidebar } from './components/Sidebar';
import { SpoofWarningBanner } from './components/SpoofWarningBanner';
import { TrilaterationExplainer } from './components/TrilaterationExplainer';
import { AcademyModal } from './components/AcademyModal';
import { SearchModal } from './components/SearchModal';
import { SatelliteDetailsModal } from './components/SatelliteDetailsModal';
import { ErrorLabModal } from './components/ErrorLabModal';
import { DetectionModal } from './components/DetectionModal';
import { SkyView } from './components/SkyView';
import { TimelineDock } from './components/TimelineDock';
import { LocationSelectModal } from './components/LocationSelectModal';
import { SignalTimingModal } from './components/SignalTimingModal';
import { HowGpsFindsMeModal } from './components/HowGpsFindsMeModal';
import { SignalInspectionBar } from './components/SignalInspectionBar';
import { useSatellites } from './hooks/useSatellites';
import {
  UserLocation,
  SpoofConfig,
  SatelliteData,
  ConstellationType,
  Language,
  TimeSimulationState,
} from './types';
import { calculateDop } from './utils/dop';
import { evaluateSpoofingAnomaly } from './utils/spoofingDetector';
import { X, Compass } from 'lucide-react';

// Default initial location: Yerevan, Armenia (ARMN GNSS Base Station)
const DEFAULT_REAL_LOCATION: UserLocation = {
  lat: 40.1872,
  lng: 44.5152,
  alt: 989,
  accuracy: 10,
  isReal: true,
  name: 'Yerevan, Armenia (ARMN Station)',
};

export default function App() {
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');

  // Modals state
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isErrorLabOpen, setIsErrorLabOpen] = useState<boolean>(false);
  const [isDetectionOpen, setIsDetectionOpen] = useState<boolean>(false);
  const [isSkyViewOpen, setIsSkyViewOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isSignalTimingModalOpen, setIsSignalTimingModalOpen] = useState<boolean>(false);
  const [isHowGpsFindsMeModalOpen, setIsHowGpsFindsMeModalOpen] = useState<boolean>(false);
  const [timingSatellite, setTimingSatellite] = useState<SatelliteData | null>(null);
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);

  // Elevation Mask (degrees above local horizon)
  const [elevationMask, setElevationMask] = useState<number>(10);

  // Enabled Constellations
  const [enabledConstellations, setEnabledConstellations] = useState<
    Record<ConstellationType, boolean>
  >({
    GPS: true,
    Galileo: true,
    GLONASS: true,
    BeiDou: false,
    QZSS: false,
  });

  const toggleConstellation = useCallback((c: ConstellationType) => {
    setEnabledConstellations((prev) => ({
      ...prev,
      [c]: !prev[c],
    }));
  }, []);

  // Time simulation state
  const [timeState, setTimeState] = useState<TimeSimulationState>({
    timeOffsetSeconds: 0,
    simulationSpeed: 1,
    isPlaying: true,
    simulatedTime: new Date(),
  });

  // Time simulation ticker
  useEffect(() => {
    if (!timeState.isPlaying || timeState.simulationSpeed === 0) return;

    const interval = window.setInterval(() => {
      setTimeState((prev) => {
        const step = 1 * prev.simulationSpeed;
        const newOffset = prev.timeOffsetSeconds + step;
        return {
          ...prev,
          timeOffsetSeconds: newOffset,
          simulatedTime: new Date(Date.now() + newOffset * 1000),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeState.isPlaying, timeState.simulationSpeed]);

  // Real User Geolocation state
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_REAL_LOCATION);
  const [isGeoLoading, setIsGeoLoading] = useState<boolean>(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Spoofing Simulator state
  const [spoofConfig, setSpoofConfig] = useState<SpoofConfig>({
    isActive: false,
    targetLat: 48.8566,
    targetLng: 2.3522,
    targetAlt: 35,
    noiseKm: 0,
    clockDriftNs: 0,
    affectedCount: 8,
    targetName: 'Paris, France',
    transitionSpeed: 'instant',
    attackStage: 'idle',
  });

  // Memoize derived spoofed location object when active
  const spoofedLocation: UserLocation | null = useMemo(() => {
    if (!spoofConfig.isActive) return null;
    return {
      lat: spoofConfig.targetLat,
      lng: spoofConfig.targetLng,
      alt: spoofConfig.targetAlt,
      accuracy: 5,
      isReal: false,
      name: spoofConfig.targetName || 'Spoofed Target',
    };
  }, [
    spoofConfig.isActive,
    spoofConfig.targetLat,
    spoofConfig.targetLng,
    spoofConfig.targetAlt,
    spoofConfig.targetName,
  ]);

  // Request real device geolocation
  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Browser Geolocation is not supported by your browser.');
      return;
    }

    setIsGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          alt: position.coords.altitude || 20,
          accuracy: position.coords.accuracy || 10,
          isReal: true,
          name: 'My Device GPS Location',
        });
        setIsGeoLoading(false);
      },
      (error) => {
        let msg = 'Geolocation permission denied. Using fallback location.';
        if (error.code === error.TIMEOUT) msg = 'Geolocation request timed out.';
        if (error.code === error.POSITION_UNAVAILABLE) msg = 'GPS position unavailable.';
        setGeoError(msg);
        setIsGeoLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Request geolocation on initial mount
  useEffect(() => {
    requestGeolocation();
  }, [requestGeolocation]);

  // Hook calculating active GNSS orbits and pseudorange differences
  const {
    satellites,
    visibleSatellites,
    trilaterationSatellites,
    pseudorangeComparisons,
    loading: isLoadingTle,
    dataSource,
    refreshTle,
  } = useSatellites(
    userLocation,
    spoofedLocation,
    enabledConstellations,
    timeState.simulatedTime,
    spoofConfig,
    elevationMask
  );

  // Dilution of Precision (DOP) calculation
  const dop = useMemo(() => {
    const activeLocation = spoofedLocation || userLocation;
    const result = calculateDop(satellites, activeLocation);
    return {
      ...result,
      satelliteCount: trilaterationSatellites.length,
    };
  }, [satellites, userLocation, spoofedLocation, trilaterationSatellites.length]);

  // Anti-spoofing anomaly detection evaluation
  const spoofingDetection = useMemo(() => {
    const activeLocation = spoofedLocation || userLocation;
    return evaluateSpoofingAnomaly(
      userLocation,
      activeLocation,
      spoofConfig,
      pseudorangeComparisons
    );
  }, [userLocation, spoofedLocation, spoofConfig, pseudorangeComparisons]);

  // Handle map click coordinate selection for spoofing
  const handleMapClickCoordinates = useCallback((lat: number, lng: number) => {
    setSpoofConfig((prev) => ({
      ...prev,
      targetLat: lat,
      targetLng: lng,
      targetName: `Custom Target (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
    }));
  }, []);

  // Reset Spoofing back to authentic GPS
  const handleResetRealLocation = useCallback(() => {
    setSpoofConfig((prev) => ({
      ...prev,
      isActive: false,
      attackStage: 'idle',
    }));
  }, []);

  // Set user location from search
  const handleSelectLocation = useCallback((loc: UserLocation) => {
    setUserLocation(loc);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans text-slate-100">
      {/* Top Navbar */}
      <Navbar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        isSpoofed={spoofConfig.isActive}
        totalSatellites={satellites.length}
        visibleCount={visibleSatellites.length}
        dataSource={dataSource}
        onRefreshTle={refreshTle}
        isLoadingTle={isLoadingTle}
        onOpenExplainer={() => setIsExplainerOpen(true)}
        onOpenAcademy={() => setIsAcademyOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenErrorLab={() => setIsErrorLabOpen(true)}
        onOpenDetection={() => setIsDetectionOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenHowGpsFindsMe={() => setIsHowGpsFindsMeModalOpen(true)}
        onOpenSignalTiming={() => {
          setTimingSatellite(selectedSatellite || trilaterationSatellites[0] || null);
          setIsSignalTimingModalOpen(true);
        }}
        onToggleSkyView={() => setIsSkyViewOpen(!isSkyViewOpen)}
        isSkyViewOpen={isSkyViewOpen}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        language={language}
        onLanguageChange={setLanguage}
        enabledConstellations={enabledConstellations}
        onToggleConstellation={toggleConstellation}
      />

      {/* Main View Area (3D Globe or 2D Map) */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* Animated Spoof Alert Overlay Banner */}
        <SpoofWarningBanner
          spoofConfig={spoofConfig}
          onResetRealLocation={handleResetRealLocation}
        />

        {/* View Component */}
        {viewMode === '3D' ? (
          <Globe3D
            satellites={satellites}
            trilaterationSatellites={trilaterationSatellites}
            userLocation={userLocation}
            spoofedLocation={spoofedLocation}
            selectedSatellite={selectedSatellite}
            language={language}
            onSelectSatellite={setSelectedSatellite}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenSignalTimingModal={() => {
              setTimingSatellite(selectedSatellite || trilaterationSatellites[0] || null);
              setIsSignalTimingModalOpen(true);
            }}
            onOpenHowGpsFindsMeModal={() => setIsHowGpsFindsMeModalOpen(true)}
          />
        ) : (
          <Map2D
            satellites={satellites}
            trilaterationSatellites={trilaterationSatellites}
            userLocation={userLocation}
            spoofedLocation={spoofedLocation}
            selectedSatellite={selectedSatellite}
            language={language}
            onSelectSatellite={setSelectedSatellite}
            onMapClickCoordinates={handleMapClickCoordinates}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onOpenSignalTimingModal={() => {
              setTimingSatellite(selectedSatellite || trilaterationSatellites[0] || null);
              setIsSignalTimingModalOpen(true);
            }}
            onOpenHowGpsFindsMeModal={() => setIsHowGpsFindsMeModalOpen(true)}
          />
        )}

        {/* Floating Polar Sky View Overlay Card */}
        {isSkyViewOpen && (
          <div className="absolute top-4 left-4 z-20 max-w-[420px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl p-4 animate-in fade-in slide-in-from-left-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Local Horizon Skyplot
                </span>
              </div>
              <button
                onClick={() => setIsSkyViewOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SkyView
              satellites={satellites}
              userLocation={spoofedLocation || userLocation}
              elevationMask={elevationMask}
              onElevationMaskChange={setElevationMask}
              onSelectSatellite={setSelectedSatellite}
              selectedSatelliteId={selectedSatellite?.id}
              language={language}
            />
          </div>
        )}

        {/* Timeline Simulation Dock at Bottom */}
        <TimelineDock
          timeState={timeState}
          onTimeStateChange={setTimeState}
          language={language}
        />

        {/* Collapsible Control & Info Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userLocation={userLocation}
          onRequestGeolocation={requestGeolocation}
          isGeoLoading={isGeoLoading}
          geoError={geoError}
          satellites={satellites}
          trilaterationSatellites={trilaterationSatellites}
          selectedSatellite={selectedSatellite}
          onSelectSatellite={setSelectedSatellite}
          spoofConfig={spoofConfig}
          onUpdateSpoofConfig={setSpoofConfig}
          onResetRealLocation={handleResetRealLocation}
          pseudorangeComparisons={pseudorangeComparisons}
          onOpenExplainer={() => setIsExplainerOpen(true)}
          dop={dop}
          language={language}
        />

        {/* Floating Satellite Signal Inspector Bar */}
        <SignalInspectionBar
          satellite={selectedSatellite}
          receiverLocation={spoofedLocation || userLocation}
          onClose={() => setSelectedSatellite(null)}
          onAnimateSignal={(sat) => {
            setTimingSatellite(sat);
            setIsSignalTimingModalOpen(true);
          }}
          onShowPositioning={() => setIsHowGpsFindsMeModalOpen(true)}
          onFocusSatellite={(sat) => setSelectedSatellite(sat)}
          language={language}
        />
      </main>

      {/* Interactive Geographic Country & City Explorer Modal */}
      <LocationSelectModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={(loc) => {
          setUserLocation(loc);
        }}
        onRequestBrowserGps={requestGeolocation}
        isGeoLoading={isGeoLoading}
        elevationMask={elevationMask}
        onElevationMaskChange={setElevationMask}
        language={language}
      />

      {/* Signal Travel Time & Atmospheric Delay Laboratory */}
      <SignalTimingModal
        isOpen={isSignalTimingModalOpen}
        onClose={() => setIsSignalTimingModalOpen(false)}
        satellite={timingSatellite || selectedSatellite || trilaterationSatellites[0] || null}
        receiverLocation={spoofedLocation || userLocation}
        isSpoofed={Boolean(spoofedLocation)}
        language={language}
      />

      {/* How GPS Finds Me — 4-Step Multilateration & Time Offset Laboratory */}
      <HowGpsFindsMeModal
        isOpen={isHowGpsFindsMeModalOpen}
        onClose={() => setIsHowGpsFindsMeModalOpen(false)}
        satellites={trilaterationSatellites.length >= 4 ? trilaterationSatellites : satellites.slice(0, 4)}
        userLocation={userLocation}
        receiverLocation={spoofedLocation || userLocation}
        isSpoofed={Boolean(spoofedLocation)}
        language={language}
      />

      {/* GNSS Academy 20-Lesson Modal */}
      <AcademyModal
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        language={language}
      />

      {/* Global Satellite & City Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        satellites={satellites}
        onSelectSatellite={setSelectedSatellite}
        onSelectLocation={handleSelectLocation}
        language={language}
      />

      {/* Satellite Telemetry Details Modal */}
      <SatelliteDetailsModal
        satellite={selectedSatellite}
        onClose={() => setSelectedSatellite(null)}
        language={language}
        elevationMask={elevationMask}
      />

      {/* Natural GPS Error Budget Lab Modal */}
      <ErrorLabModal
        isOpen={isErrorLabOpen}
        onClose={() => setIsErrorLabOpen(false)}
        language={language}
        hdop={dop.hdop}
      />

      {/* Anti-Spoofing Anomaly Detection Dashboard Modal */}
      <DetectionModal
        isOpen={isDetectionOpen}
        onClose={() => setIsDetectionOpen(false)}
        detection={spoofingDetection}
        language={language}
      />

      {/* Educational Trilateration Explainer Modal */}
      <TrilaterationExplainer
        isOpen={isExplainerOpen}
        onClose={() => setIsExplainerOpen(false)}
      />
    </div>
  );
}
