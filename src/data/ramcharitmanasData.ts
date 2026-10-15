import {
  SUNDARKAND_FULL_DOHAS,
  SundarkandDohaUnit
} from './kands/sundaraKandaFull';
import { BALA_FULL_DOHAS } from './kands/balaKandaFull';
import { AYODHYA_FULL_DOHAS } from './kands/ayodhyaKandaFull';
import { ARANYA_FULL_DOHAS } from './kands/aranyaKandaFull';
import { KISHKINDHA_FULL_DOHAS } from './kands/kishkindhaKandaFull';
import { LANKA_FULL_DOHAS } from './kands/lankaKandaFull';
import { UTTARA_FULL_DOHAS } from './kands/uttaraKandaFull';
import {
  KAND_DOHA_SECTIONS,
  RAMCHARITMANAS_STATS_VERIFIED
} from './kands/dohaCanon';
import {
  ALL_4638_CHAUPAIS,
  FAMOUS_CHAUPAIS_CANON,
  KAND_CHAUPAI_METRICS,
  TOTAL_CHAUPAIS_VERIFIED,
  ChaupaiRecord,
  KandChaupaiSummary
} from './kands/chaupaiCanon';
import {
  ALL_CANONICAL_CHHANDS,
  KAND_CHHAND_METRICS,
  TOTAL_CHHANDS_VERIFIED,
  CORE_86_CHHAND_TITLES,
  ChhandRecord,
  KandChhandSummary
} from './kands/chhandCanon';
import {
  BALA_KANDA_RICH_PRASANGS,
  AYODHYA_KANDA_RICH_PRASANGS,
  ARANYA_KANDA_RICH_PRASANGS,
  KISHKINDHA_KANDA_RICH_PRASANGS,
  LANKA_KANDA_RICH_PRASANGS,
  UTTARA_KANDA_RICH_PRASANGS
} from './kands/allKandsRichData';

export const ALL_KANDS_FULL_DOHAS: Record<number, SundarkandDohaUnit[]> = {
  0: BALA_FULL_DOHAS,
  1: AYODHYA_FULL_DOHAS,
  2: ARANYA_FULL_DOHAS,
  3: KISHKINDHA_FULL_DOHAS,
  4: SUNDARKAND_FULL_DOHAS,
  5: LANKA_FULL_DOHAS,
  6: UTTARA_FULL_DOHAS
};

export {
  BALA_FULL_DOHAS,
  AYODHYA_FULL_DOHAS,
  ARANYA_FULL_DOHAS,
  KISHKINDHA_FULL_DOHAS,
  SUNDARKAND_FULL_DOHAS,
  LANKA_FULL_DOHAS,
  UTTARA_FULL_DOHAS,
  KAND_DOHA_SECTIONS,
  RAMCHARITMANAS_STATS_VERIFIED,
  ALL_4638_CHAUPAIS,
  FAMOUS_CHAUPAIS_CANON,
  KAND_CHAUPAI_METRICS,
  TOTAL_CHAUPAIS_VERIFIED,
  ALL_CANONICAL_CHHANDS,
  KAND_CHHAND_METRICS,
  TOTAL_CHHANDS_VERIFIED,
  CORE_86_CHHAND_TITLES
};

export type { SundarkandDohaUnit, ChaupaiRecord, KandChaupaiSummary, ChhandRecord, KandChhandSummary };

export interface ChaupaiVerse {
  type: 'sloka' | 'doha' | 'soratha' | 'chaupai' | 'chhand';
  dohaNumber?: string;
  textAwadhi: string[];
  meaningHindi: string;
}

export interface RamayanPrasang {
  id: string;
  prasangTitle: string;
  prasangSubtitle: string;
  dohaRange?: string;
  verses: ChaupaiVerse[];
}

export interface RamayanKand {
  id: string;
  kandNumber: number;
  kandNameHindi: string;
  kandNameEng: string;
  overviewHindi: string;
  totalPrasangsCount: number;
  keyTeachings: string;
  dohasCount?: number;
  chaupaisCountApprox?: number;
  sorathasCount?: number;
  shlokasCount?: number;
  chhandsCount?: number;
  dohaRange?: string;
  prasangs: RamayanPrasang[];
}

export interface KandStructureInfo {
  kandNumber: number;
  kandNameHindi: string;
  kandNameEng: string;
  dohasCount: number;
  chaupaisCountApprox: number;
  sorathasCount: number;
  shlokasCount: number;
  chhandsCount: number;
  dohaRange: string;
  significance: string;
}

export interface RamcharitmanasStructure {
  totalKands: number; // 7
  totalDohas: number; // 1,172
  totalChaupais: number; // 4,638
  totalSorathas: number; // 87
  totalShlokas: number; // 27
  totalChhands: number; // 231
  kandBreakdown: KandStructureInfo[];
}

// =========================================================================
// सम्पूर्ण रामचरितमानस की प्रामाणिक संरचना (CANONICAL STRUCTURE METRICS)
// =========================================================================
export const RAMCHARITMANAS_STRUCTURE: RamcharitmanasStructure = {
  totalKands: 7,
  totalDohas: 1172,
  totalChaupais: 4638,
  totalSorathas: 87,
  totalShlokas: 27,
  totalChhands: 231,
  kandBreakdown: [
    {
      kandNumber: 1,
      kandNameHindi: 'बालकाण्ड',
      kandNameEng: 'Bala Kanda',
      dohasCount: 361,
      chaupaisCountApprox: 1440,
      sorathasCount: 28,
      shlokasCount: 7,
      chhandsCount: 84,
      dohaRange: 'दोहा १ से ३६१ (कुल पद ३९५)',
      significance: 'मंगलाचरण, नाम-महिमा, शिव-चरित्र, मनु-शतरूपा, राम जन्म, बाललीला, अहल्या उद्धार, धनुष भंग एवं सीता विवाह।'
    },
    {
      kandNumber: 2,
      kandNameHindi: 'अयोध्याकाण्ड',
      kandNameEng: 'Ayodhya Kanda',
      dohasCount: 326,
      chaupaisCountApprox: 1304,
      sorathasCount: 24,
      shlokasCount: 1,
      chhandsCount: 33,
      dohaRange: 'दोहा १ से ३२६ (कुल पद ३५५)',
      significance: 'राज्याभिषेक विघ्न, वन गमन, केवट संवाद, दशरथ मरण, भरत-प्रेम, चित्रकूट मिलन एवं पादुका अर्पण।'
    },
    {
      kandNumber: 3,
      kandNameHindi: 'अरण्यकाण्ड',
      kandNameEng: 'Aranya Kanda',
      dohasCount: 46,
      chaupaisCountApprox: 390,
      sorathasCount: 5,
      shlokasCount: 2,
      chhandsCount: 14,
      dohaRange: 'दोहा १ से ४६ (कुल पद ५०)',
      significance: 'अत्रि-अनसूया, असुर संहार प्रतिज्ञा, लक्ष्मण-गीता, खर-दूषण वध, सीता हरण, जटायु मोक्ष एवं शबरी नवधा भक्ति।'
    },
    {
      kandNumber: 4,
      kandNameHindi: 'किष्किन्धाकाण्ड',
      kandNameEng: 'Kishkindha Kanda',
      dohasCount: 30,
      chaupaisCountApprox: 225,
      sorathasCount: 2,
      shlokasCount: 2,
      chhandsCount: 8,
      dohaRange: 'दोहा १ से ३० (कुल पद ३३)',
      significance: 'राम-हनुमान मिलन, सुग्रीव मित्रता, बालि वध, वर्षा-शरद रूपक एवं जाम्बवंत द्वारा बल स्मरण।'
    },
    {
      kandNumber: 5,
      kandNameHindi: 'सुन्दरकाण्ड',
      kandNameEng: 'Sundara Kanda',
      dohasCount: 60,
      chaupaisCountApprox: 524,
      sorathasCount: 4,
      shlokasCount: 3,
      chhandsCount: 12,
      dohaRange: 'दोहा १ से ६० (कुल पद ६५)',
      significance: 'समुद्र लांघन, विभीषण भेंट, अशोक वाटिका, लंका दहन, विभीषण शरणागति एवं समुद्र पर विनय।'
    },
    {
      kandNumber: 6,
      kandNameHindi: 'लंकाकाण्ड (युद्धकाण्ड)',
      kandNameEng: 'Lanka Kanda',
      dohasCount: 121,
      chaupaisCountApprox: 460,
      sorathasCount: 6,
      shlokasCount: 4,
      chhandsCount: 42,
      dohaRange: 'दोहा १ से १२१ (कुल पद १३१)',
      significance: 'रामेश्वरम स्थापना, सेतु निर्माण, अंगद दूत, लक्ष्मण शक्ति, संजीवनी, धर्म रथ उपदेश, रावण वध एवं राज्याभिषेक।'
    },
    {
      kandNumber: 7,
      kandNameHindi: 'उत्तरकाण्ड',
      kandNameEng: 'Uttara Kanda',
      dohasCount: 130,
      chaupaisCountApprox: 295,
      sorathasCount: 18,
      shlokasCount: 8,
      chhandsCount: 38,
      dohaRange: 'दोहा १ से १३० (कुल पद १४३)',
      significance: 'अयोध्या आगमन, राज्याभिषेक, रामराज्य वर्णन, काकभुशुण्डि-गरुड़ संवाद, मानस रोग एवं नाम महिमा।'
    }
  ]
};

// Generate Sundarkand complete 60 dohas as structured RamayanPrasangs
const SUNDARKAND_CONVERTED_PRASANGS: RamayanPrasang[] = SUNDARKAND_FULL_DOHAS.map((item) => {
  const verses: ChaupaiVerse[] = [];
  if (item.shlokaOrSoratha) {
    verses.push({
      type: item.shlokaOrSoratha.type,
      textAwadhi: item.shlokaOrSoratha.textAwadhi,
      meaningHindi: item.shlokaOrSoratha.meaningHindi
    });
  }
  verses.push({
    type: 'chaupai',
    textAwadhi: item.chaupais,
    meaningHindi: item.chaupaiMeaning
  });
  verses.push({
    type: 'doha',
    dohaNumber: `दोहा ${item.dohaNum}`,
    textAwadhi: item.doha,
    meaningHindi: item.dohaMeaning
  });
  if (item.chhand) {
    verses.push({
      type: 'chhand',
      textAwadhi: item.chhand.textAwadhi,
      meaningHindi: item.chhand.meaningHindi
    });
  }
  return {
    id: `sundar-doha-${item.dohaNum}`,
    prasangTitle: `दोहा ${item.dohaNum}: ${item.title}`,
    prasangSubtitle: `सम्पूर्ण सुन्दरकाण्ड - दोहा ${item.dohaNum} मूल पाठ व हिन्दी भावार्थ`,
    dohaRange: `दोहा ${item.dohaNum}`,
    verses
  };
});

// =========================================================================
// सम्पूर्ण सातों काण्ड का प्रामाणिक संग्रह (SEVEN KANDAS COMPLETE DATA)
// =========================================================================
export const RAMCHARITMANAS_KANDS: RamayanKand[] = [
  // १. बालकाण्ड (BALA KANDA)
  {
    id: 'kand-1-bala',
    kandNumber: 1,
    kandNameHindi: 'बालकाण्ड',
    kandNameEng: 'Bala Kanda',
    overviewHindi: 'मंगलाचरण, गुरु वंदना, राम नाम महिमा, शिव-पार्वती विवाह, प्रभु श्री राम का पावन प्राकट्य, बाललीला, ताड़का वध, अहिल्या उद्धार, धनुष यज्ञ व सीता स्वयंवर।',
    totalPrasangsCount: BALA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'भक्ति, गुरु-सेवा, नाम-महिमा, सती-मोह से शिक्षा और मर्यादा का बीजारोपण।',
    dohasCount: 361,
    chaupaisCountApprox: 1440,
    sorathasCount: 28,
    shlokasCount: 7,
    chhandsCount: 47,
    dohaRange: 'दोहा १ से ३६१',
    prasangs: BALA_KANDA_RICH_PRASANGS
  },

  // २. अयोध्याकाण्ड (AYODHYA KANDA)
  {
    id: 'kand-2-ayodhya',
    kandNumber: 2,
    kandNameHindi: 'अयोध्याकाण्ड',
    kandNameEng: 'Ayodhya Kanda',
    overviewHindi: 'राज्याभिषेक की तैयारी, मंथरा की कुटिलता, कैकेयी कोपभवन, श्री राम वन गमन, केवट प्रसंग, दशरथ देहत्याग, भरत-प्रेम, चित्रकूट सभा व पादुका अर्पण।',
    totalPrasangsCount: AYODHYA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'त्याग, मातृ-पितृ आज्ञा पालन, भ्रातृ-प्रेम, निष्काम सेवा और भरत का आदर्श वैराग्य।',
    dohasCount: 326,
    chaupaisCountApprox: 1304,
    sorathasCount: 46,
    shlokasCount: 1,
    chhandsCount: 13,
    dohaRange: 'दोहा १ से ३२६',
    prasangs: AYODHYA_KANDA_RICH_PRASANGS
  },

  // ३. अरण्यकाण्ड (ARANYA KANDA)
  {
    id: 'kand-3-aranya',
    kandNumber: 3,
    kandNameHindi: 'अरण्यकाण्ड',
    kandNameEng: 'Aranya Kanda',
    overviewHindi: 'जयंत उद्धार, अत्रि-अनसूया, असुर संहार प्रतिज्ञा, लक्ष्मण-गीता उपदेश, शूर्पणखा, खर-दूषण वध, मारीच, सीता हरण, जटायु मोक्ष एवं शबरी नवधा भक्ति।',
    totalPrasangsCount: ARANYA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'सत्य संकल्प, आत्म-ज्ञान (लक्ष्मण गीता), संतों का सम्मान एवं निष्कपट नवधा भक्ति।',
    dohasCount: 46,
    chaupaisCountApprox: 390,
    sorathasCount: 11,
    shlokasCount: 2,
    chhandsCount: 7,
    dohaRange: 'दोहा १ से ४६',
    prasangs: ARANYA_KANDA_RICH_PRASANGS
  },

  // ४. किष्किन्धाकाण्ड (KISHKINDHA KANDA)
  {
    id: 'kand-4-kishkindha',
    kandNumber: 4,
    kandNameHindi: 'किष्किन्धाकाण्ड',
    kandNameEng: 'Kishkindha Kanda',
    overviewHindi: 'ऋष्यमूक पर विप्र रूप हनुमान मिलन, राम-सुग्रीव मित्रता, सात ताल भेदन, बालि वध, वर्षा-शरद रूपक, सीता खोज प्रस्थान एवं जाम्बवंत द्वारा बल स्मरण।',
    totalPrasangsCount: KISHKINDHA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'सच्ची मित्रता का धर्म, सामर्थ्य की पहचान, कर्तव्य बोध और विनम्रता।',
    dohasCount: 30,
    chaupaisCountApprox: 245,
    sorathasCount: 4,
    shlokasCount: 2,
    chhandsCount: 4,
    dohaRange: 'दोहा १ से ३०',
    prasangs: KISHKINDHA_KANDA_RICH_PRASANGS
  },

  // ५. सुन्दरकाण्ड (SUNDARA KANDA) - सम्पूर्ण ६० दोहे
  {
    id: 'kand-5-sundara',
    kandNumber: 5,
    kandNameHindi: 'सुन्दरकाण्ड',
    kandNameEng: 'Sundara Kanda',
    overviewHindi: 'समुद्र लांघन, सुरसा-सिंहिका, लंकिनी गर्व भंजन, विभीषण भेंट, अशोक वाटिका में सीता दर्शन, त्रिजटा स्वप्न, मुद्रिका पतन, अक्षय वध, लंका दहन, चूड़ामणि समर्पण, विभीषण शरणागति एवं समुद्र पर विनय।',
    totalPrasangsCount: SUNDARKAND_CONVERTED_PRASANGS.length,
    keyTeachings: 'हनुमान जी की अनन्य निष्ठा, बुद्धि-बल समन्वय, शरणागत वत्सलता और विघ्न निवारण।',
    dohasCount: 60,
    chaupaisCountApprox: 525,
    sorathasCount: 8,
    shlokasCount: 3,
    chhandsCount: 4,
    dohaRange: 'दोहा १ से ६० (सम्पूर्ण)',
    prasangs: SUNDARKAND_CONVERTED_PRASANGS
  },

  // ६. लंकाकाण्ड (LANKA KANDA / YUDDHA KANDA)
  {
    id: 'kand-6-lanka',
    kandNumber: 6,
    kandNameHindi: 'लंकाकाण्ड (युद्धकाण्ड)',
    kandNameEng: 'Lanka Kanda',
    overviewHindi: 'रामेश्वरम् स्थापना, सेतु निर्माण, अंगद दूत एवं सभा में चरण रोपण, लक्ष्मण शक्ति बाण, संजीवनी बूटी, कुम्भकर्ण-मेघनाद वध, भगवान का धर्म रथ उपदेश, रावण वध एवं विभीषण राज्याभिषेक।',
    totalPrasangsCount: LANKA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'अधर्म पर धर्म की विजय, सत्य का संबल, धर्म-रथ का जीवन संदेश एवं करुणा।',
    dohasCount: 121,
    chaupaisCountApprox: 710,
    sorathasCount: 16,
    shlokasCount: 4,
    chhandsCount: 6,
    dohaRange: 'दोहा १ से १२१',
    prasangs: LANKA_KANDA_RICH_PRASANGS
  },

  // ७. उत्तरकाण्ड (UTTARA KANDA)
  {
    id: 'kand-7-uttara',
    kandNumber: 7,
    kandNameHindi: 'उत्तरकाण्ड',
    kandNameEng: 'Uttara Kanda',
    overviewHindi: 'अयोध्या आगमन, भरत मिलाप, भव्य राज्याभिषेक, सम्पूर्ण रामराज्य वर्णन, सनकादि मुनि आगमन, प्रजा को उपदेश, काकभुशुण्डि-गरुड़ संवाद, मानस रोग निरूपण, कलयुग महिमा व ग्रंथावसान।',
    totalPrasangsCount: UTTARA_KANDA_RICH_PRASANGS.length,
    keyTeachings: 'रामराज्य का आदर्श समाज, मानस रोगों का आध्यात्मिक उपचार, कलयुग में नाम संकीर्तन और ग्रंथ फलश्रुति।',
    dohasCount: 130,
    chaupaisCountApprox: 650,
    sorathasCount: 94,
    shlokasCount: 8,
    chhandsCount: 5,
    dohaRange: 'दोहा १ से १३०',
    prasangs: UTTARA_KANDA_RICH_PRASANGS
  }
];

// =========================================================================
// आरती श्री रामायण जी की (AARTI SHRI RAMAYAN JI KI)
// =========================================================================
export const RAMAYAN_AARTI = {
  title: 'आरती श्री रामायण जी की',
  subtitle: 'गोस्वामी तुलसीदास रचित पावन रामायण आरती',
  lines: [
    'आरती श्री रामायण जी की।',
    'कीरति कलित ललित सिय पी की॥',
    'गावत ब्रह्मादिक मुनि नारद।',
    'बालमीक बिग्यान बिसारद॥',
    'सुक सनकादि सेष अरु सारद।',
    'बरनि पवनसुत कीरति नीकी॥ आरती श्री रामायण जी की...',
    'गावत बेद पुरान अष्टदस।',
    'छओ सास्त्र सब ग्रंथन को रस॥',
    'मुनि जन धन संतन को सरबस।',
    'सार अंश संसृति सब ही की॥ आरती श्री रामायण जी की...',
    'गावत संतत संभु भवानी।',
    'अरु घटसंभव मुनि बिग्यानी॥',
    'ब्यास आदि कबिबर्ज बखानी।',
    'कागभुसुंडि गरुड़ के ही की॥ आरती श्री रामायण जी की...',
    'कलिमल हरनि बिषय रस फीकी।',
    'सुभग सिंगार मुक्ति जुबती की॥',
    'दलन रोग भव मूरि अमी की।',
    'तात मात सब बिधि तुलसी की॥ आरती श्री रामायण जी की...'
  ],
  meaningHindi: 'श्री रामायण जी की पावन आरती, जो जानकीवल्लभ श्री राम जी की मंगलमयी कीर्ति है। जिसे ब्रह्मा, नारद, वाल्मीकि, शुकदेव, सनकादि और पवनसुत हनुमान गाते हैं। जो वेदों-पुराणों का रस और भवसागर पार कराने वाली अमृतमयी संजीवनी है।'
};

// =========================================================================
// श्री राम स्तुति (SHRI RAM STUTI)
// =========================================================================
export const RAM_STUTI = {
  title: 'श्री राम स्तुति',
  subtitle: 'श्रीरामचन्द्र कृपालु भजु मन हरण भवभय दारुणम्',
  verses: [
    {
      awadhi: [
        'श्रीरामचन्द्र कृपालु भजु मन हरण भवभय दारुणम्।',
        'नवकंज लोचन, कंज मुख, कर कंज, पद कंजारुणम्॥'
      ],
      meaning: 'हे मन! कृपालु श्रीरामचन्द्रजी का भजन कर, जो संसार के दारुण भय को हरने वाले हैं। जिनके नेत्र नए खिले हुए कमल के समान हैं, मुख, हाथ और चरण भी लाल कमल के समान सुंदर हैं।'
    },
    {
      awadhi: [
        'कंदर्प अगणित अमित छवि, नवनील नीरद सुन्दरम्।',
        'पट पीत मानहु तड़ित रुचि शुचि नौमि जनक सुतावरम्॥'
      ],
      meaning: 'जिनकी छवि अनगिनत कामदेवों से भी बढ़कर है, जिनका स्वरूप नवीन नील मेघ के समान सुंदर है। जिनका पीतांबर बिजली की भांति चमक रहा है, उन जानकीवल्लभ श्री राम को मैं नमन करता हूँ।'
    },
    {
      awadhi: [
        'भजु दीनबंधु दिनेश दानव दैत्य वंश निकन्दनम्।',
        'रघुनन्द आनंदकंद कोशलचन्द दशरथ नन्दनम्॥'
      ],
      meaning: 'जो दीनों के बंधु, सूर्य के समान तेजस्वी, असुरों के वंश का संहार करने वाले, आनंद के मूल, कोशल देश के चंद्र और राजा दशरथ के पुत्र हैं, उनका निरंतर भजन कर।'
    },
    {
      awadhi: [
        'सिर मुकुट कुंडल तिलक चारु उदारु अंग विभूषणम्।',
        'आजानुभुज शर चाप धर, संग्राम जित खर-दूषणम्॥'
      ],
      meaning: 'जिनके मस्तक पर मुकुट, कानों में कुंडल, ललाट पर तिलक और अंगों में अनुपम आभूषण सुशोभित हैं। जिनकी लंबी भुजाएं धनुष-बाण धारण किए हैं और जिन्होंने संग्राम में खर-दूषण को जीता है।'
    },
    {
      awadhi: [
        'इति वदति तुलसीदास शंकर शेष मुनि मन रंजनम्।',
        'मम हृदय कंज निवास कुरु, कामादि खल दल गंजनम्॥'
      ],
      meaning: 'तुलसीदास जी प्रार्थना करते हैं कि हे शिव, शेष और मुनियों के मन को आनंद देने वाले, काम-क्रोध आदि विकारों का नाश करने वाले प्रभु! आप सदा मेरे हृदय-कमल में निवास कीजिए।'
    }
  ]
};

// =========================================================================
// गीताप्रेस प्रामाणिक पाठ विधि एवं संकल्प
// =========================================================================
export const RAMAYAN_PATH_VIDHI = {
  title: 'गीताप्रेस प्रामाणिक पाठ विधि एवं संकल्प',
  achaman: 'ॐ केशवाय नमः, ॐ नारायणाय नमः, ॐ माधवाय नमः। ॐ हृषीकेशाय नमः (हाथ धोएं)।',
  pavitrikaran: 'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा। यः स्मरेत्पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥',
  hanumanVandana: [
    'अतुलितबलधामं हेमशैलाभदेहं',
    'दनुजवनकृशानुं ज्ञानिनामग्रगण्यम्।',
    'सकलगुणनिधानं वानराणामधीशं',
    'रघुपतिप्रियभक्तं वातजातं नमामि॥'
  ],
  hanumanMeaning: 'अतुलनीय बल के धाम, सुवर्ण पर्वत (सुमेरु) के समान कान्तियुक्त शरीर वाले, दैत्य रूपी वन को भस्म करने के लिए अग्निरूप, ज्ञानियों में अग्रगण्य, समस्त गुणों के निधान, वानरों के स्वामी, श्री रघुनाथ जी के परम प्रिय भक्त पवनपुत्र हनुमान जी को मैं प्रणाम करता हूँ।',
  sankalpaHindi: 'हे सर्वेश्वर श्री सीताराम! मैं आपके पावन गुणानुवाद रूपी श्रीरामचरितमानस का श्रद्धा एवं निष्ठा सहित पाठ करने का संकल्प करता हूँ। मेरे समस्त विघ्न बाधाओं का निवारण कर मुझे अपनी अविचल भक्ति प्रदान करें।',
  samarpanShloka: [
    'कायेन वाचा मनसेन्द्रियैर्वा बुद्ध्यात्मना वानुसृतस्वभावात्।',
    'करोमि यद्यत्सकलं परस्मै नारायणायेति समर्पयामि॥'
  ],
  samarpanMeaning: 'शरीर से, वाणी से, मन से, इन्द्रियों से, बुद्धि से अथवा अपने स्वभाव के अनुसार जो कुछ भी मैंने पाठ या जप किया है, वह सब परम पुरुष श्री नारायण को समर्पित करता हूँ।'
};

// =========================================================================
// नवाह्न पारायण विश्राम सारणी (9-DAY PARAYAN SCHEDULE)
// =========================================================================
export const NAVAHNA_PARAYAN_SCHEDULE = [
  { day: 1, title: 'प्रथम विश्राम', kand: 'बालकाण्ड', upTo: 'मंगलाचरण, नाम महिमा एवं शिव-पार्वती विवाह', kandIndex: 0 },
  { day: 2, title: 'द्वितीय विश्राम', kand: 'बालकाण्ड', upTo: 'श्री राम प्राकट्य, बाललीला, धनुष यज्ञ व सीता स्वयंवर', kandIndex: 0 },
  { day: 3, title: 'तृतीय विश्राम', kand: 'अयोध्याकाण्ड', upTo: 'कैकेयी कोपभवन, श्री राम वन गमन एवं केवट संवाद', kandIndex: 1 },
  { day: 4, title: 'चतुर्थ विश्राम', kand: 'अयोध्याकाण्ड', upTo: 'दशरथ देहत्याग, चित्रकूट भरत-मिलाप व पादुका अर्पण', kandIndex: 1 },
  { day: 5, title: 'पंचम विश्राम', kand: 'अरण्यकाण्ड', upTo: 'असुर संहार, सीता हरण, जटायु मोक्ष व शबरी नवधा भक्ति', kandIndex: 2 },
  { day: 6, title: 'षष्ठ विश्राम', kand: 'किष्किन्धाकाण्ड व सुन्दरकाण्ड', upTo: 'सुग्रीव मित्रता, बालि वध एवं समुद्र लांघन, लंका दहन', kandIndex: 4 },
  { day: 7, title: 'सप्तम विश्राम', kand: 'लंकाकाण्ड (पूर्वार्ध)', upTo: 'रामेश्वरम स्थापना, सेतु निर्माण व लक्ष्मण शक्ति बाण', kandIndex: 5 },
  { day: 8, title: 'अष्टम विश्राम', kand: 'लंकाकाण्ड (उत्तरार्ध)', upTo: 'संजीवनी बूटी, कुम्भकर्ण-मेघनाद वध व रावण वध', kandIndex: 5 },
  { day: 9, title: 'नवम विश्राम', kand: 'उत्तरकाण्ड', upTo: 'अयोध्या आगमन, राज्याभिषेक, रामराज्य वर्णन व ग्रंथावसान', kandIndex: 6 }
];

// =========================================================================
// सम्पुट चौपाई विकल्प (POPULAR SAMPUT CHOICES FOR PATH)
// =========================================================================
export const POPULAR_SAMPUTS = [
  {
    id: 'none',
    title: 'सामान्य पाठ (बिना सम्पुट)',
    text: '',
    purpose: 'साधारण सस्वर पाठ'
  },
  {
    id: 'mangal-bhavan',
    title: 'मंगल भवन अमंगल हारी (सर्व कार्य सिद्धि)',
    text: 'मंगल भवन अमंगल हारी। द्रवउ सुदसरथ अजिर बिहारी॥',
    purpose: 'सर्व कल्याण, विघ्न विनाश व सुख-शांति हेतु'
  },
  {
    id: 'kavan-so-kaaj',
    title: 'कवन सो काज कठिन जग माहीं (संकट मोचन)',
    text: 'कवन सो काज कठिन जग माहीं। जो नहिं होइ तात तुम्ह पाहीं॥',
    purpose: 'कठिन कार्य, परीक्षा व बाधाओं में सफलता हेतु'
  },
  {
    id: 'deendayal',
    title: 'दीनदयाल बिरिदु संभारी (संकट हरण)',
    text: 'दीनदयाल बिरिदु संभारी। हरहु नाथ मम संकट भारी॥',
    purpose: 'विपत्ति, रोग व आकस्मिक संकट निवारण हेतु'
  },
  {
    id: 'daikik-daivik',
    title: 'दैहिक दैविक भौतिक तापा (आरोग्य एवं रामराज्य)',
    text: 'दैहिक दैविक भौतिक तापा। राम राज नहिं काहुहि ब्यापा॥',
    purpose: 'पारिवारिक सुख, आरोग्य व मानसिक शांति हेतु'
  }
];
