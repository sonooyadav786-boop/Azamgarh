import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  Type, 
  Play, 
  Square, 
  Mic, 
  Volume2, 
  Sliders, 
  Settings2,
  RefreshCw
} from 'lucide-react';
import { DEVOTIONAL_ITEMS } from '../data/devotionalData';
import { AartiItem } from '../types/calendar';
import { DevotionalArtIcon } from './DevotionalArtIcon';
import { 
  DEVOTIONAL_VOICE_MODELS, 
  globalVoiceAudioPlayer, 
  getStoredVoiceSettings, 
  saveVoiceSettings 
} from '../services/voiceAudioService';

interface DevotionalSectionProps {
  onClose: () => void;
  onOpenVoiceSettings?: () => void;
}

export const DevotionalSection: React.FC<DevotionalSectionProps> = ({ onClose, onOpenVoiceSettings }) => {
  const [selectedItem, setSelectedItem] = useState<AartiItem | null>(null);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [selectedDeity, setSelectedDeity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'aarti' | 'chalisa'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = useState(getStoredVoiceSettings());

  const deityOptions = [
    { id: 'all', label: 'सभी देवता (All)' },
    { id: 'shiv', label: 'भगवान शिव' },
    { id: 'hanuman', label: 'श्री हनुमान जी' },
    { id: 'ganesh', label: 'श्री गणेश जी' },
    { id: 'krishna_vishnu', label: 'श्री कृष्ण / विष्णु' },
    { id: 'radha', label: 'श्री राधा रानी' },
    { id: 'ram', label: 'श्री राम' },
    { id: 'durga', label: 'मां दुर्गा' },
    { id: 'lakshmi', label: 'मां लक्ष्मी' },
    { id: 'saraswati', label: 'मां सरस्वती' },
    { id: 'gayatri', label: 'मां गायत्री' },
    { id: 'surya', label: 'भगवान सूर्य देव' },
    { id: 'shani', label: 'श्री शनि देव' },
    { id: 'shyam', label: 'श्री खाटू श्याम जी' },
    { id: 'bhairav', label: 'श्री बटुक भैरव' },
    { id: 'kuber', label: 'भगवान कुबेर देव' },
    { id: 'santoshi', label: 'मां सन्तोषी माता' },
    { id: 'ganga', label: 'मां गंगा' },
  ];

  useEffect(() => {
    const unsubscribe = globalVoiceAudioPlayer.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsLoading(state.isLoading);
      setActiveText(state.activeText);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const currentVoiceObj = DEVOTIONAL_VOICE_MODELS.find(
    (v) => v.id === voiceSettings.selectedVoiceId
  ) || DEVOTIONAL_VOICE_MODELS[0];

  const handleVoiceSelect = (voiceId: string) => {
    const updated = { ...voiceSettings, selectedVoiceId: voiceId };
    setVoiceSettings(updated);
    saveVoiceSettings(updated);
    if (isPlaying) {
      globalVoiceAudioPlayer.stop();
    }
  };

  const handlePlayFullItem = async (item: AartiItem) => {
    const fullText = `${item.titleHindi}। ${item.lyrics.slice(0, 10).join('। ')}`;
    if (isPlaying && activeText === fullText) {
      globalVoiceAudioPlayer.stop();
      return;
    }
    await globalVoiceAudioPlayer.play(fullText, {
      overrideVoiceId: voiceSettings.selectedVoiceId,
      title: item.titleHindi
    });
  };

  const handlePlayVerse = async (verse: string, title: string) => {
    if (isPlaying && activeText === verse) {
      globalVoiceAudioPlayer.stop();
      return;
    }
    await globalVoiceAudioPlayer.play(verse, {
      overrideVoiceId: voiceSettings.selectedVoiceId,
      title
    });
  };

  const filteredItems = useMemo(() => {
    return DEVOTIONAL_ITEMS.filter((item) => {
      // Deity filter
      if (selectedDeity !== 'all' && item.category !== selectedDeity) {
        return false;
      }
      // Type filter (aarti vs chalisa)
      if (selectedType !== 'all' && item.itemType !== selectedType) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.titleHindi.toLowerCase().includes(q) ||
          item.deity.toLowerCase().includes(q) ||
          item.shortSummaryHindi.toLowerCase().includes(q) ||
          item.lyrics.some((l) => l.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedDeity, selectedType, searchQuery]);

  const getArtTypeForDeity = (category: string) => {
    switch (category) {
      case 'shiv':
      case 'shani':
      case 'bhairav':
        return 'shiva';
      case 'hanuman':
        return 'hanuman';
      case 'ganesh':
        return 'ganesh';
      case 'durga':
      case 'santoshi':
        return 'durga';
      case 'lakshmi':
      case 'kuber':
        return 'lakshmi';
      case 'ram':
        return 'ram';
      case 'krishna_vishnu':
      case 'radha':
      case 'shyam':
        return 'krishna';
      case 'surya':
        return 'chhat';
      case 'saraswati':
      case 'gayatri':
        return 'lakshmi';
      case 'ganga':
        return 'shradh';
      default:
        return 'generic_vedic';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          globalVoiceAudioPlayer.stop();
          onClose();
        }}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-4xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#991b1b] text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {selectedItem && (
              <button
                onClick={() => {
                  globalVoiceAudioPlayer.stop();
                  setSelectedItem(null);
                }}
                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-white transition-colors"
                title="सूची पर वापस जाएं"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100 flex items-center gap-2">
                <span>सम्पूर्ण आरती एवं चालीसा संग्रह</span>
              </h3>
              <p className="text-xs text-red-100">
                भगवान शिव, हनुमान, गणेश, दुर्गा, लक्ष्मी, राम, कृष्ण, सूर्य एवं शनि देव की स्तुतियां
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVoiceSettings && (
              <button
                onClick={onOpenVoiceSettings}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-stone-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-sm border border-amber-500 ring-2 ring-amber-300/60"
                title="⚙️ ऐप सेटिंग्स एवं AI वॉइस (Settings)"
              >
                <Settings2 className="w-4 h-4 text-red-950 animate-spin-slow shrink-0" />
                <span>⚙️ सेटिंग्स ({currentVoiceObj.id})</span>
              </button>
            )}

            <button
              onClick={() => {
                globalVoiceAudioPlayer.stop();
                onClose();
              }}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If an Aarti is selected, show full prayer view */}
        {selectedItem ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5">
            {/* Title & Top Metadata Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-900/15 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-red-900 uppercase tracking-wider bg-red-100 px-2 py-0.5 rounded">
                    {selectedItem.deity} · {selectedItem.itemType === 'chalisa' ? 'चालीसा' : selectedItem.itemType === 'aarti' ? 'आरती' : 'स्तुति'}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    ✓ सम्पूर्ण व प्रामाणिक पाठ (असंक्षिप्त)
                  </span>
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {selectedItem.titleHindi}
                </h2>
              </div>

              {/* Font Resizer */}
              <div className="flex items-center gap-1.5 bg-amber-100/70 p-1.5 rounded-lg border border-amber-300 self-start sm:self-auto">
                <Type className="w-4 h-4 text-stone-600" />
                <button
                  onClick={() => setFontSizeMultiplier((f) => Math.max(0.85, f - 0.1))}
                  className="px-2 py-0.5 text-xs font-bold text-stone-700 bg-white rounded shadow-xs hover:bg-stone-50"
                  title="अक्षर छोटे करें"
                >
                  अ-
                </button>
                <button
                  onClick={() => setFontSizeMultiplier((f) => Math.min(1.4, f + 0.1))}
                  className="px-2 py-0.5 text-xs font-bold text-stone-700 bg-white rounded shadow-xs hover:bg-stone-50"
                  title="अक्षर बड़े करें"
                >
                  अ+
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* सस्वर भजन ऑडियो प्लेयर बार (Devotional Audio Player Bar) */}
            {/* ======================================================== */}
            <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-red-950 text-white rounded-2xl p-4 shadow-lg border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePlayFullItem(selectedItem)}
                  disabled={isLoading}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md shrink-0 ${
                    isPlaying 
                      ? 'bg-red-700 hover:bg-red-800 text-white ring-2 ring-white/50 animate-pulse' 
                      : 'bg-gradient-to-tr from-amber-400 to-amber-200 hover:from-amber-300 hover:to-amber-100 text-stone-950'
                  }`}
                  title={isPlaying ? 'रोकें' : 'सस्वर भजन सुनें'}
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-stone-950" />
                  ) : isPlaying ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-sm text-amber-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isPlaying ? 'भजन सस्वर चल रहा है...' : '🎙️ सस्वर भजन सुनें (Realistic AI Voice)'}</span>
                    </span>
                    {isPlaying && (
                      <span className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                        <span className="w-1 h-4 bg-amber-300 animate-bounce rounded-full" />
                        <span className="w-1 h-2 bg-amber-400 animate-pulse rounded-full" />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-300">
                    मॉडल: <strong>{currentVoiceObj.nameHindi}</strong> ({currentVoiceObj.character})
                  </p>
                </div>
              </div>

              {/* Voice Model Selector Pills & Settings Shortcut */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider hidden sm:inline">
                  मॉडल बदलें:
                </span>
                {DEVOTIONAL_VOICE_MODELS.map((vm) => (
                  <button
                    key={vm.id}
                    onClick={() => handleVoiceSelect(vm.id)}
                    className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-all ${
                      voiceSettings.selectedVoiceId === vm.id
                        ? 'bg-amber-400 text-stone-950 font-black shadow-xs ring-1 ring-white'
                        : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
                    }`}
                    title={vm.character}
                  >
                    {vm.id}
                  </button>
                ))}

                {onOpenVoiceSettings && (
                  <button
                    onClick={onOpenVoiceSettings}
                    className="px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-[10px] flex items-center gap-1 transition-all shadow-xs ml-1"
                    title="सम्पूर्ण वॉइस व API सेटिंग्स खोलें"
                  >
                    <Settings2 className="w-3.5 h-3.5 text-red-950" />
                    <span>⚙️ सेटिंग्स</span>
                  </button>
                )}
              </div>
            </div>

            {/* Lyrics Card */}
            <div className="bg-[#fff9ea] border border-amber-200/90 rounded-2xl p-6 sm:p-8 shadow-inner text-center space-y-4">
              {selectedItem.lyrics.map((line, idx) => (
                <div key={idx} className="group relative flex items-center justify-center gap-2">
                  <p
                    style={{ fontSize: `${1.15 * fontSizeMultiplier}rem` }}
                    className={`font-heading leading-relaxed ${
                      line.startsWith('॥') ? 'font-bold text-red-900 my-2 text-base' : 'text-stone-900'
                    }`}
                  >
                    {line}
                  </p>
                  
                  {/* Quick play for this individual verse */}
                  <button
                    onClick={() => handlePlayVerse(line, `${selectedItem.titleHindi} पंक्ति ${idx + 1}`)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-amber-200 hover:bg-amber-300 text-red-950"
                    title="यह पंक्ति सुनें"
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </button>
                </div>
              ))}
            </div>

            {/* Meaning & Significance */}
            {selectedItem.meaningHindi && (
              <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200 text-xs sm:text-sm text-stone-700 space-y-1">
                <h4 className="font-bold text-red-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>भावार्थ एवं फलश्रुति:</span>
                </h4>
                <p className="leading-relaxed">{selectedItem.meaningHindi}</p>
              </div>
            )}
          </div>
        ) : (
          /* Cards Grid */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Top Filter and Search Strip */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              {/* Type Switcher: All | Aartis | Chalisas */}
              <div className="flex items-center bg-white rounded-lg p-0.5 border border-stone-200 shrink-0">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    selectedType === 'all'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  सभी ({DEVOTIONAL_ITEMS.length})
                </button>
                <button
                  onClick={() => setSelectedType('aarti')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    selectedType === 'aarti'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  आरती संग्रह
                </button>
                <button
                  onClick={() => setSelectedType('chalisa')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    selectedType === 'chalisa'
                      ? 'bg-[#991b1b] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  चालीसा संग्रह
                </button>
              </div>

              {/* Search input */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="आरती या चालीसा खोजें (उदा. शिव, हनुमान, दुर्गा)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg pl-8 pr-7 py-1 text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-800"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1.5 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Deity Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {deityOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDeity(opt.id)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    selectedDeity === opt.id
                      ? 'bg-[#991b1b] text-white font-bold shadow-2xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-[#fedfa0] hover:bg-[#fed788] border border-[#e6cb85] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="p-4">
                    <div className="h-36 overflow-hidden rounded-lg mb-3">
                      <DevotionalArtIcon
                        type={getArtTypeForDeity(item.category)}
                        size="lg"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-red-800 text-white font-bold px-1.5 py-0.5 rounded">
                        {item.itemType === 'chalisa' ? 'चालीसा' : item.itemType === 'aarti' ? 'आरती' : 'स्तुति'}
                      </span>
                      <span className="text-xs font-bold text-stone-700">{item.deity}</span>
                      {item.itemType === 'chalisa' && (
                        <span className="text-[10px] bg-amber-800 text-amber-100 font-bold px-1.5 py-0.5 rounded">
                          पूर्ण ४० चौपाई
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading text-lg font-bold text-red-900 mt-1">
                      {item.titleHindi}
                    </h4>
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed line-clamp-3">
                      {item.shortSummaryHindi}
                    </p>
                  </div>

                  <div className="px-4 pb-4 pt-1 border-t border-amber-900/10 flex items-center justify-between text-xs">
                    <span className="font-bold text-red-900 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>सम्पूर्ण पाठ पढ़ें</span>
                    </span>

                    {/* Quick play preview button on card */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayFullItem(item);
                      }}
                      className="px-2 py-1 rounded-md bg-amber-800/20 hover:bg-amber-800/40 text-amber-950 font-bold flex items-center gap-1 text-[11px]"
                      title="सस्वर भजन सुनें"
                    >
                      <Play className="w-3 h-3 fill-current text-red-900" />
                      <span>भजन सुनें</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>दैनिक नित्य पूजा, आरती व भजन संग्रह · सस्वर AI वाणी सक्षम ({currentVoiceObj.nameHindi})</span>
          </div>

          <button
            onClick={() => {
              globalVoiceAudioPlayer.stop();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#991b1b] text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
