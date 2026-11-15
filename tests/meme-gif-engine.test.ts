import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  detectContextualMemeReaction,
  detectContextualReaction,
  isEmergencySituation,
  isInformationalMedicalQuestion,
  isSymptomNegated,
  isProfanity,
  isSensitiveMedicalSituation,
  fetchReactionGif,
  resolveReactionCategory,
} from "../lib/giphy/reactionDetector.ts";
import {
  getConversationRecentGifIds,
  recordConversationRecentGifId,
} from "../lib/giphy/gifPersistence.ts";
import {
  CURATED_CATEGORY_POOLS,
  selectGifFromPool,
  type ReactionCategory,
} from "../lib/giphy/categoryPools.ts";
import {
  generateEnterpriseConversationResponse,
  validateAndSanitizeGroqResponse,
} from "../lib/ai/conversationContext.ts";

describe("Context-Aware Meme GIF Engine (60+ Varied Scenarios)", () => {
  // =========================================================================
  // 1. GREETINGS & TIME-OF-DAY (5 Scenarios)
  // =========================================================================
  describe("1. Greetings & Time-of-Day", () => {
    it("1.1: Triggers greeting for 'Hey there, how are you doing?'", () => {
      const r = detectContextualMemeReaction("Hey there, how are you doing?");
      assert.equal(r?.categoryId, "greeting");
      assert.equal(r?.subType, "greeting");
    });

    it("1.2: Triggers greeting for 'Hello assistant!'", () => {
      const r = detectContextualMemeReaction("Hello assistant!");
      assert.equal(r?.categoryId, "greeting");
    });

    it("1.3: Triggers morning greeting for 'Good morning sunshine!'", () => {
      const r = detectContextualMemeReaction("Good morning sunshine!");
      assert.equal(r?.categoryId, "time_of_day");
      assert.equal(r?.subType, "morning");
    });

    it("1.4: Triggers afternoon greeting for 'Good afternoon!'", () => {
      const r = detectContextualMemeReaction("Good afternoon!");
      assert.equal(r?.categoryId, "time_of_day");
      assert.equal(r?.subType, "afternoon");
    });

    it("1.5: Triggers evening greeting for 'Good evening everyone!'", () => {
      const r = detectContextualMemeReaction("Good evening everyone!");
      assert.equal(r?.categoryId, "time_of_day");
      assert.equal(r?.subType, "evening");
    });
  });

  // =========================================================================
  // 2. QUESTIONS & THINKING (3 Scenarios)
  // =========================================================================
  describe("2. Questions & Thinking", () => {
    it("2.1: Triggers thinking meme for 'Hmm let me think about that for a second'", () => {
      const r = detectContextualMemeReaction("Hmm let me think about that for a second");
      assert.equal(r?.categoryId, "question");
      assert.equal(r?.subType, "thinking");
      assert.match(r?.query || "", /thinking|curious|confused/i);
    });

    it("2.2: Triggers question meme for 'I am really confused and puzzled by this explanation'", () => {
      const r = detectContextualMemeReaction("I am really confused and puzzled by this explanation");
      assert.equal(r?.categoryId, "question");
      assert.equal(r?.subType, "thinking");
    });

    it("2.3: Triggers thinking meme for 'Scratching my head wondering how this happened'", () => {
      const r = detectContextualMemeReaction("Scratching my head wondering how this happened");
      assert.equal(r?.categoryId, "question");
    });
  });

  // =========================================================================
  // 3. LEARNING & MIND BLOWN (3 Scenarios)
  // =========================================================================
  describe("3. Learning & Mind Blown", () => {
    it("3.1: Triggers mind blown reaction for 'Mind blown! That makes so much sense now'", () => {
      const r = detectContextualMemeReaction("Mind blown! That makes so much sense now");
      assert.equal(r?.categoryId, "learning");
      assert.equal(r?.subType, "mind_blown");
      assert.match(r?.query || "", /mind blown/i);
    });

    it("3.2: Triggers insight reaction for 'Eureka! That is a brilliant insight'", () => {
      const r = detectContextualMemeReaction("Eureka! That is a brilliant insight");
      assert.equal(r?.categoryId, "learning");
    });

    it("3.3: Triggers understanding reaction for 'Now I understand it completely, learned something new'", () => {
      const r = detectContextualMemeReaction("Now I understand it completely, learned something new");
      assert.equal(r?.categoryId, "learning");
    });
  });

  // =========================================================================
  // 4. TECHNOLOGY & CODING (4 Scenarios)
  // =========================================================================
  describe("4. Technology & Coding Humor", () => {
    it("4.1: Triggers developer meme for 'Debugging code all night and finally found the bug'", () => {
      const r = detectContextualMemeReaction("Debugging code all night and finally found the bug");
      assert.equal(r?.categoryId, "technology");
      assert.equal(r?.subType, "coding");
      assert.match(r?.query || "", /programmer|coding|debugging/i);
    });

    it("4.2: Triggers coding reaction for 'My React TypeScript code had a syntax error'", () => {
      const r = detectContextualMemeReaction("My React TypeScript code had a syntax error");
      assert.equal(r?.categoryId, "technology");
    });

    it("4.3: Triggers developer humor for 'Programmer life: git merge conflicts everywhere'", () => {
      const r = detectContextualMemeReaction("Programmer life: git merge conflicts everywhere");
      assert.equal(r?.categoryId, "technology");
    });

    it("4.4: Triggers software meme for 'Writing python scripts for automation'", () => {
      const r = detectContextualMemeReaction("Writing python scripts for automation");
      assert.equal(r?.categoryId, "technology");
    });
  });

  // =========================================================================
  // 5. SUCCESS & CELEBRATION (3 Scenarios)
  // =========================================================================
  describe("5. Success & Celebration", () => {
    it("5.1: Triggers victory celebration for 'We did it! Huge victory today!'", () => {
      const r = detectContextualMemeReaction("We did it! Huge victory today!");
      assert.equal(r?.categoryId, "success");
      assert.equal(r?.subType, "victory");
      assert.match(r?.query || "", /celebration|victory/i);
    });

    it("5.2: Triggers celebration for 'Passed my exam, nailed it!'", () => {
      const r = detectContextualMemeReaction("Passed my exam, nailed it!");
      assert.equal(r?.categoryId, "success");
    });

    it("5.3: Triggers winner meme for 'Celebration time, we won the championship!'", () => {
      const r = detectContextualMemeReaction("Celebration time, we won the championship!");
      assert.equal(r?.categoryId, "success");
    });
  });

  // =========================================================================
  // 6. FAILURE & FACEPALM (3 Scenarios)
  // =========================================================================
  describe("6. Failure & Facepalm", () => {
    it("6.1: Triggers facepalm meme for 'Facepalm... what was I thinking'", () => {
      const r = detectContextualMemeReaction("Facepalm... what was I thinking");
      assert.equal(r?.categoryId, "failure");
      assert.equal(r?.subType, "facepalm");
      assert.match(r?.query || "", /facepalm|disappointed/i);
    });

    it("6.2: Triggers mistake reaction for 'Total disaster, epic fail on my part'", () => {
      const r = detectContextualMemeReaction("Total disaster, epic fail on my part");
      assert.equal(r?.categoryId, "failure");
    });

    it("6.3: Triggers disappointment for 'Big mistake, I completely messed up'", () => {
      const r = detectContextualMemeReaction("Big mistake, I completely messed up");
      assert.equal(r?.categoryId, "failure");
    });
  });

  // =========================================================================
  // 7. HUMOR & LAUGHTER (3 Scenarios)
  // =========================================================================
  describe("7. Humor & Laughter", () => {
    it("7.1: Triggers humor for 'Haha that is hilarious!'", () => {
      const r = detectContextualMemeReaction("Haha that is hilarious!");
      assert.equal(r?.categoryId, "humor");
      assert.equal(r?.subType, "humor");
    });

    it("7.2: Triggers laughter for 'Lmao I cannot stop laughing'", () => {
      const r = detectContextualMemeReaction("Lmao I cannot stop laughing");
      assert.equal(r?.categoryId, "humor");
    });

    it("7.3: Triggers funny reaction for 'That joke cracked me up, rofl'", () => {
      const r = detectContextualMemeReaction("That joke cracked me up, rofl");
      assert.equal(r?.categoryId, "humor");
    });
  });

  // =========================================================================
  // 8. SURPRISE & SHOCK (3 Scenarios)
  // =========================================================================
  describe("8. Surprise & Shock", () => {
    it("8.1: Triggers shocked reaction for 'Shocked! My jaw literally dropped'", () => {
      const r = detectContextualMemeReaction("Shocked! My jaw literally dropped");
      assert.equal(r?.categoryId, "surprise");
      assert.equal(r?.subType, "shocked");
      assert.match(r?.query || "", /shocked|unbelievable/i);
    });

    it("8.2: Triggers shock for 'Unbelievable, no way that actually happened!'", () => {
      const r = detectContextualMemeReaction("Unbelievable, no way that actually happened!");
      assert.equal(r?.categoryId, "surprise");
    });

    it("8.3: Triggers stunned reaction for 'I am completely stunned and speechless'", () => {
      const r = detectContextualMemeReaction("I am completely stunned and speechless");
      assert.equal(r?.categoryId, "surprise");
    });
  });

  // =========================================================================
  // 9. APPRECIATION & WHOLESOME (3 Scenarios)
  // =========================================================================
  describe("9. Appreciation & Gratitude", () => {
    it("9.1: Triggers appreciation for 'Thank you so much, I really appreciate it!'", () => {
      const r = detectContextualMemeReaction("Thank you so much, I really appreciate it!");
      assert.equal(r?.categoryId, "appreciation");
      assert.equal(r?.subType, "appreciation");
    });

    it("9.2: Triggers appreciation for 'Thanks for being so wonderful and kind'", () => {
      const r = detectContextualMemeReaction("Thanks for being so wonderful and kind");
      assert.equal(r?.categoryId, "appreciation");
    });

    it("9.3: Triggers gratitude for 'Tysm, truly grateful for your help'", () => {
      const r = detectContextualMemeReaction("Tysm, truly grateful for your help");
      assert.equal(r?.categoryId, "appreciation");
    });
  });

  // =========================================================================
  // 10. AGREEMENT & THUMBS UP (3 Scenarios)
  // =========================================================================
  describe("10. Agreement & Approval", () => {
    it("10.1: Triggers agreement for 'Totally agree with you, 100%!'", () => {
      const r = detectContextualMemeReaction("Totally agree with you, 100%!");
      assert.equal(r?.categoryId, "agreement");
      assert.equal(r?.subType, "nodding");
      assert.match(r?.query || "", /nodding|thumbs up/i);
    });

    it("10.2: Triggers thumbs up for 'Thumbs up, couldn't agree more'", () => {
      const r = detectContextualMemeReaction("Thumbs up, couldn't agree more");
      assert.equal(r?.categoryId, "agreement");
    });

    it("10.3: Triggers agreement for 'Spot on, exactly right!'", () => {
      const r = detectContextualMemeReaction("Spot on, exactly right!");
      assert.equal(r?.categoryId, "agreement");
    });
  });

  // =========================================================================
  // 11. DISAGREEMENT & SKEPTICAL (3 Scenarios)
  // =========================================================================
  describe("11. Disagreement & Skeptical", () => {
    it("11.1: Triggers skeptical reaction for 'I am skeptical about that, sounds sus'", () => {
      const r = detectContextualMemeReaction("I am skeptical about that, sounds sus");
      assert.equal(r?.categoryId, "disagreement");
      assert.equal(r?.subType, "skeptical");
      assert.match(r?.query || "", /skeptical|side eye/i);
    });

    it("11.2: Triggers side eye for 'Side eye... press X to doubt'", () => {
      const r = detectContextualMemeReaction("Side eye... press X to doubt");
      assert.equal(r?.categoryId, "disagreement");
    });

    it("11.3: Triggers doubt for 'I don't buy it, highly suspicious'", () => {
      const r = detectContextualMemeReaction("I don't buy it, highly suspicious");
      assert.equal(r?.categoryId, "disagreement");
    });
  });

  // =========================================================================
  // 12. MOTIVATION & DETERMINATION (3 Scenarios)
  // =========================================================================
  describe("12. Motivation & Energy", () => {
    it("12.1: Triggers motivation for 'Let's go! We got this!'", () => {
      const r = detectContextualMemeReaction("Let's go! We got this!");
      assert.equal(r?.categoryId, "motivation");
      assert.equal(r?.subType, "determined");
      assert.match(r?.query || "", /determined|lets go/i);
    });

    it("12.2: Triggers determination for 'Stay strong and never give up, hustle mode!'", () => {
      const r = detectContextualMemeReaction("Stay strong and never give up, hustle mode!");
      assert.equal(r?.categoryId, "motivation");
    });

    it("12.3: Triggers energy for 'Push through, feeling unstoppable!'", () => {
      const r = detectContextualMemeReaction("Push through, feeling unstoppable!");
      assert.equal(r?.categoryId, "motivation");
    });
  });

  // =========================================================================
  // 13. SADNESS & COMFORTING SUPPORT (3 Scenarios)
  // =========================================================================
  describe("13. Sadness & Wholesome Comfort", () => {
    it("13.1: Triggers comforting support for 'I am feeling so sad and heartbroken today'", () => {
      const r = detectContextualMemeReaction("I am feeling so sad and heartbroken today");
      assert.equal(r?.categoryId, "emotion");
      assert.equal(r?.subType, "sad");
      assert.match(r?.query || "", /comforting|hug/i);
    });

    it("13.2: Triggers hug for 'I'm crying and feeling lonely'", () => {
      const r = detectContextualMemeReaction("I'm crying and feeling lonely");
      assert.equal(r?.categoryId, "emotion");
      assert.equal(r?.subType, "lonely");
    });

    it("13.3: Triggers comforting support for 'Feeling blue and down'", () => {
      const r = detectContextualMemeReaction("Feeling blue and down");
      assert.equal(r?.categoryId, "emotion");
    });
  });

  // =========================================================================
  // 14. STRESS & CALMING RELIEF (3 Scenarios)
  // =========================================================================
  describe("14. Stress & Calming Relief", () => {
    it("14.1: Triggers calming breath for 'So stressed and overwhelmed with deadlines'", () => {
      const r = detectContextualMemeReaction("So stressed and overwhelmed with deadlines");
      assert.equal(r?.categoryId, "emotion");
      assert.equal(r?.subType, "stressed");
      assert.match(r?.query || "", /calm|breath/i);
    });

    it("14.2: Triggers relaxation for 'Need to relax, feeling frantic and anxious'", () => {
      const r = detectContextualMemeReaction("Need to relax, feeling frantic and anxious");
      assert.equal(r?.categoryId, "emotion");
    });

    it("14.3: Triggers calming support for 'Need a break to calm down and breathe'", () => {
      const r = detectContextualMemeReaction("Need a break to calm down and breathe");
      assert.equal(r?.categoryId, "emotion");
    });
  });

  // =========================================================================
  // 15. FITNESS & WORKOUT (3 Scenarios)
  // =========================================================================
  describe("15. Fitness & Workout", () => {
    it("15.1: Triggers fitness meme for 'Going to the gym for a heavy workout'", () => {
      const r = detectContextualMemeReaction("Going to the gym for a heavy workout");
      assert.equal(r?.categoryId, "fitness");
      assert.equal(r?.subType, "fitness");
    });

    it("15.2: Triggers fitness reaction for 'Finished my cardio running exercise'", () => {
      const r = detectContextualMemeReaction("Finished my cardio running exercise");
      assert.equal(r?.categoryId, "fitness");
    });

    it("15.3: Triggers active lifestyle for 'Drinking water and staying hydrated'", () => {
      const r = detectContextualMemeReaction("Drinking water and staying hydrated");
      assert.equal(r?.categoryId, "fitness");
    });
  });

  // =========================================================================
  // 16. FOOD & DINING (3 Scenarios)
  // =========================================================================
  describe("16. Food & Dining Cravings", () => {
    it("16.1: Triggers food reaction for 'I am so hungry, craving delicious pizza'", () => {
      const r = detectContextualMemeReaction("I am so hungry, craving delicious pizza");
      assert.equal(r?.categoryId, "food");
      assert.equal(r?.subType, "delicious");
      assert.match(r?.query || "", /hungry|delicious|chef/i);
    });

    it("16.2: Triggers chef reaction for 'Chef kiss! That meal was so yummy and tasty'", () => {
      const r = detectContextualMemeReaction("Chef kiss! That meal was so yummy and tasty");
      assert.equal(r?.categoryId, "food");
    });

    it("16.3: Triggers mouth watering reaction for 'Starving, time to cook dinner'", () => {
      const r = detectContextualMemeReaction("Starving, time to cook dinner");
      assert.equal(r?.categoryId, "food");
    });
  });

  // =========================================================================
  // 17. TRAVEL & VACATION (3 Scenarios)
  // =========================================================================
  describe("17. Travel & Vacation", () => {
    it("17.1: Triggers travel reaction for 'Packing bags for an exciting vacation!'", () => {
      const r = detectContextualMemeReaction("Packing bags for an exciting vacation!");
      assert.equal(r?.categoryId, "travel");
      assert.equal(r?.subType, "vacation");
      assert.match(r?.query || "", /travel|vacation|adventure/i);
    });

    it("17.2: Triggers road trip reaction for 'Road trip adventure starts tomorrow!'", () => {
      const r = detectContextualMemeReaction("Road trip adventure starts tomorrow!");
      assert.equal(r?.categoryId, "travel");
    });

    it("17.3: Triggers flight reaction for 'Boarding pass ready for my holiday flight!'", () => {
      const r = detectContextualMemeReaction("Boarding pass ready for my holiday flight!");
      assert.equal(r?.categoryId, "travel");
    });
  });

  // =========================================================================
  // 18. GOODBYE & FAREWELL (3 Scenarios)
  // =========================================================================
  describe("18. Goodbye & Farewell", () => {
    it("18.1: Triggers farewell for 'Goodbye, see you tomorrow!'", () => {
      const r = detectContextualMemeReaction("Goodbye, see you tomorrow!");
      assert.equal(r?.categoryId, "farewell");
      assert.equal(r?.subType, "farewell");
    });

    it("18.2: Triggers farewell for 'Take care, good night and sweet dreams!'", () => {
      const r = detectContextualMemeReaction("Take care, good night and sweet dreams!");
      assert.equal(r?.categoryId, "farewell");
    });

    it("18.3: Triggers farewell for 'Bye for now, cya later!'", () => {
      const r = detectContextualMemeReaction("Bye for now, cya later!");
      assert.equal(r?.categoryId, "farewell");
    });
  });

  // =========================================================================
  // 19. GENTLE CLINICAL SYMPTOM DISCLOSURES (5 Scenarios)
  // =========================================================================
  describe("19. Gentle Medical Symptom Disclosures", () => {
    it("19.1: Headache symptom disclosure triggers gentle headache support", () => {
      const r = detectContextualMemeReaction("I have a terrible throbbing headache");
      assert.equal(r?.categoryId, "illness");
      assert.equal(r?.subType, "headache");
      assert.match(r?.query || "", /headache/i);
    });

    it("19.2: Fever symptom disclosure triggers caring thermometer reaction", () => {
      const r = detectContextualMemeReaction("Running a high fever with chills");
      assert.equal(r?.categoryId, "illness");
      assert.equal(r?.subType, "fever");
    });

    it("19.3: Cold and cough symptom disclosure triggers warm caring reaction", () => {
      const r = detectContextualMemeReaction("Severe cold and sneezing non stop");
      assert.equal(r?.categoryId, "illness");
      assert.equal(r?.subType, "cold_cough");
    });

    it("19.4: Stomach ache disclosure triggers gentle comforting reaction", () => {
      const r = detectContextualMemeReaction("My stomach ache and cramps are painful");
      assert.equal(r?.categoryId, "illness");
      assert.equal(r?.subType, "stomach_pain");
    });

    it("19.5: Body pain disclosure triggers rest reaction", () => {
      const r = detectContextualMemeReaction("My back pain and body aches hurt");
      assert.equal(r?.categoryId, "illness");
      assert.equal(r?.subType, "body_pain");
    });
  });

  // =========================================================================
  // 20. SENSITIVE & DISTRESSING SITUATIONS (STRICTLY SUPPRESSED - 5 Scenarios)
  // =========================================================================
  describe("20. Sensitive & Distressing Situation Suppression", () => {
    it("20.1: Death and bereavement strictly returns NULL", () => {
      assert.equal(isSensitiveMedicalSituation("My grandmother passed away yesterday, we are grieving"), true);
      assert.equal(detectContextualMemeReaction("My grandmother passed away yesterday, we are grieving"), null);
    });

    it("20.2: Terminal cancer diagnosis strictly returns NULL", () => {
      assert.equal(isSensitiveMedicalSituation("Patient was diagnosed with malignant terminal cancer"), true);
      assert.equal(detectContextualMemeReaction("Patient was diagnosed with malignant terminal cancer"), null);
    });

    it("20.3: Pregnancy loss / miscarriage strictly returns NULL", () => {
      assert.equal(isSensitiveMedicalSituation("She had a heartbreaking miscarriage and lost the baby"), true);
      assert.equal(detectContextualMemeReaction("She had a heartbreaking miscarriage and lost the baby"), null);
    });

    it("20.4: ICU / critical ventilator condition strictly returns NULL", () => {
      assert.equal(isSensitiveMedicalSituation("Father is admitted in the ICU on a ventilator in critical condition"), true);
      assert.equal(detectContextualMemeReaction("Father is admitted in the ICU on a ventilator in critical condition"), null);
    });

    it("20.5: Severe clinical depression / hopelessness strictly returns NULL", () => {
      assert.equal(isSensitiveMedicalSituation("Suffering from severe depression and feeling hopeless"), true);
      assert.equal(detectContextualMemeReaction("Suffering from severe depression and feeling hopeless"), null);
    });
  });

  // =========================================================================
  // 21. MEDICAL EMERGENCY SUPPRESSION (STRICTLY SUPPRESSED - 4 Scenarios)
  // =========================================================================
  describe("21. Medical Emergency Suppression", () => {
    it("21.1: Severe chest pain strictly returns NULL", () => {
      assert.equal(isEmergencySituation("Emergency severe chest pain radiating down left arm"), true);
      assert.equal(detectContextualMemeReaction("Emergency severe chest pain radiating down left arm"), null);
    });

    it("21.2: Unconscious patient strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("Patient is unconscious and not breathing"), null);
    });

    it("21.3: Profuse hemorrhaging strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("Profuse hemorrhaging and coughing blood"), null);
    });

    it("21.4: Chemical poisoning overdose strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("Accidental chemical poisoning overdose"), null);
    });
  });

  // =========================================================================
  // 22. INFORMATIONAL MEDICAL QUESTION SUPPRESSION (3 Scenarios)
  // =========================================================================
  describe("22. Informational Medical Question Suppression", () => {
    it("22.1: 'What causes migraine headaches?' strictly returns NULL", () => {
      assert.equal(isInformationalMedicalQuestion("What causes migraine headaches?"), true);
      assert.equal(detectContextualMemeReaction("What causes migraine headaches?"), null);
    });

    it("22.2: 'What is the medical definition of fever?' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("What is the medical definition of fever?"), null);
    });

    it("22.3: 'Why do people get cold and flu?' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("Why do people get cold and flu?"), null);
    });
  });

  // =========================================================================
  // 23. NEGATED SYMPTOM SUPPRESSION (3 Scenarios)
  // =========================================================================
  describe("23. Negated Symptom Suppression", () => {
    it("23.1: 'I don't have a fever today' strictly returns NULL", () => {
      assert.equal(isSymptomNegated("I don't have a fever today", "fever"), true);
      assert.equal(detectContextualMemeReaction("I don't have a fever today"), null);
    });

    it("23.2: 'No headache right now' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("No headache right now"), null);
    });

    it("23.3: 'Free from cold and cough' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("Free from cold and cough"), null);
    });
  });

  // =========================================================================
  // 24. CONDUCT & PROFANITY SUPPRESSION (3 Scenarios)
  // =========================================================================
  describe("24. Conduct & Profanity Suppression", () => {
    it("24.1: 'fuck you stupid bot' strictly returns NULL", () => {
      assert.equal(isProfanity("fuck you stupid bot"), true);
      assert.equal(detectContextualMemeReaction("fuck you stupid bot"), null);
    });

    it("24.2: 'stfu and go away' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("stfu and go away"), null);
    });

    it("24.3: 'bitch shut up' strictly returns NULL", () => {
      assert.equal(detectContextualMemeReaction("bitch shut up"), null);
    });
  });

  // =========================================================================
  // 25. LOW CONFIDENCE / NEUTRAL / NON-CLINICAL SUPPRESSION (4 Scenarios)
  // =========================================================================
  describe("25. Low Confidence / Neutral Suppression", () => {
    it("25.1: 'The sky is blue today' returns NULL (no forced GIF)", () => {
      assert.equal(detectContextualMemeReaction("The sky is blue today"), null);
    });

    it("25.2: 'What is 15 multiplied by 4?' returns NULL", () => {
      assert.equal(detectContextualMemeReaction("What is 15 multiplied by 4?"), null);
    });

    it("25.3: 'I am shopping for a new car' returns NULL", () => {
      assert.equal(detectContextualMemeReaction("I am shopping for a new car"), null);
    });

    it("25.4: 'There are three chairs in the meeting room' returns NULL", () => {
      assert.equal(detectContextualMemeReaction("There are three chairs in the meeting room"), null);
    });
  });

  // =========================================================================
  // 26. MULTI-TURN CONTEXT INDEPENDENCE (3 Scenarios)
  // =========================================================================
  describe("26. Multi-Turn Context Independence", () => {
    it("26.1: Turn 2 neutral statement does NOT inherit Turn 1 headache intent", () => {
      const history = [{ role: "user", content: "I have a headache" }];
      const res = detectContextualMemeReaction("The sky is blue today", { history });
      assert.equal(res, null, "Turn 1 intent must never leak into Turn 2");
    });

    it("26.2: Turn 2 thank-you message resolves as appreciation, not Turn 1 greeting", () => {
      const history = [{ role: "user", content: "Hi" }];
      const res = detectContextualMemeReaction("Thank you so much", { history });
      assert.equal(res?.categoryId, "appreciation");
      assert.equal(res?.subType, "appreciation");
    });

    it("26.3: Turn 2 coding reaction resolves as technology, not Turn 1 illness", () => {
      const history = [{ role: "user", content: "I have fever" }];
      const res = detectContextualMemeReaction("Now I am debugging my react code", { history });
      assert.equal(res?.categoryId, "technology");
    });
  });

  // =========================================================================
  // 27. NON-REPEATING ROTATION VERIFICATION (15 Consecutive Turns)
  // =========================================================================
  describe("27. Repetition Prevention & History Rotation", () => {
    it("27.1: 15 consecutive requests in 'success' category never produce adjacent repeats", async () => {
      const convId = "conv_test_meme_success_15";
      const servedGifs: any[] = [];
      const historyIds: string[] = [];

      for (let i = 0; i < 15; i++) {
        const gif = await fetchReactionGif("success", {
          conversationId: convId,
          recentGifIds: historyIds,
        });

        assert.ok(gif, `Turn ${i + 1} must return a GIF`);
        assert.ok(gif.images?.fixed_width?.url, `Turn ${i + 1} must have a valid URL`);

        servedGifs.push(gif);
        historyIds.push(String(gif.id));

        if (i > 0) {
          const prevId = servedGifs[i - 1].id;
          const currId = gif.id;
          assert.notEqual(
            currId,
            prevId,
            `Turn ${i + 1} (${currId}) must not repeat Turn ${i} (${prevId})`
          );
        }
      }

      const distinctIds = new Set(servedGifs.map((g) => g.id));
      assert.ok(distinctIds.size >= 3, `Expected at least 3 distinct GIFs, got ${distinctIds.size}`);
    });
  });

  // =========================================================================
  // 28. FIRESTORE PERSISTENCE STATE VERIFICATION
  // =========================================================================
  describe("28. Conversation GIF Persistence State", () => {
    it("28.1: Persists and deduplicates recent GIF history correctly", async () => {
      const convId = "conv_persist_test_42";
      const id1 = "gif_first_1";
      const id2 = "gif_second_2";

      const updated1 = await recordConversationRecentGifId(convId, id1, []);
      assert.ok(updated1.includes(id1));

      const updated2 = await recordConversationRecentGifId(convId, id2, updated1);
      assert.ok(updated2.includes(id1));
      assert.ok(updated2.includes(id2));

      const retrieved = await getConversationRecentGifIds(convId, [id1, id2]);
      assert.ok(retrieved.includes(id1));
      assert.ok(retrieved.includes(id2));
    });
  });

  // =========================================================================
  // 29. FIRST-MESSAGE-ONLY GIF RULE (AFTER THAT DON'T SHOW)
  // =========================================================================
  describe("29. First-Message-Only GIF Rule", () => {
    it("29.1: Turn 1 'hi' (first message, empty history) allows GIF", () => {
      const res = generateEnterpriseConversationResponse("hi", []);
      assert.equal(res.gif.should_show, true);
      assert.equal(res.gif.category, "greeting");
    });

    it("29.2: Turn 2 (with prior user message in history) strictly suppresses GIF", () => {
      const history = [
        { role: "user", content: "hi" },
        { role: "assistant", content: "Hello! How can I help you today?" },
        { role: "user", content: "i have a headache" },
      ];
      const res = generateEnterpriseConversationResponse("i have a headache", history);
      assert.equal(res.gif.should_show, false);
      assert.equal(res.gif.category, "none");
      assert.match(res.gif.reason, /Subsequent conversation turn/i);
    });

    it("29.3: Turn 3 (multiple prior turns in history) strictly suppresses GIF", () => {
      const history = [
        { role: "user", content: "hi" },
        { role: "assistant", content: "Hello!" },
        { role: "user", content: "i have a headache" },
        { role: "assistant", content: "I see, how long has it been?" },
        { role: "user", content: "thank you for your help" },
      ];
      const res = generateEnterpriseConversationResponse("thank you for your help", history);
      assert.equal(res.gif.should_show, false);
      assert.equal(res.gif.category, "none");
    });

    it("29.4: validateAndSanitizeGroqResponse on Turn 2 sanitizes should_show to false", () => {
      const history = [
        { role: "user", content: "hi" },
        { role: "assistant", content: "Hello!" },
        { role: "user", content: "thank you so much" },
      ];
      const raw = {
        reply: "You are welcome!",
        gif: {
          should_show: true, // model attempted to show GIF on turn 2
          category: "appreciation",
          search_query: "cute thank you",
          reason: "Gratitude",
          confidence: 0.95,
        },
      };
      const sanitized = validateAndSanitizeGroqResponse(raw, "thank you so much", undefined, history);
      assert.equal(sanitized.gif.should_show, false);
      assert.equal(sanitized.gif.category, "none");
      assert.match(sanitized.gif.reason, /Subsequent conversation turn/i);
    });

    it("29.5: Multi-turn history with prior user messages strictly suppresses GIF in generator and validator", () => {
      const history = [
        { role: "user", content: "hi" },
        { role: "assistant", content: "Hello!" },
        { role: "user", content: "hello again" },
      ];
      const res = generateEnterpriseConversationResponse("hello again", history);
      assert.equal(res.gif.should_show, false);
      assert.equal(res.gif.category, "none");

      const raw = {
        reply: "Hello again!",
        gif: {
          should_show: true,
          category: "greeting",
          search_query: "waving hi",
          reason: "Greeting",
          confidence: 0.95,
        },
      };
      const sanitized = validateAndSanitizeGroqResponse(raw, "hello again", undefined, history);
      assert.equal(sanitized.gif.should_show, false);
      assert.equal(sanitized.gif.category, "none");
    });
  });
});

