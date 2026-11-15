import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Dr. Pratima Agale's Homeopathy Clinic",
  description:
    "Privacy Policy for Dr. Pratima Agale's Homeopathy Clinic website, patient portal, Google OAuth integration, and consultation services.",
};

export default function PrivacyPolicyPage() {
  return (
    <main
      className="min-h-screen py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl shadow-xl p-8 sm:p-12 border border-[var(--border-color)]"
          style={{ backgroundColor: "var(--bg-surface)" }}
        >
          {/* Header */}
          <div className="border-b border-[var(--border-color)] pb-8 mb-8">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-[#e6ede6] dark:bg-[#1f3629] text-[#184433] dark:text-emerald-300">
              Legal & Compliance
            </span>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-3"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "var(--text-primary)",
              }}
            >
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Last updated: November 14, 2026
            </p>
          </div>

          <div
            className="prose prose-lg max-w-none space-y-8"
            style={{ color: "var(--text-primary)" }}
          >
            {/* Introduction */}
            <section>
              <p className="text-base sm:text-lg leading-relaxed">
                Dr. Pratima Agale&apos;s Homeopathy Clinic (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;) is committed to protecting the privacy, confidentiality, and
                security of our patients and website visitors. This Privacy Policy describes how
                we collect, use, disclose, protect, and retain personal information when you visit
                our website (
                <a
                  href="https://www.pratimaagale.in"
                  className="font-medium underline hover:text-[#3a9e8c]"
                  style={{ color: "var(--teal)" }}
                >
                  https://www.pratimaagale.in
                </a>
                ), use our patient portal, interact with our clinic assistants, or sign in using
                third-party authentication services such as Google OAuth.
              </p>
            </section>

            {/* Google User Data Collection and Usage */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                1. Google User Data Collection and Usage
              </h2>
              <p className="leading-relaxed mb-4">
                Our website uses Google OAuth authentication to allow users (both patients and
                authorized clinical staff) to securely sign in using their Google accounts.
              </p>
              <p className="leading-relaxed mb-3">
                When users sign in using Google, we may collect the following information, subject
                to the explicit permissions and scopes granted:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Name:</strong> To identify you and personalize your consultation records
                  and patient dashboard.
                </li>
                <li>
                  <strong>Email address:</strong> To uniquely identify your account, send
                  appointment confirmations, provide video consultation access, and communicate
                  important clinic notifications.
                </li>
                <li>
                  <strong>Google account profile information:</strong> To verify authentication
                  status and maintain account security.
                </li>
                <li>
                  <strong>Profile picture:</strong> If available and authorized, to display your
                  avatar within your personal dashboard.
                </li>
              </ul>
              <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)]">
                <p className="text-sm font-medium leading-relaxed">
                  <strong>Purpose Limitation:</strong> We use Google user data strictly for
                  authentication, account creation, account management, and providing core healthcare website
                  services.
                </p>
              </div>
            </section>

            {/* Information Collected from Other Sources */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                2. Other Information We Collect
              </h2>
              <p className="leading-relaxed mb-3">
                In addition to Google OAuth data, we may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Consultation &amp; Appointment Details:</strong> Phone number, preferred
                  appointment date and time, telehealth video consultation details, delivery address for
                  medicine courier delivery, and health concerns or symptom summaries voluntarily provided
                  during booking or clinical intake.
                </li>
                <li>
                  <strong>WhatsApp &amp; Communication Channels:</strong> Phone number and message
                  content sent to our official clinic WhatsApp assistant (+91 93598 75511) to answer
                  inquiries and facilitate appointment bookings.
                </li>
                <li>
                  <strong>Payment Records:</strong> Transaction reference IDs, appointment payment
                  status, and receipts (we do not process or store sensitive payment card numbers
                  directly on our servers).
                </li>
              </ul>
            </section>

            {/* Data Sharing and Third-Party Services */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                3. With Whom We Share, Transfer, or Disclose Google User Data
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  We do not sell, rent, trade, or share Google user data with third parties for marketing, advertising, or profiling purposes.
                </p>
              </div>
              <p className="leading-relaxed mb-4">
                Dr. Pratima Agale&apos;s Homeopathy Clinic treats your information with the highest degree
                of confidentiality. We do not share, transfer, or disclose Google user data to any external
                parties, brokers, advertisers, or third-party AI models.
              </p>
              <p className="leading-relaxed mb-3">
                Google user data is transferred, shared, or disclosed <strong>only</strong> to the following trusted
                service providers strictly when necessary to operate our website and execute the core functionality of our healthcare
                services:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                <li>
                  <strong>Google Identity Services &amp; Firebase Authentication (Google LLC):</strong> Used
                  for secure single sign-on (SSO) authentication, ID token verification, account creation, and session
                  management.
                </li>
                <li>
                  <strong>Google Cloud Platform &amp; Firebase Firestore (Google LLC):</strong> Cloud
                  infrastructure used for encrypted database storage of user accounts, consultation records, and
                  system logs under Google Cloud&apos;s enterprise security terms.
                </li>
                <li>
                  <strong>Vercel Inc.:</strong> Cloud hosting and serverless compute infrastructure that securely
                  executes our Next.js backend API routes under strict data confidentiality terms.
                </li>
                <li>
                  <strong>Payment service providers:</strong> Used to securely process consultation fee payments,
                  if applicable. Note: Google OAuth user data, credentials, and tokens are never shared with payment processors.
                </li>
              </ul>
              <p className="leading-relaxed mb-3">
                These trusted service providers process information strictly according to their applicable privacy and security policies. We do not authorize them to use Google user data for any purpose unrelated to providing their specific contracted services.
              </p>
              <p className="leading-relaxed mb-3">
                <strong>Non-Google Clinic Communications:</strong> For patient contact channels independent of
                Google OAuth (such as when you voluntarily provide a phone number for SMS or WhatsApp appointment
                reminders), message delivery is transmitted via Meta / WhatsApp Business API or Brevo strictly
                to deliver transactional appointment confirmations. We never transfer Google OAuth data or
                Google user tokens to any messaging or advertising networks.
              </p>
              <p className="leading-relaxed">
                We do not transfer or disclose Google user data to any other third parties without your prior
                explicit consent, unless required to do so by applicable statutory law, subpoena, court order, or
                governmental regulatory process.
              </p>
            </section>

            {/* Data Protection Mechanisms for Sensitive Data */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                4. Data Protection Mechanisms for Sensitive Data
              </h2>
              <p className="leading-relaxed mb-4">
                We take comprehensive technical and organizational security mechanisms and safeguards to protect
                personal and sensitive data—including Google user data, clinical intake details, and authentication
                tokens—against unauthorized access, destruction, use, alteration, or disclosure:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                <li>
                  <strong>Encryption in Transit (HTTPS / TLS 1.2 &amp; TLS 1.3):</strong> All network
                  communications between client web browsers, our application servers, and Google APIs are
                  strictly encrypted in transit using modern Transport Layer Security (TLS 1.2 and TLS 1.3). Insecure HTTP
                  connections are automatically upgraded to HTTPS with HTTP Strict Transport Security (HSTS).
                </li>
                <li>
                  <strong>Encryption at Rest (AES-256):</strong> All sensitive records, database entries, and
                  user profiles stored within Firebase Firestore and Google Cloud infrastructure are encrypted
                  at rest using industry-standard Advanced Encryption Standard with 256-bit keys (AES-256).
                </li>
                <li>
                  <strong>Cryptographic Protection of Sensitive Credentials &amp; Tokens:</strong> Google OAuth refresh
                  tokens, client secrets, and integration credentials are encrypted server-side using AES-256-GCM
                  authenticated encryption. Cryptographic keys are held exclusively in isolated serverless
                  environment secrets. Tokens and sensitive secrets are never stored in plaintext, never logged,
                  and never transmitted to the browser or client-side JavaScript.
                </li>
                <li>
                  <strong>Role-Based Access Control (RBAC) &amp; Principle of Least Privilege:</strong> Access to patient
                  records and doctor tools is enforced server-side through Firebase ID
                  token verification. Patients are strictly restricted to reading only their own appointment
                  records. Clinical management actions are permitted exclusively to the verified
                  doctor UID.
                </li>
                <li>
                  <strong>Restricted Human Access:</strong> Access to sensitive clinical and Google user data
                  is restricted exclusively to Dr. Pratima Agale for direct patient care. No third-party
                  contractors, brokers, or unauthorized personnel have access to patient consultation records.
                </li>
                <li>
                  <strong>Continuous Monitoring and Vulnerability Management:</strong> We conduct regular
                  security audits, dependency security scans, and runtime error monitoring across our Next.js
                  backend and cloud services to ensure ongoing protection against security vulnerabilities.
                </li>
              </ul>
            </section>

            {/* Google API Services User Data Policy */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                5. Google API Services User Data Policy (Limited Use Disclosure)
              </h2>
              <div className="p-5 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[#cde2d4] dark:border-emerald-950/80 mb-4">
                <p className="leading-relaxed mb-3 font-medium">
                  Dr. Pratima Agale&apos;s Homeopathy Clinic&apos;s use and transfer to any other app
                  of information received from Google APIs will adhere to the{" "}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-semibold hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    Google API Services User Data Policy
                  </a>
                  , including the Limited Use requirements.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Specifically:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                  <li>We do not use Google user data for serving advertisements.</li>
                  <li>We do not sell Google user data to any broker, advertiser, or third party.</li>
                  <li>
                    We do not transfer Google user data to third parties except as strictly necessary
                    to provide our healthcare and video consultation services, comply with applicable
                    law, or as part of a verified merger/acquisition with user consent.
                  </li>
                  <li>
                    We do not allow humans to read Google user data unless we have obtained your
                    affirmative agreement for specific messages, doing so is necessary for security
                    purposes (such as investigating abuse), or to comply with applicable law.
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Retention and Deletion */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                6. Data Retention and Deletion
              </h2>
              <p className="leading-relaxed mb-4">
                We retain personal information only for as long as necessary to fulfill the purposes
                outlined in this policy, provide healthcare services, comply with our legal and
                medical record-keeping obligations, and resolve any disputes.
              </p>
              <p className="leading-relaxed mb-4">
                Users may request access to, correction of, or permanent deletion of their personal
                information at any time by contacting us:
              </p>
              <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)]">
                <p className="text-sm leading-relaxed mb-1">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:info@pratimaagale.in"
                    className="underline font-medium hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    info@pratimaagale.in
                  </a>
                </p>
                <p className="text-sm leading-relaxed mb-1">
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+919359875511"
                    className="underline font-medium hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    +91 93598 75511
                  </a>
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>Online:</strong> You may also submit requests through your authenticated{" "}
                  <Link
                    href="/patient/dashboard"
                    className="underline font-medium hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    Patient Dashboard
                  </Link>
                  .
                </p>
              </div>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                We will review, verify, and process deletion requests in accordance with applicable
                laws and legitimate statutory clinical record-retention requirements.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                7. Contact Information
              </h2>
              <p className="leading-relaxed mb-3">
                For questions, concerns, or requests regarding this Privacy Policy or our data
                handling practices, please contact us at:
              </p>
              <div className="space-y-1 text-sm sm:text-base leading-relaxed">
                <p className="font-semibold">Dr. Pratima Agale&apos;s Homeopathy Clinic</p>
                <p>Kalyan, Maharashtra, India</p>
                <p>
                  Email:{" "}
                  <a
                    href="mailto:info@pratimaagale.in"
                    className="underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    info@pratimaagale.in
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a
                    href="tel:+919359875511"
                    className="underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    +91 93598 75511
                  </a>
                </p>
                <p>
                  Website:{" "}
                  <a
                    href="https://www.pratimaagale.in"
                    className="underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    https://www.pratimaagale.in
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
