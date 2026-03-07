'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './game-2048.module.css';
import {
  createInitialBoard,
  moveBoard,
  type Board,
  type CellValue,
  type MoveDirection,
} from '@/lib/games/2048/engine';

const BEST_SCORE_STORAGE_KEY = 'vercel-mini-games:2048:best-score';

const keyDirectionMap: Record<string, MoveDirection | undefined> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

const moveButtons: Array<{ direction: MoveDirection; label: string }> = [
  { direction: 'up', label: '↑' },
  { direction: 'left', label: '←' },
  { direction: 'down', label: '↓' },
  { direction: 'right', label: '→' },
];

const tilePalette: Record<number, { background: string; color: string }> = {
  0: { background: 'rgba(148, 163, 184, 0.14)', color: 'transparent' },
  2: { background: '#eee4da', color: '#3f3125' },
  4: { background: '#ede0c8', color: '#3f3125' },
  8: { background: '#f2b179', color: '#fff7ed' },
  16: { background: '#f59563', color: '#fff7ed' },
  32: { background: '#f67c5f', color: '#fff7ed' },
  64: { background: '#f65e3b', color: '#fff7ed' },
  128: { background: '#edcf72', color: '#1e293b' },
  256: { background: '#edcc61', color: '#1e293b' },
  512: { background: '#edc850', color: '#1e293b' },
  1024: { background: '#edc53f', color: '#0f172a' },
  2048: { background: '#edc22e', color: '#0f172a' },
};

type Game2048State = {
  board: Board;
  score: number;
  won: boolean;
  gameOver: boolean;
};

function createNewGameState(): Game2048State {
  return {
    board: createInitialBoard(),
    score: 0,
    won: false,
    gameOver: false,
  };
}

function getTileStyle(value: CellValue) {
  const palette = tilePalette[value ?? 0] ?? { background: '#0f172a', color: '#f8fafc' };

  return {
    backgroundColor: palette.background,
    color: palette.color,
  };
}

function getCellLabel(value: CellValue) {
  return value ? `数字 ${value}` : '空格';
}

export function Game2048() {
  const [gameState, setGameState] = useState<Game2048State>(createNewGameState);
  const [bestScore, setBestScore] = useState(0);
  const [bestScoreReady, setBestScoreReady] = useState(false);

  useEffect(() => {
    const savedBestScore = window.localStorage.getItem(BEST_SCORE_STORAGE_KEY);

    if (!savedBestScore) {
      return;
    }

    const parsedBestScore = Number(savedBestScore);

    if (Number.isFinite(parsedBestScore) && parsedBestScore > 0) {
      setBestScore(parsedBestScore);
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
    setGameState(createNewGameState());
  }, []);

  const handleMove = useCallback((direction: MoveDirection) => {
    setGameState((currentState) => {
      if (currentState.gameOver) {
        return currentState;
      }

      const result = moveBoard(currentState.board, direction);

      if (!result.moved) {
        return currentState;
      }

      return {
        board: result.board,
        score: currentState.score + result.scoreDelta,
        won: currentState.won || result.won,
        gameOver: result.gameOver,
      };
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyDirectionMap[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleMove]);

  const statusText = useMemo(() => {
    if (gameState.gameOver) {
      return '本局结束了，点“重新开始”可以立刻再来一局。';
    }

    if (gameState.won) {
      return '你已经合成 2048，当前仍可继续冲更高分。';
    }

    return '使用方向键或 WASD 移动方块，相同数字会自动合并。';
  }, [gameState.gameOver, gameState.won]);

  return (
    <section className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.scoreGroup}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>当前分数</span>
            <strong className={styles.scoreValue}>{gameState.score}</strong>
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

      <p
        className={`${styles.statusText} ${gameState.gameOver ? styles.statusDanger : ''} ${gameState.won && !gameState.gameOver ? styles.statusSuccess : ''}`}
        aria-live="polite"
      >
        {statusText}
      </p>

      <div className={styles.board} role="grid" aria-label="2048 棋盘">
        {gameState.board.map((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={styles.cell}
              role="gridcell"
              aria-label={getCellLabel(cell)}
              style={getTileStyle(cell)}
            >
              {cell ?? ''}
            </div>
          )),
        )}
      </div>

      <div className={styles.controlArea}>
        <div className={styles.movePad} aria-label="方向按钮">
          <div className={styles.padSpacer} />
          <button
            className={styles.moveButton}
            type="button"
            onClick={() => handleMove('up')}
            disabled={gameState.gameOver}
          >
            ↑
          </button>
          <div className={styles.padSpacer} />

          {moveButtons.slice(1).map((item) => (
            <button
              key={item.direction}
              className={styles.moveButton}
              type="button"
              onClick={() => handleMove(item.direction)}
              disabled={gameState.gameOver}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className={styles.controlHint}>也可以直接用键盘方向键或 WASD 操作。</p>
      </div>
    </section>
  );
}
