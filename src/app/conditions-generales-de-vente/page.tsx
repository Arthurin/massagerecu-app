import { Metadata } from "next";
import Cgv from "@/components/layout/Cgv";

export const metadata: Metadata = {
  title: "Carte cadeau",
};

export default function CGV() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">
            Conditions générales de vente (CGV)
          </h1>
        </div>
        <div className="row justify-content-center">{Cgv()}</div>
      </div>
    </section>
  );
}
