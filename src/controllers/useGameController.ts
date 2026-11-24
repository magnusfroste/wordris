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
import { report } from "@/lib/skolappar";

const FAST_FALL_SPEED = 100;

export function useGameController() {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<GameModelState>(createInitialState);
  const [soundEnabled, setSoundEnabled] = useState(() => soundModel.isEnabled());
  const [speedLevel, setSpeedLevel] = useState<SpeedLevel>('normal');
  
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(gameState);
  const isFastFallingRef = useRef(false);
  const newRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isRunning = !isPaused && !gameState.isGameOver;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  
  // Keep ref in sync with state
  gameStateRef.current = gameState;

  // Get current speed settings
  const currentSpeedSettings = SPEED_LEVELS[speedLevel];

  // Derived state
  const board = createBoard(gameState);
  const targetPositions = getTargetPositions(gameState.currentWord);

  // Sound functions
  const speak = useCallback((text: string) => {
    if (soundModel.isEnabled()) {
      soundModel.speak(text);
    }
  }, []);

  const showToastAndSpeak = useCallback((title: string, description: string) => {
    toast({ title, description });
    if (soundModel.isEnabled()) {
      soundModel.speak(description);
    }
  }, [toast]);

  const toggleSound = useCallback(() => {
    const newEnabled = soundModel.toggle();
    setSoundEnabled(newEnabled);
    // Cancel any ongoing speech when turning off
    if (!newEnabled) {
      window.speechSynthesis.cancel();
      report("sound_off");
    }
  }, []);

  // Game actions
  const spawnNewLetter = useCallback(() => {
    setGameState(current => {
      const newState = spawnLetter(current);
      return newState || current;
    });
  }, []);

  const moveActiveLetter = useCallback((direction: Direction) => {
    if (!isRunningRef.current) return;
    setGameState(current => moveLetter(current, direction));
  }, []);

  const updatePosition = useCallback(() => {
    // Use ref to get current state synchronously (avoids React batching issues)
    const currentState = gameStateRef.current;
    const result = updateLetterPosition(currentState);
    
    // Only update if state changed
    if (result.newState !== currentState) {
      setGameState(result.newState);
    }
    
    // Handle events synchronously with correct letter
    if (result.event !== 'none' && result.letter) {
      switch (result.event) {
        case 'collected':
          showToastAndSpeak("Ny bokstav! 📚", `Du samlade bokstaven ${result.letter}!`);
          break;
        case 'burned':
          showToastAndSpeak("Oj, elden! 🔥", `Bokstaven ${result.letter} brann upp.`);
          break;
        case 'gameover':
          // The word was not finished: the result is how much of it was in place.
          report("round_done", Math.round((currentState.matchedLetters.length / currentState.currentWord.length) * 100));
          showToastAndSpeak("Spelet är slut", "För många bokstäver brann upp. Tryck på Spela igen!");
          break;
        case 'matched':
          // Optional: sound for match
          break;
        case 'completed':
          report("round_done", 100);
          showToastAndSpeak("Grattis! 🎉", "Du klarade ordet! Ett nytt ord kommer snart.");
          if (newRoundTimeoutRef.current) clearTimeout(newRoundTimeoutRef.current);
          newRoundTimeoutRef.current = setTimeout(() => {
            report("round_start");
            setGameState(current => startNewRound(current));
          }, 2000);
          break;
      }
    }
  }, [showToastAndSpeak]);

  // Fast fall controls
  const startFastFall = useCallback(() => {
    if (isFastFallingRef.current || !isRunningRef.current) return;
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
    if (!isRunningRef.current) return;
    moveIntervalRef.current = setInterval(updatePosition, currentSpeedSettings.fallSpeed);
  }, [updatePosition, currentSpeedSettings.fallSpeed]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        moveActiveLetter("left");
        break;
      case "ArrowRight":
        e.preventDefault();
        moveActiveLetter("right");
        break;
      case "ArrowUp":
        e.preventDefault();
        moveActiveLetter("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        moveActiveLetter("down");
        break;
      case " ":
        if ((e.target as HTMLElement)?.tagName === "BUTTON") return;
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
    if (!isRunning) return;
    isFastFallingRef.current = false;
    moveIntervalRef.current = setInterval(updatePosition, currentSpeedSettings.fallSpeed);
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [updatePosition, currentSpeedSettings.fallSpeed, isRunning]);

  // Setup spawn interval - updates when speed changes
  useEffect(() => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    if (!isRunning) return;
    spawnIntervalRef.current = setInterval(spawnNewLetter, currentSpeedSettings.spawnInterval);
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, [spawnNewLetter, currentSpeedSettings.spawnInterval, isRunning]);

  // Pausa när fliken döljs
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
        window.speechSynthesis?.cancel();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => () => {
    if (newRoundTimeoutRef.current) clearTimeout(newRoundTimeoutRef.current);
  }, []);

  // The first word starts as soon as the game is shown.
  useEffect(() => {
    report("round_start");
  }, []);

  const togglePause = useCallback(() => setIsPaused(p => !p), []);

  // Restart game
  const restartGame = useCallback(() => {
    if (newRoundTimeoutRef.current) clearTimeout(newRoundTimeoutRef.current);
    setIsPaused(false);
    setGameState(createInitialState());
    report("round_start");
  }, []);

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
    score: gameState.score,
    wordsCompleted: gameState.wordsCompleted,
    isGameOver: gameState.isGameOver,
    isPaused,
    
    // Actions
    togglePause,
    toggleSound,
    speak,
    setSpeedLevel,
    moveActiveLetter,
    startFastFall,
    stopFastFall,
    restartGame,
    
    // Helpers
    isTargetPosition,
    isMatchedPosition,
  };
}
