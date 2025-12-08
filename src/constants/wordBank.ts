// Word bank for Wordris - max 7 letters per word

export const WORD_BANK = {
  kändaFigurer: ["BAMSE", "PIPPI", "EMIL", "MUMIN", "ALFONS", "LANSEN", "NANSEN"],
  städer: ["MALMÖ", "VISBY", "GÄVLE", "LULEÅ", "UMEÅ", "LUND", "BORÅS", "FALUN"],
  djur: ["ÄLGEN", "BJÖRN", "VARG", "RÄVEN", "UGGLA", "LODJUR", "SÄLEN", "HAREN"],
  mat: ["KORV", "PIZZA", "KAKA", "SOPPA", "FISK", "BRÖD", "GLASS", "SYLT"],
  julord: ["NISSE", "TOMTE", "GRAN", "KLAPP", "SNÖBOLL", "JULBAK"]
};

export type WordCategory = keyof typeof WORD_BANK;

export const getAllWords = (): string[] => {
  return Object.values(WORD_BANK).flat();
};

export const getRandomWord = (): { word: string; category: WordCategory } => {
  const categories = Object.keys(WORD_BANK) as WordCategory[];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const words = WORD_BANK[category];
  const word = words[Math.floor(Math.random() * words.length)];
  return { word, category };
};
