import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Board } from './components/Board';
import { CustomizerModal } from './components/CustomizerModal';
import { DragOverlay } from './components/DragOverlay';
import { GameOverModal } from './components/GameOverModal';
import { Header } from './components/Header';
import { HowToPlayModal } from './components/HowToPlayModal';
import { ParticleCanvas, ParticleEmitterHandle } from './components/ParticleCanvas';
import { Tray } from './components/Tray';
import { CustomizerSettings, DragState, FloatingText, GridBoard, TrayPiece, UndoSnapshot } from './types';
import { sound } from './utils/audio';
import { haptics } from './utils/haptics';
import {
  calculateMoveScore,
  checkIsGameOver,
  COLOR_DEFINITIONS,
  createEmptyGrid,
  findCompletedLines,
  generateTrayPieces,
  getBlockCellCount,
  GRID_SIZE,
  updateTrayPiecesFit,
} from './utils/shapes';
import {
  loadSavedCustomizerSettings,
  saveCustomizerSettings,
  THEMES,
} from './utils/themeConfig';

const LOCAL_STORAGE_HIGH_SCORE = 'blockblast_highscore';
const COMBO_MAX_TIME = 9000; // 9 seconds to maintain combo streak

export default function App() {
  // Customizer & Shape Lab settings
  const [settings, setSettings] = useState<CustomizerSettings>(() => loadSavedCustomizerSettings());
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);
  const settingsRef = useRef<CustomizerSettings>(settings);
  settingsRef.current = settings;

  // Game states
  const [grid, setGrid] = useState<GridBoard>(() => createEmptyGrid());
  const [trayPieces, setTrayPieces] = useState<TrayPiece[]>(() => {
    const init = loadSavedCustomizerSettings();
    return generateTrayPieces(undefined, init.shapePreset, init.customCategories);
  });
  const [spawnKey, setSpawnKey] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE)) || 0;
    } catch {
      return 0;
    }
  });
  const [combo, setCombo] = useState<number>(0);
  const [comboTimeLeft, setComboTimeLeft] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [linesClearedTotal, setLinesClearedTotal] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [undoSnapshot, setUndoSnapshot] = useState<UndoSnapshot | null>(null);

  // Visual effects states
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Dragging states
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [returningPiece, setReturningPiece] = useState<{
    piece: TrayPiece;
    currentX: number;
    currentY: number;
    targetX: number;
    targetY: number;
    startTime: number;
  } | null>(null);

  // Refs for instantaneous access without React batching latency
  const gridRef = useRef<GridBoard>(grid);
  gridRef.current = grid;
  const dragStateRef = useRef<DragState | null>(dragState);
  dragStateRef.current = dragState;
  const trayPiecesRef = useRef<TrayPiece[]>(trayPieces);
  trayPiecesRef.current = trayPieces;

  // DOM Refs
  const boardRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<ParticleEmitterHandle | null>(null);
  const [boardCellSize, setBoardCellSize] = useState<number>(44);
  const lastSnappedCoordRef = useRef<{ row: number; col: number } | null>(null);

  // Update board cell size dynamically on mount / resize
  const measureBoard = useCallback(() => {
    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      // Board has padding, inside is 8x8 grid
      const innerSize = rect.width - 24; // account for p-2.5 / p-3
      const size = Math.floor(innerSize / 8);
      setBoardCellSize(Math.max(size, 32));
    }
  }, []);

  useEffect(() => {
    measureBoard();
    window.addEventListener('resize', measureBoard);
    return () => window.removeEventListener('resize', measureBoard);
  }, [measureBoard]);

  // Update customizer settings
  const handleUpdateSettings = useCallback((newSettings: CustomizerSettings) => {
    setSettings(newSettings);
    settingsRef.current = newSettings;
    saveCustomizerSettings(newSettings);
  }, []);

  // Restart / Reset Game
  const restartGame = useCallback(() => {
    const empty = createEmptyGrid();
    const newPieces = generateTrayPieces(
      empty,
      settingsRef.current.shapePreset,
      settingsRef.current.customCategories
    );
    gridRef.current = empty;
    trayPiecesRef.current = newPieces;
    dragStateRef.current = null;
    setGrid(empty);
    setTrayPieces(newPieces);
    setSpawnKey((prev) => prev + 1);
    setScore(0);
    setCombo(0);
    setComboTimeLeft(0);
    setMaxCombo(0);
    setLinesClearedTotal(0);
    setUndoSnapshot(null);
    setIsGameOver(false);
    setIsNewHighScore(false);
    setClearingCells(new Set());
    setFloatingTexts([]);
    setDragState(null);
    setReturningPiece(null);
    particleCanvasRef.current?.clear();
    sound.playPlace();
  }, []);

  // Combo countdown timer loop: slowly depletes over time if no lines are cleared
  useEffect(() => {
    if (combo <= 0 || isGameOver || showCustomizer || showHelp) {
      return;
    }

    let lastTimestamp = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      setComboTimeLeft((prev) => {
        const nextTime = prev - delta;
        if (nextTime <= 0) {
          // Time expired! Reset combo streak
          setCombo(0);
          sound.playComboExpire();
          haptics.comboExpire();

          if (boardRef.current) {
            const boardWidth = boardRef.current.clientWidth || 320;
            const boardHeight = boardRef.current.clientHeight || 320;
            const floatId = `float-expired-${Date.now()}`;
            setFloatingTexts((f) => [
              ...f,
              {
                id: floatId,
                text: 'STREAK EXPIRED',
                x: boardWidth / 2,
                y: boardHeight / 2,
                color: '#f87171',
              },
            ]);
            setTimeout(() => {
              setFloatingTexts((f) => f.filter((item) => item.id !== floatId));
            }, 1000);
          }

          return 0;
        }
        return nextTime;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [combo, isGameOver, showCustomizer, showHelp]);

  // Spawn new tray pieces when all are placed
  const checkTrayRefill = useCallback(
    (currentPieces: TrayPiece[], currentGrid: GridBoard) => {
      const allPlaced = currentPieces.every((p) => p.placed);
      if (allPlaced) {
        const freshPieces = generateTrayPieces(
          currentGrid,
          settingsRef.current.shapePreset,
          settingsRef.current.customCategories
        );
        trayPiecesRef.current = freshPieces;
        setTrayPieces(freshPieces);
        setSpawnKey((prev) => prev + 1);

        // Check if any fresh piece can fit
        if (checkIsGameOver(currentGrid, freshPieces)) {
          setTimeout(() => {
            setIsGameOver(true);
            sound.playGameOver();
            haptics.gameOver();
          }, 300);
        }
      }
    },
    []
  );

  // Audio mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Start dragging a candidate block piece
  const handleStartDrag = useCallback(
    (
      piece: TrayPiece,
      originRect: DOMRect,
      clientX: number,
      clientY: number,
      isTouch: boolean
    ) => {
      if (isGameOver) return;

      sound.playPickup();
      haptics.pickup();
      lastSnappedCoordRef.current = null;

      // Finger Y-offset on mobile so thumb does not obscure the block
      const effectiveY = isTouch ? clientY - 72 : clientY;

      setDragState({
        pieceId: piece.id,
        piece,
        currentX: clientX,
        currentY: effectiveY,
        originRect,
        snappedRow: null,
        snappedCol: null,
        isValidPlacement: false,
        isTouch,
      });
    },
    [isGameOver]
  );

  // Global Pointer / Touch listeners during dragging
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const currentDrag = dragStateRef.current;
      if (!currentDrag) return;

      const isTouch = currentDrag.isTouch;
      const currentX = e.clientX;
      const currentY = isTouch ? e.clientY - 72 : e.clientY;

      if (!boardRef.current) {
        const nextState = { ...currentDrag, currentX, currentY };
        dragStateRef.current = nextState;
        setDragState(nextState);
        return;
      }

      const boardRect = boardRef.current.getBoundingClientRect();
      const gridEl = boardRef.current.querySelector('.grid');
      const gridRect = gridEl ? gridEl.getBoundingClientRect() : boardRect;
      const matrix = currentDrag.piece.shape.matrix;
      const rows = matrix.length;
      const cols = matrix[0].length;

      // Calculate exact cell width & height inside the 8x8 grid
      const cellW = gridRect.width / GRID_SIZE;
      const cellH = gridRect.height / GRID_SIZE;

      // Piece visual center is at (currentX, currentY)
      // Top-left of the piece bounding box:
      const pieceLeft = currentX - (cols * cellW) / 2;
      const pieceTop = currentY - (rows * cellH) / 2;

      // Relative to inner grid top-left:
      const relX = pieceLeft - gridRect.left;
      const relY = pieceTop - gridRect.top;

      // Nearest grid row and column
      const targetCol = Math.round(relX / cellW);
      const targetRow = Math.round(relY / cellH);

      // Check if candidate placement is within bounds and free of collisions
      const currentBoard = gridRef.current;
      const isValid =
        targetRow >= 0 &&
        targetCol >= 0 &&
        targetRow + rows <= GRID_SIZE &&
        targetCol + cols <= GRID_SIZE &&
        matrix.every((r, rIdx) =>
          r.every((val, cIdx) => {
            if (val === 0) return true;
            return currentBoard[targetRow + rIdx][targetCol + cIdx] === null;
          })
        );

      // Soft snap audio tick when snapping to a fresh valid spot
      if (isValid) {
        if (
          !lastSnappedCoordRef.current ||
          lastSnappedCoordRef.current.row !== targetRow ||
          lastSnappedCoordRef.current.col !== targetCol
        ) {
          sound.playSnap();
          haptics.snap();
          lastSnappedCoordRef.current = { row: targetRow, col: targetCol };
        }
      } else {
        lastSnappedCoordRef.current = null;
      }

      const nextState: DragState = {
        ...currentDrag,
        currentX,
        currentY,
        snappedRow: isValid ? targetRow : null,
        snappedCol: isValid ? targetCol : null,
        isValidPlacement: isValid,
      };

      dragStateRef.current = nextState;
      setDragState(nextState);
    };

    const handlePointerUp = () => {
      const currentDrag = dragStateRef.current;
      if (!currentDrag) return;

      const { isValidPlacement, snappedRow, snappedCol, piece, originRect, currentX, currentY } =
        currentDrag;

      if (isValidPlacement && snappedRow !== null && snappedCol !== null) {
        // Record pre-placement state in case this move can be undone
        const previousStateSnapshot: UndoSnapshot = {
          grid: gridRef.current.map((row) => [...row]),
          trayPieces: trayPiecesRef.current.map((p) => ({ ...p })),
          score,
          combo,
          comboTimeLeft,
          placedPieceId: piece.id,
        };

        // 1. Commit the newly placed piece permanently onto the grid
        const matrix = piece.shape.matrix;
        const colorKey = piece.shape.colorKey;
        const currentBoard = gridRef.current;
        const newGrid: GridBoard = currentBoard.map((row) => [...row]);

        for (let r = 0; r < matrix.length; r++) {
          for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c] === 1) {
              newGrid[snappedRow + r][snappedCol + c] = colorKey;
            }
          }
        }

        // Commit to state and ref immediately so placed blocks are visibly locked onto the board
        gridRef.current = newGrid;
        setGrid(newGrid);

        sound.playPlace();
        haptics.place();

        // Mark piece as placed in tray
        const updatedPieces = trayPiecesRef.current.map((p) =>
          p.id === piece.id ? { ...p, placed: true } : p
        );
        trayPiecesRef.current = updatedPieces;
        setTrayPieces(updatedPieces);

        // 2. Strictly check for lines where all 8/8 cells are filled
        const { fullRows, fullCols } = findCompletedLines(newGrid);
        const linesCount = fullRows.length + fullCols.length;
        const cellCount = getBlockCellCount(matrix);

        let nextCombo = combo;
        if (linesCount > 0) {
          nextCombo = combo + 1;
          setCombo(nextCombo);
          setComboTimeLeft(COMBO_MAX_TIME); // Refresh combo meter to full!
          setMaxCombo((prev) => Math.max(prev, nextCombo));
          setLinesClearedTotal((prev) => prev + linesCount);
        } else {
          // If no lines cleared, streak remains active while timer counts down.
          // Apply a 1.2s time nudge so the player feels the urgency
          if (combo > 0) {
            setComboTimeLeft((prev) => Math.max(0, prev - 1200));
          }
        }

        // Calculate score
        const { totalPoints, comboBonus } = calculateMoveScore(
          cellCount,
          linesCount,
          nextCombo
        );

        const newTotalScore = score + totalPoints;
        setScore(newTotalScore);

        // Check high score
        if (newTotalScore > highScore) {
          setHighScore(newTotalScore);
          setIsNewHighScore(true);
          try {
            localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE, String(newTotalScore));
          } catch {
            // Ignore storage errors
          }
        }

        // 3. ONLY clear cells if lines were actually completed (linesCount > 0)
        if (linesCount > 0) {
          // Clearing lines invalidates undo as per game rules
          setUndoSnapshot(null);

          const cellsToClear = new Set<string>();
          fullRows.forEach((r) => {
            for (let c = 0; c < GRID_SIZE; c++) cellsToClear.add(`${r},${c}`);
          });
          fullCols.forEach((c) => {
            for (let r = 0; r < GRID_SIZE; r++) cellsToClear.add(`${r},${c}`);
          });

          setClearingCells(cellsToClear);

          // Audio & Haptics
          sound.playClear(nextCombo, linesCount);
          haptics.clear(linesCount, nextCombo);
          if (nextCombo >= 3) {
            sound.playComboFanfare(nextCombo);
          }

          // Screen shake for 2+ lines
          if (linesCount >= 2) {
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 380);
          }

          // Emit particles from cleared cells
          if (boardRef.current && particleCanvasRef.current) {
            const boardRect = boardRef.current.getBoundingClientRect();
            const gridEl = boardRef.current.querySelector('.grid');
            const gridRect = gridEl ? gridEl.getBoundingClientRect() : boardRect;
            const offsetX = gridRect.left - boardRect.left;
            const offsetY = gridRect.top - boardRect.top;
            const cellW = gridRect.width / GRID_SIZE;
            const cellH = gridRect.height / GRID_SIZE;

            cellsToClear.forEach((coordStr) => {
              const [r, c] = coordStr.split(',').map(Number);
              const x = offsetX + (c + 0.5) * cellW;
              const y = offsetY + (r + 0.5) * cellH;
              const cellColor = newGrid[r][c] || piece.shape.colorKey;
              const colorHex = COLOR_DEFINITIONS[cellColor]?.particleColor || '#ffffff';
              particleCanvasRef.current?.emitBurst(x, y, colorHex, 10);
            });

            // Combo stars celebration
            if (nextCombo > 1) {
              particleCanvasRef.current?.emitComboStars(
                boardRect.width / 2,
                boardRect.height / 2,
                nextCombo
              );
            }
          }

          // Floating score text popup
          const floatId = `float-${Date.now()}`;
          const isBigCombo = nextCombo >= 2;
          const bannerText =
            linesCount >= 3
              ? `+${totalPoints} SUPER CLEAR!`
              : isBigCombo
              ? `COMBO x${nextCombo}! +${totalPoints}`
              : `+${totalPoints}`;

          const sub = comboBonus > 0 ? `Streak Bonus +${comboBonus}` : undefined;

          setFloatingTexts((prev) => [
            ...prev,
            {
              id: floatId,
              text: bannerText,
              subText: sub,
              x: (boardRef.current?.clientWidth || 320) / 2,
              y: (boardRef.current?.clientHeight || 320) / 2 - (isBigCombo ? 20 : 0),
              color: isBigCombo ? '#fbbf24' : '#ffffff',
            },
          ]);

          setTimeout(() => {
            setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
          }, 1200);

          // Clear completed lines after short flash
          setTimeout(() => {
            const cleanedGrid: GridBoard = newGrid.map((row, r) =>
              row.map((cell, c) => (cellsToClear.has(`${r},${c}`) ? null : cell))
            );

            gridRef.current = cleanedGrid;
            setGrid(cleanedGrid);
            setClearingCells(new Set());

            // Recheck fit status for remaining pieces
            const refreshedPieces = updateTrayPiecesFit(updatedPieces, cleanedGrid);
            trayPiecesRef.current = refreshedPieces;
            setTrayPieces(refreshedPieces);

            // Refill tray if all placed, otherwise check game over
            const remainingCount = refreshedPieces.filter((p) => !p.placed).length;
            if (remainingCount === 0) {
              checkTrayRefill(refreshedPieces, cleanedGrid);
            } else if (checkIsGameOver(cleanedGrid, refreshedPieces)) {
              setTimeout(() => {
                setIsGameOver(true);
                sound.playGameOver();
                haptics.gameOver();
              }, 400);
            }
          }, 240);
        } else {
          // Zero lines cleared: piece remains permanently on newGrid
          const floatId = `float-${Date.now()}`;
          setFloatingTexts((prev) => [
            ...prev,
            {
              id: floatId,
              text: `+${totalPoints}`,
              x: (boardRef.current?.clientWidth || 320) / 2,
              y: (boardRef.current?.clientHeight || 320) / 2,
              color: '#94a3b8',
            },
          ]);
          setTimeout(() => {
            setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
          }, 1000);

          // Recheck fit status for remaining pieces
          const refreshedPieces = updateTrayPiecesFit(updatedPieces, newGrid);
          trayPiecesRef.current = refreshedPieces;
          setTrayPieces(refreshedPieces);

          // Refill tray if all placed, otherwise check game over
          const remainingCount = refreshedPieces.filter((p) => !p.placed).length;
          if (remainingCount === 0) {
            setUndoSnapshot(null);
            checkTrayRefill(refreshedPieces, newGrid);
          } else if (checkIsGameOver(newGrid, refreshedPieces)) {
            setUndoSnapshot(null);
            setTimeout(() => {
              setIsGameOver(true);
              sound.playGameOver();
              haptics.gameOver();
            }, 300);
          } else {
            // Valid move with zero lines cleared and not game over: allow single undo
            setUndoSnapshot(previousStateSnapshot);
          }
        }
      } else {
        // Invalid release: animate smoothly back to tray slot
        if (originRect) {
          const targetX = originRect.left + originRect.width / 2;
          const targetY = originRect.top + originRect.height / 2;

          setReturningPiece({
            piece,
            currentX,
            currentY,
            targetX,
            targetY,
            startTime: Date.now(),
          });

          setTimeout(() => {
            setReturningPiece(null);
          }, 220);
        }
      }

      dragStateRef.current = null;
      setDragState(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, grid, trayPieces, score, highScore, combo, comboTimeLeft, checkTrayRefill]);

  // Undo last placed block (reverts grid, restores tray piece, and resets combo streak)
  const handleUndo = useCallback(() => {
    if (!undoSnapshot || isGameOver) return;

    // 1. Revert grid to previous snapshot
    gridRef.current = undoSnapshot.grid;
    setGrid(undoSnapshot.grid);

    // 2. Revert tray pieces and re-check fitting against reverted board
    const restoredPieces = updateTrayPiecesFit(undoSnapshot.trayPieces, undoSnapshot.grid);
    trayPiecesRef.current = restoredPieces;
    setTrayPieces(restoredPieces);

    // 3. Revert score
    setScore(undoSnapshot.score);

    // 4. Reset combo streak accordingly
    setCombo(0);
    setComboTimeLeft(0);

    // 5. Audio and visual feedback
    sound.playUndo();
    haptics.undo();

    if (boardRef.current) {
      const boardWidth = boardRef.current.clientWidth || 320;
      const boardHeight = boardRef.current.clientHeight || 320;
      const floatId = `float-undo-${Date.now()}`;
      setFloatingTexts((prev) => [
        ...prev,
        {
          id: floatId,
          text: 'MOVE UNDONE',
          x: boardWidth / 2,
          y: boardHeight / 2,
          color: '#38bdf8',
        },
      ]);
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((f) => f.id !== floatId));
      }, 900);
    }

    // 6. Clear snapshot so undo is single-step
    setUndoSnapshot(null);
  }, [undoSnapshot, isGameOver]);

  const themeConfig = THEMES[settings.theme] || THEMES.midnight;

  return (
    <div
      className={`min-h-screen ${themeConfig.pageBg} ${themeConfig.pageText} flex flex-col justify-between items-center selection:bg-transparent overflow-hidden transition-colors duration-300`}
    >
      {/* Container restricted to mobile-friendly column centered on desktop */}
      <main className="w-full max-w-[480px] mx-auto flex flex-col justify-between min-h-screen px-2 py-1 relative">
        {/* Top Header */}
        <Header
          score={score}
          highScore={highScore}
          combo={combo}
          comboTimeLeft={comboTimeLeft}
          maxComboTime={COMBO_MAX_TIME}
          canUndo={!!undoSnapshot && !isGameOver}
          onUndo={handleUndo}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onRestart={restartGame}
          onOpenHelp={() => setShowHelp(true)}
          onOpenCustomizer={() => setShowCustomizer(true)}
          theme={settings.theme}
        />

        {/* 8x8 Board Container */}
        <div className="relative w-full flex-1 flex items-center justify-center my-auto">
          <Board
            ref={boardRef}
            grid={grid}
            dragState={dragState}
            clearingCells={clearingCells}
            isShaking={isShaking}
            floatingTexts={floatingTexts}
            theme={settings.theme}
            blockStyle={settings.blockStyle}
          />
          {/* Particle System Canvas overlaying the board */}
          <ParticleCanvas ref={particleCanvasRef} />
        </div>

        {/* Candidate Pieces Tray */}
        <Tray
          pieces={trayPieces}
          dragState={dragState}
          onStartDrag={handleStartDrag}
          spawnKey={spawnKey}
          theme={settings.theme}
          blockStyle={settings.blockStyle}
        />
      </main>

      {/* Floating Drag Overlay */}
      <DragOverlay
        dragState={dragState}
        boardCellSize={boardCellSize}
        returningPiece={returningPiece}
        blockStyle={settings.blockStyle}
      />

      {/* Customizer & Shape Lab Modal */}
      {showCustomizer && (
        <CustomizerModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onRestartWithPreset={restartGame}
          onClose={() => setShowCustomizer(false)}
        />
      )}

      {/* Game Over Modal */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          maxCombo={maxCombo}
          linesClearedTotal={linesClearedTotal}
          onPlayAgain={restartGame}
        />
      )}

      {/* How to play Modal */}
      {showHelp && <HowToPlayModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
