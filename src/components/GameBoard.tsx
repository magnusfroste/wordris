import { useEffect, useCallback, useRef } from "react";
import Letter from "./Letter";
import Fireplace from "./Fireplace";
import useGameLogic from "@/hooks/useGameLogic";
import { useToast } from "./ui/use-toast";
import { Book, Flame } from "lucide-react";

const GameBoard = () => {
  const { board, moveLetter, updateLetterPositions, addNewLetter, targetPositions, matchedLetters, isWordCompleted, collectedLetters, burnedLetters } = useGameLogic();
  const { toast } = useToast();
  const gameRef = useRef<HTMLDivElement>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      moveLetter("left");
    } else if (e.key === "ArrowRight") {
      moveLetter("right");
    } else if (e.key === "ArrowUp") {
      moveLetter("up");
    } else if (e.key === "ArrowDown") {
      moveLetter("down");
    } else if (e.key === " ") {
      e.preventDefault(); // Prevent page scroll
      // Clear existing interval and set a faster one
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
      moveIntervalRef.current = setInterval(updateLetterPositions, 100); // Fast fall speed
    }
  }, [moveLetter, updateLetterPositions]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === " ") {
      // Reset to normal speed when spacebar is released
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
      moveIntervalRef.current = setInterval(updateLetterPositions, 500); // Normal speed
    }
  }, [updateLetterPositions]);

  useEffect(() => {
    const gameElement = gameRef.current;
    if (gameElement) {
      gameElement.focus();
    }
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyPress, handleKeyUp]);

  useEffect(() => {
    moveIntervalRef.current = setInterval(updateLetterPositions, 500);
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [updateLetterPositions]);

  useEffect(() => {
    const spawnInterval = setInterval(addNewLetter, 3000);
    return () => clearInterval(spawnInterval);
  }, [addNewLetter]);

  useEffect(() => {
    if (isWordCompleted) {
      const message = "Grattis! Du klarade ordet!";
      toast({
        title: "Grattis! 🎉",
        description: "Du klarade ordet!",
      });
      speak(message);
    }
  }, [isWordCompleted, toast, speak]);

  const isTargetPosition = (row: number, col: number) => {
    return targetPositions.some(pos => pos.x === col && pos.y === row);
  };

  const isMatchedPosition = (row: number, col: number) => {
    return matchedLetters.some(match => match.x === col && match.y === row);
  };

  return (
    <div className="flex gap-4">
      {/* Saved Letters */}
      <div className="w-24 space-y-2">
        <h3 className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <Book className="w-6 h-6" />
        </h3>
        <div className="space-y-2">
          {collectedLetters.map((letter, index) => {
            const handleCollectedSpeak = () => speak(`Sparad bokstav ${letter}`);
            return (
              <div
                key={index}
                onClick={handleCollectedSpeak}
                className="w-10 h-10 mx-auto flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-lg cursor-pointer hover:opacity-90"
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Board */}
      <div 
        ref={gameRef}
        tabIndex={0}
        className="relative bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-xl h-[80vh] overflow-y-auto focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
        <div className="grid grid-rows-[repeat(12,minmax(0,1fr))] gap-1">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-1">
              {row.map((cell, colIndex) => (
                <Letter
                  key={`${rowIndex}-${colIndex}`}
                  letter={cell}
                  isActive={cell !== null}
                  isTarget={isTargetPosition(rowIndex, colIndex)}
                  isMatched={isMatchedPosition(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
        <Fireplace />
      </div>

      {/* Burned Letters */}
      <div className="w-24 space-y-2">
        <h3 className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <Flame className="w-6 h-6 text-orange-500" />
        </h3>
        <div className="space-y-2">
          {burnedLetters.map((letter, index) => {
            const handleBurnedSpeak = () => speak(`Bränd bokstav ${letter}`);
            return (
              <div
                key={index}
                onClick={handleBurnedSpeak}
                className="w-10 h-10 mx-auto flex items-center justify-center bg-destructive text-destructive-foreground rounded-lg font-bold text-lg cursor-pointer hover:opacity-90"
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
