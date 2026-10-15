import React, { useState } from 'react';
import {
  X,
  Calendar,
  CheckCircle2,
  ExternalLink,
  LogOut,
  RefreshCw,
  Bell,
  Trash2,
  CalendarCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { CalendarEvent } from '../types/calendar';
import {
  SyncedCalendarRecord,
  addFestivalToGoogleCalendar,
  removeFestivalFromGoogleCalendar,
  googleSignIn,
  logoutGoogle,
} from '../services/googleCalendarService';
import { CalendarConfirmModal } from './CalendarConfirmModal';

interface GoogleCalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
  syncedEvents: Record<string, SyncedCalendarRecord>;
  onRefreshSyncedEvents: () => void;
  savedReminderIds: Set<string>;
  allEvents: CalendarEvent[];
  currentMonth: number;
  currentYear: number;
  onToast: (msg: string) => void;
}

export const GoogleCalendarSyncModal: React.FC<GoogleCalendarSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  onAuthChange,
  syncedEvents,
  onRefreshSyncedEvents,
  savedReminderIds,
  allEvents,
  currentMonth,
  currentYear,
  onToast,
}) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'reminders' | 'month' | 'synced'>('reminders');
  const [syncLoadingId, setSyncLoadingId] = useState<string | null>(null);
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);

  // Confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    type: 'sync_single' | 'sync_bulk' | 'delete_single';
    event?: CalendarEvent | null;
    eventsList?: CalendarEvent[];
    googleEventId?: string;
  }>({
    isOpen: false,
    type: 'sync_single',
  });

  if (!isOpen) return null;

  // Active saved reminder events
  const savedReminderEvents = allEvents.filter((ev) => savedReminderIds.has(ev.id));

  // Current month events
  const currentMonthEvents = allEvents.filter(
    (ev) => ev.year === currentYear && ev.month === currentMonth
  );

  // Synced events list
  const syncedList = Object.values(syncedEvents);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user, res.accessToken);
        onToast(`स्वागत है ${res.user.displayName || 'जी'}! Google Calendar कनेक्ट हो गया है।`);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      onToast(err.message || 'साइन इन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      onAuthChange(null, null);
      onToast('Google खाते से सफलतापूर्वक साइन आउट कर दिया गया है।');
    } catch (err: any) {
      console.error('Sign Out failed:', err);
    }
  };

  // Request to sync a single event (triggers confirmation modal)
  const promptSyncSingle = (event: CalendarEvent) => {
    if (!currentUser || !accessToken) {
      onToast('कृपया पहले "Sign in with Google" बटन दबाकर लॉगिन करें।');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      type: 'sync_single',
      event,
    });
  };

  // Request to delete a synced event (triggers confirmation modal)
  const promptDeleteSingle = (event: CalendarEvent, googleEventId: string) => {
    if (!currentUser || !accessToken) {
      onToast('कृपया पहले Google खाते से लॉगिन करें।');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      type: 'delete_single',
      event,
      googleEventId,
    });
  };

  // Request to sync bulk events
  const promptSyncBulk = (eventsList: CalendarEvent[]) => {
    if (!currentUser || !accessToken) {
      onToast('कृपया पहले "Sign in with Google" बटन दबाकर लॉगिन करें।');
      return;
    }
    const unsynced = eventsList.filter((ev) => !syncedEvents[ev.id]);
    if (unsynced.length === 0) {
      onToast('सभी चयनित त्यौहार पहले से ही आपके Google Calendar में सिंक हैं!');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      type: 'sync_bulk',
      eventsList: unsynced,
    });
  };

  // Execute confirmed action
  const handleExecuteConfirmedAction = async () => {
    if (!accessToken) return;

    if (confirmConfig.type === 'sync_single' && confirmConfig.event) {
      const targetEvent = confirmConfig.event;
      setSyncLoadingId(targetEvent.id);
      try {
        await addFestivalToGoogleCalendar(targetEvent, accessToken);
        onRefreshSyncedEvents();
        onToast(`🚩 "${targetEvent.titleHindi}" आपके Google Calendar में जोड़ दिया गया!`);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      } catch (err: any) {
        console.error('Failed to sync event:', err);
        onToast(`त्रुटि: ${err.message || 'कैलेंडर में इवेंट नहीं जोड़ा जा सका'}`);
      } finally {
        setSyncLoadingId(null);
      }
    } else if (confirmConfig.type === 'delete_single' && confirmConfig.event && confirmConfig.googleEventId) {
      const targetEvent = confirmConfig.event;
      setSyncLoadingId(targetEvent.id);
      try {
        await removeFestivalFromGoogleCalendar(
          targetEvent.id,
          confirmConfig.googleEventId,
          accessToken
        );
        onRefreshSyncedEvents();
        onToast(`"${targetEvent.titleHindi}" का अनुस्मारक Google Calendar से हटा दिया गया।`);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      } catch (err: any) {
        console.error('Failed to remove event:', err);
        onToast(`हटाने में त्रुटि: ${err.message || 'कैलेंडर से हटाया नहीं जा सका'}`);
      } finally {
        setSyncLoadingId(null);
      }
    } else if (confirmConfig.type === 'sync_bulk' && confirmConfig.eventsList) {
      setIsBulkSyncing(true);
      const list = confirmConfig.eventsList;
      let successCount = 0;
      let failedCount = 0;

      for (const ev of list) {
        try {
          await addFestivalToGoogleCalendar(ev, accessToken);
          successCount++;
        } catch (err) {
          console.error(`Failed to sync ${ev.titleHindi}:`, err);
          failedCount++;
        }
      }

      onRefreshSyncedEvents();
      setIsBulkSyncing(false);
      setConfirmConfig((prev) => ({ ...prev, isOpen: false }));

      if (successCount > 0) {
        onToast(`✅ ${successCount} त्यौहार आपके व्यक्तिगत Google Calendar में सफलतापूर्वक सिंक हो गए!`);
      }
      if (failedCount > 0) {
        onToast(`⚠️ ${failedCount} त्यौहार सिंक नहीं हो सके।`);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative bg-[#fffdfa] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white p-4 sm:p-5 flex items-start justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-white/20 text-white font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3 inline" />
                  Google Calendar Integration
                </span>
                <span className="text-xs text-blue-100 font-medium">
                  व्यक्तिगत अनुस्मारक सिंक
                </span>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1.5 flex items-center gap-2">
                <span>Google Calendar त्यौहार सिंक केंद्र</span>
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg leading-relaxed">
                आजमगढ़ पंचांग के त्यौहार, व्रत, एवं शुभ मुहूर्त सीधे अपने Google Calendar में
                जोड़ें ताकि आपके फोन व घड़ी पर समय पर नोटिफिकेशन प्राप्त हो सके।
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Account / Sign In Status Strip */}
          <div className="p-4 sm:p-5 bg-blue-50/60 border-b border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {currentUser && accessToken ? (
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-xs"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900">
                      {currentUser.displayName || 'गूगल उपयोगकर्ता'}
                    </span>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.2 rounded-full border border-green-300 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-green-700" />
                      कनेक्टेड
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-stone-700">
                  <span className="font-bold text-stone-900 block">
                    Google खाता अभी कनेक्ट नहीं है
                  </span>
                  त्यौहारों को अपने व्यक्तिगत Google Calendar पर सिंक करने के लिए नीचे दिए गए बटन से साइन इन करें।
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {currentUser && accessToken ? (
                <>
                  <a
                    href="https://calendar.google.com/calendar/r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>कैलेंडर खोलें</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="साइन आउट करें"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                /* Official Google-styled Sign-in Button as per skill requirement */
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-2.5 px-4 py-2 bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold rounded-lg border border-stone-300 shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-4 h-4 shrink-0"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  <span>
                    {isSigningIn ? 'कनेक्ट हो रहा है...' : 'Sign in with Google'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-amber-900/15 bg-amber-50/60 px-4 pt-2 overflow-x-auto gap-2">
            <button
              onClick={() => setActiveTab('reminders')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'reminders'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>सक्रिय स्मरण ({savedReminderEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('month')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'month'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>माह के पर्व ({currentMonthEvents.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('synced')}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === 'synced'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>सिंक किए गए ({syncedList.length})</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* TAB 1: SAVED REMINDERS */}
            {activeTab === 'reminders' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50 border border-amber-200/80 rounded-xl p-3">
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>आपके द्वारा बुकमार्क किए गए अलार्म / स्मरण</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      इन सभी त्यौहारों को एक साथ अपने Google Calendar में सिंक करें।
                    </p>
                  </div>

                  {savedReminderEvents.length > 0 && (
                    <button
                      onClick={() => promptSyncBulk(savedReminderEvents)}
                      disabled={!currentUser || !accessToken || isBulkSyncing}
                      className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                      <span>सभी {savedReminderEvents.length} स्मरण सिंक करें</span>
                    </button>
                  )}
                </div>

                {savedReminderEvents.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                    <Bell className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-stone-700">
                      अभी तक कोई त्यौहार स्मरण (अलार्म) में नहीं जोड़ा गया है
                    </p>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      कैलेंडर में किसी भी त्यौहार कार्ड पर घंटी (अलार्म) आइकन दबाकर उसे जोड़ें, या &ldquo;माह के पर्व&rdquo; टैब से सिंक करें।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedReminderEvents.map((ev) => {
                      const isSynced = Boolean(syncedEvents[ev.id]);
                      const isLoading = syncLoadingId === ev.id;
                      const record = syncedEvents[ev.id];

                      return (
                        <div
                          key={ev.id}
                          className="flex items-center justify-between gap-3 p-3 bg-white border border-amber-200/80 rounded-xl hover:border-amber-400 transition-colors shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-heading font-bold text-stone-900 text-sm">
                                🚩 {ev.titleHindi}
                              </span>
                              {ev.isGazettedHoliday && (
                                <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded-xs">
                                  अवकाश
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-600 mt-0.5">
                              {ev.fullDateHindi} · {ev.hinduMonth} ({ev.tithi})
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSynced ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                  <span>कैलेंडर में सक्रिय</span>
                                </span>
                                {record?.htmlLink && (
                                  <a
                                    href={record.htmlLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Google Calendar में देखें"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  onClick={() => promptDeleteSingle(ev, record.googleEventId)}
                                  disabled={isLoading}
                                  className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                  title="कैलेंडर से हटाएं"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => promptSyncSingle(ev)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                              >
                                {isLoading ? (
                                  <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Calendar className="w-3.5 h-3.5" />
                                )}
                                <span>Google Calendar में जोड़ें</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: CURRENT MONTH FESTIVALS */}
            {activeTab === 'month' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/80 border border-blue-200/80 rounded-xl p-3">
                  <div>
                    <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-700" />
                      <span>माह के सभी {currentMonthEvents.length} प्रमुख त्यौहार</span>
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      अक्टूबर 2026 / चयनित माह के सभी त्यौहारों को अपने व्यक्तिगत कैलेंडर में दर्ज करें।
                    </p>
                  </div>

                  <button
                    onClick={() => promptSyncBulk(currentMonthEvents)}
                    disabled={!currentUser || !accessToken || isBulkSyncing}
                    className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isBulkSyncing ? 'animate-spin' : ''}`} />
                    <span>इस माह के सभी त्यौहार सिंक करें</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {currentMonthEvents.map((ev) => {
                    const isSynced = Boolean(syncedEvents[ev.id]);
                    const isLoading = syncLoadingId === ev.id;
                    const record = syncedEvents[ev.id];

                    return (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between gap-3 p-3 bg-white border border-stone-200 rounded-xl hover:border-blue-300 transition-colors shadow-2xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {ev.day} {ev.titleHindi}
                            </span>
                            {ev.isGazettedHoliday && (
                              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded-xs">
                                अवकाश
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-600 mt-0.5">
                            {ev.fullDateHindi} · {ev.tithi} ({ev.paksha} पक्ष)
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSynced ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                <span>सिंक है</span>
                              </span>
                              <button
                                onClick={() => promptDeleteSingle(ev, record.googleEventId)}
                                disabled={isLoading}
                                className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                title="कैलेंडर से हटाएं"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => promptSyncSingle(ev)}
                              disabled={isLoading}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1"
                            >
                              {isLoading ? (
                                <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Calendar className="w-3.5 h-3.5" />
                              )}
                              <span>सिंक करें</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ALREADY SYNCED LIST */}
            {activeTab === 'synced' && (
              <div className="space-y-4">
                {syncedList.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                    <CalendarCheck className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-stone-700">
                      अभी तक कोई त्यौहार Google Calendar में सिंक नहीं किया गया है
                    </p>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                      अपने पसंदीदा त्यौहारों को चुनें और &ldquo;Google Calendar में जोड़ें&rdquo; पर टैप करें।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-stone-600 px-1 font-medium">
                      कुल {syncedList.length} त्यौहार आपके Google Calendar में जुड़े हैं:
                    </div>
                    {syncedList.map((item) => {
                      const ev = allEvents.find((e) => e.id === item.eventId);
                      const isLoading = syncLoadingId === item.eventId;

                      return (
                        <div
                          key={item.eventId}
                          className="flex items-center justify-between gap-3 p-3 bg-white border border-green-200 rounded-xl shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                              <span>{item.title}</span>
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              दिनांक: {item.dateStr} · सिंक समय: {new Date(item.syncedAt).toLocaleDateString('hi-IN')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.htmlLink && (
                              <a
                                href={item.htmlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors flex items-center gap-1"
                              >
                                <span>देखें</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {ev && (
                              <button
                                onClick={() => promptDeleteSingle(ev, item.googleEventId)}
                                disabled={isLoading}
                                className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                title="कैलेंडर से हटाएं"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Notes */}
          <div className="p-3 sm:p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <span>
              🔒 सुरक्षित सिंक: टोकन केवल ब्राउज़र मेमोरी में रहता है। आपकी सहमति के बिना कुछ भी संशोधित नहीं होता।
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg transition-colors self-end sm:self-auto"
            >
              पूर्ण (Close)
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <CalendarConfirmModal
        isOpen={confirmConfig.isOpen}
        type={confirmConfig.type}
        event={confirmConfig.event}
        eventsList={confirmConfig.eventsList}
        userEmail={currentUser?.email}
        isLoading={Boolean(syncLoadingId) || isBulkSyncing}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
