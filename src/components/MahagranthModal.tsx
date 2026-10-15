import React from 'react';
import { X, BookOpen, ChevronRight, Sparkles } from 'lucide-react';

interface MahagranthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRamayan: () => void;
  onOpenShivPuran: () => void;
  onOpenVishnuPuran: () => void;
  onOpenMahabharat: () => void;
  onOpenKrishnaKatha: () => void;
  onOpenAarti: () => void;
}

export const MahagranthModal: React.FC<MahagranthModalProps> = ({
  isOpen,
  onClose,
  onOpenRamayan,
  onOpenShivPuran,
  onOpenVishnuPuran,
  onOpenMahabharat,
  onOpenKrishnaKatha,
  onOpenAarti,
}) => {
  if (!isOpen) return null;

  const granthList = [
    {
      id: 'ramayan',
      title: 'श्रीरामचरितमानस',
      subtitle: 'गोस्वामी तुलसीदास कृत · सम्पूर्ण सातों काण्ड',
      desc: '१,१७२ दोहे, ४,६३८ चौपाइयां व २३१ छंद। बालकाण्ड से उत्तरकाण्ड तक सानुवाद व सस्वर पाठ।',
      tag: '७ काण्ड',
      icon: '🚩',
      borderColor: 'border-red-300 hover:border-red-600',
      badgeColor: 'bg-red-800 text-white',
      accentColor: 'text-red-900',
      action: onOpenRamayan,
      btnLabel: 'सम्पूर्ण पाठ पढ़ें',
      bgGradient: 'from-red-50/90 to-amber-50/70',
    },
    {
      id: 'shivpuran',
      title: 'श्री शिव महापुराण',
      subtitle: 'महर्षि वेदव्यास प्रणीत · सम्पूर्ण ७ संहिताएं',
      desc: 'विद्येश्वर, रुद्र, शतरुद्र, कोटिरुद्र संहिता। द्वादश ज्योतिर्लिंग महिमा, महामृत्युंजय व शिव ताण्डव स्तोत्र।',
      tag: '७ संहिताएं',
      icon: '🔱',
      borderColor: 'border-orange-300 hover:border-orange-600',
      badgeColor: 'bg-orange-800 text-white',
      accentColor: 'text-orange-950',
      action: onOpenShivPuran,
      btnLabel: 'संहिताएं पढ़ें',
      bgGradient: 'from-orange-50/90 to-stone-50/70',
    },
    {
      id: 'vishnupuran',
      title: 'श्री विष्णु पुराण',
      subtitle: 'महर्षि पराशर-मैत्रेय संवाद · सम्पूर्ण षट् अंश',
      desc: 'ध्रुव व प्रह्लाद चरित्र, समुद्र मंथन, दशावतार लीला, श्रीकृष्ण चरित्र व आत्यन्तिक मोक्ष धर्म।',
      tag: '६ अंश',
      icon: '🪷',
      borderColor: 'border-cyan-300 hover:border-cyan-600',
      badgeColor: 'bg-cyan-800 text-white',
      accentColor: 'text-cyan-950',
      action: onOpenVishnuPuran,
      btnLabel: 'षट् अंश पढ़ें',
      bgGradient: 'from-cyan-50/90 to-blue-50/70',
    },
    {
      id: 'mahabharat',
      title: 'सम्पूर्ण महाभारत',
      subtitle: 'महर्षि वेदव्यास विरचित · सम्पूर्ण १८ पर्व',
      desc: 'आदि पर्व से स्वर्गारोहण पर्व तक। श्रीमद्भगवद्गीता ज्ञान, यक्ष-युधिष्ठिर संवाद व भीष्म पितामह नीति।',
      tag: '१८ पर्व',
      icon: '🏹',
      borderColor: 'border-rose-300 hover:border-rose-600',
      badgeColor: 'bg-rose-900 text-white',
      accentColor: 'text-rose-950',
      action: onOpenMahabharat,
      btnLabel: '१८ पर्व पढ़ें',
      bgGradient: 'from-rose-50/90 to-red-50/70',
    },
    {
      id: 'krishna',
      title: 'श्री कृष्ण चरितामृत',
      subtitle: 'श्रीमद्भागवत दशम स्कंध · सम्पूर्ण ९० अध्याय',
      desc: 'भगवान श्रीकृष्ण का प्राकट्य, बाललीला, गोवर्धन धारण, महारास, कंस वध, मथुरा व द्वारिका लीला।',
      tag: '९० अध्याय',
      icon: '🦚',
      borderColor: 'border-amber-300 hover:border-amber-600',
      badgeColor: 'bg-amber-800 text-white',
      accentColor: 'text-amber-950',
      action: onOpenKrishnaKatha,
      btnLabel: 'कथा रसपान करें',
      bgGradient: 'from-amber-50/90 to-yellow-50/70',
    },
    {
      id: 'aarti',
      title: 'समस्त देवी-देवता आरती व चालीसा',
      subtitle: 'दैनिक उपासना, स्तुति व वंदना संग्रह',
      desc: 'हनुमान चालीसा, शिव चालीसा, दुर्गा चालीसा, गणेश वंदना, सूर्य अर्घ्य मंत्र व नित्य आरती संग्रह।',
      tag: 'स्तुति संग्रह',
      icon: '🪔',
      borderColor: 'border-purple-300 hover:border-purple-600',
      badgeColor: 'bg-purple-800 text-white',
      accentColor: 'text-purple-950',
      action: onOpenAarti,
      btnLabel: 'आरती व चालीसा पढ़ें',
      bgGradient: 'from-purple-50/90 to-pink-50/70',
    },
  ];

  const handleSelectGranth = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-[#fffdf9] text-stone-900 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-amber-600/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#991b1b] via-[#881337] to-[#7c2d12] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-amber-400/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-red-950 flex items-center justify-center font-bold text-xl shadow-md border border-amber-300">
              📖
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-amber-100 leading-tight flex items-center gap-2">
                <span>सनातन पावन पंच महाग्रंथ</span>
                <span className="text-[11px] font-sans font-bold bg-amber-400 text-red-950 px-2 py-0.5 rounded-full">
                  ५ महाग्रंथ
                </span>
              </h2>
              <p className="text-xs text-amber-200/90 font-sans mt-0.5">
                शुद्ध सानुवाद पाठ, सस्वर उच्चारण, दोहा-चौपाइयां व सम्पूर्ण अध्याय
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-amber-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title="बंद करें"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notice Bar */}
        <div className="bg-amber-100/90 border-b border-amber-300/80 px-4 py-2 flex items-center gap-2 text-xs text-amber-950 font-medium">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            जिस भी ग्रंथ का पाठ करना चाहते हैं, उस पर क्लिक करें। पूरा ग्रंथ तुरंत खुल जाएगा:
          </span>
        </div>

        {/* Content Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {granthList.map((granth) => (
              <div
                key={granth.id}
                onClick={() => handleSelectGranth(granth.action)}
                className={`p-3.5 sm:p-4 rounded-xl border bg-gradient-to-br ${granth.bgGradient} ${granth.borderColor} shadow-xs hover:shadow-md transition-all cursor-pointer group active:scale-[0.99] flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm sm:text-base font-black font-serif flex items-center gap-1.5 text-stone-900 group-hover:text-red-900 transition-colors">
                      <span className="text-lg">{granth.icon}</span>
                      <span>{granth.title}</span>
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${granth.badgeColor}`}>
                      {granth.tag}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-stone-700 mb-1 leading-snug">
                    {granth.subtitle}
                  </p>

                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    {granth.desc}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-amber-900/10 flex items-center justify-between text-xs font-black text-red-900 group-hover:text-red-700">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{granth.btnLabel}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 px-4 sm:px-6">
          <span className="font-serif">卐 आजमगढ़ वैदिक सांस्कृतिक धरोहर · धर्मो रक्षति रक्षितः 卐</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold text-xs active:scale-95 transition-all"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
