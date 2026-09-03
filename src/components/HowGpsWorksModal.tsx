import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Radio,
  Clock,
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  MapPin,
  Satellite,
} from 'lucide-react';
import { Language, UserLocation, SatelliteData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HowGpsWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  receiverLocation?: UserLocation;
  satellites?: SatelliteData[];
  onStartDemonstration?: () => void;
}

export const HowGpsWorksModal: React.FC<HowGpsWorksModalProps> = ({
  isOpen,
  onClose,
  language,
  receiverLocation,
  satellites = [],
  onStartDemonstration,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [animProgress, setAnimProgress] = useState<number>(0);

  const t = TRANSLATIONS[language];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < 7 ? prev + 1 : 1));
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, isAutoPlaying]);

  // Micro animation progress ticker
  useEffect(() => {
    if (!isOpen) return;
    setAnimProgress(0);
    const start = Date.now();
    const duration = 5000;

    const frame = () => {
      const elapsed = (Date.now() - start) % duration;
      setAnimProgress(elapsed / duration);
      animId = requestAnimationFrame(frame);
    };

    let animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  const targetLoc = receiverLocation || {
    lat: 40.1872,
    lng: 44.5152,
    alt: 989,
    name: 'Yerevan, Armenia',
    isReal: false,
  };

  const visibleSats = satellites.filter((s) => (s.elevation ?? -90) > 0).slice(0, 4);

  const stepMeta = [
    {
      num: 1,
      icon: Satellite,
      badge: '1. SATELLITE TX',
      color: 'sky',
    },
    {
      num: 2,
      icon: Radio,
      badge: '2. PROPAGATION',
      color: 'cyan',
    },
    {
      num: 3,
      icon: Clock,
      badge: '3. TIME MEASUREMENT',
      color: 'amber',
    },
    {
      num: 4,
      icon: Compass,
      badge: '4. PSEUDORANGE',
      color: 'indigo',
    },
    {
      num: 5,
      icon: Layers,
      badge: '5. MULTI-SPHERES',
      color: 'purple',
    },
    {
      num: 6,
      icon: Cpu,
      badge: '6. DSP SOLUTION',
      color: 'rose',
    },
    {
      num: 7,
      icon: MapPin,
      badge: '7. POSITION LOCKED',
      color: 'emerald',
    },
  ];

  const currentStepInfo = t.howGpsWorks?.steps?.[`step${currentStep}`] || {
    title: `Step ${currentStep}`,
    description: '',
  };

  return (
    <div
      id="modal-how-gps-works"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{t.howGpsWorks?.modalTitle || 'How GPS Finds You — 7-Step Guide'}</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {targetLoc.name || 'Yerevan, Armenia'}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.howGpsWorks?.modalSubtitle ||
                  'Discover how satellites in space pinpoint a receiver in Yerevan with nanosecond precision'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-how-gps-works"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Step Progress Track */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          {stepMeta.map((s) => {
            const isActive = currentStep === s.num;
            const isPassed = currentStep > s.num;
            const StepIcon = s.icon;
            return (
              <button
                key={s.num}
                onClick={() => {
                  setCurrentStep(s.num);
                  setIsAutoPlaying(false);
                }}
                className={`flex-1 min-w-[70px] sm:min-w-0 py-2 px-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-md shadow-sky-500/20'
                    : isPassed
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <StepIcon className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[11px] font-bold">#{s.num}</span>
                </div>
                <span className="text-[9px] font-medium hidden md:inline truncate max-w-full">
                  {s.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Interactive SVG Animation Stage */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            {/* STEP 1: Satellite Broadcast */}
            {currentStep === 1 && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="absolute top-4 text-xs font-mono text-sky-400 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800">
                  Atomic Clock Carrier Wave: L1 = 1575.42 MHz (λ = 19.03 cm)
                </div>
                {/* Satellite */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-sky-600/30 border-2 border-sky-400 flex items-center justify-center text-white shadow-xl shadow-sky-500/30">
                      <Satellite className="w-9 h-9 text-sky-300 animate-pulse" />
                    </div>
                    {/* Pulsing radio waves */}
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full border border-sky-400/40 pointer-events-none"
                        style={{
                          transform: `scale(${1 + (animProgress + i * 0.25) % 1 * 4})`,
                          opacity: 1 - ((animProgress + i * 0.25) % 1),
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-bold text-sky-300">
                      {visibleSats[0]?.name || 'NAVSTAR GPS PRN 01'}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Rubidium Clock Accuracy: ±0.000000001 s (1 ns)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Signal Travels Toward Earth */}
            {currentStep === 2 && (
              <div className="relative w-full h-full flex items-center justify-between px-6 sm:px-16">
                {/* Space Satellite */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300">
                    <Satellite className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">20,200 km</span>
                </div>

                {/* Signal Path with Photons */}
                <div className="flex-1 mx-4 relative h-12 flex items-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-12 bg-white blur-sm"
                      style={{ left: `${animProgress * 100}%` }}
                    />
                  </div>
                  {/* Moving photon particle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] flex items-center justify-center text-[8px] font-black text-slate-950"
                    style={{ left: `calc(${animProgress * 100}% - 8px)` }}
                  >
                    γ
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[11px] font-mono text-cyan-300">
                    c = 299,792.458 km/s
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                    Ionospheric & Tropospheric Refraction
                  </div>
                </div>

                {/* Earth Receiver */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <Radio className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 mt-1">Yerevan</span>
                </div>
              </div>
            )}

            {/* STEP 3: Receiver Measures Timing */}
            {currentStep === 3 && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-lg bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      Transmit Time (t_tx)
                    </div>
                    <div className="text-sm font-mono text-sky-400 font-bold mt-1">
                      12:00:00.000000000
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Satellite Atomic Clock</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 flex flex-col items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-400 animate-spin" />
                    <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                      Δt ≈ 67.842 ms
                    </div>
                    <div className="text-[9px] text-amber-400/80 mt-0.5">Transit Delay</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      Receive Time (t_rx)
                    </div>
                    <div className="text-sm font-mono text-emerald-400 font-bold mt-1">
                      12:00:00.067842100
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5">Receiver Quartz Clock</div>
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-4 text-center">
                  Time of Flight: Δt = t_rx - t_tx = 0.067842 seconds
                </p>
              </div>
            )}

            {/* STEP 4: Receiver Estimates Pseudorange */}
            {currentStep === 4 && (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4">
                <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl max-w-md w-full">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Pseudorange Equation
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-bold text-white my-2">
                    ρ = c · Δt + c · b_rx + ε
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 text-left mt-2">
                    <div>c · Δt = 20,338.54 km</div>
                    <div>b_rx = Receiver Clock Bias</div>
                    <div>ε = Ionosphere / Multipath</div>
                    <div className="text-emerald-400 font-bold">ρ ≈ 20,345.12 km</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Called a 'pseudorange' because the local receiver clock offset is not yet solved.
                </p>
              </div>
            )}

            {/* STEP 5: Multiple Satellites Provide Ranging Spheres */}
            {currentStep === 5 && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Sphere 1 */}
                  <div className="absolute inset-2 rounded-full border-2 border-sky-400/60 animate-pulse" />
                  {/* Sphere 2 */}
                  <div className="absolute inset-8 rounded-full border-2 border-emerald-400/60" />
                  {/* Sphere 3 */}
                  <div className="absolute inset-14 rounded-full border-2 border-amber-400/60" />
                  {/* Sphere 4 */}
                  <div className="absolute inset-20 rounded-full border-2 border-purple-400/60" />
                  {/* Intersection Center */}
                  <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_16px_#ffffff] flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-slate-950" />
                  </div>
                </div>
                <div className="absolute bottom-3 text-xs font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-800">
                  4 Satellites = Unique (X, Y, Z, Δt_bias) Intersection
                </div>
              </div>
            )}

            {/* STEP 6: DSP Calculates Position */}
            {currentStep === 6 && (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full">
                  <div className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center justify-center gap-2">
                    <Cpu className="w-4 h-4 text-rose-400 animate-spin" />
                    Least-Squares Matrix Solver (Newton-Raphson / Kalman Filter)
                  </div>
                  <div className="text-sm font-mono text-slate-200 mt-2 p-2 bg-slate-950 rounded-xl border border-slate-800">
                    Δx = (Hᵀ · H)⁻¹ · Hᵀ · Δρ
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 mt-3 pt-2 border-t border-slate-800">
                    <span>Iterations: 3</span>
                    <span>GDOP: 1.82 (Ideal)</span>
                    <span>Clock Bias Error: Eliminated</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Position Confirmed in Yerevan */}
            {currentStep === 7 && (
              <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center mb-3">
                  <div className="absolute w-24 h-24 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="w-16 h-16 rounded-3xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/40 z-10">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-lg font-bold text-emerald-300">
                  📍 {targetLoc.name || 'Yerevan, Armenia'}
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1">
                  Lat: {targetLoc.lat.toFixed(4)}° N | Lng: {targetLoc.lng.toFixed(4)}° E | Alt:{' '}
                  {targetLoc.alt} m
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3D Fix Confirmed: Sub-3m Accuracy
                </div>
              </div>
            )}
          </div>

          {/* Explanation Text Card */}
          <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                {t.howGpsWorks?.step || 'Step'} {currentStep} {t.howGpsWorks?.of || 'of'} 7
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {Math.round((currentStep / 7) * 100)}% Complete
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white text-balance">
              {currentStepInfo.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentStepInfo.description}
            </p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="btn-how-gps-autoplay"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              id="btn-how-gps-replay"
              onClick={() => {
                setCurrentStep(1);
                setIsAutoPlaying(false);
              }}
              title="Restart from Step 1"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {onStartDemonstration && (
              <button
                id="btn-how-gps-yerevan-demo"
                onClick={() => {
                  onClose();
                  onStartDemonstration();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-all"
              >
                <span>🇦🇲 Yerevan Demo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-how-gps-prev"
              disabled={currentStep === 1}
              onClick={() => {
                setCurrentStep((prev) => Math.max(prev - 1, 1));
                setIsAutoPlaying(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-300 border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.howGpsWorks?.prev || 'Previous'}</span>
            </button>

            {currentStep < 7 ? (
              <button
                id="btn-how-gps-next"
                onClick={() => {
                  setCurrentStep((prev) => Math.min(prev + 1, 7));
                  setIsAutoPlaying(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20 transition-all"
              >
                <span>{t.howGpsWorks?.next || 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-how-gps-finish"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.common?.close || 'Complete'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
