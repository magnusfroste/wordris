import { Book } from "lucide-react";

interface CollectedLettersProps {
  letters: string[];
  onLetterClick?: (letter: string) => void;
}

const CollectedLetters = ({ letters, onLetterClick }: CollectedLettersProps) => {
  return (
    <div className="w-20 flex flex-col items-center pt-4">
      <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground mb-3">
        <Book className="w-6 h-6 text-primary" />
      </div>
      <div className="space-y-2">
        {letters.map((letter, index) => (
          <div
            key={index}
            onClick={() => onLetterClick?.(letter)}
            className="w-10 h-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg font-bold text-lg cursor-pointer hover:scale-105 transition-transform shadow-md"
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectedLetters;
