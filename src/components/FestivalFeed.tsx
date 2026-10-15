import React from 'react';
import { CalendarEvent } from '../types/calendar';
import { FestivalCard } from './FestivalCard';
import { Calendar, ChevronUp, Sparkles, FilterX } from 'lucide-react';
import { SyncedCalendarRecord } from '../services/googleCalendarService';

interface FestivalFeedProps {
  events: CalendarEvent[];
  reminders: Set<string>;
  onToggleReminder: (id: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  currentMonthName: string;
  currentYear: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  syncedEvents?: Record<string, SyncedCalendarRecord>;
  onSyncGoogleCalendar?: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export const FestivalFeed: React.FC<FestivalFeedProps> = ({
  events,
  reminders,
  onToggleReminder,
  onSelectEvent,
  currentMonthName,
  currentYear,
  onClearFilters,
  hasActiveFilters,
  syncedEvents = {},
  onSyncGoogleCalendar,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (events.length === 0) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-800 mb-4 border border-amber-300">
          <Calendar className="w-8 h-8 opacity-75" />
        </div>
        <h3 className="font-heading text-lg font-bold text-stone-800">
          कोई त्यौहार या व्रत नहीं मिला
        </h3>
        <p className="text-sm text-stone-600 mt-1">
          {hasActiveFilters
            ? 'वर्तमान फ़िल्टर के अनुसार इस माह में कोई परिणाम नहीं है।'
            : 'इस महीने के लिए अन्य तिथियों को देखें।'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 bg-[#991b1b] text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition-colors inline-flex items-center gap-1.5"
          >
            <FilterX className="w-4 h-4" />
            <span>फ़िल्टर हटाएं</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative pb-20">
      <div className="space-y-2.5">
        {events.map((event, idx) => {
          // Check if previous event was on the same day to group day numbers gracefully
          const prevEvent = idx > 0 ? events[idx - 1] : null;
          const isFirstOfDay = !prevEvent || prevEvent.day !== event.day;

          return (
            <FestivalCard
              key={event.id}
              event={event}
              isReminderSet={reminders.has(event.id)}
              onToggleReminder={onToggleReminder}
              onSelectEvent={onSelectEvent}
              isFirstOfDay={isFirstOfDay}
              isCalendarSynced={Boolean(syncedEvents[event.id])}
              onSyncGoogleCalendar={onSyncGoogleCalendar}
            />
          );
        })}
      </div>

      {/* Floating Action Button matching screenshot 1 (Red circular icon) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-30 w-12 h-12 bg-[#991b1b] text-white rounded-full shadow-xl hover:bg-red-800 active:scale-90 transition-all flex items-center justify-center border-2 border-amber-200"
        title="शीर्ष पर जाएं"
        aria-label="ऊपर जाएं"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
};
