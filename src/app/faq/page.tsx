import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FAQPage() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">FAQ</h1>
          <p className="section-subheading text-muted">
            Je répond à vos questions !
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="accordion">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Comment puis-je me préparer pour notre rendez-vous ?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body faq-reponse">
                  <p>
                    Prévoyez du temps ! Arrivez à l'heure pour plus de sérénité.
                    Prévoyez aussi 10 minutes de battement après le massage,
                    temps nécessaire pour se rhabiller et reprendre ses esprits.
                  </p>
                  <p>
                    Évitez de prendre un repas lourd ou de boire beaucoup d'eau
                    dans l'heure précédent le massage. Essayez aussi d'éviter la
                    fringale qui viendrait vous perturber pendant la séance.
                  </p>
                  <p>
                    Pour les massages qui peuvent se pratiquer habillé (Shiatsu,
                    massage du dos, massage des pieds) je vous recommande de
                    porter des habits souples pour maximiser votre confort.
                  </p>
                  <p>
                    Coupez votre téléphone... il ne vous reste plus qu'à
                    profiter !
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Quel est le rapport au corps et à l'intimité lors des séances
                  ?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body faq-reponse">
                  <p>
                    Le massage bien-être n'a aucune vocation érotique ou
                    sexuelle. Je ne masse ni le sexe ni la poitrine, et je
                    m'octroie le droit d'arrêter la séance en cas de
                    comportement irrespectueux.
                  </p>
                  <p>
                    Le respect de votre intimité est garanti, tant lors du
                    massage que lors du déshabillage et de l'habillage.
                  </p>
                  <p>
                    Pour certaines personnes ce n'est pas tant une partie du
                    corps en particulier qui engage la pudeur, mais plutôt le
                    sentiment d'être exposé, corps entier.
                  </p>
                  <p>
                    C'est pourquoi je propose à chaque massage d'utiliser un
                    drap qui couvre le corps et que je soulève uniquement pour
                    masser la zone.
                  </p>
                  <p>
                    Mon tableau de prestations indique les massages pour
                    lesquels il est nécessaire d'être en sous-vêtements : optez
                    pour le moins couvrant possible afin de ne pas limiter les
                    gestes de massage, mais privilégier avant tout le confort.
                    Des strings jetables sont aussi à disposition.
                  </p>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  J'ai des problèmes de santé, dois-je les signaler ?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body faq-reponse">
                  <p>
                    Les massages bien-être sont déconseillés en cas de fièvre,
                    de pathologie lourde, de phlébite et de manière générale en
                    cas d'inflammation aiguë ou de crise récente (sciatique,
                    lumbago...).
                  </p>
                  <p>
                    En cas de contre-indication partielle (lésion cutanée
                    bénigne, infection de la peau...) vous pourrez me prévenir
                    au début du rendez-vous pour adapter la prestation à votre
                    état de santé.
                  </p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="headingSix">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSix"
                  aria-expanded="false"
                  aria-controls="collapseSix"
                >
                  Que dois-je faire en cas d'annulation ?
                </button>
              </h2>
              <div
                id="collapseSix"
                className="accordion-collapse collapse"
                aria-labelledby="headingSix"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body faq-reponse">
                  <p>
                    Vous pouvez annuler ou reporter jusqu'à 24h avant le
                    rendez-vous. Passé ce délai, la prestation sera considérée
                    comme dûe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

