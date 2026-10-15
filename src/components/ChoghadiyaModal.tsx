import React from 'react';
import { X, Clock, Sun, Moon, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DayPanchang } from '../types/calendar';

interface ChoghadiyaModalProps {
  panchang: DayPanchang;
  onClose: () => void;
}

export const ChoghadiyaModal: React.FC<ChoghadiyaModalProps> = ({ panchang, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#991b1b] text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>आजमगढ़ मुहूर्त गणना</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100 mt-1">
              आज का चौघड़िया एवं शुभ मुहूर्त
            </h3>
            <p className="text-xs text-red-100 mt-0.5">
              {panchang.gregorianDateHindi} ({panchang.dayHindi}) · सूर्योदय: {panchang.sunriseAzamgarh} | सूर्यास्त: {panchang.sunsetAzamgarh}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Top Quick Guide Banner */}
          <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3 text-xs text-stone-800 space-y-1">
            <span className="font-bold text-red-950 block">चौघड़िया फल परिचय:</span>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-emerald-800 font-bold">🟢 अमृत, शुभ, लाभ = अति उत्तम (सर्वकार्य सिद्धि)</span>
              <span className="text-amber-800 font-bold">🟡 चर = यात्रा व गमन हेतु उत्तम</span>
              <span className="text-rose-800 font-bold">🔴 रोग, काल, उद्वेग = अशुभ (त्याज्य)</span>
            </div>
          </div>

          {/* Abhijit & Rahu Kaal Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">अभिजित मुहूर्त (सर्वश्रेष्ठ)</span>
                <span className="text-sm font-extrabold text-emerald-800">{panchang.abhijitMuhurat}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">नया कार्य शुरू करने हेतु सर्वोत्तम</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-rose-950 block">राहुकाल (वर्जित समय)</span>
                <span className="text-sm font-extrabold text-rose-800">{panchang.rahuKaal}</span>
                <span className="text-[10px] text-rose-700 block mt-0.5">इस समय में शुभ कार्य न करें</span>
              </div>
            </div>
          </div>

          {/* Day Choghadiya */}
          <div>
            <h4 className="font-heading text-sm font-bold text-red-900 flex items-center gap-1.5 mb-2.5">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>दिन का चौघड़िया (Day Choghadiya)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {panchang.choghadiyaDay.map((ch, idx) => {
                const isGood = ch.type === 'shubh' || ch.type === 'amrit' || ch.type === 'labh';
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      isGood
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : ch.type === 'char'
                        ? 'bg-amber-50 border-amber-300 text-stone-800'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <span className="font-bold text-sm block">
                      {ch.name} {isGood ? '✨' : ''}
                    </span>
                    <span className="text-[11px] block text-stone-600">{ch.time}</span>
                    <span className="text-[10px] font-semibold mt-1 inline-block">
                      {isGood ? 'शुभ फलदायी' : ch.type === 'char' ? 'सामान्य' : 'अशुभ काल'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Night Choghadiya */}
          <div>
            <h4 className="font-heading text-sm font-bold text-stone-800 flex items-center gap-1.5 mb-2.5">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span>रात्रि का चौघड़िया (Night Choghadiya)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {panchang.choghadiyaNight.map((ch, idx) => {
                const isGood = ch.type === 'shubh' || ch.type === 'amrit' || ch.type === 'labh';
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs ${
                      isGood
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : ch.type === 'char'
                        ? 'bg-amber-50 border-amber-300 text-stone-800'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}
                  >
                    <span className="font-bold text-sm block">
                      {ch.name} {isGood ? '✨' : ''}
                    </span>
                    <span className="text-[11px] block text-stone-600">{ch.time}</span>
                    <span className="text-[10px] font-semibold mt-1 inline-block">
                      {isGood ? 'शुभ फलदायी' : ch.type === 'char' ? 'सामान्य' : 'अशुभ काल'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>स्थान: आजमगढ़ अक्षांश रेखांश पर आधारित</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#991b1b] text-white font-semibold rounded-lg hover:bg-red-800"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
