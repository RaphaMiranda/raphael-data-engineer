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
    function setMenu(open) {
      mobileMenu.hidden = !open;
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      if (menuIconOpen) menuIconOpen.toggleAttribute("hidden", open);
      if (menuIconClose) menuIconClose.toggleAttribute("hidden", !open);
    }
    menuToggle.addEventListener("click", function () { setMenu(mobileMenu.hidden); });

    // Close menu on nav link click
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobileMenu.hidden) {
        event.preventDefault();
        setMenu(false);
        menuToggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!mobileMenu.hidden && !event.target.closest(".site-header")) setMenu(false);
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* ─── Active Nav Link Highlighting ──────────────────────── */

  function updateNavigation() {
    const currentPath = window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    document.querySelectorAll(".site-header a[data-nav]").forEach(function (link) {
      const url = new URL(link.href);
      const linkPath = url.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
      const samePage = linkPath === currentPath && (url.hash
        ? url.hash === window.location.hash
        : currentPath !== "/" || !window.location.hash);
      const active = samePage ||
        linkPath === "/aws-study-guide/explorer" && currentPath === "/aws-study-guide/service-explorer" ||
        url.hash === "#case-studies" && currentPath.startsWith("/case-studies/");
      if (active) link.setAttribute("aria-current", url.hash ? "location" : "page");
      else link.removeAttribute("aria-current");
    });
  }
  updateNavigation();
  window.addEventListener("hashchange", updateNavigation);

  /* ─── "Get in Touch" CTA scroll ─────────────────────────── */

  document.querySelectorAll("[data-contact-cta]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const target = document.getElementById("contact");
      if (target) {
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      } else {
        // Fall back to navigating to the contact anchor on the homepage
        window.location.href = "/#contact";
      }
    });
  });

})();
