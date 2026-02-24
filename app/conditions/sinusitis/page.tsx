import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Sinusitis & Chronic Nasal Congestion Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Sinusitis & Chronic Nasal Congestion in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. sinusitis homeopathy kalyan, sinus infection homeopathy.",
  keywords: ["sinusitis homeopathy kalyan","sinus infection homeopathy","nasal congestion homeopathy","chronic sinusitis treatment mumbai"],
  openGraph: {
    title: "Sinusitis & Chronic Nasal Congestion Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Sinusitis & Chronic Nasal Congestion. Clear sinuses, clear mind — permanently.",
  },
};

const data = {
  "slug": "sinusitis",
  "title": "Sinusitis & Chronic Nasal Congestion",
  "hindiTitle": "साइनसाइटिस",
  "marathiTitle": "सायनुसायटिस",
  "emoji": "👃",
  "category": "ENT & Respiratory",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Clear sinuses, clear mind — permanently.",
  "overview": "Chronic sinusitis — persistent inflammation of the sinus cavities — affects millions of Indians, causing facial pain, nasal congestion, postnasal drip, and headaches. Recurrent antibiotic courses and nasal sprays provide temporary relief. Homeopathy addresses the underlying immune and constitutional susceptibility for lasting freedom.",
  "whatIsIt": "The sinuses (air-filled cavities in the skull) become inflamed due to infection, allergies, nasal polyps, or anatomical factors. Chronic sinusitis is defined as inflammation lasting more than 12 weeks. Homeopathy reduces the constitutional susceptibility to sinus inflammation — improving mucosal immunity and drainage.",
  "causes": [
    "Allergic rhinitis causing chronic mucosal inflammation",
    "Recurrent viral or bacterial infections",
    "Nasal polyps blocking sinus drainage",
    "Deviated nasal septum",
    "Dental infections spreading to maxillary sinuses",
    "Environmental pollutants and dust exposure"
  ],
  "symptoms": [
    "Facial pain or pressure — especially over forehead, cheeks, eyes",
    "Nasal congestion with reduced smell",
    "Thick yellow or green nasal discharge",
    "Postnasal drip causing throat clearing or cough",
    "Headache — worse when bending forward",
    "Fatigue and reduced productivity",
    "Dental pain in upper teeth (maxillary sinusitis)"
  ],
  "homeopathyExplanation": "Constitutional homeopathy reduces the chronic mucosal hypersensitivity that makes sinuses prone to recurrent inflammation. Remedies are chosen based on the location of sinus involvement (frontal, maxillary, ethmoid), the character of discharge, time of worsening, and your constitutional type.",
  "treatmentPoints": [
    "Reduces recurrence of sinus infections",
    "Improves mucosal drainage and reduces congestion",
    "Eliminates need for repeated antibiotic courses",
    "Addresses associated allergic rhinitis",
    "Prevents nasal polyp re-growth after surgery",
    "Improves sense of smell naturally"
  ],
  "keyRemedies": [
    {
      "name": "Kali Bichromicum",
      "indication": "Thick, stringy, tenacious mucus; frontal sinusitis; pain at root of nose"
    },
    {
      "name": "Silicea",
      "indication": "Chronic sinusitis with hard, dry crusts; offensive discharge; low vitality"
    },
    {
      "name": "Pulsatilla",
      "indication": "Thick, bland yellow-green discharge; worse in warm room; better in open air"
    },
    {
      "name": "Hydrastis",
      "indication": "Thick postnasal drip; catarrhal sinusitis; associated with digestive weakness"
    },
    {
      "name": "Calcarea Sulphurica",
      "indication": "Yellow, lumpy discharge; sinusitis draining slowly; suppurating tendency"
    }
  ],
  "treatmentDuration": "4–10 months",
  "successRate": "85%+ significant sinus improvement",
  "faqs": [
    {
      "q": "Can homeopathy help with nasal polyps?",
      "a": "Homeopathy can reduce the size and symptoms of small nasal polyps and prevent their re-growth after surgical removal. Large, obstructing polyps may require surgery first."
    }
  ],
  "related": [
    {
      "title": "Allergies & Asthma",
      "href": "/conditions/allergies-asthma"
    },
    {
      "title": "Migraines",
      "href": "/conditions/migraines"
    },
    {
      "title": "Tonsillitis",
      "href": "/conditions/tonsillitis"
    }
  ],
  "seoKeywords": [
    "sinusitis homeopathy kalyan",
    "sinus infection homeopathy",
    "nasal congestion homeopathy",
    "chronic sinusitis treatment mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
