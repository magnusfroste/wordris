export interface Position {
  x: number;
  y: number;
}

export interface ActiveLetter {
  id: number;
  letter: string;
  position: Position;
}

export interface PlacedLetter {
  letter: string;
  position: Position;
}

export interface GameState {
  activeLetter: ActiveLetter | null;
  placedLetters: PlacedLetter[];
}

export type Direction = "left" | "right" | "up" | "down";