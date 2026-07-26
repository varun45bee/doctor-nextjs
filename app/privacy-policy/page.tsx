export const metadata = {
  title: "Privacy Policy | Dr. Pratima Agale's Homeopathy Clinic",
  description: "Privacy policy for Dr. Pratima Agale's Homeopathy Clinic WhatsApp assistant and website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen py-16 px-4" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12" style={{ backgroundColor: "var(--bg-surface)" }}>
          <h1 className="text-4xl md:text-5xl font-semibold mb-2" style={{ 
            fontFamily: "Cormorant Garamond, serif",
            color: "var(--text-primary)" 
          }}>
            Privacy Policy
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Last updated: July 2026
          </p>

          <div className="prose prose-lg max-w-none" style={{ color: "var(--text-primary)" }}>
            <p className="text-lg leading-relaxed mb-6">
              Dr. Pratima Agale's Homeopathy Clinic ("we", "us", "our") respects your privacy
              and is committed to protecting your personal information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              Information We Collect
            </h2>
            <p className="leading-relaxed mb-6">
              When you message our WhatsApp assistant, we collect your phone number, name
              (if shared via WhatsApp), and the content of your messages.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              How We Use Your Information
            </h2>
            <p className="leading-relaxed mb-6">
              We use this information solely to respond to your inquiries, provide information
              about our clinic and services, and facilitate appointment scheduling. We do not
              sell or share your personal information with third parties for marketing purposes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              Data Storage
            </h2>
            <p className="leading-relaxed mb-6">
              Messages are processed to generate responses and may be temporarily logged for
              service improvement and support purposes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              Third-Party Services
            </h2>
            <p className="leading-relaxed mb-6">
              We use the WhatsApp Business API (provided by Meta) to deliver messages, and
              third-party AI services to generate responses to your inquiries.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              Your Rights
            </h2>
            <p className="leading-relaxed mb-6">
              You may request deletion of your data or ask questions about how your information
              is used by contacting us using the details below.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4" style={{ 
              fontFamily: "Cormorant Garamond, serif",
              color: "var(--sage-mid)" 
            }}>
              Contact Us
            </h2>
            <p className="leading-relaxed">
              For any privacy-related questions, contact us at{" "}
              <a 
                href="tel:+917045532232" 
                className="font-medium hover:underline"
                style={{ color: "var(--teal)" }}
              >
                +91 70455 32232
              </a>{" "}
              or visit{" "}
              <a 
                href="https://www.pratimaagale.in/" 
                className="font-medium hover:underline"
                style={{ color: "var(--teal)" }}
              >
                https://www.pratimaagale.in/
              </a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
