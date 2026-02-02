import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";

export type ReceiptFields = {
  nomDestinataire: string;
  nomAcheteur: string;
  soin: string;
  dateExpiration: string;
  idCarteCadeau: string;
  message: string;
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
  message: { x: 330, y: 330, size: 12 },
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
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

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
  const {
    nomDestinataire,
    nomAcheteur,
    soin,
    dateExpiration,
    idCarteCadeau,
    message,
  } = fields;

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
    const safeMessage = sanitizeText(message);
    // le message ne doit pas dépasser 250 caractères pour être sûr que tout rentre
    drawJustifiedTextBlock({
      page: firstPage,
      text: safeMessage,
      font: italicFont,
      fontSize: pos.size || 12,
      boxX: pos.x,
      boxY: pos.y,
      boxWidth: 190,
      boxHeight: 130,
    });
  }

  const bytes = await pdfDoc.save();
  return bytes;
}

function sanitizeText(input?: string | null): string {
  if (!input) return "";

  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .slice(0, 800); // limite raisonnable pour une carte cadeau
}

/* ============================================================
   Wrap du texte selon une largeur donnée
   ============================================================ */
function wrapTextByWidth(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);

    if (candidateWidth <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/* ============================================================
   Dessin du texte :
   - wrap automatique
   - hauteur max automatique
   - centrage vertical
   - centrage horizontal
   ============================================================ */
export function drawCenteredTextBlock({
  page,
  text,
  font,
  fontSize,
  boxX,
  boxY,
  boxWidth,
  boxHeight,
}: {
  page: any;
  text?: string | null;
  font: PDFFont;
  fontSize: number;
  boxX: number;
  boxY: number;
  boxWidth: number;
  boxHeight: number;
}) {
  const safeText = sanitizeText(text);
  if (!safeText) return;

  const lineHeight = fontSize * 1.3;

  // 1️⃣ wrap selon la largeur
  const wrappedLines = wrapTextByWidth(safeText, font, fontSize, boxWidth);

  // 2️⃣ calcul automatique du nombre max de lignes
  const maxLines = Math.floor(boxHeight / lineHeight);

  const visibleLines = wrappedLines.slice(0, maxLines);

  // 3️⃣ hauteur réelle du texte
  const textBlockHeight = visibleLines.length * lineHeight;

  // 4️⃣ point de départ vertical (centrage)
  const startY =
    boxY + (boxHeight - textBlockHeight) / 2 + textBlockHeight - fontSize;

  // 5️⃣ dessin ligne par ligne avec centrage horizontal
  visibleLines.forEach((line, index) => {
    const lineWidth = font.widthOfTextAtSize(line, fontSize);
    const centeredX = boxX + (boxWidth - lineWidth) / 2;

    page.drawText(line, {
      x: centeredX,
      y: startY - index * lineHeight,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

interface JustifiedTextOptions {
  page: PDFPage;
  text: string;
  font: PDFFont;
  fontSize: number;
  boxX: number;
  boxY: number;
  boxWidth: number;
  boxHeight: number;
  lineHeight?: number;
}

export function drawJustifiedTextBlock({
  page,
  text,
  font,
  fontSize,
  boxX,
  boxY,
  boxWidth,
  boxHeight,
  lineHeight = fontSize * 1.3,
}: JustifiedTextOptions) {
  if (!text.trim()) return;

  // --- 1. Découpage en mots
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[][] = [];
  let currentLine: string[] = [];

  for (const word of words) {
    const testLine = [...currentLine, word].join(" ");
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > boxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
    } else {
      currentLine.push(word);
    }
  }
  if (currentLine.length) lines.push(currentLine);

  // --- 2. Limite de lignes par hauteur
  const maxLines = Math.floor(boxHeight / lineHeight);
  const visibleLines = lines.slice(0, maxLines);

  const isTruncated = lines.length > maxLines;

  // --- 3. Si tronqué → ajouter […]
  if (isTruncated && visibleLines.length > 0) {
    const ellipsis = "[…]";
    const ellipsisWidth = font.widthOfTextAtSize(ellipsis, fontSize);

    const lastLine = [...visibleLines[visibleLines.length - 1]];

    while (lastLine.length > 0) {
      const testLine = lastLine.join(" ");
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth + ellipsisWidth <= boxWidth) {
        lastLine.push(ellipsis);
        break;
      }

      lastLine.pop();
    }

    visibleLines[visibleLines.length - 1] = lastLine;
  }

  // --- 4. Centrage vertical
  const totalHeight = visibleLines.length * lineHeight;
  let y = boxY + boxHeight - (boxHeight - totalHeight) / 2 - fontSize;

  // --- 5. Dessin ligne par ligne
  visibleLines.forEach((lineWords, index) => {
    const isLastLine = index === visibleLines.length - 1;

    const textWidth = font.widthOfTextAtSize(lineWords.join(" "), fontSize);

    const x = boxX;

    if (!isLastLine && lineWords.length > 1) {
      // --- Justification
      const gaps = lineWords.length - 1;
      const extraSpace = (boxWidth - textWidth) / gaps;

      let cursorX = x;

      lineWords.forEach((word, i) => {
        page.drawText(word, {
          x: cursorX,
          y,
          size: fontSize,
          font,
        });

        cursorX +=
          font.widthOfTextAtSize(word, fontSize) +
          font.widthOfTextAtSize(" ", fontSize) +
          (i < gaps ? extraSpace : 0);
      });
    } else {
      // --- Dernière ligne (non justifiée)
      page.drawText(lineWords.join(" "), {
        x,
        y,
        size: fontSize,
        font,
      });
    }

    y -= lineHeight;
  });
}
