/**
 * Script utilitaire pour calibrer les coordonnées (x,y) d'un template PDF.
 * Exécuter avec :  npx tsx .\src\scripts\pdf-calibrator.ts
 */

import fs from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

async function main() {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "lib",
    "templates",
    "templateCarteCadeau.pdf"
  );
  const outputPath = path.join(
    process.cwd(),
    "src",
    "lib",
    "templates",
    "templateCalibré.pdf"
  );

  if (!fs.existsSync(templatePath)) {
    console.error("❌ Template PDF introuvable :", templatePath);
    process.exit(1);
  }

  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  pages.forEach((page, pageIndex) => {
    const { width, height } = page.getSize();

    // --- DESSIN DU GRADUATEUR ---
    const colorFine = rgb(0.85, 0.85, 0.85); // gris clair
    const colorBold = rgb(0.6, 0.6, 0.6); // gris plus foncé
    const textColor = rgb(0.2, 0.2, 0.2); // presque noir

    // Lignes horizontales (Y) mettre y=1 ou 5 en fonction de la précision du calibrage
    for (let y = 0; y <= height; y += 1) {
      const isBold = y % 10 === 0;
      page.drawLine({
        start: { x: 0, y },
        end: { x: width, y },
        thickness: isBold ? 0.6 : 0.2,
        color: isBold ? colorBold : colorFine,
      });
      if (isBold) {
        // Valeur graduée sur la gauche
        page.drawText(`${y}`, {
          x: 2,
          y: y + 1,
          size: 6,
          font,
          color: textColor,
        });
      }
    }

    // Lignes verticales (X)
    // pareil pour x mettre +=1 ou 5 en fonction de la précision souhaitée
    for (let x = 0; x <= width; x += 1) {
      const isBold = x % 10 === 0;
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: isBold ? 0.6 : 0.2,
        color: isBold ? colorBold : colorFine,
      });
      if (isBold) {
        // Valeur graduée en bas
        page.drawText(`${x}`, {
          x: x + 1,
          y: 2,
          size: 6,
          font,
          color: textColor,
        });
      }
    }

    // === Label de page ===
    page.drawText(`Page ${pageIndex + 1}`, {
      x: width - 60,
      y: height - 20,
      size: 10,
      font,
      color: rgb(0, 0.5, 0),
    });
  });

  const outBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, outBytes);

  console.log(`✅ PDF de calibration généré : ${outputPath}`);
  console.log("➡️  Ouvre ce fichier pour lire les coordonnées (x, y).");
  console.log("   (x augmente vers la droite, y augmente vers le haut)");
}

main().catch((err) => {
  console.error("Erreur :", err);
});
