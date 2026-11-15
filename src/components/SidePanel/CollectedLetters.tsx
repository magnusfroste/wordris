import { Book } from "lucide-react";

interface CollectedLettersProps {
  letters: string[];
  onLetterClick?: (letter: string) => void;
  horizontal?: boolean;
}

const CollectedLetters = ({ letters, onLetterClick, horizontal }: CollectedLettersProps) => {
  return (
    <section aria-label="Sparade bokstäver i boken" className={horizontal ? "flex flex-col items-center gap-2" : "w-20 flex flex-col items-center pt-4"}>
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
        <span className="sr-only">Sparade bokstäver i boken</span>
        <Book className="w-6 h-6 text-primary" aria-hidden="true" />
      </div>
      <ul className={horizontal ? "flex flex-wrap justify-center gap-1 max-w-[9rem]" : "space-y-2"}>
        {letters.map((letter, index) => (
          <li key={index}>
          <button
            type="button"
            onClick={() => onLetterClick?.(letter)}
            aria-label={`Läs upp ${letter}`}
            className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-lg cursor-pointer hover:scale-105 motion-safe:transition-transform shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {letter}
          </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CollectedLetters;
