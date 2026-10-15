import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Sparkles, ChevronRight } from 'lucide-react';
import { HINDI_MONTHS, FESTIVAL_EVENTS_2026, getAzamgarhPanchang } from '../data/calendarData';
import { isMajorFestival } from '../data/festivalKnowledge';
import { CalendarEvent } from '../types/calendar';

interface DatePickerModalProps {
  currentYear: number;
  currentMonth: number;
  onSelectDate: (year: number, month: number, day: number) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  currentYear,
  currentMonth,
  onSelectDate,
  onClose,
}) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  
  // Auto-select today's date (October 14, 2026 or real today)
  const today = new Date();
  const initialTodayDay = (currentYear === 2026 && currentMonth === 10) 
    ? 14 
    : (currentYear === today.getFullYear() && currentMonth === today.getMonth() + 1)
    ? today.getDate()
    : 14;

  const [selectedDay, setSelectedDay] = useState(initialTodayDay);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const handleApply = () => {
    onSelectDate(selectedYear, selectedMonth, selectedDay);
    onClose();
  };

  // Selected Day Panchang and Events Preview
  const selectedPanchang = getAzamgarhPanchang(selectedYear, selectedMonth, selectedDay);
  const selectedEvents = FESTIVAL_EVENTS_2026.filter(
    (e: CalendarEvent) => e.year === selectedYear && e.month === selectedMonth && e.day === selectedDay
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-md rounded-2xl shadow-2xl border-2 border-amber-900/30 overflow-hidden my-auto animate-fade-in flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#7f1d1d] via-[#991b1b] to-[#7f1d1d] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-amber-400/40">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-red-950 shadow-inner">
              <CalendarIcon className="w-5 h-5 text-red-950" />
            </span>
            <div>
              <h3 className="font-heading text-base font-black text-amber-100 flex items-center gap-1.5">
                वैदिक कैलेण्डर एवं तिथि दर्शन
              </h3>
              <p className="text-[11px] text-amber-200/90 font-sans">
                स्वतः आज की तिथि, वार व त्यौहार दर्शित
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Year & Month Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                वर्ष (Year):
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[2025, 2026, 2027, 2028].map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`py-1 text-xs font-bold rounded-lg border transition-all ${
                      selectedYear === y
                        ? 'bg-[#991b1b] text-white border-red-900 shadow-xs'
                        : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                माह (Month):
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs sm:text-sm text-stone-800 font-bold focus:outline-none focus:ring-1 focus:ring-red-800 shadow-2xs"
              >
                {HINDI_MONTHS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.eng}) - {m.hinduMasa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Day Grid like Vedic Wall Calendar */}
          <div className="border border-amber-900/20 rounded-xl overflow-hidden bg-white shadow-2xs">
            {/* Weekday Strip */}
            <div className="grid grid-cols-7 text-center text-[10px] sm:text-xs font-bold border-b border-amber-900/15">
              <div className="py-1 bg-red-800 text-amber-200">रवि (Sun)</div>
              <div className="py-1 bg-red-900 text-white">सोम</div>
              <div className="py-1 bg-red-900 text-white">मंगल</div>
              <div className="py-1 bg-red-900 text-white">बुध</div>
              <div className="py-1 bg-red-900 text-white">गुरु</div>
              <div className="py-1 bg-red-900 text-white">शुक्र</div>
              <div className="py-1 bg-red-900 text-white">शनि</div>
            </div>

            {/* Days with Colors for Sunday, Today, Major & Minor festivals */}
            <div className="grid grid-cols-7 gap-0.5 p-1 bg-stone-100/60 max-h-48 overflow-y-auto">
              {/* Padding empty days */}
              {Array.from({ length: new Date(selectedYear, selectedMonth - 1, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9 sm:h-10 bg-transparent" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj = new Date(selectedYear, selectedMonth - 1, dayNum);
                const isSunday = dateObj.getDay() === 0;
                const isToday = selectedYear === 2026 && selectedMonth === 10 && dayNum === 14;
                const isSelected = selectedDay === dayNum;

                // Check events on this day
                const dayEvs = FESTIVAL_EVENTS_2026.filter(
                  (e: CalendarEvent) => e.year === selectedYear && e.month === selectedMonth && e.day === dayNum
                );
                const hasMajor = dayEvs.some((e: CalendarEvent) => isMajorFestival(e));
                const hasMinor = dayEvs.length > 0 && !hasMajor;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`h-9 sm:h-10 text-xs rounded-lg flex flex-col items-center justify-between p-0.5 relative transition-all border ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 font-black border-amber-600 shadow-sm ring-2 ring-amber-500 scale-[1.03] z-10'
                        : isToday
                        ? 'bg-amber-100/90 text-amber-950 font-black border-amber-400 ring-1 ring-amber-400'
                        : isSunday
                        ? 'bg-rose-50 text-red-700 font-bold border-rose-200 hover:bg-rose-100'
                        : dayEvs.length > 0
                        ? 'bg-amber-50/80 text-stone-900 font-bold border-amber-200 hover:bg-amber-100'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full px-0.5">
                      <span className={`text-[11px] sm:text-xs ${isSunday && !isSelected ? 'text-red-700 font-black' : ''}`}>
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[8px] bg-amber-600 text-white px-0.5 rounded font-black">
                          आज
                        </span>
                      )}
                    </div>

                    {/* Indicator dots for festivals */}
                    <div className="flex items-center gap-0.5 pb-0.5">
                      {hasMajor && (
                        <span
                          className="w-2 h-2 rounded-full bg-red-600 ring-1 ring-white"
                          title="पावन पर्व व उत्सव"
                        />
                      )}
                      {hasMinor && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-amber-500"
                          title="व्रत व उपवास"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card for the Selected Date */}
          <div className="bg-gradient-to-br from-[#fffbf2] to-[#fff6e0] border-2 border-amber-300 rounded-xl p-3 shadow-xs space-y-2">
            <div className="flex items-start justify-between gap-2 border-b border-amber-200/80 pb-2">
              <div>
                <span className="text-xs font-black text-red-950 block">
                  चयनित दिन: {selectedDay} {HINDI_MONTHS[selectedMonth - 1]?.name} {selectedYear} ({selectedPanchang.dayHindi})
                </span>
                <span className="text-[11px] text-stone-600 font-medium">
                  {selectedPanchang.hinduMonth} {selectedPanchang.paksha} {selectedPanchang.tithi} · {selectedPanchang.nakshatra}
                </span>
              </div>
              <span className="text-[10px] bg-red-800 text-white font-bold px-2 py-0.5 rounded shadow-2xs shrink-0">
                वैदिक तिथि
              </span>
            </div>

            {/* Festivals on this selected day */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-stone-700 block">
                त्यौहार व पावन व्रत:
              </span>
              {selectedEvents.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {selectedEvents.map((ev: CalendarEvent) => {
                    const isMajor = isMajorFestival(ev);
                    return (
                      <div
                        key={ev.id}
                        className={`p-1.5 rounded-lg border text-xs flex items-center justify-between gap-1 shadow-2xs ${
                          isMajor
                            ? 'bg-gradient-to-r from-red-100 to-rose-50 border-red-300 text-red-950 font-black'
                            : 'bg-amber-100/80 border-amber-300 text-amber-950 font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span>{isMajor ? '🚩' : '🔸'}</span>
                          <span className="truncate">{ev.titleHindi}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              isMajor ? 'bg-red-700 text-white' : 'bg-amber-600 text-white'
                            }`}
                          >
                            {isMajor ? 'पर्व/उत्सव' : 'व्रत/उपवास'}
                          </span>
                        </div>
                        {ev.muhuratTime && (
                          <span className="text-[10px] text-emerald-800 shrink-0 font-sans">
                            {ev.muhuratTime}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic bg-white/60 p-1.5 rounded-lg border border-amber-200/50">
                  इस दिन कोई विशेष पर्व दर्ज नहीं है। नियमित पूजा व संध्या वंदन करें।
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
          >
            रद्द करें
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-1.5 bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white text-xs font-black rounded-lg shadow-sm flex items-center gap-1 transition-all"
          >
            <span>इस दिनांक का कैलेण्डर देखें</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
