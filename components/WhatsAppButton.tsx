"use client";

// components/WhatsAppButton.tsx

// ── Change this to the doctor's actual number ──────────────────
// Format: country code + number (no + or spaces)
// Example: India 91 + 9876543210 = "919876543210"
const WHATSAPP_PHONE = "919359875511";
const WHATSAPP_MESSAGE =
  "Hello Dr. Pratima Agale, I would like to book a homeopathy consultation.";
// ───────────────────────────────────────────────────────────────

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <>
      <style>{`
        .wa-fab {
          position: fixed;
          bottom: 90px;
          right: 20px;
          z-index: 99999;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: #25D366;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.22);
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wa-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.28);
        }
        .wa-fab .wa-tooltip {
          position: absolute;
          right: 62px;
          white-space: nowrap;
          background: #1a1a1a;
          color: #fff;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 6px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .wa-fab:hover .wa-tooltip {
          opacity: 1;
        }
      `}</style>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-fab"
        aria-label="Chat with Dr. Pratima Agale on WhatsApp"
      >
        <span className="wa-tooltip">Chat with Doctor</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="30"
          height="30"
          fill="white"
          aria-hidden="true"
        >
          <path d="M16 0C7.164 0 0 7.163 0 16c0 2.82.736 5.46 2.02 7.752L0 32l8.476-2.004A15.94 15.94 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.756-1.843l-.484-.287-5.03 1.188 1.23-4.902-.317-.503A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.161-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.233.266-.465.299-.863.1-.398-.2-1.68-.619-3.2-1.974-1.183-1.055-1.981-2.358-2.214-2.756-.233-.398-.025-.613.175-.811.18-.179.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.067-.498-.033-.698-.1-.199-.897-2.162-1.23-2.96-.324-.777-.653-.672-.897-.684l-.764-.013c-.266 0-.698.1-1.063.498-.365.398-1.396 1.362-1.396 3.322s1.43 3.854 1.63 4.12c.199.266 2.814 4.296 6.817 6.025.953.411 1.696.657 2.274.841.955.304 1.824.261 2.51.158.766-.114 2.354-.962 2.686-1.892.333-.93.333-1.727.233-1.892-.1-.166-.365-.266-.763-.465z" />
        </svg>
      </a>
    </>
  );
}