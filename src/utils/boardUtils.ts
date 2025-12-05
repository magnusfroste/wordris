import { Position, GameState } from "@/types/gameTypes";
import { GRID_WIDTH, GRID_HEIGHT, INITIAL_WORD } from "@/constants/gameConstants";

const BOOK_MIN_ROW = 3;
const BOOK_MAX_ROW = 7;
const FIRE_MIN_ROW = 2;
const FIRE_MAX_ROW = 6;

export const getRandomBookPosition = (): Position => {
  const y = Math.floor(Math.random() * (BOOK_MAX_ROW - BOOK_MIN_ROW + 1)) + BOOK_MIN_ROW;
  const x = Math.floor(Math.random() * GRID_WIDTH);
  return { x, y };
};

export const getRandomFirePosition = (): Position => {
  const y = Math.floor(Math.random() * (FIRE_MAX_ROW - FIRE_MIN_ROW + 1)) + FIRE_MIN_ROW;
  const x = Math.floor(Math.random() * GRID_WIDTH);
  return { x, y };
};

export const getTargetPositions = () => {
  const startX = Math.floor((GRID_WIDTH - INITIAL_WORD.length) / 2);
  return INITIAL_WORD.split("").map((letter, index) => ({
    letter,
    x: startX + index,
    y: 8
  }));
};

export const createBoard = (
  gameState: GameState,
  matchedLetters: Position[],
  bookPosition: Position,
  firePosition: Position
): (string | null)[][] => {
  const board = Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(null));

  // Add bottom row of fire
  for (let x = 0; x < GRID_WIDTH; x++) {
    board[GRID_HEIGHT - 1][x] = "🔥";
  }

  board[bookPosition.y][bookPosition.x] = "📚";
  board[firePosition.y][firePosition.x] = "🔥";

  if (gameState.activeLetter) {
    const { letter, position } = gameState.activeLetter;
    board[position.y][position.x] = letter;
  }

  gameState.placedLetters.forEach(({ letter, position }) => {
    board[position.y][position.x] = letter;
  });

  const targetPositions = getTargetPositions();
  targetPositions.forEach(({ letter, x, y }) => {
    if (!matchedLetters.some(match => match.x === x && match.y === y)) {
      board[y][x] = letter;
    }
  });

  return board;
};

export const calculateNewPosition = (
  currentX: number,
  currentY: number,
  direction: "left" | "right" | "up" | "down"
): Position => {
  let newX = currentX;
  let newY = currentY;

  switch (direction) {
    case "left":
      newX = Math.max(0, currentX - 1);
      break;
    case "right":
      newX = Math.min(GRID_WIDTH - 1, currentX + 1);
      break;
    case "up":
      newY = Math.max(0, currentY - 1);
      break;
    case "down":
      newY = Math.min(GRID_HEIGHT - 2, currentY + 1); // Prevent moving into bottom fire row
      break;
  }

  return { x: newX, y: newY };
};