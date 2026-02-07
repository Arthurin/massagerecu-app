import { Metadata } from "next";
import TrafftEmbed from "@/components/features/TrafftEmbed";

export const metadata: Metadata = {
  title: "Réserver",
};

export default function Reserver() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">
            Prise de rendez-vous en ligne
          </h1>
          <p className="section-subheading text-muted">
            Service disponible 24/7, n&apos;attendez plus pour réserver !
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-11 text-justify">
            <p>
              <strong>
                Le mail de confirmation est indispensable pour valider le
                rendez-vous.
              </strong>{" "}
              Si vous n&apos;avez pas reçu de mail à la fin de votre
              réservation, merci de me contacter directement.
            </p>
            <p>
              Le règlement s&apos;effectue lors du rendez-vous : en liquide, par
              CB ou avec une carte cadeau.
            </p>
            <p>
              Vous ne savez pas quel massage choisir ? Je conseille généralement
              de découvrir le massage Indien qui est très populaire et souvent
              apprécié pour la douceur qu&apos;il apporte. Au début du
              rendez-vous nous avons aussi un temps pour échanger et si besoin
              pour ajuster le choix du massage.
            </p>
          </div>
        </div>
      </div>

      <div className="container espacement">
        <div className="trafft-wrapper">
          {/* Trafft embed handled by a client component */}
          <TrafftEmbed
            url="https://massagerecu.trafft.com"
            lang="fr"
            autoResize={1}
            showSidebar={1}
            style={{ width: "100%", height: 768 }}
          />
        </div>
      </div>
    </section>
  );
}
