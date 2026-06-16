// Guitar Pluck Sound Synthesizer using Web Audio API

let audioCtx = null;
let masterGain = null;

// Lazily initialize the Audio Context on first user interaction
export function initAudio() {
  if (audioCtx) return audioCtx;

  // Support both standard and prefixed AudioContext
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  // Create a master gain node for volume control
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.6; // Default master volume
  masterGain.connect(audioCtx.destination);

  return audioCtx;
}

// Resume AudioContext if suspended (browser autoplay policy)
async function ensureAudioActive() {
  const ctx = initAudio();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
}

// Generates a short white noise buffer for the pluck strike transient
function createNoiseBuffer(ctx) {
  const bufferSize = ctx.sampleRate * 0.015; // 15ms duration
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Plays a single note synthesized to sound like a guitar pluck.
 * @param {number} midiNote - MIDI note number (e.g. 60 for middle C).
 * @param {number} delayMs - Delay before starting the note in milliseconds.
 * @param {number} volume - Individual note velocity/volume (0.0 to 1.0).
 */
export async function playNote(midiNote, delayMs = 0, volume = 0.5) {
  const ctx = await ensureAudioActive();
  const startTime = ctx.currentTime + (delayMs / 1000);

  // Convert MIDI note to frequency
  const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

  // 1. Create Nodes
  // Main body oscillator (triangle wave)
  const oscBody = ctx.createOscillator();
  oscBody.type = 'triangle';
  oscBody.frequency.setValueAtTime(frequency, startTime);

  // Overtone oscillator (sine wave at 2x frequency for string brightness)
  const oscBright = ctx.createOscillator();
  oscBright.type = 'sine';
  oscBright.frequency.setValueAtTime(frequency * 2, startTime);

  // Transient noise node for the physical pluck contact sound
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = createNoiseBuffer(ctx);

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1000, startTime);
  noiseFilter.Q.setValueAtTime(3, startTime);

  // Lowpass filter to simulate string damping over time
  const lowpassFilter = ctx.createBiquadFilter();
  lowpassFilter.type = 'lowpass';
  
  // Envelope gain node for volume control
  const gainNode = ctx.createGain();

  // 2. Audio Routing
  oscBody.connect(lowpassFilter);
  
  // Overtone goes to lowpass filter at a lower volume
  const brightGain = ctx.createGain();
  brightGain.gain.setValueAtTime(0.15, startTime);
  oscBright.connect(brightGain);
  brightGain.connect(lowpassFilter);

  // Noise transient bypasses the lowpass but has its own fast decay
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.25 * volume, startTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.015);
  
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  // Main signal routing
  lowpassFilter.connect(gainNode);
  gainNode.connect(masterGain);

  // 3. Envelopes and Parameter Scheduling

  // Damping filter envelope: starts bright, quickly mellows out
  lowpassFilter.frequency.setValueAtTime(4000, startTime);
  lowpassFilter.frequency.exponentialRampToValueAtTime(frequency * 3.5, startTime + 0.12);
  lowpassFilter.frequency.exponentialRampToValueAtTime(frequency * 1.5, startTime + 0.8);

  // Volume Envelope (ADSR tailored for a pluck string)
  const attack = 0.003; // Almost instantaneous string pluck
  const decay = 0.12;  // Decay to sustain level
  const sustain = 0.35; // Ringing level
  const duration = 1.6; // Total note ring time
  const release = 0.4;  // Mute time

  gainNode.gain.setValueAtTime(0, startTime);
  // Attack
  gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + attack);
  // Decay
  gainNode.gain.exponentialRampToValueAtTime(volume * sustain, startTime + attack + decay);
  // Ringing & Release
  gainNode.gain.setValueAtTime(volume * sustain, startTime + duration - release);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  // 4. Start and Stop
  oscBody.start(startTime);
  oscBright.start(startTime);
  noiseSource.start(startTime);

  oscBody.stop(startTime + duration);
  oscBright.stop(startTime + duration);
  noiseSource.stop(startTime + 0.02);
}

/**
 * Plays an array of MIDI notes sequentially (strummed).
 * @param {Array<number>} midiNotes - Array of MIDI note numbers. Muted strings (-1) are skipped.
 * @param {number} strumSpeedMs - Delay between string plucks in milliseconds (e.g. 50ms).
 * @param {number} volume - Volume of the chord strum (0.0 to 1.0).
 */
export async function playChord(midiNotes, strumSpeedMs = 50, volume = 0.5) {
  // Strumming direction: low strings to high strings
  // Standard chord array is usually [string6, string5, string4, string3, string2, string1]
  // We play non-muted strings (-1) with a staggering delay.
  let delayCount = 0;
  for (let i = 0; i < midiNotes.length; i++) {
    const note = midiNotes[i];
    if (note !== -1) {
      playNote(note, delayCount * strumSpeedMs, volume);
      delayCount++;
    }
  }
}

/**
 * Sets the master volume.
 * @param {number} volume - Master volume level (0.0 to 1.0).
 */
export function setMasterVolume(volume) {
  if (masterGain) {
    masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
}
