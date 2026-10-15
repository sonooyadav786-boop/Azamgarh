import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Sun, 
  Scroll, 
  Clock, 
  Sparkles, 
  BookOpen
} from 'lucide-react';
import { EventCategory } from '../types/calendar';

interface QuickActionBarProps {
  currentYear: number;
  viewMode: 'feed' | 'grid';
  onToggleViewMode: () => void;
  onOpenDatePicker: () => void;
  onJumpToday: () => void;
  onOpenPdf: () => void;
  onOpenFilter: () => void;
  onOpenAarti: () => void;
  onOpenChoghadiya: () => void;
  onOpenScriptures: () => void;
  onOpenMasterMenu?: () => void;
  onSwitchToCalendar: () => void;
  activeFilter?: EventCategory;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  currentYear,
  viewMode,
  onToggleViewMode,
  onJumpToday,
  onOpenAarti,
  onOpenChoghadiya,
  onOpenScriptures,
  onSwitchToCalendar,
}) => {
  return (
    <nav 
      aria-label="त्वरित कार्य मेन्यू"
      className="bg-[#f5e6cc] border-b border-amber-900/15 shadow-2xs select-none sticky top-14 z-30 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-1.5 sm:px-4 py-1 sm:py-1.5">
        {/* Responsive layout: 6-button bar without duplicate menu (Menu is exclusively at upper-left) */}
        <div className="flex items-center justify-between sm:grid sm:grid-cols-6 gap-1 sm:gap-2 text-center">
          {/* 1. वैदिक कैलेंडर (Wall Calendar Grid) */}
          <button
            onClick={onSwitchToCalendar}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg transition-all duration-150 group active:scale-95 ${
              viewMode === 'grid' 
                ? 'bg-amber-300/90 ring-1.5 ring-amber-500 shadow-xs' 
                : 'hover:bg-amber-200/70'
            }`}
            title="मासिक वैदिक कैलेंडर ग्रिड देखें"
          >
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs ${
              viewMode === 'grid'
                ? 'bg-red-800 text-white'
                : 'bg-red-100 text-red-900 border border-red-300'
            }`}>
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
            <span className={`text-[10px] sm:text-xs mt-0.5 leading-tight truncate w-full ${
              viewMode === 'grid' ? 'font-black text-red-950' : 'font-bold text-stone-800'
            }`}>
              कैलेंडर
            </span>
          </button>

          {/* 2. आज (Today) */}
          <button
            onClick={onJumpToday}
            className="flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg hover:bg-amber-200/70 transition-all duration-150 group active:scale-95"
            title="आज की तिथि व दैनिक पंचांग पर जाएं"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-amber-900 group-hover:scale-105 transition-transform shadow-2xs">
              <Sun className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-amber-700" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-stone-800 mt-0.5 leading-tight truncate w-full">
              आज
            </span>
          </button>

          {/* 3. त्यौहार (Festival Feed) */}
          <button
            onClick={onToggleViewMode}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg transition-all duration-150 group active:scale-95 ${
              viewMode === 'feed' 
                ? 'bg-amber-300/90 ring-1.5 ring-amber-500 shadow-xs' 
                : 'hover:bg-amber-200/70'
            }`}
            title="माह के सभी पर्व व व्रत सूची के रूप में देखें"
          >
            <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xs ${
              viewMode === 'feed'
                ? 'bg-orange-800 text-white'
                : 'bg-orange-100 text-orange-900 border border-orange-300'
            }`}>
              <Scroll className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
            <span className={`text-[10px] sm:text-xs mt-0.5 leading-tight truncate w-full ${
              viewMode === 'feed' ? 'font-black text-orange-950' : 'font-bold text-stone-800'
            }`}>
              त्यौहार
            </span>
          </button>

          {/* 4. मुहूर्त (Choghadiya) */}
          <button
            onClick={onOpenChoghadiya}
            className="flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg hover:bg-amber-200/70 transition-all duration-150 group active:scale-95"
            title="शुभ मुहूर्त एवं चौघड़िया समय सारणी"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform shadow-2xs">
              <Clock className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-emerald-700" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-stone-800 mt-0.5 leading-tight truncate w-full">
              मुहूर्त
            </span>
          </button>

          {/* 5. आरती (Aarti & Chalisa) */}
          <button
            onClick={onOpenAarti}
            className="flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg hover:bg-amber-200/70 transition-all duration-150 group active:scale-95"
            title="समस्त देवी-देवता आरती व चालीसा संग्रह"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-800 group-hover:scale-105 transition-transform shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-purple-700" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-stone-800 mt-0.5 leading-tight truncate w-full">
              आरती
            </span>
          </button>

          {/* 6. महाग्रंथ (Sanatan Panch Mahagranth) */}
          <button
            onClick={onOpenScriptures}
            className="flex-1 flex flex-col items-center justify-center py-1 px-0.5 sm:p-1.5 rounded-lg bg-amber-200/40 hover:bg-amber-200 transition-all duration-150 group active:scale-95 border border-amber-400/50"
            title="श्रीरामचरितमानस, शिव पुराण, विष्णु पुराण, महाभारत, कृष्ण चरितामृत"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-red-700 text-amber-200 border border-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
            <span className="text-[10px] sm:text-xs font-black text-red-950 mt-0.5 leading-tight truncate w-full">
              महाग्रंथ 📖
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
