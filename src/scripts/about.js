(function () {
  "use strict";

  // Server-side safety check
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  // Prevent multiple initializations
  let isInitialized = false;
  let hasAnimated = false;
  let observer = null;

  function animateCounters() {
    if (hasAnimated) return;

    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    hasAnimated = true;

    counters.forEach(function (counter) {
      const targetAttr = counter.getAttribute("data-target");
      if (!targetAttr) return;

      const target = parseInt(targetAttr, 10);
      if (isNaN(target)) return;

      let current = 0;
      const increment = target / 50;
      let animationFrame = null;
      let timeoutId = null;

      function updateCounter() {
        current = current + increment;

        if (current < target) {
          counter.textContent = String(Math.floor(current));
          //  Use requestAnimationFrame for better performance
          timeoutId = setTimeout(function () {
            animationFrame = requestAnimationFrame(updateCounter);
          }, 40);
        } else {
          counter.textContent = String(target);
          //  Clean up
          if (animationFrame) cancelAnimationFrame(animationFrame);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }

      updateCounter();
    });
  }

  function initCounterObserver() {
    // Clean up existing observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    const statsSection = document.getElementById("stats-section");
    if (!statsSection) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px",
    };

    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounters();
          if (observer) observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(statsSection);
  }

  // Safe DOM ready check
  function init() {
    if (isInitialized) return;
    isInitialized = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initCounterObserver);
    } else {
      initCounterObserver();
    }
  }

  init();
})();
