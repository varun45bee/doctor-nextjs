import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Case Studies | Homeopathy Practice | Kalyan & Mumbai",
  description:
    "Anonymized patient case summaries from Dr. Pratima Agale’s homeopathy practice in Kalyan and Mumbai. These cases reflect real clinical journeys and outcomes.",
  keywords: [
    "homeopathy case studies",
    "homeopathy clinical experience",
    "PCOD homeopathy case",
    "thyroid homeopathy case",
    "child immunity homeopathy",
    "homeopathy kalyan mumbai",
  ],
};

const cases = [
  {
    id: "CS-001",
    title: "PCOD With Gradual Cycle Regulation",
    patient: "Female, 28 years",
    location: "Kalyan",
    condition: "PCOD / PCOS",
    duration: "8 months",
    color: "#fdf4f7",
    tag: "🌸 Women's Health",
    story:
      "The patient had been dealing with irregular menstrual cycles for several years, often experiencing long gaps between periods, along with weight gain and hormonal symptoms. Previous treatments had helped temporarily but did not bring lasting improvement. A detailed case history was taken, focusing on physical symptoms, emotional patterns, and lifestyle factors. Over the course of treatment, gradual changes were observed, including better cycle regularity and overall well-being. Follow-up investigations showed improvement compared to earlier reports.",
    outcome:
      "Menstrual cycles became more regular, and overall hormonal symptoms reduced over time.",
    stars: 5,
  },
  {
    id: "CS-002",
    title: "Improved Immunity in a Young Child",
    patient: "Male, 6 years",
    location: "Andheri",
    condition: "Recurrent Infections",
    duration: "6 months",
    color: "#f0fdf4",
    tag: "🌱 Pediatric Care",
    story:
      "This child was experiencing frequent infections such as throat and chest issues, requiring repeated courses of medication. His parents were concerned about his low energy levels and frequent school absences. After a detailed consultation and careful remedy selection, the frequency and intensity of infections gradually reduced. The child’s energy, appetite, and general health showed steady improvement during follow-ups.",
    outcome:
      "Noticeable reduction in infection frequency with improved energy and daily activity.",
    stars: 5,
  },
  {
    id: "CS-003",
    title: "Supportive Care in Hypothyroidism",
    patient: "Female, 42 years",
    location: "Mumbai",
    condition: "Hypothyroidism",
    duration: "10 months",
    color: "#fdf8f0",
    tag: "🦋 Thyroid",
    story:
      "The patient had been managing hypothyroidism for many years and continued to experience fatigue, weight gain, and hair-related concerns. She approached the clinic seeking supportive care alongside her ongoing medical supervision. A comprehensive assessment was carried out, including physical symptoms and emotional stressors. Over time, she reported improved energy levels and better tolerance to daily activities, with lab values showing improvement under medical monitoring.",
    outcome:
      "Improved energy levels, better symptom control, and supportive progress under supervision.",
    stars: 5,
  },
  {
    id: "CS-004",
    title: "Reduction in Migraine Frequency",
    patient: "Male, 35 years",
    location: "Kalyan",
    condition: "Chronic Migraines",
    duration: "7 months",
    color: "#f5f0fd",
    tag: "💆 Chronic Care",
    story:
      "The patient reported frequent migraine episodes for several years, often triggered by stress and prolonged screen exposure. These episodes were affecting his work and quality of life. After individualized case analysis and remedy selection, the intensity and frequency of headaches gradually reduced. The patient also received guidance regarding lifestyle and trigger management.",
    outcome:
      "Migraine episodes reduced significantly, with longer symptom-free intervals.",
    stars: 5,
  },
  {
    id: "CS-005",
    title: "Long-Standing Eczema in Early Childhood",
    patient: "Female, 4 years",
    location: "Kalyan",
    condition: "Atopic Eczema",
    duration: "5 months",
    color: "#fdf0f5",
    tag: "✨ Skin Care",
    story:
      "The child had persistent eczema since infancy, with repeated flare-ups despite topical treatments. The condition was affecting sleep and comfort. A gentle, step-by-step approach was followed, with close monitoring and parental guidance. Over the months, the skin gradually became calmer, with fewer flare-ups and improved sleep.",
    outcome:
      "Skin condition improved steadily with reduced flare-ups and better comfort.",
    stars: 5,
  },
  {
    id: "CS-006",
    title: "Behavioral and Focus Support in a School-Age Child",
    patient: "Male, 9 years",
    location: "Andheri",
    condition: "Attention & Behavioral Concerns",
    duration: "9 months",
    color: "#f0f5ff",
    tag: "🧠 Pediatric Support",
    story:
      "The child was struggling with focus, restlessness, and emotional regulation at school and home. Parents were seeking a non-invasive, supportive approach. A detailed consultation included behavioral patterns, routine, and emotional responses. Along with remedies, practical guidance was provided regarding daily routine and screen habits. Gradual improvement was noted in attention span and classroom participation.",
    outcome:
      "Improved focus, calmer behavior, and better engagement in daily activities.",
    stars: 5,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="pt-24">
      {/* HERO */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            Patient Experiences
          </div>
          <h1
            className="font-serif mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              color: "#1e2820",
            }}
          >
            Case Studies From Practice
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed">
            A selection of anonymized patient experiences from Dr. Pratima Agale’s
            homeopathy practice in Kalyan, Andheri, and Mumbai.
          </p>
          <p className="text-xs text-sage-400 mt-4">
            * Patient identities and personal details have been modified to
            protect privacy.
          </p>
        </div>
      </section>

      {/* CASE LIST */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-sage-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div
                className="px-7 py-4 flex items-center justify-between border-b border-sage-50"
                style={{ backgroundColor: c.color }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-sage-500 bg-white/70 px-3 py-1 rounded-full">
                    {c.id}
                  </span>
                  <span className="text-sm font-medium text-sage-700">
                    {c.tag}
                  </span>
                </div>
                <div className="flex">
                  {[...Array(c.stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              <div className="p-7">
                <div className="mb-5">
                  <h2
                    className="font-serif text-2xl mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#1e2820",
                    }}
                  >
                    {c.title}
                  </h2>
                  <div className="flex gap-3 text-xs text-sage-500">
                    <span>{c.patient}</span>
                    <span>·</span>
                    <span>{c.location}</span>
                    <span>·</span>
                    <span>Treatment duration: {c.duration}</span>
                  </div>
                </div>

                <p className="text-sage-700 text-sm leading-relaxed mb-5">
                  {c.story}
                </p>

                <div className="bg-sage-50 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-sage-500 font-semibold text-sm whitespace-nowrap">
                    Outcome:
                  </span>
                  <span className="text-sage-700 text-sm">{c.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-serif text-3xl text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Considering a Consultation?
          </h2>
          <p className="text-sage-100 mb-6">
            Every case is different. A consultation helps determine whether
            homeopathy may be suitable for your situation.
          </p>
         <a
  href="https://wa.me/919087234577?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
>
  {/* WhatsApp Icon */}
 

  Book a Consultation
</a>
        </div>
      </section>
    </div>
  );
}