# Google Calendar & Google Meet Integration Guide

This guide details the end-to-end setup and operation of the Google Calendar and Google Meet appointment booking system for **Dr. Pratima Agale Homeopathy Clinic**.

---

## 1. Google Cloud Console Setup

### Step 1.1: Create or Select a Google Cloud Project
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your existing Firebase project (`doc-web-a913f`) or create a dedicated project.
3. Note your **Project ID**.

### Step 1.2: Enable Required APIs
Go to **APIs & Services > Library** and enable:
1. **Google Calendar API** (`calendar-json.googleapis.com`)
2. **Google People API** or **Google OAuth2 API** (for verifying doctor email identity)

### Step 1.3: Configure the OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **User Type**: **External** (or Internal if using Google Workspace).
3. Fill in:
   - **App name**: `Dr. Pratima Agale Homeopathy Clinic`
   - **User support email**: `doctor@pratimaagale.in`
   - **Developer contact email**: `doctor@pratimaagale.in`
4. In **Scopes for Google APIs**, add:
   - `https://www.googleapis.com/auth/calendar.events` (View and edit events on all calendars)
   - `https://www.googleapis.com/auth/userinfo.email` (View doctor email address)
5. In **Test Users**, add Dr. Pratima Agale's Google email (e.g., `doctor@pratimaagale.in`, `varun45j@gmail.com`).

### Step 1.4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
2. Select Application type: **Web application**.
3. Name: `Pratima Agale Web Portal`.
4. **Authorized JavaScript origins**:
   - `https://www.pratimaagale.in`
   - `http://localhost:3000` (for local development)
5. **Authorized redirect URIs**:
   - `https://www.pratimaagale.in/api/integrations/google/callback`
   - `http://localhost:3000/api/integrations/google/callback`
6. Click **Create** and copy:
   - **Client ID** (`GOOGLE_CLIENT_ID`)
   - **Client Secret** (`GOOGLE_CLIENT_SECRET`)

---

## 2. Environment Variables Configuration

Add the following to your production deployment environment (Vercel, Netlify, or `.env.local`):

```bash
# Centralized Base URL
NEXT_PUBLIC_BASE_URL=https://www.pratimaagale.in

# Google OAuth
GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your_client_secret"
GOOGLE_REDIRECT_URI="https://www.pratimaagale.in/api/integrations/google/callback"
GOOGLE_ENCRYPTION_KEY="your-32-byte-secret-encryption-key"

# Doctor RBAC Whitelist
NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL="doctor@pratimaagale.in,varun45j@gmail.com"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="doc-web-a913f"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@doc-web-a913f.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email & WhatsApp Notifications
BREVO_API_KEY="xkeysib-..."
EMAIL_FROM="clinic@pratimaagale.in"
EMAIL_FROM_NAME="Dr. Pratima Agale Clinic"
WHATSAPP_ACCESS_TOKEN="EAAG..."
PHONE_NUMBER_ID="your_phone_number_id"
VERIFY_TOKEN="your_webhook_verify_token"
APP_SECRET="your_meta_app_secret"

# Background Recovery Worker
INTERNAL_WORKER_SECRET="your-secure-internal-cron-key"
```

---

## 3. Architecture & Data Flow

### 3.1. Google Account Connection Flow
1. Dr. Pratima logs into the Doctor Dashboard at `/doctor`.
2. The dashboard displays the **Google Calendar & Meet Integration** card.
3. Clicking **Connect Google Account** directs to `GET /api/integrations/google/connect`.
4. The route generates a cryptographically signed HMAC state parameter containing the doctor ID and timestamp, requesting `offline` access (`prompt: consent`) and redirects to Google.
5. On authorization, Google redirects back to `GET /api/integrations/google/callback`.
6. The callback validates HMAC signature and freshness, exchanges the authorization code for tokens, retrieves the doctor's verified email, encrypts the refresh token using AES-256-GCM, and stores it in Firestore (`integrations/google_${doctorId}`).

### 3.2. Patient Online Booking Flow
1. Patient opens the appointment booking modal on the website.
2. The UI is focused on **Online Video Consultation (Google Meet)**.
3. Dynamically fetches available slots from `GET /api/availability?date=YYYY-MM-DD`. Availability engine factors in:
   - Doctor's weekly active schedule and slot intervals.
   - Past time slots in `Asia/Kolkata` (IST).
   - Confirmed appointments and active slot reservation holds in Firestore.
4. Patient enters Name, Mobile Number, Email, Condition, and accepts the privacy notice.
5. Submits to `POST /api/appointments`:
   - Enforces slot reservation atomically using Firestore transaction (`slotLocks/${doctorId}_${date}_${time}`).
   - Idempotency key prevents duplicate booking creation.
   - Creates Google Calendar event with `conferenceDataVersion: 1` and `hangoutsMeet` solution key.
   - Obtains unique Google Meet conference room link.
   - Marks appointment `Confirmed`, saves Meet link & event ID, and confirms slot lock.
   - Enqueues notification job in `notificationJobs` collection for immediate multi-channel delivery (Email via Brevo + WhatsApp via Meta Cloud API).
   - Writes structured audit log to `auditLogs`.

### 3.3. Rescheduling & Cancellation
- **Rescheduling**: Atomically holds new slot, updates Google Calendar event start/end times in `Asia/Kolkata`, sends updated Meet invitation, and releases the previous slot lock.
- **Cancellation**: Deletes or marks Google Calendar event cancelled, releases the slot lock in Firestore, and sends cancellation notification.

---

## 4. Background Job Worker & Auto-Recovery

If Google Calendar or notification providers experience temporary downtime or network timeouts during booking:
1. The appointment record is preserved with `calendarSyncStatus: "failed"`.
2. The background job worker endpoint `POST /api/internal/jobs` (authenticated via `Authorization: Bearer <INTERNAL_WORKER_SECRET>`):
   - Retries failed notification deliveries with exponential backoff.
   - Automatically synchronizes and provisions Google Meet rooms for any pending/failed appointments.
   - Can be triggered on a 5-minute recurring cron via Netlify Scheduled Functions, Vercel Cron, or Google Cloud Scheduler.

---

## 5. Security & Privacy Safeguards

- **PHI Protection**: Clinical diagnoses, detailed medical histories, and sensitive patient notes are never included in Google Calendar summaries, public URLs, or WhatsApp messages.
- **Encryption at Rest**: OAuth refresh tokens are stored encrypted in Firestore using AES-256-GCM authenticated cipher.
- **Doctor RBAC**: Doctor dashboard routes, token management, and patient record modifications are verified server-side against Firebase ID tokens and authorized doctor email lists.
- **Self-Service Token Security**: Patients can manage their own appointments via secure, unguessable cryptographic tokens without requiring login.

