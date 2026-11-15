import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Dr. Pratima Agale Homeopathy Clinic",
  description:
    "Official Privacy Policy for Dr. Pratima Agale's Homeopathy Clinic website, patient portal, Google OAuth integration, data protection safeguards, and teleconsultation services.",
  alternates: {
    canonical: "https://www.pratimaagale.in/privacy-policy",
  },
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
              Legal, Compliance &amp; Patient Privacy
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
              Effective Date: November 15, 2026 &middot; Version 2.2
            </p>
          </div>

          <div
            className="prose prose-lg max-w-none space-y-10"
            style={{ color: "var(--text-primary)" }}
          >
            {/* Introduction */}
            <section>
              <p className="text-base sm:text-lg leading-relaxed">
                Dr. Pratima Agale&apos;s Homeopathy Clinic (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;) is an independent digital homeopathic healthcare practice operated
                by Dr. Pratima Agale (BHMS, MD Homeopathy) based in Kalyan, Maharashtra, India. We are
                dedicated to safeguarding the confidentiality, privacy, and integrity of all patient and
                visitor information.
              </p>
              <p className="text-base sm:text-lg leading-relaxed mt-4">
                This Privacy Policy explicitly describes our data practices for visitors, prospective
                patients, registered patients, and clinical staff interacting with our website (
                <a
                  href="https://www.pratimaagale.in"
                  className="font-medium underline hover:text-[#3a9e8c]"
                  style={{ color: "var(--teal)" }}
                >
                  https://www.pratimaagale.in
                </a>
                ), our authenticated patient portal, clinical scheduling tools, online video consultation
                services, and third-party authentication integrations including Google OAuth.
              </p>
            </section>

            {/* Section 1: Google OAuth User Data Collection & Usage */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                1. Google OAuth User Data Collection and Usage
              </h2>
              <p className="leading-relaxed mb-4">
                Our application integrates Google Sign-In (powered via Google Identity Services and Firebase
                Authentication) to allow patients and authorized healthcare personnel to authenticate securely
                without creating separate, vulnerable passwords.
              </p>

              <h3 className="text-lg font-bold mb-2">Google User Data We Access:</h3>
              <p className="leading-relaxed mb-3">
                When you choose to sign in with your Google account, we request standard OpenID Connect profile
                and email scopes (<code>openid</code>, <code>profile</code>, and <code>email</code>). Subject to
                your explicit consent through the Google OAuth consent dialog, we access:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Full Name:</strong> To address you respectfully, personalize your patient profile,
                  and ensure correct identification on homeopathic prescriptions and appointment records.
                </li>
                <li>
                  <strong>Email Address:</strong> To serve as your unique, verified account identifier, deliver
                  critical consultation confirmations, and provide authenticated patient portal access.
                </li>
                <li>
                  <strong>Profile Picture / Avatar URL:</strong> If provided in your public Google profile, to
                  display your user avatar in the patient dashboard header.
                </li>
                <li>
                  <strong>Google User Identifier (UID):</strong> An immutable unique identifier used to associate
                  your authenticated session with your personal records in our secure database.
                </li>
                <li>
                  <strong>Email Verification Status:</strong> To verify that your email address is authentic and
                  prevent unauthorized account creation.
                </li>
              </ul>

              <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)]">
                <h4 className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "var(--teal)" }}>
                  Strict Purpose Limitation
                </h4>
                <p className="text-sm leading-relaxed">
                  We use Google user data exclusively to authenticate user identity, create and maintain patient
                  accounts, display personalized health dashboards, and send transactional consultation confirmations.
                  We do not use Google user data for advertising, marketing profiling, or any secondary commercial purpose.
                </p>
              </div>
            </section>

            {/* Section 2: Clinical & Medical Information Handling */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                2. Patient Medical Information and Clinical Handling
              </h2>
              <p className="leading-relaxed mb-4">
                In the context of homeopathic clinical care, effective individualization requires comprehensive
                case-taking. During appointment booking, clinical intake, or patient portal usage, you may
                voluntarily provide sensitive health information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Chief Health Concerns &amp; Symptoms:</strong> Details regarding your current medical
                  complaints, physical symptoms, duration, modalities, and severity.
                </li>
                <li>
                  <strong>Medical Dossier:</strong> Medical history, diagnosed chronic conditions (such as PCOS,
                  thyroid disorders, migraines, or dermatological conditions), past surgeries, and family health history.
                </li>
                <li>
                  <strong>Clinical Safety Information:</strong> Known drug, food, or environmental allergies and
                  current allopathic or alternative medications.
                </li>
                <li>
                  <strong>Lifestyle &amp; Constitutional Factors:</strong> Dietary habits, thermal preferences, sleep
                  patterns, and stress factors essential for homeopathic constitutional remedy selection.
                </li>
                <li>
                  <strong>Diagnostic Documents &amp; Reports:</strong> Medical reports, laboratory investigations,
                  ultrasound scans, or prescription slips that you choose to upload to your medical records dossier.
                </li>
                <li>
                  <strong>Homeopathic Prescriptions &amp; Clinical Notes:</strong> Official homeopathic remedy slips,
                  potency, dosages, and dietary precautions issued by Dr. Pratima Agale, stored within your record.
                </li>
              </ul>
              <div className="p-4 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)]">
                <p className="text-sm font-medium leading-relaxed">
                  <strong>Doctor-Patient Privilege:</strong> All clinical consultations, symptoms, and medical
                  histories are treated under strict doctor-patient confidentiality and ethical standards established
                  by homeopathic medical councils. Clinical details are reviewed solely by Dr. Pratima Agale.
                </p>
              </div>
            </section>

            {/* Section 3: Data Sharing, Transfer, and Third-Party Disclosures (Google Verification Finding 1) */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                3. Data Sharing, Transfer, and Third-Party Disclosures
              </h2>

              {/* Explicit Non-Sale & No Advertising Disclosure */}
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 mb-6 space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-200 text-base">
                  Clear Disclosure on Data Non-Sale and Advertising:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                  <li>
                    <strong>We do NOT sell, rent, lease, or trade Google user data or patient personal information to any third parties under any circumstances.</strong>
                  </li>
                  <li>
                    <strong>We do NOT share, transfer, or disclose Google user data to third-party advertising platforms, ad networks, data brokers, or marketing agencies.</strong>
                  </li>
                  <li>
                    <strong>We do NOT use Google user data or sensitive clinical information for retargeting, behavioral profiling, or personalized advertising.</strong>
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-bold mb-3">Distinction Between Service Providers and External Parties</h3>
              <p className="leading-relaxed mb-4">
                We clearly distinguish between third-party marketing/advertising recipients (with whom we{" "}
                <strong>never</strong> share data) and essential technical service providers (subprocessors) contracted
                strictly to operate our clinic website and execute core application functionality:
              </p>

              <div className="space-y-4 mb-6">
                {/* Provider 1: Google Cloud & Firebase */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      1. Google LLC (Firebase Authentication, Cloud Firestore &amp; Firebase Storage)
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Infrastructure Subprocessor
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Recipients &amp; Location:</strong> Google LLC (United States and globally distributed data centers).
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Data Transferred:</strong> User authentication tokens, email, full name, profile image URL,
                    user document ID, consultation booking records, and encrypted medical document files.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Purpose &amp; Circumstances:</strong> Used strictly to execute secure user authentication,
                    manage login sessions, store encrypted patient accounts, and securely host uploaded medical report
                    files. Data is handled under Google Cloud&apos;s enterprise security terms and data processing commitments.
                  </p>
                </div>

                {/* Provider 2: Vercel */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      2. Vercel Inc.
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Cloud Hosting &amp; Compute
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Recipients &amp; Location:</strong> Vercel Inc. (United States / edge server network).
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Data Transferred:</strong> Ephemeral serverless execution requests including encrypted session
                    headers and API payloads.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Purpose &amp; Circumstances:</strong> Serves as our Next.js application hosting infrastructure
                    and executes serverless API routes under strict data processing agreements. Vercel does not retain or
                    harvest application data for secondary uses.
                  </p>
                </div>

                {/* Provider 3: Brevo */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      3. Brevo (formerly Sendinblue)
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                      Transactional Email Service
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Recipients &amp; Location:</strong> Brevo SAS (European Union / France).
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Data Transferred:</strong> Patient name, appointment date and time, and recipient email address.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Purpose &amp; Circumstances:</strong> Dispatches strictly transactional emails (appointment
                    booking confirmations, reschedule notices, and cancellation alerts) to patients. Brevo is under
                    contractual obligation not to use email addresses for marketing or share them with third parties.
                    <em> Note: Google OAuth tokens and passwords are never transmitted to Brevo.</em>
                  </p>
                </div>

                {/* Provider 4: Meta WhatsApp Cloud API */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      4. Meta Platforms Inc. (WhatsApp Business Cloud API)
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                      Transactional Messaging
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Recipients &amp; Location:</strong> Meta Platforms Inc.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Data Transferred:</strong> Patient mobile number and pre-approved transactional appointment templates.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Purpose &amp; Circumstances:</strong> When a patient voluntarily provides their mobile phone number
                    and requests WhatsApp notifications, message delivery is processed via WhatsApp Cloud API.
                    <em> Note: Google OAuth profile data, tokens, and Google identifiers are never sent to Meta or WhatsApp.</em>
                  </p>
                </div>

                {/* Provider 5: Groq Cloud (AI Clinical Assistant) */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-base text-[var(--text-primary)]">
                      5. Groq Cloud (CuraAI Triage Assistant)
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300">
                      Conversational AI Triage
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Recipients &amp; Location:</strong> Groq Inc. (United States).
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                    <strong>Data Transferred:</strong> Ephemeral user chat prompts regarding general health questions or symptoms.
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    <strong>Purpose &amp; Circumstances:</strong> Used to generate informational conversational responses
                    when visitors interact with the CuraAI assistant.
                    <em> Crucial Safeguard: No Google user data, names, email addresses, phone numbers, or account credentials
                    are ever sent to Groq. Interactions are completely de-identified.</em>
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">Legal, Statutory, and Emergency Disclosures</h3>
              <p className="leading-relaxed">
                We do not disclose personal information to any governmental, regulatory, or private third party except
                under the following narrow circumstances: (a) when strictly required to comply with applicable statutory law,
                a valid judicial court order, or formal subpoena issued by a court of competent jurisdiction; (b) in rare medical
                emergencies to protect the vital interests and life of the patient; or (c) to establish, exercise, or defend
                legal rights against fraudulent bookings or malicious cyberattacks.
              </p>
            </section>

            {/* Section 4: Sensitive Data Protection Safeguards (Google Verification Finding 2) */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                4. Sensitive Data Protection: Technical and Organizational Safeguards
              </h2>
              <p className="leading-relaxed mb-4">
                To fulfill our clinical duty of care and resolve Google verification requirements, we maintain rigorous
                technical, administrative, and physical safeguards designed to secure Google user data and sensitive patient
                health records against unauthorized access, destruction, loss, alteration, or disclosure:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Safeguard 1: Authentication & Identity Verification */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Authentication &amp; Session Verification
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    User sessions are authenticated using cryptographic JSON Web Tokens (JWT) verified via Google Firebase
                    Authentication. Email verification is verified before granting access to sensitive portal features. Doctor
                    accounts are authenticated against a strict server-side whitelist to prevent unauthorized role escalation.
                  </p>
                </div>

                {/* Safeguard 2: Server-Side Authorization (RBAC) */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Authorization &amp; Access Restrictions (RBAC)
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Every API route enforces server-side identity verification. Patients can only query and retrieve appointment
                    records matching their verified Google UID. Doctor workstation actions (prescriptions, clinical notes,
                    and schedule blocks) require verified doctor identity tokens. Client-side role tampering is rejected.
                  </p>
                </div>

                {/* Safeguard 3: Encryption in Transit */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Secure Transmission (TLS 1.2 &amp; TLS 1.3)
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    All web communications between user browsers, Next.js application servers, and Google Cloud endpoints are
                    strictly encrypted in transit using Transport Layer Security (TLS 1.2 and TLS 1.3). Insecure HTTP requests
                    are automatically upgraded via HTTP Strict Transport Security (HSTS) headers.
                  </p>
                </div>

                {/* Safeguard 4: Encryption at Rest */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Encryption at Rest (AES-256)
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    All user profiles, consultation histories, and prescription notes stored in Cloud Firestore and Google Cloud
                    infrastructure are transparently encrypted at rest using industry-standard Advanced Encryption Standard
                    with 256-bit keys (AES-256).
                  </p>
                </div>

                {/* Safeguard 5: Document Access Controls (Storage) */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Document Access Controls (Firebase Storage)
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Diagnostic reports and prescription PDFs are partitioned into patient-isolated storage buckets (
                    <code>medical-records/&#123;uid&#125;/</code>). File types are strictly restricted to verified MIME types (PDF,
                    JPEG, PNG, WEBP) with strict file size caps (max 15MB) to prevent malicious code execution.
                  </p>
                </div>

                {/* Safeguard 6: Credential Management */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Credential &amp; Key Management
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    All private API keys, service account credentials, and secrets are maintained exclusively in secure server-side
                    environment variables on Vercel. Credentials are never bundled in client-side JavaScript or committed to git.
                    OAuth states and session signatures are validated using HMAC-SHA256 signatures.
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2">Restricted Human Access Protocol</h3>
              <p className="leading-relaxed">
                Access to identifiable patient records, Google user data, and clinical notes is strictly restricted to Dr. Pratima Agale
                for the direct purpose of diagnosing, treating, and managing patient care. No third-party contractors, marketing personnel,
                or administrative staff have access to patient medical dossiers or Google user records.
              </p>
            </section>

            {/* Section 5: Google API Services User Data Policy Compliance */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                5. Google API Services User Data Policy (Limited Use Disclosure)
              </h2>
              <div className="p-5 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[#cde2d4] dark:border-emerald-950/80 mb-4">
                <p className="leading-relaxed mb-3 font-medium">
                  Dr. Pratima Agale&apos;s Homeopathy Clinic&apos;s use and transfer to any other app of information received
                  from Google APIs adheres strictly to the{" "}
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
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  In accordance with Google&apos;s Limited Use requirements:
                </p>
                <ul className="list-disc pl-6 space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <li>We do not use or transfer Google user data for serving personalized, retargeted, or interest-based advertisements.</li>
                  <li>We do not sell Google user data to data brokers, advertising platforms, or any commercial entities.</li>
                  <li>
                    We do not transfer Google user data to third parties except as strictly necessary to provide our digital clinic
                    and teleconsultation services, comply with applicable law, or as part of a merger or acquisition with prior affirmative consent.
                  </li>
                  <li>
                    We do not use or transfer Google user data to train generalized artificial intelligence (AI) or machine learning (ML) models.
                  </li>
                  <li>
                    We do not allow humans to read Google user data unless: (1) we have obtained your affirmative consent for specific
                    support requests; (2) it is necessary for security investigations; or (3) to comply with statutory law.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6: Data Retention and Deletion Practices */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                6. Data Retention and Deletion Practices
              </h2>
              <p className="leading-relaxed mb-4">
                We believe in data minimization and retain personal and Google user data only for as long as necessary to fulfill the
                specific clinical and operational purposes described in this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>User Accounts:</strong> Account profile information (name, email, Google UID) is retained for as long as
                  your account remains active. If an account is inactive for more than 24 months, it is flagged for archival and eventual purging.
                </li>
                <li>
                  <strong>Clinical &amp; Medical Records:</strong> In compliance with standard medical ethics and clinical documentation
                  guidelines in India, consultation notes, diagnoses, and prescriptions are retained for the statutory medical period
                  necessary to ensure safe continuity of care and legal compliance.
                </li>
                <li>
                  <strong>Uploaded Diagnostic Reports:</strong> Patient-uploaded lab files and scans are retained in encrypted storage
                  until deleted by the patient via the portal or upon account termination.
                </li>
                <li>
                  <strong>Authentication Logs &amp; Ephemeral Data:</strong> Session tokens and server execution logs are purged automatically
                  within 30 to 90 days.
                </li>
              </ul>

              <h3 className="text-lg font-bold mb-3">How to Submit a Data Deletion Request</h3>
              <p className="leading-relaxed mb-4">
                Any registered user or patient has the unequivocal right to request the permanent deletion of their account, Google user data,
                and associated personal records. You may submit a deletion request at any time through the following channels:
              </p>

              <div className="p-5 rounded-2xl bg-[#f4f7f4] dark:bg-[#152319] border border-[var(--border-color)] space-y-2">
                <p className="text-sm leading-relaxed">
                  <strong>1. By Email:</strong> Send a deletion request from your registered email address to{" "}
                  <a
                    href="mailto:info@pratimaagale.in"
                    className="underline font-semibold hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    info@pratimaagale.in
                  </a>{" "}
                  with the subject line <em>&ldquo;Data Deletion Request&rdquo;</em>.
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>2. By Phone / WhatsApp:</strong> Contact our official clinic helpline at{" "}
                  <a
                    href="tel:+919359875511"
                    className="underline font-semibold hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    +91 93598 75511
                  </a>
                  .
                </p>
                <p className="text-sm leading-relaxed">
                  <strong>3. Through Patient Portal:</strong> Log in to your authenticated{" "}
                  <Link
                    href="/patient/profile"
                    className="underline font-semibold hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    Patient Profile &amp; Dashboard
                  </Link>{" "}
                  to manage your personal records or initiate account closure.
                </p>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                  <strong>Deletion Verification &amp; Timeline:</strong> Upon receiving your request, we verify your identity to prevent
                  fraudulent data destruction. All Google user profile data, session records, and patient files are permanently purged from
                  active Firestore collections and Firebase Storage within <strong>30 days</strong>, subject only to non-derogable statutory
                  clinical record retention requirements mandated by Indian medical laws.
                </p>
              </div>
            </section>

            {/* Section 7: Patient Privacy Rights */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                7. Patient Privacy Rights
              </h2>
              <p className="leading-relaxed mb-4">
                Regardless of your geographic location, we respect and uphold your fundamental privacy rights regarding your personal and
                health information:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Right to Access:</strong> You have the right to request a copy of the personal information and consultation records
                  we hold about you.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You may correct or update inaccurate, incomplete, or outdated personal details
                  through your patient dashboard or by contacting our clinic.
                </li>
                <li>
                  <strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> You may request the deletion of your account and
                  identifiable records as detailed in Section 6.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> Where data processing is based on consent (such as voluntary Google Sign-In or
                  WhatsApp notifications), you may withdraw consent at any time without affecting the lawfulness of processing prior to withdrawal.
                </li>
                <li>
                  <strong>Right to Non-Discrimination:</strong> We will never deny services, charge different rates, or provide lower clinical
                  care quality if you exercise any of your privacy rights.
                </li>
              </ul>
            </section>

            {/* Section 8: Cookies, Local Storage & Analytics */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                8. Cookies, Local Storage and Analytics
              </h2>
              <p className="leading-relaxed mb-3">
                Our website operates on privacy-first engineering principles:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  <strong>Essential Local Storage:</strong> We use browser <code>localStorage</code> solely to remember your chosen visual theme
                  (light or dark mode), language preference (English, Hindi, Marathi), and your authenticated session token. This data remains on
                  your local device.
                </li>
                <li>
                  <strong>No Advertising Cookies:</strong> We do not deploy third-party advertising cookies, cross-site trackers, or tracking pixels.
                </li>
                <li>
                  <strong>Performance Telemetry:</strong> We use Vercel Speed Insights to collect anonymized Core Web Vitals (such as page load
                  latency). This telemetry does not track individual identities, IP addresses, or medical information.
                </li>
              </ul>
            </section>

            {/* Section 9: Relevant Policies & Legal Links */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                9. Related Policies and Consent Documentation
              </h2>
              <p className="leading-relaxed mb-3">
                For additional details regarding our terms of service, appointment booking conditions, and refund procedures, please consult:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <Link
                  href="/terms"
                  className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] hover:border-sage-500 font-semibold transition-colors flex items-center justify-between"
                >
                  <span>Terms &amp; Conditions</span>
                  <span className="text-xs text-sage-600 dark:text-sage-400">&rarr;</span>
                </Link>
                <Link
                  href="/cancellation-policy"
                  className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] hover:border-sage-500 font-semibold transition-colors flex items-center justify-between"
                >
                  <span>Cancellation Policy</span>
                  <span className="text-xs text-sage-600 dark:text-sage-400">&rarr;</span>
                </Link>
                <Link
                  href="/refund-policy"
                  className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] hover:border-sage-500 font-semibold transition-colors flex items-center justify-between"
                >
                  <span>Refund Policy</span>
                  <span className="text-xs text-sage-600 dark:text-sage-400">&rarr;</span>
                </Link>
                <Link
                  href="/patient/dashboard"
                  className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] hover:border-sage-500 font-semibold transition-colors flex items-center justify-between"
                >
                  <span>Patient Portal Dashboard</span>
                  <span className="text-xs text-sage-600 dark:text-sage-400">&rarr;</span>
                </Link>
              </div>
            </section>

            {/* Section 10: Contact Details for Privacy Questions */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-semibold mb-4"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "var(--sage-mid)",
                }}
              >
                10. Privacy Officer and Clinic Contact Information
              </h2>
              <p className="leading-relaxed mb-4">
                If you have questions, feedback, complaints, or wish to exercise your data privacy rights under this policy, please reach
                out directly to Dr. Pratima Agale:
              </p>

              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] space-y-2 text-sm sm:text-base">
                <p className="font-bold text-lg text-[var(--text-primary)]">
                  Dr. Pratima Agale&apos;s Homeopathy Clinic
                </p>
                <p className="text-[var(--text-secondary)]">
                  Principal Practitioner: Dr. Pratima Agale (BHMS, MD Homeopathy)
                </p>
                <p className="text-[var(--text-secondary)]">
                  Address: Yogidham, Phase 3, Kalyan, Maharashtra 421301, India
                </p>
                <p className="text-[var(--text-secondary)]">
                  Email:{" "}
                  <a
                    href="mailto:info@pratimaagale.in"
                    className="font-medium underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    info@pratimaagale.in
                  </a>
                </p>
                <p className="text-[var(--text-secondary)]">
                  Phone / WhatsApp:{" "}
                  <a
                    href="tel:+919359875511"
                    className="font-medium underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    +91 93598 75511
                  </a>
                </p>
                <p className="text-[var(--text-secondary)]">
                  Official Website:{" "}
                  <a
                    href="https://www.pratimaagale.in"
                    className="font-medium underline hover:text-[#3a9e8c]"
                    style={{ color: "var(--teal)" }}
                  >
                    https://www.pratimaagale.in
                  </a>
                </p>
              </div>
            </section>

            {/* Policy Updates Notice */}
            <section className="pt-4 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-2">
              <p>
                <strong>Policy Amendments:</strong> We may revise this Privacy Policy periodically to reflect technological advancements,
                enhancements in clinical services, or regulatory updates. Any material modifications will be posted to this page with an updated
                effective date. We encourage users to review this page periodically.
              </p>
              <p>
                &copy; {new Date().getFullYear()} Dr. Pratima Agale Homeopathy Clinic. All rights reserved.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
