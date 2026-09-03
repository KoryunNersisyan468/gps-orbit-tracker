import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Satellite,
  Globe,
  Radio,
  Clock,
  Activity,
  Layers,
  Sliders,
  Maximize,
  Eye,
  Compass,
  AlertCircle,
  CornerUpRight,
  CloudRain,
  ShieldAlert,
  RadioTower,
  Cpu,
  SearchCheck,
  Lock,
  Zap,
} from 'lucide-react';
import { Language } from '../types';
import { ACADEMY_LESSONS } from '../data/academyLessons';
import { SPEED_OF_LIGHT_KM_S } from '../utils/coordinates';

interface AcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({ isOpen, onClose, language }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interactive widgets state
  const [interactiveDelayMs, setInteractiveDelayMs] = useState<number>(68.5); // ~20,500 km
  const [interactiveSpheresCount, setInteractiveSpheresCount] = useState<number>(4);
  const [interactiveClockBiasNs, setInteractiveClockBiasNs] = useState<number>(45);
  const [interactiveSpreadDeg, setInteractiveSpreadDeg] = useState<number>(75);

  if (!isOpen) return null;

  const currentLesson = ACADEMY_LESSONS.find((l) => l.id === selectedLessonId) || ACADEMY_LESSONS[0];

  const filteredLessons =
    selectedCategory === 'all'
      ? ACADEMY_LESSONS
      : ACADEMY_LESSONS.filter((l) => l.category === selectedCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Satellite':
        return <Satellite className="w-4 h-4" />;
      case 'Globe':
        return <Globe className="w-4 h-4" />;
      case 'Radio':
        return <Radio className="w-4 h-4" />;
      case 'Clock':
        return <Clock className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      case 'Activity':
        return <Activity className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Sliders':
        return <Sliders className="w-4 h-4" />;
      case 'Maximize':
        return <Maximize className="w-4 h-4" />;
      case 'Eye':
        return <Eye className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'AlertCircle':
        return <AlertCircle className="w-4 h-4" />;
      case 'CornerUpRight':
        return <CornerUpRight className="w-4 h-4" />;
      case 'CloudRain':
        return <CloudRain className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'RadioTower':
        return <RadioTower className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'SearchCheck':
        return <SearchCheck className="w-4 h-4" />;
      case 'Lock':
        return <Lock className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const categories = [
    { id: 'all', label: { en: 'All Lessons', ru: 'Все уроки', hy: 'Բոլորը' } },
    { id: 'basics', label: { en: 'Basics & Orbits', ru: 'Основы и орбиты', hy: 'Հիմունքներ' } },
    { id: 'signals', label: { en: 'Signals & Clocks', ru: 'Сигналы и часы', hy: 'Ազդանշաններ' } },
    { id: 'geometry', label: { en: 'Geometry & Math', ru: 'Геометрия и расчет', hy: 'Երկրաչափություն' } },
    { id: 'errors', label: { en: 'Atmosphere & Errors', ru: 'Ошибки и среда', hy: 'Սխալներ' } },
    { id: 'spoofing', label: { en: 'Spoofing & Defense', ru: 'Спуфинг и защита', hy: 'Սպուֆինգ' } },
  ];

  // Calculated distance for interactive pseudorange widget
  const interactiveDistanceKm = (interactiveDelayMs / 1000) * SPEED_OF_LIGHT_KM_S;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-6xl h-[90vh] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>
                  {language === 'hy'
                    ? 'GNSS Ակադեմիա և Լաբորատորիա'
                    : language === 'ru'
                    ? 'Академия и лаборатория GNSS'
                    : 'GNSS Academy & Laboratory'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {language === 'hy'
                    ? '20 ինտերակտիվ դաս'
                    : language === 'ru'
                    ? '20 интерактивных уроков'
                    : '20 Interactive Lessons'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'en' && 'Comprehensive scientific guide to satellite navigation, trilateration, and signal integrity.'}
                {language === 'ru' && 'Полное научное руководство по спутниковой навигации, трилатерации и защите от спуфинга.'}
                {language === 'hy' && 'Արբանյակային նավիգացիայի, տրիլատերացիայի և սպուֆինգի գիտական ուղեցույց:'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={language === 'hy' ? 'Փակել' : language === 'ru' ? 'Закрыть' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Lesson Navigation Sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-slate-800 flex flex-col bg-slate-950/40">
            {/* Category filter pills */}
            <div className="p-3 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label[language]}
                </button>
              ))}
            </div>

            {/* Lesson list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {filteredLessons.map((lesson) => {
                const isActive = lesson.id === selectedLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-inner'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <div
                      className={`p-1.5 rounded-lg mt-0.5 ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-200'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {getIcon(lesson.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {lesson.title[language]}
                      </div>
                      <div className="text-xs text-slate-400 truncate mt-0.5">
                        {lesson.subtitle[language]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Lesson Detail & Interactive Widget */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/60">
            {/* Lesson Title & Subtitle */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                <span>
                  {language === 'hy'
                    ? `Դաս ${currentLesson.id} / 20-ից`
                    : language === 'ru'
                    ? `Урок ${currentLesson.id} из 20`
                    : `Lesson ${currentLesson.id} of 20`}
                </span>
                <span>•</span>
                <span>{currentLesson.category.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentLesson.title[language]}
              </h1>
              <p className="text-base text-slate-300 mt-2 font-medium">
                {currentLesson.subtitle[language]}
              </p>
            </div>

            {/* Formula box if present */}
            {currentLesson.formula && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-indigo-300 uppercase tracking-wider mb-1">
                    {language === 'hy'
                      ? 'Հիմնարար բանաձև'
                      : language === 'ru'
                      ? 'Основная формула'
                      : 'Fundamental Formula'}
                  </div>
                  <code className="text-base sm:text-lg font-mono text-indigo-100 font-bold">
                    {currentLesson.formula}
                  </code>
                </div>
                <div className="hidden sm:block text-xs text-indigo-300/80 max-w-xs text-right">
                  {language === 'hy'
                    ? 'WGS-84 / GNSS պսևդոհեռավորության մոդել'
                    : language === 'ru'
                    ? 'Модель псевдодальностей WGS-84'
                    : 'Standard WGS-84 / GNSS pseudorange model'}
                </div>
              </div>
            )}

            {/* Lesson Paragraphs */}
            <div className="space-y-4 text-slate-200 leading-relaxed text-sm sm:text-base">
              {currentLesson.content[language].map((paragraph, idx) => (
                <p key={idx} className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Interactive Widget section */}
            {currentLesson.interactiveType === 'pseudorange' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {language === 'hy'
                      ? 'Պսևդոհեռավորության ինտերակտիվ լաբորատորիա՝ d ≈ c × Δt'
                      : language === 'ru'
                      ? 'Интерактивная лаборатория псевдодальности: d ≈ c × Δt'
                      : 'Interactive Pseudorange Laboratory: d ≈ c × Δt'}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">c = 299,792.458 km/s</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>
                      {language === 'hy'
                        ? 'Ազդանշանի տարածման մոդելավորված ժամանակ (Δt)՝'
                        : language === 'ru'
                        ? 'Моделированное время прохождения сигнала (Δt):'
                        : 'Simulated Signal Travel Time (Δt):'}
                    </span>
                    <span className="font-mono font-bold text-sky-300">
                      {interactiveDelayMs.toFixed(2)} ms ({(interactiveDelayMs * 1000).toFixed(0)} µs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60.0"
                    max="90.0"
                    step="0.1"
                    value={interactiveDelayMs}
                    onChange={(e) => setInteractiveDelayMs(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>60 ms (~18,000 km Zenith)</span>
                    <span>75 ms (~22,500 km)</span>
                    <span>90 ms (~27,000 km Horizon)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">
                      {language === 'hy' ? 'Հաշվարկված հեռավորություն' : language === 'ru' ? 'Расчетная дальность' : 'Calculated Range'}
                    </div>
                    <div className="text-lg font-bold font-mono text-sky-300 mt-1">
                      {interactiveDistanceKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">
                      {language === 'hy' ? 'Ժամանակի զգայունություն (1 µs սխալ)' : language === 'ru' ? 'Чувствительность к задержке (1 мкс)' : 'Timing Sensitivity (1 µs error)'}
                    </div>
                    <div className="text-lg font-bold font-mono text-amber-400 mt-1">
                      ±299.8 {language === 'hy' ? 'մետր' : language === 'ru' ? 'метров' : 'meters'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">
                      {language === 'hy' ? 'Ժամացույցի զգայունություն (1 ns սխալ)' : language === 'ru' ? 'Чувствительность часов (1 нс)' : 'Clock Sensitivity (1 ns error)'}
                    </div>
                    <div className="text-lg font-bold font-mono text-emerald-400 mt-1">
                      ±29.98 {language === 'hy' ? 'սմ' : language === 'ru' ? 'см' : 'cm'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'spheres' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {language === 'hy'
                      ? '3D ոլորտային տրիլատերացիայի ինտերակտիվ սիմուլյատոր'
                      : language === 'ru'
                      ? 'Интерактивный 3D симулятор трилатерации сфер'
                      : 'Interactive 3D Sphere Multilateration Simulator'}
                  </h3>
                  <span className="text-xs text-indigo-300 font-mono">
                    {interactiveSpheresCount}{' '}
                    {language === 'hy'
                      ? 'Ակտիվ արբանյակ'
                      : language === 'ru'
                      ? 'Активных спутников'
                      : 'Satellites Active'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setInteractiveSpheresCount(num)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                        interactiveSpheresCount === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {num}{' '}
                      {language === 'hy'
                        ? num === 1
                          ? 'Ոլորտ'
                          : 'Ոլորտ'
                        : language === 'ru'
                        ? num === 1
                          ? 'Сфера'
                          : 'Сферы'
                        : num === 1
                        ? 'Sphere'
                        : 'Spheres'}
                    </button>
                  ))}
                </div>

                {/* Visualizer diagram */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center justify-center w-36 h-36 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden">
                    {interactiveSpheresCount >= 1 && (
                      <div className="absolute w-28 h-28 rounded-full border-2 border-sky-500/50 bg-sky-500/10 animate-pulse" />
                    )}
                    {interactiveSpheresCount >= 2 && (
                      <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-500/50 bg-emerald-500/10 -translate-x-3" />
                    )}
                    {interactiveSpheresCount >= 3 && (
                      <div className="absolute w-20 h-20 rounded-full border-2 border-amber-500/50 bg-amber-500/10 translate-y-3" />
                    )}
                    {interactiveSpheresCount >= 4 && (
                      <div className="absolute w-3 h-3 rounded-full bg-rose-500 ring-4 ring-rose-500/40 animate-ping" />
                    )}
                    <span className="text-[10px] font-mono font-bold text-slate-400 z-10 text-center px-1">
                      {interactiveSpheresCount === 1 &&
                        (language === 'hy' ? 'Մակերևույթ' : language === 'ru' ? 'Поверхность' : 'Surface Area')}
                      {interactiveSpheresCount === 2 &&
                        (language === 'hy' ? 'Հատման շրջան' : language === 'ru' ? 'Окружность' : 'Intersect Circle')}
                      {interactiveSpheresCount === 3 &&
                        (language === 'hy' ? '2 կետ տարածության մեջ' : language === 'ru' ? '2 точки в 3D' : '2 Points in 3D')}
                      {interactiveSpheresCount === 4 &&
                        (language === 'hy' ? 'Եզակի 3D կորդինատ' : language === 'ru' ? 'Точный 3D Fix' : 'Unique 3D Fix')}
                    </span>
                  </div>

                  <div className="flex-1 text-xs text-slate-300 space-y-1.5">
                    {interactiveSpheresCount === 1 && (
                      <p>
                        <strong>{language === 'hy' ? '1 Արբանյակ՝' : language === 'ru' ? '1 Спутник:' : '1 Satellite:'}</strong>{' '}
                        {language === 'hy'
                          ? 'Մեկ պսևդոհեռավորությունը միայն ապացուցում է, որ գտնվում եք 20,000 կմ շառավղով ոլորտի մակերեսին: Անվերջ հնարավոր դիրքեր:'
                          : language === 'ru'
                          ? 'Одна псевдодальность определяет лишь сферу радиусом 20,000 км. Бесконечное множество положений.'
                          : 'A single pseudorange only proves you are located on the 2D surface of a massive 20,000 km sphere. Infinite possible locations.'}
                      </p>
                    )}
                    {interactiveSpheresCount === 2 && (
                      <p>
                        <strong>{language === 'hy' ? '2 Արբանյակ՝' : language === 'ru' ? '2 Спутника:' : '2 Satellites:'}</strong>{' '}
                        {language === 'hy'
                          ? 'Երկու հատվող ոլորտներ կազմում են հատման 2D շրջանագիծ: Ընդունիչը կարող է լինել այդ շրջագծի ցանկացած կետում:'
                          : language === 'ru'
                          ? 'Две сферы пересекаются в 2D окружность. Приемник может находиться в любой точке этой линии.'
                          : 'Two intersecting distance spheres form a 2D circle of intersection. Your receiver can be anywhere along that perimeter ring.'}
                      </p>
                    )}
                    {interactiveSpheresCount === 3 && (
                      <p>
                        <strong>{language === 'hy' ? '3 Արբանյակ՝' : language === 'ru' ? '3 Спутника:' : '3 Satellites:'}</strong>{' '}
                        {language === 'hy'
                          ? 'Երեք հատվող ոլորտները սեղմում են շրջանը ուղիղ ԵՐԿՈՒ կետի: Մեկ կետը գտնվում է խոր տիեզերքում, մնում է միայն մեկ թեկնածու Երկրի վրա:'
                          : language === 'ru'
                          ? 'Три сферы дают всего ДВЕ точки в пространстве. Одна в космосе, вторая — на поверхности Земли.'
                          : 'Three intersecting spheres collapse the circle down to exactly TWO points in space. One point is in deep outer space, leaving only one candidate near Earth.'}
                      </p>
                    )}
                    {interactiveSpheresCount === 4 && (
                      <p>
                        <strong>{language === 'hy' ? '4 Արբանյակ՝' : language === 'ru' ? '4 Спутника:' : '4 Satellites:'}</strong>{' '}
                        {language === 'hy'
                          ? 'Լուծում է 4-րդ անհայտը՝ ընդունիչի քվարցային ժամացույցի շեղումը (δt), ապահովելով եզակի 3D կոորդինատ (Լայնություն, Երկայնություն, Բարձրություն):'
                          : language === 'ru'
                          ? 'Устраняет смещение кварцевых часов приемника (δt), фиксируя точные 3D координаты (Широта, Долгота, Высота).'
                          : 'Resolves the 4th unknown—the receiver quartz clock bias (δt)—locking onto your exact 3D Cartesian coordinates (Latitude, Longitude, Altitude).'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'clock_bias' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <Sliders className="w-4 h-4" />
                    {language === 'hy'
                      ? 'Ընդունիչի քվարցային գեներատորի ժամացույցի շեղման (δt) սիմուլյատոր'
                      : language === 'ru'
                      ? 'Симулятор смещения кварцевых часов приемника (δt)'
                      : 'Receiver Quartz Oscillator Clock Bias (δt) Simulator'}
                  </h3>
                  <span className="text-xs font-mono text-amber-300">
                    δt = {interactiveClockBiasNs} ns
                  </span>
                </div>

                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="5"
                  value={interactiveClockBiasNs}
                  onChange={(e) => setInteractiveClockBiasNs(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">
                      {language === 'hy'
                        ? 'Պսևդոհեռավորության համակարգային տեղաշարժ (c × δt)՝'
                        : language === 'ru'
                        ? 'Систематический сдвиг псевдодальности (c × δt):'
                        : 'Systematic Pseudorange Shift (c × δt):'}
                    </span>
                    <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                      {((interactiveClockBiasNs * 1e-9) * SPEED_OF_LIGHT_KM_S * 1000).toFixed(2)}{' '}
                      {language === 'hy' ? 'մետր' : language === 'ru' ? 'метров' : 'meters'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400">
                      {language === 'hy'
                        ? 'Ինչպես է GPS-ը վերացնում այս սխալը՝'
                        : language === 'ru'
                        ? 'Как GPS устраняет эту погрешность:'
                        : 'How GPS Eliminates This:'}
                    </span>
                    <div className="text-slate-200 mt-1 leading-relaxed">
                      {language === 'hy'
                        ? '4-րդ արբանյակը տալիս է 4-րդ հավասարումը, վերլուծորեն հաշվարկելով δt-ն և վերացնելով շեղումը բոլոր կապուղիներից:'
                        : language === 'ru'
                        ? '4-й спутник предоставляет 4-е уравнение, аналитически вычисляя δt и устраняя смещение со всех каналов.'
                        : 'The 4th satellite provides a 4th equation, solving δt analytically and removing the offset from all channels.'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentLesson.interactiveType === 'dop' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    {language === 'hy'
                      ? 'Ճշգրտության երկրաչափական նվազեցման (DOP) սիմուլյատոր'
                      : language === 'ru'
                      ? 'Симулятор геометрического фактора снижения точности (DOP)'
                      : 'Geometric Dilution of Precision (DOP) Spread Simulator'}
                  </h3>
                  <span className="text-xs font-mono text-emerald-300">
                    {language === 'hy' ? 'Անկյունային բացվածք՝' : language === 'ru' ? 'Угловой разброс:' : 'Angular Spread:'} {interactiveSpreadDeg}°
                  </span>
                </div>

                <input
                  type="range"
                  min="15"
                  max="120"
                  step="1"
                  value={interactiveSpreadDeg}
                  onChange={(e) => setInteractiveSpreadDeg(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />

                {/* Live calculated DOP from spread angle */}
                {(() => {
                  const rad = (interactiveSpreadDeg * Math.PI) / 180;
                  const estimatedDop = Number((1 / Math.sin(rad / 2) + 0.5).toFixed(2));
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-xs text-slate-400">
                          {language === 'hy' ? 'Գնահատված GDOP' : language === 'ru' ? 'Расчетный GDOP' : 'Estimated GDOP'}
                        </div>
                        <div className={`text-xl font-bold font-mono mt-1 ${
                          estimatedDop < 2 ? 'text-emerald-400' : estimatedDop < 5 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {estimatedDop}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-xs text-slate-400">
                          {language === 'hy' ? 'Երկրաչափության որակ' : language === 'ru' ? 'Оценка геометрии' : 'Geometry Rating'}
                        </div>
                        <div className="text-sm font-semibold text-white mt-1">
                          {estimatedDop < 2
                            ? language === 'hy'
                              ? 'Օպտիմալ (Լայն երկնակամար)'
                              : language === 'ru'
                              ? 'Оптимально (Широкий обзор)'
                              : 'Optimal (Wide Sky View)'
                            : estimatedDop < 5
                            ? language === 'hy'
                              ? 'Լավ'
                              : language === 'ru'
                              ? 'Хорошо'
                              : 'Good'
                            : language === 'hy'
                            ? 'Թույլ (Խմբավորված)'
                            : language === 'ru'
                            ? 'Слабо (Скученно)'
                            : 'Poor (Clustered)'}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="text-xs text-slate-400">
                          {language === 'hy' ? 'Անորոշության գոտի' : language === 'ru' ? 'Зона неопределенности' : 'Uncertainty Region'}
                        </div>
                        <div className="text-sm font-semibold text-slate-300 mt-1">
                          {estimatedDop < 2
                            ? language === 'hy'
                              ? 'Կոմպակտ ճշգրիտ շրջան'
                              : language === 'ru'
                              ? 'Компактный точный круг'
                              : 'Compact tight circle'
                            : language === 'hy'
                            ? 'Երկարաձգված սխալի էլիպս'
                            : language === 'ru'
                            ? 'Вытянутый эллипс погрешности'
                            : 'Elongated error ellipse'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Navigation Footer: Prev / Next Lesson */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800">
              <button
                disabled={selectedLessonId <= 1}
                onClick={() => setSelectedLessonId((prev) => Math.max(1, prev - 1))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  {language === 'hy' ? 'Նախորդ դաս' : language === 'ru' ? 'Предыдущий урок' : 'Previous Lesson'}
                </span>
              </button>

              <span className="text-xs font-mono text-slate-500">
                {selectedLessonId} / {ACADEMY_LESSONS.length}
              </span>

              <button
                disabled={selectedLessonId >= ACADEMY_LESSONS.length}
                onClick={() => setSelectedLessonId((prev) => Math.min(ACADEMY_LESSONS.length, prev + 1))}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors shadow-sm"
              >
                <span>
                  {language === 'hy' ? 'Հաջորդ դաս' : language === 'ru' ? 'Следующий урок' : 'Next Lesson'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
