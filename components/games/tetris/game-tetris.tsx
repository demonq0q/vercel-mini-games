'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './game-tetris.module.css';
import { useAdaptiveLayout } from '@/lib/hooks/use-adaptive-layout';
import {
  getMergedBoard,
  getPieceCells,
  hardDropPiece,
  movePieceHorizontally,
  rotatePiece,
  softDropPiece,
  tickTetrisGame,
  createInitialTetrisGame,
  type BoardCell,
  type PieceType,
  type TetrisGameState,
} from '@/lib/games/tetris/engine';

const BEST_SCORE_STORAGE_KEY = 'vercel-mini-games:tetris:best-score';

const keyActionMap = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowDown: 'down',
  ArrowUp: 'rotate',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
  s: 'down',
  S: 'down',
  w: 'rotate',
  W: 'rotate',
  ' ': 'hard-drop',
} as const;

const actionButtons = [
  { action: 'left', label: '←' },
  { action: 'rotate', label: '⟳' },
  { action: 'right', label: '→' },
  { action: 'down', label: '↓' },
  { action: 'hard-drop', label: '⤓' },
] as const;

const tileClassMap: Record<PieceType, string> = {
  I: styles.cellI,
  O: styles.cellO,
  T: styles.cellT,
  S: styles.cellS,
  Z: styles.cellZ,
  J: styles.cellJ,
  L: styles.cellL,
};

function getTickDelay(level: number) {
  return Math.max(150, 780 - (level - 1) * 60);
}

function getCellClass(cell: BoardCell) {
  if (!cell) {
    return styles.cellEmpty;
  }

  return tileClassMap[cell];
}

export function GameTetris() {
  const [gameState, setGameState] = useState<TetrisGameState>(createInitialTetrisGame);
  const [bestScore, setBestScore] = useState(0);
  const [bestScoreReady, setBestScoreReady] = useState(false);
  const { preferMobileExperience } = useAdaptiveLayout();

  useEffect(() => {
    const savedBestScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);

    if (savedBestScore) {
      const parsedBestScore = Number(savedBestScore);

      if (Number.isFinite(parsedBestScore) && parsedBestScore > 0) {
        setBestScore(parsedBestScore);
      }
    }

    setBestScoreReady(true);
  }, []);

  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
    }
  }, [bestScore, gameState.score]);

  useEffect(() => {
    if (!bestScoreReady) {
      return;
    }

    window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(bestScore));
  }, [bestScore, bestScoreReady]);

  const handleRestart = useCallback(() => {
    setGameState(createInitialTetrisGame());
  }, []);

  const handleAction = useCallback((action: (typeof actionButtons)[number]['action']) => {
    setGameState((currentState) => {
      if (currentState.gameOver) {
        return currentState;
      }

      if (action === 'left') {
        return movePieceHorizontally(currentState, -1);
      }

      if (action === 'right') {
        return movePieceHorizontally(currentState, 1);
      }

      if (action === 'down') {
        return softDropPiece(currentState);
      }

      if (action === 'rotate') {
        return rotatePiece(currentState);
      }

      return hardDropPiece(currentState);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const action = keyActionMap[event.key as keyof typeof keyActionMap];

      if (!action) {
        return;
      }

      event.preventDefault();
      handleAction(action);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleAction]);

  useEffect(() => {
    if (gameState.gameOver) {
      return;
    }

    const timer = window.setInterval(() => {
      setGameState((currentState) => tickTetrisGame(currentState));
    }, getTickDelay(gameState.level));

    return () => {
      window.clearInterval(timer);
    };
  }, [gameState.gameOver, gameState.level]);

  const board = useMemo(() => getMergedBoard(gameState), [gameState]);
  const previewCells = useMemo(() => getPieceCells(gameState.nextPieceType, 0), [gameState.nextPieceType]);

  const statusText = useMemo(() => {
    if (gameState.gameOver) {
      return '顶部被堆满了，点“重新开始”可以立刻再开一局。';
    }

    if (preferMobileExperience) {
      return '已启用移动端优先布局，底部大按钮更适合触屏操作。';
    }

    return '方向键或 WASD 可移动和旋转，空格可以直接把当前方块落到底。';
  }, [gameState.gameOver, preferMobileExperience]);

  return (
    <section className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.scoreGroup}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>当前分数</span>
            <strong className={styles.scoreValue}>{gameState.score}</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>已消行数</span>
            <strong className={styles.scoreValue}>{gameState.lines}</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>当前等级</span>
            <strong className={styles.scoreValue}>{gameState.level}</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>最高分</span>
            <strong className={styles.scoreValue}>{bestScore}</strong>
          </div>
        </div>

        <button className={styles.restartButton} type="button" onClick={handleRestart}>
          重新开始
        </button>
      </div>

      <p className={`${styles.statusText} ${gameState.gameOver ? styles.statusDanger : ''}`} aria-live="polite">
        {statusText}
      </p>

      <div className={styles.playArea}>
        <div className={styles.board} role="grid" aria-label="俄罗斯方块棋盘">
          {board.map((row, rowIndex) =>
            row.map((cell, columnIndex) => (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className={`${styles.cell} ${getCellClass(cell)}`}
                role="gridcell"
                aria-label={cell ? `方块 ${cell}` : '空格'}
              />
            )),
          )}
        </div>

        <aside className={styles.sidePanel}>
          <section className={styles.previewBlock}>
            <h2 className={styles.sectionTitle}>下一块</h2>
            <div className={styles.previewGrid} aria-label="下一块预览">
              {Array.from({ length: 16 }, (_, index) => {
                const x = index % 4;
                const y = Math.floor(index / 4);
                const filled = previewCells.some((cell) => cell.x === x && cell.y === y);

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`${styles.previewCell} ${filled ? getCellClass(gameState.nextPieceType) : styles.cellEmpty}`}
                  />
                );
              })}
            </div>
          </section>

          <section className={styles.helpBlock}>
            <h2 className={styles.sectionTitle}>快捷操作</h2>
            <ul className={styles.helpList}>
              <li>左右移动：方向键 ← → 或 A / D</li>
              <li>旋转：方向键 ↑ 或 W</li>
              <li>加速下落：方向键 ↓ 或 S</li>
              <li>硬降到底：空格</li>
            </ul>
          </section>
        </aside>
      </div>

      <div className={`${styles.controlBar} ${preferMobileExperience ? styles.controlBarFloating : ''}`}>
        {actionButtons.map((button) => (
          <button
            key={button.action}
            className={styles.controlButton}
            type="button"
            onClick={() => handleAction(button.action)}
            disabled={gameState.gameOver}
          >
            {button.label}
          </button>
        ))}
      </div>
    </section>
  );
}
