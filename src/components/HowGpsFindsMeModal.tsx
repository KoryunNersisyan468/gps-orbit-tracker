import React, { useState } from 'react';
import {
  Orbit,
  X,
  Radio,
  Clock,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { SatelliteData, UserLocation, Language } from '../types';

interface HowGpsFindsMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  satellites: SatelliteData[];
  userLocation?: UserLocation;
  receiverLocation?: UserLocation;
  language?: Language;
  isSpoofed?: boolean;
  onActivatePositioningMode?: () => void;
}

export const HowGpsFindsMeModal: React.FC<HowGpsFindsMeModalProps> = ({
  isOpen,
  onClose,
  satellites,
  userLocation,
  receiverLocation,
  language = 'en',
  isSpoofed = false,
  onActivatePositioningMode,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const targetLocation: UserLocation = receiverLocation || userLocation || {
    lat: 38.8951,
    lng: -77.0364,
    alt: 25,
    accuracy: 10,
    isReal: false,
    name: 'Receiver Station',
  };

  const visibleSats = (satellites || []).filter((s) => (s.elevation ?? -90) > 0).slice(0, 4);

  const STEPS = [
    {
      num: 1,
      satCount: '1 Satellite',
      satName: visibleSats[0]?.name || 'GPS PRN 01',
      title: language === 'en'
        ? 'Step 1: Single Distance Sphere (Infinite Points)'
        : language === 'ru'
        ? 'Шаг 1: Сфера расстояния одного спутника'
        : 'Քայլ 1. Մեկ հեռավորության գունդ (անվերջ կետեր)',
      concept: language === 'en'
        ? 'Measuring distance from 1 satellite places you somewhere on the surface of a giant sphere in space.'
        : language === 'ru'
        ? 'Измерение расстояния от 1 спутника помещает вас в любую точку на поверхности гигантской сферы в космосе.'
        : '1 արբանյակից հեռավորության չափումը ձեզ տեղադրում է տիեզերքում հսկա գնդի մակերեսին:',
      math: 'Equation: (x - x₁)² + (y - y₁)² + (z - z₁)² = ρ₁²',
      result: language === 'en'
        ? 'Position is completely unconstrained: 2 degrees of freedom remaining.'
        : language === 'ru'
        ? 'Позиция не определена: остается 2 степени свободы.'
        : 'Դիրքը դեռ որոշված չէ.',
      color: 'border-sky-500 bg-sky-500/10 text-sky-400',
    },
    {
      num: 2,
      satCount: '2 Satellites',
      satName: visibleSats[1]?.name || 'GPS PRN 02',
      title: language === 'en'
        ? 'Step 2: Two Spheres Intersect into a Circular Ring'
        : language === 'ru'
        ? 'Шаг 2: Пересечение двух сфер образует окружность'
        : 'Քայլ 2. Երկու գնդերի հատումը կազմում է շրջանագիծ',
      concept: language === 'en'
        ? 'The intersection of two range spheres forms a circle in 3D space. Your receiver is located somewhere along this ring.'
        : language === 'ru'
        ? 'Пересечение двух сфер дальностей образует кольцевую окружность в 3D пространстве.'
        : 'Երկու գնդերի հատումը 3D տարածության մեջ կազմում է շրջանագիծ:',
      math: 'Intersection: Sphere₁ ∩ Sphere₂ = Circle in Space',
      result: language === 'en'
        ? 'Position narrowed to a 1-dimensional curved trajectory.'
        : language === 'ru'
        ? 'Положение сужено до 1-мерной окружности.'
        : 'Դիրքը սահմանափակված է 1-չափանի շրջանագծով:',
      color: 'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    },
    {
      num: 3,
      satCount: '3 Satellites',
      satName: visibleSats[2]?.name || 'GPS PRN 03',
      title: language === 'en'
        ? 'Step 3: Three Spheres Intersect at Exactly Two Points'
        : language === 'ru'
        ? 'Шаг 3: Три сферы пересекаются ровно в двух точках'
        : 'Քայլ 3. Երեք գնդերը հատվում են ուղիղ 2 կետում',
      concept: language === 'en'
        ? 'Adding a 3rd range sphere intersects the circular ring at exactly TWO discrete spatial points. One point is on or near Earth; the other is discarded as impractical far in outer space.'
        : language === 'ru'
        ? 'Третья сфера пересекает кольцо ровно в ДВУХ точках: одна около поверхности Земли, вторая далеко в космосе (отбрасывается).'
        : 'Երրորդ գունդը շրջանագիծը հատում է ուղիղ ԵՐԿՈՒ կետում (մեկը Երկրի վրա, մյուսը՝ տիեզերքում):',
      math: 'Sphere₁ ∩ Sphere₂ ∩ Sphere₃ = { Point_Earth, Point_Space }',
      result: language === 'en'
        ? 'Horizontal 2D Position resolved! (Assuming perfect receiver clock)'
        : language === 'ru'
        ? '2D положение определено (при условии идеальных часов).'
        : '2D դիրքը որոշված է:',
      color: 'border-amber-500 bg-amber-500/10 text-amber-400',
    },
    {
      num: 4,
      satCount: '4 Satellites (Full 3D + Time Fix)',
      satName: visibleSats[3]?.name || 'GPS PRN 04',
      title: language === 'en'
        ? 'Step 4: Fourth Satellite Eliminates Receiver Clock Bias (Δt)'
        : language === 'ru'
        ? 'Шаг 4: Четвертый спутник устраняет уход кварцевых часов (Δt)'
        : 'Քայլ 4. Չորրորդ արբանյակը վերացնում է ժամացույցի սխալը (Δt)',
      concept: language === 'en'
        ? 'Consumer phones use inexpensive quartz oscillators, not atomic clocks. The 4th satellite provides the 4th mathematical equation required to solve for Latitude, Longitude, Altitude AND Receiver Clock Bias simultaneously!'
        : language === 'ru'
        ? 'Смартфоны содержат дешевые кварцевые генераторы. 4-й спутник дает 4-е уравнение для нахождения (X, Y, Z, Δt_clock) с атомной точностью!'
        : '4-րդ արբանյակը տալիս է 4-րդ հավասարումը՝ միաժամանակ որոշելով (X, Y, Z, Δt) ատոմային ճշգրտությամբ:',
      math: 'System: ρᵢ = √((x - xᵢ)² + (y - yᵢ)² + (z - zᵢ)²) + c · Δt_clock, for i = 1..4',
      result: language === 'en'
        ? 'COMPLETE 3D GNSS FIX: Position (±3m) & Atomic Time (±10ns)!'
        : language === 'ru'
        ? 'ПОЛНЫЙ 3D GNSS ФИКС: Позиция (±3м) и время (±10нс)!'
        : 'ԼԻԱՐԺԵՔ 3D GNSS ՖԻՔՍ. Դիրք (±3մ) և ժամանակ (±10նվ):',
      color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Orbit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {language === 'hy'
                  ? 'Ինչպես է GPS-ը գտնում ինձ — Մուլտիլատերացիայի երկրաչափություն'
                  : language === 'ru'
                  ? 'Как GPS находит меня — Геометрия мультилатерации'
                  : 'How GPS Finds Me — Multilateration Geometry'}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'hy'
                  ? '3D տարածական կոորդինատների և ընդունիչի ժամացույցի շեղման մաթեմատիկական լուծում'
                  : language === 'ru'
                  ? 'Математическое пошаговое определение 3D координат и ухода часов'
                  : 'Mathematical step-by-step resolution of 3D spatial coordinates & receiver clock bias'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-how-gps-finds-me"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Pill Bar */}
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col gap-0.5 ${
                activeStep === s.num
                  ? 'bg-slate-800 border-sky-500 shadow-md shadow-sky-500/20'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {language === 'hy' ? `Քայլ ${s.num}` : language === 'ru' ? `Шаг ${s.num}` : `Step ${s.num}`}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {s.num} {language === 'hy' ? 'Արբ.' : language === 'ru' ? 'Спут.' : 'Sat'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate">{s.satName}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        {(() => {
          const s = STEPS[activeStep - 1];
          return (
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center text-xs font-bold">
                    {s.num}
                  </span>
                  <span>{s.title}</span>
                </h3>
                <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/20">
                  {s.satName}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{s.concept}</p>

              {/* Math equation box */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-sky-300">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                  {language === 'hy' ? 'Երկրաչափական հավասարում՝' : language === 'ru' ? 'Геометрическое уравнение:' : 'Geometric Equation:'}
                </div>
                {s.math}
              </div>

              {/* Physical Outcome */}
              <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{s.result}</span>
              </div>
            </div>
          );
        })()}

        {/* Receiver Unknowns Table */}
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">
              {language === 'hy' ? 'X (Լայնություն)' : language === 'ru' ? 'X (Широта)' : 'X (Latitude)'}
            </span>
            <span className={`font-bold ${isSpoofed ? 'text-rose-400' : 'text-white'}`}>
              {(targetLocation?.lat ?? 0).toFixed(4)}°
            </span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">
              {language === 'hy' ? 'Y (Երկայնություն)' : language === 'ru' ? 'Y (Долгота)' : 'Y (Longitude)'}
            </span>
            <span className={`font-bold ${isSpoofed ? 'text-rose-400' : 'text-white'}`}>
              {(targetLocation?.lng ?? 0).toFixed(4)}°
            </span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">
              {language === 'hy' ? 'Z (Բարձրություն)' : language === 'ru' ? 'Z (Высота)' : 'Z (Altitude)'}
            </span>
            <span className="text-white font-bold">{(targetLocation?.alt || 50).toFixed(0)} m</span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 block">
              {language === 'hy' ? 'Δt (Ժամացույցի շեղում)' : language === 'ru' ? 'Δt (Уход часов)' : 'Δt (Clock Bias)'}
            </span>
            <span className="text-emerald-400 font-bold">+12.4 ns</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveStep((prev) => (prev > 1 ? prev - 1 : 4))}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            {language === 'hy' ? 'Նախորդ քայլ' : language === 'ru' ? 'Предыдущий шаг' : 'Previous Step'}
          </button>

          <div className="flex items-center gap-2">
            {onActivatePositioningMode && (
              <button
                onClick={() => {
                  onActivatePositioningMode();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/20"
              >
                {language === 'hy'
                  ? 'Ակտիվացնել տեսանելի ճառագայթները'
                  : language === 'ru'
                  ? 'Анимировать лучи спутников'
                  : 'Animate All Visible Rays'}
              </button>
            )}

            <button
              onClick={() => setActiveStep((prev) => (prev < 4 ? prev + 1 : 1))}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              {activeStep < 4
                ? language === 'hy' ? 'Հաջորդ քայլ' : language === 'ru' ? 'Следующий шаг' : 'Next Step'
                : language === 'hy' ? 'Կրկնել հաջորդականությունը' : language === 'ru' ? 'Начать заново' : 'Restart Sequence'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
