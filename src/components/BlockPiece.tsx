import React from 'react';
import { BlockColorKey, BlockStyle } from '../types';
import { COLOR_DEFINITIONS } from '../utils/shapes';

interface SingleBlockCellProps {
  colorKey: BlockColorKey;
  sizePx?: number;
  blockStyle?: BlockStyle;
  isGhost?: boolean;
  isClearing?: boolean;
  className?: string;
}

export const SingleBlockCell: React.FC<SingleBlockCellProps> = ({
  colorKey,
  sizePx,
  blockStyle = 'candy_3d',
  isGhost = false,
  isClearing = false,
  className = '',
}) => {
  const colorDef = COLOR_DEFINITIONS[colorKey];
  const sizeStyle = sizePx && sizePx > 0 ? { width: `${sizePx}px`, height: `${sizePx}px` } : undefined;

  if (isGhost) {
    const ghostRadius = blockStyle === 'retro_8bit' ? 'rounded-none' : 'rounded-lg';
    return (
      <div
        style={{
          ...sizeStyle,
          backgroundColor: colorDef.primary,
          boxShadow: `0 0 12px ${colorDef.glow}`,
        }}
        className={`w-full h-full ${ghostRadius} opacity-60 border-2 border-white/60 animate-pulse transition-all ${className}`}
      />
    );
  }

  // 1. Candy 3D Style: Rounded corners, top-light highlight gradient, deep drop shadow for a puffy jelly look
  if (blockStyle === 'candy_3d') {
    return (
      <div
        style={sizeStyle}
        className={`relative w-full h-full rounded-[8px] overflow-hidden select-none transition-transform duration-100 shadow-sm ${
          isClearing ? 'scale-110 brightness-150 animate-ping' : ''
        } ${className}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${colorDef.gradient}`} />
        <div className="absolute inset-0 border-t-2 border-l-2 border-white/50 rounded-[8px] pointer-events-none" />
        <div className="absolute inset-0 border-b-2 border-r-2 border-black/35 rounded-[8px] pointer-events-none" />
        <div className="absolute inset-[3px] rounded-[5px] bg-white/15 pointer-events-none border border-white/20 shadow-inner" />
        <div className="absolute top-1 left-1 w-2 h-1 bg-white/40 rounded-full blur-[0.5px] pointer-events-none" />
      </div>
    );
  }

  // 2. Flat Modern Style: Clean flat vector colors with subtle inset borders
  if (blockStyle === 'flat_modern') {
    return (
      <div
        style={{
          ...sizeStyle,
          backgroundColor: colorDef.primary,
        }}
        className={`relative w-full h-full rounded-md overflow-hidden select-none transition-transform duration-100 border border-white/25 shadow-xs ${
          isClearing ? 'scale-110 brightness-150 animate-ping' : ''
        } ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-0.5 bg-white/30 pointer-events-none" />
      </div>
    );
  }

  // 3. 8-Bit Retro Style: Chunky hard borders and retro pixel shading
  return (
    <div
      style={{
        ...sizeStyle,
        backgroundColor: colorDef.primary,
      }}
      className={`relative w-full h-full rounded-none overflow-hidden select-none transition-transform duration-100 border-2 border-black ${
        isClearing ? 'scale-110 brightness-150 animate-ping' : ''
      } ${className}`}
    >
      {/* Retro 8-bit pixel bevel */}
      <div className="absolute inset-0 border-t-2 border-l-2 border-white/80 pointer-events-none" />
      <div className="absolute inset-0 border-b-2 border-r-2 border-black/85 pointer-events-none" />
      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/70 pointer-events-none" />
    </div>
  );
};

interface BlockPieceProps {
  matrix: number[][];
  colorKey: BlockColorKey;
  cellSize: number;
  blockStyle?: BlockStyle;
  gap?: number;
  isGhost?: boolean;
  className?: string;
}

export const BlockPiece: React.FC<BlockPieceProps> = ({
  matrix,
  colorKey,
  cellSize,
  blockStyle = 'candy_3d',
  gap = 2,
  isGhost = false,
  className = '',
}) => {
  const rows = matrix.length;
  const cols = matrix[0].length;

  return (
    <div
      className={`inline-grid select-none ${className}`}
      style={{
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            className="flex items-center justify-center"
          >
            {cell === 1 ? (
              <SingleBlockCell
                colorKey={colorKey}
                sizePx={cellSize}
                blockStyle={blockStyle}
                isGhost={isGhost}
              />
            ) : (
              <div style={{ width: `${cellSize}px`, height: `${cellSize}px` }} />
            )}
          </div>
        ))
      )}
    </div>
  );
};
