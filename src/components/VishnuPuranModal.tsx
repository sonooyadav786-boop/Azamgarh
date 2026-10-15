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
  Compass, 
  Flame,
  Check
} from 'lucide-react';
import { 
  VISHNU_PURAN_ANSHAS, 
  VISHNU_PURAN_CHAPTERS, 
  VISHNU_STOTRAS_CANON,
  VishnuPuranAnsha,
  VishnuPuranChapter,
  VishnuStotra
} from '../data/vishnuPuranData';

interface VishnuPuranModalProps {
  onClose: () => void;
  onOpenRamayan?: () => void;
  onOpenShivPuran?: () => void;
  onOpenMahabharat?: () => void;
  onOpenKrishnaKatha?: () => void;
}

type VishnuPuranViewTab = 'anshas' | 'chapters' | 'stotras';

export const VishnuPuranModal: React.FC<VishnuPuranModalProps> = ({
  onClose,
  onOpenRamayan,
  onOpenShivPuran,
  onOpenMahabharat,
  onOpenKrishnaKatha,
}) => {
  const [activeTab, setActiveTab] = useState<VishnuPuranViewTab>('anshas');
  const [selectedAnshaNumber, setSelectedAnshaNumber] = useState<number | 'all'>('all');
  const [selectedStotra, setSelectedStotra] = useState<VishnuStotra>(VISHNU_STOTRAS_CANON[0]);
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
    let list = VISHNU_PURAN_CHAPTERS;
    if (selectedAnshaNumber !== 'all') {
      list = list.filter((ch) => ch.anshaNumber === selectedAnshaNumber);
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
  }, [selectedAnshaNumber, searchQuery]);

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

      <div className="relative bg-[#fffdf5] w-full max-w-5xl rounded-2xl shadow-2xl border-2 border-cyan-700/40 overflow-hidden my-auto max-h-[96vh] flex flex-col z-10">
        
        {/* Top Header */}
        <header className="bg-gradient-to-r from-[#082f49] via-[#0369a1] to-[#0c4a6e] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md shrink-0 border-b border-cyan-400/30">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-300/40 text-cyan-200">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-100 tracking-wide flex items-center gap-1.5">
                  🪷 श्री विष्णु पुराण
                </h2>
                <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full uppercase hidden sm:inline">
                  सम्पूर्ण १२६ अध्याय (षट् अंश)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-cyan-100/90 font-serif">
                महर्षि पराशर-मैत्रेय संवाद • षट् अंश • सम्पूर्ण १२६ अध्याय • मूल संस्कृत श्लोक व भावार्थ सहित
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font Multiplier */}
            <div className="hidden sm:flex items-center bg-cyan-950/60 rounded-lg p-0.5 border border-cyan-400/30 text-xs">
              <button
                onClick={() => setFontSizeMultiplier((f) => Math.max(0.85, f - 0.1))}
                className="px-2 py-1 hover:bg-cyan-900 rounded text-cyan-200"
                title="अक्षर छोटे करें"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeMultiplier((f) => Math.min(1.3, f + 0.1))}
                className="px-2 py-1 hover:bg-cyan-900 rounded text-cyan-200 font-bold"
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
              className="p-1.5 rounded-lg bg-cyan-950/60 hover:bg-red-950 text-cyan-200 hover:text-white transition-colors"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Quick Grantha Switcher Bar */}
        <div className="bg-cyan-950/15 border-b border-cyan-900/20 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs shrink-0 font-medium">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-cyan-950 flex items-center gap-1 font-serif">
              <span>📖 सनातन ग्रंथ सागर:</span>
            </span>
            <span className="bg-cyan-800 text-white font-bold px-2 py-0.5 rounded-md text-[11px] ring-1 ring-cyan-300">
              🪷 विष्णु पुराण (१२६ अध्याय)
            </span>
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
            {onOpenMahabharat && (
              <button
                onClick={() => {
                  onClose();
                  onOpenMahabharat();
                }}
                className="bg-amber-100 hover:bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md border border-amber-300 text-[11px] transition-colors"
              >
                🏹 महाभारत (१८ पर्व, १०० उप-पर्व)
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
        <div className="bg-[#f0f9ff] border-b border-cyan-200 px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('anshas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'anshas'
                  ? 'bg-cyan-800 text-white shadow-sm'
                  : 'bg-cyan-100 text-cyan-950 hover:bg-cyan-200'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>षट् अंश परिचय (६ अंश)</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'chapters'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'bg-cyan-100 text-cyan-950 hover:bg-cyan-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 सम्पूर्ण १२६ अध्याय वाचन</span>
            </button>

            <button
              onClick={() => setActiveTab('stotras')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'stotras'
                  ? 'bg-indigo-800 text-white shadow-sm'
                  : 'bg-cyan-100 text-cyan-950 hover:bg-cyan-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>श्री विष्णु स्तोत्र व मंत्र</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[140px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="अंश, चरित्र या प्रसंग खोजें..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 rounded-lg bg-white border border-cyan-300 text-stone-900 focus:outline-none focus:ring-1 focus:ring-cyan-600"
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
          
          {/* TAB 1: ANSHAS OVERVIEW */}
          {activeTab === 'anshas' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-cyan-950 via-sky-900 to-blue-950 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-cyan-400/40">
                <h3 className="font-serif font-black text-xl sm:text-2xl text-amber-200">
                  श्री विष्णु पुराण के षट् अंश (The 6 Parts of Vishnu Purana)
                </h3>
                <p className="text-xs sm:text-sm text-cyan-100/90 mt-1 max-w-3xl font-serif">
                  अठारह महापुराणों में अत्यंत आदरणीय और प्रामाणिक वैष्णव ग्रंथ, जिसमें महर्षि वसिष्ठ के पौत्र पराशर जी ने शिष्य मैत्रेय को सम्पूर्ण ब्रह्मांड का रहस्य बतलाया।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VISHNU_PURAN_ANSHAS.map((ans) => (
                  <div
                    key={ans.anshaNumber}
                    className="p-4 sm:p-5 bg-white border-2 border-cyan-200/90 rounded-2xl shadow-sm hover:border-cyan-600 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between border-b border-cyan-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-800 text-white text-xs font-bold flex items-center justify-center">
                          {ans.anshaNumber}
                        </span>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-cyan-950">
                          {ans.anshaNameHindi} ({ans.anshaNameSanskrit})
                        </h4>
                      </div>
                      <span className="text-xs bg-cyan-100 text-cyan-950 px-2 py-0.5 rounded font-semibold">
                        {ans.totalChapters} अध्याय
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                      {ans.description}
                    </p>

                    <div>
                      <span className="text-[11px] font-bold text-cyan-900 block mb-1">
                        प्रमुख प्रसंग व विषय:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ans.majorTopics.map((top, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] bg-cyan-50 border border-cyan-200 text-cyan-950 px-2 py-0.5 rounded-md font-medium"
                          >
                            • {top}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-100 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setSelectedAnshaNumber(ans.anshaNumber);
                          setActiveTab('chapters');
                        }}
                        className="text-xs font-bold text-cyan-800 hover:text-cyan-950 flex items-center gap-1"
                      >
                        <span>इस अंश के अध्याय पढ़ें →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CHAPTERS & STORIES */}
          {activeTab === 'chapters' && (
            <div className="space-y-5">
              {/* Filter by Ansha pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                <button
                  onClick={() => setSelectedAnshaNumber('all')}
                  className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
                    selectedAnshaNumber === 'all'
                      ? 'bg-cyan-800 text-white shadow-xs'
                      : 'bg-cyan-100 text-stone-800 hover:bg-cyan-200'
                  }`}
                >
                  सभी अंश ({VISHNU_PURAN_CHAPTERS.length} अध्याय)
                </button>
                {VISHNU_PURAN_ANSHAS.map((ans) => (
                  <button
                    key={ans.anshaNumber}
                    onClick={() => setSelectedAnshaNumber(ans.anshaNumber)}
                    className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-colors ${
                      selectedAnshaNumber === ans.anshaNumber
                        ? 'bg-cyan-800 text-white shadow-xs'
                        : 'bg-cyan-100 text-stone-800 hover:bg-cyan-200'
                    }`}
                  >
                    {ans.anshaNameHindi} ({ans.totalChapters})
                  </button>
                ))}
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                {filteredChapters.map((ch) => (
                  <div
                    key={ch.chapterId}
                    className="p-5 bg-white border border-cyan-200 rounded-2xl shadow-sm hover:border-cyan-400 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-100 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-cyan-800 text-white font-bold px-2.5 py-0.5 rounded-full text-[11px]">
                          अध्याय #{ch.chapterId % 100}
                        </span>
                        <span className="bg-cyan-100 text-cyan-950 font-bold px-2 py-0.5 rounded">
                          {ch.anshaNameHindi}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSpeak(`${ch.titleHindi}। ${ch.shlokaSanskrit ? ch.shlokaSanskrit + '।' : ''} ${ch.summaryHindi}। ${ch.fullStoryParagraphs.join(' ')}`)}
                          className="px-2.5 py-1 rounded-md bg-cyan-100 hover:bg-cyan-200 text-cyan-950 font-semibold flex items-center gap-1"
                          title="सस्वर सुनें"
                        >
                          {isSpeaking && activeSpeakingText?.includes(ch.titleHindi) ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-600" />
                              <span>रोकें</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-cyan-800" />
                              <span>सस्वर पाठ</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(
                            `${ch.titleHindi}\n${ch.subtitleHindi}\n\n${ch.shlokaSanskrit ? '॥ मूल श्लोक ॥\n' + ch.shlokaSanskrit + '\n\n' : ''}सार: ${ch.summaryHindi}\n\n[श्री विष्णु पुराण - ${ch.anshaNameHindi}]`,
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
                      <h3 className="font-serif font-black text-lg sm:text-xl text-cyan-950">
                        {ch.titleHindi}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-serif">
                        {ch.subtitleHindi}
                      </p>
                    </div>

                    {ch.shlokaSanskrit && (
                      <div className="p-3.5 bg-gradient-to-r from-cyan-950 via-sky-950 to-blue-950 text-amber-200 rounded-xl text-center font-serif text-sm sm:text-base font-bold leading-relaxed border border-cyan-400/40 shadow-xs">
                        <div className="text-[10px] text-cyan-300 font-sans tracking-widest uppercase mb-1">
                          ॥ मूल संस्कृत श्लोक ॥
                        </div>
                        <div className="whitespace-pre-line">{ch.shlokaSanskrit}</div>
                      </div>
                    )}

                    {ch.shlokaOrMantra && !ch.shlokaSanskrit && (
                      <div className="p-3 bg-cyan-50/70 border-l-4 border-cyan-700 rounded-r-xl text-center font-serif text-sm sm:text-base text-cyan-950 font-bold leading-relaxed">
                        {ch.shlokaOrMantra}
                      </div>
                    )}

                    <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs sm:text-sm text-stone-800">
                      <span className="font-bold text-cyan-900 block mb-0.5 text-[11px] uppercase tracking-wide">
                        कथा सार संक्षेप:
                      </span>
                      <p className="leading-relaxed font-sans">{ch.summaryHindi}</p>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-stone-800 leading-relaxed font-serif">
                      {ch.fullStoryParagraphs.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {ch.philosophicalTeaching && (
                      <div className="p-2.5 bg-gradient-to-r from-cyan-50 to-amber-50 border border-cyan-200 rounded-xl text-xs text-cyan-950">
                        <span className="font-bold text-cyan-900">दार्शनिक संदेश: </span>
                        <span>{ch.philosophicalTeaching}</span>
                      </div>
                    )}

                    {ch.keyTeachings && ch.keyTeachings.length > 0 && (
                      <div className="pt-2 border-t border-cyan-100">
                        <span className="text-[11px] font-bold text-cyan-900 block mb-1">
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

          {/* TAB 3: STOTRAS & MANTRAS */}
          {activeTab === 'stotras' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {VISHNU_STOTRAS_CANON.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStotra(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      selectedStotra.id === st.id
                        ? 'bg-cyan-800 text-white shadow-sm'
                        : 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200'
                    }`}
                  >
                    {st.titleHindi}
                  </button>
                ))}
              </div>

              {/* Active Stotra Card */}
              <div className="p-5 bg-white border-2 border-cyan-200 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-100 pb-3">
                  <div>
                    <h3 className="font-serif font-black text-xl sm:text-2xl text-cyan-950">
                      {selectedStotra.titleHindi}
                    </h3>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {selectedStotra.significance}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSpeak(selectedStotra.verses.map((v) => `${v.sanskrit}। अर्थ: ${v.hindiMeaning}`).join(' '))}
                      className="px-3 py-1.5 rounded-lg bg-cyan-800 hover:bg-cyan-900 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
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
                      className="p-4 bg-cyan-50/50 border border-cyan-200/80 rounded-xl space-y-2"
                    >
                      <div className="text-center font-serif text-base sm:text-lg text-cyan-950 font-bold whitespace-pre-line leading-relaxed">
                        {v.sanskrit}
                      </div>
                      <div className="p-2.5 bg-white/80 border border-cyan-200/60 rounded-lg text-xs sm:text-sm text-stone-800">
                        <span className="font-bold text-cyan-900 block text-[10px] uppercase">
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
        <footer className="bg-cyan-100/90 border-t border-cyan-900/20 px-4 py-2.5 flex items-center justify-between text-xs text-stone-700 shrink-0">
          <span className="font-serif">
            ॐ नमो भगवते वासुदेवाय • श्री विष्णु पुराण (गीताप्रेस पाठानुसार सम्पूर्ण ६ अंश)
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-cyan-400 animate-fade-in">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
