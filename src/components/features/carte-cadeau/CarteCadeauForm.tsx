"use client";

import type { Ref } from "react";
import { useEffect, useState, FormEvent } from "react";
import { MassageOption, CarteCadeauFormData } from "./types";

interface Props {
  massage: MassageOption;
  onSubmit: (data: CarteCadeauFormData) => void;
  initialData?: CarteCadeauFormData | null;
  formRef?: Ref<HTMLFormElement>;
}

export default function CarteCadeauForm({
  massage,
  onSubmit,
  initialData,
  formRef,
}: Props) {
  const [recipientName, setRecipientName] = useState(
    initialData?.recipientName ?? ""
  );
  const [message, setMessage] = useState(initialData?.message ?? "");
  const [quantity, setQuantity] = useState(initialData?.quantity ?? 1);

  useEffect(() => {
    if (!initialData) {
      setRecipientName("");
      setMessage("");
      setQuantity(1);
      return;
    }

    setRecipientName(initialData.recipientName ?? "");
    setMessage(initialData.message ?? "");
    setQuantity(initialData.quantity ?? 1);
  }, [initialData]);

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
    <form ref={formRef} onSubmit={handleSubmit} className="tw:space-y-6">
      {/* 🧾 Titre produit */}
      <div className="tw:p-4 tw:rounded-lg tw:bg-gray-50 tw:border">
        <h2 className="tw:text-lg tw:font-semibold">
          Carte cadeau - {massage.title}
        </h2>
        <p className="tw:text-sm tw:text-gray-600">
          {quantity} × {massage.unitPrice.toFixed(0)} € ={" "}
          <strong>{totalPrice.toFixed(0)} €</strong>
        </p>
      </div>

      {/* 🎁 Bénéficiaire */}
      <div className="tw:space-y-2">
        <label className="tw:block tw:text-sm tw:font-medium">
          Nom du bénéficiaire
        </label>
        <input
          type="text"
          required
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          className="tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2"
          placeholder="Personne à qui offrir"
        />
      </div>

      {/* ✍️ Message */}
      <div className="tw:space-y-2">
        <label className="tw:block tw:text-sm tw:font-medium">
          Message personnalisé (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2"
          rows={3}
          placeholder="Un petit mot pour accompagner la carte cadeau"
        />
      </div>

      {/* 🔢 Quantité */}
      <div className="tw:space-y-2">
        <label className="tw:block tw:text-sm tw:font-medium">Quantité</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2"
        >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* ➡️ CTA */}
      <div className="tw:pt-4">
        <button
          type="submit"
          className="tw:w-full btn btn-primary btn-lg"
          disabled={!recipientName || quantity < 1}
        >
          Continuer
        </button>
      </div>
    </form>
  );
}
