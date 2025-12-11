// SoundModel - Ren ljudlogik utan React

class SoundModel {
  private enabled: boolean = false; // Ljud avstängt som default

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  speak(text: string): void {
    if (!this.enabled) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'sv-SE';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }
}

// Singleton instance
export const soundModel = new SoundModel();
export default SoundModel;
