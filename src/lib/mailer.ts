import nodemailer from "nodemailer";
import { google } from "googleapis";

// --- Fonction d'envoi d'email ---
export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  // --- Validation stricte des variables d'environnement ---
  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REFRESH_TOKEN,
    GMAIL_SENDER,
  } = process.env;

  if (
    !GMAIL_CLIENT_ID ||
    !GMAIL_CLIENT_SECRET ||
    !GMAIL_REFRESH_TOKEN ||
    !GMAIL_SENDER
  ) {
    throw new Error("❌ Missing Gmail OAuth2 environment variables");
  }
  const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

  const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

  try {
    // Récupération d'un access_token valide via le refresh_token
    const accessToken = await oAuth2Client.getAccessToken();

    // Configuration du transport Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_SENDER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Contenu du mail
    const mailOptions = {
      from: `"Massage Reçu" <${GMAIL_SENDER}>`,
      to,
      subject,
      text,
      html,
    };

    // Envoi
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${to} — ID: ${result.messageId}`);

    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email :", error);
    throw error;
  }
}
