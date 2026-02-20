"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import NavItem from "@/components/layout/Navitem";

const Header: React.FC = () => {
  const pathname = usePathname();
  console.log("Affichage de la page :", pathname);

  const items = [
    { title: "Accueil", url: "/" },
    { title: "Prestations", url: "/prestations" },
    { title: "Carte cadeau", url: "/carte-cadeau" },
    { title: "FAQ", url: "/faq" },
    { title: "Contact", url: "/contact" },
    { title: "Réserver", url: "/reserver" },
  ];

  return (
    <nav id="mainNav" className="navbar navbar-expand-lg fixed-top">
      <div className="navbar-topbar">
        <div className="container navbar-topbar__inner">
          <span className="navbar-topbar__brand">Massage Reçu</span>
          <div className="navbar-topbar__contact">
            <span className="navbar-topbar__item">
              <FontAwesomeIcon icon={faLocationDot} className="navbar-topbar__icon" />
              Brie · Janzé
            </span>
            <a className="navbar-topbar__item" href="tel:+33769488450">
              <FontAwesomeIcon icon={faPhone} className="navbar-topbar__icon" />
              07 69 48 84 50
            </a>
            <a className="navbar-topbar__item" href="mailto:massagerecu@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} className="navbar-topbar__icon" />
              massagerecu@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <Link className="navbar-brand" href="/">
          <img src="/assets/img/logo.png" alt="Massage Reçu" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Menu
          <FontAwesomeIcon icon={faBars} className="ms-1" />
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto py-4 py-lg-0">
            {items.map((item) => (
              <NavItem
                key={item.url}
                url={item.url}
                title={item.title}
                isActive={pathname === item.url}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
