import React from 'react';
import { BlockStyle, DragState, TrayPiece } from '../types';
import { BlockPiece } from './BlockPiece';

interface ReturningPieceState {
  piece: TrayPiece;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  startTime: number;
}

interface DragOverlayProps {
  dragState: DragState | null;
  boardCellSize: number;
  returningPiece: ReturningPieceState | null;
  blockStyle?: BlockStyle;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({
  dragState,
  boardCellSize,
  returningPiece,
  blockStyle = 'candy_3d',
}) => {
  // If active drag is occurring
  if (dragState) {
    const matrix = dragState.piece.shape.matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const gap = 2;
    const pieceWidth = cols * boardCellSize + (cols - 1) * gap;
    const pieceHeight = rows * boardCellSize + (rows - 1) * gap;

    return (
      <div
        className="pointer-events-none fixed z-50 transition-none"
        style={{
          left: `${dragState.currentX - pieceWidth / 2}px`,
          top: `${dragState.currentY - pieceHeight / 2}px`,
          width: `${pieceWidth}px`,
          height: `${pieceHeight}px`,
          filter: 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45))',
        }}
      >
        <BlockPiece
          matrix={matrix}
          colorKey={dragState.piece.shape.colorKey}
          cellSize={boardCellSize}
          blockStyle={blockStyle}
          gap={gap}
        />
      </div>
    );
  }

  // If a piece was released on invalid cell and is returning to its tray slot
  if (returningPiece) {
    const matrix = returningPiece.piece.shape.matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const gap = 2;
    const pieceWidth = cols * boardCellSize + (cols - 1) * gap;
    const pieceHeight = rows * boardCellSize + (rows - 1) * gap;

    return (
      <div
        className="pointer-events-none fixed z-50 transition-all duration-200 ease-out"
        style={{
          left: `${returningPiece.targetX - pieceWidth / 2}px`,
          top: `${returningPiece.targetY - pieceHeight / 2}px`,
          width: `${pieceWidth}px`,
          height: `${pieceHeight}px`,
          transform: 'scale(0.8)',
          opacity: 0.8,
        }}
      >
        <BlockPiece
          matrix={matrix}
          colorKey={returningPiece.piece.shape.colorKey}
          cellSize={boardCellSize}
          blockStyle={blockStyle}
          gap={gap}
        />
      </div>
    );
  }

  return null;
};
