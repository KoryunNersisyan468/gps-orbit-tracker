import React, { useState, useEffect } from 'react';
import {
  MapPin,
  X,
  Compass,
  Navigation,
  Search,
  Globe2,
  CheckCircle,
  Sliders,
  Sparkles,
  ArrowRight,
  Crosshair,
} from 'lucide-react';
import { UserLocation, Language } from '../types';
import { COUNTRIES_AND_CITIES, searchNominatimLocation, GeographicLocation } from '../data/countries';

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation?: UserLocation;
  onSelectLocation: (loc: UserLocation, zoom?: number) => void;
  onRequestBrowserGps?: () => void;
  isGeoLoading?: boolean;
  elevationMask?: number;
  onElevationMaskChange?: (mask: number) => void;
  language?: Language;
}

export const LocationSelectModal: React.FC<LocationSelectModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onRequestBrowserGps,
  isGeoLoading = false,
  elevationMask = 10,
  onElevationMaskChange,
  language = 'en',
}) => {
  const safeLocation: UserLocation = currentLocation || {
    lat: 38.8951,
    lng: -77.0364,
    alt: 25,
    accuracy: 10,
    isReal: false,
    name: 'Default Location',
  };

  const [activeTab, setActiveTab] = useState<'search' | 'manual' | 'presets'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [manualLat, setManualLat] = useState((safeLocation.lat ?? 38.8951).toString());
  const [manualLng, setManualLng] = useState((safeLocation.lng ?? -77.0364).toString());
  const [manualAlt, setManualAlt] = useState(((safeLocation.alt || 50)).toString());
  const [nominatimResults, setNominatimResults] = useState<GeographicLocation[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);

  // Sync manual inputs when current location changes
  useEffect(() => {
    if (currentLocation && typeof currentLocation.lat === 'number') {
      setManualLat(currentLocation.lat.toFixed(4));
      setManualLng(currentLocation.lng.toFixed(4));
      setManualAlt((currentLocation.alt || 50).toString());
    }
  }, [currentLocation]);

  // Search filtered presets
  const filteredPresets = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return COUNTRIES_AND_CITIES.slice(0, 16);
    return COUNTRIES_AND_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Online Nominatim debounce
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setNominatimResults([]);
      setIsSearchingOnline(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      const results = await searchNominatimLocation(q);
      setNominatimResults(results);
      setIsSearchingOnline(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleApplyManual = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    const alt = parseFloat(manualAlt) || 50;

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onSelectLocation({
        lat,
        lng,
        alt,
        isReal: false,
        name: `Custom Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`,
        accuracy: 10,
      }, 10);
      onClose();
    }
  };

  const handlePickLocation = (loc: GeographicLocation) => {
    onSelectLocation({
      lat: loc.lat,
      lng: loc.lng,
      alt: loc.alt || 50,
      isReal: false,
      name: `${loc.name}, ${loc.country}`,
      accuracy: 10,
    }, loc.zoom || 8);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {language === 'en'
                  ? 'Select Receiver Location'
                  : language === 'ru'
                  ? 'Выбор местоположения приемника'
                  : 'Ընտրել ընդունիչի դիրքը'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'en'
                  ? 'Set ground station to calculate visible satellites, elevation, and signal arrival times'
                  : language === 'ru'
                  ? 'Задайте наземную позицию для расчета видимости спутников и углов возвышения'
                  : 'Սահմանեք ընդունիչի դիրքը՝ տեսանելի արբանյակները և ազդանշանները հաշվարկելու համար'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-location-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Receiver Summary & Browser GPS Button */}
        <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${safeLocation.isReal ? 'bg-emerald-400 animate-pulse' : 'bg-sky-400'}`} />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{safeLocation.name || 'Current Simulated Receiver'}</span>
                {safeLocation.isReal && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                    REAL GPS
                  </span>
                )}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                {(safeLocation.lat ?? 0).toFixed(4)}° N, {(safeLocation.lng ?? 0).toFixed(4)}° E • Alt: {(safeLocation.alt || 0).toFixed(0)} m
              </div>
            </div>
          </div>

          <button
            id="btn-acquire-browser-gps"
            onClick={() => {
              onRequestBrowserGps?.();
              onClose();
            }}
            disabled={isGeoLoading}
            className="px-3.5 py-2 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Navigation className={`w-3.5 h-3.5 ${isGeoLoading ? 'animate-spin' : ''}`} />
            <span>
              {language === 'en'
                ? 'Use My Real GPS'
                : language === 'ru'
                ? 'Мой реальный GPS'
                : 'Իմ իրական GPS-ը'}
            </span>
          </button>
        </div>

        {/* Elevation Mask Bar */}
        <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="font-medium">
              {language === 'en'
                ? 'Elevation Mask Angle:'
                : language === 'ru'
                ? 'Маска угла возвышения:'
                : 'Բարձրության անկյան շեմ:'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[5, 10, 15, 20].map((mask) => (
              <button
                key={mask}
                onClick={() => onElevationMaskChange(mask)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  elevationMask === mask
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mask}°
              </button>
            ))}
          </div>
        </div>

        {/* Tabs: Search vs Manual Coordinates vs Quick Presets */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-2.5 px-4 flex items-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'search'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>
              {language === 'en' ? 'Search Countries & Cities' : language === 'ru' ? 'Поиск стран и городов' : 'Երկրների և քաղաքների որոնում'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`pb-2.5 px-4 flex items-center gap-1.5 transition-all border-b-2 ${
              activeTab === 'manual'
                ? 'border-sky-400 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>
              {language === 'en' ? 'Enter Lat / Lng' : language === 'ru' ? 'Ввод координат' : 'Կոորդինատների մուտքագրում'}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'search' && (
            <div className="flex flex-col gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search country or city (e.g., Azerbaijan, Armenia, Georgia, France, Japan, USA)...'
                      : language === 'ru'
                      ? 'Поиск страны или города (например, Азербайджан, Армения, Франция, Япония)...'
                      : 'Փնտրել երկիր կամ քաղաք (օր.՝ Հայաստան, Ադրբեջան, Վրաստան, Ֆրանսիա, Ճապոնիա)...'
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Quick Highlight Buttons */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400 mr-1">
                  {language === 'en' ? 'Featured:' : language === 'ru' ? 'Быстрый выбор:' : 'Արագ ընտրություն:'}
                </span>
                {['Armenia', 'Georgia', 'France', 'Japan', 'United States'].map((countryName) => {
                  const item = COUNTRIES_AND_CITIES.find((c) => c.name === countryName || c.country === countryName);
                  if (!item) return null;
                  const displayName = language === 'hy' ? (item.nameHy || item.name) : language === 'ru' ? (item.nameRu || item.name) : item.name;
                  return (
                    <button
                      key={countryName}
                      onClick={() => handlePickLocation(item)}
                      className="px-2.5 py-1 bg-slate-800/80 hover:bg-sky-600/30 hover:border-sky-500/50 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-200 transition-all flex items-center gap-1"
                    >
                      <Globe2 className="w-3 h-3 text-sky-400" />
                      <span>{displayName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Presets List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {filteredPresets.map((item, idx) => {
                  const displayName = language === 'hy' ? (item.nameHy || item.name) : language === 'ru' ? (item.nameRu || item.name) : item.name;
                  const displayCountry = language === 'hy' ? (item.countryHy || item.country) : language === 'ru' ? (item.countryRu || item.country) : item.country;
                  return (
                    <button
                      key={`${item.name}-${idx}`}
                      onClick={() => handlePickLocation(item)}
                      className="p-3 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sky-400" />
                          <span>{displayName}</span>
                          {item.type === 'country' && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                              {language === 'hy' ? 'Երկիր' : 'Country'}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {displayCountry} • {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>

              {/* Online Nominatim Search Results */}
              {isSearchingOnline && (
                <div className="p-3 text-center text-xs text-sky-400 animate-pulse">
                  Searching global OpenStreetMap gazetteer...
                </div>
              )}

              {nominatimResults.length > 0 && (
                <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Global Search Results (OpenStreetMap)
                  </span>
                  {nominatimResults.map((item, idx) => (
                    <button
                      key={`nom-${idx}`}
                      onClick={() => handlePickLocation(item)}
                      className="p-2.5 bg-slate-950 border border-slate-800 hover:border-sky-400/50 rounded-xl text-left transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.country} • {item.lat.toFixed(4)}°, {item.lng.toFixed(4)}°
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="flex flex-col gap-4 p-2">
              <p className="text-xs text-slate-300">
                {language === 'en'
                  ? 'Enter exact geographic coordinates in decimal degrees (-90 to +90 for Latitude, -180 to +180 for Longitude).'
                  : language === 'ru'
                  ? 'Введите точные географические координаты в градусах (Широта: -90..+90, Долгота: -180..+180).'
                  : 'Մուտքագրեք ճշգրիտ աշխարհագրական կոորդինատներ (-90-ից +90 լայնություն, -180-ից +180 երկայնություն):'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Latitude (-90° to +90°)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-90"
                    max="90"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    className="p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                    placeholder="40.4093"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Longitude (-180° to +180°)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-180"
                    max="180"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    className="p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                    placeholder="49.8671"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-400">
                    Altitude (meters)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={manualAlt}
                    onChange={(e) => setManualAlt(e.target.value)}
                    className="p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-sky-400"
                    placeholder="50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyManual}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Set Receiver to Coordinates</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
