# PRODUCT REQUIREMENTS DOCUMENT

## ENTERPRISE DOCTOR PORTAL & CLINICAL OPERATIONS PLATFORM

**Clinic:** Dr. Pratima Agale Homeopathy Clinic  
**Website:** [https://www.pratimaagale.in](https://www.pratimaagale.in)  
**Version:** 2.0  
**Date:** 14 November 2026  
**Status:** Proposed enterprise product specification  
**Basis:** Doctor Portal Technical Audit dated 14 November 2026 (`DOCTOR_PORTAL_TECHNICAL_AUDIT.md`)  

---

### Document Control

| Field | Value |
| :--- | :--- |
| **Product** | Enterprise Doctor Portal & Clinical Operations Platform |
| **Application / Repository** | `pratima-agale-fresh` |
| **Primary Route** | `/doctor` |
| **Audience** | Clinic leadership, product, engineering, QA, security, operations |
| **Product Direction** | Enterprise-grade evolution of the existing portal; preserve core workflows and simplify the experience |
| **Evidence Boundary** | Derived from supplied read-only source-code audit. Production configuration, legal obligations and deployed behavior require independent verification. |
| **Version** | 2.0 / 14 November 2026 |

### Revision Summary
Version 2.0 expands the previous Doctor Portal PRD into an enterprise operating specification. It adds multi-role governance, organization and provider boundaries, operational controls, auditability, resilience, reporting governance, release gates, service-level targets and phased adoption. These are proposed requirements, not claims that the current code already supports them.

---

## 1. Executive Summary

The Doctor Portal is the clinic’s authenticated clinical and operational workspace for appointments, schedules, patient records, prescriptions, communications, Google Calendar/Meet, analytics and blog administration. The existing implementation provides a useful foundation: Next.js App Router, Firebase Authentication, Firestore, Firebase Storage, server-side API routes, Google OAuth/Calendar/Meet, Brevo email and Meta WhatsApp Cloud API.

The enterprise target is a secure, auditable, role-aware platform that supports reliable daily clinical work and can scale from a single-doctor clinic to multiple clinicians and administrative staff without weakening patient privacy. This is a modernization of the existing product—not a ground-up replacement.

> **Release Principle:** Patient privacy, authorization correctness and appointment data integrity are non-negotiable release gates. Enterprise features must be introduced behind controlled permissions, observable workflows and tested migrations.

---

## 2. Product Vision, Goals and Non-Goals

### 2.1 Vision
Provide one dependable clinical operations workspace in which authorized staff can coordinate care, manage appointments and schedules, access the correct patient record, issue traceable prescriptions and communicate reliably.

### 2.2 Business and User Outcomes
- Reduce missed, duplicated and manually coordinated appointments.
- Protect patient identity, contact details, clinical notes, reports, prescriptions and access credentials.
- Ensure every appointment mutation keeps booking records, slot locks, calendar events, notifications and audit history consistent.
- Reduce consultation administration time through a unified patient timeline and prescription workflow.
- Support controlled multi-doctor and staff access with least-privilege permissions.
- Provide accurate operational reporting with clear definitions and no fabricated or unsupported clinical outcome claims.
- Make failures visible, recoverable and attributable to a responsible workflow or integration.
- Retain the existing visual identity and simplify existing interactions rather than redesigning without need.

### 2.3 Non-Goals for this Release
- Autonomous diagnosis, treatment recommendation or automatic prescription decisions.
- Replacing clinician judgement or creating an unapproved clinical remedy database.
- Building a full hospital ERP, insurance claims engine, pharmacy inventory or laboratory information system.
- Claiming legal or regulatory compliance solely because technical controls in this PRD are implemented.
- Replatforming the whole website or changing the public guest-booking policy without an approved decision.

---

## 3. Current Product Baseline (Audit-Derived)

| Area | Observed Baseline in Supplied Audit | Enterprise Target |
| :--- | :--- | :--- |
| **Authentication** | Firebase Google sign-in, email allowlist, `DoctorGuard`; `localStorage` role restoration reported | Server-verified identity and centrally managed roles; no client-side role trust |
| **Appointments** | List/table, filters, calendar; one-time fetch; direct client status writes | Real-time or reliably refreshed queue; server-owned state transitions and atomic side effects |
| **Booking Engine** | Firestore transactions, idempotency checks, 10-minute slot locks | Preserve transactional booking foundation; add operational monitoring and reconciliation |
| **Patient EHR** | Sliding drawer with case details, diagnostics, prescription and history | Permission-scoped longitudinal patient workspace with access audit |
| **Prescription** | Free-text remedy, potency, dosage, duration and instructions; direct save | Validated draft/issued/amended lifecycle, immutable versions, PDF and controlled delivery |
| **Availability** | Weekly days and time slots; `Asia/Kolkata`; 60-minute slots | Date-specific closures, exceptions, clinician calendars and conflict prevention |
| **Chat** | Firestore real-time conversation listeners and attachments | Reliable message status, safe attachment validation and patient-context controls |
| **Integrations** | Google OAuth, Calendar/Meet; Brevo; Meta WhatsApp | Secure connection lifecycle, retry/reconciliation, templates and delivery observability |
| **Analytics** | Some real groupings; hardcoded 94.2% and synthetic empty-state values reported | Metric dictionary, real-data-only dashboards and explicit no-data states |
| **Testing** | Audit reports 90 tests passing; major UI/API/rules/prescription gaps | Layered automated tests and release evidence |

> [!IMPORTANT]
> The technical audit is a read-only source-code investigation. Its findings are treated as reported code behavior, not independently verified production incidents. Confirm actual deployed rules, secrets, hosting, worker schedules, OAuth configuration and provider templates before rollout.

---

## 4. Target Users, Roles and Access Governance

| Role | Purpose | Default Access Model |
| :--- | :--- | :--- |
| **Clinic Owner / Super Admin** | Owns clinic configuration, users, integrations, policies and oversight | Manage clinic-wide settings and access; patient clinical access only where explicitly required and authorized |
| **Doctor / Clinician** | Conducts consultations and manages assigned patients | Access appointments, patient records, prescriptions, availability and communications within assigned clinic scope |
| **Clinic Administrator** | Coordinates appointments, schedules, patient administration | Manage bookings and operational data; no prescription authoring or unrestricted clinical-note access by default |
| **Receptionist** | Handles check-in, booking and patient contact | Minimum appointment/contact fields needed for front-desk tasks |
| **Clinical Assistant** | Supports clinician workflows | Access only assigned tasks and patient data approved by clinic policy |
| **Auditor / Compliance Reviewer** | Reviews access and operational history | Read-only audit and reports; no clinical mutation |
| **Patient** | Uses patient-facing portal and booking flows | Own records and appointments after verified identity; no doctor workspace access |
| **Background Worker** | Executes scheduled jobs and integrations | Machine identity with narrowly scoped service permissions; no interactive login |

> **Authorization Rule:** Authorization must be enforced on the server and in Firestore/Storage rules. A hidden button, route guard, `localStorage` value or client-side role is never an authorization boundary.

### 4.1 Enterprise Authorization Requirements
- Use Firebase Custom Claims or an equivalent server-managed role and clinic membership model; do not maintain conflicting hardcoded email allowlists.
- Model `clinicId`, `userId`, `role`, `status`, assigned clinician and permission scope explicitly. All sensitive queries must be tenant/clinic scoped.
- Support invitation, approval, suspension, role change and offboarding workflows with immediate session/token invalidation strategy.
- Apply least privilege and deny-by-default rules. Elevated access must be explicit, time-bounded where appropriate and auditable.
- Require step-up verification for sensitive administrative actions if supported by the selected identity architecture.
- Record actor, role, clinic, target resource, action, timestamp, request correlation ID and outcome for privileged operations.

---

## 5. Information Architecture and Navigation

| Workspace | Primary Capabilities |
| :--- | :--- |
| **Overview** | Today’s schedule, pending tasks, appointment KPIs, integration/worker alerts and quick actions |
| **Appointments** | Search, filters, list/calendar modes, appointment detail, confirm, complete, cancel and reschedule |
| **Calendar** | Day/week/month views, clinician selection, availability overlay, closures and conflict indicators |
| **Patients** | Patient search with permission checks, demographics, clinical summary, records, allergies, history and timeline |
| **Consultation Workspace** | Appointment context, notes, vitals/observations if approved, follow-up plan and prescription |
| **Prescriptions** | Drafts, review, issue, amendment history, PDF, print and delivery status |
| **Messages** | Conversation inbox, unread counts, patient context, attachments and delivery state |
| **Availability** | Weekly hours, date exceptions, holidays, leave, slot duration and booking buffers |
| **Analytics & Reports** | Operational metrics, exports, filter definitions and access-controlled reports |
| **Integrations** | Google Calendar/Meet, email, WhatsApp provider health and connection management |
| **Content / Blog** | Existing doctor blog administration |
| **Administration** | Users, roles, clinic settings, audit logs, retention settings and feature configuration |

---

## 6. Functional Requirements

### 6.1 Identity, Authentication and Session Management

| ID | Priority | Requirement / Acceptance Criteria |
| :--- | :--- | :--- |
| **AUTH-01** | P0 | Only a valid authenticated identity with an active server-managed clinic role can load protected doctor data. Unauthenticated users receive 401; authenticated users without permission receive 403. |
| **AUTH-02** | P0 | Remove `localStorage` role restoration as an authorization source. Tampering with browser storage must not grant doctor access. |
| **AUTH-03** | P0 | Doctor roles and clinic membership are centrally provisioned; Firestore rules, Storage rules and APIs use the same source of truth. |
| **AUTH-04** | P1 | Admin can invite, activate, suspend and deactivate staff; every change is recorded with actor and timestamp. |
| **AUTH-05** | P1 | Session expiry, token refresh failure and revoked access produce clear re-authentication states without leaking protected data. |
| **AUTH-06** | P1 | Support secure sign-out and revoke active sessions on account suspension or role removal. |

### 6.2 Dashboard and Operational Overview

| ID | Priority | Requirement / Acceptance Criteria |
| :--- | :--- | :--- |
| **DASH-01** | P1 | Show today’s appointments, pending confirmations, cancellations, completed consultations and outstanding follow-ups using defined server-derived metrics. |
| **DASH-02** | P1 | Show data freshness and last successful refresh; stale data must be visibly labelled. |
| **DASH-03** | P1 | Display integration and background-job warnings with actionable status, not raw secrets or stack traces. |
| **DASH-04** | P1 | Quick actions respect role permissions and open the relevant workflow with required context. |
| **DASH-05** | P1 | No fabricated KPI, synthetic booking values or unsupported remedy-success percentage may be displayed. |

### 6.3 Appointment Lifecycle and Scheduling

| ID | Priority | Requirement / Acceptance Criteria |
| :--- | :--- | :--- |
| **APPT-01** | P0 | All appointment state changes execute through authenticated server-side business services; clients cannot bypass lifecycle side effects. |
| **APPT-02** | P0 | Cancellation releases the slot lock, updates appointment and lookup state, handles calendar event deletion, enqueues patient notifications and writes an audit event. |
| **APPT-03** | P1 | Doctor can reschedule from the appointment table and patient drawer; server validates availability and performs an atomic slot shift. |
| **APPT-04** | P1 | Status transitions are defined and validated. Invalid transitions return a structured error and do not partially mutate records. |
| **APPT-05** | P1 | Appointment list updates through a real-time listener or documented refresh mechanism; listeners clean up on unmount and scope change. |
| **APPT-06** | P1 | Duplicate requests are safe through idempotency keys; repeated cancel/reschedule calls do not duplicate side effects. |
| **APPT-07** | P1 | Calendar and slot-lock state can be reconciled after provider/API failure; operational exceptions are visible. |
| **APPT-08** | P1 | All dates/times are stored consistently and displayed in clinic timezone `Asia/Kolkata`; daylight/timezone conversion tests are required. |
| **APPT-09** | P1 | Support clinician assignment and conflict checks before multi-doctor rollout. |
| **APPT-10** | P2 | Support waitlist, no-show tracking and configurable reminders only after clinic policies are approved. |

### 6.4 Patient Record / EHR

| ID | Priority | Requirement / Acceptance Criteria |
| :--- | :--- | :--- |
| **EHR-01** | P0 | Every patient read and mutation is authorized against the current user’s clinic and patient scope. |
| **EHR-02** | P1 | Patient workspace presents identity, contact, case details, allergies, medications, chronic conditions, surgeries, diagnostic files, consultation history and timeline where data exists. |
| **EHR-03** | P1 | Show source and timestamp for imported or uploaded documents; distinguish patient-entered information from clinician-entered information. |
| **EHR-04** | P1 | Medical record changes are attributable and preserve previous versions where clinically/operationally required. |
| **EHR-05** | P1 | Cross-patient access tests must prove that changing IDs or URLs cannot reveal another patient’s data. |
| **EHR-06** | P2 | Support configurable patient identity matching and duplicate-record review; do not auto-merge uncertain identities. |

### 6.5 Consultation and Clinical Documentation
- Open a consultation from a confirmed appointment and show patient identity plus appointment context before editing.
- Support draft and finalized consultation notes with author, timestamps and amendment history.
- Do not silently overwrite finalized notes; amendments create a traceable new version.
- Clinical fields and templates must be approved by the responsible clinician; this PRD does not prescribe clinical content.
- Autosave must show saved/unsaved/error state and avoid claiming success before server confirmation.

### 6.6 Prescription Lifecycle

| ID | Priority | Requirement / Acceptance Criteria |
| :--- | :--- | :--- |
| **RX-01** | P0 | Prescription save and issue require verified clinician permission and server-side validation. |
| **RX-02** | P1 | Support Draft → Reviewed → Issued → Amended/Void lifecycle; only authorized clinicians can issue or amend. |
| **RX-03** | P1 | Capture remedy, potency, dosage/frequency, duration, instructions, date, clinician identity and linked patient/appointment according to clinic-approved schema. |
| **RX-04** | P1 | Issued prescriptions are immutable; corrections create a new version linked to the prior version with reason and actor. |
| **RX-05** | P1 | Generate branded PDF using clinic-approved logo, registration details, signature/seal assets and template. |
| **RX-06** | P1 | Allow download/print and delivery to a verified patient channel; record queued, sent, delivered, failed and retry states where provider supports them. |
| **RX-07** | P1 | No automatic remedy selection or clinical decision-making. Any remedy catalogue requires clinician approval and governance. |
| **RX-08** | P1 | Prescription data must never be included in public appointment lookup responses. |

### 6.7 Availability and Clinic Calendar
- Retain existing weekly availability configuration and add date-specific closures, holidays, clinician leave and exceptional hours.
- Prevent overlapping appointments for the same clinician and resource using server-side transactional checks.
- Support configurable consultation duration, buffer time and booking horizon only after product-owner approval.
- Display timezone explicitly and test boundary dates, midnight, month changes and concurrent booking attempts.
- Calendar changes must update the booking engine and produce an audit event.

### 6.8 Communication and Notifications
- Preserve real-time Firestore chat while adding clear sending, sent, failed and retry states.
- Validate attachments by MIME type and size on both client and server; enforce Storage rules. Audit recommendation is under 15 MB for medical files; clinic must approve final limits.
- Use approved Meta WhatsApp templates when required outside the customer-care window; record provider response and template version.
- Notification jobs must be idempotent, retry with bounded backoff and expose dead-letter/manual-recovery state.
- Do not rely on in-process `setTimeout` for critical serverless background work; use a durable scheduler/queue appropriate to the confirmed hosting environment.
- Messages must not expose sensitive clinical content in push previews or unsecured logs.

### 6.9 Google Calendar and Meet
- Protect OAuth connect, callback, disconnect and status endpoints with verified doctor identity and anti-CSRF state validation.
- Keep refresh/access tokens server-side and encrypted; fail closed in production if required encryption secrets are missing.
- Never return provider tokens to the browser or write them to logs.
- Preserve Meet v2 primary generation and Calendar conference fallback; expose actionable failure and retry states.
- Appointment cancellation/rescheduling must reconcile linked calendar events and persist provider outcome.

### 6.10 Analytics and Reporting
- Define a metric dictionary with formula, source collection, time window, timezone, inclusion/exclusion rules and owner.
- Separate operational metrics (bookings, attendance, cancellations, utilization) from clinical outcome measures.
- Display only real, sufficiently complete data; show "No data / Insufficient sample" rather than synthetic values.
- Do not show remedy efficacy/success percentages unless the clinic defines an approved methodology and captures valid outcome data.
- Exports must be permission-scoped, logged and minimized to the selected report purpose.

### 6.11 Administration and Audit
- Provide staff directory, role assignment, invitations, suspension and offboarding.
- Provide immutable append-only audit events for authentication/security events, patient record access, appointment changes, prescription issue/amendment, exports, configuration and integration actions.
- Audit records include actor, role, clinic, action, resource type/id, timestamp, outcome, reason where required and correlation ID; avoid storing unnecessary clinical payloads.
- Provide searchable, filterable audit review for authorized administrators/auditors.
- Provide clinic settings for approved operational policies; changes are versioned and audited.

---

## 7. Enterprise Data and Domain Model

> [!NOTE]
> The following is a logical target model, not a claim that all collections currently exist. Exact Firestore collection names and migration mapping must be finalized during technical design.

| Entity | Key Fields / Relationships | Control |
| :--- | :--- | :--- |
| **Clinic** | `clinicId`, `name`, `timezone`, `status`, `settingsVersion` | Tenant boundary for all clinic-owned records |
| **User / Membership** | `uid`, `clinicId`, `role`, `status`, `permissions`, `clinicianId` | Server-managed authorization; no client role trust |
| **Patient** | `patientId`, `clinicId`, verified contacts, demographics, identity status | Patient-level access policy and identity verification |
| **Appointment** | `appointmentId`, `clinicId`, `patientId`, `clinicianId`, `slot`, `status`, `source`, `timestamps` | Server-owned state machine; idempotency |
| **SlotLock** | `clinicId`, `clinicianId`, `slotKey`, `appointmentId`, `status`, `expiry` | Transactional lock and reconciliation |
| **Consultation** | `consultationId`, `appointmentId`, `patientId`, `clinicianId`, `status`, `version` | Versioned clinical documentation |
| **Prescription** | `prescriptionId`, `patientId`, `appointmentId`, `clinicianId`, `status`, `version`, `issuedAt` | Immutable issued version and audit trail |
| **Conversation / Message** | `conversationId`, `patientId`, `participants`, `messageId`, `deliveryState` | Participant authorization and safe attachments |
| **Availability / Exception** | `clinicianId`, weekday rules, date overrides, timezone | Conflict prevention and audit |
| **IntegrationCredential** | `clinicId`, provider, encrypted tokens, status, scopes | Server-only access; encrypted secrets |
| **NotificationJob** | `jobId`, channel, template, recipientRef, status, attempts, nextRunAt | Idempotent durable queue |
| **AuditEvent** | `eventId`, actor, `clinicId`, action, `resourceRef`, timestamp, outcome | Append-only; restricted access |

---

## 8. API and Service Design Requirements

All sensitive mutations should be mediated by authenticated server routes/services. Reuse existing `booking-manager`, `slot-service`, `availability-service`, Google integration, notification and audit services where appropriate; avoid duplicating lifecycle logic in React components.

| API / Service Area | Enterprise Contract |
| :--- | :--- |
| **Authentication / Membership** | Verify Firebase ID token or secure session; resolve active role and clinic membership server-side |
| **Appointments** | `GET` list/detail with scoped filters; `PATCH` validated state transition; `POST` cancel/reschedule with idempotency key |
| **Patient Records** | Scoped read/update endpoints; verify patient and clinic relationship for every request |
| **Prescriptions** | Draft, validate, issue, amend, render PDF and dispatch; enforce clinician permission |
| **Availability** | Read/update weekly rules and date exceptions; transactionally validate booking slots |
| **Integrations** | Authenticated OAuth connect/status/disconnect; protected retry endpoints |
| **Notifications** | Durable job enqueue, provider adapter, retry and delivery callback processing |
| **Audit** | Server-side append-only event writer; restricted query/export API |
| **Internal Jobs** | Machine authentication, narrow scopes, replay protection and observable job outcomes |

> **Public Lookup Privacy:** Public appointment lookup must not return `accessSecret`, clinical details or full patient data without verified patient identity. Rate limits, OTP or authenticated patient verification, enumeration resistance and privacy-safe response schemas are mandatory.

---

## 9. Security, Privacy and Trust Requirements

| ID | Priority | Requirement / Release Evidence |
| :--- | :--- | :--- |
| **SEC-01** | P0 | Fix unauthenticated appointment lookup: remove `accessSecret` and sensitive fields; require OTP or authenticated patient verification; rate-limit and test enumeration/IDOR. |
| **SEC-02** | P0 | Replace inconsistent hardcoded doctor email allowlists with one server-managed role model; Firestore rules and APIs must agree. |
| **SEC-03** | P0 | Remove `localStorage` role authorization; verify server identity and role on every protected operation. |
| **SEC-04** | P0 | Route appointment status/cancellation through server business logic; prove slot/calendar/notification/audit consistency. |
| **SEC-05** | P1 | Protect Google OAuth connect and validate state/redirect; prevent arbitrary account linking. |
| **SEC-06** | P1 | Fail closed when production encryption/signature secrets are missing; rotate any exposed credentials. |
| **SEC-07** | P1 | Restrict Storage file MIME types and size; validate file ownership and access on every download. |
| **SEC-08** | P1 | Verify Meta webhook signatures; missing production secret must reject the request. |
| **SEC-09** | P1 | Redact tokens, access secrets, patient identifiers and clinical data from logs, URLs and error messages. |
| **SEC-10** | P1 | Add rate limits, request size limits, input validation, secure headers and abuse monitoring to sensitive routes. |
| **SEC-11** | P1 | Define retention, deletion, export, consent and breach-response policies with qualified legal/privacy review. |
| **SEC-12** | P1 | Perform periodic access review and immediate offboarding for staff who leave or change responsibilities. |

> [!CAUTION]
> Security and privacy controls in this PRD are product requirements, not a certification of compliance with any law or standard. The clinic must obtain qualified legal, privacy and clinical governance review for applicable Indian and other jurisdictional requirements.

---

## 10. Non-Functional Requirements

| Category | Target Requirement |
| :--- | :--- |
| **Availability** | Target 99.5% monthly application availability for the doctor workspace, excluding planned maintenance; validate hosting/provider capabilities before commitment. |
| **Performance** | P95 dashboard initial data view ≤ 3 seconds on representative broadband; P95 common API response ≤ 800 ms excluding external provider latency. |
| **Scalability** | Support growth to multiple clinicians and staff with clinic-scoped queries; load-test expected concurrency and data volume before setting final capacity. |
| **Reliability** | Appointment lifecycle operations are transactional/idempotent; notification and integration failures are retryable and observable. |
| **Security** | Deny-by-default access, least privilege, server-side authorization, encrypted secrets, secure transport and auditable privileged actions. |
| **Accessibility** | Target WCAG 2.2 AA for core workflows; keyboard operation, focus management, labels, contrast and screen-reader semantics. |
| **Responsive UX** | Core appointment, patient and prescription workflows usable on desktop, tablet and mobile layouts. |
| **Localization** | Preserve English, Hindi and Marathi support where currently available; locale-aware labels and safe Unicode handling. |
| **Maintainability** | Typed domain contracts, shared service layer, documented state machines, migrations and runbooks. |
| **Observability** | Structured logs, metrics, traces/correlation IDs, error reporting, job queue health and provider integration health. |
| **Backup / Recovery** | Define Firestore/Storage backup frequency, restore tests, RPO/RTO and owner before production approval. |
| **Data Integrity** | No partial appointment transitions; versioned prescriptions; deterministic patient/appointment associations. |

---

## 11. UX and Interaction Principles

- Keep existing clinic branding and navigation concepts; simplify information density and remove duplicate actions.
- Make the current patient and appointment context persistent and unmistakable in clinical workflows.
- Use progressive disclosure for advanced controls; keep high-frequency actions one or two steps away.
- Confirm destructive or irreversible actions and require a reason where clinic policy mandates it.
- Use clear status language: `Draft`, `Pending`, `Confirmed`, `Completed`, `Cancelled`, `Failed`, `Issued`, `Amended`.
- Never show success until the server confirms persistence and required side effects are completed or safely queued.
- Show empty, loading, stale, permission-denied, offline and recoverable-error states consistently.

---

## 12. Key Enterprise User Journeys

### Journey A: Doctor Starts the Workday
1. Doctor signs in with an approved Google identity.
2. Server verifies identity, active clinic membership, and role.
3. Overview loads today’s scoped schedule and operational alerts.
4. New bookings arrive in the appointment feed in real time.
5. Doctor opens the appointment and verifies patient identity before reviewing the EHR.

### Journey B: Receptionist Books and Assigns
1. Receptionist searches or creates a patient using approved identity checks.
2. System displays only the minimum patient details needed for booking.
3. Receptionist selects an available clinician/time slot.
4. Booking service reserves the slot transactionally and returns a booking reference.
5. Patient confirmation is queued and delivery outcome is tracked.

### Journey C: Doctor Cancels an Appointment
1. Doctor selects Cancel and enters a reason.
2. Client submits an authenticated, idempotent request.
3. Server validates permission and current appointment state.
4. Service releases slot lock, updates appointment, reconciles calendar, queues notifications, and appends an audit event.
5. UI refreshes only after confirmed server outcome; failures show reconciliation state.

### Journey D: Doctor Issues a Prescription
1. Doctor opens the correct patient and appointment.
2. Doctor creates and previews a prescription using clinic-approved fields.
3. Server validates clinician permission and linked patient/appointment.
4. Doctor issues; immutable version and audit event are persisted.
5. Branded PDF is generated and sent only to a verified channel; delivery status is visible.

### Journey E: Administrator Manages Staff
1. Admin invites a staff member and assigns a clinic role.
2. Invitee authenticates and accepts access.
3. Server creates/activates membership and grants scoped permissions.
4. Audit event records actor and change.
5. Suspension/offboarding revokes access and invalidates active sessions according to policy.

### Journey F: Integration Failure Recovery
1. System detects failed Calendar/Meet or notification operation.
2. Dashboard shows provider, time, affected appointment, and safe error category.
3. Authorized user retries or system retries through durable queue.
4. Idempotency prevents duplicate events/messages.
5. Final provider outcome and operator action are recorded.

---

## 13. Acceptance Criteria and Definition of Done

- [ ] All P0 security requirements are implemented and independently verified in QA before production release.
- [ ] Tampering with `localStorage` cannot grant doctor access; unauthorized API and Firestore/Storage operations return denied outcomes.
- [ ] Appointment cancellation and rescheduling tests prove slot lock, appointment, calendar, lookup, notification, and audit consistency.
- [ ] Public lookup cannot reveal `accessSecret` or sensitive patient data; rate-limit and OTP/auth verification tests pass.
- [ ] Cross-clinic and cross-patient authorization tests pass for all sensitive resources.
- [ ] Prescription tests prove correct patient/appointment linkage, authorization, versioning, PDF output, and delivery state.
- [ ] Real-time appointment updates and listener cleanup are verified.
- [ ] WhatsApp template behavior is verified inside and outside the 24-hour customer-care window.
- [ ] Storage tests reject unsupported MIME types, oversized files, and unauthorized downloads.
- [ ] Analytics display only defined real data and explicit no-data states.
- [ ] Critical user journeys pass desktop/mobile E2E testing; accessibility checks cover core workflows.
- [ ] Runbooks exist for backup restore, staff offboarding, integration outage, failed notification jobs, and security incident escalation.
- [ ] QA evidence, deployment rollback plan, migration plan, and product-owner sign-off are attached to release.

---

## 14. QA and Test Strategy

| Test Layer | Required Coverage |
| :--- | :--- |
| **Unit** | State transitions, slot calculations, timezone, permissions, identity matching, prescription schema, template mapping, and idempotency |
| **API Integration** | 401/403, lookup privacy, cancellation/reschedule side effects, prescription issue/amend, OAuth protection, webhook signature, rate limits |
| **Firebase Rules** | Doctor/admin/receptionist/patient/guest boundaries; clinic isolation; cross-patient access; storage MIME/size; audit immutability |
| **Component** | `DoctorGuard`, appointment table, reschedule modal, patient drawer, prescription builder, availability editor, analytics, and error states |
| **End-to-End** | Sign-in, booking, patient search, consultation, prescription, cancellation/reschedule, messaging, integrations, and mobile workflows |
| **Security** | IDOR, enumeration, `localStorage` poisoning, OAuth CSRF/state replay, token leakage, unauthorized exports, and file access |
| **Resilience** | Provider outage, worker retry, duplicate requests, expired token, Firestore unavailable, partial integration failure, and recovery |
| **Performance** | Dashboard load, appointment search, calendar range, patient history, and concurrent booking load |

> [!NOTE]
> **Audit Baseline:** Supplied report states 90 unit tests passed with 0 failures, while reporting no component tests, API route integration tests, Firestore/Storage rules tests or prescription-management tests. Re-run tests on the target commit; historic test counts alone do not constitute release evidence.

---

## 15. Operational Readiness and Service Management

| Control | Required Operating Practice |
| :--- | :--- |
| **Monitoring** | Track API errors, auth denials, Firestore failures, booking conflicts, queue depth, delivery failures, and Google API errors. |
| **Alerting** | Define severity, threshold, owner, and escalation path for patient-data exposure, booking outage, and integration degradation. |
| **Incident Response** | Maintain a security/privacy incident runbook, evidence preservation, access revocation, and stakeholder notification process. |
| **Change Management** | Use reviewed pull requests, environment separation, staged rollout, migration checks, and rollback plans. |
| **Backup and Restore** | Document backup schedule, retention, restore owner, and periodic restore-test evidence. |
| **Support** | Provide internal issue reporting with appointment/job correlation ID and safe diagnostic metadata. |
| **Release Management** | Feature flags for risky migrations; no unreviewed production rules or secret changes. |

---

## 16. Product Metrics and KPI Definitions

| Metric | Definition / Guardrail |
| :--- | :--- |
| **Appointment Confirmation Rate** | Confirmed bookings ÷ eligible booking requests in selected period; define exclusions. |
| **Cancellation Rate** | Cancelled appointments ÷ confirmed appointments in selected period; separate patient vs clinic initiated where recorded. |
| **No-Show Rate** | Appointments marked no-show ÷ appointments expected to attend; requires approved status definition. |
| **Schedule Utilization** | Booked consultation minutes ÷ available consultation minutes; exclude closures and blocked time. |
| **Notification Success** | Provider-confirmed delivered/sent outcome ÷ eligible queued notifications; label provider semantics accurately. |
| **Prescription Delivery Success** | Successfully delivered prescriptions ÷ issued prescriptions with delivery requested. |
| **Median Time to First Action** | Time from booking creation to first staff/doctor action; define event source. |
| **System Reliability** | Availability, error rate, and P95 latency from monitored service telemetry. |

> Clinical outcome or remedy efficacy metrics are excluded until the clinic approves a measurement methodology, outcome definitions, data capture, and appropriate clinical review.

---

## 17. Prioritized Roadmap

| Phase | Focus | Scope / Exit Gate |
| :--- | :--- | :--- |
| **Phase 0 — Discovery & Safeguards** | Confirm operational decisions | Confirm roles, clinic tenancy strategy, patient verification, policies, hosting/worker architecture, secrets and production rules. No code migration until rollback plan exists. |
| **Phase 1 — P0 Security Foundation** | Patient privacy and access control | Secure lookup, remove `localStorage` role trust, centralize roles, protect OAuth, harden rules and storage. Exit: P0 tests pass. |
| **Phase 2 — Appointment Integrity** | Lifecycle correctness | Server-mediated mutations, cancellation side effects, reschedule UI, real-time updates, date exceptions. Exit: end-to-end consistency proven. |
| **Phase 3 — Clinical Workflow** | EHR and prescriptions | Versioned clinical notes, prescription issue/amend, PDF and delivery audit. Exit: clinician-approved templates and QA. |
| **Phase 4 — Communications & Operations** | Reliable messaging and integrations | WhatsApp templates, durable jobs, retries, operational alerts and integration recovery. Exit: failure/recovery tests pass. |
| **Phase 5 — Enterprise Administration** | Multi-role readiness | Staff management, scoped permissions, audit console, clinic settings and multi-clinician support. Exit: role matrix and isolation tests pass. |
| **Phase 6 — Optimization** | Analytics, accessibility and scale | Metric dictionary, performance testing, accessibility, backup/restore drills and operational reporting. |

---

## 18. Dependencies, Risks and Decisions

| Decision / Dependency | Why It Matters | Owner / Status |
| :--- | :--- | :--- |
| **Single Clinic vs. Multi-Clinic Tenancy** | Determines data model, access rules, and migration complexity | Product owner — Open |
| **Roles and Permission Matrix** | Prevents overbroad staff access | Clinic leadership — Open |
| **Patient Verification for Guest Lookup** | Required to protect appointment and patient information | Product / Security — Open |
| **Cancellation and Reschedule Policy** | Determines state transitions, fees, notification, and slot release behavior | Clinic leadership — Open |
| **Consultation Duration and Buffers** | Required for reliable scheduling | Clinic operations — Open |
| **Prescription Template and Clinician Assets** | Required for valid PDF layout and governance | Clinician — Open |
| **WhatsApp Template Approval & Configuration** | Required for outbound messaging outside customer care window | Operations — Open |
| **Hosting and Background Job Scheduler** | Runtime alignment between Vercel and background cron/queue architecture | Engineering — Must confirm |
| **Secrets and Deployed Firebase Rules** | Source audit cannot prove production configuration or exploitability | Security / Engineering — Must verify |
| **Retention, Consent, Export and Deletion Policy** | Requires clinic and qualified legal/privacy review | Clinic leadership — Open |
| **Backup RPO / RTO** | Needed for business continuity | Engineering / Owner — Open |

---

## 19. Assumptions and Evidence Limitations

1. This PRD is grounded in the Doctor Portal Technical Audit dated 14 November 2026 and the prior baseline Doctor Portal PRD.
2. Current implementation descriptions are source-audit observations; proposed enterprise requirements are target-state recommendations.
3. The audit reports Firebase Authentication, Firestore, Firebase Storage, Next.js App Router, Google OAuth/Calendar/Meet, Brevo and Meta WhatsApp Cloud API.
4. The audit reports a strong transactional booking/slot-lock foundation and Google Meet fallback behavior; these should be preserved and regression-tested.
5. The audit reports hosting/runtime ambiguity between serverless/Netlify in a diagram and the broader Vercel project context. Confirm before selecting a durable job scheduler.
6. Production secrets, Firebase deployed rules, OAuth settings, Meta template approvals, scheduled worker configuration and live exploitability are not established by source audit alone.
7. Regulatory and legal compliance requires separate qualified review.

---

## 20. Final Product Direction

Evolve the existing Doctor Portal into a governed clinical operations platform rather than replacing it. Preserve the appointment, calendar, EHR drawer, prescription, availability, chat, analytics, blog and Google integration foundations. Establish server-managed identity and clinic-scoped permissions first; then make appointment lifecycle and clinical records auditable and consistent; then add enterprise administration, durable communications, reporting governance and operational readiness.

The enterprise portal is ready when authorized staff can complete daily work reliably, patient data remains protected across every route and storage layer, appointment and prescription histories are traceable, failures are visible and recoverable, and release quality is demonstrated by automated tests and operational evidence.

---

## Appendix A — Audit Finding to Enterprise Requirement Traceability

| Audit Finding | Enterprise Requirement |
| :--- | :--- |
| Public appointment lookup returns PII and `accessSecret` without verification | `SEC-01`; APPT lookup privacy; QA security tests |
| Firestore allowlist differs from environment allowlist | `AUTH-03`; `SEC-02`; Firebase rules tests |
| Doctor role restored from `localStorage` | `AUTH-01/02`; `SEC-03` |
| Dashboard cancellation bypasses booking manager side effects | `APPT-01/02`; `SEC-04` |
| Doctor portal has no reschedule UI | `APPT-03` |
| Google OAuth connect lacks robust doctor authentication | `SEC-05` |
| WhatsApp freeform messages may fail outside 24-hour window | Communication requirements; template approval |
| Storage lacks MIME/size restrictions | `SEC-07` |
| Notification worker uses `setTimeout` in serverless context | Communication requirements; durable job scheduler |
| Analytics contains hardcoded 94.2% and synthetic values | `DASH-05`; analytics governance |
| Appointments loaded once, not real-time | `APPT-05` |
| Prescription has no PDF/email and writes lack audit | `RX-01` through `RX-08` |
| No date-specific availability exceptions | Availability requirements |
| UI/API/rules/prescription test gaps | QA strategy and Definition of Done |

---

## Appendix B — Release Gate Checklist

- [ ] P0 security findings fixed and independently tested
- [ ] Deployed Firestore and Storage rules reviewed
- [ ] Production secrets present, rotated where needed and fail-closed behavior verified
- [ ] Doctor/staff role provisioning and offboarding tested
- [ ] Appointment cancellation/reschedule side effects verified
- [ ] Patient lookup privacy and abuse controls verified
- [ ] Prescription lifecycle and PDF template approved by clinician
- [ ] Notification templates approved and delivery outcomes monitored
- [ ] Backup/restore and incident runbooks tested
- [ ] QA sign-off, rollback plan and clinic-owner approval recorded
