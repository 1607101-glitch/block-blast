import React, { useState } from 'react';
import { X, Check, Sparkles, RefreshCw, Sliders, Palette, Shapes, ShieldAlert, Smartphone } from 'lucide-react';
import { BlockStyle, BoardTheme, CustomizerSettings, ShapeCategory, ShapePreset } from '../types';
import { BLOCK_STYLES, THEMES } from '../utils/themeConfig';
import { getFilteredShapePool } from '../utils/shapes';
import { haptics } from '../utils/haptics';
import { SingleBlockCell } from './BlockPiece';

interface CustomizerModalProps {
  settings: CustomizerSettings;
  onUpdateSettings: (newSettings: CustomizerSettings) => void;
  onRestartWithPreset: () => void;
  onClose: () => void;
}

const CATEGORY_LABELS: { key: ShapeCategory; label: string; desc: string }[] = [
  { key: 'dots', label: '1x1 Dots', desc: 'Single dot monomino' },
  { key: 'lines', label: 'Lines (1x2 to 1x5)', desc: 'Horizontal & vertical bars' },
  { key: 'squares', label: 'Squares (2x2, 3x3)', desc: 'Solid blocks' },
  { key: 'corners_l', label: 'Corners & L-Shapes', desc: '2x2, 2x3 & 3x2 Ls' },
  { key: 't_z', label: 'T & Z Shapes', desc: 'Arcade polyominoes' },
  { key: 'pentominoes', label: 'Giant Pentominoes (5-blocks)', desc: 'Plus (+), U-shape, Big Ls' },
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  settings,
  onUpdateSettings,
  onRestartWithPreset,
  onClose,
}) => {
  const currentPool = getFilteredShapePool(settings.shapePreset, settings.customCategories);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => haptics.isEnabled());

  const handleToggleHaptics = () => {
    const nextVal = haptics.toggle();
    setHapticsEnabled(nextVal);
  };

  const handleSelectTheme = (theme: BoardTheme) => {
    onUpdateSettings({ ...settings, theme });
  };

  const handleSelectBlockStyle = (blockStyle: BlockStyle) => {
    onUpdateSettings({ ...settings, blockStyle });
  };

  const handleSelectPreset = (shapePreset: ShapePreset) => {
    onUpdateSettings({ ...settings, shapePreset });
  };

  const handleToggleCategory = (category: ShapeCategory) => {
    const updated = {
      ...settings.customCategories,
      [category]: !settings.customCategories[category],
    };

    // Ensure at least one category remains enabled
    const anyEnabled = Object.values(updated).some(Boolean);
    if (!anyEnabled) return;

    onUpdateSettings({
      ...settings,
      shapePreset: 'custom',
      customCategories: updated,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-6 my-auto text-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white leading-tight">
                Customizer & Shape Lab
              </h2>
              <p className="text-xs text-slate-400">
                Personalize board themes, textures, and shape rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="overflow-y-auto py-4 space-y-6 pr-1 custom-scrollbar">
          {/* SECTION 1: THEMES */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Palette size={14} className="text-cyan-400" />
                <span>1. Board Theme</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES) as BoardTheme[]).map((themeKey) => {
                const item = THEMES[themeKey];
                const isSelected = settings.theme === themeKey;

                return (
                  <button
                    key={themeKey}
                    onClick={() => handleSelectTheme(themeKey)}
                    className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/20 shadow-md'
                        : 'bg-slate-800/30 border-slate-700/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        {item.name}
                      </span>
                      {isSelected ? (
                        <span className="p-0.5 rounded-full bg-cyan-400 text-slate-950">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: item.previewColor }}
                        />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {item.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: BLOCK STYLES */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Sparkles size={14} className="text-amber-400" />
                <span>2. Block Texture & Style</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {BLOCK_STYLES.map((style) => {
                const isSelected = settings.blockStyle === style.id;

                return (
                  <button
                    key={style.id}
                    onClick={() => handleSelectBlockStyle(style.id)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                        : 'bg-slate-800/30 border-slate-700/60 hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Live Preview block */}
                    <div className="w-8 h-8 flex items-center justify-center p-0.5">
                      <SingleBlockCell
                        colorKey="amber"
                        blockStyle={style.id}
                        sizePx={26}
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {style.name}
                      </span>
                      <span className="text-[9px] text-slate-400 block line-clamp-1 mt-0.5">
                        {style.id === 'candy_3d' ? 'Jelly gloss' : style.id === 'flat_modern' ? 'Vector flat' : 'Pixel 8-bit'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 3: SHAPE LAB & PRESETS */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Shapes size={14} className="text-rose-400" />
                <span>3. Shape Engine Presets</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentPool.length} shapes in pool
              </span>
            </div>

            {/* Presets Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                {
                  id: 'classic' as ShapePreset,
                  name: 'Classic',
                  desc: 'Standard mobile Block Blast shapes pool',
                },
                {
                  id: 'zen' as ShapePreset,
                  name: 'Zen Mode',
                  desc: 'Small blocks only (1x1, 1x2, 2x2, small Ls). Ultra chill!',
                },
                {
                  id: 'hardcore' as ShapePreset,
                  name: 'Chaos / Hardcore',
                  desc: 'Includes tricky Plus (+), U-shapes, 5-bars & 3x3s!',
                },
                {
                  id: 'custom' as ShapePreset,
                  name: 'Custom Sandbox',
                  desc: 'Pick your own custom shape categories below',
                },
              ].map((p) => {
                const isSelected = settings.shapePreset === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPreset(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-rose-400 ring-2 ring-rose-400/20 shadow-md'
                        : 'bg-slate-800/30 border-slate-700/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">
                        {p.name}
                      </span>
                      {isSelected && (
                        <span className="p-0.5 rounded-full bg-rose-400 text-slate-950">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom Sandbox Checkboxes */}
            <div
              className={`p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2.5 transition-opacity ${
                settings.shapePreset !== 'custom' ? 'opacity-70' : 'opacity-100 ring-1 ring-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 pb-1 border-b border-slate-700/50">
                <span>Active Shape Categories:</span>
                {settings.shapePreset !== 'custom' && (
                  <span className="text-[10px] text-amber-400 font-normal">
                    (Clicking a category activates Custom mode)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CATEGORY_LABELS.map(({ key, label, desc }) => {
                  const isChecked = settings.customCategories[key];

                  return (
                    <label
                      key={key}
                      onClick={() => handleToggleCategory(key)}
                      className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-slate-800/80 border-slate-600 text-white'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by label click
                        className="mt-0.5 h-4 w-4 rounded accent-rose-500 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{label}</span>
                        <span className="text-[10px] text-slate-400">{desc}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 4: TACTILE HAPTICS */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <Smartphone size={14} className="text-violet-400" />
                <span>Tactile Haptics (Vibration)</span>
              </div>
              {haptics.isSupported() ? (
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Supported
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  Mobile Browser Feature
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
              <div className="flex flex-col pr-2">
                <span className="text-xs font-semibold text-white">Vibrate on Touch</span>
                <span className="text-[10px] text-slate-400">
                  Crisp haptic pulses on block pickup, grid snap, placement, and line clears.
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleHaptics}
                disabled={!haptics.isSupported()}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hapticsEnabled && haptics.isSupported()
                    ? 'bg-rose-500'
                    : 'bg-slate-700 opacity-60'
                }`}
                role="switch"
                aria-checked={hapticsEnabled}
                aria-label="Toggle haptic vibration"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    hapticsEnabled && haptics.isSupported() ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2 justify-between items-center">
          <button
            onClick={() => {
              onRestartWithPreset();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Restart with This Preset</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 hover:opacity-95 text-white font-extrabold text-xs tracking-wide shadow-md transition-all cursor-pointer text-center"
          >
            APPLY & PLAY
          </button>
        </div>
      </div>
    </div>
  );
};
