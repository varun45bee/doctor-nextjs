import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const conversationHistory = Array.isArray(history) ? history : [];

    const systemPrompt = `You are CuraAI, the empathetic, expert clinical intake assistant for Dr. Pratima Agale (BHMS, MD Homeopathy).
Your job is to conduct a personalized homeopathic clinical intake by asking 1-2 thoughtful questions to help prepare the patient's case history:
1. Symptoms & Sensations: exact nature of the complaint (e.g., throbbing headache, irregular cycles, dry skin, fatigue).
2. Modalities (Homeopathy Core): what makes the symptoms better or worse (e.g. cold, warmth, stress, morning, evening, food).
3. Duration & Prior Treatments: how long this has persisted and any medicines taken.

Rules:
- Introduce yourself warmly as CuraAI if greeting the patient.
- Be respectful, caring, and encouraging.
- Ask ONE focused question at a time so the patient is never overwhelmed.
- Keep replies brief (1-3 conversational sentences max).
- Never diagnose or prescribe medicines.
- Always respond in valid JSON matching this exact schema:
{
  "reply": "Warm 1-2 sentence response with your next question or guidance.",
  "analysis": {
    "detectedCondition": "PCOD / PCOS | Thyroid Disorder | Arthritis | Migraines | Child Immunity | Skin & Hair | Digestive | Other",
    "duration": "e.g. 6 months, 2 years, or 'Recent'",
    "severity": "Mild | Moderate | Chronic",
    "careStream": "e.g. Women's Constitutional Care | Neurological Care | Pediatric Gentle Care",
    "modalities": "e.g. Aggravated by stress/cold; relieved by rest",
    "prepTip": "Practical advice for their appointment (e.g. keep past blood tests or prescription history ready)"
  }
}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-8),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages,
        temperature: 0.35,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        reply: "Hello, I am CuraAI. Thank you for explaining your symptoms. How long have you been experiencing this, and does anything make it feel better or worse?",
        analysis: {
          detectedCondition: "Classical Homeopathy Consultation",
          duration: "Noted",
          severity: "Moderate",
          careStream: "Constitutional Case Management",
          modalities: "To be evaluated during consultation",
          prepTip: "Please keep your recent medical reports and prescriptions ready for Dr. Pratima.",
        },
      });
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({
      reply: parsed.reply || "Thank you. Let's schedule your appointment with Dr. Pratima.",
      analysis: parsed.analysis || {
        detectedCondition: "Classical Homeopathy Consultation",
        duration: "Noted",
        severity: "Moderate",
        careStream: "Constitutional Case Management",
        modalities: "To be evaluated",
        prepTip: "Keep any past lab tests ready for your visit.",
      },
    });
  } catch (err) {
    console.error("CuraAI route error:", err);
    return NextResponse.json({
      reply: "Thank you for sharing your symptoms. Please proceed to select a convenient date and time to meet Dr. Pratima.",
      analysis: {
        detectedCondition: "Clinical Consultation",
        duration: "Noted",
        severity: "Standard",
        careStream: "Constitutional Homeopathy",
        modalities: "General",
        prepTip: "Keep your previous medical history ready.",
      },
    });
  }
}

