import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  Share2, 
  Copy, 
  Volume2, 
  VolumeX, 
  Scroll, 
  Compass, 
  Flame,
  MapPin,
  Check
} from 'lucide-react';
import { 
  SHIV_PURAN_SAMHITAS, 
  JYOTIRLINGAS_CANON, 
  SHIV_PURAN_CHAPTERS, 
  SHIV_STOTRAS_CANON,
  ShivPuranChapter,
  JyotirlingaInfo,
  ShivStotra
} from '../data/shivPuranData';

interface ShivPuranModalProps {
  onClose: () => void;
  onOpenRamayan?: () => void;
  onOpenVishnuPuran?: () => void;
  onOpenMahabharat?: () => void;
  onOpenKrishnaKatha?: () => void;
}

type ShivPuranViewTab = 'samhitas' | 'jyotirlingas' | 'chapters' | 'stotras';

export const ShivPuranModal: React.FC<ShivPuranModalProps> = ({
  onClose,
  onOpenRamayan,
  onOpenVishnuPuran,
  onOpenMahabharat,
  onOpenKrishnaKatha,
}) => {
  const [activeTab, setActiveTab] = useState<ShivPuranViewTab>('samhitas');
  const [selectedSamhitaId, setSelectedSamhitaId] = useState<string>('all');
  const [selectedChapter, setSelectedChapter] = useState<ShivPuranChapter | null>(SHIV_PURAN_CHAPTERS[0]);
  const [selectedJyotirlinga, setSelectedJyotirlinga] = useState<JyotirlingaInfo | null>(JYOTIRLINGAS_CANON[0]);
  const [selectedStotra, setSelectedStotra] = useState<ShivStotra>(SHIV_STOTRAS_CANON[0]);
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

  const filteredChapters = useMemo(() => {
    let list = SHIV_PURAN_CHAPTERS;
    if (selectedSamhitaId !== 'all') {
      list = list.filter((ch) => ch.samhitaId === selectedSamhitaId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((ch) => 
        ch.titleHindi.toLowerCase().includes(q) ||
        ch.subtitleHindi.toLowerCase().includes(q) ||
        ch.summaryHindi.toLowerCase().includes(q) ||
        ch.fullStoryParagraphs.some((p) => p.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedSamhitaId, searchQuery]);

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

      <div className="relative bg-[#fffdf5] w-full max-w-5xl rounded-2xl shadow-2xl border-2 border-amber-600/40 overflow-hidden my-auto max-h-[96vh] flex flex-col z-10">
        
        {/* Top Header */}
        <header className="bg-gradient-to-r from-[#1c1917] via-[#431407] to-[#7f1d1d] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0 border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              <Flame className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-100 tracking-wide flex items-center gap-1.5">
                  🔱 श्री शिव महापुराण
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase hidden sm:inline">
                  सम्पूर्ण ७ संहिताएं
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/90 font-serif">
                विद्येश्वर, रुद्र, शतरुद्र, कोटिरुद्र, उमा, कैलास व वायु संहिता • द्वादश १२ ज्योतिर्लिंग • पावन स्तोत्र व कथाएं
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Multiplier */}
            <div className="hidden sm:flex items-center bg-stone-900/60 rounded-lg p-0.5 border border-amber-500/30 text-xs">
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
        <div className="bg-amber-950/20 border-b border-amber-900/20 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs shrink-0 font-medium">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-amber-950 flex items-center gap-1 font-serif">
              <span>📖 सनातन ग्रंथ सागर:</span>
            </span>
            <span className="bg-red-800 text-white font-bold px-2 py-0.5 rounded-md text-[11px] ring-1 ring-amber-400">
              🔱 शिव महापुराण
            </span>
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
            {onOpenMahabharat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMahabharat();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                🏹 महाभारत (१८ पर्व)
              </button>
            )}
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
        <div className="bg-[#fef9ee] border-b border-amber-200/80 px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('samhitas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'samhitas'
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>सम्पूर्ण ७ संहिताएं</span>
            </button>

            <button
              onClick={() => setActiveTab('jyotirlingas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'jyotirlingas'
                  ? 'bg-red-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>द्वादश १२ ज्योतिर्लिंग</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'chapters'
                  ? 'bg-orange-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>प्रमुख अध्याय व कथाएं</span>
            </button>

            <button
              onClick={() => setActiveTab('stotras')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'stotras'
                  ? 'bg-stone-800 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>शिव स्तोत्र व मंत्र</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[140px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="संहिता, ज्योतिर्लिंग या कथा खोजें..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
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
          
          {/* TAB 1: SAMHITAS OVERVIEW */}
          {activeTab === 'samhitas' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-red-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-amber-500/40">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                  श्री शिव महापुराण की पावन सप्त संहिताएं (7 Samhitas)
                </h3>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-3xl font-serif">
                  वेदव्यास जी द्वारा २४,००० श्लोकों में संकलित यह महापुराण भगवान शिव के सगुण, निर्गुण, अवतारी एवं कल्याणकारी स्वरूप का अमर कोष है।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHIV_PURAN_SAMHITAS.map((sam, idx) => (
                  <div
                    key={sam.id}
                    className="p-4 sm:p-5 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:border-amber-500 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-red-950">
                          {sam.nameHindi}
                        </h4>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-950 px-2 py-0.5 rounded font-semibold">
                        लगभग {sam.totalChaptersApprox} अध्याय
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                      {sam.description}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-red-900 block mb-1">
                        प्रमुख विषय व रहस्य:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sam.coreThemes.map((th, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] bg-amber-50 border border-amber-200 text-amber-950 px-2 py-0.5 rounded-md font-medium"
                          >
                            • {th}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-amber-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedSamhitaId(sam.id);
                          setActiveTab('chapters');
                        }}
                        className="text-xs font-bold text-red-800 hover:text-red-950 flex items-center gap-1"
                      >
                        <span>इस संहिता की कथाएं पढ़ें →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: JYOTIRLINGAS CANON */}
          {activeTab === 'jyotirlingas' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-red-950 via-amber-950 to-stone-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                    भारतवर्ष के द्वादश १२ ज्योतिर्लिंग (12 Holy Jyotirlingas)
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100/90 font-serif mt-1">
                    सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम्... नित्य स्मरण से सात जन्मों के संचित पापों का शमन होता है।
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="bg-amber-400 text-red-950 font-bold text-xs px-3 py-1 rounded-full uppercase shadow-xs">
                    कोटिरुद्र संहिता प्रमाण
                  </span>
                </div>
              </div>

              {/* Grid of 12 Jyotirlingas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {JYOTIRLINGAS_CANON.map((jy) => (
                  <div
                    key={jy.index}
                    className="p-4 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:border-red-600 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-red-800 text-white text-xs font-black flex items-center justify-center">
                          {jy.index}
                        </span>
                        <h4 className="font-serif font-bold text-base text-red-950">
                          {jy.name}
                        </h4>
                      </div>
                      <span className="text-xs bg-red-100 text-red-900 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {jy.state}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-amber-900">
                      स्थान: <span className="text-stone-800 font-normal">{jy.location}</span>
                    </p>

                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-stone-800 space-y-1">
                      <span className="font-bold text-red-900 block text-[11px]">
                        प्राकट्य कथा व महत्ता:
                      </span>
                      <p className="leading-relaxed">{jy.manifestationStory}</p>
                    </div>

                    <div className="text-[11px] font-serif text-stone-600 italic border-t border-amber-100 pt-1.5 flex items-center justify-between">
                      <span>{jy.shloka}</span>
                      <button
                        onClick={() => handleSpeak(`${jy.name} ज्योतिर्लिंग। ${jy.location}। ${jy.manifestationStory}`)}
                        className="text-amber-800 hover:text-red-900 p-1"
                        title="सस्वर सुनें"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHAPTERS & STORIES */}
          {activeTab === 'chapters' && (
            <div className="space-y-5">
              {/* Filter by Samhita pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                <button
                  onClick={() => setSelectedSamhitaId('all')}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
                    selectedSamhitaId === 'all'
                      ? 'bg-red-800 text-white'
                      : 'bg-amber-100 text-stone-800 hover:bg-amber-200'
                  }`}
                >
                  सभी संहिताएं ({SHIV_PURAN_CHAPTERS.length})
                </button>
                {SHIV_PURAN_SAMHITAS.map((sam) => (
                  <button
                    key={sam.id}
                    onClick={() => setSelectedSamhitaId(sam.id)}
                    className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                      selectedSamhitaId === sam.id
                        ? 'bg-red-800 text-white'
                        : 'bg-amber-100 text-stone-800 hover:bg-amber-200'
                    }`}
                  >
                    {sam.nameHindi}
                  </button>
                ))}
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                {filteredChapters.map((ch) => (
                  <div
                    key={ch.chapterId}
                    className="p-5 bg-white border border-amber-200 rounded-2xl shadow-sm hover:border-amber-400 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-800 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          अध्याय #{ch.chapterId}
                        </span>
                        <span className="bg-amber-100 text-amber-950 font-bold px-2 py-0.5 rounded">
                          {ch.samhitaName}
                        </span>
                        {ch.khandName && (
                          <span className="bg-orange-100 text-orange-900 font-semibold px-2 py-0.5 rounded">
                            {ch.khandName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(`${ch.titleHindi}। ${ch.summaryHindi}। ${ch.fullStoryParagraphs.join(' ')}`)}
                          className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-950 font-semibold flex items-center gap-1"
                          title="सस्वर सुनें"
                        >
                          {isSpeaking && activeSpeakingText?.includes(ch.titleHindi) ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-600" />
                              <span>रोकें</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span>सस्वर पाठ</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(
                            `${ch.titleHindi}\n${ch.subtitleHindi}\n\nसार: ${ch.summaryHindi}\n\n[श्री शिव महापुराण - ${ch.samhitaName}]`,
                            ch.titleHindi
                          )}
                          className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700"
                          title="कॉपी करें"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif font-black text-lg sm:text-xl text-red-950">
                        {ch.titleHindi}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-serif">
                        {ch.subtitleHindi}
                      </p>
                    </div>

                    {ch.shlokaOrMantra && (
                      <div className="p-3 bg-red-50/70 border-l-4 border-red-700 rounded-r-xl text-center font-serif text-sm sm:text-base text-red-950 font-bold leading-relaxed">
                        {ch.shlokaOrMantra}
                      </div>
                    )}

                    <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs sm:text-sm text-stone-800">
                      <span className="font-bold text-red-900 block mb-0.5 text-[11px] uppercase tracking-wide">
                        कथा सार संक्षेप:
                      </span>
                      <p className="leading-relaxed font-sans">{ch.summaryHindi}</p>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                      {ch.fullStoryParagraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {ch.keyTeachings && ch.keyTeachings.length > 0 && (
                      <div className="pt-2 border-t border-amber-100">
                        <span className="text-[11px] font-bold text-red-900 block mb-1">
                          कल्याणकारी आध्यात्मिक सीख:
                        </span>
                        <ul className="list-disc list-inside text-xs text-stone-700 space-y-0.5">
                          {ch.keyTeachings.map((teach, tIdx) => (
                            <li key={tIdx}>{teach}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STOTRAS & MANTRAS */}
          {activeTab === 'stotras' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {SHIV_STOTRAS_CANON.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStotra(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      selectedStotra.id === st.id
                        ? 'bg-red-800 text-white shadow-sm'
                        : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    {st.titleHindi}
                  </button>
                ))}
              </div>

              {/* Active Stotra Card */}
              <div className="p-5 bg-white border-2 border-amber-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-3">
                  <div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-red-950">
                      {selectedStotra.titleHindi}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      रचनाकार: <strong className="text-stone-900">{selectedStotra.author}</strong> • {selectedStotra.significance}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(selectedStotra.verses.map((v) => `${v.sanskrit}। अर्थ: ${v.hindiMeaning}`).join(' '))}
                      className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>सस्वर स्तोत्र पाठ</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(
                        `${selectedStotra.titleHindi}\n\n${selectedStotra.verses.map((v) => `${v.sanskrit}\nअर्थ: ${v.hindiMeaning}`).join('\n\n')}`,
                        selectedStotra.titleHindi
                      )}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Verses */}
                <div className="space-y-4">
                  {selectedStotra.verses.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2"
                    >
                      <div className="text-center font-serif text-base sm:text-lg text-red-950 font-bold whitespace-pre-line leading-relaxed">
                        {v.sanskrit}
                      </div>
                      <div className="p-2.5 bg-white/80 border border-amber-200/60 rounded-lg text-xs sm:text-sm text-stone-800">
                        <span className="font-bold text-red-900 block text-[10px] uppercase">
                          हिन्दी भावार्थ:
                        </span>
                        <p className="leading-relaxed font-sans">{v.hindiMeaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="bg-amber-100/90 border-t border-amber-900/20 px-4 py-2.5 flex items-center justify-between text-xs text-stone-700 shrink-0">
          <span className="font-serif">
            ॐ नमः शिवाय • श्री शिव महापुराण (गीताप्रेस पाठानुसार सम्पूर्ण निरूपण)
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
