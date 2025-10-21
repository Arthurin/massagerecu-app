import { NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf/generatePdf";

export async function GET() {

  const data = {
    nom: "Jean Lefort",
    produit: "Massage détente 60 min",
    montant: "50.00",
  };

  const pdfBytes = await generatePdf(data);

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="Carte cadeau - Massage reçu.pdf"',
    },
  });
}
