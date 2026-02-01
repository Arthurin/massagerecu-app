import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

export type ReceiptFields = {
  nomDestinataire: string;
  nomAcheteur: string;
  soin: string;
  dateExpiration: string;
  idCarteCadeau: string;
  message:string;
};

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "src",
  "lib",
  "templates",
  "templateCarteCadeau.pdf"
);

// Mapping de positions (x,y, size, fontName) par champ sur la page 1.
// Coordonnées depuis le coin inférieur gauche.
// Ajuste ces valeurs pour correspondre à ton template.
const DEFAULT_POSITIONS: Record<
  keyof Required<ReceiptFields>,
  { x: number; y: number; size?: number; color?: [number, number, number] }
> = {
  soin: { x: 126.5, y: 440, size: 12 },
  nomDestinataire: { x: 126.5, y: 394.9, size: 12 },
  nomAcheteur: { x: 126.5, y: 350, size: 12 },
  dateExpiration: { x: 126.5, y: 305.6, size: 12 },
  message: { x: 330, y: 440, size: 11 },
  idCarteCadeau: { x: 467.9, y: 305.6, size: 11 },
};

async function loadTemplateBytes(): Promise<Uint8Array> {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template PDF introuvable : ${TEMPLATE_PATH}`);
  }
  return fs.readFileSync(TEMPLATE_PATH);
}

async function embedFont(pdfDoc: PDFDocument): Promise<PDFFont> {
  return pdfDoc.embedFont(StandardFonts.Helvetica);
}

export async function downloadPDF(fields: ReceiptFields) {
  const date = new Date();
  const dateJourHeureMinute = `j${String(date.getDate()).padStart(
    2,
    "0"
  )} ${String(date.getHours()).padStart(2, "0")}h${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
  const outputPath = path.join(
    process.cwd(),
    "temp_test_pdf",
    `test_généré_${dateJourHeureMinute}.pdf`
  );

  const pdf: Uint8Array = await generatePDF(fields);
  fs.writeFileSync(outputPath, pdf);

  console.log(`✅ PDF généré : ${outputPath}`);
}

/**
 * Génère un PDF à partir du template en incrustant les champs fournis.
 * Renvoie les bytes du PDF (Uint8Array).
 */
export async function generatePDF(fields: ReceiptFields): Promise<Uint8Array> {
  const templateBytes = await loadTemplateBytes();
  const pdfDoc = await PDFDocument.load(templateBytes);

  const font = await embedFont(pdfDoc);

  // Ciblage de la première page
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Fonction utilitaire pour dessiner du texte avec fallback
  const draw = (
    text: string,
    x: number,
    y: number,
    size = 12,
    color = rgb(0, 0, 0)
  ) => {
    // clamp y to page bounds if necessary
    firstPage.drawText(text, {
      x,
      y,
      size,
      font,
      color,
    });
  };

  // Récupère les valeurs et dessine si présentes
  const { nomDestinataire, nomAcheteur, soin, dateExpiration, idCarteCadeau, message } =
    fields;

  if (nomDestinataire) {
    const pos = DEFAULT_POSITIONS.nomDestinataire;
    draw(nomDestinataire, pos.x, pos.y, pos.size);
  }

  if (nomAcheteur) {
    const pos = DEFAULT_POSITIONS.nomAcheteur;
    draw(nomAcheteur, pos.x, pos.y, pos.size);
  }

  if (soin) {
    const pos = DEFAULT_POSITIONS.soin;
    draw(soin, pos.x, pos.y, pos.size);
  }

  if (dateExpiration) {
    const pos = DEFAULT_POSITIONS.dateExpiration;
    draw(dateExpiration, pos.x, pos.y, pos.size);
  }

  if (idCarteCadeau) {
    const pos = DEFAULT_POSITIONS.idCarteCadeau;
    draw(idCarteCadeau, pos.x, pos.y, pos.size);
  }

  // Si besoin d'ajouter du texte multi-lignes, tu peux implémenter un wrap simple ici.

  if (message) {
    const pos = DEFAULT_POSITIONS.message;
    draw(message, pos.x, pos.y, pos.size);
  }
  
  const bytes = await pdfDoc.save();
  return bytes;
}
