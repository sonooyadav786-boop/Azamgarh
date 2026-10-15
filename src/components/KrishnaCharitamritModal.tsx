import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Type, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Scroll
} from 'lucide-react';
import { KRISHNA_LEELA_CHAPTERS, KrishnaChapter } from '../data/krishnaLeelaData';
import { DevotionalArtIcon } from './DevotionalArtIcon';

interface KrishnaCharitamritModalProps {
  onClose: () => void;
  onOpenRamayan?: () => void;
  onOpenShivPuran?: () => void;
  onOpenVishnuPuran?: () => void;
  onOpenMahabharat?: () => void;
}

export const KrishnaCharitamritModal: React.FC<KrishnaCharitamritModalProps> = ({ 
  onClose,
  onOpenRamayan,
  onOpenShivPuran,
  onOpenVishnuPuran,
  onOpenMahabharat,
}) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showChapterIndex, setShowChapterIndex] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const currentChapter = KRISHNA_LEELA_CHAPTERS[currentChapterIndex];

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return KRISHNA_LEELA_CHAPTERS.filter((ch) => {
      return (
        ch.titleHindi.toLowerCase().includes(q) ||
        ch.subtitleHindi.toLowerCase().includes(q) ||
        ch.summaryHindi.toLowerCase().includes(q) ||
        ch.fullStoryParagraphs.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const handleShare = () => {
    const text = `🪔 *श्री कृष्ण सम्पूर्ण चरितामृत*
📖 *${currentChapter.titleHindi}*
✨ ${currentChapter.subtitleHindi}
${currentChapter.shlokaOrDoha ? `\n🕉️ ${currentChapter.shlokaOrDoha}\n` : ''}
सार: ${currentChapter.summaryHindi}
📍 आजमगढ़ कैलेंडर ऐप`;

    if (navigator.share) {
      navigator.share({ title: currentChapter.titleHindi, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-4xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#991b1b] text-white p-3.5 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowChapterIndex((s) => !s)}
              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/70 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
              title="अध्याय सूची"
            >
              <Scroll className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">अनुक्रमणिका ({currentChapterIndex + 1}/{KRISHNA_LEELA_CHAPTERS.length})</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg sm:text-2xl font-bold text-amber-100 flex items-center gap-1.5 leading-tight">
                  <span>श्री कृष्ण सम्पूर्ण चरितामृत</span>
                </h3>
                <span className="text-[10px] bg-amber-400 text-red-950 font-bold px-1.5 py-0.5 rounded shadow-xs hidden sm:inline">
                  सम्पूर्ण २४ खण्ड (पूर्ण कथा)
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-red-100 leading-tight">
                श्रीमद्भागवत एवं महाभारत पर आधारित सम्पूर्ण {KRISHNA_LEELA_CHAPTERS.length} खण्ड दिव्य कथा (असंक्षिप्त / बिना शॉर्टकट)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              title="कथा शेयर करें"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Grantha Switcher Bar */}
        {(onOpenRamayan || onOpenShivPuran || onOpenVishnuPuran || onOpenMahabharat) && (
          <div className="bg-amber-950/20 border-b border-amber-900/20 px-3 py-1 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs shrink-0 font-medium">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-amber-950 flex items-center gap-1 font-serif text-[11px] sm:text-xs">
                <span>📖 सनातन ग्रंथ सागर:</span>
              </span>
              <span className="bg-amber-800 text-white font-bold px-2 py-0.5 rounded-md text-[11px] ring-1 ring-amber-400">
                ✨ कृष्ण चरितामृत
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
            </div>
          </div>
        )}

        {/* Top Controls: Search, Quick Chapter Jump & Font Resizer */}
        <div className="bg-amber-50/90 border-b border-amber-900/15 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              placeholder="लीला खोजें (उदा. पूतना, कालिया नाग, गोवर्धन, रुक्मिणी, सुदामा, गीता, विश्वरूप)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-300 rounded-lg pl-7 pr-6 py-1 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-red-800"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Font Resizer */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200">
            <Type className="w-3.5 h-3.5 text-stone-500 ml-1" />
            <button
              onClick={() => setFontSizeMultiplier((f) => Math.max(0.85, f - 0.1))}
              className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded"
              title="अक्षर छोटे करें"
            >
              अ-
            </button>
            <button
              onClick={() => setFontSizeMultiplier((f) => Math.min(1.4, f + 0.1))}
              className="px-2 py-0.5 text-xs font-bold text-stone-700 hover:bg-stone-100 rounded"
              title="अक्षर बड़े करें"
            >
              अ+
            </button>
          </div>
        </div>

        {/* Chapter Index Drawer / Dropdown */}
        {showChapterIndex && (
          <div className="bg-[#fff9ea] border-b border-amber-900/20 p-3 max-h-56 overflow-y-auto space-y-1 text-xs shadow-inner shrink-0">
            <div className="font-bold text-red-950 mb-1.5 flex items-center justify-between">
              <span>सम्पूर्ण {KRISHNA_LEELA_CHAPTERS.length} खण्ड सूची (किसी भी खण्ड पर क्लिक करें):</span>
              <button
                onClick={() => setShowChapterIndex(false)}
                className="text-stone-500 hover:text-stone-800 underline text-[11px]"
              >
                बंद करें ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {KRISHNA_LEELA_CHAPTERS.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setShowChapterIndex(false);
                    setSearchQuery('');
                  }}
                  className={`text-left p-1.5 rounded-lg border transition-all truncate flex items-center gap-1.5 ${
                    currentChapterIndex === idx
                      ? 'bg-[#991b1b] text-white font-bold border-red-900 shadow-xs'
                      : 'bg-white hover:bg-amber-100 text-stone-800 border-amber-200/60'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-[10px]">
                    {ch.chapterNumber}
                  </span>
                  <span className="truncate">{ch.titleHindi}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results Drawer if user is searching */}
        {searchQuery.trim() && (
          <div className="bg-[#fff6dc] border-b border-amber-900/20 p-3 max-h-52 overflow-y-auto space-y-1 text-xs shadow-inner shrink-0">
            <span className="font-bold text-red-900 block mb-1">
              "{searchQuery}" के लिए मिले परिणाम ({searchResults.length}):
            </span>
            {searchResults.length === 0 ? (
              <p className="text-stone-500">कोई प्रसंग नहीं मिला। कृपया अन्य शब्द खोजें।</p>
            ) : (
              searchResults.map((res) => {
                const idx = KRISHNA_LEELA_CHAPTERS.findIndex((c) => c.id === res.id);
                return (
                  <button
                    key={res.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 bg-white hover:bg-amber-100 rounded-lg border border-amber-200 flex flex-col"
                  >
                    <span className="font-bold text-stone-900">{res.titleHindi}</span>
                    <span className="text-[11px] text-stone-600 line-clamp-1">{res.summaryHindi}</span>
                  </button>
                );
              })
            )}
          </div>
        )}

        {/* Main Chapter Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5 bg-[#fffef9]">
          {/* Chapter Title Badge */}
          <div className="border-b border-amber-900/15 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                खण्ड {currentChapter.chapterNumber} / 18
              </span>
              <span className="text-xs text-stone-500 font-medium">
                कालखण्ड: {currentChapter.periodHindi}
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-3xl font-extrabold text-[#7c2d12] mt-2 leading-snug">
              {currentChapter.titleHindi}
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-stone-700 mt-1">
              {currentChapter.subtitleHindi}
            </p>
          </div>

          {/* Sacred Shloka Card */}
          {currentChapter.shlokaOrDoha && (
            <div className="bg-[#fff8e7] border-l-4 border-amber-600 p-3.5 rounded-r-xl shadow-xs text-center">
              <p className="font-heading text-sm sm:text-base font-bold text-red-900 tracking-wide leading-relaxed">
                {currentChapter.shlokaOrDoha}
              </p>
            </div>
          )}

          {/* Chapter Summary Box */}
          <div className="bg-amber-50/80 rounded-xl p-3 sm:p-4 border border-amber-200 text-xs sm:text-sm text-stone-800 leading-relaxed">
            <span className="font-bold text-red-950 block mb-0.5">प्रसंग संक्षेप (Overview):</span>
            <p>{currentChapter.summaryHindi}</p>
          </div>

          {/* Full Detailed Story Paragraphs */}
          <div className="space-y-4 pt-2">
            {currentChapter.fullStoryParagraphs.map((para, idx) => (
              <p
                key={idx}
                style={{ fontSize: `${1.05 * fontSizeMultiplier}rem` }}
                className="font-serif leading-relaxed text-stone-900 text-justify tracking-normal"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Chapter End Marker */}
          <div className="text-center pt-6 pb-2 border-t border-amber-900/15">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest">
              ॥ इति {currentChapter.titleHindi.split(':')[0]} समाप्तम् ॥
            </span>
          </div>
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={() => setCurrentChapterIndex((i) => Math.max(0, i - 1))}
            disabled={currentChapterIndex === 0}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
              currentChapterIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-stone-200 text-stone-500'
                : 'bg-white text-stone-800 hover:bg-stone-50 shadow-xs active:scale-95 border border-stone-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">पिछला खण्ड</span>
          </button>

          <span className="text-xs font-bold text-stone-700">
            खण्ड {currentChapter.chapterNumber} / 18
          </span>

          <button
            onClick={() => setCurrentChapterIndex((i) => Math.min(KRISHNA_LEELA_CHAPTERS.length - 1, i + 1))}
            disabled={currentChapterIndex === KRISHNA_LEELA_CHAPTERS.length - 1}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 transition-all ${
              currentChapterIndex === KRISHNA_LEELA_CHAPTERS.length - 1
                ? 'opacity-40 cursor-not-allowed bg-stone-200 text-stone-500'
                : 'bg-[#991b1b] text-white hover:bg-red-800 shadow-xs active:scale-95'
            }`}
          >
            <span className="hidden sm:inline">अगला खण्ड</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Copied Toast */}
        {copiedToast && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            कथा विवरण कॉपी हो गया!
          </div>
        )}
      </div>
    </div>
  );
};
