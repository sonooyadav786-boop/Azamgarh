import React from 'react';
import { X, Check } from 'lucide-react';
import { EventCategory } from '../types/calendar';

interface FilterDrawerProps {
  activeFilter: EventCategory;
  onSelectFilter: (category: EventCategory) => void;
  showHolidaysOnly: boolean;
  onToggleHolidaysOnly: () => void;
  onClose: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  activeFilter,
  onSelectFilter,
  showHolidaysOnly,
  onToggleHolidaysOnly,
  onClose,
}) => {
  const filterOptions: { id: EventCategory; label: string; desc: string }[] = [
    { id: 'all', label: 'सभी (All)', desc: 'समस्त त्यौहार, व्रत, श्राद्ध एवं जयंती' },
    { id: 'tyohar', label: 'प्रमुख त्यौहार (Festivals)', desc: 'दीपावली, होली, दशहरा, रक्षाबंधन, छठ आदि' },
    { id: 'vrat', label: 'व्रत एवं उपवास (Vrat)', desc: 'करवा चौथ, शिवरात्रि, रोहिणी व्रत, प्रदोष' },
    { id: 'shradh', label: 'श्राद्ध एवं पितृ पक्ष (Shradh)', desc: 'षष्ठी, सप्तमी, अष्टमी, मातृ नवमी, सर्वपितृ' },
    { id: 'ekadashi', label: 'एकादशी व्रत (Ekadashi)', desc: 'इंदिरा, उत्पन्ना, मोक्षदा, देवउठनी एकादशी' },
    { id: 'amavasya', label: 'अमावस्या (Amavasya)', desc: 'सर्वपितृ, दर्श, कार्तिक अमावस्या' },
    { id: 'purnima', label: 'पूर्णिमा (Purnima)', desc: 'शरद पूर्णिमा, कार्तिक पूर्णिमा, देव दीपावली' },
    { id: 'jayanti', label: 'जयंती एवं दिवस (Jayanti)', desc: 'गांधी जयंती, अग्रसेन जयंती, गीता जयंती' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-md rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto">
        <div className="bg-[#991b1b] text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-amber-100">
              कैलेंडर फ़िल्टर (Filters)
            </h3>
            <p className="text-xs text-red-100">
              अपनी रुचि के अनुसार तिथियां व पर्व चुनें
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-2">
          {filterOptions.map((opt) => {
            const isSelected = activeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  onSelectFilter(opt.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-100 border-[#991b1b] text-red-950 font-bold shadow-xs'
                    : 'bg-[#fffcf4] border-amber-900/10 hover:bg-amber-50 text-stone-800'
                }`}
              >
                <div>
                  <span className="text-sm block">{opt.label}</span>
                  <span className="text-[11px] text-stone-500 font-normal">{opt.desc}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#991b1b] shrink-0" />}
              </button>
            );
          })}

          <div className="pt-2 border-t border-amber-900/15 mt-3">
            <button
              onClick={() => onToggleHolidaysOnly()}
              className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                showHolidaysOnly
                  ? 'bg-red-50 border-red-400 text-red-900'
                  : 'bg-white border-stone-200 text-stone-700'
              }`}
            >
              <span>केवल सरकारी अवकाश (Gazetted Holidays) दिखाएं</span>
              <span className={`w-4 h-4 rounded flex items-center justify-center text-xs ${showHolidaysOnly ? 'bg-red-700 text-white' : 'border border-stone-400'}`}>
                {showHolidaysOnly && '✓'}
              </span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#991b1b] text-white text-xs font-semibold rounded-lg hover:bg-red-800"
          >
            लागू करें
          </button>
        </div>
      </div>
    </div>
  );
};
