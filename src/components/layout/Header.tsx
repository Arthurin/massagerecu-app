"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [compactBrand, setCompactBrand] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const brandRef = React.useRef<HTMLAnchorElement>(null);
  const brandLogoRef = React.useRef<HTMLSpanElement>(null);
  const brandTextRef = React.useRef<HTMLSpanElement>(null);
  const togglerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    const brand = brandRef.current;
    const logo = brandLogoRef.current;
    const text = brandTextRef.current;
    const toggler = togglerRef.current;
    if (!container || !brand || !logo || !text || !toggler) return;

    const measure = () => {
      const togglerStyle = window.getComputedStyle(toggler);
      const isTogglerVisible = togglerStyle.display !== "none";
      if (!isTogglerVisible) {
        setCompactBrand(false);
        return;
      }

      const brandRect = brand.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const togglerRect = toggler.getBoundingClientRect();
      const brandStyle = window.getComputedStyle(brand);
      const gap = Number.parseFloat(brandStyle.columnGap || brandStyle.gap || "0");
      const textWidth = text.scrollWidth;
      const availableWidth = togglerRect.left - brandRect.left;
      const expandedWidth = logoRect.width + gap + textWidth;

      const hideThreshold = expandedWidth + 8;
      const showThreshold = expandedWidth + 24;

      setCompactBrand((prev) => {
        if (!prev && availableWidth < hideThreshold) return true;
        if (prev && availableWidth > showThreshold) return false;
        return prev;
      });
    };

    const runMeasure = () => window.requestAnimationFrame(measure);
    runMeasure();

    const resizeObserver = new ResizeObserver(runMeasure);
    resizeObserver.observe(container);
    resizeObserver.observe(brand);
    resizeObserver.observe(toggler);
    window.addEventListener("resize", runMeasure, { passive: true });
    document.fonts?.ready.then(runMeasure).catch(() => undefined);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", runMeasure);
    };
  }, []);

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
          <span className="navbar-topbar__brand">
            <span className="navbar-topbar__brand-name">Massage Reçu</span>
            <span className="navbar-topbar__brand-sep"> · </span>
            <span>Soins massage</span>
          </span>
          <div className="navbar-topbar__contact">
            <span className="navbar-topbar__item">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="navbar-topbar__icon"
              />
              Brie · Janzé
            </span>
            <a className="navbar-topbar__item" href="tel:+33769488450">
              <FontAwesomeIcon icon={faPhone} className="navbar-topbar__icon" />
              07 69 48 84 50
            </a>
            <a
              className="navbar-topbar__item"
              href="mailto:massagerecu@gmail.com"
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                className="navbar-topbar__icon"
              />
              massagerecu@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="container" ref={containerRef}>
        <Link
          ref={brandRef}
          className={`navbar-brand ${compactBrand ? "navbar-brand--compact" : ""}`}
          href="/"
        >
          <span ref={brandLogoRef} className="navbar-brand__logo-stack">
            <Image
              src="/assets/img/Logo-2026.4.png"
              alt="Massage Reçu"
              width={110}
              height={110}
              className="navbar-brand__logo"
              priority
            />
          </span>
          <span ref={brandTextRef} className="navbar-brand__text">
            Massage Reçu
          </span>
        </Link>
        <button
          ref={togglerRef}
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
