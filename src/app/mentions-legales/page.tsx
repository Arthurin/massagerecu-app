import { Metadata } from "next";
import MentionsGenerees from "@/components/layout/MentionsGenerees";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegales() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">
          Mentions légales et Conditions Générales d'Utilisation
          </h1>
        </div>
        <div className="row justify-content-center">{MentionsGenerees()}</div>
      </div>
    </section>
  );
}

