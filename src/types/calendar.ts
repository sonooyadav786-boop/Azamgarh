export type EventCategory = 
  | 'all'
  | 'tyohar' 
  | 'vrat' 
  | 'shradh' 
  | 'jayanti' 
  | 'ekadashi' 
  | 'amavasya' 
  | 'purnima' 
  | 'muhurat';

export interface CalendarEvent {
  id: string;
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  dayOfWeekHindi: string; // 'गुरुवार', 'शुक्रवार', etc.
  dayOfWeekEng: string;
  titleHindi: string; // 'षष्ठी श्राद्ध', 'सर्वपितृ अमावस्या'
  titleEng: string;
  fullDateHindi: string; // 'अक्टूबर 01, 2026, गुरुवार'
  hinduMonth: string; // 'आश्विन', 'कार्तिक'
  paksha: 'कृष्ण' | 'शुक्ल';
  tithi: string; // 'षष्ठी', 'सप्तमी', 'अमावस्या'
  subText?: string; // 'जैन कैलेण्डर पर आधारित', 'ग्रेगोरियन कैलेण्डर में निश्चित दिन'
  category: EventCategory;
  isMajor?: boolean; // बड़े त्योहार vs छोटे त्योहार
  isGazettedHoliday?: boolean;
  imageType: 
    | 'shradh' 
    | 'jain' 
    | 'gandhi' 
    | 'lakshmi' 
    | 'shiva' 
    | 'kalki' 
    | 'pitru_hamsa' 
    | 'amavasya' 
    | 'naivedya' 
    | 'agrasen' 
    | 'durga' 
    | 'diya' 
    | 'diwali' 
    | 'chhat' 
    | 'ram' 
    | 'krishna' 
    | 'ganesh' 
    | 'hanuman'
    | 'generic_vedic';
  descriptionHindi?: string;
  vidhiHindi?: string;
  whyCelebratedHindi?: string; // त्योहार क्यों मनाते हैं (कथा, रहस्य व कारण)
  historySinceHindi?: string; // त्योहार कब से मनाया जाता है (आरंभ काल, युग व इतिहास)
  muhuratTime?: string;
}

export interface DayPanchang {
  dateStr: string; // YYYY-MM-DD
  gregorianDateHindi: string;
  dayHindi: string;
  vikramSamvat: number; // e.g. 2083
  shakaSamvat: number; // e.g. 1948
  ayana: 'दक्षिणायन' | 'उत्तरायण';
  ritu: string; // 'शरद', 'हेमंत', etc.
  hinduMonth: string; // 'आश्विन'
  paksha: 'कृष्ण' | 'शुक्ल';
  tithi: string;
  tithiEndTime: string;
  nakshatra: string;
  nakshatraEndTime: string;
  yoga: string;
  karana: string;
  sunriseAzamgarh: string; // e.g. '05:56 AM'
  sunsetAzamgarh: string; // e.g. '05:42 PM'
  moonrise: string;
  moonset: string;
  sunSign: string;
  moonSign: string;
  rahuKaal: string; // e.g. '01:30 PM - 03:00 PM'
  yamaganda: string;
  gulikaKaal: string;
  abhijitMuhurat: string; // e.g. '11:38 AM - 12:26 PM'
  amritKaal: string;
  durmuhurat: string;
  brahmaMuhurat: string;
  choghadiyaDay: Array<{
    name: string;
    type: 'shubh' | 'amrit' | 'labh' | 'char' | 'rog' | 'kaal' | 'udveg';
    time: string;
  }>;
  choghadiyaNight: Array<{
    name: string;
    type: 'shubh' | 'amrit' | 'labh' | 'char' | 'rog' | 'kaal' | 'udveg';
    time: string;
  }>;
}

export interface AartiItem {
  id: string;
  category: 
    | 'shiv' 
    | 'hanuman' 
    | 'ganesh' 
    | 'durga' 
    | 'lakshmi' 
    | 'ram' 
    | 'krishna_vishnu' 
    | 'radha'
    | 'gayatri'
    | 'surya' 
    | 'saraswati' 
    | 'shani' 
    | 'shyam'
    | 'bhairav'
    | 'kuber'
    | 'santoshi'
    | 'ganga';
  itemType: 'aarti' | 'chalisa' | 'stuti';
  titleHindi: string;
  titleEng: string;
  deity: string;
  shortSummaryHindi: string;
  lyrics: string[];
  meaningHindi?: string;
}
