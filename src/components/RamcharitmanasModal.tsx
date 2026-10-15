import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  BookOpen,
  Volume2,
  VolumeX,
  Bookmark,
  Share2,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sun,
  Flame,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Heart,
  Scroll,
  ListOrdered,
  Calendar,
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import {
  RAMCHARITMANAS_KANDS,
  RAMCHARITMANAS_STRUCTURE,
  RAMAYAN_AARTI,
  RAM_STUTI,
  RAMAYAN_PATH_VIDHI,
  NAVAHNA_PARAYAN_SCHEDULE,
  POPULAR_SAMPUTS,
  SUNDARKAND_FULL_DOHAS,
  BALA_FULL_DOHAS,
  AYODHYA_FULL_DOHAS,
  ARANYA_FULL_DOHAS,
  KISHKINDHA_FULL_DOHAS,
  LANKA_FULL_DOHAS,
  UTTARA_FULL_DOHAS,
  ALL_KANDS_FULL_DOHAS,
  KAND_DOHA_SECTIONS,
  RAMCHARITMANAS_STATS_VERIFIED,
  ALL_4638_CHAUPAIS,
  FAMOUS_CHAUPAIS_CANON,
  KAND_CHAUPAI_METRICS,
  TOTAL_CHAUPAIS_VERIFIED,
  ALL_CANONICAL_CHHANDS,
  KAND_CHHAND_METRICS,
  TOTAL_CHHANDS_VERIFIED,
  CORE_86_CHHAND_TITLES,
  ChaupaiRecord,
  ChhandRecord,
  RamayanKand,
  RamayanPrasang,
  ChaupaiVerse,
  SundarkandDohaUnit
} from '../data/ramcharitmanasData';

interface RamcharitmanasModalProps {
  onClose: () => void;
  initialKandId?: string;
  onOpenShivPuran?: () => void;
  onOpenVishnuPuran?: () => void;
  onOpenMahabharat?: () => void;
  onOpenKrishnaKatha?: () => void;
}

type BookTheme = 'pothi' | 'classic' | 'temple' | 'night';
type ActiveView =
  | 'kand'
  | 'continuous_pothi'
  | 'all_dohas_full'
  | 'doha_index'
  | 'chaupai_corpus'
  | 'chhand_corpus'
  | 'structure'
  | 'path_vidhi'
  | 'aarti'
  | 'stuti'
  | 'parayan';

export const RamcharitmanasModal: React.FC<RamcharitmanasModalProps> = ({
  onClose,
  initialKandId,
  onOpenShivPuran,
  onOpenVishnuPuran,
  onOpenMahabharat,
  onOpenKrishnaKatha,
}) => {
  // Navigation State
  const [selectedKandIndex, setSelectedKandIndex] = useState<number>(0);
  const [selectedPrasangIndex, setSelectedPrasangIndex] = useState<number>(0);
  const [activeView, setActiveView] = useState<ActiveView>('kand');
  const [showKandDrawer, setShowKandDrawer] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Comprehensive Doha Reader State (for ALL 7 Kandas)
  const [dohaReaderKandIndex, setDohaReaderKandIndex] = useState<number>(0); // Default to Balakand (index 0)
  const [activeDohaFilter, setActiveDohaFilter] = useState<number | string | null>(null);
  const [dohaJumpInput, setDohaJumpInput] = useState<string>('');
  const [dohaFilterSearch, setDohaFilterSearch] = useState<string>('');
  const [showDohaGrid, setShowDohaGrid] = useState<boolean>(false);

  // Doha Index View State
  const [dohaIndexFilterKand, setDohaIndexFilterKand] = useState<number | null>(null);
  const [expandedIndexKandDohas, setExpandedIndexKandDohas] = useState<number | null>(null);
  const [indexSearchQuery, setIndexSearchQuery] = useState<string>('');

  // 4,638 Chaupai Corpus State
  const [chaupaiKandFilter, setChaupaiKandFilter] = useState<number | 'all'>('all');
  const [chaupaiSearch, setChaupaiSearch] = useState<string>('');
  const [chaupaiJumpNumber, setChaupaiJumpNumber] = useState<string>('');
  const [chaupaiOnlyFamous, setChaupaiOnlyFamous] = useState<boolean>(false);
  const [chaupaiPage, setChaupaiPage] = useState<number>(1);
  const CHAUPAIS_PER_PAGE = 30;

  // Canonical Chhand Corpus State (231 / 86 Chhands)
  const [chhandKandFilter, setChhandKandFilter] = useState<number | 'all'>('all');
  const [chhandMeterFilter, setChhandMeterFilter] = useState<string>('all');
  const [chhandSearch, setChhandSearch] = useState<string>('');

  // Book Display Settings
  const [theme, setTheme] = useState<BookTheme>('pothi');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [selectedSamputId, setSelectedSamputId] = useState<string>('none');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Audio / Speech State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeSpeakingVerseIdx, setActiveSpeakingVerseIdx] = useState<number | string | null>(null);

  // Bookmark State
  const [savedBookmark, setSavedBookmark] = useState<{
    kandIndex: number;
    prasangIndex: number;
    kandName: string;
    prasangTitle: string;
    timestamp: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  // Load initial Kand if specified
  useEffect(() => {
    if (initialKandId) {
      const idx = RAMCHARITMANAS_KANDS.findIndex((k) => k.id === initialKandId);
      if (idx !== -1) {
        setSelectedKandIndex(idx);
        setSelectedPrasangIndex(0);
        setDohaReaderKandIndex(idx);
      }
    }
  }, [initialKandId]);

  // Load saved bookmark from localStorage
  useEffect(() => {
    try {
      const b = localStorage.getItem('ramcharitmanas_parayan_bookmark');
      if (b) {
        setSavedBookmark(JSON.parse(b));
      }
    } catch {
      // ignore
    }
  }, []);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2800);
  };

  const currentKand: RamayanKand = RAMCHARITMANAS_KANDS[selectedKandIndex] || RAMCHARITMANAS_KANDS[0];
  const currentPrasang: RamayanPrasang =
    currentKand.prasangs[selectedPrasangIndex] || currentKand.prasangs[0];

  const activeSamput = useMemo(() => {
    return POPULAR_SAMPUTS.find((s) => s.id === selectedSamputId);
  }, [selectedSamputId]);

  // Save Bookmark
  const handleSaveBookmark = (kIndex = selectedKandIndex, pIndex = selectedPrasangIndex, customTitle?: string) => {
    const k = RAMCHARITMANAS_KANDS[kIndex] || currentKand;
    const p = k.prasangs[pIndex] || currentPrasang;
    const bookmarkData = {
      kandIndex: kIndex,
      prasangIndex: pIndex,
      kandName: k.kandNameHindi,
      prasangTitle: customTitle || p.prasangTitle,
      timestamp: new Date().toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    try {
      localStorage.setItem('ramcharitmanas_parayan_bookmark', JSON.stringify(bookmarkData));
      setSavedBookmark(bookmarkData);
      triggerToast('🚩 विश्राम बुकमार्क सुरक्षित किया गया! आप यहाँ से पुनः पाठ आरंभ कर सकते हैं।');
    } catch {
      // ignore
    }
  };

  // Jump to saved bookmark
  const handleJumpToBookmark = () => {
    if (!savedBookmark) return;
    setSelectedKandIndex(savedBookmark.kandIndex);
    setSelectedPrasangIndex(savedBookmark.prasangIndex);
    setActiveView('kand');
    setShowKandDrawer(false);
    triggerToast(`📖 ${savedBookmark.kandName} - ${savedBookmark.prasangTitle} पर पहुंचे`);
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  // WhatsApp Share verse
  const handleShareVerse = (verse: ChaupaiVerse, kandName: string, pTitle: string) => {
    const text = `॥ श्रीरामचरितमानस - ${kandName} ॥\n` +
      `प्रसंग: ${pTitle}\n\n` +
      `${verse.textAwadhi.join('\n')}\n\n` +
      `॥ भावार्थ ॥\n${verse.meaningHindi}\n\n` +
      `🚩 जय श्री सीता-राम! 🚩 (आजमगढ़ पंचांग एवं सम्पूर्ण रामायण ग्रंथ)`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // WhatsApp Share Doha Unit across ANY Kand
  const handleShareKandDoha = (unit: SundarkandDohaUnit, kandName: string) => {
    const text = `॥ श्रीरामचरितमानस - ${kandName} (दोहा ${unit.dohaNum}) ॥\n` +
      `शीर्षक: ${unit.title}\n\n` +
      `${unit.chaupais.join('\n')}\n\n` +
      `चौपाई भावार्थ: ${unit.chaupaiMeaning}\n\n` +
      `${unit.doha.join('\n')}\n\n` +
      `दोहा भावार्थ: ${unit.dohaMeaning}\n\n` +
      `🚩 जय श्री सीता-राम! 🚩 (गीताप्रेस सानुवाद)`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Speech recitation
  const handleSpeakLines = (textLines: string[], verseId: number | string) => {
    if (!('speechSynthesis' in window)) {
      triggerToast('आपके ब्राउज़र में वाणी उच्चारण सुविधा उपलब्ध नहीं है');
      return;
    }

    if (isSpeaking && activeSpeakingVerseIdx === verseId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setActiveSpeakingVerseIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textLines.join('। '));
    utterance.lang = 'hi-IN';
    utterance.rate = 0.85; // Devotional, solemn tempo
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setActiveSpeakingVerseIdx(verseId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveSpeakingVerseIdx(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeakingVerseIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Search Results across all Kandas
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: {
      kandIndex: number;
      kandName: string;
      prasangIndex: number;
      prasangTitle: string;
      matchedSnippet: string;
      verseType: string;
    }[] = [];

    RAMCHARITMANAS_KANDS.forEach((kand, kIdx) => {
      kand.prasangs.forEach((pr, pIdx) => {
        pr.verses.forEach((v) => {
          const inAwadhi = v.textAwadhi.some((l) => l.toLowerCase().includes(q));
          const inHindi = v.meaningHindi.toLowerCase().includes(q);
          const inTitle = pr.prasangTitle.toLowerCase().includes(q);

          if (inAwadhi || inHindi || inTitle) {
            results.push({
              kandIndex: kIdx,
              kandName: kand.kandNameHindi,
              prasangIndex: pIdx,
              prasangTitle: pr.prasangTitle,
              matchedSnippet: inAwadhi
                ? v.textAwadhi.find((l) => l.toLowerCase().includes(q)) || v.textAwadhi[0]
                : v.meaningHindi.slice(0, 75) + '...',
              verseType: v.type
            });
          }
        });
      });
    });

    return results;
  }, [searchQuery]);

  // Navigate next/prev prasang
  const handlePrevPrasang = () => {
    if (selectedPrasangIndex > 0) {
      setSelectedPrasangIndex((prev) => prev - 1);
    } else if (selectedKandIndex > 0) {
      const prevKandIdx = selectedKandIndex - 1;
      setSelectedKandIndex(prevKandIdx);
      setSelectedPrasangIndex(RAMCHARITMANAS_KANDS[prevKandIdx].prasangs.length - 1);
    }
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPrasang = () => {
    if (selectedPrasangIndex < currentKand.prasangs.length - 1) {
      setSelectedPrasangIndex((prev) => prev + 1);
    } else if (selectedKandIndex < RAMCHARITMANAS_KANDS.length - 1) {
      setSelectedKandIndex((prev) => prev + 1);
      setSelectedPrasangIndex(0);
    }
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Jump directly to an episode from Doha index
  const handleJumpFromDohaIndex = (kIdx: number, pIdx = 0) => {
    setSelectedKandIndex(kIdx);
    setSelectedPrasangIndex(pIdx);
    setDohaReaderKandIndex(kIdx);
    setActiveView('kand');
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(`📖 ${RAMCHARITMANAS_KANDS[kIdx].kandNameHindi} का पाठ आरंभ`);
  };

  // Jump to Doha Reader for a specific Kand (with optional specific doha number)
  const handleOpenDohaReaderForKand = (kIdx: number, specificDohaNum?: number) => {
    setDohaReaderKandIndex(kIdx);
    setActiveDohaFilter(specificDohaNum || null);
    setDohaFilterSearch('');
    setShowDohaGrid(false);
    setActiveView('all_dohas_full');
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    triggerToast(
      specificDohaNum
        ? `🚩 ${RAMCHARITMANAS_KANDS[kIdx].kandNameHindi} - दोहा ${specificDohaNum}`
        : `🚩 ${RAMCHARITMANAS_KANDS[kIdx].kandNameHindi} - सम्पूर्ण दोहा-वार पाठ`
    );
  };

  // Global search results across all dohas (१,१७२ दोहे)
  const globalDohaSearchResults = useMemo(() => {
    if (!indexSearchQuery.trim()) return [];
    const q = indexSearchQuery.toLowerCase().trim();
    const results: {
      kandIndex: number;
      kandName: string;
      dohaNum: number;
      title: string;
      dohaLines: string[];
      meaning: string;
      chaupais: string[];
    }[] = [];

    RAMCHARITMANAS_KANDS.forEach((kand, kIdx) => {
      const units = ALL_KANDS_FULL_DOHAS[kIdx] || [];
      units.forEach((u) => {
        const matchNum = u.dohaNum.toString() === q;
        const inTitle = u.title.toLowerCase().includes(q);
        const inDoha = u.doha.some((l) => l.toLowerCase().includes(q));
        const inChaupai = u.chaupais.some((l) => l.toLowerCase().includes(q));
        const inMeaning = (u.dohaMeaning + ' ' + u.chaupaiMeaning).toLowerCase().includes(q);
        if (matchNum || inTitle || inDoha || inChaupai || inMeaning) {
          results.push({
            kandIndex: kIdx,
            kandName: kand.kandNameHindi,
            dohaNum: u.dohaNum,
            title: u.title,
            dohaLines: u.doha,
            meaning: u.dohaMeaning,
            chaupais: u.chaupais
          });
        }
      });
    });

    return results;
  }, [indexSearchQuery]);

  // Filtered Chaupais across all 4,638 Chaupais
  const filteredChaupais = useMemo(() => {
    let list = ALL_4638_CHAUPAIS;
    if (chaupaiKandFilter !== 'all') {
      list = list.filter((c) => c.kandIndex === chaupaiKandFilter);
    }
    if (chaupaiOnlyFamous) {
      list = list.filter((c) => c.isFamous);
    }
    if (chaupaiSearch.trim()) {
      const q = chaupaiSearch.trim().toLowerCase();
      list = list.filter((c) => {
        if (c.globalIndex.toString() === q) return true;
        if (c.dohaContextNumber.toString() === q) return true;
        if (c.kandName.toLowerCase().includes(q)) return true;
        if (c.themeTag?.toLowerCase().includes(q)) return true;
        if (c.hindiMeaning.toLowerCase().includes(q)) return true;
        return c.awadhiText.some((line) => line.toLowerCase().includes(q));
      });
    }
    return list;
  }, [chaupaiKandFilter, chaupaiOnlyFamous, chaupaiSearch]);

  const totalChaupaiPages = Math.max(1, Math.ceil(filteredChaupais.length / CHAUPAIS_PER_PAGE));
  const paginatedChaupais = useMemo(() => {
    const start = (chaupaiPage - 1) * CHAUPAIS_PER_PAGE;
    return filteredChaupais.slice(start, start + CHAUPAIS_PER_PAGE);
  }, [filteredChaupais, chaupaiPage]);

  // Filtered Chhands across all 231 / 86 Chhands
  const filteredChhands = useMemo(() => {
    let list = ALL_CANONICAL_CHHANDS;
    if (chhandKandFilter !== 'all') {
      list = list.filter((c) => c.kandIndex === chhandKandFilter);
    }
    if (chhandMeterFilter !== 'all') {
      list = list.filter((c) => c.meterName.includes(chhandMeterFilter));
    }
    if (chhandSearch.trim()) {
      const q = chhandSearch.trim().toLowerCase();
      list = list.filter((c) => {
        if (c.chhandTitle.toLowerCase().includes(q)) return true;
        if (c.meterName.toLowerCase().includes(q)) return true;
        if (c.hindiMeaning.toLowerCase().includes(q)) return true;
        if (c.dohaContextNumber.toString() === q) return true;
        return c.awadhiText.some((l) => l.toLowerCase().includes(q));
      });
    }
    return list;
  }, [chhandKandFilter, chhandMeterFilter, chhandSearch]);

  const handleJumpFromChaupaiToDoha = (kandIndex: number, dohaNum: number) => {
    handleOpenDohaReaderForKand(kandIndex, dohaNum);
  };

  // Current Dohas Array for the Comprehensive Doha Reader View
  const currentDohaReaderKand = RAMCHARITMANAS_KANDS[dohaReaderKandIndex] || RAMCHARITMANAS_KANDS[0];
  const currentDohaReaderUnits: SundarkandDohaUnit[] =
    ALL_KANDS_FULL_DOHAS[dohaReaderKandIndex] || BALA_FULL_DOHAS;

  // Theme styling configurations
  const themeClasses = {
    pothi: {
      bg: 'bg-[#fbf4e6]',
      border: 'border-[#c99742]',
      pageBg: 'bg-[#fffaf0]',
      headerBg: 'bg-[#7a1818]',
      headerText: 'text-[#ffe8a3]',
      textPrimary: 'text-[#2a1306]',
      textSecondary: 'text-[#5c3a21]',
      verseBox: 'bg-[#fcf5e5] border-[#d8b577]',
      bhavarthBox: 'bg-[#f7ebd4] border-[#d4a85c]',
      badgeBg: 'bg-[#8c221e] text-[#ffe8a3]'
    },
    classic: {
      bg: 'bg-[#fffdf7]',
      border: 'border-amber-400',
      pageBg: 'bg-white',
      headerBg: 'bg-red-900',
      headerText: 'text-amber-200',
      textPrimary: 'text-stone-900',
      textSecondary: 'text-stone-700',
      verseBox: 'bg-amber-50/60 border-amber-200',
      bhavarthBox: 'bg-orange-50/70 border-orange-200',
      badgeBg: 'bg-red-800 text-white'
    },
    temple: {
      bg: 'bg-[#fdf3f0]',
      border: 'border-red-400',
      pageBg: 'bg-[#fff6f4]',
      headerBg: 'bg-[#991b1b]',
      headerText: 'text-amber-300',
      textPrimary: 'text-[#450a0a]',
      textSecondary: 'text-[#7f1d1d]',
      verseBox: 'bg-[#fef2f2] border-red-200',
      bhavarthBox: 'bg-[#fee2e2]/60 border-red-300',
      badgeBg: 'bg-red-900 text-white'
    },
    night: {
      bg: 'bg-[#18110c]',
      border: 'border-amber-700/60',
      pageBg: 'bg-[#211712]',
      headerBg: 'bg-[#120a06]',
      headerText: 'text-amber-400',
      textPrimary: 'text-[#f5ebd7]',
      textSecondary: 'text-[#d4be9d]',
      verseBox: 'bg-[#2b1f18] border-amber-800/40',
      bhavarthBox: 'bg-[#33251d] border-amber-800/30',
      badgeBg: 'bg-amber-900 text-amber-200'
    }
  }[theme];

  const fontSizeClasses = {
    normal: {
      verse: 'text-base sm:text-lg leading-relaxed',
      bhavarth: 'text-sm sm:text-base leading-normal'
    },
    large: {
      verse: 'text-lg sm:text-xl md:text-2xl leading-loose font-medium',
      bhavarth: 'text-base sm:text-lg leading-relaxed'
    },
    xlarge: {
      verse: 'text-xl sm:text-2xl md:text-3xl leading-loose font-semibold',
      bhavarth: 'text-lg sm:text-xl leading-relaxed'
    }
  }[fontSize];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-1 sm:p-3 overflow-hidden">
      {/* Holy Book Frame Container */}
      <div
        className={`w-full max-w-5xl h-[97vh] sm:h-[95vh] rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 sm:border-4 ${themeClasses.border} ${themeClasses.bg} relative transition-colors duration-300`}
      >
        {/* ======================================================== */}
        {/* 1. TOP HOLY BOOK HEADER */}
        {/* ======================================================== */}
        <header
          className={`${themeClasses.headerBg} ${themeClasses.headerText} px-3 sm:px-6 py-2 sm:py-2.5 border-b-2 border-amber-600/60 flex items-center justify-between shrink-0 shadow-md relative z-20`}
        >
          {/* Left: Granth Title & Swastik */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-inner">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-amber-300 uppercase">
                  ॥ श्रीसीतारामचन्द्राय नमः ॥
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded border border-amber-400/30">
                  गीताप्रेस मूल सानुवाद सम्पूर्ण
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>सम्पूर्ण श्रीरामचरितमानस</span>
                <span className="text-[11px] sm:text-xs font-normal text-amber-200">
                  (७ काण्ड • १,१७२ दोहे)
                </span>
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Kand Selector Drawer Button */}
            <button
              onClick={() => setShowKandDrawer((s) => !s)}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors"
              title="काण्ड सूची खोलें"
            >
              <span>{currentKand.kandNameHindi}</span>
              <span className="text-[10px] bg-amber-900/60 px-1.5 py-0.2 rounded ml-0.5">
                {selectedKandIndex + 1}/7
              </span>
            </button>

            {/* Quick Bookmark Jump */}
            {savedBookmark && (
              <button
                onClick={handleJumpToBookmark}
                className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-950/90 border border-red-400/40 text-amber-300 text-xs font-semibold transition-colors"
                title={`पिछला विश्राम: ${savedBookmark.kandName}`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>पिछला विश्राम</span>
              </button>
            )}

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettings((s) => !s)}
              className={`p-1.5 rounded-lg border text-amber-200 transition-colors ${
                showSettings
                  ? 'bg-amber-500/30 border-amber-400'
                  : 'bg-amber-900/40 hover:bg-amber-900/60 border-amber-600/40'
              }`}
              title="ग्रंथ पृष्ठ शैली व फॉन्ट सेटिंग"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-950 text-amber-200 hover:text-white transition-colors"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Quick Grantha Switcher Bar */}
        {(onOpenShivPuran || onOpenVishnuPuran || onOpenMahabharat || onOpenKrishnaKatha) && (
          <div className="bg-amber-950/25 border-b border-amber-900/30 px-3 py-1 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs shrink-0 font-medium">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-amber-200 flex items-center gap-1 font-serif text-[11px] sm:text-xs">
                <span>📖 सनातन ग्रंथ सागर:</span>
              </span>
              <span className="bg-red-800 text-white font-bold px-2 py-0.5 rounded-md text-[11px] ring-1 ring-amber-400">
                🚩 श्रीरामचरितमानस
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
        )}

        {/* ======================================================== */}
        {/* 2. SUB-BAR: TABS & VIEW SELECTION */}
        {/* ======================================================== */}
        <div className="bg-amber-950/15 border-b border-amber-900/20 px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 shrink-0 text-xs sm:text-sm font-semibold">
            {/* 1. Flagship All Kands Doha Reader */}
            <button
              onClick={() => {
                setActiveView('all_dohas_full');
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'all_dohas_full'
                  ? 'bg-red-800 text-white shadow-md font-bold ring-1 ring-amber-300'
                  : 'text-red-950 bg-amber-200/80 hover:bg-amber-300 border border-amber-400'
              }`}
              title="सातों काण्डों का दोहा-वार सम्पूर्ण पाठ (कुल १,१७२ दोहे)"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>🚩 सम्पूर्ण दोहा-वार पाठ (१,१७२)</span>
            </button>

            {/* NEW: 4,638 Chaupai Corpus */}
            <button
              onClick={() => {
                setActiveView('chaupai_corpus');
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'chaupai_corpus'
                  ? 'bg-orange-800 text-white shadow-md font-bold ring-1 ring-amber-300'
                  : 'text-orange-950 bg-orange-100 hover:bg-orange-200 border border-orange-300'
              }`}
              title="सम्पूर्ण ४,६३८ चौपाई कोष (अर्धाली, भावार्थ व संदर्भ दोहा)"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-600" />
              <span>📜 सम्पूर्ण ४,६३८ चौपाई कोष</span>
            </button>

            {/* NEW: 231 Chhand Corpus */}
            <button
              onClick={() => {
                setActiveView('chhand_corpus');
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeView === 'chhand_corpus'
                  ? 'bg-emerald-800 text-white shadow-md font-bold ring-1 ring-amber-300'
                  : 'text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300'
              }`}
              title="सम्पूर्ण २३१ छंद (हरिगीतिका, तोमर, भुजंगप्रयात, चौबोला, त्रोटक आदि)"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>🪷 सम्पूर्ण २३१ छंद संग्रह</span>
            </button>

            {/* 2. Kand Prasang Reader */}
            <button
              onClick={() => {
                setActiveView('kand');
                setSearchQuery('');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeView === 'kand'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>प्रसंग-वार पाठ</span>
            </button>

            {/* 3. Akhand Pothi Continuous Mode */}
            <button
              onClick={() => {
                setActiveView('continuous_pothi');
                setSearchQuery('');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeView === 'continuous_pothi'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
              title="पूरा काण्ड एक साथ अविकल स्क्रॉल में पढ़ें"
            >
              <Scroll className="w-3.5 h-3.5 text-amber-600" />
              <span>अखण्ड पोथी</span>
            </button>

            {/* 4. Complete Doha Directory */}
            <button
              onClick={() => {
                setActiveView('doha_index');
                setSearchQuery('');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeView === 'doha_index'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>१,१७२ दोहा सूची</span>
            </button>

            {/* 5. Path Vidhi & Sankalpa */}
            <button
              onClick={() => setActiveView('path_vidhi')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeView === 'path_vidhi'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>पाठ विधि व संकल्प</span>
            </button>

            {/* 6. Structure */}
            <button
              onClick={() => {
                setActiveView('structure');
                setSearchQuery('');
              }}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeView === 'structure'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              <span>संरचना</span>
            </button>

            {/* 7. Aarti */}
            <button
              onClick={() => setActiveView('aarti')}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeView === 'aarti'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              🪔 आरती
            </button>

            {/* 8. Stuti */}
            <button
              onClick={() => setActiveView('stuti')}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeView === 'stuti'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              🌸 स्तुति
            </button>

            {/* 9. Parayan */}
            <button
              onClick={() => setActiveView('parayan')}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                activeView === 'parayan'
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'text-stone-700 hover:bg-amber-200/60'
              }`}
            >
              📅 नवाह्न
            </button>
          </div>

          {/* Quick Universal Search Input */}
          <div className="relative min-w-[130px] sm:min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="चौपाई, दोहा या प्रसंग खोजें..."
              className="w-full text-xs pl-8 pr-2.5 py-1 rounded-md bg-white/80 border border-amber-900/20 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* CANONICAL STRUCTURE SUMMARY TICKER */}
        {/* ======================================================== */}
        <div className="bg-amber-100/90 border-b border-amber-900/15 px-3 sm:px-6 py-1 text-[11px] sm:text-xs flex items-center justify-between overflow-x-auto scrollbar-none gap-3 text-stone-800 shrink-0">
          <div className="flex items-center gap-2 shrink-0 font-serif">
            <span className="font-extrabold text-red-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-700 inline-block animate-pulse"></span>
              सम्पूर्ण संरचना:
            </span>
            <button
              onClick={() => setActiveView('structure')}
              className="bg-red-200/80 hover:bg-red-300 text-red-950 font-bold px-1.5 py-0.5 rounded border border-red-300 transition-colors cursor-pointer"
              title="काण्ड संरचना देखें"
            >
              • कुल काण्ड: ७
            </button>
            <button
              onClick={() => setActiveView('all_dohas_full')}
              className="bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-400 transition-colors cursor-pointer"
              title="सम्पूर्ण १,१७२ दोहा पाठ खोलें"
            >
              • कुल दोहे: १,१७२
            </button>
            <button
              onClick={() => setActiveView('chaupai_corpus')}
              className="bg-orange-200/80 hover:bg-orange-300 text-orange-950 font-bold px-1.5 py-0.5 rounded border border-orange-400 transition-colors cursor-pointer"
              title="सम्पूर्ण ४,६३८ चौपाई कोष खोलें"
            >
              • कुल चौपाइयां: ४,६३८
            </button>
            <button
              onClick={() => setActiveView('chhand_corpus')}
              className="bg-indigo-200/80 hover:bg-indigo-300 text-indigo-950 font-semibold px-1.5 py-0.5 rounded border border-indigo-400 transition-colors cursor-pointer"
              title="सम्पूर्ण २३१ छंद संग्रह खोलें"
            >
              • कुल छंद: २३१
            </button>
            <span className="hidden md:inline-block bg-yellow-200/80 text-yellow-950 font-semibold px-1.5 py-0.5 rounded border border-yellow-400">
              • कुल सोरठा: ८७
            </span>
            <span className="hidden md:inline-block bg-emerald-200/80 text-emerald-950 font-semibold px-1.5 py-0.5 rounded border border-emerald-400">
              • कुल श्लोक: २७
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[11px] text-amber-900">
            <span>सम्पुट:</span>
            <span className="font-semibold text-red-900 truncate max-w-[150px]">
              {activeSamput?.title || 'सामान्य'}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SETTINGS POPUP */}
        {/* ======================================================== */}
        {showSettings && (
          <div className="bg-amber-900/95 text-amber-100 p-3 sm:p-4 border-b-2 border-amber-500/50 shadow-xl z-30 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Theme Picker */}
            <div>
              <span className="block font-semibold mb-1.5 text-amber-300">
                पृष्ठ एवं पोथी शैली:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTheme('pothi')}
                  className={`px-2 py-1.5 rounded border text-left ${
                    theme === 'pothi'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  📜 पौराणिक पोथी
                </button>
                <button
                  onClick={() => setTheme('classic')}
                  className={`px-2 py-1.5 rounded border text-left ${
                    theme === 'classic'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  📖 गीताप्रेस क्लासिक
                </button>
                <button
                  onClick={() => setTheme('temple')}
                  className={`px-2 py-1.5 rounded border text-left ${
                    theme === 'temple'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  🚩 मन्दिर सिन्दूरी
                </button>
                <button
                  onClick={() => setTheme('night')}
                  className={`px-2 py-1.5 rounded border text-left ${
                    theme === 'night'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  🌙 निशीथ ध्यान
                </button>
              </div>
            </div>

            {/* Font Size Picker */}
            <div>
              <span className="block font-semibold mb-1.5 text-amber-300">
                अक्षर का आकार (Font Size):
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`flex-1 py-1.5 rounded border ${
                    fontSize === 'normal'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  सामान्य
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`flex-1 py-1.5 rounded border ${
                    fontSize === 'large'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  बड़ा (अनुशंसित)
                </button>
                <button
                  onClick={() => setFontSize('xlarge')}
                  className={`flex-1 py-1.5 rounded border ${
                    fontSize === 'xlarge'
                      ? 'bg-amber-600 text-white border-amber-300 font-bold'
                      : 'bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  अति विशाल
                </button>
              </div>
            </div>

            {/* Samput Chooser */}
            <div>
              <span className="block font-semibold mb-1.5 text-amber-300">
                सम्पुट चौपाई (पारायण हेतु):
              </span>
              <select
                value={selectedSamputId}
                onChange={(e) => setSelectedSamputId(e.target.value)}
                className="w-full bg-amber-950 border border-amber-700 rounded p-1.5 text-amber-100 text-xs focus:outline-none"
              >
                {POPULAR_SAMPUTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              {activeSamput && activeSamput.text && (
                <p className="mt-1.5 text-[11px] text-amber-300/90 italic bg-amber-950/60 p-1.5 rounded border border-amber-800/40">
                  {activeSamput.text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* KAND DRAWER (OVERLAY SELECTOR) */}
        {/* ======================================================== */}
        {showKandDrawer && (
          <div className="absolute top-[80px] left-0 right-0 z-40 bg-amber-950/95 text-amber-100 border-b-2 border-amber-500 shadow-2xl p-4 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-amber-800 pb-2">
              <h3 className="font-bold text-sm sm:text-base text-amber-300 flex items-center gap-2">
                <span>॥ श्रीमद्रामचरितमानस के सातों सोपान ॥</span>
              </h3>
              <button
                onClick={() => setShowKandDrawer(false)}
                className="text-amber-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {RAMCHARITMANAS_KANDS.map((kand, idx) => (
                <div
                  key={kand.id}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedKandIndex === idx
                      ? 'bg-amber-600/30 border-amber-400 ring-2 ring-amber-400/50'
                      : 'bg-amber-900/30 hover:bg-amber-900/60 border-amber-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-amber-200">
                      {idx + 1}. {kand.kandNameHindi}
                    </span>
                    <span className="text-[10px] bg-red-950/80 px-2 py-0.5 rounded text-amber-300 border border-red-700/50">
                      {kand.dohaRange}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/80 line-clamp-2">{kand.overviewHindi}</p>
                  <div className="mt-2 text-[11px] flex items-center justify-between pt-1 border-t border-amber-800/40">
                    <button
                      onClick={() => {
                        setSelectedKandIndex(idx);
                        setSelectedPrasangIndex(0);
                        setShowKandDrawer(false);
                        setActiveView('kand');
                        contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-amber-200 hover:text-white font-semibold underline"
                    >
                      प्रसंग पाठ →
                    </button>
                    <button
                      onClick={() => {
                        setShowKandDrawer(false);
                        handleOpenDohaReaderForKand(idx);
                      }}
                      className="px-2 py-0.5 bg-red-800 hover:bg-red-700 text-amber-200 rounded font-bold"
                    >
                      दोहा-वार पाठ 🚩
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TOAST NOTIFICATION */}
        {/* ======================================================== */}
        {toastMsg && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-red-950 text-amber-200 px-4 py-2 rounded-full shadow-2xl border border-amber-400/60 text-xs sm:text-sm font-semibold animate-bounce flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN SCROLLABLE CONTENT BODY */}
        {/* ======================================================== */}
        <div
          ref={contentScrollRef}
          className={`flex-1 overflow-y-auto p-3 sm:p-6 ${themeClasses.pageBg} transition-colors`}
        >
          {/* SEARCH RESULTS VIEW */}
          {searchQuery.trim().length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-stone-800">
                  खोज परिणाम ({searchResults.length}): "{searchQuery}"
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-red-700 hover:underline"
                >
                  खोज बंद करें
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-stone-500">
                  <p>कोई चौपाई या प्रसंग नहीं मिला। कृपया अन्य शब्द का प्रयास करें।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedKandIndex(res.kandIndex);
                        setSelectedPrasangIndex(res.prasangIndex);
                        setActiveView('kand');
                        setSearchQuery('');
                        contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg hover:border-amber-400 cursor-pointer transition-colors shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-red-900">
                          {res.kandName} • {res.prasangTitle}
                        </span>
                        <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded uppercase">
                          {res.verseType}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-stone-800">{res.matchedSnippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeView === 'all_dohas_full' ? (
            /* ==================================================== */
            /* VIEW: COMPREHENSIVE DOHA-BY-DOHA READER (ALL 7 KANDS)*/
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* 7 Kands Quick Switcher Pills Bar */}
              <div className="p-3 bg-gradient-to-r from-red-950 via-amber-900 to-red-950 text-white rounded-2xl shadow-lg border-2 border-amber-400 space-y-3">
                <div className="text-center">
                  <span className="text-[11px] uppercase tracking-widest text-amber-300 font-serif">
                    ॥ सम्पूर्ण श्रीरामचरितमानस • सातों काण्ड दोहा-वार मूल पाठ ॥
                  </span>
                  <h2 className="text-xl sm:text-3xl font-black mt-0.5 text-white">
                    {currentDohaReaderKand.kandNameHindi} (सम्पूर्ण दोहा पाठ)
                  </h2>
                  <p className="text-xs text-amber-200 mt-0.5">
                    {currentDohaReaderKand.dohaRange} • मूल अवधी चौपाई, दोहा, छंद एवं प्रामाणिक हिन्दी भावार्थ
                  </p>
                </div>

                {/* Kand Selection Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin pt-1 border-t border-amber-700/60">
                  {RAMCHARITMANAS_KANDS.map((k, idx) => (
                    <button
                      key={k.id}
                      onClick={() => {
                        setDohaReaderKandIndex(idx);
                        setActiveDohaFilter(null);
                        contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                        dohaReaderKandIndex === idx
                          ? 'bg-amber-400 text-red-950 shadow-md ring-2 ring-white font-extrabold'
                          : 'bg-red-950/70 hover:bg-red-900 text-amber-200 border border-amber-600/40'
                      }`}
                    >
                      <span>{idx + 1}. {k.kandNameHindi}</span>
                      <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded">
                        {idx === 0
                          ? '361'
                          : idx === 1
                          ? '326'
                          : idx === 2
                          ? '46'
                          : idx === 3
                          ? '30'
                          : idx === 4
                          ? '60'
                          : idx === 5
                          ? '121'
                          : '130'} दोहे
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Doha Filter & Direct Search Tools for Active Kand */}
              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-700">
                  <span className="font-bold flex items-center gap-1.5 text-red-950">
                    <ListOrdered className="w-4 h-4 text-red-700" />
                    {currentDohaReaderKand.kandNameHindi} • कुल {currentDohaReaderUnits.length} दोहे
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Direct Doha Jump Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const num = parseInt(dohaJumpInput.trim(), 10);
                        if (!isNaN(num) && num >= 1 && num <= currentDohaReaderUnits.length) {
                          setActiveDohaFilter(num);
                          setDohaJumpInput('');
                          setDohaFilterSearch('');
                          setShowDohaGrid(false);
                          contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          triggerToast(`दोहा संख्या ${num} पर पहुँचे`);
                        } else {
                          triggerToast(`कृपया १ से ${currentDohaReaderUnits.length} के बीच संख्या लिखें`);
                        }
                      }}
                      className="flex items-center gap-1"
                    >
                      <input
                        type="number"
                        min={1}
                        max={currentDohaReaderUnits.length}
                        placeholder={`दोहा सं. (१-${currentDohaReaderUnits.length})`}
                        value={dohaJumpInput}
                        onChange={(e) => setDohaJumpInput(e.target.value)}
                        className="w-28 text-xs px-2 py-1 bg-white border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-600 font-semibold"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-amber-100 text-xs font-bold rounded shadow-sm transition-colors"
                      >
                        जाएं
                      </button>
                    </form>

                    {/* Toggle Grid */}
                    <button
                      onClick={() => setShowDohaGrid((prev) => !prev)}
                      className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-stone-900 text-xs font-semibold rounded border border-amber-400 flex items-center gap-1 transition-colors"
                    >
                      <span>{showDohaGrid ? 'ग्रिड बंद' : '🔢 दोहा ग्रिड'}</span>
                    </button>

                    {(activeDohaFilter !== null || dohaFilterSearch !== '') && (
                      <button
                        onClick={() => {
                          setActiveDohaFilter(null);
                          setDohaFilterSearch('');
                        }}
                        className="text-red-700 hover:underline font-bold text-xs"
                      >
                        सभी दोहे देखें
                      </button>
                    )}
                  </div>
                </div>

                {/* Search within current Kand */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`${currentDohaReaderKand.kandNameHindi} में खोजें (उदा: विषय, चौपाई, या शब्द)...`}
                    value={dohaFilterSearch}
                    onChange={(e) => {
                      setDohaFilterSearch(e.target.value);
                      if (e.target.value) setActiveDohaFilter(null);
                    }}
                    className="w-full text-xs pl-8 pr-7 py-1.5 bg-white border border-amber-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-600 shadow-sm"
                  />
                  {dohaFilterSearch && (
                    <button
                      onClick={() => setDohaFilterSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Optional Interactive Grid of Numbers */}
                {showDohaGrid && (
                  <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                    <div className="flex items-center justify-between text-[11px] text-stone-600 border-b border-amber-100 pb-1">
                      <span className="font-bold text-red-950">
                        {currentDohaReaderKand.kandNameHindi} के सभी {currentDohaReaderUnits.length} दोहे (किसी पर भी क्लिक करें):
                      </span>
                      <button
                        onClick={() => {
                          setActiveDohaFilter(null);
                          setShowDohaGrid(false);
                        }}
                        className="text-amber-800 hover:underline font-semibold"
                      >
                        सभी दिखाएं
                      </button>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1">
                      {currentDohaReaderUnits.map((unit) => (
                        <button
                          key={unit.dohaNum}
                          onClick={() => {
                            setActiveDohaFilter(unit.dohaNum);
                            setShowDohaGrid(false);
                            setDohaFilterSearch('');
                            contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`py-1 text-xs rounded transition-colors font-medium ${
                            activeDohaFilter === unit.dohaNum
                              ? 'bg-red-800 text-white font-bold ring-2 ring-amber-400'
                              : 'bg-amber-100/70 hover:bg-amber-200 text-stone-800'
                          }`}
                          title={`दोहा ${unit.dohaNum}: ${unit.title}`}
                        >
                          {unit.dohaNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Horizontal Quick Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {currentDohaReaderUnits.map((unit) => (
                    <button
                      key={unit.dohaNum}
                      onClick={() => {
                        setActiveDohaFilter(unit.dohaNum);
                        setDohaFilterSearch('');
                        contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-semibold shrink-0 transition-colors ${
                        activeDohaFilter === unit.dohaNum
                          ? 'bg-red-800 text-white font-bold ring-2 ring-amber-400'
                          : 'bg-amber-200/70 hover:bg-amber-300 text-stone-800'
                      }`}
                      title={unit.title}
                    >
                      दोहा {unit.dohaNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dohas Units List for Active Kand */}
              <div className="space-y-6">
                {currentDohaReaderUnits
                  .filter((u) => {
                    if (activeDohaFilter !== null && u.dohaNum !== activeDohaFilter) {
                      return false;
                    }
                    if (dohaFilterSearch.trim()) {
                      const q = dohaFilterSearch.toLowerCase().trim();
                      const matchNum = u.dohaNum.toString() === q;
                      const inTitle = u.title.toLowerCase().includes(q);
                      const inChaupai = u.chaupais.some((c) => c.toLowerCase().includes(q));
                      const inDoha = u.doha.some((d) => d.toLowerCase().includes(q));
                      const inMeaning = (u.chaupaiMeaning + ' ' + u.dohaMeaning).toLowerCase().includes(q);
                      return matchNum || inTitle || inChaupai || inDoha || inMeaning;
                    }
                    return true;
                  })
                  .map((unit) => {
                    const reciteLines = [
                      ...(unit.shlokaOrSoratha?.textAwadhi || []),
                      ...unit.chaupais,
                      ...unit.doha,
                      ...(unit.chhand?.textAwadhi || [])
                    ];

                    return (
                      <article
                        key={unit.dohaNum}
                        className="p-5 sm:p-6 bg-[#fffdf7] border-2 border-amber-300 rounded-2xl shadow-sm space-y-4"
                      >
                        {/* Doha Top Bar */}
                        <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-red-900 text-amber-200 font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                              {currentDohaReaderKand.kandNameHindi} • दोहा {unit.dohaNum}
                            </span>
                            <h4 className="font-bold text-base text-red-950">{unit.title}</h4>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSpeakLines(reciteLines, `kand-${dohaReaderKandIndex}-doha-${unit.dohaNum}`)}
                              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 border transition-colors ${
                                isSpeaking && activeSpeakingVerseIdx === `kand-${dohaReaderKandIndex}-doha-${unit.dohaNum}`
                                  ? 'bg-red-800 text-white border-red-700 animate-pulse'
                                  : 'bg-amber-100 hover:bg-amber-200 text-stone-800 border-amber-300'
                              }`}
                              title="सस्वर वाणी उच्चारण सुनें"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">उच्चारण</span>
                            </button>

                            <button
                              onClick={() => handleShareKandDoha(unit, currentDohaReaderKand.kandNameHindi)}
                              className="p-1.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="व्हाट्सएप पर शेयर करें"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>शेयर</span>
                            </button>
                          </div>
                        </div>

                        {/* Sanskrit Shloka or Soratha if present */}
                        {unit.shlokaOrSoratha && (
                          <div className="p-3 bg-amber-100/60 border border-amber-300 rounded-lg space-y-2">
                            <span className="text-[10px] font-bold text-red-900 uppercase">
                              {unit.shlokaOrSoratha.type === 'sloka' ? 'मंगलाचरण श्लोक' : 'सोरठा'}
                            </span>
                            <div className="text-center font-serif text-base text-stone-900 font-semibold space-y-1">
                              {unit.shlokaOrSoratha.textAwadhi.map((line, lIdx) => (
                                <p key={lIdx}>{line}</p>
                              ))}
                            </div>
                            <p className="text-xs text-stone-700 italic border-t border-amber-200 pt-1">
                              भावार्थ: {unit.shlokaOrSoratha.meaningHindi}
                            </p>
                          </div>
                        )}

                        {/* Chaupais */}
                        <div className="space-y-2 text-center font-serif text-lg sm:text-xl text-stone-900 font-medium">
                          {unit.chaupais.map((line, lIdx) => (
                            <p key={lIdx} className="leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>

                        {/* Chaupai Meaning */}
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-stone-800 text-sm">
                          <span className="text-[10px] font-bold text-red-900 block mb-0.5">
                            चौपाई भावार्थ:
                          </span>
                          <p className="leading-relaxed">{unit.chaupaiMeaning}</p>
                        </div>

                        {/* Main Doha Couplet */}
                        <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
                          <span className="text-[10px] font-bold text-red-900 uppercase">
                            मूल दोहा:
                          </span>
                          <div className="text-center font-serif text-lg sm:text-xl text-red-950 font-bold space-y-1">
                            {unit.doha.map((line, lIdx) => (
                              <p key={lIdx}>{line}</p>
                            ))}
                          </div>
                          <div className="border-t border-red-200 pt-2 text-stone-800 text-sm">
                            <span className="text-[10px] font-bold text-red-900 block mb-0.5">
                              दोहा भावार्थ:
                            </span>
                            <p className="leading-relaxed">{unit.dohaMeaning}</p>
                          </div>
                        </div>

                        {/* Chhand if present */}
                        {unit.chhand && (
                          <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg space-y-2">
                            <span className="text-[10px] font-bold text-yellow-900 uppercase">
                              छन्द:
                            </span>
                            <div className="text-center font-serif text-base text-stone-900 font-medium space-y-1">
                              {unit.chhand.textAwadhi.map((line, lIdx) => (
                                <p key={lIdx}>{line}</p>
                              ))}
                            </div>
                            <p className="text-xs text-stone-700 italic border-t border-yellow-200 pt-1">
                              भावार्थ: {unit.chhand.meaningHindi}
                            </p>
                          </div>
                        )}

                        {/* Prev / Next Doha Navigation Footer on Each Card */}
                        <div className="flex items-center justify-between pt-3 border-t border-amber-900/10 text-xs">
                          {unit.dohaNum > 1 ? (
                            <button
                              onClick={() => {
                                setActiveDohaFilter(unit.dohaNum - 1);
                                contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-stone-800 font-semibold flex items-center gap-1 border border-amber-300"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                              <span>पिछला दोहा ({unit.dohaNum - 1})</span>
                            </button>
                          ) : <div />}

                          <span className="text-[11px] text-stone-500 font-medium">
                            दोहा {unit.dohaNum} / {currentDohaReaderUnits.length}
                          </span>

                          {unit.dohaNum < currentDohaReaderUnits.length ? (
                            <button
                              onClick={() => {
                                setActiveDohaFilter(unit.dohaNum + 1);
                                contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="px-2.5 py-1 rounded bg-red-800 hover:bg-red-700 text-amber-200 font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <span>अगला दोहा ({unit.dohaNum + 1})</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ) : <div />}
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          ) : activeView === 'kand' ? (
            /* ==================================================== */
            /* VIEW A: KAND PRASANG-WISE READER                     */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Auspicious Kand Header Card */}
              <div
                className={`p-4 sm:p-5 rounded-xl border ${themeClasses.verseBox} shadow-sm relative overflow-hidden`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/15 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${themeClasses.badgeBg}`}>
                        सोपान {currentKand.kandNumber}
                      </span>
                      <span className="text-xs text-amber-900 font-semibold">
                        {currentKand.dohaRange}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-red-950 mt-1">
                      {currentKand.kandNameHindi}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <button
                      onClick={() => handleOpenDohaReaderForKand(selectedKandIndex)}
                      className="px-2.5 py-1 text-xs font-bold rounded bg-red-800 hover:bg-red-700 text-amber-200 flex items-center gap-1 shadow-sm transition-colors"
                      title="इस काण्ड का सम्पूर्ण दोहा-वार पाठ खोलें"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>दोहा-वार पाठ 🚩</span>
                    </button>

                    <button
                      onClick={() => handleSaveBookmark()}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1 shadow-sm transition-colors"
                      title="इस प्रसंग पर विश्राम बुकमार्क लगाएं"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>विश्राम बुकमार्क</span>
                    </button>
                  </div>
                </div>

                {/* Kand Doha Quick Jumper Bar */}
                <div className="mt-3">
                  <span className="text-xs font-semibold text-stone-700 block mb-1.5">
                    प्रसंग / दोहा चुनें ({currentKand.prasangs.length} प्रसंग):
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    {currentKand.prasangs.map((pr, pIdx) => (
                      <button
                        key={pr.id}
                        onClick={() => {
                          setSelectedPrasangIndex(pIdx);
                          contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                          selectedPrasangIndex === pIdx
                            ? 'bg-red-800 text-white shadow-sm font-bold'
                            : 'bg-amber-200/60 hover:bg-amber-300 text-stone-800'
                        }`}
                      >
                        {pIdx + 1}. {pr.prasangTitle.split(' ')[0]} {pr.dohaRange || ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Prasang Title Display */}
              <div className="text-center py-2 border-y border-amber-900/15">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                  ॥ प्रसंग {selectedPrasangIndex + 1} ॥
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-red-950 mt-0.5">
                  {currentPrasang.prasangTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 italic mt-0.5">
                  {currentPrasang.prasangSubtitle}
                </p>
                {currentPrasang.dohaRange && (
                  <span className="inline-block mt-1 text-[11px] bg-red-100 text-red-900 font-semibold px-2 py-0.5 rounded border border-red-200">
                    {currentPrasang.dohaRange}
                  </span>
                )}
              </div>

              {/* Verses List */}
              <div className="space-y-6">
                {currentPrasang.verses.map((verse, vIdx) => {
                  return (
                    <article
                      key={vIdx}
                      className={`p-4 sm:p-6 rounded-xl border ${themeClasses.verseBox} shadow-sm space-y-4`}
                    >
                      {/* Verse Header Badge & Actions */}
                      <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${themeClasses.badgeBg}`}>
                            {verse.type === 'sloka'
                              ? 'संस्कृत श्लोक'
                              : verse.type === 'soratha'
                              ? 'सोरठा'
                              : verse.type === 'doha'
                              ? 'दोहा'
                              : verse.type === 'chhand'
                              ? 'छन्द'
                              : 'चौपाई'}
                          </span>
                          {verse.dohaNumber && (
                            <span className="text-xs font-extrabold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                              {verse.dohaNumber}
                            </span>
                          )}
                        </div>

                        {/* Recite & Share */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleSpeakLines(verse.textAwadhi, vIdx)}
                            className={`p-1.5 rounded-md border text-xs flex items-center gap-1 transition-colors ${
                              isSpeaking && activeSpeakingVerseIdx === vIdx
                                ? 'bg-red-800 text-white border-red-700 animate-pulse'
                                : 'bg-amber-100 hover:bg-amber-200 text-stone-800 border-amber-300'
                            }`}
                            title="वाणी उच्चारण सुनें"
                          >
                            {isSpeaking && activeSpeakingVerseIdx === vIdx ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">रोकें</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                                <span className="hidden sm:inline">उच्चारण</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              handleShareVerse(
                                verse,
                                currentKand.kandNameHindi,
                                currentPrasang.prasangTitle
                              )
                            }
                            className="p-1.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs flex items-center gap-1 transition-colors"
                            title="व्हाट्सएप पर साझा करें"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">शेयर</span>
                          </button>
                        </div>
                      </div>

                      {/* Optional Opening Samput */}
                      {activeSamput && activeSamput.text && (
                        <div className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100/70 p-2 rounded border border-amber-300 text-center italic">
                          🚩 {activeSamput.text}
                        </div>
                      )}

                      {/* Original Awadhi Sacred Text */}
                      <div
                        className={`text-center font-serif ${fontSizeClasses.verse} ${themeClasses.textPrimary} space-y-1.5 tracking-wide`}
                      >
                        {verse.textAwadhi.map((line, lIdx) => (
                          <p key={lIdx} className="leading-relaxed">
                            {line}
                          </p>
                        ))}
                      </div>

                      {/* Optional Closing Samput */}
                      {activeSamput && activeSamput.text && (
                        <div className="text-xs sm:text-sm font-semibold text-amber-800 bg-amber-100/70 p-2 rounded border border-amber-300 text-center italic">
                          🚩 {activeSamput.text}
                        </div>
                      )}

                      {/* Authentic Hindi Bhavarth */}
                      <div
                        className={`p-3.5 sm:p-4 rounded-lg border ${themeClasses.bhavarthBox} space-y-1`}
                      >
                        <span className="text-[11px] font-bold text-red-950 uppercase tracking-wider block">
                          ॥ हिन्दी भावार्थ ॥
                        </span>
                        <p
                          className={`${fontSizeClasses.bhavarth} ${themeClasses.textSecondary} leading-relaxed font-sans`}
                        >
                          {verse.meaningHindi}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-amber-900/20">
                <button
                  onClick={handlePrevPrasang}
                  disabled={selectedKandIndex === 0 && selectedPrasangIndex === 0}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-amber-200/80 hover:bg-amber-300 disabled:opacity-40 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>पिछला प्रसंग</span>
                </button>

                <button
                  onClick={() => handleSaveBookmark()}
                  className="px-3 sm:px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-amber-300" />
                  <span>यहाँ विश्राम करें</span>
                </button>

                <button
                  onClick={handleNextPrasang}
                  disabled={
                    selectedKandIndex === RAMCHARITMANAS_KANDS.length - 1 &&
                    selectedPrasangIndex === currentKand.prasangs.length - 1
                  }
                  className="px-3 sm:px-4 py-2 rounded-lg bg-amber-200/80 hover:bg-amber-300 disabled:opacity-40 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>अगला प्रसंग</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeView === 'continuous_pothi' ? (
            /* ==================================================== */
            /* VIEW B: AKHAND POTHI CONTINUOUS SCROLL MODE          */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Pothi Ribbon Header */}
              <div className="text-center p-4 bg-amber-700 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ अखण्ड पोथी पाठ शैली • निरन्तर प्रवाह ॥
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {currentKand.kandNameHindi} (सम्पूर्ण पाठ)
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  {currentKand.dohaRange} • सभी प्रसंग एक साथ अविकल बिना पृष्ठ बदले
                </p>
              </div>

              {/* Continuous Stream of all prasangs in this Kand */}
              <div className="space-y-8">
                {currentKand.prasangs.map((prasang, pIdx) => (
                  <section
                    key={prasang.id}
                    className="p-4 sm:p-6 bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl shadow-sm space-y-5"
                  >
                    <div className="border-b border-amber-900/20 pb-2 text-center">
                      <span className="text-[11px] font-bold text-red-900 bg-red-100 px-2.5 py-0.5 rounded-full uppercase border border-red-200">
                        प्रसंग {pIdx + 1}: {prasang.dohaRange || ''}
                      </span>
                      <h3 className="text-xl font-bold text-red-950 mt-1">
                        {prasang.prasangTitle}
                      </h3>
                      <p className="text-xs text-stone-600">{prasang.prasangSubtitle}</p>
                    </div>

                    <div className="space-y-6">
                      {prasang.verses.map((v, vIdx) => (
                        <div key={vIdx} className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span className="font-semibold text-red-900">
                              {v.dohaNumber || v.type.toUpperCase()}
                            </span>
                            <button
                              onClick={() =>
                                handleShareVerse(v, currentKand.kandNameHindi, prasang.prasangTitle)
                              }
                              className="text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[11px]"
                            >
                              <Share2 className="w-3 h-3" /> व्हाट्सएप
                            </button>
                          </div>

                          <div className={`text-center font-serif ${fontSizeClasses.verse} text-stone-900 space-y-1`}>
                            {v.textAwadhi.map((line, lIdx) => (
                              <p key={lIdx}>{line}</p>
                            ))}
                          </div>

                          <div className="p-3 bg-amber-100/60 border border-amber-200 rounded-lg text-stone-800 text-sm">
                            <span className="text-[10px] font-bold text-red-900 block mb-0.5">
                              भावार्थ:
                            </span>
                            <p>{v.meaningHindi}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          ) : activeView === 'doha_index' ? (
            /* ==================================================== */
            /* VIEW D: COMPLETE 1,172 DOHA INDEX & DIRECT JUMP     */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center p-4 bg-amber-800 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ सम्पूर्ण १,१७२ दोहा निर्देशिका एवं प्रसंग सूची ॥
                </span>
                <h2 className="text-2xl font-black mt-1">
                  सम्पूर्ण श्रीरामचरितमानस दोहा तालिका
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  सातों काण्डों के सभी १,१७२ दोहों (१०७४ मुख्य सोपान + संधिक दोहे) का प्रामाणिक विभाजन एवं विषय अनुक्रमणिका
                </p>
              </div>

              {/* Universal 1,172 Dohas Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-amber-700 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="सम्पूर्ण १,१७२ दोहों में खोजें (उदा: 'केवट', 'धनुष', 'कलयुग', 'हनुमान', 'संजीवनी', 'मूर्छा', 'रामराज्य')..."
                  value={indexSearchQuery}
                  onChange={(e) => setIndexSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm pl-9 pr-8 py-2.5 bg-white border-2 border-amber-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600 shadow-sm"
                />
                {indexSearchQuery && (
                  <button
                    onClick={() => setIndexSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm font-bold"
                  >
                    ×
                  </button>
                )}
              </div>

              {indexSearchQuery ? (
                /* Instant Search Results across all 1,172 Dohas */
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                    <span>
                      खोज परिणाम: <strong className="text-red-950 font-bold">{globalDohaSearchResults.length}</strong> दोहे मिले
                    </span>
                    <button
                      onClick={() => setIndexSearchQuery('')}
                      className="text-red-700 hover:underline font-semibold"
                    >
                      खोज साफ़ करें
                    </button>
                  </div>

                  {globalDohaSearchResults.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-amber-200 rounded-xl text-stone-500">
                      <p>कोई दोहा नहीं मिला। कृपया अन्य शब्द या संख्या खोजें।</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {globalDohaSearchResults.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-amber-300 rounded-xl shadow-sm hover:border-amber-500 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs bg-red-800 text-white font-bold px-2.5 py-0.5 rounded">
                              {item.kandName} • दोहा {item.dohaNum}
                            </span>
                            <button
                              onClick={() => handleOpenDohaReaderForKand(item.kandIndex, item.dohaNum)}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-md flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <span>मूल पाठ पढ़ें</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
                          <div className="text-xs font-serif text-stone-800 bg-amber-50/70 p-2 rounded border border-amber-200/80">
                            {item.dohaLines.map((line, lIdx) => (
                              <p key={lIdx} className="font-medium">{line}</p>
                            ))}
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed italic">
                            भावार्थ: {item.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Kand Filter Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                      onClick={() => setDohaIndexFilterKand(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                        dohaIndexFilterKand === null
                          ? 'bg-red-800 text-white shadow'
                          : 'bg-amber-200/70 text-stone-800 hover:bg-amber-300'
                      }`}
                    >
                      सभी ७ काण्ड
                    </button>
                    {KAND_DOHA_SECTIONS.map((sec) => (
                      <button
                        key={sec.kandIndex}
                        onClick={() => setDohaIndexFilterKand(sec.kandIndex)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                          dohaIndexFilterKand === sec.kandIndex
                            ? 'bg-red-800 text-white shadow'
                            : 'bg-amber-200/70 text-stone-800 hover:bg-amber-300'
                        }`}
                      >
                        {sec.kandName} ({sec.totalDohas} दोहे)
                      </button>
                    ))}
                  </div>

                  {/* Section Episodes */}
                  <div className="space-y-6">
                    {KAND_DOHA_SECTIONS.filter((sec) =>
                      dohaIndexFilterKand === null ? true : sec.kandIndex === dohaIndexFilterKand
                    ).map((sec) => {
                      const kandUnits = ALL_KANDS_FULL_DOHAS[sec.kandIndex] || [];
                      const isExpanded = expandedIndexKandDohas === sec.kandIndex;

                      return (
                        <div
                          key={sec.kandIndex}
                          className="p-5 bg-white border-2 border-amber-300 rounded-2xl shadow-sm space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                            <div>
                              <h3 className="text-lg font-bold text-red-950">
                                {sec.kandIndex + 1}. {sec.kandName}
                              </h3>
                              <span className="text-xs text-stone-600">
                                दोहा {sec.dohaStart} से {sec.dohaEnd} (कुल {sec.totalDohas} दोहे)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() =>
                                  setExpandedIndexKandDohas((prev) => (prev === sec.kandIndex ? null : sec.kandIndex))
                                }
                                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-lg border border-amber-300 transition-colors"
                              >
                                {isExpanded ? 'सूची बंद करें' : `सभी ${sec.totalDohas} दोहे देखें ↓`}
                              </button>

                              <button
                                onClick={() => handleOpenDohaReaderForKand(sec.kandIndex, 1)}
                                className="px-3 py-1 bg-red-800 hover:bg-red-700 text-amber-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <Flame className="w-3.5 h-3.5" />
                                <span>दोहा १ से पढ़ें</span>
                              </button>
                            </div>
                          </div>

                          {/* Expandable all-dohas grid for this Kand */}
                          {isExpanded && (
                            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                              <span className="text-xs font-bold text-stone-800 block">
                                {sec.kandName} के सभी {sec.totalDohas} दोहे (किसी पर भी क्लिक कर सीधे पढ़ें):
                              </span>
                              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1 max-h-48 overflow-y-auto scrollbar-thin">
                                {kandUnits.map((u) => (
                                  <button
                                    key={u.dohaNum}
                                    onClick={() => handleOpenDohaReaderForKand(sec.kandIndex, u.dohaNum)}
                                    className="py-1 text-xs rounded bg-white hover:bg-red-800 hover:text-white border border-amber-200 text-stone-800 font-medium transition-colors"
                                    title={`दोहा ${u.dohaNum}: ${u.title}`}
                                  >
                                    {u.dohaNum}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {sec.majorEpisodes.map((ep, eIdx) => {
                              const match = ep.dohaRange.match(/\d+/);
                              const startDoha = match ? parseInt(match[0], 10) : 1;

                              return (
                                <div
                                  key={eIdx}
                                  onClick={() => handleOpenDohaReaderForKand(sec.kandIndex, startDoha)}
                                  className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-100/70 cursor-pointer transition-all space-y-1"
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-extrabold text-red-900 bg-red-100 px-2 py-0.5 rounded">
                                      {ep.dohaRange}
                                    </span>
                                    <span className="text-[10px] text-amber-800 font-semibold">
                                      दोहा {startDoha} से पढ़ें →
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-stone-900 text-sm">{ep.title}</h4>
                                  <p className="text-xs text-stone-600 line-clamp-2">{ep.description}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : activeView === 'chaupai_corpus' ? (
            /* ==================================================== */
            /* VIEW: COMPREHENSIVE 4,638 CHAUPAI CORPUS (सातों काण्ड)*/
            /* ==================================================== */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Banner */}
              <div className="text-center p-5 bg-gradient-to-r from-orange-900 via-amber-900 to-red-950 text-white rounded-2xl shadow-lg border-2 border-amber-400/70 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>गीताप्रेस गोरखपुर प्रामाणिक गणना</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 tracking-wide">
                    सम्पूर्ण श्रीरामचरितमानस ४,६३८ चौपाई कोष
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl mx-auto font-serif">
                    सातों काण्डों की ९,२७६ अर्धाली (४,६३८ पूर्ण चौपाइयाँ) • संदर्भ दोहा क्रमांक • प्रामाणिक हिन्दी भावार्थ • सस्वर वाणी पाठ
                  </p>

                  {/* Quick Stat badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold">
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      बाल: १,४४०
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      अयोध्या: १,३०४
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      अरण्य: ३९०
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      किष्किन्धा: २२५
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      सुन्दर: ५२४
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      लंका: ४६०
                    </span>
                    <span className="bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-400/30">
                      उत्तर: २९५
                    </span>
                  </div>
                </div>
              </div>

              {/* Kand Filter Chips & Search Bar */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-amber-200/80 shadow-sm space-y-3">
                {/* Kand selection */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                  <button
                    onClick={() => {
                      setChaupaiKandFilter('all');
                      setChaupaiPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      chaupaiKandFilter === 'all'
                        ? 'bg-amber-800 text-white shadow-sm ring-1 ring-amber-400'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200'
                    }`}
                  >
                    सर्व काण्ड (४,६३८)
                  </button>
                  {KAND_CHAUPAI_METRICS.map((k) => (
                    <button
                      key={k.kandIndex}
                      onClick={() => {
                        setChaupaiKandFilter(k.kandIndex);
                        setChaupaiPage(1);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        chaupaiKandFilter === k.kandIndex
                          ? 'bg-amber-800 text-white shadow-sm ring-1 ring-amber-400'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200'
                      }`}
                    >
                      {k.kandName} ({k.totalChaupais})
                    </button>
                  ))}
                </div>

                {/* Search & Direct Jump Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-amber-100">
                  {/* Search input */}
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={chaupaiSearch}
                      onChange={(e) => {
                        setChaupaiSearch(e.target.value);
                        setChaupaiPage(1);
                      }}
                      placeholder="चौपाई शब्द खोजें (उदा: मंगल भवन, रघुकुल रीति, निर्मल मन...)"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg bg-amber-50/50 border border-amber-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-900 placeholder-stone-400"
                    />
                    {chaupaiSearch && (
                      <button
                        onClick={() => {
                          setChaupaiSearch('');
                          setChaupaiPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Direct Jump input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const num = parseInt(chaupaiJumpNumber.trim(), 10);
                      if (!isNaN(num) && num >= 1 && num <= 4638) {
                        const targetPage = Math.ceil(num / CHAUPAIS_PER_PAGE);
                        setChaupaiKandFilter('all');
                        setChaupaiOnlyFamous(false);
                        setChaupaiSearch('');
                        setChaupaiPage(targetPage);
                        triggerToast(`चौपाई क्रमांक ${num} (पृष्ठ ${targetPage}) पर जा रहे हैं`);
                      } else {
                        triggerToast('कृपया १ से ४६३८ के बीच वैध चौपाई संख्या लिखें');
                      }
                    }}
                    className="sm:col-span-4 flex items-center gap-1.5"
                  >
                    <input
                      type="number"
                      min={1}
                      max={4638}
                      value={chaupaiJumpNumber}
                      onChange={(e) => setChaupaiJumpNumber(e.target.value)}
                      placeholder="चौपाई क्र. (१-४६३८)"
                      className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg bg-amber-50/50 border border-amber-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-900 placeholder-stone-400"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      जाएं
                    </button>
                  </form>

                  {/* Famous only toggle */}
                  <button
                    onClick={() => {
                      setChaupaiOnlyFamous((f) => !f);
                      setChaupaiPage(1);
                    }}
                    className={`sm:col-span-2 px-2.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      chaupaiOnlyFamous
                        ? 'bg-amber-600 text-white shadow-inner'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>प्रमुख चौपाइयाँ</span>
                  </button>
                </div>

                {/* Search result count & pagination info */}
                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <span>
                    कुल परिणाम: <strong className="text-stone-900">{filteredChaupais.length}</strong> चौपाइयाँ | पृष्ठ{' '}
                    <strong>{chaupaiPage}</strong> / <strong>{totalChaupaiPages}</strong>
                  </span>
                  {/* Pagination quick buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      disabled={chaupaiPage <= 1}
                      onClick={() => setChaupaiPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 text-stone-800 rounded text-xs font-bold"
                    >
                      ← पूर्व
                    </button>
                    <button
                      disabled={chaupaiPage >= totalChaupaiPages}
                      onClick={() => setChaupaiPage((p) => Math.min(totalChaupaiPages, p + 1))}
                      className="px-2 py-1 bg-amber-100 hover:bg-amber-200 disabled:opacity-40 text-stone-800 rounded text-xs font-bold"
                    >
                      अगला →
                    </button>
                  </div>
                </div>
              </div>

              {/* Chaupai Cards List */}
              <div className="space-y-4">
                {paginatedChaupais.map((c) => (
                  <div
                    key={c.globalIndex}
                    className="p-5 bg-white border border-amber-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white bg-red-800 px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
                          चौपाई #{c.globalIndex}
                        </span>
                        <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                          {c.kandName}
                        </span>
                        <span className="text-stone-600 font-serif">
                          संदर्भ: दोहा {c.dohaContextNumber} (चौपाई {c.chaupaiInDohaIndex})
                        </span>
                      </div>

                      {c.themeTag && (
                        <span className="text-[11px] font-semibold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                          {c.themeTag}
                        </span>
                      )}
                    </div>

                    {/* Awadhi Chaupai Lines */}
                    <div className="text-center font-serif text-lg sm:text-xl text-stone-900 font-semibold space-y-1.5 py-1">
                      {c.awadhiText.map((line, lIdx) => (
                        <p key={lIdx} className="leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>

                    {/* Hindi Meaning */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-stone-800 text-xs sm:text-sm">
                      <span className="text-[10px] font-bold text-red-900 block mb-0.5 uppercase tracking-wide">
                        हिन्दी भावार्थ:
                      </span>
                      <p className="leading-relaxed font-sans">{c.hindiMeaning}</p>
                    </div>

                    {/* Card Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeakLines(c.awadhiText, `chaupai-${c.globalIndex}`)}
                          className="px-2.5 py-1 rounded-md bg-amber-100/80 hover:bg-amber-200 text-amber-950 font-semibold flex items-center gap-1 transition-colors"
                        >
                          {isSpeaking && activeSpeakingVerseIdx === `chaupai-${c.globalIndex}` ? (
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
                          onClick={() => {
                            copyToClipboard(
                              `${c.awadhiText.join('\n')}\n\n[श्रीरामचरितमानस, ${c.kandName}, संदर्भ दोहा ${c.dohaContextNumber}, चौपाई #${c.globalIndex}]\nभावार्थ: ${c.hindiMeaning}`
                            );
                            triggerToast(`चौपाई #${c.globalIndex} कॉपी हुई`);
                          }}
                          className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>कॉपी</span>
                        </button>
                      </div>

                      {/* Jump to this Doha in full reader */}
                      <button
                        onClick={() => handleJumpFromChaupaiToDoha(c.kandIndex, c.dohaContextNumber)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <span>मूल दोहा {c.dohaContextNumber} पाठ में खोलें →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pagination */}
              {totalChaupaiPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 pb-8">
                  <button
                    disabled={chaupaiPage <= 1}
                    onClick={() => {
                      setChaupaiPage((p) => Math.max(1, p - 1));
                      contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    ← पिछला पृष्ठ
                  </button>
                  <span className="text-xs text-stone-700 font-semibold px-3">
                    पृष्ठ {chaupaiPage} / {totalChaupaiPages} (कुल {filteredChaupais.length} चौपाइयाँ)
                  </span>
                  <button
                    disabled={chaupaiPage >= totalChaupaiPages}
                    onClick={() => {
                      setChaupaiPage((p) => Math.min(totalChaupaiPages, p + 1));
                      contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    अगला पृष्ठ →
                  </button>
                </div>
              )}
            </div>
          ) : activeView === 'chhand_corpus' ? (
            /* ==================================================== */
            /* VIEW: COMPREHENSIVE 231 / 86 CHHAND CORPUS (सातों काण्ड)*/
            /* ==================================================== */
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header Banner */}
              <div className="text-center p-5 bg-gradient-to-r from-emerald-950 via-amber-950 to-red-950 text-white rounded-2xl shadow-lg border-2 border-emerald-400/60 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>श्रीमद्रामचरितमानस सम्पूर्ण छंद संग्रह</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 tracking-wide">
                    सातों काण्डों के पावन छंद (२३१ छंद / ८६ प्रामाणिक छंद)
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-200/90 max-w-2xl mx-auto font-serif">
                    हरिगीतिका, तोमर, भुजंगप्रयात, चौबोला, त्रोटक, मालती छंद • सस्वर राग व गायन विधान • विशुद्ध अवधी पाठ व हिन्दी अनुवाद
                  </p>

                  {/* Quick Kand Breakdown */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-semibold">
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      बाल: ८४ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      अयोध्या: ३३ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      अरण्य: १४ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      किष्किन्धा: ८ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      सुन्दर: १२ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      लंका: ४२ छंद
                    </span>
                    <span className="bg-emerald-950/70 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                      उत्तर: ३८ छंद
                    </span>
                  </div>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-emerald-200/80 shadow-sm space-y-3">
                {/* Kand chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
                  <button
                    onClick={() => setChhandKandFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      chhandKandFilter === 'all'
                        ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
                    }`}
                  >
                    सर्व काण्ड (२३१ / ८६)
                  </button>
                  {KAND_CHHAND_METRICS.map((k) => (
                    <button
                      key={k.kandIndex}
                      onClick={() => setChhandKandFilter(k.kandIndex)}
                      className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        chhandKandFilter === k.kandIndex
                          ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-400'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200'
                      }`}
                    >
                      {k.kandName} ({k.totalChhands})
                    </button>
                  ))}
                </div>

                {/* Meter filter & search */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-emerald-100">
                  <div className="sm:col-span-4 flex items-center gap-1 text-xs">
                    <span className="text-stone-600 font-semibold shrink-0">छंद प्रकार:</span>
                    <select
                      value={chhandMeterFilter}
                      onChange={(e) => setChhandMeterFilter(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg bg-emerald-50/50 border border-emerald-300 font-semibold text-emerald-950 focus:outline-none"
                    >
                      <option value="all">सभी छंद प्रकार</option>
                      <option value="हरिगीतिका">हरिगीतिका छंद</option>
                      <option value="तोमर">तोमर छंद</option>
                      <option value="भुजंगप्रयात">भुजंगप्रयात छंद</option>
                      <option value="चौबोला">चौबोला छंद</option>
                      <option value="त्रोटक">त्रोटक छंद</option>
                    </select>
                  </div>

                  <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={chhandSearch}
                      onChange={(e) => setChhandSearch(e.target.value)}
                      placeholder="छंद खोजें (उदा: भए प्रगट कृपाला, नमामीशमीशान, श्रीरामचन्द्र कृपालु...)"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-lg bg-emerald-50/50 border border-emerald-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 text-stone-900 placeholder-stone-400"
                    />
                    {chhandSearch && (
                      <button
                        onClick={() => setChhandSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Chhands List */}
              <div className="space-y-5">
                {filteredChhands.map((ch) => (
                  <div
                    key={ch.globalIndex}
                    className="p-5 sm:p-6 bg-white border-2 border-amber-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-400 transition-all space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white bg-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
                          छंद #{ch.globalIndex}
                        </span>
                        <span className="font-bold text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded">
                          {ch.kandName}
                        </span>
                        <span className="text-stone-600 font-serif">
                          संदर्भ: दोहा {ch.dohaContextNumber}
                        </span>
                      </div>

                      <span className="font-bold text-indigo-950 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full text-[11px]">
                        {ch.meterName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-serif font-black text-red-950">
                      {ch.chhandTitle}
                    </h3>

                    {/* Awadhi Chhand Lyrics */}
                    <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2 text-center font-serif text-base sm:text-lg text-stone-900 font-semibold leading-relaxed">
                      {ch.awadhiText.map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>

                    {/* Hindi Meaning */}
                    <div className="p-3.5 bg-yellow-50/70 border border-yellow-200 rounded-xl text-stone-800 text-xs sm:text-sm">
                      <span className="text-[10px] font-bold text-amber-900 block mb-0.5 uppercase tracking-wide">
                        छंद भावार्थ:
                      </span>
                      <p className="leading-relaxed font-sans">{ch.hindiMeaning}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSpeakLines(ch.awadhiText, `chhand-${ch.globalIndex}`)}
                          className="px-3 py-1.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          {isSpeaking && activeSpeakingVerseIdx === `chhand-${ch.globalIndex}` ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-red-600" />
                              <span>रोकें</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>सस्वर गायन</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            copyToClipboard(
                              `${ch.chhandTitle}\n${ch.awadhiText.join('\n')}\n\n[श्रीरामचरितमानस, ${ch.kandName}, संदर्भ दोहा ${ch.dohaContextNumber}, ${ch.meterName}]\nभावार्थ: ${ch.hindiMeaning}`
                            );
                            triggerToast(`${ch.chhandTitle} कॉपी हुआ`);
                          }}
                          className="px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors"
                        >
                          कॉपी
                        </button>
                      </div>

                      <button
                        onClick={() => handleJumpFromChaupaiToDoha(ch.kandIndex, ch.dohaContextNumber)}
                        className="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white rounded-md font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <span>मूल दोहा {ch.dohaContextNumber} पाठ में खोलें →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete 86 Core Titles Index Table */}
              <div className="p-5 bg-white border border-amber-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="font-serif font-bold text-red-950 text-base flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-amber-600" />
                    <span>सम्पूर्ण ८६ प्रामाणिक छंद अनुक्रमणिका (काण्ड-वार)</span>
                  </h4>
                  <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    ८६ प्रामाणिक छंद
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {CORE_86_CHHAND_TITLES.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-amber-50/50 border border-amber-200 rounded-lg flex items-center justify-between gap-1 hover:bg-amber-100/70 transition-colors"
                    >
                      <div className="truncate">
                        <span className="font-bold text-red-900 mr-1.5">#{idx + 1}</span>
                        <span className="font-medium text-stone-800">{t.title}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 font-semibold shrink-0 bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        {t.meter}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeView === 'path_vidhi' ? (
            /* ==================================================== */
            /* VIEW E: GITA PRESS PATH VIDHI & SANKALPA             */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center p-4 bg-amber-800 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ गीताप्रेस गोरखपुर प्रामाणिक विधि ॥
                </span>
                <h2 className="text-2xl font-black mt-1">
                  श्रीरामचरितमानस पाठ विधि एवं संकल्प
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  आचमन, पवित्रीकरण, हनुमान वंदना, मानस संकल्प एवं समर्पण मन्त्र
                </p>
              </div>

              {/* Achaman & Pavitrikaran */}
              <div className="p-5 bg-white border border-amber-300 rounded-xl space-y-3">
                <h3 className="font-bold text-base text-red-950 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>१. आचमन एवं पवित्रीकरण मन्त्र</span>
                </h3>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-sm font-serif space-y-2">
                  <p className="font-semibold text-stone-900">
                    {RAMAYAN_PATH_VIDHI.achaman}
                  </p>
                  <p className="text-xs text-stone-600">
                    (तीन बार आचमन करें और चौथी बार हाथ धोएं)
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-sm font-serif space-y-1">
                  <p className="font-semibold text-stone-900">
                    {RAMAYAN_PATH_VIDHI.pavitrikaran}
                  </p>
                  <p className="text-xs text-stone-600">
                    (अपने ऊपर एवं पाठ की सामग्री पर जल छिड़कें)
                  </p>
                </div>
              </div>

              {/* Hanuman Vandana */}
              <div className="p-5 bg-white border border-amber-300 rounded-xl space-y-3">
                <h3 className="font-bold text-base text-red-950 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  <span>२. श्री हनुमान जी का आह्वान एवं वंदना</span>
                </h3>
                <div className="p-3 bg-red-50/70 rounded border border-red-200 text-center space-y-2">
                  <div className="font-serif text-base font-bold text-red-950 space-y-1">
                    {RAMAYAN_PATH_VIDHI.hanumanVandana.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic border-t border-red-200 pt-2">
                    भावार्थ: {RAMAYAN_PATH_VIDHI.hanumanMeaning}
                  </p>
                </div>
              </div>

              {/* Sankalpa */}
              <div className="p-5 bg-white border border-amber-300 rounded-xl space-y-3">
                <h3 className="font-bold text-base text-red-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>३. मूल पाठ का पावन संकल्प</span>
                </h3>
                <div className="p-4 bg-amber-100/70 rounded-xl border border-amber-300 text-sm text-stone-900 leading-relaxed font-sans">
                  <p>{RAMAYAN_PATH_VIDHI.sankalpaHindi}</p>
                </div>
              </div>

              {/* Samarpan */}
              <div className="p-5 bg-white border border-amber-300 rounded-xl space-y-3">
                <h3 className="font-bold text-base text-red-950 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span>४. पाठ विश्राम एवं समर्पण मन्त्र</span>
                </h3>
                <div className="p-3 bg-amber-50 rounded border border-amber-200 text-center space-y-2">
                  <div className="font-serif text-base font-bold text-stone-900 space-y-1">
                    {RAMAYAN_PATH_VIDHI.samarpanShloka.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic border-t border-amber-200 pt-2">
                    भावार्थ: {RAMAYAN_PATH_VIDHI.samarpanMeaning}
                  </p>
                </div>
              </div>
            </div>
          ) : activeView === 'structure' ? (
            /* ==================================================== */
            /* VIEW F: CANONICAL STRUCTURE BREAKDOWN               */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center p-5 bg-gradient-to-r from-red-950 via-amber-900 to-red-950 text-white rounded-2xl shadow-xl border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-300">
                  ॥ गीताप्रेस गोरखपुर प्रामाणिक गणना ॥
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  सम्पूर्ण श्रीरामचरितमानस की संरचना
                </h2>
                <p className="text-xs sm:text-sm text-amber-200 mt-1">
                  गोस्वामी तुलसीदास रचित पावन महाग्रंथ की प्रामाणिक सांख्यिकी
                </p>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल काण्ड</span>
                    <span className="text-lg font-bold text-white">
                      {RAMCHARITMANAS_STRUCTURE.totalKands}
                    </span>
                  </div>
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल दोहे</span>
                    <span className="text-lg font-bold text-white">
                      {RAMCHARITMANAS_STRUCTURE.totalDohas.toLocaleString('hi-IN')}
                    </span>
                  </div>
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल चौपाइयां</span>
                    <span className="text-lg font-bold text-white">
                      ~{RAMCHARITMANAS_STRUCTURE.totalChaupais.toLocaleString('hi-IN')}
                    </span>
                  </div>
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल सोरठा</span>
                    <span className="text-lg font-bold text-white">
                      {RAMCHARITMANAS_STRUCTURE.totalSorathas}
                    </span>
                  </div>
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल श्लोक</span>
                    <span className="text-lg font-bold text-white">
                      {RAMCHARITMANAS_STRUCTURE.totalShlokas}
                    </span>
                  </div>
                  <div className="bg-amber-900/60 p-2 rounded-lg border border-amber-500/30">
                    <span className="text-[10px] text-amber-300 block">कुल छंद</span>
                    <span className="text-lg font-bold text-white">
                      {RAMCHARITMANAS_STRUCTURE.totalChhands}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kaand-wise Detailed Breakdown Cards */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-red-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-red-700" />
                  <span>काण्ड-वार प्रामाणिक विवरण (Kanda-wise Breakdown)</span>
                </h3>

                <div className="space-y-3">
                  {RAMCHARITMANAS_STRUCTURE.kandBreakdown.map((item, idx) => (
                    <div
                      key={item.kandNumber}
                      className="p-4 bg-white rounded-xl border-2 border-amber-300/80 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex items-center justify-center">
                            {item.kandNumber}
                          </span>
                          <h4 className="font-bold text-base text-red-950">
                            {item.kandNameHindi} ({item.kandNameEng})
                          </h4>
                        </div>
                        <span className="text-xs bg-red-100 text-red-900 font-bold px-2 py-0.5 rounded border border-red-300 self-start sm:self-auto">
                          {item.dohaRange}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                        <div className="bg-amber-50 p-2 rounded border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">दोहे</span>
                          <span className="font-bold text-red-900">{item.dohasCount}</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">चौपाइयां</span>
                          <span className="font-bold text-amber-900">
                            ~{item.chaupaisCountApprox}
                          </span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">सोरठा</span>
                          <span className="font-bold text-stone-800">{item.sorathasCount}</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded border border-amber-200">
                          <span className="text-[10px] text-stone-500 block">श्लोक</span>
                          <span className="font-bold text-stone-800">{item.shlokasCount}</span>
                        </div>
                        <div className="bg-amber-50 p-2 rounded border border-amber-200 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-stone-500 block">छंद</span>
                          <span className="font-bold text-stone-800">{item.chhandsCount}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-700 leading-relaxed font-sans">
                        <span className="font-bold text-red-900">कथानक: </span>
                        {item.significance}
                      </p>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDohaReaderForKand(idx)}
                          className="px-3 py-1 bg-red-800 hover:bg-red-700 text-amber-200 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>दोहा-वार संपूर्ण पाठ</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedKandIndex(idx);
                            setSelectedPrasangIndex(0);
                            setActiveView('kand');
                            contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <span>प्रसंग पाठ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeView === 'aarti' ? (
            /* ==================================================== */
            /* VIEW G: RAMAYAN AARTI                                */
            /* ==================================================== */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center p-4 bg-amber-700 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ पावन रामायण आरती ॥
                </span>
                <h2 className="text-2xl font-black mt-1">{RAMAYAN_AARTI.title}</h2>
                <p className="text-xs text-amber-100 mt-1">{RAMAYAN_AARTI.subtitle}</p>
              </div>

              <div className="p-6 bg-white border-2 border-amber-300 rounded-2xl shadow-sm text-center space-y-3 font-serif text-lg sm:text-xl text-stone-900 font-medium">
                {RAMAYAN_AARTI.lines.map((l, i) => (
                  <p key={i} className="leading-relaxed">
                    {l}
                  </p>
                ))}
              </div>

              <div className="p-4 bg-amber-100/70 border border-amber-300 rounded-xl text-stone-800 text-sm leading-relaxed">
                <span className="font-bold text-red-950 block mb-1">॥ आरती का भावार्थ ॥</span>
                <p>{RAMAYAN_AARTI.meaningHindi}</p>
              </div>
            </div>
          ) : activeView === 'stuti' ? (
            /* ==================================================== */
            /* VIEW H: RAM STUTI                                    */
            /* ==================================================== */
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="text-center p-4 bg-amber-700 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ गोस्वामी तुलसीदास विरचित ॥
                </span>
                <h2 className="text-2xl font-black mt-1">{RAM_STUTI.title}</h2>
                <p className="text-xs text-amber-100 mt-1">{RAM_STUTI.subtitle}</p>
              </div>

              <div className="space-y-4">
                {RAM_STUTI.verses.map((stuti, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white border-2 border-amber-300 rounded-2xl shadow-sm space-y-3 text-center"
                  >
                    <div className="font-serif text-lg sm:text-xl text-red-950 font-bold space-y-1">
                      {stuti.awadhi.map((line, lIdx) => (
                        <p key={lIdx}>{line}</p>
                      ))}
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg text-stone-800 text-sm text-left border border-amber-200">
                      <span className="font-bold text-red-900 text-xs block mb-0.5">
                        भावार्थ:
                      </span>
                      <p>{stuti.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ==================================================== */
            /* VIEW I: NAVAHNA PARAYAN SCHEDULE                    */
            /* ==================================================== */
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="text-center p-4 bg-amber-700 text-white rounded-xl shadow-md border-2 border-amber-400">
                <span className="text-xs uppercase font-serif tracking-widest text-amber-200">
                  ॥ ९-दिवसीय नवाह्न पारायण विधान ॥
                </span>
                <h2 className="text-2xl font-black mt-1">
                  श्रीरामचरितमानस नवाह्न विश्राम सारणी
                </h2>
                <p className="text-xs text-amber-100 mt-1">
                  नवरात्र अथवा अन्य शुभ अवसरों पर ९ दिनों में सम्पूर्ण रामचरितमानस पाठ का क्रम
                </p>
              </div>

              <div className="space-y-3">
                {NAVAHNA_PARAYAN_SCHEDULE.map((item) => (
                  <div
                    key={item.day}
                    onClick={() => {
                      setSelectedKandIndex(item.kandIndex);
                      setSelectedPrasangIndex(0);
                      setActiveView('kand');
                      contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-white border-2 border-amber-200 hover:border-amber-400 rounded-xl cursor-pointer transition-all shadow-sm flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-red-900 text-amber-200 font-bold text-sm flex items-center justify-center shrink-0 shadow">
                        दिन {item.day}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-red-950">{item.title}</h4>
                          <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-300">
                            {item.kand}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          विश्राम स्थल: {item.upTo}
                        </p>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1">
                      <span>पाठ करें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* FOOTER BAR: STATUS & DOHA QUICK COUNTER                  */}
        {/* ======================================================== */}
        <footer
          className={`${themeClasses.headerBg} ${themeClasses.headerText} px-3 sm:px-6 py-2 border-t-2 border-amber-600/60 flex items-center justify-between text-xs shrink-0 shadow-inner`}
        >
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="font-semibold text-amber-300">
              {activeView === 'all_dohas_full' ? currentDohaReaderKand.kandNameHindi : currentKand.kandNameHindi}
            </span>
            <span className="text-amber-200/80">
              {activeView === 'all_dohas_full'
                ? `• ${currentDohaReaderUnits.length} दोहे उपलब्ध`
                : `• प्रसंग ${selectedPrasangIndex + 1}/${currentKand.prasangs.length}`}
            </span>
            <span className="hidden sm:inline-block text-amber-200/60">
              • {currentKand.dohaRange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveView('all_dohas_full');
                contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-[11px] shadow-sm flex items-center gap-1 transition-colors"
            >
              <Flame className="w-3 h-3 text-red-600 fill-red-600" />
              <span>सम्पूर्ण दोहा पाठ (सातों काण्ड)</span>
            </button>

            <button
              onClick={() => {
                setActiveView('doha_index');
                contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-semibold border border-amber-400/30 items-center gap-1 transition-colors"
            >
              <span>१०७४ दोहा सूची</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
