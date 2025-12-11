import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsDown } from "lucide-react";
import { Direction } from "@/types/gameTypes";

interface TouchControlsProps {
  onMove: (direction: Direction) => void;
  onFastFall: () => void;
  onFastFallEnd: () => void;
}

const TouchControls = ({ onMove, onFastFall, onFastFallEnd }: TouchControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="grid grid-cols-3 gap-1">
        <div />
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 touch-manipulation"
          onTouchStart={() => onMove('up')}
          onClick={() => onMove('up')}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <div />
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 touch-manipulation"
          onTouchStart={() => onMove('left')}
          onClick={() => onMove('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          className="h-12 w-12 touch-manipulation"
          onTouchStart={onFastFall}
          onTouchEnd={onFastFallEnd}
          onMouseDown={onFastFall}
          onMouseUp={onFastFallEnd}
          onMouseLeave={onFastFallEnd}
        >
          <ChevronsDown className="h-6 w-6" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 touch-manipulation"
          onTouchStart={() => onMove('right')}
          onClick={() => onMove('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        <div />
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 touch-manipulation"
          onTouchStart={() => onMove('down')}
          onClick={() => onMove('down')}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
        <div />
      </div>
      <p className="text-xs text-muted-foreground">Håll ⏬ för snabbfall</p>
    </div>
  );
};

export default TouchControls;
