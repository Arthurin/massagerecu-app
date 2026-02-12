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
              Offrez un instant de douceur à celles et ceux que vous aimez.
            </h1>
            <p className="gift-hero__lead">
              Une carte cadeau élégante, simple à personnaliser et envoyée par
              mail en quelques minutes.
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
              <span>Envoi instantané par email</span>
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
              Vous cherchez un cadeau attentionné pour l&apos;un·e de vos
              proches dans la région de Janzé ? Optez pour une pause bien-être
              avec un masseur professionnel.
            </p>
            <div className="gift-info__highlights">
              <div className="gift-highlight">
                <h3>Choisissez la durée</h3>
                <p>1h00, 1h30 ou 2h00 de détente.</p>
              </div>
              <div className="gift-highlight">
                <h3>Personnalisez votre carte</h3>
                <p>Il est possible d'ajouter un petit mot doux.</p>
              </div>
              <div className="gift-highlight">
                <h3>Recevez-la tout de suite</h3>
                <p>
                  La carte arrive dans votre boîte mail dès réception du
                  paiement.
                </p>
              </div>
            </div>
          </div>
          <div className="gift-info__card">
            <h3>Pour une présentation parfaite :</h3>
            <ol className="gift-info__steps">
              <li>Imprimez la carte en couleur sur un papier de qualité.</li>
              <li>Pliez-la deux fois pour former un accordéon.</li>
              <li>Glissez-la dans une belle enveloppe pour offrir.</li>
            </ol>
            <div className="gift-info__eco">
              <span>Option douce pour la planète</span>
              <p>
                Envoyez la carte par email au bénéficiaire. Il suffira de
                présenter le numéro de carte cadeau lors du rendez-vous.
              </p>
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
              Le plaisir d’offrir, la liberté de choisir
            </h2>
            <p>
              Sélectionnez la durée, la personne bénéficiaire choisira le
              massage ou demandera conseil au praticien. <br /> Votre carte est
              valable 6 mois à compter de sa date d'achat.
            </p>
          </div>
          <div className="gift-flow__panel">
            <CarteCadeauFlow />
          </div>
        </div>
      </section>
    </div>
  );
}
