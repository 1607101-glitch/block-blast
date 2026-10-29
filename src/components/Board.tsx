import React, { forwardRef } from 'react';
import { BlockStyle, BoardTheme, DragState, FloatingText, GridBoard } from '../types';
import { GRID_SIZE } from '../utils/shapes';
import { THEMES } from '../utils/themeConfig';
import { SingleBlockCell } from './BlockPiece';

interface BoardProps {
  grid: GridBoard;
  dragState: DragState | null;
  clearingCells: Set<string>; // set of "r,c" strings
  isShaking: boolean;
  floatingTexts: FloatingText[];
  theme?: BoardTheme;
  blockStyle?: BlockStyle;
}

export const Board = forwardRef<HTMLDivElement, BoardProps>(
  (
    {
      grid,
      dragState,
      clearingCells,
      isShaking,
      floatingTexts,
      theme = 'midnight',
      blockStyle = 'candy_3d',
    },
    ref
  ) => {
    const themeConfig = THEMES[theme] || THEMES.midnight;

    // Determine ghost cells
    const ghostCellsMap = new Map<string, string>(); // "r,c" -> colorKey

    if (
      dragState &&
      dragState.isValidPlacement &&
      dragState.snappedRow !== null &&
      dragState.snappedCol !== null
    ) {
      const matrix = dragState.piece.shape.matrix;
      const baseRow = dragState.snappedRow;
      const baseCol = dragState.snappedCol;

      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c] === 1) {
            const targetRow = baseRow + r;
            const targetCol = baseCol + c;
            if (
              targetRow >= 0 &&
              targetRow < GRID_SIZE &&
              targetCol >= 0 &&
              targetCol < GRID_SIZE
            ) {
              ghostCellsMap.set(
                `${targetRow},${targetCol}`,
                dragState.piece.shape.colorKey
              );
            }
          }
        }
      }
    }

    const cellRadius = blockStyle === 'retro_8bit' ? 'rounded-none' : 'rounded-[6px] sm:rounded-[8px]';

    return (
      <div className="relative mx-auto w-full max-w-[420px] aspect-square p-2 sm:p-3">
        {/* Outer board casing */}
        <div
          ref={ref}
          id="block-blast-board"
          className={`relative w-full h-full rounded-2xl ${themeConfig.boardCasingBg} p-2 sm:p-2.5 shadow-2xl border ${themeConfig.boardCasingBorder} backdrop-blur-sm transition-all duration-200 ${
            isShaking ? 'animate-board-shake' : ''
          }`}
          style={{
            boxShadow: themeConfig.boardCasingShadow,
          }}
        >
          {/* 8x8 Grid */}
          <div className="grid grid-cols-8 grid-rows-8 gap-1.5 sm:gap-2 w-full h-full">
            {grid.map((row, rIdx) =>
              row.map((cellColor, cIdx) => {
                const key = `${rIdx},${cIdx}`;
                const isClearing = clearingCells.has(key);
                const ghostColor = ghostCellsMap.get(key);

                return (
                  <div
                    key={key}
                    data-cell-row={rIdx}
                    data-cell-col={cIdx}
                    className={`relative w-full h-full ${cellRadius} ${themeConfig.emptyCellBg} border ${themeConfig.emptyCellBorder} flex items-center justify-center overflow-hidden transition-colors`}
                    style={{
                      boxShadow: themeConfig.emptyCellShadow,
                    }}
                  >
                    {/* Occupied block */}
                    {cellColor && (
                      <div
                        className={`w-full h-full ${
                          isClearing ? 'animate-cell-clear' : ''
                        }`}
                      >
                        <SingleBlockCell
                          colorKey={cellColor}
                          blockStyle={blockStyle}
                          className="w-full h-full"
                        />
                      </div>
                    )}

                    {/* Ghost preview */}
                    {!cellColor && ghostColor && (
                      <SingleBlockCell
                        colorKey={ghostColor as any}
                        blockStyle={blockStyle}
                        isGhost={true}
                        className="w-full h-full"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Floating score & combo announcements */}
          <div className="pointer-events-none absolute inset-0 z-40 overflow-visible">
            {floatingTexts.map((ft) => (
              <div
                key={ft.id}
                className="absolute animate-float-up pointer-events-none flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${ft.x}px`,
                  top: `${ft.y}px`,
                }}
              >
                <span
                  className="font-black text-xl sm:text-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-wide"
                  style={{ color: ft.color }}
                >
                  {ft.text}
                </span>
                {ft.subText && (
                  <span className="font-extrabold text-xs sm:text-sm text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase tracking-wider">
                    {ft.subText}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Board.displayName = 'Board';
