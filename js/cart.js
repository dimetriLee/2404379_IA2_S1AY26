// ====================================
// Cart.js - Shopping Cart Functionality
// ====================================

// Initialize cart page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("cartItems")) {
    loadCart();
  }

  if (document.getElementById("checkoutItems")) {
    loadCheckoutSummary();
  }
});

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
    updateCartTotals(0, 0, 10, 10);
    return;
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

// Function to create cart item DOM element
function createCartItemElement(item) {
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  cartItem.setAttribute("data-id", item.id);

  const itemTotal = item.price * item.quantity;

  cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        
        <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            
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
                
                <div class="item-total">Total: $${itemTotal.toFixed(2)}</div>
                
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

    // Save updated cart
    localStorage.setItem("laxproCart", JSON.stringify(cart));

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

  // Save updated cart
  localStorage.setItem("laxproCart", JSON.stringify(cart));

  // Reload cart display
  loadCart();

  // Update cart count in navigation
  updateCartCount(cart);
}

// Function to calculate cart totals
function calculateCartTotals() {
  const cart = getCart();

  let subtotal = 0;

  // Calculate subtotal
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  // Calculate tax (10%)
  const tax = subtotal * 0.1;

  // Shipping cost
  const shipping = 10.0;

  // Calculate total
  const total = subtotal + tax + shipping;

  // Update the display
  updateCartTotals(subtotal, tax, shipping, total);
}

// Function to update cart totals in DOM
function updateCartTotals(subtotal, tax, shipping, total) {
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const shippingElement = document.getElementById("shipping");
  const totalElement = document.getElementById("total");

  if (subtotalElement) subtotalElement.textContent = "$" + subtotal.toFixed(2);
  if (taxElement) taxElement.textContent = "$" + tax.toFixed(2);
  if (shippingElement) shippingElement.textContent = "$" + shipping.toFixed(2);
  if (totalElement) totalElement.textContent = "$" + total.toFixed(2);
}

// Function to load checkout summary
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

    const itemTotal = item.price * item.quantity;

    checkoutItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                <span style="color: #666;">Qty: ${item.quantity}</span>
            </div>
            <div>$${itemTotal.toFixed(2)}</div>
        `;

    checkoutItemsContainer.appendChild(checkoutItem);
  });

  // Calculate and update totals
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  const tax = subtotal * 0.1;
  const shipping = 10.0;
  const total = subtotal + tax + shipping;

  // Update checkout totals
  document.getElementById("checkoutSubtotal").textContent =
    "$" + subtotal.toFixed(2);
  document.getElementById("checkoutTax").textContent = "$" + tax.toFixed(2);
  document.getElementById("checkoutShipping").textContent =
    "$" + shipping.toFixed(2);
  document.getElementById("checkoutTotal").textContent = "$" + total.toFixed(2);
}

// Function to clear cart (used after successful order)
function clearCart() {
  localStorage.removeItem("laxproCart");
  updateCartCount([]);
}
