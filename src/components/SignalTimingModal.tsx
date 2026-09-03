import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Navigation,
  Eye,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { SatelliteData, UserLocation, Language } from '../types';
import { SPEED_OF_LIGHT_KM_S } from '../utils/coordinates';

interface SignalTimingModalProps {
  isOpen: boolean;
  onClose: () => void;
  satellite: SatelliteData | null;
  receiverLocation?: UserLocation;
  onFollowSignal?: (satellite: SatelliteData) => void;
  onShowPositioningProcess?: () => void;
  language?: Language;
  isSpoofed?: boolean;
}

export const SignalTimingModal: React.FC<SignalTimingModalProps> = ({
  isOpen,
  onClose,
  satellite,
  receiverLocation,
  onFollowSignal,
  onShowPositioningProcess,
  language = 'en',
  isSpoofed = false,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0); // 0 to 100% within current cycle
  const animationFrameRef = useRef<number | null>(null);

  const safeReceiver: UserLocation = receiverLocation || {
    lat: 38.8951,
    lng: -77.0364,
    alt: 25,
    accuracy: 10,
    isReal: false,
    name: 'Ground Station',
  };

  // Dynamic calculations
  const distanceKm = satellite?.distanceKm || 20200;
  const transitTimeMs = (distanceKm / SPEED_OF_LIGHT_KM_S) * 1000;
  const transitTimeSec = transitTimeMs / 1000;

  // Step advancement timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const baseStepDuration = 2200 / speed; // ms per step
    const interval = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 5) return 1;
        return prev + 1;
      });
    }, baseStepDuration);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, speed]);

  // Smooth particle progress calculation
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    let startTime = performance.now();
    const cycleDuration = 3500 / speed;

    const tick = (now: number) => {
      const elapsed = (now - startTime) % cycleDuration;
      setProgress((elapsed / cycleDuration) * 100);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isOpen, isPlaying, speed]);

  if (!isOpen || !satellite) return null;

  const STEPS = [
    {
      num: 1,
      title: language === 'en'
        ? 'Step 1: Satellite Transmits Navigation Signal'
        : language === 'ru'
        ? 'Шаг 1: Спутник передает навигационный сигнал'
        : 'Քայլ 1. Արբանյակը հաղորդում է նավիգացիոն ազդանշան',
      desc: language === 'en'
        ? `The atomic clock aboard ${satellite.name} timestamps the exact transmission instant (t_tx) and broadcasts ephemeris orbital parameters on L1 frequency (1575.42 MHz).`
        : language === 'ru'
        ? `Атомные часы на борту ${satellite.name} фиксируют точный момент передачи (t_tx) и передают эфемериды на частоте L1 (1575.42 МГц).`
        : `Ատոմային ժամացույցը ֆիքսում է հաղորդման ճշգրիտ պահը (t_tx) և հաղորդում ուղեծրային տվյալներ (էֆեմերիդներ) L1 հաճախականությամբ:`,
      icon: <Radio className="w-4 h-4 text-sky-400" />,
      color: 'border-sky-500 bg-sky-500/10 text-sky-300',
    },
    {
      num: 2,
      title: language === 'en'
        ? 'Step 2: Signal Propagates Through Space & Atmosphere'
        : language === 'ru'
        ? 'Шаг 2: Сигнал распространяется в космосе и атмосфере'
        : 'Քայլ 2. Ազդանշանը տարածվում է տարածության և մթնոլորտի միջով',
      desc: language === 'en'
        ? `Electromagnetic waves travel at the speed of light (c ≈ 299,792 km/s) across vacuum, experiencing minor refraction through the ionosphere and troposphere.`
        : language === 'ru'
        ? `Электромагнитная волна движется со скоростью света (c ≈ 299 792 км/с), испытывая небольшие задержки в ионосфере и тропосфере.`
        : `Էլեկտրամագնիսական ալիքը շարժվում է լույսի արագությամբ (c ≈ 299,792 կմ/վ)՝ անցնելով իոնոսֆերայով և տրոպոսֆերայով:`,
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      color: 'border-cyan-500 bg-cyan-500/10 text-cyan-300',
    },
    {
      num: 3,
      title: language === 'en'
        ? 'Step 3: Receiver Detects Arrival Time (t_rx)'
        : language === 'ru'
        ? 'Шаг 3: Приемник фиксирует время приема сигнала (t_rx)'
        : 'Քայլ 3. Ընդունիչը գրանցում է ազդանշանի ժամանման պահը (t_rx)',
      desc: language === 'en'
        ? `Receiver antenna captures carrier phase and PRN code correlation, recording arrival time with its internal quartz oscillator.`
        : language === 'ru'
        ? `Антенна приемника захватывает несущую фазу и PRN код, фиксируя момент приема внутренним кварцевым генератором.`
        : `Ընդունիչի ալեհավաքը գրանցում է ազդանշանի ժամանման պահը իր ներքին քվարցային ժամացույցով:`,
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500 bg-amber-500/10 text-amber-300',
    },
    {
      num: 4,
      title: language === 'en'
        ? 'Step 4: Pseudorange Calculation (d = c · Δt)'
        : language === 'ru'
        ? 'Шаг 4: Вычисление псевдодальности (d = c · Δt)'
        : 'Քայլ 4. Կեղծ հեռավորության հաշվարկ (d = c · Δt)',
      desc: language === 'en'
        ? `Elapsed time Δt = (${transitTimeMs.toFixed(3)} ms). Measured pseudorange: ρ = ${distanceKm.toFixed(1)} km.`
        : language === 'ru'
        ? `Время прохождения Δt = (${transitTimeMs.toFixed(3)} мс). Вычисленная псевдодальность: ρ = ${distanceKm.toFixed(1)} км.`
        : `Անցած ժամանակը Δt = (${transitTimeMs.toFixed(3)} մվ): Կեղծ հեռավորությունը՝ ρ = ${distanceKm.toFixed(1)} կմ:`,
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500 bg-indigo-500/10 text-indigo-300',
    },
    {
      num: 5,
      title: language === 'en'
        ? 'Step 5: Position & Clock Bias Solution Updated'
        : language === 'ru'
        ? 'Шаг 5: Обновление навигационного решения и ухода часов'
        : 'Քայլ 5. Դիրքի և ժամացույցի սխալի լուծման թարմացում',
      desc: language === 'en'
        ? `Combined with at least 3 other visible satellites, the receiver solves the non-linear multilateration system for (X, Y, Z, Δt_clock).`
        : language === 'ru'
        ? `Совместно с минимум тремя другими спутниками приемник решает систему уравнений для (X, Y, Z, Δt_clock).`
        : `Առնվազն 3 այլ արբանյակների հետ միասին լուծվում է (X, Y, Z, Δt_clock) համակարգը:`,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  {satellite.name} —{' '}
                  {language === 'hy'
                    ? 'Ազդանշանի Տարածման և Ժամանակագրության Լաբորատորիա'
                    : language === 'ru'
                    ? 'Лаборатория распространения сигнала и синхронизации'
                    : 'Signal Propagation & Timing Lab'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-semibold">
                  {satellite.constellation}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hy'
                  ? 'Լույսի արագության ինտերակտիվ ֆիզիկական մոդելավորում իրական ժամանակում'
                  : language === 'ru'
                  ? 'Интерактивная физическая симуляция распространения сигнала со скоростью света'
                  : 'Interactive real-time speed of light transmission physics'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-signal-timing"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Calculation Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Թեք հեռավորություն' : language === 'ru' ? 'Наклонная дальность' : 'Slant Distance'}
            </span>
            <span className="text-white font-bold text-sm">{distanceKm.toFixed(1)} km</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Լույսի արագություն (c)' : language === 'ru' ? 'Скорость света (c)' : 'Speed of Light (c)'}
            </span>
            <span className="text-sky-400 font-bold text-sm">299,792 km/s</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Տարածման ժամանակ (Δt)' : language === 'ru' ? 'Время задержки (Δt)' : 'Propagation Time (Δt)'}
            </span>
            <span className="text-amber-400 font-bold text-sm">≈ {transitTimeMs.toFixed(3)} ms</span>
          </div>

          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">
              {language === 'hy' ? 'Բարձրություն / Ազիմուտ' : language === 'ru' ? 'Угол места / Азимут' : 'Elevation / Azimuth'}
            </span>
            <span className="text-emerald-400 font-bold text-sm">
              {(satellite.elevation || 0).toFixed(1)}° / {(satellite.azimuth || 0).toFixed(0)}°
            </span>
          </div>
        </div>

        {/* Math Formula Card */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-sky-900/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-slate-300 font-mono">
              distance = c × travel_time &nbsp;→&nbsp;{' '}
              <span className="text-white font-bold">
                {distanceKm.toFixed(1)} km = 299,792.458 km/s × {transitTimeSec.toFixed(6)} s
              </span>
            </span>
          </div>
        </div>

        {/* Visual Particle Propagation Line */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-sky-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>🛰️ {satellite.name} ({language === 'hy' ? 'Բարձր.' : language === 'ru' ? 'Высота' : 'Alt'}: {satellite.alt.toFixed(0)} km)</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              {language === 'hy' ? 'Ֆոտոնի տարանցում՝' : language === 'ru' ? 'Транзит фотона:' : 'Photon Transit:'} {progress.toFixed(0)}%
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span>📡 {language === 'hy' ? 'Ընդունիչ' : language === 'ru' ? 'Приемник' : 'Receiver'} ({safeReceiver.name || (language === 'hy' ? 'Գետնային կայան' : language === 'ru' ? 'Наземная станция' : 'Ground Station')})</span>
            </div>
          </div>

          {/* Animated beam track */}
          <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5 flex items-center">
            {/* Pulsing travel beam line */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-sky-500/20 via-sky-400/40 to-sky-300/80 transition-all"
              style={{ width: `${progress}%` }}
            />
            {/* Glowing moving photon particle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#38bdf8] border border-sky-300 transition-all"
              style={{ left: `calc(${progress}% - 7px)` }}
            />
          </div>
        </div>

        {/* Step Sequence Details */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {STEPS.map((step) => {
            const isCurrent = currentStep === step.num;
            return (
              <div
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isCurrent
                    ? `${step.color} shadow-lg shadow-sky-500/10 scale-[1.01]`
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/30 opacity-70'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrent ? 'bg-white text-slate-900' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {step.icon}
                      <span>{step.title}</span>
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 animate-pulse">
                        {language === 'hy' ? 'Ակտիվ քայլ' : language === 'ru' ? 'Активный шаг' : 'Active Step'}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Playback Controls & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          {/* Controls: Play/Pause, Restart, Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md shadow-sky-600/20"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setCurrentStep(1);
                setProgress(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Restart Animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed pills */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {[0.25, 0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-lg font-mono text-[11px] transition-colors ${
                    speed === s ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Educational Action Buttons */}
          <div className="flex items-center gap-2">
            {onFollowSignal && (
              <button
                onClick={() => {
                  onFollowSignal(satellite);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>
                  {language === 'hy' ? 'Հետևել ազդանշանին' : language === 'ru' ? 'Следить за лучом' : 'Follow Signal'}
                </span>
              </button>
            )}

            {onShowPositioningProcess && (
              <button
                onClick={() => {
                  onShowPositioningProcess();
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>
                  {language === 'hy'
                    ? 'Ցուցադրել դիրքորոշման գործընթացը'
                    : language === 'ru'
                    ? 'Показать процесс позиционирования'
                    : 'Show Positioning Process'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
