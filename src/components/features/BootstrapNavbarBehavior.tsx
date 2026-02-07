"use client";

import { useEffect } from "react";

export default function BootstrapNavbarBehavior() {
  useEffect(() => {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }

    const navbarShrink = () => {
      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove("navbar-shrink");
      } else {
        navbarCollapsible.classList.add("navbar-shrink");
      }
    };

    // Initial state
    navbarShrink();

    // Scroll listener
    document.addEventListener("scroll", navbarShrink);

    // Collapse responsive navbar
    const navbarToggler =
      document.body.querySelector<HTMLElement>(".navbar-toggler");
    const responsiveNavItems = Array.from(
      document.querySelectorAll("#navbarResponsive a"),
    );

    const handleNavItemClick = () => {
      if (
        navbarToggler &&
        window.getComputedStyle(navbarToggler).display !== "none"
      ) {
        navbarToggler.click();
      }
    };

    responsiveNavItems.forEach((item) =>
      item.addEventListener("click", handleNavItemClick),
    );

    // Cleanup (important en App Router)
    return () => {
      document.removeEventListener("scroll", navbarShrink);
      responsiveNavItems.forEach((item) =>
        item.removeEventListener("click", handleNavItemClick),
      );
    };
  }, []);

  return null;
}
