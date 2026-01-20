"use client";

import { useState } from "react";
import { CarteCadeauFormData } from "./types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  initialData?: Partial<CarteCadeauFormData>;
  onSubmit: (data: CarteCadeauFormData) => void;
}

export default function CarteCadeauForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<CarteCadeauFormData>({
    purchaserName: initialData?.purchaserName ?? "",
    purchaserEmail: initialData?.purchaserEmail ?? "",
    recipientName: initialData?.recipientName ?? "",
    message: initialData?.message ?? "",
    quantity: initialData?.quantity ?? 1,
  });

  const [emailError, setEmailError] = useState<string | null>(null);

  const handleChange = (field: any) => (e: any) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRegex.test(form.purchaserEmail)) {
      setEmailError("Adresse email invalide");
      return;
    }

    setEmailError(null);
    onSubmit(form);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <h2>Informations de la carte-cadeau</h2>

      <label>
        Ton nom
        <input
          type="text"
          value={form.purchaserName}
          onChange={handleChange("purchaserName")}
          required
        />
      </label>

      <label>
        Ton e-mail
        <input
          type="email"
          value={form.purchaserEmail}
          onChange={handleChange("purchaserEmail")}
          required
        />
      </label>      
      {emailError && <p className="error">{emailError}</p>}

      <label>
        Nom du destinataire
        <input
          type="text"
          value={form.recipientName}
          onChange={handleChange("recipientName")}
          required
        />
      </label>

      <label>
        Message (facultatif)
        <textarea value={form.message} onChange={handleChange("message")} />
      </label>

      <label>
        Quantité
        <input
          type="number"
          value={form.quantity}
          min={1}
          onChange={handleChange("quantity")}
          required
        />
      </label>

      <button type="submit">Continuer vers le paiement</button>
    </form>
  );
}
