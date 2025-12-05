import { useEffect, useCallback, useRef } from "react";
import Letter from "./Letter";
import Fireplace from "./Fireplace";
import useGameLogic from "@/hooks/useGameLogic";
import { useToast } from "@/hooks/use-toast";
import { Book, Flame, Volume2, VolumeX } from "lucide-react";

const GameBoard = () => {
  const { 
    board, 
    moveLetter, 
    updateLetterPositions, 
    addNewLetter, 
    targetPositions, 
    matchedLetters, 
    isWordCompleted, 
    collectedLetters, 
    burnedLetters,
    soundEnabled,
    toggleSound,
    speak
  } = useGameLogic();
  const { toast } = useToast();
  const gameRef = useRef<HTMLDivElement>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    <div className="flex flex-col items-center gap-4">
      {/* Sound Toggle */}
      <button
        onClick={toggleSound}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted transition-colors text-sm font-medium shadow-sm"
        aria-label={soundEnabled ? "Stäng av ljud" : "Sätt på ljud"}
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-primary" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        )}
        <span className="text-foreground">{soundEnabled ? "Ljud på" : "Ljud av"}</span>
      </button>

      <div className="flex items-start justify-center gap-6">
        {/* Saved Letters */}
        <div className="w-20 flex flex-col items-center pt-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Book className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            {collectedLetters.map((letter, index) => {
              const handleCollectedSpeak = () => speak(`Sparad bokstav ${letter}`);
              return (
                <div
                  key={index}
                  onClick={handleCollectedSpeak}
                  className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-lg cursor-pointer hover:scale-105 transition-transform shadow-md"
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
          className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${board.length}, 1fr)` }}>
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-1">
                {row.map((cell, colIndex) => (
                  <Letter
                    key={`${rowIndex}-${colIndex}`}
                    letter={cell}
                    isActive={cell !== null && cell !== "🔥" && cell !== "📚"}
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
        <div className="w-20 flex flex-col items-center pt-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="space-y-2">
            {burnedLetters.map((letter, index) => {
              const handleBurnedSpeak = () => speak(`Bränd bokstav ${letter}`);
              return (
                <div
                  key={index}
                  onClick={handleBurnedSpeak}
                  className="w-10 h-10 flex items-center justify-center bg-destructive text-destructive-foreground rounded-lg font-bold text-lg cursor-pointer hover:scale-105 transition-transform shadow-md"
                >
                  {letter}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
