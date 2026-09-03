import React from 'react';
import { ShieldAlert, RotateCcw, Zap, AlertTriangle } from 'lucide-react';
import { SpoofConfig } from '../types';

interface SpoofWarningBannerProps {
  spoofConfig: SpoofConfig;
  onResetRealLocation: () => void;
}

export const SpoofWarningBanner: React.FC<SpoofWarningBannerProps> = ({
  spoofConfig,
  onResetRealLocation,
}) => {
  if (!spoofConfig.isActive) return null;

  return (
    <div
      id="spoof-warning-banner"
      className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-2xl bg-rose-950/90 backdrop-blur-md border border-rose-500 rounded-2xl p-3 sm:p-4 shadow-[0_0_35px_rgba(244,63,94,0.4)] text-white flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 animate-bounce shadow-lg shadow-rose-600/50">
          <AlertTriangle className="w-6 h-6 fill-current text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-black tracking-wide text-rose-200">
              ⚠️ WARNING: GPS SPOOFING / SIGNAL MANIPULATION DETECTED
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-rose-300 font-mono">
            Receiver position forced to: {spoofConfig.targetName || 'Simulated Coordinates'} (
            {spoofConfig.targetLat.toFixed(4)}°, {spoofConfig.targetLng.toFixed(4)}°)
          </p>
        </div>
      </div>

      <button
        id="btn-banner-reset"
        onClick={onResetRealLocation}
        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-rose-700 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset to Real GPS</span>
      </button>
    </div>
  );
};
