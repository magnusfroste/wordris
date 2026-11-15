import { Volume2, VolumeX } from "lucide-react";

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const SoundToggle = ({ enabled, onToggle }: SoundToggleProps) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      aria-pressed={enabled}
      className="flex min-h-11 items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-muted transition-colors text-sm font-medium shadow-sm"
          >
      {enabled ? (
        <Volume2 className="w-5 h-5 text-primary" aria-hidden="true" />
      ) : (
        <VolumeX className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
      )}
      <span className="text-foreground">{enabled ? "Ljud på" : "Ljud av"}</span>
    </button>
  );
};

export default SoundToggle;
