export type DrumSound = 'kick' | 'snare' | 'hihat';

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.audioContext.destination);
  }

  playStep(sounds: DrumSound[]) {
    const now = this.audioContext.currentTime;
    sounds.forEach((sound) => {
      this.playSound(sound, now);
    });
  }

  private playSound(sound: DrumSound, startTime: number) {
    switch (sound) {
      case 'kick':
        this.playKick(startTime);
        break;
      case 'snare':
        this.playSnare(startTime);
        break;
      case 'hihat':
        this.playHiHat(startTime);
        break;
    }
  }

  private playKick(startTime: number) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    
    gain.gain.setValueAtTime(1, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + 0.5);
  }

  private playSnare(startTime: number) {
    // Noise component
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.7, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    // Tone component
    const osc = this.audioContext.createOscillator();
    const oscGain = this.audioContext.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, startTime);
    osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);
    
    oscGain.gain.setValueAtTime(0.3, startTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    
    noise.start(startTime);
    noise.stop(startTime + 0.2);
    osc.start(startTime);
    osc.stop(startTime + 0.1);
  }

  private playHiHat(startTime: number) {
    const bufferSize = this.audioContext.sampleRate * 0.05;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(0.5, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(startTime);
    noise.stop(startTime + 0.05);
  }

  stop() {
    // Clean stop - audio context continues but no new sounds
  }
}
