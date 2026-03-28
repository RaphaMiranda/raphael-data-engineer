/**
 * main.js — Global site behaviour
 * Handles: mobile navigation, active nav links, smooth-scroll CTAs
 */

(function () {
  "use strict";

  /* ─── Mobile Navigation ─────────────────────────────────── */

  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIconOpen  = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = !mobileMenu.classList.contains("hidden");

      if (isOpen) {
        mobileMenu.classList.add("hidden");
        menuIconOpen  && menuIconOpen.classList.remove("hidden");
        menuIconClose && menuIconClose.classList.add("hidden");
      } else {
        mobileMenu.classList.remove("hidden");
        menuIconOpen  && menuIconOpen.classList.add("hidden");
        menuIconClose && menuIconClose.classList.remove("hidden");
      }
    });

    // Close menu on nav link click
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        menuIconOpen  && menuIconOpen.classList.remove("hidden");
        menuIconClose && menuIconClose.classList.add("hidden");
      });
    });
  }

  /* ─── Active Nav Link Highlighting ──────────────────────── */

  const currentPath = window.location.pathname;

  document.querySelectorAll("nav a[data-nav]").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;

    // Exact match for home, prefix match for sub-sections
    const isActive =
      href === currentPath ||
      (href !== "/" && currentPath.startsWith(href));

    if (isActive) {
      link.classList.add("text-primary", "font-bold", "border-b-2", "border-primary", "pb-1");
      link.classList.remove("text-slate-400");
    }
  });

  /* ─── "Get in Touch" CTA scroll ─────────────────────────── */

  document.querySelectorAll("[data-contact-cta]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fall back to navigating to the contact anchor on the homepage
        window.location.href = "/#contact";
      }
    });
  });

})();
