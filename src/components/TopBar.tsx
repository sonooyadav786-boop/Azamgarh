import React, { useState } from 'react';
import { Menu, Search, X, MapPin, Printer, Sun } from 'lucide-react';

interface TopBarProps {
  currentYear: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenHeritage?: () => void;
  onOpenPdf: () => void;
  onOpenAarti?: () => void;
  onOpenKrishnaKatha?: () => void;
  onOpenRamayan?: () => void;
  onOpenShivPuran?: () => void;
  onOpenVishnuPuran?: () => void;
  onOpenMahabharat?: () => void;
  onOpenVoiceSettings?: () => void;
  onOpenGoogleCalendar?: () => void;
  onOpenMasterMenu: () => void;
  syncedCount?: number;
  isGoogleCalendarConnected?: boolean;
  onJumpToday: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentYear,
  searchQuery,
  onSearchChange,
  onOpenPdf,
  onOpenMasterMenu,
  syncedCount = 0,
  onJumpToday,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#991b1b] text-white shadow-md border-b border-amber-900/30">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
        {/* Left: Main Menu Button & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenMasterMenu}
            className="p-1.5 sm:p-2 -ml-1 text-amber-200 hover:text-white hover:bg-red-800/80 rounded-xl active:scale-95 transition-all flex items-center gap-1.5 border border-amber-400/30"
            aria-label="सम्पूर्ण फंक्शन मेन्यू खोलें"
            title="सम्पूर्ण फंक्शन मेन्यू"
          >
            <Menu className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-black text-amber-200 hidden xs:inline">
              मेन्यू
            </span>
          </button>

          <div className="flex flex-col min-w-0">
            <span className="font-heading text-base sm:text-lg font-black tracking-wide text-amber-100 flex items-center gap-1.5 leading-none truncate">
              <span>आजमगढ़ वैदिक कैलेंडर</span>
              <span className="text-xs font-bold bg-amber-400 text-red-950 px-1.5 py-0.2 rounded-sm shrink-0">
                {currentYear}
              </span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-200/90 font-medium flex items-center gap-1 leading-tight mt-0.5 truncate">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline text-amber-300 shrink-0" />
              <span className="truncate">वि० सं० २०८३ · आजमगढ़ (UP 50)</span>
            </span>
          </div>
        </div>

        {/* Right: Search, Today Jump, Menu Button, Print */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {showSearchInput ? (
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="पर्व, व्रत या तिथि खोजें..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-40 sm:w-60 bg-red-950 text-white placeholder-red-200 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 pr-7 border border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <button
                onClick={() => {
                  setShowSearchInput(false);
                  onSearchChange('');
                }}
                className="absolute right-1.5 text-red-200 hover:text-white"
                title="खोज रद्द करें"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-1.5 sm:p-2 text-amber-100 hover:text-white hover:bg-red-800/60 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
              title="पर्व व व्रत खोजें"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Jump to Today Button */}
          <button
            onClick={onJumpToday}
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-red-950 rounded-lg font-black text-xs shadow-2xs border border-amber-300 active:scale-95 transition-all"
            title="आज की तिथि व पंचांग पर तुरंत जाएं"
          >
            <Sun className="w-3.5 h-3.5 text-red-900" />
            <span>आज</span>
          </button>

          {/* PDF Download */}
          <button
            onClick={onOpenPdf}
            className="p-1.5 sm:p-2 text-amber-200 hover:text-white hover:bg-red-800/60 rounded-lg transition-colors"
            title="कैलेंडर पीडीएफ / प्रिंट"
          >
            <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
