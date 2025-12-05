import { Book, Flame } from "lucide-react";

interface LetterProps {
  letter: string | null;
  isActive: boolean;
  isTarget?: boolean;
  isMatched?: boolean;
}

const Letter = ({ letter, isActive, isTarget, isMatched }: LetterProps) => {
  if (!letter) return <div className="letter-block bg-gray-100/50" />;

  if (letter === "📚") {
    return (
      <div className="letter-block bg-primary/20">
        <Book className="w-6 h-6 text-primary" />
      </div>
    );
  }

  if (letter === "🔥") {
    return (
      <div className="letter-block bg-orange-500/20">
        <Flame className="w-6 h-6 text-orange-500 animate-[flame_2s_ease-in-out_infinite]" />
      </div>
    );
  }

  return (
    <div
      className={`letter-block ${
        isMatched
          ? "bg-green-500 text-white celebration"
          : isActive
          ? "bg-primary text-white scale-110"
          : isTarget
          ? "bg-secondary/30 text-secondary-foreground/70"
          : "bg-primary/80 text-white"
      }`}
    >
      {letter}
    </div>
  );
};

export default Letter;