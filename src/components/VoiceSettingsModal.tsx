import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Mic, 
  Radio, 
  Play, 
  Square, 
  Check, 
  Sliders, 
  Flame, 
  Music, 
  Scroll, 
  Info,
  Server,
  RefreshCw,
  Cpu,
  Layers,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { 
  DEVOTIONAL_VOICE_MODELS, 
  VoiceModelOption, 
  VoiceSettingsState, 
  VoiceApiHealth,
  getStoredVoiceSettings, 
  saveVoiceSettings, 
  checkVoiceApiHealth,
  globalVoiceAudioPlayer 
} from '../services/voiceAudioService';

interface VoiceSettingsModalProps {
  onClose: () => void;
}

const QUICK_BHAJAN_SAMPLES = [
  { label: 'हरि नाम संकीर्तन', text: 'श्री कृष्ण गोविन्द हरे मुरारी, हे नाथ नारायण वासुदेवा।' },
  { label: 'महामृत्युंजय मंत्र', text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्य pushीय मामृतात्॥' },
  { label: 'विष्णु स्तुति', text: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।' },
  { label: 'महाभारत गीता श्लोक', text: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥' },
  { label: 'मधुराष्टकम्', text: 'अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम्। मधुराधिपतेरखिलं मधुरम्॥' }
];

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<VoiceSettingsState>(getStoredVoiceSettings());
  const [activePreviewVoice, setActivePreviewVoice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<VoiceApiHealth>({
    status: 'checking',
    hasApiKey: false,
    engine: 'Gemini TTS Engine'
  });
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const [customTestText, setCustomTestText] = useState('श्री कृष्ण गोविन्द हरे मुरारी, हे नाथ नारायण वासुदेवा।');

  // Manual API Key management state
  const [apiKeyInput, setApiKeyInput] = useState(settings.customApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestFeedback, setKeyTestFeedback] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = globalVoiceAudioPlayer.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsLoading(state.isLoading);
      setActiveText(state.activeText);
      if (!state.isPlaying && !state.isLoading) {
        setActivePreviewVoice(null);
      }
    });

    handleCheckHealth();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleCheckHealth = async (overrideKey?: string) => {
    setIsCheckingApi(true);
    const health = await checkVoiceApiHealth(overrideKey !== undefined ? overrideKey : settings.customApiKey);
    setApiHealth(health);
    setIsCheckingApi(false);
  };

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    const updated = { ...settings, customApiKey: trimmed };
    setSettings(updated);
    saveVoiceSettings(updated);
    triggerToast(trimmed ? '🔑 आपकी व्यक्तिगत API Key सुरक्षित हो गई!' : 'API Key हटाई गई');
    handleCheckHealth(trimmed);
  };

  const handleClearApiKey = () => {
    setApiKeyInput('');
    const updated = { ...settings, customApiKey: '' };
    setSettings(updated);
    saveVoiceSettings(updated);
    setKeyTestFeedback(null);
    triggerToast('कुंजी हटा दी गई');
    handleCheckHealth('');
  };

  const handleTestKey = async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setKeyTestFeedback({
        success: false,
        message: 'कृपया पहले अपनी Gemini API Key दर्ज करें।'
      });
      return;
    }
    setIsTestingKey(true);
    setKeyTestFeedback(null);
    try {
      const health = await checkVoiceApiHealth(trimmed);
      setApiHealth(health);
      if (health.hasApiKey && health.status !== 'quota_exceeded') {
        setKeyTestFeedback({
          success: true,
          message: 'सफलता! API Key सक्रिय है और Gemini AI TTS इंजन से कनेक्टेड है।'
        });
        triggerToast('✅ API Key सफलता से सत्यापित हुई!');
      } else if (health.status === 'quota_exceeded') {
        setKeyTestFeedback({
          success: false,
          message: 'इस कुंजी का दैनिक मुफ़्त कोटा पूरा हो गया है। कृपया नई कुंजी उपयोग करें।'
        });
      } else {
        setKeyTestFeedback({
          success: false,
          message: 'कुंजी सत्यापित नहीं हो सकी। कृपया सुनिश्चित करें कि यह सही Google AI Studio Gemini API Key है।'
        });
      }
    } catch (err: any) {
      setKeyTestFeedback({
        success: false,
        message: 'जांच विफल: ' + (err?.message || 'त्रुटि हुई')
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectVoice = (voiceId: string) => {
    const updated = { ...settings, selectedVoiceId: voiceId };
    setSettings(updated);
    saveVoiceSettings(updated);
    triggerToast(`🎙️ ${voiceId} वॉइस मॉडल चयनित हुआ!`);
  };

  const handleToggleAiVoice = (useAi: boolean) => {
    const updated = { ...settings, useAiVoice: useAi };
    setSettings(updated);
    saveVoiceSettings(updated);
    triggerToast(useAi ? '🌟 यथार्थवादी Gemini AI वाणी सक्रिय!' : '🔊 सिस्टम ब्राउज़र वाणी सक्रिय!');
  };

  const handleSpeedChange = (speed: number) => {
    const updated = { ...settings, speed };
    setSettings(updated);
    saveVoiceSettings(updated);
  };

  const handleStyleChange = (chantStyle: string) => {
    const updated = { ...settings, chantStyle };
    setSettings(updated);
    saveVoiceSettings(updated);
    triggerToast(`✨ पाठ शैली: ${chantStyle}`);
  };

  const handlePreviewVoice = async (voice: VoiceModelOption) => {
    if (isPlaying && activePreviewVoice === voice.id) {
      globalVoiceAudioPlayer.stop();
      setActivePreviewVoice(null);
      return;
    }

    setActivePreviewVoice(voice.id);
    await globalVoiceAudioPlayer.play(voice.sampleText, {
      overrideVoiceId: voice.id,
      title: `${voice.nameHindi} (नमूना)`
    });
  };

  const handlePlayCustomBhajan = async () => {
    if (isPlaying && activeText === customTestText) {
      globalVoiceAudioPlayer.stop();
      return;
    }
    await globalVoiceAudioPlayer.play(customTestText, {
      overrideVoiceId: settings.selectedVoiceId,
      title: 'भजन परीक्षण'
    });
  };

  const selectedVoiceObj = DEVOTIONAL_VOICE_MODELS.find((v) => v.id === settings.selectedVoiceId) || DEVOTIONAL_VOICE_MODELS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => {
          globalVoiceAudioPlayer.stop();
          onClose();
        }}
      />

      <div className="relative bg-[#fffdf7] w-full max-w-3xl rounded-2xl shadow-2xl border-2 border-amber-600/40 overflow-hidden my-auto max-h-[95vh] flex flex-col z-10">
        
        {/* Header */}
        <header className="bg-gradient-to-r from-amber-950 via-stone-900 to-red-950 text-white p-4 flex items-center justify-between border-b border-amber-400/30 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-inner">
              <Mic className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-lg sm:text-xl text-amber-100 flex items-center gap-2">
                  <span>🎙️ यथार्थवादी AI वाणी व भजन वॉइस सेटिंग्स</span>
                </h3>
                <span className="text-[10px] bg-red-800 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline border border-amber-400/30">
                  Gemini TTS Engine
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-serif">
                भजन, आरती, मंत्र, श्लोक व पुराण कथाओं के लिए दिव्य व सजीव स्वर मॉडल चुनें
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              globalVoiceAudioPlayer.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-stone-800/80 hover:bg-red-900 text-stone-200 hover:text-white transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* ======================================================== */}
          {/* 1. API सुविधा एवं स्थिति (API Facility & Status Card) */}
          {/* ======================================================== */}
          <div className="bg-gradient-to-br from-amber-950/5 via-amber-50 to-orange-50/40 border-2 border-amber-400/60 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-600 text-white shadow-xs">
                  <Server className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-sm font-black text-amber-950 font-serif flex items-center gap-1.5">
                    <span>🌟 यथार्थवादी AI वॉइस API सुविधा (Gemini TTS)</span>
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    सर्वर-साइड न्यूरल स्पीच सिंथेसाइज़र द्वारा सजीव, भक्तिमय और मानवीय उच्चारण
                  </p>
                </div>
              </div>

              {/* API Ping & Status Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  apiHealth.status === 'quota_exceeded'
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : apiHealth.hasApiKey
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-stone-100 text-stone-800 border-stone-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    apiHealth.status === 'quota_exceeded'
                      ? 'bg-amber-600'
                      : apiHealth.hasApiKey
                      ? 'bg-emerald-600 animate-pulse'
                      : 'bg-stone-500'
                  }`} />
                  <span>
                    {apiHealth.status === 'quota_exceeded' 
                      ? 'ब्राउज़र वाणी सक्रिय (AI कोटा पूर्ण)' 
                      : apiHealth.hasApiKey 
                      ? 'AI API कनेक्टेड (सक्रिय)' 
                      : 'ब्राउज़र वाणी इंजन'}
                  </span>
                </span>

                <button
                  onClick={() => handleCheckHealth()}
                  disabled={isCheckingApi}
                  className="p-1.5 rounded-lg bg-white border border-amber-300 hover:bg-amber-100/80 text-stone-700 transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                  title="API स्थिति पुनः जांचें"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApi ? 'animate-spin text-amber-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Quota Notice Banner if free tier quota exceeded */}
            {apiHealth.status === 'quota_exceeded' && (
              <div className="bg-amber-100/90 border border-amber-300 rounded-lg p-2.5 text-xs text-amber-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>दैनिक मुफ़्त AI कोटा पूर्ण:</strong> Google Gemini API का मुफ़्त कोटा पूरा हो गया है। ऐप में कोई रुकावट नहीं आएगी—सभी भजन व श्लोक स्वतः आपके चयनित मॉडल के अनुसार <strong>डिवाइस की सुस्पष्ट ब्राउज़र वाणी</strong> में निर्बाध रूप से बजते रहेंगे।
                </p>
              </div>
            )}

            {/* Voice Engine Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleToggleAiVoice(true)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                  settings.useAiVoice
                    ? 'border-amber-600 bg-white shadow-xs ring-1 ring-amber-400/40'
                    : 'border-stone-200 bg-stone-50/60 hover:border-amber-300'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${settings.useAiVoice ? 'bg-gradient-to-br from-amber-600 to-red-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-stone-900">यथार्थवादी AI वाणी (Realistic Voice)</span>
                    {settings.useAiVoice && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    Google Gemini TTS द्वारा अत्यंत सजीव, सुरीला व भावपूर्ण भक्ति स्वर। भजनों, मंत्रों व कथाओं के लिए सर्वोत्तम।
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleToggleAiVoice(false)}
                className={`p-3 rounded-xl border-2 text-left transition-all flex items-start gap-3 ${
                  !settings.useAiVoice
                    ? 'border-amber-600 bg-white shadow-xs ring-1 ring-amber-400/40'
                    : 'border-stone-200 bg-stone-50/60 hover:border-amber-300'
                }`}
              >
                <div className={`p-2 rounded-lg mt-0.5 ${!settings.useAiVoice ? 'bg-gradient-to-br from-amber-600 to-red-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-stone-900">सिस्टम ब्राउज़र वाणी (Browser Standard)</span>
                    {!settings.useAiVoice && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                    डिवाइस का इनबिल्ट स्पीच सिंथेसाइज़र। बिना नेटवर्क भी तुरंत कार्य करता है।
                  </p>
                </div>
              </button>
            </div>

            {/* Manual API Key Card (Interactive Key Input & Test) */}
            <div className="bg-white/95 border-2 border-amber-400/80 rounded-xl p-4 space-y-3 text-xs shadow-xs mt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-amber-600 text-white">
                    <Key className="w-4 h-4" />
                  </span>
                  <div>
                    <h5 className="font-serif font-black text-sm text-amber-950 flex items-center gap-1.5">
                      <span>🔑 व्यक्तिगत Gemini API Key सुविधा (Manual API Add)</span>
                      {settings.customApiKey && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-1.5 py-0.2 rounded-full">
                          सक्रिय
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-stone-600">
                      यदि डिफ़ॉल्ट मुफ़्त कोटा पूरा हो गया हो, तो अपनी स्वयं की Gemini API Key जोड़ें
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 font-mono">
                  {settings.customApiKey ? 'सुरक्षित ब्राउज़र स्टोरेज' : 'वैकल्पिक (Optional)'}
                </div>
              </div>

              {/* Input + Action Buttons */}
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value);
                      setKeyTestFeedback(null);
                    }}
                    placeholder="यहाँ अपनी Gemini API Key पेस्ट करें (जैसे AIzaSy...)"
                    className="w-full bg-amber-50/50 border border-amber-300 rounded-lg pl-3 pr-20 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white"
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 text-stone-500 hover:text-stone-800 transition-colors"
                      title={showApiKey ? 'कुंजी छिपाएं' : 'कुंजी देखें'}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    {apiKeyInput && (
                      <button
                        type="button"
                        onClick={handleClearApiKey}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="कुंजी हटाएं"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Feedback Notice */}
                {keyTestFeedback && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-start gap-2 border ${
                    keyTestFeedback.success
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-red-50 text-red-900 border-red-300'
                  }`}>
                    {keyTestFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed font-medium">{keyTestFeedback.message}</span>
                  </div>
                )}

                {/* Control Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleSaveApiKey}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>कुंजी सेव करें (Save Key)</span>
                  </button>

                  <button
                    onClick={handleTestKey}
                    disabled={isTestingKey || !apiKeyInput.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-amber-400 hover:bg-amber-50 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin text-amber-700' : 'text-amber-800'}`} />
                    <span>{isTestingKey ? 'जांच हो रही है...' : 'API टेस्ट करें (Test API)'}</span>
                  </button>

                  {settings.customApiKey && (
                    <button
                      onClick={handleClearApiKey}
                      className="px-3 py-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-red-50 text-xs transition-colors"
                    >
                      डिफ़ॉल्ट सिस्टम कुंजी पर रीसेट करें
                    </button>
                  )}
                </div>
              </div>

              {/* Free API Key Guide */}
              <div className="bg-amber-50/70 rounded-lg p-2.5 border border-amber-200/90 space-y-1 text-[11px] text-stone-700">
                <div className="flex items-center justify-between text-amber-950 font-bold mb-1">
                  <span>💡 मुफ़्त Google Gemini API Key कैसे प्राप्त करें?</span>
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-800 hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Google AI Studio खोलें</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">१</span>
                  <span><strong>aistudio.google.com/apikey</strong> पर जाएं और अपने Google खाते से लॉगिन करें।</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">२</span>
                  <span><strong>"Create API key"</strong> बटन दबाएं और अपनी नई कुंजी कॉपी करें।</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">३</span>
                  <span>ऊपर बॉक्स में पेस्ट करके <strong>"कुंजी सेव करें"</strong> पर क्लिक करें। आपका निजी कोटा सक्रिय हो जाएगा!</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. अलग-अलग वॉइस मॉडल्स (Distinct Realistic Voice Models) */}
          {/* ======================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-black text-base text-amber-950 flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-700" />
                  <span>उपलब्ध दिव्य वॉइस मॉडल (Select Voice Model)</span>
                </h4>
                <p className="text-xs text-stone-600">
                  अपनी रुचि के अनुसार भजन, श्लोक व कथा हेतु विशिष्ट स्वर चुनें
                </p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-950 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                {DEVOTIONAL_VOICE_MODELS.length} अद्वितीय मॉडल
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {DEVOTIONAL_VOICE_MODELS.map((voice) => {
                const isSelected = settings.selectedVoiceId === voice.id;
                const isThisPreviewing = activePreviewVoice === voice.id && (isPlaying || isLoading);

                return (
                  <div
                    key={voice.id}
                    className={`p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-600 bg-white shadow-md ring-2 ring-amber-400/40'
                        : 'border-stone-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-amber-600 to-red-700 text-white shadow-xs' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {voice.gender === 'female' ? <Sparkles className="w-5 h-5" /> : <Scroll className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h5 className="font-serif font-black text-base text-stone-900">
                            {voice.nameHindi}
                          </h5>
                          <span className="text-[11px] bg-amber-100 text-amber-950 px-2 py-0.2 rounded font-mono font-bold">
                            {voice.id}
                          </span>
                          <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.2 rounded font-medium">
                            {voice.character}
                          </span>
                          <span className="text-[10px] bg-red-100 text-red-900 font-semibold px-1.5 py-0.2 rounded">
                            {voice.gender === 'female' ? 'देवी स्वर' : 'ऋषि/पुरुष स्वर'}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 font-sans leading-relaxed">
                          {voice.description}
                        </p>

                        <div className="text-[11px] text-amber-900 font-medium">
                          <strong>उत्तम उपयोग: </strong> {voice.idealFor}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 justify-end">
                      {/* Preview Button */}
                      <button
                        onClick={() => handlePreviewVoice(voice)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isThisPreviewing
                            ? 'bg-red-800 text-white animate-pulse'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                        }`}
                        title="स्वर का नमूना भजन सुनें"
                      >
                        {isThisPreviewing ? (
                          <>
                            <Square className="w-3.5 h-3.5" />
                            <span>रोकें</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-amber-800" />
                            <span>नमूना सुनें</span>
                          </>
                        )}
                      </button>

                      {/* Select Button */}
                      <button
                        onClick={() => handleSelectVoice(voice.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-800 text-white shadow-xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>सक्रिय मॉडल</span>
                          </>
                        ) : (
                          <span>चुनें</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. लाइव भजन व मंत्र टेस्टर (Live Bhajan Tester Panel) */}
          {/* ======================================================== */}
          <div className="bg-[#fff9ea] border border-amber-300 rounded-xl p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>लाइव भजन वाचन टेस्टर ({selectedVoiceObj.nameHindi})</span>
              </span>
              <span className="text-[11px] text-stone-600">
                चयनित मॉडल: <strong>{selectedVoiceObj.id}</strong>
              </span>
            </div>

            {/* Preset Sample Buttons */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_BHAJAN_SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomTestText(s.text)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    customTestText === s.text
                      ? 'bg-amber-800 text-white border-amber-800 font-bold'
                      : 'bg-white hover:bg-amber-100 text-stone-700 border-amber-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Textarea + Play button */}
            <div className="space-y-2">
              <textarea
                value={customTestText}
                onChange={(e) => setCustomTestText(e.target.value)}
                rows={2}
                placeholder="यहाँ कोई भी भजन, मंत्र या श्लोक लिखें और सुनें..."
                className="w-full bg-white border border-amber-300 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600 font-serif"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-500">
                  {isPlaying && activeText === customTestText ? '🔊 भजन बज रहा है...' : 'क्लिक करके तुरंत सुनें'}
                </span>

                <button
                  onClick={handlePlayCustomBhajan}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
                    isPlaying && activeText === customTestText
                      ? 'bg-red-800 text-white hover:bg-red-900'
                      : 'bg-amber-800 hover:bg-amber-900 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>तैयार हो रहा है...</span>
                    </>
                  ) : isPlaying && activeText === customTestText ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>भजन रोकें</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>▶ {selectedVoiceObj.id} स्वर में भजन सुनें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. गति व संकीर्तन शैली नियंत्रण (Speed & Style Controls) */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Speed Control */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-600" />
                  <span>वाणी की गति (Speech Speed)</span>
                </span>
                <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-mono">
                  {settings.speed.toFixed(1)}x
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {[0.8, 0.9, 1.0, 1.1, 1.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      settings.speed === s
                        ? 'bg-amber-800 text-white shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-500">
                श्लोक व ध्यान हेतु 0.8x-0.9x गति शांत और कर्णप्रिय रहती है।
              </p>
            </div>

            {/* Chant Style */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>भजन व पाठ शैली (Chanting Style)</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {[
                  'भक्तिमय संकीर्तन शैली',
                  'शास्त्रीय वैदिक मंत्रोच्चार',
                  'कथा वाचन व अमृतवाणी',
                  'आरती व स्तवन शैली'
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStyleChange(st)}
                    className={`p-2 rounded-lg text-[11px] font-semibold text-left transition-all flex items-center justify-between border ${
                      settings.chantStyle === st
                        ? 'bg-amber-100 text-amber-950 border-amber-400 font-bold shadow-2xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span className="truncate">{st}</span>
                    {settings.chantStyle === st && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Info Box */}
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              यह चयनित वॉइस मॉडल आपके आरती, चालीसा, भजनों, श्री विष्णु पुराण के १२६ अध्यायों, महाभारत के अध्यायों, गीता श्लोकों एवं श्री रामचरितमानस चौपाइयों में स्वतः लागू होगा।
            </p>
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-stone-100 p-3.5 px-5 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-stone-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>वर्तमान मॉडल: <strong>{settings.selectedVoiceId}</strong> ({settings.useAiVoice ? 'AI यथार्थवादी' : 'ब्राउज़र'})</span>
          </div>

          <button
            onClick={() => {
              globalVoiceAudioPlayer.stop();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-bold text-xs shadow-sm transition-all"
          >
            सेटिंग्स सुरक्षित करें व बंद करें ✓
          </button>
        </footer>

        {/* Toast */}
        {toastMessage && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 flex items-center gap-1.5 animate-fade-in border border-amber-400/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
};
