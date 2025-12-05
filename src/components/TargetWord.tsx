import useGameLogic from "@/hooks/useGameLogic";

const TargetWord = () => {
  const { targetWord, matchedLetters } = useGameLogic();

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="text-sm text-muted-foreground">Bilda ordet:</div>
      <div className="flex gap-2">
        {targetWord.split("").map((letter, index) => {
          const startX = Math.floor((7 - targetWord.length) / 2);
          const isMatched = matchedLetters.some(
            pos => pos.x === startX + index && pos.y === 8
          );
          
          return (
            <div
              key={index}
              className={`letter-block ${
                isMatched
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground mt-4">
        Använd ← → pilarna för att styra
      </div>
    </div>
  );
};

export default TargetWord;