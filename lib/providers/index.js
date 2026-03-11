// lib/providers/index.js
// ─────────────────────────────────────────────────────────────────────────────
// VitaIntake — Central AI Provider Router
//
// Reads AI_PROVIDER from environment and dispatches to the correct adapter.
// Add a new provider by:
//   1. Creating lib/providers/yourprovider.js
//   2. Adding it to the PROVIDER_MAP below
//   3. Setting AI_PROVIDER=yourprovider in .env.local
// ─────────────────────────────────────────────────────────────────────────────

import { callGemini } from "./gemini.js";
import { callGroq }   from "./groq.js";
import { INTAKE_SYSTEM_PROMPT } from "../vitaintake";
// ── Supported providers ──────────────────────────────────────────────────────
const PROVIDER_MAP = {
  gemini: callGemini,
  groq:   callGroq,
};

// ── Provider metadata for UI display ────────────────────────────────────────
export const PROVIDER_INFO = {
  gemini: {
    name:  "Google Gemini",
  model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    badge: "🔵",
  },
  groq: {
    name:  "Groq",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    badge: "⚡",
  },
};

/**
 * Call the configured AI provider.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>}
 */
export async function callAI(messages) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

  const callFn = PROVIDER_MAP[provider];

  if (!callFn) {
    throw new Error(
      `Unknown AI_PROVIDER "${provider}". Valid options: ${Object.keys(PROVIDER_MAP).join(", ")}`
    );
  }

  return callFn(INTAKE_SYSTEM_PROMPT, messages);
}

/**
 * Get info about the currently configured provider.
 * Safe to call from server components.
 */
export function getProviderInfo() {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  return PROVIDER_INFO[provider] || { name: provider, model: "unknown", badge: "🤖" };
}
