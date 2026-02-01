import { downloadPDF } from "@/lib/pdfUtils";

async function main() {
  const pdfFields = {
    nomDestinataire: "Jean Dupont",
    nomAcheteur: "Marie Durant",
    soin: "Massage 1h (au choix)",
    dateExpiration: "24/12/2026",
    idCarteCadeau: "260129.8",
    message:
      "Profite bien de ton massage et de tout ce qui fait que la vie est belle ! Si c'est possible de savoir combien de caractères je peux saisir avant de déborder ce serait génial. Genre là est-ce que c'est terminé ? Encore un petit peu il faut compter les caractères je fais juste un message de test pour l'instant.",
  };

  await downloadPDF(pdfFields);

  console.log("script terminé");
}

main().catch((err) => {
  console.error("Erreur :", err);
});
