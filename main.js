const cartButton = document.getElementById("cartButton");
const closeCart = document.getElementById("closeCart");
const cartDrawer = document.getElementById("cartDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const addButtons = document.querySelectorAll(".add-button");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

const cart = [];

function setNavOpen(isOpen) {
    siteNav.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
}

function openCart() {
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("show");
    document.body.classList.add("drawer-open");
    cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("show");
    document.body.classList.remove("drawer-open");
    cartDrawer.setAttribute("aria-hidden", "true");
}

function formatPrice(value) {
    return `\u20B9${value.toLocaleString("en-IN")}`;
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);

    if (!cart.length) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add some royal dishes.</p>';
        return;
    }

    cartItems.innerHTML = cart
        .map((item, index) => {
            const lineTotal = item.quantity * item.price;
            return `
        <div class="cart-row">
          <div>
            <strong>${item.name}</strong>
            <span>${formatPrice(item.price)} each</span>
          </div>
          <div>
            <div class="cart-qty">
              <button class="qty-button" data-index="${index}" data-action="decrease">-</button>
              <span>${item.quantity}</span>
              <button class="qty-button" data-index="${index}" data-action="increase">+</button>
            </div>
            <strong>${formatPrice(lineTotal)}</strong>
          </div>
        </div>
      `;
        })
        .join("");
}

function addToCart(name, price) {
    const existing = cart.find((item) => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name,
            price: Number(price),
            quantity: 1
        });
    }

    updateCart();
    openCart();
}

addButtons.forEach((button) => {
    button.addEventListener("click", () => {
        addToCart(button.dataset.name, button.dataset.price);
    });
});

cartItems.addEventListener("click", (event) => {
    const button = event.target.closest(".qty-button");
    if (!button) return;

    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    const item = cart[index];

    if (!item) return;

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    updateCart();
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
drawerBackdrop.addEventListener("click", closeCartDrawer);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeCartDrawer();
    }
});

navToggle.addEventListener("click", () => {
    setNavOpen(!siteNav.classList.contains("open"));
});

siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        setNavOpen(false);
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 820) {
        setNavOpen(false);
    }
});

document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    input.value = "";
    input.placeholder = "Subscribed successfully";
});

updateCart();
