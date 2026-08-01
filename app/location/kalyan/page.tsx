import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import MedicalDisclaimer from "@/components/seo/MedicalDisclaimer";
import { MapPin, Phone, Clock, Star, Award, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Homeopathy Doctor in Kalyan | Dr. Pratima Agale MD Homeopathy",
  description: "Best homeopathy doctor in Kalyan - Dr. Pratima Agale (BHMS, MD). Expert in women's health, PCOS, thyroid, fertility, pediatric & chronic conditions. Clinic at Yogidham Phase 3, Kalyan.",
  keywords: [
    "homeopathy doctor kalyan",
    "best homeopathy doctor in kalyan",
    "lady homeopathy doctor kalyan",
    "female homeopathy doctor kalyan",
    "MD homeopathy doctor kalyan",
    "homeopathy clinic kalyan",
    "homeopathy doctor kalyan west",
    "homeopathy doctor kalyan east",
    "homeopathy doctor near kalyan station",
    "women homeopathy doctor kalyan",
    "PCOS homeopathy treatment kalyan",
    "thyroid homeopathy kalyan",
    "pediatric homeopathy kalyan",
  ],
  alternates: {
    canonical: "https://www.pratimaagale.in/location/kalyan",
  },
  openGraph: {
    title: "Homeopathy Doctor in Kalyan | Dr. Pratima Agale MD Homeopathy",
    description: "MD-qualified lady homeopathy doctor in Kalyan. Expert in women's health, PCOS, thyroid, fertility & pediatric care. Located at Yogidham Phase 3.",
    url: "https://www.pratimaagale.in/location/kalyan",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Dr. Pratima Agale - Homeopathy Doctor Kalyan" }],
  },
};

export default function KalyanLocationPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sage-50 to-sage-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-4">
            Best Homeopathy Doctor in Kalyan
          </h1>
          <p className="text-xl text-sage-700 mb-6 max-w-3xl">
            Dr. Pratima Agale (BHMS, MD Homeopathy) - Your trusted lady homeopathy doctor in Kalyan. 
            Specializing in women's health, PCOS, thyroid, fertility, pediatric care & chronic diseases.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Book Appointment
            </Link>
            <a
              href="tel:+919359875511"
              className="inline-flex items-center gap-2 border-2 border-sage-600 text-sage-700 px-6 py-3 rounded-full hover:bg-sage-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 93598 75511
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* About the Clinic */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-6">About Our Kalyan Homeopathy Clinic</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sage-700 mb-4 leading-relaxed">
                Located at <strong>Yogidham, Phase 3, Kalyan</strong>, Dr. Pratima Agale Homeopathy Clinic is one of the most trusted homeopathy clinics in the region. 
                Dr. Pratima Agale is an MD-qualified lady homeopathy doctor with extensive experience in treating women's health conditions, 
                pediatric cases, and chronic diseases.
              </p>
              <p className="text-sage-700 mb-4 leading-relaxed">
                Our clinic serves patients from across Kalyan (East and West), Dombivli, Ulhasnagar, Thane, and Mumbai. 
                We offer both in-person consultations at our Kalyan clinic and online consultations for patients who cannot visit in person.
              </p>
              <p className="text-sage-700 leading-relaxed">
                With a patient-centric approach and individualized treatment plans, we ensure that every patient receives personalized care 
                tailored to their specific health needs.
              </p>
            </div>
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-xl font-semibold text-sage-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sage-700">MD-qualified lady homeopathy doctor</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sage-700">Specialized in women's health & pediatric care</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sage-700">Individualized treatment plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sage-700">Online consultations available</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sage-700">Convenient location in Yogidham, Kalyan</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Treatments Offered */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-6">Treatments Available at Our Kalyan Clinic</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-sage-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sage-900 mb-3">Women's Health</h3>
              <ul className="text-sage-700 space-y-2">
                <li>• PCOS/PCOD Treatment</li>
                <li>• Thyroid Disorders</li>
                <li>• Hormonal Imbalance</li>
                <li>• Infertility Treatment</li>
                <li>• Menopause Management</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border border-sage-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sage-900 mb-3">Pediatric Care</h3>
              <ul className="text-sage-700 space-y-2">
                <li>• Child Immunity</li>
                <li>• ADHD Treatment</li>
                <li>• Allergies & Asthma</li>
                <li>• Tonsillitis</li>
                <li>• Bedwetting</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg border border-sage-200 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-sage-900 mb-3">Chronic Diseases</h3>
              <ul className="text-sage-700 space-y-2">
                <li>• Arthritis</li>
                <li>• Migraines</li>
                <li>• Skin Diseases</li>
                <li>• Digestive Disorders</li>
                <li>• Respiratory Issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clinic Location & Contact */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-6">Visit Our Kalyan Clinic</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-xl font-semibold text-sage-900 mb-4">Clinic Address</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sage-700">
                    <p className="font-medium">Dr. Pratima Agale Homeopathy Clinic</p>
                    <p>Yogidham, Phase 3</p>
                    <p>Kalyan, Maharashtra 421301</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  <a href="tel:+919359 75511" className="text-sage-700 hover:text-sage-900">
                    +91 93598 75511
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sage-700">
                    <p className="font-medium">Clinic Hours:</p>
                    <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                    <p>Saturday: 9:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-xl font-semibold text-sage-900 mb-4">Nearby Landmarks</h3>
              <ul className="text-sage-700 space-y-2">
                <li>• Near Kalyan Railway Station</li>
                <li>• Close to Bhiwandi Road</li>
                <li>• Accessible from Kalyan East & West</li>
                <li>• Well-connected by local transport</li>
                <li>• Parking available</li>
              </ul>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-sage-600 text-white px-6 py-3 rounded-full hover:bg-sage-700 transition-colors"
                >
                  Get Directions
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Areas We Serve */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-6">Areas We Serve in Kalyan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Kalyan East",
              "Kalyan West",
              "Dombivli East",
              "Dombivli West",
              "Ulhasnagar",
              "Ambarnath",
              "Badlapur",
              "Thane",
            ].map((area) => (
              <div key={area} className="bg-sage-50 p-4 rounded-lg border border-sage-200 text-center">
                <span className="text-sage-700 font-medium">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-2">
                Where is your homeopathy clinic located in Kalyan?
              </h3>
              <p className="text-sage-700">
                Our clinic is located at Yogidham, Phase 3, Kalyan, Maharashtra 421301. It's easily accessible from both Kalyan East and Kalyan West railway stations.
              </p>
            </div>
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-2">
                Do you offer online consultations for patients in Kalyan?
              </h3>
              <p className="text-sage-700">
                Yes, we offer online homeopathy consultations for patients who cannot visit our Kalyan clinic in person. You can book an online appointment through our website.
              </p>
            </div>
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-2">
                What are your clinic timings in Kalyan?
              </h3>
              <p className="text-sage-700">
                Our Kalyan clinic is open Monday to Friday from 9:00 AM to 8:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.
              </p>
            </div>
            <div className="bg-sage-50 p-6 rounded-lg border border-sage-200">
              <h3 className="text-lg font-semibold text-sage-900 mb-2">
                Do you treat children at your Kalyan clinic?
              </h3>
              <p className="text-sage-700">
                Yes, Dr. Pratima Agale specializes in pediatric homeopathy and treats various childhood conditions including ADHD, allergies, asthma, tonsillitis, and immunity issues.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-sage-600 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Homeopathy Treatment?</h2>
          <p className="mb-6 text-sage-100">
            Book an appointment at our Kalyan clinic or schedule an online consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-sage-700 px-6 py-3 rounded-full hover:bg-sage-50 transition-colors font-medium"
            >
              Book Appointment
            </Link>
            <a
              href="tel:+919359875511"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-sage-700 transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </section>
      </div>

      <MedicalDisclaimer lastUpdated={new Date()} />
    </div>
  );
}
