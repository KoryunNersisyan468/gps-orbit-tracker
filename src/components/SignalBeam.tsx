import React, { useEffect, useState } from 'react';
import { SatelliteData, UserLocation } from '../types';
import { SPEED_OF_LIGHT_KM_S } from '../utils/coordinates';

export type SignalBeamMode = 'normal' | 'simulated' | 'anomaly';

export interface SignalBeamProps {
  satellite: SatelliteData;
  receiver: UserLocation;
  mode?: SignalBeamMode;
  speedMultiplier?: number;
  showParticles?: boolean;
  phaseOffset?: number; // 0 to 1
  onParticleArrival?: () => void;
}

export const SIGNAL_MODE_COLORS: Record<SignalBeamMode, {
  primary: string;
  glow: string;
  pulse: string;
  hex: number;
}> = {
  normal: {
    primary: '#38bdf8', // Sky 400
    glow: 'rgba(56, 189, 248, 0.4)',
    pulse: '#10b981', // Emerald
    hex: 0x38bdf8,
  },
  simulated: {
    primary: '#f59e0b', // Amber 500
    glow: 'rgba(245, 158, 11, 0.4)',
    pulse: '#fbbf24',
    hex: 0xf59e0b,
  },
  anomaly: {
    primary: '#ef4444', // Rose/Red 500
    glow: 'rgba(239, 68, 68, 0.5)',
    pulse: '#f43f5e',
    hex: 0xef4444,
  },
};

export const SignalBeam: React.FC<SignalBeamProps> = ({
  satellite,
  receiver,
  mode = 'normal',
  speedMultiplier = 1,
  showParticles = true,
  phaseOffset = 0,
}) => {
  const [transitProgress, setTransitProgress] = useState(phaseOffset);

  const colors = SIGNAL_MODE_COLORS[mode];
  const distanceKm = satellite.distanceKm || 20200;
  const transitTimeMs = (distanceKm / SPEED_OF_LIGHT_KM_S) * 1000;

  useEffect(() => {
    let animId: number;
    let start = performance.now();
    const cycle = Math.max(1200, 2400 / speedMultiplier);

    const step = (now: number) => {
      const elapsed = (now - start) % cycle;
      const prog = ((elapsed / cycle) + phaseOffset) % 1;
      setTransitProgress(prog);
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [speedMultiplier, phaseOffset]);

  return (
    <div className="flex items-center gap-2 font-mono text-xs p-2 rounded-xl bg-slate-900/80 border border-slate-800">
      <div
        className="w-2.5 h-2.5 rounded-full animate-ping"
        style={{ backgroundColor: colors.primary }}
      />
      <span className="text-white font-semibold truncate max-w-[120px]">{satellite.name}</span>
      <span className="text-slate-400">→</span>
      <span className="text-slate-300 font-mono">{(transitProgress * 100).toFixed(0)}%</span>
      <span className="text-slate-500 text-[10px]">({transitTimeMs.toFixed(1)} ms)</span>
    </div>
  );
};
