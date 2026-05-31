export async function sendStatusEmail(
  to: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      success: false,
      error: "Email not configured (set RESEND_API_KEY and EMAIL_FROM)",
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg =
        typeof data.message === "string" ? data.message : "Email send failed";
      console.error("Resend error:", data);
      return { success: false, error: errMsg };
    }

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Email send failed";
    console.error("Email error:", msg);
    return { success: false, error: msg };
  }
}
