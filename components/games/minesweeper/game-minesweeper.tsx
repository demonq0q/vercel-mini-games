'use client';

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from 'react';
import styles from './game-minesweeper.module.css';
import { useAdaptiveLayout } from '@/lib/hooks/use-adaptive-layout';
import {
  createMinesweeperGame,
  difficultyOptions,
  revealCell,
  setElapsedTime,
  toggleFlag,
  type DifficultyKey,
  type MinesweeperCell,
  type MinesweeperGameState,
} from '@/lib/games/minesweeper/engine';

const LAST_DIFFICULTY_STORAGE_KEY = 'vercel-mini-games:minesweeper:last-difficulty';
const BEST_TIMES_STORAGE_KEY = 'vercel-mini-games:minesweeper:best-times';

type BestTimes = Partial<Record<DifficultyKey, number>>;

function getCellContent(cell: MinesweeperCell) {
  if (!cell.isRevealed) {
    return cell.isFlagged ? '⚑' : '';
  }

  if (cell.hasMine) {
    return '✹';
  }

  return cell.neighborMines > 0 ? String(cell.neighborMines) : '';
}

function getCellStateClass(cell: MinesweeperCell) {
  if (!cell.isRevealed) {
    return cell.isFlagged ? styles.cellFlagged : styles.cellHidden;
  }

  if (cell.exploded) {
    return styles.cellExploded;
  }

  if (cell.hasMine) {
    return styles.cellMine;
  }

  return styles.cellRevealed;
}

export function GameMinesweeper() {
  const [gameState, setGameState] = useState<MinesweeperGameState>(() => createMinesweeperGame('beginner'));
  const [bestTimes, setBestTimes] = useState<BestTimes>({});
  const [storageReady, setStorageReady] = useState(false);
  const [touchMode, setTouchMode] = useState<'reveal' | 'flag'>('reveal');
  const { preferMobileExperience } = useAdaptiveLayout();

  useEffect(() => {
    const savedDifficulty = window.localStorage.getItem(LAST_DIFFICULTY_STORAGE_KEY) as DifficultyKey | null;
    const savedBestTimes = window.localStorage.getItem(BEST_TIMES_STORAGE_KEY);

    if (savedDifficulty && difficultyOptions.some((item) => item.key === savedDifficulty)) {
      setGameState(createMinesweeperGame(savedDifficulty));
    }

    if (savedBestTimes) {
      try {
        const parsed = JSON.parse(savedBestTimes) as BestTimes;
        setBestTimes(parsed);
      } catch {
        setBestTimes({});
      }
    }

    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(LAST_DIFFICULTY_STORAGE_KEY, gameState.difficulty.key);
  }, [gameState.difficulty.key, storageReady]);

  useEffect(() => {
    if (!storageReady) {
      return;
    }

    window.localStorage.setItem(BEST_TIMES_STORAGE_KEY, JSON.stringify(bestTimes));
  }, [bestTimes, storageReady]);

  useEffect(() => {
    if (gameState.status !== 'playing' || gameState.startedAt === null) {
      return;
    }

    const timer = window.setInterval(() => {
      setGameState((currentState) => setElapsedTime(currentState));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [gameState.startedAt, gameState.status]);

  useEffect(() => {
    if (gameState.status !== 'won' || gameState.elapsedSeconds <= 0) {
      return;
    }

    setBestTimes((currentBestTimes) => {
      const currentBestTime = currentBestTimes[gameState.difficulty.key];

      if (currentBestTime && currentBestTime <= gameState.elapsedSeconds) {
        return currentBestTimes;
      }

      return {
        ...currentBestTimes,
        [gameState.difficulty.key]: gameState.elapsedSeconds,
      };
    });
  }, [gameState.difficulty.key, gameState.elapsedSeconds, gameState.status]);

  const handleRestart = useCallback(() => {
    setGameState(createMinesweeperGame(gameState.difficulty.key));
  }, [gameState.difficulty.key]);

  const handleDifficultyChange = useCallback((difficultyKey: DifficultyKey) => {
    setGameState(createMinesweeperGame(difficultyKey));
  }, []);

  const handleReveal = useCallback((row: number, col: number) => {
    setGameState((currentState) => revealCell(currentState, row, col));
  }, []);

  const handleToggleFlag = useCallback((row: number, col: number) => {
    setGameState((currentState) => toggleFlag(currentState, row, col));
  }, []);

  const handlePrimaryAction = useCallback(
    (row: number, col: number) => {
      if (preferMobileExperience && touchMode === 'flag') {
        handleToggleFlag(row, col);
        return;
      }

      handleReveal(row, col);
    },
    [handleReveal, handleToggleFlag, preferMobileExperience, touchMode],
  );

  const handleCellRightClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, row: number, col: number) => {
      event.preventDefault();
      handleToggleFlag(row, col);
    },
    [handleToggleFlag],
  );

  const boardStyle = useMemo(() => {
    return {
      ['--columns' as string]: gameState.difficulty.cols,
    } as CSSProperties;
  }, [gameState.difficulty.cols]);

  const bestTime = bestTimes[gameState.difficulty.key] ?? null;
  const minesLeft = Math.max(gameState.difficulty.mines - gameState.flagsUsed, 0);

  const statusText = useMemo(() => {
    if (gameState.status === 'won') {
      return '你已经成功清掉所有非地雷格，恭喜通关。';
    }

    if (gameState.status === 'lost') {
      return '踩到雷了，点“重新开始”或切换难度可以继续。';
    }

    if (gameState.status === 'playing') {
      if (preferMobileExperience && touchMode === 'flag') {
        return '当前是插旗模式，轻触格子会放置或取消旗帜。';
      }

      if (preferMobileExperience) {
        return '当前是翻格模式，轻触格子即可翻开；需要插旗时先切换到插旗模式。';
      }

      return '左键翻开格子，右键插旗；首击安全，空白区域会自动展开。';
    }

    return '先点任意一个格子开始本局；计时会从第一次翻格时开始。';
  }, [gameState.status, preferMobileExperience, touchMode]);

  return (
    <section className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.scoreGroup}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>剩余雷数</span>
            <strong className={styles.scoreValue}>{minesLeft}</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>当前用时</span>
            <strong className={styles.scoreValue}>{gameState.elapsedSeconds}s</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>最佳时间</span>
            <strong className={styles.scoreValue}>{bestTime ? `${bestTime}s` : '--'}</strong>
          </div>
        </div>

        <button className={styles.restartButton} type="button" onClick={handleRestart}>
          重新开始
        </button>
      </div>

      <div className={styles.difficultyRow}>
        {difficultyOptions.map((difficulty) => (
          <button
            key={difficulty.key}
            className={`${styles.difficultyButton} ${difficulty.key === gameState.difficulty.key ? styles.difficultyButtonActive : ''}`}
            type="button"
            onClick={() => handleDifficultyChange(difficulty.key)}
          >
            {difficulty.label}
          </button>
          ))}
      </div>

      {preferMobileExperience ? (
        <div className={styles.touchModeRow}>
          <button
            className={`${styles.touchModeButton} ${touchMode === 'reveal' ? styles.touchModeButtonActive : ''}`}
            type="button"
            onClick={() => setTouchMode('reveal')}
          >
            轻触翻格
          </button>
          <button
            className={`${styles.touchModeButton} ${touchMode === 'flag' ? styles.touchModeButtonActive : ''}`}
            type="button"
            onClick={() => setTouchMode('flag')}
          >
            轻触插旗
          </button>
        </div>
      ) : null}

      <p
        className={`${styles.statusText} ${gameState.status === 'lost' ? styles.statusDanger : ''} ${gameState.status === 'won' ? styles.statusSuccess : ''}`}
        aria-live="polite"
      >
        {statusText}
      </p>

      <div className={styles.boardWrap}>
        <div className={styles.board} role="grid" aria-label="扫雷棋盘" style={boardStyle}>
          {gameState.board.flat().map((cell) => (
            <button
              key={`${cell.row}-${cell.col}`}
              className={`${styles.cell} ${getCellStateClass(cell)} ${cell.isRevealed && !cell.hasMine ? styles[`value${cell.neighborMines}`] : ''}`}
              type="button"
              role="gridcell"
              aria-label={`第 ${cell.row + 1} 行第 ${cell.col + 1} 列`}
              onClick={() => handlePrimaryAction(cell.row, cell.col)}
              onContextMenu={(event) => handleCellRightClick(event, cell.row, cell.col)}
              disabled={gameState.status === 'won' || gameState.status === 'lost'}
            >
              {getCellContent(cell)}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.controlHint}>{preferMobileExperience ? '移动端可用上方模式切换来决定轻触行为；桌面端仍然支持右键插旗。' : '桌面端右键可插旗；如果你在触控板上操作，通常是双指点按。'}</p>
    </section>
  );
}
