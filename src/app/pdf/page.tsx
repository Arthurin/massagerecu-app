"use client";

import { useEffect, useState } from "react";

export default function Pdf() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      const res = await fetch("/api/generate-pdf");
      if (!res.ok) {
        console.error("Erreur lors du chargement du PDF");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    fetchPdf();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Votre reçu PDF</h1>
      <p className="mb-6 text-gray-700">
        Voici un aperçu de votre reçu. Vous pouvez le télécharger ou l’imprimer
        directement depuis le visualiseur intégré ci-dessous.
      </p>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="800px"
          className="border rounded-lg shadow-md"
        />
      ) : (
        <p>Chargement du PDF…</p>
      )}
    </div>
  );
}
