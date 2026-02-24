"use client";
import Link from "next/link";
import { Leaf, Phone, MapPin, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function Footer() {
  const { t, locale } = useLanguage();

  const quickLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/conditions", label: t.nav.conditions },
    { href: "/services/womens-health", label: t.nav.womensHealth },
    { href: "/services/pediatric", label: t.nav.pediatric },
    { href: "/services/chronic-disease", label: t.nav.chronic },
    { href: "/why-homeopathy", label: t.nav.whyHomeopathy },
    { href: "/case-studies", label: t.nav.caseStudies },
    { href: "/blog", label: t.nav.blog },
  ];

  const skinConditions = [
    { href: "/conditions/psoriasis", label: locale === "hi" ? "सोरायसिस" : locale === "mr" ? "सोरायसिस" : "Psoriasis" },
    { href: "/conditions/eczema", label: locale === "hi" ? "एक्जिमा" : locale === "mr" ? "एक्झिमा" : "Eczema" },
    { href: "/conditions/acne", label: locale === "hi" ? "मुहांसे" : locale === "mr" ? "पुरळ / मुरुम" : "Acne & Pimples" },
    { href: "/conditions/vitiligo", label: locale === "hi" ? "सफेद दाग" : locale === "mr" ? "पांढरे डाग" : "Vitiligo" },
    { href: "/conditions/melasma", label: locale === "hi" ? "मेलाज़्मा" : locale === "mr" ? "मेलास्मा" : "Melasma" },
    { href: "/conditions/rosacea", label: locale === "hi" ? "रोसेशिया" : locale === "mr" ? "रोसेशिया" : "Rosacea" },
    { href: "/conditions/alopecia", label: locale === "hi" ? "गंजापन" : locale === "mr" ? "एलोपेसिया" : "Alopecia" },
    { href: "/conditions/warts", label: locale === "hi" ? "मस्से" : locale === "mr" ? "मस्से" : "Warts" },
    { href: "/conditions/fungal-skin", label: locale === "hi" ? "फंगल संक्रमण" : locale === "mr" ? "बुरशीजन्य संसर्ग" : "Fungal Infections" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: "#1e2820" }}>
      {/* Decorative top gradient bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(to right, #5a7f5a, #3a9e8c, #5a7f5a)" }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-9 h-9 rounded-full bg-sage-500 flex items-center justify-center group-hover:bg-sage-400 transition-colors">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div
                  className="text-white text-lg leading-none"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Dr. Pratima Agale
                </div>
                <div className="text-xs text-sage-400 tracking-widest uppercase">BHMS, MD</div>
              </div>
            </Link>

            <p className="text-sage-400 text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-sage-700 flex items-center justify-center text-sage-400 hover:bg-sage-600 hover:text-white hover:border-sage-600 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 tracking-wider uppercase">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sage-400 hover:text-sage-200 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-sage-600 flex-shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Skin Conditions — Dr. Pratima's specialty */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 tracking-wider uppercase">
              {locale === "hi" ? "त्वचा रोग उपचार" : locale === "mr" ? "त्वचा विकार उपचार" : "Skin Conditions"}
            </h3>
            <ul className="space-y-2.5">
              {skinConditions.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sage-400 hover:text-sage-200 text-sm transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0" />
                    {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/conditions"
                  className="text-teal-400 hover:text-teal-300 text-xs mt-1 inline-block transition-colors"
                >
                  {locale === "hi" ? "सभी बीमारियां →" : locale === "mr" ? "सर्व आजार →" : "View all conditions →"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 tracking-wider uppercase">
              {t.footer.contactLabel}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                <span className="text-sage-400 text-sm leading-snug">
                  [Your Clinic Address],<br />
                  {locale === "hi" ? "कल्याण, महाराष्ट्र 421301" : locale === "mr" ? "कल्याण, महाराष्ट्र ४२१३०१" : "Kalyan, Maharashtra 421301"}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sage-500 flex-shrink-0" />
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="text-sage-400 hover:text-sage-200 text-sm transition-colors"
                >
                  +91 XXXXX XXXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sage-500 flex-shrink-0" />
                <a
                  href="mailto:info@pratimaagale.in"
                  className="text-sage-400 hover:text-sage-200 text-sm transition-colors"
                >
                  info@pratimaagale.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                <div className="text-sage-400 text-sm leading-relaxed">
                  <div>{t.contact.monFri}</div>
                  <div>{t.contact.sat}</div>
                  <div className="text-sage-600">{t.contact.sun}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-sage-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sage-600 text-xs">
            © {new Date().getFullYear()} Dr. Pratima Agale Homeopathy. {t.footer.rights}
          </p>
          <p className="text-sage-700 text-xs">
            {locale === "hi"
              ? "कल्याण · अंधेरी · मुंबई · महाराष्ट्र में सेवा"
              : locale === "mr"
              ? "कल्याण · अंधेरी · मुंबई · महाराष्ट्र येथे सेवा"
              : "Serving Kalyan · Andheri · Mumbai · Maharashtra"}
          </p>
        </div>
      </div>
    </footer>
  );
}
