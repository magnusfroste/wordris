import React, { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import { Direction, Position } from "@/types/gameTypes";
import {
  GameModelState,
  createInitialState,
  spawnLetter,
  moveLetter as moveLetterModel,
  updateLetterPosition,
  createBoard,
  getTargetPositions,
  MoveResult
} from "@/models/GameModel";
import { soundModel } from "@/models/SoundModel";

// Action types
type GameAction =
  | { type: 'SPAWN_LETTER' }
  | { type: 'MOVE_LETTER'; direction: Direction }
  | { type: 'UPDATE_POSITION' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_SOUND'; enabled: boolean };

// Reducer
function gameReducer(state: GameModelState, action: GameAction): GameModelState {
  switch (action.type) {
    case 'SPAWN_LETTER': {
      const newState = spawnLetter(state);
      return newState || state;
    }
    case 'MOVE_LETTER': {
      return moveLetterModel(state, action.direction);
    }
    case 'UPDATE_POSITION': {
      // This is handled in the controller to manage side effects
      return state;
    }
    case 'TOGGLE_SOUND': {
      soundModel.toggle();
      return state;
    }
    case 'SET_SOUND': {
      soundModel.setEnabled(action.enabled);
      return state;
    }
    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameModelState;
  board: (string | null)[][];
  targetPositions: (Position & { letter: string })[];
  soundEnabled: boolean;
  dispatch: React.Dispatch<GameAction>;
  spawnNewLetter: () => void;
  moveActiveLetter: (direction: Direction) => void;
  updatePosition: () => MoveResult;
  toggleSound: () => void;
  speak: (text: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  const board = useMemo(() => createBoard(state), [state]);
  const targetPositions = useMemo(() => getTargetPositions(), []);

  const spawnNewLetter = useCallback(() => {
    dispatch({ type: 'SPAWN_LETTER' });
  }, []);

  const moveActiveLetter = useCallback((direction: Direction) => {
    dispatch({ type: 'MOVE_LETTER', direction });
  }, []);

  const updatePosition = useCallback((): MoveResult => {
    const result = updateLetterPosition(state);
    // Manually update state since we need the result
    if (result.event !== 'none' || result.newState !== state) {
      // We'll handle this via a ref-based approach
    }
    return result;
  }, [state]);

  const toggleSound = useCallback(() => {
    soundModel.toggle();
    setSoundEnabled(soundModel.isEnabled());
  }, []);

  const speak = useCallback((text: string) => {
    soundModel.speak(text);
  }, []);

  const value = useMemo(() => ({
    state,
    board,
    targetPositions,
    soundEnabled,
    dispatch,
    spawnNewLetter,
    moveActiveLetter,
    updatePosition,
    toggleSound,
    speak,
  }), [state, board, targetPositions, soundEnabled, spawnNewLetter, moveActiveLetter, updatePosition, toggleSound, speak]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use game context
export function useGameStore() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameStore must be used within a GameProvider');
  }
  return context;
}
