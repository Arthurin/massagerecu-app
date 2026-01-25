"use client";

import { useState } from "react";
import { CarteCadeauFormData } from "./types";

interface Props {
  initialData?: Partial<CarteCadeauFormData>;
  onSubmit: (data: CarteCadeauFormData) => void;
}

export default function CarteCadeauForm({ initialData, onSubmit }: Props) {
  const [form, setForm] = useState<CarteCadeauFormData>({
    purchaserName: initialData?.purchaserName ?? "",
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
        Quantité
        <input
          type="number"
          value={form.quantity}
          min={1}
          onChange={handleChange("quantity")}
          required
        />
      </label>

      <label>
        Votre nom
        <input
          type="text"
          value={form.purchaserName}
          onChange={handleChange("purchaserName")}
          required
        />
      </label>

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

      <button type="submit">Continuer vers le paiement</button>
    </form>
  );
}
