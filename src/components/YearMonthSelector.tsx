import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HINDI_MONTHS } from '../data/calendarData';

interface YearMonthSelectorProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  currentMonth: number; // 1-12
  onMonthChange: (month: number) => void;
}

export const YearMonthSelector: React.FC<YearMonthSelectorProps> = ({
  currentYear,
  onYearChange,
  currentMonth,
  onMonthChange,
}) => {
  const monthScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll active month into view
  useEffect(() => {
    if (monthScrollRef.current) {
      const activeEl = monthScrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentMonth]);

  const currentMonthData = HINDI_MONTHS.find((m) => m.id === currentMonth) || HINDI_MONTHS[9];

  return (
    <div className="border-b border-amber-900/15">
      {/* 1. Year Bar matching Screenshot 1: `< 2026 >` in olive/gold */}
      <div className="bg-[#788226] text-white flex items-center justify-between px-3 sm:px-4 py-1.5 shadow-xs">
        <button
          onClick={() => onYearChange(currentYear - 1)}
          className="p-1 hover:bg-black/15 rounded-md active:scale-95 transition-transform font-bold flex items-center text-sm"
          title="पिछला वर्ष"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center: Year with direct 2026 & 2027 quick tabs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-black/25 rounded-md p-0.5 border border-white/20">
            <button
              onClick={() => onYearChange(2026)}
              className={`px-3 py-0.5 rounded text-xs sm:text-sm font-bold transition-all ${
                currentYear === 2026
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => onYearChange(2027)}
              className={`px-3 py-0.5 rounded text-xs sm:text-sm font-bold transition-all ${
                currentYear === 2027
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              2027
            </button>
          </div>

          <span className="text-[11px] sm:text-xs bg-black/20 px-2 py-1 rounded-sm text-amber-100 font-mono hidden xs:inline-block">
            वि० सं० {currentYear === 2026 ? '2083' : currentYear === 2027 ? '2084' : currentYear + 57}
          </span>
        </div>

        <button
          onClick={() => onYearChange(currentYear + 1)}
          className="p-1 hover:bg-black/15 rounded-md active:scale-95 transition-transform font-bold flex items-center text-sm"
          title="अगला वर्ष"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Month Tabs in Deep Maroon/Crimson matching Screenshot 1 */}
      <div className="bg-[#991b1b] text-white overflow-x-auto scrollbar-none shadow-xs" ref={monthScrollRef}>
        <div className="flex items-center min-w-max px-2 py-0">
          {HINDI_MONTHS.map((m) => {
            const isActive = m.id === currentMonth;
            return (
              <button
                key={m.id}
                data-active={isActive ? 'true' : 'false'}
                onClick={() => onMonthChange(m.id)}
                className={`px-4 sm:px-6 py-2.5 text-sm sm:text-base font-semibold transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-red-950/40'
                    : 'text-red-200 hover:text-white hover:bg-red-800/40'
                }`}
              >
                <span>{m.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400 rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Authentic Hindu Masa & Panchang Context Bar */}
      <div className="bg-[#fef9eb] px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-700 border-b border-amber-900/10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-red-900">
            मास: {currentMonthData.hinduMasa}
          </span>
          <span className="text-stone-400">·</span>
          <span>ऋतु: {currentMonthData.season}</span>
        </div>
        <div className="flex items-center gap-2 text-stone-600">
          <span>शक संवत: {currentYear === 2026 ? '1948' : '1949'}</span>
          <span className="text-stone-400">·</span>
          <span className="text-red-800 font-medium">सूर्य सिद्धांत (आजमगढ़ रेखांश)</span>
        </div>
      </div>
    </div>
  );
};
