import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { AppointmentProvider } from "@/lib/appointment-context";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import MotionProvider from "@/components/animations/MotionProvider";
import PageTransition from "@/components/animations/PageTransition";
import ScrollProgressBar from "@/components/animations/ScrollProgressBar";
import SiteChrome from "@/components/SiteChrome";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pratimaagale.in"),
  title: {
    default: "Dr. Pratima Agale | Best Women Homeopathy Doctor in Kalyan, Mumbai",
    template: "%s | Dr. Pratima Agale – MD Homeopathy Kalyan",
  },
  description:
    "Dr. Pratima Agale (BHMS, MD Homeopathy) — Kalyan's trusted lady homeopathy doctor. Expert in women's health, PCOS, thyroid, fertility & pediatric care. Female homeopathy specialist near you in Kalyan, Thane & Mumbai. Book consultation today.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    // Women doctor — high intent
    "women homeopathy doctor near me",
    "best women homeopathy doctor in kalyan",
    "lady homeopathy doctor kalyan",
    "female homeopathy doctor kalyan",
    "female homeopathy specialist kalyan",
    "lady doctor homeopathy mumbai",
    "women homeopathy specialist thane",
    "best lady homeopathy doctor near me",

    // MD qualification — differentiator
    "MD homeopathy doctor kalyan",
    "MD homeopath kalyan",
    "MD homeopathy doctor mumbai",
    "homeopathy MD doctor near me",
    "qualified homeopathy doctor kalyan",

    // Women's health conditions
    "PCOS homeopathy treatment kalyan",
    "PCOD homeopathy treatment kalyan",
    "homeopathy for irregular periods kalyan",
    "hormonal imbalance homeopathy kalyan",
    "fertility homeopathy treatment kalyan",
    "menopause homeopathy treatment",
    "thyroid homeopathy kalyan",
    "thyroid treatment homeopathy mumbai",
    "homeopathy for weight loss kalyan",
    "hair fall homeopathy treatment kalyan",

    // Location-based
    "homeopathy doctor kalyan west",
    "homeopathy doctor kalyan east",
    "homeopathy clinic kalyan",
    "homeopathy doctor near kalyan station",
    "homeopathy doctor dombivli",
    "homeopathy doctor ulhasnagar",
    "homeopathy doctor thane",
    "homeopathic clinic mumbai",
    "homeopathy doctor andheri",

    // General + brand
    "best homeopathy doctor in kalyan",
    "best homeopathy doctor mumbai",
    "Dr Pratima Agale",
    "Pratima Agale homeopathy",
    "www.pratimaagale.in",
    "homeopathy doctor maharashtra",

    // Pediatric
    "child homeopathy doctor kalyan",
    "pediatric homeopathy kalyan",
    "homeopathy for kids kalyan",
    "children homeopathy specialist mumbai",

    // Chronic & skin
    "skin disease homeopathy kalyan",
    "eczema psoriasis homeopathy kalyan",
    "chronic disease homeopathy",
    "arthritis homeopathy kalyan",
    "migraine homeopathy treatment kalyan",
    "acne skin homeopathy doctor kalyan",

    // Multilingual
    "होम्योपैथी कल्याण",
    "होमिओपॅथी कल्याण",
    "महिला होम्योपैथी डॉक्टर कल्याण",
    "कल्याण होमिओपॅथी डॉक्टर",
  ],
  authors: [{ name: "Dr. Pratima Agale", url: "https://www.pratimaagale.in" }],
  creator: "Dr. Pratima Agale",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.pratimaagale.in",
    siteName: "Dr. Pratima Agale Homeopathy",
    title: "Dr. Pratima Agale | Best Women Homeopathy Doctor in Kalyan, Mumbai",
    description:
      "MD-qualified lady homeopathy doctor in Kalyan. Expert in women's health, PCOS, thyroid, fertility, pediatric & chronic conditions. Serving Kalyan, Thane & Mumbai.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Dr. Pratima Agale - MD Homeopathy Doctor Kalyan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Pratima Agale | Women's Homeopathy Doctor Kalyan",
    description: "MD Homeopathy specialist for women's health, PCOS, thyroid & more. Serving Kalyan, Thane & Mumbai.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.pratimaagale.in" },
  verification: {
    google: "rUFOpHprIt9o12JZzBLtWNzJomB2Y01Wy_ZSLwbg_lY",
  },
  category: "Health",
};

export const viewport = {
  themeColor: "#5a7f5a",
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem("theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = saved || (prefersDark ? "dark" : "light");
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      document.documentElement.style.colorScheme = theme;
    } catch (error) {}
  })();
`;

// ─── Schema 1: Medical Business (Local SEO) ───────────────────────────────────
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://www.pratimaagale.in#medicalbusiness",
  name: "Dr. Pratima Agale Homeopathy Clinic",
  description:
    "MD-qualified lady homeopathy doctor in Kalyan specializing in women's health, PCOS, thyroid, fertility, pediatric care and chronic diseases.",
  url: "https://www.pratimaagale.in",
  telephone: "+91-9359875511",
  priceRange: "₹₹",
  image: "https://www.pratimaagale.in/og-image.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yogidham, Phase 3",
    addressLocality: "Kalyan",
    addressRegion: "Maharashtra",
    postalCode: "421301",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 19.2403,
    longitude: 73.1305,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  medicalSpecialty: "Homeopathy",
  hasMap: "https://maps.google.com/?q=Yogidham+Phase+3+Kalyan+Maharashtra",
  sameAs: [
    "https://www.linkedin.com/in/pratima-agale-2a26101a4/",
    "https://www.instagram.com/dr_pratimaagale/",
  ],
  areaServed: [
    { "@type": "City", name: "Kalyan" },
    { "@type": "City", name: "Dombivli" },
    { "@type": "City", name: "Thane" },
    { "@type": "City", name: "Ulhasnagar" },
    { "@type": "City", name: "Mumbai" },
    { "@type": "City", name: "Ambernath" },
    { "@type": "City", name: "Badlapur" },
    { "@type": "City", name: "Navi Mumbai" },
  ],
};

// ─── Schema 2: Doctor / Person (MD credentials) ──────────────────────────────
const doctorSchema = {
  "@context": "https://schema.org",
  "@type": "Physician",
  "@id": "https://www.pratimaagale.in#physician",
  name: "Dr. Pratima Agale",
  description:
    "Dr. Pratima Agale is an MD-qualified lady homeopathy doctor in Kalyan, Mumbai. She specializes in women's health (PCOS, thyroid, hormonal imbalance, fertility), pediatric homeopathy, skin diseases and chronic conditions.",
  url: "https://www.pratimaagale.in",
  image: "https://www.pratimaagale.in/og-image.png",
  telephone: "+91-9359875511",
  gender: "Female",
  jobTitle: "Homeopathic Physician",
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "BHMS (Bachelor of Homeopathic Medicine and Surgery)",
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "postgraduate degree",
      name: "MD (Doctor of Medicine) – Homeopathy",
    },
  ],
  medicalSpecialty: [
    "Homeopathy",
    "Women's Health",
    "Pediatrics",
    "Dermatology",
    "Chronic Disease Management",
  ],
  worksFor: {
    "@id": "https://www.pratimaagale.in#medicalbusiness",
    "@type": "MedicalBusiness",
    name: "Dr. Pratima Agale Homeopathy Clinic",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Yogidham, Phase 3",
      addressLocality: "Kalyan",
      addressRegion: "Maharashtra",
      postalCode: "421301",
      addressCountry: "IN",
    },
  },
  availableService: [
    { "@type": "MedicalTherapy", name: "Women's Health & PCOS Homeopathy" },
    { "@type": "MedicalTherapy", name: "Thyroid Disorder Homeopathy" },
    { "@type": "MedicalTherapy", name: "Pediatric Homeopathy" },
    { "@type": "MedicalTherapy", name: "Skin Disease Homeopathy" },
    { "@type": "MedicalTherapy", name: "Chronic Disease Homeopathy" },
    { "@type": "MedicalTherapy", name: "Fertility & Hormonal Homeopathy" },
  ],
  areaServed: [
    { "@type": "City", name: "Kalyan" },
    { "@type": "City", name: "Dombivli" },
    { "@type": "City", name: "Thane" },
    { "@type": "City", name: "Ulhasnagar" },
    { "@type": "City", name: "Mumbai" },
    { "@type": "City", name: "Ambernath" },
    { "@type": "City", name: "Badlapur" },
    { "@type": "City", name: "Navi Mumbai" },
  ],
  sameAs: [
    "https://www.linkedin.com/in/pratima-agale-2a26101a4/",
    "https://www.instagram.com/dr_pratimaagale/",
  ],
};

// ─── Schema 3: FAQ (targets "near me" & question searches) ───────────────────
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who is the best women homeopathy doctor in Kalyan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dr. Pratima Agale (BHMS, MD Homeopathy) is one of Kalyan's most trusted lady homeopathy doctors, specializing in women's health, PCOS, thyroid disorders, and hormonal imbalance. She is located at Yogidham Phase 3, Kalyan.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a female homeopathy doctor near me in Kalyan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dr. Pratima Agale is a qualified female (lady) homeopathy doctor in Kalyan, Maharashtra. She offers both in-person consultations in Kalyan and online consultations for patients across Mumbai and Thane.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy treat PCOS and hormonal imbalance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dr. Pratima Agale specializes in homeopathic treatment for PCOS, PCOD, irregular periods, thyroid disorders, and hormonal imbalances with individualized, side-effect-free remedies.",
      },
    },
    {
      "@type": "Question",
      name: "What is the qualification of Dr. Pratima Agale?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dr. Pratima Agale holds a BHMS (Bachelor of Homeopathic Medicine and Surgery) and an MD in Homeopathy, making her one of the few postgraduate-qualified homeopathy doctors in Kalyan.",
      },
    },
    {
      "@type": "Question",
      name: "Does Dr. Pratima Agale offer online homeopathy consultations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dr. Pratima Agale offers online homeopathy consultations for patients in Mumbai, Thane, Dombivli, Ulhasnagar and across Maharashtra. Book at pratimaagale.in.",
      },
    },
  ],
};

// ─── Schema 4: WebSite with SearchAction ───────────────────────────────────────
const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://www.pratimaagale.in",
  name: "Dr. Pratima Agale Homeopathy Clinic",
  description: "MD-qualified lady homeopathy doctor in Kalyan specializing in women's health, PCOS, thyroid, fertility, pediatric care and chronic diseases.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.pratimaagale.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "Dr. Pratima Agale Homeopathy Clinic",
    url: "https://www.pratimaagale.in",
  },
};

// ─── Schema 5: Organization ───────────────────────────────────────────────────
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dr. Pratima Agale Homeopathy Clinic",
  url: "https://www.pratimaagale.in",
  logo: "https://www.pratimaagale.in/logo.png",
  description: "MD-qualified lady homeopathy doctor in Kalyan specializing in women's health, PCOS, thyroid, fertility, pediatric care and chronic diseases.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Yogidham, Phase 3",
    addressLocality: "Kalyan",
    addressRegion: "Maharashtra",
    postalCode: "421301",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-9359875511",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi", "Marathi"],
  },
  sameAs: [
    "https://www.instagram.com/dr_pratimaagale/",
    "https://www.linkedin.com/in/pratima-agale-2a26101a4/",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(doctorSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <MotionProvider />
          <ScrollProgressBar />
          <AuthProvider>
            <LanguageProvider>
              <AppointmentProvider>
                <SiteChrome>
                  <PageTransition>{children}</PageTransition>
                </SiteChrome>
              </AppointmentProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}