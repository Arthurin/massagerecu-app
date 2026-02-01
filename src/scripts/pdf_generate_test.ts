import { downloadPDF } from "@/lib/pdfUtils";

async function main() {
  const pdfFields = {
    nomDestinataire: "Jean Dupont",
    nomAcheteur: "Marie Durant",
    soin: "Massage 1h (au choix)",
    dateExpiration: "24/12/2026",
    idCarteCadeau: "260129.8",
    message:
      "Profite bien de ton massage et de tout ce qui fait que la vie est belle ! Si c'est possible de savoir combien de caractères je peux saisir avant de déborder ce serait génial.",
  };

  await downloadPDF(pdfFields);

  console.log("script terminé");
}

main().catch((err) => {
  console.error("Erreur :", err);
});
