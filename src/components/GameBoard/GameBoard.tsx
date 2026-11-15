import { useRef, useEffect } from "react";
import { useGameController } from "@/controllers/useGameController";
import { Button } from "@/components/ui/button";
import { RotateCcw, ChevronLeft, ChevronRight, ChevronsDown, Pause, Play, Star, Flame } from "lucide-react";
import { MAX_BURNED } from "@/constants/gameConstants";
import SoundToggle from "./SoundToggle";
import SpeedSelector from "./SpeedSelector";
import GameGrid from "./GameGrid";
import CollectedLetters from "../SidePanel/CollectedLetters";
import BurnedLetters from "../SidePanel/BurnedLetters";

const sideBtn =
  "h-16 w-full md:h-32 md:w-16 touch-manipulation select-none hover:bg-primary/20 active:bg-primary/30 transition-colors [&_svg]:size-10";

const GameBoard = () => {
  const {
    board, collectedLetters, burnedLetters, soundEnabled, toggleSound, speak,
    isTargetPosition, isMatchedPosition, speedLevel, setSpeedLevel, moveActiveLetter,
    startFastFall, stopFastFall, restartGame, currentWord, score, wordsCompleted,
    isGameOver, isPaused, togglePause,
  } = useGameController();

  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  const move = (dir: "left" | "right") => (e: React.PointerEvent) => {
    e.preventDefault();
    moveActiveLetter(dir);
  };

  const fastFallHandlers = {
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); startFastFall(); },
    onPointerUp: stopFastFall,
    onPointerLeave: stopFastFall,
    onPointerCancel: stopFastFall,
  };

  const leftBtn = (
    <Button variant="outline" size="lg" className={sideBtn} onPointerDown={move("left")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moveActiveLetter("left"); } }}
      aria-label="Flytta bokstaven åt vänster">
      <ChevronLeft className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />
    </Button>
  );
  const rightBtn = (
    <Button variant="outline" size="lg" className={sideBtn} onPointerDown={move("right")}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moveActiveLetter("right"); } }}
      aria-label="Flytta bokstaven åt höger">
      <ChevronRight className="h-10 w-10 md:h-12 md:w-12" aria-hidden="true" />
    </Button>
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
        <SpeedSelector currentSpeed={speedLevel} onSpeedChange={setSpeedLevel} />
        <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
        <Button variant="outline" onClick={togglePause} disabled={isGameOver} className="min-h-11 gap-2">
          {isPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          {isPaused ? "Fortsätt" : "Paus"}
        </Button>
        <Button variant="outline" onClick={restartGame} className="min-h-11 gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Börja om
        </Button>
      </div>

      <div className="flex items-center gap-4 text-base font-semibold" aria-live="polite">
        <span className="flex items-center gap-1">
          <Star className="h-5 w-5 text-secondary-foreground" aria-hidden="true" /> Poäng: {score}
        </span>
        <span>Klara ord: {wordsCompleted}</span>
        <span className="flex items-center gap-1">
          <Flame className="h-5 w-5 text-fire" aria-hidden="true" /> {burnedLetters.length}/{MAX_BURNED}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-4 w-full">
        <div className="hidden md:block">{leftBtn}</div>

        <div className="flex items-start justify-center gap-2 md:gap-6">
          <div className="hidden md:block">
            <CollectedLetters letters={collectedLetters} onLetterClick={(l) => speak(`Sparad bokstav ${l}`)} />
          </div>

          <div
            ref={gameRef}
            tabIndex={0}
            role="application"
            aria-label={`Spelplan. Bilda ordet ${currentWord}. Styr med piltangenterna, håll in mellanslag för att släppa snabbt.`}
            className="relative touch-none select-none rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <GameGrid board={board} isTargetPosition={isTargetPosition} isMatchedPosition={isMatchedPosition} />
            {(isPaused || isGameOver) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-background/90 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {isGameOver ? "Spelet är slut!" : "Pausat"}
                </p>
                {isGameOver && <p className="text-foreground">Du fick {score} poäng. Bra kämpat!</p>}
                <Button size="lg" className="min-h-12 text-lg" onClick={isGameOver ? restartGame : togglePause}>
                  {isGameOver ? "Spela igen" : "Fortsätt spela"}
                </Button>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <BurnedLetters letters={burnedLetters} onLetterClick={(l) => speak(`Bränd bokstav ${l}`)} />
          </div>
        </div>

        <div className="hidden md:block">{rightBtn}</div>
      </div>

      {/* Stora touchkontroller under spelplanen på mobil/surfplatta */}
      <div className="grid w-full max-w-sm grid-cols-3 gap-3 md:max-w-md">
        <div className="md:hidden">{leftBtn}</div>
        <Button variant="secondary" size="lg"
          className="col-start-2 h-16 w-full [&_svg]:size-8 touch-manipulation select-none text-base"
          aria-label="Snabbfall – håll in för att släppa bokstaven snabbt"
          {...fastFallHandlers}>
          <ChevronsDown className="h-8 w-8" aria-hidden="true" />
          <span className="hidden sm:inline">Snabbfall</span>
        </Button>
        <div className="md:hidden">{rightBtn}</div>
      </div>

      <div className="flex w-full justify-center gap-6 md:hidden">
        <CollectedLetters letters={collectedLetters} onLetterClick={(l) => speak(`Sparad bokstav ${l}`)} horizontal />
        <BurnedLetters letters={burnedLetters} onLetterClick={(l) => speak(`Bränd bokstav ${l}`)} horizontal />
      </div>
    </div>
  );
};

export default GameBoard;
