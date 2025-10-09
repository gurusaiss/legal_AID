import { Lang } from "@/i18n";

type LocalizedString = Record<Lang, string> & { hi?: string };
type LocalizedStringArray = Record<Lang, string[]> & { hi?: string[] };

export type Topic = {
  id: string;
  labels: LocalizedString;
  sections: {
    heading: LocalizedString;
    bullets: LocalizedStringArray;
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
            "Transfers of 'granted/assigned' land are heavily restricted; unauthorized transfers are void and can be restored to the original grantee."
          ],
          te: [
            "ఎస్‌సి/ఎస్‌టి భూమిని సాధారణ వర్గాల వారు కొనాలంటే సాధారణంగా కలెక్టర్/డిఎం ముందస్తు అనుమతి అవసరం.",
            "ప్రభుత్వం కేటాయించిన/అసైన్ చేసిన భూముల బదిలీపై కఠిన పరిమితులు ఉన్నాయి; అనుమతి లేకుండా చేసిన బదిలీలు శూన్యం (void) అవుతాయి."
          ],
          hi: [
            "एससी/एसटी भूमि की खरीद के लिए सामान्यतः कलेक्टर/जिलाधिकारी की पूर्वानुमति आवश्यक होती है.",
            "'ग्रांटेड/असाइंड' भूमि के हस्तांतरण पर कड़े प्रतिबंध हैं; अनधिकृत हस्तांतरण शून्य (void) होते हैं."
          ]
        },
        source: "https://restthecase.com/knowledge-bank/rules-for-buying-land-of-scheduled-caste"
      }
    ]
  },
  {
    id: "forest_rights",
    labels: { en: "Forest Rights", te: "అడవి హక్కులు", hi: "वन अधिकार" },
    sections: [
      {
        heading: { en: "Overview", te: "సారాంశం", hi: "अवलोकन" },
        bullets: {
          en: [
            "Individual and community forest rights are recognized under the Scheduled Tribes and Other Traditional Forest Dwellers Act, 2006 (FRA).",
            "Gram Sabha is the authority for initiating the process of determining forest rights."
          ],
          te: [
            "2006లోని షెడ్యూల్డ్ ట్రైబ్స్ మరియు ఇతర సాంప్రదాయిక అటవీ నివాసుల చట్టం క్రింద వ్యక్తిగత మరియు సామాజిక అటవీ హక్కులను గుర్తిస్తారు.",
            "అటవీ హక్కులను నిర్ణయించే ప్రక్రియను ప్రారంభించడానికి గ్రామ సభ అధికారం కలిగి ఉంటుంది."
          ],
          hi: [
            "अनुसूचित जनजाति और अन्य पारंपरिक वन निवासी अधिनियम, 2006 (एफआरए) के तहत व्यक्तिगत और सामुदायिक वन अधिकारों को मान्यता दी जाती है।",
            "वन अधिकारों का निर्धारण करने की प्रक्रिया शुरू करने का अधिकार ग्राम सभा को है।"
          ]
        }
      }
    ]
  }
];
