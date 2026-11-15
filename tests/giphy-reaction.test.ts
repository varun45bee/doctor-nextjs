import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  detectContextualReaction,
  isEmergencySituation,
  isInformationalMedicalQuestion,
  isSymptomNegated,
  isProfanity,
  fetchReactionGif,
} from "../lib/giphy/reactionDetector.ts";
import { getGiphyClient } from "../lib/giphy/giphyClient.ts";

describe("Context-Aware GIPHY Reaction & Safety Engine (30+ Scenarios)", () => {
  // 1. GREETINGS & WELCOME
  it("Scenario 1: Triggers funny/cute waving for 'Hi'", () => {
    const r = detectContextualReaction("Hi");
    assert.equal(r?.categoryId, "greeting");
    assert.match(r?.query || "", /waving/i);
  });

  it("Scenario 2: Triggers greeting for 'Hello Dr. Pratima'", () => {
    const r = detectContextualReaction("Hello Dr. Pratima");
    assert.equal(r?.categoryId, "greeting");
  });

  it("Scenario 3: Triggers greeting for 'Heyy there'", () => {
    const r = detectContextualReaction("heyy there");
    assert.equal(r?.categoryId, "greeting");
  });

  // 2. TIME-OF-DAY GREETINGS
  it("Scenario 4: Triggers morning greeting for 'Good morning'", () => {
    const r = detectContextualReaction("Good morning doctor!");
    assert.equal(r?.categoryId, "time_of_day");
    assert.equal(r?.subType, "morning");
    assert.match(r?.query || "", /morning/i);
  });

  it("Scenario 5: Triggers evening greeting for 'Good evening'", () => {
    const r = detectContextualReaction("Good evening!");
    assert.equal(r?.categoryId, "time_of_day");
    assert.equal(r?.subType, "evening");
  });

  // 3. ILLNESS & SYMPTOMS REPORTS
  it("Scenario 6: Triggers caring sick reaction for 'I have fever'", () => {
    const r = detectContextualReaction("I have fever");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "fever");
    assert.match(r?.query || "", /caring sick/i);
  });

  it("Scenario 7: Triggers sympathetic reaction for 'I have headache'", () => {
    const r = detectContextualReaction("I have headache");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "headache");
    assert.match(r?.query || "", /headache/i);
  });

  it("Scenario 8: Triggers gentle reaction for cold & cough", () => {
    const r = detectContextualReaction("I caught a bad cold and cough");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "cold_cough");
  });

  it("Scenario 9: Triggers comforting reaction for stomach pain", () => {
    const r = detectContextualReaction("Severe stomach ache and cramps");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "stomach_pain");
  });

  it("Scenario 10: Triggers rest reaction for body pain", () => {
    const r = detectContextualReaction("My whole body is aching today");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "body_pain");
  });

  it("Scenario 11: Triggers healing reaction for nausea and dizziness", () => {
    const r = detectContextualReaction("Feeling dizzy and nauseous");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "nausea_dizziness");
  });

  // 4. NEGATED SYMPTOMS (Should NOT show sick GIF)
  it("Scenario 12: Suppresses sick GIF for 'I don't have fever'", () => {
    const r = detectContextualReaction("I don't have fever");
    assert.equal(r, null);
  });

  it("Scenario 13: Suppresses sick GIF for 'No headache today'", () => {
    const r = detectContextualReaction("No headache today");
    assert.equal(r, null);
  });

  it("Scenario 14: Suppresses sick GIF for 'I do not have cold'", () => {
    const r = detectContextualReaction("I do not have cold");
    assert.equal(r, null);
  });

  // 5. PAST SYMPTOMS & RECOVERY
  it("Scenario 15: Triggers happy recovery for 'My fever is gone'", () => {
    const r = detectContextualReaction("My fever is gone");
    assert.equal(r?.categoryId, "recovery");
    assert.match(r?.query || "", /feeling better|recovery/i);
  });

  it("Scenario 16: Triggers recovery for 'Headache is gone'", () => {
    const r = detectContextualReaction("Headache is gone");
    assert.equal(r?.categoryId, "recovery");
  });

  it("Scenario 17: Triggers recovery for 'I am feeling much better now'", () => {
    const r = detectContextualReaction("I am feeling much better now");
    assert.equal(r?.categoryId, "recovery");
  });

  // 6. EMOTIONAL CONVERSATIONS
  it("Scenario 18: Triggers comforting hug for 'I'm feeling lonely'", () => {
    const r = detectContextualReaction("I'm feeling lonely");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "lonely");
    assert.match(r?.query || "", /hug/i);
  });

  it("Scenario 19: Triggers comforting hug for 'I am crying'", () => {
    const r = detectContextualReaction("I am crying");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "sad");
  });

  it("Scenario 20: Triggers calm soothing GIF for 'So stressed with work'", () => {
    const r = detectContextualReaction("So stressed with work");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "stressed");
  });

  it("Scenario 21: Triggers dancing happy GIF for 'I'm happy'", () => {
    const r = detectContextualReaction("I'm happy");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "happy");
    assert.match(r?.query || "", /dancing|celebration/i);
  });

  it("Scenario 22: Triggers entertaining GIF for 'I'm bored'", () => {
    const r = detectContextualReaction("I'm bored");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "bored");
  });

  it("Scenario 23: Triggers cozy rest GIF for 'So tired, need sleep'", () => {
    const r = detectContextualReaction("So tired, need sleep");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "tired");
  });

  // 7. CONTEXTUAL PRIORITY & MIXED INPUTS
  it("Scenario 24: Emotion + Symptom Priority: 'I am scared of fever' -> comforting GIF", () => {
    const r = detectContextualReaction("I am scared of fever");
    assert.equal(r?.categoryId, "emotion");
    assert.equal(r?.subType, "comforting_fear");
    assert.match(r?.query || "", /comforting hug/i);
  });

  it("Scenario 25: Illness + Laughing Priority: 'I have fever 😂' -> caring GIF, not laughing", () => {
    const r = detectContextualReaction("I have fever 😂");
    assert.equal(r?.categoryId, "illness");
    assert.equal(r?.subType, "fever");
    assert.doesNotMatch(r?.query || "", /laughing/i);
  });

  it("Scenario 26: Recovery + Happy: 'I am happy because my headache is gone' -> recovery GIF", () => {
    const r = detectContextualReaction("I am happy because my headache is gone");
    assert.equal(r?.categoryId, "recovery");
  });

  // 8. INFORMATIONAL MEDICAL QUESTIONS (Default to NO GIF)
  it("Scenario 27: Medical question 'What causes fever?' -> NO GIF", () => {
    const isQuestion = isInformationalMedicalQuestion("What causes fever?");
    assert.equal(isQuestion, true);
    assert.equal(detectContextualReaction("What causes fever?"), null);
  });

  it("Scenario 28: Medical question 'Why do people get migraines?' -> NO GIF", () => {
    assert.equal(detectContextualReaction("Why do people get migraines?"), null);
  });

  it("Scenario 29: Medical question 'Can cold cause headache?' -> NO GIF", () => {
    assert.equal(detectContextualReaction("Can cold cause headache?"), null);
  });

  // 9. EMERGENCIES (Strict Medical Safety Rule)
  it("Scenario 30: Emergency 'Severe chest pain' -> STRICTLY NULL", () => {
    assert.equal(isEmergencySituation("Severe chest pain"), true);
    assert.equal(detectContextualReaction("Severe chest pain"), null);
  });

  it("Scenario 31: Emergency 'Shortness of breath and breathless' -> STRICTLY NULL", () => {
    assert.equal(detectContextualReaction("Shortness of breath, I am breathless"), null);
  });

  it("Scenario 32: Emergency 'Patient is unconscious' -> STRICTLY NULL", () => {
    assert.equal(detectContextualReaction("Patient is unconscious after fainting"), null);
  });

  it("Scenario 33: Emergency 'Vomiting blood' -> STRICTLY NULL", () => {
    assert.equal(detectContextualReaction("Emergency, vomiting blood!"), null);
  });

  // 10. CASUAL HUMOR & APPRECIATION
  it("Scenario 34: Casual humor 'haha that is hilarious' -> humor GIF", () => {
    const r = detectContextualReaction("haha that is hilarious");
    assert.equal(r?.categoryId, "humor");
  });

  it("Scenario 35: Appreciation 'Thank you so much' -> appreciation GIF", () => {
    const r = detectContextualReaction("Thank you so much Dr. Pratima!");
    assert.equal(r?.categoryId, "appreciation");
    assert.match(r?.query || "", /thank you/i);
  });

  // 11. FITNESS, LIFESTYLE & FAREWELL
  it("Scenario 36: Fitness 'Going to the gym today' -> fitness GIF", () => {
    const r = detectContextualReaction("Going to the gym for my workout");
    assert.equal(r?.categoryId, "fitness");
  });

  it("Scenario 37: Farewell 'Goodbye, take care' -> farewell GIF", () => {
    const r = detectContextualReaction("Goodbye, take care!");
    assert.equal(r?.categoryId, "farewell");
    assert.match(r?.query || "", /goodbye/i);
  });

  // 12. GIPHY CLIENT RESILIENCE & API FAILURE HANDLING
  it("Scenario 38: GIPHY client safely handles empty or invalid environment without throwing", async () => {
    const res = await fetchReactionGif("test query");
    // Handles gracefully by returning null or cached data
    assert.ok(res === null || typeof res === "object");
  });

  // 13. PROFANITY & CONDUCT ZERO-TOLERANCE (STRICTLY NULL)
  it("Scenario 39: Profanity 'fuck you' strictly returns NULL", () => {
    assert.equal(detectContextualReaction("fuck you"), null);
    assert.equal(isProfanity("fuck you"), true);
  });

  it("Scenario 40: Profanity 'stfu' strictly returns NULL", () => {
    assert.equal(detectContextualReaction("stfu"), null);
  });

  it("Scenario 41: Masked profanity 'f*ck' strictly returns NULL", () => {
    assert.equal(detectContextualReaction("f*ck this"), null);
  });

  it("Scenario 42: Hindi profanity 'madarchod' strictly returns NULL", () => {
    assert.equal(detectContextualReaction("madarchod"), null);
  });

  // =========================================================================
  // 14. SPECIFICATION TEST SUITE (EXACT 7 REQUIRED EVALUATION SCENARIOS)
  // =========================================================================
  describe("Specification Test Suite: Repetition Prevention & Strict Intent Matching", () => {
    it("Spec 1: Send 'hi' 10 times: greeting GIFs only, with NO immediate repeats", async () => {
      const convId = "conv_spec_test_hi_10";
      const servedGifs: any[] = [];
      const historyIds: string[] = [];

      for (let i = 0; i < 10; i++) {
        // Step 1: Detect intent
        const intent = detectContextualReaction("hi");
        assert.ok(intent, "Intent must be detected for 'hi'");
        assert.equal(intent.categoryId, "greeting");

        // Step 2: Fetch non-repeating GIF with conversation history
        const gif = await fetchReactionGif(intent.categoryId, {
          conversationId: convId,
          recentGifIds: historyIds,
        });

        assert.ok(gif, `Turn ${i + 1} must return a valid GIF`);
        assert.ok(gif.images?.fixed_width?.url, `Turn ${i + 1} must have a valid URL`);

        servedGifs.push(gif);
        historyIds.push(String(gif.id));

        // Step 3: Verify NO IMMEDIATE REPEAT (adjacent GIF IDs must never match)
        if (i > 0) {
          const prevId = servedGifs[i - 1].id;
          const currId = gif.id;
          assert.notEqual(
            currId,
            prevId,
            `Turn ${i + 1} (${currId}) must not immediately repeat Turn ${i} (${prevId})`
          );
        }
      }

      // Step 4: Verify diversity: multiple distinct GIF IDs served across 10 turns
      const distinctIds = new Set(servedGifs.map((g) => g.id));
      assert.ok(
        distinctIds.size >= 4,
        `Expected at least 4 distinct GIFs across 10 turns, got ${distinctIds.size}`
      );
    });

    it("Spec 2: Send 'hi', then 'thank you': second response must use an appreciation GIF", async () => {
      const intent1 = detectContextualReaction("hi");
      assert.equal(intent1?.categoryId, "greeting");
      const gif1 = await fetchReactionGif(intent1.categoryId);
      assert.ok(gif1);

      const intent2 = detectContextualReaction("thank you");
      assert.equal(intent2?.categoryId, "appreciation");
      const gif2 = await fetchReactionGif(intent2.categoryId, {
        recentGifIds: [String(gif1.id)],
      });
      assert.ok(gif2);
      assert.notEqual(gif1.id, gif2.id);
    });

    it("Spec 3: Send 'hi', then 'I have a headache': only a headache-support GIF is eligible", async () => {
      const intent1 = detectContextualReaction("hi");
      assert.equal(intent1?.categoryId, "greeting");

      const intent2 = detectContextualReaction("I have a headache");
      assert.ok(intent2);
      assert.equal(intent2.categoryId, "illness");
      assert.equal(intent2.subType, "headache");
      assert.match(intent2.query, /headache/i);

      const gif = await fetchReactionGif(intent2.subType);
      assert.ok(gif);
      assert.match(gif.title.toLowerCase(), /headache|rest|pillow|sympathy|soothing/i);
    });

    it("Spec 4: Send 'I don't have a headache': NO headache GIF", () => {
      const res = detectContextualReaction("I don't have a headache");
      assert.equal(res, null, "Negated symptom must strictly return null");
    });

    it("Spec 5: Ask 'What causes a headache?': NO GIF", () => {
      const res = detectContextualReaction("What causes a headache?");
      assert.equal(res, null, "Medical inquiry question must strictly return null");
    });

    it("Spec 6: Send an emergency message: NO GIF", () => {
      const res = detectContextualReaction("Emergency! Severe chest pain radiating to left arm!");
      assert.equal(res, null, "Medical emergency must strictly return null");
    });

    it("Spec 7: Send an unrelated message: NO GIF", () => {
      const res1 = detectContextualReaction("The sky is blue today");
      assert.equal(res1, null, "Unrelated statement must return null");

      const res2 = detectContextualReaction("What is 15 multiplied by 4?");
      assert.equal(res2, null, "Non-clinical math question must return null");

      const res3 = detectContextualReaction("I am shopping for a new car");
      assert.equal(res3, null, "Random shopping text must return null");
    });
  });
});
