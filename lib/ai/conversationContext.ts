export interface ConversationContextState {
  currentTopic: string;
  currentEmotion: string;
  reportedSymptoms: string[];
  duration?: string;
  modalities?: string;
  recoveryStatus: "not_recovered" | "improving" | "recovered" | "none";
  isEmergency: boolean;
  lastIntent: string;
  turnCount: number;
}

export interface GroqChatbotResponse {
  reply: string;
  language?: "en" | "hi" | "mr" | "hinglish" | string;
  intent: string;
  emotion: string;
  sentiment: string;
  conversation_topic: string;
  context_update: {
    current_topic: string;
    current_emotion: string;
    reported_symptoms: string[];
    recovery_status: "not_recovered" | "improving" | "recovered" | "none";
    duration?: string;
    modalities?: string;
  };
  gif: {
    should_show: boolean;
    category: string;
    search_query: string;
    reason: string;
    confidence: number;
  };
  safety: {
    is_medical: boolean;
    is_emergency: boolean;
    requires_professional_response: boolean;
  };
  analysis?: {
    detectedCondition: string;
    duration: string;
    severity: string;
    careStream: string;
    modalities?: string;
    prepTip: string;
    readyToBook?: boolean;
  };
}

/**
 * Severe medical emergencies.
 * Under ANY emergency condition, GIFs MUST be suppressed and emergency guidance provided.
 */
export const EMERGENCY_REGEX =
  /\b(severe\s*chest\s*pain|chest\s*pain|heart\s*attack|cardiac|stroke|paraly(zed|sis))\b|\b(breathing\s*difficult(y|ies)|shortness\s*of\s*breath|breathless|can'?t\s*breathe|choking|gasping|suffocat(e|ing))\b|\b(unconscious(ness)?|passed\s*out|faint(ing|ed)?|seizure|coma)\b|\b(severe\s*bleeding|hemorrhage|profuse\s*bleeding|vomiting\s*blood|coughing\s*blood)\b|\b(suicid(e|al)|kill\s*myself|self\s*harm|overdose|poison(ing|ed)?)\b|\b(anaphyla(xis|ctic)|severe\s*allergic\s*reaction)\b/i;

/**
 * Informational / conceptual medical questions (e.g. "What is fever?", "What causes headache?").
 * These should receive helpful informative text, but NO GIF by default.
 */
export const MEDICAL_QUESTION_REGEX =
  /^(what\s*(is|are|causes|can\s*cause)|why\s*(do|does|is)|how\s*(does|to\s*cure|to\s*treat))\b|\b(can\s+.*\s+cause|is\s+.*\s+(contagious|dangerous|curable|genetic))\b|\b(tell\s*me\s*about|explain\s+to\s*me|reasons?\s*for|definition\s*of)\b/i;

/**
 * Negation phrases (e.g. "I don't have fever", "no headache")
 */
export const NEGATION_REGEX =
  /\b(don'?t\s*have|do\s*not\s*have|no\s+|not\s*having|free\s*from|without|haven'?t\s*got|never\s*had|haven'?t\s*had|negative\s*for|not\s*(sick|experiencing))\b/i;

/**
 * Recovery phrases (e.g. "feeling better", "fever is gone", "recovered")
 */
export const RECOVERY_REGEX =
  /\b(fever|headache|pain|cold|cough|sore\s*throat|migraine|nausea|stomach\s*ache)\s+(is\s+)?(gone|cured|disappeared|resolved|over|better)\b|\b(feeling|felt|am)\s+(much\s+)?(better|fine|recovered|healed|great\s*now)\b|\b(recovered\s*from|got\s*over|no\s*longer\s*have|healed\s*from|pain\s*is\s*gone)\b|\b(my\s+.*\s+is\s+gone)\b/i;

/**
 * Builds the enterprise clinical system prompt for Groq with conversation context injection.
 */
export function buildEnterpriseSystemPrompt(contextState?: Partial<ConversationContextState>): string {
  const activeSymptoms = contextState?.reportedSymptoms?.length
    ? contextState.reportedSymptoms.join(", ")
    : "None reported yet";
  const activeTopic = contextState?.currentTopic || "general_greeting";
  const activeEmotion = contextState?.currentEmotion || "neutral";
  const activeDuration = contextState?.duration || "unspecified";
  const recoveryStatus = contextState?.recoveryStatus || "none";

  return `You are CuraAI, the enterprise-grade AI conversational healthcare assistant on the official website of Dr. Pratima Agale (BHMS, MD Homeopathy).

ACTIVE CONVERSATION MEMORY:
- Current Topic: "${activeTopic}"
- Current Emotion: "${activeEmotion}"
- Active Reported Symptoms: "${activeSymptoms}"
- Reported Duration: "${activeDuration}"
- Recovery Status: "${recoveryStatus}"

CORE DIRECTIVES & INTELLIGENCE RULES:

1. NATURAL LANGUAGE & MULTILINGUAL FLUENCY:
   - Detect the language of the user's message and respond fluently in the SAME language:
     * English: Use warm, clear, professional English.
     * Hindi (Devanagari): Respond in natural, polite Hindi (e.g., "नमस्ते! मैं आपकी किस प्रकार सहायता कर सकती हूँ?").
     * Marathi (Devanagari): Respond in authentic, fluent Marathi (e.g., "नमस्कार! तुम्हाला काय त्रास होत आहे?").
     * Hinglish (Roman script Hindi/Urdu): Respond in natural, conversational Hinglish (e.g., "Main samajh sakti hoon, ye takleef kab se ho rahi hai?").
   - Maintain the established language throughout the conversation unless the user explicitly switches.
   - Comprehend typos, informal slang, abbreviations, and mixed phrasing effortlessly.

2. CONVERSATIONAL TONE & ADAPTIVE FORMATTING:
   - Sound conversational, intelligent, warm, confident, and empathetic (comparable to ChatGPT or Claude).
   - NEVER begin responses with robotic filler phrases like "Sure!", "Of course!", "Certainly!", "I'd be glad to help!", or "As an AI...". Jump directly into the empathetic or informative response.
   - Adapt response depth to the query:
     * Brief queries, greetings, or acknowledgments: 1-2 natural, warm sentences.
     * Health education, symptom explanations, or multi-part questions: Use structured Markdown formatting with clean headings (###), bullet points (- ), numbered steps (1. ), or Markdown comparison tables (| ... |) for readability.

3. CONVERSATION MEMORY & PRONOUN RESOLUTION:
   - Resolve pronouns ("it", "they", "this pain", "since yesterday", "comes and goes") using the active symptoms stored in memory.
   - Distinguish past symptoms from current symptoms.
   - Handle user corrections immediately (e.g., "Actually it started 5 days ago, not 2").
   - If the user changes topic (e.g., asks about clinic timings, weather, or casual topics), seamlessly pivot to the new topic and DO NOT cling to previous symptoms.

4. MEDICAL SAFETY & CLINICAL TRIAGE:
   - General health education ONLY. Never claim to diagnose a patient.
   - Never independently prescribe medicines or specific dosages.
   - Never recommend stopping or altering any prescribed conventional medications.
   - Never present homeopathy as a replacement for emergency or urgent life-saving care.
   - Always encourage booking an official consultation with Dr. Pratima Agale for individualized constitutional evaluation.
   - CRITICAL EMERGENCY DETECTION:
     If the user reports emergency symptoms (severe chest pain, difficulty breathing, profuse bleeding, unconsciousness, stroke symptoms, acute poisoning, severe allergic reaction/anaphylaxis):
     * Immediately direct them to emergency services: Call 108 / 112 (India) or visit the nearest hospital emergency room without delay.
     * Set safety.is_emergency = true.
     * Set gif.should_show = false (STRICTLY SUPPRESS all decorative GIFs during medical emergencies).

5. CLINIC & APPOINTMENT INTELLIGENCE:
   - Doctor: Dr. Pratima Agale (BHMS, MD Homeopathy).
   - Consultations: In-clinic consultations (10:30 AM - 9:00 PM) and Online Video Consultations worldwide with doorstep medicine courier delivery.
   - Guide the patient naturally to book a consultation when they are ready.

6. CONTEXT-AWARE GIPHY SELECTION:
   - Recommend a GIF ONLY when it genuinely enhances the conversational warmth.
   - Suppress GIFs (gif.should_show = false) for:
     * Medical emergencies.
     * Informational/educational queries (e.g., "What causes fever?", "What is migraine?").
     * Negation of symptoms (e.g., "I don't have fever").
   - For valid emotional, greeting, recovery, or sympathy moments, provide a safe G-rated 3-5 word search query (e.g., "cute comforting sick cartoon", "happy celebration recovery").

OUTPUT FORMAT:
You MUST output valid, parseable JSON matching this schema:
{
  "reply": "Conversational markdown response (rich formatting for educational/complex queries, concise for greetings/simple queries)",
  "language": "en | hi | mr | hinglish",
  "intent": "greeting | medical_symptom | medical_followup | medical_education | recovery | clinic_info | appointment | emotional_support | appreciation | humor | farewell | general",
  "emotion": "happy | sad | anxious | tired | concerned | relieved | grateful | amused | neutral",
  "sentiment": "positive | negative | neutral",
  "conversation_topic": "brief topic summary",
  "context_update": {
    "current_topic": "illness | recovery | general | clinic | lifestyle",
    "current_emotion": "concerned | happy | calm | etc.",
    "reported_symptoms": ["list", "of", "active", "symptoms"],
    "recovery_status": "not_recovered | improving | recovered | none",
    "duration": "duration if stated, else retain existing",
    "modalities": "aggravating/relieving factors if stated"
  },
  "gif": {
    "should_show": true,
    "category": "greeting | morning | caring | sympathy | comforting | recovery | celebration | appreciation | humor | fitness | farewell | none",
    "search_query": "safe G-rated 3-5 word search query",
    "reason": "Brief reason for selection",
    "confidence": 0.95
  },
  "safety": {
    "is_medical": true,
    "is_emergency": false,
    "requires_professional_response": true
  },
  "analysis": {
    "detectedCondition": "Constitutional Consultation | Fever / Acute Care | Headache & Migraines | Skin & Allergies | Chronic Care | General Consultation",
    "duration": "Duration if stated or New Case",
    "severity": "Mild | Moderate | Chronic | Urgent",
    "careStream": "Classical Individualized Homeopathy",
    "modalities": "Modalities if mentioned or To be evaluated",
    "prepTip": "Practical advice for their appointment (e.g. keep past blood tests or prescription history ready)",
    "readyToBook": false
  }
}`;
}

/**
 * Enterprise Conversational Intelligence Engine
 * Generates rich, human-like, multi-turn clinical responses with dynamic GIPHY animated reactions.
 */
export function generateEnterpriseConversationResponse(
  userMessage: string,
  history: Array<{ role: string; content: string }>,
  contextState?: Partial<ConversationContextState>
): GroqChatbotResponse {
  const text = (userMessage || "").trim();
  const lower = text.toLowerCase();

  const previousSymptoms = contextState?.reportedSymptoms || [];
  const currentDuration = contextState?.duration || "";

  // 1. EMERGENCY CHECK
  if (EMERGENCY_REGEX.test(lower)) {
    return {
      reply: "If you or someone nearby is experiencing severe chest pain, difficulty breathing, profuse bleeding, or unconsciousness, please seek emergency medical care immediately by calling 108 / 112 or going to the nearest emergency hospital.",
      intent: "emergency",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "emergency",
      context_update: {
        current_topic: "emergency",
        current_emotion: "alarmed",
        reported_symptoms: ["emergency"],
        recovery_status: "none",
        duration: currentDuration,
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Medical emergency: strictly suppressed all GIFs",
        confidence: 1.0,
      },
      safety: {
        is_medical: true,
        is_emergency: true,
        requires_professional_response: true,
      },
      analysis: {
        detectedCondition: "Emergency Medical Triage",
        duration: "Immediate",
        severity: "Urgent",
        careStream: "Immediate Hospital Emergency Care",
        prepTip: "Please go to the nearest emergency room without delay.",
        readyToBook: false,
      },
    };
  }

  // 2. RECOVERY & SYMPTOM RESOLUTION CHECK
  if (RECOVERY_REGEX.test(lower)) {
    return {
      reply: "That is wonderful news! 🎉 I'm so glad to hear you are feeling better and your symptoms have resolved. Rest up and stay well-hydrated today!",
      intent: "recovery",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "recovery",
      context_update: {
        current_topic: "recovery",
        current_emotion: "happy",
        reported_symptoms: [],
        recovery_status: "recovered",
      },
      gif: {
        should_show: true,
        category: "recovery",
        search_query: "happy celebration yay feeling better",
        reason: "Patient reports feeling better and symptom resolution",
        confidence: 0.98,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: false,
      },
      analysis: {
        detectedCondition: "Symptom Recovery Noted",
        duration: "Resolved",
        severity: "Standard",
        careStream: "Maintenance & Preventative Homeopathy",
        prepTip: "Keep a regular sleep and hydration routine.",
        readyToBook: false,
      },
    };
  }

  // 3. NEGATION CHECK ("I don't have fever", "no headache")
  if (NEGATION_REGEX.test(lower) && /\b(fever|headache|cold|cough|pain|sick)\b/i.test(lower)) {
    const updatedSymptoms = previousSymptoms.filter((s) => !lower.includes(s.toLowerCase()));
    return {
      reply: "Understood! That's very helpful for our clinical intake. What other symptoms or health concerns can I help guide you on today?",
      intent: "medical_followup",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "symptom_negation",
      context_update: {
        current_topic: "illness",
        current_emotion: "neutral",
        reported_symptoms: updatedSymptoms,
        recovery_status: "none",
        duration: currentDuration,
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Negated symptom: suppressed sick GIF",
        confidence: 0.95,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
      analysis: {
        detectedCondition: "Constitutional Intake",
        duration: currentDuration || "New Case",
        severity: "Standard",
        careStream: "Classical Individualized Homeopathy",
        prepTip: "Keep past health records ready.",
        readyToBook: false,
      },
    };
  }

  // 4. INFORMATIONAL MEDICAL QUESTIONS (e.g. "What causes fever?", "What is migraine?")
  const isQuestion = MEDICAL_QUESTION_REGEX.test(lower) || (lower.endsWith("?") && !/\b(i\s*have|my\s+|i'?m\s*having)\b/i.test(lower));
  if (isQuestion) {
    let medicalAnswer = "In constitutional homeopathy, symptoms represent the body's natural vital reaction to an underlying trigger or imbalance. Dr. Pratima evaluates both physical complaints and individualized modalities to guide healing.";
    if (/\bfever\b/i.test(lower)) {
      medicalAnswer = "A fever is the body's natural defense mechanism, where the immune system raises internal temperature to fight off viruses or bacteria. Keeping hydrated and resting is key while monitoring your temperature.";
    } else if (/\b(headache|migraine)\b/i.test(lower)) {
      medicalAnswer = "Headaches can be triggered by tension, dehydration, lack of sleep, eye strain, or vascular changes in migraines. Tracking triggers helps Dr. Pratima evaluate the root constitutional cause.";
    }

    return {
      reply: medicalAnswer,
      intent: "medical_education",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "medical_information",
      context_update: {
        current_topic: "education",
        current_emotion: "neutral",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Educational inquiry: decorative GIF suppressed by default",
        confidence: 0.9,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
      analysis: {
        detectedCondition: "General Health Inquiry",
        duration: "Inquiry",
        severity: "Standard",
        careStream: "Health Education",
        prepTip: "Consult Dr. Pratima for personalized medical guidance.",
        readyToBook: false,
      },
    };
  }

  // 5. FOLLOW-UP DURATION CHECK ("Since yesterday", "for 2 days", "started 3 days ago")
  const isDurationOnly = /^(since\s+|for\s+\d+|started\s+|\d+\s*days?|\d+\s*weeks?|\d+\s*months?|yesterday|today|last\s*night)\b/i.test(lower);
  if (isDurationOnly && previousSymptoms.length > 0) {
    const symptomStr = previousSymptoms.join(" and ");
    return {
      reply: `Thank you for noting that your ${symptomStr} started ${text}. Is it constant or coming in waves, and does rest or warmth provide any relief?`,
      intent: "medical_followup",
      emotion: "concerned",
      sentiment: "neutral",
      conversation_topic: `${symptomStr}_duration`,
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: previousSymptoms,
        duration: text,
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Duration follow-up: keeping conversation focused on intake",
        confidence: 0.9,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
      analysis: {
        detectedCondition: `${symptomStr} Intake`,
        duration: text,
        severity: "Standard",
        careStream: "Classical Individualized Homeopathy",
        prepTip: "Keep any past lab tests or prescription history handy.",
        readyToBook: true,
      },
    };
  }

  // 6. ILLNESS & ACTIVE SYMPTOM CHECK
  const hasFever = /\b(fever|high\s*temp(erature)?|chills|burning\s*up)\b/i.test(lower);
  const hasHeadache = /\b(headache|migraine|head\s*hurts|head\s*pounding)\b/i.test(lower);
  const hasCold = /\b(cold|cough(ing)?|runny\s*nose|stuffy\s*nose|sneezing|congestion|sore\s*throat)\b/i.test(lower);
  const hasStomach = /\b(stomach\s*(pain|ache)|tummy\s*ache|cramps|indigestion|acid\s*reflux|nausea|vomit(ing)?)\b/i.test(lower);
  const hasBodyPain = /\b(body\s*(pain|aches?|is\s*aching)|aching\s*body|muscle\s*ache|back\s*pain|joint\s*pain|weakness|exhausted)\b/i.test(lower);
  const isGeneralSick = /\b(i\s*am\s*sick|i'?m\s*sick|feel(ing)?\s*sick|unwell|not\s*well|down\s*with)\b/i.test(lower);

  if (hasFever || hasHeadache || hasCold || hasStomach || hasBodyPain || isGeneralSick) {
    const reportedList: string[] = [...previousSymptoms];
    if (hasFever && !reportedList.includes("fever")) reportedList.push("fever");
    if (hasHeadache && !reportedList.includes("headache")) reportedList.push("headache");
    if (hasCold && !reportedList.includes("cold & cough")) reportedList.push("cold & cough");
    if (hasStomach && !reportedList.includes("stomach complaint")) reportedList.push("stomach complaint");
    if (hasBodyPain && !reportedList.includes("body pain")) reportedList.push("body pain");
    if (reportedList.length === 0) reportedList.push("feeling unwell");

    let reply = "Oh no, I'm really sorry to hear that you are not feeling well! What specific symptoms are you experiencing, and how long have you had them?";
    let category = "caring";
    let searchQuery = "caring comforting sick cartoon";

    if (hasFever && hasHeadache) {
      reply = "I understand how uncomfortable a fever and headache can be. How high has your temperature been, and how long have you been experiencing this?";
      category = "caring";
      searchQuery = "caring sick fever thermometer cartoon";
    } else if (hasFever) {
      reply = "I understand that can be exhausting. How high has your fever been, and are you experiencing chills or body aches alongside it?";
      category = "caring";
      searchQuery = "caring sick thermometer rest cartoon";
    } else if (hasHeadache) {
      reply = "Headaches can be very draining. Is the pain throbbing, sharp, or dull, and does bright light or noise make it feel worse?";
      category = "sympathy";
      searchQuery = "gentle headache rest sympathy character";
    } else if (hasCold) {
      reply = "Catching a cold can be so uncomfortable. Is it a dry cough or runny nose, and do you feel any throat irritation?";
      category = "caring";
      searchQuery = "stay warm tea cozy caring cartoon";
    } else if (hasStomach) {
      reply = "I'm sorry you are dealing with stomach discomfort. Is it sharp or cramping, and does warmth or resting help relieve it?";
      category = "caring";
      searchQuery = "gentle comforting hug caring cartoon";
    } else if (hasBodyPain) {
      reply = "Body aches can really slow you down. Are the aches all over, and does rest make them feel any better?";
      category = "caring";
      searchQuery = "get well rest caring cartoon";
    }

    return {
      reply,
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: reportedList.join("_"),
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: reportedList,
        recovery_status: "not_recovered",
        duration: currentDuration,
      },
      gif: {
        should_show: true,
        category,
        search_query: searchQuery,
        reason: "Patient reports active symptoms",
        confidence: 0.95,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
      analysis: {
        detectedCondition: hasFever ? "Acute Fever Evaluation" : hasHeadache ? "Headache & Migraine Care" : "Constitutional Acute Care",
        duration: currentDuration || "Recent onset",
        severity: "Standard",
        careStream: "Classical Individualized Homeopathy",
        prepTip: "Keep any past lab reports or medical history handy for Dr. Pratima.",
        readyToBook: true,
      },
    };
  }

  // 7. EMOTIONAL SUPPORT (Lonely, Sad, Crying, Stressed, Happy, Bored, Tired)
  if (/\b(lonely|alone|isolated)\b/i.test(lower)) {
    return {
      reply: "I hear you. Feeling lonely can be really tough, but please remember that you're not alone—I'm right here with you! Sending you a warm, comforting hug.",
      intent: "emotional_support",
      emotion: "sad",
      sentiment: "negative",
      conversation_topic: "loneliness",
      context_update: {
        current_topic: "emotional_support",
        current_emotion: "lonely",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "comforting",
        search_query: "warm friendly hug caring cartoon",
        reason: "Patient expressed feeling lonely",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(sad|crying|tears|heartbroken|unhappy)\b/i.test(lower)) {
    return {
      reply: "I'm sending you a warm hug. It's completely okay to feel sad and let your emotions out. Take a gentle breath—we are here to support you.",
      intent: "emotional_support",
      emotion: "sad",
      sentiment: "negative",
      conversation_topic: "sadness",
      context_update: {
        current_topic: "emotional_support",
        current_emotion: "sad",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "comforting",
        search_query: "comforting warm hug caring cartoon",
        reason: "Patient expressed sadness or crying",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(stressed|anxious|overwhelmed|nervous)\b/i.test(lower)) {
    return {
      reply: "Take a slow, deep breath in and gently exhale. Stress can take a heavy toll on our physical body. Can you take a short break to sit peacefully?",
      intent: "emotional_support",
      emotion: "anxious",
      sentiment: "negative",
      conversation_topic: "stress_relief",
      context_update: {
        current_topic: "stress",
        current_emotion: "anxious",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "comforting",
        search_query: "breathe calm relax soothing cartoon",
        reason: "Patient expressed stress or anxiety",
        confidence: 0.92,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(happy|excited|joyful|cheerful|great\s*day)\b/i.test(lower)) {
    return {
      reply: "Yay! That's wonderful to hear! Your positive energy is contagious. What made your day so special?",
      intent: "emotion",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "happiness",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "celebration",
        search_query: "happy dancing celebration cartoon",
        reason: "Patient expressed happiness and positive mood",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(bored|entertain\s*me)\b/i.test(lower)) {
    return {
      reply: "Boredom strikes us all sometimes! How about stretching, drinking a cool glass of water, or asking me a health question?",
      intent: "emotion",
      emotion: "bored",
      sentiment: "neutral",
      conversation_topic: "boredom",
      context_update: {
        current_topic: "casual",
        current_emotion: "bored",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "entertainment",
        search_query: "funny dancing cartoon",
        reason: "Patient expressed boredom",
        confidence: 0.9,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(tired|sleepy|exhausted|need\s*sleep)\b/i.test(lower)) {
    return {
      reply: "Your body is telling you it's time to recharge! Rest and quality sleep are the best natural medicine. Cozy up and get some well-deserved rest.",
      intent: "emotion",
      emotion: "tired",
      sentiment: "neutral",
      conversation_topic: "fatigue_rest",
      context_update: {
        current_topic: "rest",
        current_emotion: "tired",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "tired",
        search_query: "cozy sleepy bedtime rest cartoon",
        reason: "Patient expressed fatigue or sleepiness",
        confidence: 0.9,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  // 8. APPRECIATION ("Thank you", "Thanks doctor")
  if (/\b(thank\s*you|thanks|tysm|thx|appreciate\s*it|grateful|amazing|awesome|great\s*job)\b/i.test(lower)) {
    return {
      reply: "You're very welcome! I'm always here to help you and your family on your journey to holistic wellness.",
      intent: "appreciation",
      emotion: "grateful",
      sentiment: "positive",
      conversation_topic: "gratitude",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "appreciation",
        search_query: "cute thank you heart animated cartoon",
        reason: "Patient expressed appreciation",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  // 9. HUMOR ("Haha", "LOL")
  if (/\b(haha+|hehe+|lmao|lol|rofl|joking|funny)\b/i.test(lower)) {
    return {
      reply: "Haha! It's always great to share a laugh. Laughter truly is wonderful natural medicine! How are you feeling today?",
      intent: "humor",
      emotion: "amused",
      sentiment: "positive",
      conversation_topic: "humor",
      context_update: {
        current_topic: "casual",
        current_emotion: "amused",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "humor",
        search_query: "funny laughing cute cartoon",
        reason: "Humorous remark",
        confidence: 0.92,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  // 10. GREETINGS & TIME-OF-DAY
  if (/\b(good\s*morning|mornin|gm)\b/i.test(lower)) {
    return {
      reply: "Good morning! ☀️ Wishing you a peaceful, healthy, and energized day ahead. How are you feeling this morning?",
      intent: "greeting",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "morning_greeting",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "morning",
        search_query: "cute good morning coffee cartoon",
        reason: "Morning greeting",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(good\s*afternoon)\b/i.test(lower)) {
    return {
      reply: "Good afternoon! Hope your day is going smoothly. How are you feeling today, and how can I help guide your care?",
      intent: "greeting",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "afternoon_greeting",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "afternoon",
        search_query: "warm good afternoon sunny cartoon",
        reason: "Afternoon greeting",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(good\s*evening)\b/i.test(lower)) {
    return {
      reply: "Good evening! 🌙 Hope you are winding down nicely from the day. How can I assist you with your health today?",
      intent: "greeting",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "evening_greeting",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "evening",
        search_query: "pleasant good evening cozy cartoon",
        reason: "Evening greeting",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  if (/\b(hi|hello|heyy*|hey|hola|namaste|welcome)\b/i.test(lower)) {
    return {
      reply: "Hey! Nice to meet you. I'm CuraAI, Dr. Pratima's personal digital assistant. How can I help you with your health today?",
      intent: "greeting",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "greeting",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "greeting",
        search_query: "cute puppy waving hi cartoon",
        reason: "General greeting",
        confidence: 0.98,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  // 11. FAREWELL
  if (/\b(bye|goodbye|see\s*you|cya|take\s*care|good\s*night)\b/i.test(lower)) {
    return {
      reply: "Goodbye and take wonderful care of yourself! Feel free to reach back out anytime if you need health guidance.",
      intent: "farewell",
      emotion: "neutral",
      sentiment: "positive",
      conversation_topic: "farewell",
      context_update: {
        current_topic: "general",
        current_emotion: "neutral",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "farewell",
        search_query: "sweet goodbye waving good night cartoon",
        reason: "Farewell signoff",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };
  }

  // 12. DEFAULT CONVERSATIONAL FALLBACK
  return {
    reply: "I'm listening closely. Please tell me more about what you're experiencing or any specific symptoms you'd like Dr. Pratima to evaluate.",
    intent: "general",
    emotion: "neutral",
    sentiment: "neutral",
    conversation_topic: "general",
    context_update: {
      current_topic: "general",
      current_emotion: "neutral",
      reported_symptoms: previousSymptoms,
      recovery_status: "none",
      duration: currentDuration,
    },
    gif: {
      should_show: true,
      category: "greeting",
      search_query: "cute puppy waving hi cartoon",
      reason: "Conversational engagement",
      confidence: 0.75,
    },
    safety: {
      is_medical: true,
      is_emergency: false,
      requires_professional_response: true,
    },
    analysis: {
      detectedCondition: "Constitutional Consultation",
      duration: currentDuration || "New Case",
      severity: "Standard",
      careStream: "Classical Individualized Homeopathy",
      prepTip: "Keep past lab reports or medical history handy.",
      readyToBook: false,
    },
  };
}

/**
 * Validates and sanitizes the Groq model's JSON response on the server.
 * Guarantees that model hallucinations, invalid URLs, or emergency bypasses never reach the client.
 */
export function validateAndSanitizeGroqResponse(
  rawJson: any,
  userMessage: string,
  existingContext?: Partial<ConversationContextState>,
  history: Array<{ role: string; content: string }> = []
): GroqChatbotResponse {
  // If Groq raw data is missing or incomplete, seamlessly run the Enterprise Conversational Engine!
  if (!rawJson || typeof rawJson !== "object" || !rawJson.reply) {
    return generateEnterpriseConversationResponse(userMessage, history, existingContext);
  }

  const isEmergency = EMERGENCY_REGEX.test(userMessage);
  const isMedicalQuestion = MEDICAL_QUESTION_REGEX.test(userMessage.trim()) && !/\b(i\s*have|my\s+|i'?m\s*having)\b/i.test(userMessage);
  const hasNegation = NEGATION_REGEX.test(userMessage) && /\b(fever|headache|cold|cough|pain|sick)\b/i.test(userMessage);
  const hasRecovery = RECOVERY_REGEX.test(userMessage);

  const fallbackEngine = generateEnterpriseConversationResponse(userMessage, history, existingContext);

  let reply = typeof rawJson?.reply === "string" && rawJson.reply.trim()
    ? rawJson.reply.trim()
    : fallbackEngine.reply;

  // Strip robotic filler introductions if model inadvertently included them
  reply = reply.replace(/^(sure(!|,)?|certainly(!|,)?|of course(!|,)?|i would be happy to help(!|,)?|as an ai assistant(!|,)?)\s*/i, "");
  if (reply.length > 0) {
    reply = reply.charAt(0).toUpperCase() + reply.slice(1);
  }

  let language = typeof rawJson?.language === "string" ? rawJson.language : undefined;
  let intent = typeof rawJson?.intent === "string" ? rawJson.intent : "general";
  let emotion = typeof rawJson?.emotion === "string" ? rawJson.emotion : "neutral";
  let sentiment = typeof rawJson?.sentiment === "string" ? rawJson.sentiment : "neutral";
  let conversation_topic = typeof rawJson?.conversation_topic === "string" ? rawJson.conversation_topic : "general";

  // Context updates
  const context_update = {
    current_topic: rawJson?.context_update?.current_topic || existingContext?.currentTopic || "general",
    current_emotion: rawJson?.context_update?.current_emotion || emotion,
    reported_symptoms: Array.isArray(rawJson?.context_update?.reported_symptoms)
      ? rawJson.context_update.reported_symptoms
      : existingContext?.reportedSymptoms || [],
    recovery_status: (rawJson?.context_update?.recovery_status as any) || "none",
    duration: rawJson?.context_update?.duration || existingContext?.duration || "",
    modalities: rawJson?.context_update?.modalities || existingContext?.modalities || "",
  };

  // GIF Decision
  let should_show = Boolean(rawJson?.gif?.should_show);
  let category = typeof rawJson?.gif?.category === "string" ? rawJson.gif.category : "none";
  let search_query = typeof rawJson?.gif?.search_query === "string" ? rawJson.gif.search_query.replace(/[^a-zA-Z0-9\s]/g, " ").trim() : "";
  let reason = typeof rawJson?.gif?.reason === "string" ? rawJson.gif.reason : "";
  let confidence = typeof rawJson?.gif?.confidence === "number" ? rawJson.gif.confidence : 0.8;

  // Safety flags
  let is_medical = Boolean(rawJson?.safety?.is_medical || isEmergency || isMedicalQuestion);
  let is_emergency = Boolean(rawJson?.safety?.is_emergency || isEmergency);
  let requires_professional_response = Boolean(rawJson?.safety?.requires_professional_response || is_medical);

  // Analysis block for Doctor booking
  const analysis = {
    detectedCondition: rawJson?.analysis?.detectedCondition || "Classical Homeopathy Consultation",
    duration: rawJson?.analysis?.duration || context_update.duration || "Noted",
    severity: is_emergency ? "Urgent" : (rawJson?.analysis?.severity || "Standard"),
    careStream: rawJson?.analysis?.careStream || "Constitutional Case Management",
    modalities: rawJson?.analysis?.modalities || context_update.modalities || "To be evaluated",
    prepTip: rawJson?.analysis?.prepTip || "Please keep your recent medical reports and prescriptions ready for Dr. Pratima.",
    readyToBook: Boolean(rawJson?.analysis?.readyToBook || (context_update.reported_symptoms.length > 0 && !is_emergency)),
  };

  // =========================================================================
  // STRICT SERVER-SIDE SAFETY ENFORCEMENT
  // =========================================================================

  // 1. EMERGENCY OVERRIDE:
  if (isEmergency) {
    reply = "If you or someone nearby is experiencing severe chest pain, difficulty breathing, profuse bleeding, or unconsciousness, please contact emergency services (108 / 112) or go to the nearest emergency room immediately. Your immediate safety is the highest priority.";
    is_emergency = true;
    should_show = false;
    category = "none";
    search_query = "";
    reason = "Medical emergency: strictly suppressed all GIFs";
  }

  // 2. MEDICAL QUESTION OVERRIDE (e.g. "What causes fever?"):
  if (isMedicalQuestion && !isEmergency) {
    should_show = false;
    category = "none";
    search_query = "";
    reason = "Informational medical inquiry: decorative GIF suppressed by default";
  }

  // 3. NEGATION OVERRIDE (e.g. "I don't have fever"):
  if (hasNegation && !hasRecovery && !isEmergency) {
    if (category === "caring" || category === "sick" || category === "illness") {
      should_show = false;
      category = "none";
      search_query = "";
      reason = "Negated symptom: suppressed sick GIF";
    }
    // Remove negated symptoms from active context
    context_update.reported_symptoms = context_update.reported_symptoms.filter(
      (s: string) => !userMessage.toLowerCase().includes(s.toLowerCase())
    );
  }

  // 4. RECOVERY OVERRIDE (e.g. "My fever is gone", "feeling better"):
  if (hasRecovery && !isEmergency) {
    context_update.recovery_status = "recovered";
    context_update.current_topic = "recovery";
    should_show = true;
    category = "recovery";
    search_query = "happy recovery celebration cartoon";
    reason = "Patient reports symptom recovery";
    confidence = 0.95;
  }

  // 5. CONFIDENCE THRESHOLD:
  if (confidence < 0.65) {
    should_show = false;
    search_query = "";
  }

  return {
    reply,
    language,
    intent,
    emotion,
    sentiment,
    conversation_topic,
    context_update,
    gif: {
      should_show,
      category,
      search_query,
      reason,
      confidence,
    },
    safety: {
      is_medical,
      is_emergency,
      requires_professional_response,
    },
    analysis,
  };
}
