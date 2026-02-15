import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioEngine } from './audioEngine';

export type DrumSound = 'kick' | 'snare' | 'hihat';
export type Pattern = Record<DrumSound, boolean[]>;

const STEPS = 16;

const createEmptyPattern = (): Pattern => ({
  kick: Array(STEPS).fill(false),
  snare: Array(STEPS).fill(false),
  hihat: Array(STEPS).fill(false),
});

export function useStepSequencer() {
  const [pattern, setPattern] = useState<Pattern>(createEmptyPattern);
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize audio engine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  const toggleStep = useCallback((sound: DrumSound, step: number) => {
    setPattern((prev) => ({
      ...prev,
      [sound]: prev[sound].map((val, idx) => (idx === step ? !val : val)),
    }));
  }, []);

  const play = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    setIsPlaying(true);
    setCurrentStep(0);
    
    const stepDuration = (60 / bpm / 4) * 1000; // Duration of one 16th note in ms
    let step = 0;
    
    const tick = () => {
      setCurrentStep(step);
      
      // Play sounds for current step
      const sounds: DrumSound[] = [];
      if (pattern.kick[step]) sounds.push('kick');
      if (pattern.snare[step]) sounds.push('snare');
      if (pattern.hihat[step]) sounds.push('hihat');
      
      if (sounds.length > 0 && audioEngineRef.current) {
        audioEngineRef.current.playStep(sounds);
      }
      
      step = (step + 1) % STEPS;
    };
    
    // Play first step immediately
    tick();
    
    // Schedule subsequent steps
    intervalRef.current = window.setInterval(tick, stepDuration);
  }, [bpm, pattern]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
    
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
  }, []);

  // Update playback speed when BPM changes during playback
  useEffect(() => {
    if (isPlaying) {
      stop();
      // Small delay to ensure clean restart
      setTimeout(() => play(), 50);
    }
  }, [bpm]); // Only depend on bpm, not play/stop to avoid infinite loop

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    pattern,
    bpm,
    isPlaying,
    currentStep,
    toggleStep,
    play,
    stop,
    setBpm,
  };
}
