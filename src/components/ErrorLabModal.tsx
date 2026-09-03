import React, { useState } from 'react';
import { X, Sliders, Activity, Info, Sun, CloudRain, Building2, Cpu, RotateCcw } from 'lucide-react';
import { Language } from '../types';

interface ErrorLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  hdop: number;
}

export const ErrorLabModal: React.FC<ErrorLabModalProps> = ({
  isOpen,
  onClose,
  language,
  hdop,
}) => {
  // Error parameters in meters
  const [satClockError, setSatClockError] = useState<number>(1.5);
  const [orbitError, setOrbitError] = useState<number>(1.0);
  const [ionoError, setIonoError] = useState<number>(5.0);
  const [tropoError, setTropoError] = useState<number>(2.0);
  const [multipathError, setMultipathError] = useState<number>(1.5);
  const [receiverClockError, setReceiverClockError] = useState<number>(1.5);

  // Environmental presets
  const applyPreset = (preset: 'open_sky' | 'urban_canyon' | 'solar_storm') => {
    if (preset === 'open_sky') {
      setSatClockError(1.0);
      setOrbitError(0.8);
      setIonoError(3.0);
      setTropoError(1.5);
      setMultipathError(0.5);
      setReceiverClockError(1.0);
    } else if (preset === 'urban_canyon') {
      setSatClockError(1.5);
      setOrbitError(1.2);
      setIonoError(6.0);
      setTropoError(2.5);
      setMultipathError(12.0);
      setReceiverClockError(2.0);
    } else if (preset === 'solar_storm') {
      setSatClockError(2.5);
      setOrbitError(1.8);
      setIonoError(22.0);
      setTropoError(3.0);
      setMultipathError(3.0);
      setReceiverClockError(2.0);
    }
  };

  const handleReset = () => {
    applyPreset('open_sky');
  };

  // User Equivalent Range Error (UERE) = root-sum-square
  const uere = Math.sqrt(
    satClockError ** 2 +
    orbitError ** 2 +
    ionoError ** 2 +
    tropoError ** 2 +
    multipathError ** 2 +
    receiverClockError ** 2
  );

  // Total Position Error = HDOP * UERE
  const estimatedHorizontalError = uere * Math.max(1.0, hdop);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-200 flex flex-col gap-5 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                {language === 'en' && 'GPS Error Sources Laboratory'}
                {language === 'ru' && 'Лаборатория источников ошибок GPS'}
                {language === 'hy' && 'GPS Սխալների Աղբյուրների Լաբորատորիա'}
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                {language === 'hy'
                  ? 'Մթնոլորտային և սարքավորումային սխալների բյուջեի սիմուլյացիա'
                  : language === 'ru'
                  ? 'Симуляция бюджета атмосферных и аппаратных погрешностей'
                  : 'Atmospheric & Hardware Error Budget Simulation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Environment Presets */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {language === 'hy' ? 'Սցենարներ՝' : language === 'ru' ? 'Сценарии:' : 'Scenarios:'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset('open_sky')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              <Sun className="w-3.5 h-3.5" />
              {language === 'hy' ? 'Բաց Երկինք (Իդեալական)' : language === 'ru' ? 'Открытое небо (Идеал)' : 'Open Sky (Ideal)'}
            </button>
            <button
              onClick={() => applyPreset('urban_canyon')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-400 flex items-center gap-1.5 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              {language === 'hy' ? 'Քաղաքային Կիրճ' : language === 'ru' ? 'Городской каньон' : 'Urban Canyon'}
            </button>
            <button
              onClick={() => applyPreset('solar_storm')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 flex items-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              {language === 'hy' ? 'Արեգակնային Փոթորիկ' : language === 'ru' ? 'Солнечная буря' : 'Solar Storm'}
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset parameters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calculated Error Budget Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">
                {language === 'hy'
                  ? 'Օգտատիրոջ համարժեք հեռավորության սխալ (UERE)'
                  : language === 'ru'
                  ? 'Эквивалентная погрешность дальности (UERE)'
                  : 'User Equivalent Range Error (UERE)'}
              </span>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                ±{uere.toFixed(2)} m
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              UERE = √(Clock² + Orbit² + Iono² + Tropo² + Multi² + Rx²)
            </p>
          </div>

          <div className="p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <span className="text-xs text-indigo-300 font-medium">
                {language === 'hy'
                  ? 'Հաշվարկված Հորիզոնական Դիրքի Անորոշություն'
                  : language === 'ru'
                  ? 'Расчетная горизонтальная погрешность фиксации'
                  : 'Calculated Horizontal Fix Uncertainty'}
              </span>
              <div className="text-2xl font-black font-mono text-indigo-200 mt-1">
                ±{estimatedHorizontalError.toFixed(2)} m
              </div>
            </div>
            <p className="text-[11px] text-indigo-400/80 mt-2 font-mono">
              {language === 'hy'
                ? `Դիրքի սխալ = HDOP (${hdop.toFixed(2)}) × UERE (±${uere.toFixed(2)} մ)`
                : language === 'ru'
                ? `Погрешность = HDOP (${hdop.toFixed(2)}) × UERE (±${uere.toFixed(2)} м)`
                : `Position Error = HDOP (${hdop.toFixed(2)}) × UERE (±${uere.toFixed(2)}m)`}
            </p>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4 pt-1">
          {/* Ionospheric Delay */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                {language === 'hy'
                  ? 'Իոնոսֆերային Բեկման Ուշացում (պլազմայում RF ազդանշանի դիսպերսիա)'
                  : language === 'ru'
                  ? 'Ионосферная задержка (дисперсия радиоволн в плазме)'
                  : 'Ionospheric Refraction Delay (dispersion of RF signal in plasma)'}
              </span>
              <span className="font-mono font-bold text-amber-400">{ionoError.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={ionoError}
              onChange={(e) => setIonoError(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {language === 'hy'
                ? 'Մեղմացում՝ Երկհաճախականային ընդունումը (L1/L5, E1/E5a) փուլային տարբերության միջոցով չեզոքացնում է իոնոսֆերային սխալի 99%-ը:'
                : language === 'ru'
                ? 'Компенсация: Двухчастотный прием (L1/L5, E1/E5a) устраняет до 99% ионосферной задержки.'
                : 'Mitigation: Dual-frequency reception (L1/L5, E1/E5a) measures phase difference to cancel 99% of ionospheric delay.'}
            </div>
          </div>

          {/* Multipath Reflections */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-400" />
                {language === 'hy'
                  ? 'Բազմաճառագայթ Անդրադարձի Սխալ (ապակուց և բետոնից անդրադարձ)'
                  : language === 'ru'
                  ? 'Многолучевое распространение (отражение от зданий и земли)'
                  : 'Multipath Reflection Error (bouncing off glass & concrete)'}
              </span>
              <span className="font-mono font-bold text-sky-400">{multipathError.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={multipathError}
              onChange={(e) => setMultipathError(parseFloat(e.target.value))}
              className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {language === 'hy'
                ? 'Մեղմացում՝ Խեղդող օղակներով (Choke-ring) ալեհավաքներ, նեղ կորելյատորներ (DLL) և 3D կառուցվածքային մոդելավորում:'
                : language === 'ru'
                ? 'Компенсация: Антенны с дроссельными кольцами (Choke-ring), узкие корреляторы DLL и 3D-моделирование.'
                : 'Mitigation: Choke-ring antennas, narrow correlator delay lock loops (DLL), and 3D building modeling.'}
            </div>
          </div>

          {/* Tropospheric Delay */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                {language === 'hy'
                  ? 'Տրոպոսֆերային Ուշացում (ջրային գոլորշի և մթնոլորտային ճնշում)'
                  : language === 'ru'
                  ? 'Тропосферная задержка (водяной пар и атмосферное давление)'
                  : 'Tropospheric Delay (water vapor & atmospheric pressure)'}
              </span>
              <span className="font-mono font-bold text-cyan-400">{tropoError.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.2"
              value={tropoError}
              onChange={(e) => setTropoError(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {language === 'hy'
                ? 'Մեղմացում՝ Սաաստամոինենի և Հոպֆիլդի տրոպոսֆերային մոդելներ՝ ըստ բարձրության և բարոմետրիկ ճնշման:'
                : language === 'ru'
                ? 'Компенсация: Модели Саастамойнена и Хопфилда на основе высоты приемника и давления.'
                : 'Mitigation: Saastamoinen and Hopfield tropospheric models based on receiver altitude and barometric data.'}
            </div>
          </div>

          {/* Satellite Clock Drift */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                {language === 'hy'
                  ? 'Արբանյակի Ատոմային Ժամացույցի Մնացորդային Շեղում'
                  : language === 'ru'
                  ? 'Остаточный уход атомных часов спутника'
                  : 'Satellite Atomic Clock Residual Drift'}
              </span>
              <span className="font-mono font-bold text-emerald-400">{satClockError.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.2"
              value={satClockError}
              onChange={(e) => setSatClockError(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {language === 'hy'
                ? 'Հեռարձակվող էֆեմերիդների a₀, a₁, a₂ պարամետրերը մոդելավորում են շեղումները՝ թողնելով ~1-2 մ մնացորդային սխալ:'
                : language === 'ru'
                ? 'Параметры эфемерид a₀, a₁, a₂ корректируют уход часов, оставляя ~1-2 м остаточной погрешности.'
                : 'Broadcast ephemeris parameters a₀, a₁, a₂ model atomic clock deviations, leaving ~1-2m residual error.'}
            </div>
          </div>

          {/* Ephemeris Orbit Uncertainty */}
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" />
                {language === 'hy'
                  ? 'Էֆեմերիդների և Ուղեծրի Կանխատեսման Սխալ'
                  : language === 'ru'
                  ? 'Погрешность орбитальных эфемерид'
                  : 'Ephemeris / Orbital Prediction Error'}
              </span>
              <span className="font-mono font-bold text-purple-400">{orbitError.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.2"
              value={orbitError}
              onChange={(e) => setOrbitError(parseFloat(e.target.value))}
              className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[11px] text-slate-500">
              {language === 'hy'
                ? 'Մեղմացում՝ Իրական ժամանակի SBAS (WAAS/EGNOS) ցանցերը հաղորդում են ուղեծրի ճշգրտման վեկտորներ:'
                : language === 'ru'
                ? 'Компенсация: Системы SBAS (WAAS/EGNOS) передают дифференциальные поправки орбит.'
                : 'Mitigation: Real-time SBAS (WAAS/EGNOS) correction networks transmit precise orbit vectors.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
