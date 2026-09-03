import React, { useMemo, useState, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { ConstellationType, Language, SatelliteData, UserLocation } from '../types';
import { CONSTELLATION_INFO } from '../data/constellations';

interface SkyViewProps {
  satellites: SatelliteData[];
  userLocation: UserLocation;
  elevationMask: number;
  onElevationMaskChange: (mask: number) => void;
  onSelectSatellite: (sat: SatelliteData) => void;
  selectedSatelliteId?: string;
  language: Language;
}

export const SkyView: React.FC<SkyViewProps> = React.memo(({
  satellites,
  elevationMask,
  onElevationMaskChange,
  onSelectSatellite,
  selectedSatelliteId,
  language,
}) => {
  const [hoveredSatId, setHoveredSatId] = useState<string | null>(null);

  // Polar plot dimensions
  const size = 360;
  const center = size / 2;
  const radius = size / 2 - 28; // Outer horizon circle radius

  // Convert azimuth (0-360 deg) and elevation (0-90 deg) to SVG (x, y) coordinates
  const polarToSvg = useCallback(
    (azimuthDeg: number, elevationDeg: number) => {
      const el = Math.max(0, Math.min(90, elevationDeg));
      const r = radius * (1 - el / 90);
      const azRad = ((azimuthDeg - 90) * Math.PI) / 180;
      const x = center + r * Math.cos(azRad);
      const y = center + r * Math.sin(azRad);
      return { x, y };
    },
    [center, radius]
  );

  // Mask radius
  const maskRadius = useMemo(() => radius * (1 - elevationMask / 90), [radius, elevationMask]);

  // Satellites with elevation > -5 (display visible and near-horizon)
  const { plotSatellites, visibleCount } = useMemo(() => {
    const list: Array<{
      sat: SatelliteData;
      x: number;
      y: number;
      isMasked: boolean;
      color: string;
    }> = [];
    let visible = 0;

    for (let i = 0; i < satellites.length; i++) {
      const s = satellites[i];
      if (s.elevation !== undefined && s.azimuth !== undefined && s.elevation >= -5) {
        if (s.elevation >= elevationMask) visible++;
        const { x, y } = polarToSvg(s.azimuth, s.elevation);
        list.push({
          sat: s,
          x,
          y,
          isMasked: s.elevation < elevationMask,
          color: CONSTELLATION_INFO[s.constellation]?.color || '#38bdf8',
        });
      }
    }
    return { plotSatellites: list, visibleCount: visible };
  }, [satellites, elevationMask, polarToSvg]);

  const activeHoveredSat = useMemo(() => {
    if (!hoveredSatId) return null;
    return satellites.find((s) => s.id === hoveredSatId) || null;
  }, [satellites, hoveredSatId]);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-5 bg-slate-900/95 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl select-none">
      {/* SkyView Header Controls */}
      <div className="w-full flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {language === 'hy'
                ? 'Երկնքի Պոլյար Դիագրամ'
                : language === 'ru'
                ? 'Полярная проекция небосвода'
                : 'Polar Sky View (Local Horizon)'}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              {visibleCount}{' '}
              {language === 'hy'
                ? `արբանյակ ${elevationMask}° շեմից բարձր`
                : language === 'ru'
                ? `спутников выше маски ${elevationMask}°`
                : `satellites above ${elevationMask}° mask`}
            </p>
          </div>
        </div>

        {/* Elevation Mask Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
          <span className="px-1.5 text-slate-400 font-medium">
            {language === 'hy' ? 'Շեմ:' : language === 'ru' ? 'Маска:' : 'Mask:'}
          </span>
          {[5, 10, 15, 20].map((mask) => (
            <button
              key={mask}
              onClick={() => onElevationMaskChange(mask)}
              className={`px-2 py-0.5 rounded-lg font-bold transition-colors ${
                elevationMask === mask
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mask}°
            </button>
          ))}
        </div>
      </div>

      {/* SVG Polar Skyplot */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <radialGradient id="skyGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
          </defs>

          {/* Background disc */}
          <circle cx={center} cy={center} r={radius} fill="url(#skyGradient)" />

          {/* Elevation concentric circles: 0 (horizon), 30, 60, 90 (center) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <circle
            cx={center}
            cy={center}
            r={radius * (2 / 3)} // 30 deg elevation
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle
            cx={center}
            cy={center}
            r={radius * (1 / 3)} // 60 deg elevation
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Elevation Mask Ring (cutoff boundary) */}
          <circle
            cx={center}
            cy={center}
            r={maskRadius}
            fill="none"
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.8"
          />

          {/* Azimuth radial crosshair lines */}
          <line
            x1={center}
            y1={center - radius}
            x2={center}
            y2={center + radius}
            stroke="#1e293b"
            strokeWidth="1"
          />
          <line
            x1={center - radius}
            y1={center}
            x2={center + radius}
            y2={center}
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Diagonal axes */}
          <line
            x1={center - radius * 0.707}
            y1={center - radius * 0.707}
            x2={center + radius * 0.707}
            y2={center + radius * 0.707}
            stroke="#1e293b"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <line
            x1={center - radius * 0.707}
            y1={center + radius * 0.707}
            x2={center + radius * 0.707}
            y2={center - radius * 0.707}
            stroke="#1e293b"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Cardinal direction labels */}
          <text
            x={center}
            y={center - radius - 8}
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="11"
            fontWeight="bold"
          >
            {language === 'hy' ? 'Հս (0°)' : language === 'ru' ? 'С (0°)' : 'N (0°)'}
          </text>
          <text
            x={center + radius + 10}
            y={center + 4}
            textAnchor="start"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
          >
            {language === 'hy' ? 'Արև (90°)' : language === 'ru' ? 'В (90°)' : 'E (90°)'}
          </text>
          <text
            x={center}
            y={center + radius + 15}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
          >
            {language === 'hy' ? 'Հվ (180°)' : language === 'ru' ? 'Ю (180°)' : 'S (180°)'}
          </text>
          <text
            x={center - radius - 10}
            y={center + 4}
            textAnchor="end"
            fill="#94a3b8"
            fontSize="11"
            fontWeight="bold"
          >
            {language === 'hy' ? 'Արմ (270°)' : language === 'ru' ? 'З (270°)' : 'W (270°)'}
          </text>

          {/* Elevation labels */}
          <text
            x={center + 4}
            y={center - radius * (2 / 3) + 12}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            30°
          </text>
          <text
            x={center + 4}
            y={center - radius * (1 / 3) + 12}
            fill="#64748b"
            fontSize="9"
            fontFamily="monospace"
          >
            60°
          </text>
          <text
            x={center + 4}
            y={center - maskRadius - 4}
            fill="#f43f5e"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {language === 'hy' ? `Շեմ ${elevationMask}°` : language === 'ru' ? `Маска ${elevationMask}°` : `Mask ${elevationMask}°`}
          </text>

          {/* Center Zenith marker */}
          <circle cx={center} cy={center} r="3" fill="#38bdf8" />
          <text x={center} y={center + 14} textAnchor="middle" fill="#64748b" fontSize="8">
            {language === 'hy' ? 'Զենիթ (90°)' : language === 'ru' ? 'Зенит (90°)' : 'Zenith (90°)'}
          </text>

          {/* Satellites */}
          {plotSatellites.map(({ sat, x, y, isMasked, color }) => {
            const isSelected = selectedSatelliteId === sat.id;
            const isHovered = hoveredSatId === sat.id;
            const r = isSelected ? 7 : isHovered ? 6.5 : isMasked ? 3.5 : 5;

            return (
              <g
                key={sat.id}
                className="cursor-pointer transition-transform duration-100"
                onClick={() => onSelectSatellite(sat)}
                onMouseEnter={() => setHoveredSatId(sat.id)}
                onMouseLeave={() => setHoveredSatId((prev) => (prev === sat.id ? null : prev))}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Hover ring */}
                {isHovered && !isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                )}

                {/* Satellite symbol */}
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={isMasked ? '#475569' : color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  opacity={isMasked ? 0.5 : 1}
                />

                {/* Satellite PRN / Name label */}
                <text
                  x={x}
                  y={y - (isHovered || isSelected ? 10 : 8)}
                  textAnchor="middle"
                  fill={isMasked ? '#64748b' : isSelected || isHovered ? '#ffffff' : color}
                  fontSize={isSelected || isHovered ? '10' : '8'}
                  fontWeight={isSelected || isHovered ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {sat.name.split(' ')[1] || sat.name.substring(0, 7)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {activeHoveredSat && (
          <div className="absolute bottom-2 left-2 z-10 p-2 bg-slate-950/90 border border-slate-700 rounded-xl text-xs font-mono shadow-xl pointer-events-none">
            <div className="font-bold text-sky-400">{activeHoveredSat.name}</div>
            <div className="text-slate-300 text-[10px]">
              {language === 'hy' ? 'Բարձր՝' : language === 'ru' ? 'Высота:' : 'El:'}{' '}
              {activeHoveredSat.elevation?.toFixed(1)}° |{' '}
              {language === 'hy' ? 'Ազիմուտ՝' : language === 'ru' ? 'Азимут:' : 'Az:'}{' '}
              {activeHoveredSat.azimuth?.toFixed(1)}°
            </div>
            <div className="text-emerald-400 text-[10px]">
              {language === 'hy' ? 'Հեռավ՝' : language === 'ru' ? 'Дальность:' : 'Dist:'}{' '}
              {activeHoveredSat.distanceKm?.toFixed(0)}{' '}
              {language === 'hy' ? 'կմ' : language === 'ru' ? 'км' : 'km'}
            </div>
          </div>
        )}
      </div>

      {/* Constellation Legend */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
        {(Object.keys(CONSTELLATION_INFO) as ConstellationType[]).map((type) => {
          const info = CONSTELLATION_INFO[type];
          return (
            <div key={type} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: info.color }} />
              <span className="text-slate-300 font-medium">{type}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1 ml-1">
          <span className="w-2.5 h-0.5 border-t border-dashed border-rose-500" />
          <span className="text-rose-400">
            {language === 'hy' ? 'Շեմի գիծ' : language === 'ru' ? 'Линия маски' : 'Cutoff Mask'}
          </span>
        </div>
      </div>
    </div>
  );
});

SkyView.displayName = 'SkyView';
