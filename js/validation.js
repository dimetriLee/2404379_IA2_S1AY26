// Validation.js - Form Validation

// Initialize form validation when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Login form validation
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Register form validation
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  // Checkout form validation
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);

    // Format card number as user types
    const cardNumberInput = document.getElementById("cardNumber");
    if (cardNumberInput) {
      cardNumberInput.addEventListener("input", formatCardNumber);
    }

    // Format expiry date as user types
    const expiryInput = document.getElementById("expiry");
    if (expiryInput) {
      expiryInput.addEventListener("input", formatExpiryDate);
    }
  }
});

// Login Form Validation

function handleLoginSubmit(event) {
  event.preventDefault();

  let isValid = true;

  // Get form fields
  const email = document.getElementById("loginEmail");
  const password = document.getElementById("loginPassword");

  // Validate email
  if (!validateEmail(email.value)) {
    showError("loginEmailError", "Please enter a valid email address");
    email.classList.add("error");
    isValid = false;
  } else {
    clearError("loginEmailError");
    email.classList.remove("error");
  }

  // Validate password
  if (password.value.trim() === "") {
    showError("loginPasswordError", "Password is required");
    password.classList.add("error");
    isValid = false;
  } else {
    clearError("loginPasswordError");
    password.classList.remove("error");
  }

  if (isValid) {
    // Simulate successful login
    alert("Login successful! Welcome back.");
    window.location.href = "../index.html";
  }
}

// ====================================
// Register Form Validation
// ====================================

function handleRegisterSubmit(event) {
  event.preventDefault();

  let isValid = true;

  // Get form fields
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("registerEmail");
  const password = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");
  const agreeTerms = document.getElementById("agreeTerms");

  // Validate first name
  if (firstName.value.trim() === "") {
    showError("firstNameError", "First name is required");
    firstName.classList.add("error");
    isValid = false;
  } else if (firstName.value.trim().length < 2) {
    showError("firstNameError", "First name must be at least 2 characters");
    firstName.classList.add("error");
    isValid = false;
  } else {
    clearError("firstNameError");
    firstName.classList.remove("error");
  }

  // Validate last name
  if (lastName.value.trim() === "") {
    showError("lastNameError", "Last name is required");
    lastName.classList.add("error");
    isValid = false;
  } else if (lastName.value.trim().length < 2) {
    showError("lastNameError", "Last name must be at least 2 characters");
    lastName.classList.add("error");
    isValid = false;
  } else {
    clearError("lastNameError");
    lastName.classList.remove("error");
  }

  // Validate email
  if (!validateEmail(email.value)) {
    showError("registerEmailError", "Please enter a valid email address");
    email.classList.add("error");
    isValid = false;
  } else {
    clearError("registerEmailError");
    email.classList.remove("error");
  }

  // Validate password
  if (password.value.length < 8) {
    showError(
      "registerPasswordError",
      "Password must be at least 8 characters"
    );
    password.classList.add("error");
    isValid = false;
  } else if (!validatePassword(password.value)) {
    showError(
      "registerPasswordError",
      "Password must contain letters and numbers"
    );
    password.classList.add("error");
    isValid = false;
  } else {
    clearError("registerPasswordError");
    password.classList.remove("error");
  }

  // Validate confirm password
  if (confirmPassword.value !== password.value) {
    showError("confirmPasswordError", "Passwords do not match");
    confirmPassword.classList.add("error");
    isValid = false;
  } else {
    clearError("confirmPasswordError");
    confirmPassword.classList.remove("error");
  }

  // Validate terms agreement
  if (!agreeTerms.checked) {
    showError("agreeTermsError", "You must agree to the terms and conditions");
    isValid = false;
  } else {
    clearError("agreeTermsError");
  }

  if (isValid) {
    // Simulate successful registration
    alert("Registration successful! Welcome to Face Off.");
    window.location.href = "login.html";
  }
}

// ====================================
// Checkout Form Validation
// ====================================

function handleCheckoutSubmit(event) {
  event.preventDefault();

  let isValid = true;

  // Get shipping information fields
  const fullName = document.getElementById("fullName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");

  // Get payment information fields
  const cardName = document.getElementById("cardName");
  const cardNumber = document.getElementById("cardNumber");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");

  // Validate full name
  if (fullName.value.trim() === "") {
    showError("fullNameError", "Full name is required");
    fullName.classList.add("error");
    isValid = false;
  } else if (fullName.value.trim().length < 3) {
    showError("fullNameError", "Please enter your full name");
    fullName.classList.add("error");
    isValid = false;
  } else {
    clearError("fullNameError");
    fullName.classList.remove("error");
  }

  // Validate email
  if (!validateEmail(email.value)) {
    showError("emailError", "Please enter a valid email address");
    email.classList.add("error");
    isValid = false;
  } else {
    clearError("emailError");
    email.classList.remove("error");
  }

  // Validate phone
  if (!validatePhone(phone.value)) {
    showError("phoneError", "Please enter a valid phone number");
    phone.classList.add("error");
    isValid = false;
  } else {
    clearError("phoneError");
    phone.classList.remove("error");
  }

  // Validate address
  if (address.value.trim() === "") {
    showError("addressError", "Street address is required");
    address.classList.add("error");
    isValid = false;
  } else {
    clearError("addressError");
    address.classList.remove("error");
  }

  // Validate city
  if (city.value.trim() === "") {
    showError("cityError", "City is required");
    city.classList.add("error");
    isValid = false;
  } else {
    clearError("cityError");
    city.classList.remove("error");
  }

  // Validate state
  if (state.value.trim() === "") {
    showError("stateError", "State is required");
    state.classList.add("error");
    isValid = false;
  } else {
    clearError("stateError");
    state.classList.remove("error");
  }

  // Validate ZIP code
  if (!validateZip(zip.value)) {
    showError("zipError", "Please enter a valid ZIP code");
    zip.classList.add("error");
    isValid = false;
  } else {
    clearError("zipError");
    zip.classList.remove("error");
  }

  // Validate card name
  if (cardName.value.trim() === "") {
    showError("cardNameError", "Name on card is required");
    cardName.classList.add("error");
    isValid = false;
  } else {
    clearError("cardNameError");
    cardName.classList.remove("error");
  }

  // Validate card number
  if (!validateCardNumber(cardNumber.value)) {
    showError("cardNumberError", "Please enter a valid card number");
    cardNumber.classList.add("error");
    isValid = false;
  } else {
    clearError("cardNumberError");
    cardNumber.classList.remove("error");
  }

  // Validate expiry date
  if (!validateExpiry(expiry.value)) {
    showError("expiryError", "Please enter a valid expiry date (MM/YY)");
    expiry.classList.add("error");
    isValid = false;
  } else {
    clearError("expiryError");
    expiry.classList.remove("error");
  }

  // Validate CVV
  if (!validateCVV(cvv.value)) {
    showError("cvvError", "Please enter a valid CVV (3-4 digits)");
    cvv.classList.add("error");
    isValid = false;
  } else {
    clearError("cvvError");
    cvv.classList.remove("error");
  }

  if (isValid) {
    // Simulate successful order
    alert("Order placed successfully! Thank you for your purchase.");
    clearCart();
    window.location.href = "../index.html";
  }
}

// ====================================
// Validation Helper Functions
// ====================================

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation (must contain letters and numbers)
function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
}

// Phone validation
function validatePhone(phone) {
  const phoneRegex = /^[\d\s\-\(\)]+$/;
  const digits = phone.replace(/\D/g, "");
  return phoneRegex.test(phone) && digits.length >= 10;
}

// ZIP code validation
function validateZip(zip) {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zip);
}

// Card number validation (basic check for 13-19 digits)
function validateCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\s/g, "");
  const cardRegex = /^\d{13,19}$/;
  return cardRegex.test(digits);
}

// Expiry date validation
function validateExpiry(expiry) {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) {
    return false;
  }

  const [month, year] = expiry.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);

  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && expiryMonth < currentMonth)
  ) {
    return false;
  }

  return true;
}

// CVV validation
function validateCVV(cvv) {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
}

// ====================================
// Input Formatting Functions
// ====================================

// Format card number with spaces
function formatCardNumber(event) {
  let value = event.target.value.replace(/\s/g, "");
  let formattedValue = value.match(/.{1,4}/g);

  if (formattedValue) {
    event.target.value = formattedValue.join(" ");
  }
}

// Format expiry date
function formatExpiryDate(event) {
  let value = event.target.value.replace(/\D/g, "");

  if (value.length >= 2) {
    value = value.substring(0, 2) + "/" + value.substring(2, 4);
  }

  event.target.value = value;
}

// ====================================
// Error Display Functions
// ====================================

// Show error message
function showError(errorId, message) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

// Clear error message
function clearError(errorId) {
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}
