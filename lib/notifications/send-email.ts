export async function sendStatusEmail(
  to: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM?.trim();
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Your Clinic";

  if (!apiKey || !from) {
    return {
      success: false,
      error:
        "Email not configured. Please set BREVO_API_KEY, EMAIL_FROM and EMAIL_FROM_NAME.",
    };
  }

  try {
    console.log("EMAIL_FROM value:", JSON.stringify(from));
    console.log("EMAIL_FROM_NAME value:", JSON.stringify(fromName));

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#2f4a3d; padding: 28px 40px; text-align:center;">
              <div style="color:#ffffff; font-size: 22px; font-weight: 600; letter-spacing: 0.5px;">
                Dr. Pratima Agale
              </div>
              <div style="color:#c9d8cf; font-size: 13px; margin-top: 4px;">
                Homeopathy Clinic
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 15px; line-height: 1.7; color: #333333;">
                ${message}
              </div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="border-top: 1px solid #e8e8e8;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align:center;">
              <div style="font-size: 13px; color: #888888; line-height: 1.6;">
                <strong style="color:#2f4a3d;">Dr. Pratima Agale's Homeopathy Clinic</strong><br>
                📞 +91 93598 75511 &nbsp;|&nbsp; 🌐 <a href="https://www.pratimaagale.in/" style="color:#3f6b56; text-decoration:none;">www.pratimaagale.in</a>
              </div>
              <div style="font-size: 11px; color: #bbbbbb; margin-top: 16px;">
                This is an automated message from Dr. Pratima Agale's Clinic. Please do not reply directly to this email.
              </div>
              <div style="font-size: 11px; color: #bbbbbb; margin-top: 6px;">
                © ${new Date().getFullYear()} Dr. Pratima Agale's Homeopathy Clinic. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

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
        htmlContent: emailHtml,
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