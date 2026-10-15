import React, { useState } from 'react';
import { X, Sunrise, Sunset, Moon, Share2, Compass, ShieldAlert, CheckCircle2, Clock, Sparkles, Calendar, CalendarCheck } from 'lucide-react';
import { CalendarEvent, DayPanchang } from '../types/calendar';
import { DevotionalArtIcon } from './DevotionalArtIcon';
import { DailyHoroscope } from './DailyHoroscope';
import { getFestivalDetails } from '../data/festivalKnowledge';

interface DetailModalProps {
  event?: CalendarEvent | null;
  panchang: DayPanchang;
  onClose: () => void;
  onOpenRamayan?: () => void;
  isCalendarSynced?: boolean;
  onSyncGoogleCalendar?: (event: CalendarEvent) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  event,
  panchang,
  onClose,
  onOpenRamayan,
  isCalendarSynced = false,
  onSyncGoogleCalendar,
}) => {
  const [activeTab, setActiveTab] = useState<'panchang' | 'horoscope' | 'choghadiya' | 'vidhi'>(
    event ? 'vidhi' : 'panchang'
  );
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShare = () => {
    const text = `🪔 *आजमगढ़ पंचांग (${panchang.gregorianDateHindi}, ${panchang.dayHindi})*
🚩 *तिथि:* ${panchang.hinduMonth} मास, ${panchang.paksha} पक्ष, ${panchang.tithi}
✨ *त्यौहार:* ${event ? event.titleHindi : 'दैनिक पंचांग'}
🌅 *सूर्योदय:* ${panchang.sunriseAzamgarh} | 🌇 *सूर्यास्त:* ${panchang.sunsetAzamgarh}
⭐ *नक्षत्र:* ${panchang.nakshatra} | *योग:* ${panchang.yoga}
⚡ *अभिजित मुहूर्त:* ${panchang.abhijitMuhurat}
⚠️ *राहुकाल (वर्जित):* ${panchang.rahuKaal}
📍 *स्थान:* आजमगढ़, उत्तर प्रदेश`;

    if (navigator.share) {
      navigator.share({
        title: 'आजमगढ़ पंचांग',
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#fffdfa] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#991b1b] text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="pr-4">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-400 text-stone-900 font-bold px-2 py-0.5 rounded-sm">
                आजमगढ़ पंचांग
              </span>
              <span className="text-xs text-amber-200">
                {panchang.gregorianDateHindi} · {panchang.dayHindi}
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100 mt-1">
              {event ? event.titleHindi : `${panchang.tithi} पंचांग`}
            </h3>
            <p className="text-xs sm:text-sm text-red-100 mt-0.5">
              {panchang.hinduMonth} मास, {panchang.paksha} पक्ष, {panchang.tithi} ({panchang.tithiEndTime})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-amber-900/15 bg-amber-50/70 px-4 pt-2 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('panchang')}
            className={`pb-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'panchang'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            दैनिक पंचांग व काल
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`pb-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'horoscope'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>दैनिक राशिफल</span>
            <span className="text-[10px] bg-amber-200 text-red-950 font-bold px-1.5 py-0.2 rounded-full">
              नया
            </span>
          </button>
          <button
            onClick={() => setActiveTab('choghadiya')}
            className={`pb-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'choghadiya'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            दिन-रात चौघड़िया
          </button>
          <button
            onClick={() => setActiveTab('vidhi')}
            className={`pb-2.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'vidhi'
                ? 'border-[#991b1b] text-[#991b1b]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🙏 पूजा विधि, कथा व इतिहास</span>
            <span className="text-[10px] bg-red-100 text-red-900 font-bold px-1.5 py-0.2 rounded">
              विशेष
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'panchang' && (
            <>
              {/* Sun & Moon Times */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-[#fff9eb] border border-amber-200 p-2.5 rounded-lg flex items-center gap-2.5">
                  <Sunrise className="w-6 h-6 text-amber-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 block">सूर्योदय (आजमगढ़)</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-800">{panchang.sunriseAzamgarh}</span>
                  </div>
                </div>

                <div className="bg-[#fff9eb] border border-amber-200 p-2.5 rounded-lg flex items-center gap-2.5">
                  <Sunset className="w-6 h-6 text-orange-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 block">सूर्यास्त (आजमगढ़)</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-800">{panchang.sunsetAzamgarh}</span>
                  </div>
                </div>

                <div className="bg-[#f0f9ff] border border-sky-200 p-2.5 rounded-lg flex items-center gap-2.5">
                  <Moon className="w-6 h-6 text-sky-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 block">चन्द्रोदय</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-800">{panchang.moonrise}</span>
                  </div>
                </div>

                <div className="bg-[#f0f9ff] border border-sky-200 p-2.5 rounded-lg flex items-center gap-2.5">
                  <Moon className="w-6 h-6 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] text-stone-500 block">चन्द्रास्त</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-800">{panchang.moonset}</span>
                  </div>
                </div>
              </div>

              {/* Tithi, Nakshatra, Yoga, Karana */}
              <div className="bg-[#faf6ee] rounded-xl p-3.5 border border-amber-900/10 space-y-2.5">
                <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>पंचांग तत्व (Panchang Elements)</span>
                </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">तिथि:</span>
                    <span className="font-semibold text-stone-900">{panchang.tithi} ({panchang.tithiEndTime})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">नक्षत्र:</span>
                    <span className="font-semibold text-stone-900">{panchang.nakshatra} ({panchang.nakshatraEndTime})</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">योग:</span>
                    <span className="font-semibold text-stone-900">{panchang.yoga}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">करण:</span>
                    <span className="font-semibold text-stone-900">{panchang.karana}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">सूर्य राशि:</span>
                    <span className="font-semibold text-stone-900">{panchang.sunSign}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">चन्द्र राशि:</span>
                    <span className="font-semibold text-stone-900">{panchang.moonSign}</span>
                  </div>
                </div>
              </div>

              {/* Shubh & Ashubh Muhurat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Shubh Muhurat */}
                <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>शुभ मुहूर्त (Auspicious)</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-600">अभिजित मुहूर्त:</span>
                      <span className="font-bold text-emerald-800">{panchang.abhijitMuhurat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">अमृत काल:</span>
                      <span className="font-semibold">{panchang.amritKaal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">ब्रह्म मुहूर्त:</span>
                      <span className="font-semibold">{panchang.brahmaMuhurat}</span>
                    </div>
                  </div>
                </div>

                {/* Inauspicious Muhurat */}
                <div className="bg-rose-50/70 border border-rose-200/90 rounded-xl p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <span>अशुभ समय (वर्जित काल)</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-600 font-medium">राहुकाल:</span>
                      <span className="font-bold text-rose-800">{panchang.rahuKaal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">यमगण्ड:</span>
                      <span className="font-semibold">{panchang.yamaganda}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">दुर्मुहूर्त:</span>
                      <span className="font-semibold">{panchang.durmuhurat}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'horoscope' && (
            <DailyHoroscope panchang={panchang} />
          )}

          {activeTab === 'choghadiya' && (
            <div className="space-y-4">
              {/* Day Choghadiya */}
              <div>
                <h4 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>दिन का चौघड़िया (सूर्योदय से सूर्यास्त)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {panchang.choghadiyaDay.map((ch, idx) => {
                    const isGood = ch.type === 'shubh' || ch.type === 'amrit' || ch.type === 'labh';
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-xs ${
                          isGood
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : ch.type === 'char'
                            ? 'bg-amber-50 border-amber-200 text-stone-800'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <span className="font-bold block">{ch.name} ({isGood ? 'शुभ' : ch.type === 'char' ? 'सामान्य' : 'अशुभ'})</span>
                        <span className="text-[11px] opacity-80">{ch.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Night Choghadiya */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-stone-700" />
                  <span>रात्रि का चौघड़िया (सूर्यास्त से अगले सूर्योदय)</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {panchang.choghadiyaNight.map((ch, idx) => {
                    const isGood = ch.type === 'shubh' || ch.type === 'amrit' || ch.type === 'labh';
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border text-xs ${
                          isGood
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : ch.type === 'char'
                            ? 'bg-amber-50 border-amber-200 text-stone-800'
                            : 'bg-rose-50 border-rose-200 text-rose-900'
                        }`}
                      >
                        <span className="font-bold block">{ch.name} ({isGood ? 'शुभ' : ch.type === 'char' ? 'सामान्य' : 'अशुभ'})</span>
                        <span className="text-[11px] opacity-80">{ch.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vidhi' && (
            <div className="space-y-4">
              {(() => {
                const details = getFestivalDetails(event);
                return (
                  <>
                    {/* Header Banner for Festival */}
                    <div className="flex items-center gap-4 p-3.5 bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/90 rounded-2xl border border-amber-300 shadow-xs">
                      <DevotionalArtIcon type={event ? event.imageType : 'generic_vedic'} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-heading text-lg sm:text-xl font-black text-red-950">
                            {details.title}
                          </h4>
                          <span className="text-[10px] bg-red-700 text-white font-bold px-2 py-0.5 rounded shadow-2xs">
                            वैदिक पंचांग
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 font-medium mt-0.5">
                          {event ? event.fullDateHindi : `${panchang.gregorianDateHindi}, ${panchang.dayHindi}`} · {panchang.hinduMonth} {panchang.paksha} {panchang.tithi}
                        </p>
                        <p className="text-xs font-bold text-emerald-800 mt-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{details.muhurat}</span>
                        </p>
                      </div>
                    </div>

                    {/* 1. यह त्योहार क्यों मनाया जाता है? (Why Celebrated) */}
                    <div className="bg-[#fffcf5] border-2 border-amber-300/80 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-red-900 border-b border-amber-200 pb-2">
                        <span className="text-lg">🪔</span>
                        <h5 className="font-heading font-black text-sm sm:text-base text-red-950 tracking-tight">
                          यह त्योहार क्यों मनाया जाता है? (कथा व आध्यात्मिक महत्व)
                        </h5>
                      </div>
                      <p className="leading-relaxed text-stone-800 text-xs sm:text-sm font-sans whitespace-pre-line text-justify">
                        {details.whyCelebrated}
                      </p>
                    </div>

                    {/* 2. यह त्योहार कब से मनाया जाता है? (Since When Celebrated) */}
                    <div className="bg-[#fff9eb] border-2 border-orange-300/80 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-orange-950 border-b border-orange-200 pb-2">
                        <span className="text-lg">⏳</span>
                        <h5 className="font-heading font-black text-sm sm:text-base text-orange-950 tracking-tight">
                          यह त्योहार कब से मनाया जाता है? (इतिहास व पौराणिक काल)
                        </h5>
                      </div>
                      <p className="leading-relaxed text-stone-800 text-xs sm:text-sm font-sans whitespace-pre-line text-justify">
                        {details.historySince}
                      </p>
                    </div>

                    {/* 3. सम्पूर्ण पूजा विधि व नियम (Step-by-Step Puja Vidhi) */}
                    <div className="bg-[#fcfaf5] border-2 border-emerald-300/80 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-950 border-b border-emerald-200 pb-2">
                        <span className="text-lg">🙏</span>
                        <h5 className="font-heading font-black text-sm sm:text-base text-emerald-950 tracking-tight">
                          सम्पूर्ण पूजा विधि, सामग्री व नियम
                        </h5>
                      </div>
                      <p className="leading-relaxed text-stone-800 text-xs sm:text-sm font-sans whitespace-pre-line text-justify">
                        {details.pujaVidhi}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            {copiedToast ? (
              <span className="text-emerald-700 font-semibold">पंचांग विवरण कॉपी हो गया!</span>
            ) : (
              <span>स्थान: आजमगढ़ (UP 50)</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {event && onSyncGoogleCalendar && (
              <button
                onClick={() => onSyncGoogleCalendar(event)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs ${
                  isCalendarSynced
                    ? 'bg-blue-700 text-white hover:bg-blue-800'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300'
                }`}
                title="Google Calendar में जोड़ें / प्रबंधित करें"
              >
                {isCalendarSynced ? (
                  <>
                    <CalendarCheck className="w-3.5 h-3.5 text-white" />
                    <span>Cal में सिंक है</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Calendar सिंक</span>
                  </>
                )}
              </button>
            )}

            {onOpenRamayan && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRamayan();
                }}
                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-red-900 border border-amber-300 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                title="श्रीरामचरितमानस ग्रंथ खोलें"
              >
                <span>📖 रामायण</span>
              </button>
            )}
            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>शेयर करें</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
