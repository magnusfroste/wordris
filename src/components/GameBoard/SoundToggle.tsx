import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted transition-colors text-sm font-medium shadow-sm"
      aria-label={enabled ? "Stäng av ljud" : "Sätt på ljud"}
    >
      {enabled ? (
        <Volume2 className="w-5 h-5 text-primary" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" />
      )}
      <span className="text-foreground">{enabled ? "Ljud på" : "Ljud av"}</span>
    </button>
  );
};

export default SoundToggle;
