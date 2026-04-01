/* =====================================================
   GADGETNEST — script.js
   Features: Cart, Filter, Countdown, Newsletter,
             Hamburger Nav, Marquee, Scroll Reveal,
             Promo Code, Auto Year
   ===================================================== */

/* ─── 1. PRODUCT DATA ─────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "Luxury Leather iPhone 15 Case",
    brand: "iPhone Case",
    price: 4500,
    originalPrice: 6000,
    image: "images/iPhoneLeatherPocketCase15.webp",
    tag: "Hot",
    rating: "4.9",
    reviews: 128,
    category: "cases",
  },
  {
    id: 2,
    name: "Samsung S24 Ultra Clear Case",
    brand: "Samsung Case",
    price: 3500,
    originalPrice: 4500,
    image: "images/Samsung ultra 24 case.jpg",
    tag: "New",
    rating: "4.8",
    reviews: 94,
    category: "cases",
  },
  {
    id: 3,
    name: "Premium AirPods Pro Case",
    brand: "AirPods Case",
    price: 2200,
    originalPrice: 3000,
    image: "images/Airpods pro case.jpg",
    tag: "Sale",
    rating: "4.7",
    reviews: 67,
    category: "audio",
  },
  {
    id: 4,
    name: "65W Fast Charger + Cable",
    brand: "Charger",
    price: 3800,
    originalPrice: 5000,
    image: "images/65w fast charger.jpg",
    tag: "Hot",
    rating: "4.9",
    reviews: 215,
    category: "power",
  },
  {
    id: 5,
    name: "20,000mAh Slim Power Bank",
    brand: "Power Bank",
    price: 7000,
    originalPrice: 9500,
    image: "images/slim power bank.webp",
    tag: "Best Seller",
    rating: "4.8",
    reviews: 183,
    category: "power",
  },
  {
    id: 6,
    name: "Wireless Qi Charging Pad",
    brand: "Wireless Charger",
    price: 5500,
    originalPrice: 7000,
    image: "images/Wireless qi chargers.jpg",
    tag: "New",
    rating: "4.6",
    reviews: 72,
    category: "power",
  },
  {
    id: 7,
    name: "Crystal Clear Screen Protector",
    brand: "Screen Protector",
    price: 1500,
    originalPrice: 2500,
    image: "images/Crystal_clear_screen_protector.jpg",
    tag: "Top Pick",
    rating: "4.6",
    reviews: 360,
    category: "protection",
  },
  {
    id: 8,
    name: "True Wireless Earbuds Pro",
    brand: "Earbuds",
    price: 8500,
    originalPrice: 12000,
    image: "images/True wireless earbuds.webp",
    tag: "Sale",
    rating: "4.8",
    reviews: 156,
    category: "audio",
  },
];

/* ─── 2. CART STATE ───────────────────────────────── */
let cart = JSON.parse(localStorage.getItem("gnCart") || "[]");
let promoApplied = false;

function saveCart() {
  localStorage.setItem("gnCart", JSON.stringify(cart));
}

/* ─── 3. RENDER PRODUCTS ──────────────────────────── */
function renderProducts(filter = "all") {
  const grid = document.querySelector(".radio");
  if (!grid) return;

  const filtered =
    filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  grid.innerHTML = filtered
    .map(
      (p) => `
    <div class="role" data-category="${p.category}">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <span class="tag">${p.tag}</span>
      <div class="collection">
        <div class="brand">${p.brand}</div>
        <h4 class="text">${p.name}</h4>
        <div class="star">${"⭐".repeat(Math.round(parseFloat(p.rating)))} ${p.rating} (${p.reviews})</div>
        <div class="naira">
          <span class="cancel">₦${p.originalPrice.toLocaleString()}</span>
          ₦${p.price.toLocaleString()}
        </div>
      </div>
      <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `
    )
    .join("");
}

/* ─── 4. FILTER TABS ──────────────────────────────── */
function filterProducts(btn, category) {
  document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(category);
}

/* ─── 5. ADD TO CART ──────────────────────────────── */
function addToCart(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`✅ ${product.name} added to cart!`);
  openCart();
}

/* ─── 6. UPDATE CART UI ───────────────────────────── */
function updateCartUI() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;
  document.getElementById("cartHeaderCount").textContent =
    totalQty === 1 ? "1 item" : `${totalQty} items`;

  const cartEmpty = document.getElementById("cartEmpty");
  const cartItems = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");

  if (cart.length === 0) {
    cartEmpty.style.display = "flex";
    cartItems.style.display = "none";
    cartFooter.style.display = "none";
    return;
  }

  cartEmpty.style.display = "none";
  cartItems.style.display = "block";
  cartFooter.style.display = "block";

  cartItems.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" id="cart-item-${item.id}">
      <img class="cart-item-img" src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-brand">${item.brand}</div>
        <div class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  updateTotals();
}

/* ─── 7. CHANGE QUANTITY ──────────────────────────── */
function changeQty(productId, delta) {
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else {
    saveCart();
    updateCartUI();
  }
}

/* ─── 8. REMOVE FROM CART ─────────────────────────── */
function removeFromCart(productId) {
  cart = cart.filter((i) => i.id !== productId);
  saveCart();
  updateCartUI();
}

/* ─── 9. CLEAR CART ───────────────────────────────── */
function clearCart() {
  if (!confirm("Clear all items from your cart?")) return;
  cart = [];
  promoApplied = false;
  saveCart();
  updateCartUI();
}

/* ─── 10. TOTALS ──────────────────────────────────── */
function updateTotals() {
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const total = subtotal - discount;

  document.getElementById("cartSubtotal").textContent = `₦${subtotal.toLocaleString()}`;
  document.getElementById("cartTotal").textContent = `₦${total.toLocaleString()}`;

  const discountRow = document.getElementById("discountRow");
  if (promoApplied) {
    discountRow.style.display = "flex";
    document.getElementById("cartDiscount").textContent = `-₦${discount.toLocaleString()}`;
  } else {
    discountRow.style.display = "none";
  }
}

/* ─── 11. PROMO CODE ──────────────────────────────── */
function applyPromo() {
  const code = document.getElementById("promoInput").value.trim().toUpperCase();
  const valid = ["VAULT20", "NEST20", "GADGET20"];

  if (promoApplied) {
    showToast("⚠️ A promo code is already applied!", "warn");
    return;
  }
  if (valid.includes(code)) {
    promoApplied = true;
    updateTotals();
    showToast("🎉 Promo applied! 20% discount unlocked.");
    document.getElementById("promoInput").value = "";
  } else {
    showToast("❌ Invalid promo code. Try VAULT20 or NEST20.", "error");
  }
}

/* ─── 12. CHECKOUT ────────────────────────────────── */
function checkout() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = promoApplied ? total * 0.2 : 0;
  const finalTotal = total - discount;

  showToast(`🛍️ Order placed! Total: ₦${finalTotal.toLocaleString()}. Redirecting to WhatsApp…`);

  const itemsList = cart
    .map((i) => `• ${i.name} x${i.qty} — ₦${(i.price * i.qty).toLocaleString()}`)
    .join("%0A");
  const msg = `Hello GadgetNest! 👋%0A%0AI'd like to order:%0A${itemsList}%0A%0ATotal: ₦${finalTotal.toLocaleString()}${promoApplied ? "%0APromo applied: 20% off" : ""}`;

  setTimeout(() => {
    window.open(`https://wa.me/2348027626795?text=${msg}`, "_blank");
    cart = [];
    promoApplied = false;
    saveCart();
    updateCartUI();
    closeCart();
  }, 1500);
}

/* ─── 13. OPEN / CLOSE CART ───────────────────────── */
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ─── 14. TOAST NOTIFICATION ─────────────────────── */
function showToast(message, type = "success") {
  let toast = document.getElementById("gnToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "gnToast";
    document.body.appendChild(toast);
  }

  const colors = {
    success: "linear-gradient(135deg,#4ade80,#22c55e)",
    warn: "linear-gradient(135deg,#fbbf24,#f59e0b)",
    error: "linear-gradient(135deg,#f87171,#ef4444)",
  };

  toast.style.cssText = `
    position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(100px);
    background:${colors[type]}; color:#fff; padding:14px 24px; border-radius:12px;
    font-size:0.95rem; font-weight:600; z-index:9999; box-shadow:0 8px 32px rgba(0,0,0,.3);
    transition:transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.4s ease;
    white-space:nowrap; max-width:90vw; text-align:center;
  `;
  toast.textContent = message;
  toast.style.opacity = "1";

  requestAnimationFrame(() => {
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.opacity = "0";
  }, 3000);
}

/* ─── 15. NEWSLETTER ──────────────────────────────── */
function subscribeNewsletter() {
  const input = document.getElementById("emailInput");
  const email = input.value.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("⚠️ Please enter a valid email address.", "warn");
    return;
  }

  showToast("🎉 You're subscribed! Check your inbox for a welcome gift.");
  input.value = "";
}

/* ─── 16. HAMBURGER / MOBILE NAV ──────────────────── */
function initHamburger() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.getElementById("mobileOverlay");
  if (!hamburger) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("open");
    overlay.classList.toggle("open");
    document.body.style.overflow = navLinks.classList.contains("open") ? "hidden" : "";
  });

  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

/* ─── 17. COUNTDOWN TIMER ─────────────────────────── */
function initCountdown() {
  const END_KEY = "gnCountdownEnd";
  let endTime = localStorage.getItem(END_KEY);

  if (!endTime || Date.now() > Number(endTime)) {
    endTime = Date.now() + 4 * 60 * 60 * 1000 + 23 * 60 * 1000 + 59 * 1000;
    localStorage.setItem(END_KEY, endTime);
  }

  function tick() {
    const diff = Number(endTime) - Date.now();
    if (diff <= 0) {
      localStorage.removeItem(END_KEY);
      ["cdH", "cdM", "cdS"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      return;
    }

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const fmt = (n) => String(n).padStart(2, "0");
    const cdH = document.getElementById("cdH");
    const cdM = document.getElementById("cdM");
    const cdS = document.getElementById("cdS");

    if (cdH) cdH.textContent = fmt(h);
    if (cdM) cdM.textContent = fmt(m);
    if (cdS) cdS.textContent = fmt(s);
  }

  tick();
  setInterval(tick, 1000);
}

/* ─── 18. SCROLL REVEAL ───────────────────────────── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".role, .frame, .review-card, .feature-item, .feature-blob, .reveal"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

  // Add .visible styles
  const style = document.createElement("style");
  style.textContent = `
    .role.visible, .frame.visible, .review-card.visible,
    .feature-item.visible, .feature-blob.visible, .reveal.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    /* Cart item styles injected here for portability */
    .cart-item {
      display: flex; gap: 14px; padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .cart-item-img {
      width: 72px; height: 72px; object-fit: cover;
      border-radius: 10px; flex-shrink: 0;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .cart-item-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .cart-item-name { font-weight: 600; font-size: 0.9rem; line-height: 1.3; }
    .cart-item-brand { font-size: 0.78rem; opacity: 0.5; }
    .cart-item-price { font-size: 0.95rem; font-weight: 700; color: var(--sky, #38bdf8); }
    .cart-item-controls { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .qty-btn {
      width: 28px; height: 28px; border-radius: 50%; border: none;
      background: rgba(255,255,255,0.1); color: inherit;
      cursor: pointer; font-size: 1.1rem; display: flex;
      align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .qty-btn:hover { background: rgba(255,255,255,0.2); }
    .qty-display { font-weight: 700; min-width: 20px; text-align: center; }
    .remove-btn {
      margin-left: auto; background: none; border: none;
      cursor: pointer; font-size: 1.1rem; opacity: 0.6;
      transition: opacity 0.2s;
    }
    .remove-btn:hover { opacity: 1; }
    .cart-items { padding: 0 4px; }
    .cart-drawer.open { transform: translateX(0) !important; }
    .cart-overlay.open { opacity: 1 !important; pointer-events: all !important; }
    .nav-links.open {
      display: flex !important; flex-direction: column;
      position: fixed; top: 70px; left: 0; right: 0;
      background: var(--bg, #0f172a); padding: 24px;
      z-index: 998; gap: 20px;
    }
    .mobile-overlay.open {
      display: block !important; position: fixed;
      inset: 0; z-index: 997;
      background: rgba(0,0,0,0.6);
    }
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
    .hamburger span { display: block; transition: transform 0.3s, opacity 0.3s; }
  `;
  document.head.appendChild(style);
}

/* ─── 19. STICKY NAV ──────────────────────────────── */
function initStickyNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    nav.style.boxShadow =
      window.scrollY > 40 ? "0 4px 30px rgba(0,0,0,.4)" : "none";
  });
}

/* ─── 20. SMOOTH SCROLL FOR NAV LINKS ─────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ─── 21. AUTO YEAR ───────────────────────────────── */
function initYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

/* ─── 22. CART ITEM STYLES (inject via JS) ─────────── */
// Already handled inside initScrollReveal style block above.

/* ─── 23. BOOT ─────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initYear();
  renderProducts();
  updateCartUI();
  initHamburger();
  initCountdown();
  initScrollReveal();
  initStickyNav();
  initSmoothScroll();
});