import { BlockStyle, BoardTheme, CustomizerSettings, ShapeCategoryToggles } from '../types';

export interface ThemeConfig {
  id: BoardTheme;
  name: string;
  tagline: string;
  pageBg: string;
  pageText: string;
  boardCasingBg: string;
  boardCasingBorder: string;
  boardCasingShadow: string;
  emptyCellBg: string;
  emptyCellBorder: string;
  emptyCellShadow: string;
  cardBg: string;
  cardBorder: string;
  cardTextMuted: string;
  headerAccent: string;
  previewColor: string;
}

export const THEMES: Record<BoardTheme, ThemeConfig> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Dark slate & navy arcade style',
    pageBg: 'bg-slate-950',
    pageText: 'text-slate-100',
    boardCasingBg: 'bg-slate-900/95',
    boardCasingBorder: 'border-slate-800/80',
    boardCasingShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
    emptyCellBg: 'bg-slate-800/70',
    emptyCellBorder: 'border-slate-700/30',
    emptyCellShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)',
    cardBg: 'bg-slate-900/80',
    cardBorder: 'border-slate-800/80',
    cardTextMuted: 'text-slate-400',
    headerAccent: 'from-amber-400 via-rose-400 to-indigo-400',
    previewColor: '#0f172a',
  },
  cyber_neon: {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    tagline: 'Deep black with glowing neon grids',
    pageBg: 'bg-black',
    pageText: 'text-cyan-100',
    boardCasingBg: 'bg-zinc-950',
    boardCasingBorder: 'border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    boardCasingShadow: '0 0 35px rgba(6, 182, 212, 0.25), inset 0 0 15px rgba(6, 182, 212, 0.1)',
    emptyCellBg: 'bg-zinc-900/90',
    emptyCellBorder: 'border-cyan-500/30 hover:border-cyan-400/60 shadow-[inset_0_0_8px_rgba(6,182,212,0.15)]',
    emptyCellShadow: 'inset 0 0 8px rgba(6, 182, 212, 0.2)',
    cardBg: 'bg-zinc-950/90',
    cardBorder: 'border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
    cardTextMuted: 'text-cyan-300/60',
    headerAccent: 'from-cyan-400 via-fuchsia-400 to-emerald-400',
    previewColor: '#000000',
  },
  cozy_wood: {
    id: 'cozy_wood',
    name: 'Cozy Wood',
    tagline: 'Warm walnut woodboard with carved sockets',
    pageBg: 'bg-[#18110c]',
    pageText: 'text-amber-100',
    boardCasingBg: 'bg-[#261b14]',
    boardCasingBorder: 'border-[#4a3526]',
    boardCasingShadow: '0 12px 35px -5px rgba(10, 5, 2, 0.8), inset 0 2px 3px rgba(255, 215, 170, 0.1)',
    emptyCellBg: 'bg-[#1b130e]',
    emptyCellBorder: 'border-[#3b281b]',
    emptyCellShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.7), inset 0 0 2px rgba(0, 0, 0, 0.8)',
    cardBg: 'bg-[#261b14]/90',
    cardBorder: 'border-[#4a3526]',
    cardTextMuted: 'text-amber-200/60',
    headerAccent: 'from-amber-300 via-orange-400 to-amber-500',
    previewColor: '#261b14',
  },
  minimal_light: {
    id: 'minimal_light',
    name: 'Minimal Light',
    tagline: 'Soft off-white palette with clean shadows',
    pageBg: 'bg-slate-100',
    pageText: 'text-slate-900',
    boardCasingBg: 'bg-white',
    boardCasingBorder: 'border-slate-200 shadow-xl',
    boardCasingShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    emptyCellBg: 'bg-slate-100/90',
    emptyCellBorder: 'border-slate-200/90',
    emptyCellShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.06)',
    cardBg: 'bg-white/95',
    cardBorder: 'border-slate-200 shadow-sm',
    cardTextMuted: 'text-slate-500',
    headerAccent: 'from-indigo-600 via-purple-600 to-rose-600',
    previewColor: '#f8fafc',
  },
};

export const BLOCK_STYLES: { id: BlockStyle; name: string; description: string }[] = [
  {
    id: 'candy_3d',
    name: 'Candy 3D',
    description: 'Rounded puffy jelly look with gloss highlights & bevels',
  },
  {
    id: 'flat_modern',
    name: 'Flat Modern',
    description: 'Clean vector blocks with subtle inset borders',
  },
  {
    id: 'retro_8bit',
    name: '8-Bit Retro',
    description: 'Chunky pixel shading, crisp corners & arcade contrast',
  },
];

export const DEFAULT_CUSTOM_CATEGORIES: ShapeCategoryToggles = {
  dots: true,
  lines: true,
  squares: true,
  corners_l: true,
  t_z: true,
  pentominoes: false,
};

export const DEFAULT_CUSTOMIZER_SETTINGS: CustomizerSettings = {
  theme: 'midnight',
  blockStyle: 'candy_3d',
  shapePreset: 'classic',
  customCategories: DEFAULT_CUSTOM_CATEGORIES,
};

export const LOCAL_STORAGE_SETTINGS_KEY = 'blockblast_customizer_settings';

export function loadSavedCustomizerSettings(): CustomizerSettings {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!raw) return DEFAULT_CUSTOMIZER_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      theme: parsed.theme || DEFAULT_CUSTOMIZER_SETTINGS.theme,
      blockStyle: parsed.blockStyle || DEFAULT_CUSTOMIZER_SETTINGS.blockStyle,
      shapePreset: parsed.shapePreset || DEFAULT_CUSTOMIZER_SETTINGS.shapePreset,
      customCategories: {
        ...DEFAULT_CUSTOM_CATEGORIES,
        ...(parsed.customCategories || {}),
      },
    };
  } catch {
    return DEFAULT_CUSTOMIZER_SETTINGS;
  }
}

export function saveCustomizerSettings(settings: CustomizerSettings): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}
