import type { IGif } from "@giphy/js-types";
import {
  type ReactionCategory,
  PREDEFINED_CATEGORY_QUERIES,
  CURATED_CATEGORY_POOLS,
  selectGifFromPool,
} from "./categoryPools.ts";

export type ReactionCategoryId =
  | "greeting"
  | "time_of_day"
  | "illness"
  | "emotion"
  | "humor"
  | "appreciation"
  | "recovery"
  | "fitness"
  | "conversation"
  | "farewell";

export interface ReactionContextResult {
  categoryId: ReactionCategoryId;
  subType?: string;
  name: string;
  query: string;
  confidence: number;
}

/**
 * 0. Profanity, curse words, abusive language, and insults.
 * If ANY of these occur, reaction GIF MUST BE STRICTLY SUPPRESSED (return null).
 */
export const PROFANITY_PATTERNS: RegExp[] = [
  /\b(f+u+c+k+|f+u+k+|f+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|b+a+s+t+a+r+d+|d+i+c+k+|c+o+c+k+|c+u+n+t+|p+u+s+s+y+|m+o+t+h+e+r+f+u+c+k+|d+u+m+b+a+s+s+|s+t+f+u|s+h+u+t\s*u+p|s+c+r+e+w\s*y+o+u|g+o\s*t+o\s*h+e+l+l|p+i+s+s\s*o+f+f|c+h+u+t+i+y+a+|c+h+u+t+i+y+e+|m+a+d+a+r+c+h+o+d+|b+h+e+n+c+h+o+d+|b+h+o+s+d+i+k+e+|b+s+d+k|g+a+a?n+d+u?|h+a+r+a+m+i|k+a+m+i+n+a|k+a+m+e+e+n+a|l+a+v+d+e|l+a+u+d+a|l+o+d+a|j+h+a+a?t+u|r+a+n+d+i?|स+ा+ल+े|चूतिया|चूतिये|मादरचोद|बहनचोद|भेनचोद|भोसडीके|गांडू|हरामी|कमीना|लवडे|लौड़ा|रांड|कुत्ता)\b/i,
  /\b(f[\*_#@!]+ck|f[\*_#@!]+k|sh[\*_#@!]+t|b[\*_#@!]+tch|a[\*_#@!]+hole|d[\*_#@!]+ck)\b/i,
];

export function isProfanity(text: string): boolean {
  if (!text || !text.trim()) return false;
  return PROFANITY_PATTERNS.some((p) => p.test(text));
}

/**
 * 1. Severe medical symptoms and emergencies.
 * If ANY of these occur, reaction GIF MUST BE STRICTLY SUPPRESSED (return null).
 */
export const EMERGENCY_PATTERNS: RegExp[] = [
  /\b(severe\s*chest\s*pain|chest\s*pain|heart\s*attack|cardiac|stroke)\b/i,
  /\b(breathing\s*difficult(y|ies)|shortness\s*of\s*breath|breathless|can'?t\s*breathe|choking|gasping|suffocat(e|ing))\b/i,
  /\b(unconscious(ness)?|passed\s*out|faint(ing|ed)?|seizure|paraly(zed|sis)|coma)\b/i,
  /\b(severe\s*bleeding|hemorrhage|profuse\s*bleeding|vomiting\s*blood|coughing\s*blood)\b/i,
  /\b(suicid(e|al)|kill\s*myself|self\s*harm|overdose|poison(ing|ed)?)\b/i,
  /\b(anaphyla(xis|ctic)|severe\s*allergic\s*reaction)\b/i,
];

/**
 * 2. Informational & diagnostic medical questions.
 * When asking educational or conceptual questions (e.g. "What causes fever?"),
 * suppress GIFs by default to maintain medical precision.
 */
export const MEDICAL_QUESTION_PATTERNS: RegExp[] = [
  /^(what\s*(is|are|causes|can\s*cause)|why\s*(do|does|is)|how\s*(does|to\s*cure|to\s*treat))\b/i,
  /\b(can\s+.*\s+cause|is\s+.*\s+(contagious|dangerous|curable|genetic))\b/i,
  /\b(tell\s*me\s*about|explain\s+to\s*me|reasons?\s*for|symptoms?\s*of|definition\s*of)\b/i,
];

/**
 * 3. Negation patterns (e.g. "I don't have fever", "no headache", "not sick")
 */
export const NEGATION_PATTERNS: RegExp[] = [
  /\b(don'?t\s*have|do\s*not\s*have|no\s+|not\s*having|free\s*from|without|haven'?t\s*got|never\s*had|haven'?t\s*had|negative\s*for|not\s*(sick|experiencing))\b/i,
];

/**
 * 4. Recovery & improvement patterns (e.g. "fever is gone", "feeling better")
 */
export const RECOVERY_PATTERNS: RegExp[] = [
  /\b(fever|headache|pain|cold|cough|sore\s*throat|migraine|nausea|stomach\s*ache)\s+(is\s+)?(gone|cured|disappeared|resolved|over|better)\b/i,
  /\b(feeling|felt|am)\s+(much\s+)?(better|fine|recovered|healed|great\s*now)\b/i,
  /\b(recovered\s*from|got\s*over|no\s*longer\s*have|healed\s*from|pain\s*is\s*gone)\b/i,
  /\b(my\s+.*\s+is\s+gone)\b/i,
];

/**
 * 5. Ordinary Illness & Symptom Patterns (Gentle, empathetic character reactions)
 */
export const ILLNESS_PATTERNS: { subType: string; query: string; pattern: RegExp }[] = [
  {
    subType: "fever",
    query: PREDEFINED_CATEGORY_QUERIES.fever,
    pattern: /\b(fever|high\s*temp(erature)?|chills|burning\s*up)\b/i,
  },
  {
    subType: "headache",
    query: PREDEFINED_CATEGORY_QUERIES.headache,
    pattern: /\b(headache|migraine|head\s*hurts|head\s*pounding)\b/i,
  },
  {
    subType: "cold_cough",
    query: PREDEFINED_CATEGORY_QUERIES.cold,
    pattern: /\b(cold|cough(ing)?|runny\s*nose|stuffy\s*nose|sneezing|congestion)\b/i,
  },
  {
    subType: "stomach_pain",
    query: PREDEFINED_CATEGORY_QUERIES.stomach,
    pattern: /\b(stomach\s*pain|stomach\s*ache|tummy\s*ache|cramps|indigestion|acid\s*reflux)\b/i,
  },
  {
    subType: "body_pain",
    query: PREDEFINED_CATEGORY_QUERIES.body_pain,
    pattern: /\b(body\s*(pain|aches?|hurts?|is\s*aching)|aching\s*body|muscle\s*(aches?|pain)|back\s*pain|joint\s*pain)\b/i,
  },
  {
    subType: "nausea_dizziness",
    query: "rest and heal gentle caring cartoon",
    pattern: /\b(nausea|nauseous|vomit(ing)?|dizzy|dizziness|lightheaded|vertigo)\b/i,
  },
  {
    subType: "weakness_fatigue",
    query: PREDEFINED_CATEGORY_QUERIES.fever,
    pattern: /\b(weakness|feeling\s*weak|exhausted|fatigue|drained|no\s*energy)\b/i,
  },
  {
    subType: "throat_flu_tooth",
    query: PREDEFINED_CATEGORY_QUERIES.cold,
    pattern: /\b(sore\s*throat|throat\s*pain|flu|influenza|toothache|tooth\s*pain)\b/i,
  },
];

export function isEmergencySituation(text: string): boolean {
  if (!text || !text.trim()) return false;
  return EMERGENCY_PATTERNS.some((regex) => regex.test(text));
}

export function isInformationalMedicalQuestion(text: string): boolean {
  if (!text || !text.trim()) return false;
  const hasQuestionPattern =
    MEDICAL_QUESTION_PATTERNS.some((regex) => regex.test(text)) || text.trim().endsWith("?");
  const hasFirstPersonReport =
    /\b(i\s*have|i'?m\s*having|my\s+|i\s*feel|i\s*am\s*suffering)\b/i.test(text);
  return hasQuestionPattern && !hasFirstPersonReport;
}

export function isSymptomNegated(text: string, symptom: string): boolean {
  const clean = text.toLowerCase();
  const regex = new RegExp(
    `(?:don'?t\\s*have|do\\s*not\\s*have|no\\s+|without|haven'?t\\s*got|free\\s*from|not\\s*)\\s*${symptom}`,
    "i"
  );
  return regex.test(clean) || NEGATION_PATTERNS.some((p) => p.test(clean));
}

/**
 * Maps any query or category name to a verified ReactionCategory.
 * If unknown or unconfident, returns null.
 */
export function resolveReactionCategory(categoryOrQuery: string): ReactionCategory | null {
  if (!categoryOrQuery || typeof categoryOrQuery !== "string") return null;
  const lower = categoryOrQuery.toLowerCase().trim();

  // Exact category name matches
  if (lower in PREDEFINED_CATEGORY_QUERIES) {
    return lower as ReactionCategory;
  }

  // Predefined keyword mapping
  if (/morning/i.test(lower)) return "morning";
  if (/afternoon/i.test(lower)) return "afternoon";
  if (/evening/i.test(lower)) return "evening";
  if (/headache|migraine/i.test(lower)) return "headache";
  if (/fever|thermometer/i.test(lower)) return "fever";
  if (/cold|cough|tea/i.test(lower)) return "cold";
  if (/stomach|tummy/i.test(lower)) return "stomach";
  if (/pain|joint\s*pain|muscle\s*ache/i.test(lower)) return "body_pain";
  if (/recovery|healed|feeling\s*better|celebrat/i.test(lower)) return "recovery";
  if (/thank|apprec|grateful/i.test(lower)) return "appreciation";
  if (/bye|farewell|good\s*night/i.test(lower)) return "farewell";
  if (/laugh|humor|joke/i.test(lower)) return "humor";
  if (/fitness|gym|workout|water/i.test(lower)) return "fitness";
  if (/puppy|waving\s*hi|greeting|hello|namaste|\bhi\b/i.test(lower)) return "greeting";

  return null;
}

/**
 * Context-Aware Reaction Classification Engine
 * Evaluates ONLY the CURRENT user message (independent of previous turns).
 * Returns a confident category result or null.
 */
export function detectContextualReaction(userText: string): ReactionContextResult | null {
  if (!userText || !userText.trim()) return null;
  const text = userText.trim();
  const lower = text.toLowerCase();

  // 0. STRICT CONDUCT GATE: Profanity, curse words, and abuse return NULL immediately
  if (isProfanity(lower)) {
    return null;
  }

  // 1. STRICT MEDICAL SAFETY GATE: Emergencies return NULL immediately
  if (isEmergencySituation(lower)) {
    return null;
  }

  // 2. INFORMATIONAL MEDICAL QUESTIONS: e.g. "What causes a headache?" returns NULL
  if (isInformationalMedicalQuestion(lower)) {
    return null;
  }

  // 3. NEGATION ONLY: e.g. "I don't have a headache", "no fever" returns NULL
  if (NEGATION_PATTERNS.some((p) => p.test(lower)) && /\b(fever|headache|cold|cough|pain|sick|migraine)\b/i.test(lower)) {
    return null;
  }

  // 4. RECOVERY & RESOLUTION: e.g. "My fever is gone", "feeling better"
  if (RECOVERY_PATTERNS.some((p) => p.test(lower))) {
    return {
      categoryId: "recovery",
      subType: "recovery",
      name: "Recovery",
      query: PREDEFINED_CATEGORY_QUERIES.recovery,
      confidence: 0.95,
    };
  }

  // 5. EMOTIONAL STATES COMBINED WITH ILLNESS (Fear, Anxiety)
  const hasFearOrAnxiety = /\b(scared|terrified|afraid|worried|anxious|panic)\b/i.test(lower);
  const mentionsIllness = ILLNESS_PATTERNS.some((item) => item.pattern.test(lower));

  if (hasFearOrAnxiety && mentionsIllness) {
    return {
      categoryId: "emotion",
      subType: "comforting_fear",
      name: "Comforting Support",
      query: PREDEFINED_CATEGORY_QUERIES.stomach,
      confidence: 0.95,
    };
  }

  // 6. ILLNESS & SYMPTOMS (Active, Non-Negated)
  for (const item of ILLNESS_PATTERNS) {
    if (item.pattern.test(lower)) {
      if (isSymptomNegated(lower, item.subType)) {
        continue;
      }
      return {
        categoryId: "illness",
        subType: item.subType,
        name: `Illness (${item.subType})`,
        query: item.query,
        confidence: 0.9,
      };
    }
  }

  // 6b. EMOTIONAL STATES (Sadness, Lonely, Crying, Stress, Happy, Bored, Tired)
  if (/\b(lonely|alone|isolated)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "lonely",
      name: "Comforting Hug",
      query: "warm friendly hug caring cartoon",
      confidence: 0.92,
    };
  }

  if (/\b(sad|crying|tears|depressed|heartbroken|unhappy)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "sad",
      name: "Comforting Hug",
      query: "comforting warm hug caring cartoon",
      confidence: 0.9,
    };
  }

  if (/\b(stressed|anxious|overwhelmed|nervous)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "stressed",
      name: "Calming Breath",
      query: "breathe calm relax soothing cartoon",
      confidence: 0.88,
    };
  }

  if (/\b(happy|excited|joyful|cheerful|thrilled|great\s*day|delighted)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "happy",
      name: "Happy Celebration",
      query: "happy dancing celebration cartoon",
      confidence: 0.9,
    };
  }

  if (/\b(bored|entertain\s*me|nothing\s*to\s*do)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "bored",
      name: "Fun Dancing",
      query: "funny dancing cartoon",
      confidence: 0.88,
    };
  }

  if (/\b(tired|sleepy|exhausted|need\s*sleep|bedtime)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "tired",
      name: "Cozy Rest",
      query: "cozy sleepy bedtime rest cartoon",
      confidence: 0.88,
    };
  }

  // 7. TIME-OF-DAY GREETINGS (Checked BEFORE generic greetings to guarantee specific match)
  if (/\b(good\s*morning|mornin|gm)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "morning",
      name: "Morning Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.morning,
      confidence: 0.95,
    };
  }
  if (/\b(good\s*afternoon)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "afternoon",
      name: "Afternoon Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.afternoon,
      confidence: 0.95,
    };
  }
  if (/\b(good\s*evening)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "evening",
      name: "Evening Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.evening,
      confidence: 0.95,
    };
  }

  // 8. APPRECIATION: "thank you", "thanks", "grateful"
  if (/\b(thank\s*you|thanks|tysm|thx|appreciate\s*it|grateful)\b/i.test(lower)) {
    return {
      categoryId: "appreciation",
      subType: "appreciation",
      name: "Appreciation",
      query: PREDEFINED_CATEGORY_QUERIES.appreciation,
      confidence: 0.95,
    };
  }

  // 9. GREETINGS AND WELCOME: "hi", "hello", "hey", "welcome", "greetings", "namaste"
  if (/\b(hi|hello|heyy*|hey|hola|namaste|welcome|greetings)\b/i.test(lower)) {
    return {
      categoryId: "greeting",
      subType: "greeting",
      name: "Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.greeting,
      confidence: 0.95,
    };
  }

  // 10. FAREWELL: bye, goodbye, see you, take care, good night
  if (/\b(bye|goodbye|see\s*you|cya|take\s*care|good\s*night)\b/i.test(lower)) {
    return {
      categoryId: "farewell",
      subType: "farewell",
      name: "Farewell",
      query: PREDEFINED_CATEGORY_QUERIES.farewell,
      confidence: 0.92,
    };
  }

  // 11. HUMOR: "haha", "lol", "lmao"
  if (/\b(haha+|hehe+|lmao|lol|rofl|lmfao|joke|hilarious)\b/i.test(lower)) {
    return {
      categoryId: "humor",
      subType: "humor",
      name: "Humor",
      query: PREDEFINED_CATEGORY_QUERIES.humor,
      confidence: 0.9,
    };
  }

  // 12. FITNESS AND LIFESTYLE
  if (/\b(gym|workout|exercise|hydration|drink(ing)?\s*water|active\s*lifestyle)\b/i.test(lower)) {
    return {
      categoryId: "fitness",
      subType: "fitness",
      name: "Fitness & Lifestyle",
      query: PREDEFINED_CATEGORY_QUERIES.fitness,
      confidence: 0.88,
    };
  }

  // 13. NO CONFIDENT INTENT MATCH: Return NULL (Never fallback to greeting!)
  return null;
}

/**
 * Fetches or selects a relevant non-repeating GIF.
 * - In browser environment: calls server route `/api/reaction-gif` (keeping API keys server-side).
 * - In server/test environment: selects directly from the curated category pool with rotation history.
 * - Handles empty API responses without showing an unrelated GIF.
 */
export async function fetchReactionGif(
  categoryOrQuery: string,
  options?: { conversationId?: string; recentGifIds?: string[] }
): Promise<IGif | null> {
  const resolvedCategory = resolveReactionCategory(categoryOrQuery);
  if (!resolvedCategory) {
    return null;
  }

  const recentIds = options?.recentGifIds || [];

  // Browser environment: Call secure server endpoint
  if (typeof window !== "undefined" && typeof fetch === "function") {
    try {
      const res = await fetch("/api/reaction-gif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: resolvedCategory,
          conversationId: options?.conversationId,
          recentGifIds: recentIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.gif) {
          return data.gif;
        }
      }
    } catch (clientErr) {
      console.warn("Client reaction GIF fetch failed, using local curated pool:", clientErr);
    }
  }

  // Server, test, or offline fallback: select from curated category pool
  const pool = CURATED_CATEGORY_POOLS[resolvedCategory] || [];
  return selectGifFromPool(resolvedCategory, pool, recentIds);
}
