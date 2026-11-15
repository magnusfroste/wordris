import { describe, it, expect } from "vitest";
import { createInitialState, updateLetterPosition, spawnLetter, getTargetPositions } from "./GameModel";
import { GRID_HEIGHT, MAX_BURNED } from "@/constants/gameConstants";

const withFallingAtBottom = (letter = "Q") => {
  const s = createInitialState();
  return { ...s, bookPosition: { x: 99, y: 99 }, firePosition: { x: 99, y: 99 },
    activeLetter: { id: 1, letter, position: { x: 0, y: GRID_HEIGHT - 2 } } };
};

describe("GameModel", () => {
  it("spelet är slut när 10 bokstäver har brunnit upp", () => {
    const s = { ...withFallingAtBottom(), burnedLetters: Array(MAX_BURNED - 1).fill("A") };
    const r = updateLetterPosition(s);
    expect(MAX_BURNED).toBe(10);
    expect(r.event).toBe("gameover");
    expect(r.newState.isGameOver).toBe(true);
    expect(spawnLetter(r.newState)).toBeNull();
  });

  it("ett klart ord ger 10 poäng per bokstav", () => {
    const s = createInitialState();
    const targets = getTargetPositions(s.currentWord);
    const last = targets[targets.length - 1];
    const state = { ...s, bookPosition: { x: 99, y: 99 }, firePosition: { x: 99, y: 99 },
      matchedLetters: targets.slice(0, -1).map(({ x, y }) => ({ x, y })),
      activeLetter: { id: 1, letter: last.letter, position: { x: last.x, y: last.y - 1 } } };
    const r = updateLetterPosition(state);
    expect(r.event).toBe("completed");
    expect(r.newState.score).toBe(s.currentWord.length * 10);
    expect(r.newState.wordsCompleted).toBe(1);
  });
});
