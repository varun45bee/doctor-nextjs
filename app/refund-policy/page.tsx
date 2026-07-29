import { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Refund Policy | Dr. Pratima Agale Homeopathy",
  description: "Refund policy for Dr. Pratima Agale Homeopathy Clinic in Kalyan. Information about consultation fee refunds, medicine returns, and payment reversals.",
  alternates: {
    canonical: "https://pratimaagale.in/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-sage-900 mb-8">Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sage-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Consultation Fee Refunds</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Consultation fees are non-refundable once the consultation has been completed</li>
              <li>If you cancel your appointment at least 24 hours before the scheduled time, you may reschedule without additional charges</li>
              <li>Cancellations made less than 24 hours before the appointment may incur a 50% cancellation fee</li>
              <li>No-show appointments (without prior cancellation) are not eligible for refunds</li>
              <li>In case of doctor unavailability, full refund or rescheduling will be offered</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. Medicine Returns</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Homeopathic medicines are custom-prepared and cannot be returned or exchanged</li>
              <li>Refunds for medicines are only provided if there is a manufacturing defect or incorrect dispensing</li>
              <li>Any concerns about medicines must be reported within 48 hours of purchase</li>
              <li>Opened medicine bottles or partially used medicines are not eligible for refunds</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Online Payment Refunds</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Refunds for online payments will be processed within 7-10 working days</li>
              <li>Refunds will be credited to the original payment method used</li>
              <li>Bank processing times may vary depending on your bank</li>
              <li>A refund confirmation will be sent via email once processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Package Deals & Treatment Plans</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Package deals and treatment plans are non-refundable once initiated</li>
              <li>If you wish to discontinue a treatment plan, no refund will be provided for unused sessions</li>
              <li>Medical emergencies or doctor-recommended discontinuations may be reviewed on a case-by-case basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Refund Process</h2>
            <p className="text-sage-700 mb-4">To request a refund, please follow these steps:</p>
            <ol className="list-decimal pl-6 text-sage-700 space-y-2">
              <li>Contact us via email at info@pratimaagale.in or call +91 93598 75511</li>
              <li>Provide your appointment details, payment reference, and reason for refund request</li>
              <li>Our team will review your request within 2-3 working days</li>
              <li>Upon approval, the refund will be processed within 7-10 working days</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Exceptions</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Refunds may be denied if the request is made beyond the specified time frame</li>
              <li>Refunds may be denied if the service has been fully utilized</li>
              <li>Refunds may be denied if the terms and conditions were violated</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Contact Information</h2>
            <p className="text-sage-700 mb-2">
              For refund-related queries, please contact us:
            </p>
            <ul className="list-none text-sage-700 space-y-1">
              <li><strong>Email:</strong> info@pratimaagale.in</li>
              <li><strong>Phone:</strong> +91 93598 75511</li>
              <li><strong>Address:</strong> Yogidham, Phase 3, Kalyan, Maharashtra 421301</li>
            </ul>
          </section>

          <section className="bg-sage-50 p-6 rounded-lg border border-sage-200">
            <h2 className="text-xl font-semibold text-sage-800 mb-3">Important Note</h2>
            <p className="text-sage-700">
              This refund policy is subject to change without prior notice. Please check this page regularly for updates. For any clarifications, please contact our clinic directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
