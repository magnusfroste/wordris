// SoundModel - Ren ljudlogik utan React
//
// Talet är inspelad röst (OmniVoice via Shipholms taltjänst). Det som sägs
// beror på bokstäverna i spelomgången och finns bara medan appen körs, så
// raderna hämtas från tjänsten och spelas upp som ljud. Ingen talsyntes i
// webbläsaren används – svarar tjänsten inte blir det tyst.

const TAL_URL = 'https://api.shipholm.com/speak';

class SoundModel {
  private enabled: boolean = false; // Ljud avstängt som default
  private audio: HTMLAudioElement | null = null;
  private url: string | null = null;
  private turn: number = 0;

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) this.stop();
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
    if (!value) this.stop();
  }

  private release(): void {
    if (this.audio) {
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.pause();
      this.audio = null;
    }
    if (this.url) {
      URL.revokeObjectURL(this.url);
      this.url = null;
    }
  }

  stop(): void {
    this.turn += 1;
    this.release();
  }

  speak(text: string): void {
    if (!this.enabled) return;
    const line = (text || '').trim();
    if (!line) return;

    this.stop();
    const mine = ++this.turn;

    fetch(TAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: line, voice: 'omni' }),
    })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((blob) => {
        if (mine !== this.turn) return;
        this.url = URL.createObjectURL(blob);
        const audio = new Audio(this.url);
        this.audio = audio;
        const done = () => {
          if (mine === this.turn) this.release();
        };
        audio.onended = done;
        audio.onerror = done;
        return audio.play().catch(done);
      })
      .catch(() => {
        // Tyst: texten syns redan i appen.
      });
  }
}

// Singleton instance
export const soundModel = new SoundModel();
export default SoundModel;
