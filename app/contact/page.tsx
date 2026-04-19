"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function ContactPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    condition: "",
    date: "",
    time: "",
    message: "",
    lang: "en",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const conditions = [
    "PCOD / PCOS",
    "Thyroid Disorder",
    "Menopause",
    "Child Immunity",
    "ADHD / Behavioral",
    "Allergies",
    "Arthritis",
    "Migraines",
    "Skin Disorders",
    "Digestive Issues",
    "Anxiety / Stress",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const payload = { ...form };

      // 1. Send Email via Formspree (Keep the user's ID or allow them to change it)
      const emailRes = await fetch("https://formspree.io/f/xjgenbzw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!emailRes.ok) {
        throw new Error("Email submission failed. Please try again.");
      }

      // 2. Format WhatsApp message
      const whatsappMsg = `*New Appointment Request*%0A*Name:* ${form.name}%0A*Phone:* ${form.phone}%0A*Condition:* ${form.condition}%0A*Date:* ${form.date}%0A*Time:* ${form.time}%0A*Message:* ${form.message}`;
      const whatsappUrl = `https://wa.me/919359875511?text=${whatsappMsg}`;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Automatically redirect to WhatsApp after 2 seconds to confirm
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 2000);

    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="pt-24">
      
      {/* Hero Section */}
      <section
        className="py-16 px-6 text-center"
        style={{
          background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h1
            className="font-serif mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              color: "var(--text-primary)",
            }}
          >
            {t.contact.title}
            <span className="block italic text-sage-500">
              {t.contact.subtitle}
            </span>
          </h1>

          <p style={{ color: "var(--text-secondary)" }}>{t.contact.desc}</p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Clinic Details */}
            <div
              className="rounded-2xl p-7 border"
              style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
            >
              <h2
                className="font-serif text-2xl mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--text-primary)",
                }}
              >
                {t.contact.clinicDetails}
              </h2>

              {[
                {
                  icon: MapPin,
                  label: t.contact.addressLabel,
                  value:
                    "Yogidham, Phase 3,\nKalyan, Maharashtra 421301",
                  href:
                    "https://maps.google.com/?q=Yogidham+Phase+3+Kalyan+West+Maharashtra+421301",
                },
                {
                  icon: Phone,
                  label: t.contact.phoneLabel,
                  value: "+91 9359875511",
                  href: "tel:+919359875511",
                },
                {
                  icon: Mail,
                  label: t.contact.emailLabel,
                  value: "info@pratimaagale.in",
                  href: "mailto:info@pratimaagale.in",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 mb-5"
                >
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-sage-600" />
                  </div>

                  <div>
                    <div className="text-xs text-sage-500 mb-1">
                      {item.label}
                    </div>

                    <a
                      href={item.href}
                      className="font-medium text-sm hover:text-sage-600 whitespace-pre-line"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}

              {/* Hours */}
              <div className="flex items-start gap-4 mt-2">
                <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-sage-600" />
                </div>

                <div>
                  <div className="text-xs text-sage-500 mb-1">
                    {t.contact.hours}
                  </div>

                  <div className="text-sm space-y-1" style={{ color: "var(--text-primary)" }}>
                    <div>{t.contact.monFri}</div>
                    <div>{t.contact.sat}</div>
                    <div className="text-sage-400">
                      {t.contact.sun}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Consult */}
            <div className="rounded-2xl p-6 bg-sage-500 text-white">
              <div className="text-2xl mb-3">💻</div>
              <h3 className="font-semibold mb-2">
                {t.contact.online}
              </h3>

              <p className="text-sage-100 text-sm">
                {t.contact.onlineDesc}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN FORM */}
          <div className="lg:col-span-3">

            <div
              className="rounded-2xl border shadow-sm p-8"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            >

              {submitted ? (
                <div className="text-center py-16">

                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>

                  <h3 className="font-serif text-2xl mb-3">
                    {t.contact.successTitle}
                  </h3>

                  <p className="text-sage-600">
                    {t.contact.successDesc}
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        phone: "",
                        email: "",
                        condition: "",
                        date: "",
                        time: "",
                        message: "",
                        lang: "en",
                      });
                    }}
                    className="mt-6 text-sage-500 text-sm underline"
                  >
                    Send another message
                  </button>

                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl mb-6">
                    {t.contact.formTitle}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Name */}
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {/* Phone */}
                    <input
                      required
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {/* Email */}
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {/* Condition */}
                    <select
                      required
                      value={form.condition}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          condition: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    >
                      <option value="">
                        Select Condition
                      </option>

                      {conditions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    {/* Date */}
                    <input
                      type="date"
                      required
                      value={form.date}
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {/* Time */}
                    <input
                      type="time"
                      required
                      value={form.time}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          time: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {/* Message */}
                    <textarea
                      rows={4}
                      placeholder="Additional message"
                      value={form.message}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border rounded-xl"
                    />

                    {error && (
                      <p className="text-red-500 text-sm text-center">
                        {error}
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-sage-500 text-white py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {t.contact.submit}
                        </>
                      )}
                    </button>

                  </form>
                </>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-sage-100 h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.123!2d73.1305!3d19.2403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7963333333333%3A0x3333333333333333!2sYogidham+Phase+3+Kalyan!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Clinic Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
}