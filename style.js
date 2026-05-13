const products = [
  {
    id: 1,
    name: "Silk Midi Dress",
    price: 129.99,
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format",
  },
  {
    id: 2,
    name: "Tail Suit Jacket",
    price: 59.99,
    img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&auto=format",
  },
  {
    id: 3,
    name: "Raw Hem Jeans",
    price: 89.99,
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format",
  },
  {
    id: 4,
    name: "Cashmere Sweater",
    price: 149.99,
    img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&auto=format",
  },
  {
    id: 5,
    name: "Leather Biker Jacket",
    price: 249.99,
    img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format",
  },
  {
    id: 6,
    name: "Sleeve Hoodie",
    price: 99.99,
    img: "images/Hoodie.jpg",
  },
  {
    id: 7,
    name: "Pan Trousers",
    price: 250.99,
    img: "images/Pan trouser.jpg",
  },
  {
    id: 8,
    name: "Crochet Top",
    price: 120.99,
    img: "images/Crochet.jpg",
  },
];

// Cart state
let cart = [];

// DOM elements
const productsGrid = document.getElementById("productsGrid");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalDisplay = document.getElementById("cartTotalDisplay");
const cartCountSpan = document.getElementById("cartCount");
const orderForm = document.getElementById("orderForm");

// Helper functions
function escapeHtml(str) {
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

function updateCartUI() {
  if (!cartItemsContainer) return;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<div class="empty-cart-msg">Your cart feels minimal. Add some magic!</div>`;
    cartTotalDisplay.innerText = `$0.00`;
    cartCountSpan.innerText = "0";
    return;
  }
  let cartHtml = "";
  let total = 0;
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    cartHtml += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <p><strong>${escapeHtml(item.name)}</strong>  x${item.quantity}</p>
            <small>$${item.price.toFixed(2)} each</small>
          </div>
          <div>
            <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      `;
  });
  cartItemsContainer.innerHTML = cartHtml;
  cartTotalDisplay.innerText = `$${total.toFixed(2)}`;
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  cartCountSpan.innerText = totalItems;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      removeFromCart(id);
    });
  });
}

function removeFromCart(productId) {
  const index = cart.findIndex((i) => i.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
}

function addToCart(product, quantity = 1) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity: quantity });
  }
  updateCartUI();
  // feedback toast
  const toast = document.createElement("div");
  toast.innerText = `${product.name} added`;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "20px";
  toast.style.backgroundColor = "#2e241f";
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "40px";
  toast.style.zIndex = "999";
  toast.style.fontSize = "0.8rem";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

// Add & Scroll to cart

function buyNow(product) {
  addToCart(product, 1);
  document
    .querySelector(".cart-order-wrapper")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// render products with event delegation (using data attributes)
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
        <img class="product-img" src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/400x500?text=Sage+Fashion'">
        <div class="product-info">
          <div class="product-name">${escapeHtml(product.name)}</div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="btn-group">
            <button class="btn-add" data-id="${product.id}" data-action="add">ADD TO CART</button>
            <button class="btn-buy" data-id="${product.id}" data-action="buy">BUY NOW</button>
          </div>
        </div>
      `;
    productsGrid.appendChild(card);
  });
}

// event delegation for dynamic product buttons (better reliability)
document.body.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".btn-add");
  const buyBtn = e.target.closest(".btn-buy");
  if (addBtn) {
    const id = parseInt(addBtn.getAttribute("data-id"));
    const prod = products.find((p) => p.id === id);
    if (prod) addToCart(prod, 1);
  }
  if (buyBtn) {
    const id = parseInt(buyBtn.getAttribute("data-id"));
    const prod = products.find((p) => p.id === id);
    if (prod) buyNow(prod);
  }
});

// BRAND SLIDER
const brandsList = [
  "GUCCI",
  "PRADA",
  "LOUIS VUITTON",
  "CHANEL",
  "DIOR",
  "BALENCIAGA",
  "FENDI",
  "VERSACE",
  "SAINT LAURENT",
  "BOTTEGA VENETA",
  "MIU MIU",
  "OFF-WHITE",
  "VALENTINO",
  "BURBERRY",
  "CELINE",
  "GIVENCHY",
  "ALEXANDER MCQUEEN",
  "THE ROW",
];
const brandTrack = document.getElementById("brandTrack");
function populateBrandSlider() {
  const allBrands = [...brandsList, ...brandsList];
  if (brandTrack) {
    brandTrack.innerHTML = allBrands
      .map((brand) => `<div class="brand-item">${brand}</div>`)
      .join("");
  }
}
populateBrandSlider();

// ORDER FORM SUBMIT
function submitOrder(event) {
  event.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!fullName || !email || !address) {
    alert("Please fill full name, email and address to place order.");
    return;
  }
  if (cart.length === 0) {
    alert("Your cart is empty! Add some stunning pieces first.");
    return;
  }
  let orderItems = cart
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");
  let totalAmount = cart
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
    .toFixed(2);
  const message = ` ORDER PLACED! \n\nCustomer: ${fullName}\nEmail: ${email}\nAddress: ${address}\n\nItems: ${orderItems}\nTotal: $${totalAmount}\n\nThank you for shopping with The Sage Fashion.`;
  alert(message + "\n\n( Demo mode - your order will be processed )");
  cart = [];
  updateCartUI();
  document.getElementById("orderForm").reset();
  document
    .querySelector(".cart-order-wrapper")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
if (orderForm) orderForm.addEventListener("submit", submitOrder);

// scroll to top
const scrollBtn = document.getElementById("scrollTop");
if (scrollBtn) {
  scrollBtn.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}

// CART ICON SCROLL FIX: directly to cart-summary section
const cartIcon = document.getElementById("cartIconBtn");
if (cartIcon) {
  cartIcon.addEventListener("click", () => {
    const cartSection = document.querySelector(".cart-summary");
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      document
        .querySelector(".cart-order-wrapper")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

// Book Appointment button interactive (alert demo)
const bookBtn = document.getElementById("fashionBookbtn");
if (bookBtn) {
  bookBtn.addEventListener("click", () => {
    alert(
      "📅 Book a personal styling session at The Sage Fashion. Our team will reach out soon.",
    );
  });
}

// Initialize all
renderProducts();
updateCartUI();
