(function () {
  "use strict";

  // Server-side safety check
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  let isInitialized = false;
  let faqObservers = [];

  // FAQ Accordion functionality
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    if (!faqItems.length) return;

    // Helper function to close all FAQs
    function closeAllFaqs(exceptItem = null) {
      faqItems.forEach(function (item) {
        if (exceptItem && item === exceptItem) return;

        const answer = item.querySelector(".faq-answer");
        const icon = item.querySelector(".faq-icon");

        if (answer && !answer.classList.contains("hidden")) {
          answer.classList.add("hidden");
          if (icon) {
            icon.style.transform = "rotate(0deg)";
          }
        }
      });
    }

    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");

      if (!question || !answer) return;

      const icon = question.querySelector(".faq-icon");

      // Store event handler for cleanup
      const clickHandler = function (event) {
        event.preventDefault();
        const isHidden = answer.classList.contains("hidden");

        if (isHidden) {
          closeAllFaqs(item);
          answer.classList.remove("hidden");
          if (icon) {
            icon.style.transform = "rotate(180deg)";
          }
          answer.style.animation = "slideDown 0.3s ease-out";
        } else {
          answer.classList.add("hidden");
          if (icon) {
            icon.style.transform = "rotate(0deg)";
          }
        }
      };

      question.addEventListener("click", clickHandler);

      // Store for cleanup
      faqObservers.push({ element: question, handler: clickHandler });
    });
  }

  // File attachment handling with validation
  function initFileAttachment() {
    const fileInput = document.querySelector('input[type="file"]');
    const selectedFileDiv = document.getElementById("selected-file");
    const fileNameSpan = document.getElementById("file-name");
    const removeFileBtn = document.getElementById("remove-file");

    if (!fileInput || !selectedFileDiv || !fileNameSpan || !removeFileBtn)
      return;

    const MAX_FILE_SIZE = 5; // MB
    const ALLOWED_TYPES = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    function validateFile(file) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(
          "Invalid file type. Please upload PDF, JPG, PNG, or DOC files only.",
        );
        return false;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE) {
        alert(
          `File is too large! Maximum size is ${MAX_FILE_SIZE}MB. Your file is ${fileSizeMB.toFixed(2)}MB.`,
        );
        return false;
      }

      return true;
    }

    const changeHandler = function (event) {
      const input = event.currentTarget;
      if (input && input.files && input.files[0]) {
        const file = input.files[0];

        if (!validateFile(file)) {
          input.value = "";
          selectedFileDiv.classList.add("hidden");
          return;
        }

        fileNameSpan.textContent = file.name;
        selectedFileDiv.classList.remove("hidden");
      } else {
        selectedFileDiv.classList.add("hidden");
      }
    };

    const removeHandler = function () {
      if (fileInput) {
        fileInput.value = "";
      }
      selectedFileDiv.classList.add("hidden");
    };

    fileInput.addEventListener("change", changeHandler);
    removeFileBtn.addEventListener("click", removeHandler);

    // Store for cleanup
    faqObservers.push({ element: fileInput, handler: changeHandler });
    faqObservers.push({ element: removeFileBtn, handler: removeHandler });
  }

  // Cleanup function
  function cleanup() {
    faqObservers.forEach(function (item) {
      if (item.element && item.handler) {
        item.element.removeEventListener("click", item.handler);
        item.element.removeEventListener("change", item.handler);
      }
    });
    faqObservers = [];
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initFaqAccordion();
        initFileAttachment();
      });
    } else {
      initFaqAccordion();
      initFileAttachment();
    }
  }

  init();
})();
