// Function to generate a unique invoice number (e.g., FO-YYYYMMDD-XXXXX)
const generateUniqueInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  // Generate a random 5-digit number
  const random = Math.floor(10000 + Math.random() * 90000);
  return `FO-${year}${month}${day}-${random}`;
};

// Function to handle form submission and invoice generation
const handleCheckout = (event) => {
  event.preventDefault();

  // Check for valid login and cart contents
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const loggedInUserEmail = localStorage.getItem("loggedInUserEmail");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if the cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Add items before checking out.");
    return;
  }

  // Check if the user is logged in
  if (!isLoggedIn || !loggedInUserEmail) {
    alert("You must be logged in to complete your purchase.");
    window.location.href = "login.html"; // Redirect to login page
    return;
  }

  // Validate form fields (Assuming validation.js handles primary validation, we add TRN check)
  // Basic TRN check
  const trnInput = document.getElementById("trn");
  if (!trnInput.value || trnInput.value.length !== 9 || isNaN(trnInput.value)) {
    alert("Please enter a valid 9-digit TRN.");
    trnInput.focus();
    return;
  }

  // --- Invoice Calculation Data ---
  const subtotal =
    parseFloat(
      document.getElementById("checkoutSubtotal").textContent.replace("$", "")
    ) || 0;
  const tax =
    parseFloat(
      document.getElementById("checkoutTax").textContent.replace("$", "")
    ) || 0;
  const shipping =
    parseFloat(
      document.getElementById("checkoutShipping").textContent.replace("$", "")
    ) || 0;
  const total =
    parseFloat(
      document.getElementById("checkoutTotal").textContent.replace("$", "")
    ) || 0;

  // Create Invoice Object
  const invoice = {
    invoiceNumber: generateUniqueInvoiceNumber(),
    companyName: "Face Off Lacrosse Equipment",
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    userTRN: trnInput.value,
    shippingInfo: {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: `${document.getElementById("address").value}, ${
        document.getElementById("city").value
      }, ${document.getElementById("state").value} ${
        document.getElementById("zip").value
      }`,
    },
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount || 0, // Assume discount is stored in item object
      lineTotal: item.price * item.quantity * (1 - (item.discount || 0) / 100), // Calculate total with discount
    })),
    taxes: tax,
    subtotal: subtotal,
    shippingFee: shipping,
    total: total,
  };

  // Save to user's invoices[] array in RegistrationData
  let registrationData =
    JSON.parse(localStorage.getItem("RegistrationData")) || [];
  const userIndex = registrationData.findIndex(
    (user) => user.email === loggedInUserEmail
  );

  if (userIndex !== -1) {
    // Initialize invoices array if it doesn't exist
    if (!registrationData[userIndex].invoices) {
      registrationData[userIndex].invoices = [];
    }
    registrationData[userIndex].invoices.push(invoice);
    localStorage.setItem("RegistrationData", JSON.stringify(registrationData));
  }

  // Save to AllInvoices localStorage key
  let allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  allInvoices.push(invoice);
  localStorage.setItem("AllInvoices", JSON.stringify(allInvoices));

  // Clear the cart after successful purchase
  localStorage.removeItem("cart");

  // Update the cart count in the header to 0
  document.getElementById("cartCount").textContent = "0";

  // Display "invoice sent to email" message
  const checkoutMessage = document.getElementById("checkoutMessage");
  checkoutMessage.textContent = `Order successfully placed! Invoice #${invoice.invoiceNumber} sent to your email. You will be redirected to the invoice page in 5 seconds.`;
  checkoutMessage.style.display = "block";

  // Disable the form
  document
    .getElementById("checkoutForm")
    .querySelectorAll("input, button")
    .forEach((el) => (el.disabled = true));

  // Redirect to the newly created invoice page after a delay
  setTimeout(() => {
    window.location.href = `invoice.html?invoiceNumber=${invoice.invoiceNumber}`;
  }, 5000);
};

// Event listener for the checkout form submission
document.addEventListener("DOMContentLoaded", () => {
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckout);
  }

  if (typeof updateCartDisplay === "function") {
    updateCartDisplay();
  }
});
