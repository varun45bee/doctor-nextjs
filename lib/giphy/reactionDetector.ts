import type { IGif } from "@giphy/js-types";
import {
  type ReactionCategory,
  PREDEFINED_CATEGORY_QUERIES,
  CURATED_CATEGORY_POOLS,
  selectGifFromPool,
} from "./categoryPools.ts";
import {
  getConversationRecentGifIds,
  recordConversationRecentGifId,
} from "./gifPersistence.ts";

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
  | "farewell"
  | "question"
  | "learning"
  | "technology"
  | "success"
  | "failure"
  | "surprise"
  | "agreement"
  | "disagreement"
  | "motivation"
  | "sadness"
  | "stress"
  | "food"
  | "travel";

export interface ReactionContextResult {
  categoryId: ReactionCategoryId;
  subType?: string;
  name: string;
  query: string;
  confidence: number;
  reason?: string;
}

export interface DetectReactionOptions {
  history?: Array<{ role: string; content: string }>;
  assistantResponse?: string;
  context?: Record<string, unknown>;
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

export function isEmergencySituation(text: string): boolean {
  if (!text || !text.trim()) return false;
  return EMERGENCY_PATTERNS.some((regex) => regex.test(text));
}

/**
 * 1b. Sensitive or distressing situations where humor would be inappropriate
 * or could trivialize the user's situation (e.g. death, bereavement, cancer, ICU).
 */
export const SENSITIVE_DISTRESS_PATTERNS: RegExp[] = [
  /\b(death|died|dying|passed\s*away|deceased|loss\s*of\s*(my|a)?\s*(mother|father|parent|child|baby|friend|loved\s*one)|funeral|mourning|grieving)\b/i,
  /\b(terminal(\s*illness)?|end\s*of\s*life|hospice|palliative\s*care)\b/i,
  /\b(miscarriage|stillbirth|lost\s*(the|my)?\s*baby|pregnancy\s*loss)\b/i,
  /\b(cancer|malignan(t|cy)|oncology|chemo(therapy)?|radiation\s*therapy|tumor\s*stage|biopsy\s*cancer)\b/i,
  /\b(icu|intensive\s*care|ventilator|life\s*support|critical\s*condition)\b/i,
  /\b(severe\s*depression|clinical\s*depression|hopeless(ness)?|want\s*to\s*end\s*it|can'?t\s*go\s*on)\b/i,
];

export function isSensitiveMedicalSituation(text: string): boolean {
  if (!text || !text.trim()) return false;
  return SENSITIVE_DISTRESS_PATTERNS.some((p) => p.test(text));
}

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

export function isInformationalMedicalQuestion(text: string): boolean {
  if (!text || !text.trim()) return false;
  // Conversational greetings and pleasantries are not medical questions
  if (
    /^(hi|hello|hey|heyy|namaste|welcome)\b/i.test(text) ||
    /\b(how\s*are\s*you|how\s*r\s*u|what'?s\s*up|wassup|how'?s\s*it\s*going)\b/i.test(text)
  ) {
    return false;
  }
  const hasQuestionPattern =
    MEDICAL_QUESTION_PATTERNS.some((regex) => regex.test(text)) || text.trim().endsWith("?");
  const hasFirstPersonReport =
    /\b(i\s*have|i'?m\s*having|my\s+|i\s*feel|i\s*am\s*suffering)\b/i.test(text);
  return hasQuestionPattern && !hasFirstPersonReport;
}

/**
 * 3. Negation patterns (e.g. "I don't have fever", "no headache", "not sick")
 */
export const NEGATION_PATTERNS: RegExp[] = [
  /\b(don'?t\s*have|do\s*not\s*have|no\s+|not\s*having|free\s*from|without|haven'?t\s*got|never\s*had|haven'?t\s*had|negative\s*for|not\s*(sick|experiencing))\b/i,
];

export function isSymptomNegated(text: string, symptom: string): boolean {
  const clean = text.toLowerCase();
  const regex = new RegExp(
    `(?:don'?t\\s*have|do\\s*not\\s*have|no\\s+|without|haven'?t\\s*got|free\\s*from|not\\s*)\\s*${symptom}`,
    "i"
  );
  return regex.test(clean) || NEGATION_PATTERNS.some((p) => p.test(clean));
}

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

/**
 * Maps any query or category name to a verified ReactionCategory.
 * If unknown or unconfident, returns null.
 */
export function resolveReactionCategory(categoryOrQuery: string): ReactionCategory | null {
  if (!categoryOrQuery || typeof categoryOrQuery !== "string") return null;
  const lower = categoryOrQuery.toLowerCase().trim();

  // 1. Exact category name matches
  if (lower in PREDEFINED_CATEGORY_QUERIES) {
    return lower as ReactionCategory;
  }

  // 2. Meme & Broad conversational category mappings
  if (/programmer|coding|code|developer|debugging|bug|compile|software|algorithm|terminal|javascript|python|typescript|react/i.test(lower)) return "technology";
  if (/mind\s*blown|eureka|lightbulb|smart|understand|learned|now\s*i\s*get|insight/i.test(lower)) return "learning";
  if (/celebrat|victory|winner|champion|nailed\s*it|success|woohoo|we\s*won/i.test(lower)) return "success";
  if (/facepalm|mistake|epic\s*fail|oops|blunder|disaster|disappoint/i.test(lower)) return "failure";
  if (/shock|shocked|unbelievable|jaw\s*drop|astonish|stunned/i.test(lower)) return "surprise";
  if (/agree|thumbs\s*up|nodding|exactly|preach|spot\s*on/i.test(lower)) return "agreement";
  if (/skeptical|doubt|side\s*eye|suspicious|sus\b|distrust/i.test(lower)) return "disagreement";
  if (/motivat|determined|lets\s*go|stay\s*strong|hustle|pumped/i.test(lower)) return "motivation";
  if (/hungry|delicious|chef|craving|yummy|tasty|starving|food|snack|cook/i.test(lower)) return "food";
  if (/travel|vacation|holiday|packing|flight|trip|wanderlust/i.test(lower)) return "travel";
  if (/question|thinking|curious|puzzled|wonder|scratch\s*head/i.test(lower)) return "question";
  if (/sad|crying|lonely|heartbroken|comforting|tears|grief/i.test(lower)) return "sadness";
  if (/stress|overwhelmed|calm|breathe|anxious|relax/i.test(lower)) return "stress";

  // 3. Greeting & General conversation
  if (/morning/i.test(lower)) return "morning";
  if (/afternoon/i.test(lower)) return "afternoon";
  if (/evening/i.test(lower)) return "evening";
  if (/thank|apprec|grateful/i.test(lower)) return "appreciation";
  if (/bye|farewell|good\s*night|cya|sleepy|bedtime|tired/i.test(lower)) return "farewell";
  if (/laugh|humor|joke|haha+|hehe+|lol|bored|entertain/i.test(lower)) return "humor";
  if (/fitness|gym|workout|exercise|hydration|water/i.test(lower)) return "fitness";
  if (/appointment|book|schedule|consultation|calendar|timing|hours|fee|cost/i.test(lower)) return "appointment";
  if (/doctor|dr\.?\s*pratima|homeopath|clinic|profile|qualification|practitioner/i.test(lower)) return "doctor";
  if (/skin|skincare|hair|glow|acne|pimple|dandruff|eczema|psoriasis/i.test(lower)) return "skincare";
  if (/nutrition|diet|fruit|vegetable|vitamin|detox/i.test(lower)) return "nutrition";
  if (/wellness|lifestyle|healthy|peace|zen|meditation|energy|vitality/i.test(lower)) return "wellness";
  if (/pediatric|baby|child|kid|infant|toddler/i.test(lower)) return "pediatric";
  if (/puppy|waving\s*hi|greeting|hello|namaste|\bhi\b|\bhey/i.test(lower)) return "greeting";

  // 4. Symptoms & Recovery
  if (/headache|migraine/i.test(lower)) return "headache";
  if (/fever|thermometer|temperature|chills|weakness/i.test(lower)) return "fever";
  if (/cold|cough|sneeze|runny\s*nose|throat|flu/i.test(lower)) return "cold";
  if (/stomach|tummy|cramp|digest|nausea|dizz/i.test(lower)) return "stomach";
  if (/body_pain|body\s*pain|joint\s*pain|muscle\s*ache|back\s*pain|aches?/i.test(lower)) return "body_pain";
  if (/recovery|healed|feeling\s*better|cured/i.test(lower)) return "recovery";
  if (/sympathy|caring|comforting|hug/i.test(lower)) return "caring";

  return null;
}

/**
 * Context-Aware Meme GIF & Reaction Classification Engine
 * Evaluates the CURRENT user message and conversation context.
 * Identifies the dominant intent while enforcing strict medical safety & quality suppression.
 */
export function detectContextualMemeReaction(
  userText: string,
  options?: DetectReactionOptions
): ReactionContextResult | null {
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

  // 1b. SENSITIVE / DISTRESSING CONTEXTS: Death, hospice, grief, miscarriage, cancer, ICU
  if (isSensitiveMedicalSituation(lower)) {
    return null;
  }

  // 2. INFORMATIONAL MEDICAL QUESTIONS: e.g. "What causes a headache?" returns NULL
  if (isInformationalMedicalQuestion(lower)) {
    return null;
  }

  // 3. NEGATION ONLY: e.g. "I don't have a headache", "no fever" returns NULL
  if (
    NEGATION_PATTERNS.some((p) => p.test(lower)) &&
    /\b(fever|headache|cold|cough|pain|sick|migraine)\b/i.test(lower)
  ) {
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
      reason: "Patient reports resolution of symptoms",
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
      reason: "Comforting reassurance for health anxiety",
    };
  }

  // 6. ILLNESS & SYMPTOMS (Active, Non-Negated First-Person)
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
        reason: `Empathetic support for active symptom: ${item.subType}`,
      };
    }
  }

  // =========================================================================
  // 7. BROAD CONVERSATIONAL & MEME REACTION CATEGORIES
  // =========================================================================

  // A. TECHNOLOGY & CODING
  if (
    /\b(code|coding|programmer|programming|developer|debug|debugging|bug|bugs|error\s*in\s*code|javascript|typescript|python|react|git\s*(merge|push|pull|commit)|syntax\s*error|compile|software|algorithm|terminal|css|html)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "technology",
      subType: "coding",
      name: "Technology & Coding",
      query: PREDEFINED_CATEGORY_QUERIES.technology,
      confidence: 0.95,
      reason: "Programmer and coding reaction",
    };
  }

  // B. LEARNING & MIND BLOWN
  if (
    /\b(mind\s*blown|mind\s*=\s*blown|eureka|lightbulb\s*moment|learned\s*something|now\s*i\s*(get|understand)\s*it|that\s*makes\s*so\s*much\s*sense|brilliant\s*explanation|mind\s*boggling|enlightened)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "learning",
      subType: "mind_blown",
      name: "Learning & Insight",
      query: PREDEFINED_CATEGORY_QUERIES.learning,
      confidence: 0.95,
      reason: "Mind blown and intellectual breakthrough",
    };
  }

  // C. SUCCESS & CELEBRATION
  if (
    /\b(we\s*did\s*it|i\s*did\s*it|victory|celebrat(e|ion)|nailed\s*it|winner|champion|passed\s*the|got\s*the\s*job|success(ful)?|woohoo|hurray|yay|we\s*won)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "success",
      subType: "victory",
      name: "Success & Victory",
      query: PREDEFINED_CATEGORY_QUERIES.success,
      confidence: 0.95,
      reason: "Celebration and victory milestone",
    };
  }

  // D. FAILURE, MISTAKES & FACEPALM
  if (
    /\b(facepalm|epic\s*fail|big\s*mistake|messed\s*up|screwed\s*up|ruined\s*it|what\s*was\s*i\s*thinking|blunder|oops|total\s*disaster)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "failure",
      subType: "facepalm",
      name: "Mistake & Facepalm",
      query: PREDEFINED_CATEGORY_QUERIES.failure,
      confidence: 0.95,
      reason: "Humorous facepalm disappointment",
    };
  }

  // E. SURPRISE & SHOCK
  if (
    /\b(shocked|unbelievable|no\s*way|are\s*you\s*serious|jaw\s*dropped|astonished|stunned|speechless|what\s*on\s*earth)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "surprise",
      subType: "shocked",
      name: "Surprise & Shock",
      query: PREDEFINED_CATEGORY_QUERIES.surprise,
      confidence: 0.92,
      reason: "Expressive shocked reaction",
    };
  }

  // F. AGREEMENT & THUMBS UP
  if (
    /\b(totally\s*agree|100%|thumbs\s*up|couldn'?t\s*agree\s*more|spot\s*on|exactly\s*right|hear\s*hear|preach|absolutely\s*true)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "agreement",
      subType: "nodding",
      name: "Agreement & Nodding",
      query: PREDEFINED_CATEGORY_QUERIES.agreement,
      confidence: 0.92,
      reason: "Enthusiastic agreement",
    };
  }

  // G. DISAGREEMENT & SKEPTICAL
  if (
    /\b(skeptical|press\s*x\s*to\s*doubt|doubt\s*it|side\s*eye|sounds\s*sus|suspicious|don'?t\s*buy\s*it|not\s*convinced|hard\s*to\s*believe)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "disagreement",
      subType: "skeptical",
      name: "Skeptical & Doubtful",
      query: PREDEFINED_CATEGORY_QUERIES.disagreement,
      confidence: 0.92,
      reason: "Funny skeptical side-eye",
    };
  }

  // H. MOTIVATION & DETERMINATION
  if (
    /\b(let'?s\s*go|determined|we\s*got\s*this|never\s*give\s*up|stay\s*strong|hustle|push\s*through|pump(ed)?\s*up|unstoppable|grind\s*mode)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "motivation",
      subType: "determined",
      name: "Motivation & Drive",
      query: PREDEFINED_CATEGORY_QUERIES.motivation,
      confidence: 0.92,
      reason: "High-energy motivation",
    };
  }

  // I. FOOD & DINING
  if (
    /\b(hungry|starving|craving|delicious|chef\s*kiss|yummy|tasty|mouth\s*watering|cooking\s*dinner|baking|snack\s*time)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "food",
      subType: "delicious",
      name: "Food & Cravings",
      query: PREDEFINED_CATEGORY_QUERIES.food,
      confidence: 0.92,
      reason: "Delicious food appreciation",
    };
  }

  // J. TRAVEL & VACATION
  if (
    /\b(vacation|packing\s*bags|road\s*trip|traveling|holiday\s*trip|flight|boarding\s*pass|beach\s*trip|exploring\s*the\s*world|wanderlust)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "travel",
      subType: "vacation",
      name: "Travel & Adventure",
      query: PREDEFINED_CATEGORY_QUERIES.travel,
      confidence: 0.92,
      reason: "Excited travel anticipation",
    };
  }

  // K. QUESTIONS, THINKING & PUZZLED
  if (
    /\b(let\s*me\s*think|scratching\s*my\s*head|confused|puzzled|i\s*wonder|puzzling|brain\s*is\s*fried|curious\s*about|hmm+|thinking\s*emoji)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "question",
      subType: "thinking",
      name: "Thinking & Puzzled",
      query: PREDEFINED_CATEGORY_QUERIES.question,
      confidence: 0.9,
      reason: "Curious and contemplative question state",
    };
  }

  // L. SADNESS & COMFORTING SUPPORT
  if (
    /\b(sad|crying|lonely|heartbroken|feeling\s*down|feeling\s*blue|unhappy|tears|depressed)\b/i.test(
      lower
    )
  ) {
    const subType = /\blonely\b/i.test(lower) ? "lonely" : "sad";
    return {
      categoryId: "emotion",
      subType,
      name: "Comforting Hug",
      query: PREDEFINED_CATEGORY_QUERIES.sadness,
      confidence: 0.92,
      reason: "Gentle wholesome emotional comfort",
    };
  }

  // L2. HAPPINESS & CELEBRATION
  if (/\b(happy|excited|joyful|cheerful|great\s*day|delighted)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "happy",
      name: "Happy Celebration",
      query: "happy dancing celebration cartoon",
      confidence: 0.9,
      reason: "Patient expressed happiness and positive mood",
    };
  }

  // L3. BOREDOM & ENTERTAINMENT
  if (/\b(bored|entertain\s*me|nothing\s*to\s*do)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "bored",
      name: "Fun Dancing",
      query: "funny dancing cartoon",
      confidence: 0.88,
      reason: "Patient expressed boredom",
    };
  }

  // L4. TIREDNESS & BEDTIME
  if (/\b(tired|sleepy|exhausted|need\s*sleep|bedtime)\b/i.test(lower)) {
    return {
      categoryId: "emotion",
      subType: "tired",
      name: "Cozy Rest",
      query: "cozy sleepy bedtime rest cartoon",
      confidence: 0.88,
      reason: "Patient expressed fatigue or sleepiness",
    };
  }

  // M. STRESS & RELATABLE CALM
  if (
    /\b(stressed|stress|overwhelmed|need\s*a\s*break|need\s*to\s*relax|anxious|nervous|frazzled)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "emotion",
      subType: "stressed",
      name: "Calming Breath",
      query: PREDEFINED_CATEGORY_QUERIES.stress,
      confidence: 0.9,
      reason: "Stress relief and mindful calming",
    };
  }

  // N. CASUAL HUMOR & LAUGHTER
  if (/\b(haha+|hehe+|lmao|lol|rofl|lmfao|joke|hilarious)\b/i.test(lower)) {
    return {
      categoryId: "humor",
      subType: "humor",
      name: "Humor",
      query: PREDEFINED_CATEGORY_QUERIES.humor,
      confidence: 0.92,
      reason: "Lighthearted conversational humor",
    };
  }

  // O. TIME-OF-DAY GREETINGS
  if (/\b(good\s*morning|mornin|gm)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "morning",
      name: "Morning Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.morning,
      confidence: 0.95,
      reason: "Warm morning greeting",
    };
  }
  if (/\b(good\s*afternoon)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "afternoon",
      name: "Afternoon Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.afternoon,
      confidence: 0.95,
      reason: "Warm afternoon greeting",
    };
  }
  if (/\b(good\s*evening)\b/i.test(lower)) {
    return {
      categoryId: "time_of_day",
      subType: "evening",
      name: "Evening Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.evening,
      confidence: 0.95,
      reason: "Cozy evening greeting",
    };
  }

  // P. APPRECIATION & GRATITUDE
  if (/\b(thank\s*you|thanks|tysm|thx|appreciate\s*it|grateful)\b/i.test(lower)) {
    return {
      categoryId: "appreciation",
      subType: "appreciation",
      name: "Appreciation",
      query: PREDEFINED_CATEGORY_QUERIES.appreciation,
      confidence: 0.95,
      reason: "Appreciation and gratitude",
    };
  }

  // Q. GREETINGS & WELCOME
  if (/\b(hi|hello|heyy*|hey|hola|namaste|welcome|greetings)\b/i.test(lower)) {
    return {
      categoryId: "greeting",
      subType: "greeting",
      name: "Greeting",
      query: PREDEFINED_CATEGORY_QUERIES.greeting,
      confidence: 0.95,
      reason: "Friendly welcome greeting",
    };
  }

  // R. FAREWELL & NIGHT
  if (/\b(bye|goodbye|see\s*you|cya|take\s*care|good\s*night)\b/i.test(lower)) {
    return {
      categoryId: "farewell",
      subType: "farewell",
      name: "Farewell",
      query: PREDEFINED_CATEGORY_QUERIES.farewell,
      confidence: 0.92,
      reason: "Polite farewell departure",
    };
  }

  // S. FITNESS & EXERCISE
  if (/\b(gym|workout|exercise|hydration|drink(ing)?\s*water|active\s*lifestyle)\b/i.test(lower)) {
    return {
      categoryId: "fitness",
      subType: "fitness",
      name: "Fitness & Lifestyle",
      query: PREDEFINED_CATEGORY_QUERIES.fitness,
      confidence: 0.9,
      reason: "Active fitness motivation",
    };
  }

  // T. APPOINTMENT, TIMINGS & BOOKING
  if (
    /\b(book(ing)?\s*(an?\s*)?appointment|consultation|schedule|calendar|timing|hours|open|clinic\s*fees?|consultation\s*fees?|fees?|cost|check\s*appointment)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "conversation",
      subType: "appointment",
      name: "Appointment & Booking",
      query: PREDEFINED_CATEGORY_QUERIES.appointment,
      confidence: 0.92,
      reason: "Appointment and scheduling guidance",
    };
  }

  // U. DOCTOR & CLINIC PROFILE
  if (
    /\b(dr\.?\s*pratima|doctor\s*agale|about\s*the\s*doctor|qualification|experience|gold\s*medalist)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "conversation",
      subType: "doctor",
      name: "Doctor & Clinic",
      query: PREDEFINED_CATEGORY_QUERIES.doctor,
      confidence: 0.92,
      reason: "Dr. Pratima Agale clinic profile",
    };
  }

  // V. SKINCARE & HAIR CARE
  if (
    /\b(skin(care)?|glow(ing)?|acne|pimple|rash(es)?|eczema|psoriasis|hair(\s*fall|\s*loss)?|dandruff|complexion)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "illness",
      subType: "skincare",
      name: "Skincare & Hair Care",
      query: PREDEFINED_CATEGORY_QUERIES.skincare,
      confidence: 0.9,
      reason: "Skincare and hair care support",
    };
  }

  // W. NUTRITION & DIET
  if (
    /\b(nutrition|diet(ary)?|healthy\s*food|fruits?|vegetables?|vitamins?|detox|what\s*to\s*eat|eating\s*habits)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "fitness",
      subType: "nutrition",
      name: "Nutrition & Diet",
      query: PREDEFINED_CATEGORY_QUERIES.nutrition,
      confidence: 0.9,
      reason: "Nutritional and healthy eating tips",
    };
  }

  // X. PEDIATRIC & CHILD HEALTH
  if (/\b(baby|babies|child(ren)?|kid|kids|infant(s)?|pediatric|toddler)\b/i.test(lower)) {
    return {
      categoryId: "illness",
      subType: "pediatric",
      name: "Pediatric Care",
      query: PREDEFINED_CATEGORY_QUERIES.pediatric,
      confidence: 0.9,
      reason: "Gentle pediatric care guidance",
    };
  }

  // Y. GENERAL WELLNESS & HEALTH TIPS
  if (
    /\b(wellness|healthy\s*lifestyle|peace(ful)?|relax(ation)?|yoga|meditation|health\s*tips?|self\s*care)\b/i.test(
      lower
    )
  ) {
    return {
      categoryId: "fitness",
      subType: "wellness",
      name: "Wellness & Lifestyle",
      query: PREDEFINED_CATEGORY_QUERIES.wellness,
      confidence: 0.9,
      reason: "Holistic wellness lifestyle",
    };
  }

  // Z. NO CONFIDENT INTENT MATCH: Return NULL (Never forced, low confidence suppresses GIF)
  return null;
}

/**
 * Standard detector entry point (retains backward compatibility).
 */
export function detectContextualReaction(
  userText: string,
  options?: DetectReactionOptions
): ReactionContextResult | null {
  return detectContextualMemeReaction(userText, options);
}

/**
 * Fetches or selects a relevant non-repeating GIF.
 * - In browser environment: calls server route `/api/reaction-gif` (keeping API keys server-side).
 * - In server/test environment: selects directly from the curated category pool with rotation history.
 * - Handles empty API responses without showing an unrelated GIF.
 */
export async function fetchReactionGif(
  categoryOrQuery: string,
  options?: { conversationId?: string; recentGifIds?: string[]; query?: string }
): Promise<IGif | null> {
  if (!categoryOrQuery || typeof categoryOrQuery !== "string") return null;
  if (
    isProfanity(categoryOrQuery) ||
    isEmergencySituation(categoryOrQuery) ||
    isSensitiveMedicalSituation(categoryOrQuery)
  ) {
    return null;
  }

  const resolvedCategory = resolveReactionCategory(categoryOrQuery) || "wellness";
  const convId = options?.conversationId || "default_session";

  // Merge recent IDs from client and persistence store
  const recentIds = await getConversationRecentGifIds(convId, options?.recentGifIds || []);

  // Browser environment: Call secure server endpoint
  if (typeof window !== "undefined" && typeof fetch === "function") {
    try {
      const res = await fetch("/api/reaction-gif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: resolvedCategory,
          searchQuery: options?.query || categoryOrQuery,
          conversationId: convId,
          recentGifIds: recentIds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.gif) {
          await recordConversationRecentGifId(convId, String(data.gif.id), recentIds);
          return data.gif;
        }
      }
    } catch (clientErr) {
      console.warn("Client reaction GIF fetch failed, using local curated pool:", clientErr);
    }
  }

  // Server, test, or offline fallback: select from curated category pool
  const pool = CURATED_CATEGORY_POOLS[resolvedCategory] || CURATED_CATEGORY_POOLS.wellness || [];
  const explicitLastId =
    options?.recentGifIds && options.recentGifIds.length > 0
      ? String(options.recentGifIds[options.recentGifIds.length - 1])
      : undefined;
  const selected = selectGifFromPool(resolvedCategory, pool, recentIds, explicitLastId);

  if (selected?.id) {
    await recordConversationRecentGifId(convId, String(selected.id), recentIds);
  }

  return selected;
}
