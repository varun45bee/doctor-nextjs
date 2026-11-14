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
                <li>
                  <strong>Google Meet &amp; Calendar access (for authorized doctor accounts):</strong>{" "}
                  To automatically generate secure Google Meet video consultation spaces and
                  schedule telehealth appointments directly on behalf of Dr. Pratima Agale.
                </li>
              </ul>
              <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)]">
                <p className="text-sm font-medium leading-relaxed">
                  <strong>Purpose Limitation:</strong> We use Google user data strictly for
                  authentication, account creation, account management, scheduling appointments,
                  generating video consultation links, and providing core healthcare website
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
                  appointment date and time, consultation type (video or in-clinic), and health
                  concerns or symptom summaries voluntarily provided during booking or clinical intake.
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
                3. Data Sharing, Transfer, and Third-Party Disclosures
              </h2>
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                  <strong>We do not sell Google user data, nor do we use it for advertising, marketing, or profiling.</strong>
                </p>
              </div>
              <p className="leading-relaxed mb-4">
                We may share limited user information with trusted third-party service providers
                strictly when necessary to operate our website, authenticate users, and provide
                healthcare services. These providers include:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-4">
                <li>
                  <strong>Google OAuth / Google Identity Services:</strong> Used for secure
                  single-sign-on (SSO) authentication and identity verification.
                </li>
                <li>
                  <strong>Google Meet &amp; Google Calendar APIs:</strong> Used solely to generate
                  unique video consultation rooms and schedule telehealth sessions between patients
                  and Dr. Pratima Agale.
                </li>
                <li>
                  <strong>Google Firebase / Firestore:</strong> Cloud infrastructure provided by
                  Google Cloud Platform used for secure user authentication session storage,
                  role-based access control, and encrypted database storage.
                </li>
                <li>
                  <strong>Vercel Inc.:</strong> Used for secure hosting, serverless backend compute,
                  and global content delivery of the website.
                </li>
                <li>
                  <strong>Payment Service Providers:</strong> Used to securely process patient
                  consultation fee transactions in compliance with PCI-DSS standards.
                </li>
                <li>
                  <strong>Meta / WhatsApp Business API:</strong> Used strictly to transmit
                  appointment confirmations, video consultation links, and reminders to patients who
                  opt in to WhatsApp notifications.
                </li>
              </ul>
              <p className="leading-relaxed mb-3">
                These third-party providers process information according to their applicable privacy
                and security policies. We do not authorize any third party to use Google user data or
                patient information for purposes unrelated to providing their specific services to us.
              </p>
              <p className="leading-relaxed">
                We may also disclose information if required to do so by applicable law, court order,
                or governmental regulation.
              </p>
            </section>

            {/* Data Protection and Security */}
            <section>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                4. Data Protection and Security Mechanisms for Sensitive Data
              </h2>
              <p className="leading-relaxed mb-4">
                We take rigorous technical and organizational measures to protect personal and
                sensitive user information against unauthorized access, alteration, disclosure, or
                destruction:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Encryption in Transit (HTTPS / TLS):</strong> All communications between
                  users&apos; web browsers, our web application, and third-party APIs are encrypted
                  using modern Transport Layer Security (TLS 1.2 and TLS 1.3) with HTTPS enforced
                  across all pages.
                </li>
                <li>
                  <strong>Encryption at Rest:</strong> Where supported by our infrastructure, stored
                  data—including appointment records, patient details, and database documents in
                  Firebase Firestore—is protected using strong encryption at rest (AES-256).
                </li>
                <li>
                  <strong>Secure Credential &amp; Token Handling:</strong> OAuth refresh tokens,
                  client secrets, and service account keys are stored securely server-side using
                  environment secrets and cryptographic protection. Refresh tokens are never exposed
                  to the client browser, frontend scripts, or unauthorized users.
                </li>
                <li>
                  <strong>Role-Based Access Control (RBAC):</strong> Strict authentication and
                  authorization controls ensure that patients can access only their own records and
                  appointments. Administrative and clinical management tools are restricted strictly
                  to verified clinical personnel.
                </li>
                <li>
                  <strong>Restricted Human Access:</strong> Access to personal and medical information
                  is limited exclusively to authorized personnel who need the information to provide
                  clinical healthcare or technical website maintenance.
                </li>
                <li>
                  <strong>Regular Monitoring:</strong> Continuous monitoring of website infrastructure,
                  serverless functions, and security logs to prevent and detect security threats.
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
