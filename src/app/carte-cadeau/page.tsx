import { Metadata } from "next";
import Image from "next/image";
import CarteCadeauFlow from "@/components/features/carte-cadeau/CarteCadeauFlow";

export const metadata: Metadata = {
  title: "Carte cadeau",
};

export default function CarteCadeauPage() {
  return (
    <div className="gift-page">
      <section
        id="premiere-section"
        className="gift-hero"
        aria-labelledby="carte-cadeau-title"
      >
        <div className="container gift-hero__grid">
          <div className="gift-hero__content">
            <p className="gift-hero__eyebrow">Cabinet de massage · Janzé</p>
            <h1 id="carte-cadeau-title" className="gift-hero__title">
              Le plaisir d’offrir, l’art de prendre soin
            </h1>
            <p className="gift-hero__lead">
              Offrez une parenthèse de bien-être à celles et ceux que vous
              aimez.
            </p>
            <div className="gift-hero__actions">
              <div className="gift-hero__cta-group">
                <a className="gift-hero__cta" href="#choisir-carte">
                  Choisir une carte cadeau
                </a>
                <span className="gift-hero__note">
                  Paiement sécurisé via Stripe
                </span>
              </div>
            </div>
          </div>
          <div className="gift-hero__visual">
            <Image
              src="/assets/img/carte cadeau/photo_carte_cadeau.jpg"
              alt="Aperçu de la carte cadeau"
              width={520}
              height={390}
              quality={90}
              priority
              placeholder="blur"
              blurDataURL="/assets/img/carte cadeau/photo_carte_cadeau.jpg?w=16&blur=20"
              className="gift-hero__image"
            />
            <div className="gift-hero__badge">
              <strong>Prêt en quelques minutes</strong>
              <span>Une carte cadeau élégante et simple à personnaliser.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="gift-info" aria-labelledby="carte-cadeau-intro">
        <div className="container gift-info__grid">
          <div className="gift-info__text">
            <h2 id="carte-cadeau-intro">
              Une attention qui fait vraiment du bien
            </h2>
            <p>
              Le tarif est défini par la durée, pour laisser à la personne
              bénéficiaire le choix du massage.
            </p>
            <div className="gift-info__highlights">
              <div className="gift-highlight">
                <h3>Choisissez la durée</h3>
                <p>1h00, 1h30 ou 2h00 de détente.</p>
              </div>
              <div className="gift-highlight">
                <h3>Ajoutez un message</h3>
                <p>Quelques mots suffisent pour rendre votre cadeau unique.</p>
              </div>
              <div className="gift-highlight">
                <h3>Recevez-la tout de suite</h3>
                <p>
                  La carte est envoyée par email dès validation du paiement.
                </p>
              </div>
              <div className="gift-highlight">
                <h3>Offrez-la comme vous voulez</h3>
                <p>Imprimez-la ou transmettez-la directement par email.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="choisir-carte"
        className="gift-flow"
        aria-labelledby="carte-cadeau-choix"
      >
        <div className="container">
          <div className="gift-flow__header">
            <h2 id="carte-cadeau-choix">
              Créez votre carte cadeau en quelques clics
            </h2>
            <p>Carte valable 6 mois à compter de l’achat.</p>
          </div>
          <div className="gift-flow__panel">
            <CarteCadeauFlow />
          </div>
        </div>
      </section>
    </div>
  );
}
