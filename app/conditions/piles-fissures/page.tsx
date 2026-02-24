import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Piles (Hemorrhoids) & Anal Fissures Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Piles (Hemorrhoids) & Anal Fissures in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. piles homeopathy kalyan, hemorrhoids homeopathy treatment.",
  keywords: ["piles homeopathy kalyan","hemorrhoids homeopathy treatment","bawaseer homeopathy","anal fissure homeopathy mumbai"],
  openGraph: {
    title: "Piles (Hemorrhoids) & Anal Fissures Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Piles (Hemorrhoids) & Anal Fissures. Heal piles without surgery — naturally and permanently.",
  },
};

const data = {
  "slug": "piles-fissures",
  "title": "Piles (Hemorrhoids) & Anal Fissures",
  "hindiTitle": "बवासीर और फिशर",
  "marathiTitle": "मूळव्याध आणि फिशर",
  "emoji": "🌿",
  "category": "Anorectal Conditions",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Heal piles without surgery — naturally and permanently.",
  "overview": "Piles (hemorrhoids) and anal fissures are among the most uncomfortable yet commonly undertreated conditions due to patient embarrassment. Homeopathy is highly effective for both — often avoiding the need for surgical intervention and providing permanent relief.",
  "whatIsIt": "Hemorrhoids are swollen veins in the rectum or anus. They can be internal (inside the rectum) or external (under the skin around the anus). Anal fissures are small tears in the anal lining causing sharp pain during defecation. Both are linked to chronic constipation, straining, low-fiber diet, and pregnancy.",
  "causes": [
    "Chronic constipation and straining at stool",
    "Low-fiber, low-water diet",
    "Prolonged sitting (desk jobs, travel)",
    "Pregnancy and postpartum period",
    "Obesity increasing rectal pressure",
    "Chronic diarrhea and IBS",
    "Hereditary venous weakness"
  ],
  "symptoms": [
    "Painless bright red rectal bleeding during defecation",
    "Itching or irritation around the anus",
    "Swelling or a lump near the anus",
    "Sharp, knife-like pain during bowel movements (fissures)",
    "Feeling of incomplete bowel emptying",
    "Mucus discharge from the anus",
    "Prolapse of hemorrhoids outside the anus"
  ],
  "homeopathyExplanation": "Homeopathy treats piles and fissures constitutionally — addressing the venous congestion, constipation, and constitutional factors. Treatment reduces bleeding, shrinks hemorrhoids, heals fissures, and corrects the underlying constipation pattern. Most patients avoid surgery with consistent constitutional treatment.",
  "treatmentPoints": [
    "Stops rectal bleeding rapidly in most cases",
    "Shrinks hemorrhoidal tissue over time",
    "Heals anal fissures without surgery",
    "Corrects underlying constipation constitution",
    "Prevents recurrence after acute episode",
    "Safe during pregnancy (very common in prenatal period)"
  ],
  "keyRemedies": [
    {
      "name": "Aesculus",
      "indication": "Piles with aching, burning sensation; dry, painful, purple hemorrhoids; lower back pain"
    },
    {
      "name": "Hamamelis",
      "indication": "Bleeding hemorrhoids with weakness; venous congestion; soreness"
    },
    {
      "name": "Nux Vomica",
      "indication": "Piles with constipation and ineffectual urging; better after bowel movement; irritable constitution"
    },
    {
      "name": "Aloe",
      "indication": "Hemorrhoids like bunch of grapes; prolapse; diarrhea alternating with constipation"
    },
    {
      "name": "Nitric Acid",
      "indication": "Anal fissures with splinter-like pains; bleeding with black blood; anxious, chilly constitution"
    }
  ],
  "treatmentDuration": "3–8 months",
  "successRate": "85%+ avoiding surgery",
  "faqs": [
    {
      "q": "Does homeopathy work for Grade 3 or 4 hemorrhoids?",
      "a": "Lower grades (1–2) respond best to homeopathy alone. Grade 3 can be managed constitutionally, though results vary. Grade 4 with complete prolapse typically needs surgical intervention, with homeopathy used post-operatively for healing and recurrence prevention."
    }
  ],
  "related": [
    {
      "title": "IBS & Digestive Disorders",
      "href": "/conditions/ibs-digestive"
    },
    {
      "title": "Obesity",
      "href": "/conditions/obesity"
    },
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    }
  ],
  "seoKeywords": [
    "piles homeopathy kalyan",
    "hemorrhoids homeopathy treatment",
    "bawaseer homeopathy",
    "anal fissure homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
