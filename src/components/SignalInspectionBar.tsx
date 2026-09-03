import React from 'react';
import {
  Radio,
  Play,
  Crosshair,
  X,
  Clock,
  Compass,
  Layers,
  ArrowUpRight,
  Eye,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { SatelliteData, UserLocation, Language } from '../types';
import { SPEED_OF_LIGHT_KM_S } from '../utils/coordinates';

interface SignalInspectionBarProps {
  satellite: SatelliteData | null;
  receiverLocation?: UserLocation;
  onClose: () => void;
  onAnimateSignal: (satellite: SatelliteData) => void;
  onShowPositioning: () => void;
  onFocusSatellite: (satellite: SatelliteData) => void;
  onFocusSignal?: (satellite: SatelliteData) => void;
  language?: Language;
}

export const SignalInspectionBar: React.FC<SignalInspectionBarProps> = ({
  satellite,
  receiverLocation,
  onClose,
  onAnimateSignal,
  onShowPositioning,
  onFocusSatellite,
  onFocusSignal,
  language = 'hy',
}) => {
  if (!satellite) return null;

  const distanceKm = satellite.distanceKm || 20200;
  const transitTimeMs = (distanceKm / SPEED_OF_LIGHT_KM_S) * 1000;
  const isVisible = satellite.isVisible ?? ((satellite.elevation ?? 0) > 0);

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 w-[95%] max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-4 shadow-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
      <div className="flex flex-col gap-3">
        {/* Top title and status */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              isVisible ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'hy'
                    ? 'Ազդանշանի Ինսպեկտոր'
                    : language === 'ru'
                    ? 'Инспектор сигнала'
                    : 'Satellite Signal Inspector'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  isVisible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isVisible
                    ? language === 'hy' ? '● ՏԵՍԱՆԵԼԻ' : language === 'ru' ? '● ВИДИМЫЙ' : '● VISIBLE'
                    : language === 'hy' ? '○ ՀՈՐԻԶՈՆԻՑ ՑԱԾ' : language === 'ru' ? '○ ЗА ГОРИЗОНТОМ' : '○ BELOW HORIZON'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>{satellite.name}</span>
                <span className="text-[11px] font-mono text-sky-400">({satellite.constellation})</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
          <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Բարձրություն' : language === 'ru' ? 'Высота' : 'Altitude'}
            </span>
            <span className="text-white font-bold">{satellite.alt.toFixed(0)} km</span>
          </div>

          <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Հեռավորություն' : language === 'ru' ? 'Дальность' : 'Slant Range'}
            </span>
            <span className="text-sky-400 font-bold">{distanceKm.toFixed(0)} km</span>
          </div>

          <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Բարձր. (El)' : language === 'ru' ? 'Угол места (El)' : 'Elevation'}
            </span>
            <span className={`font-bold ${(satellite.elevation ?? 0) > 10 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {(satellite.elevation ?? 0).toFixed(1)}°
            </span>
          </div>

          <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Ազիմուտ (Az)' : language === 'ru' ? 'Азимут (Az)' : 'Azimuth'}
            </span>
            <span className="text-slate-200 font-bold">{(satellite.azimuth ?? 0).toFixed(0)}°</span>
          </div>

          <div className="p-2 bg-slate-950/70 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Տարածման Ժամանակ' : language === 'ru' ? 'Время полета' : 'Travel Time'}
            </span>
            <span className="text-amber-400 font-bold">≈ {transitTimeMs.toFixed(2)} ms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <button
              id="btn-animate-signal"
              onClick={() => onAnimateSignal(satellite)}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md shadow-sky-600/20 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {language === 'hy'
                  ? 'Անիմացնել Ազդանշանը'
                  : language === 'ru'
                  ? 'Анимировать сигнал'
                  : 'Animate Signal'}
              </span>
            </button>

            <button
              id="btn-show-positioning"
              onClick={onShowPositioning}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>
                {language === 'hy'
                  ? 'Տրիլատերացիա'
                  : language === 'ru'
                  ? 'Трилатерация'
                  : 'Show Positioning'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-focus-satellite"
              onClick={() => onFocusSatellite(satellite)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Crosshair className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {language === 'hy'
                  ? 'Կենտրոնանալ Արբանյակի Վրա'
                  : language === 'ru'
                  ? 'Сфокусировать спутник'
                  : 'Focus Satellite'}
              </span>
            </button>

            {onFocusSignal && (
              <button
                id="btn-focus-signal"
                onClick={() => onFocusSignal(satellite)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {language === 'hy'
                    ? 'Դիտել Ազդանշանը'
                    : language === 'ru'
                    ? 'Сфокусировать луч'
                    : 'Focus on Signal'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
