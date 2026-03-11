import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function callGemini(systemPrompt, messages) {

  // Ensure messages array
  if (!Array.isArray(messages)) {
    messages = [{ role: "user", content: String(messages) }];
  }

  // Clean invalid messages
  messages = messages.filter(
    (m) => m && typeof m.content === "string"
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt
  });

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Gemini requires first message to be user
  if (contents.length === 0 || contents[0].role !== "user") {
    contents.unshift({
      role: "user",
      parts: [{ text: "Hello" }]
    });
  }

  const result = await model.generateContent({
    contents
  });

  return result.response.text();
}