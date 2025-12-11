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
  startNewRound,
} from "@/models/GameModel";
import { soundModel } from "@/models/SoundModel";
import { SPEED_LEVELS, SpeedLevel } from "@/constants/gameConstants";

const FAST_FALL_SPEED = 100;

export function useGameController() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameModelState>(createInitialState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>('normal');
  
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(gameState);
  const isFastFallingRef = useRef(false);
  
  // Keep ref in sync with state
  gameStateRef.current = gameState;

  // Get current speed settings
  const currentSpeedSettings = SPEED_LEVELS[speedLevel];

  // Derived state
  const board = createBoard(gameState);
  const targetPositions = getTargetPositions(gameState.currentWord);

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
          showToastAndSpeak("Grattis! 🎉", "Du klarade ordet! Nytt ord kommer...");
          // Start new round after delay
          setTimeout(() => {
            setGameState(current => startNewRound(current));
          }, 2000);
          break;
      }
      
      return result.newState;
    });
  }, [showToastAndSpeak]);

  // Fast fall controls
  const startFastFall = useCallback(() => {
    if (isFastFallingRef.current) return;
    isFastFallingRef.current = true;
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
    moveIntervalRef.current = setInterval(updatePosition, FAST_FALL_SPEED);
  }, [updatePosition]);

  const stopFastFall = useCallback(() => {
    if (!isFastFallingRef.current) return;
    isFastFallingRef.current = false;
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
    moveIntervalRef.current = setInterval(updatePosition, currentSpeedSettings.fallSpeed);
  }, [updatePosition, currentSpeedSettings.fallSpeed]);

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
        startFastFall();
        break;
    }
  }, [moveActiveLetter, startFastFall]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      stopFastFall();
    }
  }, [stopFastFall]);

  // Setup keyboard listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Setup fall interval - updates when speed changes
  useEffect(() => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }
    moveIntervalRef.current = setInterval(updatePosition, currentSpeedSettings.fallSpeed);
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [updatePosition, currentSpeedSettings.fallSpeed]);

  // Setup spawn interval - updates when speed changes
  useEffect(() => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    spawnIntervalRef.current = setInterval(spawnNewLetter, currentSpeedSettings.spawnInterval);
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [spawnNewLetter, currentSpeedSettings.spawnInterval]);

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
    currentWord: gameState.currentWord,
    speedLevel,
    
    // Actions
    toggleSound,
    speak,
    setSpeedLevel,
    moveActiveLetter,
    startFastFall,
    stopFastFall,
    
    // Helpers
    isTargetPosition,
    isMatchedPosition,
  };
}
