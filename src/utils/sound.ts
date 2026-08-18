/**
 * Web Audio API synthesizer for sound effects and focus ambient audio.
 * Zero external audio files needed!
 */

export type AmbientSoundType = 'none' | 'rain' | 'whitenoise' | 'binaural';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playBeep(freq = 587.33, type: OscillatorType = 'sine', duration = 0.15) {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  playCelebration() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 'triangle', 0.35);
        }, idx * 120);
      });
    } catch {
      // ignored
    }
  }

  playPomodoroFinish() {
    try {
      const ctx = this.initCtx();
      if (!ctx) return;
      const notes = [880, 880, 1174.66];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 'sine', 0.25);
        }, idx * 180);
      });
    } catch {
      // ignored
    }
  }

  playAmbient(type: AmbientSoundType, volume = 0.2) {
    if (type === 'none') {
      this.stopAmbient();
      return;
    }
    this.stopAmbient();
    try {
      const ctx = this.initCtx();
      if (!ctx) return;

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/brown noise
          lastOut = (lastOut + 0.02 * white) / 1.02;
          output[i] = lastOut * 3.5;
        } else if (type === 'binaural') {
          output[i] = Math.sin(2 * Math.PI * 180 * (i / ctx.sampleRate)) * 0.5;
        } else {
          output[i] = white * 0.1;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 1000;

      const gain = ctx.createGain();
      gain.gain.value = volume;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
      this.ambientSource = whiteNoise;
      this.ambientGain = gain;
    } catch {
      // ignored
    }
  }

  setAmbientVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(vol, this.ctx.currentTime);
      } catch {
        // ignored
      }
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
      } catch {
        // ignored
      }
      this.ambientSource = null;
    }
  }
}

export const sounds = new SoundEngine();
