"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", condition: "", date: "", time: "", message: "", lang: "en" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const conditions = [
    "PCOD / PCOS", "Thyroid Disorder", "Menopause", "Child Immunity",
    "ADHD / Behavioral", "Allergies", "Arthritis", "Migraines",
    "Skin Disorders", "Digestive Issues", "Anxiety / Stress", "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Send WhatsApp to Doctor via Twilio (fully automatic)
      const waRes = await fetch("/api/send-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!waRes.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // ✅ Send email via Formspree (automatic)
      await fetch("https://formspree.io/f/xjgenbzw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          condition: form.condition,
          date: form.date,
          time: form.time,
          language: form.lang,
          message: form.message,
        }),
      });

      setSubmitted(true); // ✅ Show success screen
    } catch (err) {
      console.error("Submission error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="pt-24">
      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "#1e2820" }}>
            {t.contact.title}
            <span className="block italic text-sage-500">{t.contact.subtitle}</span>
          </h1>
          <p className="text-sage-700">{t.contact.desc}</p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* Left Column – Clinic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-7 border border-sage-100" style={{ backgroundColor: "#f4f7f4" }}>
              <h2 className="font-serif text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>
                {t.contact.clinicDetails}
              </h2>
              {[
                { icon: MapPin, label: t.contact.addressLabel, value: "Yogidham, Phase 3,\nKalyan, Maharashtra 421301", href: "https://maps.google.com/?q=Yogidham+Phase+3+Kalyan+West+Maharashtra+421301" },
                { icon: Phone, label: t.contact.phoneLabel, value: "+91 9087234577", href: "tel:+919087234577" },
                { icon: Mail, label: t.contact.emailLabel, value: "info@pratimaagale.in", href: "mailto:info@pratimaagale.in" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-sage-600" />
                  </div>
                  <div>
                    <div className="text-xs text-sage-500 mb-0.5">{item.label}</div>
                    <a href={item.href} className="text-sage-900 font-medium text-sm hover:text-sage-600 transition-colors whitespace-pre-line">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 mt-2">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <div className="text-xs text-sage-500 mb-1">{t.contact.hours}</div>
                  <div className="text-sage-900 text-sm space-y-1">
                    <div>{t.contact.monFri}</div>
                    <div>{t.contact.sat}</div>
                    <div className="text-sage-400">{t.contact.sun}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-6 bg-sage-500 text-white">
              <div className="text-2xl mb-3">💻</div>
              <h3 className="font-semibold mb-2">{t.contact.online}</h3>
              <p className="text-sage-100 text-sm leading-relaxed">{t.contact.onlineDesc}</p>
            </div>

            <div className="rounded-2xl overflow-hidden border border-sage-100 flex items-center justify-center h-48" style={{ backgroundColor: "#e6ede6" }}>
              <div className="text-center">
                <MapPin className="w-8 h-8 text-sage-500 mx-auto mb-2" />
                <p className="text-sage-600 text-sm font-medium">Kalyan, Maharashtra</p>
                <a
                  href="https://maps.google.com/?q=Yogidham+Phase+3+Kalyan+West+Maharashtra+421301"
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-sage-500 hover:text-sage-700 underline mt-1 block"
                >
                  Open Yogidham Phase 3 on Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right Column – Booking Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-sage-100 shadow-sm p-8">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-serif text-2xl mb-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-sage-600 max-w-sm mx-auto">{t.contact.successDesc}</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "", condition: "", date: "", time: "", message: "", lang: "en" }); }}
                    className="mt-6 text-sage-500 text-sm hover:text-sage-700 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>
                    {t.contact.formTitle}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1.5">
                          {t.contact.name} <span className="text-red-400">*</span>
                        </label>
                        <input
                          required type="text" value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1.5">
                          {t.contact.phoneLabel} <span className="text-red-400">*</span>
                        </label>
                        <input
                          required type="tel" value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-1.5">{t.contact.email}</label>
                      <input
                        type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-1.5">
                        {t.contact.condition} <span className="text-red-400">*</span>
                      </label>
                      <select
                        required value={form.condition}
                        onChange={(e) => setForm({ ...form, condition: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all bg-white"
                      >
                        <option value="">{t.contact.selectCondition}</option>
                        {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1.5">Preferred Date <span className="text-red-400">*</span></label>
                        <input
                          type="date" required value={form.date}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1.5">Preferred Time <span className="text-red-400">*</span></label>
                        <select
                          required value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all bg-white"
                        >
                          <option value="">Select time...</option>
                          {["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM"].map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-1.5">{t.contact.language}</label>
                      <div className="flex gap-3">
                        {[["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]].map(([val, label]) => (
                          <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio" name="lang" value={val}
                              checked={form.lang === val}
                              onChange={(e) => setForm({ ...form, lang: e.target.value })}
                              className="accent-sage-500"
                            />
                            <span className="text-sm text-sage-700">{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-1.5">{t.contact.message}</label>
                      <textarea
                        rows={4} value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t.contact.messagePlaceholder}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 text-sm focus:outline-none focus:border-sage-400 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                      type="submit" disabled={loading}
                      className="w-full flex items-center justify-center gap-2 bg-sage-500 text-white py-4 rounded-xl font-medium hover:bg-sage-600 transition-all disabled:opacity-70"
                    >
                      {loading
                        ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t.contact.sending}</>
                        : <><Send className="w-4 h-4" />{t.contact.submit}</>
                      }
                    </button>
                    <p className="text-xs text-sage-400 text-center">{t.contact.privacy}</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}