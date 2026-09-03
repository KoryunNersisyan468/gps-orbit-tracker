import React, { useState } from 'react';
import {
  SatelliteData,
  UserLocation,
  SpoofConfig,
  PseudorangeComparison,
  DopValues,
  Language,
  ConstellationType,
} from '../types';
import { SpoofPanel } from './SpoofPanel';
import {
  Navigation,
  Radio,
  Satellite,
  Compass,
  Sliders,
  MapPin,
  Clock,
  Layers,
  Info,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Activity,
  Gauge,
  HelpCircle,
} from 'lucide-react';
import { CONSTELLATION_INFO } from '../data/constellations';
import { TRANSLATIONS } from '../i18n/translations';
import { getDopQualityDescription } from '../utils/dop';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: UserLocation;
  onRequestGeolocation: () => void;
  isGeoLoading: boolean;
  geoError: string | null;
  satellites: SatelliteData[];
  trilaterationSatellites: SatelliteData[];
  selectedSatellite: SatelliteData | null;
  onSelectSatellite: (sat: SatelliteData | null) => void;
  spoofConfig: SpoofConfig;
  onUpdateSpoofConfig: (config: SpoofConfig) => void;
  onResetRealLocation: () => void;
  pseudorangeComparisons: PseudorangeComparison[];
  onOpenExplainer: () => void;
  dop: DopValues;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userLocation,
  onRequestGeolocation,
  isGeoLoading,
  geoError,
  satellites,
  trilaterationSatellites,
  selectedSatellite,
  onSelectSatellite,
  spoofConfig,
  onUpdateSpoofConfig,
  onResetRealLocation,
  pseudorangeComparisons,
  onOpenExplainer,
  dop,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'spoof' | 'satellites' | 'receiver'>('spoof');
  const [satelliteFilter, setSatelliteFilter] = useState<'visible' | 'all'>('visible');
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationType | 'ALL'>('ALL');

  if (!isOpen) return null;

  const t = TRANSLATIONS[language];

  // Filter satellites
  const displaySatellites = satellites
    .filter((s) => {
      if (selectedConstellation !== 'ALL' && s.constellation !== selectedConstellation) {
        return false;
      }
      if (satelliteFilter === 'visible') {
        return (s.elevation ?? -90) > 0;
      }
      return true;
    })
    .sort((a, b) => (b.elevation ?? 0) - (a.elevation ?? 0));

  const dopQuality = getDopQualityDescription(dop.pdop);

  return (
    <aside
      id="control-sidebar"
      className="absolute top-16 right-0 bottom-0 z-20 w-full sm:w-96 md:w-[440px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-200"
    >
      {/* Navigation Tabs */}
      <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 w-full bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            id="tab-spoof-sim"
            onClick={() => setActiveTab('spoof')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'spoof'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.tabSpoofLab}</span>
          </button>

          <button
            id="tab-satellites"
            onClick={() => setActiveTab('satellites')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'satellites'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>{t.tabSatellites} ({satellites.length})</span>
          </button>

          <button
            id="tab-receiver"
            onClick={() => setActiveTab('receiver')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'receiver'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{t.tabReceiver}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Main Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* TAB 1: GPS Spoofing Simulator */}
        {activeTab === 'spoof' && (
          <SpoofPanel
            userLocation={userLocation}
            spoofConfig={spoofConfig}
            onUpdateSpoofConfig={onUpdateSpoofConfig}
            onResetRealLocation={onResetRealLocation}
            pseudorangeComparisons={pseudorangeComparisons}
            language={language}
          />
        )}

        {/* TAB 2: Active Satellites Constellation List */}
        {activeTab === 'satellites' && (
          <div className="space-y-3 text-slate-200">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'hy'
                  ? 'Համաստեղության Կարգավիճակ'
                  : language === 'ru'
                  ? 'Статус группировок'
                  : 'Constellation Status'}
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setSatelliteFilter('visible')}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    satelliteFilter === 'visible'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-slate-400'
                  }`}
                >
                  {language === 'hy' ? 'Տեսանելի' : language === 'ru' ? 'Видимые' : 'Visible'}
                </button>
                <button
                  onClick={() => setSatelliteFilter('all')}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    satelliteFilter === 'all'
                      ? 'bg-sky-500/20 text-sky-300'
                      : 'text-slate-400'
                  }`}
                >
                  {language === 'hy' ? `Բոլորը (${satellites.length})` : language === 'ru' ? `Все (${satellites.length})` : `All (${satellites.length})`}
                </button>
              </div>
            </div>

            {/* Constellation Chip Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setSelectedConstellation('ALL')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedConstellation === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {language === 'hy' ? 'Բոլորը' : language === 'ru' ? 'Все' : 'All'}
              </button>
              {(Object.keys(CONSTELLATION_INFO) as ConstellationType[]).map((c) => {
                const info = CONSTELLATION_INFO[c];
                const isSelected = selectedConstellation === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSelectedConstellation(c)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                      isSelected ? 'text-white' : 'text-slate-400 hover:text-white bg-slate-800'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${info.color}30` : undefined,
                      border: isSelected ? `1px solid ${info.color}70` : undefined,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Trilateration active banner */}
            <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-800/40 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-emerald-300">
                  {language === 'hy'
                    ? `${trilaterationSatellites.length} արբանյակ 3D ֆիքսացիայում`
                    : language === 'ru'
                    ? `${trilaterationSatellites.length} спутников в 3D фиксации`
                    : `${trilaterationSatellites.length} Satellites in 3D Fix`}
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">
                {language === 'hy' ? 'Առնվազն 4 արբանյակ' : language === 'ru' ? 'Мин. 4 спутника' : 'Min 4 required'}
              </span>
            </div>

            {/* Satellites List */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
              {displaySatellites.map((sat) => {
                const isTrilaterating = trilaterationSatellites.some((s) => s.id === sat.id);
                const isSelected = selectedSatellite?.id === sat.id;
                const info = CONSTELLATION_INFO[sat.constellation];

                return (
                  <div
                    key={sat.id}
                    onClick={() => onSelectSatellite(isSelected ? null : sat)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : isTrilaterating
                        ? 'bg-slate-800/50 border-emerald-500/30 hover:bg-slate-800'
                        : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs border"
                          style={{
                            backgroundColor: `${info.color}20`,
                            borderColor: `${info.color}50`,
                            color: info.color,
                          }}
                        >
                          {sat.name.split(' ')[1] || sat.name.slice(0, 3)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span className="truncate max-w-[120px]">{sat.name}</span>
                            <span
                              className="text-[9px] px-1 py-0.2 rounded font-bold"
                              style={{ color: info.color, backgroundColor: `${info.color}20` }}
                            >
                              {sat.constellation}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NORAD #{sat.noradId} • {language === 'hy' ? 'Բարձր.:' : 'Alt:'} {Math.round(sat.alt)} km
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-mono">
                        <div
                          className={`font-semibold ${
                            (sat.elevation ?? 0) > 0 ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {language === 'hy' ? 'Բարձր.:' : 'El:'} {sat.elevation?.toFixed(1) ?? '—'}°
                        </div>
                        <div className="text-slate-400">
                          {language === 'hy' ? 'Ազիմ.:' : 'Az:'} {sat.azimuth?.toFixed(0) ?? '—'}°
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                      <div>
                        {language === 'hy' ? 'Հեռավորություն:' : 'Range:'} <span className="text-slate-200">{sat.distanceKm?.toFixed(0)} km</span>
                      </div>
                      <div className="text-right">
                        Δt: <span className="text-slate-200">{sat.delayMs?.toFixed(2)} ms</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Receiver Position & Dilution of Precision (DOP) */}
        {activeTab === 'receiver' && (
          <div className="space-y-4 text-slate-200">
            {/* Real Receiver Card */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-sky-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {t.realReceiver}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {userLocation.isReal
                        ? language === 'hy'
                          ? 'Սարքի Գեոլոկացիա'
                          : language === 'ru'
                          ? 'Аппаратная геолокация'
                          : 'Hardware Geolocation'
                        : language === 'hy'
                        ? 'Լռելյայն Բազային Կայան'
                        : language === 'ru'
                        ? 'Базовая станция по умолчанию'
                        : 'Default Preset Coordinate'}
                    </p>
                  </div>
                </div>
                <button
                  id="btn-request-geo"
                  onClick={onRequestGeolocation}
                  disabled={isGeoLoading}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {isGeoLoading
                      ? language === 'hy'
                        ? 'Որոնում...'
                        : 'Locating...'
                      : language === 'hy'
                      ? 'Իմ GPS-ը'
                      : 'Get My GPS'}
                  </span>
                </button>
              </div>

              {geoError && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded-xl text-[11px] text-rose-300">
                  {geoError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div className="p-2 bg-slate-950/60 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'hy' ? 'Լայնություն' : 'Latitude'}
                  </span>
                  <span className="text-sky-300">{userLocation.lat.toFixed(6)}°</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'hy' ? 'Երկայնություն' : 'Longitude'}
                  </span>
                  <span className="text-sky-300">{userLocation.lng.toFixed(6)}°</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'hy' ? 'Բարձրություն' : 'Altitude'}
                  </span>
                  <span className="text-slate-200">{userLocation.alt.toFixed(1)} m</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg">
                  <span className="text-[10px] text-slate-500 block">
                    {language === 'hy' ? 'Ճշգրտություն' : 'Horizontal Accuracy'}
                  </span>
                  <span className="text-slate-200">±{userLocation.accuracy?.toFixed(0) || 10} m</span>
                </div>
              </div>
            </div>

            {/* Dilution of Precision (DOP) Card */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {t.dopTitle}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {language === 'hy'
                        ? 'Արբանյակային Համաստեղության Երկրաչափական Որակ'
                        : language === 'ru'
                        ? 'Геометрическое качество группировки'
                        : 'Geometric Satellite Constellation Quality'}
                    </p>
                  </div>
                </div>

                {/* Rating Badge */}
                <div
                  className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono border"
                  style={{
                    backgroundColor: `${dopQuality.color}20`,
                    borderColor: `${dopQuality.color}50`,
                    color: dopQuality.color,
                  }}
                >
                  {dopQuality.rating}
                </div>
              </div>

              {/* DOP Values Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">PDOP (3D)</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dop.pdop.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">HDOP (Horiz)</span>
                  <span className="text-sm font-bold text-sky-400 mt-0.5 block">{dop.hdop.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">VDOP (Vert)</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{dop.vdop.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">GDOP (Geo)</span>
                  <span className="text-sm font-bold text-indigo-400 mt-0.5 block">{dop.gdop.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">TDOP (Time)</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">{dop.tdop.toFixed(2)}</span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block font-bold">
                    {language === 'hy' ? 'Ֆիքս Sats' : 'Fix Sats'}
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{dop.satelliteCount}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {language === 'hy'
                  ? 'Ավելի ցածր DOP-ը վկայում է արբանյակների լայն անկյունային բաշխվածության մասին՝ բարձրացնելով դիրքորոշման ճշգրտությունը:'
                  : language === 'ru'
                  ? 'Меньший DOP указывает на широкое угловое разнесение спутников, что обеспечивает высокую точность позиционирования.'
                  : 'Lower DOP indicates wide angular separation of visible satellites, multiplying ranging precision into higher accuracy positioning fixes.'}
              </p>
            </div>

            {/* Spoofed Receiver Card (when active) */}
            {spoofConfig.isActive && (
              <div className="p-4 bg-rose-950/40 rounded-2xl border border-rose-500/50 flex flex-col gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                      {t.spoofedTarget}
                    </h4>
                    <p className="text-[11px] text-rose-200">
                      {language === 'hy'
                        ? 'Ընդունիչը հաշվարկում է կեղծ պսևդոհեռավորություններ'
                        : language === 'ru'
                        ? 'Приемник рассчитывает ложные псевдодальности'
                        : 'Receiver calculating false pseudoranges'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-rose-900/40">
                  <div className="p-2 bg-slate-950/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'hy' ? 'Կեղծ Լայնություն' : 'Spoofed Lat'}
                    </span>
                    <span className="text-rose-400 font-bold">{spoofConfig.targetLat.toFixed(6)}°</span>
                  </div>
                  <div className="p-2 bg-slate-950/60 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'hy' ? 'Կեղծ Երկայնություն' : 'Spoofed Lng'}
                    </span>
                    <span className="text-rose-400 font-bold">{spoofConfig.targetLng.toFixed(6)}°</span>
                  </div>
                </div>
              </div>
            )}

            {/* Educational Mini Card */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <h5 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                {language === 'hy' ? 'Ինչպես է աշխատում տրիլատերացիան' : 'How Trilateration Works'}
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'hy'
                  ? 'Առնվազն 4 արբանյակներից ազդանշանի ժամանման ճշգրիտ պահերը չափելով՝ ընդունիչը միաժամանակ լուծում է 4 սֆերիկ հավասարումներ՝ գտնելով լայնությունը, երկայնությունը, բարձրությունը և ժամացույցի շեղումը:'
                  : language === 'ru'
                  ? 'Измеряя точное время прихода сигналов минимум от 4 спутников, приемник решает 4 сферических уравнения для определения координат и сдвига часов.'
                  : 'By measuring the precise arrival times of radio signals from at least 4 satellites, the receiver solves 4 simultaneous sphere equations to find exact latitude, longitude, altitude, and clock offset.'}
              </p>
              <button
                onClick={onOpenExplainer}
                className="mt-1 text-xs text-sky-400 hover:text-sky-300 font-medium text-left flex items-center gap-1"
              >
                <span>{language === 'hy' ? 'Դիտել մաթեմատիկական հավասարումները →' : 'Read Full Mathematical Breakdown →'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <span className="font-mono">
          {language === 'hy' ? 'GNSS Համաստեղություններ' : 'GNSS Constellations'}
        </span>
        <span className="text-sky-400 font-mono">1.575 GHz L1/E1/B1</span>
      </div>
    </aside>
  );
};
