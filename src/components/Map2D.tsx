import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { SatelliteData, UserLocation, Language } from '../types';
import {
  ARMENIA_PEAKS,
  ARMENIA_RIVERS,
  ARMENIA_LAKES,
  ARMENIA_HIGHWAYS,
  ARMENIA_STATIONS_AND_CITIES,
} from '../data/armeniaGeoData';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Navigation,
  Target,
  Crosshair,
  Radio,
  ShieldAlert,
  Layers,
  Mountain,
  MapPin,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react';

interface Map2DProps {
  satellites: SatelliteData[];
  trilaterationSatellites: SatelliteData[];
  userLocation: UserLocation;
  spoofedLocation: UserLocation | null;
  selectedSatellite: SatelliteData | null;
  language?: Language;
  onSelectSatellite: (sat: SatelliteData | null) => void;
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  onOpenLocationModal?: () => void;
  onOpenSignalTimingModal?: () => void;
  onOpenHowGpsFindsMeModal?: () => void;
}

// Custom Photon Pulse Icon for in-flight GNSS radio wave particles
const createPhotonIcon = (isSpoofed: boolean) => {
  const color = isSpoofed ? '#f43f5e' : '#38bdf8';
  return L.divIcon({
    className: 'custom-photon-icon',
    html: `
      <div style="width: 10px; height: 10px; border-radius: 9999px; background: ${color}; box-shadow: 0 0 10px ${color}, 0 0 18px ${color}; opacity: 0.95; transform: translate(-5px, -5px);"></div>
    `,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
};

// Custom Satellite Icon
const createSatelliteIcon = (name: string, isTrilaterating: boolean, isSelected: boolean) => {
  const color = isSelected ? '#f59e0b' : isTrilaterating ? '#10b981' : '#38bdf8';
  const size = isSelected ? 32 : isTrilaterating ? 26 : 20;

  return L.divIcon({
    className: 'custom-sat-icon',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px; cursor: pointer;">
        ${
          isTrilaterating
            ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(16, 185, 129, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
            : ''
        }
        <div style="width: ${size}px; height: ${size}px; background: #0f172a; border: 2px solid ${color}; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}88; color: ${color}; transform: rotate(45deg);">
          <div style="transform: rotate(-45deg); font-size: ${size > 24 ? '8px' : '6.5px'}; font-weight: 700; font-family: monospace;">
            ${name.replace(/NAVSTAR\s*/i, '').slice(0, 3)}
          </div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Custom User Receiver Icon
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(56, 189, 248, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 20px; height: 20px; border-radius: 9999px; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 14px #38bdf8; display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Custom Spoofed Target Icon
const createSpoofedIcon = () => {
  return L.divIcon({
    className: 'custom-spoof-icon',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: -3px; border-radius: 9999px; background: rgba(239, 68, 68, 0.5); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 24px; height: 24px; border-radius: 9999px; background: #dc2626; border: 2.5px solid #fef08a; box-shadow: 0 0 16px #ef4444; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
          ⚠️
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
};

// Custom Mountain Peak Icon
const createPeakIcon = (alt: number) => {
  return L.divIcon({
    className: 'custom-peak-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 14px solid #f59e0b; filter: drop-shadow(0 0 4px rgba(0,0,0,0.8));"></div>
        <div style="font-size: 9px; font-weight: 700; color: #fef08a; background: rgba(15, 23, 42, 0.85); padding: 1px 3px; border-radius: 4px; border: 1px solid #f59e0b; margin-top: 1px; white-space: nowrap;">
          ${alt}m
        </div>
      </div>
    `,
    iconSize: [36, 30],
    iconAnchor: [18, 14],
  });
};

// Custom Station / Observatory Icon
const createStationIcon = (type: string) => {
  const color = type === 'observatory' ? '#ec4899' : '#38bdf8';
  return L.divIcon({
    className: 'custom-station-icon',
    html: `
      <div style="width: 14px; height: 14px; border-radius: 9999px; background: ${color}; border: 2px solid #ffffff; box-shadow: 0 0 8px ${color};"></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

// Controller component to smoothly pan/zoom map when target changes without constant jitter
const MapController: React.FC<{ center: [number, number]; zoom?: number; recenterKey?: number }> = ({
  center,
  zoom,
  recenterKey,
}) => {
  const map = useMap();
  const lastCenterRef = React.useRef<[number, number]>(center);
  const lastKeyRef = React.useRef<number | undefined>(recenterKey);

  useEffect(() => {
    const latDiff = Math.abs(center[0] - lastCenterRef.current[0]);
    const lngDiff = Math.abs(center[1] - lastCenterRef.current[1]);
    const keyChanged = recenterKey !== lastKeyRef.current;

    if (keyChanged || latDiff > 0.05 || lngDiff > 0.05) {
      lastCenterRef.current = center;
      lastKeyRef.current = recenterKey;
      map.flyTo([center[0], center[1]], zoom ?? map.getZoom(), { duration: 1.0 });
    }
  }, [center, zoom, recenterKey, map]);

  return null;
};

// Map click event listener to pick custom coordinates
const MapClickDetector: React.FC<{ onMapClick?: (lat: number, lng: number) => void }> = ({
  onMapClick,
}) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
      }
    },
  });
  return null;
};

// Isolated Photon Animation Layer that does not re-render the parent map
const PhotonLayer: React.FC<{
  beamLines: Array<{ satId: string; name: string; positions: [number, number][] }>;
  trilaterationSatellites: SatelliteData[];
  activeReceiver: UserLocation;
  isSpoofed: boolean;
}> = React.memo(({ beamLines, trilaterationSatellites, activeReceiver, isSpoofed }) => {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1800;
      lastTime = now;
      setPhase((prev) => (prev + delta) % 1);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <>
      {beamLines.map((beam, index) => {
        const sat = trilaterationSatellites.find((s) => s.id === beam.satId);
        if (!sat) return null;
        const offset = (index * 0.23) % 1;
        const progress = (phase + offset) % 1;
        const photonLat = sat.lat + (activeReceiver.lat - sat.lat) * progress;
        const photonLng = sat.lng + (activeReceiver.lng - sat.lng) * progress;
        return (
          <Marker
            key={`photon-${beam.satId}`}
            position={[photonLat, photonLng]}
            icon={createPhotonIcon(isSpoofed)}
            interactive={false}
          />
        );
      })}
    </>
  );
});
PhotonLayer.displayName = 'PhotonLayer';

export const Map2D: React.FC<Map2DProps> = ({
  satellites,
  trilaterationSatellites,
  userLocation,
  spoofedLocation,
  selectedSatellite,
  language = 'en',
  onSelectSatellite,
  onMapClickCoordinates,
  onOpenLocationModal,
  onOpenSignalTimingModal,
  onOpenHowGpsFindsMeModal,
}) => {
  const [tileLayerType, setTileLayerType] = useState<'satellite' | 'dark' | 'topo' | 'osm'>('satellite');
  const [showArmeniaGis, setShowArmeniaGis] = useState<boolean>(true);
  const [showFootprints, setShowFootprints] = useState<boolean>(false);
  const [showMultilateration, setShowMultilateration] = useState<boolean>(false);
  const [animatePhotons, setAnimatePhotons] = useState<boolean>(true);

  const t = TRANSLATIONS[language];

  const safeUserLocation: UserLocation = userLocation || {
    lat: 40.1872,
    lng: 44.5152,
    alt: 989,
    accuracy: 10,
    isReal: true,
    name: 'Yerevan (ARMN Base)',
  };

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    safeUserLocation.lat,
    safeUserLocation.lng,
  ]);
  const [recenterTrigger, setRecenterTrigger] = useState<number>(0);

  // Recenter when user location changes
  useEffect(() => {
    if (userLocation?.lat != null && userLocation?.lng != null) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setRecenterTrigger((prev) => prev + 1);
    }
  }, [userLocation?.lat, userLocation?.lng]);

  // Active receiver location
  const activeReceiver = spoofedLocation || userLocation || safeUserLocation;

  // Polyline beams from visible satellites to active receiver
  const beamLines = useMemo(() => {
    if (!activeReceiver || activeReceiver.lat == null) return [];
    return trilaterationSatellites.map((sat) => ({
      satId: sat.id,
      name: sat.name,
      positions: [
        [sat.lat, sat.lng] as [number, number],
        [activeReceiver.lat, activeReceiver.lng] as [number, number],
      ],
    }));
  }, [trilaterationSatellites, activeReceiver?.lat, activeReceiver?.lng]);

  // Displacement vector between real and spoofed location
  const displacementLine = useMemo(() => {
    if (!spoofedLocation || spoofedLocation.lat == null || !userLocation || userLocation.lat == null) {
      return null;
    }
    return [
      [userLocation.lat, userLocation.lng] as [number, number],
      [spoofedLocation.lat, spoofedLocation.lng] as [number, number],
    ];
  }, [userLocation?.lat, userLocation?.lng, spoofedLocation?.lat, spoofedLocation?.lng]);

  // Tile Layer configurations
  const tileUrls = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors',
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenTopoMap (CC-BY-SA)',
    },
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
  };

  const currentTile = tileUrls[tileLayerType];

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={7}
        minZoom={2}
        maxZoom={18}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#090d16' }}
      >
        <MapController center={mapCenter} />
        <MapClickDetector onMapClick={onMapClickCoordinates} />

        {/* Selected Basemap Tile Layer */}
        <TileLayer attribution={currentTile.attribution} url={currentTile.url} />

        {/* Armenia High-Precision Vector Layers */}
        {showArmeniaGis && (
          <>
            {/* Lakes & Reservoirs (Lake Sevan, Lake Arpi, Kari) */}
            {ARMENIA_LAKES.map((lake) => (
              <Polygon
                key={lake.id}
                positions={lake.coordinates}
                pathOptions={{
                  color: lake.color,
                  fillColor: lake.fillColor,
                  fillOpacity: lake.fillOpacity,
                  weight: 2,
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-1 text-slate-900 text-xs">
                    <strong className="block text-sky-700">
                      {language === 'hy' ? lake.nameHy : lake.nameEn}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {language === 'hy' ? 'Ջրային ավազան' : 'Water body'}
                    </span>
                  </div>
                </Popup>
              </Polygon>
            ))}

            {/* Rivers of Armenia (Araks, Hrazdan, Debed, Vorotan, Arpa) */}
            {ARMENIA_RIVERS.map((river) => (
              <Polyline
                key={river.id}
                positions={river.coordinates}
                pathOptions={{
                  color: river.color,
                  weight: river.weight,
                  opacity: 0.9,
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-1 text-slate-900 text-xs">
                    <strong className="block text-sky-700">
                      {language === 'hy' ? river.nameHy : river.nameEn}
                    </strong>
                    <span className="text-[11px] text-slate-500">
                      {language === 'hy' ? 'Գետ' : 'River'}
                    </span>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* Strategic Highways (M1, M2 North-South, M4) */}
            {ARMENIA_HIGHWAYS.map((hwy) => (
              <Polyline
                key={hwy.id}
                positions={hwy.coordinates}
                pathOptions={{
                  color: hwy.color,
                  weight: hwy.weight,
                  opacity: 0.85,
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-1 text-slate-900 text-xs">
                    <strong className="block text-amber-700">
                      {language === 'hy' ? hwy.nameHy : hwy.nameEn}
                    </strong>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* Mountain Peaks (Mt. Aragats, Azhdahak, Khustup) */}
            {ARMENIA_PEAKS.map((peak) => (
              <Marker
                key={peak.nameEn}
                position={[peak.lat, peak.lng]}
                icon={createPeakIcon(peak.alt || 0)}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-2 text-slate-900 text-xs">
                    <strong className="block text-amber-800 text-sm">
                      {language === 'hy' ? peak.nameHy : peak.nameEn}
                    </strong>
                    <div className="text-slate-600 mt-0.5">
                      {language === 'hy' ? peak.descriptionHy : peak.descriptionEn}
                    </div>
                    <div className="font-mono text-slate-500 text-[11px] mt-1">
                      {peak.lat.toFixed(4)}°N, {peak.lng.toFixed(4)}°E • Alt: {peak.alt}m
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* GNSS Reference Stations & Observatories */}
            {ARMENIA_STATIONS_AND_CITIES.map((st) => (
              <Marker
                key={st.nameEn}
                position={[st.lat, st.lng]}
                icon={createStationIcon(st.type)}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-2 text-slate-900 text-xs">
                    <strong className="block text-sky-800 text-sm">
                      {language === 'hy' ? st.nameHy : st.nameEn}
                    </strong>
                    <div className="text-slate-600 mt-0.5">
                      {language === 'hy' ? st.descriptionHy : st.descriptionEn}
                    </div>
                    <div className="font-mono text-slate-500 text-[11px] mt-1">
                      {st.lat.toFixed(4)}°N, {st.lng.toFixed(4)}°E • Alt: {st.alt}m
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </>
        )}

        {/* Real User Location Marker */}
        <Marker position={[safeUserLocation.lat, safeUserLocation.lng]} icon={createUserIcon()}>
          <Popup className="custom-dark-popup">
            <div className="p-2 text-slate-800 text-xs">
              <div className="font-bold text-sky-700 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> {language === 'hy' ? 'Իրական GNSS Ընդունիչ' : 'Real GPS Receiver'}
              </div>
              <p className="font-mono mt-1 font-semibold">
                {safeUserLocation.lat.toFixed(4)}°, {safeUserLocation.lng.toFixed(4)}°
              </p>
              <p className="text-[11px] text-slate-500">
                {language === 'hy' ? 'Բարձրություն' : 'Altitude'}: {safeUserLocation.alt.toFixed(0)}m
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Accuracy Circle */}
        <Circle
          center={[safeUserLocation.lat, safeUserLocation.lng]}
          radius={Math.max(safeUserLocation.accuracy || 15, 1000)}
          pathOptions={{
            color: '#38bdf8',
            fillColor: '#38bdf8',
            fillOpacity: 0.12,
            weight: 1.5,
          }}
        />

        {/* Spoofed Location Marker (if active) */}
        {spoofedLocation && (
          <>
            <Marker
              position={[spoofedLocation.lat, spoofedLocation.lng]}
              icon={createSpoofedIcon()}
            >
              <Popup className="custom-dark-popup">
                <div className="p-2 text-slate-800 text-xs">
                  <div className="font-bold text-rose-600 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />{' '}
                    {language === 'hy' ? 'Սիմուլացված Կեղծ Թիրախ' : 'Spoofed Target Fix'}
                  </div>
                  <p className="font-mono mt-1 text-rose-700 font-semibold">
                    {spoofedLocation.lat.toFixed(4)}°, {spoofedLocation.lng.toFixed(4)}°
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {spoofedLocation.name || 'Custom Target'}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Displacement Line connecting real to spoofed */}
            {displacementLine && (
              <Polyline
                positions={displacementLine}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 2.5,
                  dashArray: '6, 6',
                  opacity: 0.9,
                }}
              />
            )}
          </>
        )}

        {/* Trilateration Laser Beam Polylines */}
        {beamLines.map((beam) => (
          <Polyline
            key={`beam-${beam.satId}`}
            positions={beam.positions}
            pathOptions={{
              color: spoofedLocation ? '#f43f5e' : '#10b981',
              weight: 2,
              opacity: 0.8,
            }}
          />
        ))}

        {/* Animated Photon Particles in isolated layer */}
        {animatePhotons && (
          <PhotonLayer
            beamLines={beamLines}
            trilaterationSatellites={trilaterationSatellites}
            activeReceiver={activeReceiver}
            isSpoofed={Boolean(spoofedLocation)}
          />
        )}

        {/* Multilateration Range Circles */}
        {showMultilateration &&
          trilaterationSatellites.slice(0, 4).map((sat, idx) => {
            const colors = ['#38bdf8', '#06b6d4', '#f59e0b', '#10b981'];
            const rad = Math.min(Math.max((sat.distanceKm || 20200) * 120, 800000), 5000000);
            return (
              <Circle
                key={`multi-circle-${sat.id}`}
                center={[sat.lat, sat.lng]}
                radius={rad}
                pathOptions={{
                  color: colors[idx % colors.length],
                  weight: 2,
                  dashArray: '5, 5',
                  fillColor: colors[idx % colors.length],
                  fillOpacity: 0.06,
                }}
              />
            );
          })}

        {/* Satellite Markers */}
        {satellites.map((sat) => {
          const isTrilaterating = trilaterationSatellites.some((s) => s.id === sat.id);
          const isSelected = selectedSatellite?.id === sat.id;

          return (
            <React.Fragment key={`sat-${sat.id}`}>
              <Marker
                position={[sat.lat, sat.lng]}
                icon={createSatelliteIcon(sat.name, isTrilaterating, isSelected)}
                eventHandlers={{
                  click: () => onSelectSatellite(sat),
                }}
              >
                <Popup className="custom-dark-popup">
                  <div className="p-2 text-slate-900 text-xs min-w-[200px]">
                    <div className="font-bold text-sky-800 text-sm flex items-center justify-between">
                      <span>{sat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-700">
                        {sat.constellation}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      NORAD #{sat.noradId} • SVN {sat.svn || '—'}
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">{t.telemetry?.elevation || 'Elevation'}</span>
                        <span className="font-mono font-semibold">
                          {sat.elevation != null ? `${sat.elevation.toFixed(1)}°` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.telemetry?.range || 'Distance'}</span>
                        <span className="font-mono font-semibold text-emerald-600">
                          {sat.distanceKm?.toFixed(0) ?? '—'} km
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.telemetry?.delay || 'Delay'}</span>
                        <span className="font-mono font-semibold text-emerald-600">
                          {sat.delayMs?.toFixed(2) ?? '—'} ms
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">{t.telemetry?.doppler || 'Doppler'}</span>
                        <span className="font-mono font-semibold">
                          {sat.dopplerShiftHz ? `${sat.dopplerShiftHz > 0 ? '+' : ''}${sat.dopplerShiftHz.toFixed(0)} Hz` : '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Satellite Footprint Circle */}
              {showFootprints && (
                <Circle
                  center={[sat.lat, sat.lng]}
                  radius={Math.min((sat.footprintRadiusKm || 3000) * 1000, 4500000)}
                  pathOptions={{
                    color: '#38bdf8',
                    weight: 1,
                    dashArray: '4, 4',
                    fillColor: '#38bdf8',
                    fillOpacity: 0.03,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating 2D Controls Top-Left */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2 max-w-[92vw]">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          {/* Tile Layer Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setTileLayerType('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                tileLayerType === 'satellite'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🛰️ {language === 'hy' ? 'Արբանյակ' : language === 'ru' ? 'Спутник' : 'Satellite'}
            </button>
            <button
              onClick={() => setTileLayerType('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                tileLayerType === 'dark'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🌙 {language === 'hy' ? 'Մութ' : language === 'ru' ? 'Темная' : 'Dark'}
            </button>
            <button
              onClick={() => setTileLayerType('topo')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                tileLayerType === 'topo'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ⛰️ {language === 'hy' ? 'Ռելիեֆ' : language === 'ru' ? 'Рельеф' : 'Topo'}
            </button>
          </div>

          {/* Armenia GIS Layer Toggle */}
          <button
            onClick={() => setShowArmeniaGis(!showArmeniaGis)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showArmeniaGis
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>
              🇦🇲 {language === 'hy' ? 'Հայաստանի Շերտ' : language === 'ru' ? 'Слой Армении' : 'Armenia GIS'}
            </span>
          </button>

          {/* Recenter Receiver / Armenia */}
          <button
            onClick={() => setMapCenter([safeUserLocation.lat, safeUserLocation.lng])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {language === 'hy' ? 'Կենտրոնացնել' : language === 'ru' ? 'К приемнику' : 'Recenter'}
            </span>
          </button>

          {/* Recenter strictly on Armenia */}
          <button
            onClick={() => setMapCenter([40.1872, 44.5152])}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-400 hover:bg-slate-800 transition-all"
          >
            🇦🇲 {language === 'hy' ? 'Երևան' : language === 'ru' ? 'Ереван' : 'Armenia'}
          </button>

          {/* Explore Location */}
          {onOpenLocationModal && (
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 transition-all"
            >
              <span>
                🌍 {language === 'hy' ? 'Ընտրել Վայր' : language === 'ru' ? 'Выбрать локацию' : 'Explore Location'}
              </span>
            </button>
          )}

          {/* How GPS Finds Me */}
          {onOpenHowGpsFindsMeModal && (
            <button
              onClick={onOpenHowGpsFindsMeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-all"
            >
              <span>
                📡 {language === 'hy' ? 'Ինչպես է GPS-ը Գտնում Ինձ' : language === 'ru' ? 'Как работает трилатерация' : 'How GPS Finds Me'}
              </span>
            </button>
          )}

          {/* Footprints Toggle */}
          <button
            onClick={() => setShowFootprints(!showFootprints)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showFootprints
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>
              {language === 'hy' ? 'Ծածկույթ' : language === 'ru' ? 'Покрытие' : 'Footprints'}
            </span>
          </button>

          {/* Multilateration Circles */}
          <button
            onClick={() => setShowMultilateration(!showMultilateration)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              showMultilateration
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>
              {language === 'hy' ? 'Շրջաններ' : language === 'ru' ? 'Окружности' : 'Circles'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
