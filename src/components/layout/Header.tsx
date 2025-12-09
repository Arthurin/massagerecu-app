"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

const Header: React.FC = () => {
  const pathname = usePathname();
  console.log("Current pathname:", pathname);

  const items = [
    { title: "Accueil", url: "/" },
    { title: "Prestations", url: "/prestations" },
    { title: "Carte cadeau", url: "/carte-cadeau" },
    { title: "FAQ", url: "/faq" },
    { title: "Contact", url: "/contact" },
    { title: "Réserver", url: "/reserver" },
  ];

  const renderItem = (title: string, url: string) => {
    const isActive = pathname === url;
    return (
      <li className="nav-item" key={title}>
        {title === "Réserver" ? (
          <Link
            className={`btn ${
              isActive ? "btn-outline-primary" : "btn-primary"
            } me-2 btnMenuCustom ms-lg-2 mt-2 mt-lg-0`}
            href={`${url}`}
            aria-current={isActive ? "page" : undefined}
          >
            Réserver
          </Link>
        ) : (
          <Link
            className={`nav-link ${isActive ? "active" : ""}`}
            href={`${url}`}
            aria-current={isActive ? "page" : undefined}
          >
            {title}
          </Link>
        )}
      </li>
    );
  };

  return (
    <nav id="mainNav" className="navbar navbar-expand-lg fixed-top">
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
            {items.map((item) => renderItem(item.title, item.url))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
