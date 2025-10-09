import { Lang } from "@/i18n";

export type Topic = {
  id: string;
  labels: Record<Lang, string> & { hi?: string };
  sections: {
    heading: Record<Lang, string> & { hi?: string };
    bullets: Record<Lang, string[]> & { hi?: string[] };
    source?: string;
  }[];
};

export const topics: Topic[] = [
  {
    id: "land_rights",
    labels: { en: "Land Rights", te: "భూమి హక్కులు", hi: "भूमि अधिकार" },
    sections: [
      {
        heading: { en: "Buying SC/ST Land (Pan‑India Overview)", te: "ఎస్‌సి/ఎస్‌టి భూమి కొనుగోలు – దేశవ్యాప్త నియమాలు", hi: "एससी/एसटी भूमि खरीद – राष्ट्रव्यापी नियम" },
        bullets: {
          en: [
            "Non‑SC/ST buyers generally need prior permission from the District Magistrate/Collector before purchasing SC/ST land.",
            "Transfers of 'granted/assigned' land are heavily restricted; unauthorized transfers are void and can be restored to the original grantee.",
            "Protections flow from Article 46, Fifth Schedule, and state‑specific laws (e.g., PTCL Karnataka 1978, UP S.157‑A, Maharashtra LR Code S.36A, AP Assigned Lands Act 1977).",
          ],
          te: [
            "ఎస్‌సి/ఎస్‌టి భూమిని సాధారణ వర్గాల వారు కొనాలంటే సాధారణంగా కలెక్టర్/డిఎం ముందస్తు అనుమతి అవసరం.",
            "ప్రభుత్వం కేటాయించిన/అసైన్ చేసిన భూముల బదిలీపై కఠిన పరిమితులు ఉన్నాయి; అనుమత�� లేకుండా చేసిన బదిలీలు శూన్యం (void) అవుతాయి మరియు మూల కేటాయితుడికి తిరిగి వెళ్తాయి.",
            "ఆర్టికల్ 46, ఫిఫ్త్ షెడ్యూల్ మరియు రాష్ట్ర చట్టాలు (ఉదా., కర్ణాటక PTCL 1978, యుపి S.157‑A, మహారాష్ట్ర LR కోడ్ S.36A, ఏపీ Assigned Lands Act 1977) రక్షణగా ఉంటాయి.",
          ],
          hi: [
            "एससी/एसटी भूमि की खरीद के लिए सामान्यतः कलेक्टर/जिलाधिकारी की पूर्वानुमति आवश्यक होती है।",
            "‘ग्रांटेड/असाइंड’ भूमि के हस्तांतरण पर कड़े प्रतिबंध हैं; अनधिकृत हस्तांतरण शून्य (void) होते हैं और जमीन वापस करायी जा सकती है।",
            "संरक्षण अनुच्छेद 46, पंचम अनुसूची और राज्य विशे��� क़ानूनों (जैसे कर्नाटक PTCL 1978, यूपी धारा 157‑A, महाराष्ट्र LR कोड 36A, एपी Assigned Lands Act 1977) से प्राप्त होता है।",
          ],
        },
        source: "https://restthecase.com/knowledge-bank/rules-for-buying-land-of-scheduled-caste",
      },
      {
        heading: { en: "Permission & Process", te: "అనుమతి & విధానం", hi: "अनुमति और प्रक्रिया" },
        bullets: {
          en: [
            "Check land status in revenue records (ROR/1B, Adangal, 7/12 etc.) for 'granted' remarks and prior transfers.",
            "Apply to the Collector/competent authority detailing reason, price and parties; authority verifies need and fairness and may impose conditions.",
            "After permission, execute and register the sale deed enclosing the order; then apply for mutation of records.",
          ],
          te: [
            "రెవిన్యూ రికార్డుల్లో (ROR/1B, అడంగల్ మొదలైనవి) భూమి స్థితిని, 'గ్రాంటెడ్/అసైన్' గమనికలను తనిఖీ చేయండి.",
            "కలెక్టర్/అధికారికి కారణం, ధర, కొనుగోలుదారు/అమ్మకందారు వివరాలతో దరఖాస్తు చేయాలి; అవసరం, న్యాయమైన ధర వంటి అంశాలు పరిశీలించబడతాయి.",
            "అనుమతి తరువాత, ఆర్డర్‌ను జతచేసి రిజిస్ట్రేషన్ చేసి, తర్వాత మ్యూటేషన్ కోసం దరఖాస్తు చేయాలి.",
          ],
          hi: [
            "राजस्व अभिलेखों (ROR/1B, अदंगल/7‑12 आदि) में भूमि की स्थिति और 'ग्रांटेड' टिप्पणियाँ जाँचें।",
            "कलेक्टर/प्राधिकृत अधिकारी से कारण, मूल्य और पक्षकारों सहित पूर्व अनुमति लें; अधिकारी आवश्यकता और निष्पक्षता की जाँच करता है।",
            "अनुमति मिलने पर आदेश संलग्न कर पंजीकरण करें; फिर म्यूटेशन के लिए आवेदन करें।",
          ],
        },
      },
      {
        heading: { en: "Andhra Pradesh Scheduled Areas – LTR 1 of 1970", te: "ఆంధ్రప్రదేశ్ షెడ్యూల్ ఏరియాస్ – LTR 1 of 1970", hi: "आंध्र प्रदेश अनुसूचित क्षेत्र – LTR 1 of 1970" },
        bullets: {
          en: [
            "Section 3: Transfer of immovable property in Scheduled Areas by a Scheduled Tribe to a non‑tribal is prohibited; transfers among STs/co‑ops of STs are permitted as per law.",
            "Agent to Government/Project Officer, ITDA oversees permissions and restoration; unauthorized transfers are void with restoration to tribal owners.",
            "Procedure commonly uses Form ‘K’ declaration by transferee and Form ‘L’ authorization by authority; Gram Sabha/PESA resolutions are considered for local verification.",
          ],
          te: [
            "సెక్షన్ 3: షెడ్యూల్డ్ ఏరియాస్‌లో గిరిజనుడు నుండి గిరిజనేతరునికి భూమి బదిలీ నిషేధితం; గిరిజనుల మధ్య/గిరిజన సంఘాలకు చట్టపరంగా అనుమతి ఉంటుంది.",
            "Govt. ఏజెంట్/ఐటీడిఏ ప్రాజెక్ట్ ఆఫీసర్ అనుమతులు, పునరుద్ధరణ పర్యవేక్షిస్తారు; అనుమతి లేని బదిలీలు శూన్యం అవుతాయి మరియు గిరిజన యజమానులకు తిరిగి వెళ్తాయి.",
            "విధానంలో సాధారణంగా ఫారమ్ ‘K’ (డిక్లరేషన్) మరియు ఫారమ్ ‘L’ (ఆథరైజేషన్) వాడతారు; పిఇఎస్ఏ/గ్రామ సభ తీర్మానాలు స్థానిక ధృవీకరణకు పరిగణలోకి తీసుకుంటారు.",
          ],
          hi: [
            "धारा 3: अनुसूचित क्षेत्रों में जनजाति से गैर‑जनजाति को अचल संपत्ति का हस्तांतरण निषिद्ध है; जनजातियों के बीच/जनजातीय सहकारी समितियों को हस्तांतरण अनुमेय।",
            "एजेंट टू गवर्नमेंट/आईटीडीए प्रोजेक्ट ऑफिसर अनुमति और पुनर्स्थापन देखते हैं; अनधिकृत सौदे शून्य होते हैं और भूमि वापसी हो सकती है।",
            "प्रक्रिया में सामान्यतः फॉर्म ‘K’ (घोषणा) और फॉर्म ‘L’ (अनुमोदन) उपयोग होते हैं; ग्राम सभा/पीईएसए प्रस्तावों पर विचार किया जाता है।",
          ],
        },
        source: "LTR/APSALTR practice; see district formats (Forms K & L)",
      },
      {
        heading: { en: "Document Checklist", te: "పత్రాల చెక్‌లిస్ట్", hi: "दस्तावेज़ चेकलिस्ट" },
        bullets: {
          en: [
            "Title chain, ROR/1B, Adangal/7‑12, mutation extracts, previous permissions if any.",
            "Caste/Tribe certificates of parties; Aadhaar/address proofs; PPB/Patta details (if applicable).",
            "Collector/Agent permission order (if required), Gram Sabha/PESA resolution in Scheduled Areas, and valuation report.",
          ],
          te: [
            "టైటిల్ చైన్, ROR/1B, అడంగల్/7‑12, మ్యూటేషన్‌లు, గత అనుమతుల ప్రతులు.",
            "వర్గం/గిరిజన సర్టిఫికెట్లు; ఆధార్/చిరునామా ఆధారాలు; పట్టా/PPB వివరాలు (ఉంటే).",
            "అవసరమైతే కలెక్టర్/ఏజెంట్ అనుమతి ఉత్తర్వు, షెడ్యూల్డ్ ఏరియాస్‌లో గ్రామ సభ/PESA తీర్మానం, విలువ నిర్ధారణ నివేదిక.",
          ],
          hi: [
            "टाइटल चेइन, ROR/1B, अदंगल/7‑12, म्यूटेशन प्रतिलिपियाँ, पूर्व अनुमति (यदि हो)।",
            "पक्षकारों के जाति/जनजाति प्रमाणपत्र, आधार/पते के प्रमाण, पट्टा/PPB विवरण (यदि लागू हो)।",
            "कले��्टर/एजेंट की अनुमति, ग्राम सभा/पीईएसए प्रस्ताव (अनुसूचित क्षेत्रों में) और मूल्यांकन रिपोर्ट।",
          ],
        },
      },
    ],
  },
  {
    id: "forest_rights",
    labels: { en: "Forest Rights", te: "అడవి హక్కులు", hi: "वन अधिकार" },
    sections: [
      {
        heading: { en: "Overview", te: "సారాంశం" },
        bullets: {
          en: [
            "Individual and community forest rights are recognized under the Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 (FRA).",
            "Gram Sabha is the authority to initiate the process of determining rights; titles are heritable and inalienable as per FRA.",
          ],
          te: [
            "FRA, 2006 ప్రకారం వ్యక్తిగత/సమూహ అడవి హక్కులు గుర్తింపు పొందుతాయి.",
            "హక్కుల నిర్ధారణ ప్రక్రియను గ్రామ సభ ప్రారంభిస్తుంది; FRA ప్రకారం హక్కులు వారసత్వమైనవి, బదిలీ చే��లేనివి.",
          ],
        },
      },
    ],
  },
  {
    id: "legal_schemes",
    labels: { en: "Legal Schemes", te: "న్యాయ పథకాలు", hi: "कानूनी योजनाएँ" },
    sections: [
      {
        heading: { en: "Helplines & Support", te: "హెల్ప్‌లైన్లు & సపోర్ట్" },
        bullets: {
          en: [
            "Legal Services Authorities (LSA) provide free legal aid to eligible persons including SC/ST; contact District Legal Services Authority.",
            "ITDA/Tribal Welfare offices assist with LTR permissions and grievance redressal in Scheduled Areas.",
          ],
          te: [
            "ఎల్ఎస్ఏలు (LSA) అర్హులైన వారికి ఉచిత న్యాయ సహాయం అందిస్తాయి; జిల్లా న్యాయ సేవాధికారిని సంప్రదించండి.",
            "షెడ్యూల్డ్ ఏరియాస్‌లో ఐటీడిఏ/గిరిజన సంక్షేమ కార్యాలయాలు LTR అనుమతులు, ఫిర్యాదులకు సహాయం చేస్తాయి.",
          ],
        },
      },
    ],
  },
  {
    id: "education",
    labels: { en: "Education", te: "విద్య", hi: "शिक्षा" },
    sections: [
      {
        heading: { en: "Know Your Rights", te: "మీ హక్కులు తెలుసుకోండి" },
        bullets: {
          en: [
            "Always verify land category (granted/assigned, patta) and special restrictions before any transaction.",
            "Unauthorized transfers can be void; restoration and penalties may apply under state laws and PoA Act.",
          ],
          te: [
            "ఏదైనా లావాదేవీకి ముందు భూమి రకం (గ్రాంటెడ్/అసైన్, పట్టా) మరియు ప్రత్యేక పరిమితులు తప్పనిసరి గా తనిఖీ చేయండి.",
            "అనుమతి లేని బదిలీలు శూన్యం కావచ్చు; పునరుద్ధరణ, శిక్షలు రాష్ట్ర చట్టాల ప్రకారం వర్తిస్తాయి.",
          ],
        },
      },
    ],
  },
];
