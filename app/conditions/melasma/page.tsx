import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Melasma / Skin Darkening Homeopathy | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for melasma, chloasma, and facial pigmentation in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — clear skin naturally without harsh chemicals.",
  keywords: ["melasma homeopathy kalyan","chloasma treatment homeopathy","face darkening homeopathy mumbai","pigmentation homeopathy"],
};

const data = {
  slug: "melasma",
  title: "Melasma (Chloasma)",
  hindiTitle: "मेलाज़्मा (चेहरे के दाग)",
  marathiTitle: "मेलास्मा (चेह-याच्या डागांवर)",
  emoji: "☀️",
  category: "Skin & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#fdf8f0",
  accentColor: "#5a7f5a",
  tagline: "Reveal your natural radiance — from the inside out.",
  overview: "Melasma is a common skin condition causing brown or grayish-brown patches, primarily on the face — cheeks, forehead, upper lip, and chin. It is especially common in women of South Asian descent due to higher melanin levels and UV exposure. Homeopathy corrects the hormonal and immune triggers behind melanin overproduction.",
  whatIsIt: "Melasma results from excess melanin production triggered by hormonal changes, sun exposure, and heat. The 'mask of pregnancy' (chloasma) is a classic form. While topical treatments like hydroquinone may temporarily lighten patches, they cause rebound darkening. Homeopathy addresses the root hormonal and constitutional causes for lasting improvement.",
  causes: [
    "Hormonal changes — pregnancy, oral contraceptives, HRT",
    "Sun and UV exposure — major triggering factor",
    "Thyroid dysfunction",
    "Stress and adrenal imbalance",
    "Genetic predisposition (darker skin types)",
    "Heat from cooking, sun, or appliances",
    "Some medications increasing photosensitivity"
  ],
  symptoms: [
    "Brown, grayish-brown, or blue-gray patches on face",
    "Symmetrical distribution on cheeks, nose, forehead",
    "Upper lip, chin, or jawline darkening",
    "Patches worsen in summer and improve slightly in winter",
    "No itching, scaling, or texture change — purely cosmetic",
    "Associated with hormonal changes in many cases"
  ],
  homeopathyExplanation: "Homeopathic treatment for melasma focuses on the underlying hormonal triggers and constitutional correction. Remedies regulate melanocyte activity, improve hormonal balance, and work on the liver-skin axis (liver health impacts skin pigmentation). Constitutional treatment provides gradual but lasting lightening without the rebound effect of hydroquinone.",
  treatmentPoints: [
    "Reduces melanin overproduction from within",
    "Addresses hormonal triggers (thyroid, OCP, pregnancy aftermath)",
    "No harsh chemicals, bleaching, or photosensitivity side effects",
    "Works on liver health that influences skin tone",
    "Prevents new patch formation",
    "Safe for long-term use"
  ],
  keyRemedies: [
    { name: "Sepia", indication: "Yellow-brown saddle-shaped patches across nose and cheeks; hormonal women; fatigue and irritability" },
    { name: "Cadmium Sulphuricum", indication: "Yellow-brown spots on face with solar keratosis tendency" },
    { name: "Lycopodium", indication: "Brown spots on face with liver weakness, digestive complaints, right-sided affections" },
    { name: "Thuja", indication: "Brown spots — especially post-vaccination or medication; oily skin tendency" },
    { name: "Sulphur", indication: "Unhealthy skin with various pigmentation issues; worse from heat and washing" }
  ],
  treatmentDuration: "6–18 months",
  successRate: "75% significant lightening and stabilization",
  faqs: [
    { q: "Will melasma come back after homeopathic treatment?", a: "Constitutional treatment addresses the underlying hormonal cause, making recurrence much less likely. Sun protection remains essential regardless of treatment." },
    { q: "Can I use sunscreen alongside homeopathy?", a: "Yes — sun protection (SPF 50+ broad spectrum) is essential during and after melasma treatment of any kind." },
    { q: "How long before I see lightening?", a: "Gradual improvement is typically noticed from 3–4 months. Unlike hydroquinone, results are gradual but don't rebound when treatment stops." }
  ],
  related: [
    { title: "Skin Pigmentation (General)", href: "/conditions/skin-pigmentation" },
    { title: "Acne", href: "/conditions/acne" },
    { title: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance" }
  ],
  seoKeywords: ["melasma homeopathy kalyan","chloasma treatment homeopathy","face darkening homeopathy mumbai"]
};

export default function Page() { return <DiseasePage data={data} />; }
