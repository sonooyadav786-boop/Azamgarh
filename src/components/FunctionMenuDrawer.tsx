import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Sun, 
  Scroll, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Settings, 
  CalendarCheck2, 
  Printer, 
  MapPin, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  Layers,
  HeartHandshake,
  Share2,
  Check,
  Copy,
  Smartphone
} from 'lucide-react';

interface FunctionMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToday: () => void;
  onSwitchToCalendar: () => void;
  onToggleViewMode: () => void;
  viewMode: 'feed' | 'grid';
  onOpenDatePicker: () => void;
  onOpenChoghadiya: () => void;
  onOpenFilter: () => void;
  onOpenAarti: () => void;
  onOpenRamayan: () => void;
  onOpenShivPuran: () => void;
  onOpenVishnuPuran: () => void;
  onOpenMahabharat: () => void;
  onOpenKrishnaKatha: () => void;
  onOpenGoogleCalendar: () => void;
  onOpenVoiceSettings: () => void;
  onOpenHeritage: () => void;
  onOpenPdf: () => void;
  onOpenMahagranth?: () => void;
  syncedCount?: number;
}

export const FunctionMenuDrawer: React.FC<FunctionMenuDrawerProps> = ({
  isOpen,
  onClose,
  onJumpToday,
  onSwitchToCalendar,
  onToggleViewMode,
  viewMode,
  onOpenDatePicker,
  onOpenChoghadiya,
  onOpenFilter,
  onOpenAarti,
  onOpenRamayan,
  onOpenShivPuran,
  onOpenVishnuPuran,
  onOpenMahabharat,
  onOpenKrishnaKatha,
  onOpenGoogleCalendar,
  onOpenVoiceSettings,
  onOpenHeritage,
  onOpenPdf,
  onOpenMahagranth,
  syncedCount = 0,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareApp = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'आजमगढ़ कैलेंडर 2026 - 2027 (Azamgarh Hindu Panchang & Calendar)',
      text: 'आजमगढ़ पंचांग एवं हिंदू कैलेंडर 2026 - 2027: सभी भारतीय त्यौहार, व्रत, तिथि, मुहूर्त व आरती। यहाँ देखें:',
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleWhatsAppShare = () => {
    const url = window.location.href;
    const msg = `🚩 *आजमगढ़ पंचांग एवं हिंदू कैलेंडर 2026 - 2027*\nसभी त्यौहार, व्रत, तिथि, चौघड़िया, राहुकाल व आरती यहाँ देखें:\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-full max-w-md bg-[#fffdf8] text-stone-900 h-full shadow-2xl flex flex-col z-10 border-l border-amber-900/20 overflow-hidden animate-slide-in-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#991b1b] via-[#881337] to-[#7c2d12] text-white p-4 shadow-md flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-serif text-lg font-black shadow-md border border-amber-300">
              卐
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-amber-100 leading-tight">
                सम्पूर्ण वैदिक फंक्शन मेन्यू
              </h2>
              <p className="text-[11px] text-amber-200/90 font-sans flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-amber-300" />
                <span>आजमगढ़ पंचांग · समस्त धार्मिक सेवाएं</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="मेन्यू बंद करें"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Section 1: पंचांग एवं कैलेंडर सेवाएं */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-red-950 uppercase tracking-wider mb-2 font-serif border-b border-amber-900/15 pb-1">
              <span className="text-sm">📅</span>
              <span>पंचांग एवं कैलेंडर सेवाएं</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Today */}
              <button
                onClick={() => {
                  onJumpToday();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-300 text-left transition-all shadow-2xs group flex items-start gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-red-950 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                  <Sun className="w-4 h-4 text-red-950" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-red-900">
                    आज का दिन
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    दैनिक पंचांग व स्थिति
                  </span>
                </div>
              </button>

              {/* 2. Wall Calendar */}
              <button
                onClick={() => {
                  onSwitchToCalendar();
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all shadow-2xs group flex items-start gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-amber-100/90 border-amber-500 ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-amber-50 border-stone-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
                  <CalendarIcon className="w-4 h-4 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-blue-900">
                    वैदिक कैलेंडर
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    मासिक वॉल ग्रिड
                  </span>
                </div>
              </button>

              {/* 3. Festival Feed */}
              <button
                onClick={() => {
                  if (viewMode !== 'feed') onToggleViewMode();
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all shadow-2xs group flex items-start gap-2 ${
                  viewMode === 'feed'
                    ? 'bg-amber-100/90 border-amber-500 ring-1 ring-amber-400'
                    : 'bg-stone-50 hover:bg-amber-50 border-stone-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 border border-orange-200">
                  <Scroll className="w-4 h-4 text-orange-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-orange-900">
                    त्यौहार सूची
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    माह के समस्त पर्व
                  </span>
                </div>
              </button>

              {/* 4. Choghadiya */}
              <button
                onClick={() => {
                  onOpenChoghadiya();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-left transition-all shadow-2xs group flex items-start gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-emerald-900">
                    शुभ चौघड़िया
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    दिन-रात के मुहूर्त
                  </span>
                </div>
              </button>

              {/* 5. Date Picker */}
              <button
                onClick={() => {
                  onOpenDatePicker();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-purple-50 border border-stone-200 hover:border-purple-300 text-left transition-all shadow-2xs group flex items-start gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 border border-purple-200">
                  <CalendarIcon className="w-4 h-4 text-purple-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-purple-900">
                    दिनांक चुनें
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    किसी भी तिथि पर जाएं
                  </span>
                </div>
              </button>

              {/* 6. Filter */}
              <button
                onClick={() => {
                  onOpenFilter();
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-stone-50 hover:bg-rose-50 border border-stone-200 hover:border-rose-300 text-left transition-all shadow-2xs group flex items-start gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200">
                  <Filter className="w-4 h-4 text-rose-700" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block group-hover:text-rose-900">
                    पर्व फ़िल्टर
                  </span>
                  <span className="text-[10px] text-stone-600 block truncate">
                    व्रत, जयंती, अवकाश
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: सनातन पावन पंच महाग्रंथ */}
          <div>
            <div className="flex items-center justify-between text-xs font-black text-red-950 uppercase tracking-wider mb-2 font-serif border-b border-amber-900/15 pb-1">
              <span className="flex items-center gap-1.5">
                <span className="text-sm">🪔</span>
                <span>सनातन पावन पंच महाग्रंथ</span>
              </span>
              {onOpenMahagranth ? (
                <button
                  onClick={() => {
                    onClose();
                    onOpenMahagranth();
                  }}
                  className="text-[10px] bg-red-800 hover:bg-red-700 text-white px-2 py-0.5 rounded font-bold shadow-2xs active:scale-95 transition-all"
                  title="सभी महाग्रंथों की विस्तृत सूची खोलें"
                >
                  सम्पूर्ण संग्रह 📖
                </button>
              ) : (
                <span className="text-[10px] bg-red-800 text-white px-1.5 py-0.2 rounded font-bold">
                  ५ ग्रन्थ
                </span>
              )}
            </div>

            <div className="space-y-2">
              {/* 1. Ramcharitmanas */}
              <button
                onClick={() => {
                  onOpenRamayan();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 border border-red-300/80 text-left transition-all shadow-2xs group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-700 text-white flex items-center justify-center shrink-0 shadow-2xs font-serif text-sm">
                    🚩
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-red-950 block font-serif">
                      श्रीरामचरितमानस (सम्पूर्ण सातों काण्ड)
                    </span>
                    <span className="text-[10px] text-stone-600 block truncate">
                      १,१७२ दोहे, ४,६३८ चौपाइयां · सानुवाद व सस्वर पाठ
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 2. Shiv Puran */}
              <button
                onClick={() => {
                  onOpenShivPuran();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-orange-50 to-stone-50 hover:from-orange-100 hover:to-stone-100 border border-orange-300/80 text-left transition-all shadow-2xs group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-700 text-white flex items-center justify-center shrink-0 shadow-2xs font-serif text-sm">
                    🔱
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-orange-950 block font-serif">
                      श्री शिव महापुराण (सम्पूर्ण ७ संहिताएं)
                    </span>
                    <span className="text-[10px] text-stone-600 block truncate">
                      विद्येश्वर, रुद्र, शतरुद्र · द्वादश ज्योतिर्लिंग व महिमा
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-orange-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 3. Vishnu Puran */}
              <button
                onClick={() => {
                  onOpenVishnuPuran();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-300/80 text-left transition-all shadow-2xs group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-cyan-700 text-white flex items-center justify-center shrink-0 shadow-2xs font-serif text-sm">
                    🪷
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-cyan-950 block font-serif">
                      श्री विष्णु पुराण (सम्पूर्ण षट् अंश)
                    </span>
                    <span className="text-[10px] text-stone-600 block truncate">
                      पराशर-मैत्रेय संवाद · ध्रुव-प्रह्लाद व मोक्ष धर्म
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 4. Mahabharat */}
              <button
                onClick={() => {
                  onOpenMahabharat();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-rose-50 to-red-50 hover:from-rose-100 hover:to-red-100 border border-red-300/80 text-left transition-all shadow-2xs group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-red-900 text-white flex items-center justify-center shrink-0 shadow-2xs font-serif text-sm">
                    🏹
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-red-950 block font-serif">
                      सम्पूर्ण महाभारत (सम्पूर्ण १८ पर्व)
                    </span>
                    <span className="text-[10px] text-stone-600 block truncate">
                      आदि से स्वर्गारोहण · श्रीमद्भगवद्गीता सार व यक्ष प्रश्न
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-900 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 5. Krishna Charitamrit */}
              <button
                onClick={() => {
                  onOpenKrishnaKatha();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border border-amber-300/80 text-left transition-all shadow-2xs group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-serif text-sm">
                    ✨
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-amber-950 block font-serif">
                      श्रीकृष्ण सम्पूर्ण चरितामृत (२४ खण्ड)
                    </span>
                    <span className="text-[10px] text-stone-600 block truncate">
                      भागवत व महाभारत आधारित सम्पूर्ण बाललीला व द्वारका
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Section 3: स्तुति एवं भक्ति */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-red-950 uppercase tracking-wider mb-2 font-serif border-b border-amber-900/15 pb-1">
              <span className="text-sm">🙏</span>
              <span>स्तुति, आरती व चालीसा संग्रह</span>
            </div>

            <button
              onClick={() => {
                onOpenAarti();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-50 via-amber-50 to-purple-50 hover:from-purple-100 hover:to-amber-100 border border-purple-200 text-left transition-all shadow-2xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-xs font-black text-purple-950 block font-serif">
                    समस्त देवी-देवता आरती व चालीसा
                  </span>
                  <span className="text-[10px] text-stone-600 block">
                    गणेश, शिव, दुर्गा, हनुमान, लक्ष्मी जी की आरती व चालीसा
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-800 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Section 4: डिजिटल सिंक एवं Google Calendar */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-950 uppercase tracking-wider mb-2 font-serif border-b border-blue-900/15 pb-1">
              <span className="text-sm">⚡</span>
              <span>डिजिटल सिंक एवं रिमाइंडर</span>
            </div>

            <button
              onClick={() => {
                onOpenGoogleCalendar();
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-300 text-left transition-all shadow-2xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <CalendarCheck2 className="w-5 h-5 text-blue-100" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-blue-950 block font-serif">
                      Google Calendar सिंक केंद्र
                    </span>
                    {syncedCount > 0 && (
                      <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                        {syncedCount} सिंक
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-600 block">
                    सभी त्यौहार व व्रत 1-क्लिक में अपने गूगल कैलेंडर में जोड़ें
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-800 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Section 5: धार्मिक धरोहर, सेटिंग्स व पीडीएफ */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 uppercase tracking-wider mb-2 font-serif border-b border-stone-300 pb-1">
              <span className="text-sm">🏛️</span>
              <span>धरोहर, सेटिंग्स एवं पीडीएफ</span>
            </div>

            <div className="space-y-2">
              {/* Heritage */}
              <button
                onClick={() => {
                  onOpenHeritage();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50 border border-stone-200 text-left transition-all shadow-2xs flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300">
                    <MapPin className="w-4 h-4 text-amber-800" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block group-hover:text-red-950">
                      आजमगढ़ पावन तीर्थ व ऋषि धाम
                    </span>
                    <span className="text-[10px] text-stone-600 block">
                      महर्षि दुर्वासा, दत्तात्रेय आश्रम, चंद्रमा धाम व भैरव बाबा
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
              </button>

              {/* Voice & App Settings */}
              <button
                onClick={() => {
                  onOpenVoiceSettings();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 hover:from-amber-200 hover:to-yellow-200 border-2 border-amber-400 text-left transition-all shadow-2xs flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-2xs">
                    <Settings className="w-4 h-4 text-stone-950 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-red-950 block font-serif">
                      ऐप सेटिंग्स, API सुविधा एवं AI वाणी
                    </span>
                    <span className="text-[10px] text-amber-950 block">
                      सस्वर पाठ आवाज़, फ़ॉन्ट आकार व निजी Gemini API Key
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-900 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* PDF Print */}
              <button
                onClick={() => {
                  onOpenPdf();
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl bg-stone-50 hover:bg-red-50 border border-stone-200 text-left transition-all shadow-2xs flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-800 flex items-center justify-center shrink-0 border border-red-200">
                    <Printer className="w-4 h-4 text-red-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block group-hover:text-red-950">
                      वार्षिक पंचांग पीडीएफ डाउनलोड व प्रिंट
                    </span>
                    <span className="text-[10px] text-stone-600 block">
                      प्रिंट-फ्रेंडली दीवार कैलेंडर A4 शीट
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700" />
              </button>
            </div>
          </div>

          {/* Section 6: ऐप शेयर व मोबाइल इंस्टॉल (Share & Install App) */}
          <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-red-800 text-amber-200 flex items-center justify-center font-bold text-xs">
                📲
              </div>
              <div>
                <h4 className="text-xs font-black text-red-950">
                  ऐप शेयर करें व मोबाइल में इंस्टॉल करें
                </h4>
                <p className="text-[10px] text-amber-900">
                  परिवार व मित्रों को पंचांग भेजें या होम-स्क्रीन पर जोड़ें
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleShareApp}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs shadow-2xs active:scale-95 transition-all"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-900" />
                    <span className="text-emerald-950">लिंक कॉपी हुआ!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>शेयर / लिंक कॉपी</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-2xs active:scale-95 transition-all"
              >
                <span>💬 WhatsApp शेयर</span>
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-amber-200/80 flex items-start gap-1.5 text-[10px] text-stone-600 leading-tight">
              <Smartphone className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
              <span>
                <strong>फ़ोन ऐप जैसा चलाएं:</strong> मोबाइल ब्राउज़र में <strong>"Add to Home screen"</strong> (होम स्क्रीन में जोड़ें) दबाएं।
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-600">
          <span>आजमगढ़ वैदिक पंचांग संवत् २०८३</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-900 text-white rounded-lg font-bold text-xs hover:bg-red-800"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
