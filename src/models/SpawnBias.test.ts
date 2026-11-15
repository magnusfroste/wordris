import { describe, it, expect } from "vitest";
import { createInitialState, spawnLetter, getRemainingWordLetters } from "@/models/GameModel";

describe("bokstavsbias i Wordris", () => {
  it("tre av fyra bokstäver hör till ordet", () => {
    const base = createInitialState();
    const state = {
      ...base,
      currentWord: "KATT",
      matchedLetters: [],
      burnedLetters: [],
    };

    let inWord = 0;
    const runs = 800;
    for (let i = 0; i < runs; i++) {
      const next = spawnLetter({ ...state, activeLetter: null });
      if (!next?.activeLetter) throw new Error("ingen bokstav");
      if (state.currentWord.includes(next.activeLetter.letter)) inWord++;
    }
    // 75 % bias → förväntat ~600 av 800; tillåt statistisk spridning.
    expect(inWord / runs).toBeGreaterThan(0.6);
  });

  it("matchade bokstäver räknas bort från resterande", () => {
    const base = createInitialState();
    const state = {
      ...base,
      currentWord: "KATT",
      matchedLetters: [{ letter: "K", x: 0, y: 5 }],
    };
    expect(getRemainingWordLetters(state).sort()).toEqual(["A", "T", "T"]);
  });

  it("brända bokstäver spawnas inte", () => {
    const base = createInitialState();
    const state = {
      ...base,
      currentWord: "Ö",
      matchedLetters: [],
      burnedLetters: ["Ö"],
    };
    for (let i = 0; i < 300; i++) {
      const next = spawnLetter({ ...state, activeLetter: null });
      expect(next?.activeLetter?.letter).not.toBe("Ö");
    }
  });
});