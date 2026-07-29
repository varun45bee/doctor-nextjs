import { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions | Dr. Pratima Agale Homeopathy",
  description: "Terms and conditions for Dr. Pratima Agale Homeopathy Clinic in Kalyan. Information about appointments, consultations, payments, and patient responsibilities.",
  alternates: {
    canonical: "https://pratimaagale.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-sage-900 mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sage-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Introduction</h2>
            <p className="text-sage-700 mb-4">
              Welcome to Dr. Pratima Agale Homeopathy Clinic. By using our website, booking appointments, or availing our services, you agree to these terms and conditions. Please read them carefully.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Medical Disclaimer</h2>
            <p className="text-sage-700 mb-4">
              The information provided on this website is for educational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
            <p className="text-sage-700">
              Homeopathic treatment may not be suitable for all conditions. In case of medical emergencies, please visit the nearest hospital or emergency services immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Appointments & Consultations</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Appointments can be booked online through our website or via phone at +91 93598 75511</li>
              <li>Patients are requested to arrive 10 minutes before their scheduled appointment time</li>
              <li>For online consultations, patients must ensure stable internet connection and proper lighting</li>
              <li>Cancellations or rescheduling should be done at least 24 hours prior to the appointment</li>
              <li>Failure to cancel within 24 hours may result in cancellation charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Payment Terms</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Consultation fees must be paid before or at the time of appointment</li>
              <li>We accept cash, UPI, card payments, and online bank transfers</li>
              <li>Medicine costs are separate from consultation fees</li>
              <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes</li>
              <li>Refunds are subject to our Refund Policy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Patient Responsibilities</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Provide accurate and complete medical history</li>
              <li>Follow the prescribed treatment plan as directed</li>
              <li>Inform the doctor about any changes in symptoms or new medications</li>
              <li>Attend follow-up appointments as recommended</li>
              <li>Maintain confidentiality of your medical records</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Privacy & Data Protection</h2>
            <p className="text-sage-700 mb-4">
              Your personal and medical information is handled in accordance with our Privacy Policy. We maintain strict confidentiality of all patient records and do not share your information with third parties without your consent, except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Intellectual Property</h2>
            <p className="text-sage-700 mb-4">
              All content on this website, including text, images, logos, and design, is the property of Dr. Pratima Agale Homeopathy Clinic and is protected by copyright laws. Unauthorized use, reproduction, or distribution is prohibited.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">8. Limitation of Liability</h2>
            <p className="text-sage-700 mb-4">
              Dr. Pratima Agale Homeopathy Clinic shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services or website. Our liability is limited to the consultation fee paid by the patient.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">9. Changes to Terms</h2>
            <p className="text-sage-700">
              We reserve the right to modify these terms and conditions at any time. Changes will be posted on this page with an updated revision date. Your continued use of our services constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">10. Contact Information</h2>
            <p className="text-sage-700 mb-2">
              For any questions regarding these terms and conditions, please contact us:
            </p>
            <ul className="list-none text-sage-700 space-y-1">
              <li><strong>Email:</strong> info@pratimaagale.in</li>
              <li><strong>Phone:</strong> +91 93598 75511</li>
              <li><strong>Address:</strong> Yogidham, Phase 3, Kalyan, Maharashtra 421301</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
