import { sendMail } from "@/lib/mailer";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  await sendMail({
    to: "arthurfrin@gmail.com",
    subject: "Test mail OAuth2 2",
    text: "Ceci est un test réussi depuis le terminal 🎉",
  });
  console.log("✅ Email envoyé !");
}

main().catch((err) => {
  console.error("❌ Erreur lors de l'envoi :", err);
});
