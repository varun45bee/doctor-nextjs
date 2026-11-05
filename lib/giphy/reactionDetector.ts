import type { IGif } from "@giphy/js-types";
import { getGiphyClient } from "./giphyClient.ts";

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
    query: "caring sick thermometer rest cartoon",
    pattern: /\b(fever|high\s*temp(erature)?|chills|burning\s*up)\b/i,
  },
  {
    subType: "headache",
    query: "gentle headache rest sympathy character",
    pattern: /\b(headache|migraine|head\s*hurts|head\s*pounding)\b/i,
  },
  {
    subType: "cold_cough",
    query: "stay warm tea cozy caring cartoon",
    pattern: /\b(cold|cough(ing)?|runny\s*nose|stuffy\s*nose|sneezing|congestion)\b/i,
  },
  {
    subType: "stomach_pain",
    query: "gentle comforting hug caring cartoon",
    pattern: /\b(stomach\s*pain|stomach\s*ache|tummy\s*ache|cramps|indigestion|acid\s*reflux)\b/i,
  },
  {
    subType: "body_pain",
    query: "get well rest caring cartoon",
    pattern: /\b(body\s*(pain|aches?|hurts?|is\s*aching)|aching\s*body|muscle\s*(aches?|pain)|back\s*pain|joint\s*pain)\b/i,
  },
  {
    subType: "nausea_dizziness",
    query: "rest and heal gentle caring cartoon",
    pattern: /\b(nausea|nauseous|vomit(ing)?|dizzy|dizziness|lightheaded|vertigo)\b/i,
  },
  {
    subType: "weakness_fatigue",
    query: "get well soon rest caring cartoon",
    pattern: /\b(weakness|feeling\s*weak|exhausted|fatigue|drained|no\s*energy)\b/i,
  },
  {
    subType: "throat_flu_tooth",
    query: "feel better soon caring gentle cartoon",
    pattern: /\b(sore\s*throat|throat\s*pain|flu|influenza|toothache|tooth\s*pain)\b/i,
  },
];

/**
 * Checks whether user message is an emergency or severe clinical situation.
 */
export function isEmergencySituation(text: string): boolean {
  if (!text || !text.trim()) return false;
  return EMERGENCY_PATTERNS.some((regex) => regex.test(text));
}

/**
 * Checks whether user message is an informational/educational question rather than a personal report.
 */
export function isInformationalMedicalQuestion(text: string): boolean {
  if (!text || !text.trim()) return false;
  // If it matches question structure and doesn't contain first-person symptom claims
  const hasQuestionPattern = MEDICAL_QUESTION_PATTERNS.some((regex) => regex.test(text)) || text.trim().endsWith("?");
  const hasFirstPersonReport = /\b(i\s*have|i'?m\s*having|my\s+|i\s*feel|i\s*am\s*suffering)\b/i.test(text);
  return hasQuestionPattern && !hasFirstPersonReport;
}

/**
 * Checks if a specific symptom keyword is negated in the sentence.
 */
export function isSymptomNegated(text: string, symptom: string): boolean {
  const clean = text.toLowerCase();
  // e.g. "don't have fever", "no fever", "not sick"
  const regex = new RegExp(`(?:don'?t\\s*have|do\\s*not\\s*have|no\\s+|without|haven'?t\\s*got|free\\s*from|not\\s*)\\s*${symptom}`, "i");
  return regex.test(clean) || NEGATION_PATTERNS.some((p) => p.test(clean));
}

/**
 * Context-Aware Reaction Classification Engine
 */
export function detectContextualReaction(userText: string): ReactionContextResult | null {
  if (!userText || !userText.trim()) return null;
  const text = userText.trim();
  const lower = text.toLowerCase();

  // 1. STRICT MEDICAL SAFETY GATE: Emergencies return NULL immediately
  if (isEmergencySituation(lower)) {
    return null;
  }

  // 2. INFORMATIONAL MEDICAL QUESTIONS: e.g. "What causes fever?" returns NULL
  if (isInformationalMedicalQuestion(lower)) {
    return null;
  }

  // 3. RECOVERY & RESOLUTION: e.g. "My fever is gone", "feeling better"
  if (RECOVERY_PATTERNS.some((p) => p.test(lower))) {
    return {
      categoryId: "recovery",
      subType: "recovery",
      name: "Recovery",
      query: "happy celebration yay feeling better",
      confidence: 0.95,
    };
  }

  // 4. EMOTIONAL STATES COMBINED WITH ILLNESS (Fear, Anxiety, Worry)
  // e.g. "I am scared of fever", "Worried about my headache" -> Comforting GIF
  const hasFearOrAnxiety = /\b(scared|terrified|afraid|worried|anxious|panic)\b/i.test(lower);
  const mentionsIllness = ILLNESS_PATTERNS.some((item) => item.pattern.test(lower));

  if (hasFearOrAnxiety && mentionsIllness) {
    return {
      categoryId: "emotion",
      subType: "comforting_fear",
      name: "Comforting Support",
      query: "gentle comforting hug calm warm cartoon",
      confidence: 0.95,
    };
  }

  // 5. ILLNESS & SYMPTOMS (Active, Non-Negated)
  // Check if user has an illness symptom:
  for (const item of ILLNESS_PATTERNS) {
    if (item.pattern.test(lower)) {
      // Check for negation: "I don't have fever"
      if (isSymptomNegated(lower, item.subType)) {
        // Negated symptom: Do NOT show sick GIF
        continue;
      }
      // Note: If user says "I have fever 😂", illness priority takes precedence over laughing
      return {
        categoryId: "illness",
        subType: item.subType,
        name: `Illness (${item.subType})`,
        query: item.query,
        confidence: 0.9,
      };
    }
  }

  // 6. NEGATION ONLY: e.g. "I don't have fever", "No symptoms"
  if (NEGATION_PATTERNS.some((p) => p.test(lower)) && /\b(fever|headache|cold|cough|pain|sick)\b/i.test(lower)) {
    return null;
  }

  // 7. EMOTIONAL STATES (Sadness, Lonely, Crying, Stress, Happy, Excited, Bored, Tired, Confused, Frustrated)
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

  if (/\b(confused|don'?t\s*understand|puzzled|perplexed)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "confused",
      name: "Thinking Question",
      query: "thinking curious cute cartoon",
      confidence: 0.85,
    };
  }

  if (/\b(frustrated|annoyed|irritated|angry)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "frustrated",
      name: "Calming Deep Breath",
      query: "calm deep breath relaxing cartoon",
      confidence: 0.85,
    };
  }

  // 8. APPRECIATION: "thank you", "thanks", "amazing", "awesome", "well done", "great job", "love"
  if (/\b(thank\s*you|thanks|tysm|thx|appreciate\s*it|grateful|amazing|awesome|well\s*done|great\s*job|much\s*love)\b/i.test(lower)) {
    return {
      categoryId: "appreciation",
      subType: "appreciation",
      name: "Appreciation",
      query: "cute thank you heart animated cartoon",
      confidence: 0.92,
    };
  }

  // 9. HUMOR: "haha", "LOL", "LMAO", "joking", "OMG", "seriously", "surprise", "funny"
  if (/\b(haha+|hehe+|lmao|lol|rofl|lmfao|joking|joke|hilarious|funny|seriously|omg)\b/i.test(lower)) {
    return {
      categoryId: "humor",
      subType: "humor",
      name: "Humor",
      query: "funny laughing cute cartoon",
      confidence: 0.9,
    };
  }

  // 10. FITNESS AND LIFESTYLE: gym, exercise, dieting, healthy eating, hydration, sleep, motivation
  if (/\b(gym|workout|exercise|diet|dieting|healthy\s*eating|hydration|drink(ing)?\s*water|fitness|active\s*lifestyle)\b/i.test(lower)) {
    return {
      categoryId: "fitness",
      subType: "fitness",
      name: "Fitness & Lifestyle",
      query: "healthy fitness water workout motivation cartoon",
      confidence: 0.88,
    };
  }

  // 11. CONVERSATION: agree, exactly, cool, perfect, okay, wait, tell me a joke
  if (/\b(agree|exactly|cool|perfect|okay|ok|tell\s*me\s*a\s*joke)\b/i.test(lower)) {
    return {
      categoryId: "conversation",
      subType: "conversation",
      name: "Conversation",
      query: "cool thumbs up awesome cartoon",
      confidence: 0.85,
    };
  }

  // 12. TIME-OF-DAY GREETINGS
  if (/\b(good\s*morning|mornin|gm)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "morning",
      name: "Morning Greeting",
      query: "cute good morning coffee cartoon",
      confidence: 0.95,
    };
  }
  if (/\b(good\s*afternoon)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "afternoon",
      name: "Afternoon Greeting",
      query: "warm good afternoon sunny cartoon",
      confidence: 0.95,
    };
  }
  if (/\b(good\s*evening)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "evening",
      name: "Evening Greeting",
      query: "pleasant good evening cozy cartoon",
      confidence: 0.95,
    };
  }

  // 13. GREETINGS AND WELCOME: "hi", "hello", "hey", "welcome", "greetings", "namaste"
  if (/\b(hi|hello|heyy*|hey|hola|namaste|welcome|greetings)\b/i.test(lower)) {
    return {
      categoryId: "greeting",
      subType: "greeting",
      name: "Greeting",
      query: "cute puppy waving hi cartoon",
      confidence: 0.95,
    };
  }

  // 14. FAREWELL: bye, goodbye, see you, take care, good night
  if (/\b(bye|goodbye|see\s*you|cya|take\s*care|good\s*night)\b/i.test(lower)) {
    return {
      categoryId: "farewell",
      subType: "farewell",
      name: "Farewell",
      query: "sweet goodbye waving good night cartoon",
      confidence: 0.92,
    };
  }

  return null;
}

// Curated clinical-safe fallback GIFs for guaranteed 100% display reliability
const CURATED_FALLBACK_GIFS: Record<string, { id: string; title: string; url: string }> = {
  greeting: {
    id: "cura_fallback_greeting",
    title: "Puppy Waving Hello",
    url: "https://media4.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a2J0bjJ5YnlndTl1cTRwNjRmY2I1ZjFjbjZ5MWxodGo5NDhqM3phcSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/31Zp9nzMFgqOHUKtiE/200w.gif",
  },
  sick: {
    id: "cura_fallback_sick",
    title: "Get Well Rest Tea",
    url: "https://media3.giphy.com/media/v1.Y2lkPWI5OGJhZDk4ZjRxZXlubGJ2c2c0ajNqNmlhMTlvYzJ3emV0OWcwN3Ezc3c0a3lkbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/U25VJEFwDEoQrWfo2z/200w.gif",
  },
  recovery: {
    id: "cura_fallback_recovery",
    title: "Happy Recovery Dance",
    url: "https://media1.giphy.com/media/v1.Y2lkPWI5OGJhZDk4Zmlnb3B5dWVwOHI1cjN1ODZrcGk1dms5ZTN0eHdxN29rZmpveGg2cCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/artj92V8o75VPL7AeQ/200w.gif",
  },
  appreciation: {
    id: "cura_fallback_appreciation",
    title: "Thank You Warm Hug",
    url: "https://media2.giphy.com/media/v1.Y2lkPWI5OGJhZDk4a28xbWVxcmszMmZ6ZTRpMHRkMnNmdG1oamoxOXhhbmtlcmxwdnphdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xUA7aZhmzXeNq7gWNq/200w.gif",
  },
};

function buildFallbackIGif(query: string): IGif {
  const lower = query.toLowerCase();
  let item = CURATED_FALLBACK_GIFS.greeting;
  if (/sick|fever|headache|pain|cold|cough|rest|care|tea|warm/i.test(lower)) {
    item = CURATED_FALLBACK_GIFS.sick;
  } else if (/better|recovery|healed|great|happy|dance/i.test(lower)) {
    item = CURATED_FALLBACK_GIFS.recovery;
  } else if (/thank|appreciation|love|hug/i.test(lower)) {
    item = CURATED_FALLBACK_GIFS.appreciation;
  }

  return {
    id: item.id as any,
    title: item.title,
    images: {
      fixed_width: { url: item.url, width: 200, height: 200 } as any,
      original: { url: item.url, width: 200, height: 200 } as any,
      downsized: { url: item.url, width: 200, height: 200 } as any,
    } as any,
  } as IGif;
}

// In-memory GIF query cache to minimize GIPHY API calls
const gifQueryCache = new Map<string, IGif[]>();
let lastServedGifId = "";

/**
 * Fetches relevant GIFs from GIPHY API with in-memory caching, duplicate prevention, and randomized selection.
 * Always strictly enforces rating: "g" for clinical safety.
 */
export async function fetchReactionGif(query: string): Promise<IGif | null> {
  const client = getGiphyClient();
  if (!client) {
    return buildFallbackIGif(query);
  }

  try {
    let gifs = gifQueryCache.get(query);

    if (!gifs || gifs.length === 0) {
      const response = await client.search(query, {
        limit: 15,
        rating: "g",
        sort: "relevant",
        lang: "en",
      });
      gifs = response.data;
      if (gifs && gifs.length > 0) {
        gifQueryCache.set(query, gifs);
      } else {
        // Fallback: search simplified keywords if the multi-word phrase returned 0 results
        const words = query.trim().split(/\s+/).filter(Boolean);
        const simplified = words.length > 2 ? words.slice(0, 2).join(" ") : "cute hello";
        const fallbackResp = await client.search(simplified, {
          limit: 10,
          rating: "g",
          sort: "relevant",
        });
        gifs = fallbackResp.data;
        if (gifs && gifs.length > 0) {
          gifQueryCache.set(query, gifs);
        }
      }
    }

    if (!gifs || gifs.length === 0) {
      return buildFallbackIGif(query);
    }

    // Filter out the last served gif to avoid immediate repetition
    const candidates = gifs.filter((g) => g.id !== lastServedGifId);
    const pool = candidates.length > 0 ? candidates : gifs;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selected = pool[randomIndex];
    if (selected?.id) {
      lastServedGifId = String(selected.id);
    }
    return selected;
  } catch (error) {
    console.warn("GIPHY API fetch error, using curated fallback:", error);
    return buildFallbackIGif(query);
  }
}
