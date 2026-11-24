// Skolappar's usage snippet (kotten.js, loaded in index.html) counts anonymous events.
// Optional chaining keeps the app working when the script is not there.
declare global {
  interface Window {
    skolappar?: { event: (name: string, value?: number) => void };
  }
}

export const report = (name: 'round_start' | 'round_done' | 'level' | 'hint' | 'sound_off', value?: number) =>
  window.skolappar?.event(name, value);
