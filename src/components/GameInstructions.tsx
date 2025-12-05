import { Book, Star, Flame, ArrowDown, Keyboard } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const GameInstructions = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-lg font-bold text-primary hover:text-primary/90 transition-colors">
          Ordnisse
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-center mb-4">Hur man spelar</h3>
          
          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
            <Keyboard className="w-5 h-5 text-primary" />
            <p className="text-sm">
              Använd piltangenterna ←↑↓→ på tangentbordet för att styra
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
            <ArrowDown className="w-5 h-5 text-primary animate-bounce" />
            <p className="text-sm">
              Styr fallande bokstäver med pilarna
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg">
            <Book className="w-5 h-5 text-primary" />
            <p className="text-sm">
              Samla bokstäver i boken för att spara dem
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg">
            <Star className="w-5 h-5 text-yellow-500" />
            <p className="text-sm">
              Bokstäver är värdefulla - använd dem för att bilda ordet!
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-orange-500/10 rounded-lg">
            <Flame className="w-5 h-5 text-orange-500" />
            <p className="text-sm">
              Se upp! Bokstäver som når elden brinner upp
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GameInstructions;