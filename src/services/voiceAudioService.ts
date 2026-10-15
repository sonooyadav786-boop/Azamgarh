// ============================================================================
// सनातन वाणी एवं यथार्थवादी AI ऑडियो सेवा (Devotional Voice & Audio Service)
// Powered by Gemini TTS API & Browser Speech Synthesis
// ============================================================================

export interface VoiceModelOption {
  id: string;
  nameHindi: string;
  character: string;
  tone: string;
  gender: 'female' | 'male';
  idealFor: string;
  sampleText: string;
  description: string;
}

export const DEVOTIONAL_VOICE_MODELS: VoiceModelOption[] = [
  {
    id: 'Kore',
    nameHindi: 'माता जानकी / सौम्य देवी स्वर',
    character: 'सौम्य, मधुर एवं वात्सल्यमय',
    tone: 'Devotional Melodious (Female)',
    gender: 'female',
    idealFor: 'भजन, आरती, स्तुति व शांति पाठ',
    sampleText: 'श्री कृष्ण गोविन्द हरे मुरारी, हे नाथ नारायण वासुदेवा।',
    description: 'कोमल, अत्यंत मधुर और भक्तिरस से परिपूर्ण देवी स्वर।'
  },
  {
    id: 'Puck',
    nameHindi: 'ऋषि कुमार / शांत मुनि स्वर',
    character: 'शांत, ध्यानमयी व पवित्र',
    tone: 'Serene Vedic Chanting (Male)',
    gender: 'male',
    idealFor: 'वैदिक मंत्र, उपनिषद, श्लोक व जप',
    sampleText: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।',
    description: 'शांत आश्रम का पवित्र ऋषि स्वर, ध्यान और एकाग्रता हेतु सर्वोत्तम।'
  },
  {
    id: 'Charon',
    nameHindi: 'महर्षि पराशर / गंभीर शास्त्रीय स्वर',
    character: 'गंभीर, धीर एवं आधिकारिक',
    tone: 'Deep Authoritative Classical (Male)',
    gender: 'male',
    idealFor: 'विष्णु पुराण कथा, रामायण प्रसंग व इतिहास',
    sampleText: 'नमो भगवते तस्मै विष्णवे प्रभविष्णवे। यस्य कीर्तनमात्रेण सर्वपापैः प्रमुच्यते॥',
    description: 'भारी, राजसी और गूढ़ ज्ञानोपदेश देने वाला महर्षि स्वर।'
  },
  {
    id: 'Fenrir',
    nameHindi: 'वीर रस / ओजस्वी उद्घोषक स्वर',
    character: 'ओजस्वी, तेजस्वी व प्रेरक',
    tone: 'Powerful Resonant Epic (Male)',
    gender: 'male',
    idealFor: 'महाभारत युद्ध पर्व, गीता श्लोक व हनुमान चालीसा',
    sampleText: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    description: 'ऊर्जावान्, आत्मविश्वासपूर्ण और वीर रस से ओतप्रोत उद्घोषणा स्वर।'
  },
  {
    id: 'Zephyr',
    nameHindi: 'मधुर वंशी / शांत भक्त स्वर',
    character: 'निर्मल, सहज व करुणामय',
    tone: 'Gentle Devotee Melody (Female)',
    gender: 'female',
    idealFor: 'श्रीकृष्ण बाललीला, गोपी-गीत व प्रभाती',
    sampleText: 'श्री कृष्ण गोविन्द हरे मुरारी, हे नाथ नारायण वासुदेवा।',
    description: 'सरल, निष्कपट भाव से हृदय को छू लेने वाला भक्तिमय स्वर।'
  },
  {
    id: 'Aoede',
    nameHindi: 'गंधर्व स्वर / शास्त्रीय भजन व स्तवन',
    character: 'संगीतमय, सुरीला व भावपूर्ण',
    tone: 'Classical Devotional Melodic (Female)',
    gender: 'female',
    idealFor: 'संगीतबद्ध भजन, रुद्राष्टकम, मधुराष्टकम व स्तुतियां',
    sampleText: 'अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम्। हृदयां मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम्॥',
    description: 'गंधर्व गायन शैली का अत्यंत मधुर, लयबद्ध और सुरम्य भक्ति स्वर।'
  }
];

export interface VoiceSettingsState {
  useAiVoice: boolean;
  selectedVoiceId: string;
  speed: number;
  chantStyle: string;
  autoPlayNext: boolean;
  customApiKey?: string;
}

const STORAGE_KEY = 'sanatan_voice_settings_v1';

export const DEFAULT_VOICE_SETTINGS: VoiceSettingsState = {
  useAiVoice: true,
  selectedVoiceId: 'Kore',
  speed: 1.0,
  chantStyle: 'भक्तिमय संकीर्तन शैली',
  autoPlayNext: false,
  customApiKey: '',
};

export const getStoredVoiceSettings = (): VoiceSettingsState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_SETTINGS;
    return { ...DEFAULT_VOICE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_VOICE_SETTINGS;
  }
};

export const saveVoiceSettings = (settings: VoiceSettingsState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save voice settings:', e);
  }
};

export interface VoiceApiHealth {
  status: 'online' | 'fallback' | 'checking' | 'quota_exceeded';
  hasApiKey: boolean;
  isCustomKey?: boolean;
  quotaExceeded?: boolean;
  engine: string;
  message?: string;
}

export async function checkVoiceApiHealth(customApiKey?: string): Promise<VoiceApiHealth> {
  try {
    const keyToTest = customApiKey !== undefined ? customApiKey : getStoredVoiceSettings().customApiKey;
    const headers: Record<string, string> = {};
    if (keyToTest?.trim()) {
      headers['x-gemini-api-key'] = keyToTest.trim();
    }
    const res = await fetch('/api/health', { headers });
    if (res.ok) {
      const data = await res.json();
      const quotaHit = Boolean(data.quotaExceeded);
      return {
        status: quotaHit ? 'quota_exceeded' : data.hasApiKey ? 'online' : 'fallback',
        hasApiKey: Boolean(data.hasApiKey),
        isCustomKey: Boolean(data.isCustomKey),
        quotaExceeded: quotaHit,
        engine: data.engine || 'Gemini TTS (gemini-3.8-flash-lite-tts)',
        message: quotaHit
          ? 'दैनिक मुफ़्त AI कोटा पूर्ण हो चुका है। ऐप स्वतः सुस्पष्ट ब्राउज़र वाणी द्वारा भजन सुना रहा है।'
          : data.isCustomKey
            ? 'आपकी व्यक्तिगत Gemini API Key कनेक्टेड एवं सक्रिय है!'
            : data.hasApiKey 
              ? 'Gemini AI वॉइस API सक्रिय है। सजीव एवं यथार्थवादी भजन स्वर उपलब्ध हैं।'
              : 'Gemini API Key कनेक्टेड नहीं है। स्वतः ब्राउज़र स्पीच इंजन का उपयोग होगा।'
      };
    }
  } catch (err) {
    console.warn('Voice API health check failed:', err);
  }
  return {
    status: 'fallback',
    hasApiKey: false,
    engine: 'ब्राउज़र इनबिल्ट स्पीच सिंथेसाइज़र',
    message: 'स्थानीय ब्राउज़र स्पीच इंजन सक्रिय है।'
  };
}

export interface VoicePlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  isPaused: boolean;
  activeText: string | null;
  activeTitle: string | null;
}

class VoiceAudioPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private activeText: string | null = null;
  private activeTitle: string | null = null;
  private isPlaying: boolean = false;
  private isLoading: boolean = false;
  private isPaused: boolean = false;
  private listeners: Set<(state: VoicePlayerState) => void> = new Set();

  public subscribe(cb: (state: VoicePlayerState) => void) {
    this.listeners.add(cb);
    cb({
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      isPaused: this.isPaused,
      activeText: this.activeText,
      activeTitle: this.activeTitle,
    });
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({
        isPlaying: this.isPlaying,
        isLoading: this.isLoading,
        isPaused: this.isPaused,
        activeText: this.activeText,
        activeTitle: this.activeTitle,
      });
    }
  }

  public getActiveText(): string | null {
    return this.activeText;
  }

  public getActiveTitle(): string | null {
    return this.activeTitle;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsLoading(): boolean {
    return this.isLoading;
  }

  public pause() {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPlaying = false;
      this.isPaused = true;
      this.notify();
    } else if (window.speechSynthesis && this.isPlaying) {
      window.speechSynthesis.pause();
      this.isPlaying = false;
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play();
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    } else if (window.speechSynthesis && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPlaying = true;
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isLoading = false;
    this.isPaused = false;
    this.activeText = null;
    this.activeTitle = null;
    this.notify();
  }

  public async play(
    text: string, 
    overrideVoiceIdOrOptions?: string | { overrideVoiceId?: string; overrideStyle?: string; title?: string },
    legacyOverrideStyle?: string
  ) {
    if (!text || !text.trim()) return;

    let overrideVoiceId: string | undefined;
    let overrideStyle: string | undefined;
    let title: string | undefined;

    if (typeof overrideVoiceIdOrOptions === 'object') {
      overrideVoiceId = overrideVoiceIdOrOptions.overrideVoiceId;
      overrideStyle = overrideVoiceIdOrOptions.overrideStyle;
      title = overrideVoiceIdOrOptions.title;
    } else {
      overrideVoiceId = overrideVoiceIdOrOptions;
      overrideStyle = legacyOverrideStyle;
    }

    // Toggle off if same text is already playing
    if (this.isPlaying && this.activeText === text) {
      this.stop();
      return;
    }

    this.stop();
    this.activeText = text;
    this.activeTitle = title || null;
    this.isLoading = true;
    this.notify();

    const settings = getStoredVoiceSettings();
    const voiceId = overrideVoiceId || settings.selectedVoiceId;

    if (settings.useAiVoice) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (settings.customApiKey?.trim()) {
          headers['x-gemini-api-key'] = settings.customApiKey.trim();
        }

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text,
            voice: voiceId,
            style: overrideStyle || `${settings.chantStyle}, peaceful Indian Vedic devotional chanting with clear pronunciation`,
            speed: settings.speed,
            customApiKey: settings.customApiKey?.trim() || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.fallbackToBrowser || !data.success) {
            console.warn('AI Voice requested browser fallback:', data.message || data.error);
            this.fallbackBrowserSpeech(text, settings);
            return;
          }

          if (data.success && data.audioData) {
            const audioSrc = `data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`;
            const audio = new Audio(audioSrc);
            audio.playbackRate = settings.speed;

            audio.onplay = () => {
              this.isLoading = false;
              this.isPlaying = true;
              this.isPaused = false;
              this.notify();
            };

            audio.onended = () => {
              this.stop();
            };

            audio.onerror = () => {
              console.warn('Audio playback error, falling back to browser speech synthesis');
              this.fallbackBrowserSpeech(text, settings);
            };

            this.currentAudio = audio;
            await audio.play();
            return;
          }
        }
      } catch (err) {
        console.warn('Error fetching AI TTS audio, falling back to browser:', err);
      }
    }

    // Fallback to browser speech synthesis
    this.fallbackBrowserSpeech(text, settings);
  }

  private fallbackBrowserSpeech(text: string, settings: VoiceSettingsState) {
    if (!('speechSynthesis' in window)) {
      this.isLoading = false;
      this.isPlaying = false;
      this.activeText = null;
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';

    // Pick best Hindi / Indian voice if available in browser
    try {
      const voices = window.speechSynthesis.getVoices();
      const isFemale = ['Kore', 'Zephyr', 'Aoede'].includes(settings.selectedVoiceId);
      
      const hindiVoice = 
        voices.find(v => (v.lang === 'hi-IN' || v.lang.startsWith('hi')) && (isFemale ? (v.name.includes('Female') || v.name.includes('Kalpana') || v.name.includes('Lekha')) : v.name.includes('Male'))) ||
        voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi')) ||
        voices.find(v => v.lang.includes('IN')) ||
        voices.find(v => v.name.toLowerCase().includes('hindi'));

      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }
    } catch {
      // ignore
    }

    const isFemale = ['Kore', 'Zephyr', 'Aoede'].includes(settings.selectedVoiceId);
    utterance.rate = Math.max(0.7, Math.min(1.2, settings.speed * 0.9));
    utterance.pitch = isFemale ? 1.15 : (settings.selectedVoiceId === 'Charon' ? 0.8 : 0.95);

    utterance.onstart = () => {
      this.isLoading = false;
      this.isPlaying = true;
      this.notify();
    };

    utterance.onend = () => {
      this.stop();
    };

    utterance.onerror = () => {
      this.stop();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const globalVoiceAudioPlayer = new VoiceAudioPlayer();
