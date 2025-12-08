import { useEffect, useCallback, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Direction, Position } from "@/types/gameTypes";
import {
  GameModelState,
  createInitialState,
  spawnLetter,
  moveLetter,
  updateLetterPosition,
  createBoard,
  getTargetPositions,
} from "@/models/GameModel";
import { soundModel } from "@/models/SoundModel";

const NORMAL_FALL_SPEED = 500;
const FAST_FALL_SPEED = 100;
const SPAWN_INTERVAL = 3000;

export function useGameController() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameModelState>(createInitialState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(gameState);
  
  // Keep ref in sync with state
  gameStateRef.current = gameState;

  // Derived state
  const board = createBoard(gameState);
  const targetPositions = getTargetPositions();

  // Sound functions
  const speak = useCallback((text: string) => {
    soundModel.speak(text);
  }, []);

  const showToastAndSpeak = useCallback((title: string, description: string) => {
    toast({ title, description });
    speak(description);
  }, [toast, speak]);

  const toggleSound = useCallback(() => {
    const newEnabled = soundModel.toggle();
    setSoundEnabled(newEnabled);
  }, []);

  // Game actions
  const spawnNewLetter = useCallback(() => {
    setGameState(current => {
      const newState = spawnLetter(current);
      return newState || current;
    });
  }, []);

  const moveActiveLetter = useCallback((direction: Direction) => {
    setGameState(current => moveLetter(current, direction));
  }, []);

  const updatePosition = useCallback(() => {
    setGameState(current => {
      const result = updateLetterPosition(current);
      
      // Handle events
      switch (result.event) {
        case 'collected':
          showToastAndSpeak("Ny bokstav! 📚", `Du samlade bokstaven ${result.letter}!`);
          break;
        case 'burned':
          showToastAndSpeak("Bokstav bränd! 🔥", `Bokstaven ${result.letter} brann upp!`);
          break;
        case 'matched':
          // Optional: sound for match
          break;
        case 'completed':
          showToastAndSpeak("Grattis! 🎉", "Du klarade ordet!");
          break;
      }
      
      return result.newState;
    });
  }, [showToastAndSpeak]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        moveActiveLetter("left");
        break;
      case "ArrowRight":
        moveActiveLetter("right");
        break;
      case "ArrowUp":
        moveActiveLetter("up");
        break;
      case "ArrowDown":
        moveActiveLetter("down");
        break;
      case " ":
        e.preventDefault();
        // Fast fall
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current);
        }
        moveIntervalRef.current = setInterval(updatePosition, FAST_FALL_SPEED);
        break;
    }
  }, [moveActiveLetter, updatePosition]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      // Reset to normal speed
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
      moveIntervalRef.current = setInterval(updatePosition, NORMAL_FALL_SPEED);
    }
  }, [updatePosition]);

  // Setup keyboard listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Setup fall interval
  useEffect(() => {
    moveIntervalRef.current = setInterval(updatePosition, NORMAL_FALL_SPEED);
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [updatePosition]);

  // Setup spawn interval
  useEffect(() => {
    const spawnInterval = setInterval(spawnNewLetter, SPAWN_INTERVAL);
    return () => clearInterval(spawnInterval);
  }, [spawnNewLetter]);

  // Helper functions for view
  const isTargetPosition = useCallback((row: number, col: number): boolean => {
    return targetPositions.some(pos => pos.x === col && pos.y === row);
  }, [targetPositions]);

  const isMatchedPosition = useCallback((row: number, col: number): boolean => {
    return gameState.matchedLetters.some(match => match.x === col && match.y === row);
  }, [gameState.matchedLetters]);

  return {
    // State
    board,
    targetPositions,
    matchedLetters: gameState.matchedLetters,
    collectedLetters: gameState.collectedLetters,
    burnedLetters: gameState.burnedLetters,
    isWordCompleted: gameState.isWordCompleted,
    soundEnabled,
    
    // Actions
    toggleSound,
    speak,
    
    // Helpers
    isTargetPosition,
    isMatchedPosition,
  };
}
