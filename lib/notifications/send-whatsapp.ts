export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<{ success: boolean; data?: unknown; error?: unknown }> {
  const response = await fetch(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("WhatsApp send error:", data);
    return { success: false, error: data };
  }

  return { success: true, data };
}