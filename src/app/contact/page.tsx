import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <section id="premiere-section" className="page-section bg-light">
      <div className="container">
        <div className="text-center">
          <h1 className="section-heading text-uppercase">Me contacter</h1>
          <p className="section-subheading text-muted">
            Vous pouvez me contacter pour toute question ou pour prendre
            rendez-vous dans mon cabinet de massage bien-être situé à Brie, près
            de Janzé. Je réponds rapidement par email ou téléphone.
          </p>
        </div>

        <div className="row container-contact">
          {/* Informations pratiques */}
          <address className="col-custom">
            <h4>Informations pratiques</h4>
            <ul className="list-unstyled" id="contact-list">
              <li id="mail-icon">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="fa-fw align-icon"
                />
                <a
                  href="mailto:massagerecu@gmail.com"
                  aria-label="Envoyer un email à Massage Reçu"
                >
                  massagerecu@gmail.com
                </a>
              </li>

              <li id="tel-icon">
                <FontAwesomeIcon icon={faPhone} className="fa-fw align-icon" />
                <a href="tel:+33769488450" aria-label="Appeler Massage Reçu">
                  07 69 48 84 50
                </a>
              </li>

              <li id="adress-icon">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="fa-fw align-icon"
                />
                <a
                  href="https://goo.gl/maps/B44fLckT3UUP7C2Q8"
                  target="_blank"
                  rel="noopener"
                  aria-label="Voir la localisation sur Google Maps"
                >
                  Le Grand Long Pré
                  <br />
                  35150 Brie
                </a>
              </li>

              <li id="adress-icon">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="fa-fw align-icon"
                />
                <p className="petit-margin">
                  L'entrée se situe sur la route D93, juste à côté du croisement
                  avec la D777 (axe Janzé / Bain-de-Bretagne)
                </p>
              </li>
            </ul>
          </address>

          {/* Horaires d'ouverture */}
          <div className="col-custom">
            <h4>Horaires d'ouverture</h4>
            <ul className="list-unstyled" id="contact-list">
              <li>
                <FontAwesomeIcon icon={faClock} className="align-icon" />
                <div className="conteneur-horaires">
                  <p className="petit-margin">Uniquement sur rendez-vous</p>
                  <div id="horairesBloc">
                    <p className="petit-margin">
                      <strong>Lundi au Vendredi : 11h - 19h</strong>
                    </p>
                    <p className="petit-margin">
                      <strong>Samedi : 14h - 18h</strong>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Carte Google Maps */}
        <div className="row espacement">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5345.255596761935!2d-1.5319433188758234!3d47.943582913912145!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa5eadb73535b63d9%3A0x2317b93802e5f7b!2sMassage%20Re%C3%A7u%20-%20Brie%2C%20Janz%C3%A9!5e0!3m2!1sfr!2sfr!4v1729525086320!5m2!1sfr!2sfr"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Voir la localisation sur Google Maps"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
