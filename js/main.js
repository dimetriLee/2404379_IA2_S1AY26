// Function to initialize cart count on page load

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
// ====================================

/**
 * Initialize products in localStorage
 * Stores the products array to localStorage with key "AllProducts"
 */
function initializeProducts() {
  // Check if products already exist in localStorage
  const storedProducts = localStorage.getItem("AllProducts");

  if (!storedProducts) {
    // Products don't exist yet - store them
    localStorage.setItem("AllProducts", JSON.stringify(products));
    console.log("Products initialized in localStorage as 'AllProducts'");
  } else {
    console.log("Products already exist in localStorage");
  }
}

/**
 * Get products from localStorage
 * @returns {array} - Array of product objects
 */
function getProductsFromStorage() {
  const storedProducts = localStorage.getItem("AllProducts");
  return storedProducts ? JSON.parse(storedProducts) : products;
}

/**
 * Update a product in localStorage
 * @param {number} productId - ID of product to update
 * @param {object} updatedData - Updated product data
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
 * @param {object} newProduct - New product object
 */
function addProduct(newProduct) {
  let allProducts = getProductsFromStorage();
  allProducts.push(newProduct);
  localStorage.setItem("AllProducts", JSON.stringify(allProducts));
  console.log("New product added to localStorage");
}

// ====================================
// Helper Functions for Discounts
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
// ====================================

/**
 * Check if user is logged in
 * @returns {boolean}
 */
function isUserLoggedIn() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}

/**
 * Get logged in user data
 * @returns {object|null}
 */
function getLoggedInUser() {
  const userJSON = sessionStorage.getItem("loggedInUser");
  return userJSON ? JSON.parse(userJSON) : null;
}

/**
 * Get logged in user's TRN
 * @returns {string|null}
 */
function getLoggedInUserTRN() {
  const user = getLoggedInUser();
  return user ? user.trn : null;
}

// ====================================
// Cart Management - Integrated with User Accounts
// ====================================

/**
 * Get cart from logged in user's account or temporary cart
 * @returns {array}
 */
function getCart() {
  if (isUserLoggedIn()) {
    // User is logged in - get cart from their RegistrationData
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const user = registrationData.find((u) => u.trn === userTRN);

    if (user && user.cart) {
      // Cart is stored as object with items array
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
 * @param {array} cart
 */
function saveCart(cart) {
  if (isUserLoggedIn()) {
    // User is logged in - save to their RegistrationData
    const userTRN = getLoggedInUserTRN();
    const registrationData =
      JSON.parse(localStorage.getItem("RegistrationData")) || [];
    const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

    if (userIndex !== -1) {
      // Update user's cart
      registrationData[userIndex].cart = {
        items: cart,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem(
        "RegistrationData",
        JSON.stringify(registrationData)
      );

      // Also update session storage
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
 * Merge temporary cart with user's cart on login
 * @param {string} userTRN
 */
function mergeTemporaryCart(userTRN) {
  const tempCart = localStorage.getItem("tempCart");

  if (tempCart) {
    const tempItems = JSON.parse(tempCart);

    if (tempItems.length > 0) {
      // Get user's existing cart
      const registrationData =
        JSON.parse(localStorage.getItem("RegistrationData")) || [];
      const userIndex = registrationData.findIndex((u) => u.trn === userTRN);

      if (userIndex !== -1) {
        const userCart = registrationData[userIndex].cart?.items || [];

        // Merge carts - add quantities if item exists, otherwise add new item
        tempItems.forEach((tempItem) => {
          const existingItem = userCart.find((item) => item.id === tempItem.id);
          if (existingItem) {
            existingItem.quantity += tempItem.quantity;
          } else {
            userCart.push(tempItem);
          }
        });

        // Save merged cart
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

    // Clear temporary cart
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

// Function to initialize cart count on page load
function initializeCartCount() {
  const cart = getCart();
  updateCartCount(cart);
}

// Function to update cart count in navigation
function updateCartCount(cart) {
  const cartCountElements = document.querySelectorAll("#cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

// Event listener for mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Initialize products in localStorage (Requirement 2b)
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

// Function to load featured products on homepage
function loadFeaturedProducts() {
  const featuredGrid = document.getElementById("featuredGrid");
  // Get products from localStorage instead of hardcoded array
  const allProducts = getProductsFromStorage();
  const featuredProducts = allProducts.filter((p) => p.featured);

  featuredGrid.innerHTML = "";

  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    featuredGrid.appendChild(productCard);
  });
}

// Function to load all products on products page
function loadProducts(filteredProducts = null) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  // Get products from localStorage if no filtered products provided
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

// Function to get correct image path based on current location
function getImagePath(imagePath) {
  // Check if we're in the Codes folder or root
  const isInCodesFolder = window.location.pathname.includes("/Codes/");
  if (isInCodesFolder) {
    return "../" + imagePath;
  }
  return imagePath;
}

// Function to create product card element using DOM manipulation
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

  // Add discount badge if product has a discount
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

  // Price section with original and discounted price
  const priceContainer = document.createElement("div");
  priceContainer.className = "product-price-container";

  if (product.discount && product.discount > 0) {
    // Show original price with strikethrough
    const originalPrice = document.createElement("span");
    originalPrice.className = "product-original-price";
    originalPrice.textContent = "$" + product.price.toFixed(2);
    priceContainer.appendChild(originalPrice);

    // Show discounted price
    const discountedPrice = document.createElement("div");
    discountedPrice.className = "product-price product-discounted-price";
    const finalPrice = calculateDiscountedPrice(
      product.price,
      product.discount
    );
    discountedPrice.textContent = "$" + finalPrice.toFixed(2);
    priceContainer.appendChild(discountedPrice);
  } else {
    // Show regular price
    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = "$" + product.price.toFixed(2);
    priceContainer.appendChild(price);
  }

  const addButton = document.createElement("button");
  addButton.className = "btn btn-primary btn-block";
  addButton.textContent = "Add to Cart";

  // Event listener for add to cart button
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

// Function to add item to cart with localStorage
function addToCart(product) {
  let cart = getCart();

  //check if product exists in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    // Extract just the filename from the path
    const filename = product.image.split("/").pop();

    // Calculate final price after discount
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

  // Save cart using new integrated function
  saveCart(cart);
  updateCartCount(cart);

  // Show success message
  let message = product.name + " added to cart!";
  if (product.discount && product.discount > 0) {
    message += ` (${product.discount}% discount applied!)`;
  }
  alert(message);
}

// Function to add item to cart from HTML (for hardcoded products)
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

// Function to setup product filters
function setupFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (!categoryFilter || !sortFilter) return;

  // Event listener for category filter
  categoryFilter.addEventListener("change", applyFilters);

  // Event listener for sort filter
  sortFilter.addEventListener("change", applyFilters);
}

// Function to apply filters and sorting
function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  // Get products from localStorage
  let filteredProducts = [...getProductsFromStorage()];

  // Control structure - filter by category
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === selectedCategory
    );
  }

  // Control structure - sort products
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

// =================================================================
// Question 6. Additional Functionality: User Frequency and Invoices
// =================================================================

/**
 * 6a. ShowUserFrequency() - Displays user frequency based on Gender and Age Group
 * This function calculates the counts and dynamically renders bar charts on the dashboard.
 */
function ShowUserFrequency() {
  // 1. Get Data
  const registrationData =
    JSON.parse(localStorage.getItem("RegistrationData")) || [];

  if (registrationData.length === 0) {
    document.getElementById("genderChart").innerHTML =
      "<p>No registered users found for analysis.</p>";
    document.getElementById("ageChart").innerHTML = "";
    return;
  }

  // Initialize counts
  const genderCounts = {};
  const ageCounts = {
    "18-25": 0,
    "26-35": 0,
    "36-50": 0,
    "50+": 0,
  };
  let maxCount = 0; // To normalize bar chart lengths

  // 2. Process Data
  registrationData.forEach((user) => {
    // --- Gender Count (Case-insensitive) ---
    const gender = user.gender ? user.gender.toLowerCase() : "other";
    genderCounts[gender] = (genderCounts[gender] || 0) + 1;

    // --- Age Group Count ---
    const age = calculateAge(user.dateOfBirth || user.dob);

    if (age >= 18 && age <= 25) {
      ageCounts["18-25"]++;
    } else if (age >= 26 && age <= 35) {
      ageCounts["26-35"]++;
    } else if (age >= 36 && age <= 50) {
      ageCounts["36-50"]++;
    } else if (age > 50) {
      ageCounts["50+"]++;
    }
  });

  // 3. Find max count for normalization (for visual bar length)
  maxCount = Math.max(
    ...Object.values(genderCounts),
    ...Object.values(ageCounts)
  );
  if (maxCount === 0) maxCount = 1; // Avoid division by zero

  // 4. Render Charts
  renderChart("genderChart", genderCounts, maxCount, "Gender");
  renderChart("ageChart", ageCounts, maxCount, "Age Group");

  /**
   * Helper function to calculate age from DOB (YYYY-MM-DD format).
   */
  function calculateAge(dob) {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Helper function to dynamically render a bar chart using HTML/CSS.
   */
  function renderChart(elementId, counts, max, title) {
    const container = document.getElementById(elementId);
    let html = "";

    for (const [key, count] of Object.entries(counts)) {
      const percentage = (count / max) * 100;
      const label = key.charAt(0).toUpperCase() + key.slice(1);

      html += `
                <div class="bar-wrapper" role="listitem" aria-label="${label}: ${count} users">
                    <span class="bar-label">${label}:</span>
                    <div class="bar" style="width: ${
                      percentage * 0.8
                    }%;"></div> 
                    <span>${count}</span>
                </div>
            `;
    }
    container.innerHTML = html;
  }
}

/**
 * 6b. ShowInvoices() - Displays all invoices and allows searching by TRN.
 * Results are logged to the console.
 */
function ShowInvoices(searchTrn = null) {
  const allInvoices = JSON.parse(localStorage.getItem("AllInvoices")) || [];

  console.log("=====================================");
  console.log("6b. ShowInvoices() - All Invoices Data");
  console.log("=====================================");

  if (allInvoices.length === 0) {
    console.log("No invoices found in AllInvoices localStorage.");
    return;
  }

  let results = allInvoices;
  let message = `Total Invoices Found: ${allInvoices.length}`;

  if (searchTrn && searchTrn.trim() !== "") {
    const trn = searchTrn.trim();
    results = allInvoices.filter((invoice) => invoice.userTRN === trn);
    message = `Invoices for TRN ${trn}: ${results.length} found.`;
  }

  console.log(message);
  if (results.length > 0) {
    console.table(
      results.map((inv) => ({
        "Invoice #": inv.invoiceNumber,
        Date: inv.date,
        TRN: inv.userTRN,
        Total: `$${inv.total.toFixed(2)}`,
        Name: inv.shippingInfo.fullName,
      }))
    );
  } else {
    console.log(
      `No invoices found matching the search criteria (TRN: ${searchTrn}).`
    );
  }
}

/**
 * 6c. GetUserInvoices() - Displays all the invoices for a specific user based on TRN.
 * Results are logged to the console, specifically from the RegistrationData object.
 */
function GetUserInvoices(trn) {
  console.log("=====================================");
  console.log("6c. GetUserInvoices() - User Invoice History");
  console.log("=====================================");

  const registrationData =
    JSON.parse(localStorage.getItem("RegistrationData")) || [];
  const user = registrationData.find((u) => u.trn === trn);

  if (!user) {
    console.log(`Error: User with TRN ${trn} not found in RegistrationData.`);
    return;
  }

  const userInvoices = user.invoices || [];

  console.log(`User: ${user.firstName} ${user.lastName} (TRN: ${trn})`);
  console.log(`Total Invoices for this User: ${userInvoices.length}`);

  if (userInvoices.length > 0) {
    console.table(
      userInvoices.map((inv) => ({
        "Invoice #": inv.invoiceNumber,
        Date: inv.date,
        Subtotal: `$${inv.subtotal.toFixed(2)}`,
        Total: `$${inv.total.toFixed(2)}`,
      }))
    );
  } else {
    console.log(
      `This user has no invoices recorded in their RegistrationData profile.`
    );
  }
}

// =================================================================
// DOM Content Loaded Handler
// =================================================================

document.addEventListener("DOMContentLoaded", function () {
  // Initialize products in localStorage (Requirement 2b)
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

  // --- Dashboard Specific Initialization ---
  if (document.querySelector(".dashboard-container")) {
    // Run frequency analysis immediately
    ShowUserFrequency();

    // Setup listener for GetUserInvoices form
    const getUserInvoicesForm = document.getElementById("getUserInvoicesForm");
    if (getUserInvoicesForm) {
      getUserInvoicesForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const trn = document.getElementById("userTrnInput").value;
        GetUserInvoices(trn);
        alert(`Results for TRN ${trn} logged to console (F12).`);
      });
    }

    // Setup listener for ShowInvoices form
    const showInvoicesForm = document.getElementById("showInvoicesForm");
    if (showInvoicesForm) {
      showInvoicesForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const trn = document.getElementById("allInvoicesTrnInput").value;
        ShowInvoices(trn);
        const message = trn
          ? `Search results for TRN ${trn} logged to console (F12).`
          : "All invoices logged to console (F12).";
        alert(message);
      });
    }

    // Initial log to guide the user
    console.log(
      "Dashboard Loaded. Use the search forms to execute invoice retrieval functions."
    );
  }
});
