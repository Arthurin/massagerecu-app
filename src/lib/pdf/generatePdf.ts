import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Génère un PDF à partir d'un template HTML
export async function generatePdf(
  data: Record<string, string>
): Promise<Uint8Array> {
  const templatePath = path.join(
    process.cwd(),
    "src/lib/pdf/templateCarteCadeau.html"
  );
  const template = fs.readFileSync(templatePath, "utf-8");

  // Remplace les variables {{nom}} dans ton HTML
  const filledHtml = template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => data[key] || ""
  );

  // Crée un PDF avec pdf-lib
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // format A4
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const lines = filledHtml.split("\n");
  let y = height - 50;

  for (const line of lines) {
    page.drawText(line.replace(/<[^>]*>/g, ""), {
      x: 50,
      y,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  }

  return await pdfDoc.save();
}
