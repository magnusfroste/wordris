import { Flame } from "lucide-react";

interface BurnedLettersProps {
  letters: string[];
  onLetterClick?: (letter: string) => void;
  horizontal?: boolean;
}

const BurnedLetters = ({ letters, onLetterClick, horizontal }: BurnedLettersProps) => {
  return (
    <section aria-label="Brända bokstäver" className={horizontal ? "flex flex-col items-center gap-2" : "w-20 flex flex-col items-center pt-4"}>
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
        <span className="sr-only">Brända bokstäver</span>
        <Flame className="w-6 h-6 text-fire" aria-hidden="true" />
      </div>
      <ul className={horizontal ? "flex flex-wrap justify-center gap-1 max-w-[9rem]" : "space-y-2"}>
        {letters.map((letter, index) => (
          <li key={index}>
          <button
            type="button"
            onClick={() => onLetterClick?.(letter)}
            aria-label={`Läs upp ${letter}`}
            className="w-10 h-10 flex items-center justify-center bg-destructive text-destructive-foreground rounded-lg font-bold text-lg cursor-pointer hover:scale-105 motion-safe:transition-transform shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {letter}
          </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BurnedLetters;
