export type DifficultyKey = 'beginner' | 'intermediate' | 'expert';

export type DifficultyOption = {
  key: DifficultyKey;
  label: string;
  rows: number;
  cols: number;
  mines: number;
};

export type MinesweeperCell = {
  row: number;
  col: number;
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  exploded: boolean;
  neighborMines: number;
};

export type MinesweeperGameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type MinesweeperGameState = {
  difficulty: DifficultyOption;
  board: MinesweeperCell[][];
  status: MinesweeperGameStatus;
  flagsUsed: number;
  revealedSafeCells: number;
  startedAt: number | null;
  elapsedSeconds: number;
};

type Point = {
  row: number;
  col: number;
};

export const difficultyOptions: DifficultyOption[] = [
  { key: 'beginner', label: '初级 9x9', rows: 9, cols: 9, mines: 10 },
  { key: 'intermediate', label: '中级 12x12', rows: 12, cols: 12, mines: 24 },
  { key: 'expert', label: '高级 16x16', rows: 16, cols: 16, mines: 40 },
];

export function createMinesweeperGame(difficultyKey: DifficultyKey): MinesweeperGameState {
  const difficulty = getDifficultyOption(difficultyKey);

  return {
    difficulty,
    board: createEmptyBoard(difficulty),
    status: 'idle',
    flagsUsed: 0,
    revealedSafeCells: 0,
    startedAt: null,
    elapsedSeconds: 0,
  };
}

export function revealCell(
  state: MinesweeperGameState,
  row: number,
  col: number,
  randomValue = Math.random,
  now = Date.now,
): MinesweeperGameState {
  if (state.status === 'won' || state.status === 'lost') {
    return state;
  }

  const targetCell = state.board[row]?.[col];

  if (!targetCell || targetCell.isFlagged || targetCell.isRevealed) {
    return state;
  }

  let workingState = state;

  if (state.status === 'idle') {
    workingState = {
      ...state,
      board: seedBoard(state.board, state.difficulty, { row, col }, randomValue),
      status: 'playing',
      startedAt: now(),
      elapsedSeconds: 0,
    };
  }

  const activeCell = workingState.board[row][col];

  if (activeCell.hasMine) {
    return revealAllMines(workingState, row, col);
  }

  return revealSafeArea(workingState, row, col);
}

export function toggleFlag(state: MinesweeperGameState, row: number, col: number): MinesweeperGameState {
  if (state.status === 'won' || state.status === 'lost') {
    return state;
  }

  const targetCell = state.board[row]?.[col];

  if (!targetCell || targetCell.isRevealed) {
    return state;
  }

  if (!targetCell.isFlagged && state.flagsUsed >= state.difficulty.mines) {
    return state;
  }

  const board = cloneBoard(state.board);
  const nextFlagged = !board[row][col].isFlagged;

  board[row][col].isFlagged = nextFlagged;

  return {
    ...state,
    board,
    flagsUsed: state.flagsUsed + (nextFlagged ? 1 : -1),
  };
}

export function setElapsedTime(state: MinesweeperGameState, now = Date.now()): MinesweeperGameState {
  if (state.status !== 'playing' || state.startedAt === null) {
    return state;
  }

  const elapsedSeconds = Math.max(0, Math.floor((now - state.startedAt) / 1000));

  if (elapsedSeconds === state.elapsedSeconds) {
    return state;
  }

  return {
    ...state,
    elapsedSeconds,
  };
}

function getDifficultyOption(difficultyKey: DifficultyKey) {
  const difficulty = difficultyOptions.find((item) => item.key === difficultyKey);

  if (!difficulty) {
    throw new Error(`未找到扫雷难度：${difficultyKey}`);
  }

  return difficulty;
}

function createEmptyBoard(difficulty: DifficultyOption) {
  return Array.from({ length: difficulty.rows }, (_, row) =>
    Array.from({ length: difficulty.cols }, (_, col) => ({
      row,
      col,
      hasMine: false,
      isRevealed: false,
      isFlagged: false,
      exploded: false,
      neighborMines: 0,
    })),
  );
}

function seedBoard(
  baseBoard: MinesweeperCell[][],
  difficulty: DifficultyOption,
  firstPoint: Point,
  randomValue: () => number,
) {
  const board = cloneBoard(baseBoard).map((row) =>
    row.map((cell) => ({
      ...cell,
      hasMine: false,
      isRevealed: false,
      exploded: false,
      neighborMines: 0,
    })),
  );

  const safeArea = getSafeArea(firstPoint, difficulty);
  let availablePoints = getAllPoints(difficulty).filter((point) => !safeArea.has(getPointKey(point)));

  if (availablePoints.length < difficulty.mines) {
    availablePoints = getAllPoints(difficulty).filter((point) => point.row !== firstPoint.row || point.col !== firstPoint.col);
  }

  for (let index = 0; index < difficulty.mines; index += 1) {
    const selectedIndex = Math.floor(randomValue() * availablePoints.length);
    const selectedPoint = availablePoints[selectedIndex];

    board[selectedPoint.row][selectedPoint.col].hasMine = true;
    availablePoints.splice(selectedIndex, 1);
  }

  for (let row = 0; row < difficulty.rows; row += 1) {
    for (let col = 0; col < difficulty.cols; col += 1) {
      board[row][col].neighborMines = getNeighborPoints({ row, col }, difficulty).filter(
        (neighborPoint) => board[neighborPoint.row][neighborPoint.col].hasMine,
      ).length;
    }
  }

  return board;
}

function revealSafeArea(state: MinesweeperGameState, row: number, col: number): MinesweeperGameState {
  const board = cloneBoard(state.board);
  const queue: Point[] = [{ row, col }];
  let revealedSafeCells = state.revealedSafeCells;

  while (queue.length > 0) {
    const currentPoint = queue.shift();

    if (!currentPoint) {
      continue;
    }

    const cell = board[currentPoint.row][currentPoint.col];

    if (cell.isRevealed || cell.isFlagged || cell.hasMine) {
      continue;
    }

    cell.isRevealed = true;
    revealedSafeCells += 1;

    if (cell.neighborMines === 0) {
      getNeighborPoints(currentPoint, state.difficulty).forEach((neighborPoint) => {
        const neighborCell = board[neighborPoint.row][neighborPoint.col];

        if (!neighborCell.isRevealed && !neighborCell.isFlagged && !neighborCell.hasMine) {
          queue.push(neighborPoint);
        }
      });
    }
  }

  const totalSafeCells = state.difficulty.rows * state.difficulty.cols - state.difficulty.mines;
  const won = revealedSafeCells >= totalSafeCells;

  if (won) {
    board.forEach((cells) => {
      cells.forEach((cell) => {
        if (cell.hasMine) {
          cell.isFlagged = true;
        }
      });
    });
  }

  return {
    ...state,
    board,
    status: won ? 'won' : 'playing',
    flagsUsed: won ? state.difficulty.mines : countFlags(board),
    revealedSafeCells,
  };
}

function revealAllMines(state: MinesweeperGameState, explodedRow: number, explodedCol: number): MinesweeperGameState {
  const board = cloneBoard(state.board);

  board.forEach((cells) => {
    cells.forEach((cell) => {
      if (cell.hasMine) {
        cell.isRevealed = true;
      }

      if (cell.row === explodedRow && cell.col === explodedCol) {
        cell.exploded = true;
      }
    });
  });

  return {
    ...state,
    board,
    status: 'lost',
  };
}

function getSafeArea(firstPoint: Point, difficulty: DifficultyOption) {
  const safeArea = new Set<string>();

  getNeighborPoints(firstPoint, difficulty, true).forEach((point) => {
    safeArea.add(getPointKey(point));
  });

  return safeArea;
}

function getNeighborPoints(point: Point, difficulty: DifficultyOption, includeSelf = false) {
  const points: Point[] = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (!includeSelf && rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = point.row + rowOffset;
      const nextCol = point.col + colOffset;

      if (nextRow < 0 || nextCol < 0 || nextRow >= difficulty.rows || nextCol >= difficulty.cols) {
        continue;
      }

      points.push({ row: nextRow, col: nextCol });
    }
  }

  return points;
}

function getAllPoints(difficulty: DifficultyOption) {
  const points: Point[] = [];

  for (let row = 0; row < difficulty.rows; row += 1) {
    for (let col = 0; col < difficulty.cols; col += 1) {
      points.push({ row, col });
    }
  }

  return points;
}

function getPointKey(point: Point) {
  return `${point.row}-${point.col}`;
}

function cloneBoard(board: MinesweeperCell[][]) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function countFlags(board: MinesweeperCell[][]) {
  return board.flat().filter((cell) => cell.isFlagged).length;
}

