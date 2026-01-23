"use client";

interface PaymentSuccessProps {
  purchaserEmail: string;
}

export default function PaymentSuccess({
  purchaserEmail,
}: PaymentSuccessProps) {
  return (
    <div className="max-w-xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-green-800">
        ✅ Paiement confirmé
      </h2>

      <p className="text-green-900">
        Merci pour votre achat. Votre paiement a bien été pris en compte.
      </p>

      <p className="text-green-900">
        Votre carte cadeau est en cours de préparation.
      </p>

      <p className="text-green-900">
        📧 Elle sera envoyée par email à l'adresse suivante :
        <br />
        <strong>{purchaserEmail}</strong>
      </p>

      <p className="text-sm text-green-700">
        ⏳ L'envoi peut prendre quelques minutes.
        <br />
        Pensez à vérifier votre dossier spam si besoin.
      </p>
    </div>
  );
}
