// GameModel - Ren affärslogik utan React
import { Position, ActiveLetter, PlacedLetter, Direction } from "@/types/gameTypes";
import { ALPHABET, INITIAL_WORD, GRID_HEIGHT, GRID_WIDTH } from "@/constants/gameConstants";

const BOOK_MIN_ROW = 3;
const BOOK_MAX_ROW = 7;
const FIRE_MIN_ROW = 2;
const FIRE_MAX_ROW = 6;

export interface GameModelState {
  activeLetter: ActiveLetter | null;
  placedLetters: PlacedLetter[];
  matchedLetters: Position[];
  collectedLetters: string[];
  burnedLetters: string[];
  isWordCompleted: boolean;
  bookPosition: Position;
  firePosition: Position;
}

export interface MoveResult {
  newState: GameModelState;
  event: 'none' | 'collected' | 'burned' | 'matched' | 'completed' | 'landed';
  letter?: string;
}

// Pure functions for game logic
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

export const getTargetPositions = (): (Position & { letter: string })[] => {
  const startX = Math.floor((GRID_WIDTH - INITIAL_WORD.length) / 2);
  return INITIAL_WORD.split("").map((letter, index) => ({
    letter,
    x: startX + index,
    y: 8
  }));
};

export const createInitialState = (): GameModelState => ({
  activeLetter: null,
  placedLetters: [],
  matchedLetters: [],
  collectedLetters: [],
  burnedLetters: [],
  isWordCompleted: false,
  bookPosition: getRandomBookPosition(),
  firePosition: getRandomFirePosition(),
});

export const spawnLetter = (state: GameModelState): GameModelState | null => {
  if (state.activeLetter || state.isWordCompleted) return null;

  const randomX = Math.floor(Math.random() * GRID_WIDTH);
  const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

  return {
    ...state,
    activeLetter: {
      id: Date.now(),
      letter: randomLetter,
      position: { x: randomX, y: 0 }
    }
  };
};

export const calculateNewPosition = (
  currentX: number,
  currentY: number,
  direction: Direction
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
      newY = Math.min(GRID_HEIGHT - 2, currentY + 1);
      break;
  }

  return { x: newX, y: newY };
};

export const moveLetter = (state: GameModelState, direction: Direction): GameModelState => {
  if (!state.activeLetter) return state;

  const newPosition = calculateNewPosition(
    state.activeLetter.position.x,
    state.activeLetter.position.y,
    direction
  );

  return {
    ...state,
    activeLetter: {
      ...state.activeLetter,
      position: newPosition
    }
  };
};

export const updateLetterPosition = (state: GameModelState): MoveResult => {
  if (!state.activeLetter) {
    return { newState: state, event: 'none' };
  }

  const { activeLetter, bookPosition, firePosition, matchedLetters, placedLetters } = state;
  const newY = activeLetter.position.y + 1;
  const letter = activeLetter.letter;

  // Check if letter hits bottom fire row
  if (newY === GRID_HEIGHT - 1) {
    return {
      newState: {
        ...state,
        activeLetter: null,
        burnedLetters: [...state.burnedLetters, letter]
      },
      event: 'burned',
      letter
    };
  }

  // Check book collision
  if (activeLetter.position.x === bookPosition.x && activeLetter.position.y === bookPosition.y - 1) {
    return {
      newState: {
        ...state,
        activeLetter: null,
        collectedLetters: [...state.collectedLetters, letter]
      },
      event: 'collected',
      letter
    };
  }

  // Check fire collision
  if (activeLetter.position.x === firePosition.x && activeLetter.position.y === firePosition.y - 1) {
    return {
      newState: {
        ...state,
        activeLetter: null,
        burnedLetters: [...state.burnedLetters, letter]
      },
      event: 'burned',
      letter
    };
  }

  // Check target word match
  const targetPositions = getTargetPositions();
  const currentTargetIndex = INITIAL_WORD.split("").findIndex(
    (targetLetter, index) => {
      const targetPos = targetPositions[index];
      return (
        targetLetter === letter &&
        targetPos.x === activeLetter.position.x &&
        targetPos.y === newY &&
        !placedLetters.some(
          placed =>
            placed.letter === targetLetter &&
            placed.position.x === targetPos.x &&
            placed.position.y === targetPos.y
        )
      );
    }
  );

  if (currentTargetIndex !== -1) {
    const targetPos = targetPositions[currentTargetIndex];
    const newMatchedLetters = [...matchedLetters, { x: targetPos.x, y: targetPos.y }];
    const isCompleted = newMatchedLetters.length === INITIAL_WORD.length;

    return {
      newState: {
        ...state,
        activeLetter: null,
        placedLetters: [
          ...placedLetters,
          { letter, position: { x: targetPos.x, y: targetPos.y } }
        ],
        matchedLetters: newMatchedLetters,
        isWordCompleted: isCompleted
      },
      event: isCompleted ? 'completed' : 'matched',
      letter
    };
  }

  // Letter reaches bottom without matching
  if (newY >= GRID_HEIGHT - 1) {
    return {
      newState: {
        ...state,
        activeLetter: null
      },
      event: 'landed'
    };
  }

  // Continue falling
  return {
    newState: {
      ...state,
      activeLetter: {
        ...activeLetter,
        position: { ...activeLetter.position, y: newY }
      }
    },
    event: 'none'
  };
};

export const createBoard = (state: GameModelState): (string | null)[][] => {
  const { activeLetter, placedLetters, matchedLetters, bookPosition, firePosition } = state;
  
  const board: (string | null)[][] = Array(GRID_HEIGHT)
    .fill(null)
    .map(() => Array(GRID_WIDTH).fill(null));

  // Place book and fire
  board[bookPosition.y][bookPosition.x] = "📚";
  board[firePosition.y][firePosition.x] = "🔥";

  // Place active letter
  if (activeLetter) {
    const { letter, position } = activeLetter;
    board[position.y][position.x] = letter;
  }

  // Place matched/placed letters
  placedLetters.forEach(({ letter, position }) => {
    board[position.y][position.x] = letter;
  });

  // Place target word (unmatched positions)
  const targetPositions = getTargetPositions();
  targetPositions.forEach(({ letter, x, y }) => {
    if (!matchedLetters.some(match => match.x === x && match.y === y)) {
      board[y][x] = letter;
    }
  });

  return board;
};
