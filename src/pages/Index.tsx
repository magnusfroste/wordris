import { useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Book, Star, Flame, ArrowDown } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Välkommen till OrdNisse!",
      description: "Använd vänster/höger piltangenter för att styra bokstäverna.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center w-full gap-2 mb-8">
        <h1 className="text-4xl font-bold text-primary">OrdNisse</h1>
        <Popover>
          <PopoverTrigger>
            <Info className="w-6 h-6 text-primary hover:text-primary/80 transition-colors cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-center mb-4">Hur man spelar</h3>
              
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
      </div>
      <div className="flex justify-center w-full">
        <div className="w-full max-w-5xl">
          <GameBoard />
        </div>
      </div>
    </div>
  );
};

export default Index;