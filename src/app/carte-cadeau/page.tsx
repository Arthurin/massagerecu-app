import { Metadata } from "next";
import CarteCadeauFlow from "@/components/features/carte-cadeau/CarteCadeauFlow";

export const metadata: Metadata = {
  title: "Carte cadeau",
};

export default function CarteCadeauPage() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">Carte cadeau</h1>
          <p className="section-subheading text-muted">
            Offrez un moment de détente
          </p>
        </div>
        <div className="row text-center">
          <p>
            Vous cherchez un <strong>cadeau</strong> pour l'un·e de vos proches
            dans la région de Janzé ? <br />
            Pourquoi ne pas lui offrir une pause bien-être dans un charmant
            petit cabinet situé à la campagne ?
            <br />
            Massage Reçu vous propose des cartes cadeaux pour{" "}
            <strong>offrir des massages</strong>.
          </p>

          <h4>Présentation du service :</h4>
          <ul>
            <li>
              1- Choisissez la durée du soin. Le choix du massage revient au
              bénéficiaire, à la prise du rendez-vous.
            </li>
            <li>
              2- Vous pouvez personnaliser votre cadeau en ajoutant un petit
              mot.
            </li>
            <li>
              3- La carte cadeau est prête dès réception du paiement. Elle vous
              sera envoyée par mail.
            </li>
            <li>
              4- Pour une présentation soignée : l'imprimer en couleur sur du
              papier de qualité, faire 2 plis en accordéon, puis la glisser dans
              une belle enveloppe.
            </li>
            <li>
              4- Pour un impact écologique minimal : l'envoyer par mail au
              bénéficiaire. Il suffira de présenter le n° de la carte cadeau
              lors du rendez-vous.
            </li>
          </ul>

          <p>Choisissez celle que vous allez offrir ci-dessous :</p>
        </div>

        <div className="container">
          <CarteCadeauFlow />
        </div>
      </div>
    </section>
  );
}
