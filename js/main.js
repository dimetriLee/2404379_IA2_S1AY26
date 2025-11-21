// IA#2: Main JavaScript file with DOM manipulation and event handling

// IA#2: Product data array (simulating database)
const products = [
  {
    id: 1,
    name: "Pro Elite Attack Stick",
    description: "Premium attack lacrosse stick with carbon fiber shaft",
    price: 299.99,
    category: "sticks",
    image: "assets/attackStick.webp",
    featured: true,
  },
  {
    id: 2,
    name: "Defender Pro Stick",
    description: "Heavy-duty defense stick for maximum control",
    price: 249.99,
    category: "sticks",
    image: "assets/defenseStick.webp",
    featured: true,
  },
  {
    id: 3,
    name: "Elite Protective Helmet",
    description: "Advanced protection with superior ventilation",
    price: 199.99,
    category: "protective",
    image: "assets/helmet.jpg",
    featured: true,
  },
  {
    id: 4,
    name: "Pro Grip Gloves",
    description: "Enhanced grip and flexibility for better control",
    price: 149.99,
    category: "protective",
    image: "assets/gloves.webp",
    featured: false,
  },
  {
    id: 5,
    name: "Performance Shoulder Pads",
    description: "Lightweight protection without sacrificing mobility",
    price: 179.99,
    category: "protective",
    image: "assets/shoulder.webp",
    featured: false,
  },
  {
    id: 6,
    name: "Training Ball Pack",
    description: "Set of 6 official regulation lacrosse balls",
    price: 29.99,
    category: "accessories",
    image: "assets/balls.webp",
    featured: false,
  },
];

// IA#2: Function to initialize cart count on page load
function initializeCartCount() {
  const cart = getCart();
  updateCartCount(cart);
}

// IA#2: Function to get cart from localStorage
function getCart() {
  const cartData = localStorage.getItem("laxproCart");
  return cartData ? JSON.parse(cartData) : [];
}

// IA#2: Function to update cart count in navigation
function updateCartCount(cart) {
  const cartCountElements = document.querySelectorAll("#cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((el) => {
    el.textContent = totalItems;
  });
}

// IA#2: Event listener for mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // IA#2: Initialize cart count on all pages
  initializeCartCount();

  // IA#2: Load featured products on homepage
  const featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    loadFeaturedProducts();
  }

  // IA#2: Load all products on products page
  const productGrid = document.getElementById("productGrid");
  if (productGrid) {
    loadProducts();
    setupFilters();
  }
});

// IA#2: Function to load featured products on homepage
function loadFeaturedProducts() {
  const featuredGrid = document.getElementById("featuredGrid");
  const featuredProducts = products.filter((p) => p.featured);

  featuredGrid.innerHTML = "";

  featuredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    featuredGrid.appendChild(productCard);
  });
}

// IA#2: Function to load all products on products page
function loadProducts(filteredProducts = products) {
  const productGrid = document.getElementById("productGrid");

  if (!productGrid) return;

  productGrid.innerHTML = "";

  if (filteredProducts.length === 0) {
    productGrid.innerHTML =
      '<p style="text-align: center; grid-column: 1/-1;">No products found.</p>';
    return;
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product);
    productGrid.appendChild(productCard);
  });
}

// IA#2: Function to create product card element using DOM manipulation
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.className = "product-image";

  const info = document.createElement("div");
  info.className = "product-info";

  const category = document.createElement("span");
  category.className = "product-category";
  category.textContent =
    product.category.charAt(0).toUpperCase() + product.category.slice(1);

  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = "$" + product.price.toFixed(2);

  const addButton = document.createElement("button");
  addButton.className = "btn btn-primary btn-block";
  addButton.textContent = "Add to Cart";

  // IA#2: Event listener for add to cart button
  addButton.addEventListener("click", function () {
    addToCart(product);
  });

  info.appendChild(category);
  info.appendChild(name);
  info.appendChild(description);
  info.appendChild(price);
  info.appendChild(addButton);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

// IA#2: Function to add item to cart with localStorage
function addToCart(product) {
  let cart = getCart();

  // IA#2: Control structure - check if product exists in cart
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  // IA#2: Save cart to localStorage
  localStorage.setItem("laxproCart", JSON.stringify(cart));

  updateCartCount(cart);

  // IA#2: Show success message
  alert(product.name + " added to cart!");
}

// IA#2: Function to setup product filters
function setupFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  if (!categoryFilter || !sortFilter) return;

  // IA#2: Event listener for category filter
  categoryFilter.addEventListener("change", applyFilters);

  // IA#2: Event listener for sort filter
  sortFilter.addEventListener("change", applyFilters);
}

// IA#2: Function to apply filters and sorting
function applyFilters() {
  const categoryFilter = document.getElementById("categoryFilter");
  const sortFilter = document.getElementById("sortFilter");

  let filteredProducts = [...products];

  // IA#2: Control structure - filter by category
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === selectedCategory
    );
  }

  // IA#2: Control structure - sort products
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
      // Keep original order
      break;
  }

  loadProducts(filteredProducts);
}
