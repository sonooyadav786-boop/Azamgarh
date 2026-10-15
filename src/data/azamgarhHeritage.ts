export interface AzamgarhTirtha {
  id: string;
  nameHindi: string;
  locationHindi: string;
  significanceHindi: string;
  descriptionHindi: string;
  associatedDeity: string;
}

export const AZAMGARH_TIRTHAS: AzamgarhTirtha[] = [
  {
    id: 'durvasa-ashram',
    nameHindi: 'महर्षि दुर्वासा ऋषि आश्रम',
    locationHindi: 'फूलपुर तहसील, आजमगढ़ (तमसा व मंजूषा संगम)',
    significanceHindi: 'भगवान शिव के रुद्रांश महर्षि दुर्वासा की तपोभूमि। कार्तिक पूर्णिमा पर यहाँ पूर्वांचल का विशाल ऐतिहासिक मेला लगता है।',
    descriptionHindi: 'पौराणिक मान्यता के अनुसार माता अनसूया के तीनों पुत्रों (दुर्वासा, दत्तात्रेय, चन्द्रमा) ने इसी पावन धरा पर तप किया था। लाखों श्रद्धालु तमसा नदी में स्नान कर आशीर्वाद लेते हैं।',
    associatedDeity: 'महर्षि दुर्वासा / भगवान शिव'
  },
  {
    id: 'dattatreya-ashram',
    nameHindi: 'भगवान दत्तात्रेय आश्रम',
    locationHindi: 'निजामाबाद, आजमगढ़ (तमसा व कुंवर नदी संगम)',
    significanceHindi: 'त्रिदेव स्वरूप भगवान दत्तात्रेय की पावन तपोस्थली। शिवरात्रि एवं गुरु पूर्णिमा पर विशेष उत्सव।',
    descriptionHindi: 'यहाँ तमसा नदी के तट पर शांति और आध्यात्मिक स्पंदन का अनुभव होता है। प्राचीन वटवृक्ष और समाधि स्थल आज भी विद्यमान हैं।',
    associatedDeity: 'भगवान दत्तात्रेय (ब्रह्मा, विष्णु, महेश अवतार)'
  },
  {
    id: 'chandrama-ashram',
    nameHindi: 'चन्द्रमा ऋषि आश्रम',
    locationHindi: 'मेहनगर / सठियांव क्षेत्र, आजमगढ़',
    significanceHindi: 'महर्षि चन्द्रमा की तपोस्थली। मानसिक शांति एवं चन्द्र दोष शांति हेतु विख्यात स्थल।',
    descriptionHindi: 'प्राचीन काल से ऋषि-मुनियों की इस त्रिवेणी संगम धरा पर आजमगढ़ का पंचांग अत्यंत सटीक और प्रतिष्ठित माना जाता है।',
    associatedDeity: 'ऋषि चन्द्रमा'
  },
  {
    id: 'bhawarnath-temple',
    nameHindi: 'श्री भंवरनाथ महादेव मंदिर',
    locationHindi: 'आजमगढ़ नगर प्रवेश द्वार',
    significanceHindi: 'आजमगढ़ के नगर रक्षक भगवान शिव का अति प्राचीन व सिद्ध ज्योतिर्मय शिवालय।',
    descriptionHindi: 'सावन मास के प्रत्येक सोमवार एवं महाशिवरात्रि पर पूरे जनपद से लाखों शिवभक्त यहाँ जलाभिषेक और कांवड़ अर्पण करते हैं।',
    associatedDeity: 'भगवान भंवरनाथ (शिवजी)'
  },
  {
    id: 'palhana-devi',
    nameHindi: 'मां पल्हना देवी सिद्धपीठ',
    locationHindi: 'पल्हना, लालगंज तहसील, आजमगढ़',
    significanceHindi: 'पूर्वांचल की प्रसिद्ध कुलदेवी व शक्तिपीठ, जहाँ मां भवानी भक्तों की समस्त मनोकामनाएं पूर्ण करती हैं।',
    descriptionHindi: 'शारदीय एवं चैत्र नवरात्रि में यहाँ 9 दिनों का अखंड मेला लगता है। मां का दिव्य विग्रह अत्यंत तेजस्वी है।',
    associatedDeity: 'मां भगवती पल्हना देवी'
  },
  {
    id: 'tamasa-nadi',
    nameHindi: 'पवित्र तमसा नदी (टोंस नदी)',
    locationHindi: 'आजमगढ़ जनपद के मध्य प्रवाहित',
    significanceHindi: 'श्रीरामचरितमानस के अनुसार प्रभु श्री राम ने 14 वर्ष के वनवास की पहली रात्रि तमसा के पावन तट पर ही विश्राम किया था।',
    descriptionHindi: 'वाल्मीकि रामायण और तुलसी रामायण दोनों में वर्णित यह नदी आजमगढ़ की जीवनरेखा एवं सनातन आस्था का पावन केंद्र है।',
    associatedDeity: 'मर्यादा पुरुषोत्तम भगवान श्री राम'
  }
];

export const AZAMGARH_COORDINATES = {
  city: 'आजमगढ़ (Azamgarh)',
  state: 'उत्तर प्रदेश (Uttar Pradesh)',
  pincode: '276001',
  latitude: '26.0683° N',
  longitude: '83.1834° E',
  elevation: '80 m',
  timezone: 'IST (UTC+05:30)',
  standardPanchangName: 'आजमगढ़ पंचांग (विश्वविद्यालय व ऋषिकुल परंपरा)',
};
