
(function() {
  "use strict";

  // Check if we're in a browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  let hasAnimated = false;
  let observer = null;

  function animateCounters() {
    console.log("animateCounters called, hasAnimated:", hasAnimated);
    
    if (hasAnimated) return;

    const counters = document.querySelectorAll(".stat-counter");
    console.log("Found counters:", counters.length);
    
    if (!counters.length) return;

    hasAnimated = true;

    counters.forEach(function(counter) {
      const targetAttr = counter.getAttribute("data-target");
      console.log("Counter target:", targetAttr);
      
      if (!targetAttr) return;

      const target = parseInt(targetAttr, 10);
      if (isNaN(target)) return;

      let current = 0;
      const increment = target / 50;
      let timeoutId = null;

      function updateCounter() {
        current += increment;
        if (current < target) {
          counter.textContent = String(Math.floor(current));
          timeoutId = setTimeout(updateCounter, 40);
        } else {
          counter.textContent = String(target);
          if (timeoutId) clearTimeout(timeoutId);
        }
      }

      updateCounter();
    });
  }

  function resetCounters() {
    const counters = document.querySelectorAll(".stat-counter");
    counters.forEach(function(counter) {
      counter.textContent = "0";
    });
  }

  function initCounterObserver() {
    // Clean up existing observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    const statsSection = document.getElementById("stats-section");
    console.log("Stats section found:", statsSection);
    
    if (!statsSection) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",  // Trigger when section is near viewport
    };

    observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        console.log("Intersection observed:", entry.isIntersecting);
        if (entry.isIntersecting && !hasAnimated) {
          console.log("Starting counter animation");
          resetCounters();
          animateCounters();
          if (observer) observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(statsSection);
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      console.log("DOM Content Loaded - Initializing counter");
      initCounterObserver();
    });
  } else {
    console.log("DOM already loaded - Initializing counter");
    initCounterObserver();
  }
})();

// Carousel functionality
(function() {
  "use strict";

  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  function initCarousel() {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.getElementById("carouselDots");

    if (!track || !prevBtn || !nextBtn || !dotsContainer) {
      console.warn("Carousel elements not found");
      return;
    }

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    let slidesPerView = 3;
    let currentIndex = 0;
    let autoScrollInterval = null;

    function updateSlidesPerView() {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }

    function createDots() {
      const totalGroups = Math.ceil(slides.length / slidesPerView);
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalGroups; i++) {
        const dot = document.createElement("button");
        dot.classList.add("w-2", "h-2", "rounded-full", "transition-all", "duration-300");
        if (i === currentIndex) {
          dot.classList.add("bg-namema-primary", "w-6");
        } else {
          dot.classList.add("bg-gray-400", "hover:bg-namema-primary/50");
        }
        dot.addEventListener("click", function() {
          stopAutoScroll();
          goToSlide(i);
          startAutoScroll();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateCarousel() {
      const firstSlide = slides[0];
      if (!firstSlide) return;

      const slideWidth = firstSlide.getBoundingClientRect().width;
      const newPosition = currentIndex * (slideWidth * slidesPerView);
      track.style.transform = `translateX(-${newPosition}px)`;

      const dots = dotsContainer.children;
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        dot.classList.remove("bg-namema-primary", "w-6");
        dot.classList.add("bg-gray-400");
        if (i === currentIndex) {
          dot.classList.remove("bg-gray-400");
          dot.classList.add("bg-namema-primary", "w-6");
        }
      }
    }

    function goToSlide(index) {
      const maxIndex = Math.ceil(slides.length / slidesPerView) - 1;
      currentIndex = Math.max(0, Math.min(index, maxIndex));
      updateCarousel();
    }

    function nextSlide() {
      const maxIndex = Math.ceil(slides.length / slidesPerView) - 1;
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }

    function prevSlide() {
      const maxIndex = Math.ceil(slides.length / slidesPerView) - 1;
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateCarousel();
    }

    function startAutoScroll() {
      if (autoScrollInterval !== null) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(function() {
        nextSlide();
      }, 5000);
    }

    function stopAutoScroll() {
      if (autoScrollInterval !== null) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    }

    function handleResize() {
      const newSlidesPerView = updateSlidesPerView();
      if (newSlidesPerView !== slidesPerView) {
        slidesPerView = newSlidesPerView;
        currentIndex = 0;
        createDots();
        updateCarousel();
      }
    }

    slidesPerView = updateSlidesPerView();
    createDots();
    updateCarousel();
    startAutoScroll();

    prevBtn.addEventListener("click", function() {
      stopAutoScroll();
      prevSlide();
      startAutoScroll();
    });

    nextBtn.addEventListener("click", function() {
      stopAutoScroll();
      nextSlide();
      startAutoScroll();
    });

    window.addEventListener("resize", handleResize);

    const carouselContainer = document.querySelector("#testimonials-section .relative");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", stopAutoScroll);
      carouselContainer.addEventListener("mouseleave", startAutoScroll);
    }
  }

  // Initialize carousel when DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      setTimeout(initCarousel, 100);
    });
  } else {
    setTimeout(initCarousel, 100);
  }
})();
