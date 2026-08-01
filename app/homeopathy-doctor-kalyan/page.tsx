import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, MapPin, Phone, Clock } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Homeopathy Doctor in Kalyan | Dr. Pratima Agale MD – Best Lady Homeopath",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — best homeopathy doctor in Kalyan West & East. Expert in women's health, PCOS, thyroid, pediatric care. Female homeopathy specialist at Yogidham Phase 3. Book consultation today.",
  keywords: [
    "homeopathy doctor kalyan",
    "best homeopathy doctor in kalyan",
    "lady homeopathy doctor kalyan",
    "female homeopathy doctor kalyan",
    "homeopathy doctor kalyan west",
    "homeopathy doctor kalyan east",
    "homeopathy clinic kalyan",
    "homeopathy doctor near kalyan station",
    "women homeopathy doctor kalyan",
    "PCOS homeopathy kalyan",
    "thyroid homeopathy kalyan",
    "child homeopathy doctor kalyan",
    "pediatric homeopathy kalyan",
    "homeopathy doctor dombivli",
    "homeopathy doctor thane",
    "MD homeopathy doctor kalyan",
    "कल्याण होमिओपॅथी डॉक्टर",
  ],
  alternates: { canonical: "https://pratimaagale.in/homeopathy-doctor-kalyan" },
  openGraph: {
    title: "Homeopathy Doctor in Kalyan | Dr. Pratima Agale MD – Best Lady Homeopath",
    description: "Best homeopathy doctor in Kalyan. MD-qualified lady homeopathy specialist for women's health, PCOS, thyroid, pediatric care. Located at Yogidham Phase 3, Kalyan.",
    url: "https://pratimaagale.in/homeopathy-doctor-kalyan",
  },
};

// ─── JSON-LD: LocalBusiness for Kalyan ───────────────────────────────────────
const kalyanBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "@id": "https://pratimaagale.in/homeopathy-doctor-kalyan",
  name: "Dr. Pratima Agale Homeopathy Clinic Kalyan",
  description: "MD-qualified lady homeopathy doctor in Kalyan specializing in women's health, PCOS, thyroid, fertility, pediatric care and chronic diseases.",
  url: "https://pratimaagale.in",
  telephone: "+91-9359875511",
  priceRange: "₹₹",
  image: "https://pratimaagale.in/og-image.jpg",
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
  areaServed: [
    { "@type": "City", name: "Kalyan" },
    { "@type": "City", name: "Kalyan West" },
    { "@type": "City", name: "Kalyan East" },
    { "@type": "City", name: "Dombivli" },
    { "@type": "City", name: "Thane" },
  ],
  hasMap: "https://maps.google.com/?q=Yogidham+Phase+3+Kalyan+Maharashtra",
};

const services = [
  "Women's Health & PCOS Treatment",
  "Thyroid Disorder Treatment",
  "Pediatric Homeopathy",
  "Skin Disease Treatment",
  "Chronic Disease Management",
  "Hair Fall Treatment",
  "Migraine Treatment",
  "Arthritis & Joint Pain",
];

const areas = [
  "Kalyan West",
  "Kalyan East",
  "Near Kalyan Station",
  "Shivaji Nagar",
  "Gandhi Nagar",
  "Dombivli East",
  "Dombivli West",
  "Thane West",
];

export default function HomeopathyDoctorKalyanPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pratimaagale.in" },
          { name: "Homeopathy Doctor Kalyan", item: "https://pratimaagale.in/homeopathy-doctor-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(kalyanBusinessSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🏥</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Homeopathy Doctor in Kalyan
            <span className="block italic text-sage-500">Dr. Pratima Agale MD</span>
          </h1>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            Best lady homeopathy doctor in Kalyan West & East. BHMS, MD Homeopathy specialist for women's health,
            PCOS, thyroid, pediatric care, and chronic diseases. Located at Yogidham Phase 3.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-sage-600 transition-all"
            >
              Book Appointment
            </a>
            <a
              href="tel:+919359875511"
              className="inline-flex items-center gap-2 border-2 border-sage-300 px-8 py-3.5 rounded-full font-medium transition-all hover:bg-sage-50"
              style={{ color: "var(--text-secondary)" }}
            >
              <Phone className="w-4 h-4" />
              +91-9359875511
            </a>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Location</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Yogidham, Phase 3<br />
                Kalyan, Maharashtra 421301
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Clinic Hours</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Mon-Fri: 9 AM - 8 PM<br />
                Saturday: 9 AM - 2 PM<br />
                Sunday: Closed
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Contact</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                +91-9359875511<br />
                Online & In-Person<br />
                Consultations Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Homeopathy Services in Kalyan
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas Served */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Areas Served in Kalyan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map((area) => (
              <div
                key={area}
                className="rounded-xl p-4 text-center border"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <MapPin className="w-5 h-5 text-sage-500 mx-auto mb-2" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Why Choose Dr. Pratima Agale?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>MD-Qualified Expert</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                BHMS and MD in Homeopathy — one of the few postgraduate-qualified homeopathy doctors in Kalyan.
              </p>
            </div>
            <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Lady Homeopathy Doctor</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Female homeopathy specialist for women's health, PCOS, thyroid, and pediatric care with compassionate approach.
              </p>
            </div>
            <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Individualized Treatment</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Every prescription is uniquely crafted for your constitution, symptoms, and lifestyle.
              </p>
            </div>
            <div className="p-6 rounded-xl border" style={{ borderColor: "var(--border-color)" }}>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Zero Side Effects</h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Natural remedies designed to support healing gently and sustainably without side effects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Visit Our Kalyan Clinic
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale at Yogidham Phase 3, Kalyan.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20at%20your%20Kalyan%20clinic."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Kalyan Appointment
          </a>
        </div>
      </section>
    </div>
  );
}
