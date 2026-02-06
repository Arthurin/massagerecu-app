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
            Envie de faire plaisir ? Offrez du bien être !
          </p>
        </div>
        <div className="row justify-content-center">
          <p>
            Nous ne trouvons pas toujours du temps dans nos vies rythmées, mais
            nous aimons toutes et tous nous faire chouchouter.
          </p>
          <p>
            Pour cela, rien de plus simple pour faire plaisir à vos proches que
            de leur offrir une carte cadeau massage.
          </p>
        </div>

        <div className="text-center">
          <h1 className="section-heading">
            Acheter en toute simplicité chez Massage Reçu
          </h1>
        </div>

        <div className="row justify-content-center liste_funky">
          <ol
            className="row justify-content-center liste_funky"
            role="list"
            style={{ "--length": 3 } as React.CSSProperties}
          >
            <div className="col-lg-4">
              <li style={{ "--i": 1 } as React.CSSProperties}>
                <h3>Le montant</h3>
                <p>Choisissez la durée du soin.</p>
                <p>
                  La personne bénéficiaire pourra choisir le massage qui lui
                  convient lorsqu'elle prendra rendez-vous.
                </p>
              </li>
            </div>

            <div className="col-lg-4">
              <li style={{ "--i": 2 } as React.CSSProperties}>
                <h3>Personnaliser</h3>
                <p>
                  Vous pouvez laisser un petit mot à l'attention du
                  bénéficiaire.
                </p>
                <p>
                  Choisissez comment l'offrir : un format imprimable (A4) ou un
                  envoi programmé par mail.
                </p>
              </li>
            </div>
            <div className="col-lg-4">
              <li style={{ "--i": 3 } as React.CSSProperties}>
                <h3>C'est prêt !</h3>
                <p>Votre cadeau est prêt dès réception du paiement.</p>
              </li>
            </div>
          </ol>
        </div>
      </div>
      <div className="container">
        <CarteCadeauFlow />
      </div>
    </section>
  );
}

