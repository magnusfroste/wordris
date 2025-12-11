import { useRef, useEffect } from "react";
import { useGameController } from "@/controllers/useGameController";
import { useIsTouchDevice } from "@/hooks/use-touch-device";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronLeft, ChevronRight, ChevronsDown } from "lucide-react";
import SoundToggle from "./SoundToggle";
import SpeedSelector from "./SpeedSelector";
import GameGrid from "./GameGrid";
import CollectedLetters from "../SidePanel/CollectedLetters";
import BurnedLetters from "../SidePanel/BurnedLetters";

const GameBoard = () => {
  const {
    board,
    collectedLetters,
    burnedLetters,
    soundEnabled,
    toggleSound,
    speak,
    isTargetPosition,
    isMatchedPosition,
    speedLevel,
    setSpeedLevel,
    moveActiveLetter,
    startFastFall,
    stopFastFall,
    restartGame,
  } = useGameController();
  
  const gameRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  const handleCollectedLetterClick = (letter: string) => {
    speak(`Sparad bokstav ${letter}`);
  };

  const handleBurnedLetterClick = (letter: string) => {
    speak(`Bränd bokstav ${letter}`);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <SpeedSelector currentSpeed={speedLevel} onSpeedChange={setSpeedLevel} />
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
        <Button
          variant="outline"
          size="sm"
          onClick={restartGame}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Börja om
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* Vänster kontroll */}
        <Button
          variant="outline"
          size="lg"
          className="h-24 w-14 md:h-32 md:w-16 touch-manipulation hover:bg-primary/20 active:bg-primary/30 transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            moveActiveLetter("left");
          }}
          onClick={() => moveActiveLetter("left")}
          aria-label="Flytta vänster"
        >
          <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
        </Button>

        <div className="flex items-start justify-center gap-2 md:gap-6">
          <CollectedLetters 
            letters={collectedLetters} 
            onLetterClick={handleCollectedLetterClick} 
          />

          <div ref={gameRef} tabIndex={0} className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-2xl">
            <GameGrid
              board={board}
              isTargetPosition={isTargetPosition}
              isMatchedPosition={isMatchedPosition}
            />
          </div>

          <BurnedLetters 
            letters={burnedLetters} 
            onLetterClick={handleBurnedLetterClick} 
          />
        </div>

        {/* Höger kontroll */}
        <Button
          variant="outline"
          size="lg"
          className="h-24 w-14 md:h-32 md:w-16 touch-manipulation hover:bg-primary/20 active:bg-primary/30 transition-colors"
          onTouchStart={(e) => {
            e.preventDefault();
            moveActiveLetter("right");
          }}
          onClick={() => moveActiveLetter("right")}
          aria-label="Flytta höger"
        >
          <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
        </Button>
      </div>

      {/* Snabbfall-knapp för touch */}
      {isTouchDevice && (
        <Button
          variant="secondary"
          size="lg"
          className="h-16 w-32 touch-manipulation text-lg"
          onTouchStart={startFastFall}
          onTouchEnd={stopFastFall}
          onMouseDown={startFastFall}
          onMouseUp={stopFastFall}
          onMouseLeave={stopFastFall}
        >
          <ChevronsDown className="h-8 w-8 mr-2" />
          Snabbfall
        </Button>
      )}
    </div>
  );
};

export default GameBoard;
