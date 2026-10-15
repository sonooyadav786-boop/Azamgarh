import React from 'react';
import { CalendarEvent, DayPanchang } from '../types/calendar';
import { getAzamgarhPanchang } from '../data/calendarData';
import { isMajorFestival } from '../data/festivalKnowledge';
import { Sparkles } from 'lucide-react';

interface WallCalendarGridProps {
  year: number;
  month: number; // 1-12
  events: CalendarEvent[];
  onSelectDate: (panchang: DayPanchang, eventsOnDay: CalendarEvent[]) => void;
}

export const WallCalendarGrid: React.FC<WallCalendarGridProps> = ({
  year,
  month,
  events,
  onSelectDate,
}) => {
  const weekDays = [
    { name: 'रवि', full: 'रविवार', isSunday: true },
    { name: 'सोम', full: 'सोमवार', isSunday: false },
    { name: 'मंगल', full: 'मंगलवार', isSunday: false },
    { name: 'बुध', full: 'बुधवार', isSunday: false },
    { name: 'गुरु', full: 'गुरुवार', isSunday: false },
    { name: 'शुक्र', full: 'शुक्रवार', isSunday: false },
    { name: 'शनि', full: 'शनिवार', isSunday: false },
  ];

  // Detect Today (October 14, 2026 or device date)
  const isToday = (dayNumber: number): boolean => {
    const now = new Date();
    const isDeviceToday = now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === dayNumber;
    const is2026Today = year === 2026 && month === 10 && dayNumber === 14;
    return isDeviceToday || is2026Today;
  };

  // Days in month calculation
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create grid cells (blanks + actual days)
  const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const gridCells = [];

  for (let i = 0; i < totalSlots; i++) {
    const dayNumber = i - firstDayOfWeek + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const dayEvents = events.filter((e) => e.day === dayNumber);
      const panchang = getAzamgarhPanchang(year, month, dayNumber);
      gridCells.push({
        dayNumber,
        dayEvents,
        panchang,
        isSunday: i % 7 === 0,
        isCurrentDay: isToday(dayNumber),
      });
    } else {
      gridCells.push(null);
    }
  }

  return (
    <div className="bg-[#fffdf8] border-2 border-amber-900/30 rounded-2xl overflow-hidden shadow-md">
      {/* 1. Vedic Calendar Header Banner with Today indicator & Legend */}
      <div className="bg-gradient-to-r from-[#7c2d12] via-[#991b1b] to-[#7c2d12] text-white px-3 sm:px-4 py-2 flex items-center justify-between flex-wrap gap-2 border-b border-red-950">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-amber-400 text-stone-950 font-black px-2 py-0.5 rounded shadow-xs uppercase tracking-wide">
            वैदिक पंचांग कैलेण्डर
          </span>
          <span className="text-xs sm:text-sm font-bold text-amber-100">
            वि० सं० {year === 2026 ? '2083' : year + 57} · आजमगढ़
          </span>
        </div>

        {/* Color Legend: Clear colors without 'बड़ा' or 'छोटा' per user instructions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 text-[10px] sm:text-xs flex-wrap font-medium">
          <span className="flex items-center gap-1 bg-red-700 text-white px-2 py-0.5 rounded shadow-2xs font-bold border border-red-800">
            <span>🚩</span>
            <span>पर्व व उत्सव</span>
          </span>
          <span className="flex items-center gap-1 bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-bold border border-amber-300">
            <span>🔸</span>
            <span>व्रत व उपवास</span>
          </span>
          <span className="flex items-center gap-1 bg-rose-100 text-red-900 px-2 py-0.5 rounded font-bold border border-rose-300">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>रविवार</span>
          </span>
          <span className="flex items-center gap-1 bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-black shadow-2xs border border-amber-500">
            <span>⭐</span>
            <span>आज</span>
          </span>
        </div>
      </div>

      {/* 2. Weekday Header: Sunday highlighted in distinct deep coral/red */}
      <div className="grid grid-cols-7 text-center text-xs sm:text-sm font-bold border-b border-amber-900/20">
        {weekDays.map((wd) => (
          <div
            key={wd.name}
            className={`py-2 border-r last:border-r-0 border-amber-900/15 ${
              wd.isSunday
                ? 'bg-[#881337] text-amber-300 font-extrabold shadow-inner'
                : 'bg-[#991b1b] text-white'
            }`}
          >
            <span className="hidden sm:inline">{wd.full}</span>
            <span className="sm:hidden">{wd.name}</span>
          </div>
        ))}
      </div>

      {/* 3. Days Grid */}
      <div className="grid grid-cols-7 border-collapse">
        {gridCells.map((cell, idx) => {
          if (!cell) {
            return (
              <div
                key={`empty-${idx}`}
                className="min-h-[92px] xs:min-h-[100px] sm:min-h-[120px] bg-stone-100/40 border border-amber-900/10"
              />
            );
          }

          const hasEvents = cell.dayEvents.length > 0;
          const majorEvents = cell.dayEvents.filter((ev) => isMajorFestival(ev));
          const minorEvents = cell.dayEvents.filter((ev) => !isMajorFestival(ev));

          return (
            <div
              key={`day-${cell.dayNumber}`}
              onClick={() => onSelectDate(cell.panchang, cell.dayEvents)}
              className={`min-h-[92px] xs:min-h-[100px] sm:min-h-[120px] p-1 sm:p-1.5 border border-amber-900/15 cursor-pointer transition-all relative flex flex-col justify-between group ${
                cell.isCurrentDay
                  ? 'bg-amber-100/90 ring-3 ring-amber-500 shadow-md z-10'
                  : cell.isSunday
                  ? 'bg-[#fff1f2] hover:bg-[#ffe4e6]'
                  : hasEvents
                  ? 'bg-[#fff8ea] hover:bg-[#ffefc9]'
                  : 'bg-[#fffdf8] hover:bg-amber-50/70'
              }`}
            >
              {/* Top of Cell: Day Number & Tithi + Today Badge */}
              <div>
                <div className="flex items-start justify-between gap-0.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={`font-heading text-base sm:text-2xl font-black tabular-nums leading-none ${
                        cell.isCurrentDay
                          ? 'text-amber-950 bg-amber-300 px-1 rounded-sm'
                          : cell.isSunday
                          ? 'text-[#b91c1c]'
                          : 'text-stone-900'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {cell.isCurrentDay && (
                      <span className="text-[9px] sm:text-[10px] font-black bg-amber-500 text-stone-950 px-1 py-0.2 rounded uppercase tracking-tighter shadow-2xs">
                        आज
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold truncate text-right max-w-[55px] sm:max-w-none ${
                    cell.isSunday ? 'text-red-900/80 font-bold' : 'text-stone-600'
                  }`}>
                    {cell.panchang.tithi}
                  </span>
                </div>

                {/* Day events badges: Full readable festival names without 1-character truncation */}
                <div className="mt-1 space-y-1">
                  {/* Festivals (Distinct Red/Crimson color - wraps cleanly over 1-2 lines) */}
                  {majorEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[8px] xs:text-[8.5px] sm:text-[10px] md:text-[11px] font-bold text-white bg-gradient-to-r from-red-700 to-rose-700 rounded px-1 py-0.5 shadow-2xs leading-[1.15] border border-red-800/80 w-full text-center sm:text-left overflow-hidden group/badge"
                      title={`${ev.titleHindi} (क्लिक करें सम्पूर्ण विवरण हेतु)`}
                    >
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <span className="hidden sm:inline-block shrink-0 text-[10px]">🚩</span>
                        <span className="line-clamp-2 break-words w-full font-bold">
                          {ev.titleHindi}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Minor Festivals / Vrats (Distinct Amber/Gold color - wraps cleanly) */}
                  {minorEvents.slice(0, majorEvents.length > 0 ? 1 : 2).map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[7.5px] xs:text-[8px] sm:text-[9.5px] font-semibold text-amber-950 bg-amber-200/95 rounded px-1 py-0.5 border border-amber-300 leading-[1.15] w-full text-center sm:text-left overflow-hidden"
                      title={`${ev.titleHindi} (व्रत/पर्व - क्लिक करें विवरण हेतु)`}
                    >
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <span className="hidden sm:inline-block shrink-0 text-amber-700 text-[8px]">🔸</span>
                        <span className="line-clamp-2 break-words w-full font-semibold">
                          {ev.titleHindi}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Overflow badge if more than 2 events */}
                  {cell.dayEvents.length > 2 && (
                    <div className="text-[7.5px] sm:text-[9px] text-amber-950 font-extrabold text-right pr-0.5 leading-none">
                      +{cell.dayEvents.length - 2} और
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Info: Sunrise time & Paksha */}
              <div className="text-[8px] sm:text-[9px] text-stone-500 flex items-center justify-between pt-0.5 border-t border-amber-900/10">
                <span className="truncate tabular-nums">{cell.panchang.sunriseAzamgarh.split(' ')[0]}</span>
                <span className="font-semibold text-stone-600">
                  {cell.panchang.paksha === 'कृष्ण' ? 'कृ०' : 'शु०'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
