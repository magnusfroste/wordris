import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { GameState, Direction, Position } from "@/types/gameTypes";
import { ALPHABET, INITIAL_WORD, GRID_HEIGHT, GRID_WIDTH } from "@/constants/gameConstants";
import { getTargetPositions, createBoard, calculateNewPosition, getRandomBookPosition, getRandomFirePosition } from "@/utils/boardUtils";

const BOTTOM_ROW = GRID_HEIGHT - 1;

const useGameLogic = () => {
  const { toast } = useToast();
  const [bookPosition] = useState(getRandomBookPosition());
  const [firePosition] = useState(getRandomFirePosition());
  const [gameState, setGameState] = useState<GameState>({
    activeLetter: null,
    placedLetters: []
  });
  const [matchedLetters, setMatchedLetters] = useState<Position[]>([]);
  const [isWordCompleted, setIsWordCompleted] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [burnedLetters, setBurnedLetters] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const soundEnabledRef = useRef(soundEnabled);
  
  // Keep ref in sync with state
  soundEnabledRef.current = soundEnabled;

  const speak = useCallback((text: string) => {
    if (!soundEnabledRef.current) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const showToastAndSpeak = useCallback((title: string, description: string) => {
    toast({
      title,
      description,
    });
    speak(description);
  }, [toast, speak]);

  const addNewLetter = useCallback(() => {
    if (gameState.activeLetter || isWordCompleted) return;

    const randomX = Math.floor(Math.random() * 7);
    const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

    setGameState(prev => ({
      ...prev,
      activeLetter: {
        id: Date.now(),
        letter: randomLetter,
        position: { x: randomX, y: 0 }
      }
    }));
  }, [gameState.activeLetter, isWordCompleted]);

  const moveLetter = useCallback((direction: Direction) => {
    setGameState(prev => {
      if (!prev.activeLetter) return prev;

      const newPosition = calculateNewPosition(
        prev.activeLetter.position.x,
        prev.activeLetter.position.y,
        direction
      );

      return {
        ...prev,
        activeLetter: {
          ...prev.activeLetter,
          position: newPosition
        }
      };
    });
  }, []);

  const updateLetterPositions = useCallback(() => {
    setGameState(prev => {
      if (!prev.activeLetter) return prev;

      const newY = prev.activeLetter.position.y + 1;

      // Check if letter will hit bottom fire row
      if (newY === GRID_HEIGHT - 1) {
        const letterToBurn = prev.activeLetter.letter;
        setBurnedLetters(letters => [...letters, letterToBurn]);
        showToastAndSpeak(
          "Bokstav bränd! 🔥",
          `Bokstaven ${letterToBurn} brann upp!`
        );
        return {
          ...prev,
          activeLetter: null
        };
      }

      if (
        prev.activeLetter.position.x === bookPosition.x && 
        prev.activeLetter.position.y === bookPosition.y - 1
      ) {
        const letterToCollect = prev.activeLetter.letter;
        setCollectedLetters(letters => [...letters, letterToCollect]);
        showToastAndSpeak(
          "Ny bokstav! 📚",
          `Du samlade bokstaven ${letterToCollect}!`
        );
        return {
          ...prev,
          activeLetter: null
        };
      }

      if (
        prev.activeLetter.position.x === firePosition.x && 
        prev.activeLetter.position.y === firePosition.y - 1
      ) {
        const letterToBurn = prev.activeLetter.letter;
        setBurnedLetters(letters => [...letters, letterToBurn]);
        showToastAndSpeak(
          "Bokstav bränd! 🔥",
          `Bokstaven ${letterToBurn} brann upp!`
        );
        return {
          ...prev,
          activeLetter: null
        };
      }

      const targetPositions = getTargetPositions();
      const currentTargetIndex = INITIAL_WORD.split("").findIndex(
        (letter, index) => {
          const targetPos = targetPositions[index];
          return (
            letter === prev.activeLetter?.letter &&
            targetPos.x === prev.activeLetter.position.x &&
            targetPos.y === newY &&
            !prev.placedLetters.some(
              placed =>
                placed.letter === letter &&
                placed.position.x === targetPos.x &&
                placed.position.y === targetPos.y
            )
          );
        }
      );

      if (currentTargetIndex !== -1) {
        const targetPos = targetPositions[currentTargetIndex];
        const newMatchedLetters = [...matchedLetters, { x: targetPos.x, y: targetPos.y }];
        setMatchedLetters(newMatchedLetters);
        
        if (newMatchedLetters.length === INITIAL_WORD.length) {
          setIsWordCompleted(true);
          showToastAndSpeak(
            "Grattis! 🎉",
            "Du klarade ordet!"
          );
        }

        return {
          activeLetter: null,
          placedLetters: [
            ...prev.placedLetters,
            {
              letter: prev.activeLetter.letter,
              position: { x: targetPos.x, y: targetPos.y }
            }
          ]
        };
      }

      if (newY >= GRID_HEIGHT - 1) {
        return {
          ...prev,
          activeLetter: null
        };
      }

      return {
        ...prev,
        activeLetter: {
          ...prev.activeLetter,
          position: { ...prev.activeLetter.position, y: newY }
        }
      };
    });
  }, [bookPosition, firePosition, matchedLetters, showToastAndSpeak]);

  const board = createBoard(gameState, matchedLetters, bookPosition, firePosition);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    board,
    moveLetter,
    updateLetterPositions,
    addNewLetter,
    targetWord: INITIAL_WORD,
    matchedLetters,
    targetPositions: getTargetPositions(),
    isWordCompleted,
    collectedLetters,
    burnedLetters,
    soundEnabled,
    toggleSound,
    speak,
  };
};

export default useGameLogic;
