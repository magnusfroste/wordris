export const TARGET_ROW = 8;
export const GRID_WIDTH = 7;
export const GRID_HEIGHT = 12;
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

export type SpeedLevel = 'lätt' | 'normal' | 'svår';

export const SPEED_LEVELS: Record<SpeedLevel, { fallSpeed: number; spawnInterval: number; label: string }> = {
  'lätt': { fallSpeed: 700, spawnInterval: 4000, label: 'Lätt' },
  'normal': { fallSpeed: 500, spawnInterval: 3000, label: 'Normal' },
  'svår': { fallSpeed: 300, spawnInterval: 2000, label: 'Svår' }
};