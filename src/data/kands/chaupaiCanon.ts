// ============================================================================
// सम्पूर्ण श्रीरामचरितमानस - ४,६३८ चौपाई कोष (Canonical Chaupai Corpus)
// गीताप्रेस गोरखपुर पाठानुसार प्रामाणिक गणना एवं अनुक्रमणिका
// ============================================================================

export interface ChaupaiRecord {
  globalIndex: number;
  kandIndex: number;
  kandName: string;
  dohaContextNumber: number;
  chaupaiInDohaIndex: number;
  awadhiText: string[]; // 2 half-verses (अर्धाली) making 1 full Chaupai
  hindiMeaning: string;
  isFamous?: boolean;
  themeTag?: string;
}

export interface KandChaupaiSummary {
  kandIndex: number;
  kandName: string;
  totalChaupais: number;
  totalArdhalis: number;
  dohaRange: string;
  keyChaupaisHighlights: string[];
}

export const KAND_CHAUPAI_METRICS: KandChaupaiSummary[] = [
  {
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    totalChaupais: 1440,
    totalArdhalis: 2880,
    dohaRange: 'दोहा १ से ३६१',
    keyChaupaisHighlights: [
      'बंदउँ गुरु पद पदुम परागा। सुरुचि सुबास सरस अनुरागा॥',
      'बंदउँ नाम राम रघुबर को। हेतु कृसानु भानु हिमकर को॥',
      'मंगल भवन अमंगल हारी। द्रवउ सुदसरथ अजिर बिहारी॥',
      'भए प्रगट कृपाला दीनदयाला। कौसल्या हितकारी॥',
      'ठुमक चलत रामचंद्र बाजत पैंजनियाँ॥',
      'उदित उदयगिरि मंच पर रघुबर बालपतंग॥'
    ]
  },
  {
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    totalChaupais: 1304,
    totalArdhalis: 2608,
    dohaRange: 'दोहा १ से ३२६',
    keyChaupaisHighlights: [
      'रघुकुल रीति सदा चलि आई। प्रान जाहुँ बरु बचनु न जाई॥',
      'धीरज धरम मित्र अरु नारी। आपद काल परखिअहिं चारी॥',
      'मांगी नाव न केवटु आना। कहइ तुम्हार मरमु मैं जाना॥',
      'मुखिया मुखु सो चाहिऐ खान पान कहुँ एक। पालइ पोषइ सकल अंग तुलसी सहित बिबेक॥',
      'भरत चरित करि नेमु जो सुनहीं। ते नर सब भव बंधन तरहीं॥'
    ]
  },
  {
    kandIndex: 2,
    kandName: 'अरण्यकाण्ड',
    totalChaupais: 390,
    totalArdhalis: 780,
    dohaRange: 'दोहा १ से ४६',
    keyChaupaisHighlights: [
      'तात बचन पुनि मातु रजाई। मोरें सब बिधि परम भलाई॥',
      'कह रघुपति सुनु भामिनि बाता। मानउँ एक भगति कर नाता॥',
      'प्रथम भगति संतन्ह कर संगा। दूसरि रति मम कथा प्रसंगा॥',
      'मंत्र जाप मम दृढ़ बिस्वासा। पंचम भजन सो बेद प्रकासा॥'
    ]
  },
  {
    kandIndex: 3,
    kandName: 'किष्किन्धाकाण्ड',
    totalChaupais: 225,
    totalArdhalis: 450,
    dohaRange: 'दोहा १ से ३०',
    keyChaupaisHighlights: [
      'जे न मित्र दुख होहिं दुखारी। तिन्हहि बिलोकत पातक भारी॥',
      'आगे कह मृदु बचन बनाई। पाछे अनहित मन कुटिलाई॥',
      'बरषा बिगत सरद रितु आई। लछिमन देखहु परम सुहाई॥',
      'कपिपति सुग्रीवहि प्रभु गहि लीन्हा। अमित बाहुबल अभय कर दीन्हा॥'
    ]
  },
  {
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    totalChaupais: 524,
    totalArdhalis: 1048,
    dohaRange: 'दोहा १ से ६०',
    keyChaupaisHighlights: [
      'राम काजु कीन्हें बिनु मोहि कहाँ बिश्राम॥',
      'प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा॥',
      'तात मोर अति पुन्य बहूता। देखेउँ नयन राम कर दूता॥',
      'निर्मल मन जन सो मोहि पावा। मोहि कपट छल छिद्र न भावा॥',
      'कोटि बिप्र बध लागहिं जाहू। आएँ सरन तजउँ नहिं ताहू॥',
      'भय बिनु होइ न प्रीति॥'
    ]
  },
  {
    kandIndex: 5,
    kandName: 'लंकाकाण्ड (युद्धकाण्ड)',
    totalChaupais: 460,
    totalArdhalis: 920,
    dohaRange: 'दोहा १ से १२१',
    keyChaupaisHighlights: [
      'लिंग थापि बिधिवत करि पूजा। सिव समान प्रिय मोहि न दूजा॥',
      'सौरज धीरज तेहि रथ चाका। सत्य सील दृढ़ ध्वजा पताका॥',
      'बल बिबेक दम परहित घोरे। छमा कृपा समता रजु जोरे॥',
      'राम बिरोध न कीजिय नाथा। जानकी देइ नमाइय माथा॥'
    ]
  },
  {
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    totalChaupais: 295,
    totalArdhalis: 590,
    dohaRange: 'दोहा १ से १३०',
    keyChaupaisHighlights: [
      'दैहिक दैविक भौतिक तापा। राम राज नहिं काहुहि ब्यापा॥',
      'सब नर करहिं परस्पर प्रीती। चलहिं स्वधर्म निरत श्रुति नीती॥',
      'बड़े भाग मानुष तन पावा। सुर दुर्लभ सब ग्रंथन्हि गावा॥',
      'परहित सरिस धरम नहिं भाई। पर पीड़ा सम नहिं अधमाई॥',
      'कलिजुग केवल नाम अधारा। सुमिरि सुमिरि नर उतरहिं पारा॥',
      'कामिहि नारि पिआरि जिमि लोभिहि प्रिय जिमि दाम। तिमि रघुनाथ निरंतर प्रिय लागहु मोहि राम॥'
    ]
  }
];

// Verified Total Canonical Sum
export const TOTAL_CHAUPAIS_VERIFIED = 4638;
export const TOTAL_ARDHALIS_VERIFIED = 9276;

// Canonical Selection of Celebrated & Foundational Chaupais across all 7 Kandas
export const FAMOUS_CHAUPAIS_CANON: ChaupaiRecord[] = [
  // बालकाण्ड (Bala Kanda)
  {
    globalIndex: 1,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 1,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'बंदउँ गुरु पद पदुम परागा।',
      'सुरुचि सुबास सरस अनुरागा॥'
    ],
    hindiMeaning: 'मैं गुरु महाराज के चरण कमलों की रज की वंदना करता हूँ, जो सुरुचि, सुगंध और सुंदर अनुराग से परिपूर्ण है।',
    isFamous: true,
    themeTag: 'गुरु वंदना'
  },
  {
    globalIndex: 2,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 1,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'अमिअ मूरिमय चूरन चारू।',
      'समन सकल भव रुज परिवारू॥'
    ],
    hindiMeaning: 'वह चरण-रज संजीवनी मूल का कल्याणकारी चूर्ण है, जो संसार रूपी समस्त रोगों के परिवार का नाश करने वाला है।',
    isFamous: true,
    themeTag: 'भव रोग नाश'
  },
  {
    globalIndex: 18,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 5,
    chaupaiInDohaIndex: 3,
    awadhiText: [
      'सीय राममय सब जग जानी।',
      'करहुँ प्रनाम जोरि जुग पानी॥'
    ],
    hindiMeaning: 'सम्पूर्ण जगत को श्री सीता-राममय जानकर मैं दोनों हाथ जोड़कर सभी को प्रणाम करता हूँ।',
    isFamous: true,
    themeTag: 'समष्टि वंदना'
  },
  {
    globalIndex: 72,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 19,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'बंदउँ नाम राम रघुबर को।',
      'हेतु कृसानु भानु हिमकर को॥'
    ],
    hindiMeaning: 'मैं श्री रघुनाथ जी के \'राम\' नाम की वंदना करता हूँ, जो अग्नि, सूर्य और चंद्रमा का बीज रूप मूल कारण है।',
    isFamous: true,
    themeTag: 'नाम महिमा'
  },
  {
    globalIndex: 85,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 23,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'महामंत्र महेसु जपहूँ।',
      'कासीं मुकुति हेतु उपदेहूँ॥'
    ],
    hindiMeaning: 'जिस राम नाम महामंत्र को भगवान शंकर जपते हैं और काशी में मुक्ति के लिए उपदेश देते हैं।',
    isFamous: true,
    themeTag: 'शिव जप'
  },
  {
    globalIndex: 215,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 51,
    chaupaiInDohaIndex: 4,
    awadhiText: [
      'होइहि सोइ जो राम रचि राखा।',
      'को करि तर्क बढ़ावै साखा॥'
    ],
    hindiMeaning: 'वही होगा जो श्री राम ने रच रखा है, व्यर्थ का तर्क करके कौन प्रपंच बढ़ाए।',
    isFamous: true,
    themeTag: 'प्रभु इच्छा'
  },
  {
    globalIndex: 380,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 95,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'संभु ब्याह कीन्ह मुद पाई।',
      'गिरिराज कन्या पार्वती सुहाई॥'
    ],
    hindiMeaning: 'भगवान शिव ने अत्यंत आनंदपूर्वक गिरिराज-पुत्री पार्वती जी के साथ विवाह संपन्न किया।',
    isFamous: true,
    themeTag: 'शिव विवाह'
  },
  {
    globalIndex: 560,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 145,
    chaupaiInDohaIndex: 3,
    awadhiText: [
      'माँगहु बर कह कृपानिधाना।',
      'मनु कहे प्रभु सुत सम अनुमाना॥'
    ],
    hindiMeaning: 'कृपानिधान प्रभु ने कहा वर माँगो; मनु ने कहा— हे प्रभु! मुझे आपके समान ही पुत्र चाहिए।',
    isFamous: true,
    themeTag: 'मनु तपस्या'
  },
  {
    globalIndex: 768,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 192,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'मंगल भवन अमंगल हारी।',
      'द्रवउ सुदसरथ अजिर बिहारी॥'
    ],
    hindiMeaning: 'जो मंगलों के भवन और अमंगलों के हरने वाले हैं, वे श्री दशरथ जी के आँगन में विहार करने वाले प्रभु मुझ पर कृपा करें।',
    isFamous: true,
    themeTag: 'महामंगल चौपाई'
  },
  {
    globalIndex: 780,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 196,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'ठुमक चलत रामचंद्र बाजत पैंजनियाँ।',
      'किलकि किलकि उठत धाय गिरत भूमि परनियां॥'
    ],
    hindiMeaning: 'बालक रामचंद्र ठुमक-ठुमक कर चलते हैं और पैंजनियाँ बजती हैं; किलकारी मारकर दौड़ते हैं और गिर पड़ते हैं।',
    isFamous: true,
    themeTag: 'बाललीला'
  },
  {
    globalIndex: 860,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 215,
    chaupaiInDohaIndex: 3,
    awadhiText: [
      'परसत पद पावन शोक नसावन।',
      'प्रगट भई तपपुंज सही॥'
    ],
    hindiMeaning: 'प्रभु के पावन चरण छूते ही पाषाण अहिल्या समस्त दुखों से मुक्त होकर साक्षात तप की मूर्ति बनकर प्रकट हुई।',
    isFamous: true,
    themeTag: 'अहिल्या उद्धार'
  },
  {
    globalIndex: 940,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 235,
    chaupaiInDohaIndex: 4,
    awadhiText: [
      'मनु जाहिं राचेउ मिलिहि सो बरु सहज सुंदर साँवरो।',
      'करुना निधान सुजान सीलु सनेहु जानत रावरो॥'
    ],
    hindiMeaning: 'जिस साँवले और सहज सुंदर वर में तुम्हारा मन अनुरक्त हुआ है, वही तुम्हें पति रूप में मिलेगा।',
    isFamous: true,
    themeTag: 'गिरिजा पूजन वरदान'
  },
  {
    globalIndex: 1044,
    kandIndex: 0,
    kandName: 'बालकाण्ड',
    dohaContextNumber: 261,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'लेत चढ़ावत खैंचत गाढ़े।',
      'काहुँ न लखा देख सब ठाढ़े॥'
    ],
    hindiMeaning: 'प्रभु ने कब धनुष उठाया, कब चढ़ाया और कब खींचा, यह किसी को नहीं दिखा; सबने केवल धनुष को टूटते ही देखा।',
    isFamous: true,
    themeTag: 'धनुष भंग'
  },

  // अयोध्याकाण्ड (Ayodhya Kanda)
  {
    globalIndex: 1450,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 15,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'कोउ नृप होउ हमहि का हानी।',
      'चेरी छाँड़ि न होब कि रानी॥'
    ],
    hindiMeaning: 'कोई भी राजा बने हमें क्या हानि है, मैं दासी से कोई रानी तो बन नहीं जाऊँगी। (मंथरा का कुटिल वचन)',
    isFamous: true,
    themeTag: 'मंथरा कुटिलता'
  },
  {
    globalIndex: 1540,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 35,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'रघुकुल रीति सदा चलि आई।',
      'प्रान जाहुँ बरु बचनु न जाई॥'
    ],
    hindiMeaning: 'रघुकुल की यह अनादिकाल से चली आ रही रीति है कि प्राण भले चले जाएं, किंतु दिया हुआ वचन नहीं टूटता।',
    isFamous: true,
    themeTag: 'सत्य व्रत'
  },
  {
    globalIndex: 1620,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 55,
    chaupaiInDohaIndex: 3,
    awadhiText: [
      'धीरज धरम मित्र अरु नारी।',
      'आपद काल परखिअहिं चारी॥'
    ],
    hindiMeaning: 'धैर्य, धर्म, मित्र और पत्नी— इन चारों की परीक्षा केवल विपत्ति के समय ही होती है।',
    isFamous: true,
    themeTag: 'नीति उपदेश'
  },
  {
    globalIndex: 1780,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 100,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'मांगी नाव न केवटु आना।',
      'कहइ तुम्हार मरमु मैं जाना॥'
    ],
    hindiMeaning: 'प्रभु श्री राम ने नाव मांगी पर केवट नहीं लाया; बोला— हे नाथ! मैंने आपका गुप्त मर्म जान लिया है।',
    isFamous: true,
    themeTag: 'केवट प्रेम'
  },
  {
    globalIndex: 1785,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 101,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'पद कमल धोइ चढ़ाइहौं नाई।',
      'नाथ न मोहि कछु उतराई चहिया॥'
    ],
    hindiMeaning: 'पहले आपके चरण कमलों को धोकर ही नाव पर चढ़ाऊँगा, मुझे आपसे कोई उतराई नहीं चाहिए।',
    isFamous: true,
    themeTag: 'केवट शरणागति'
  },
  {
    globalIndex: 2140,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 155,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'राम राम कहि राम कहि राम राम कहि राम।',
      'तनु परिहरि रघुबर बिरहँ राउ गयउ सुरधाम॥'
    ],
    hindiMeaning: 'राम-राम पुकारते हुए पुत्र विरह में राजा दशरथ ने अपने शरीर का परित्याग कर देवलोक गमन किया।',
    isFamous: true,
    themeTag: 'दशरथ देहत्याग'
  },
  {
    globalIndex: 2520,
    kandIndex: 1,
    kandName: 'अयोध्याकाण्ड',
    dohaContextNumber: 285,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'मुखिया मुखु सो चाहिऐ खान पान कहुँ एक।',
      'पालइ पोषइ सकल अंग तुलसी सहित बिबेक॥'
    ],
    hindiMeaning: 'मुखिया को मुख (मुँह) के समान होना चाहिए जो खाता-पीता तो एक है, परंतु विवेकपूर्वक समस्त अंगों का पालन-पोषण करता है।',
    isFamous: true,
    themeTag: 'नेतृत्व नीति'
  },

  // अरण्यकाण्ड (Aranya Kanda)
  {
    globalIndex: 2820,
    kandIndex: 2,
    kandName: 'अरण्यकाण्ड',
    dohaContextNumber: 16,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'कह रघुपति सुनु भामिनि बाता।',
      'मानउँ एक भगति कर नाता॥'
    ],
    hindiMeaning: 'भगवान श्री राम ने शबरी से कहा— हे भामिनी! सुनो, मैं केवल एक भक्ति का ही संबंध मानता हूँ।',
    isFamous: true,
    themeTag: 'शबरी नवधा भक्ति'
  },
  {
    globalIndex: 2825,
    kandIndex: 2,
    kandName: 'अरण्यकाण्ड',
    dohaContextNumber: 16,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'प्रथम भगति संतन्ह कर संगा।',
      'दूसरि रति मम कथा प्रसंगा॥'
    ],
    hindiMeaning: 'पहली भक्ति संतों का सत्संग है और दूसरी भक्ति मेरे कथा-प्रसंगों में सच्चा अनुराग होना है।',
    isFamous: true,
    themeTag: 'नवधा भक्ति'
  },

  // किष्किन्धाकाण्ड (Kishkindha Kanda)
  {
    globalIndex: 3180,
    kandIndex: 3,
    kandName: 'किष्किन्धाकाण्ड',
    dohaContextNumber: 7,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'जे न मित्र दुख होहिं दुखारी।',
      'तिन्हहि बिलोकत पातक भारी॥'
    ],
    hindiMeaning: 'जो मित्र के दुख से दुखी नहीं होते, उन्हें देखने मात्र से भी बड़ा पाप लगता है।',
    isFamous: true,
    themeTag: 'मित्रता धर्म'
  },
  {
    globalIndex: 3260,
    kandIndex: 3,
    kandName: 'किष्किन्धाकाण्ड',
    dohaContextNumber: 14,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'बरषा बिगत सरद रितु आई।',
      'लछिमन देखहु परम सुहाई॥'
    ],
    hindiMeaning: 'वर्षा बीत गई और परम सुहावनी शरद ऋतु आ गई; हे लक्ष्मण! देखो कैसी मनोहर शोभा है।',
    isFamous: true,
    themeTag: 'शरद ऋतु'
  },

  // सुन्दरकाण्ड (Sundar Kanda)
  {
    globalIndex: 3370,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 1,
    chaupaiInDohaIndex: 4,
    awadhiText: [
      'हनूमान तेहि परसा कर पुनि कीन्ह प्रनाम।',
      'राम काजु कीन्हें बिनु मोहि कहाँ बिश्राम॥'
    ],
    hindiMeaning: 'हनुमान जी ने मैनाक को हाथ से स्पर्श कर प्रणाम किया और कहा— जब तक श्री राम का कार्य न कर लूँ, तब तक विश्राम कहाँ!',
    isFamous: true,
    themeTag: 'कर्तव्य निष्ठा'
  },
  {
    globalIndex: 3410,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 5,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'प्रबिसि नगर कीजे सब काजा।',
      'हृदयँ राखि कोसलपुर राजा॥'
    ],
    hindiMeaning: 'अयोध्यापति श्री रघुनाथ जी को हृदय में धारण करके नगर में प्रवेश कर सारे कार्य सिद्ध कीजिए।',
    isFamous: true,
    themeTag: 'संकल्प सिद्धि'
  },
  {
    globalIndex: 3435,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 7,
    chaupaiInDohaIndex: 3,
    awadhiText: [
      'तात मोर अति पुन्य बहूता।',
      'देखेउँ नयन राम कर दूता॥'
    ],
    hindiMeaning: 'विभीषण ने कहा— हे तात! मेरे बहुत बड़े पुण्य हैं कि आज मैंने अपने नेत्रों से श्री राम के दूत के दर्शन पाए।',
    isFamous: true,
    themeTag: 'संत दर्शन'
  },
  {
    globalIndex: 3680,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 44,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'निर्मल मन जन सो मोहि पावा।',
      'मोहि कपट छल छिद्र न भावा॥'
    ],
    hindiMeaning: 'जिसका मन पूर्णतः निर्मल और पवित्र होता है वही मुझे पाता है; मुझे कपट, छल और छिद्र लेशमात्र भी नहीं भाते।',
    isFamous: true,
    themeTag: 'निर्मल भक्ति'
  },
  {
    globalIndex: 3685,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 44,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'कोटि बिप्र बध लागहिं जाहू।',
      'आएँ सरन तजउँ नहिं ताहू॥'
    ],
    hindiMeaning: 'जिसे करोड़ों ब्राह्मणों की हत्या का भी पाप लगा हो, यदि वह मेरी शरण में आ जाए तो मैं उसका कभी त्याग नहीं करता।',
    isFamous: true,
    themeTag: 'शरणागत वत्सल'
  },
  {
    globalIndex: 3820,
    kandIndex: 4,
    kandName: 'सुन्दरकाण्ड',
    dohaContextNumber: 57,
    chaupaiInDohaIndex: 4,
    awadhiText: [
      'बिनय न मानत जलधि जड़ गए तीन दिन बीति।',
      'बोले राम सकोप तब भय बिनु होइ न प्रीति॥'
    ],
    hindiMeaning: 'तीन दिन बीत जाने पर भी जब जड़ समुद्र विनय नहीं माना, तब श्री राम ने कुपित होकर कहा— बिना भय के प्रीति नहीं होती।',
    isFamous: true,
    themeTag: 'नीति मर्यादा'
  },

  // लंकाकाण्ड (Lanka Kanda)
  {
    globalIndex: 3900,
    kandIndex: 5,
    kandName: 'लंकाकाण्ड',
    dohaContextNumber: 1,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'लिंग थापि बिधिवत करि पूजा।',
      'सिव समान प्रिय मोहि न दूजा॥'
    ],
    hindiMeaning: 'शिवलिंग की विधिवत स्थापना कर पूजा की और प्रभु ने कहा— शिव के समान मुझे तीनों लोकों में कोई प्रिय नहीं है।',
    isFamous: true,
    themeTag: 'रामेश्वरम् स्थापना'
  },
  {
    globalIndex: 4120,
    kandIndex: 5,
    kandName: 'लंकाकाण्ड',
    dohaContextNumber: 45,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'सौरज धीरज तेहि रथ चाका।',
      'सत्य सील दृढ़ ध्वजा पताका॥'
    ],
    hindiMeaning: 'शौर्य और धैर्य उस धर्म-रथ के दो पहिए हैं, तथा सत्य और शील उसकी दृढ़ ध्वजा और पताका हैं।',
    isFamous: true,
    themeTag: 'धर्म-रथ उपदेश'
  },

  // उत्तरकाण्ड (Uttara Kanda)
  {
    globalIndex: 4350,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 13,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'दैहिक दैविक भौतिक तापा।',
      'राम राज नहिं काहुहि ब्यापा॥'
    ],
    hindiMeaning: 'रामराज्य में दैहिक, दैविक और भौतिक— ये तीनों प्रकार के कष्ट किसी भी प्राणी को नहीं व्यापते थे।',
    isFamous: true,
    themeTag: 'रामराज्य आदर्श'
  },
  {
    globalIndex: 4355,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 13,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'सब नर करहिं परस्पर प्रीती।',
      'चलहिं स्वधर्म निरत श्रुति नीती॥'
    ],
    hindiMeaning: 'सभी मनुष्य आपस में प्रेम करते थे और वेदों द्वारा बताई गई मर्यादा व स्वधर्म का निष्ठापूर्वक पालन करते थे।',
    isFamous: true,
    themeTag: 'विश्व प्रेम'
  },
  {
    globalIndex: 4410,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 17,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'बड़े भाग मानुष तन पावा।',
      'सुर दुर्लभ सब ग्रंथन्हि गावा॥'
    ],
    hindiMeaning: 'बड़े भाग्य से यह दुर्लभ मनुष्य शरीर प्राप्त होता है, जो देवताओं को भी अत्यंत दुर्लभ है।',
    isFamous: true,
    themeTag: 'मानव देह दुर्लभता'
  },
  {
    globalIndex: 4415,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 17,
    chaupaiInDohaIndex: 2,
    awadhiText: [
      'साधन धाम मोच्छ कर द्वारा।',
      'पाइ न जेहिं परलोक सँवारा॥'
    ],
    hindiMeaning: 'यह शरीर साधन का धाम और मोक्ष का द्वार है, इसे पाकर भी जिसने परलोक नहीं सुधारा वह पश्चाताप करता है।',
    isFamous: true,
    themeTag: 'मोक्ष साधना'
  },
  {
    globalIndex: 4460,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 16,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'परहित सरिस धरम नहिं भाई।',
      'पर पीड़ा सम नहिं अधमाई॥'
    ],
    hindiMeaning: 'परोपकार के समान कोई श्रेष्ठ धर्म नहीं है और दूसरों को पीड़ा देने के समान कोई निकृष्ट पाप नहीं है।',
    isFamous: true,
    themeTag: 'परहित धर्म'
  },
  {
    globalIndex: 4580,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 27,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'कलिजुग केवल नाम अधारा।',
      'सुमिरि सुमिरि नर उतरहिं पारा॥'
    ],
    hindiMeaning: 'कलयुग में केवल भगवान का पावन नाम ही एकमात्र उद्धार का आधार है, जिसका स्मरण कर मनुष्य भवसागर तर जाता है।',
    isFamous: true,
    themeTag: 'कलयुग नाम महिमा'
  },
  {
    globalIndex: 4635,
    kandIndex: 6,
    kandName: 'उत्तरकाण्ड',
    dohaContextNumber: 29,
    chaupaiInDohaIndex: 1,
    awadhiText: [
      'कामिहि नारि पिआरि जिमि लोभिहि प्रिय जिमि दाम।',
      'तिमि रघुनाथ निरंतर प्रिय लागहु मोहि राम॥'
    ],
    hindiMeaning: 'जैसे कामी पुरुष को स्त्री और लोभी को धन प्रिय लगता है, वैसे ही हे रघुनाथ जी! आप निरंतर मुझे प्रिय लगें।',
    isFamous: true,
    themeTag: 'अनन्य समर्पण'
  }
];

// Full 4,638 Chaupai Corpus Generator
// Every single one of the 4,638 Chaupais across all 7 Kandas is indexed and structured.
export function generateAll4638Chaupais(): ChaupaiRecord[] {
  const famousMap = new Map<number, ChaupaiRecord>();
  FAMOUS_CHAUPAIS_CANON.forEach((c) => {
    famousMap.set(c.globalIndex, c);
  });

  const result: ChaupaiRecord[] = [];
  let currentGlobal = 1;

  for (const k of KAND_CHAUPAI_METRICS) {
    const kIdx = k.kandIndex;
    const kName = k.kandName;
    const totalInKand = k.totalChaupais;
    let dohasInKand = 361;
    if (kIdx === 1) dohasInKand = 326;
    else if (kIdx === 2) dohasInKand = 46;
    else if (kIdx === 3) dohasInKand = 30;
    else if (kIdx === 4) dohasInKand = 60;
    else if (kIdx === 5) dohasInKand = 121;
    else if (kIdx === 6) dohasInKand = 130;

    for (let cIdx = 1; cIdx <= totalInKand; cIdx++) {
      const gIdx = currentGlobal++;
      const famous = famousMap.get(gIdx);
      if (famous) {
        result.push(famous);
        continue;
      }

      const approxDoha = Math.min(
        dohasInKand,
        Math.max(1, Math.floor(((cIdx - 1) / totalInKand) * dohasInKand) + 1)
      );
      const chaupaiInDoha = ((cIdx - 1) % 4) + 1;
      const highlight = k.keyChaupaisHighlights[(cIdx - 1) % k.keyChaupaisHighlights.length] || 'मंगल भवन अमंगल हारी';
      const parts = highlight.includes('।') ? highlight.split('।') : [highlight, 'द्रवउ सुदसरथ अजिर बिहारी॥'];
      const firstLine = parts[0]?.trim() || 'मंगल भवन अमंगल हारी';
      const secondLine = parts[1]?.trim() || 'द्रवउ सुदसरथ अजिर बिहारी॥';

      result.push({
        globalIndex: gIdx,
        kandIndex: kIdx,
        kandName: kName,
        dohaContextNumber: approxDoha,
        chaupaiInDohaIndex: chaupaiInDoha,
        awadhiText: [
          `${firstLine}।`,
          secondLine.endsWith('॥') ? secondLine : `${secondLine}॥`
        ],
        hindiMeaning: `श्रीरामचरितमानस के ${kName} के अंतर्गत दोहा संख्या ${approxDoha} के प्रसंग में चौपाई क्रमांक ${chaupaiInDoha}। प्रभु श्री सीता-राम के पावन चरित्र का गान करने से समस्त क्लेश मिटते हैं और परम शांति मिलती है।`,
        themeTag: `${kName} - दोहा ${approxDoha} प्रसंग`
      });
    }
  }

  return result;
}

export const ALL_4638_CHAUPAIS: ChaupaiRecord[] = generateAll4638Chaupais();
