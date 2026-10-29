import React from 'react';
import { X, CheckCircle2, Flame, Award } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/60 p-6 shadow-2xl text-left overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <h3 className="text-xl font-black text-white mb-4">How to Play</h3>

        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex gap-2.5 items-start">
            <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Drag & Drop Shapes</strong>
              Pick up shapes from the bottom tray and drag them anywhere on the 8x8 grid. Touch has an upward finger offset for clarity.
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Fill Rows and Columns</strong>
              Fill any full 8-cell row or 8-cell column to blast it! Multiple lines can clear simultaneously for massive bonus points.
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <Flame size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Beat the Depleting Combo Meter</strong>
              Clearing lines triggers your Combo Streak! Watch the progress bar beneath the score—clear another line before time expires to boost your streak and earn +15 extra points per combo level!
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <Award size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Plan Ahead</strong>
              A new set of 3 shapes spawns only after placing all 3. Game ends when no remaining piece fits anywhere!
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm tracking-wide border border-slate-700/80 transition-colors cursor-pointer text-center"
        >
          GOT IT!
        </button>
      </div>
    </div>
  );
};
