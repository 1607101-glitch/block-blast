import React from 'react';
import { BlockStyle, BoardTheme, DragState, TrayPiece } from '../types';
import { THEMES } from '../utils/themeConfig';
import { BlockPiece } from './BlockPiece';

interface TrayProps {
  pieces: TrayPiece[];
  dragState: DragState | null;
  onStartDrag: (
    piece: TrayPiece,
    originRect: DOMRect,
    clientX: number,
    clientY: number,
    isTouch: boolean
  ) => void;
  spawnKey: number; // triggers pop-in animation on new set
  theme?: BoardTheme;
  blockStyle?: BlockStyle;
}

export const Tray: React.FC<TrayProps> = ({
  pieces,
  dragState,
  onStartDrag,
  spawnKey,
  theme = 'midnight',
  blockStyle = 'candy_3d',
}) => {
  const themeConfig = THEMES[theme] || THEMES.midnight;

  return (
    <div className="w-full max-w-[420px] mx-auto px-2 sm:px-3 pt-2 pb-4">
      <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center justify-items-center h-28 sm:h-32">
        {pieces.map((piece, index) => {
          // If this piece is currently being dragged, keep slot empty
          const isBeingDragged = dragState?.pieceId === piece.id;

          if (piece.placed) {
            return (
              <div
                key={piece.id}
                className={`w-full h-full flex items-center justify-center rounded-xl ${themeConfig.emptyCellBg} opacity-40 border ${themeConfig.emptyCellBorder}`}
              />
            );
          }

          return (
            <div
              key={`${piece.id}-${spawnKey}`}
              className={`relative w-full h-full flex items-center justify-center rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} transition-all select-none`}
            >
              {!isBeingDragged && (
                <div
                  onPointerDown={(e) => {
                    // Prevent default to prevent mobile scrolling during piece grab
                    e.preventDefault();
                    const target = e.currentTarget;
                    const rect = target.getBoundingClientRect();
                    const isTouch = e.pointerType === 'touch';
                    onStartDrag(piece, rect, e.clientX, e.clientY, isTouch);
                  }}
                  className={`animate-tray-spawn cursor-grab active:cursor-grabbing p-2 transition-all transform hover:scale-105 active:scale-95 touch-none ${
                    !piece.canFit ? 'opacity-35 grayscale contrast-75' : 'opacity-100'
                  }`}
                  style={{
                    animationDelay: `${index * 60}ms`,
                  }}
                >
                  <BlockPiece
                    matrix={piece.shape.matrix}
                    colorKey={piece.shape.colorKey}
                    cellSize={20}
                    blockStyle={blockStyle}
                    gap={2}
                  />
                  {!piece.canFit && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-bold text-slate-400/80 bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur-xs">
                        No fit
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
