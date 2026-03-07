'use client';

import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import styles from './game-spider.module.css';
import {
  canMoveSelection,
  createInitialSpiderGame,
  dealFromStock,
  getCardLabel,
  getRemainingDeals,
  isValidSelectionStart,
  moveSelection,
  type SpiderCard,
  type SpiderGameState,
  type SpiderSelection,
} from '@/lib/games/spider/engine';

function isSelectedCard(selection: SpiderSelection | null, columnIndex: number, cardIndex: number) {
  return selection?.columnIndex === columnIndex && cardIndex >= selection.startIndex;
}

function getStatusText(gameState: SpiderGameState, hintMessage: string) {
  if (gameState.status === 'won') {
    return '8 组完整顺子已经全部收齐，恭喜通关。';
  }

  return hintMessage;
}

export function GameSpider() {
  const [gameState, setGameState] = useState<SpiderGameState>(createInitialSpiderGame);
  const [selection, setSelection] = useState<SpiderSelection | null>(null);
  const [hintMessage, setHintMessage] = useState('点击一段翻开的递减顺子，再点击目标列即可移动。');

  const validTargetColumns = useMemo(() => {
    if (!selection) {
      return new Set<number>();
    }

    return new Set(
      gameState.columns
        .map((_, columnIndex) => columnIndex)
        .filter((columnIndex) => canMoveSelection(gameState, selection, columnIndex)),
    );
  }, [gameState, selection]);

  const handleRestart = useCallback(() => {
    setGameState(createInitialSpiderGame());
    setSelection(null);
    setHintMessage('已重新开始，继续整理 10 列牌堆。');
  }, []);

  const handleDealStock = useCallback(() => {
    const result = dealFromStock(gameState);

    if (!result.dealt) {
      setHintMessage(result.reason ?? '当前不能补牌。');
      return;
    }

    setGameState(result.state);
    setSelection(null);

    if (result.state.status === 'won') {
      setHintMessage('最后一轮补牌后已经全部完成。');
      return;
    }

    if (result.completedRunsAdded > 0) {
      setHintMessage(`补牌完成，并自动收走了 ${result.completedRunsAdded} 组完整顺子。`);
      return;
    }

    setHintMessage('已向每列补 1 张牌。');
  }, [gameState]);

  const tryMoveSelection = useCallback(
    (targetColumnIndex: number) => {
      if (!selection) {
        return false;
      }

      const result = moveSelection(gameState, selection, targetColumnIndex);

      if (!result.moved) {
        setHintMessage(result.reason ?? '这组牌暂时不能放到这里。');
        return false;
      }

      setGameState(result.state);
      setSelection(null);

      if (result.state.status === 'won') {
        setHintMessage('最后一组顺子已自动收走，游戏完成。');
        return true;
      }

      if (result.completedRunsAdded > 0) {
        setHintMessage(`移动成功，并自动收走了 ${result.completedRunsAdded} 组完整顺子。`);
        return true;
      }

      setHintMessage('移动成功。');
      return true;
    },
    [gameState, selection],
  );

  const handleColumnClick = useCallback(
    (columnIndex: number) => {
      if (!selection) {
        return;
      }

      tryMoveSelection(columnIndex);
    },
    [selection, tryMoveSelection],
  );

  const handleCardClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, columnIndex: number, cardIndex: number) => {
      event.stopPropagation();

      const column = gameState.columns[columnIndex];
      const canSelect = isValidSelectionStart(column, cardIndex);

      if (!selection) {
        if (!canSelect) {
          setHintMessage('只能选择翻开的递减顺子。');
          return;
        }

        setSelection({ columnIndex, startIndex: cardIndex });
        setHintMessage('已选中一组可移动顺子，请点击目标列。');
        return;
      }

      if (selection.columnIndex === columnIndex && selection.startIndex === cardIndex) {
        setSelection(null);
        setHintMessage('已取消当前选择。');
        return;
      }

      const moved = tryMoveSelection(columnIndex);

      if (!moved && canSelect) {
        setSelection({ columnIndex, startIndex: cardIndex });
        setHintMessage('已切换为新的可移动顺子。');
      }
    },
    [gameState.columns, selection, tryMoveSelection],
  );

  const handleEmptySlotClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, columnIndex: number) => {
      event.stopPropagation();

      if (!selection) {
        setHintMessage('空列需要先选中一组顺子后才能放入。');
        return;
      }

      tryMoveSelection(columnIndex);
    },
    [selection, tryMoveSelection],
  );

  return (
    <section className={styles.root}>
      <div className={styles.topBar}>
        <div className={styles.scoreGroup}>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>已完成组数</span>
            <strong className={styles.scoreValue}>{gameState.completedRuns} / 8</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>剩余补牌</span>
            <strong className={styles.scoreValue}>{getRemainingDeals(gameState)}</strong>
          </div>
          <div className={styles.scoreCard}>
            <span className={styles.scoreLabel}>移动次数</span>
            <strong className={styles.scoreValue}>{gameState.moveCount}</strong>
          </div>
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.stockButton} type="button" onClick={handleDealStock} disabled={gameState.status === 'won'}>
            补 1 行牌
          </button>
          <button className={styles.restartButton} type="button" onClick={handleRestart}>
            重新开始
          </button>
        </div>
      </div>

      <p className={`${styles.statusText} ${gameState.status === 'won' ? styles.statusSuccess : ''}`} aria-live="polite">
        {getStatusText(gameState, hintMessage)}
      </p>

      <div className={styles.boardWrap}>
        <div className={styles.board} aria-label="蜘蛛纸牌牌桌">
          {gameState.columns.map((column, columnIndex) => {
            const isSourceColumn = selection?.columnIndex === columnIndex;
            const isValidTarget = validTargetColumns.has(columnIndex);

            return (
              <section
                key={columnIndex}
                className={`${styles.column} ${isSourceColumn ? styles.columnSelected : ''} ${isValidTarget ? styles.columnTarget : ''}`}
                onClick={() => handleColumnClick(columnIndex)}
                aria-label={`第 ${columnIndex + 1} 列`}
              >
                <div className={styles.columnHeader}>第 {columnIndex + 1} 列</div>

                {column.length === 0 ? (
                  <button className={styles.emptySlot} type="button" onClick={(event) => handleEmptySlotClick(event, columnIndex)}>
                    空列
                  </button>
                ) : (
                  <div className={styles.cardStack}>
                    {column.map((card, cardIndex) => {
                      const selected = isSelectedCard(selection, columnIndex, cardIndex);
                      const cardOffset = cardIndex === 0 ? 0 : card.faceUp ? -72 : -92;

                      return (
                        <button
                          key={card.id}
                          className={`${styles.card} ${card.faceUp ? styles.cardFaceUp : styles.cardFaceDown} ${selected ? styles.cardSelected : ''}`}
                          type="button"
                          onClick={(event) => handleCardClick(event, columnIndex, cardIndex)}
                          style={{ marginTop: `${cardOffset}px`, zIndex: cardIndex + 1 }}
                          aria-label={card.faceUp ? `牌面 ${getCardLabel(card.rank)}` : '盖住的牌'}
                        >
                          {card.faceUp ? (
                            <>
                              <span className={styles.cardCorner}>{getCardLabel(card.rank)}♠</span>
                              <span className={styles.cardCenter}>{getCardLabel(card.rank)}</span>
                            </>
                          ) : (
                            <span className={styles.cardBackMark}>🕷</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <div className={styles.helpBlock}>
        <h2 className={styles.sectionTitle}>单花色首版说明</h2>
        <ul className={styles.helpList}>
          <li>只能移动翻开的递减顺子，例如 `9-8-7`。</li>
          <li>目标列顶部需要正好比顺子首张大 1，或者目标列为空。</li>
          <li>当列顶形成 `K-Q-J-...-A` 时，会自动收走 1 组。</li>
          <li>官方规则里，存在空列时不能补牌；本版也沿用这个限制。</li>
        </ul>
      </div>
    </section>
  );
}

