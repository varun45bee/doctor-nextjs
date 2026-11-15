/**
 * Layer 2: Conversation Summary Memory
 * Automatically compresses older conversation turns into a high-density clinical summary
 * to preserve key facts, chief complaints, and timeline without context window bloat.
 */

import { type ChatMessageTurn } from "./shortTermMemory.ts";

export interface ConversationSummaryState {
  chiefComplaint?: string;
  reportedSymptoms: string[];
  duration?: string;
  modalities?: string;
  keyFacts: string[];
  lastSummaryTurnIndex: number;
}

/**
 * Extracts and summarizes key clinical points from a list of messages.
 */
export function buildConversationSummary(
  messages: ChatMessageTurn[],
  existingSummary?: ConversationSummaryState
): ConversationSummaryState {
  const summary: ConversationSummaryState = {
    chiefComplaint: existingSummary?.chiefComplaint,
    reportedSymptoms: [...(existingSummary?.reportedSymptoms || [])],
    duration: existingSummary?.duration,
    modalities: existingSummary?.modalities,
    keyFacts: [...(existingSummary?.keyFacts || [])],
    lastSummaryTurnIndex: messages.length,
  };

  const symptomRegex = /\b(headache|fever|cough|cold|throat\s*pain|migraine|pcod|pcos|thyroid|asthma|rash|eczema|stomach\s*pain|joint\s*pain|back\s*pain|anxiety|stress|nausea|acidity|hair\s*fall)\b/gi;
  const durationRegex = /\b(since\s*yesterday|for\s*\d+\s*(days?|weeks?|months?|years?)|from\s*\d+\s*(days?|weeks?)|yesterday(\s*evening)?|today\s*morning|last\s*night)\b/gi;
  const modalityRegex = /\b(worse\s*(with|in|after|when)|better\s*(with|after|when|by)|relief\s*(from|by)|triggered\s*by)\b/gi;

  for (const m of messages) {
    if (m.role === "user") {
      const text = m.content;

      // Extract symptoms
      const matches = text.match(symptomRegex);
      if (matches) {
        for (const match of matches) {
          const s = match.toLowerCase();
          if (!summary.reportedSymptoms.includes(s)) {
            summary.reportedSymptoms.push(s);
            if (!summary.chiefComplaint) {
              summary.chiefComplaint = s;
            }
          }
        }
      }

      // Extract duration
      const durMatches = text.match(durationRegex);
      if (durMatches && durMatches[0]) {
        summary.duration = durMatches[0].trim();
      }

      // Extract modalities
      const modMatches = text.match(modalityRegex);
      if (modMatches && modMatches[0]) {
        summary.modalities = text.substring(text.indexOf(modMatches[0]), text.indexOf(modMatches[0]) + 40).trim();
      }
    }
  }

  return summary;
}

/**
 * Formats the summary into a compact string suitable for LLM injection.
 */
export function formatSummaryForPrompt(summary: ConversationSummaryState): string {
  if (
    !summary.chiefComplaint &&
    summary.reportedSymptoms.length === 0 &&
    !summary.duration
  ) {
    return "";
  }

  const parts: string[] = [];
  if (summary.chiefComplaint) {
    parts.push(`- Chief Concern: ${summary.chiefComplaint}`);
  }
  if (summary.reportedSymptoms.length > 0) {
    parts.push(`- Active Symptoms: ${summary.reportedSymptoms.join(", ")}`);
  }
  if (summary.duration) {
    parts.push(`- Duration: ${summary.duration}`);
  }
  if (summary.modalities) {
    parts.push(`- Modalities: ${summary.modalities}`);
  }

  return `\n[CONVERSATION SUMMARY (EARLIER TURNS)]\n${parts.join("\n")}\n`;
}
