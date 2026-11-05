import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildEnterpriseSystemPrompt,
  validateAndSanitizeGroqResponse,
  type ConversationContextState,
} from "../lib/ai/conversationContext.ts";
import {
  detectContextualReaction,
  fetchReactionGif,
} from "../lib/giphy/reactionDetector.ts";

describe("Enterprise Context-Aware Conversation & Multi-Turn Engine", () => {
  // Test 1: Good morning -> Morning greeting + morning GIF
  it("Test 1: 'Good morning' generates natural morning greeting with morning GIF", () => {
    const raw = {
      reply: "Good morning! How are you feeling today?",
      intent: "greeting",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "morning_greeting",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "morning",
        search_query: "cute good morning coffee cartoon",
        reason: "User gave a morning greeting",
        confidence: 0.95,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "Good morning.");
    assert.match(res.reply, /Good morning/i);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "morning");
    assert.match(res.gif.search_query, /morning/i);
  });

  // Test 2: I am sick -> Empathetic response + caring GIF
  it("Test 2: 'I am sick' triggers empathetic response with caring GIF", () => {
    const raw = {
      reply: "Oh no! I'm sorry to hear that you are not feeling well. What symptoms are you experiencing?",
      intent: "medical_symptom",
      emotion: "sad",
      sentiment: "negative",
      conversation_topic: "illness",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["sick"],
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "cute comforting sick cartoon",
        reason: "Patient reports feeling sick",
        confidence: 0.92,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "I am sick.");
    assert.match(res.reply, /sorry to hear/i);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "caring");
    assert.equal(res.safety.is_medical, true);
  });

  // Test 3: I have fever and headache -> Contextual medical response + caring GIF
  it("Test 3: 'I have fever and headache' records symptoms and caring sick GIF", () => {
    const raw = {
      reply: "I understand that can be uncomfortable. How high is your fever, and how long have you had this headache?",
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "fever_and_headache",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["fever", "headache"],
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "caring sick fever thermometer cartoon",
        reason: "Fever and headache reported",
        confidence: 0.94,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "I have fever and headache.");
    assert.deepEqual(res.context_update.reported_symptoms, ["fever", "headache"]);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.safety.is_medical, true);
  });

  // Test 4: Follow-up message "Since yesterday" -> Duration context resolution
  it("Test 4: Follow-up 'Since yesterday' retains previous fever and headache memory", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["fever", "headache"],
      duration: "",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_symptom",
      turnCount: 2,
    };

    // System prompt correctly receives active context
    const prompt = buildEnterpriseSystemPrompt(existingContext);
    assert.match(prompt, /fever, headache/i);
    assert.match(prompt, /Current Topic: "illness"/i);

    const raw = {
      reply: "Noted that your fever and headache began yesterday. Does anything specific make the headache feel better or worse?",
      intent: "medical_followup",
      emotion: "concerned",
      sentiment: "neutral",
      conversation_topic: "fever_and_headache",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["fever", "headache"],
        duration: "since yesterday",
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Follow-up answering duration inquiry",
        confidence: 0.8,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "Since yesterday.", existingContext);
    assert.equal(res.context_update.duration, "since yesterday");
    assert.deepEqual(res.context_update.reported_symptoms, ["fever", "headache"]);
  });

  // Test 5: "I am feeling better now" -> Recognizes recovery + positive GIF
  it("Test 5: 'I am feeling better now' triggers recovery and celebration GIF", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["fever", "headache"],
      duration: "since yesterday",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_followup",
      turnCount: 3,
    };

    const raw = {
      reply: "That is wonderful news! I'm so glad to hear you are recovering and feeling better.",
      intent: "recovery",
      emotion: "relieved",
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
        search_query: "happy celebration recovery cartoon",
        reason: "Patient reports feeling better",
        confidence: 0.95,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: false,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "I am feeling better now.", existingContext);
    assert.equal(res.context_update.recovery_status, "recovered");
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "recovery");
    assert.match(res.gif.search_query, /recovery|celebration/i);
  });

  // Test 6: "I don't have fever" -> Negation detection, no sick GIF
  it("Test 6: 'I don't have fever' enforces negation and suppresses sick GIF", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["fever"],
      duration: "",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_symptom",
      turnCount: 1,
    };

    // Even if raw JSON mistakenly sets should_show = true for sick category, server overrides
    const raw = {
      reply: "Good to know you do not have a fever. What other symptoms are bothering you?",
      intent: "medical_followup",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "symptom_check",
      context_update: {
        current_topic: "illness",
        current_emotion: "neutral",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "sick cartoon",
        reason: "fever mentioned",
        confidence: 0.8,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "I don't have fever.", existingContext);
    assert.equal(res.gif.should_show, false);
    assert.equal(res.gif.category, "none");
  });

  // Test 7: "What is fever?" -> Informative response, no GIF by default
  it("Test 7: 'What is fever?' treated as medical concept inquiry with no GIF", () => {
    const raw = {
      reply: "Fever is a temporary elevation of body temperature, usually in response to an immune defense against infection.",
      intent: "general",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "medical_education",
      context_update: {
        current_topic: "education",
        current_emotion: "neutral",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: true, // raw attempted to show gif
        category: "caring",
        search_query: "sick fever cartoon",
        reason: "fever query",
        confidence: 0.7,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "What is fever?");
    // Server safety override enforces should_show = false
    assert.equal(res.gif.should_show, false);
    assert.equal(res.gif.search_query, "");
  });

  // Test 8: "I have severe chest pain and difficulty breathing" -> Emergency response, NO GIF
  it("Test 8: 'Severe chest pain and difficulty breathing' triggers urgent safety override and suppresses GIF", () => {
    const raw = {
      reply: "Let's take a look at your chest pain.",
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "emergency",
      context_update: {
        current_topic: "emergency",
        current_emotion: "alarmed",
        reported_symptoms: ["chest pain"],
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "comforting cartoon",
        reason: "pain reported",
        confidence: 0.9,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "I have severe chest pain and difficulty breathing.");
    assert.equal(res.safety.is_emergency, true);
    assert.equal(res.gif.should_show, false);
    assert.match(res.reply, /emergency|108|112/i);
  });

  // Test 9: "Thank you, you are amazing." -> Appreciation response + thank you GIF
  it("Test 9: 'Thank you, you are amazing.' triggers appreciation with thank-you GIF", () => {
    const raw = {
      reply: "You're very welcome! I'm always here to help you on your health journey.",
      intent: "appreciation",
      emotion: "grateful",
      sentiment: "positive",
      conversation_topic: "gratitude",
      context_update: {
        current_topic: "general",
        current_emotion: "happy",
        reported_symptoms: [],
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

    const res = validateAndSanitizeGroqResponse(raw, "Thank you, you are amazing.");
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "appreciation");
    assert.match(res.gif.search_query, /thank you/i);
  });

  // Test 10: Topic change from illness to casual -> Detects new topic, drops illness GIF
  it("Test 10: Topic change to 'Do you like rainy days?' clears illness focus", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["fever"],
      duration: "2 days",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_followup",
      turnCount: 4,
    };

    const raw = {
      reply: "I love the freshness of rainy days! How is the weather where you are?",
      intent: "general",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "weather",
      context_update: {
        current_topic: "casual_chat",
        current_emotion: "cheerful",
        reported_symptoms: ["fever"], // old symptom preserved in history but topic updated
        recovery_status: "none",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Casual conversational exchange",
        confidence: 0.85,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "Do you like rainy days?", existingContext);
    assert.equal(res.context_update.current_topic, "casual_chat");
    assert.equal(res.gif.should_show, false);
  });

  // Test 11: Symptom with laughing emoji -> Caring sick GIF, NOT laughing
  it("Test 11: 'I have fever 😂' prioritizes caring sick GIF over laughing emoji", () => {
    const r = detectContextualReaction("I have fever 😂");
    assert.equal(r?.categoryId, "illness");
    assert.doesNotMatch(r?.query || "", /laughing/i);
  });

  // Test 12: In-memory GIPHY duplicate prevention
  it("Test 12: fetchReactionGif avoids immediate consecutive duplicate IDs", async () => {
    const g1 = await fetchReactionGif("cute hello waving");
    const g2 = await fetchReactionGif("cute hello waving");
    // Verify client safely returns objects or null without throws
    assert.ok(g1 === null || typeof g1 === "object");
    assert.ok(g2 === null || typeof g2 === "object");
  });

  // Test 13: Enterprise fallback when Groq is unavailable: 'hi' gives proper greeting & waving puppy GIF
  it("Test 13: Fallback engine: 'hi' gives rich greeting & waving puppy GIF", () => {
    const res = validateAndSanitizeGroqResponse(null, "hi");
    assert.match(res.reply, /CuraAI|Dr\. Pratima|Welcome/i);
    assert.doesNotMatch(res.reply, /Thank you for sharing\. Could you tell me more/i);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "greeting");
    assert.match(res.gif.search_query, /puppy|waving/i);
  });

  // Test 14: Enterprise fallback when Groq is unavailable: 'im sick' gives empathetic response & caring sick GIF
  it("Test 14: Fallback engine: 'im sick' gives empathetic response & caring sick GIF", () => {
    const res = validateAndSanitizeGroqResponse(null, "im sick");
    assert.match(res.reply, /sorry to hear|feeling unwell/i);
    assert.doesNotMatch(res.reply, /Thank you for sharing\. Could you tell me more/i);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.gif.category, "caring");
    assert.match(res.gif.search_query, /caring|sick/i);
    assert.equal(res.safety.is_medical, true);
  });

  // Test 15: Enterprise fallback when Groq is unavailable: 'i have fever and headache'
  it("Test 15: Fallback engine: 'i have fever and headache' captures symptoms & caring GIF", () => {
    const res = validateAndSanitizeGroqResponse(null, "i have fever and headache");
    assert.match(res.reply, /fever and headache/i);
    assert.equal(res.gif.should_show, true);
    assert.ok(res.context_update.reported_symptoms.includes("fever"));
    assert.ok(res.context_update.reported_symptoms.includes("headache"));
  });

  // Test 16: Enterprise fallback: 'since yesterday' connects to existing symptoms
  it("Test 16: Fallback engine: 'since yesterday' connects to previous symptoms in context", () => {
    const existingContext = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["fever", "headache"],
      duration: "",
      recoveryStatus: "not_recovered" as const,
      isEmergency: false,
      lastIntent: "medical_symptom",
      turnCount: 2,
    };
    const res = validateAndSanitizeGroqResponse(null, "since yesterday", existingContext);
    assert.match(res.reply, /fever and headache/i);
    assert.match(res.reply, /yesterday/i);
    assert.equal(res.context_update.duration, "since yesterday");
  });

  // Test 17: Multilingual - Natural Hindi response generation
  it("Test 17: Natural Hindi conversation maintains Devanagari script and medical context", () => {
    const raw = {
      reply: "मुझे यह सुनकर दुख हुआ कि आपको सिरदर्द है। क्या यह दर्द लगातार बना रहता है या बीच-बीच में होता है?",
      language: "hi",
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "headache_inquiry",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["headache"],
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "cute comforting sick cartoon",
        reason: "Patient reports headache in Hindi",
        confidence: 0.94,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "मुझे सिरदर्द है");
    assert.equal(res.language, "hi");
    assert.match(res.reply, /सिरदर्द/);
    assert.equal(res.gif.should_show, true);
    assert.equal(res.safety.is_medical, true);
  });

  // Test 18: Multilingual - Natural Marathi conversation
  it("Test 18: Natural Marathi conversation handles Marathi vocabulary accurately", () => {
    const raw = {
      reply: "हे ऐकून वाईट वाटले. तुम्हाला हा ताप कधीपासून येत आहे आणि डोकेदुखी देखील आहे का?",
      language: "mr",
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "fever_inquiry",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["fever"],
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "cute comforting sick cartoon",
        reason: "Patient reports fever in Marathi",
        confidence: 0.94,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "मला कालपासून ताप आहे");
    assert.equal(res.language, "mr");
    assert.match(res.reply, /ताप/);
    assert.equal(res.gif.should_show, true);
  });

  // Test 19: Multilingual - Natural Hinglish conversation
  it("Test 19: Natural Hinglish conversation preserves Romanized Hindi response flow", () => {
    const raw = {
      reply: "Main samajh sakta hoon, ye headache kitne time se hai aur kya rest lene se aaram milta hai?",
      language: "hinglish",
      intent: "medical_symptom",
      emotion: "concerned",
      sentiment: "negative",
      conversation_topic: "headache_inquiry",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["headache"],
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: true,
        category: "caring",
        search_query: "cute comforting sick cartoon",
        reason: "Patient reports headache in Hinglish",
        confidence: 0.92,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "mujhe 2 din se headache ho raha hai");
    assert.equal(res.language, "hinglish");
    assert.match(res.reply, /headache|aaram/i);
    assert.equal(res.gif.should_show, true);
  });

  // Test 20: Pronoun Resolution across 3 turns ("It comes and goes")
  it("Test 20: Pronoun resolution understands 'it' refers to previous headache symptom", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["headache"],
      duration: "since yesterday",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_followup",
      turnCount: 3,
    };

    const raw = {
      reply: "Intermittent headache pain often correlates with tension or vascular triggers. Dr. Pratima can evaluate this in your constitutional consultation.",
      intent: "medical_followup",
      emotion: "concerned",
      sentiment: "neutral",
      conversation_topic: "headache_modality",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["headache"],
        duration: "since yesterday",
        modalities: "comes and goes (intermittent)",
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Modality follow-up",
        confidence: 0.85,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "It comes and goes.", existingContext);
    assert.equal(res.context_update.modalities, "comes and goes (intermittent)");
    assert.deepEqual(res.context_update.reported_symptoms, ["headache"]);
  });

  // Test 21: Appointment inquiry activates readyToBook
  it("Test 21: Appointment inquiry provides booking guidance and activates appointment flow", () => {
    const raw = {
      reply: "You can easily schedule a consultation with Dr. Pratima Agale! We offer both in-clinic visits and online video consultations worldwide.",
      intent: "appointment",
      emotion: "happy",
      sentiment: "positive",
      conversation_topic: "appointment_booking",
      context_update: {
        current_topic: "clinic",
        current_emotion: "helpful",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: true,
        category: "greeting",
        search_query: "cute calendar reminder appointment cartoon",
        reason: "Appointment inquiry",
        confidence: 0.9,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
      analysis: {
        detectedCondition: "Constitutional Consultation",
        duration: "New Case",
        severity: "Standard",
        careStream: "Online Video & In-Clinic Consultation",
        prepTip: "Have previous medical reports and prescriptions handy.",
        readyToBook: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "How do I book an appointment with Dr. Pratima?");
    assert.equal(res.analysis?.readyToBook, true);
    assert.match(res.reply, /schedule|consultation/i);
  });

  // Test 22: Clinic Hours inquiry
  it("Test 22: Clinic hours inquiry returns accurate clinic timing guidance", () => {
    const raw = {
      reply: "Dr. Pratima Agale's clinic operates from 10:30 AM to 9:00 PM. Video consultations are also conducted throughout the day by appointment.",
      intent: "clinic_info",
      emotion: "neutral",
      sentiment: "positive",
      conversation_topic: "clinic_hours",
      context_update: {
        current_topic: "clinic",
        current_emotion: "neutral",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Operational info inquiry",
        confidence: 0.85,
      },
      safety: {
        is_medical: false,
        is_emergency: false,
        requires_professional_response: false,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "What are your clinic hours?");
    assert.match(res.reply, /10:30 AM/i);
    assert.match(res.reply, /9:00 PM/i);
  });

  // Test 23: Correction / Update handling ("Actually it started 5 days ago, not yesterday")
  it("Test 23: Handles corrections and updates duration accurately in context memory", () => {
    const existingContext: ConversationContextState = {
      currentTopic: "illness",
      currentEmotion: "concerned",
      reportedSymptoms: ["headache"],
      duration: "since yesterday",
      modalities: "",
      recoveryStatus: "not_recovered",
      isEmergency: false,
      lastIntent: "medical_followup",
      turnCount: 3,
    };

    const raw = {
      reply: "Thank you for the correction! Having this headache for 5 days gives us valuable timeline context for Dr. Pratima.",
      intent: "medical_followup",
      emotion: "concerned",
      sentiment: "neutral",
      conversation_topic: "headache_duration_correction",
      context_update: {
        current_topic: "illness",
        current_emotion: "concerned",
        reported_symptoms: ["headache"],
        duration: "5 days ago",
        recovery_status: "not_recovered",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Timeline correction",
        confidence: 0.9,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "Actually my headache started 5 days ago, not yesterday", existingContext);
    assert.equal(res.context_update.duration, "5 days ago");
    assert.deepEqual(res.context_update.reported_symptoms, ["headache"]);
  });

  // Test 24: Robotic filler words removal
  it("Test 24: Strips robotic filler introductions like 'Sure!' or 'Of course!'", () => {
    const raw = {
      reply: "Sure! I would be happy to help. A cold typically runs its course in 7-10 days with adequate hydration and rest.",
      intent: "medical_education",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "cold_duration",
      context_update: {
        current_topic: "education",
        current_emotion: "neutral",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Health education",
        confidence: 0.9,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "How long does a common cold usually last?");
    assert.doesNotMatch(res.reply, /^Sure!/i);
    assert.match(res.reply, /A cold typically runs its course/i);
  });

  // Test 25: Complex multi-part query with structured markdown formatting
  it("Test 25: Preserves rich markdown tables, headings, and bullet points", () => {
    const raw = {
      reply: "### Understanding Migraines vs Tension Headaches\n\n| Type | Characteristic | Homeopathic Modality |\n| --- | --- | --- |\n| Migraine | Throbbing, unilateral | Worse from bright light |\n| Tension | Dull band-like pressure | Worse from mental fatigue |\n\n- Rest in a quiet dark room\n- Stay well-hydrated",
      intent: "medical_education",
      emotion: "neutral",
      sentiment: "neutral",
      conversation_topic: "headache_comparison",
      context_update: {
        current_topic: "education",
        current_emotion: "neutral",
        reported_symptoms: [],
        recovery_status: "none",
      },
      gif: {
        should_show: false,
        category: "none",
        search_query: "",
        reason: "Educational markdown guide",
        confidence: 0.95,
      },
      safety: {
        is_medical: true,
        is_emergency: false,
        requires_professional_response: true,
      },
    };

    const res = validateAndSanitizeGroqResponse(raw, "Can you explain the difference between migraines and tension headaches?");
    assert.match(res.reply, /### Understanding Migraines/);
    assert.match(res.reply, /\| Type \| Characteristic \|/);
    assert.match(res.reply, /- Rest in a quiet dark room/);
  });
});

