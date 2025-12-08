import Letter from "../Letter";
import Fireplace from "../Fireplace";

interface GameGridProps {
  board: (string | null)[][];
  isTargetPosition: (row: number, col: number) => boolean;
  isMatchedPosition: (row: number, col: number) => boolean;
}

const GameGrid = ({ board, isTargetPosition, isMatchedPosition }: GameGridProps) => {
  return (
    <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
      <div className="grid gap-1" style={{ gridTemplateRows: `repeat(${board.length}, 1fr)` }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-7 gap-1">
            {row.map((cell, colIndex) => (
              <Letter
                key={`${rowIndex}-${colIndex}`}
                letter={cell}
                isActive={cell !== null && cell !== "🔥" && cell !== "📚"}
                isTarget={isTargetPosition(rowIndex, colIndex)}
                isMatched={isMatchedPosition(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      <Fireplace />
    </div>
  );
};

export default GameGrid;
