import React from 'react';
import { X, Printer, Download, MapPin } from 'lucide-react';
import { CalendarEvent } from '../types/calendar';
import { HINDI_MONTHS, getAzamgarhPanchang } from '../data/calendarData';

interface PdfPrintViewProps {
  year: number;
  month: number;
  events: CalendarEvent[];
  onClose: () => void;
}

export const PdfPrintView: React.FC<PdfPrintViewProps> = ({
  year,
  month,
  events,
  onClose,
}) => {
  const monthData = HINDI_MONTHS.find((m) => m.id === month) || HINDI_MONTHS[9];

  const handlePrint = () => {
    window.print();
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const dayNames = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-xs">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-300 overflow-hidden my-auto max-h-[96vh] flex flex-col">
        {/* Screen Controls Header (hidden in print) */}
        <div className="no-print bg-[#991b1b] text-white p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-300" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-amber-100">
              आजमगढ़ वॉल कैलेंडर {year} - प्रिंट एवं पीडीएफ
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट / PDF सेव करें</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Wall Calendar Sheet Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-white text-stone-900 font-sans print:p-0 print:m-0">
          {/* Top Decorative Border */}
          <div className="border-4 border-[#991b1b] p-4 rounded-xl bg-[#fffef8]">
            {/* Header */}
            <div className="text-center pb-3 border-b-2 border-red-900">
              <span className="text-xs font-bold text-amber-800 tracking-widest uppercase">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#991b1b]">
                आजमगढ़ पंचांग एवं हिन्दू कैलेंडर
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-stone-700 mt-1">
                <span className="text-red-950 font-bold">{monthData.name} {year}</span>
                <span>·</span>
                <span>विक्रम संवत {year === 2026 ? '2083' : '2084'}</span>
                <span>·</span>
                <span>मास: {monthData.hinduMasa}</span>
                <span>·</span>
                <span className="text-red-800">स्थान: आजमगढ़ (उ०प्र०)</span>
              </div>
            </div>

            {/* Grid Table */}
            <div className="mt-4 border border-stone-400 rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-[#991b1b] text-white text-center py-1.5 text-xs font-bold">
                {dayNames.map((d, i) => (
                  <div key={d} className={i === 0 ? 'text-amber-300' : ''}>
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 border-collapse">
                {Array.from({ length: Math.ceil((firstDay + daysInMonth) / 7) * 7 }).map((_, i) => {
                  const dayNum = i - firstDay + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                  const dayEvents = isCurrentMonth ? events.filter((e) => e.day === dayNum) : [];
                  const isSunday = i % 7 === 0;

                  return (
                    <div
                      key={i}
                      className={`min-h-[55px] sm:min-h-[70px] p-1 border border-stone-200 flex flex-col justify-between ${
                        isCurrentMonth ? (isSunday ? 'bg-red-50/40' : 'bg-white') : 'bg-stone-50'
                      }`}
                    >
                      {isCurrentMonth ? (
                        <>
                          <div className="flex justify-between items-start leading-none">
                            <span
                              className={`font-heading text-sm sm:text-base font-bold ${
                                isSunday ? 'text-red-700' : 'text-stone-900'
                              }`}
                            >
                              {dayNum}
                            </span>
                            <span className="text-[9px] text-stone-500">
                              {getAzamgarhPanchang(year, month, dayNum).tithi}
                            </span>
                          </div>
                          <div className="space-y-0.5 overflow-hidden">
                            {dayEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className="text-[8px] sm:text-[9px] font-bold text-red-900 truncate leading-tight"
                              >
                                {ev.titleHindi}
                              </div>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Festivals of the Month */}
            <div className="mt-4 pt-3 border-t border-red-900/30">
              <h4 className="font-heading text-sm font-bold text-red-900 mb-1.5">
                {monthData.name} {year} के प्रमुख व्रत एवं त्यौहार:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-1.5 text-stone-800">
                    <span className="font-bold text-red-800 shrink-0">
                      {ev.day} {monthData.name}:
                    </span>
                    <span className="font-medium">{ev.titleHindi}</span>
                    <span className="text-stone-500 text-[11px]">({ev.paksha} {ev.tithi})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panchang Astrological Footnote */}
            <div className="mt-4 pt-2 border-t border-stone-300 text-[11px] text-stone-600 flex flex-wrap justify-between">
              <span>आजमगढ़ मानक समय: सूर्योदय ~06:05 AM · सूर्यास्त ~05:40 PM</span>
              <span>दुर्वासा धाम, दत्तात्रेय आश्रम व तमसा संगम की पावन स्मृति सहित</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
