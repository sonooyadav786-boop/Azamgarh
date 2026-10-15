import React, { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Compass, 
  Flame, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getAzamgarhPanchang, ALL_FESTIVAL_EVENTS } from '../data/calendarData';
import { DayPanchang, CalendarEvent } from '../types/calendar';

interface AajKaPanchangCardProps {
  onOpenFullPanchang?: (panchang: DayPanchang, event?: CalendarEvent | null) => void;
  onOpenChoghadiya?: (panchang: DayPanchang) => void;
}

export const AajKaPanchangCard: React.FC<AajKaPanchangCardProps> = ({
  onOpenFullPanchang,
  onOpenChoghadiya
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Derive device date
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Compute panchang for device date
  const panchang: DayPanchang = getAzamgarhPanchang(year, month, day);

  // Check if there is any festival/vrat today
  const todayFestival: CalendarEvent | undefined = ALL_FESTIVAL_EVENTS.find(
    (ev) => ev.year === year && ev.month === month && ev.day === day
  );

  // Formatted date string in Hindi
  const dayNamesHindi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const monthNamesHindi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'
  ];
  const dayNameHindi = dayNamesHindi[now.getDay()];
  const monthNameHindi = monthNamesHindi[now.getMonth()];
  const formattedDeviceDate = `${dayNameHindi}, ${day} ${monthNameHindi} ${year}`;

  return (
    <div className="mb-4 bg-gradient-to-br from-[#fffdf7] via-[#fffbf2] to-[#fcf5e5] border-2 border-amber-300/80 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* 1. Header Strip */}
      <div className="bg-gradient-to-r from-red-900 via-amber-900 to-red-950 px-3.5 py-2 sm:px-5 sm:py-2.5 text-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
            <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif font-black text-sm sm:text-base text-amber-100 tracking-wide">
                आज का पंचांग
              </h3>
              <span className="text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40 px-1.5 py-0.2 rounded-full uppercase">
                लाइव (Device Date)
              </span>
            </div>
            <p className="text-[11px] text-amber-200/90 font-sans">
              {formattedDeviceDate}
            </p>
          </div>
        </div>

        {/* Hindu Month & Samvat Badge */}
        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-amber-200 block font-serif">
            {panchang.hinduMonth} {panchang.paksha} पक्ष
          </span>
          <span className="text-[10px] text-amber-300/80 block">
            विक्रम संवत् {panchang.vikramSamvat}
          </span>
        </div>
      </div>

      {/* 2. Today's Festival Banner if any */}
      {todayFestival && (
        <div className="bg-red-50 border-b border-red-200 px-3.5 py-1.5 sm:px-5 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-red-950">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="font-bold text-red-900 font-serif">आज का पावन पर्व:</span>
            <span className="font-black text-red-900 truncate">{todayFestival.titleHindi}</span>
          </div>
          <button
            onClick={() => onOpenFullPanchang?.(panchang, todayFestival)}
            className="text-[11px] font-bold text-red-800 hover:text-red-950 underline shrink-0"
          >
            विवरण देखें →
          </button>
        </div>
      )}

      {/* 3. Core 3 Pillars: Tithi, Nakshatra, Yoga (The Core Request) */}
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* A. Tithi Card */}
          <div className="bg-white/90 border border-amber-200 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-amber-900/80 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-amber-700" />
                <span>तिथि (Tithi)</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 font-bold text-amber-950">
                {panchang.paksha} पक्ष
              </span>
            </div>
            <div className="font-serif font-black text-lg sm:text-xl text-red-950 leading-tight">
              {panchang.tithi}
            </div>
            <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>समाप्त: <strong className="text-stone-800">{panchang.tithiEndTime}</strong></span>
            </div>
          </div>

          {/* B. Nakshatra Card */}
          <div className="bg-white/90 border border-amber-200 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-amber-900/80 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>नक्षत्र (Nakshatra)</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 font-bold text-amber-950">
                वैदिक तारा
              </span>
            </div>
            <div className="font-serif font-black text-lg sm:text-xl text-red-950 leading-tight">
              {panchang.nakshatra}
            </div>
            <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              <span>समाप्त: <strong className="text-stone-800">{panchang.nakshatraEndTime}</strong></span>
            </div>
          </div>

          {/* C. Yoga Card */}
          <div className="bg-white/90 border border-amber-200 rounded-xl p-2.5 sm:p-3 shadow-2xs hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between text-xs text-amber-900/80 mb-1">
              <span className="font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-700" />
                <span>योग (Yoga)</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 font-bold text-amber-950">
                शुभ योग
              </span>
            </div>
            <div className="font-serif font-black text-lg sm:text-xl text-red-950 leading-tight">
              {panchang.yoga}
            </div>
            <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-1">
              <Compass className="w-3 h-3 text-stone-400" />
              <span>करण: <strong className="text-stone-800">{panchang.karana}</strong></span>
            </div>
          </div>
        </div>

        {/* 4. Compact Quick Timings Strip */}
        <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
          {/* Surya Times */}
          <div className="bg-amber-100/50 border border-amber-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-1 text-[11px]">
              <Sun className="w-3 h-3 text-amber-600" /> सूर्योदय
            </span>
            <span className="font-bold text-stone-900">{panchang.sunriseAzamgarh}</span>
          </div>

          <div className="bg-amber-100/50 border border-amber-200/80 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-stone-600 flex items-center gap-1 text-[11px]">
              <Moon className="w-3 h-3 text-amber-700" /> सूर्यास्त
            </span>
            <span className="font-bold text-stone-900">{panchang.sunsetAzamgarh}</span>
          </div>

          {/* Abhijit Muhurat */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-emerald-900 flex items-center gap-1 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-600" /> अभिजीत
            </span>
            <span className="font-bold text-emerald-950 text-[11px] truncate max-w-[100px]">
              {panchang.abhijitMuhurat}
            </span>
          </div>

          {/* Rahu Kaal */}
          <div className="bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
            <span className="text-red-900 flex items-center gap-1 text-[11px] font-semibold">
              <AlertTriangle className="w-3 h-3 text-red-600" /> राहुकाल
            </span>
            <span className="font-bold text-red-950 text-[11px] truncate max-w-[100px]">
              {panchang.rahuKaal}
            </span>
          </div>
        </div>

        {/* 5. Collapsible Detailed Vedic Section (Optional) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white/70 p-3 rounded-xl border border-amber-100">
            <div>
              <span className="text-[10px] text-stone-500 block">ऋतु (Season)</span>
              <span className="font-bold text-stone-800">{panchang.ritu}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">अयन (Ayana)</span>
              <span className="font-bold text-stone-800">{panchang.ayana}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">सूर्य राशि</span>
              <span className="font-bold text-stone-800">{panchang.sunSign}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">चन्द्र राशि</span>
              <span className="font-bold text-stone-800">{panchang.moonSign}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">अमृत काल</span>
              <span className="font-bold text-emerald-900">{panchang.amritKaal}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">ब्रह्म मुहूर्त</span>
              <span className="font-bold text-indigo-900">{panchang.brahmaMuhurat}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">यमगण्ड</span>
              <span className="font-bold text-stone-800">{panchang.yamaganda}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 block">गुलिक काल</span>
              <span className="font-bold text-stone-800">{panchang.gulikaKaal}</span>
            </div>
          </div>
        )}

        {/* 6. Footer Actions */}
        <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => setIsExpanded((v) => !v)}
            className="text-amber-900 hover:text-amber-950 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>{isExpanded ? 'संक्षिप्त विवरण' : 'अतिरिक्त मुहूर्त व काल'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-1.5">
            {onOpenChoghadiya && (
              <button
                onClick={() => onOpenChoghadiya(panchang)}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold transition-colors text-[11px]"
              >
                चौघड़िया
              </button>
            )}
            {onOpenFullPanchang && (
              <button
                onClick={() => onOpenFullPanchang(panchang, todayFestival)}
                className="px-3 py-1 rounded-lg bg-red-800 hover:bg-red-900 text-white font-bold transition-colors flex items-center gap-1 text-[11px] shadow-xs"
              >
                <span>सम्पूर्ण पंचांग</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
