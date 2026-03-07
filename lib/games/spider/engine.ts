export type SpiderGameStatus = 'playing' | 'won';

export type SpiderCard = {
  id: string;
  rank: number;
  faceUp: boolean;
};

export type SpiderColumn = SpiderCard[];

export type SpiderSelection = {
  columnIndex: number;
  startIndex: number;
};

export type SpiderGameState = {
  columns: SpiderColumn[];
  stock: SpiderCard[];
  completedRuns: number;
  moveCount: number;
  status: SpiderGameStatus;
};

export type SpiderMoveResult = {
  state: SpiderGameState;
  moved: boolean;
  completedRunsAdded: number;
  reason?: string;
};

export type SpiderDealResult = {
  state: SpiderGameState;
  dealt: boolean;
  completedRunsAdded: number;
  reason?: string;
};

type NormalizeResult = {
  columns: SpiderColumn[];
  completedRunsAdded: number;
};

const TOTAL_COLUMNS = 10;
const TOTAL_RUNS = 8;

export function createInitialSpiderGame(randomValue = Math.random): SpiderGameState {
  const deck = createShuffledDeck(randomValue);
  const columns = Array.from({ length: TOTAL_COLUMNS }, () => [] as SpiderColumn);

  for (let columnIndex = 0; columnIndex < TOTAL_COLUMNS; columnIndex += 1) {
    const cardCount = columnIndex < 4 ? 6 : 5;

    for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
      const card = deck.shift();

      if (!card) {
        throw new Error('蜘蛛纸牌初始牌堆不足。');
      }

      columns[columnIndex].push({
        ...card,
        faceUp: cardIndex === cardCount - 1,
      });
    }
  }

  return {
    columns,
    stock: deck.map((card) => ({ ...card, faceUp: false })),
    completedRuns: 0,
    moveCount: 0,
    status: 'playing',
  };
}

export function isValidSelectionStart(column: SpiderColumn, startIndex: number) {
  const startCard = column[startIndex];

  if (!startCard || !startCard.faceUp) {
    return false;
  }

  for (let index = startIndex; index < column.length - 1; index += 1) {
    const currentCard = column[index];
    const nextCard = column[index + 1];

    if (!currentCard.faceUp || !nextCard.faceUp) {
      return false;
    }

    if (currentCard.rank !== nextCard.rank + 1) {
      return false;
    }
  }

  return true;
}

export function canMoveSelection(
  state: SpiderGameState,
  selection: SpiderSelection,
  targetColumnIndex: number,
) {
  if (selection.columnIndex === targetColumnIndex) {
    return false;
  }

  const sourceColumn = state.columns[selection.columnIndex];

  if (!sourceColumn || !isValidSelectionStart(sourceColumn, selection.startIndex)) {
    return false;
  }

  const movingCards = sourceColumn.slice(selection.startIndex);
  const targetColumn = state.columns[targetColumnIndex];

  if (!targetColumn) {
    return false;
  }

  if (targetColumn.length === 0) {
    return true;
  }

  const targetTopCard = targetColumn[targetColumn.length - 1];

  return targetTopCard.faceUp && targetTopCard.rank === movingCards[0].rank + 1;
}

export function moveSelection(
  state: SpiderGameState,
  selection: SpiderSelection,
  targetColumnIndex: number,
): SpiderMoveResult {
  if (state.status === 'won') {
    return {
      state,
      moved: false,
      completedRunsAdded: 0,
      reason: '当前牌局已经完成。',
    };
  }

  if (!canMoveSelection(state, selection, targetColumnIndex)) {
    return {
      state,
      moved: false,
      completedRunsAdded: 0,
      reason: '目标列不满足落牌条件。',
    };
  }

  const columns = cloneColumns(state.columns);
  const sourceColumn = columns[selection.columnIndex];
  const targetColumn = columns[targetColumnIndex];
  const movingCards = sourceColumn.splice(selection.startIndex);

  targetColumn.push(...movingCards);
  revealTopCard(sourceColumn);

  const normalized = normalizeColumns(columns);
  const completedRuns = state.completedRuns + normalized.completedRunsAdded;

  return {
    state: {
      columns: normalized.columns,
      stock: [...state.stock],
      completedRuns,
      moveCount: state.moveCount + 1,
      status: completedRuns >= TOTAL_RUNS ? 'won' : 'playing',
    },
    moved: true,
    completedRunsAdded: normalized.completedRunsAdded,
  };
}

export function dealFromStock(state: SpiderGameState): SpiderDealResult {
  if (state.status === 'won') {
    return {
      state,
      dealt: false,
      completedRunsAdded: 0,
      reason: '当前牌局已经完成。',
    };
  }

  if (state.stock.length < TOTAL_COLUMNS) {
    return {
      state,
      dealt: false,
      completedRunsAdded: 0,
      reason: '补牌堆已经发完了。',
    };
  }

  if (state.columns.some((column) => column.length === 0)) {
    return {
      state,
      dealt: false,
      completedRunsAdded: 0,
      reason: '存在空列时不能补牌，请先把空列放上牌。',
    };
  }

  const columns = cloneColumns(state.columns);
  const stock = [...state.stock];

  for (let columnIndex = 0; columnIndex < TOTAL_COLUMNS; columnIndex += 1) {
    const card = stock.shift();

    if (!card) {
      break;
    }

    columns[columnIndex].push({
      ...card,
      faceUp: true,
    });
  }

  const normalized = normalizeColumns(columns);
  const completedRuns = state.completedRuns + normalized.completedRunsAdded;

  return {
    state: {
      columns: normalized.columns,
      stock,
      completedRuns,
      moveCount: state.moveCount + 1,
      status: completedRuns >= TOTAL_RUNS ? 'won' : 'playing',
    },
    dealt: true,
    completedRunsAdded: normalized.completedRunsAdded,
  };
}

export function getRemainingDeals(state: SpiderGameState) {
  return Math.floor(state.stock.length / TOTAL_COLUMNS);
}

export function getCardLabel(rank: number) {
  if (rank === 1) {
    return 'A';
  }

  if (rank === 11) {
    return 'J';
  }

  if (rank === 12) {
    return 'Q';
  }

  if (rank === 13) {
    return 'K';
  }

  return String(rank);
}

function createShuffledDeck(randomValue: () => number) {
  const deck: SpiderCard[] = [];

  for (let copyIndex = 0; copyIndex < TOTAL_RUNS; copyIndex += 1) {
    for (let rank = 13; rank >= 1; rank -= 1) {
      deck.push({
        id: `${copyIndex}-${rank}`,
        rank,
        faceUp: false,
      });
    }
  }

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomValue() * (index + 1));
    const temporary = deck[index];
    deck[index] = deck[swapIndex];
    deck[swapIndex] = temporary;
  }

  return deck;
}

function normalizeColumns(columns: SpiderColumn[]): NormalizeResult {
  let completedRunsAdded = 0;

  for (let columnIndex = 0; columnIndex < columns.length; columnIndex += 1) {
    const column = columns[columnIndex];

    while (hasCompletedRunAtTop(column)) {
      column.splice(column.length - 13, 13);
      completedRunsAdded += 1;
      revealTopCard(column);
    }
  }

  return {
    columns,
    completedRunsAdded,
  };
}

function hasCompletedRunAtTop(column: SpiderColumn) {
  if (column.length < 13) {
    return false;
  }

  const topCards = column.slice(-13);

  if (topCards.some((card) => !card.faceUp)) {
    return false;
  }

  return topCards.every((card, index) => card.rank === 13 - index);
}

function revealTopCard(column: SpiderColumn) {
  const topCard = column[column.length - 1];

  if (topCard && !topCard.faceUp) {
    topCard.faceUp = true;
  }
}

function cloneColumns(columns: SpiderColumn[]) {
  return columns.map((column) => column.map((card) => ({ ...card })));
}

