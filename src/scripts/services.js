
(function () {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Initialize scroll reveal on page load
  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    reveals.forEach((reveal) => {
      observer.observe(reveal);
    });
  }

  // Initialize service card hover effects
  function initServiceCards() {
    const cards = document.querySelectorAll(".service-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const icon = card.querySelector(".text-5xl");
        if (icon) {
          icon.style.transform = "scale(1.1)";
        }
      });

      card.addEventListener("mouseleave", () => {
        const icon = card.querySelector(".text-5xl");
        if (icon) {
          icon.style.transform = "scale(1)";
        }
      });
    });
  }

  // Run initialization when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initScrollReveal();
      initServiceCards();
    });
  } else {
    initScrollReveal();
    initServiceCards();
  }
})();
