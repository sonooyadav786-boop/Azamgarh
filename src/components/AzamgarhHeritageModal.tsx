import React from 'react';
import { X, MapPin, Sparkles, Navigation } from 'lucide-react';
import { AZAMGARH_TIRTHAS, AZAMGARH_COORDINATES } from '../data/azamgarhHeritage';

interface AzamgarhHeritageModalProps {
  onClose: () => void;
}

export const AzamgarhHeritageModal: React.FC<AzamgarhHeritageModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#fffdf5] w-full max-w-3xl rounded-2xl shadow-2xl border border-amber-900/20 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#991b1b] text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>पूर्वांचल की पावन तपोभूमि</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-amber-100 mt-1">
              आजमगढ़ के पवित्र तीर्थ, आश्रम एवं नदियां
            </h3>
            <p className="text-xs text-red-100 mt-0.5">
              महर्षि अत्रि-अनसूया के त्रिमूर्ति पुत्रों (दुर्वासा, दत्तात्रेय, चन्द्रमा) की दिव्य स्थली
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Coordinates Card */}
          <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3.5 text-xs text-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-bold text-red-950 block">भौगोलिक स्थिति (आजमगढ़ जिला):</span>
              <span>अक्षांश {AZAMGARH_COORDINATES.latitude} · रेखांश {AZAMGARH_COORDINATES.longitude}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-stone-900 block">पंचांग गणना आधार:</span>
              <span className="text-stone-600">काशी-पूर्वांचल सौर एवं चांद्र पंचांग</span>
            </div>
          </div>

          {/* Tirthas List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {AZAMGARH_TIRTHAS.map((tirtha) => (
              <div
                key={tirtha.id}
                className="bg-[#fedfa0]/80 border border-[#e6cb85] rounded-xl p-4 space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-heading text-base font-bold text-red-900">
                    {tirtha.nameHindi}
                  </h4>
                  <span className="text-[10px] bg-red-100 text-red-900 font-bold px-1.5 py-0.5 rounded">
                    तीर्थ
                  </span>
                </div>

                <p className="text-[11px] text-amber-950 font-medium flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-red-700" />
                  <span>{tirtha.locationHindi}</span>
                </p>

                <p className="text-xs text-stone-800 leading-relaxed">
                  {tirtha.significanceHindi}
                </p>

                <p className="text-[11px] text-stone-600 border-t border-amber-900/10 pt-1.5 leading-normal italic">
                  {tirtha.descriptionHindi}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <span>आजमगढ़ कैलेंडर - अपनी सांस्कृतिक विरासत से जुड़ें</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#991b1b] text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
          >
            समझ गया
          </button>
        </div>
      </div>
    </div>
  );
};
