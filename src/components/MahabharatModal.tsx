import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Volume2, 
  VolumeX, 
  Scroll, 
  Flame, 
  ShieldCheck,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  MAHABHARAT_18_PARVAS, 
  YAKSHA_PRASHNA_CANON, 
  GITA_18_CHAPTERS_OVERVIEW,
  MAHABHARAT_CELEBRATED_EPISODES,
  MahabharatParva,
  MahabharatEpisode,
  YakshaPrashnaItem,
  GitaChapterSummary
} from '../data/mahabharatData';
import { 
  MAHABHARAT_100_SUB_PARVAS,
  MahabharatSubParva,
  MAHABHARAT_SUB_PARVAS_OVERVIEW
} from '../data/mahabharatSubParvas';
import {
  MAHABHARAT_CANONICAL_CHAPTERS,
  MahabharatChapterDetail,
  MAHABHARAT_PARVA_CHAPTERS_COUNT
} from '../data/mahabharatAdhyayasCorpus';

interface MahabharatModalProps {
  onClose: () => void;
  onOpenRamayan?: () => void;
  onOpenShivPuran?: () => void;
  onOpenVishnuPuran?: () => void;
  onOpenKrishnaKatha?: () => void;
}

type MahabharatViewTab = '18_parvas' | 'adhyay_reader' | '100_sub_parvas' | 'gita_essence' | 'yaksha_prashna' | 'episodes';

export const MahabharatModal: React.FC<MahabharatModalProps> = ({
  onClose,
  onOpenRamayan,
  onOpenShivPuran,
  onOpenVishnuPuran,
  onOpenKrishnaKatha,
}) => {
  const [activeTab, setActiveTab] = useState<MahabharatViewTab>('18_parvas');
  const [selectedParva, setSelectedParva] = useState<MahabharatParva>(MAHABHARAT_18_PARVAS[0]);
  const [parvaSubView, setParvaSubView] = useState<'reading' | 'grid'>('reading');
  const [selectedParvaSection, setSelectedParvaSection] = useState<'subparvas' | 'episodes' | 'all'>('subparvas');
  const [subParvasViewMode, setSubParvasViewMode] = useState<'cards' | 'matrix'>('cards');
  const [selectedSubParvaFilter, setSelectedSubParvaFilter] = useState<number | 'all'>('all');
  const [selectedSubParvaDetail, setSelectedSubParvaDetail] = useState<MahabharatSubParva | null>(null);
  const [episodeFilterParva, setEpisodeFilterParva] = useState<number | 'all'>('all');
  
  // Dedicated Adhyaya Reader State
  const [currentReaderParvaNumber, setCurrentReaderParvaNumber] = useState<number>(1);
  const [currentReaderChapterNumber, setCurrentReaderChapterNumber] = useState<number>(1);
  const [readerChapterJumpInput, setReaderChapterJumpInput] = useState<string>('');
  const [showAllChaptersGrid, setShowAllChaptersGrid] = useState<boolean>(false);

  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Speech
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingText, setActiveSpeakingText] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`📋 ${label} कॉपी हो गया!`);
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      triggerToast('आपके ब्राउज़र में वाणी (TTS) समर्थित नहीं है');
      return;
    }

    if (isSpeaking && activeSpeakingText === text) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingText(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingText(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingText(null);
    };

    setIsSpeaking(true);
    setActiveSpeakingText(text);
    window.speechSynthesis.speak(utterance);
  };

  const filteredParvas = useMemo(() => {
    if (!searchQuery.trim()) return MAHABHARAT_18_PARVAS;
    const q = searchQuery.toLowerCase().trim();
    return MAHABHARAT_18_PARVAS.filter((p) => 
      p.parvaNameHindi.toLowerCase().includes(q) ||
      p.summaryHindi.toLowerCase().includes(q) ||
      p.keyEvents.some((k) => k.toLowerCase().includes(q)) ||
      p.majorCharacters.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const selectedParvaEpisodes = useMemo(() => {
    if (!selectedParva) return [];
    return MAHABHARAT_CELEBRATED_EPISODES.filter(
      (ep) => ep.parvaNumber === selectedParva.parvaNumber
    );
  }, [selectedParva]);

  const selectedParvaSubParvas = useMemo(() => {
    if (!selectedParva) return [];
    return MAHABHARAT_100_SUB_PARVAS.filter(
      (sp) => sp.majorParvaNumber === selectedParva.parvaNumber
    );
  }, [selectedParva]);

  const filteredCelebratedEpisodes = useMemo(() => {
    let list = MAHABHARAT_CELEBRATED_EPISODES;
    if (episodeFilterParva !== 'all') {
      list = list.filter((ep) => ep.parvaNumber === episodeFilterParva);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (ep) =>
          ep.titleHindi.toLowerCase().includes(q) ||
          ep.summaryHindi.toLowerCase().includes(q) ||
          ep.fullStoryParagraphs.some((p) => p.toLowerCase().includes(q)) ||
          ep.parvaNameHindi.toLowerCase().includes(q)
      );
    }
    return list;
  }, [episodeFilterParva, searchQuery]);

  const filteredSubParvas = useMemo(() => {
    let list = MAHABHARAT_100_SUB_PARVAS;
    if (selectedSubParvaFilter !== 'all') {
      list = list.filter((sp) => sp.majorParvaNumber === selectedSubParvaFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((sp) =>
        sp.subParvaNameHindi.toLowerCase().includes(q) ||
        sp.subParvaNameSanskrit.toLowerCase().includes(q) ||
        sp.majorParvaNameHindi.toLowerCase().includes(q) ||
        sp.detailedSummaryHindi.toLowerCase().includes(q) ||
        sp.keyEventsAndNarratives.some((k) => k.toLowerCase().includes(q)) ||
        sp.philosophicalSignificance.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedSubParvaFilter, searchQuery]);

  const getChapterDetail = (parvaNum: number, chapterNum: number): MahabharatChapterDetail => {
    const exact = MAHABHARAT_CANONICAL_CHAPTERS.find(
      (ch) => ch.parvaNumber === parvaNum && ch.chapterNumber === chapterNum
    );
    if (exact) return exact;

    const parvaSubParvas = MAHABHARAT_100_SUB_PARVAS.filter(sp => sp.majorParvaNumber === parvaNum);
    const subParva = parvaSubParvas.find((sp) => {
      const matchRange = sp.chapterRange.match(/(\d+)(?:[^\d]+(\d+))?/);
      if (!matchRange) return false;
      const start = parseInt(matchRange[1], 10);
      const end = matchRange[2] ? parseInt(matchRange[2], 10) : start;
      return chapterNum >= start && chapterNum <= end;
    }) || parvaSubParvas[0] || MAHABHARAT_100_SUB_PARVAS[0];

    const parvaObj = MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === parvaNum) || MAHABHARAT_18_PARVAS[0];

    return {
      parvaNumber: parvaNum,
      parvaNameHindi: parvaObj.parvaNameHindi,
      subParvaId: subParva.subParvaId,
      subParvaNameHindi: subParva.subParvaNameHindi,
      chapterNumber: chapterNum,
      titleHindi: `${parvaObj.parvaNameHindi} - अध्याय ${chapterNum} (${subParva.subParvaNameHindi})`,
      titleSanskrit: `${subParva.subParvaNameSanskrit} - अध्यायः ${chapterNum}`,
      shlokaSanskrit: `धर्मे चार्थे च कामे च मोक्षे च भरतर्षभ।\nयदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित्॥`,
      shlokaMeaningHindi: `हे भरतश्रेष्ठ! धर्म, अर्थ, काम और मोक्ष के विषय में जो कुछ इस महाभारत में है, वही अन्यत्र है; और जो यहाँ नहीं है, वह कहीं नहीं है।`,
      detailedStoryParagraphs: [
        `यह पावन अध्याय महाभारत के ${parvaObj.parvaNameHindi} के अंतर्गत उप-पर्व #${subParva.subParvaId} (${subParva.subParvaNameHindi}, ${subParva.chapterRange}) में आता है।`,
        subParva.detailedSummaryHindi,
        `इस अध्याय विस्तार के प्रमुख ऐतिहासिक आख्यान: ${subParva.keyEventsAndNarratives.join('; ')}।`
      ],
      keyCharacters: parvaObj.majorCharacters,
      dharmaLesson: subParva.philosophicalSignificance
    };
  };

  const currentReadingChapter = useMemo(() => {
    return getChapterDetail(currentReaderParvaNumber, currentReaderChapterNumber);
  }, [currentReaderParvaNumber, currentReaderChapterNumber]);

  const maxChaptersInCurrentParva = useMemo(() => {
    return MAHABHARAT_PARVA_CHAPTERS_COUNT[currentReaderParvaNumber] || 50;
  }, [currentReaderParvaNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (isSpeaking) window.speechSynthesis.cancel();
          onClose();
        }}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-5xl rounded-2xl shadow-2xl border-2 border-red-800/40 overflow-hidden my-auto max-h-[96vh] flex flex-col z-10">
        
        {/* Top Header */}
        <header className="bg-gradient-to-r from-[#450a0a] via-[#7f1d1d] to-[#991b1b] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0 border-b border-amber-400/30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-300/40 text-amber-300">
              <Flame className="w-5 h-5 text-amber-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-100 tracking-wide flex items-center gap-1.5">
                  🏹 सम्पूर्ण महाभारत (१८ पर्व)
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase hidden sm:inline">
                  शतसाहस्री संहिता (१ लाख श्लोक)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-100/90 font-serif">
                महर्षि वेदव्यास विरचित १८ पर्व • श्रीमद्भगवद्गीता सार • यक्ष-युधिष्ठिर संवाद • कुरुक्षेत्र महासमर व स्वर्गारोहण
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Multiplier */}
            <div className="hidden sm:flex items-center bg-stone-900/60 rounded-lg p-0.5 border border-amber-400/30 text-xs">
              <button
                onClick={() => setFontSizeMultiplier((f) => Math.max(0.85, f - 0.1))}
                className="px-2 py-1 hover:bg-stone-800 rounded text-amber-200"
                title="अक्षर छोटे करें"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeMultiplier((f) => Math.min(1.3, f + 0.1))}
                className="px-2 py-1 hover:bg-stone-800 rounded text-amber-200 font-bold"
                title="अक्षर बड़े करें"
              >
                A+
              </button>
            </div>

            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-stone-900/60 hover:bg-red-950 text-amber-200 hover:text-white transition-colors"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Quick Grantha Switcher Bar */}
        <div className="bg-red-950/20 border-b border-red-900/20 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs shrink-0 font-medium">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-red-950 flex items-center gap-1 font-serif">
              <span>📖 सनातन ग्रंथ सागर:</span>
            </span>
            <span className="bg-red-900 text-white font-bold px-2 py-0.5 rounded-md text-[11px] ring-1 ring-amber-400">
              🏹 महाभारत (१८ पर्व)
            </span>
            {onOpenRamayan && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRamayan();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                🚩 श्रीरामचरितमानस
              </button>
            )}
            {onOpenShivPuran && (
              <button
                onClick={() => {
                  onClose();
                  onOpenShivPuran();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                🔱 शिव महापुराण
              </button>
            )}
            {onOpenVishnuPuran && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVishnuPuran();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                🪷 विष्णु पुराण
              </button>
            )}
            {onOpenKrishnaKatha && (
              <button
                onClick={() => {
                  onClose();
                  onOpenKrishnaKatha();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                ✨ कृष्ण चरितामृत
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#fef9ee] border-b border-amber-200 px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('18_parvas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === '18_parvas'
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>सम्पूर्ण १८ पर्व कोष</span>
            </button>

            <button
              onClick={() => setActiveTab('adhyay_reader')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'adhyay_reader'
                  ? 'bg-red-800 text-white shadow-sm ring-1 ring-amber-300'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
              title="महाभारत का एक-एक अध्याय क्रमानुसार पढ़ें"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>📖 अध्याय-वार वाचन (१,९९५ अध्याय)</span>
            </button>

            <button
              onClick={() => setActiveTab('100_sub_parvas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === '100_sub_parvas'
                  ? 'bg-orange-800 text-white shadow-sm ring-1 ring-amber-300'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
              title="महाभारत के सभी पर्वों के अध्याय एवं सम्पूर्ण १०० उप-पर्व कोष"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>📜 १०० उप-पर्व व तालिका</span>
            </button>

            <button
              onClick={() => setActiveTab('gita_essence')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'gita_essence'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>श्रीमद्भगवद्गीता सार</span>
            </button>

            <button
              onClick={() => setActiveTab('yaksha_prashna')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'yaksha_prashna'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>यक्ष-युधिष्ठिर संवाद</span>
            </button>

            <button
              onClick={() => setActiveTab('episodes')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'episodes'
                  ? 'bg-purple-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>प्रसिद्ध प्रसंग व शिक्षाएं</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[140px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="पर्व, प्रसंग या पात्र खोजें..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 bg-[#fffdfa]" style={{ fontSize: `${fontSizeMultiplier * 100}%` }}>
          
          {/* TAB 1: 18 PARVAS LIST & DETAILED READER */}
          {activeTab === '18_parvas' && (
            <div className="space-y-5">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-red-950 via-stone-900 to-red-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-400/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                      सम्पूर्ण महाभारत के १८ पावन पर्व (The 18 Parvas of Mahabharata)
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-3xl font-serif">
                      "यन्नेहास्ति न कुत्रचित्" — जो इस महाभारत में है वह सर्वत्र है, जो इसमें नहीं है वह कहीं नहीं है। आदि पर्व से स्वर्गारोहण पर्व तक १००,००० श्लोकों की शतसाहस्री संहिता।
                    </p>
                  </div>

                  {/* Reading Mode vs Grid Mode Switcher */}
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-amber-500/30 text-xs">
                    <button
                      onClick={() => setParvaSubView('reading')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        parvaSubView === 'reading'
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : 'text-amber-200 hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>विस्तृत पर्व वाचन</span>
                    </button>
                    <button
                      onClick={() => setParvaSubView('grid')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                        parvaSubView === 'grid'
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : 'text-amber-200 hover:text-white'
                      }`}
                    >
                      <Scroll className="w-3.5 h-3.5" />
                      <span>१८ पर्व सूची</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick 18 Parva Selector Bar */}
              <div className="bg-amber-50/80 p-2 sm:p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                <span className="text-[11px] font-bold text-amber-950 whitespace-nowrap pl-1 pr-2 border-r border-amber-300">
                  पर्व चुनें:
                </span>
                {MAHABHARAT_18_PARVAS.map((p) => {
                  const isSelected = selectedParva?.parvaNumber === p.parvaNumber;
                  return (
                    <button
                      key={p.parvaNumber}
                      onClick={() => {
                        setSelectedParva(p);
                        setParvaSubView('reading');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-all shrink-0 ${
                        isSelected
                          ? 'bg-red-800 text-white font-bold shadow-xs'
                          : 'bg-white hover:bg-amber-200/80 text-stone-800 border border-amber-200'
                      }`}
                    >
                      {p.parvaNumber}. {p.parvaNameHindi.replace(' (अरण्य पर्व)', '')}
                    </button>
                  );
                })}
              </div>

              {/* VIEW MODE 1: DETAILED PARVA READING VIEW */}
              {parvaSubView === 'reading' && selectedParva && (
                <div className="space-y-5">
                  {/* Selected Parva Detailed Master Card */}
                  <div className="p-5 sm:p-6 bg-white border-2 border-amber-300 rounded-2xl shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-red-800 text-white font-black text-sm flex items-center justify-center shadow-xs">
                          {selectedParva.parvaNumber}
                        </span>
                        <div>
                          <h4 className="font-serif font-black text-xl sm:text-2xl text-red-950">
                            {selectedParva.parvaNameHindi} ({selectedParva.parvaNameSanskrit})
                          </h4>
                          <span className="text-xs text-amber-900 font-medium">
                            कालखण्ड: {selectedParva.timePeriod}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs bg-amber-100 text-amber-950 px-3 py-1 rounded-full font-bold">
                          लगभग {selectedParva.totalChaptersApprox} अध्याय
                        </span>
                        <button
                          onClick={() => {
                            setCurrentReaderParvaNumber(selectedParva.parvaNumber);
                            setCurrentReaderChapterNumber(1);
                            setActiveTab('adhyay_reader');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>अध्याय-वार वाचन खोलें 📖</span>
                        </button>
                        <button
                          onClick={() => handleSpeak(`${selectedParva.parvaNameHindi}। ${selectedParva.summaryHindi}`)}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>पर्व परिचय सुनें</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-50/70 rounded-xl text-stone-800 text-sm leading-relaxed font-serif">
                      <strong className="text-red-950 block mb-1">पर्व सारांश:</strong>
                      {selectedParva.summaryHindi}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-red-950 block mb-1.5">
                        प्रमुख ऐतिहासिक घटनाएं व प्रसंग:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedParva.keyEvents.map((ev, eIdx) => (
                          <span
                            key={eIdx}
                            className="text-xs bg-red-50 border border-red-200 text-red-950 px-2.5 py-1 rounded-md font-medium"
                          >
                            ✓ {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-stone-600">
                      <span><strong>प्रमुख पात्र:</strong> {selectedParva.majorCharacters.join(', ')}</span>
                    </div>

                    {/* Sequential Navigation between Parvas */}
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/80">
                      <button
                        disabled={selectedParva.parvaNumber <= 1}
                        onClick={() => {
                          const prev = MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === selectedParva.parvaNumber - 1);
                          if (prev) setSelectedParva(prev);
                        }}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 disabled:hover:bg-amber-100 text-amber-950 rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        ← पिछला पर्व ({selectedParva.parvaNumber > 1 ? MAHABHARAT_18_PARVAS[selectedParva.parvaNumber - 2].parvaNameHindi : ''})
                      </button>

                      <button
                        onClick={() => setParvaSubView('grid')}
                        className="text-xs text-red-800 hover:text-red-950 font-bold underline"
                      >
                        सभी १८ पर्व सूची देखें
                      </button>

                      <button
                        disabled={selectedParva.parvaNumber >= 18}
                        onClick={() => {
                          const next = MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === selectedParva.parvaNumber + 1);
                          if (next) setSelectedParva(next);
                        }}
                        className="px-3 py-1.5 bg-red-800 hover:bg-red-900 disabled:opacity-40 disabled:hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        अगला पर्व ({selectedParva.parvaNumber < 18 ? MAHABHARAT_18_PARVAS[selectedParva.parvaNumber].parvaNameHindi : ''}) →
                      </button>
                    </div>
                  </div>

                  {/* All Detailed Sub-Parvas, Chapters & Episodes of THIS Parva */}
                  <div className="space-y-4">
                    {/* View Switcher between Sub-Parvas/Chapters & Celebrated Episodes */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-300 pb-2.5">
                      <div className="flex items-center gap-1.5 bg-amber-100/80 p-1 rounded-xl text-xs font-bold">
                        <button
                          onClick={() => setSelectedParvaSection('subparvas')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                            selectedParvaSection === 'subparvas'
                              ? 'bg-red-800 text-white shadow-xs'
                              : 'text-stone-800 hover:bg-amber-200'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>समस्त उप-पर्व व अध्याय ({selectedParvaSubParvas.length})</span>
                        </button>
                        <button
                          onClick={() => setSelectedParvaSection('episodes')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                            selectedParvaSection === 'episodes'
                              ? 'bg-red-800 text-white shadow-xs'
                              : 'text-stone-800 hover:bg-amber-200'
                          }`}
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>अमर प्रसंग ({selectedParvaEpisodes.length})</span>
                        </button>
                        <button
                          onClick={() => setSelectedParvaSection('all')}
                          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                            selectedParvaSection === 'all'
                              ? 'bg-red-800 text-white shadow-xs'
                              : 'text-stone-800 hover:bg-amber-200'
                          }`}
                        >
                          <Scroll className="w-3.5 h-3.5" />
                          <span>दोनों साथ देखें</span>
                        </button>
                      </div>

                      <span className="text-xs text-amber-950 font-bold bg-amber-200/80 px-2.5 py-1 rounded-md">
                        {selectedParva.parvaNameHindi} • कुल {selectedParvaSubParvas.length} उप-पर्व • {selectedParva.totalChaptersApprox} अध्याय
                      </span>
                    </div>

                    {/* SECTION 1: SUB-PARVAS & CHAPTERS OF THIS PARVA */}
                    {(selectedParvaSection === 'subparvas' || selectedParvaSection === 'all') && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-black text-lg text-red-950 flex items-center gap-2">
                            <span>📜 {selectedParva.parvaNameHindi} के सभी उप-पर्व एवं अध्याय विस्तार</span>
                            <span className="text-xs bg-red-100 text-red-900 px-2.5 py-0.5 rounded-full font-bold">
                              {selectedParvaSubParvas.length} उप-पर्व
                            </span>
                          </h4>
                          <span className="text-xs text-stone-500 font-medium">
                            लगभग {selectedParva.totalChaptersApprox} अध्याय
                          </span>
                        </div>

                        {/* Quick Jump Pills for Sub-Parvas of this Parva */}
                        {selectedParvaSubParvas.length > 1 && (
                          <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 space-y-1.5">
                            <span className="text-[11px] font-bold text-red-950 flex items-center gap-1">
                              <span>📑 इस पर्व के अध्याय तुरंत चुनें:</span>
                            </span>
                            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
                              {selectedParvaSubParvas.map((sp) => (
                                <a
                                  key={sp.subParvaId}
                                  href={`#subparva-${sp.subParvaId}`}
                                  className="px-2.5 py-1 rounded-md bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-[11px] whitespace-nowrap font-medium transition-colors shrink-0 flex items-center gap-1"
                                >
                                  <span className="text-red-800 font-bold">#{sp.subParvaId}</span>
                                  <span>{sp.subParvaNameHindi}</span>
                                  <span className="text-[10px] text-amber-900 bg-amber-100 px-1 rounded">
                                    {sp.chapterRange}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sub-Parva Cards for THIS Parva */}
                        {selectedParvaSubParvas.map((sp) => (
                          <div
                            id={`subparva-${sp.subParvaId}`}
                            key={sp.subParvaId}
                            className="p-5 sm:p-6 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:border-red-500 transition-all space-y-3.5 scroll-mt-24"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                              <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-amber-900 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                                  {sp.subParvaId}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px]">
                                      उप-पर्व #{sp.subParvaId} • {sp.majorParvaNameHindi}
                                    </span>
                                    <span className="bg-red-100 text-red-900 font-bold px-2.5 py-0.5 rounded text-[11px]">
                                      {sp.chapterRange} ({sp.chaptersCount} अध्याय)
                                    </span>
                                  </div>
                                  <h5 className="font-serif font-black text-lg sm:text-xl text-red-950 mt-0.5">
                                    {sp.subParvaNameHindi} ({sp.subParvaNameSanskrit})
                                  </h5>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleSpeak(`${sp.subParvaNameHindi}। अध्याय विस्तार: ${sp.chapterRange}। ${sp.detailedSummaryHindi}`)}
                                  className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                                  title="सस्वर सुनें"
                                >
                                  {isSpeaking && activeSpeakingText?.includes(sp.subParvaNameHindi) ? (
                                    <>
                                      <VolumeX className="w-3.5 h-3.5 text-red-600" />
                                      <span>रोकें</span>
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="w-3.5 h-3.5" />
                                      <span>सस्वर सुनें</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(
                                    `[महाभारत - ${sp.majorParvaNameHindi} | उप-पर्व #${sp.subParvaId}: ${sp.subParvaNameHindi}]\nअध्याय विस्तार: ${sp.chapterRange} (${sp.chaptersCount} अध्याय)\n\nविवरण:\n${sp.detailedSummaryHindi}\n\nप्रमुख प्रसंग:\n${sp.keyEventsAndNarratives.join('\n')}\n\nदार्शनिक रहस्य:\n${sp.philosophicalSignificance}`,
                                    sp.subParvaNameHindi
                                  )}
                                  className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                                  title="कॉपी करें"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Detailed Summary */}
                            <div className="p-3.5 bg-amber-50/70 rounded-xl text-stone-800 text-xs sm:text-sm leading-relaxed font-serif border border-amber-200/50">
                              <strong className="text-red-950 block mb-1">
                                अध्याय सारांश व कथा ({sp.chapterRange}):
                              </strong>
                              {sp.detailedSummaryHindi}
                            </div>

                            {/* Key Events & Narratives */}
                            <div>
                              <span className="text-[11px] font-bold text-red-950 block mb-1 uppercase tracking-wide">
                                इस अध्याय विस्तार के प्रमुख प्रसंग व आख्यान:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {sp.keyEventsAndNarratives.map((ev, evIdx) => (
                                  <div
                                    key={evIdx}
                                    className="text-xs bg-red-50/70 border border-red-200/70 text-red-950 p-2 rounded-lg font-medium flex items-start gap-1.5"
                                  >
                                    <span className="text-red-700 font-bold shrink-0">✦</span>
                                    <span>{ev}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Philosophical Significance */}
                            <div className="p-2.5 bg-gradient-to-r from-amber-100/70 to-orange-100/50 rounded-xl text-xs text-amber-950 border border-amber-300/60">
                              <strong>गूढ़ दार्शनिक संदेश:</strong> {sp.philosophicalSignificance}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SECTION 2: CELEBRATED EPISODES OF THIS PARVA */}
                    {(selectedParvaSection === 'episodes' || selectedParvaSection === 'all') && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                          <h4 className="font-serif font-black text-lg text-red-950 flex items-center gap-2">
                            <span>✨ {selectedParva.parvaNameHindi} के प्रसिद्ध प्रसंग व अमर गाथाएं</span>
                            <span className="text-xs bg-red-100 text-red-900 px-2 py-0.5 rounded-full font-bold">
                              {selectedParvaEpisodes.length} मुख्य प्रसंग
                            </span>
                          </h4>
                        </div>

                        {selectedParvaEpisodes.length === 0 ? (
                          <div className="p-6 bg-white border border-amber-200 rounded-xl text-center text-stone-600 text-xs">
                            इस पर्व के सभी अध्याय ऊपर उप-पर्व विस्तार में उपलब्ध हैं।
                          </div>
                        ) : (
                          selectedParvaEpisodes.map((ep) => (
                            <div
                              key={ep.episodeId}
                              className="p-5 sm:p-6 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-3.5 hover:border-red-400 transition-colors"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="bg-red-800 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
                                    प्रसंग #{ep.episodeId}
                                  </span>
                                  <h5 className="font-serif font-black text-lg sm:text-xl text-red-950">
                                    {ep.titleHindi}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSpeak(`${ep.titleHindi}। ${ep.summaryHindi}। ${ep.fullStoryParagraphs.join(' ')}`)}
                                    className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                    <span>सस्वर सुनें</span>
                                  </button>
                                  <button
                                    onClick={() => copyToClipboard(
                                      `[महाभारत - ${ep.parvaNameHindi}: ${ep.titleHindi}]\n${ep.summaryHindi}\n\n${ep.fullStoryParagraphs.join('\n\n')}`,
                                      ep.titleHindi
                                    )}
                                    className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                                    title="कॉपी करें"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <p className="text-xs text-amber-900 font-serif font-semibold">
                                {ep.subtitleHindi}
                              </p>

                              {ep.shlokaSanskrit && (
                                <div className="p-3 bg-red-50/80 border-l-4 border-red-700 rounded-r-xl font-serif text-sm sm:text-base text-red-950 font-bold leading-relaxed text-center">
                                  {ep.shlokaSanskrit}
                                </div>
                              )}

                              <div className="space-y-2.5 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                                {ep.fullStoryParagraphs.map((para, pIdx) => (
                                  <p key={pIdx}>{para}</p>
                                ))}
                              </div>

                              <div className="p-3 bg-amber-50/90 rounded-xl text-xs text-amber-950 border border-amber-200">
                                <strong>दार्शनिक शिक्षा:</strong> {ep.philosophicalTeaching}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: ALL 18 PARVAS GRID OVERVIEW */}
              {parvaSubView === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredParvas.map((parva) => (
                    <div
                      key={parva.parvaNumber}
                      className="p-4 sm:p-5 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:border-red-600 transition-all space-y-2.5 cursor-pointer"
                      onClick={() => {
                        setSelectedParva(parva);
                        setParvaSubView('reading');
                      }}
                    >
                      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center">
                            {parva.parvaNumber}
                          </span>
                          <h4 className="font-serif font-bold text-base sm:text-lg text-red-950">
                            {parva.parvaNameHindi} ({parva.parvaNameSanskrit})
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] bg-orange-100 text-orange-950 px-2 py-0.5 rounded font-bold">
                            {MAHABHARAT_100_SUB_PARVAS.filter(sp => sp.majorParvaNumber === parva.parvaNumber).length} उप-पर्व
                          </span>
                          <span className="text-[11px] bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-bold">
                            {parva.totalChaptersApprox} अध्याय
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-amber-900 font-semibold">
                        कालखण्ड: <span className="text-stone-700 font-normal">{parva.timePeriod}</span>
                      </p>

                      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans line-clamp-3">
                        {parva.summaryHindi}
                      </p>

                      <div>
                        <span className="text-[11px] font-bold text-red-900 block mb-1">
                          प्रमुख ऐतिहासिक घटनाएं:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {parva.keyEvents.slice(0, 3).map((ev, eIdx) => (
                            <span
                              key={eIdx}
                              className="text-[11px] bg-red-50 border border-red-200 text-red-950 px-2 py-0.5 rounded-md font-medium"
                            >
                              • {ev}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-stone-600">
                        <span className="text-red-800 font-bold flex items-center gap-1">
                          📖 विस्तृत अध्याय व कथाएं पढ़ें →
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(`${parva.parvaNameHindi}। कालखण्ड: ${parva.timePeriod}। ${parva.summaryHindi}`);
                          }}
                          className="text-stone-700 hover:text-red-950 font-bold flex items-center gap-1 p-1"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>सुनें</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADHYAY READER (सम्पूर्ण महाभारत अध्याय-वार वाचन प्रणाली) */}
          {activeTab === 'adhyay_reader' && (
            <div className="space-y-5">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-red-950 via-stone-900 to-amber-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-400/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                        व्यास रचित शतसाहस्री संहिता
                      </span>
                      <span className="text-xs bg-red-800 text-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                        १८ पर्व • १०० उप-पर्व • १,९९५ अध्याय
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                      सम्पूर्ण महाभारत अध्याय-वार वाचन प्रणाली (Canonical Adhyaya Reader)
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-3xl font-serif">
                      एक-एक अध्याय का क्रमबद्ध प्रामाणिक वाचन, मूल संस्कृत श्लोक, भावार्थ, सम्पूर्ण विस्तृत आख्यान एवं नीति संदेश।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-500/20 text-amber-200 border border-amber-400/40 px-3 py-1.5 rounded-xl block font-mono font-bold">
                      {MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === currentReaderParvaNumber)?.parvaNameHindi}: अध्याय {currentReaderChapterNumber} / {maxChaptersInCurrentParva}
                    </span>
                  </div>
                </div>
              </div>

              {/* 18 Parva Selector Bar */}
              <div className="bg-amber-50/90 p-2 sm:p-2.5 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-950">
                    पर्व चुनें (१८ पावन पर्व):
                  </span>
                  <span className="text-[11px] text-stone-600 font-medium">
                    वर्तमान पर्व: <strong className="text-red-900">{MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === currentReaderParvaNumber)?.parvaNameHindi}</strong> (कुल {maxChaptersInCurrentParva} अध्याय)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
                  {MAHABHARAT_18_PARVAS.map((p) => {
                    const isSelected = currentReaderParvaNumber === p.parvaNumber;
                    const chCount = MAHABHARAT_PARVA_CHAPTERS_COUNT[p.parvaNumber] || p.totalChaptersApprox;
                    return (
                      <button
                        key={p.parvaNumber}
                        onClick={() => {
                          setCurrentReaderParvaNumber(p.parvaNumber);
                          setCurrentReaderChapterNumber(1);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all shrink-0 flex items-center gap-1 ${
                          isSelected
                            ? 'bg-red-800 text-white font-bold shadow-xs ring-1 ring-amber-300'
                            : 'bg-white hover:bg-amber-100 text-stone-800 border border-amber-200'
                        }`}
                      >
                        <span className="font-bold">{p.parvaNumber}.</span>
                        <span>{p.parvaNameHindi.replace(' (अरण्य पर्व)', '')}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-red-900 text-amber-200' : 'bg-amber-100 text-amber-950'
                        }`}>
                          {chCount} अ.
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Adhyaya Jumper & Grid Toggle Bar */}
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-amber-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                {/* Direct Number Jump Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = parseInt(readerChapterJumpInput.trim(), 10);
                    if (!isNaN(val) && val >= 1 && val <= maxChaptersInCurrentParva) {
                      setCurrentReaderChapterNumber(val);
                      setReaderChapterJumpInput('');
                    } else {
                      triggerToast(`कृपया १ से ${maxChaptersInCurrentParva} के बीच अध्याय संख्या दर्ज करें`);
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="chapter-jump-input" className="text-xs font-bold text-stone-800">
                    सीधे अध्याय पर जाएं:
                  </label>
                  <input
                    id="chapter-jump-input"
                    type="number"
                    min={1}
                    max={maxChaptersInCurrentParva}
                    value={readerChapterJumpInput}
                    onChange={(e) => setReaderChapterJumpInput(e.target.value)}
                    placeholder={`१ - ${maxChaptersInCurrentParva}`}
                    className="w-24 px-2.5 py-1 text-xs border border-amber-300 rounded-lg text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-700 bg-amber-50/40"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                  >
                    खोलें
                  </button>
                </form>

                {/* Chapter Chips or Grid Switcher */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAllChaptersGrid(!showAllChaptersGrid)}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-lg text-xs font-bold border border-amber-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Scroll className="w-3.5 h-3.5 text-amber-800" />
                    <span>{showAllChaptersGrid ? 'ग्रिड छिपाएं' : `सभी ${maxChaptersInCurrentParva} अध्याय देखें`}</span>
                  </button>
                </div>
              </div>

              {/* Expandable Grid of All Chapters for This Parva */}
              {showAllChaptersGrid && (
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-amber-200 pb-1.5">
                    <span className="font-bold text-red-950">
                      {MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === currentReaderParvaNumber)?.parvaNameHindi} — समस्त {maxChaptersInCurrentParva} अध्याय:
                    </span>
                    <span className="text-stone-500">किसी भी संख्या पर क्लिक करके पढ़ें</span>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-1.5 max-h-60 overflow-y-auto p-1">
                    {Array.from({ length: maxChaptersInCurrentParva }, (_, i) => i + 1).map((chNum) => {
                      const isCurrent = currentReaderChapterNumber === chNum;
                      return (
                        <button
                          key={chNum}
                          onClick={() => {
                            setCurrentReaderChapterNumber(chNum);
                            setShowAllChaptersGrid(false);
                          }}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                            isCurrent
                              ? 'bg-red-800 text-white shadow-xs'
                              : 'bg-white hover:bg-amber-200 text-stone-800 border border-amber-200'
                          }`}
                        >
                          {chNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Master Full Chapter Reader Card */}
              <article className="p-5 sm:p-7 bg-white border-2 border-amber-300 rounded-2xl shadow-sm space-y-5">
                {/* Chapter Card Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-800 text-white font-black px-2.5 py-0.5 rounded-full text-xs">
                        अध्याय #{currentReadingChapter.chapterNumber}
                      </span>
                      <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-xs">
                        {currentReadingChapter.parvaNameHindi}
                      </span>
                      <span className="bg-orange-100 text-orange-950 font-semibold px-2 py-0.5 rounded text-xs">
                        उप-पर्व #{currentReadingChapter.subParvaId}: {currentReadingChapter.subParvaNameHindi}
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-red-950 mt-1">
                      {currentReadingChapter.titleHindi}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans italic">
                      {currentReadingChapter.titleSanskrit}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(`${currentReadingChapter.titleHindi}। ${currentReadingChapter.shlokaSanskrit}। ${currentReadingChapter.shlokaMeaningHindi}। ${currentReadingChapter.detailedStoryParagraphs.join(' ')}`)}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1.5"
                      title="सस्वर सुनें"
                    >
                      {isSpeaking && activeSpeakingText?.includes(currentReadingChapter.titleHindi) ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-red-600" />
                          <span>रोकें</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>सस्वर पाठ</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(
                        `[महाभारत - ${currentReadingChapter.parvaNameHindi} | अध्याय #${currentReadingChapter.chapterNumber}]\nशीर्षक: ${currentReadingChapter.titleHindi} (${currentReadingChapter.titleSanskrit})\nउप-पर्व: ${currentReadingChapter.subParvaNameHindi}\n\nश्लोक:\n${currentReadingChapter.shlokaSanskrit}\n\nभावार्थ:\n${currentReadingChapter.shlokaMeaningHindi}\n\nकथा:\n${currentReadingChapter.detailedStoryParagraphs.join('\n\n')}\n\nनीति संदेश: ${currentReadingChapter.dharmaLesson}`,
                        `अध्याय #${currentReadingChapter.chapterNumber}`
                      )}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                      title="कॉपी करें"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shloka Box */}
                {currentReadingChapter.shlokaSanskrit && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-amber-50/70 border-l-4 border-red-800 rounded-r-xl space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-900 block">
                      ॥ प्रामाणिक मूल संस्कृत श्लोक ॥
                    </span>
                    <div className="font-serif text-base sm:text-lg text-red-950 font-bold leading-relaxed whitespace-pre-line text-center">
                      {currentReadingChapter.shlokaSanskrit}
                    </div>
                    {currentReadingChapter.shlokaMeaningHindi && (
                      <p className="text-xs sm:text-sm text-stone-800 font-serif pt-1 border-t border-amber-200/60 leading-relaxed">
                        <strong className="text-red-900">हिन्दी भावार्थ:</strong> {currentReadingChapter.shlokaMeaningHindi}
                      </p>
                    )}
                  </div>
                )}

                {/* Detailed Multi-Paragraph Story */}
                <div className="space-y-3 font-serif text-sm sm:text-base text-stone-800 leading-relaxed">
                  <span className="text-xs font-bold text-red-950 uppercase tracking-wide block font-sans">
                    📖 अध्याय की सम्पूर्ण कथा एवं आख्यान:
                  </span>
                  {currentReadingChapter.detailedStoryParagraphs.map((para, pIdx) => (
                    <p key={pIdx} className="indent-4 sm:indent-6">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Key Characters */}
                {currentReadingChapter.keyCharacters && currentReadingChapter.keyCharacters.length > 0 && (
                  <div className="pt-2 border-t border-amber-100 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-bold text-stone-700">प्रमुख पात्र:</span>
                    {currentReadingChapter.keyCharacters.map((c, cIdx) => (
                      <span key={cIdx} className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dharma & Wisdom Lesson */}
                {currentReadingChapter.dharmaLesson && (
                  <div className="p-3 bg-amber-50/90 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-950 font-serif">
                    <strong className="text-red-950 block mb-0.5 font-sans text-xs uppercase tracking-wide">
                      💡 इस अध्याय का नीति व दार्शनिक संदेश:
                    </strong>
                    {currentReadingChapter.dharmaLesson}
                  </div>
                )}

                {/* Sequential Chapter Navigation Buttons */}
                <div className="flex items-center justify-between pt-3 border-t-2 border-amber-200/80">
                  <button
                    disabled={currentReaderChapterNumber <= 1}
                    onClick={() => {
                      if (currentReaderChapterNumber > 1) {
                        setCurrentReaderChapterNumber(currentReaderChapterNumber - 1);
                      }
                    }}
                    className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 disabled:hover:bg-amber-100 text-amber-950 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>पिछला अध्याय ({currentReaderChapterNumber > 1 ? currentReaderChapterNumber - 1 : 1})</span>
                  </button>

                  <button
                    onClick={() => {
                      const parva = MAHABHARAT_18_PARVAS.find(p => p.parvaNumber === currentReaderParvaNumber);
                      if (parva) setSelectedParva(parva);
                      setActiveTab('18_parvas');
                    }}
                    className="text-xs text-red-800 hover:text-red-950 font-bold underline hidden sm:inline"
                  >
                    पर्व विवरण देखें
                  </button>

                  <button
                    disabled={currentReaderChapterNumber >= maxChaptersInCurrentParva}
                    onClick={() => {
                      if (currentReaderChapterNumber < maxChaptersInCurrentParva) {
                        setCurrentReaderChapterNumber(currentReaderChapterNumber + 1);
                      }
                    }}
                    className="px-3.5 py-2 bg-red-800 hover:bg-red-900 disabled:opacity-40 disabled:hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>अगला अध्याय ({currentReaderChapterNumber < maxChaptersInCurrentParva ? currentReaderChapterNumber + 1 : maxChaptersInCurrentParva})</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            </div>
          )}

          {/* TAB: 100 SUB-PARVAS (सम्पूर्ण १०० उप-पर्व एवं अध्याय-वार प्रामाणिक कोष) */}
          {activeTab === '100_sub_parvas' && (
            <div className="space-y-5">
              {/* Header Hero Banner */}
              <div className="bg-gradient-to-r from-orange-950 via-stone-900 to-red-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-400/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
                        शतसाहस्री संहिता प्रामाणिक विभाजन
                      </span>
                      <span className="text-xs bg-orange-800/80 text-amber-200 px-2 py-0.5 rounded-full">
                        कुल १०० उप-पर्व • १,९९५ अध्याय
                      </span>
                    </div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                      सम्पूर्ण महाभारत के सभी पर्वों के अध्याय (१०० उप-पर्व व सर्व अध्याय कोष)
                    </h3>
                    <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-3xl font-serif">
                      महर्षि वेदव्यास जी द्वारा विरचित अठारह प्रमुख पर्वों के अंतर्गत आने वाले सभी १०० उप-पर्वों और १,९९५ अध्यायों का प्रामाणिक, विस्तृत अध्याय-वार इतिहास एवं दार्शनिक रहस्य।
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    {/* View Switcher between Cards and Matrix */}
                    <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/30 text-xs">
                      <button
                        onClick={() => setSubParvasViewMode('cards')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                          subParvasViewMode === 'cards'
                            ? 'bg-amber-400 text-stone-950 shadow-xs'
                            : 'text-amber-200 hover:text-white'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>विस्तृत वाचन</span>
                      </button>
                      <button
                        onClick={() => setSubParvasViewMode('matrix')}
                        className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                          subParvasViewMode === 'matrix'
                            ? 'bg-amber-400 text-stone-950 shadow-xs'
                            : 'text-amber-200 hover:text-white'
                        }`}
                      >
                        <Scroll className="w-3.5 h-3.5" />
                        <span>अध्याय तालिका</span>
                      </button>
                    </div>

                    <span className="text-xs bg-amber-500/20 text-amber-200 border border-amber-400/40 px-2.5 py-1 rounded-xl block font-mono font-bold">
                      {filteredSubParvas.length} / 100 उप-पर्व
                    </span>
                  </div>
                </div>
              </div>

              {/* Parva Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                <button
                  onClick={() => setSelectedSubParvaFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors shrink-0 ${
                    selectedSubParvaFilter === 'all'
                      ? 'bg-orange-800 text-white shadow-xs'
                      : 'bg-amber-100 text-stone-800 hover:bg-amber-200'
                  }`}
                >
                  सभी १८ पर्व (१०० उप-पर्व • १,९९५ अध्याय)
                </button>
                {MAHABHARAT_18_PARVAS.map((p) => {
                  const countInParva = MAHABHARAT_100_SUB_PARVAS.filter(sp => sp.majorParvaNumber === p.parvaNumber).length;
                  return (
                    <button
                      key={p.parvaNumber}
                      onClick={() => setSelectedSubParvaFilter(p.parvaNumber)}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors shrink-0 ${
                        selectedSubParvaFilter === p.parvaNumber
                          ? 'bg-red-800 text-white font-bold shadow-xs'
                          : 'bg-white hover:bg-amber-100 text-stone-800 border border-amber-200'
                      }`}
                    >
                      {p.parvaNumber}. {p.parvaNameHindi.replace(' (अरण्य पर्व)', '')} ({countInParva} उप-पर्व • {p.totalChaptersApprox} अ.)
                    </button>
                  );
                })}
              </div>

              {/* VIEW 1: MATRIX TABLE OF CHAPTERS */}
              {subParvasViewMode === 'matrix' && (
                <div className="bg-white border-2 border-amber-300 rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-red-950 to-orange-950 p-4 text-white flex flex-wrap items-center justify-between gap-2 border-b border-amber-400/40">
                    <div>
                      <h4 className="font-serif font-black text-base sm:text-lg text-amber-200">
                        📜 सम्पूर्ण महाभारत: १८ पर्व, १०० उप-पर्व एवं १,९९५ अध्याय अनुक्रमणिका
                      </h4>
                      <p className="text-xs text-amber-100/90 mt-0.5 font-serif">
                        व्यास रचित शतसाहस्री संहिता — एक-एक पर्व, उप-पर्व एवं अध्याय विस्तार की प्रामाणिक सूची
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-400 text-stone-950 px-2.5 py-1 rounded-full">
                      {filteredSubParvas.length} उप-पर्व प्रदर्शित
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300 text-xs">
                          <th className="py-2.5 px-3 whitespace-nowrap">उप-पर्व #</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">पर्व (Parva)</th>
                          <th className="py-2.5 px-3">उप-पर्व नाम</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">अध्याय विस्तार</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">अध्याय संख्या</th>
                          <th className="py-2.5 px-3">मुख्य आख्यान व विषय</th>
                          <th className="py-2.5 px-3 text-right whitespace-nowrap">कार्य</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100 font-sans">
                        {filteredSubParvas.map((sp) => (
                          <tr
                            key={sp.subParvaId}
                            className="hover:bg-amber-50/80 transition-colors"
                          >
                            <td className="py-3 px-3 font-bold text-red-900 whitespace-nowrap">
                              <span className="w-6 h-6 rounded-full bg-red-100 border border-red-300 text-red-950 text-xs inline-flex items-center justify-center font-mono">
                                {sp.subParvaId}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-semibold text-stone-800">
                              <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded text-xs font-medium">
                                {sp.majorParvaNameHindi}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-serif font-bold text-red-950">
                              {sp.subParvaNameHindi}
                              <span className="text-[11px] text-stone-500 font-normal block font-sans">
                                ({sp.subParvaNameSanskrit})
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-amber-950 whitespace-nowrap">
                              <span className="bg-red-50 text-red-900 border border-red-200 px-2 py-0.5 rounded text-xs">
                                {sp.chapterRange}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-semibold text-stone-700 whitespace-nowrap">
                              {sp.chaptersCount} अध्याय
                            </td>
                            <td className="py-3 px-3 text-xs text-stone-700 font-serif max-w-xs sm:max-w-md">
                              <p className="line-clamp-2">{sp.detailedSummaryHindi}</p>
                            </td>
                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedSubParvaFilter(sp.majorParvaNumber);
                                  setSubParvasViewMode('cards');
                                }}
                                className="px-2.5 py-1 bg-red-800 hover:bg-red-900 text-white rounded text-xs font-semibold shadow-2xs"
                              >
                                विस्तार देखें →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VIEW 2: DETAILED CARDS OF CHAPTERS */}
              {subParvasViewMode === 'cards' && (
                <div className="space-y-4">
                {filteredSubParvas.map((sp) => (
                  <div
                    key={sp.subParvaId}
                    className="p-5 sm:p-6 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:border-orange-500 transition-all space-y-3.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-amber-900 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                          {sp.subParvaId}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px]">
                              {sp.majorParvaNameHindi} (पर्व #{sp.majorParvaNumber})
                            </span>
                            <span className="bg-red-100 text-red-900 font-bold px-2 py-0.5 rounded text-[11px]">
                              {sp.chapterRange} ({sp.chaptersCount} अध्याय)
                            </span>
                          </div>
                          <h4 className="font-serif font-black text-lg sm:text-xl text-red-950 mt-0.5">
                            उप-पर्व #{sp.subParvaId}: {sp.subParvaNameHindi} ({sp.subParvaNameSanskrit})
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(`${sp.subParvaNameHindi}। ${sp.detailedSummaryHindi}`)}
                          className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                          title="सस्वर सुनें"
                        >
                          {isSpeaking && activeSpeakingText?.includes(sp.subParvaNameHindi) ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-600" />
                              <span>रोकें</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>सुनें</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(
                            `[महाभारत उप-पर्व #${sp.subParvaId}: ${sp.subParvaNameHindi}]\nपर्व: ${sp.majorParvaNameHindi} | ${sp.chapterRange}\n\n${sp.detailedSummaryHindi}\n\nप्रमुख प्रसंग:\n${sp.keyEventsAndNarratives.join('\n')}\n\nदार्शनिक रहस्य: ${sp.philosophicalSignificance}`,
                            sp.subParvaNameHindi
                          )}
                          className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                          title="कॉपी करें"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Detailed Summary */}
                    <div className="p-3.5 bg-amber-50/60 rounded-xl text-stone-800 text-xs sm:text-sm leading-relaxed font-serif border border-amber-200/50">
                      <strong className="text-red-950 block mb-1">विस्तृत उप-पर्व सारांश:</strong>
                      {sp.detailedSummaryHindi}
                    </div>

                    {/* Key Events and Narratives list */}
                    <div>
                      <span className="text-[11px] font-bold text-red-950 block mb-1 uppercase tracking-wide">
                        मुख्य ऐतिहासिक प्रसंग व आख्यान:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {sp.keyEventsAndNarratives.map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            className="text-xs bg-red-50/70 border border-red-200/70 text-red-950 p-2 rounded-lg font-medium flex items-start gap-1.5"
                          >
                            <span className="text-red-700 font-bold shrink-0">✦</span>
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Philosophical Significance */}
                    <div className="p-2.5 bg-gradient-to-r from-amber-100/70 to-orange-100/50 rounded-xl text-xs text-amber-950 border border-amber-300/60">
                      <strong>गूढ़ दार्शनिक संदेश:</strong> {sp.philosophicalSignificance}
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* TAB 3: GITA ESSENCE */}
          {activeTab === 'gita_essence' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-amber-950 via-red-950 to-stone-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-400/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-400 text-stone-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    भीष्म पर्व अध्याय २५ से ४२
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                  श्रीमद्भगवद्गीता के १८ अध्यायों का अमृत सार
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-3xl font-serif">
                  कुरुक्षेत्र के धर्मक्षेत्र में योगेश्वर श्रीकृष्ण द्वारा विषादग्रस्त गांडीवधारी अर्जुन को दिया गया आत्मज्ञान और निष्काम कर्मयोग का अमर उपदेश।
                </p>
              </div>

              <div className="space-y-4">
                {GITA_18_CHAPTERS_OVERVIEW.map((gita) => (
                  <div
                    key={gita.chapterNumber}
                    className="p-5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-800 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
                          अध्याय {gita.chapterNumber}
                        </span>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-red-950">
                          {gita.titleHindi}
                        </h4>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-semibold">
                        {gita.versesCount} श्लोक
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                      {gita.essenceHindi}
                    </p>

                    <div className="p-3 bg-red-50/80 border-l-4 border-red-700 rounded-r-xl space-y-1.5">
                      <div className="font-serif text-sm sm:text-base text-red-950 font-bold leading-relaxed whitespace-pre-line">
                        {gita.keyVerseSanskrit}
                      </div>
                      <p className="text-xs sm:text-sm text-stone-800 font-sans">
                        <strong>भावार्थ:</strong> {gita.keyVerseMeaning}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleSpeak(`${gita.titleHindi}। ${gita.keyVerseSanskrit}। भावार्थ: ${gita.keyVerseMeaning}`)}
                        className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>सस्वर पाठ</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(
                          `[श्रीमद्भगवद्गीता - अध्याय ${gita.chapterNumber}: ${gita.titleHindi}]\n${gita.keyVerseSanskrit}\nभावार्थ: ${gita.keyVerseMeaning}`,
                          gita.titleHindi
                        )}
                        className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: YAKSHA PRASHNA */}
          {activeTab === 'yaksha_prashna' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-blue-400/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-400 text-stone-950 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    वन पर्व (अरण्य पर्व)
                  </span>
                </div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-blue-200">
                  यक्ष-युधिष्ठिर अमर संवाद (The Eternal Yaksha Prashna)
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-3xl font-serif">
                  द्वैत वन के सरोवर तट पर यक्ष रूपी धर्मराज के गूढ़ प्रश्नों का युधिष्ठिर द्वारा दिया गया परम दार्शनिक और कालजयी उत्तर।
                </p>
              </div>

              <div className="space-y-4">
                {YAKSHA_PRASHNA_CANON.map((yp) => (
                  <div
                    key={yp.questionNumber}
                    className="p-5 bg-white border-2 border-blue-200 rounded-2xl shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2 border-b border-blue-100 pb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-800 text-white text-xs font-bold flex items-center justify-center">
                        {yp.questionNumber}
                      </span>
                      <h4 className="font-serif font-bold text-base text-blue-950">
                        यक्ष प्रश्न #{yp.questionNumber}
                      </h4>
                    </div>

                    <div className="p-3 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-xl">
                      <span className="text-[11px] font-bold text-amber-900 block uppercase">
                        यक्ष का प्रश्न:
                      </span>
                      <p className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-relaxed">
                        {yp.yakshaQuestion}
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 border-l-4 border-emerald-600 rounded-r-xl">
                      <span className="text-[11px] font-bold text-emerald-900 block uppercase">
                        धर्मराज युधिष्ठिर का उत्तर:
                      </span>
                      <p className="font-serif font-bold text-stone-900 text-sm sm:text-base leading-relaxed">
                        {yp.yudhishthirAnswer}
                      </p>
                    </div>

                    <div className="p-2.5 bg-blue-50/50 rounded-xl text-xs text-blue-950 font-medium">
                      <strong>गूढ़ संदेश:</strong> {yp.philosophicalMeaning}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleSpeak(`प्रश्न: ${yp.yakshaQuestion}। युधिष्ठिर उत्तर: ${yp.yudhishthirAnswer}`)}
                        className="px-2.5 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-950 text-xs font-semibold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>सुनें</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CELEBRATED EPISODES */}
          {activeTab === 'episodes' && (
            <div className="space-y-4">
              {MAHABHARAT_CELEBRATED_EPISODES.map((ep) => (
                <div
                  key={ep.episodeId}
                  className="p-5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-800 text-white font-bold px-2.5 py-0.5 rounded-full text-xs">
                        {ep.parvaNameHindi}
                      </span>
                      <h4 className="font-serif font-black text-lg sm:text-xl text-red-950">
                        {ep.titleHindi}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleSpeak(`${ep.titleHindi}। ${ep.summaryHindi}। ${ep.fullStoryParagraphs.join(' ')}`)}
                      className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>सस्वर सुनें</span>
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 font-serif">
                    {ep.subtitleHindi}
                  </p>

                  {ep.shlokaSanskrit && (
                    <div className="p-3 bg-red-50/70 border-l-4 border-red-700 rounded-r-xl font-serif text-sm sm:text-base text-red-950 font-bold leading-relaxed text-center">
                      {ep.shlokaSanskrit}
                    </div>
                  )}

                  <div className="space-y-2 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                    {ep.fullStoryParagraphs.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  <div className="p-3 bg-amber-50/80 rounded-xl text-xs text-amber-950 border border-amber-200">
                    <strong>दार्शनिक शिक्षा:</strong> {ep.philosophicalTeaching}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="bg-amber-100/90 border-t border-amber-900/20 px-4 py-2.5 flex items-center justify-between text-xs text-stone-700 shrink-0">
          <span className="font-serif">
            यतो धर्मस्ततो जयः • सम्पूर्ण महाभारत (गीताप्रेस पाठानुसार १८ पर्व)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white rounded-lg font-bold"
            >
              विश्राम करें
            </button>
          </div>
        </footer>

      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-amber-400 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
