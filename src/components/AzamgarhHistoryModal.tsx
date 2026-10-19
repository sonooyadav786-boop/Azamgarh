import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Navigation, 
  BookOpen, 
  Shield, 
  Award, 
  Search, 
  Share2, 
  Check, 
  ChevronRight,
  Flame,
  Landmark,
  Compass,
  FileText
} from 'lucide-react';
import { 
  AZAMGARH_HISTORICAL_TIMELINE, 
  AZAMGARH_HEROES, 
  AZAMGARH_FAMOUS_PLACES, 
  AZAMGARH_DISTRICT_FACTS 
} from '../data/azamgarhHistoryData';

interface AzamgarhHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'history' | 'heroes' | 'places' | 'facts';
}

export const AzamgarhHistoryModal: React.FC<AzamgarhHistoryModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'history'
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'heroes' | 'places' | 'facts'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [heroFilter, setHeroFilter] = useState<'all' | 'warrior' | 'freedom_fighter' | 'scholar_legend'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Filtered heroes
  const filteredHeroes = AZAMGARH_HEROES.filter((hero) => {
    const matchesFilter = heroFilter === 'all' || hero.category === heroFilter;
    const matchesSearch = !searchQuery || 
      hero.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.roleHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.bioHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hero.birthPlaceHindi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered places
  const filteredPlaces = AZAMGARH_FAMOUS_PLACES.filter((place) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      place.nameHindi.toLowerCase().includes(q) ||
      place.categoryHindi.toLowerCase().includes(q) ||
      place.locationHindi.toLowerCase().includes(q) ||
      place.significanceHindi.toLowerCase().includes(q) ||
      place.historyDetailHindi.toLowerCase().includes(q)
    );
  });

  const handleShareHistory = () => {
    const text = `🚩 *आजमगढ़ का गौरवशाली इतिहास, अमर वीर व प्रसिद्ध स्थल*\nपूर्वांचल की क्रांति व ऋषि भूमि आजमगढ़ (UP 50) का सम्पूर्ण इतिहास यहाँ पढ़ें:\n${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'आजमगढ़ का इतिहास व गौरवशाली विरासत',
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative bg-[#fffdf8] w-full max-w-4xl rounded-2xl shadow-2xl border-2 border-amber-800/40 overflow-hidden my-auto max-h-[94vh] flex flex-col z-10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#991b1b] via-[#831843] to-[#7c2d12] text-white p-3.5 sm:p-5 shadow-md flex items-center justify-between gap-3 border-b-2 border-amber-400/40">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-300/40 flex items-center gap-1">
                <Landmark className="w-3 h-3 text-amber-300" />
                <span>आजमगढ़ गौरव गाथा (UP 50)</span>
              </span>
              <span className="hidden sm:inline text-amber-200/80">· पूर्वांचल की वीर व ऋषि भूमि</span>
            </div>
            
            <h2 className="font-heading text-lg sm:text-2xl font-black text-amber-100 mt-1 flex items-center gap-2 leading-tight">
              <span>आजमगढ़ का इतिहास, अमर वीर व प्रसिद्ध स्थल</span>
            </h2>
            
            <p className="text-[11px] sm:text-xs text-amber-100/90 mt-0.5 line-clamp-1">
              महर्षि दुर्वासा-दत्तात्रेय की तपोभूमि · 1857 व 1942 के अमर क्रांतिकारी · विश्वप्रसिद्ध ब्लैक पॉटरी व पावन तीर्थ
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShareHistory}
              className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-red-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              title="शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">शेयर</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/15 transition-colors"
              aria-label="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#fef3c7] border-b border-amber-900/15 px-2 sm:px-4 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-1.5">
          <div className="flex items-center gap-1 sm:gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-800 hover:bg-amber-200/80'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>१. सम्पूर्ण इतिहास (कालक्रम)</span>
            </button>

            <button
              onClick={() => setActiveTab('heroes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'heroes'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-800 hover:bg-amber-200/80'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>२. अमर वीर व विभूतियाँ ({AZAMGARH_HEROES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('places')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'places'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-800 hover:bg-amber-200/80'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>३. प्रसिद्ध व दर्शनीय स्थल ({AZAMGARH_FAMOUS_PLACES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('facts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'facts'
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'text-stone-800 hover:bg-amber-200/80'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>४. जिले की रूपरेखा (तथ्य)</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: HISTORY (कालक्रम) */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="bg-amber-100/70 border border-amber-300/80 rounded-xl p-3.5 text-xs text-stone-800 flex items-start gap-3">
                <span className="text-2xl shrink-0">📜</span>
                <div>
                  <h4 className="font-heading font-black text-sm text-red-950 mb-0.5">
                    आजमगढ़ का ऐतिहासिक परिचय — सतयुग से स्वतंत्र भारत तक
                  </h4>
                  <p className="leading-relaxed">
                    आजमगढ़ की माटी का इतिहास सनातन संस्कृति, त्याग और राष्ट्रभक्ति की अनुपम मिसाल है। यह भूमि केवल प्रशासनिक जिला नहीं, बल्कि तमसा नदी के तट पर विकसित हुई ऋषि-संस्कृति, 1857 के प्रथम स्वतंत्रता संग्राम में बाबू कुंवर सिंह की शौर्य-स्थली और 1942 के भारत छोड़ो आंदोलन का अग्रणी केंद्र रही है।
                  </p>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-4">
                {AZAMGARH_HISTORICAL_TIMELINE.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-400 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-amber-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-900 border border-red-300 flex items-center justify-center text-xl shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-amber-200 text-red-950 px-2 py-0.5 rounded-full">
                              चरण {index + 1} · {item.periodHindi}
                            </span>
                          </div>
                          <h3 className="font-heading text-base sm:text-lg font-black text-red-950 mt-0.5">
                            {item.titleHindi}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-amber-950 italic">
                      "{item.taglineHindi}"
                    </p>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed text-justify">
                      {item.summaryHindi}
                    </p>

                    {/* Highlights */}
                    <div className="bg-[#fff9eb] border border-amber-200 rounded-xl p-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-red-950 uppercase tracking-wider block">
                        ⭐ ऐतिहासिक मुख्य बिंदु व साक्ष्य:
                      </span>
                      <ul className="space-y-1">
                        {item.highlightsHindi.map((hl, i) => (
                          <li key={i} className="text-xs text-stone-800 flex items-start gap-1.5">
                            <span className="text-red-700 font-bold shrink-0">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200 leading-relaxed text-justify">
                      {item.detailsHindi}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HEROES & LEGENDS (अमर वीर व क्रांतिकारी) */}
          {activeTab === 'heroes' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                  <button
                    onClick={() => setHeroFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      heroFilter === 'all'
                        ? 'bg-red-800 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    सभी ({AZAMGARH_HEROES.length})
                  </button>

                  <button
                    onClick={() => setHeroFilter('warrior')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      heroFilter === 'warrior'
                        ? 'bg-red-800 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    ⚔️ 1857 के वीर योद्धा
                  </button>

                  <button
                    onClick={() => setHeroFilter('freedom_fighter')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      heroFilter === 'freedom_fighter'
                        ? 'bg-red-800 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    🇮🇳 1942 के अमर शहीद
                  </button>

                  <button
                    onClick={() => setHeroFilter('scholar_legend')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      heroFilter === 'scholar_legend'
                        ? 'bg-red-800 text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    ✍️ साहित्य व संस्कृति के महापुरुष
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="वीर या महापुरुष खोजें..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-56 text-xs bg-white border border-amber-300 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-700"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Heroes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredHeroes.map((hero) => (
                  <div
                    key={hero.id}
                    className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs hover:border-red-400 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-2">
                        <div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                            hero.category === 'warrior'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : hero.category === 'freedom_fighter'
                              ? 'bg-orange-100 text-orange-900 border border-orange-300'
                              : 'bg-purple-100 text-purple-900 border border-purple-300'
                          }`}>
                            {hero.category === 'warrior' ? '⚔️ 1857 महानायक' : hero.category === 'freedom_fighter' ? '🇮🇳 अमर हुतात्मा' : '📚 युगपुरुष'}
                          </span>
                          <h4 className="font-heading text-base font-black text-red-950 mt-1">
                            {hero.nameHindi}
                          </h4>
                          <p className="text-[11px] font-bold text-amber-900">
                            {hero.titleHindi}
                          </p>
                        </div>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-1 rounded font-mono shrink-0">
                          {hero.periodHindi}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-600 flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3 h-3 text-red-700 shrink-0" />
                        <span className="font-medium">जन्म/कर्मस्थली: {hero.birthPlaceHindi}</span>
                      </div>

                      <p className="text-xs text-stone-800 leading-relaxed mt-2 text-justify">
                        {hero.bioHindi}
                      </p>

                      {/* Achievements */}
                      <div className="mt-2.5 bg-[#fdfbf7] p-2.5 rounded-xl border border-stone-200 space-y-1">
                        <span className="text-[10px] font-bold text-red-950 uppercase block">
                          प्रमुख योगदान व गौरवशाली कार्य:
                        </span>
                        <ul className="space-y-0.5">
                          {hero.achievementsHindi.map((ach, idx) => (
                            <li key={idx} className="text-[11px] text-stone-700 flex items-start gap-1">
                              <span className="text-amber-800 font-bold shrink-0">✓</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {hero.quoteHindi && (
                      <div className="bg-amber-50 border-l-3 border-amber-600 p-2 text-[11px] text-amber-950 italic rounded-r-lg">
                        "{hero.quoteHindi}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAMOUS PLACES (प्रसिद्ध व दर्शनीय स्थल) */}
          {activeTab === 'places' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="तीर्थ, मंदिर, दुर्ग या प्रसिद्ध स्थल खोजें (जैसे दुर्वासा, पल्हना, पॉटरी, तमसा)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-white border border-amber-300 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-700 shadow-2xs"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Places List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="bg-white border-2 border-amber-200 rounded-2xl p-4 shadow-xs hover:border-amber-500 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-amber-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0 p-1.5 bg-amber-100 rounded-xl border border-amber-300">
                          {place.icon}
                        </span>
                        <div>
                          <h4 className="font-heading text-base font-black text-red-950">
                            {place.nameHindi}
                          </h4>
                          <span className="text-[10px] font-bold bg-amber-100 text-red-900 px-1.5 py-0.2 rounded inline-block">
                            {place.categoryHindi}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-amber-950 font-medium flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>{place.locationHindi}</span>
                      </p>
                      <p className="text-[11px] text-stone-500 font-sans pl-5">
                        दूरी: {place.distanceFromCityHindi}
                      </p>
                    </div>

                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      {place.significanceHindi}
                    </p>

                    <div className="bg-[#fefce8] p-2.5 rounded-xl border border-amber-200 text-xs text-stone-700 leading-relaxed text-justify">
                      <span className="font-bold text-amber-950 block text-[11px] mb-0.5">
                        📖 ऐतिहासिक व पौराणिक पृष्ठभूमि:
                      </span>
                      {place.historyDetailHindi}
                    </div>

                    <div className="pt-1.5 border-t border-amber-100 flex flex-col gap-1 text-[11px]">
                      <div className="text-stone-700">
                        <span className="font-bold text-red-950">विशिष्ट आकर्षण: </span>
                        <span>{place.specialFeatureHindi}</span>
                      </div>
                      <div className="text-emerald-800 font-medium">
                        <span className="font-bold text-emerald-950">प्रमुख पर्व / मेला: </span>
                        <span>{place.festivalsOrEventsHindi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DISTRICT FACTS (जनपद रूपरेखा व तथ्य) */}
          {activeTab === 'facts' && (
            <div className="space-y-4">
              {/* Header Overview Card */}
              <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-red-950 font-heading font-black text-lg">
                  <Compass className="w-5 h-5 text-red-800" />
                  <span>आजमगढ़ जनपद: एक दृष्टि में (At a Glance)</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                  आजमगढ़ उत्तर प्रदेश के पूर्वांचल क्षेत्र का एक ऐतिहासिक और सांस्कृतिक रूप से अत्यंत समृद्ध जनपद है। यह तमसा और कुंवर नदियों की गोद में बसा है।
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">आरक्षित वाहन कोड</span>
                    <span className="font-heading font-black text-lg text-red-900">{AZAMGARH_DISTRICT_FACTS.regionalCode}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">स्थापना वर्ष</span>
                    <span className="font-heading font-black text-base text-red-900">{AZAMGARH_DISTRICT_FACTS.establishedYear}</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">कुल तहसीलें</span>
                    <span className="font-heading font-black text-lg text-red-900">{AZAMGARH_DISTRICT_FACTS.tehsilsCount} तहसीलें</span>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">प्रशासनिक मंडल</span>
                    <span className="font-heading font-black text-sm text-red-900 mt-1 block">आजमगढ़ मंडल</span>
                  </div>
                </div>
              </div>

              {/* Tehsils Grid */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="font-heading font-black text-sm text-red-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-700" />
                  <span>आजमगढ़ जिले की समस्त ८ तहसीलें:</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {AZAMGARH_DISTRICT_FACTS.tehsilsHindi.map((tehsil, idx) => (
                    <div 
                      key={idx}
                      className="bg-stone-50 border border-stone-200 p-2 rounded-xl text-center text-xs font-bold text-stone-800 hover:bg-amber-100 hover:border-amber-300 transition-colors"
                    >
                      <span className="text-red-800 mr-1 font-mono">{idx + 1}.</span> {tehsil}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rivers & Geography */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="font-heading font-black text-sm text-red-950 flex items-center gap-1.5">
                  <span className="text-lg">🌊</span>
                  <span>प्रमुख जीवनदायिनी नदियां व जलप्रवाह:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {AZAMGARH_DISTRICT_FACTS.majorRiversHindi.map((river, idx) => (
                    <div key={idx} className="bg-blue-50/60 border border-blue-200 p-2.5 rounded-xl flex items-center gap-2 text-blue-950">
                      <span className="text-blue-600 font-bold">💧</span>
                      <span className="font-semibold">{river}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* World famous Crafts & GI Tags */}
              <div className="bg-white border-2 border-amber-200 rounded-2xl p-4 space-y-2.5">
                <h4 className="font-heading font-black text-sm text-red-950 flex items-center gap-1.5">
                  <span className="text-lg">🏺</span>
                  <span>वैश्विक पहचान एवं विशिष्ट हस्तशिल्प:</span>
                </h4>
                <div className="space-y-2 text-xs text-stone-800">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <span className="font-black text-red-900 block text-sm">
                      1. निजामाबाद ब्लैक पॉटरी (काली मिट्टी के बर्तन) — GI Tag
                    </span>
                    <p className="mt-1 leading-relaxed">
                      भारत सरकार के भौगोलिक उपदर्शन रजिस्ट्री द्वारा प्रमाणित। दुनिया में अपनी तरह की एकमात्र कलाकृति, जहां काली चमकती सतह पर चांदी के तारों जैसी नक्काशी की जाती है।
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                    <span className="font-black text-red-900 block text-sm">
                      2. मुबारकपुर बनारसी रेशमी साड़ी व जरी हथकरघा
                    </span>
                    <p className="mt-1 leading-relaxed">
                      शताब्दियों से स्थापित वैश्विक वस्त्र केंद्र। यहां के हथकरघा बुनकरों द्वारा तैयार की गई साड़ियां देश-विदेश में अपनी उत्कृष्ट गुणवत्ता व कारीगरी के लिए जानी जाती हैं।
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-red-950">आजमगढ़ कैलेंडर</span>
            <span className="text-stone-400">|</span>
            <span>सांस्कृतिक व ऐतिहासिक धरोहर संरक्षण</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareHistory}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-red-950 font-bold rounded-lg transition-colors border border-amber-300 flex items-center gap-1 text-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5 text-red-800" />}
              <span>व्हाट्सएप पर शेयर करें</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#991b1b] text-white font-bold rounded-lg hover:bg-red-800 transition-colors shadow-2xs"
            >
              पूर्ण विवरण देख लिया
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
