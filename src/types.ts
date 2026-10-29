export type BlockColorKey = 'cyan' | 'amber' | 'violet' | 'emerald' | 'rose' | 'blue' | 'yellow';

export interface BlockColorDef {
  key: BlockColorKey;
  name: string;
  // Visual styling
  primary: string;       // main hex / tailwind color
  gradient: string;      // tailwind gradient
  border: string;        // border color
  glow: string;          // box shadow glow color
  particleColor: string; // hex for canvas particles
  lightColor: string;    // highlight hex
}

export type ShapeCategory = 'dots' | 'lines' | 'squares' | 'corners_l' | 't_z' | 'pentominoes';

export interface ShapeDefinition {
  id: string;
  name: string;
  matrix: number[][]; // 2D array of 0 and 1
  colorKey: BlockColorKey;
  category: ShapeCategory;
  rarity?: number;
}

export type BoardTheme = 'midnight' | 'cyber_neon' | 'cozy_wood' | 'minimal_light';
export type BlockStyle = 'candy_3d' | 'flat_modern' | 'retro_8bit';
export type ShapePreset = 'classic' | 'zen' | 'hardcore' | 'custom';

export interface ShapeCategoryToggles {
  dots: boolean;
  lines: boolean;
  squares: boolean;
  corners_l: boolean;
  t_z: boolean;
  pentominoes: boolean;
}

export interface CustomizerSettings {
  theme: BoardTheme;
  blockStyle: BlockStyle;
  shapePreset: ShapePreset;
  customCategories: ShapeCategoryToggles;
}

export interface TrayPiece {
  id: string;
  shape: ShapeDefinition;
  placed: boolean;
  canFit: boolean;
}

export type GridCell = BlockColorKey | null;
export type GridBoard = GridCell[][];

export interface UndoSnapshot {
  grid: GridBoard;
  trayPieces: TrayPiece[];
  score: number;
  combo: number;
  comboTimeLeft: number;
  placedPieceId: string;
}

export interface FloatingText {
  id: string;
  text: string;
  subText?: string;
  x: number;
  y: number;
  color: string;
  scale?: number;
}

export interface DragState {
  pieceId: string;
  piece: TrayPiece;
  // Pointer location in screen pixels
  currentX: number;
  currentY: number;
  // Starting slot rect for return animation
  originRect: DOMRect | null;
  // Grid snapped coordinate (row, col of top-left matrix anchor), or null if invalid
  snappedRow: number | null;
  snappedCol: number | null;
  isValidPlacement: boolean;
  isTouch: boolean;
}

export interface GameStats {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  linesClearedTotal: number;
  isNewHighScore: boolean;
}
