import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function callGroq(systemPrompt, messages) {

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

    max_tokens: 1024,
    temperature: 0.4,

    messages: [
      { role: "system", content: systemPrompt },

      ...(Array.isArray(messages)
        ? messages.map((m) => ({
            role: m.role || "user",
            content: m.content || "",
          }))
        : [{ role: "user", content: String(messages) }]),
    ],
  });

  return completion.choices?.[0]?.message?.content || "";
}