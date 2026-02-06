"use client";

import type { Ref } from "react";
import { useEffect, useState, FormEvent, useRef } from "react";
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
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const recipientInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      setIsIncorrect(true);
      recipientInputRef.current?.focus();
      return;
    }

    setIsIncorrect(false);
    onSubmit({
      recipientName,
      message: message.trim() || "",
      quantity,
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* 🧾 Titre produit */}
      <h3 className="tw:pb-4 text-center">
        {quantity > 1 ? `${quantity} x ` : ""}
        {massage.title}
      </h3>
      {/* 🔢 Quantité */}
      <div className="margin-input">
        <label className="form-label">Quantité</label>
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
        <label className="form-label">Nom du bénéficiaire</label>
        <input
          type="text"
          ref={recipientInputRef}
          value={recipientName}
          onChange={(e) => {
            const nextValue = e.target.value;
            setRecipientName(nextValue);
            if (isIncorrect && nextValue.trim()) {
              setIsIncorrect(false);
            }
          }}
          className={`tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2 ${
            isIncorrect ? "form-input--error" : ""
          }`}
          placeholder="Personne à qui offrir"
          aria-invalid={isIncorrect}
          aria-describedby={isIncorrect ? "recipient-name-error" : undefined}
        />
        {isIncorrect && (
          <p id="recipient-name-error" className="form-error-text">
            Ce champ est incomplet.
          </p>
        )}
      </div>

      {/* ✍️ Message */}
      <div>
        <div className="form-label-row">
          <label className="form-label" htmlFor="carte-cadeau-message">
            Message personnalisé
          </label>
          <span id="carte-cadeau-message-help" className="form-helper">
            Facultatif - 250 caractères max.
          </span>
        </div>
        <textarea
          id="carte-cadeau-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="tw:w-full tw:rounded-md tw:border tw:px-3 tw:py-2"
          rows={3}
          maxLength={250}
          aria-describedby="carte-cadeau-message-help"
          placeholder="Ce petit mot sera inscrit sur la carte cadeau"
        />
      </div>

      {/* ➡️ CTA */}
      <div className="tw:pt-4">
        <button type="submit" className="tw:w-full btn btn-secondary btn-lg">
          Continuer
        </button>
      </div>
    </form>
  );
}
