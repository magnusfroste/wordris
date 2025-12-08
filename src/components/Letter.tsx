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
          ? "bg-green-500 text-white letter-block-matched celebration"
          : isActive
          ? "bg-primary text-primary-foreground scale-110 letter-block-active"
          : isTarget
          ? "bg-primary/20 text-primary border-2 border-primary/40"
          : "bg-primary text-primary-foreground"
      }`}
    >
      {letter}
    </div>
  );
};

export default Letter;