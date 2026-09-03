import React, { useState } from 'react';
import { UserLocation, SpoofConfig, PseudorangeComparison, Language } from '../types';
import {
  ShieldAlert,
  Radio,
  RotateCcw,
  Sliders,
  Crosshair,
  Clock,
  Waves,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Plane,
  Ship,
  Navigation,
  Ban,
} from 'lucide-react';

interface SpoofPanelProps {
  userLocation: UserLocation;
  spoofConfig: SpoofConfig;
  onUpdateSpoofConfig: (config: SpoofConfig) => void;
  onResetRealLocation: () => void;
  pseudorangeComparisons: PseudorangeComparison[];
  language?: Language;
}

interface AttackScenario {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  targetName: Record<Language, string>;
  lat: number;
  lng: number;
  alt: number;
  clockDriftNs: number;
  noiseKm: number;
  affectedCount: number;
  icon: React.ReactNode;
}

const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'airport_diversion',
    name: {
      hy: 'Օդանավակայան Վայրէջքուղու Շեղում',
      ru: 'Смещение глиссады аэропорта',
      en: 'Airport Runway Offset',
    },
    description: {
      hy: 'Օդանավի մոտեցման վեկտորը 500մ-ով շեղում է վայրէջքուղու կենտրոնական գծից:',
      ru: 'Смещает глиссаду самолета на 500 м от оси взлетно-посадочной полосы.',
      en: 'Shifts aircraft approach vector 500m off runway center line.',
    },
    targetName: {
      hy: 'Շառլ դը Գոլ Օդանավակայան (Շեղում)',
      ru: 'Аэропорт Шарль де Голль (Смещение)',
      en: 'Charles de Gaulle Airport (Runway 26L offset)',
    },
    lat: 49.0097,
    lng: 2.5479,
    alt: 110,
    clockDriftNs: 45,
    noiseKm: 2,
    affectedCount: 6,
    icon: <Plane className="w-3.5 h-3.5 text-sky-400" />,
  },
  {
    id: 'maritime_ghost',
    name: {
      hy: 'Ծովային Ուրվական Նավ',
      ru: 'Морской корабль-призрак',
      en: 'Maritime Ghost Ship',
    },
    description: {
      hy: 'AIS և GPS սպուֆինգ, որը նավը ստիպողաբար տանում է օտարերկրյա տարածքային ջրեր:',
      ru: 'AIS и GPS спуфинг, уводящий судно в чужие территориальные воды.',
      en: 'AIS & GPS spoofing forcing vessel into foreign territorial waters.',
    },
    targetName: {
      hy: 'Սև ծով / Սևաստոպոլի մատույցներ',
      ru: 'Черное море / Подходы к Севастополю',
      en: 'Black Sea / Sevastopol Approaches',
    },
    lat: 44.6166,
    lng: 33.5254,
    alt: 0,
    clockDriftNs: 120,
    noiseKm: 5,
    affectedCount: 8,
    icon: <Ship className="w-3.5 h-3.5 text-cyan-400" />,
  },
  {
    id: 'drone_geofence',
    name: {
      hy: 'Անօդաչու Սարքի Գեոցանկապատի Խախտում',
      ru: 'Взлом геозоны беспилотника (UAV)',
      en: 'Drone Geofence Breach',
    },
    description: {
      hy: 'Խաբում է ինքնավար ԱԹՍ-ի ավտոպիլոտին՝ ուղղորդելով դեպի պետական սահմանափակ օդային տարածք:',
      ru: 'Обманывает автопилот БПЛА, направляя его в закрытую запретную зону.',
      en: 'Tricks autonomous UAV autopilot into restricted government airspace.',
    },
    targetName: {
      hy: 'Սահմանափակ Օդային Տարածք P-56',
      ru: 'Запретная зона воздушного пространства P-56',
      en: 'Restricted Airspace Zone P-56',
    },
    lat: 38.8977,
    lng: -77.0365,
    alt: 180,
    clockDriftNs: 80,
    noiseKm: 1,
    affectedCount: 7,
    icon: <Ban className="w-3.5 h-3.5 text-rose-400" />,
  },
  {
    id: 'urban_delivery_drift',
    name: {
      hy: 'Առաքման ԱԹՍ-ի Շեղում',
      ru: 'Дрейф дрона доставки',
      en: 'Delivery Drone Drift',
    },
    description: {
      hy: 'Ժամանակային աստիճանական շեղում, որը շեղում է ավտոմատացված ծանրոցների առաքումը:',
      ru: 'Постепенный сдвиг временных меток, сбивающий автономную доставку груза.',
      en: 'Gradual timing skew diverting automated payload package delivery.',
    },
    targetName: {
      hy: 'Քաղաքային Երկնաքերի Տանիք',
      ru: 'Крыша высотного здания в центре',
      en: 'Downtown High-Rise Rooftop',
    },
    lat: 37.7749,
    lng: -122.4194,
    alt: 85,
    clockDriftNs: -60,
    noiseKm: 4,
    affectedCount: 5,
    icon: <Navigation className="w-3.5 h-3.5 text-amber-400" />,
  },
];

const PRESET_TARGETS = [
  {
    name: { hy: 'Փարիզ, Ֆրանսիա', ru: 'Париж, Франция', en: 'Paris, France' },
    lat: 48.8566,
    lng: 2.3522,
    alt: 35,
  },
  {
    name: { hy: 'Տոկիո, Ճապոնիա', ru: 'Токио, Япония', en: 'Tokyo, Japan' },
    lat: 35.6762,
    lng: 139.6503,
    alt: 40,
  },
  {
    name: { hy: 'Բերմուդյան Եռանկյունի', ru: 'Бермудский треугольник', en: 'Bermuda Triangle' },
    lat: 25.0,
    lng: -71.0,
    alt: 0,
  },
  {
    name: { hy: 'Մոսկվայի Կրեմլ', ru: 'Московский Кремль', en: 'Moscow Kremlin' },
    lat: 55.7512,
    lng: 37.6184,
    alt: 156,
  },
  {
    name: { hy: 'Գրինվիչ, ՄԹ', ru: 'Гринвич, Великобритания', en: 'Greenwich, UK' },
    lat: 51.4769,
    lng: 0.0005,
    alt: 48,
  },
  {
    name: { hy: 'Սիդնեյ, Ավստրալիա', ru: 'Сидней, Австралия', en: 'Sydney, Australia' },
    lat: -33.8688,
    lng: 151.2093,
    alt: 25,
  },
];

export const SpoofPanel: React.FC<SpoofPanelProps> = ({
  userLocation,
  spoofConfig,
  onUpdateSpoofConfig,
  onResetRealLocation,
  pseudorangeComparisons,
  language = 'hy',
}) => {
  const [latInput, setLatInput] = useState<string>(spoofConfig.targetLat.toString());
  const [lngInput, setLngInput] = useState<string>(spoofConfig.targetLng.toString());
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Sync inputs if target changes externally (e.g. from 2D map click)
  React.useEffect(() => {
    const latStr = spoofConfig.targetLat.toString();
    const lngStr = spoofConfig.targetLng.toString();
    setLatInput((prev) => (prev !== latStr ? latStr : prev));
    setLngInput((prev) => (prev !== lngStr ? lngStr : prev));
  }, [spoofConfig.targetLat, spoofConfig.targetLng]);

  const handleApplyPreset = (preset: (typeof PRESET_TARGETS)[0]) => {
    const localizedName = preset.name[language] || preset.name.en;
    setActivePreset(localizedName);
    setLatInput(preset.lat.toString());
    setLngInput(preset.lng.toString());
    onUpdateSpoofConfig({
      ...spoofConfig,
      targetLat: preset.lat,
      targetLng: preset.lng,
      targetAlt: preset.alt,
      targetName: localizedName,
    });
  };

  const handleApplyScenario = (scenario: AttackScenario) => {
    const localizedTarget = scenario.targetName[language] || scenario.targetName.en;
    setActivePreset(localizedTarget);
    setLatInput(scenario.lat.toString());
    setLngInput(scenario.lng.toString());
    onUpdateSpoofConfig({
      ...spoofConfig,
      isActive: true,
      targetLat: scenario.lat,
      targetLng: scenario.lng,
      targetAlt: scenario.alt,
      targetName: localizedTarget,
      clockDriftNs: scenario.clockDriftNs,
      noiseKm: scenario.noiseKm,
      affectedCount: scenario.affectedCount,
    });
  };

  const handleCoordinateChange = (newLatStr: string, newLngStr: string) => {
    setLatInput(newLatStr);
    setLngInput(newLngStr);
    const parsedLat = parseFloat(newLatStr);
    const parsedLng = parseFloat(newLngStr);
    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      setActivePreset(null);
      onUpdateSpoofConfig({
        ...spoofConfig,
        targetLat: Math.max(-90, Math.min(90, parsedLat)),
        targetLng: Math.max(-180, Math.min(180, parsedLng)),
        targetName:
          language === 'hy'
            ? 'Հարմարեցված Թիրախ'
            : language === 'ru'
            ? 'Пользовательская цель'
            : 'Custom Target',
      });
    }
  };

  const toggleSpoofing = () => {
    onUpdateSpoofConfig({
      ...spoofConfig,
      isActive: !spoofConfig.isActive,
    });
  };

  // Calculate distance between real and spoofed location on Earth (Haversine)
  const calculateEarthDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const earthOffsetKm = calculateEarthDistance(
    userLocation.lat,
    userLocation.lng,
    spoofConfig.targetLat,
    spoofConfig.targetLng
  );

  return (
    <div className="flex flex-col gap-4 text-slate-200">
      {/* Educational Simulation Disclaimer Banner */}
      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-300 block mb-0.5">
            {language === 'hy'
              ? 'GPS Խաբեության (Սպուֆինգի) սիմուլյացիա'
              : language === 'ru'
              ? 'Симуляция GPS спуфинга — Обучающий стенд'
              : 'GPS Spoofing — Educational Simulation'}
          </span>
          <p className="text-[11px] text-amber-200/80">
            {language === 'hy'
              ? 'Այս սիմուլյացիան փոփոխում է վիրտուալ ընդունիչի չափումները: Այն ազդանշաններ չի հաղորդում, չի խանգարում GPS-ին և չի փոփոխում սարքի իրական GPS-ը:'
              : language === 'ru'
              ? 'Данная симуляция изменяет измерения виртуального приемника. Она не излучает радиосигналы, не нарушает работу GPS и не изменяет реальный GPS устройства.'
              : "The following simulation modifies virtual receiver measurements. It does not transmit signals, interfere with GPS, or modify the device's real GPS."}
          </p>
        </div>
      </div>

      {/* Real-time GPS Error & Untruthfulness Percentage Card */}
      {(() => {
        const spoofedErrorMeters = Math.round(
          earthOffsetKm * 1000 + Math.abs(spoofConfig.clockDriftNs) * 0.4 + spoofConfig.noiseKm * 1000
        );
        const gpsErrorPercentage = spoofConfig.isActive
          ? Math.min(100.0, Math.max(1.0, (spoofedErrorMeters / 50000) * 100 + (spoofConfig.affectedCount / 12) * 10)).toFixed(1)
          : '0.0';
        return (
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {language === 'hy' ? 'GPS Սխալ և Անվստահելիություն' : language === 'ru' ? 'Ошибка GPS и ненадежность' : 'GPS Error & Untruthfulness'}
              </span>
              <div className="text-lg font-mono font-bold text-rose-400 flex items-center gap-2 mt-0.5">
                <span>{gpsErrorPercentage}%</span>
                <span className="text-xs font-normal text-slate-400">
                  ({spoofedErrorMeters > 1000 ? `${(spoofedErrorMeters / 1000).toFixed(1)} կմ` : `${spoofedErrorMeters} մ`})
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">
                {language === 'hy' ? 'Կարգավիճակ' : language === 'ru' ? 'Статус' : 'Status'}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${spoofConfig.isActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
                {spoofConfig.isActive ? (language === 'hy' ? 'ԽԱԲՎԱԾ' : 'SPOOFED') : (language === 'hy' ? 'ԻՐԱԿԱՆ' : 'AUTHENTIC')}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Spoofing Status & Main Trigger Button */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          spoofConfig.isActive
            ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
            : 'bg-slate-900/60 border-slate-800'
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                spoofConfig.isActive
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {language === 'hy'
                    ? 'GPS Խաբեության (Սպուֆինգի) սիմուլյացիա'
                    : language === 'ru'
                    ? 'Симуляция GPS спуфинга'
                    : 'GPS Spoofing — Educational Simulation'}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    spoofConfig.isActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {spoofConfig.isActive
                    ? language === 'hy'
                      ? '🔴 ՍԻՄՈՒԼԱՑՎԱԾ ԱՆՈՄԱԼԻԱ'
                      : language === 'ru'
                      ? '🔴 СИМУЛИРОВАННАЯ АНОМАЛИЯ'
                      : '🔴 SIMULATED ANOMALY'
                    : language === 'hy'
                    ? '🟢 ԻՐԱԿԱՆ ԺԱՄԱՆԱԿԻ GPS'
                    : language === 'ru'
                    ? '🟢 РЕАЛЬНЫЙ GPS'
                    : '🟢 LIVE REAL GPS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {spoofConfig.isActive
                  ? language === 'hy'
                    ? '⚠️ ՍԻՄՈՒԼԱՑՎԱԾ ՆԱՎԻԳԱՑԻՈՆ ԱՆՈՄԱԼԻԱ. Ընդունիչը խաբված է ուշացած ժամանակային նշագրերով'
                    : language === 'ru'
                    ? '⚠️ СИМУЛИРОВАННАЯ АНОМАЛИЯ: Приемник смещен искаженными временными метками'
                    : '⚠️ SIMULATED NAVIGATION ANOMALY: Receiver tricked by delayed timestamps'
                  : language === 'hy'
                  ? 'Վավերական էֆեմերիդներ: Ուղեծրային երկրաչափությունից հաշվարկված իրական կեղծ հեռավորություններ'
                  : language === 'ru'
                  ? 'Подлинные эфемериды: Реальные псевдодальности на основе орбитальной геометрии'
                  : 'Authentic ephemeris: Real pseudoranges calculated from orbital geometry'}
              </p>
            </div>
          </div>
        </div>

        {/* Animated Educational Workflow Diagram */}
        <div className="my-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hy'
              ? 'Ազդանշանի Մշակման Մոդել:'
              : language === 'ru'
              ? 'Модель сигнального тракта:'
              : 'Signal Pipeline Model:'}
          </span>
          <div className="grid grid-cols-6 gap-1 text-center font-mono text-[8px] sm:text-[9px]">
            <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {language === 'hy' ? 'ԻՐԱԿԱՆ ԱՐԲ.' : language === 'ru' ? 'РЕАЛ. СПУТН.' : 'REAL SATS'}
            </div>
            <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {language === 'hy' ? 'ԵՐԿՐԱՉԱՓ.' : language === 'ru' ? 'ГЕОМЕТРИЯ' : 'GEOMETRY'}
            </div>
            <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {language === 'hy' ? 'ՆՈՐՄԱԼ ՀԵՌ.' : language === 'ru' ? 'НОРМ. ДАЛЬН.' : 'NORMAL RANGES'}
            </div>
            <div
              className={`p-1 rounded border transition-colors ${
                spoofConfig.isActive
                  ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {spoofConfig.isActive
                ? language === 'hy'
                  ? 'ՓՈՓՈԽՎԱԾ'
                  : language === 'ru'
                  ? 'МОДИФИЦИР.'
                  : 'MODIFIED'
                : language === 'hy'
                ? 'ՇՐՋԱՆՑՈՒՄ'
                : language === 'ru'
                ? 'ОБХОД'
                : 'BYPASS'}
            </div>
            <div className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
              {language === 'hy' ? 'ԼՈՒԾԻՉ' : language === 'ru' ? 'РЕШАТЕЛЬ' : 'SOLVER'}
            </div>
            <div
              className={`p-1 rounded border transition-colors ${
                spoofConfig.isActive
                  ? 'bg-rose-900 text-white font-bold border-rose-500'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}
            >
              {spoofConfig.isActive
                ? language === 'hy'
                  ? 'ԿԵՂԾ ԴԻՐՔ'
                  : language === 'ru'
                  ? 'ЛОЖНЫЙ FIX'
                  : 'FALSE FIX'
                : language === 'hy'
                ? 'ԻՐԱԿԱՆ ԴԻՐՔ'
                : language === 'ru'
                ? 'РЕАЛ. FIX'
                : 'REAL FIX'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-spoof"
            onClick={toggleSpoofing}
            className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
              spoofConfig.isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            {spoofConfig.isActive ? (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>
                  {language === 'hy'
                    ? 'Դադարեցնել Սպուֆինգի Գրոհը'
                    : language === 'ru'
                    ? 'Остановить атаку спуфинга'
                    : 'Cease Spoof Attack'}
                </span>
              </>
            ) : (
              <>
                <Crosshair className="w-4 h-4" />
                <span>
                  {language === 'hy'
                    ? 'Սիմուլյացնել GPS Սպուֆինգը'
                    : language === 'ru'
                    ? 'Симулировать GPS спуфинг'
                    : 'Simulate GPS Spoofing'}
                </span>
              </>
            )}
          </button>

          {spoofConfig.isActive && (
            <button
              id="btn-reset-real-gps"
              onClick={onResetRealLocation}
              title={
                language === 'hy'
                  ? 'Վերականգնել իրական GPS կոորդինատները'
                  : language === 'ru'
                  ? 'Сбросить к реальным координатам GPS'
                  : 'Reset to Real GPS Coordinates'
              }
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'hy' ? 'Վերականգնել' : language === 'ru' ? 'Сброс' : 'Reset'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Preconfigured Attack Scenarios */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {language === 'hy'
              ? 'Իրական Գրոհների Սցենարներ'
              : language === 'ru'
              ? 'Сценарии реальных атак'
              : 'Real-World Attack Scenarios'}
          </span>
          <span className="text-[10px] text-amber-400 font-bold">
            {language === 'hy' ? '1-Կլիկ Սիմուլյացիա' : language === 'ru' ? '1-Клик Симуляция' : '1-Click Simulation'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ATTACK_SCENARIOS.map((scen) => (
            <button
              key={scen.id}
              onClick={() => handleApplyScenario(scen)}
              className="p-2.5 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                  {scen.icon}
                </div>
                <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                  {scen.name[language] || scen.name.en}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {scen.description[language] || scen.description.en}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Target Location Presets */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {language === 'hy'
              ? 'Թիրախային Կարգավորումներ'
              : language === 'ru'
              ? 'Предустановки целей'
              : 'Target Presets'}
          </span>
          <span className="text-[11px] text-slate-400">
            {language === 'hy'
              ? 'Ընտրեք սիմուլյացվող թիրախը'
              : language === 'ru'
              ? 'Выберите симулируемую цель'
              : 'Select simulated target'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_TARGETS.map((preset) => {
            const isSelected =
              Math.abs(spoofConfig.targetLat - preset.lat) < 0.01 &&
              Math.abs(spoofConfig.targetLng - preset.lng) < 0.01;
            const localizedName = preset.name[language] || preset.name.en;
            return (
              <button
                key={preset.name.en}
                onClick={() => handleApplyPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs text-left font-medium transition-all truncate flex items-center justify-between ${
                  isSelected
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
              >
                <span className="truncate">{localizedName}</span>
                {isSelected && <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Custom Coordinates Input */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <span className="text-[11px] text-slate-400 font-medium">
            {language === 'hy'
              ? 'Կոորդինատներ (կամ կտտացրեք 2D քարտեզին):'
              : language === 'ru'
              ? 'Пользовательские координаты (или клик по карте):'
              : 'Custom Coordinates (or click on 2D map):'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {language === 'hy'
                  ? 'Լայնություն (-90-ից 90)'
                  : language === 'ru'
                  ? 'Широта (-90 до 90)'
                  : 'Latitude (-90 to 90)'}
              </label>
              <input
                id="input-spoof-lat"
                type="number"
                step="0.0001"
                value={latInput}
                onChange={(e) => handleCoordinateChange(e.target.value, lngInput)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                {language === 'hy'
                  ? 'Երկայնություն (-180-ից 180)'
                  : language === 'ru'
                  ? 'Долгота (-180 до 180)'
                  : 'Longitude (-180 to 180)'}
              </label>
              <input
                id="input-spoof-lng"
                type="number"
                step="0.0001"
                value={lngInput}
                onChange={(e) => handleCoordinateChange(latInput, e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signal Noise & Clock Drift Sliders */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {language === 'hy'
                ? 'Ազդանշանի Փոփոխման Պարամետրեր'
                : language === 'ru'
                ? 'Параметры манипуляции сигналами'
                : 'Signal Manipulation Parameters'}
            </span>
          </div>
        </div>

        {/* Clock Drift Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {language === 'hy'
                ? 'Ժամացույցի Սխալ (Δt bias):'
                : language === 'ru'
                ? 'Сдвиг часов (Δt bias):'
                : 'Clock Bias (Δt bias):'}
            </span>
            <span className="font-mono text-amber-400 font-semibold">
              {spoofConfig.clockDriftNs > 0 ? `+${spoofConfig.clockDriftNs}` : spoofConfig.clockDriftNs} ns
            </span>
          </div>
          <input
            id="slider-clock-drift"
            type="range"
            min="-500"
            max="500"
            step="10"
            value={spoofConfig.clockDriftNs}
            onChange={(e) =>
              onUpdateSpoofConfig({
                ...spoofConfig,
                clockDriftNs: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">
            {language === 'hy'
              ? 'Փոխում է արբանյակի կեղծ հեռավորության ժամանակային նշագրումը ± նանովայրկյաններով (1 նվ ≈ 30 սմ):'
              : language === 'ru'
              ? 'Смещает метку времени псевдодальности на ± наносекунд (1 нс ≈ 30 см).'
              : 'Shifts satellite pseudorange timestamp calculation by ± nanoseconds (1 ns ≈ 30 cm).'}
          </span>
        </div>

        {/* Noise Jitter Slider */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              {language === 'hy'
                ? 'Իոնոսֆերային / Բազմուղի Տատանում (Jitter):'
                : language === 'ru'
                ? 'Ионосферный / многолучевой джиттер:'
                : 'Ionospheric / Multipath Jitter:'}
            </span>
            <span className="font-mono text-cyan-400 font-semibold">
              {spoofConfig.noiseKm} km
            </span>
          </div>
          <input
            id="slider-noise-jitter"
            type="range"
            min="0"
            max="30"
            step="1"
            value={spoofConfig.noiseKm}
            onChange={(e) =>
              onUpdateSpoofConfig({
                ...spoofConfig,
                noiseKm: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">
            {language === 'hy'
              ? 'Ավելացնում է սիմուլյացված աղմուկի տատանում հետևման ալիքների վրա:'
              : language === 'ru'
              ? 'Добавляет симулированный шум псевдодальности в каналы слежения.'
              : 'Adds simulated pseudorange noise jitter onto tracking channels.'}
          </span>
        </div>

        {/* Affected Satellites Count Slider */}
        <div className="flex flex-col gap-1 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Radio className="w-3 h-3 text-rose-400" />
              {language === 'hy'
                ? 'Ազդված Արբանյակներ:'
                : language === 'ru'
                ? 'Затронутые спутники:'
                : 'Affected Satellites:'}
            </span>
            <span className="font-mono text-rose-400 font-semibold">
              {spoofConfig.affectedCount || 8}{' '}
              {language === 'hy' ? 'արբանյակ' : language === 'ru' ? 'спутников' : 'satellites'}
            </span>
          </div>
          <input
            id="slider-affected-sats"
            type="range"
            min="4"
            max="12"
            step="1"
            value={spoofConfig.affectedCount || 8}
            onChange={(e) =>
              onUpdateSpoofConfig({
                ...spoofConfig,
                affectedCount: parseInt(e.target.value, 10),
              })
            }
            className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="text-[10px] text-slate-500">
            {language === 'hy'
              ? 'Ընտրողական սպուֆինգ. Ավելի քիչ արբանյակների վրա ազդելը առաջացնում է ավելի բարձր մնացորդային հակասություններ RAIM հայտնաբերման համար:'
              : language === 'ru'
              ? 'Выборочный спуфинг: влияние на меньшее число спутников создает высокие невязки для обнаружения алгоритмом RAIM!'
              : 'Selective spoofing: Affecting fewer satellites causes higher residual contradictions for RAIM detection!'}
          </span>
        </div>
      </div>

      {/* Pseudorange Delay Impact Table & Position Solution Comparison */}
      {spoofConfig.isActive && pseudorangeComparisons.length > 0 && (
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-rose-900/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              {language === 'hy'
                ? 'Դիրքի Լուծում և Արբանյակային Հեռավորությունների Համեմատություն'
                : language === 'ru'
                ? 'Решение позиции и сравнение дальностей спутников'
                : 'Position Solution & Satellite Range Comparison'}
            </span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
              {language === 'hy' ? 'Դիրքի սխալ՝ ' : language === 'ru' ? 'Ошибка позиции: ' : 'Position error: '}
              {earthOffsetKm.toFixed(1)} km
            </span>
          </div>

          {/* Normal vs Simulated Position Card */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase mb-0.5">
                {language === 'hy' ? '● Նորմալ Դիրք' : language === 'ru' ? '● Нормальная позиция' : '● Normal Position'}
              </span>
              <div className="text-white font-semibold">
                {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}°
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {userLocation.name || (language === 'hy' ? 'Իրական Ընդունիչ' : 'Authentic Receiver')}
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-900/50">
              <span className="text-[10px] text-rose-400 font-bold block uppercase mb-0.5">
                {language === 'hy' ? '▲ Սիմուլացված Դիրք' : language === 'ru' ? '▲ Симулированная позиция' : '▲ Simulated Position'}
              </span>
              <div className="text-rose-300 font-semibold">
                {spoofConfig.targetLat.toFixed(4)}°, {spoofConfig.targetLng.toFixed(4)}°
              </div>
              <div className="text-[10px] text-rose-400/80 truncate">
                {spoofConfig.targetName || (language === 'hy' ? 'Սիմուլացված Թիրախ' : 'Simulated Target')}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {language === 'hy'
              ? 'Արբանյակների հեռավորության համեմատությունը դինամիկ հաշվարկվում է իրական և սիմուլացված կոորդինատների միջև:'
              : language === 'ru'
              ? 'Сравнение дальностей спутников динамически рассчитывается между истинными и симулированными координатами:'
              : 'Satellite range comparison dynamically computed from true vs simulated receiver coordinates:'}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-1">
                  <th className="pb-1 font-semibold">
                    {language === 'hy' ? 'Արբանյակ' : language === 'ru' ? 'Спутник' : 'Satellite'}
                  </th>
                  <th className="pb-1 font-semibold">
                    {language === 'hy' ? 'Նորմալ Հեռ.' : language === 'ru' ? 'Норм. дальность' : 'Normal Range'}
                  </th>
                  <th className="pb-1 font-semibold">
                    {language === 'hy' ? 'Սիմուլ. Հեռ.' : language === 'ru' ? 'Симул. дальность' : 'Simulated Range'}
                  </th>
                  <th className="pb-1 font-semibold text-right">
                    {language === 'hy' ? 'Տարբերություն' : language === 'ru' ? 'Разница' : 'Difference'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pseudorangeComparisons.slice(0, 8).map((comp) => {
                  const normalRangeKm = comp.realDelayMs * 299.792;
                  const simulatedRangeKm = comp.spoofedDelayMs * 299.792;
                  const diffKm = simulatedRangeKm - normalRangeKm;

                  return (
                    <tr key={comp.satelliteId} className="hover:bg-slate-800/30">
                      <td className="py-1.5 text-slate-300 truncate max-w-[90px] font-medium">
                        {comp.satelliteName.replace(/NAVSTAR\s*/i, 'PRN ')}
                      </td>
                      <td className="py-1.5 text-slate-300">
                        {normalRangeKm.toFixed(0)} km
                      </td>
                      <td className="py-1.5 text-rose-300 font-semibold">
                        {simulatedRangeKm.toFixed(0)} km
                      </td>
                      <td className="py-1.5 text-right font-bold text-amber-400">
                        {diffKm > 0 ? `+${diffKm.toFixed(1)} km` : `${diffKm.toFixed(1)} km`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
