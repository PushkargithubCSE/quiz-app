export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  block: string;
  gp: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
  timeTaken: number;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "कौन-सा मंच गाँव के सभी मतदाताओं का प्रतिनिधित्व करता है और स्थानीय विकास से जुड़े महत्वपूर्ण निर्णयों को अनुमोदित करता है?\nWhich platform represents all the voters of the village and approves important decisions related to local development?",
    options: [
      "ग्राम पंचायत कार्यकारी समिति बैठक / Gram Panchayat Executive Committee Meeting",
      "ग्राम सभा बैठक / Gram Sabha Meeting",
      "वार्ड बैठक / Ward Meeting",
      "ग्राम विकास समिति बैठक / Village Development Committee Meeting",
    ],
    correctAnswer: 1,
    category: "Panchayati Raj",
  },
  {
    id: 2,
    question: "ग्राम सभा में लोगों की भागीदारी क्यों महत्वपूर्ण है?\nWhy is people's participation in the Gram Sabha important?",
    options: [
      "केवल बैठक की औपचारिकता पूरी करने के लिए / Only to complete the formality of meetings",
      "निर्णय प्रक्रिया को मजबूत और लोकतांत्रिक बनाने के लिए / To strengthen democratic decision-making",
      "सरकारी अधिकारियों की उपस्थिति दिखाने के लिए / To show the presence of officials",
      "केवल योजनाओं की घोषणा के लिए / Only to announce schemes",
    ],
    correctAnswer: 2,
    category: "Panchayati Raj",
  },
  {
    id: 3,
    question: "कौन-सा मंच महिलाओं को ग्राम सभा में मुद्दे ले जाने से पहले अपनी समस्याओं और प्राथमिकताओं पर चर्चा करने का अवसर देता है?\nWhich platform allows women to discuss their issues and priorities before presenting them in the Gram Sabha?",
    options: [
      "वार्ड सभा / Ward Sabha",
      "महिला सभा / Mahila Sabha",
      "पंचायत योजना समिति / Panchayat Planning Committee",
      "ग्राम निगरानी समिति / Village Monitoring Committee",
    ],
    correctAnswer: 2,
    category: "Women Leadership",
  },
  {
    id: 4,
    question: "ग्राम पंचायत विकास योजना (GPDP) को सबसे सही तरीके से कैसे समझा जा सकता है?\nHow can the Gram Panchayat Development Plan (GPDP) best be described?",
    options: [
      "राज्य सरकार की योजनाओं की सूची / List of schemes from the State Government",
      "समुदाय की प्राथमिकताओं के आधार पर पंचायत द्वारा बनाई गई सहभागी योजना / Participatory plan based on community priorities",
      "केवल अधिकारियों द्वारा तैयार बजट / Budget prepared only by officials",
      "जिला स्तर की योजना / District level plan",
    ],
    correctAnswer: 2,
    category: "Panchayati Raj",
  },
  {
    id: 5,
    question: "पंचायती राज संस्थाओं में महिलाओं को आरक्षण देने का मुख्य उद्देश्य क्या है?\nWhat is the main objective of reservation for women in Panchayati Raj Institutions?",
    options: [
      "चुनाव में संख्या बढ़ाना / Increasing numbers in elections",
      "महिलाओं के मुद्दों और आवश्यकताओं को सामने लाना / Bringing women's issues and needs forward",
      "पंचायत का खर्च कम करना / Reducing Panchayat expenses",
      "बैठकों की संख्या बढ़ाना / Increasing meetings",
    ],
    correctAnswer: 2,
    category: "Women Leadership",
  },
  {
    id: 6,
    question: "किस संविधान संशोधन ने पंचायती राज संस्थाओं में महिलाओं के लिए आरक्षण सुनिश्चित किया?\nWhich Constitutional Amendment ensured reservation for women in Panchayati Raj Institutions?",
    options: [
      "42वाँ संशोधन / 42nd Amendment",
      "52वाँ संशोधन / 52nd Amendment",
      "73वाँ संशोधन / 73rd Amendment",
      "86वाँ संशोधन / 86th Amendment",
    ],
    correctAnswer: 3,
    category: "Constitution",
  },
  {
    id: 7,
    question: "73वाँ संविधान संशोधन अधिनियम कब लागू हुआ?\nWhen did the 73rd Constitutional Amendment Act come into force?",
    options: [
      "15 अगस्त 1947 / 15 August 1947",
      "26 जनवरी 1950 / 26 January 1950",
      "24 अप्रैल 1993 / 24 April 1993",
      "2 अक्टूबर 2000 / 2 October 2000",
    ],
    correctAnswer: 3,
    category: "Constitution",
  },
  {
    id: 8,
    question: "संविधान के अनुसार पंचायती राज संस्थाओं में महिलाओं के लिए न्यूनतम आरक्षण कितना है?\nWhat is the minimum reservation for women in Panchayati Raj Institutions as per the Constitution?",
    options: ["10%", "25%", "33%", "60%"],
    correctAnswer: 3,
    category: "Constitution",
  },
  {
    id: 9,
    question: "एक सशक्त महिला नेता की महत्वपूर्ण भूमिका क्या होती है?\nWhat is an important role of an empowered woman leader?",
    options: [
      "केवल बैठकों में उपस्थित रहना / Only attending meetings",
      "पंचायत निर्णयों में सक्रिय भागीदारी और समुदाय के मुद्दे उठाना / Actively participating in decisions and raising community issues",
      "केवल आदेशों का पालन करना / Only following orders",
      "पंचायत भवन का प्रबंधन करना / Managing the Panchayat building",
    ],
    correctAnswer: 2,
    category: "Women Leadership",
  },
  {
    id: 10,
    question: "लैंगिक समानता को बढ़ावा देने के लिए निर्वाचित महिला प्रतिनिधि क्या कर सकती हैं?\nWhat can elected women representatives do to promote gender equality?",
    options: [
      "महिलाओं को बैठकों में बोलने के लिए प्रोत्साहित करना / Encourage women to speak in meetings",
      "महिलाओं के मुद्दों को ग्राम सभा में उठाना / Raise women's issues",
      "महिलाओं की भागीदारी बढ़ाना / Increase participation",
      "उपरोक्त सभी / All of the above",
    ],
    correctAnswer: 4,
    category: "Women Leadership",
  },
  {
    id: 11,
    question: "पंचायती राज में \"कोष, कार्य और कार्यकर्ता\" का क्या अर्थ है?\nWhat does \"Funds, Functions and Functionaries\" mean in Panchayati Raj?",
    options: [
      "केवल बजट / Only budget",
      "संसाधन, जिम्मेदारियाँ और कार्य करने वाले लोग / Resources, responsibilities and staff",
      "केवल सरकारी कर्मचारी / Only government employees",
      "केवल योजनाएँ / Only schemes",
    ],
    correctAnswer: 2,
    category: "Panchayati Raj",
  },
  {
    id: 12,
    question: "महिला-अनुकूल ग्राम पंचायत का सबसे अच्छा संकेत क्या है?\nWhat is the best indicator of a women-friendly Gram Panchayat?",
    options: [
      "अधिक निर्माण कार्य / More construction works",
      "महिलाओं के अधिकार सुनिश्चित करना और लैंगिक समानता बढ़ाना / Ensuring women's rights and promoting gender equality",
      "अधिक राजस्व संग्रह / Higher revenue collection",
      "अधिक राजनीतिक बैठकें / More political meetings",
    ],
    correctAnswer: 2,
    category: "Women Leadership",
  },
  {
    id: 13,
    question: "यदि सुरक्षा कारणों से लड़कियाँ स्कूल छोड़ रही हों, तो पंचायत का सबसे उपयुक्त कदम क्या होगा?\nIf girls are dropping out of school due to safety concerns, what should the Panchayat do?",
    options: [
      "जागरूकता बैठकें करना / Conduct awareness meetings",
      "प्रकाश व्यवस्था, सामुदायिक निगरानी और सुरक्षित परिवहन की व्यवस्था करना / Improve lighting, community monitoring and safe transport",
      "घर पर पढ़ाई को बढ़ावा देना / Encourage home learning",
      "स्कूल दूरी कम करना / Reduce school distance",
    ],
    correctAnswer: 2,
    category: "Panchayati Raj",
  },
  {
    id: 14,
    question: "पंचायत स्तर पर महिलाओं के सशक्तिकरण के लिए सबसे प्रभावी कदम क्या है?\nWhich step is most effective for women's empowerment at the Panchayat level?",
    options: [
      "महिलाओं की पंचायत बैठकों में भागीदारी बढ़ाना / Increase participation in meetings",
      "महिलाओं के मुद्दों को योजना में शामिल करना / Include women's issues in plans",
      "महिलाओं के लिए सुरक्षित और समान अवसर सुनिश्चित करना / Ensure safe and equal opportunities",
      "उपरोक्त सभी / All of the above",
    ],
    correctAnswer: 4,
    category: "Women Leadership",
  },
  {
    id: 15,
    question: "एक पंचायत यह आकलन करना चाहती है कि वह महिला-अनुकूल बन रही है या नहीं। सबसे व्यापक संकेतक क्या होगा?\nA Panchayat wants to assess whether it is becoming women-friendly. Which is the most comprehensive indicator?",
    options: [
      "बैठकों की संख्या बढ़ना / Increase in meetings",
      "शासन में महिलाओं की अधिक भागीदारी, बेहतर सुरक्षा और सेवाओं तक पहुँच / Greater participation, better safety and access to services",
      "आर्थिक गतिविधियों में वृद्धि / Increase in economic activities",
      "अधिक कर संग्रह / Higher tax collection",
    ],
    correctAnswer: 2,
    category: "Women Leadership",
  },
];