import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbaseWidget from "./ChatbaseWidget";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://pratimaagale.in"),
  title: {
    default: "Dr. Pratima Agale | Best Homeopathy Doctor in Kalyan, Mumbai",
    template: "%s | Dr. Pratima Agale Homeopathy Kalyan",
  },
  description:
    "Dr. Pratima Agale (BHMS, MD) — Expert homeopathic treatment in Kalyan, Andheri & Mumbai. Specializing in Women's Health, Pediatric Care, PCOD, Thyroid, Chronic Diseases. Book your consultation today.",
  keywords: [
    "homeopathy doctor kalyan",
    "best homeopathy doctor mumbai",
    "homeopathy andheri",
    "homeopathy doctor maharashtra",
    "PCOD homeopathy treatment",
    "thyroid homeopathy kalyan",
    "pediatric homeopathy mumbai",
    "Dr Pratima Agale",
    "homeopathic clinic kalyan",
    "chronic disease homeopathy",
    "women health homeopathy",
    "होम्योपैथी कल्याण",
    "होमिओपॅथी कल्याण",
  ],
  authors: [{ name: "Dr. Pratima Agale", url: "https://pratimaagale.in" }],
  creator: "Dr. Pratima Agale",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://pratimaagale.in",
    siteName: "Dr. Pratima Agale Homeopathy",
    title: "Dr. Pratima Agale | Best Homeopathy Doctor in Kalyan, Mumbai",
    description:
      "Expert homeopathic treatment for women's health, pediatric care & chronic diseases. Serving Kalyan, Andheri, and all of Mumbai.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Pratima Agale | Homeopathy Doctor Kalyan",
    description: "Expert homeopathic care in Kalyan, Mumbai. Book now.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://pratimaagale.in" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://pratimaagale.in",
  name: "Dr. Pratima Agale Homeopathy Clinic",
  description:
    "Expert homeopathic treatment in Kalyan, Mumbai by Dr. Pratima Agale (BHMS, MD)",
  url: "https://pratimaagale.in",
  telephone: "+91-XXXXXXXXXX",
  priceRange: "₹₹",
  image: "https://pratimaagale.in/og-image.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "[Clinic Address]",
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
  hasMap: "https://maps.google.com/?q=Kalyan,Maharashtra",
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LanguageProvider>

        {/* WhatsApp floating button — sits above the Chatbase bubble */}

        {/* Chatbase chatbot widget */}
        <ChatbaseWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}