// ===== Sample Products Data =====
const products = [
  {
    id: 1,
    name: "Premium Leather Seat Cover",
    category: "leather",
    price: 2500,
    description: "Genuine leather with superior comfort and style",
    featured: true,
  },
  {
    id: 2,
    name: "Luxury Fabric Cover",
    category: "fabric",
    price: 1800,
    description: "Breathable fabric with elegant design",
    featured: true,
  },
  {
    id: 3,
    name: "Sport Racing Style",
    category: "premium",
    price: 3200,
    description: "Race-inspired design with premium materials",
    featured: true,
  },
  {
    id: 4,
    name: "Classic Leather Set",
    category: "leather",
    price: 2800,
    description: "Timeless design with modern comfort",
    featured: false,
  },
  {
    id: 5,
    name: "Comfort Plus Fabric",
    category: "fabric",
    price: 1500,
    description: "Ultra-comfortable fabric technology",
    featured: false,
  },
  {
    id: 6,
    name: "Executive Premium",
    category: "premium",
    price: 4000,
    description: "Top-tier luxury for executive vehicles",
    featured: false,
  },
  {
    id: 7,
    name: "Sporty Leather Combo",
    category: "leather",
    price: 2900,
    description: "Perfect blend of sport and luxury",
    featured: false,
  },
  {
    id: 8,
    name: "Eco-Friendly Fabric",
    category: "fabric",
    price: 1600,
    description: "Sustainable materials, premium quality",
    featured: false,
  },
];

// ===== Cart Management =====
let cart = JSON.parse(localStorage.getItem("elfatehCart")) || [];

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("elfatehCart", JSON.stringify(cart));
  updateCartCount();
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  showNotification("Product added to cart!");
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
  showNotification("Product removed from cart");
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      renderCart();
    }
  }
}

// ===== Render Functions =====
function renderProducts(container, productsToShow, showAddToCart = true) {
  const gridElement = document.getElementById(container);
  if (!gridElement) return;

  gridElement.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="product-card">
            ${product.featured ? '<span class="product-badge">Featured</span>' : ""}
            <div class="product-image">
                <img src="photo/photo${product.id}.jpg" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas fa-couch\'></i>';">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${product.category.toUpperCase()}</p>
                <p class="product-price">${product.price} EGP</p>
                ${
                  showAddToCart
                    ? `
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                `
                    : ""
                }
            </div>
        </div>
    `,
    )
    .join("");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const subtotalElement = document.getElementById("subtotal");
  const deliveryElement = document.getElementById("delivery");
  const totalElement = document.getElementById("total");

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some premium seat covers to get started</p>
                <button class="cta-btn" data-page="products">Start Shopping</button>
            </div>
        `;
    subtotalElement.textContent = "0 EGP";
    totalElement.textContent = "50 EGP";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="photo/photo${item.id}.jpg" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\'fas fa-couch\'></i>';">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="cart-item-price">${item.price} EGP</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `,
    )
    .join("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const delivery = 50;
  const total = subtotal + delivery;

  subtotalElement.textContent = `${subtotal} EGP`;
  deliveryElement.textContent = `${delivery} EGP`;
  totalElement.textContent = `${total} EGP`;
}

// ===== Page Navigation =====
function navigateToPage(pageName) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  const targetPage = document.getElementById(`${pageName}Page`);
  if (targetPage) {
    targetPage.classList.add("active");
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.page === pageName) {
      link.classList.add("active");
    }
  });

  document.getElementById("mobileMenu").classList.remove("active");
  window.scrollTo(0, 0);

  if (pageName === "cart") {
    renderCart();
  }
}

// ===== Theme Toggle =====
function toggleTheme() {
  document.body.classList.toggle("light-mode");
  const isLightMode = document.body.classList.contains("light-mode");
  localStorage.setItem("elfatehTheme", isLightMode ? "light" : "dark");

  const themeIcon = document.querySelector("#themeToggle i");
  themeIcon.className = isLightMode ? "fas fa-sun" : "fas fa-moon";
}

// ===== Filter Products =====
function filterProducts(category) {
  const filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  renderProducts("allProducts", filteredProducts);

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === category) {
      btn.classList.add("active");
    }
  });
}

// ===== Checkout =====
function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }

  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked',
  ).value;
  const total =
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50;

  let message = `🛒 *New Order from Elfateh Drive*\n\n`;
  message += `*Order Details:*\n`;
  cart.forEach((item) => {
    message += `• ${item.name} x${item.quantity} = ${item.price * item.quantity} EGP\n`;
  });
  message += `\n*Delivery:* 50 EGP\n`;
  message += `*Total:* ${total} EGP\n\n`;
  message += `*Payment Method:* ${paymentMethod === "instapay" ? "InstaPay" : "Vodafone Cash"}\n`;

  const whatsappURL = `https://wa.me/201005530527?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, "_blank");

  showNotification("Redirecting to WhatsApp...");
}

// ===== Notification =====
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === "success" ? "linear-gradient(135deg, #c9a961, #d4b574)" : "#e74c3c"};
        color: ${type === "success" ? "#0a1628" : "white"};
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== Event Listeners =====
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("elfatehTheme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    document.querySelector("#themeToggle i").className = "fas fa-sun";
  }

  const featuredProducts = products.filter((p) => p.featured);
  renderProducts("featuredProducts", featuredProducts);
  renderProducts("allProducts", products);

  updateCartCount();

  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.toggle("active");
  });

  document.getElementById("cartBtn").addEventListener("click", () => {
    navigateToPage("cart");
  });

  document.getElementById("checkoutBtn").addEventListener("click", checkout);

  document
    .querySelectorAll(
      ".nav-link, .mobile-link, [data-page], .footer-section a[data-page]",
    )
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        if (page) {
          navigateToPage(page);
        }
      });
    });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterProducts(btn.dataset.filter);
    });
  });

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = e.target[0].value;
      const phone = e.target[1].value;
      const message = e.target[2].value;

      const whatsappMessage = `*Contact Form Submission*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`;
      const whatsappURL = `https://wa.me/201005530527?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(whatsappURL, "_blank");
      contactForm.reset();
      showNotification("Redirecting to WhatsApp...");
    });
  }

  document.querySelectorAll(".logo, .footer-logo").forEach((logo) => {
    logo.addEventListener("click", () => navigateToPage("home"));
  });
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
