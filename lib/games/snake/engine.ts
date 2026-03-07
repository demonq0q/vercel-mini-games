export const BOARD_SIZE = 16;

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';

export type Point = {
  x: number;
  y: number;
};

export type SnakeGameState = {
  snake: Point[];
  food: Point | null;
  direction: SnakeDirection;
  score: number;
  gameOver: boolean;
  won: boolean;
};

export function createInitialSnakeGame(randomValue = Math.random): SnakeGameState {
  const snake = [
    { x: 6, y: 8 },
    { x: 5, y: 8 },
    { x: 4, y: 8 },
  ];

  return {
    snake,
    food: createFoodPosition(snake, randomValue),
    direction: 'right',
    score: 0,
    gameOver: false,
    won: false,
  };
}

export function advanceSnakeGame(
  state: SnakeGameState,
  randomValue = Math.random,
): SnakeGameState {
  if (state.gameOver || state.won) {
    return state;
  }

  const currentHead = state.snake[0];
  const nextHead = getNextHead(currentHead, state.direction);

  if (isOutsideBoard(nextHead)) {
    return {
      ...state,
      gameOver: true,
    };
  }

  const ateFood = state.food ? isSamePoint(nextHead, state.food) : false;
  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  if (hitsSelf(nextHead, nextSnake)) {
    return {
      ...state,
      snake: nextSnake,
      gameOver: true,
    };
  }

  const won = nextSnake.length === BOARD_SIZE * BOARD_SIZE;

  return {
    snake: nextSnake,
    food: won ? null : ateFood ? createFoodPosition(nextSnake, randomValue) : state.food,
    direction: state.direction,
    score: ateFood ? state.score + 1 : state.score,
    gameOver: false,
    won,
  };
}

function createFoodPosition(snake: Point[], randomValue: () => number): Point | null {
  const emptyCells: Point[] = [];

  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const point = { x, y };

      if (!snake.some((segment) => isSamePoint(segment, point))) {
        emptyCells.push(point);
      }
    }
  }

  if (emptyCells.length === 0) {
    return null;
  }

  const selectedIndex = Math.floor(randomValue() * emptyCells.length);

  return emptyCells[selectedIndex];
}

function getNextHead(head: Point, direction: SnakeDirection): Point {
  if (direction === 'up') {
    return { x: head.x, y: head.y - 1 };
  }

  if (direction === 'down') {
    return { x: head.x, y: head.y + 1 };
  }

  if (direction === 'left') {
    return { x: head.x - 1, y: head.y };
  }

  return { x: head.x + 1, y: head.y };
}

function isOutsideBoard(point: Point) {
  return point.x < 0 || point.y < 0 || point.x >= BOARD_SIZE || point.y >= BOARD_SIZE;
}

function hitsSelf(head: Point, snake: Point[]) {
  return snake.some((segment, index) => index > 0 && isSamePoint(segment, head));
}

function isSamePoint(first: Point, second: Point) {
  return first.x === second.x && first.y === second.y;
}

