import { encodeWav } from './wavEncoder';
import type { Pattern } from './useStepSequencer';

const STEPS = 16;
const BARS = 4; // Render 4 bars

export async function renderToWav(
  pattern: Pattern,
  bpm: number
): Promise<{ blob: Blob; filename: string }> {
  const sampleRate = 44100;
  const stepDuration = (60 / bpm / 4); // Duration of one 16th note in seconds
  const totalDuration = stepDuration * STEPS * BARS;
  const totalSamples = Math.floor(totalDuration * sampleRate);
  
  // Create offline context
  const offlineContext = new OfflineAudioContext(2, totalSamples, sampleRate);
  const masterGain = offlineContext.createGain();
  masterGain.gain.value = 0.7;
  masterGain.connect(offlineContext.destination);
  
  // Render each bar
  for (let bar = 0; bar < BARS; bar++) {
    for (let step = 0; step < STEPS; step++) {
      const startTime = (bar * STEPS + step) * stepDuration;
      
      if (pattern.kick[step]) {
        renderKick(offlineContext, masterGain, startTime);
      }
      if (pattern.snare[step]) {
        renderSnare(offlineContext, masterGain, startTime);
      }
      if (pattern.hihat[step]) {
        renderHiHat(offlineContext, masterGain, startTime);
      }
    }
  }
  
  // Render to buffer
  const renderedBuffer = await offlineContext.startRendering();
  
  // Encode to WAV
  const wavBlob = encodeWav(renderedBuffer);
  
  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const filename = `thunderlab-beat-${bpm}bpm-${timestamp}.wav`;
  
  return { blob: wavBlob, filename };
}

function renderKick(
  context: OfflineAudioContext,
  destination: AudioNode,
  startTime: number
) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.5);
  
  gain.gain.setValueAtTime(1, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
  
  osc.connect(gain);
  gain.connect(destination);
  
  osc.start(startTime);
  osc.stop(startTime + 0.5);
}

function renderSnare(
  context: OfflineAudioContext,
  destination: AudioNode,
  startTime: number
) {
  // Noise component
  const bufferSize = context.sampleRate * 0.2;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  
  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  
  const noiseGain = context.createGain();
  noiseGain.gain.setValueAtTime(0.7, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
  
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);
  
  // Tone component
  const osc = context.createOscillator();
  const oscGain = context.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, startTime);
  osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.1);
  
  oscGain.gain.setValueAtTime(0.3, startTime);
  oscGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
  
  osc.connect(oscGain);
  oscGain.connect(destination);
  
  noise.start(startTime);
  noise.stop(startTime + 0.2);
  osc.start(startTime);
  osc.stop(startTime + 0.1);
}

function renderHiHat(
  context: OfflineAudioContext,
  destination: AudioNode,
  startTime: number
) {
  const bufferSize = context.sampleRate * 0.05;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const noise = context.createBufferSource();
  noise.buffer = buffer;
  
  const filter = context.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;
  
  const gain = context.createGain();
  gain.gain.setValueAtTime(0.5, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
  
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  
  noise.start(startTime);
  noise.stop(startTime + 0.05);
}
