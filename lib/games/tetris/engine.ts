export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type BoardCell = PieceType | null;
export type Board = BoardCell[][];
export type Rotation = 0 | 1 | 2 | 3;

export type Point = {
  x: number;
  y: number;
};

export type ActivePiece = {
  type: PieceType;
  rotation: Rotation;
  position: Point;
};

export type TetrisGameState = {
  board: Board;
  currentPiece: ActivePiece;
  nextPieceType: PieceType;
  score: number;
  lines: number;
  level: number;
  gameOver: boolean;
};

const pieceOrder: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

const pieceShapes: Record<PieceType, Point[][]> = {
  I: [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 2, y: 3 },
    ],
  ],
  O: [
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
  ],
  T: [
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
  S: [
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
  Z: [
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
    ],
  ],
  J: [
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  ],
  L: [
    [
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
    ],
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
  ],
};

export function createInitialTetrisGame(randomValue = Math.random): TetrisGameState {
  const currentType = getRandomPieceType(randomValue);
  const nextPieceType = getRandomPieceType(randomValue);
  const board = createEmptyBoard();
  const currentPiece = createSpawnPiece(currentType);

  return {
    board,
    currentPiece,
    nextPieceType,
    score: 0,
    lines: 0,
    level: 1,
    gameOver: !canPlacePiece(board, currentPiece),
  };
}

export function movePieceHorizontally(state: TetrisGameState, deltaX: -1 | 1): TetrisGameState {
  return movePiece(state, deltaX, 0);
}

export function softDropPiece(state: TetrisGameState, randomValue = Math.random): TetrisGameState {
  if (state.gameOver) {
    return state;
  }

  const movedState = movePiece(state, 0, 1);

  if (movedState !== state) {
    return {
      ...movedState,
      score: movedState.score + 1,
    };
  }

  return lockPiece(state, 0, randomValue);
}

export function hardDropPiece(state: TetrisGameState, randomValue = Math.random): TetrisGameState {
  if (state.gameOver) {
    return state;
  }

  let workingState = state;
  let dropDistance = 0;

  while (true) {
    const movedState = movePiece(workingState, 0, 1);

    if (movedState === workingState) {
      break;
    }

    workingState = movedState;
    dropDistance += 1;
  }

  return lockPiece(workingState, dropDistance * 2, randomValue);
}

export function rotatePiece(state: TetrisGameState): TetrisGameState {
  if (state.gameOver) {
    return state;
  }

  const nextRotation = ((state.currentPiece.rotation + 1) % 4) as Rotation;
  const offsets = [0, -1, 1, -2, 2];

  for (const offsetX of offsets) {
    const rotatedPiece: ActivePiece = {
      ...state.currentPiece,
      rotation: nextRotation,
      position: {
        x: state.currentPiece.position.x + offsetX,
        y: state.currentPiece.position.y,
      },
    };

    if (canPlacePiece(state.board, rotatedPiece)) {
      return {
        ...state,
        currentPiece: rotatedPiece,
      };
    }
  }

  return state;
}

export function tickTetrisGame(state: TetrisGameState, randomValue = Math.random): TetrisGameState {
  if (state.gameOver) {
    return state;
  }

  const movedState = movePiece(state, 0, 1);

  if (movedState !== state) {
    return movedState;
  }

  return lockPiece(state, 0, randomValue);
}

export function getMergedBoard(state: TetrisGameState): Board {
  const board = cloneBoard(state.board);

  for (const cell of getAbsoluteCells(state.currentPiece)) {
    if (cell.y < 0 || cell.y >= BOARD_HEIGHT || cell.x < 0 || cell.x >= BOARD_WIDTH) {
      continue;
    }

    board[cell.y][cell.x] = state.currentPiece.type;
  }

  return board;
}

export function getPieceCells(type: PieceType, rotation: Rotation) {
  return pieceShapes[type][rotation].map((cell) => ({ ...cell }));
}

function movePiece(state: TetrisGameState, deltaX: number, deltaY: number): TetrisGameState {
  const movedPiece: ActivePiece = {
    ...state.currentPiece,
    position: {
      x: state.currentPiece.position.x + deltaX,
      y: state.currentPiece.position.y + deltaY,
    },
  };

  if (!canPlacePiece(state.board, movedPiece)) {
    return state;
  }

  return {
    ...state,
    currentPiece: movedPiece,
  };
}

function lockPiece(state: TetrisGameState, extraScore: number, randomValue: () => number): TetrisGameState {
  const board = cloneBoard(state.board);

  for (const cell of getAbsoluteCells(state.currentPiece)) {
    if (cell.y < 0) {
      return {
        ...state,
        gameOver: true,
      };
    }

    board[cell.y][cell.x] = state.currentPiece.type;
  }

  const clearedResult = clearFullRows(board);
  const lines = state.lines + clearedResult.linesCleared;
  const level = Math.floor(lines / 10) + 1;
  const score = state.score + extraScore + getLineScore(level, clearedResult.linesCleared);
  const nextPiece = createSpawnPiece(state.nextPieceType);
  const nextPieceType = getRandomPieceType(randomValue);
  const gameOver = !canPlacePiece(clearedResult.board, nextPiece);

  return {
    board: clearedResult.board,
    currentPiece: nextPiece,
    nextPieceType,
    score,
    lines,
    level,
    gameOver,
  };
}

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array<BoardCell>(BOARD_WIDTH).fill(null));
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function getRandomPieceType(randomValue: () => number): PieceType {
  const index = Math.floor(randomValue() * pieceOrder.length);
  return pieceOrder[index];
}

function createSpawnPiece(type: PieceType): ActivePiece {
  return {
    type,
    rotation: 0,
    position: { x: 3, y: 0 },
  };
}

function canPlacePiece(board: Board, piece: ActivePiece) {
  return getAbsoluteCells(piece).every((cell) => {
    if (cell.x < 0 || cell.x >= BOARD_WIDTH || cell.y >= BOARD_HEIGHT) {
      return false;
    }

    if (cell.y < 0) {
      return true;
    }

    return board[cell.y][cell.x] === null;
  });
}

function getAbsoluteCells(piece: ActivePiece) {
  return pieceShapes[piece.type][piece.rotation].map((cell) => ({
    x: cell.x + piece.position.x,
    y: cell.y + piece.position.y,
  }));
}

function clearFullRows(board: Board) {
  const remainingRows = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - remainingRows.length;
  const nextBoard = [...remainingRows];

  while (nextBoard.length < BOARD_HEIGHT) {
    nextBoard.unshift(Array<BoardCell>(BOARD_WIDTH).fill(null));
  }

  return {
    board: nextBoard,
    linesCleared,
  };
}

function getLineScore(level: number, clearedLines: number) {
  if (clearedLines === 1) {
    return 100 * level;
  }

  if (clearedLines === 2) {
    return 300 * level;
  }

  if (clearedLines === 3) {
    return 500 * level;
  }

  if (clearedLines >= 4) {
    return 800 * level;
  }

  return 0;
}

