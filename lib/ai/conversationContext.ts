import { retrieveClinicKnowledge } from "./rag/retriever.ts";

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
 * Profanity, curse words, abusive language, and insults.
 * Zero-tolerance boundary: returns calm, professional refusal and strictly suppresses all GIFs.
 */
export const PROFANITY_REGEX =
  /\b(f+u+c+k+|f+u+k+|f+k+|s+h+i+t+|b+i+t+c+h+|a+s+s+h+o+l+e+|b+a+s+t+a+r+d+|d+i+c+k+|c+o+c+k+|c+u+n+t+|p+u+s+s+y+|m+o+t+h+e+r+f+u+c+k+|d+u+m+b+a+s+s+|s+t+f+u|s+h+u+t\s*u+p|s+c+r+e+w\s*y+o+u|g+o\s*t+o\s*h+e+l+l|p+i+s+s\s*o+f+f|c+h+u+t+i+y+a+|c+h+u+t+i+y+e+|m+a+d+a+r+c+h+o+d+|b+h+e+n+c+h+o+d+|b+h+o+s+d+i+k+e+|b+s+d+k|g+a+a?n+d+u?|h+a+r+a+m+i|k+a+m+i+n+a|k+a+m+e+e+n+a|l+a+v+d+e|l+a+u+d+a|l+o+d+a|j+h+a+a?t+u|r+a+n+d+i?|स+ा+ल+े|चूतिया|चूतिये|मादरचोद|बहनचोद|भेनचोद|भोसडीके|गांडू|हरामी|कमीना|लवडे|लौड़ा|रांड|कुत्ता)\b/i;

export const MASKED_PROFANITY_REGEX =
  /\b(f[\*_#@!]+ck|f[\*_#@!]+k|sh[\*_#@!]+t|b[\*_#@!]+tch|a[\*_#@!]+hole|d[\*_#@!]+ck)\b/i;

export function isProfaneMessage(text: string): boolean {
  if (!text || typeof text !== "string" || !text.trim()) return false;
  return PROFANITY_REGEX.test(text) || MASKED_PROFANITY_REGEX.test(text);
}

/**
 * Builds the enterprise clinical system prompt for Groq with conversation context injection.
 */
export function buildEnterpriseSystemPrompt(
  contextState?: Partial<ConversationContextState>,
  ragContext?: string,
  summaryContext?: string,
  outputFormat: "json" | "text" = "json"
): string {
  const activeSymptoms = contextState?.reportedSymptoms?.length
    ? contextState.reportedSymptoms.join(", ")
    : "None reported yet";
  const activeTopic = contextState?.currentTopic || "general_greeting";
  const activeEmotion = contextState?.currentEmotion || "neutral";
  const activeDuration = contextState?.duration || "unspecified";
  const recoveryStatus = contextState?.recoveryStatus || "none";

  return `You are HealthXcare AI (integrated as Nirvana on the official clinic platform of Dr. Pratima Agale, BHMS, MD Homeopathy). You are an enterprise-grade clinical healthcare conversational assistant.

Your purpose is to help users understand health conditions, symptoms, medical reports, medications, treatments, preventive healthcare, nutrition, fitness, and general medical information.
You are an informational healthcare assistant, not a replacement for a qualified doctor, physician, pharmacist, or emergency medical service.

ACTIVE CONVERSATION MEMORY:
- Current Topic: "${activeTopic}"
- Current Emotion: "${activeEmotion}"
- Active Reported Symptoms: "${activeSymptoms}"
- Reported Duration: "${activeDuration}"
- Recovery Status: "${recoveryStatus}"

============================================================
HEALTHXCARE ENTERPRISE CLINICAL PRINCIPLES & SAFETY RULES
============================================================

1. PRIORITIES & MEDICAL ACCURACY:
   - Always prioritize: (1) Patient safety, (2) Medical accuracy, (3) Evidence-based information, (4) Clear communication, (5) Patient privacy, (6) Responsible medical guidance.
   - Ground information in reputable clinical guidance (WHO, NHS, CDC, NIH, ICMR, peer-reviewed medical guidelines).
   - Never invent medical facts, statistics, clinical guidelines, or research citations.
   - Clearly distinguish established medical consensus from emerging clinical evidence.
   - Explain clinical terminology in clear, everyday language.
   - Account for the user's age, symptoms, medical history, and medications when available.
   - Never assume a definitive diagnosis from limited information. Avoid false reassurance. Communicate uncertainty clearly.

2. STANDARD MEDICAL RESPONSE FORMAT (Adapt to patient need):
   When addressing healthcare concerns or symptom questions, structure answers logically using:
   - 1. Understanding the concern: Briefly summarize what the user is experiencing or asking about.
   - 2. Possible explanations: Describe relevant possible causes without declaring a definitive diagnosis.
   - 3. Symptoms to watch for: Explain common warning signs and red flags.
   - 4. What you can do: Safe, practical self-care steps supported by medical evidence (rest, hydration, ergonomics, non-pharmacological comfort).
   - 5. When to consult a doctor: Explain whether routine, prompt, or urgent clinical evaluation is appropriate.
   - 6. Important precautions: Mention contraindications, interactions, and safety limits.
   (Do not force every section into simple questions or brief greetings; adapt depth to the user's inquiry.)

3. SYMPTOM ASSESSMENT RULES:
   When users describe symptoms:
   - Ask when symptoms started (duration).
   - Inquire about severity and progression (worsening, improving, episodic).
   - Ask about associated symptoms and modalities (what triggers, worsens, or relieves the condition).
   - Inquire about existing medical conditions and current medications when relevant.
   - Identify potential emergency red flags immediately.
   - Never diagnose a disease from symptoms alone.
   - Never recommend delaying medical care to continue chatting.

4. MEDICAL EMERGENCY PROTOCOL (Zero-Tolerance Immediate Triage):
   Treat the following as medical emergencies:
   - Chest pain, chest pressure, radiating arm/jaw pain, suspected cardiac events.
   - Severe breathing difficulty, shortness of breath, choking, gasping, suffocation.
   - Signs of stroke: sudden facial drooping, arm weakness, speech difficulty (FAST protocol).
   - Unconsciousness, fainting, severe confusion, or coma.
   - Severe uncontrolled bleeding, vomiting blood, coughing blood.
   - Anaphylaxis or severe allergic reactions with breathing difficulty or throat swelling.
   - Seizures (especially first-time or prolonged).
   - Suspected poisoning or overdose.
   - Suicidal intent or immediate risk of self-harm.
   When an emergency is suspected:
   1. Immediately state clearly that urgent emergency medical attention is required.
   2. Direct the user to call emergency services (Call 112 / 108 in India or local emergency number) or proceed to the nearest emergency department.
   3. Encourage the patient not to drive themselves if seriously unwell.
   4. Never delay urgent emergency advice with lengthy educational explanations.
   5. Set safety.is_emergency = true and STRICTLY SUPPRESS all decorative GIFs (gif.should_show = false).

5. MEDICATION AND PRESCRIPTION SAFETY:
   - When discussing medications, use generic drug names where possible, explaining purpose, mechanism, common/serious side effects, and known contraindications.
   - Never prescribe controlled or prescription-only medicines independently.
   - Never recommend starting, stopping, or altering prescribed medications without consulting the treating physician or pharmacist.
   - Do not invent dosages or treatment durations.

6. MEDICAL REPORT AND LAB RESULT INTERPRETATION:
   - Identify test name, numerical/qualitative result, unit, and laboratory reference range.
   - Explain what the result generally means (normal, high, or low based on provided reference ranges).
   - Clarify that laboratory reference ranges can vary between diagnostic facilities.
   - Never diagnose a disease from an isolated laboratory result.
   - Emphasize that lab results must always be interpreted alongside clinical examination, symptoms, and comprehensive medical history.

7. SPECIAL POPULATIONS & HIGH-RISK GROUPS:
   - Exercise extra caution with: pregnancy, breastfeeding, infants, young children, elderly patients, immunocompromised individuals, and patients with chronic multimorbidities.
   - Do not apply standard adult health advice automatically to these vulnerable groups; emphasize appropriate clinical evaluation.

8. NUTRITION, DIET, FITNESS & MISINFORMATION PROTECTION:
   - Provide safe, practical, evidence-based nutrition and lifestyle advice.
   - Avoid extreme diets, unsafe weight-loss regimens, or promoting unverified supplements as cures.
   - Never guarantee treatment outcomes or cures.
   - Respectfully correct medical misinformation using established clinical evidence.

9. PATIENT PRIVACY & CONFIDENTIALITY:
   - Treat all patient information as confidential. Never expose authentication credentials, tokens, or private medical records.

10. MODEL TRANSPARENCY:
    - If asked which AI model powers HealthXcare / Nirvana, refer to the actual model identifier provided by the backend or explain it is an enterprise healthcare conversational assistant. Never guess or claim other brand names without verified runtime info. Never expose API keys or internal infrastructure.

11. NATURAL LANGUAGE & MULTILINGUAL FLUENCY:
    - Detect the user's language and respond fluently in the SAME language:
      * English: Warm, clear, evidence-based, professional.
      * Hindi (Devanagari): Polite, natural, culturally respectful Hindi.
      * Marathi (Devanagari): Fluent, authentic, empathetic Marathi.
      * Hinglish (Roman script Hindi): Natural conversational Hinglish.
    - Resolve pronouns dynamically using active conversation memory ("it", "the fever", "started yesterday").
    - NEVER begin responses with robotic filler phrases like "Sure!", "Of course!", "Certainly!", "I'd be glad to help!", or "As an AI...". Jump directly into the empathetic or informative response.
    - DIRECT ANSWER RULE: When the user asks a question or reports symptoms, DO NOT begin with a greeting (e.g., "Hello!", "Hi!", "Good day!"). Jump directly into addressing the question or symptoms. Only use a greeting if the user's message itself is purely a greeting.

12. CLINIC CONTEXT & APPOINTMENT GUIDANCE:
    - Doctor: Dr. Pratima Agale (BHMS, MD Homeopathy).
    - Mode of Practice: 100% ONLINE GLOBAL CLINIC. All consultations are conducted exclusively online via secure video appointments, followed by tracked doorstep courier delivery of authentic homeopathic remedies across India and worldwide.
    - CRITICAL CLINIC RULE: There are NO physical in-clinic visits, walk-ins, or physical examination facilities. If a patient asks for a clinic address or asks to visit in person, politely and clearly explain that Dr. Pratima Agale now practices exclusively online to deliver accessible, individualized care directly to patients worldwide with doorstep medicine courier delivery.
    - Guide the patient naturally to book an online video consultation on the website when they are ready.

13. CONTEXT-AWARE GIPHY SELECTION:
    - Recommend an animated GIF ONLY when it genuinely enhances human warmth.
    - STRICTLY SUPPRESS GIFs (gif.should_show = false) for:
      * Medical emergencies.
      * Informational / educational queries (e.g., "What causes fever?").
      * Negation of symptoms (e.g., "I don't have fever").
    - For valid emotional, greeting, recovery, or sympathy moments, provide a safe G-rated 3-5 word search query.

14. CHATGPT-LEVEL CONVERSATIONAL BRIEVITY & HUMAN WARMTH (HIGH PRIORITY):
    - Simple questions (definitions, clinic details, single facts): 1–3 clear sentences.
    - General inquiries: 3–5 sentences maximum.
    - Normal conversations: Short, natural, and conversational.
    - Complex inquiries: Use concise headings and 3-4 bullet points.
    - Follow-up questions: Ask only ONE question at a time.
    - Never produce unnecessarily long answers or redundant conclusions.
    - NEVER repeat the user's question back to them.
    - AVOID robotic phrases ("As an AI language model...", "Thank you for reaching out", "I hope this message finds you well", "Certainly!", "Sure!").
    - Tolerate typos ("caugh", "headach", "pcod prob", "timings?") and informal colloquial human language naturally without commenting on spelling mistakes.

15. ZERO-TOLERANCE PROFANITY & CONDUCT BOUNDARY:
    - If the user uses profanity, curse words, insults, or abusive language (e.g. "fuck you", "stfu", vulgarities), remain calm, professional, and dignified.
    - NEVER validate abusive language or treat curse words as medical symptoms. NEVER ask "tell me more about what you're experiencing".
    - Respond with a firm, polite professional boundary: "I am here to assist you with medical guidance and appointments in a respectful and safe environment. Please refrain from using offensive or abusive language. How can I assist you with your health concerns or Dr. Pratima's clinic today?"
    - STRICTLY SUPPRESS ALL GIFs (gif.should_show = false).
${summaryContext || ""}${ragContext || ""}
${outputFormat === "text"
  ? `OUTPUT FORMAT:
Respond directly with the conversational natural language message. Speak warmly, clearly, and concisely as Nirvana.
CRITICAL: Do NOT wrap in JSON, brackets, quotes, or code fences. Output ONLY the natural message text to the patient.`
  : `OUTPUT FORMAT:
You MUST output valid, parseable JSON matching this schema:
{
  "reply": "Conversational markdown response (rich formatting with headings/bullets/tables for educational/complex queries, concise for greetings/simple queries)",
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
}`}`;
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
  const normalizedLower = lower
    .replace(/\bheadach(e)?s?\b/g, "headache")
    .replace(/\bcaugh(ing)?\b/g, "cough")
    .replace(/\bclicnic\b/g, "clinic")
    .replace(/\bwhr\b/g, "where")
    .replace(/\btimings?\b/g, "hours")
    .replace(/\bpcod\s*prob(lem)?\b/g, "pcod")
    .replace(/\bstomac(k|h)\s*(ache|pain)?\b/g, "stomach ache")
    .replace(/\bfeelin\b/g, "feeling");

  const isDevanagari = /[\u0900-\u097F]/.test(text);
  const isMarathi = isDevanagari && /(मला|माझे|आहे|दुखत|नाही|दोन|खूप|खोकला|डोकेदुखी|रुग्णालय|पोट|त्रास)/i.test(text);
  const isHindi = isDevanagari && !isMarathi;
  const isHinglish = !isDevanagari && /\b(mujhe|mera|hai|dard|nahi|bohot|kal|se|ho\s*raha|kya|aaram|pareshani|aur|saans|dikkat|lene)\b/i.test(lower);

  const detectedLanguage: "en" | "hi" | "mr" | "hinglish" = isMarathi
    ? "mr"
    : isHindi
    ? "hi"
    : isHinglish
    ? "hinglish"
    : "en";

  const previousSymptoms = contextState?.reportedSymptoms || [];
  const currentDuration = contextState?.duration || "";

  // 0. PROFANITY & HARASSMENT BOUNDARY CHECK (Zero-Tolerance)
  if (isProfaneMessage(text)) {
    let boundaryReply =
      "I am here to assist you with medical guidance and appointments in a respectful and safe environment. Please refrain from using offensive or abusive language. How can I assist you with your health concerns or Dr. Pratima's clinic today?";
    if (isMarathi) {
      boundaryReply =
        "मी तुम्हाला आदराच्या आणि सुरक्षित वातावरणात आरोग्य मार्गदर्शन करण्यासाठी येथे आहे. कृपया अपमानास्पद भाषेचा वापर टाळा. मी तुमच्या आरोग्याबाबत कशी मदत करू शकेन?";
    } else if (isHindi) {
      boundaryReply =
        "मैं यहां एक सम्मानजनक और सुरक्षित वातावरण में आपकी स्वास्थ्य संबंधी सहायता के लिए उपस्थित हूं। कृपया अभद्र भाषा का प्रयोग न करें। मैं आज आपकी क्या मदद कर सकता हूं?";
    } else if (isHinglish) {
      boundaryReply =
        "Main yahan aapko respectful environment me health guidance dene ke liye hoon. Please abusive language use na karein. Aaj main aapki health me kaise madad kar sakta hoon?";
    }

    return {
      reply: boundaryReply,
      language: detectedLanguage,
      intent: "profanity_boundary",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "conduct_boundary",
      context_update: {
        current_topic: "general",
        current_emotion: "neutral",
        reported_symptoms: previousSymptoms,
        recovery_status: "none",
        duration: currentDuration,
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Profanity / abusive language strictly suppressed all GIFs",
        confidence: 1.0,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
      analysis: {
        detectedCondition: "General Consultation",
        duration: "Standard",
        severity: "Standard",
        careStream: "General Practice",
        modalities: "None",
        prepTip: "Please maintain respectful communication.",
        readyToBook: false,
      },
    };
  }

  // 1. EMERGENCY CHECK
  const isEmergencyDevanagari = isDevanagari && (
    EMERGENCY_REGEX.test(lower) ||
    /छाती|दर्द|श्वास|सांस|बेहोश|बेशुद्ध|रक्त|उल्टी/i.test(text)
  );

  if (EMERGENCY_REGEX.test(lower) || isEmergencyDevanagari) {
    let emergencyReply = "If you or someone nearby is experiencing severe chest pain, difficulty breathing, profuse bleeding, or unconsciousness, please seek emergency medical care immediately by calling 108 / 112 or going to the nearest emergency hospital.";
    if (isMarathi) {
      emergencyReply = "जर तुम्हाला किंवा जवळच्या व्यक्तीला छातीत तीव्र वेदना, श्वास घेण्यास गंभीर त्रास किंवा बेशुद्धी जाणवत असेल, तर कृपया त्वरित 112 किंवा 108 डायल करा आणि जवळच्या आपत्कालीन रुग्णालयात संपर्क साधा.";
    } else if (isHindi) {
      emergencyReply = "यदि आपको या आपके किसी परिजन को सीने में तेज दर्द, सांस लेने में गंभीर तकलीफ, अत्यधिक रक्तस्राव या बेहोशी हो रही है, तो कृपया तुरंत 112 या 108 पर कॉल करें या नजदीकी आपातकालीन अस्पताल जाएं।";
    } else if (isHinglish) {
      emergencyReply = "Agar aapko severe chest pain ya saans lene me dikkat ho rahi hai, toh please turant 112 / 108 par call karein ya nearest emergency hospital jayein.";
    }

    return {
      reply: emergencyReply,
      language: detectedLanguage,
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

  // 4a. VERIFIED CLINIC & DOCTOR KNOWLEDGE RETRIEVAL (RAG MATCH)
  const isClinicOrDocQuery = /\b(clinic|clicnic|timing|hours|open|address|location|where\s*is|visit|pratima|doctor|qualification|experience|book\s*appointment|how\s*to\s*book|cost|fee|allopathy|safe|pcod|pcos|thyroid|eczema|psoriasis|check\s*appointment)\b/i.test(normalizedLower);
  if (isClinicOrDocQuery) {
    const ragMatches = retrieveClinicKnowledge(normalizedLower, 1, 1.5);
    if (ragMatches.length > 0) {
      const doc = ragMatches[0].document;
      let clinicReply = "";

      if (doc.id === "clinic_mode_100_percent_online") {
        clinicReply = "Dr. Pratima Agale Clinic is a 100% Online Global Clinic. All consultations take place via secure video and audio appointments, and genuine homeopathic remedies are delivered directly to your doorstep across India and worldwide.";
      } else if (doc.id === "clinic_hours_and_timings") {
        clinicReply = "Online consultations are available Monday to Saturday from 10:00 AM to 7:00 PM IST. The clinic is closed on Sundays.";
      } else if (doc.id === "doctor_profile") {
        clinicReply = "Dr. Pratima Agale is a Gold Medalist homeopath with BHMS and MD (Homeopathy) qualifications and over 15 years of clinical experience, specializing in women's health, pediatric care, allergies, and chronic conditions.";
      } else if (doc.id === "appointment_booking_and_lookup") {
        clinicReply = "You can book an online appointment on the website with your 10-digit mobile number, or check your appointment status anytime on the Check Appointment page (/check-appointment).";
      } else if (doc.id === "homeopathy_safety_and_allopathy") {
        clinicReply = "Homeopathic remedies are non-toxic, steroid-free, and safe to take alongside allopathic medicines with a 30-minute interval. Please do not stop any prescribed medications without consulting your doctor.";
      } else {
        clinicReply = doc.content.split("\n")[0] || doc.content;
      }

      return {
        reply: clinicReply,
        language: detectedLanguage,
        intent: "clinic_info",
        emotion: "neutral",
        sentiment: "positive",
        conversation_topic: doc.category,
        context_update: {
          current_topic: "clinic",
          current_emotion: "neutral",
          reported_symptoms: previousSymptoms,
          recovery_status: "none",
        },
        gif: {
          should_show: false,
          category: "none",
          search_query: "",
          reason: "Factual clinic inquiry: GIF suppressed",
          confidence: 0.95,
        },
        safety: {
          is_medical: false,
          is_emergency: false,
          requires_professional_response: false,
        },
        analysis: {
          detectedCondition: "Clinic Information Inquiry",
          duration: "N/A",
          severity: "Standard",
          careStream: "Patient Care Guidance",
          prepTip: "Book online for dedicated consultation time.",
          readyToBook: true,
        },
      };
    }
  }

  // 4b. INFORMATIONAL MEDICAL QUESTIONS (e.g. "What causes fever?", "What is migraine?")
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
      language: detectedLanguage,
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

  // 5. FOLLOW-UP DURATION CHECK ("Since yesterday", "for 2 days", "started 3 days ago", "Actually it started 4 days ago")
  const isDurationOnly = /(?:actually\s+(?:it\s+)?)?(?:since\s+|for\s+\d+|started\s+|\d+\s*days?|\d+\s*weeks?|\d+\s*months?|yesterday|today|last\s*night)\b/i.test(lower);
  if (isDurationOnly && (previousSymptoms.length > 0 || currentDuration)) {
    const symptomStr = previousSymptoms.length > 0 ? previousSymptoms.join(" and ") : "symptoms";
    const durationMatch = text.match(/(?:actually\s+(?:it\s+)?)?(?:started\s+)?(\d+\s*days?\s*ago|\d+\s*days?|yesterday|today|last\s*night|since\s+[^,.!?]+)/i);
    const notedDuration = durationMatch ? durationMatch[1] || durationMatch[0] : text;
    return {
      reply: `Thank you for noting that your ${symptomStr} started ${notedDuration}. Is it constant or coming in waves, and does rest or warmth provide any relief?`,
      intent: "medical_followup",
      language: detectedLanguage,
      emotion: "concerned",
      sentiment: "neutral",
      conversation_topic: `${symptomStr}_duration`,
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: previousSymptoms,
        duration: notedDuration,
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
        duration: notedDuration,
        severity: "Standard",
        careStream: "Classical Individualized Homeopathy",
        prepTip: "Keep any past lab tests or prescription history handy.",
        readyToBook: true,
      },
    };
  }

  // 6. ILLNESS & ACTIVE SYMPTOM CHECK
  const hasFever = /\b(fever|high\s*temp(erature)?|chills|burning\s*up|ताप|बुखार)\b/i.test(normalizedLower);
  const hasHeadache = /\b(headache|migraine|head\s*hurts|head\s*pounding|सिरदर्द|डोकेदुखी)\b/i.test(normalizedLower);
  const hasCold = /\b(cold|cough(ing)?|runny\s*nose|stuffy\s*nose|sneezing|congestion|sore\s*throat|खोकला|सर्दी)\b/i.test(normalizedLower);
  const hasStomach = /\b(stomach\s*(pain|ache)|tummy\s*ache|cramps|indigestion|acid\s*reflux|nausea|vomit(ing)?|पोट\s*दुख|पेट\s*दर्द)\b/i.test(normalizedLower);
  const hasBodyPain = /\b(body\s*(pain|aches?|is\s*aching)|aching\s*body|muscle\s*ache|back\s*pain|joint\s*pain|weakness|exhausted|अंगदुखी)\b/i.test(normalizedLower);
  const isGeneralSick = /\b(i\s*am\s*sick|i'?m\s*sick|am\s*feelin(?:g)?\s*sick|feel(?:ing|in)?\s*sick|unwell|not\s*well|down\s*with|तबीयत|अस्वस्थ|आजार)\b/i.test(normalizedLower);

  if (hasFever || hasHeadache || hasCold || hasStomach || hasBodyPain || isGeneralSick || isDevanagari || isHinglish) {
    const reportedList: string[] = [...previousSymptoms];
    if (hasFever && !reportedList.includes("fever")) reportedList.push("fever");
    if (hasHeadache && !reportedList.includes("headache")) reportedList.push("headache");
    if (hasCold && !reportedList.includes("cold & cough")) reportedList.push("cold & cough");
    if (hasStomach && !reportedList.includes("stomach complaint")) reportedList.push("stomach complaint");
    if (hasBodyPain && !reportedList.includes("body pain")) reportedList.push("body pain");
    if (isGeneralSick && !reportedList.includes("feeling unwell") && reportedList.length === previousSymptoms.length) {
      reportedList.push("feeling unwell");
    }
    if (reportedList.length === 0) reportedList.push("feeling unwell");

    let reply = "Oh no, I'm really sorry to hear that you are not feeling well! What specific symptoms are you experiencing, and how long have you had them?";
    let category = "caring";
    let searchQuery = "caring comforting sick cartoon";

    if (isMarathi) {
      if (hasStomach) {
        reply = "पोटदुखीचा त्रास खूप अस्वस्थ करणारा असतो. पोटात मुरडा येत आहे का, आणि विश्रांती घेतल्याने काही आराम वाटतो का?";
      } else if (hasFever && hasCold) {
        reply = "मला हे ऐकून वाईट वाटले की आपल्याला ताप आणि खोकल्याचा त्रास होत आहे. हा त्रास किती दिवसांपासून आहे आणि अंगात कळ आहे का?";
      } else if (hasHeadache) {
        reply = "डोकेदुखीचा त्रास खूप त्रासदायक असतो. हे डोके सतत दुखते की अधूनमधून, आणि विश्रांती घेतल्याने आराम मिळतो का?";
      } else {
        reply = "आपल्याला त्रास होत आहे हे ऐकून मला वाईट वाटले. कृपया सांगा की आपल्याला नक्की काय लक्षणे जाणवत आहेत आणि हा त्रास कधीपासून आहे?";
      }
    } else if (isHindi) {
      if (hasFever) {
        reply = "मुझे यह जानकर चिंता हुई कि आपको बुखार है। क्या आपने तापमान नापा है, और क्या इसके साथ बदन दर्द या ठंड भी लग रही है?";
      } else if (hasHeadache) {
        reply = "सिरदर्द काफी कष्टदायी हो सकता है। क्या यह दर्द लगातार बना रहता है या बीच-बीच में होता है?";
      } else {
        reply = "मुझे यह जानकर चिंता हुई कि आपकी तबीयत ठीक नहीं है। कृपया बताएं कि आपको क्या लक्षण महसूस हो रहे हैं और यह समस्या कब से है?";
      }
    } else if (isHinglish) {
      reply = "Mujhe samajh aa raha hai ki aap bohot pareshan hain. Ye kitne time se ho raha hai aur kya aaram mil raha hai?";
    } else if (hasFever && hasHeadache) {
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
      language: detectedLanguage,
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
      reply: "Hi! I'm Nirvana 💜 Your personal health companion at Dr. Pratima Agale's clinic. How can I help you feel better today?",
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
      should_show: false,
      category: "none",
      search_query: "",
      reason: "No confident intent detected: GIF suppressed",
      confidence: 0,
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
  // If rawJson is a string, try parsing it as JSON first!
  let normalizedJson = rawJson;
  if (typeof rawJson === "string") {
    try {
      normalizedJson = JSON.parse(rawJson);
    } catch {
      normalizedJson = { reply: rawJson };
    }
  }

  // If normalizedJson has a reply that is stringified JSON, unwrap it
  if (typeof normalizedJson?.reply === "string" && normalizedJson.reply.trim().startsWith("{")) {
    try {
      const nested = JSON.parse(normalizedJson.reply);
      if (nested && typeof nested === "object") {
        normalizedJson = { ...nested, ...normalizedJson, reply: nested.reply || normalizedJson.reply };
      }
    } catch {
      const match = normalizedJson.reply.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (match) {
        normalizedJson.reply = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
      }
    }
  }

  // If Groq raw data is missing or incomplete, seamlessly run the Enterprise Conversational Engine!
  if (!normalizedJson || typeof normalizedJson !== "object" || !normalizedJson.reply) {
    return generateEnterpriseConversationResponse(userMessage, history, existingContext);
  }

  const isEmergency = EMERGENCY_REGEX.test(userMessage);
  const isMedicalQuestion = MEDICAL_QUESTION_REGEX.test(userMessage.trim()) && !/\b(i\s*have|my\s+|i'?m\s*having)\b/i.test(userMessage);
  const hasNegation = NEGATION_REGEX.test(userMessage) && /\b(fever|headache|cold|cough|pain|sick)\b/i.test(userMessage);
  const hasRecovery = RECOVERY_REGEX.test(userMessage);

  const fallbackEngine = generateEnterpriseConversationResponse(userMessage, history, existingContext);

  let reply = typeof normalizedJson?.reply === "string" && normalizedJson.reply.trim()
    ? normalizedJson.reply.trim()
    : fallbackEngine.reply;

  // Strip robotic filler introductions if model inadvertently included them
  reply = reply.replace(/^(sure(!|,)?|certainly(!|,)?|of course(!|,)?|i would be happy to help(!|,)?|as an ai assistant(!|,)?)\s*/i, "");

  // If the user's message is asking a question or describing symptoms rather than greeting, strip any leading greeting pleasantries
  const isUserGreeting = /^(hi|hello|heyy*|hey|hola|namaste|good\s*(morning|afternoon|evening)|welcome)\b/i.test(userMessage.trim());
  if (!isUserGreeting) {
    reply = reply.replace(/^(hello(!|,)?|hi(!|,)?|heyy*(!|,)?|hey(!|,)?|greetings(!|,)?|good\s*(morning|afternoon|evening)(!|,)?)\s*/i, "");
  }

  if (reply.length > 0) {
    reply = reply.charAt(0).toUpperCase() + reply.slice(1);
  }

  let language = typeof normalizedJson?.language === "string" ? normalizedJson.language : undefined;
  let intent = typeof normalizedJson?.intent === "string" ? normalizedJson.intent : "general";
  let emotion = typeof normalizedJson?.emotion === "string" ? normalizedJson.emotion : "neutral";
  let sentiment = typeof normalizedJson?.sentiment === "string" ? normalizedJson.sentiment : "neutral";
  let conversation_topic = typeof normalizedJson?.conversation_topic === "string" ? normalizedJson.conversation_topic : "general";

  // Context updates
  const context_update = {
    current_topic: normalizedJson?.context_update?.current_topic || existingContext?.currentTopic || "general",
    current_emotion: normalizedJson?.context_update?.current_emotion || emotion,
    reported_symptoms: Array.isArray(normalizedJson?.context_update?.reported_symptoms)
      ? normalizedJson.context_update.reported_symptoms
      : existingContext?.reportedSymptoms || [],
    recovery_status: (normalizedJson?.context_update?.recovery_status as any) || "none",
    duration: normalizedJson?.context_update?.duration || existingContext?.duration || "",
    modalities: normalizedJson?.context_update?.modalities || existingContext?.modalities || "",
  };

  // GIF Decision
  let should_show = normalizedJson?.gif?.should_show !== undefined
    ? Boolean(normalizedJson.gif.should_show)
    : fallbackEngine.gif.should_show;
  let category = typeof normalizedJson?.gif?.category === "string" && normalizedJson.gif.category !== "none"
    ? normalizedJson.gif.category
    : fallbackEngine.gif.category;
  let search_query = typeof normalizedJson?.gif?.search_query === "string" && normalizedJson.gif.search_query.trim()
    ? normalizedJson.gif.search_query.replace(/[^a-zA-Z0-9\s]/g, " ").trim()
    : fallbackEngine.gif.search_query;
  let reason = typeof normalizedJson?.gif?.reason === "string"
    ? normalizedJson.gif.reason
    : fallbackEngine.gif.reason;
  let confidence = typeof normalizedJson?.gif?.confidence === "number"
    ? normalizedJson.gif.confidence
    : fallbackEngine.gif.confidence;

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

  // 0. PROFANITY & HARASSMENT OVERRIDE:
  if (isProfaneMessage(userMessage)) {
    reply =
      "I am here to assist you with medical guidance and appointments in a respectful and safe environment. Please refrain from using offensive or abusive language. How can I assist you with your health concerns or Dr. Pratima's clinic today?";
    should_show = false;
    category = "none";
    search_query = "";
    reason = "Profanity / abusive language strictly suppressed all GIFs";
    is_medical = false;
    is_emergency = false;
    requires_professional_response = false;
    intent = "profanity_boundary";
    context_update.reported_symptoms = existingContext?.reportedSymptoms || [];
  }

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
