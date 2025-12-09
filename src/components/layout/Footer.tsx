"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Newsletter from "../features/Newsletter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="dessusFooter">
        <div className="container">
          {/* Newsletter Section */}
          <div className="row newsContainer">
            <div className="col-lg-7 col-xl-6">
              <div className="newsletterHeader">
                <div className="newsletterBlocImage">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="newsletterImg"
                  />
                </div>
                <div>
                  <strong className="newsletterTitle">
                    Inscrivez-vous à la Newsletter
                  </strong>
                  <p className="newsletterHeaderDescription">
                    pour suivre mes actualités et recevoir des offres spéciales
                    !
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-xl-6 newsletterBloc">
              {/* Composant Newsletter */}
              <Newsletter />
            </div>

            {/* Loading and Confirmation Message */}
            <div className="infoServeur">
              <Image
                className="loadingImg"
                src="/assets/img/loading.gif"
                alt="loading"
                id="loadImg"
                width={50}
                height={50}
                unoptimized
              />
              <div hidden id="confirmationMessage">
                Votre inscription est confirmée. Merci !
              </div>
            </div>
          </div>

          {/* Contact and Hours Section */}
          <div className="row container-space-between row-cols-1 row-cols-sm-2 container-contact">
            <div className="col-custom">
              <h4>Informations pratiques</h4>
              <ul className="list-unstyled" id="contact-list">
                <li id="mail-icon">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="fa-fw align-icon"
                  />
                  <a href="mailto:massagerecu@gmail.com">
                    massagerecu@gmail.com
                  </a>
                </li>
                <li id="tel-icon">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="fa-fw align-icon"
                  />
                  <a href="tel:+33769488450">07 69 48 84 50</a>
                </li>
                <li id="adress-icon">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="fa-fw align-icon"
                  />
                  <a
                    href="https://goo.gl/maps/B44fLckT3UUP7C2Q8"
                    target="_blank"
                    aria-label="Google map"
                    rel="noopener noreferrer"
                  >
                    Le Grand Long Pré <br />
                    35150 Brie <br />
                    Situé sur la D93, au croisement avec la D777
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-custom">
              <h4>Horaires d'ouverture</h4>
              <ul className="list-unstyled" id="contact-list">
                <li>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="fa-fw align-icon"
                  />
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
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="dessousfooter">
        <div className="container text-center">
          <p>
            &copy; Copyright 2024
            <Link
              href="https://www.massagerecu.fr"
              className="link-light ms-3 me-3"
            >
              Massage reçu
            </Link>
            |
            <Link href="/mentions-legales" className="link-light ms-3 me-3">
              Mentions légales
            </Link>
            |
            <Link
              href="/conditions-generales-de-vente"
              className="link-light ms-3 me-3"
            >
              CGV
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
