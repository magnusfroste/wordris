import { useRef, useEffect } from "react";
import { useGameController } from "@/controllers/useGameController";
import { useIsTouchDevice } from "@/hooks/use-touch-device";
import SoundToggle from "./SoundToggle";
import SpeedSelector from "./SpeedSelector";
import TouchControls from "./TouchControls";
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
      <div className="flex items-center gap-4">
        <SpeedSelector currentSpeed={speedLevel} onSpeedChange={setSpeedLevel} />
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      </div>

      <div className="flex items-start justify-center gap-6">
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

      {isTouchDevice && (
        <TouchControls 
          onMove={moveActiveLetter}
          onFastFall={startFastFall}
          onFastFallEnd={stopFastFall}
        />
      )}
    </div>
  );
};

export default GameBoard;
