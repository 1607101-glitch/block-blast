import React from 'react';
import { RotateCcw, Volume2, VolumeX, Trophy, Flame, HelpCircle, Palette, Undo2 } from 'lucide-react';
import { BoardTheme } from '../types';
import { THEMES } from '../utils/themeConfig';

interface HeaderProps {
  score: number;
  highScore: number;
  combo: number;
  comboTimeLeft: number;
  maxComboTime: number;
  canUndo: boolean;
  onUndo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  onOpenCustomizer: () => void;
  theme?: BoardTheme;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  highScore,
  combo,
  comboTimeLeft,
  maxComboTime,
  canUndo,
  onUndo,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenHelp,
  onOpenCustomizer,
  theme = 'midnight',
}) => {
  const themeConfig = THEMES[theme] || THEMES.midnight;
  const isComboActive = combo > 0 && comboTimeLeft > 0;
  const progressPercent = isComboActive
    ? Math.max(0, Math.min(100, (comboTimeLeft / maxComboTime) * 100))
    : 0;
  const isWarning = isComboActive && progressPercent <= 30;

  return (
    <header className="w-full max-w-[420px] mx-auto px-4 pt-3 pb-1 select-none">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`text-xl font-extrabold tracking-tight bg-gradient-to-r ${themeConfig.headerAccent} bg-clip-text text-transparent`}
          >
            BLOCK BLAST!
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Customizer & Shape Lab Button */}
          <button
            onClick={onOpenCustomizer}
            className={`p-2 rounded-xl ${themeConfig.cardBg} hover:opacity-90 transition-all border ${themeConfig.cardBorder} shadow-sm active:scale-95 text-slate-300 hover:text-white flex items-center gap-1`}
            title="Customizer & Shape Lab"
            aria-label="Customizer & Shape Lab"
          >
            <Palette size={18} className="text-amber-400" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl ${themeConfig.cardBg} hover:opacity-90 transition-all border ${themeConfig.cardBorder} shadow-sm active:scale-95 text-slate-300 hover:text-white`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className={`p-2 rounded-xl ${themeConfig.cardBg} hover:opacity-90 transition-all border ${themeConfig.cardBorder} shadow-sm active:scale-95 text-slate-300 hover:text-white`}
            title="How to Play"
            aria-label="How to Play"
          >
            <HelpCircle size={18} />
          </button>

          {/* Undo Button */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-xl ${themeConfig.cardBg} transition-all border ${themeConfig.cardBorder} shadow-sm active:scale-95 flex items-center justify-center ${
              canUndo
                ? 'text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 cursor-pointer'
                : 'text-slate-600 border-slate-800/40 opacity-40 cursor-not-allowed'
            }`}
            title={canUndo ? 'Undo Last Move' : 'Undo (only available if no lines were cleared)'}
            aria-label="Undo Last Move"
          >
            <Undo2 size={18} />
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className={`p-2 rounded-xl ${themeConfig.cardBg} hover:opacity-90 transition-all border ${themeConfig.cardBorder} shadow-sm active:scale-95 text-slate-300 hover:text-white`}
            title="Restart Game"
            aria-label="Restart Game"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Scores Banner */}
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Current Score */}
        <div
          className={`flex flex-col items-center justify-center p-2.5 rounded-2xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} shadow-md transition-all`}
        >
          <span className={`text-[11px] font-semibold ${themeConfig.cardTextMuted} uppercase tracking-widest`}>
            Score
          </span>
          <span
            className={`text-3xl sm:text-4xl font-black ${
              theme === 'minimal_light' ? 'text-slate-900' : 'text-white'
            } tabular-nums tracking-tight`}
          >
            {score.toLocaleString()}
          </span>
        </div>

        {/* High Score & Combo */}
        <div
          className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} shadow-md overflow-hidden transition-all`}
        >
          <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 uppercase tracking-widest">
            <Trophy size={12} className="text-amber-400" />
            <span>Best</span>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums tracking-tight">
            {highScore.toLocaleString()}
          </span>

          {/* Active Combo Flame */}
          {combo > 0 && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40 text-[10px] font-extrabold text-rose-400 animate-pulse">
              <Flame size={11} className="text-rose-500 fill-rose-500" />
              <span>x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Combo Meter & Visual Progress Bar beneath score */}
      <div className="mt-2.5 w-full">
        <div
          className={`relative px-3 py-2 rounded-2xl ${themeConfig.cardBg} border ${
            isWarning ? 'border-rose-500/60 ring-1 ring-rose-500/30' : themeConfig.cardBorder
          } shadow-sm overflow-hidden transition-all duration-200`}
        >
          {/* Top readout row */}
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              <Flame
                size={13}
                className={
                  isComboActive
                    ? isWarning
                      ? 'text-rose-400 fill-rose-400 animate-bounce'
                      : 'text-amber-400 fill-amber-400 animate-pulse'
                    : 'text-slate-500'
                }
              />
              {isComboActive ? (
                <div className="flex items-center gap-1">
                  <span className={theme === 'minimal_light' ? 'text-slate-900 font-extrabold' : 'text-white font-extrabold'}>
                    COMBO STREAK
                  </span>
                  <span className="text-amber-400 font-black">x{combo}</span>
                  <span className="text-[10px] font-medium text-slate-400">
                    (+{combo * 15} pts)
                  </span>
                </div>
              ) : (
                <span className={themeConfig.cardTextMuted}>
                  Combo Meter
                </span>
              )}
            </div>

            {/* Time countdown */}
            <div className="text-[11px] font-mono tabular-nums font-bold">
              {isComboActive ? (
                <span
                  className={
                    isWarning
                      ? 'text-rose-400 font-black animate-pulse'
                      : 'text-amber-300'
                  }
                >
                  {(comboTimeLeft / 1000).toFixed(1)}s
                </span>
              ) : (
                <span className="text-slate-500 text-[10px] font-medium tracking-wide">
                  Idle
                </span>
              )}
            </div>
          </div>

          {/* Visual Progress Bar Track */}
          <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/40">
            {/* Progress Bar Fill */}
            <div
              className={`h-full rounded-full transition-all duration-100 ease-linear ${
                isComboActive
                  ? isWarning
                    ? 'bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
                    : 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-slate-700/30'
              }`}
              style={{
                width: `${progressPercent}%`,
              }}
            />
          </div>

          {/* Ambient Glow */}
          {isComboActive && (
            <div
              className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full blur-lg pointer-events-none ${
                isWarning ? 'bg-rose-500/20' : 'bg-amber-500/15'
              }`}
            />
          )}
        </div>
      </div>
    </header>
  );
};
