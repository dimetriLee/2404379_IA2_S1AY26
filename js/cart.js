// Cart.js - Shopping Cart Functionality
// Integrated with user accounts - cart data stored per user
// Includes Clear All button functionality

// ====================================
// User Session Helper Functions
// ====================================

function isUserLoggedIn() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}

function getLoggedInUserTRN() {
  const userJSON = sessionStorage.getItem("loggedInUser");
  if (userJSON) {
    const user = JSON.parse(userJSON);
    return user.trn;
  }
  return null;
}

// ====================================
// Cart Data Functions - Integrated with User Accounts
// ====================================

/**
 * Get cart from logged in user's account or temporary cart
 */
function getCart() {
  if (isUserLoggedIn()) {
    // User is logged in - get cart from their RegistrationData
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = registrationData.find((u) => u.trn === userTRN);

    if (user && user.cart) {
      return user.cart.items || [];
    }
    return [];
  } else {
    // User not logged in - use temporary cart
    const cartData = localStorage.getItem("tempCart");
    return cartData ? JSON.parse(cartData) : [];
  }
}

/**
 * Save cart to logged in user's account or temporary storage
 */
function saveCart(cart) {
  if (isUserLoggedIn()) {
    // User is logged in - save to their RegistrationData
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

    if (userIndex !== -1) {
      registrationData[userIndex].cart = {
        items: cart,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(
        "RegistrationData",
        JSON.stringify(registrationData)
      );
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(registrationData[userIndex])
      );
    }
  } else {
    // User not logged in - save to temporary cart
    localStorage.setItem("tempCart", JSON.stringify(cart));
  }
}

/**
 * Update cart count in navigation
 */
function updateCartCount(cart) {
  const cartCountElements = document.querySelectorAll("#cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

// Function to get correct image path based on current location
function getImagePath(filename) {
  const isInCodesFolder = window.location.pathname.includes("/Codes/");
  if (isInCodesFolder) {
    return "../assets/" + filename;
  }
  return "assets/" + filename;
}

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("cartItems")) {
    loadCart();

    // Add Clear All button functionality
    addClearAllButton();
  }

  if (document.getElementById("checkoutItems")) {
    loadCheckoutSummary();
  }
});

// ====================================
// Requirement 3d: Add Clear All Button
// ====================================

/**
 * Add Clear All button to cart page
 * This button removes all items from the shopping cart
 */
function addClearAllButton() {
  const cartItemsContainer = document.getElementById("cartItems");

  if (!cartItemsContainer) return;

  // Check if Clear All button already exists
  if (document.getElementById("clearAllBtn")) return;

  // Create Clear All button
  const clearAllBtn = document.createElement("button");
  clearAllBtn.id = "clearAllBtn";
  clearAllBtn.className = "btn btn-secondary btn-large";
  clearAllBtn.textContent = "Clear All Items";
  clearAllBtn.style.marginTop = "1rem";
  clearAllBtn.style.width = "100%";

  // Add event listener
  clearAllBtn.addEventListener("click", function () {
    // Confirm before clearing
    const confirmClear = confirm(
      "Are you sure you want to remove all items from your cart?"
    );

    if (confirmClear) {
      clearAllItems();
    }
  });

  // Insert button after cart items
  cartItemsContainer.parentNode.insertBefore(
    clearAllBtn,
    cartItemsContainer.nextSibling
  );
}

/**
 * Clear all items from cart
 * Requirement 3d: Clear All button functionality
 */
function clearAllItems() {
  // Clear cart using integrated function
  if (isUserLoggedIn()) {
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

    if (userIndex !== -1) {
      registrationData[userIndex].cart = {
        items: [],
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "RegistrationData",
        JSON.stringify(registrationData)
      );
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(registrationData[userIndex])
      );
    }
  } else {
    localStorage.removeItem("tempCart");
  }

  // Update UI
  updateCartCount([]);
  loadCart();

  alert("All items have been removed from your cart.");
}

// Function to load and display cart items
function loadCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="products.html" class="btn btn-primary btn-large">Shop Products</a>
            </div>
        `;
    updateCartTotals(0, 0, 0, 0, 10, 10);

    // Hide Clear All button if cart is empty
    const clearAllBtn = document.getElementById("clearAllBtn");
    if (clearAllBtn) {
      clearAllBtn.style.display = "none";
    }

    return;
  }

  // Show Clear All button if cart has items
  const clearAllBtn = document.getElementById("clearAllBtn");
  if (clearAllBtn) {
    clearAllBtn.style.display = "block";
  }

  // Clear existing items
  cartItemsContainer.innerHTML = "";

  // Create cart items
  cart.forEach((item) => {
    const cartItem = createCartItemElement(item);
    cartItemsContainer.appendChild(cartItem);
  });

  // Calculate and update totals
  calculateCartTotals();
}

// Function to create cart item DOM element (UPDATED WITH DISCOUNT DISPLAY)
function createCartItemElement(item) {
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  cartItem.setAttribute("data-id", item.id);

  // Calculate prices
  const originalPrice = item.price;
  const discount = item.discount || 0;
  const finalPrice = item.finalPrice || item.price;
  const itemSubtotal = finalPrice * item.quantity;
  const itemDiscountAmount = (item.discountAmount || 0) * item.quantity;

  // Build discount info HTML if applicable
  let discountHTML = "";
  if (discount > 0) {
    discountHTML = `
      <div class="cart-item-discount">
        ${discount}% OFF - Save $${itemDiscountAmount.toFixed(2)}
      </div>
    `;
  }

  // Build price display
  let priceHTML = "";
  if (discount > 0) {
    priceHTML = `
      <div class="cart-item-price">
        <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">
          $${originalPrice.toFixed(2)}
        </span>
        <span style="color: #28a745; font-weight: 700; margin-left: 0.5rem;">
          $${finalPrice.toFixed(2)}
        </span>
      </div>
    `;
  } else {
    priceHTML = `
      <div class="cart-item-price">$${originalPrice.toFixed(2)}</div>
    `;
  }

  cartItem.innerHTML = `
        <img src="${getImagePath(item.image)}" alt="${
    item.name
  }" class="cart-item-image">
        
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            ${priceHTML}
            ${discountHTML}
            
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn decrease-btn" onclick="updateQuantity(${
                      item.id
                    }, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" onclick="updateQuantity(${
                      item.id
                    }, 1)">+</button>
                </div>
                
                <div class="item-total">Subtotal: $${itemSubtotal.toFixed(
                  2
                )}</div>
                
                <button class="remove-btn" onclick="removeFromCart(${
                  item.id
                })">Remove</button>
            </div>
        </div>
    `;

  return cartItem;
}

// Function to update item quantity
function updateQuantity(productId, change) {
  let cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    item.quantity += change;

    // Remove item if quantity is 0 or less
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Save updated cart using integrated function
    saveCart(cart);

    // Reload cart display
    loadCart();

    // Update cart count in navigation
    updateCartCount(cart);
  }
}

// Function to remove item from cart
function removeFromCart(productId) {
  let cart = getCart();

  // Filter out the item to remove
  cart = cart.filter((item) => item.id !== productId);

  // Save updated cart using integrated function
  saveCart(cart);

  // Reload cart display
  loadCart();

  // Update cart count in navigation
  updateCartCount(cart);
}

// Function to calculate cart totals (UPDATED WITH DISCOUNT CALCULATIONS)
function calculateCartTotals() {
  const cart = getCart();

  let subtotal = 0; // Total before discounts
  let totalDiscount = 0; // Total discount amount
  let subtotalAfterDiscount = 0; // Total after discounts

  // Calculate totals
  cart.forEach((item) => {
    const originalPrice = item.price;
    const finalPrice = item.finalPrice || item.price;
    const discountAmount = (item.discountAmount || 0) * item.quantity;

    subtotal += originalPrice * item.quantity;
    totalDiscount += discountAmount;
    subtotalAfterDiscount += finalPrice * item.quantity;
  });

  // Calculate tax on discounted subtotal (10%)
  const tax = subtotalAfterDiscount * 0.1;

  // Shipping cost
  const shipping = 10.0;

  // Calculate total
  const total = subtotalAfterDiscount + tax + shipping;

  // Update the display
  updateCartTotals(
    subtotal,
    totalDiscount,
    subtotalAfterDiscount,
    tax,
    shipping,
    total
  );
}

// Function to update cart totals in DOM (UPDATED WITH DISCOUNT DISPLAY)
function updateCartTotals(
  originalSubtotal,
  totalDiscount,
  subtotal,
  tax,
  shipping,
  total
) {
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const shippingElement = document.getElementById("shipping");
  const totalElement = document.getElementById("total");

  // Update existing elements
  if (subtotalElement) {
    // If there are discounts, show both original and discounted subtotal
    if (totalDiscount > 0) {
      subtotalElement.innerHTML = `
        <div style="text-decoration: line-through; color: #999; font-size: 0.9rem;">
          $${originalSubtotal.toFixed(2)}
        </div>
        <div style="color: #28a745; font-weight: 700;">
          $${subtotal.toFixed(2)}
        </div>
      `;
    } else {
      subtotalElement.textContent = "$" + subtotal.toFixed(2);
    }
  }

  if (taxElement) taxElement.textContent = "$" + tax.toFixed(2);
  if (shippingElement) shippingElement.textContent = "$" + shipping.toFixed(2);
  if (totalElement) totalElement.textContent = "$" + total.toFixed(2);

  // Add discount row if it doesn't exist and there are discounts
  if (totalDiscount > 0) {
    const summaryContainer = document.querySelector(".cart-summary");
    if (summaryContainer) {
      // Check if discount row already exists
      let discountRow = document.getElementById("discountRow");

      if (!discountRow) {
        // Create discount row
        discountRow = document.createElement("div");
        discountRow.id = "discountRow";
        discountRow.className = "summary-row discount-row";
        discountRow.style.color = "#28a745";
        discountRow.style.fontWeight = "600";

        // Insert after subtotal row
        const subtotalRow = subtotalElement.closest(".summary-row");
        if (subtotalRow) {
          subtotalRow.after(discountRow);
        }
      }

      // Update discount row content
      discountRow.innerHTML = `
        <span>Discount Savings:</span>
        <span>-$${totalDiscount.toFixed(2)}</span>
      `;
    }
  } else {
    // Remove discount row if no discounts
    const discountRow = document.getElementById("discountRow");
    if (discountRow) {
      discountRow.remove();
    }
  }
}

// Function to load checkout summary (UPDATED WITH DISCOUNT DISPLAY)
function loadCheckoutSummary() {
  const cart = getCart();
  const checkoutItemsContainer = document.getElementById("checkoutItems");

  if (cart.length === 0) {
    window.location.href = "cart.html";
    return;
  }

  // Clear existing items
  checkoutItemsContainer.innerHTML = "";

  // Display each cart item
  cart.forEach((item) => {
    const checkoutItem = document.createElement("div");
    checkoutItem.className = "checkout-item";

    const originalPrice = item.price;
    const finalPrice = item.finalPrice || item.price;
    const discount = item.discount || 0;
    const itemTotal = finalPrice * item.quantity;

    // Build price display
    let priceDisplay = "";
    if (discount > 0) {
      priceDisplay = `
        <div>
          <span style="text-decoration: line-through; color: #999; font-size: 0.85rem;">
            $${(originalPrice * item.quantity).toFixed(2)}
          </span>
          <span style="color: #28a745; font-weight: 700; margin-left: 0.5rem;">
            $${itemTotal.toFixed(2)}
          </span>
          <div style="color: #28a745; font-size: 0.8rem;">
            (${discount}% off)
          </div>
        </div>
      `;
    } else {
      priceDisplay = `<div>$${itemTotal.toFixed(2)}</div>`;
    }

    checkoutItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                <span style="color: #666;">Qty: ${item.quantity}</span>
            </div>
            ${priceDisplay}
        `;

    checkoutItemsContainer.appendChild(checkoutItem);
  });

  // Calculate totals
  let originalSubtotal = 0;
  let subtotal = 0;
  let totalDiscount = 0;

  cart.forEach((item) => {
    const originalPrice = item.price;
    const finalPrice = item.finalPrice || item.price;
    const discountAmount = (item.discountAmount || 0) * item.quantity;

    originalSubtotal += originalPrice * item.quantity;
    subtotal += finalPrice * item.quantity;
    totalDiscount += discountAmount;
  });

  const tax = subtotal * 0.1;
  const shipping = 10.0;
  const total = subtotal + tax + shipping;

  // Update checkout totals
  const checkoutSubtotalElement = document.getElementById("checkoutSubtotal");
  if (checkoutSubtotalElement) {
    if (totalDiscount > 0) {
      checkoutSubtotalElement.innerHTML = `
        <span style="text-decoration: line-through; color: #999; font-size: 0.9rem;">
          $${originalSubtotal.toFixed(2)}
        </span>
        <span style="color: #28a745; font-weight: 700; margin-left: 0.5rem;">
          $${subtotal.toFixed(2)}
        </span>
      `;
    } else {
      checkoutSubtotalElement.textContent = "$" + subtotal.toFixed(2);
    }
  }

  document.getElementById("checkoutTax").textContent = "$" + tax.toFixed(2);
  document.getElementById("checkoutShipping").textContent =
    "$" + shipping.toFixed(2);
  document.getElementById("checkoutTotal").textContent = "$" + total.toFixed(2);

  // Add discount row in checkout if applicable
  if (totalDiscount > 0) {
    const orderSummary = document.querySelector(".order-summary");
    let discountRow = document.getElementById("checkoutDiscountRow");

    if (!discountRow && orderSummary) {
      discountRow = document.createElement("div");
      discountRow.id = "checkoutDiscountRow";
      discountRow.className = "summary-row";
      discountRow.style.color = "#28a745";
      discountRow.style.fontWeight = "600";

      // Insert after subtotal
      const subtotalRow = checkoutSubtotalElement.closest(".summary-row");
      if (subtotalRow) {
        subtotalRow.after(discountRow);
      }
    }

    if (discountRow) {
      discountRow.innerHTML = `
        <span>Total Savings:</span>
        <span>-$${totalDiscount.toFixed(2)}</span>
      `;
    }
  }
}

// Function to clear cart (used after successful order)
function clearCart() {
  if (isUserLoggedIn()) {
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

    if (userIndex !== -1) {
      registrationData[userIndex].cart = {
        items: [],
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(
        "RegistrationData",
        JSON.stringify(registrationData)
      );
      sessionStorage.setItem(
        "loggedInUser",
        JSON.stringify(registrationData[userIndex])
      );
    }
  } else {
    localStorage.removeItem("tempCart");
  }

  updateCartCount([]);
}
