'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './game-snake.module.css';
import {
  advanceSnakeGame,
  BOARD_SIZE,
  createInitialSnakeGame,
  type Point,
  type SnakeDirection,
  type SnakeGameState,
} from '@/lib/games/snake/engine';

const BEST_SCORE_STORAGE_KEY = 'vercel-mini-games:snake:best-score';
const GAME_TICK_MS = 150;

const keyDirectionMap: Record<string, SnakeDirection | undefined> = {
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

const directionButtons: Array<{ direction: SnakeDirection; label: string }> = [
  { direction: 'up', label: '↑' },
  { direction: 'left', label: '←' },
  { direction: 'down', label: '↓' },
  { direction: 'right', label: '→' },
];

function isSamePoint(first: Point, second: Point) {
  return first.x === second.x && first.y === second.y;
}

function isOppositeDirection(current: SnakeDirection, next: SnakeDirection) {
  return (
    (current === 'up' && next === 'down') ||
    (current === 'down' && next === 'up') ||
    (current === 'left' && next === 'right') ||
    (current === 'right' && next === 'left')
  );
}

function getCellType(point: Point, gameState: SnakeGameState) {
  if (gameState.food && isSamePoint(point, gameState.food)) {
    return 'food';
  }

  if (isSamePoint(point, gameState.snake[0])) {
    return 'head';
  }

  if (gameState.snake.some((segment, index) => index > 0 && isSamePoint(point, segment))) {
    return 'body';
  }

  return 'empty';
}

export function GameSnake() {
  const [gameState, setGameState] = useState<SnakeGameState>(createInitialSnakeGame);
  const [bestScore, setBestScore] = useState(0);
  const [bestScoreReady, setBestScoreReady] = useState(false);

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
    setGameState(createInitialSnakeGame());
  }, []);

  const handleTurn = useCallback((nextDirection: SnakeDirection) => {
    setGameState((currentState) => {
      if (currentState.gameOver || currentState.won) {
        return currentState;
      }

      if (isOppositeDirection(currentState.direction, nextDirection)) {
        return currentState;
      }

      return {
        ...currentState,
        direction: nextDirection,
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
      handleTurn(direction);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleTurn]);

  useEffect(() => {
    if (gameState.gameOver || gameState.won) {
      return;
    }

    const timer = window.setInterval(() => {
      setGameState((currentState) => advanceSnakeGame(currentState));
    }, GAME_TICK_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [gameState.gameOver, gameState.won]);

  const cells = useMemo(() => {
    return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
      const x = index % BOARD_SIZE;
      const y = Math.floor(index / BOARD_SIZE);
      const point = { x, y };

      return {
        key: `${x}-${y}`,
        type: getCellType(point, gameState),
      };
    });
  }, [gameState]);

  const statusText = useMemo(() => {
    if (gameState.won) {
      return '你已经占满整张地图，恭喜通关。';
    }

    if (gameState.gameOver) {
      return '撞到了，点“重新开始”就能立刻再来一局。';
    }

    return '使用方向键或 WASD 控制移动，吃到食物后身体会变长。';
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
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>当前长度</span>
            <strong className={styles.scoreValue}>{gameState.snake.length}</strong>
          </div>
        </div>

        <button className={styles.restartButton} type="button" onClick={handleRestart}>
          重新开始
        </button>
      </div>

      <p
        className={`${styles.statusText} ${gameState.gameOver ? styles.statusDanger : ''} ${gameState.won ? styles.statusSuccess : ''}`}
        aria-live="polite"
      >
        {statusText}
      </p>

      <div className={styles.board} role="grid" aria-label="贪吃蛇棋盘">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={`${styles.cell} ${styles[`cell-${cell.type}`]}`}
            role="gridcell"
            aria-label={cell.type === 'food' ? '食物' : cell.type === 'head' ? '蛇头' : cell.type === 'body' ? '蛇身' : '空格'}
          />
        ))}
      </div>

      <div className={styles.controlArea}>
        <div className={styles.movePad} aria-label="方向按钮">
          <div className={styles.padSpacer} />
          <button
            className={styles.moveButton}
            type="button"
            onClick={() => handleTurn('up')}
            disabled={gameState.gameOver || gameState.won}
          >
            ↑
          </button>
          <div className={styles.padSpacer} />

          {directionButtons.slice(1).map((item) => (
            <button
              key={item.direction}
              className={styles.moveButton}
              type="button"
              onClick={() => handleTurn(item.direction)}
              disabled={gameState.gameOver || gameState.won}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className={styles.controlHint}>支持键盘方向键和 WASD，撞墙或撞到自己会结束。</p>
      </div>
    </section>
  );
}

