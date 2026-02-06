import { Metadata } from "next";
import Image from "next/image";
import TableauMassages from "@/components/layout/TableauMassages";

export const metadata: Metadata = {
  title: "Prestations",
};

export default function Prestations() {
  return (
    <>
      <section id="premiere-section" className="page-section bg-light">
        <div className="container-lg">
          <div className="text-center">
            <h1 className="section-heading text-uppercase">Tarifs</h1>
            <p className="section-subheading text-muted">
              Toutes les informations en un coup d'oeil
            </p>
          </div>

          <TableauMassages />
        </div>
      </section>
      <section id="portfolio" className="page-section">
        <div className="container-lg">
          <div className="text-center">
            <h1 className="section-heading text-uppercase">
              Carte des massages
            </h1>
            <p className="section-subheading text-muted">
              Je propose différents types de massages pour satisfaire toutes les
              envies ; massage cocooning ou massage dynamique, massage huilé ou
              bien massage des pieds !
            </p>
          </div>

          <div className="row">
            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/abhyanga.webp"
                  alt="Photo massage Abhyanga"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                  priority
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">
                    Indien (Ayurvédique)
                  </div>
                  <div className="portfolio-caption-subheading text-muted">
                    Le massage détente par excellence. L'Abhyanga est le massage
                    traditionnel Indien le plus connu, effectué avec une huile
                    chauffée qui vient calmer et apaiser le mental. C'est un
                    massage lent et enveloppant qui vous fera voyager et qui
                    vous aidera à trouver plus de sérénité.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/thai.webp"
                  alt="Photo massage Thaïlandais à l'huile"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                  priority
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">
                    Thaïlandais huilé
                  </div>
                  <div className="portfolio-caption-subheading text-muted">
                    L'alternance des lissages, des pressions et des étirements
                    vient dénouer les tensions et réveiller le corps. Il plaira
                    particulièrement aux habitués des massages grâce aux
                    pressions plus intenses que d'ordinaire et à son rythme
                    dynamique.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/balinais.webp"
                  alt="Photo massage Balinais"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">Balinais</div>
                  <div className="portfolio-caption-subheading text-muted">
                    C'est le massage drainant par excellence. En allant masser
                    en profondeur les tissus cutanés et les muscules, le massage
                    Balinais sculpte la silhouette et entretient la bonne
                    condition physique.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/shiatsu.webp"
                  alt="Photo massage Shiatsu"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">
                    Shiatsu détente
                  </div>
                  <div className="portfolio-caption-subheading text-muted">
                    Le shiatsu est l'art d'effectuer des pressions sur
                    l'ensemble du corps. La cadence, calme et régulière,
                    transmert à la personne massée une sensation de sérénité et
                    de repos. Le massage peut être réalisé habillé en tenue
                    légère.
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/californien.webp"
                  alt="Photo massage Ciblé"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">Massage ciblé</div>
                  <div className="portfolio-caption-subheading text-muted">
                    Massage d'une face ou de certaines zones ciblées. Découvrez
                    les bienfaits du massage en 45 minutes ! Il est possible de
                    privilégié deux ou trois zones de votre corps prioritaires
                    (généralement le dos, la nuque, le visage, les mains).
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 mb-4">
              <div className="portfolio-item">
                <Image
                  src="/assets/img/massages/reflexo.webp"
                  alt="Photo Réflexologie plantaire"
                  width={416}
                  height={277}
                  className="img-fluid"
                  unoptimized
                />
                <div className="portfolio-caption">
                  <div className="portfolio-caption-heading">
                    Réflexologie plantaire
                  </div>
                  <div className="portfolio-caption-subheading text-muted">
                    Soin des pieds par acupressions. La stimulation des zones
                    réflexes du pied va agir sur notre organisme pour le
                    rééquilibrer. C'est un moment de relâchement et de
                    bien-être.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

