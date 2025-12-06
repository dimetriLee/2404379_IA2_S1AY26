/*
 * Assignment: Group Project - E-commerce Website
 * File: reset-password.js
 * Description: Password Reset Functionality
 *
 * Group Members:
 * - Dimetri Lee (2404379) - dimetrialee@students.utech.edu.jm
 *
 * Module: CIT2011 - Web Programming
 * Class: Thursday 6:00PM
 */

// ====================================
// Reset Password Functionality
// Description: Allow user to change their password by matching their TRN
// ====================================

const resetPasswordForm = document.getElementById("resetPasswordForm");

if (resetPasswordForm) {
  const resetTRN = document.getElementById("resetTRN");
  const newPassword = document.getElementById("newPassword");
  const confirmNewPassword = document.getElementById("confirmNewPassword");
  const resetCancelBtn = document.getElementById("resetCancelBtn");

  const resetTRNError = document.getElementById("resetTRNError");
  const newPasswordError = document.getElementById("newPasswordError");
  const confirmNewPasswordError = document.getElementById(
    "confirmNewPasswordError"
  );
  const resetSuccessMessage = document.getElementById("resetSuccessMessage");

  // Helper functions from auth.js
  function showError(field, message, errorElement) {
    errorElement.textContent = message;
    field.classList.add("input-error");
    field.classList.add("error");
  }

  function clearError(field, errorElement) {
    errorElement.textContent = "";
    field.classList.remove("input-error");
    field.classList.remove("error");
  }

  // TRN validation
  function isValidTRN(trnValue) {
    const pattern = /^\d{3}-\d{3}-\d{3}$/;
    return pattern.test(trnValue);
  }

  // Auto-format TRN as user types
  resetTRN.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 9);
    }

    e.target.value = value;
  });

  // Cancel Button - Clear form
  resetCancelBtn.addEventListener("click", function () {
    resetPasswordForm.reset();
    clearError(resetTRN, resetTRNError);
    clearError(newPassword, newPasswordError);
    clearError(confirmNewPassword, confirmNewPasswordError);
    resetSuccessMessage.style.display = "none";
  });

  // Reset Password Form Submission
  // Match TRN and update password in RegistrationData localStorage
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let formValid = true;

    // Validate TRN
    if (resetTRN.value.trim() === "") {
      showError(resetTRN, "TRN is required", resetTRNError);
      formValid = false;
    } else if (!isValidTRN(resetTRN.value.trim())) {
      showError(resetTRN, "TRN must be in format: 000-000-000", resetTRNError);
      formValid = false;
    } else {
      clearError(resetTRN, resetTRNError);
    }

    // Validate New Password (minimum 8 characters)
    if (newPassword.value.trim() === "") {
      showError(newPassword, "New password is required", newPasswordError);
      formValid = false;
    } else if (newPassword.value.length < 8) {
      showError(
        newPassword,
        "Password must be at least 8 characters",
        newPasswordError
      );
      formValid = false;
    } else {
      clearError(newPassword, newPasswordError);
    }

    // Validate Confirm Password
    if (confirmNewPassword.value.trim() === "") {
      showError(
        confirmNewPassword,
        "Please confirm your new password",
        confirmNewPasswordError
      );
      formValid = false;
    } else if (confirmNewPassword.value !== newPassword.value) {
      showError(
        confirmNewPassword,
        "Passwords do not match",
        confirmNewPasswordError
      );
      formValid = false;
    } else {
      clearError(confirmNewPassword, confirmNewPasswordError);
    }

    if (!formValid) {
      return;
    }

    // Find user by TRN in RegistrationData
    const registrationData = localStorage.getItem("RegistrationData");

    if (!registrationData) {
      showError(resetTRN, "No registered users found", resetTRNError);
      return;
    }

    const users = JSON.parse(registrationData);
    const userIndex = users.findIndex((u) => u.trn === resetTRN.value.trim());

    if (userIndex === -1) {
      // TRN not found
      showError(
        resetTRN,
        "TRN not found. Please check your TRN",
        resetTRNError
      );
      return;
    }

    // Update user's password in RegistrationData
    users[userIndex].password = newPassword.value;

    // Save updated users array back to localStorage
    localStorage.setItem("RegistrationData", JSON.stringify(users));

    // Show success message
    resetSuccessMessage.style.display = "block";
    resetSuccessMessage.textContent =
      "Password reset successful! Redirecting to login...";

    // Reset form
    resetPasswordForm.reset();

    // Redirect to login page after 2 seconds
    setTimeout(function () {
      window.location.href = "login.html";
    }, 2000);
  });
}
