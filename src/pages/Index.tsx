import { useEffect } from "react";
import GameBoard from "@/components/GameBoard/GameBoard";
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
      title: "Välkommen till Wordris!",
      description: "Styr bokstäverna och bilda ordet. Det kommer ett nytt ord varje runda!",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-dvh bg-background flex flex-col items-center justify-center px-2 py-4 sm:p-4">
      <div className="flex items-center justify-center w-full gap-2 mb-4 sm:mb-8">
        <h1 className="text-4xl font-bold text-primary">Wordris</h1>
        <Popover>
          <PopoverTrigger aria-label="Hur man spelar" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-primary/10">
            <Info className="w-6 h-6 text-primary" aria-hidden="true" />
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h2 className="font-bold text-lg text-center mb-4">Så spelar du</h2>
              
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                <ArrowDown className="w-5 h-5 text-primary motion-safe:animate-bounce" />
                <p className="text-sm">
                  Styr bokstaven som faller med pilarna. Håll in mellanslag eller Snabbfall för att släppa den snabbt.
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-secondary/10 rounded-lg">
                <Book className="w-5 h-5 text-primary" />
                <p className="text-sm">
                  Led bokstaven in i boken för att spara den
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg">
                <Star className="w-5 h-5 text-secondary-foreground" />
                <p className="text-sm">
                  Släpp rätt bokstav på rätt plats i ordet. Varje klart ord ger poäng!
                </p>
              </div>

              <div className="flex items-center gap-2 p-2 bg-fire/10 rounded-lg">
                <Flame className="w-5 h-5 text-fire" />
                <p className="text-sm">
                  Se upp för elden! Om 10 bokstäver brinner upp är spelet slut.
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
      
      <footer className="mt-8 text-sm text-muted-foreground">
        <p>
          Av Magnus Froste · {" "}
          <a 
            href="https://github.com/magnusfroste" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-primary transition-colors"
          >
            Öppen källkod
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Index;