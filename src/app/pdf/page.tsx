"use client";
import { useState, useEffect } from "react";

export default function PdfPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  // Nettoie l’URL du Blob à la fermeture ou régénération
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // 🚀 Génère le PDF côté serveur
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nomDestinataire: "Nom du bénéfiaire",
          nomAcheteur: "Nom de l'acheteur",
          montant: "60 €",
          dateExpiration: "2025-10-21",
          idCarteCadeau: "311025-1",
        }),
      });

      if (!res.ok) {
        console.error("Erreur lors de la génération du PDF");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  // Télécharge le PDF
  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "Carte cadeau.pdf";
    a.click();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-semibold mb-4">Génération de PDF</h1>

      <p className="mb-6 text-gray-700">
        Cliquez sur le bouton ci-dessous pour générer et afficher votre reçu
        PDF.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : "Afficher mon PDF"}
        </button>

        {pdfUrl && (
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Télécharger le PDF
          </button>
        )}
      </div>

      {pdfUrl && (
        <div className="mt-8">
          <iframe
            src={pdfUrl}
            width="100%"
            height="800px"
            className="border rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
