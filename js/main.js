/*
 * Assignment: Group Project - E-commerce Website
 * File: main.js
 * Description: Core functionality for products, cart, and navigation
 *
 * Group Members:
 * - Dimetri Lee (2404379) - dimetrialee@students.utech.edu.jm
 *
 * Module: CIT2011 - Web Programming
 * Class: Thursday 6:00PM
 */

// Product data array (simulating database)
const products = [
  {
    id: 1,
    name: "Pro Elite Attack Stick",
    description: "Premium attack lacrosse stick with carbon fiber shaft",
    price: 299.99,
    category: "sticks",
    image: "assets/attackStick.webp",
    featured: true,
    discount: 10,
  },
  {
    id: 2,
    name: "Defender Pro Stick",
    description: "Heavy-duty defense stick for maximum control",
    price: 249.99,
    category: "sticks",
    image: "assets/defenseStick.webp",
    featured: true,
    discount: 0,
  },
  {
    id: 3,
    name: "Elite Protective Helmet",
    description: "Advanced protection with superior ventilation",
    price: 199.99,
    category: "protective",
    image: "assets/helmet.jpg",
    featured: true,
    discount: 15,
  },
  {
    id: 4,
    name: "Pro Grip Gloves",
    description: "Enhanced grip and flexibility for better control",
    price: 149.99,
    category: "protective",
    image: "assets/gloves.webp",
    featured: false,
    discount: 5,
  },
  {
    id: 5,
    name: "Performance Shoulder Pads",
    description: "Lightweight protection without sacrificing mobility",
    price: 179.99,
    category: "protective",
    image: "assets/shoulder.webp",
    featured: false,
    discount: 20,
  },
  {
    id: 6,
    name: "Training Ball Pack",
    description: "Set of 6 official regulation lacrosse balls",
    price: 29.99,
    category: "accessories",
    image: "assets/balls.webp",
    featured: false,
    discount: 0,
  },
];

// ====================================
// Requirement 2b: Store Products in localStorage as AllProducts
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Initialize products in localStorage
 * Stores the products array to localStorage with key "AllProducts"
 */
function initializeProducts() {
  const storedProducts = localStorage.getItem("AllProducts");

  if (!storedProducts) {
    localStorage.setItem("AllProducts", JSON.stringify(products));
    console.log("Products initialized in localStorage as 'AllProducts'");
  } else {
    console.log("Products already exist in localStorage");
  }
}

/**
 * Get products from localStorage
 * Created by: Dimetri Lee (2404379)
 */
function getProductsFromStorage() {
  const storedProducts = localStorage.getItem("AllProducts");
  return storedProducts ? JSON.parse(storedProducts) : products;
}

/**
 * Update a product in localStorage
 * Created by: Dimetri Lee (2404379)
 */
function updateProduct(productId, updatedData) {
  let allProducts = getProductsFromStorage();
  const productIndex = allProducts.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    allProducts[productIndex] = {
      ...allProducts[productIndex],
      ...updatedData,
    };
    localStorage.setItem("AllProducts", JSON.stringify(allProducts));
    console.log(`Product ${productId} updated in localStorage`);
  }
}

/**
 * Add a new product to localStorage
 * Created by: Dimetri Lee (2404379)
 */
function addProduct(newProduct) {
  let allProducts = getProductsFromStorage();
  allProducts.push(newProduct);
  localStorage.setItem("AllProducts", JSON.stringify(allProducts));
  console.log("New product added to localStorage");
}

// ====================================
// Helper Functions for Discounts
// Created by: Dimetri Lee (2404379)
// ====================================

function calculateDiscountedPrice(price, discount) {
  if (!discount || discount === 0) {
    return price;
  }
  return price - (price * discount) / 100;
}

function calculateDiscountAmount(price, discount) {
  if (!discount || discount === 0) {
    return 0;
  }
  return (price * discount) / 100;
}

// ====================================
// User Session Management
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}

/**
 * Get logged in user data
 */
function getLoggedInUser() {
  const userJSON = sessionStorage.getItem("loggedInUser");
  return userJSON ? JSON.parse(userJSON) : null;
}

/**
 * Get logged in user's TRN
 */
function getLoggedInUserTRN() {
  const user = getLoggedInUser();
  return user ? user.trn : null;
}

// ====================================
// Cart Management - Integrated with User Accounts
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Get cart from logged in user's account or temporary cart
 */
function getCart() {
  if (isUserLoggedIn()) {
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = registrationData.find((u) => u.trn === userTRN);

    if (user && user.cart) {
      return user.cart.items || [];
    }
    return [];
  } else {
    const cartData = localStorage.getItem("tempCart");
    return cartData ? JSON.parse(cartData) : [];
  }
}

/**
 * Save cart to logged in user's account or temporary storage
 */
function saveCart(cart) {
  if (isUserLoggedIn()) {
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
    localStorage.setItem("tempCart", JSON.stringify(cart));
  }
}

/**
 * Merge temporary cart with user's cart on login
 */
function mergeTemporaryCart(userTRN) {
  const tempCart = localStorage.getItem("tempCart");

  if (tempCart) {
    const tempItems = JSON.parse(tempCart);

    if (tempItems.length > 0) {
      const registrationData =
        JSON.parse(localStorage.getItem("RegistrationData")) || [];
      const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

      if (userIndex !== -1) {
        const userCart = registrationData[userIndex].cart?.items || [];

        tempItems.forEach((tempItem) => {
          const existingItem = userCart.find((item) => item.id === tempItem.id);
          if (existingItem) {
            existingItem.quantity += tempItem.quantity;
          } else {
            userCart.push(tempItem);
          }
        });

        registrationData[userIndex].cart = {
          items: userCart,
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
    }

    localStorage.removeItem("tempCart");
  }
}

/**
 * Clear cart for logged in user or temporary cart
 */
function clearCartData() {
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
}

/**
 * Initialize cart count on page load
 */
function initializeCartCount() {
  const cart = getCart();
  updateCartCount(cart);
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

// ====================================
// Navigation and Mobile Menu
// Created by: Dimetri Lee (2404379)
// ====================================

document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Initialize products in localStorage
  initializeProducts();

  // Initialize cart count on all pages
  initializeCartCount();

  // Load featured products on homepage
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    loadFeaturedProducts();
  }

  // Load all products on products page
  const productGrid = document.getElementById("productGrid");
  if (productGrid) {
    loadProducts();
    setupFilters();
  }
});

// ====================================
// Product Display Functions
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Load featured products on homepage
 */
function loadFeaturedProducts() {
  const featuredGrid = document.getElementById("featuredGrid");
  const allProducts = getProductsFromStorage();
  const featuredProducts = allProducts.filter((p) => p.featured);

  featuredGrid.innerHTML = "";

  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    featuredGrid.appendChild(productCard);
  });
}

/**
 * Load all products on products page
 */
function loadProducts(filteredProducts = null) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  const productsToDisplay = filteredProducts || getProductsFromStorage();

  productGrid.innerHTML = "";

  if (productsToDisplay.length === 0) {
    productGrid.innerHTML =
      '<p style="text-align: center; grid-column: 1/-1;">No products found.</p>';
    return;
  }

  productsToDisplay.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

/**
 * Get correct image path based on current location
 */
function getImagePath(imagePath) {
  const isInCodesFolder = window.location.pathname.includes("/Codes/");
  if (isInCodesFolder) {
    return "../" + imagePath;
  }
  return imagePath;
}

/**
 * Create product card element using DOM manipulation
 */
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = getImagePath(product.image);
  img.alt = product.name;
  img.className = "product-image";

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  if (product.discount && product.discount > 0) {
    const discountBadge = document.createElement("span");
    discountBadge.className = "product-discount-badge";
    discountBadge.textContent = `-${product.discount}% OFF`;
    info.appendChild(discountBadge);
  }

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const priceContainer = document.createElement("div");
  priceContainer.className = "product-price-container";

  if (product.discount && product.discount > 0) {
    const originalPrice = document.createElement("span");
    originalPrice.className = "product-original-price";
    originalPrice.textContent = "$" + product.price.toFixed(2);
    priceContainer.appendChild(originalPrice);

    const discountedPrice = document.createElement("div");
    discountedPrice.className = "product-price product-discounted-price";
    const finalPrice = calculateDiscountedPrice(
      product.price,
      product.discount
    );
    discountedPrice.textContent = "$" + finalPrice.toFixed(2);
    priceContainer.appendChild(discountedPrice);
  } else {
    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = "$" + product.price.toFixed(2);
    priceContainer.appendChild(price);
  }

  const addButton = document.createElement("button");
  addButton.className = "btn btn-primary btn-block";
  addButton.textContent = "Add to Cart";

  addButton.addEventListener("click", function () {
    addToCart(product);
  });

  info.appendChild(category);
  info.appendChild(name);
  info.appendChild(description);
  info.appendChild(priceContainer);
  info.appendChild(addButton);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

// ====================================
// Add to Cart Functions
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Add item to cart with localStorage
 */
function addToCart(product) {
  let cart = getCart();

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const filename = product.image.split("/").pop();
    const finalPrice = calculateDiscountedPrice(
      product.price,
      product.discount || 0
    );
    const discountAmount = calculateDiscountAmount(
      product.price,
      product.discount || 0
    );

    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount || 0,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      image: filename,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount(cart);

  let message = product.name + " added to cart!";
  if (product.discount && product.discount > 0) {
    message += ` (${product.discount}% discount applied!)`;
  }
  alert(message);
}

/**
 * Add item to cart from HTML (for hardcoded products)
 */
function addToCartFromHTML(id, name, price, image, discount = 0) {
  let cart = getCart();

  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const finalPrice = calculateDiscountedPrice(price, discount);
    const discountAmount = calculateDiscountAmount(price, discount);

    cart.push({
      id: id,
      name: name,
      price: price,
      discount: discount,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      image: image,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartCount(cart);

  let message = name + " added to cart!";
  if (discount > 0) {
    message += ` (${discount}% discount applied!)`;
  }
  alert(message);
}

// ====================================
// Product Filters
// Created by: Dimetri Lee (2404379)
// ====================================

/**
 * Setup product filters
 */
function setupFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (!categoryFilter || !sortFilter) return;

  categoryFilter.addEventListener("change", applyFilters);
  sortFilter.addEventListener("change", applyFilters);
}

/**
 * Apply filters and sorting
 */
function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  let filteredProducts = [...getProductsFromStorage()];

  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === selectedCategory
    );
  }

  const sortBy = sortFilter.value;
  switch (sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }

  loadProducts(filteredProducts);
}
