const cart_icon_bubble = document.querySelector(".cart-item-bubble");
const cart_drawer = document.querySelector("#cart-drawer");

// Open the cart drawer on click
cart_icon_bubble.addEventListener("click", (e) => {
  document.dispatchEvent(new CustomEvent("cart:open"));
});

//Update header count
document.addEventListener("cart:updated", (event) => {
  const new_header = document.createElement("div");
  const new_html = event.detail.data_header;

  new_header.innerHTML = new_html;
  document.querySelector(".cart-item-bubble > sup").textContent =
    new_header.querySelector(".cart-item-bubble > sup").textContent;
});
