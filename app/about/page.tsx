"use client";
import Link from "next/link";
import { ArrowRight, GraduationCap, Heart, Award } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const timeline = [
  { year: "2005", titleEn: "BHMS Graduation", descEn: "Completed Bachelor of Homeopathic Medicine & Surgery with distinction.", titleHi: "BHMS स्नातक", descHi: "विशिष्टता के साथ BHMS पूरा किया।", titleMr: "BHMS पदवी", descMr: "BHMS प्रतिष्ठेसह पूर्ण केले." },
  { year: "2008", titleEn: "MD in Homeopathy", descEn: "Earned Post-Graduate MD, specializing in women's health and chronic disease management.", titleHi: "होम्योपैथी में MD", descHi: "महिला स्वास्थ्य और जीर्ण रोग प्रबंधन में विशेषज्ञता।", titleMr: "होमिओपॅथीत MD", descMr: "महिला आरोग्य आणि जुनाट रोगात विशेषज्ञता." },
  { year: "2009", titleEn: "Clinic Founded in Kalyan", descEn: "Established her practice with a vision to bring accessible, quality homeopathic care to every family.", titleHi: "कल्याण में क्लिनिक की स्थापना", descHi: "हर परिवार तक होम्योपैथी पहुंचाने के लिए क्लिनिक शुरू किया।", titleMr: "कल्याणमध्ये क्लिनिक सुरू", descMr: "प्रत्येक कुटुंबाला होमिओपॅथी उपलब्ध करण्यासाठी क्लिनिक सुरू केले." },
  { year: "2013", titleEn: "Pediatric Specialization", descEn: "Expanded to include pediatric homeopathy — immunity, behavioral health, developmental support.", titleHi: "बाल चिकित्सा में विशेषज्ञता", descHi: "बच्चों की होम्योपैथी में विशेषज्ञता विस्तारित की।", titleMr: "बालरोग विशेषज्ञता", descMr: "मुलांच्या होमिओपॅथीत विशेषज्ञता वाढवली." },
  { year: "2018", titleEn: "5000+ Patients Healed", descEn: "A milestone of 5000+ patients treated across Kalyan, Andheri, and greater Mumbai.", titleHi: "5000+ मरीज ठीक हुए", descHi: "कल्याण, अंधेरी और मुंबई में 5000+ मरीजों का इलाज।", titleMr: "5000+ रुग्ण बरे झाले", descMr: "कल्याण, अंधेरी आणि मुंबईत 5000+ रुग्णांवर उपचार." },
  { year: "2024", titleEn: "Online Consultations Launched", descEn: "Launched video consultations to serve patients across Maharashtra and beyond.", titleHi: "ऑनलाइन परामर्श शुरू", descHi: "महाराष्ट्र और उससे परे मरीजों के लिए वीडियो परामर्श।", titleMr: "ऑनलाइन सल्ला सुरू", descMr: "महाराष्ट्र आणि बाहेरील रुग्णांसाठी व्हिडिओ सल्ला." },
];

const specializations = [
  { icon: "🌸", titleEn: "Women's Health", titleHi: "महिला स्वास्थ्य", titleMr: "महिला आरोग्य", items: ["PCOD / PCOS", "Hormonal Imbalance", "Menopause", "Infertility", "Thyroid"] },
  { icon: "🌱", titleEn: "Pediatric Care", titleHi: "बाल चिकित्सा", titleMr: "बालरोग", items: ["Recurrent Infections", "ADHD / Autism", "Child Allergies", "Growth & Immunity"] },
  { icon: "✨", titleEn: "Skin & Hair", titleHi: "त्वचा और बाल", titleMr: "त्वचा आणि केस", items: ["Psoriasis", "Eczema", "Acne", "Vitiligo", "Hair Loss", "Melasma"] },
  { icon: "💚", titleEn: "Chronic Diseases", titleHi: "जीर्ण रोग", titleMr: "जुनाट रोग", items: ["Arthritis", "Migraines", "Digestive Disorders", "Anxiety & Stress"] },
];

export default function AboutPage() {
  const { t, locale } = useLanguage();

  const getTimelineTitle = (item: typeof timeline[0]) => locale === "hi" ? item.titleHi : locale === "mr" ? item.titleMr : item.titleEn;
  const getTimelineDesc = (item: typeof timeline[0]) => locale === "hi" ? item.descHi : locale === "mr" ? item.descMr : item.descEn;
  const getSpecTitle = (item: typeof specializations[0]) => locale === "hi" ? item.titleHi : locale === "mr" ? item.titleMr : item.titleEn;

  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              {t.about.tagline}
            </div>
            <h1 className="font-serif mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "#1e2820", lineHeight: 1.2 }}>
              {t.about.title}
              <span className="block text-sage-500 italic">{t.about.subtitle}</span>
            </h1>
            <p className="text-sage-700 text-lg leading-relaxed mb-4">
              {t.about.intro} <em>{t.about.introItalic}</em>
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all mt-4">
              {t.common.bookConsultation} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "📸 Main Portrait", desc: locale === "hi" ? "क्लिनिक में पेशेवर फोटो" : locale === "mr" ? "क्लिनिकमधील व्यावसायिक फोटो" : "Professional photo in clinic", bg: "#e6ede6", span: true },
              { label: "📸 With Patients", desc: locale === "hi" ? "परामर्श का क्षण" : locale === "mr" ? "सल्ल्याचा क्षण" : "Consultation moment", bg: "#f0f5f0" },
              { label: "📸 At Desk", desc: locale === "hi" ? "काम करते हुए" : locale === "mr" ? "काम करताना" : "Working / reviewing cases", bg: "#faf3e6" },
              { label: "📸 Outdoors", desc: locale === "hi" ? "सहज, गर्म फोटो" : locale === "mr" ? "सहज, उबदार फोटो" : "Approachable, warm photo", bg: "#f4f0e6" },
            ].map((ph, i) => (
              <div key={i} className={`rounded-2xl flex flex-col items-center justify-center p-6 text-center ${ph.span ? "row-span-2" : ""}`}
                style={{ backgroundColor: ph.bg, minHeight: ph.span ? "340px" : "160px" }}>
                <div className="text-3xl mb-2">{ph.label.split(" ")[0]}</div>
                <div className="font-medium text-sage-700 text-sm">{ph.label.substring(3)}</div>
                <div className="text-xs text-sage-500 mt-1">{ph.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: GraduationCap, titleEn: "BHMS", titleHi: "BHMS", titleMr: "BHMS", descEn: "Bachelor of Homeopathic Medicine & Surgery", descHi: "होम्योपैथिक चिकित्सा और शल्य चिकित्सा में स्नातक", descMr: "होमिओपॅथिक वैद्यकीय आणि शस्त्रक्रिया पदवी", color: "#f0fdf4" },
              { icon: Award, titleEn: "MD (Homeopathy)", titleHi: "MD (होम्योपैथी)", titleMr: "MD (होमिओपॅथी)", descEn: "Post-Graduate specialization", descHi: "स्नातकोत्तर विशेषज्ञता", descMr: "पदव्युत्तर विशेषज्ञता", color: "#fdf8f0" },
              { icon: Heart, titleEn: "10+ Years", titleHi: "10+ वर्ष", titleMr: "10+ वर्षे", descEn: "Compassionate patient care in Kalyan, Mumbai", descHi: "कल्याण, मुंबई में समर्पित देखभाल", descMr: "कल्याण, मुंबईत समर्पित सेवा", color: "#fdf0f5" },
            ].map((c, i) => (
              <div key={i} className="p-6 rounded-2xl text-center border border-sage-50 hover:shadow-md transition-all" style={{ backgroundColor: c.color }}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <c.icon className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-900 mb-1">{locale === "hi" ? c.titleHi : locale === "mr" ? c.titleMr : c.titleEn}</h3>
                <p className="text-sage-600 text-sm">{locale === "hi" ? c.descHi : locale === "mr" ? c.descMr : c.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sage-400 text-sm tracking-widest uppercase mb-6">{t.about.philosophyTitle}</div>
          <blockquote className="font-serif text-2xl md:text-3xl text-white italic leading-relaxed mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            "{t.about.philosophy}"
          </blockquote>
          <cite className="text-sage-300 text-sm">— {t.about.title}, {t.about.subtitle}</cite>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>{t.about.journeyTitle}</h2>
            <p className="text-sage-600 mt-3">{t.about.journeyDesc}</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-sage-100" />
            {timeline.map((item, i) => (
              <div key={item.year} className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-1/2 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="text-sage-400 text-sm font-medium mb-1">{item.year}</div>
                  <h3 className="font-semibold text-sage-900 mb-2">{getTimelineTitle(item)}</h3>
                  <p className="text-sage-600 text-sm leading-relaxed">{getTimelineDesc(item)}</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-sage-500 border-4 border-white shadow-md" />
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 px-6" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>{t.about.specializationsTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializations.map((s) => (
              <div key={s.titleEn} className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-sage-900 text-lg mb-4">{getSpecTitle(s)}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (<li key={item} className="text-sage-600 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sage-300 flex-shrink-0" />{item}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{t.about.ctaTitle}</h2>
          <p className="text-sage-100 mb-6">{t.about.ctaDesc}</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all">
            {t.common.bookConsultation} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
