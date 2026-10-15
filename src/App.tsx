/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { QuickActionBar } from './components/QuickActionBar';
import { YearMonthSelector } from './components/YearMonthSelector';
import { FestivalFeed } from './components/FestivalFeed';
import { WallCalendarGrid } from './components/WallCalendarGrid';
import { DetailModal } from './components/DetailModal';
import { DevotionalSection } from './components/DevotionalSection';
import { AzamgarhHeritageModal } from './components/AzamgarhHeritageModal';
import { FilterDrawer } from './components/FilterDrawer';
import { PdfPrintView } from './components/PdfPrintView';
import { DatePickerModal } from './components/DatePickerModal';
import { ChoghadiyaModal } from './components/ChoghadiyaModal';
import { KrishnaCharitamritModal } from './components/KrishnaCharitamritModal';
import { RamcharitmanasModal } from './components/RamcharitmanasModal';
import { ShivPuranModal } from './components/ShivPuranModal';
import { VishnuPuranModal } from './components/VishnuPuranModal';
import { MahabharatModal } from './components/MahabharatModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { GoogleCalendarSyncModal } from './components/GoogleCalendarSyncModal';
import { CalendarConfirmModal } from './components/CalendarConfirmModal';
import { AajKaPanchangCard } from './components/AajKaPanchangCard';
import { FunctionMenuDrawer } from './components/FunctionMenuDrawer';
import { MahagranthModal } from './components/MahagranthModal';
import { ALL_FESTIVAL_EVENTS, HINDI_MONTHS, getAzamgarhPanchang } from './data/calendarData';
import { CalendarEvent, DayPanchang, EventCategory } from './types/calendar';
import { BellRing, Check, MapPin, Sparkles, Settings, CalendarCheck2, ChevronDown, ChevronUp, BookOpen, Mic } from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initCalendarAuth,
  getSyncedEventsMap,
  SyncedCalendarRecord,
  addFestivalToGoogleCalendar,
  removeFestivalFromGoogleCalendar,
} from './services/googleCalendarService';
import { getStoredVoiceSettings } from './services/voiceAudioService';

export default function App() {
  // Initial state: Year 2026, Month 10 (October) to match user's screenshots 1 & 2 immediately!
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(10);
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('grid'); // Default to grid so calendar opens immediately!
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<EventCategory>('all');
  const [showHolidaysOnly, setShowHolidaysOnly] = useState<boolean>(false);

  // User saved reminder bells
  const [reminders, setReminders] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('azamgarh_calendar_reminders');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedPanchang, setSelectedPanchang] = useState<DayPanchang | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showAartiModal, setShowAartiModal] = useState<boolean>(false);
  const [showHeritageModal, setShowHeritageModal] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState<boolean>(false);
  const [showChoghadiyaModal, setShowChoghadiyaModal] = useState<boolean>(false);
  const [showKrishnaModal, setShowKrishnaModal] = useState<boolean>(false);
  const [showRamayanModal, setShowRamayanModal] = useState<boolean>(false);
  const [showShivPuranModal, setShowShivPuranModal] = useState<boolean>(false);
  const [showVishnuPuranModal, setShowVishnuPuranModal] = useState<boolean>(false);
  const [showMahabharatModal, setShowMahabharatModal] = useState<boolean>(false);
  const [showVoiceSettingsModal, setShowVoiceSettingsModal] = useState<boolean>(false);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState<boolean>(false);
  const [showMahagranthModal, setShowMahagranthModal] = useState<boolean>(false);
  
  const [showMasterMenu, setShowMasterMenu] = useState<boolean>(false);
  
  // Secondary options tabbed hub state (null by default so calendar is visible immediately upon app opening)
  const [activeHubTab, setActiveHubTab] = useState<'panchang' | 'scriptures' | 'sync' | null>(null);

  // Google Calendar Auth & Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [syncedEvents, setSyncedEvents] = useState<Record<string, SyncedCalendarRecord>>(() =>
    getSyncedEventsMap()
  );

  // Google Calendar Confirmation Modal State (MANDATORY per workspace integration skill)
  const [calendarConfirm, setCalendarConfirm] = useState<{
    isOpen: boolean;
    type: 'sync_single' | 'sync_bulk' | 'delete_single';
    event?: CalendarEvent | null;
    googleEventId?: string;
    isLoading?: boolean;
  }>({
    isOpen: false,
    type: 'sync_single',
  });

  // Listen to Google Auth State
  useEffect(() => {
    const unsubscribe = initCalendarAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshSyncedEvents = () => {
    setSyncedEvents(getSyncedEventsMap());
  };

  // Save reminders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('azamgarh_calendar_reminders', JSON.stringify(Array.from(reminders)));
    } catch {
      // storage quota or private mode fallback
    }
  }, [reminders]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleToggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        triggerToast('स्मरण अनुस्मारक हटाया गया');
      } else {
        next.add(id);
        triggerToast('🔔 इस पावन त्यौहार का स्मरण सेट कर दिया गया!');
      }
      return next;
    });
  };

  // Google Calendar Sync handler from card or detail modal
  const handleRequestGoogleCalendarSync = (event: CalendarEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // If user has not signed in with Google, open sync modal so they can authenticate
    if (!currentUser || !accessToken) {
      setShowGoogleCalendarModal(true);
      triggerToast('Google Calendar में सिंक करने के लिए कृपया पहले साइन इन करें');
      return;
    }

    const record = syncedEvents[event.id];
    if (record) {
      // Already synced: ask confirmation to remove
      setCalendarConfirm({
        isOpen: true,
        type: 'delete_single',
        event,
        googleEventId: record.googleEventId,
      });
    } else {
      // Not synced: ask confirmation to add
      setCalendarConfirm({
        isOpen: true,
        type: 'sync_single',
        event,
      });
    }
  };

  const handleExecuteCalendarConfirm = async () => {
    if (!accessToken) return;

    if (calendarConfirm.type === 'sync_single' && calendarConfirm.event) {
      const target = calendarConfirm.event;
      setCalendarConfirm((prev) => ({ ...prev, isLoading: true }));
      try {
        await addFestivalToGoogleCalendar(target, accessToken);
        refreshSyncedEvents();
        triggerToast(`🚩 "${target.titleHindi}" आपके Google Calendar में जोड़ दिया गया!`);
        setCalendarConfirm((prev) => ({ ...prev, isOpen: false, isLoading: false }));
      } catch (err: any) {
        console.error('Failed to sync event:', err);
        triggerToast(`त्रुटि: ${err.message || 'कैलेंडर में इवेंट नहीं जोड़ा जा सका'}`);
        setCalendarConfirm((prev) => ({ ...prev, isLoading: false }));
      }
    } else if (
      calendarConfirm.type === 'delete_single' &&
      calendarConfirm.event &&
      calendarConfirm.googleEventId
    ) {
      const target = calendarConfirm.event;
      setCalendarConfirm((prev) => ({ ...prev, isLoading: true }));
      try {
        await removeFestivalFromGoogleCalendar(
          target.id,
          calendarConfirm.googleEventId,
          accessToken
        );
        refreshSyncedEvents();
        triggerToast(`"${target.titleHindi}" Google Calendar से हटा दिया गया`);
        setCalendarConfirm((prev) => ({ ...prev, isOpen: false, isLoading: false }));
      } catch (err: any) {
        console.error('Failed to remove event:', err);
        triggerToast(`त्रुटि: ${err.message || 'कैलेंडर से हटाया नहीं जा सका'}`);
        setCalendarConfirm((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  // Filtered list of events
  const currentMonthEvents = useMemo(() => {
    return ALL_FESTIVAL_EVENTS.filter((ev) => {
      // Year matching
      if (ev.year !== currentYear) return false;

      // Search matching across Hindi and English titles, tithis and descriptions
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          ev.titleHindi.toLowerCase().includes(q) ||
          ev.titleEng.toLowerCase().includes(q) ||
          ev.tithi.toLowerCase().includes(q) ||
          ev.hinduMonth.toLowerCase().includes(q) ||
          (ev.descriptionHindi && ev.descriptionHindi.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      } else {
        // If no search query, filter by current month
        if (ev.month !== currentMonth) return false;
      }

      // Category filter
      if (activeFilter !== 'all' && ev.category !== activeFilter) {
        return false;
      }

      // Holiday filter
      if (showHolidaysOnly && !ev.isGazettedHoliday) {
        return false;
      }

      return true;
    });
  }, [currentYear, currentMonth, searchQuery, activeFilter, showHolidaysOnly]);

  const currentMonthName = HINDI_MONTHS.find((m) => m.id === currentMonth)?.name || 'अक्टूबर';

  // Handler to open full details
  const handleOpenEventDetail = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedPanchang(getAzamgarhPanchang(event.year, event.month, event.day));
    setShowDetailModal(true);
  };

  // Handler when clicking on a date in wall grid
  const handleSelectGridDate = (panchang: DayPanchang, dayEvents: CalendarEvent[]) => {
    setSelectedPanchang(panchang);
    setSelectedEvent(dayEvents[0] || null);
    setShowDetailModal(true);
  };

  // Jump to today
  const handleJumpToday = () => {
    const today = new Date();
    const is2026 = currentYear === 2026;
    const targetYr = 2026;
    const targetMo = is2026 ? 10 : today.getMonth() + 1;
    const targetDay = is2026 ? 14 : today.getDate(); // 14 October 2026 (आज का दिन)
    
    setCurrentYear(targetYr);
    setCurrentMonth(targetMo);
    setViewMode('grid');
    const panchang = getAzamgarhPanchang(targetYr, targetMo, targetDay);
    const dayEvents = ALL_FESTIVAL_EVENTS.filter(
      (e) => e.year === targetYr && e.month === targetMo && e.day === targetDay
    );
    setSelectedPanchang(panchang);
    setSelectedEvent(dayEvents[0] || null);
    setShowDetailModal(true);
    triggerToast('⭐ आज की पावन तिथि: 14 अक्टूबर 2026 (मां कूष्माण्डा पूजा / विनायक चतुर्थी)');
  };

  return (
    <div className="min-h-screen bg-[#faf5e8] flex flex-col font-sans">
      {/* 1. Top App Bar */}
      <TopBar
        currentYear={currentYear}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPdf={() => setShowPdfModal(true)}
        onOpenMasterMenu={() => setShowMasterMenu(true)}
        syncedCount={Object.keys(syncedEvents).length}
        isGoogleCalendarConnected={Boolean(currentUser && accessToken)}
        onJumpToday={handleJumpToday}
      />

      {/* 2. Quick Action Icon Strip */}
      <QuickActionBar
        currentYear={currentYear}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((m) => (m === 'feed' ? 'grid' : 'feed'))}
        onSwitchToCalendar={() => {
          setViewMode('grid');
          setCurrentYear(2026);
          setCurrentMonth(10);
          triggerToast('📅 वैदिक पंचांग कैलेंडर: आज की तिथि एवं त्यौहार सक्रिय हैं');
        }}
        onOpenDatePicker={() => setShowDatePickerModal(true)}
        onJumpToday={handleJumpToday}
        onOpenPdf={() => setShowPdfModal(true)}
        onOpenFilter={() => setShowFilterDrawer(true)}
        onOpenAarti={() => setShowAartiModal(true)}
        onOpenChoghadiya={() => {
          setSelectedPanchang(getAzamgarhPanchang(currentYear, currentMonth, 14));
          setShowChoghadiyaModal(true);
        }}
        onOpenScriptures={() => {
          setShowMahagranthModal(true);
        }}
        activeFilter={activeFilter}
      />

      {/* 3. Year Navigator & Horizontal Month Tabs Strip */}
      <YearMonthSelector
        currentYear={currentYear}
        onYearChange={setCurrentYear}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />

      {/* Active Filter Indicator banner if filter is active */}
      {(activeFilter !== 'all' || showHolidaysOnly || searchQuery) && (
        <div className="bg-amber-100/90 border-b border-amber-300 px-4 py-1.5 flex items-center justify-between text-xs text-amber-950">
          <div className="flex items-center gap-1.5 font-medium">
            <span>सक्रिय फ़िल्टर:</span>
            <span className="font-bold">
              {searchQuery
                ? `खोज "${searchQuery}"`
                : activeFilter !== 'all'
                ? activeFilter
                : 'अवकाश'}
            </span>
          </div>
          <button
            onClick={() => {
              setActiveFilter('all');
              setShowHolidaysOnly(false);
              setSearchQuery('');
            }}
            className="text-red-800 font-bold hover:underline"
          >
            सभी दिखाएं (रीसेट)
          </button>
        </div>
      )}

      {/* 4. Main Body Content: Calendar displayed first upon app open */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* ======================================================== */}
        {/* 📅 मुख्य वैदिक पंचांग कैलेण्डर (Primary Vedic Calendar Grid) */}
        {/* Directly visible upon opening the app per user request */}
        {/* ======================================================== */}
        {viewMode === 'grid' ? (
          <WallCalendarGrid
            year={currentYear}
            month={currentMonth}
            events={currentMonthEvents}
            onSelectDate={handleSelectGridDate}
          />
        ) : (
          <FestivalFeed
            events={currentMonthEvents}
            reminders={reminders}
            onToggleReminder={handleToggleReminder}
            onSelectEvent={handleOpenEventDetail}
            currentMonthName={currentMonthName}
            currentYear={currentYear}
            syncedEvents={syncedEvents}
            onSyncGoogleCalendar={handleRequestGoogleCalendarSync}
            onClearFilters={() => {
              setActiveFilter('all');
              setShowHolidaysOnly(false);
              setSearchQuery('');
            }}
            hasActiveFilters={activeFilter !== 'all' || showHolidaysOnly || Boolean(searchQuery)}
          />
        )}

        {/* ======================================================== */}
        {/* 🪔 अन्य सुविधाएं (बाकी ऑप्शन मैनुअली खोलने पे खुलें) */}
        {/* Secondary options in clean manual expandable drawers */}
        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* 🪔 अन्य धार्मिक सुविधाएं व सेटिंग्स (सुव्यवस्थित केंद्र) */}
        {/* User-friendly tabbed hub: No clutter, opens on user click */}
        {/* ======================================================== */}
        <div className="pt-2 border-t border-amber-900/15 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-700 font-bold px-1">
            <span className="flex items-center gap-1.5 text-stone-800">
              <span className="text-sm">🪔</span>
              <span>अन्य धार्मिक सुविधाएं व सेटिंग्स (क्लिक कर खोलें):</span>
            </span>
            <span className="text-[11px] text-amber-900 font-black bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              ३ मुख्य अनुभाग
            </span>
          </div>

          {/* 3 Unified Tabs/Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Tab 1: आज का पंचांग */}
            <button
              onClick={() => setActiveHubTab((curr) => (curr === 'panchang' ? null : 'panchang'))}
              className={`p-3 rounded-xl border text-left transition-all shadow-2xs flex items-center justify-between ${
                activeHubTab === 'panchang'
                  ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                  : 'bg-[#fffdf8] hover:bg-amber-50/80 border-amber-300/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🌅</span>
                <div>
                  <span className="text-xs font-black text-red-950 block">आज का पंचांग</span>
                  <span className="text-[10px] text-stone-600 block">सूर्योदय, मुहूर्त व चौघड़िया</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-amber-800 transition-transform ${activeHubTab === 'panchang' ? 'rotate-180' : ''}`} />
            </button>

            {/* Tab 2: सनातन पंच महाग्रंथ */}
            <button
              onClick={() => {
                setActiveHubTab('scriptures');
                setShowMahagranthModal(true);
              }}
              className="p-3 rounded-xl border text-left transition-all shadow-2xs flex items-center justify-between bg-[#fffdf8] hover:bg-red-50/80 border-red-300 hover:border-red-500 active:scale-95"
              title="सनातन पंच महाग्रंथ खोलें"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <span className="text-xs font-black text-red-950 block">सनातन पंच महाग्रंथ</span>
                  <span className="text-[10px] text-stone-600 block">रामायण, शिव व विष्णु पुराण, महाभारत...</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-red-700 text-white px-2 py-0.5 rounded shadow-2xs shrink-0">
                खोलें 📖
              </span>
            </button>

            {/* Tab 3: डिजिटल सिंक व सेटिंग्स */}
            <button
              onClick={() => setActiveHubTab((curr) => (curr === 'sync' ? null : 'sync'))}
              className={`p-3 rounded-xl border text-left transition-all shadow-2xs flex items-center justify-between ${
                activeHubTab === 'sync'
                  ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-400'
                  : 'bg-[#fffdf8] hover:bg-blue-50/80 border-blue-300/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <div>
                  <span className="text-xs font-black text-blue-950 block">सिंक एवं सेटिंग्स</span>
                  <span className="text-[10px] text-stone-600 block">Google Calendar व AI वाणी</span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-blue-800 transition-transform ${activeHubTab === 'sync' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Tab Content */}
          {activeHubTab === 'panchang' && (
            <div className="bg-[#fffdf8] border-2 border-amber-300 rounded-2xl p-3 shadow-md animate-fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
                <span className="text-xs font-black text-red-950 flex items-center gap-1.5 font-serif">
                  <span>🌅</span>
                  <span>आज का दैनिक पंचांग, सूर्योदय-सूर्यास्त व चौघड़िया</span>
                </span>
                <button
                  onClick={() => setActiveHubTab(null)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  बंद करें ✕
                </button>
              </div>
              <AajKaPanchangCard
                onOpenFullPanchang={(panchang, event) => {
                  setSelectedPanchang(panchang);
                  setSelectedEvent(event || null);
                  setShowDetailModal(true);
                }}
                onOpenChoghadiya={(panchang) => {
                  setSelectedPanchang(panchang);
                  setShowChoghadiyaModal(true);
                }}
              />
            </div>
          )}

          {activeHubTab === 'scriptures' && (
            <div className="bg-gradient-to-br from-[#fffdf5] via-[#fffbf2] to-[#fbf3e0] border-2 border-amber-300 rounded-2xl p-3.5 sm:p-4 shadow-md space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full bg-red-800 text-amber-200 shadow-2xs text-xs font-serif">
                    卐
                  </span>
                  <div>
                    <h3 className="font-serif font-black text-sm sm:text-base text-red-950 leading-tight">
                      सम्पूर्ण सनातन पावन पंच महाग्रंथ सागर
                    </h3>
                    <p className="text-[11px] text-stone-600 font-sans leading-tight">
                      शुद्ध सानुवाद पाठ, सस्वर वाणी उच्चारण, श्लोक, दोहा व आध्यात्मिक सार
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveHubTab(null)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  बंद करें ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {/* 1. Ramcharitmanas */}
                <div 
                  onClick={() => setShowRamayanModal(true)}
                  className="p-3 rounded-xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-300/80 hover:border-red-600 hover:shadow-md transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-950 font-serif flex items-center gap-1 group-hover:text-red-800">
                      🚩 श्रीरामचरितमानस
                    </span>
                    <span className="text-[10px] font-bold bg-red-800 text-white px-1.5 py-0.2 rounded">
                      ७ काण्ड
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans leading-snug line-clamp-2">
                    १,१७२ दोहे, ४,६३८ चौपाइयां व २३१ छंद • सम्पूर्ण सातों काण्ड का सानुवाद व सस्वर पाठ
                  </p>
                  <span className="text-[11px] font-bold text-red-800 flex items-center gap-0.5 pt-0.5">
                    सम्पूर्ण पाठ खोलें →
                  </span>
                </div>

                {/* 2. Shiv Mahapuran */}
                <div 
                  onClick={() => setShowShivPuranModal(true)}
                  className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-stone-50 border border-orange-300/80 hover:border-orange-600 hover:shadow-md transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-950 font-serif flex items-center gap-1 group-hover:text-orange-800">
                      🔱 श्री शिव महापुराण
                    </span>
                    <span className="text-[10px] font-bold bg-orange-800 text-white px-1.5 py-0.2 rounded">
                      ७ संहिताएं
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans leading-snug line-clamp-2">
                    विद्येश्वर, रुद्र, शतरुद्र, कोटिरुद्र संहिता • द्वादश १२ ज्योतिर्लिंग व पावन स्तोत्र
                  </p>
                  <span className="text-[11px] font-bold text-orange-800 flex items-center gap-0.5 pt-0.5">
                    सम्पूर्ण संहिताएं पढ़ें →
                  </span>
                </div>

                {/* 3. Vishnu Puran */}
                <div 
                  onClick={() => setShowVishnuPuranModal(true)}
                  className="p-3 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-300/80 hover:border-cyan-600 hover:shadow-md transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-950 font-serif flex items-center gap-1 group-hover:text-cyan-800">
                      🪷 श्री विष्णु पुराण
                    </span>
                    <span className="text-[10px] font-bold bg-cyan-800 text-white px-1.5 py-0.2 rounded">
                      षट् अंश
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans leading-snug line-clamp-2">
                    पराशर-मैत्रेय संवाद • ध्रुव-प्रह्लाद, जड़भरत, मन्वंतर, श्रीकृष्ण व आत्यन्तिक मोक्ष
                  </p>
                  <span className="text-[11px] font-bold text-cyan-800 flex items-center gap-0.5 pt-0.5">
                    सम्पूर्ण षट् अंश पढ़ें →
                  </span>
                </div>

                {/* 4. Mahabharat */}
                <div 
                  onClick={() => setShowMahabharatModal(true)}
                  className="p-3 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 border border-red-300/80 hover:border-red-700 hover:shadow-md transition-all cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-950 font-serif flex items-center gap-1 group-hover:text-red-900">
                      🏹 सम्पूर्ण महाभारत
                    </span>
                    <span className="text-[10px] font-bold bg-red-900 text-white px-1.5 py-0.2 rounded">
                      १८ पर्व
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans leading-snug line-clamp-2">
                    आदि से स्वर्गारोहण तक • श्रीमद्भगवद्गीता सार, यक्ष-युधिष्ठिर संवाद व भीष्म उपदेश
                  </p>
                  <span className="text-[11px] font-bold text-red-900 flex items-center gap-0.5 pt-0.5">
                    सम्पूर्ण १८ पर्व पढ़ें →
                  </span>
                </div>

                {/* 5. Krishna Charitamrit */}
                <div 
                  onClick={() => setShowKrishnaModal(true)}
                  className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-300/80 hover:border-amber-600 hover:shadow-md transition-all cursor-pointer space-y-1.5 group sm:col-span-2 md:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-950 font-serif flex items-center gap-1 group-hover:text-amber-800">
                      ✨ श्री कृष्ण सम्पूर्ण चरितामृत
                    </span>
                    <span className="text-[10px] font-bold bg-amber-800 text-white px-1.5 py-0.2 rounded">
                      २४ खण्ड
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans leading-snug line-clamp-2">
                    श्रीमद्भागवत एवं महाभारत आधारित २४ खण्डों में सम्पूर्ण बाललीला, गोवर्धन, कंस वध एवं द्वारका लीला
                  </p>
                  <span className="text-[11px] font-bold text-amber-900 flex items-center gap-0.5 pt-0.5">
                    सम्पूर्ण २४ खण्ड कथा पढ़ें →
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeHubTab === 'sync' && (
            <div className="bg-[#fffdf8] border-2 border-blue-300 rounded-2xl p-3.5 sm:p-4 shadow-md space-y-3 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="text-xs font-black text-blue-950 flex items-center gap-1.5 font-serif">
                  <span>⚡</span>
                  <span>Google Calendar सिंक एवं AI वाणी सेटिंग्स हब</span>
                </span>
                <button
                  onClick={() => setActiveHubTab(null)}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800"
                >
                  बंद करें ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Google Calendar Sync Card */}
                <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white rounded-xl shadow-md p-3.5 border border-blue-400 flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white/20 border border-white/30 text-white shrink-0">
                      <CalendarCheck2 className="w-5 h-5 text-blue-100" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-white">
                        📅 Google Calendar सिंक
                      </h4>
                      <p className="text-xs text-blue-100 mt-0.5">
                        त्यौहार व व्रत अपने Google Calendar में 1-क्लिक में जोड़ें और व्यक्तिगत अग्रिम रिमाइंडर पाएं।
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGoogleCalendarModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-white hover:bg-blue-50 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>📅 कैलेंडर सिंक केंद्र खोलें →</span>
                  </button>
                </div>

                {/* AI Voice & Custom API Settings Card */}
                <div className="bg-gradient-to-br from-[#451a03] via-[#78350f] to-[#9a3412] text-white rounded-xl shadow-md p-3.5 border border-amber-400 flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
                      <Settings className="w-5 h-5 animate-spin-slow text-amber-300" />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-sm text-amber-100">
                        ⚙️ AI वाणी व API सेटिंग्स
                      </h4>
                      <p className="text-xs text-amber-200 mt-0.5">
                        भजन, आरती व पावन ग्रंथों का सस्वर पाठ। अपनी निजी Gemini API Key जोड़ें या मॉडल चुनें।
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowVoiceSettingsModal(true)}
                    className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <span>⚙️ सेटिंग्स व API खोलें →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#7c2d12] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-amber-300 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 📋 Master Function Menu Drawer */}
      <FunctionMenuDrawer
        isOpen={showMasterMenu}
        onClose={() => setShowMasterMenu(false)}
        onJumpToday={handleJumpToday}
        onSwitchToCalendar={() => {
          setViewMode('grid');
          setCurrentYear(2026);
          setCurrentMonth(10);
          triggerToast('📅 वैदिक पंचांग कैलेंडर: आज की तिथि एवं त्यौहार सक्रिय हैं');
        }}
        onToggleViewMode={() => setViewMode((m) => (m === 'feed' ? 'grid' : 'feed'))}
        viewMode={viewMode}
        onOpenDatePicker={() => setShowDatePickerModal(true)}
        onOpenChoghadiya={() => {
          setSelectedPanchang(getAzamgarhPanchang(currentYear, currentMonth, 14));
          setShowChoghadiyaModal(true);
        }}
        onOpenFilter={() => setShowFilterDrawer(true)}
        onOpenAarti={() => setShowAartiModal(true)}
        onOpenRamayan={() => setShowRamayanModal(true)}
        onOpenShivPuran={() => setShowShivPuranModal(true)}
        onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
        onOpenMahabharat={() => setShowMahabharatModal(true)}
        onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        onOpenGoogleCalendar={() => setShowGoogleCalendarModal(true)}
        onOpenVoiceSettings={() => setShowVoiceSettingsModal(true)}
        onOpenHeritage={() => setShowHeritageModal(true)}
        onOpenPdf={() => setShowPdfModal(true)}
        onOpenMahagranth={() => setShowMahagranthModal(true)}
        syncedCount={Object.keys(syncedEvents).length}
      />

      {/* 📖 Sanatan Panch Mahagranth Modal */}
      <MahagranthModal
        isOpen={showMahagranthModal}
        onClose={() => setShowMahagranthModal(false)}
        onOpenRamayan={() => setShowRamayanModal(true)}
        onOpenShivPuran={() => setShowShivPuranModal(true)}
        onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
        onOpenMahabharat={() => setShowMahabharatModal(true)}
        onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        onOpenAarti={() => setShowAartiModal(true)}
      />

      {/* Modals */}
      {showDetailModal && selectedPanchang && (
        <DetailModal
          event={selectedEvent}
          panchang={selectedPanchang}
          onClose={() => setShowDetailModal(false)}
          onOpenRamayan={() => setShowRamayanModal(true)}
          isCalendarSynced={Boolean(selectedEvent && syncedEvents[selectedEvent.id])}
          onSyncGoogleCalendar={handleRequestGoogleCalendarSync}
        />
      )}

      {showAartiModal && (
        <DevotionalSection 
          onClose={() => setShowAartiModal(false)} 
          onOpenVoiceSettings={() => setShowVoiceSettingsModal(true)}
        />
      )}

      {showHeritageModal && (
        <AzamgarhHeritageModal onClose={() => setShowHeritageModal(false)} />
      )}

      {showFilterDrawer && (
        <FilterDrawer
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          showHolidaysOnly={showHolidaysOnly}
          onToggleHolidaysOnly={() => setShowHolidaysOnly((h) => !h)}
          onClose={() => setShowFilterDrawer(false)}
        />
      )}

      {showPdfModal && (
        <PdfPrintView
          year={currentYear}
          month={currentMonth}
          events={currentMonthEvents}
          onClose={() => setShowPdfModal(false)}
        />
      )}

      {showDatePickerModal && (
        <DatePickerModal
          currentYear={currentYear}
          currentMonth={currentMonth}
          onSelectDate={(y, m, d) => {
            setCurrentYear(y);
            setCurrentMonth(m);
            const p = getAzamgarhPanchang(y, m, d);
            const ev = ALL_FESTIVAL_EVENTS.find(
              (e) => e.year === y && e.month === m && e.day === d
            );
            setSelectedPanchang(p);
            setSelectedEvent(ev || null);
            setShowDetailModal(true);
          }}
          onClose={() => setShowDatePickerModal(false)}
        />
      )}

      {showChoghadiyaModal && selectedPanchang && (
        <ChoghadiyaModal
          panchang={selectedPanchang}
          onClose={() => setShowChoghadiyaModal(false)}
        />
      )}

      {showKrishnaModal && (
        <KrishnaCharitamritModal
          onClose={() => setShowKrishnaModal(false)}
          onOpenRamayan={() => setShowRamayanModal(true)}
          onOpenShivPuran={() => setShowShivPuranModal(true)}
          onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
          onOpenMahabharat={() => setShowMahabharatModal(true)}
        />
      )}

      {showRamayanModal && (
        <RamcharitmanasModal
          onClose={() => setShowRamayanModal(false)}
          onOpenShivPuran={() => setShowShivPuranModal(true)}
          onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
          onOpenMahabharat={() => setShowMahabharatModal(true)}
          onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        />
      )}

      {showShivPuranModal && (
        <ShivPuranModal
          onClose={() => setShowShivPuranModal(false)}
          onOpenRamayan={() => setShowRamayanModal(true)}
          onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
          onOpenMahabharat={() => setShowMahabharatModal(true)}
          onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        />
      )}

      {showVishnuPuranModal && (
        <VishnuPuranModal
          onClose={() => setShowVishnuPuranModal(false)}
          onOpenRamayan={() => setShowRamayanModal(true)}
          onOpenShivPuran={() => setShowShivPuranModal(true)}
          onOpenMahabharat={() => setShowMahabharatModal(true)}
          onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        />
      )}

      {showMahabharatModal && (
        <MahabharatModal
          onClose={() => setShowMahabharatModal(false)}
          onOpenRamayan={() => setShowRamayanModal(true)}
          onOpenShivPuran={() => setShowShivPuranModal(true)}
          onOpenVishnuPuran={() => setShowVishnuPuranModal(true)}
          onOpenKrishnaKatha={() => setShowKrishnaModal(true)}
        />
      )}

      {showVoiceSettingsModal && (
        <VoiceSettingsModal onClose={() => setShowVoiceSettingsModal(false)} />
      )}

      {/* Google Calendar Sync Manager Modal */}
      {showGoogleCalendarModal && (
        <GoogleCalendarSyncModal
          isOpen={showGoogleCalendarModal}
          onClose={() => setShowGoogleCalendarModal(false)}
          currentUser={currentUser}
          accessToken={accessToken}
          onAuthChange={(user, token) => {
            setCurrentUser(user);
            setAccessToken(token);
          }}
          syncedEvents={syncedEvents}
          onRefreshSyncedEvents={refreshSyncedEvents}
          savedReminderIds={reminders}
          allEvents={ALL_FESTIVAL_EVENTS}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onToast={triggerToast}
        />
      )}

      {/* Google Calendar Explicit User Confirmation Modal */}
      <CalendarConfirmModal
        isOpen={calendarConfirm.isOpen}
        type={calendarConfirm.type}
        event={calendarConfirm.event}
        userEmail={currentUser?.email}
        isLoading={calendarConfirm.isLoading}
        onConfirm={handleExecuteCalendarConfirm}
        onCancel={() => setCalendarConfirm((prev) => ({ ...prev, isOpen: false }))}
      />



      {/* Footer */}
      <footer className="no-print bg-[#2e1065]/5 border-t border-amber-900/10 py-6 text-center text-xs text-stone-600 space-y-1">
        <p className="font-semibold text-red-950">
          आजमगढ़ पंचांग एवं हिन्दू कैलेंडर · उत्तर प्रदेश (UP 50)
        </p>
        <p className="text-[11px] text-stone-500">
          महर्षि दुर्वासा आश्रम, दत्तात्रेय धाम एवं पावन तमसा नदी संगम की सनातन परंपरा पर आधारित
        </p>
      </footer>
    </div>
  );
}
