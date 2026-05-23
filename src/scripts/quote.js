(function () {
  "use strict";

  // Server-side safety check
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  let isInitialized = false;
  let eventListeners = [];
  let dropdownObserver = null;

  // Helper to add event listener with tracking
  function addSafeEventListener(element, event, handler) {
    if (!element) return null;
    element.addEventListener(event, handler);
    eventListeners.push({ element, event, handler });
    return handler;
  }

  // File attachment handling
  function initFileAttachment() {
    const fileInput = document.querySelector('input[type="file"]');
    const selectedFileDiv = document.getElementById("selected-file");
    const fileNameSpan = document.getElementById("file-name");
    const removeFileBtn = document.getElementById("remove-file");

    if (!fileInput || !selectedFileDiv || !fileNameSpan || !removeFileBtn)
      return;

    const MAX_FILE_SIZE = 5;
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
          `File too large! Maximum ${MAX_FILE_SIZE}MB. Your file: ${fileSizeMB.toFixed(2)}MB`,
        );
        return false;
      }

      return true;
    }

    addSafeEventListener(fileInput, "change", function (event) {
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
    });

    addSafeEventListener(removeFileBtn, "click", function () {
      if (fileInput) fileInput.value = "";
      selectedFileDiv.classList.add("hidden");
    });
  }

  // Truck selector dropdown
  function initTruckSelector() {
    const selectorBtn = document.getElementById("truckSelectorBtn");
    const dropdown = document.getElementById("truckDropdown");
    const truckTypeInput = document.getElementById("truck_type_input");
    const selectedTruckImage = document.getElementById("selectedTruckImage");
    const selectedTruckName = document.getElementById("selectedTruckName");
    const selectedTruckDesc = document.getElementById("selectedTruckDesc");

    if (!selectorBtn || !dropdown) return;

    // Toggle dropdown
    addSafeEventListener(selectorBtn, "click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("hidden-dropdown");
    });

    // Close dropdown when clicking outside
    addSafeEventListener(document, "click", function () {
      if (!dropdown.classList.contains("hidden-dropdown")) {
        dropdown.classList.add("hidden-dropdown");
      }
    });

    // Prevent dropdown click from bubbling
    addSafeEventListener(dropdown, "click", function (e) {
      e.stopPropagation();
    });

    // Handle truck selection
    const truckOptions = document.querySelectorAll(".truck-option");
    truckOptions.forEach(function (option) {
      addSafeEventListener(option, "click", function () {
        const truckName = this.getAttribute("data-truck-name");
        const truckCapacity = this.getAttribute("data-truck-capacity");
        const truckImage = this.getAttribute("data-truck-image");

        if (truckImage && truckImage !== "") {
          if (truckTypeInput) {
            truckTypeInput.value = truckName
              ? `${truckName} (${truckCapacity})`
              : "";
          }
          if (selectedTruckImage) selectedTruckImage.src = truckImage;
          if (selectedTruckName)
            selectedTruckName.textContent = truckName || "I am not sure";
          if (selectedTruckDesc) {
            selectedTruckDesc.textContent = truckCapacity
              ? `Capacity: ${truckCapacity}`
              : "Let us recommend the best option";
          }
        }

        dropdown.classList.add("hidden-dropdown");
      });
    });

    // Handle "Not sure" option
    const notSureBtns = document.querySelectorAll(".not-sure-btn");
    notSureBtns.forEach(function (btn) {
      addSafeEventListener(btn, "click", function () {
        if (truckTypeInput) truckTypeInput.value = "";
        if (selectedTruckImage) {
          selectedTruckImage.src =
            "https://images.pexels.com/photos/2973050/pexels-photo-2973050.jpeg";
        }
        if (selectedTruckName) selectedTruckName.textContent = "Select a truck";
        if (selectedTruckDesc) selectedTruckDesc.textContent = "";
        dropdown.classList.add("hidden-dropdown");
      });
    });

    // Preselect vehicle from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedVehicle = urlParams.get("vehicle");

    if (preselectedVehicle && truckOptions.length) {
      setTimeout(function () {
        let matchingTruck = null;
        for (let i = 0; i < truckOptions.length; i++) {
          const option = truckOptions[i];
          const truckName = option.getAttribute("data-truck-name");
          if (
            truckName &&
            truckName.toLowerCase() === preselectedVehicle.toLowerCase()
          ) {
            matchingTruck = option;
            break;
          }
        }
        if (matchingTruck) matchingTruck.click();
      }, 100);
    }
  }

  // Form validation
  function initFormValidation() {
    const quoteForm = document.querySelector('form[action*="formspree"]');
    if (!quoteForm) return;

    addSafeEventListener(quoteForm, "submit", function (event) {
      const requiredFields = quoteForm.querySelectorAll("[required]");
      let isValid = true;
      let firstInvalidField = null;

      requiredFields.forEach(function (field) {
        if (!field.value || !field.value.trim()) {
          isValid = false;
          field.classList.add("border-red-500");

          if (!firstInvalidField) firstInvalidField = field;

          const removeError = function () {
            this.classList.remove("border-red-500");
          };
          field.addEventListener("focus", removeError, { once: true });
        }
      });

      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();

        const errorMessage = "Please fill in all required fields.";
        alert(errorMessage);

        if (firstInvalidField) {
          firstInvalidField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          firstInvalidField.focus();
        }
      }
    });
  }

  // Cleanup function
  function cleanup() {
    eventListeners.forEach(function (item) {
      if (item.element && item.handler) {
        item.element.removeEventListener(item.event, item.handler);
      }
    });
    eventListeners = [];
  }

  function init() {
    if (isInitialized) return;
    isInitialized = true;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        initFileAttachment();
        initTruckSelector();
        initFormValidation();
      });
    } else {
      initFileAttachment();
      initTruckSelector();
      initFormValidation();
    }
  }

  init();
})();
