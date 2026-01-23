"use client";

import { MassageOption } from "./types";

interface Props {
  options: MassageOption[];
  onSelect: (massage: MassageOption) => void;
}

export default function MassageSelector({ options, onSelect }: Props) {
  return (
    <div>
      <h2>Choisis un massage</h2>

      {options.map((m) => (
        <div key={m.massagePriceId} className="massage-option">
          <h3>{m.title}</h3>
          <p>Prix : {m.unitPrice.toFixed()} €</p>
          <button onClick={() => onSelect(m)}>Acheter</button>
        </div>
      ))}
    </div>
  );
}
