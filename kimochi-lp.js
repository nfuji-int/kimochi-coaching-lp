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
     FAQ ACCORDION — animated open/close, one item at a time
     Native <details>/<summary> toggles instantly with no
     animation, so the summary's click is intercepted and the
     answer's height is animated by hand instead. The <details>
     element itself is still used (and its "open" state kept in
     sync) so the markup stays accessible and works even if JS
     fails to load.
  ========================================================== */

  const faqItems = document.querySelectorAll(".faq-item");
  const FAQ_ANIMATION_MS = 260;
  const FAQ_ANIMATION_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

  const setFaqArrow = (item, isOpen) => {
    const arrow = item.querySelector(".faq-arrow");
    if (arrow) {
      arrow.textContent = (isOpen === undefined ? item.open : isOpen) ? "⌃" : "⌄";
    }
  };

  const animateFaqAnswer = (item, opening) => {
    const answer = item.querySelector(".faq-answer");

    if (!answer) {
      item.open = opening;
      setFaqArrow(item, opening);
      return;
    }

    if (item._faqAnimation) {
      item._faqAnimation.cancel();
    }

    // A still-closed <details> answer doesn't reliably report a 0px
    // box (the browser's native closed-details rendering keeps it
    // measurable), so the starting height is set explicitly instead
    // of measured for the opening case. Closing measures the real
    // current height first, while the item is still genuinely open.
    //
    // The answer's own top/bottom padding is read and animated
    // alongside height — padding never shrinks below its authored
    // value just because "height" is animated toward 0, since it's
    // a separate box-model component, so animating height alone
    // would leave a visible ~51px gap (the padding + border) that
    // never closes.
    const computed = getComputedStyle(answer);
    const openPaddingTop = parseFloat(computed.paddingTop);
    const openPaddingBottom = parseFloat(computed.paddingBottom);

    let startHeight;

    if (opening) {
      startHeight = 0;
      item.open = true;
    } else {
      startHeight = answer.getBoundingClientRect().height;
    }

    const endHeight = opening ? answer.scrollHeight : 0;
    const startPaddingTop = opening ? 0 : openPaddingTop;
    const endPaddingTop = opening ? openPaddingTop : 0;
    const startPaddingBottom = opening ? 0 : openPaddingBottom;
    const endPaddingBottom = opening ? openPaddingBottom : 0;

    setFaqArrow(item, opening);
    answer.style.overflow = "hidden";

    item._faqAnimation = answer.animate(
      [
        {
          height: `${startHeight}px`,
          paddingTop: `${startPaddingTop}px`,
          paddingBottom: `${startPaddingBottom}px`
        },
        {
          height: `${endHeight}px`,
          paddingTop: `${endPaddingTop}px`,
          paddingBottom: `${endPaddingBottom}px`
        }
      ],
      { duration: FAQ_ANIMATION_MS, easing: FAQ_ANIMATION_EASING }
    );

    item._faqAnimation.onfinish = () => {
      answer.style.overflow = "";
      answer.style.height = "";
      answer.style.paddingTop = "";
      answer.style.paddingBottom = "";
      item._faqAnimation = null;

      if (!opening) {
        item.open = false;
      }
    };
  };

  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");

    if (!summary) {
      return;
    }

    setFaqArrow(item);

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      const willOpen = !item.open;

      if (willOpen) {
        // Only one answer stays open at a time: close any other
        // open item (with the same animation) before opening this one.
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.open) {
            animateFaqAnswer(otherItem, false);
          }
        });
      }

      animateFaqAnswer(item, willOpen);
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