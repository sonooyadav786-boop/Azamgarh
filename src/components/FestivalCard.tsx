import React from 'react';
import { Bell, BellRing, ChevronRight, CalendarCheck, CalendarPlus } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';
import { DevotionalArtIcon } from './DevotionalArtIcon';
import { isMajorFestival } from '../data/festivalKnowledge';

interface FestivalCardProps {
  event: CalendarEvent;
  isReminderSet: boolean;
  onToggleReminder: (id: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  isFirstOfDay?: boolean;
  isCalendarSynced?: boolean;
  onSyncGoogleCalendar?: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export const FestivalCard: React.FC<FestivalCardProps> = ({
  event,
  isReminderSet,
  onToggleReminder,
  onSelectEvent,
  isFirstOfDay = true,
  isCalendarSynced = false,
  onSyncGoogleCalendar,
}) => {
  const isMajor = isMajorFestival(event);
  const isSunday = event.dayOfWeekHindi === 'रविवार';

  return (
    <div
      onClick={() => onSelectEvent(event)}
      className={`group relative cursor-pointer rounded-xl p-3 sm:p-3.5 transition-all duration-150 shadow-xs hover:shadow-md flex items-stretch gap-3 sm:gap-4 overflow-hidden border ${
        isMajor
          ? 'bg-gradient-to-r from-[#fff2d6] via-[#ffe8bf] to-[#fff2d6] border-red-500/70 hover:border-red-600'
          : 'bg-[#fffbf0] hover:bg-[#fff6e0] border-amber-300/80'
      }`}
    >
      {/* Left Column: Big Day Number & Day Name with Sunday Distinction */}
      <div className={`w-14 sm:w-16 shrink-0 flex flex-col justify-start items-center pt-1 border-r pr-2 ${
        isSunday ? 'border-red-200' : 'border-[#ebd18d]/60'
      }`}>
        {isFirstOfDay ? (
          <>
            <span className={`font-heading text-3xl sm:text-4xl font-black tabular-nums leading-none ${
              isSunday ? 'text-[#991b1b]' : 'text-[#7c2d12]'
            }`}>
              {event.day}
            </span>
            <span className={`text-xs font-bold mt-1 px-1.5 py-0.2 rounded-sm ${
              isSunday ? 'text-red-900 bg-red-100 font-black' : 'text-stone-700'
            }`}>
              {event.dayOfWeekHindi}
            </span>
          </>
        ) : (
          <div className="h-full flex items-center justify-center opacity-30">
            <span className="text-xs text-stone-600 font-medium">↳</span>
          </div>
        )}
      </div>

      {/* Middle Column: Event Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className={`font-heading text-base sm:text-lg font-black tracking-tight group-hover:text-[#7f1d1d] transition-colors leading-snug ${
              isMajor ? 'text-[#991b1b]' : 'text-[#854d0e]'
            }`}>
              {event.titleHindi}
            </h4>

            {/* Festival Badge: No 'बड़ा' keyword per user request */}
            {isMajor ? (
              <span className="text-[10px] bg-red-700 text-white font-black px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                <span>🚩</span>
                <span>पावन पर्व</span>
              </span>
            ) : (
              <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                <span>🔸</span>
                <span>व्रत व उपवास</span>
              </span>
            )}

            {event.isGazettedHoliday && (
              <span className="text-[10px] bg-red-800 text-white font-semibold px-1.5 py-0.5 rounded-sm">
                अवकाश
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-medium text-stone-800 mt-0.5">
            {event.fullDateHindi}
          </p>

          <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-stone-700">{event.hinduMonth}, {event.paksha} {event.tithi}</span>
            {event.subText && (
              <>
                <span className="text-stone-400">·</span>
                <span className="text-stone-700 italic">{event.subText}</span>
              </>
            )}
            <span className="text-amber-800/80 font-medium text-[11px] bg-amber-100/70 px-1 rounded">
              🙏 पूजा विधि · 🪔 कथा · ⏳ इतिहास
            </span>
          </p>
        </div>

        {/* Bottom Actions inside card: Reminder Alarm button & Google Calendar button & Tap for Panchang indicator */}
        <div className="mt-2 pt-1 flex items-center justify-between gap-1 flex-wrap border-t border-amber-900/10">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => onToggleReminder(event.id, e)}
              className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-colors ${
                isReminderSet
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-900/80 hover:bg-amber-300/60'
              }`}
              title={isReminderSet ? 'अनुस्मारक सक्रिय है' : 'स्मरण (अलार्म) सेट करें'}
            >
              {isReminderSet ? (
                <BellRing className="w-3.5 h-3.5 text-white animate-bounce" />
              ) : (
                <Bell className="w-3.5 h-3.5 text-amber-800" />
              )}
              <span className="hidden sm:inline">
                {isReminderSet ? 'स्मरण सेट है' : 'अलार्म'}
              </span>
            </button>

            {onSyncGoogleCalendar && (
              <button
                type="button"
                onClick={(e) => onSyncGoogleCalendar(event, e)}
                className={`flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md transition-all ${
                  isCalendarSynced
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-blue-900 hover:bg-blue-100/70 border border-blue-300/70'
                }`}
                title={
                  isCalendarSynced
                    ? 'Google Calendar में सिंक है'
                    : 'Google Calendar में यह त्यौहार जोड़ें'
                }
              >
                {isCalendarSynced ? (
                  <CalendarCheck className="w-3.5 h-3.5 text-white" />
                ) : (
                  <CalendarPlus className="w-3.5 h-3.5 text-blue-700" />
                )}
                <span>
                  {isCalendarSynced ? 'Cal सिंक' : 'Google Cal'}
                </span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-amber-950 font-bold flex items-center gap-0.5 group-hover:text-red-900 transition-colors">
            <span>सम्पूर्ण विधि व पंचांग</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-red-700" />
          </span>
        </div>
      </div>

      {/* Right Column: Sacred Artwork Image Tile */}
      <div className="shrink-0 self-center">
        <DevotionalArtIcon type={event.imageType} size="md" />
      </div>
    </div>
  );
};
