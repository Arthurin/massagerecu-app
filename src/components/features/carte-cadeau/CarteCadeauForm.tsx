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
    initialData?.recipientName ?? "",
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
      <h3 className="tw:pb-4 text-center">
        {quantity > 1 ? `${quantity} x ` : ""}
        {massage.title}
      </h3>
      {/* 🔢 Quantité */}
      <div className="margin-input">
        <label>Quantité</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="tw:w-full form-select"
        >
          {[1, 2, 3, 4, 5].map((q) => (
            <option key={q} value={q}>
              {q}
            </option>
          ))}
        </select>
      </div>

      {/* 🎁 Bénéficiaire */}
      <div className="margin-input ">
        <label>Nom du bénéficiaire</label>
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
      <div className="margin-input">
        <label>Message personnalisé (optionnel)</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2"
          rows={3}
          placeholder="Un petit mot pour accompagner la carte cadeau"
        />
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
