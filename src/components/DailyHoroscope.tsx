import React, { useState, useMemo } from 'react';
import { 
  Moon, 
  Sun, 
  Sparkles, 
  Star, 
  Compass, 
  Check, 
  Share2, 
  Briefcase, 
  Heart, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';
import { DayPanchang } from '../types/calendar';

interface DailyHoroscopeProps {
  panchang: DayPanchang;
}

export interface RashiInfo {
  id: string;
  nameHindi: string;
  nameEng: string;
  symbolHindi: string;
  rulingPlanetHindi: string;
  elementHindi: string; // अग्नि, पृथ्वी, वायु, जल
}

export const ALL_RASHIS: RashiInfo[] = [
  { id: 'aries', nameHindi: 'मेष', nameEng: 'Aries', symbolHindi: 'मेढ़ा ♈', rulingPlanetHindi: 'मंगल', elementHindi: 'अग्नि' },
  { id: 'taurus', nameHindi: 'वृषभ', nameEng: 'Taurus', symbolHindi: 'बैल ♉', rulingPlanetHindi: 'शुक्र', elementHindi: 'पृथ्वी' },
  { id: 'gemini', nameHindi: 'मिथुन', nameEng: 'Gemini', symbolHindi: 'युगल ♊', rulingPlanetHindi: 'बुध', elementHindi: 'वायु' },
  { id: 'cancer', nameHindi: 'कर्क', nameEng: 'Cancer', symbolHindi: 'कर्कट ♋', rulingPlanetHindi: 'चन्द्रमा', elementHindi: 'जल' },
  { id: 'leo', nameHindi: 'सिंह', nameEng: 'Leo', symbolHindi: 'सिंह ♌', rulingPlanetHindi: 'सूर्य', elementHindi: 'अग्नि' },
  { id: 'virgo', nameHindi: 'कन्या', nameEng: 'Virgo', symbolHindi: 'कन्या ♍', rulingPlanetHindi: 'बुध', elementHindi: 'पृथ्वी' },
  { id: 'libra', nameHindi: 'तुला', nameEng: 'Libra', symbolHindi: 'तराजू ♎', rulingPlanetHindi: 'शुक्र', elementHindi: 'वायु' },
  { id: 'scorpio', nameHindi: 'वृश्चिक', nameEng: 'Scorpio', symbolHindi: 'बिच्छू ♏', rulingPlanetHindi: 'मंगल', elementHindi: 'जल' },
  { id: 'sagittarius', nameHindi: 'धनु', nameEng: 'Sagittarius', symbolHindi: 'धनुर्धर ♐', rulingPlanetHindi: 'बृहस्पति', elementHindi: 'अग्नि' },
  { id: 'capricorn', nameHindi: 'मकर', nameEng: 'Capricorn', symbolHindi: 'मकर ♑', rulingPlanetHindi: 'शनि', elementHindi: 'पृथ्वी' },
  { id: 'aquarius', nameHindi: 'कुम्भ', nameEng: 'Aquarius', symbolHindi: 'घड़ा ♒', rulingPlanetHindi: 'शनि', elementHindi: 'वायु' },
  { id: 'pisces', nameHindi: 'मीन', nameEng: 'Pisces', symbolHindi: 'मत्स्य ♓', rulingPlanetHindi: 'बृहस्पति', elementHindi: 'जल' },
];

const LUCKY_COLORS = ['केसरिया', 'लाल', 'पीला', 'सफेद', 'हरा', 'गुलाबी', 'आसमानी', 'सुनहरा', 'नारंगी'];
const DIRECTIONS = ['पूर्व', 'उत्तर', 'ईशान', 'उत्तर-पूर्व', 'उत्तर-पश्चिम', 'दक्षिण-पूर्व'];

const CAREER_PREDICTIONS = [
  'कार्यक्षेत्र में आज नई जिम्मेदारियां प्राप्त हो सकती हैं। वरिष्ठ अधिकारियों का सहयोग मिलेगा।',
  'व्यापार में लाभकारी सौदे होने के प्रबल योग हैं। आर्थिक लेन-देन में सूझबूझ रखें।',
  'रुके हुए कार्यों में प्रगति होगी। सहकर्मियों के साथ तालमेल बनाए रखें।',
  'नौकरी में पदोन्नति या नवीन अवसर के संकेत हैं। आत्मविश्वास से निर्णय लें।',
  'रचनात्मक कार्यों में सफलता प्राप्त होगी। अपनी योजनाओं को गुप्त रखें।',
  'निवेश हेतु अनुकूल समय है, किन्तु जल्दबाजी से बचें। अनुभवी व्यक्तियों की सलाह लें।'
];

const HEALTH_PREDICTIONS = [
  'स्वास्थ्य सामान्यतः उत्तम रहेगा। नियमित दिनचर्या और योग पर ध्यान दें।',
  'मानसिक शांति बनी रहेगी। खान-पान में संतुलन बरतें और पर्याप्त जल पिएं।',
  'मौसम के बदलाव से सतर्क रहें। सुपाच्य भोजन ग्रहण करें।',
  'ऊर्जावान महसूस करेंगे। ध्यान एवं प्राणायाम से ताजगी बढ़ेगी।'
];

const FAMILY_PREDICTIONS = [
  'परिवार में मांगलिक चर्चा अथवा हर्षोल्लास का वातावरण रहेगा।',
  'जीवनसाथी का पूर्ण सहयोग प्राप्त होगा। संबंध प्रगाढ़ होंगे।',
  'मित्रों एवं स्वजनों से शुभ समाचार मिल सकता है।',
  'पारिवारिक मतभेद दूर होंगे और आपसी सौहार्द में वृद्धि होगी।'
];

const VEDIC_REMEDIES = [
  'प्रातः सूर्य देव को रोली व अक्षत मिश्रित जल से अर्घ्य दें।',
  'ॐ नमः शिवाय मंत्र का 108 बार मानसिक जप करें।',
  'गाय को ताजी रोटी और गुड़ खिलाएं।',
  'श्री हनुमान चालीसा का पाठ कर दिन का आरंभ करें।',
  'किसी जरूरतमंद को फल अथवा अन्न का दान करें।',
  'तुलसी जी में जल अर्पित करें और दीपक प्रज्वलित करें।'
];

export const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ panchang }) => {
  const [selectedRashiId, setSelectedRashiId] = useState<string>('aries');
  const [copiedToast, setCopiedToast] = useState(false);

  // Deterministic seed based on date and lunar phase
  const dateSeed = useMemo(() => {
    let hash = 0;
    const str = `${panchang.dateStr}-${panchang.paksha}-${panchang.tithi}-${panchang.nakshatra}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [panchang]);

  // Calculate horoscope for selected Rashi
  const horoscopeData = useMemo(() => {
    const rashiIndex = ALL_RASHIS.findIndex((r) => r.id === selectedRashiId);
    const rashi = ALL_RASHIS[rashiIndex] || ALL_RASHIS[0];
    const comboSeed = dateSeed + (rashiIndex * 37);

    // Lucky metrics
    const luckyNumber = ((comboSeed % 9) + 1);
    const luckyColor = LUCKY_COLORS[comboSeed % LUCKY_COLORS.length];
    const luckyDirection = DIRECTIONS[(comboSeed + 3) % DIRECTIONS.length];
    const luckScore = 65 + (comboSeed % 31); // 65% to 95%

    // Text predictions
    const career = CAREER_PREDICTIONS[(comboSeed + 1) % CAREER_PREDICTIONS.length];
    const health = HEALTH_PREDICTIONS[(comboSeed + 2) % HEALTH_PREDICTIONS.length];
    const family = FAMILY_PREDICTIONS[(comboSeed + 3) % FAMILY_PREDICTIONS.length];
    const remedy = VEDIC_REMEDIES[(comboSeed + 4) % VEDIC_REMEDIES.length];

    // Lunar Phase effect
    const isShukla = panchang.paksha === 'शुक्ल';
    const isPurnima = panchang.tithi.includes('पूर्णिमा');
    const isAmavasya = panchang.tithi.includes('अमावस्या');

    let lunarImpactText = '';
    if (isPurnima) {
      lunarImpactText = `पूर्णिमा की अमृतमयी चंद्र किरणों से ${rashi.nameHindi} राशि के जातकों को मानसिक शांति, आध्यात्मिक तेज एवं प्रतिष्ठा में वृद्धि होगी।`;
    } else if (isAmavasya) {
      lunarImpactText = `अमावस्या तिथि के प्रभाव से एकाग्रता रखें, पितृ स्मरण करें तथा महत्वपूर्ण नए अनुबंध सोच-समझकर करें।`;
    } else if (isShukla) {
      lunarImpactText = `शुक्ल पक्ष के बढ़ते चंद्र बल से आपके सोचे हुए कार्यों में गति आएगी और रचनात्मक ऊर्जा में वृद्धि होगी।`;
    } else {
      lunarImpactText = `कृष्ण पक्ष का प्रभाव है, अतः धैर्य और संयम से कार्य करें। पुराने रुके कार्य निपटाने हेतु अनुकूल समय है।`;
    }

    return {
      rashi,
      luckyNumber,
      luckyColor,
      luckyDirection,
      luckScore,
      career,
      health,
      family,
      remedy,
      lunarImpactText,
    };
  }, [selectedRashiId, dateSeed, panchang]);

  const handleShareHoroscope = () => {
    const text = `⭐ *दैनिक राशिफल (${panchang.gregorianDateHindi})*
♈ *राशि:* ${horoscopeData.rashi.nameHindi} (${horoscopeData.rashi.nameEng})
🚩 *तिथि प्रभाव:* ${panchang.paksha} पक्ष, ${panchang.tithi} (${panchang.hinduMonth} मास)
✨ *भाग्यांक अनुकूलता:* ${horoscopeData.luckScore}%
🔢 *शुभ अंक:* ${horoscopeData.luckyNumber} | 🎨 *शुभ रंग:* ${horoscopeData.luckyColor}
🧭 *शुभ दिशा:* ${horoscopeData.luckyDirection}
💼 *कार्य-व्यवसाय:* ${horoscopeData.career}
❤️ *पारिवारिक:* ${horoscopeData.family}
🌿 *वैदिक उपाय:* ${horoscopeData.remedy}
📍 *आजमगढ़ पंचांग ऐप*`;

    if (navigator.share) {
      navigator.share({
        title: `${horoscopeData.rashi.nameHindi} दैनिक राशिफल`,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lunar Phase & Date banner */}
      <div className="bg-linear-to-r from-amber-100/90 via-amber-50 to-amber-100/90 border border-amber-300/80 rounded-xl p-3 sm:p-4 text-xs shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-900 shrink-0">
            <Moon className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-stone-900 text-sm">
                तिथि आधारित दैनिक राशिफल
              </span>
              <span className="bg-red-800 text-white font-semibold text-[10px] px-1.5 py-0.5 rounded">
                {panchang.paksha} पक्ष · {panchang.tithi}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              चंद्र राशि: <span className="font-bold text-red-900">{panchang.moonSign}</span> · नक्षत्र: <span className="font-semibold text-stone-800">{panchang.nakshatra}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleShareHoroscope}
          className="self-end sm:self-auto flex items-center gap-1 bg-white hover:bg-amber-50 text-stone-700 px-2.5 py-1.5 rounded-lg border border-amber-300 font-semibold transition-colors shadow-xs"
          title="राशिफल शेयर करें"
        >
          <Share2 className="w-3.5 h-3.5 text-amber-700" />
          <span>{copiedToast ? 'कॉपी हो गया!' : 'शेयर करें'}</span>
        </button>
      </div>

      {/* Rashi Selector Horizontal Tabs */}
      <div>
        <label className="text-xs font-bold text-stone-700 block mb-1.5">
          अपनी राशि चुनें (Select Zodiac Sign):
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {ALL_RASHIS.map((rashi) => {
            const isSelected = rashi.id === selectedRashiId;
            const isMoonSign = rashi.nameHindi === panchang.moonSign;

            return (
              <button
                key={rashi.id}
                onClick={() => setSelectedRashiId(rashi.id)}
                className={`p-2 rounded-xl text-center border transition-all relative ${
                  isSelected
                    ? 'bg-[#991b1b] text-white border-red-950 shadow-md scale-[1.02]'
                    : 'bg-[#fffaf0] hover:bg-amber-100/70 text-stone-800 border-amber-200'
                }`}
              >
                {isMoonSign && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[9px] font-extrabold px-1 rounded-full shadow-xs">
                    चंद्र
                  </span>
                )}
                <div className="font-heading text-sm font-bold leading-tight">
                  {rashi.nameHindi}
                </div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                  {rashi.nameEng}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Horoscope Card */}
      <div className="bg-[#fff9eb] border border-amber-300/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Rashi Title & Metrics */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-900/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-red-600 text-white flex items-center justify-center font-heading text-xl font-bold shadow-sm">
              {horoscopeData.rashi.nameHindi.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading text-xl font-bold text-red-950">
                  {horoscopeData.rashi.nameHindi} राशिफल ({horoscopeData.rashi.nameEng})
                </h4>
                <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                  तत्व: {horoscopeData.rashi.elementHindi}
                </span>
              </div>
              <p className="text-xs text-stone-600">
                स्वामी ग्रह: <span className="font-semibold text-stone-800">{horoscopeData.rashi.rulingPlanetHindi}</span> · प्रतीक: {horoscopeData.rashi.symbolHindi}
              </p>
            </div>
          </div>

          {/* Luck Progress Bar */}
          <div className="w-full sm:w-44 bg-white p-2 rounded-xl border border-amber-200 shrink-0">
            <div className="flex justify-between items-center text-xs font-bold mb-1">
              <span className="text-stone-600">आज का भाग्यांक:</span>
              <span className="text-red-900">{horoscopeData.luckScore}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-linear-to-r from-amber-500 to-red-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${horoscopeData.luckScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Highlights (Lucky Number, Color, Direction) */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-500 block font-medium">शुभ अंक</span>
            <span className="font-heading text-lg font-bold text-red-900">{horoscopeData.luckyNumber}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-500 block font-medium">शुभ रंग</span>
            <span className="font-heading text-sm font-bold text-amber-800 truncate">{horoscopeData.luckyColor}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
            <span className="text-[10px] text-stone-500 block font-medium">शुभ दिशा</span>
            <span className="font-heading text-sm font-bold text-stone-800">{horoscopeData.luckyDirection}</span>
          </div>
        </div>

        {/* Lunar Influence Card */}
        <div className="bg-amber-100/60 rounded-xl p-3 border border-amber-300/60 text-xs text-stone-800 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-red-950 block">चंद्रमा एवं तिथि का प्रभाव:</span>
            <p className="mt-0.5 leading-relaxed text-stone-700">{horoscopeData.lunarImpactText}</p>
          </div>
        </div>

        {/* Detailed Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Career */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>कार्य व व्यापार</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              {horoscopeData.career}
            </p>
          </div>

          {/* Health */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>स्वास्थ्य</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              {horoscopeData.health}
            </p>
          </div>

          {/* Family */}
          <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-900">
              <Heart className="w-3.5 h-3.5 text-rose-600" />
              <span>परिवार व प्रेम</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              {horoscopeData.family}
            </p>
          </div>
        </div>

        {/* Vedic Remedy */}
        <div className="bg-[#fefce8] p-3 rounded-xl border border-yellow-300 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">आज का वैदिक उपाय: </span>
            <span className="text-stone-800">{horoscopeData.remedy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
