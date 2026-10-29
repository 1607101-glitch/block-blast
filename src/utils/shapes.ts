import {
  BlockColorDef,
  BlockColorKey,
  GridBoard,
  ShapeCategory,
  ShapeCategoryToggles,
  ShapeDefinition,
  ShapePreset,
  TrayPiece,
} from '../types';

export const GRID_SIZE = 8;

export const COLOR_DEFINITIONS: Record<BlockColorKey, BlockColorDef> = {
  cyan: {
    key: 'cyan',
    name: 'Cyan',
    primary: '#06b6d4',
    gradient: 'from-cyan-400 via-cyan-500 to-teal-500',
    border: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.4)',
    particleColor: '#22d3ee',
    lightColor: '#a5f3fc',
  },
  amber: {
    key: 'amber',
    name: 'Amber',
    primary: '#f59e0b',
    gradient: 'from-amber-400 via-orange-400 to-orange-500',
    border: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.4)',
    particleColor: '#f59e0b',
    lightColor: '#fef3c7',
  },
  violet: {
    key: 'violet',
    name: 'Violet',
    primary: '#8b5cf6',
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
    border: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.4)',
    particleColor: '#a78bfa',
    lightColor: '#ede9fe',
  },
  emerald: {
    key: 'emerald',
    name: 'Emerald',
    primary: '#10b981',
    gradient: 'from-emerald-400 via-emerald-500 to-teal-600',
    border: '#34d399',
    glow: 'rgba(16, 185, 129, 0.4)',
    particleColor: '#10b981',
    lightColor: '#d1fae5',
  },
  rose: {
    key: 'rose',
    name: 'Rose',
    primary: '#f43f5e',
    gradient: 'from-rose-400 via-rose-500 to-pink-600',
    border: '#fb7185',
    glow: 'rgba(244, 63, 94, 0.4)',
    particleColor: '#f43f5e',
    lightColor: '#ffe4e6',
  },
  blue: {
    key: 'blue',
    name: 'Blue',
    primary: '#3b82f6',
    gradient: 'from-blue-400 via-blue-500 to-indigo-600',
    border: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.4)',
    particleColor: '#60a5fa',
    lightColor: '#dbeafe',
  },
  yellow: {
    key: 'yellow',
    name: 'Yellow',
    primary: '#eab308',
    gradient: 'from-yellow-300 via-amber-400 to-amber-500',
    border: '#fde047',
    glow: 'rgba(234, 179, 8, 0.4)',
    particleColor: '#eab308',
    lightColor: '#fef9c3',
  },
};

export const ALL_SHAPES: ShapeDefinition[] = [
  // 1x1 Dot
  {
    id: 'dot-1x1',
    name: '1x1 Dot',
    matrix: [[1]],
    colorKey: 'yellow',
    category: 'dots',
  },

  // 1x2 and 2x1 Lines
  {
    id: 'line-1x2',
    name: '1x2 Line',
    matrix: [[1, 1]],
    colorKey: 'cyan',
    category: 'lines',
  },
  {
    id: 'line-2x1',
    name: '2x1 Line',
    matrix: [[1], [1]],
    colorKey: 'cyan',
    category: 'lines',
  },

  // 1x3 and 3x1 Lines
  {
    id: 'line-1x3',
    name: '1x3 Line',
    matrix: [[1, 1, 1]],
    colorKey: 'blue',
    category: 'lines',
  },
  {
    id: 'line-3x1',
    name: '3x1 Line',
    matrix: [[1], [1], [1]],
    colorKey: 'blue',
    category: 'lines',
  },

  // 1x4 and 4x1 Lines
  {
    id: 'line-1x4',
    name: '1x4 Line',
    matrix: [[1, 1, 1, 1]],
    colorKey: 'violet',
    category: 'lines',
  },
  {
    id: 'line-4x1',
    name: '4x1 Line',
    matrix: [[1], [1], [1], [1]],
    colorKey: 'violet',
    category: 'lines',
  },

  // 1x5 and 5x1 Lines
  {
    id: 'line-1x5',
    name: '1x5 Line',
    matrix: [[1, 1, 1, 1, 1]],
    colorKey: 'rose',
    category: 'lines',
  },
  {
    id: 'line-5x1',
    name: '5x1 Line',
    matrix: [[1], [1], [1], [1], [1]],
    colorKey: 'rose',
    category: 'lines',
  },

  // Squares
  {
    id: 'square-2x2',
    name: '2x2 Square',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    colorKey: 'amber',
    category: 'squares',
  },
  {
    id: 'square-3x3',
    name: '3x3 Big Square',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    colorKey: 'rose',
    category: 'squares',
  },

  // 2x2 Small L / Corner (3 blocks) - 4 rotations
  {
    id: 'corner-2x2-br',
    name: '2x2 Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    colorKey: 'emerald',
    category: 'corners_l',
  },
  {
    id: 'corner-2x2-bl',
    name: '2x2 Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    colorKey: 'emerald',
    category: 'corners_l',
  },
  {
    id: 'corner-2x2-tr',
    name: '2x2 Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    colorKey: 'emerald',
    category: 'corners_l',
  },
  {
    id: 'corner-2x2-tl',
    name: '2x2 Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    colorKey: 'emerald',
    category: 'corners_l',
  },

  // 3x2 & 2x3 Classic L-shapes (4 blocks)
  {
    id: 'l-3x2-left',
    name: '3x2 L-Shape L',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-3x2-right',
    name: '3x2 L-Shape R',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-3x2-inv-left',
    name: '3x2 L-Shape Inv L',
    matrix: [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-3x2-inv-right',
    name: '3x2 L-Shape Inv R',
    matrix: [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-2x3-bottom-left',
    name: '2x3 L-Shape BL',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-2x3-bottom-right',
    name: '2x3 L-Shape BR',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-2x3-top-left',
    name: '2x3 L-Shape TL',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },
  {
    id: 'l-2x3-top-right',
    name: '2x3 L-Shape TR',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    colorKey: 'amber',
    category: 'corners_l',
  },

  // 3x3 Large L-Shapes / Giant Corners (5 blocks) - 4 rotations
  {
    id: 'big-l-3x3-bl',
    name: '3x3 Big L BL',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    colorKey: 'rose',
    category: 'pentominoes',
  },
  {
    id: 'big-l-3x3-br',
    name: '3x3 Big L BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    colorKey: 'rose',
    category: 'pentominoes',
  },
  {
    id: 'big-l-3x3-tl',
    name: '3x3 Big L TL',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    colorKey: 'rose',
    category: 'pentominoes',
  },
  {
    id: 'big-l-3x3-tr',
    name: '3x3 Big L TR',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    colorKey: 'rose',
    category: 'pentominoes',
  },

  // T-Shapes (4 rotations)
  {
    id: 't-2x3-down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    colorKey: 'violet',
    category: 't_z',
  },
  {
    id: 't-2x3-up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    colorKey: 'violet',
    category: 't_z',
  },
  {
    id: 't-3x2-right',
    name: 'T-Shape Right',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    colorKey: 'violet',
    category: 't_z',
  },
  {
    id: 't-3x2-left',
    name: 'T-Shape Left',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    colorKey: 'violet',
    category: 't_z',
  },

  // Z and S Shapes
  {
    id: 'z-2x3',
    name: 'Z-Shape Horiz',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    colorKey: 'emerald',
    category: 't_z',
  },
  {
    id: 's-2x3',
    name: 'S-Shape Horiz',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    colorKey: 'emerald',
    category: 't_z',
  },
  {
    id: 'z-3x2',
    name: 'Z-Shape Vert',
    matrix: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    colorKey: 'cyan',
    category: 't_z',
  },
  {
    id: 's-3x2',
    name: 'S-Shape Vert',
    matrix: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    colorKey: 'cyan',
    category: 't_z',
  },

  // Hardcore Pentominoes (5 blocks)
  // Cross / Plus Shape (+)
  {
    id: 'pento-plus-3x3',
    name: 'Cross / Plus (+)',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    colorKey: 'rose',
    category: 'pentominoes',
  },
  // U-Shapes (4 rotations)
  {
    id: 'pento-u-up',
    name: 'U-Shape Up',
    matrix: [
      [1, 0, 1],
      [1, 1, 1],
    ],
    colorKey: 'violet',
    category: 'pentominoes',
  },
  {
    id: 'pento-u-down',
    name: 'U-Shape Down',
    matrix: [
      [1, 1, 1],
      [1, 0, 1],
    ],
    colorKey: 'violet',
    category: 'pentominoes',
  },
  {
    id: 'pento-u-left',
    name: 'U-Shape Left',
    matrix: [
      [1, 1],
      [1, 0],
      [1, 1],
    ],
    colorKey: 'violet',
    category: 'pentominoes',
  },
  {
    id: 'pento-u-right',
    name: 'U-Shape Right',
    matrix: [
      [1, 1],
      [0, 1],
      [1, 1],
    ],
    colorKey: 'violet',
    category: 'pentominoes',
  },
];

// Helper to create an empty 8x8 grid
export function createEmptyGrid(): GridBoard {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

// Check if a shape matrix can be placed at (startRow, startCol)
export function canPlaceShape(
  grid: GridBoard,
  matrix: number[][],
  startRow: number,
  startCol: number
): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Boundary check
  if (startRow < 0 || startCol < 0) return false;
  if (startRow + rows > GRID_SIZE || startCol + cols > GRID_SIZE) return false;

  // Overlap check
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        if (grid[startRow + r][startCol + c] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check if a shape matrix can legally fit in ANY position on the current board
export function canShapeFitAnywhere(grid: GridBoard, matrix: number[][]): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r <= GRID_SIZE - rows; r++) {
    for (let c = 0; c <= GRID_SIZE - cols; c++) {
      if (canPlaceShape(grid, matrix, r, c)) {
        return true;
      }
    }
  }

  return false;
}

// Check game over: If ANY remaining piece can fit, the game continues.
// If NONE of the remaining unplaced pieces can fit anywhere, return true.
export function checkIsGameOver(grid: GridBoard, trayPieces: TrayPiece[]): boolean {
  const remainingPieces = trayPieces.filter((p) => !p.placed);
  if (remainingPieces.length === 0) {
    return false; // All placed, new set will spawn
  }

  for (const piece of remainingPieces) {
    if (canShapeFitAnywhere(grid, piece.shape.matrix)) {
      return false; // At least one piece can fit!
    }
  }

  return true; // No remaining piece can fit anywhere
}

// Find rows and columns that are fully filled (strictly all 8/8 tiles filled)
export function findCompletedLines(grid: GridBoard): {
  fullRows: number[];
  fullCols: number[];
} {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  // Check rows: every single cell across all 8 columns must be non-null
  for (let r = 0; r < GRID_SIZE; r++) {
    const isRowComplete = grid[r].every((cell) => cell !== null);
    if (isRowComplete) {
      fullRows.push(r);
    }
  }

  // Check columns: every single cell across all 8 rows must be non-null
  for (let c = 0; c < GRID_SIZE; c++) {
    let filledCount = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (grid[r][c] !== null) {
        filledCount++;
      }
    }
    if (filledCount === GRID_SIZE) {
      fullCols.push(c);
    }
  }

  return { fullRows, fullCols };
}

// Count total blocks in a shape matrix
export function getBlockCellCount(matrix: number[][]): number {
  let count = 0;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 1) count++;
    }
  }
  return count;
}

// Calculate points awarded for a move
export function calculateMoveScore(
  cellCount: number,
  linesClearedCount: number,
  currentCombo: number
): {
  placementPoints: number;
  linePoints: number;
  comboBonus: number;
  totalPoints: number;
} {
  const placementPoints = cellCount; // 1 pt per cell placed

  let linePoints = 0;
  if (linesClearedCount === 1) {
    linePoints = 10;
  } else if (linesClearedCount === 2) {
    linePoints = 30;
  } else if (linesClearedCount === 3) {
    linePoints = 60;
  } else if (linesClearedCount >= 4) {
    linePoints = 100 + (linesClearedCount - 4) * 50;
  }

  // Combo multiplier: comboCounter * 15 pts if lines were cleared
  const comboBonus = linesClearedCount > 0 ? currentCombo * 15 : 0;
  const totalPoints = placementPoints + linePoints + comboBonus;

  return { placementPoints, linePoints, comboBonus, totalPoints };
}

// Filter shapes according to chosen preset and custom sandbox toggles
export function getFilteredShapePool(
  preset: ShapePreset = 'classic',
  customToggles?: ShapeCategoryToggles
): ShapeDefinition[] {
  if (preset === 'zen') {
    // Relaxing, easy high combos: 1x1 dot, 1x2, 2x1 lines, 2x2 square, 2x2 corner Ls
    return ALL_SHAPES.filter(
      (s) =>
        s.id === 'dot-1x1' ||
        s.id === 'line-1x2' ||
        s.id === 'line-2x1' ||
        s.id === 'square-2x2' ||
        s.id.startsWith('corner-2x2')
    );
  }

  if (preset === 'hardcore') {
    // Chaos mode: all shapes including Plus shape, U-shape, 3x3 big square, 5-block lines, giant corners
    return ALL_SHAPES;
  }

  if (preset === 'classic') {
    // Standard Block Blast polyominoes: all except specialized pentominoes (cross and u-shapes)
    return ALL_SHAPES.filter((s) => s.category !== 'pentominoes');
  }

  // Custom sandbox
  if (customToggles) {
    const pool = ALL_SHAPES.filter((s) => customToggles[s.category]);
    if (pool.length > 0) return pool;
  }

  // Fallback if nothing selected: dots & lines
  return ALL_SHAPES.filter((s) => s.category === 'dots' || s.category === 'lines');
}

// Generate a set of 3 candidate pieces with fair distribution and preset awareness
export function generateTrayPieces(
  grid?: GridBoard,
  preset: ShapePreset = 'classic',
  customToggles?: ShapeCategoryToggles
): TrayPiece[] {
  const generated: TrayPiece[] = [];
  const activePool = getFilteredShapePool(preset, customToggles);

  // Categorize shapes from the active pool to ensure balanced gameplay
  const smallShapes = activePool.filter((s) => getBlockCellCount(s.matrix) <= 3);
  const mediumShapes = activePool.filter((s) => {
    const count = getBlockCellCount(s.matrix);
    return count >= 4 && count <= 5 && s.matrix.length <= 3 && s.matrix[0].length <= 3;
  });
  const largeOrRareShapes = activePool.filter((s) => {
    const count = getBlockCellCount(s.matrix);
    return count >= 5 || s.matrix.length >= 4 || s.matrix[0].length >= 4;
  });

  for (let i = 0; i < 3; i++) {
    let pool: ShapeDefinition[];
    const rand = Math.random();

    if (preset === 'hardcore') {
      // In hardcore/chaos mode, spawn larger and pentomino pieces much more frequently!
      if (rand < 0.45 && largeOrRareShapes.length > 0) {
        pool = largeOrRareShapes;
      } else if (mediumShapes.length > 0) {
        pool = mediumShapes;
      } else {
        pool = activePool;
      }
    } else if (preset === 'zen') {
      // In zen mode, pick directly from the relaxing zen pool
      pool = activePool;
    } else {
      // Standard fair distribution
      if (i === 0 && smallShapes.length > 0) {
        pool = rand < 0.6 ? smallShapes : (mediumShapes.length > 0 ? mediumShapes : activePool);
      } else if (i === 1 && mediumShapes.length > 0) {
        pool = rand < 0.5 ? mediumShapes : activePool;
      } else {
        pool = rand < 0.25 && largeOrRareShapes.length > 0 ? largeOrRareShapes : activePool;
      }
    }

    if (!pool || pool.length === 0) pool = activePool;

    const shape = pool[Math.floor(Math.random() * pool.length)];
    const id = `tray-piece-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`;

    const canFit = grid ? canShapeFitAnywhere(grid, shape.matrix) : true;

    generated.push({
      id,
      shape,
      placed: false,
      canFit,
    });
  }

  return generated;
}

// Re-evaluate canFit status for all pieces in tray against current grid
export function updateTrayPiecesFit(
  trayPieces: TrayPiece[],
  grid: GridBoard
): TrayPiece[] {
  return trayPieces.map((piece) => {
    if (piece.placed) return piece;
    return {
      ...piece,
      canFit: canShapeFitAnywhere(grid, piece.shape.matrix),
    };
  });
}
