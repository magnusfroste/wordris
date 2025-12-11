// GameModel - Ren affärslogik utan React
import { Position, ActiveLetter, PlacedLetter, Direction } from "@/types/gameTypes";
import { ALPHABET, GRID_HEIGHT, GRID_WIDTH, TARGET_ROW } from "@/constants/gameConstants";
import { getRandomWord } from "@/constants/wordBank";

const BOOK_MIN_ROW = 3;
const BOOK_MAX_ROW = 6; // Max 6 to leave clearance above target row 8
const FIRE_MIN_ROW = 2;
const FIRE_MAX_ROW = 6; // Max 6 to leave clearance above target row 8

export interface GameModelState {
  activeLetter: ActiveLetter | null;
  placedLetters: PlacedLetter[];
  matchedLetters: Position[];
  collectedLetters: string[];
  burnedLetters: string[];
  isWordCompleted: boolean;
  bookPosition: Position;
  firePosition: Position;
  currentWord: string;
}

export interface MoveResult {
  newState: GameModelState;
  event: 'none' | 'collected' | 'burned' | 'matched' | 'completed' | 'landed';
  letter?: string;
}

// Get allowed X positions (avoiding target word columns)
const getAllowedXPositions = (currentWord: string): number[] => {
  const targetPositions = getTargetPositions(currentWord);
  const forbiddenX = new Set(targetPositions.map(p => p.x));
  return Array.from({ length: GRID_WIDTH }, (_, i) => i).filter(x => !forbiddenX.has(x));
};

// Pure functions for game logic
export const getRandomBookPosition = (currentWord: string): Position => {
  const allowedX = getAllowedXPositions(currentWord);
  const x = allowedX.length > 0 
    ? allowedX[Math.floor(Math.random() * allowedX.length)]
    : Math.floor(Math.random() * GRID_WIDTH);
  const y = Math.floor(Math.random() * (BOOK_MAX_ROW - BOOK_MIN_ROW + 1)) + BOOK_MIN_ROW;
  return { x, y };
};

export const getRandomFirePosition = (currentWord: string, bookPosition: Position): Position => {
  const allowedX = getAllowedXPositions(currentWord).filter(x => x !== bookPosition.x);
  const x = allowedX.length > 0 
    ? allowedX[Math.floor(Math.random() * allowedX.length)]
    : Math.floor(Math.random() * GRID_WIDTH);
  const y = Math.floor(Math.random() * (FIRE_MAX_ROW - FIRE_MIN_ROW + 1)) + FIRE_MIN_ROW;
  return { x, y };
};

export const getTargetPositions = (word: string): (Position & { letter: string })[] => {
  const startX = Math.floor((GRID_WIDTH - word.length) / 2);
  return word.split("").map((letter, index) => ({
    letter,
    x: startX + index,
    y: TARGET_ROW
  }));
};

export const createInitialState = (): GameModelState => {
  const { word } = getRandomWord();
  const bookPosition = getRandomBookPosition(word);
  const firePosition = getRandomFirePosition(word, bookPosition);
  return {
    activeLetter: null,
    placedLetters: [],
    matchedLetters: [],
    collectedLetters: [],
    burnedLetters: [],
    isWordCompleted: false,
    bookPosition,
    firePosition,
    currentWord: word,
  };
};

export const startNewRound = (state: GameModelState): GameModelState => {
  const { word } = getRandomWord();
  const bookPosition = getRandomBookPosition(word);
  const firePosition = getRandomFirePosition(word, bookPosition);
  return {
    ...state,
    activeLetter: null,
    placedLetters: [],
    matchedLetters: [],
    isWordCompleted: false,
    bookPosition,
    firePosition,
    currentWord: word,
  };
};

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

  const { activeLetter, bookPosition, firePosition, matchedLetters, placedLetters, currentWord } = state;
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
  const targetPositions = getTargetPositions(currentWord);
  const currentTargetIndex = currentWord.split("").findIndex(
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
    const isCompleted = newMatchedLetters.length === currentWord.length;

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
  const { activeLetter, placedLetters, matchedLetters, bookPosition, firePosition, currentWord } = state;
  
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
  const targetPositions = getTargetPositions(currentWord);
  targetPositions.forEach(({ letter, x, y }) => {
    if (!matchedLetters.some(match => match.x === x && match.y === y)) {
      board[y][x] = letter;
    }
  });

  return board;
};
