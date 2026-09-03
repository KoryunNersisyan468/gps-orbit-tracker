import React from 'react';
import { X, Radio, Orbit, Clock, ShieldCheck, ShieldAlert, BookOpen } from 'lucide-react';

interface TrilaterationExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrilaterationExplainer: React.FC<TrilaterationExplainerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-200 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                How Satellite Trilateration Works
              </h2>
              <p className="text-xs text-sky-400 font-mono">
                Mathematical Principles of Global Positioning & Spoofing
              </p>
            </div>
          </div>
          <button
            id="btn-close-explainer"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {/* Step 1 */}
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                Time of Arrival & Pseudorange ($d = c \cdot \Delta t$)
              </h3>
              <p className="text-slate-400">
                GPS satellites carry ultra-precise rubidium and cesium atomic clocks synchronized to GPS Time.
                Each satellite continuously broadcasts its exact orbit position (Ephemeris) and transmission time (t_tx).
                The receiver calculates distance by measuring elapsed signal transit time:
              </p>
              <div className="my-2 p-2.5 bg-slate-950/80 rounded-xl font-mono text-[11px] text-sky-300 border border-slate-800">
                Distance (Pseudorange) ρ = c × (t_receive - t_transmit)
                <br />
                <span className="text-slate-400 text-[10px]">
                  Where c = 299,792.458 km/s (speed of light). A delay of just 1 millisecond represents ~300 km!
                </span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                <Orbit className="w-4 h-4 text-emerald-400" />
                Why Exactly 4 Satellites are Required
              </h3>
              <p className="text-slate-400 mb-2">
                A single satellite places the receiver on a spherical surface. Two satellites intersect into a circular ring.
                Three satellites intersect at two points (one in outer space, one on Earth).
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-semibold block">Spatial Unknowns:</span>
                  X, Y, Z (Latitude, Longitude, Altitude)
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-semibold block">Receiver Clock Error:</span>
                  Δt_clock (Quartz clock offset)
                </div>
              </div>
              <p className="text-slate-400 mt-2">
                The 4th satellite provides the algebraic equation required to eliminate the receiver's internal clock bias,
                yielding atomic-precision positioning without requiring an atomic clock inside your smartphone!
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-900/40 flex gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                How GPS Spoofing Works ("Խաբելու" Տեխնոլոգիա)
              </h3>
              <p className="text-slate-400">
                Civilian GPS signals (L1 C/A code at 1575.42 MHz) are unencrypted. A spoofer broadcasts synthesized signals
                with slightly higher radio power than authentic satellites.
              </p>
              <p className="text-slate-400 mt-1.5">
                By intentionally delaying or advancing the pseudorandom noise code timestamps (Δt),
                the attacker tricks the receiver's trilateration solver into calculating fake coordinates
                (e.g., diverting a vessel, drone, or aircraft into hostile territory).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-lg shadow-sky-600/20 transition-all"
          >
            Got it, Return to Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
