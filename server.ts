import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory audio cache to provide near-instant playback for repeated bhajans/mantras
const audioCache = new Map<string, { audioData: string; mimeType: string }>();

// Available Voice Models (Gemini Prebuilt Voices tailored for Bhajans/Mantras/Kathas)
export const DEVOTIONAL_VOICE_MODELS = [
  {
    id: 'Kore',
    nameHindi: 'माता जानकी / सौम्य देवी स्वर',
    character: 'सौम्य, मधुर एवं वात्सल्यमय',
    tone: 'Devotional Melodious (Female)',
    gender: 'female',
    idealFor: 'भजन, आरती, स्तुति व शांति पाठ',
    sampleText: 'ॐ नमो भगवते वासुदेवाय। हरे राम हरे राम राम राम हरे हरे।',
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

// Helper to clean quotes, whitespace, or accidental prefix assignments from manual API keys
function sanitizeApiKey(rawKey: string): string {
  if (!rawKey) return '';
  let cleaned = rawKey.trim();
  cleaned = cleaned.replace(/^["'`]+|["'`]+$/g, '').trim();
  const matchAssignment = cleaned.match(/(?:API_KEY|GEMINI_API_KEY|key)\s*[:=]\s*["']?([A-Za-z0-9_-]+)["']?/i);
  if (matchAssignment && matchAssignment[1]) {
    return matchAssignment[1].trim();
  }
  const matchAiKey = cleaned.match(/(AIzaSy[A-Za-z0-9_-]{25,50})/);
  if (matchAiKey && matchAiKey[1]) {
    return matchAiKey[1].trim();
  }
  return cleaned;
}

// Track quota exhaustion state to prevent spamming Google Gemini API when 429 is reached
let quotaExceededUntil = 0;

function isQuotaExceeded(): boolean {
  return Date.now() < quotaExceededUntil;
}

// GET /api/health - Voice API status and health check
app.get('/api/health', (req: Request, res: Response) => {
  const customKey = sanitizeApiKey((req.headers['x-gemini-api-key'] as string) || '');
  const effectiveKey = customKey || process.env.GEMINI_API_KEY;
  const isCustom = Boolean(customKey);
  const quotaHit = !isCustom && isQuotaExceeded();

  res.json({
    status: quotaHit ? 'quota_exceeded' : effectiveKey ? 'ok' : 'fallback',
    hasApiKey: Boolean(effectiveKey),
    isCustomKey: isCustom,
    quotaExceeded: quotaHit,
    engine: quotaHit 
      ? 'ब्राउज़र वैदिक वाणी सिंथेसाइज़र (AI कोटा पूर्ण होने पर सक्रिय)' 
      : isCustom
      ? 'कस्टम Gemini API कुंजी (सक्रिय)'
      : 'Gemini TTS (gemini-3.8-flash-lite-tts)',
    voicesCount: DEVOTIONAL_VOICE_MODELS.length,
    timestamp: new Date().toISOString()
  });
});

// GET /api/voices - List all available realistic voice models
app.get('/api/voices', (req: Request, res: Response) => {
  const customKey = sanitizeApiKey((req.headers['x-gemini-api-key'] as string) || '');
  const effectiveKey = customKey || process.env.GEMINI_API_KEY;
  const isCustom = Boolean(customKey);

  res.json({
    success: true,
    voices: DEVOTIONAL_VOICE_MODELS,
    defaultVoice: 'Kore',
    hasApiKey: Boolean(effectiveKey),
    isCustomKey: isCustom,
    quotaExceeded: !isCustom && isQuotaExceeded()
  });
});

// POST /api/tts - Synthesize realistic speech using Gemini TTS API
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'Kore', style, speed = 1.0, customApiKey } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ success: false, error: 'Text is required for audio synthesis.' });
      return;
    }

    const trimmedText = text.trim();
    // Clean text to avoid overly long prompts (limit to ~1200 characters for snappy response)
    const synthesisText = trimmedText.length > 1200 
      ? trimmedText.substring(0, 1150) + '...' 
      : trimmedText;

    const cacheKey = `${voice}_${style || 'default'}_${synthesisText}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      res.json({
        success: true,
        cached: true,
        audioData: cached.audioData,
        mimeType: cached.mimeType,
        voiceUsed: voice
      });
      return;
    }

    // Check for user-provided manual key or system key
    const customKey = sanitizeApiKey(((req.headers['x-gemini-api-key'] as string) || customApiKey || ''));
    const apiKey = customKey || process.env.GEMINI_API_KEY;

    // If using system key and system quota was already hit, fallback to browser voice immediately
    if (!customKey && isQuotaExceeded()) {
      res.json({
        success: false,
        quotaExceeded: true,
        fallbackToBrowser: true,
        message: 'Gemini TTS daily quota limit reached on free tier. Using browser devotional speech synthesis.'
      });
      return;
    }

    if (!apiKey) {
      res.json({
        success: false,
        fallbackToBrowser: true,
        error: 'No GEMINI_API_KEY available. Falling back to browser speech synthesis.'
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const voicePromptStyle = style || 
      'Spiritual, melodious, calm, devotional, authentic Indian Vedic/Hindi chanting style with clear pronunciation and peaceful cadence.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
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
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr', 'Aoede'].includes(voice) ? voice : 'Kore' 
            }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';

    if (!base64Audio) {
      res.json({
        success: false,
        fallbackToBrowser: true,
        error: 'No audio returned from Gemini TTS model. Falling back to browser.'
      });
      return;
    }

    // Cache the result (limit cache size to 100 entries to prevent memory bloat)
    if (audioCache.size > 100) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, { audioData: base64Audio, mimeType });

    res.json({
      success: true,
      audioData: base64Audio,
      mimeType,
      voiceUsed: voice,
      isCustomKey: Boolean(customKey)
    });
  } catch (error: any) {
    const errorMsg = String(error?.message || error || '');
    const isRateLimitOrQuota = 
      error?.status === 429 || 
      error?.code === 429 || 
      errorMsg.includes('429') || 
      errorMsg.includes('RESOURCE_EXHAUSTED') || 
      errorMsg.includes('quota') ||
      errorMsg.includes('Quota exceeded');

    const customKey = ((req.headers['x-gemini-api-key'] as string) || req.body?.customApiKey || '')?.trim();

    if (isRateLimitOrQuota) {
      if (!customKey) {
        // Cooldown system key for 15 minutes before retrying
        quotaExceededUntil = Date.now() + 15 * 60 * 1000;
      }
      console.warn('Gemini TTS quota exceeded. Instructing client to seamlessly use browser speech synthesis.');
      res.json({
        success: false,
        quotaExceeded: true,
        fallbackToBrowser: true,
        message: customKey 
          ? 'आपकी व्यक्तिगत Gemini API Key का मुफ़्त कोटा समाप्त हो गया है। सुस्पष्ट ब्राउज़र वाणी द्वारा भजन जारी रहेगा।'
          : 'Gemini TTS daily quota reached. Seamlessly playing via browser devotional voice.'
      });
      return;
    }

    console.warn('TTS synthesis warning:', errorMsg);
    res.json({
      success: false,
      fallbackToBrowser: true,
      error: error?.message || 'Failed to synthesize speech'
    });
  }
});

// Mount Vite middleware for dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
