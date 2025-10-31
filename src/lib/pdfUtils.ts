import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

export type ReceiptFields = {
  nomDestinataire: string;
  nomAcheteur: string;
  montant: string;
  dateExpiration: string;
  idCarteCadeau: string;
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
  nomDestinataire: { x: 120, y: 441, size: 12 },
  nomAcheteur: { x: 120, y: 397, size: 12 },
  montant: { x: 120, y: 353, size: 12 },
  dateExpiration: { x: 120, y: 309.7, size: 12 },
  idCarteCadeau: { x: 478, y: 309.7, size: 11 },
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
  const { width, height } = firstPage.getSize();

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
  const {
    nomDestinataire,
    nomAcheteur,
    montant,
    dateExpiration,
    idCarteCadeau,
  } = fields;

  if (nomDestinataire) {
    const pos = DEFAULT_POSITIONS.nomDestinataire;
    draw(nomDestinataire, pos.x, pos.y, pos.size);
  }

  if (nomAcheteur) {
    const pos = DEFAULT_POSITIONS.nomAcheteur;
    draw(nomAcheteur, pos.x, pos.y, pos.size);
  }

  if (montant) {
    const pos = DEFAULT_POSITIONS.montant;
    draw(montant, pos.x, pos.y, pos.size);
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

  const bytes = await pdfDoc.save();
  return bytes;
}
