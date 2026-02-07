import { NextResponse } from "next/server";
import { generatePDF } from "@/lib/pdfUtils";

// Exemple POST qui reçoit un body minimal (ou vérifie session Stripe côté serveur)
export async function POST(req: Request) {
  try {
    console.log(
      "Un pdf a été demandé par le front-end, traitement en cours...",
    );
    const body = await req.json();
    // Valide/normalize body selon ton besoin
    /*     
      date: body.date || new Date().toLocaleDateString("fr-FR"),
      reference: body.reference || body.payment_intent || "",
    */
    const fields = {
      nomDestinataire: body.nom || "Nom du bénéfiaire",
      nomAcheteur: "Nom de l'acheteur",
      montant: body.montant || "-- €",
      dateExpiration: "30/04/2025",
      idCarteCadeau: "311025-1",
      soin: "Massage relaxant 60min",
      message: body.message || "Profite bien de ton massage !",
    };

    const pdfBytes = await generatePDF(fields);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdfBytes);
        controller.close();
      },
    });

    console.log("Pdf généré, renvoit au front-end...");

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="carte-cadeau-${fields.nomDestinataire}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("generate-pdf error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la génération du PDF" },
      { status: 500 },
    );
  }
}
