export async function sendStatusEmail(
  to: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM;
  const fromName = process.env.EMAIL_FROM_NAME || "Your Clinic";

  if (!apiKey || !from) {
    return {
      success: false,
      error:
        "Email not configured. Please set BREVO_API_KEY, EMAIL_FROM and EMAIL_FROM_NAME.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: fromName,
          email: from,
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: `
          <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333;">
            ${message}
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo Error:", data);

      return {
        success: false,
        error:
          data?.message ||
          data?.code ||
          "Failed to send email.",
      };
    }

    console.log("Email sent successfully:", data);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Email Error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send email.",
    };
  }
}