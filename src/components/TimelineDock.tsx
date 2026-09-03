import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Clock,
  Calendar,
} from 'lucide-react';
import { Language, TimeSimulationState } from '../types';

interface TimelineDockProps {
  timeState: TimeSimulationState;
  onTimeStateChange: (updater: (prev: TimeSimulationState) => TimeSimulationState) => void;
  language: Language;
}

export const TimelineDock: React.FC<TimelineDockProps> = ({
  timeState,
  onTimeStateChange,
  language,
}) => {
  const speeds = [0.1, 1, 10, 100, 1000];

  const handleStep = (seconds: number) => {
    onTimeStateChange((prev) => {
      const newOffset = prev.timeOffsetSeconds + seconds;
      return {
        ...prev,
        timeOffsetSeconds: newOffset,
        simulatedTime: new Date(Date.now() + newOffset * 1000),
      };
    });
  };

  const handleResetNow = () => {
    onTimeStateChange((prev) => ({
      ...prev,
      timeOffsetSeconds: 0,
      simulatedTime: new Date(),
    }));
  };

  const togglePlay = () => {
    onTimeStateChange((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const handleSpeedChange = (speed: number) => {
    onTimeStateChange((prev) => ({
      ...prev,
      simulationSpeed: speed,
    }));
  };

  const isOffsetActive = Math.abs(timeState.timeOffsetSeconds) > 1;

  // Format UTC and Local time
  const utcString = timeState.simulatedTime.toUTCString().replace('GMT', 'UTC');
  const localTimeString = timeState.simulatedTime.toLocaleTimeString();
  const localDateString = timeState.simulatedTime.toLocaleDateString();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl text-slate-200">
      {/* Time Display Section */}
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-xl flex items-center justify-center ${
            isOffsetActive
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }`}
        >
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              {utcString}
            </span>
            {isOffsetActive && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {timeState.timeOffsetSeconds > 0 ? '+' : ''}
                {Math.round(timeState.timeOffsetSeconds / 60)} min
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Local: {localDateString} {localTimeString}</span>
          </div>
        </div>
      </div>

      {/* Step Buttons: [-1h] [-10m] [NOW] [+10m] [+1h] */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
        <button
          onClick={() => handleStep(-3600)}
          className="px-2 py-1 text-xs font-mono font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Step back 1 hour"
        >
          -1h
        </button>
        <button
          onClick={() => handleStep(-600)}
          className="px-2 py-1 text-xs font-mono font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Step back 10 minutes"
        >
          -10m
        </button>
        <button
          onClick={handleResetNow}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
            !isOffsetActive
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
          }`}
          title="Reset to current real time"
        >
          {language === 'en' ? 'NOW' : language === 'ru' ? 'СЕЙЧАС' : 'ՀԻՄԱ'}
        </button>
        <button
          onClick={() => handleStep(600)}
          className="px-2 py-1 text-xs font-mono font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Step forward 10 minutes"
        >
          +10m
        </button>
        <button
          onClick={() => handleStep(3600)}
          className="px-2 py-1 text-xs font-mono font-semibold rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Step forward 1 hour"
        >
          +1h
        </button>
      </div>

      {/* Playback & Speed Controls */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`p-2 rounded-xl text-white font-bold transition-all shadow-md flex items-center justify-center ${
            timeState.isPlaying
              ? 'bg-indigo-600 hover:bg-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={timeState.isPlaying ? 'Pause simulation clock' : 'Play simulation clock'}
        >
          {timeState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              className={`px-2 py-0.5 text-xs font-mono rounded-lg transition-colors ${
                timeState.simulationSpeed === s
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
