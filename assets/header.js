const cart_icon_bubble = document.querySelector(".cart-item-bubble");
const cart_drawer = document.querySelector("#cart-drawer");

// Open the cart drawer on click
cart_icon_bubble.addEventListener("click", (e) => {
  document.dispatchEvent(new CustomEvent("cart:open"));
});
