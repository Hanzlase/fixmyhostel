/**
 * FixMyHostel — Interactive Prototype Logic
 * Handles Student Login, Password Visibility Toggle, Live Character Counting,
 * Evidence Upload Feedback, Complaint Validation, and Bootstrap Modal Management.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------------------------------------------------
     1. GLOBAL: NAVBAR COLLAPSE ON LINK CLICK (MOBILE UX)
     ------------------------------------------------------------------------ */
  const navbarCollapse = document.getElementById("fixMyHostelNav");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  if (navbarCollapse && typeof bootstrap !== "undefined") {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navbarCollapse.classList.contains("show")) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) {
            bsCollapse.hide();
          }
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. LOGIN PAGE: SHOW / HIDE PASSWORD TOGGLE
     ------------------------------------------------------------------------ */
  const passwordInput = document.getElementById("studentPassword");
  const passwordToggleBtn = document.getElementById("togglePasswordBtn");

  if (passwordInput && passwordToggleBtn) {
    passwordToggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentType = passwordInput.getAttribute("type");
      const toggleIcon = passwordToggleBtn.querySelector("i");

      if (currentType === "password") {
        passwordInput.setAttribute("type", "text");
        if (toggleIcon) {
          toggleIcon.classList.remove("bi-eye");
          toggleIcon.classList.add("bi-eye-slash");
        }
        passwordToggleBtn.setAttribute("aria-label", "Hide password");
      } else {
        passwordInput.setAttribute("type", "password");
        if (toggleIcon) {
          toggleIcon.classList.remove("bi-eye-slash");
          toggleIcon.classList.add("bi-eye");
        }
        passwordToggleBtn.setAttribute("aria-label", "Show password");
      }
      passwordInput.focus();
    });
  }

  /* ------------------------------------------------------------------------
     3. LOGIN PAGE: STUDENT LOGIN SUBMISSION
     ------------------------------------------------------------------------ */
  const loginForm = document.getElementById("studentLoginForm");

  if (loginForm) {
    const studentIdInput = document.getElementById("studentId");
    const studentPasswordInput = document.getElementById("studentPassword");
    const loginErrorBanner = document.getElementById("loginErrorBanner");

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let isValid = true;
      const idVal = studentIdInput ? studentIdInput.value.trim() : "";
      const passVal = studentPasswordInput ? studentPasswordInput.value.trim() : "";

      // Simple frontend check
      if (!idVal || !passVal) {
        isValid = false;
        if (loginErrorBanner) {
          loginErrorBanner.classList.remove("d-none");
          loginErrorBanner.textContent = "Please enter both your Student ID / Email and password.";
        }
        if (!idVal && studentIdInput) {
          studentIdInput.closest(".form-group-custom")?.classList.add("has-error");
          studentIdInput.focus();
        } else if (!passVal && studentPasswordInput) {
          studentPasswordInput.closest(".form-group-custom")?.classList.add("has-error");
          studentPasswordInput.focus();
        }
        return;
      }

      // Clear error states
      if (loginErrorBanner) loginErrorBanner.classList.add("d-none");
      document.querySelectorAll(".form-group-custom.has-error").forEach((el) => {
        el.classList.remove("has-error");
      });

      // Show brief button state and redirect to /complaint as required
      const submitBtn = loginForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span>Signing in...</span>
        `;
      }

      // Mandatory redirect to /complaint
      window.location.href = "/complaint";
    });

    // Clear error states on input
    [studentIdInput, studentPasswordInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          input.closest(".form-group-custom")?.classList.remove("has-error");
          if (loginErrorBanner) loginErrorBanner.classList.add("d-none");
        });
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. COMPLAINT PAGE: LIVE CHARACTER COUNTER
     ------------------------------------------------------------------------ */
  const complaintDescription = document.getElementById("complaintDescription");
  const charCounter = document.getElementById("charCounter");

  function updateCharacterCounter() {
    if (!complaintDescription || !charCounter) return;
    const currentLength = complaintDescription.value.length;
    const maxLength = 250;

    charCounter.textContent = `${currentLength}/${maxLength} characters`;

    if (currentLength >= maxLength) {
      charCounter.classList.add("limit");
      charCounter.classList.remove("warning");
    } else if (currentLength >= 200) {
      charCounter.classList.add("warning");
      charCounter.classList.remove("limit");
    } else {
      charCounter.classList.remove("warning", "limit");
    }
  }

  if (complaintDescription && charCounter) {
    complaintDescription.addEventListener("input", () => {
      updateCharacterCounter();
      // Remove error state on typing
      complaintDescription.closest(".form-group-custom")?.classList.remove("has-error");
    });
  }

  /* ------------------------------------------------------------------------
     5. COMPLAINT PAGE: EVIDENCE FILE UPLOAD FEEDBACK
     ------------------------------------------------------------------------ */
  const evidenceInput = document.getElementById("complaintEvidence");
  const evidenceDropzone = document.getElementById("evidenceDropzone");
  const evidenceFeedback = document.getElementById("evidenceFeedback");
  const evidenceFileName = document.getElementById("evidenceFileName");
  const btnRemoveEvidence = document.getElementById("btnRemoveEvidence");

  function handleEvidenceSelection(file) {
    if (!file) {
      resetEvidenceDisplay();
      return;
    }

    if (evidenceFileName) {
      // Format file size nicely
      const sizeKb = (file.size / 1024).toFixed(1);
      evidenceFileName.textContent = `${file.name} (${sizeKb} KB)`;
    }

    if (evidenceFeedback) {
      evidenceFeedback.classList.add("show");
    }
  }

  function resetEvidenceDisplay() {
    if (evidenceInput) {
      evidenceInput.value = "";
    }
    if (evidenceFeedback) {
      evidenceFeedback.classList.remove("show");
    }
    if (evidenceFileName) {
      evidenceFileName.textContent = "";
    }
  }

  if (evidenceInput) {
    evidenceInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      handleEvidenceSelection(file);
    });
  }

  if (btnRemoveEvidence) {
    btnRemoveEvidence.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      resetEvidenceDisplay();
    });
  }

  // Drag and drop visual cues for file dropzone
  if (evidenceDropzone) {
    ["dragenter", "dragover"].forEach((eventName) => {
      evidenceDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        evidenceDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      evidenceDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        evidenceDropzone.classList.remove("dragover");
      });
    });

    evidenceDropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt && dt.files;
      if (files && files.length > 0 && evidenceInput) {
        evidenceInput.files = files;
        handleEvidenceSelection(files[0]);
      }
    });
  }

  /* ------------------------------------------------------------------------
     6. COMPLAINT PAGE: FORM VALIDATION & SUBMISSION
     ------------------------------------------------------------------------ */
  const complaintForm = document.getElementById("complaintForm");
  const complaintCategory = document.getElementById("complaintCategory");
  const roomNumberInput = document.getElementById("roomNumber");
  const cancelComplaintBtn = document.getElementById("cancelComplaintBtn");

  // Helper to reset validation UI
  function clearValidationErrors() {
    document.querySelectorAll(".form-group-custom.has-error").forEach((group) => {
      group.classList.remove("has-error");
    });
    const errorAlert = document.getElementById("complaintValidationAlert");
    if (errorAlert) {
      errorAlert.classList.add("d-none");
    }
  }

  // Clear single field error on input
  [complaintCategory, roomNumberInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", () => {
        input.closest(".form-group-custom")?.classList.remove("has-error");
      });
      input.addEventListener("change", () => {
        input.closest(".form-group-custom")?.classList.remove("has-error");
      });
    }
  });

  // Complaint Submission
  if (complaintForm) {
    complaintForm.addEventListener("submit", (event) => {
      event.preventDefault();
      clearValidationErrors();

      let hasError = false;
      let firstErrorField = null;

      const roomValue = roomNumberInput ? roomNumberInput.value.trim() : "";
      const descValue = complaintDescription ? complaintDescription.value.trim() : "";
      const categoryValue = complaintCategory ? complaintCategory.value.trim() : "";

      // 1. Validate Category (Optional/Helpful check)
      if (!categoryValue) {
        hasError = true;
        complaintCategory?.closest(".form-group-custom")?.classList.add("has-error");
        if (!firstErrorField) firstErrorField = complaintCategory;
      }

      // 2. Validate Room Number (Required by spec)
      if (!roomValue) {
        hasError = true;
        roomNumberInput?.closest(".form-group-custom")?.classList.add("has-error");
        if (!firstErrorField) firstErrorField = roomNumberInput;
      }

      // 3. Validate Description (Required by spec)
      if (!descValue) {
        hasError = true;
        complaintDescription?.closest(".form-group-custom")?.classList.add("has-error");
        if (!firstErrorField) firstErrorField = complaintDescription;
      }

      if (hasError) {
        const errorAlert = document.getElementById("complaintValidationAlert");
        if (errorAlert) {
          errorAlert.classList.remove("d-none");
        }
        if (firstErrorField) {
          firstErrorField.focus();
        }
        return; // Halt: Do NOT show the modal
      }

      // Validation succeeded! Trigger custom confirmation modal
      const successModalEl = document.getElementById("complaintSuccessModal");
      if (successModalEl && typeof bootstrap !== "undefined") {
        // Generate random realistic ticket code for demonstration
        const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
        const ticketDisplay = document.getElementById("ticketDisplayId");
        if (ticketDisplay) {
          ticketDisplay.textContent = `FMH-${categoryValue.toUpperCase().slice(0, 3)}-${randomTicketNum}`;
        }

        const roomDisplay = document.getElementById("modalRoomDisplay");
        if (roomDisplay) {
          roomDisplay.textContent = roomValue;
        }

        const modalInstance = new bootstrap.Modal(successModalEl);
        modalInstance.show();

        // Reset form & states as mandated by spec
        complaintForm.reset();
        resetEvidenceDisplay();
        updateCharacterCounter();
        clearValidationErrors();
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. COMPLAINT PAGE: CANCEL BUTTON BEHAVIOR
     ------------------------------------------------------------------------ */
  if (cancelComplaintBtn) {
    cancelComplaintBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (complaintForm) {
        complaintForm.reset();
      }
      resetEvidenceDisplay();
      updateCharacterCounter();
      clearValidationErrors();

      // Smooth scroll back to top of the card or view
      const cardHeader = document.querySelector(".complaint-card-header");
      if (cardHeader) {
        cardHeader.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
});
