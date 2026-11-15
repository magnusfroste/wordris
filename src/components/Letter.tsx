import { Book, Flame } from "lucide-react";

interface LetterProps {
  letter: string | null;
  isActive: boolean;
  isTarget?: boolean;
  isMatched?: boolean;
}

const Letter = ({ letter, isActive, isTarget, isMatched }: LetterProps) => {
  if (!letter) return <div className="letter-block bg-muted/60" aria-hidden="true" />;

  if (letter === "📚") {
    return (
      <div className="letter-block bg-primary/20" role="img" aria-label="Bok">
        <Book className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" />
      </div>
    );
  }

  if (letter === "🔥") {
    return (
      <div className="letter-block bg-fire/20" role="img" aria-label="Eld">
        <Flame aria-hidden="true" className="w-5 h-5 sm:w-6 sm:h-6 text-fire animate-[flame_2s_ease-in-out_infinite]" />
      </div>
    );
  }

  return (
    <div
      className={`letter-block ${
        isMatched
          ? "bg-success text-success-foreground letter-block-matched celebration"
          : isActive
          ? "bg-primary text-primary-foreground scale-110 letter-block-active"
          : isTarget
          ? "bg-primary/15 text-target border-2 border-primary/50"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {letter}
    </div>
  );
};

export default Letter;