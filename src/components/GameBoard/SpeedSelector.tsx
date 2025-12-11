import { Button } from "@/components/ui/button";
import { SPEED_LEVELS, SpeedLevel } from "@/constants/gameConstants";

interface SpeedSelectorProps {
  currentSpeed: SpeedLevel;
  onSpeedChange: (speed: SpeedLevel) => void;
}

const SpeedSelector = ({ currentSpeed, onSpeedChange }: SpeedSelectorProps) => {
  const speeds: SpeedLevel[] = ['lätt', 'normal', 'svår'];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Hastighet:</span>
      <div className="flex gap-1">
        {speeds.map((speed) => (
          <Button
            key={speed}
            variant={currentSpeed === speed ? "default" : "outline"}
            size="sm"
            onClick={() => onSpeedChange(speed)}
            className="text-xs px-3"
          >
            {SPEED_LEVELS[speed].label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SpeedSelector;
