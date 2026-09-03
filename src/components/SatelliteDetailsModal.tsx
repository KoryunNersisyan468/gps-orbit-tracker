import React from 'react';
import { X, Satellite, Compass, Activity, Eye, ShieldCheck, MapPin, Gauge } from 'lucide-react';
import { Language, SatelliteData } from '../types';
import { CONSTELLATION_INFO } from '../data/constellations';

interface SatelliteDetailsModalProps {
  satellite: SatelliteData | null;
  onClose: () => void;
  language: Language;
  elevationMask: number;
}

export const SatelliteDetailsModal: React.FC<SatelliteDetailsModalProps> = ({
  satellite,
  onClose,
  language,
  elevationMask,
}) => {
  if (!satellite) return null;

  const info = CONSTELLATION_INFO[satellite.constellation];
  const isAboveMask = (satellite.elevation || 0) >= elevationMask;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border"
              style={{
                backgroundColor: `${info.color}15`,
                borderColor: `${info.color}40`,
                color: info.color,
              }}
            >
              <Satellite className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {satellite.name}
                </h2>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    backgroundColor: `${info.color}20`,
                    borderColor: `${info.color}50`,
                    color: info.color,
                  }}
                >
                  {satellite.constellation}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                NORAD Catalog ID: {satellite.noradId} • {info.fullName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin">
          {/* Status banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isAboveMask
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="w-4 h-4" />
              <span>
                {isAboveMask
                  ? language === 'en'
                    ? 'In Line of Sight (Visible to Receiver)'
                    : language === 'ru'
                    ? 'В зоне прямой видимости приемника'
                    : 'Ընդունիչին տեսանելի (Ուղիղ տեսադաշտ)'
                  : language === 'en'
                  ? 'Below Elevation Mask / Horizon'
                  : language === 'ru'
                  ? 'Ниже маски угла возвышения / под горизонтом'
                  : 'Հորիզոնից ցածր'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold">
              El: {satellite.elevation?.toFixed(1) || 0}°
            </span>
          </div>

          {/* Real-time Position & Relative Telemetry Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hy'
                ? 'Իրական Ժամանակի Գեոդեզիական և Հարաբերական Տելեմետրիա'
                : language === 'ru'
                ? 'Геодезическая телеметрия реального времени'
                : 'Real-time Geodetic & Relative Telemetry'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ենթաարբանյակային լայնություն' : language === 'ru' ? 'Широта подспутниковой точки' : 'Sub-Point Latitude'}
                </span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {satellite.lat.toFixed(4)}°
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ենթաարբանյակային երկայնություն' : language === 'ru' ? 'Долгота подспутниковой точки' : 'Sub-Point Longitude'}
                </span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {satellite.lng.toFixed(4)}°
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Բարձրություն' : language === 'ru' ? 'Высота' : 'Altitude'}
                </span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {satellite.alt.toLocaleString(undefined, { maximumFractionDigits: 1 })} km
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ուղեծրային արագություն' : language === 'ru' ? 'Орбитальная скорость' : 'Orbital Velocity'}
                </span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {satellite.velocity.toFixed(2)} km/s
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ազիմուտ' : language === 'ru' ? 'Азимут' : 'Azimuth'}
                </span>
                <div className="text-sm font-bold font-mono text-white mt-0.5">
                  {satellite.azimuth?.toFixed(1) || 0}°
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Հեռավորություն մինչև ընդունիչ' : language === 'ru' ? 'Расстояние до приемника' : 'Range to Receiver'}
                </span>
                <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
                  {satellite.distanceKm?.toLocaleString(undefined, { maximumFractionDigits: 1 }) || '—'} km
                </div>
              </div>
            </div>
          </div>

          {/* Signal Propagation Telemetry */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hy'
                ? 'Ազդանշանի Տարածում և Պսևդոհեռավորություն'
                : language === 'ru'
                ? 'Распространение сигнала и псевдодальность'
                : 'Signal Propagation & Pseudorange'}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ազդանշանի թռիչքի տևողություն (Δt)' : language === 'ru' ? 'Время прохождения сигнала (Δt)' : 'Signal Travel Time (Δt)'}
                </span>
                <div className="text-base font-bold font-mono text-indigo-300 mt-0.5">
                  {satellite.delayMs ? `${satellite.delayMs.toFixed(3)} ms` : '—'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {language === 'hy' ? 'Լույսի արագություն c = 299,792.458 կմ/վ' : language === 'ru' ? 'Скорость света c = 299 792.458 км/с' : 'Speed of light c = 299,792.458 km/s'}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {language === 'hy' ? 'Ռադիոծածկույթի շառավիղ' : language === 'ru' ? 'Радиус радиопокрытия' : 'Radio Footprint Radius'}
                </span>
                <div className="text-base font-bold font-mono text-emerald-300 mt-0.5">
                  {satellite.footprintRadiusKm ? `${Math.round(satellite.footprintRadiusKm)} km` : '—'}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {language === 'hy' ? 'Երկրի մակերևույթի երկրաչափական ծածկույթի շրջան' : language === 'ru' ? 'Зона геометрического покрытия поверхности Земли' : 'Earth surface geometric coverage circle'}
                </div>
              </div>
            </div>
          </div>

          {/* Orbital Parameters */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hy'
                ? 'Կեպլերյան Ուղեծրային Տարրեր և Դարաշրջանի Աղբյուր'
                : language === 'ru'
                ? 'Кеплеровы элементы орбиты и источник эпохи'
                : 'Keplerian Orbital Elements & Epoch Source'}
            </h4>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">
                  {language === 'hy' ? 'Ուղեծրային հարթության թեքություն:' : language === 'ru' ? 'Наклонение орбиты:' : 'Nominal Orbital Plane Inclination:'}
                </span>
                <span className="font-mono text-slate-200">{info.inclinationDeg.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">
                  {language === 'hy' ? 'Պտտման պարբերություն:' : language === 'ru' ? 'Период обращения:' : 'Orbital Period:'}
                </span>
                <span className="font-mono text-slate-200">
                  {satellite.periodMinutes
                    ? `${satellite.periodMinutes.toFixed(1)} ${language === 'hy' ? 'րոպե' : language === 'ru' ? 'мин' : 'min'} (${(satellite.periodMinutes / 60).toFixed(2)} ${language === 'hy' ? 'ժամ' : language === 'ru' ? 'ч' : 'h'})`
                    : `${info.periodHours} ${language === 'hy' ? 'ժամ' : language === 'ru' ? 'часов' : 'hours'}`}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1.5">
                <span className="text-slate-400">
                  {language === 'hy' ? 'Ուղեծրային ռեժիմ:' : language === 'ru' ? 'Орбитальный режим:' : 'Orbital Regime:'}
                </span>
                <span className="font-mono text-slate-200">
                  {language === 'hy' ? 'Միջին Մերձերկրյա Ուղեծիր (MEO)' : language === 'ru' ? 'Средняя околоземная орбита (MEO)' : 'Medium Earth Orbit (MEO)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {language === 'hy' ? 'TLE Տվյալների աղբյուր:' : language === 'ru' ? 'Источник данных TLE:' : 'TLE Data Source:'}
                </span>
                <span className="font-mono text-slate-200">CelesTrak ({info.tleGroup}) / SGP4</span>
              </div>
            </div>
          </div>

          {/* Raw TLE Data */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {language === 'hy' ? 'Երկտողանի Ուղեծրային Տվյալների Ֆորմատ (TLE)' : language === 'ru' ? 'Двухстрочный набор элементов (TLE)' : 'Raw Two-Line Element (TLE) Format'}
            </h4>
            <pre className="p-3 bg-black/70 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto select-all">
              {satellite.line1}
              {'\n'}
              {satellite.line2}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
