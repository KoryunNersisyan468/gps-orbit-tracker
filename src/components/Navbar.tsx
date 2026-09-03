import React, { useState } from 'react';
import {
  Globe,
  Map as MapIcon,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Satellite,
  HelpCircle,
  Menu,
  X,
  RefreshCw,
  GraduationCap,
  Search,
  Sliders,
  Compass,
  Languages,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import { ConstellationType, Language } from '../types';
import { CONSTELLATION_INFO } from '../data/constellations';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  viewMode: '3D' | '2D';
  onToggleViewMode: (mode: '3D' | '2D') => void;
  isSpoofed: boolean;
  totalSatellites: number;
  visibleCount: number;
  dataSource: 'live' | 'cache';
  onRefreshTle: () => void;
  isLoadingTle: boolean;
  onOpenExplainer: () => void;
  onOpenAcademy: () => void;
  onOpenSearch: () => void;
  onOpenErrorLab: () => void;
  onOpenDetection: () => void;
  onOpenLocationModal?: () => void;
  onOpenHowGpsFindsMe?: () => void;
  onOpenSignalTiming?: () => void;
  onToggleSkyView: () => void;
  isSkyViewOpen: boolean;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  enabledConstellations: Record<ConstellationType, boolean>;
  onToggleConstellation: (c: ConstellationType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onToggleViewMode,
  isSpoofed,
  totalSatellites,
  visibleCount,
  dataSource,
  onRefreshTle,
  isLoadingTle,
  onOpenExplainer,
  onOpenAcademy,
  onOpenSearch,
  onOpenErrorLab,
  onOpenDetection,
  onOpenLocationModal,
  onOpenHowGpsFindsMe,
  onOpenSignalTiming,
  onToggleSkyView,
  isSkyViewOpen,
  isSidebarOpen,
  onToggleSidebar,
  language,
  onLanguageChange,
  enabledConstellations,
  onToggleConstellation,
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <header className="h-16 px-3 sm:px-4 md:px-5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex items-center justify-between shrink-0 z-30 select-none text-slate-100">
      {/* Brand & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-sky-500/20 shrink-0">
          <Satellite className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight truncate max-w-[170px] sm:max-w-none">
              {language === 'hy'
                ? 'GPS / GNSS Կառավարման Կենտրոն'
                : language === 'ru'
                ? 'GPS / GNSS Центр Управления'
                : 'GPS / GNSS Mission Control'}
            </h1>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 hidden lg:block truncate">
            {language === 'hy'
              ? 'Արբանյակային Նավիգացիայի և Սպուֆինգի Սիմուլյացիա'
              : language === 'ru'
              ? 'Спутниковая навигация и симуляция спуфинга'
              : 'Satellite Navigation & Spoofing Simulation Lab'}
          </p>
        </div>
      </div>

      {/* Center Controls: View Switcher [3D / 2D] & Constellation Filters */}
      <div className="flex items-center gap-2">
        {/* 3D / 2D Switcher */}
        <div className="flex items-center bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800">
          <button
            id="btn-switch-3d"
            onClick={() => onToggleViewMode('3D')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3D'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.mode3D || (language === 'hy' ? '3D Երկիր' : '3D')}</span>
          </button>

          <button
            id="btn-switch-2d"
            onClick={() => onToggleViewMode('2D')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2D'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{t.mode2D || (language === 'hy' ? '2D Քարտեզ' : '2D')}</span>
          </button>
        </div>

        {/* Constellation Toggles (Large screens) */}
        <div className="hidden 2xl:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(Object.keys(CONSTELLATION_INFO) as ConstellationType[]).map((c) => {
            const isEnabled = enabledConstellations[c];
            const color = CONSTELLATION_INFO[c].color;
            return (
              <button
                key={c}
                onClick={() => onToggleConstellation(c)}
                title={`Toggle ${c}`}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  isEnabled
                    ? 'text-white'
                    : 'text-slate-500 opacity-40 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isEnabled ? `${color}25` : 'transparent',
                  border: isEnabled ? `1px solid ${color}60` : '1px solid transparent',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search button */}
        <button
          id="btn-open-search"
          onClick={onOpenSearch}
          title={language === 'hy' ? 'Որոնել արբանյակ կամ քաղաք' : t.searchPrompt}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline font-medium">
            {language === 'hy' ? 'Որոնում' : language === 'ru' ? 'Поиск' : 'Search'}
          </span>
        </button>

        {/* Explore Country / Location Button (Desktop) */}
        {onOpenLocationModal && (
          <button
            id="btn-navbar-location"
            onClick={onOpenLocationModal}
            title={language === 'hy' ? 'Ընտրել երկիր, քաղաք կամ կոորդինատներ' : 'Explore Country, City or Coordinates'}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 hover:text-white text-xs font-semibold border border-sky-500/30 transition-colors"
          >
            <span>🌍</span>
            <span>{language === 'hy' ? 'Ընտրել Վայր' : language === 'ru' ? 'Локация' : 'Location'}</span>
          </button>
        )}

        {/* How GPS Finds Me Button (Desktop) */}
        {onOpenHowGpsFindsMe && (
          <button
            id="btn-navbar-how-gps"
            onClick={onOpenHowGpsFindsMe}
            title={language === 'hy' ? 'Ինչպես է աշխատում GPS-ը — 7 քայլով ուղեցույց' : 'How GPS Finds Me — 7-Step Guide'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-white text-xs font-semibold border border-emerald-500/30 transition-colors"
          >
            <span>📡</span>
            <span>{language === 'hy' ? 'Ինչպես է աշխատում GPS-ը' : language === 'ru' ? 'Как работает GPS' : 'How GPS Works'}</span>
          </button>
        )}

        {/* Sky View Button (Desktop) */}
        <button
          id="btn-toggle-skyview"
          onClick={onToggleSkyView}
          title={language === 'hy' ? 'Երկնակամարի բևեռային դիտում' : 'Polar Sky View'}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            isSkyViewOpen
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden xl:inline">{language === 'hy' ? 'Երկնակամար' : language === 'ru' ? 'Небосвод' : 'Sky View'}</span>
        </button>

        {/* GNSS Academy 20-lesson modal button */}
        <button
          id="btn-open-academy"
          onClick={onOpenAcademy}
          title={language === 'hy' ? 'GNSS Ակադեմիա՝ 20 ինտերակտիվ դասեր' : '20 Interactive Lessons: How GNSS Works'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/40 hover:to-purple-600/40 text-indigo-300 hover:text-white text-xs font-bold border border-indigo-500/40 transition-all shadow-sm"
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="hidden sm:inline">{language === 'hy' ? 'Ակադեմիա' : language === 'ru' ? 'Академия' : 'Academy'}</span>
        </button>

        {/* Anomaly Detection Dashboard button */}
        <button
          id="btn-open-detection"
          onClick={onOpenDetection}
          title={language === 'hy' ? 'Սպուֆինգի և անոմալիաների հայտնաբերման վահանակ' : 'Anti-Spoofing Anomaly Detection Engine'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isSpoofed
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
          }`}
        >
          {isSpoofed ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="hidden sm:inline">
            {isSpoofed
              ? language === 'hy' ? 'ՍՊՈՒՖԻՆԳ' : 'SPOOFED'
              : language === 'hy' ? 'ՀԱՅՏՆԱԲԵՐՈՒՄ' : language === 'ru' ? 'ДЕТЕКЦИЯ' : 'DETECTION'}
          </span>
        </button>

        {/* Quick Tools Dropdown for compact screens */}
        <div className="relative">
          <button
            id="btn-tools-dropdown"
            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-colors"
            title={language === 'hy' ? 'Գործիքներ և Լաբորատորիաներ' : 'Tools & Labs'}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <ChevronDown className={`w-3 h-3 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isToolsDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={() => setIsToolsDropdownOpen(false)}
            >
              <button
                onClick={onOpenErrorLab}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hy' ? 'Սխալների Բյուջեի Լաբ.' : language === 'ru' ? 'Лаборатория ошибок' : 'Error Budget Lab'}</span>
              </button>

              <button
                onClick={onToggleSkyView}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'hy' ? 'Երկնակամար (Sky View)' : language === 'ru' ? 'Полярный небосвод' : 'Polar Sky View'}</span>
              </button>

              {onOpenHowGpsFindsMe && (
                <button
                  onClick={onOpenHowGpsFindsMe}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'hy' ? 'Ինչպես է աշխատում GPS-ը' : 'How GPS Works'}</span>
                </button>
              )}

              {onOpenLocationModal && (
                <button
                  onClick={onOpenLocationModal}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{language === 'hy' ? 'Ընտրել Քաղաք / Վայր' : 'Explore Location'}</span>
                </button>
              )}

              {onOpenSignalTiming && (
                <button
                  onClick={onOpenSignalTiming}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 hover:text-white text-left transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'hy' ? 'Ազդանշանի Ժամանակ' : 'Signal Timing'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs font-bold">
          {(['hy', 'ru', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-1.5 py-1 rounded-lg transition-colors uppercase ${
                language === lang
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Sidebar Toggle Button */}
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Close Mission Control Panel' : 'Open Mission Control Panel'}
          className={`p-2 rounded-xl border transition-all ${
            isSidebarOpen
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
