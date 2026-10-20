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

export function sanitizeApiKey(rawKey: string): string {
  if (!rawKey) return '';
  let cleaned = rawKey.trim();
  // Strip surrounding quotes
  cleaned = cleaned.replace(/^["'`]+|["'`]+$/g, '').trim();
  // Extract key if user pasted 'GEMINI_API_KEY=...' or 'API_KEY=...' or 'key=...'
  const matchAssignment = cleaned.match(/(?:API_KEY|GEMINI_API_KEY|key)\s*[:=]\s*["']?([A-Za-z0-9_-]+)["']?/i);
  if (matchAssignment && matchAssignment[1]) {
    return matchAssignment[1].trim();
  }
  // Extract AIzaSy token if embedded in text or URL
  const matchAiKey = cleaned.match(/(AIzaSy[A-Za-z0-9_-]{25,50})/);
  if (matchAiKey && matchAiKey[1]) {
    return matchAiKey[1].trim();
  }
  return cleaned;
}

export interface ApiKeyVerificationResult {
  valid: boolean;
  status: 'valid' | 'invalid_key' | 'quota_exceeded' | 'network_error';
  message: string;
  modelsCount?: number;
}

export async function verifyGeminiApiKey(rawKey: string): Promise<ApiKeyVerificationResult> {
  const key = sanitizeApiKey(rawKey);
  if (!key) {
    return {
      valid: false,
      status: 'invalid_key',
      message: 'कृपया पहले अपनी Gemini API Key दर्ज करें।'
    };
  }

  // 1. Direct validation against Google Generative Language API
  // Supported across all origins (local dev, preview, GitHub Pages, custom domain)
  try {
    const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
    const res = await fetch(googleUrl, { method: 'GET' });

    if (res.ok) {
      const data = await res.json();
      const count = Array.isArray(data?.models) ? data.models.length : 0;
      return {
        valid: true,
        status: 'valid',
        modelsCount: count,
        message: 'सफलता! आपकी Gemini API Key प्रमाणित हो गई है और AI वाणी सक्रिय है।'
      };
    }

    let errorDetail = '';
    try {
      const errJson = await res.json();
      errorDetail = errJson?.error?.message || '';
    } catch {
      // ignore
    }

    if (res.status === 429) {
      return {
        valid: false,
        status: 'quota_exceeded',
        message: 'इस API Key का दैनिक मुफ़्त कोटा पूरा हो गया है (429 Rate Limit)। कृपया नई कुंजी का उपयोग करें।'
      };
    }

    if (res.status === 400 || res.status === 403) {
      const lower = errorDetail.toLowerCase();
      if (lower.includes('key not valid') || lower.includes('api_key_invalid') || lower.includes('invalid api key')) {
        return {
          valid: false,
          status: 'invalid_key',
          message: 'अमान्य API Key (Invalid Key)। कृपया Google AI Studio (aistudio.google.com/apikey) से सही कुंजी कॉपी करें।'
        };
      }
      return {
        valid: false,
        status: 'invalid_key',
        message: errorDetail ? `Google API संदेश: ${errorDetail}` : 'कुंजी अमान्य है। कृपया सुनिश्चित करें कि यह सही Google Gemini API Key है।'
      };
    }
  } catch (directErr) {
    console.warn('Direct Google API key verification fetch error, attempting server proxy fallback:', directErr);
  }

  // 2. Server proxy fallback (/api/health) if running in fullstack Node.js environment
  try {
    const res = await fetch('/api/health', {
      headers: { 'x-gemini-api-key': key }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.quotaExceeded) {
        return {
          valid: false,
          status: 'quota_exceeded',
          message: 'इस कुंजी का दैनिक कोटा पूरा हो गया है।'
        };
      }
      if (data.hasApiKey) {
        return {
          valid: true,
          status: 'valid',
          message: 'सफलता! API Key स्थानीय सर्वर से प्रमाणित हो गई है।'
        };
      }
    }
  } catch (serverErr) {
    // server unavailable (e.g. GitHub Pages or static host)
  }

  // 3. Fallback format check: Google AI Studio keys start with 'AIzaSy' and are 39 chars
  if (/^AIzaSy[A-Za-z0-9_-]{33}$/.test(key)) {
    return {
      valid: true,
      status: 'valid',
      message: 'कुंजी का प्रारूप सही है (AIzaSy...)। कुंजी सहेज ली गई है!'
    };
  }

  return {
    valid: false,
    status: 'invalid_key',
    message: 'कुंजी सत्यापित नहीं हो सकी। कृपया सुनिश्चित करें कि आपने पूरी Google AI Studio Gemini API Key पेस्ट की है।'
  };
}

export async function checkVoiceApiHealth(customApiKey?: string): Promise<VoiceApiHealth> {
  const settings = getStoredVoiceSettings();
  const rawKey = customApiKey !== undefined ? customApiKey : settings.customApiKey;
  const keyToTest = sanitizeApiKey(rawKey || '');

  // If a custom key is provided or stored, test directly against Google API first
  if (keyToTest) {
    try {
      const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(keyToTest)}`;
      const res = await fetch(googleUrl);
      if (res.ok) {
        return {
          status: 'online',
          hasApiKey: true,
          isCustomKey: true,
          quotaExceeded: false,
          engine: 'Gemini TTS (आपकी व्यक्तिगत Gemini API Key सक्रिय)',
          message: 'आपकी व्यक्तिगत Gemini API Key कनेक्टेड एवं सक्रिय है!'
        };
      } else if (res.status === 429) {
        return {
          status: 'quota_exceeded',
          hasApiKey: true,
          isCustomKey: true,
          quotaExceeded: true,
          engine: 'ब्राउज़र इनबिल्ट स्पीच सिंथेसाइज़र (कोटा पूर्ण)',
          message: 'इस कुंजी का दैनिक मुफ़्त कोटा पूरा हो गया है।'
        };
      } else if (res.status === 400 || res.status === 403) {
        return {
          status: 'fallback',
          hasApiKey: false,
          isCustomKey: true,
          engine: 'ब्राउज़र इनबिल्ट स्पीच सिंथेसाइज़र',
          message: 'कुंजी सत्यापित नहीं हो सकी। कृपया सही Gemini API Key दर्ज करें।'
        };
      }
    } catch {
      // offline or network hiccup; if key matches standard pattern, treat as online
      if (/^AIzaSy[A-Za-z0-9_-]{33}$/.test(keyToTest)) {
        return {
          status: 'online',
          hasApiKey: true,
          isCustomKey: true,
          quotaExceeded: false,
          engine: 'Gemini TTS (सक्रिय)',
          message: 'आपकी व्यक्तिगत Gemini API Key सहेजी गई है!'
        };
      }
    }
  }

  // Fallback to server /api/health if available
  try {
    const headers: Record<string, string> = {};
    if (keyToTest) {
      headers['x-gemini-api-key'] = keyToTest;
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
    // server unreachable (e.g. GitHub Pages static deployment)
  }

  // If a validly-formatted key was stored, remain online even on static deploy
  if (keyToTest && /^AIzaSy[A-Za-z0-9_-]{33}$/.test(keyToTest)) {
    return {
      status: 'online',
      hasApiKey: true,
      isCustomKey: true,
      engine: 'Gemini TTS (सक्रिय)',
      message: 'आपकी व्यक्तिगत Gemini API Key सक्रिय है!'
    };
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
      let audioBase64: string | null = null;
      let audioMimeType: string = 'audio/wav';
      const cleanCustomKey = sanitizeApiKey(settings.customApiKey || '');

      // 1. Try server endpoint /api/tts first
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (cleanCustomKey) {
          headers['x-gemini-api-key'] = cleanCustomKey;
        }

        const response = await fetch('/api/tts', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            text,
            voice: voiceId,
            style: overrideStyle || `${settings.chantStyle}, peaceful Indian Vedic devotional chanting with clear pronunciation`,
            speed: settings.speed,
            customApiKey: cleanCustomKey || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.audioData) {
            audioBase64 = data.audioData;
            audioMimeType = data.mimeType || 'audio/wav';
          }
        }
      } catch (err) {
        // server unavailable (e.g. GitHub Pages static deployment)
      }

      // 2. Direct client-side Gemini TTS synthesis if server was unavailable and customApiKey is available
      if (!audioBase64 && cleanCustomKey) {
        try {
          const trimmedText = text.trim();
          const synthesisText = trimmedText.length > 1200 
            ? trimmedText.substring(0, 1150) + '...' 
            : trimmedText;

          const voicePromptStyle = overrideStyle || 
            `${settings.chantStyle}, Spiritual, melodious, calm, devotional, authentic Indian Vedic/Hindi chanting style with clear pronunciation and peaceful cadence.`;

          const validVoiceName = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Aoede'].includes(voiceId) 
            ? voiceId 
            : 'Kore';

          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-lite-tts:generateContent?key=${encodeURIComponent(cleanCustomKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [
                      {
                        text: synthesisText,
                        speechMetadata: {
                          style: voicePromptStyle
                        }
                      }
                    ]
                  }
                ],
                generationConfig: {
                  responseModalities: ['AUDIO'],
                  speechConfig: {
                    voiceConfig: {
                      prebuiltVoiceConfig: { 
                        voiceName: validVoiceName 
                      }
                    }
                  }
                }
              })
            }
          );

          if (directRes.ok) {
            const resultData = await directRes.json();
            const candidatePart = resultData?.candidates?.[0]?.content?.parts?.[0]?.inlineData;
            if (candidatePart?.data) {
              audioBase64 = candidatePart.data;
              audioMimeType = candidatePart.mimeType || 'audio/wav';
            }
          }
        } catch (clientErr) {
          console.warn('Direct client-side Gemini TTS synthesis error:', clientErr);
        }
      }

      // 3. Play audio if generated successfully
      if (audioBase64) {
        try {
          const audioSrc = `data:${audioMimeType};base64,${audioBase64}`;
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
        } catch (playErr) {
          console.warn('Audio play failed:', playErr);
        }
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
