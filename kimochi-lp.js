/* =========================================================
   KIMOCHI LP — JAVASCRIPT
   Smooth scroll + FAQ + Slow scroll reveal
   HTML and CSS do not need to be changed.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
  ========================================================== */

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });


  /* =========================================================
     FAQ ACCORDION
  ========================================================== */

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    const arrow = item.querySelector(".faq-arrow");

    if (!summary || !arrow) {
      return;
    }

    const updateArrow = () => {
      arrow.textContent = item.open ? "⌃" : "⌄";
    };

    updateArrow();

    item.addEventListener("toggle", updateArrow);
  });


  /* =========================================================
     FAQ — ONLY ONE ITEM OPEN AT A TIME
  ========================================================== */

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.open = false;
        }
      });
    });
  });


  /* =========================================================
     HEADER SCROLL STATE
  ========================================================== */

  const header = document.querySelector(".site-header");

  if (header) {
    const updateHeader = () => {
      if (window.scrollY > 10) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    window.addEventListener("scroll", updateHeader, {
      passive: true
    });

    updateHeader();
  }


  /* =========================================================
     SLOW SCROLL REVEAL
  ========================================================== */

  const revealElements = document.querySelectorAll(
    "section, .section-heading, .coach-card, .compare-card, " +
    ".comparison-table, .price-card, .included-box, .condition-box, " +
    ".step-card, .faq-item, .price-summary > div, " +
    ".measure-content, .support-box, .final-cta-overlay"
  );

  /*
    Add the reveal state directly with JavaScript.
    This means no CSS file changes are necessary.
  */

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(35px)";
    element.style.transition =
      "opacity 1.2s ease-out, transform 1.2s ease-out";
    element.style.willChange = "opacity, transform";
  });


  /* =========================================================
     INTERSECTION OBSERVER
  ========================================================== */

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      });

    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );


  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* =========================================================
     STAGGERED REVEAL FOR CARDS
  ========================================================== */

  const cardGroups = [
    ".coach-card",
    ".compare-card",
    ".step-card",
    ".price-summary > div",
    ".faq-item"
  ];

  cardGroups.forEach((selector) => {

    const cards = document.querySelectorAll(selector);

    cards.forEach((card, index) => {

      card.style.transitionDelay = `${index * 0.12}s`;

    });

  });


  /* =========================================================
     IMAGE PLACEHOLDER ACCESSIBILITY
  ========================================================== */

  const placeholders = document.querySelectorAll(".image-placeholder");

  placeholders.forEach((placeholder) => {
    placeholder.setAttribute("aria-hidden", "true");
  });


  /* =========================================================
     PREVENT EMPTY "#" LINKS FROM JUMPING TO TOP
  ========================================================== */

  const emptyLinks = document.querySelectorAll('a[href="#"]');

  emptyLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });

});