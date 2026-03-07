export const GRID_SIZE = 4;

export type CellValue = number | null;
export type Board = CellValue[][];
export type MoveDirection = 'up' | 'down' | 'left' | 'right';

type MergeLineResult = {
  line: CellValue[];
  scoreDelta: number;
  won: boolean;
};

export type MoveBoardResult = {
  board: Board;
  scoreDelta: number;
  moved: boolean;
  won: boolean;
  gameOver: boolean;
};

export function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () => Array<CellValue>(GRID_SIZE).fill(null));
}

export function createInitialBoard(randomValue = Math.random): Board {
  let board = createEmptyBoard();

  board = addRandomTile(board, randomValue);
  board = addRandomTile(board, randomValue);

  return board;
}

export function moveBoard(
  board: Board,
  direction: MoveDirection,
  randomValue = Math.random,
): MoveBoardResult {
  const nextBoard = cloneBoard(board);
  let scoreDelta = 0;
  let moved = false;
  let won = false;

  for (let index = 0; index < GRID_SIZE; index += 1) {
    const isHorizontal = direction === 'left' || direction === 'right';
    const isReversed = direction === 'right' || direction === 'down';
    const originalLine = readLine(nextBoard, index, isHorizontal);
    const workingLine = isReversed ? [...originalLine].reverse() : [...originalLine];
    const mergedLine = mergeLine(workingLine);
    const finalLine = isReversed ? [...mergedLine.line].reverse() : mergedLine.line;

    if (!areLinesEqual(originalLine, finalLine)) {
      moved = true;
      writeLine(nextBoard, index, isHorizontal, finalLine);
    }

    scoreDelta += mergedLine.scoreDelta;
    won = won || mergedLine.won;
  }

  if (!moved) {
    return {
      board: nextBoard,
      scoreDelta: 0,
      moved: false,
      won: false,
      gameOver: isGameOver(nextBoard),
    };
  }

  const boardAfterSpawn = addRandomTile(nextBoard, randomValue);

  return {
    board: boardAfterSpawn,
    scoreDelta,
    moved: true,
    won,
    gameOver: isGameOver(boardAfterSpawn),
  };
}

export function isGameOver(board: Board): boolean {
  if (getEmptyCells(board).length > 0) {
    return false;
  }

  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex += 1) {
      const currentValue = board[rowIndex][columnIndex];
      const rightValue = board[rowIndex][columnIndex + 1];
      const downValue = board[rowIndex + 1]?.[columnIndex];

      if (currentValue === rightValue || currentValue === downValue) {
        return false;
      }
    }
  }

  return true;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function addRandomTile(board: Board, randomValue: () => number): Board {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return board;
  }

  const selectedIndex = Math.floor(randomValue() * emptyCells.length);
  const [rowIndex, columnIndex] = emptyCells[selectedIndex];
  const nextBoard = cloneBoard(board);

  nextBoard[rowIndex][columnIndex] = randomValue() < 0.9 ? 2 : 4;

  return nextBoard;
}

function getEmptyCells(board: Board): Array<[number, number]> {
  const emptyCells: Array<[number, number]> = [];

  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < GRID_SIZE; columnIndex += 1) {
      if (board[rowIndex][columnIndex] === null) {
        emptyCells.push([rowIndex, columnIndex]);
      }
    }
  }

  return emptyCells;
}

function readLine(board: Board, index: number, isHorizontal: boolean): CellValue[] {
  if (isHorizontal) {
    return [...board[index]];
  }

  return board.map((row) => row[index]);
}

function writeLine(board: Board, index: number, isHorizontal: boolean, line: CellValue[]) {
  if (isHorizontal) {
    board[index] = line;
    return;
  }

  for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex += 1) {
    board[rowIndex][index] = line[rowIndex];
  }
}

function mergeLine(line: CellValue[]): MergeLineResult {
  const compactValues = line.filter((value): value is number => value !== null);
  const mergedValues: number[] = [];
  let scoreDelta = 0;
  let won = false;

  for (let index = 0; index < compactValues.length; index += 1) {
    const currentValue = compactValues[index];
    const nextValue = compactValues[index + 1];

    if (currentValue === nextValue) {
      const mergedValue = currentValue * 2;

      mergedValues.push(mergedValue);
      scoreDelta += mergedValue;
      won = won || mergedValue >= 2048;
      index += 1;
      continue;
    }

    mergedValues.push(currentValue);
  }

  const paddedLine = [...mergedValues];

  while (paddedLine.length < GRID_SIZE) {
    paddedLine.push(null);
  }

  return {
    line: paddedLine,
    scoreDelta,
    won,
  };
}

function areLinesEqual(firstLine: CellValue[], secondLine: CellValue[]) {
  return firstLine.every((value, index) => value === secondLine[index]);
}

