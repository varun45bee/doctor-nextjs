import { Metadata } from "next";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cancellation Policy | Dr. Pratima Agale Homeopathy",
  description: "Cancellation policy for Dr. Pratima Agale Homeopathy Clinic in Kalyan. Information about appointment cancellations, rescheduling, and cancellation charges.",
  alternates: {
    canonical: "https://pratimaagale.in/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-sage-900 mb-8">Cancellation Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-sage-600 mb-6">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">1. Appointment Cancellations</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Cancellations must be made at least 24 hours before the scheduled appointment time</li>
              <li>Cancellations made with 24+ hours notice: No cancellation charges, free rescheduling</li>
              <li>Cancellations made less than 24 hours before appointment: 50% cancellation fee applies</li>
              <li>No-show appointments (without prior notice): Full consultation fee charged</li>
              <li>Multiple no-shows may result in loss of future booking privileges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">2. How to Cancel or Reschedule</h2>
            <p className="text-sage-700 mb-4">You can cancel or reschedule your appointment through:</p>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li><strong>Website:</strong> Log in to your patient portal and manage your appointment</li>
              <li><strong>Phone:</strong> Call us at +91 93598 75511 during clinic hours</li>
              <li><strong>WhatsApp:</strong> Send a message to +91 93598 75511</li>
              <li><strong>Email:</strong> Send cancellation request to info@pratimaagale.in</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">3. Online Consultation Cancellations</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Same 24-hour cancellation policy applies to online consultations</li>
              <li>Technical issues must be reported 15 minutes before the scheduled time</li>
              <li>If the doctor is unable to connect due to technical reasons, rescheduling will be offered at no charge</li>
              <li>Patient must ensure stable internet connection and proper device setup</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">4. Treatment Plan Cancellations</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Treatment plans and packages are non-refundable once initiated</li>
              <li>If you wish to discontinue treatment, no refund will be provided for remaining sessions</li>
              <li>Medical emergencies may be reviewed on a case-by-case basis with proper documentation</li>
              <li>Doctor-recommended treatment changes will be accommodated without penalty</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">5. Emergency Cancellations</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>Medical emergencies will be considered with proper documentation</li>
              <li>Please provide medical certificate or hospital discharge papers for emergency cancellations</li>
              <li>Emergency cancellations will be reviewed individually and may qualify for fee waiver</li>
              <li>Notification should be made as soon as possible, even after the appointment time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">6. Doctor Unavailability</h2>
            <ul className="list-disc pl-6 text-sage-700 space-y-2">
              <li>If the doctor cancels due to emergency or unavailability, full refund or free rescheduling will be offered</li>
              <li>Patients will be notified as soon as possible about doctor unavailability</li>
              <li>Priority rescheduling will be provided for affected appointments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">7. Cancellation Charges</h2>
            <div className="bg-sage-50 p-4 rounded-lg border border-sage-200 mb-4">
              <table className="w-full text-sage-700">
                <thead>
                  <tr>
                    <th className="text-left py-2">Notice Period</th>
                    <th className="text-left py-2">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">24+ hours before appointment</td>
                    <td className="py-2">No charge</td>
                  </tr>
                  <tr>
                    <td className="py-2">Less than 24 hours</td>
                    <td className="py-2">50% of consultation fee</td>
                  </tr>
                  <tr>
                    <td className="py-2">No-show</td>
                    <td className="py-2">100% of consultation fee</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-sage-800 mb-4">8. Contact Information</h2>
            <p className="text-sage-700 mb-2">
              For cancellation-related queries, please contact us:
            </p>
            <ul className="list-none text-sage-700 space-y-1">
              <li><strong>Email:</strong> info@pratimaagale.in</li>
              <li><strong>Phone:</strong> +91 93598 75511</li>
              <li><strong>WhatsApp:</strong> +91 93598 75511</li>
              <li><strong>Address:</strong> Yogidham, Phase 3, Kalyan, Maharashtra 421301</li>
            </ul>
          </section>

          <section className="bg-sage-50 p-6 rounded-lg border border-sage-200">
            <h2 className="text-xl font-semibold text-sage-800 mb-3">Important Note</h2>
            <p className="text-sage-700">
              This cancellation policy is subject to change without prior notice. Please check this page regularly for updates. We appreciate your understanding and cooperation in helping us maintain efficient scheduling for all patients.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
