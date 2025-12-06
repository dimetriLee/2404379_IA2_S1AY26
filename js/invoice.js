document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const invoiceNumber = urlParams.get("invoiceNumber");
  const invoiceBox = document.getElementById("invoiceBox");
  const errorMessage = document.getElementById("errorMessage");

  // Display error if no invoice number is found in the URL
  if (!invoiceNumber) {
    invoiceBox.style.display = "none";
    errorMessage.textContent = "Invalid request: No invoice number provided.";
    errorMessage.style.display = "block";
    return;
  }

  // Fetch the invoice from AllInvoices localStorage
  const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];
  const invoice = allInvoices.find(
    (inv) => inv.invoiceNumber === invoiceNumber
  );

  // Display error if invoice is not found
  if (!invoice) {
    invoiceBox.style.display = "none";
    errorMessage.textContent = `Invoice #${invoiceNumber} not found.`;
    errorMessage.style.display = "block";
    return;
  }

  // --- Data Population Functions ---

  // Format currency to $X.XX
  const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;

  const populateDetails = () => {
    // Populate static details
    document.getElementById("invoiceNumber").textContent =
      invoice.invoiceNumber;
    document.getElementById("invoiceDate").textContent = invoice.date;
    document.getElementById("companyName").textContent = invoice.companyName;
    document.getElementById("userTRN").textContent = invoice.userTRN;

    // Populate shipping/billing info
    document.getElementById("billingName").textContent =
      invoice.shippingInfo.fullName;
    document.getElementById("billingEmail").textContent =
      invoice.shippingInfo.email;
    document.getElementById("billingPhone").textContent =
      invoice.shippingInfo.phone;
    document.getElementById("shippingAddress").textContent =
      invoice.shippingInfo.address;
  };

  const populateItems = () => {
    const invoiceItemsBody = document.getElementById("invoiceItems");
    invoiceItemsBody.innerHTML = ""; // Clear any existing content

    invoice.items.forEach((item) => {
      const row = invoiceItemsBody.insertRow();
      row.insertCell().textContent = item.name;
      row.insertCell().textContent = item.quantity;
      row.insertCell().textContent = formatCurrency(item.price);
      row.insertCell().textContent = item.discount + "%";
      row.insertCell().textContent = formatCurrency(item.lineTotal);
    });
  };

  const populateTotals = () => {
    document.getElementById("subtotal").textContent = formatCurrency(
      invoice.subtotal
    );
    document.getElementById("taxes").textContent = formatCurrency(
      invoice.taxes
    );
    document.getElementById("shippingFee").textContent = formatCurrency(
      invoice.shippingFee
    );
    document.getElementById("total").textContent = formatCurrency(
      invoice.total
    );
  };

  // --- Execution ---
  populateDetails();
  populateItems();
  populateTotals();

  // Show the invoice and hide the error message
  errorMessage.style.display = "none";
  invoiceBox.style.display = "block";
});
