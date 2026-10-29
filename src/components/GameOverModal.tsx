import React, { useEffect } from 'react';
import { Trophy, Flame, Play, Sparkles } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  maxCombo: number;
  linesClearedTotal: number;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  maxCombo,
  linesClearedTotal,
  onPlayAgain,
}) => {
  // Listen for Enter / Space key to restart quickly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlayAgain();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayAgain]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/60 p-6 sm:p-7 shadow-2xl text-center overflow-hidden">
        {/* Glow decorative halo */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* New High Score Banner */}
        {isNewHighScore && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider animate-bounce">
            <Sparkles size={14} className="text-amber-400" />
            <span>New High Score!</span>
          </div>
        )}

        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          GAME OVER
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          No remaining shapes could fit on the board!
        </p>

        {/* Primary Score Box */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/50 shadow-inner">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1">
            Final Score
          </span>
          <span className="text-5xl font-black text-white tabular-nums tracking-tight">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <Trophy size={13} className="text-amber-400" />
              <span>Best Score</span>
            </div>
            <span className="text-lg font-bold text-slate-100 tabular-nums">
              {highScore.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1">
              <Flame size={13} className="text-rose-400" />
              <span>Max Combo</span>
            </div>
            <span className="text-lg font-bold text-slate-100 tabular-nums">
              {maxCombo > 0 ? `${maxCombo}x` : '0x'}
            </span>
          </div>

          <div className="col-span-2 p-2.5 rounded-xl bg-slate-800/20 border border-slate-700/20 text-center">
            <span className="text-xs text-slate-400">
              Total lines cleared:{' '}
              <strong className="text-slate-200 font-bold">{linesClearedTotal}</strong>
            </span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-400 text-white font-extrabold text-base tracking-wide shadow-lg shadow-rose-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play size={18} className="fill-white" />
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
