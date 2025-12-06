/*
 * Assignment: Group Project - E-commerce Website
 * File: login.js
 * Description: User Authentication (Registration and Login)
 *
 * Group Members:
 * - Dimetri Lee (2404379) - dimetrialee@students.utech.edu.jm
 *
 * Module: CIT2011 - Web Programming
 * Class: Thursday 6:00PM
 */

// ====================================
// User Login
// ====================================

function isValidTRN(trn) {
  // Matches: 000-000-000
  const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
  return trnPattern.test(trn);
}

// =========================
// Helper: Show error message
// =========================
function showError(input, message, errorElement) {
  input.classList.add("input-error");
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

// =========================
// Helper: Clear error message
// =========================
function clearError(input, errorElement) {
  input.classList.remove("input-error");
  errorElement.textContent = "";
  errorElement.style.display = "none";
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const loginTRN = document.getElementById("loginTRN");
  const loginPassword = document.getElementById("loginPassword");
  const loginTRNError = document.getElementById("loginTRNError");
  const loginPasswordError = document.getElementById("loginPasswordError");
  const loginAttemptMessage = document.getElementById("loginAttemptMessage");
  const loginCancelBtn = document.getElementById("loginCancelBtn");

  // Track login attempts (3 attempts allowed)
  let loginAttempts = parseInt(sessionStorage.getItem("loginAttempts")) || 0;
  let accountLocked = sessionStorage.getItem("accountLocked") === "true";

  // Auto-format TRN as user types
  loginTRN.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 9);
    }

    e.target.value = value;
  });

  // Cancel Button - Clear login form
  loginCancelBtn.addEventListener("click", function () {
    loginForm.reset();
    clearError(loginTRN, loginTRNError);
    clearError(loginPassword, loginPasswordError);
    loginAttemptMessage.textContent = "";
  });

  // Check if account is already locked
  if (accountLocked) {
    loginAttemptMessage.textContent =
      "Account locked. Too many failed login attempts.";
    loginAttemptMessage.style.color = "var(--error-color)";
    loginAttemptMessage.style.display = "block";
  }

  // Validate login data and handle attempts
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Check if account is locked
    if (accountLocked) {
      // Redirect to error/account locked page
      window.location.href = "account-locked.html";
      return;
    }

    let formValid = true;

    // Validate TRN
    if (loginTRN.value.trim() === "") {
      showError(loginTRN, "TRN is required", loginTRNError);
      formValid = false;
    } else if (!isValidTRN(loginTRN.value.trim())) {
      showError(loginTRN, "TRN must be in format: 000-000-000", loginTRNError);
      formValid = false;
    } else {
      clearError(loginTRN, loginTRNError);
    }

    // Validate Password
    if (loginPassword.value.trim() === "") {
      showError(loginPassword, "Password is required", loginPasswordError);
      formValid = false;
    } else {
      clearError(loginPassword, loginPasswordError);
    }

    if (!formValid) {
      return;
    }

    // Check credentials against RegistrationData
    const registrationData = localStorage.getItem("RegistrationData");

    if (!registrationData) {
      showError(loginTRN, "No registered users found", loginTRNError);
      return;
    }

    let users = JSON.parse(registrationData);

    // If data is a single user object, convert it into an array
    if (!Array.isArray(users)) {
      console.log(
        "RegistrationData is a single object, converting to array..."
      );
      users = [users];
    }

    console.log("Users array for login:", users);

    const user = users.find((u) => u.trn === loginTRN.value.trim());

    // Check if user exists and password matches
    if (user && user.password === loginPassword.value) {
      // Successful login - redirect to product catalog

      // Store logged-in user info in sessionStorage
      sessionStorage.setItem("loggedInUser", JSON.stringify(user));
      sessionStorage.setItem("isLoggedIn", "true");

      // Reset login attempts
      sessionStorage.removeItem("loginAttempts");
      sessionStorage.removeItem("accountLocked");

      alert("Login successful! Welcome back, " + user.firstName + "!");
      window.location.href = "products.html";
    } else {
      // Failed login - increment attempts
      loginAttempts++;
      sessionStorage.setItem("loginAttempts", loginAttempts.toString());

      const remainingAttempts = 3 - loginAttempts;

      if (loginAttempts >= 3) {
        // Lock account after 3 failed attempts
        sessionStorage.setItem("accountLocked", "true");
        alert("Account locked due to too many failed login attempts.");
        window.location.href = "account-locked.html";
      } else {
        // Show error message with remaining attempts
        loginAttemptMessage.textContent = `Invalid TRN or password. ${remainingAttempts} attempt(s) remaining.`;
        loginAttemptMessage.style.color = "var(--error-color)";
        loginAttemptMessage.style.display = "block";

        showError(loginTRN, "Invalid credentials", loginTRNError);
        showError(loginPassword, "Invalid credentials", loginPasswordError);
      }
    }
  });
}
