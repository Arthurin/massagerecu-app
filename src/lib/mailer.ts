import nodemailer from "nodemailer";
import { logMail } from "./logger";
import { sanitizeText, sanitizeRichHtml } from "@/lib/sanitizeInput";

type Attachment = {
  filename: string;
  path?: string;
  content?: Buffer;
  contentType?: string;
};

type SendMailParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Attachment[];
};

export async function sendMail({
  to,
  subject,
  text,
  html,
  attachments,
}: SendMailParams) {
  const { GMAIL_SENDER, GMAIL_APP_PASSWORD } = process.env;

  if (!GMAIL_SENDER || !GMAIL_APP_PASSWORD) {
    throw new Error("❌ Missing SMTP Gmail environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_SENDER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Massage Reçu" <${GMAIL_SENDER}>`,
    replyTo: GMAIL_SENDER,
    to: sanitizeText(to),
    subject: sanitizeText(subject),
    text: text ? sanitizeText(text) : undefined,
    html: html ? sanitizeRichHtml(html) : undefined,
    headers: {
      "Content-Language": "fr",
    },
    encoding: "utf-8",
    attachments,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    const msg = `✅ Email envoyé à ${to} (${result.messageId})`;
    console.log(msg);
    logMail(msg);
    return result;
  } catch (error) {
    const msg = `❌ Erreur lors de l'envoi à ${to}: ${String(error)}`;
    console.error(msg);
    logMail(msg);
    throw error;
  }
}
