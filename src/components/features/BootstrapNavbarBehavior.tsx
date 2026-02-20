"use client";

import { useEffect } from "react";

export default function BootstrapNavbarBehavior() {
  useEffect(() => {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }

    // Hysteresis avoids rapid toggling near the top of the page.
    const SHRINK_AT = 24;
    const EXPAND_AT = 8;
    let isShrunk = false;
    let rafId: number | null = null;

    const navbarShrink = () => {
      const y = window.scrollY;

      if (!isShrunk && y >= SHRINK_AT) {
        navbarCollapsible.classList.add("navbar-shrink");
        isShrunk = true;
        return;
      }

      if (isShrunk && y <= EXPAND_AT) {
        navbarCollapsible.classList.remove("navbar-shrink");
        isShrunk = false;
      }
    };

    const onScroll = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(() => {
        navbarShrink();
        rafId = null;
      });
    };

    // Initial state
    navbarShrink();

    // Scroll listener
    window.addEventListener("scroll", onScroll, { passive: true });

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
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      responsiveNavItems.forEach((item) =>
        item.removeEventListener("click", handleNavItemClick),
      );
    };
  }, []);

  return null;
}
