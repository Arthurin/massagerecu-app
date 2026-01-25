"use client";

import { useState, FormEvent } from "react";
import { MassageOption, CarteCadeauFormData } from "./types";

interface Props {
  massage: MassageOption;
  onSubmit: (data: CarteCadeauFormData) => void;
}

export default function CarteCadeauForm({ massage, onSubmit }: Props) {
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const totalPrice = quantity * massage.unitPrice;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    onSubmit({
      recipientName,
      message: message.trim() || "",
      quantity,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 🧾 Titre produit */}
      <div className="p-4 rounded-lg bg-gray-50 border">
        <h2 className="text-lg font-semibold">
          Carte cadeau – {massage.title}
        </h2>
        <p className="text-sm text-gray-600">
          {quantity} × {massage.unitPrice.toFixed(0)} € ={" "}
          <strong>{totalPrice.toFixed(0)} €</strong>
        </p>
      </div>

      {/* 🎁 Bénéficiaire */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Nom du bénéficiaire</label>
        <input
          type="text"
          required
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Personne à qui offrir"
        />
      </div>

      {/* ✍️ Message */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Message personnalisé (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          rows={3}
          placeholder="Un petit mot pour accompagner la carte cadeau"
        />
      </div>

      {/* 🔢 Quantité */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Quantité</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full rounded-md border px-3 py-2"
        >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* ➡️ CTA */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full btn btn-primary btn-lg"
          disabled={!recipientName || quantity < 1}
        >
          Continuer
        </button>
      </div>
    </form>
  );
}
