"use client";

import { MassageOption } from "./types";

interface Props {
  options: MassageOption[];
  onSelect: (massage: MassageOption) => void;
}

export default function MassageSelector({ options, onSelect }: Props) {
  return (
    <div className="massage-selector">
      {options.map((m) => (
        <div key={m.massagePriceId} className="massage-option">
          <div className="massage-option__content">
            <h4 className="massage-option__title">
              {m.title} - {m.unitPrice.toFixed(0)}€
            </h4>
            <p className="massage-option__description">{m.description}</p>
          </div>
          <div className="massage-option__actions">
            <button className="btn btn-secondary" onClick={() => onSelect(m)}>
              Acheter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
