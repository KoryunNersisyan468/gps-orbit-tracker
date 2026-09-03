import React, { useState, useMemo } from 'react';
import { Search, X, Satellite, MapPin, Globe, ArrowRight } from 'lucide-react';
import { Language, SatelliteData, UserLocation } from '../types';
import { CONSTELLATION_INFO } from '../data/constellations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  satellites: SatelliteData[];
  onSelectSatellite: (sat: SatelliteData) => void;
  onSelectLocation: (loc: UserLocation) => void;
  language: Language;
}

// Preset cities and major geographic points with exact coordinates
const CITY_DATABASE: { name: string; country: string; lat: number; lng: number }[] = [
  { name: 'Yerevan', country: 'Armenia', lat: 40.1792, lng: 44.4991 },
  { name: 'Gyumri', country: 'Armenia', lat: 40.7929, lng: 43.8465 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { name: 'Washington D.C.', country: 'United States', lat: 38.9072, lng: -77.0369 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Moscow', country: 'Russian Federation', lat: 55.7558, lng: 37.6173 },
  { name: 'Berlin', country: 'Germany', lat: 52.52, lng: 13.405 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  satellites,
  onSelectSatellite,
  onSelectLocation,
  language,
}) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { sats: [], locations: [], isCoordinate: null };

    // Check if query is coordinate string, e.g. "40.18, 44.51" or "40.18 44.51"
    const coordMatch = q.match(/^([-+]?\d{1,3}(?:\.\d+)?)[,\s]+([-+]?\d{1,3}(?:\.\d+)?)$/);
    let parsedCoord: { lat: number; lng: number } | null = null;
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        parsedCoord = { lat, lng };
      }
    }

    // Filter satellites
    const matchedSats = satellites
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.noradId.toString().includes(q) ||
          s.constellation.toLowerCase().includes(q)
      )
      .slice(0, 10);

    // Filter cities
    const matchedCities = CITY_DATABASE.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 8);

    return {
      sats: matchedSats,
      locations: matchedCities,
      isCoordinate: parsedCoord,
    };
  }, [query, satellites]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-950/80">
          <Search className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search satellite, NORAD ID, city, or "lat, lng"...'
                : language === 'ru'
                ? 'Поиск спутника, NORAD ID, города или "lat, lng"...'
                : 'Փնտրել արբանյակ, NORAD, քաղաք կամ "lat, lng"...'
            }
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          {/* Direct Coordinate Result */}
          {searchResults.isCoordinate && (
            <div>
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-1">
                Custom Coordinates
              </div>
              <button
                onClick={() => {
                  onSelectLocation({
                    lat: searchResults.isCoordinate!.lat,
                    lng: searchResults.isCoordinate!.lng,
                    alt: 100,
                    isReal: false,
                    name: `Coordinates (${searchResults.isCoordinate!.lat.toFixed(4)}, ${searchResults.isCoordinate!.lng.toFixed(4)})`,
                  });
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      Jump to Coordinates
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {searchResults.isCoordinate.lat.toFixed(4)}°, {searchResults.isCoordinate.lng.toFixed(4)}°
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-400" />
              </button>
            </div>
          )}

          {/* Satellites Results */}
          {searchResults.sats.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider px-2 py-1">
                Satellites ({searchResults.sats.length})
              </div>
              <div className="space-y-1">
                {searchResults.sats.map((sat) => {
                  const color = CONSTELLATION_INFO[sat.constellation]?.color || '#38bdf8';
                  return (
                    <button
                      key={sat.id}
                      onClick={() => {
                        onSelectSatellite(sat);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 group-hover:text-white">
                          <Satellite className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{sat.name}</span>
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                              style={{
                                color,
                                backgroundColor: `${color}20`,
                              }}
                            >
                              {sat.constellation}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            NORAD {sat.noradId} • Alt: {Math.round(sat.alt)} km
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cities / Locations */}
          {searchResults.locations.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-1">
                Locations & Cities
              </div>
              <div className="space-y-1">
                {searchResults.locations.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectLocation({
                        lat: city.lat,
                        lng: city.lng,
                        alt: 150,
                        isReal: false,
                        name: `${city.name}, ${city.country}`,
                      });
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-800 text-emerald-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {city.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {city.country} • {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results message */}
          {query.trim() &&
            searchResults.sats.length === 0 &&
            searchResults.locations.length === 0 &&
            !searchResults.isCoordinate && (
              <div className="py-8 text-center text-slate-400 text-sm">
                No matching satellites or cities found for "{query}".
                <div className="text-xs text-slate-500 mt-1">
                  Try typing "GPS", "Galileo", "Yerevan", "Paris", or coordinates like "40.18, 44.50".
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
