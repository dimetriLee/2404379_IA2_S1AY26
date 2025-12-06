/*
 * Assignment: Group Project - E-commerce Website
 * File: auth.js
 * Description: User Authentication (Registration and Login)
 *
 * Group Members:
 * - Dimetri Lee (2404379) - dimetrialee@students.utech.edu.jm
 *
 * Module: CIT2011 - Web Programming
 * Class: Thursday 6:00PM
 */

// ====================================
// Question 1a: User Registration
// ====================================

// Get Form & Inputs
const registerForm = document.getElementById("registerForm");

// Only run registration code if form exists on page
if (registerForm) {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const dob = document.getElementById("dob");
  const gender = document.getElementById("gender");
  const phone = document.getElementById("phone");
  const email = document.getElementById("registerEmail");
  const trn = document.getElementById("trn");
  const password = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const agreeTerms = document.getElementById("agreeTerms");
  const cancelBtn = document.getElementById("cancelBtn");

  // Error Message Spans
  const firstNameError = document.getElementById("firstNameError");
  const lastNameError = document.getElementById("lastNameError");
  const dobError = document.getElementById("dobError");
  const genderError = document.getElementById("genderError");
  const phoneError = document.getElementById("phoneError");
  const registerEmailError = document.getElementById("registerEmailError");
  const trnError = document.getElementById("trnError");
  const registerPasswordError = document.getElementById(
    "registerPasswordError"
  );
  const confirmPasswordError = document.getElementById("confirmPasswordError");
  const agreeTermsError = document.getElementById("agreeTermsError");

  // Show an Error
  function showError(field, message, errorElement) {
    errorElement.textContent = message;
    field.classList.add("input-error");
    field.classList.add("error");
  }

  // Clear the Error
  function clearError(field, errorElement) {
    errorElement.textContent = "";
    field.classList.remove("input-error");
    field.classList.remove("error");
  }

  // Email Validation Function
  function isValidEmail(emailValue) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(emailValue);
  }

  // Calculate Age from Date of Birth
  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Validate TRN Format (000-000-000)
  function isValidTRN(trnValue) {
    const pattern = /^\d{3}-\d{3}-\d{3}$/;
    return pattern.test(trnValue);
  }

  // Check if TRN is unique
  function isTRNUnique(trnValue) {
    const registrationData = localStorage.getItem("RegistrationData");
    if (!registrationData) {
      return true; // No users registered yet
    }

    const users = JSON.parse(registrationData);
    return !users.some((user) => user.trn === trnValue);
  }

  // Auto-format TRN as user types
  trn.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 9);
    }

    e.target.value = value;
  });

  // Cancel Button - Clear form data
  cancelBtn.addEventListener("click", function () {
    registerForm.reset();

    // Clear all error messages
    clearError(firstName, firstNameError);
    clearError(lastName, lastNameError);
    clearError(dob, dobError);
    clearError(gender, genderError);
    clearError(phone, phoneError);
    clearError(email, registerEmailError);
    clearError(trn, trnError);
    clearError(password, registerPasswordError);
    clearError(confirmPassword, confirmPasswordError);
    agreeTermsError.textContent = "";
  });

  // Form Submission - Register Button
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault(); // stop form from submitting immediately
    let formValid = true;

    // Validate all fields are filled

    // First Name
    if (firstName.value.trim() === "") {
      showError(firstName, "First name is required", firstNameError);
      formValid = false;
    } else {
      clearError(firstName, firstNameError);
    }

    // Last Name
    if (lastName.value.trim() === "") {
      showError(lastName, "Last name is required", lastNameError);
      formValid = false;
    } else {
      clearError(lastName, lastNameError);
    }

    // Age Validation (must be 18+)
    if (dob.value.trim() === "") {
      showError(dob, "Date of birth is required", dobError);
      formValid = false;
    } else {
      const age = calculateAge(dob.value);
      if (age < 18) {
        showError(
          dob,
          "You must be at least 18 years old to register",
          dobError
        );
        formValid = false;
      } else {
        clearError(dob, dobError);
      }
    }

    // Gender
    if (gender.value === "") {
      showError(gender, "Please select your gender", genderError);
      formValid = false;
    } else {
      clearError(gender, genderError);
    }

    // Phone Number
    if (phone.value.trim() === "") {
      showError(phone, "Phone number is required", phoneError);
      formValid = false;
    } else {
      clearError(phone, phoneError);
    }

    // Email
    if (email.value.trim() === "") {
      showError(email, "Email address is required", registerEmailError);
      formValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError(
        email,
        "Please enter a valid email address",
        registerEmailError
      );
      formValid = false;
    } else {
      clearError(email, registerEmailError);
    }

    // Question 1a.v: TRN Validation (format and uniqueness)
    if (trn.value.trim() === "") {
      showError(trn, "TRN is required", trnError);
      formValid = false;
    } else if (!isValidTRN(trn.value.trim())) {
      showError(trn, "TRN must be in format: 000-000-000", trnError);
      formValid = false;
    } else if (!isTRNUnique(trn.value.trim())) {
      showError(trn, "This TRN is already registered", trnError);
      formValid = false;
    } else {
      clearError(trn, trnError);
    }

    // Question 1a.iii: Password Validation (minimum 8 characters)
    if (password.value.trim() === "") {
      showError(password, "Password is required", registerPasswordError);
      formValid = false;
    } else if (password.value.length < 8) {
      showError(
        password,
        "Password must be at least 8 characters",
        registerPasswordError
      );
      formValid = false;
    } else {
      clearError(password, registerPasswordError);
    }

    // Confirm Password
    if (confirmPassword.value.trim() === "") {
      showError(
        confirmPassword,
        "Please confirm your password",
        confirmPasswordError
      );
      formValid = false;
    } else if (confirmPassword.value !== password.value) {
      showError(
        confirmPassword,
        "Passwords do not match",
        confirmPasswordError
      );
      formValid = false;
    } else {
      clearError(confirmPassword, confirmPasswordError);
    }

    // Agree to Terms
    if (!agreeTerms.checked) {
      agreeTermsError.textContent =
        "You must agree to the terms and conditions";
      formValid = false;
    } else {
      agreeTermsError.textContent = "";
    }

    // Question 1a.vi: Store registration data in localStorage
    if (formValid) {
      // Create user object with all required fields
      const currentDate = new Date().toISOString();

      const userObject = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        dateOfBirth: dob.value,
        gender: gender.value,
        phone: phone.value.trim(),
        email: email.value.trim(),
        trn: trn.value.trim(),
        password: password.value, // Note: In production, this should be hashed!
        dateOfRegistration: currentDate,
        cart: {},
        invoices: [],
      };

      // Get existing registration data or create new array
      let registrationData = localStorage.getItem("RegistrationData");
      let users = registrationData ? JSON.parse(registrationData) : [];

      // Append new user to array
      users.push(userObject);

      // Save back to localStorage
      localStorage.setItem("RegistrationData", JSON.stringify(users));

      // Success message
      alert(
        "Account created successfully! Welcome to Face Off, " +
          firstName.value +
          "!"
      );

      // Reset form
      registerForm.reset();

      // Redirect to login page
      window.location.href = "login.html";
    }
  });
}

// ====================================
// Question 1b: User Login
// ====================================

// Login form code will be added here
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  // Login functionality will be implemented next
  console.log("Login form detected - functionality to be implemented");
}
