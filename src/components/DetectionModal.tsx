import React from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Gauge,
  Activity,
  Compass,
  Clock,
  Waves,
  Zap,
} from 'lucide-react';
import { Language, SpoofingDetectionResult } from '../types';

interface DetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  detection: SpoofingDetectionResult;
  language: Language;
}

export const DetectionModal: React.FC<DetectionModalProps> = ({
  isOpen,
  onClose,
  detection,
  language,
}) => {
  if (!isOpen) return null;

  const getSeverityBadge = () => {
    switch (detection.severity) {
      case 'CRITICAL':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
            {language === 'hy'
              ? '🚨 ԿՐԻՏԻԿԱԿԱՆ ՍՊՈՒՖԻՆԳ'
              : language === 'ru'
              ? '🚨 КРИТИЧЕСКИЙ СПУФИНГ'
              : '🚨 CRITICAL SPOOF ATTACK'}
          </span>
        );
      case 'ELEVATED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50">
            {language === 'hy'
              ? '⚠️ ԲԱՐՁՐԱՑՎԱԾ ԱՆՈՄԱԼԻԱ'
              : language === 'ru'
              ? '⚠️ ПОВЫШЕННАЯ АНОМАЛИЯ'
              : '⚠️ ANOMALY ELEVATED'}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
            {language === 'hy'
              ? '🛡️ ԱԶԴԱՆՇԱՆՆԵՐԸ ՆՈՐՄԱԼ ԵՆ'
              : language === 'ru'
              ? '🛡️ СИГНАЛЫ В НОРМЕ'
              : '🛡️ ALL SIGNALS NORMAL'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-200 flex flex-col gap-5 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                detection.isSpoofed
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              }`}
            >
              {detection.isSpoofed ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {language === 'en' && 'Anti-Spoofing Anomaly Detection Dashboard'}
                  {language === 'ru' && 'Панель обнаружения спуфинга и аномалий'}
                  {language === 'hy' && 'Սպուֆինգի և Անոմալիաների Հայտնաբերման Վահանակ'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {language === 'hy'
                  ? 'GNSS Ազդանշանի Ամբողջականության և Ֆիզիկական Էվրիստիկայի Մոնիտորինգ'
                  : language === 'ru'
                  ? 'Мониторинг целостности GNSS сигналов и физических инвариантов'
                  : 'Multi-vector GNSS Signal Integrity & Physical Heuristics'}
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

        {/* Severity Banner & Probability Meter */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
            detection.isSpoofed
              ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50'
              : 'bg-emerald-950/30 border-emerald-500/40'
          }`}
        >
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-sm font-bold text-white">
                {language === 'hy' ? 'Համակարգի կարգավիճակ՝' : language === 'ru' ? 'Статус угрозы:' : 'System Threat Status:'}
              </span>
              {getSeverityBadge()}
            </div>
            <p className="text-xs text-slate-300">
              {detection.isSpoofed
                ? language === 'hy'
                  ? 'Ֆիզիկական մի քանի ինվարիանտներ խախտված են: Նավիգացիոն լուծումը կեղծված է:'
                  : language === 'ru'
                  ? 'Нарушены физические инварианты. Навигационное решение скомпрометировано!'
                  : 'Multiple physical invariants violated. Navigation solution is compromised!'
                : language === 'hy'
                ? 'Պսևդոհեռավորության մնացորդները, ժամացույցի շեղումը և կինեմատիկան համապատասխանում են իրական ուղեծրային ֆիզիկային:'
                : language === 'ru'
                ? 'Невязки псевдодальностей, уход часов и кинематика соответствуют физике орбит.'
                : 'Pseudorange residuals, clock drift, and kinematics match genuine orbital physics.'}
            </p>
          </div>

          {/* Probability Gauge Circle */}
          <div className="flex flex-col items-center justify-center bg-slate-950/80 px-4 py-3 rounded-2xl border border-slate-800 min-w-[120px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {language === 'hy' ? 'Սպուֆինգի հավանականություն' : language === 'ru' ? 'Вероятность спуфинга' : 'Spoof Probability'}
            </span>
            <div
              className={`text-2xl font-black font-mono mt-0.5 ${
                detection.probabilityScore > 50
                  ? 'text-rose-400 animate-pulse'
                  : detection.probabilityScore > 20
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {detection.probabilityScore}%
            </div>
            {/* Mini Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  detection.probabilityScore > 50
                    ? 'bg-rose-500'
                    : detection.probabilityScore > 20
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${detection.probabilityScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6 Defense Vectors Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hy'
              ? 'Ակտիվ Բազմավեկտոր Ամբողջականության Ստուգումներ'
              : language === 'ru'
              ? 'Активные проверки целостности'
              : 'Active Multi-Vector Integrity Checks'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. RAIM Residual Consistency */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.raimFailed
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  {language === 'hy' ? 'RAIM Մնացորդների Ստուգում' : language === 'ru' ? 'Контроль невязок RAIM' : 'RAIM Residual Check'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.raimFailed
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.raimFailed
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (> 50մ)' : language === 'ru' ? 'ОШИБКА (> 50м)' : 'FAIL (> 50m)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ (Chi-Sq ok)' : language === 'ru' ? 'НОРМА (Chi-Sq ok)' : 'PASS (Chi-Square ok)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Ընդունիչի ինքնավար ամբողջականության մոնիտորինգը (RAIM) ստուգում է պսևդոհեռավորությունների հավասարումների համակարգը երկրաչափական հակասությունների համար:'
                  : language === 'ru'
                  ? 'RAIM проверяет переопределенную систему уравнений на наличие геометрических противоречий.'
                  : 'Receiver Autonomous Integrity Monitoring tests overdetermined pseudorange equations for geometrical contradictions.'}
              </p>
            </div>

            {/* 2. Kinematic Velocity Limit */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.velocityExceeded
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  {language === 'hy' ? 'Կինեմատիկ Հավաստիություն' : language === 'ru' ? 'Кинематическая правдоподобность' : 'Kinematic Plausibility'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.velocityExceeded
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.velocityExceeded
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (> 1000 կմ/ժ թռիչք)' : language === 'ru' ? 'ОШИБКА (> 1000 км/ч)' : 'FAIL (> 1000 km/h jump)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ' : language === 'ru' ? 'НОРМА' : 'PASS')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Հայտնաբերում է ակնթարթային դիրքային տելեպորտացիան և ընդունիչի ֆիզիկապես անհնար արագացումները:'
                  : language === 'ru'
                  ? 'Обнаруживает мгновенные скачки координат и невозможные ускорения приемника.'
                  : 'Detects instantaneous position teleportation and impossible receiver accelerations.'}
              </p>
            </div>

            {/* 3. Clock Bias Jump */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.clockJumpDetected
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {language === 'hy' ? 'Ընդունիչի Ժամացույցի Թռիչք' : language === 'ru' ? 'Скачок часов приемника' : 'Receiver Clock Jump'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.clockJumpDetected
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.clockJumpDetected
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (> 50 նվ շեղում)' : language === 'ru' ? 'ОШИБКА (> 50 нс сдвиг)' : 'FAIL (> 50 ns shift)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ' : language === 'ru' ? 'НОРМА' : 'PASS')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Ներքին քվարցային գեներատորի Δt շեղման անընդհատ մոնիտորինգ UTC կայուն ժամանակի նկատմամբ:'
                  : language === 'ru'
                  ? 'Непрерывный мониторинг смещения кварцевого генератора Δt относительно шкалы UTC.'
                  : 'Continuous monitoring of internal quartz oscillator bias Δt against stable UTC track.'}
              </p>
            </div>

            {/* 4. Inertial Navigation Divergence (INS) */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.inertialDivergence
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  {language === 'hy' ? 'INS / Սենսորային Միաձուլում' : language === 'ru' ? 'ИНС / Комплексирование датчиков' : 'INS / Sensor Fusion'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.inertialDivergence
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.inertialDivergence
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (INS շեղված է)' : language === 'ru' ? 'ОШИБКА (ИНС расходится)' : 'FAIL (INS Diverged)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ (Համահունչ)' : language === 'ru' ? 'НОРМА (Когерентно)' : 'PASS (Coherent)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Համեմատում է GPS դիրքը տեղական աքսելերոմետրերի, գիրոսկոպների և մագնիսական կողմնացույցի իներցիալ հաշվարկի հետ:'
                  : language === 'ru'
                  ? 'Сверяет координаты GPS с данными акселерометров, гироскопов и электронного компаса.'
                  : 'Cross-validates GPS fixes with local accelerometers, gyroscopes, and magnetic compass dead-reckoning.'}
              </p>
            </div>

            {/* 5. C/N0 Power & SNR Anomaly */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.snrAnomaly
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-purple-400" />
                  {language === 'hy' ? 'Ազդանշանի Հզորություն (C/N0)' : language === 'ru' ? 'Мощность сигнала (C/N0)' : 'Signal Power (C/N0)'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.snrAnomaly
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.snrAnomaly
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (Անբնական բարձր)' : language === 'ru' ? 'ОШИБКА (Слишком мощный)' : 'FAIL (Unnatural High Power)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ (38-48 dB-Hz)' : language === 'ru' ? 'НОРМА (38-48 dB-Hz)' : 'PASS (38-48 dB-Hz)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Վերգետնյա սպուֆերները սովորաբար ճառագայթում են ավելի բարձր RF հզորություն (-120 dBW)՝ իրական արբանյակները ճնշելու համար (-160 dBW):'
                  : language === 'ru'
                  ? 'Наземные спуферы излучают высокую мощность (-120 dBW) для подавления подлинных сигналов (-160 dBW).'
                  : 'Terrestrial spoofers usually broadcast higher RF power (-120 dBW) to overpower authentic satellites (-160 dBW).'}
              </p>
            </div>

            {/* 6. Doppler & Angle of Arrival (AoA) */}
            <div
              className={`p-3.5 rounded-2xl border ${
                detection.checks.dopplerInconsistency
                  ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-cyan-400" />
                  {language === 'hy' ? 'Դոպլեր և Ժամանման Անկյուն' : language === 'ru' ? 'Доплер и угол прихода (AoA)' : 'Doppler & Arrival Angle'}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    detection.checks.dopplerInconsistency
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {detection.checks.dopplerInconsistency
                    ? (language === 'hy' ? 'ԽԱԽՏՈՒՄ (Նույն ուղղություն)' : language === 'ru' ? 'ОШИБКА (Один источник)' : 'FAIL (Identical Angle)')
                    : (language === 'hy' ? 'ՆՈՐՄԱ (Սփռված)' : language === 'ru' ? 'НОРМА (Рассредоточены)' : 'PASS (Dispersed)')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Մեկ հաղորդիչով սպուֆերները բոլոր ազդանշաններն արձակում են մեկ ֆիզիկական ուղղությունից, ինչը հեշտությամբ բացահայտվում է փուլային ինտերֆերոմետրիայով:'
                  : language === 'ru'
                  ? 'Спуферы с одним передатчиком излучают все сигналы с одного направления, что фиксируется фазовой интерферометрией.'
                  : 'Single-transmitter spoofers emit all satellite signals from one physical direction, easily caught by dual-antenna phase interferometry.'}
              </p>
            </div>
          </div>
        </div>

        {/* Educational Mitigation Recommendations */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="font-semibold text-white">
            {language === 'hy' ? 'Առաջարկվող Պաշտպանական Միջոցառումներ՝' : language === 'ru' ? 'Рекомендуемые меры защиты:' : 'Recommended Countermeasures:'}
          </div>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
            <li>
              <strong className="text-slate-200">
                {language === 'hy'
                  ? 'Galileo OS-NMA (Կրիպտոգրաֆիկ աուտենտիֆիկացիա)՝'
                  : language === 'ru'
                  ? 'Galileo OS-NMA (Криптографическая аутентификация):'
                  : 'Galileo OS-NMA (Open Service Navigation Message Authentication):'}
              </strong>{' '}
              {language === 'hy'
                ? 'Թվային ստորագրությունները կանխում են էֆեմերիդների հեռարձակման կեղծումը:'
                : language === 'ru'
                ? 'Цифровые подписи предотвращают подделку навигационных эфемерид.'
                : 'Cryptographic digital signatures prevent forgery of ephemeris broadcast data.'}
            </li>
            <li>
              <strong className="text-slate-200">
                {language === 'hy'
                  ? 'CRPA (Ֆազավորված անտենային ճաղավանդակներ)՝'
                  : language === 'ru'
                  ? 'CRPA (Адаптивные антенные решетки):'
                  : 'CRPA (Controlled Reception Pattern Antennas):'}
              </strong>{' '}
              {language === 'hy'
                ? 'Ձևավորում են ուղղորդված զրոներ (spatial nulls) դեպի վերգետնյա սպուֆերները:'
                : language === 'ru'
                ? 'Формируют диаграммные провалы в направлении наземных помех и спуферов.'
                : 'Multi-element phased arrays form directional nulls toward ground jammers/spoofers.'}
            </li>
            <li>
              <strong className="text-slate-200">
                {language === 'hy'
                  ? 'Սերտ կապակցված GPS/INS՝'
                  : language === 'ru'
                  ? 'Глубоко интегрированная GPS/ИНС:'
                  : 'Tightly-Coupled GPS/INS:'}
              </strong>{' '}
              {language === 'hy'
                ? 'Իներցիալ համակարգը պահպանում է ճշգրիտ հետագիծը նույնիսկ GPS-ի ամբողջական կորստի ժամանակ:'
                : language === 'ru'
                ? 'Инерциальная навигация удерживает траекторию даже при полном захвате GPS спуфером.'
                : 'Inertial guidance holds mission navigation trajectory even during total satellite capture.'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
