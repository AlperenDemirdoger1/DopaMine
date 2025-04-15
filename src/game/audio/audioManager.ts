
export type SoundEffectType = 
  | 'playerMove'
  | 'playerAttack'
  | 'enemyHit'
  | 'enemyDefeat'
  | 'playerDamage'
  | 'powerUpCollect'
  | 'coinCollect'
  | 'gemCollect'
  | 'levelUp'
  | 'achievementUnlock'
  | 'missionComplete'
  | 'gameOver'
  | 'menuSelect'
  | 'buttonClick'
  | 'skillActivate'
  | 'levelComplete'
  | 'levelStart';

export interface AudioSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  enableSound: boolean;
}

const defaultSettings: AudioSettings = {
  masterVolume: 0.8,
  sfxVolume: 1.0,
  musicVolume: 0.6,
  enableSound: true
};

let audioContext: AudioContext | null = null;
const soundBuffers: Record<string, AudioBuffer> = {};
let settings: AudioSettings = { ...defaultSettings };

export const initAudio = (): void => {
  if (audioContext) return;
  
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('Audio context initialized');
  } catch (error) {
    console.error('Web Audio API not supported:', error);
  }
};

export const loadSound = async (type: SoundEffectType, url: string): Promise<void> => {
  if (!audioContext) return;
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers[type] = audioBuffer;
  } catch (error) {
    console.error(`Error loading sound ${type}:`, error);
  }
};

export const playSound = (
  type: SoundEffectType, 
  options: { 
    volume?: number; 
    pitch?: number;
    pan?: number;
  } = {}
): void => {
  if (!audioContext || !settings.enableSound || !soundBuffers[type]) return;
  
  try {
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffers[type];
    
    const gainNode = audioContext.createGain();
    gainNode.gain.value = (options.volume ?? 1) * settings.sfxVolume * settings.masterVolume;
    
    if (options.pan && audioContext.createStereoPanner) {
      const pannerNode = audioContext.createStereoPanner();
      pannerNode.pan.value = Math.max(-1, Math.min(1, options.pan));
      source.connect(pannerNode);
      pannerNode.connect(gainNode);
    } else {
      source.connect(gainNode);
    }
    
    if (options.pitch) {
      source.playbackRate.value = options.pitch;
    }
    
    gainNode.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error(`Error playing sound ${type}:`, error);
  }
};

export const updateAudioSettings = (newSettings: Partial<AudioSettings>): void => {
  settings = { ...settings, ...newSettings };
};

export const generatePlaceholderSounds = (): void => {
  if (!audioContext) return;
  
  const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer => {
    const sampleRate = audioContext!.sampleRate;
    const buffer = audioContext!.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    
    const omega = 2 * Math.PI * frequency;
    for (let i = 0; i < buffer.length; i++) {
      if (type === 'sine') {
        data[i] = Math.sin(omega * i / sampleRate);
      } else if (type === 'square') {
        data[i] = Math.sin(omega * i / sampleRate) >= 0 ? 0.7 : -0.7;
      } else if (type === 'sawtooth') {
        data[i] = 2 * (i / sampleRate * frequency - Math.floor(0.5 + i / sampleRate * frequency));
      } else {
        data[i] = Math.random() * 2 - 1;
      }
      
      const attack = 0.01;
      const release = 0.05;
      const attackSamples = attack * sampleRate;
      const releaseSamples = release * sampleRate;
      
      if (i < attackSamples) {
        data[i] *= i / attackSamples;
      } else if (i > buffer.length - releaseSamples) {
        data[i] *= (buffer.length - i) / releaseSamples;
      }
    }
    
    return buffer;
  };
  
  soundBuffers['playerMove'] = generateTone(200, 0.1, 'sine');
  soundBuffers['playerAttack'] = generateTone(300, 0.2, 'square');
  soundBuffers['enemyHit'] = generateTone(400, 0.15, 'sawtooth');
  soundBuffers['enemyDefeat'] = generateTone(150, 0.3, 'square');
  soundBuffers['playerDamage'] = generateTone(100, 0.2, 'sawtooth');
  soundBuffers['powerUpCollect'] = generateTone(600, 0.2, 'sine');
  soundBuffers['coinCollect'] = generateTone(800, 0.1, 'sine');
  soundBuffers['gemCollect'] = generateTone(1000, 0.15, 'sine');
  soundBuffers['levelUp'] = generateTone(500, 0.5, 'sine');
  soundBuffers['achievementUnlock'] = generateTone(700, 0.4, 'sine');
  soundBuffers['missionComplete'] = generateTone(450, 0.3, 'sine');
  soundBuffers['gameOver'] = generateTone(200, 0.8, 'sawtooth');
  soundBuffers['menuSelect'] = generateTone(350, 0.1, 'sine');
  soundBuffers['buttonClick'] = generateTone(250, 0.1, 'sine');
  soundBuffers['skillActivate'] = generateTone(550, 0.3, 'square');
  soundBuffers['levelComplete'] = generateTone(650, 0.6, 'sine');
  soundBuffers['levelStart'] = generateTone(400, 0.4, 'sine');
  
  console.log('Placeholder sounds generated');
};

export const preloadGameSounds = async (): Promise<void> => {
  initAudio();
  generatePlaceholderSounds();
};
