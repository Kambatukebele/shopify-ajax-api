const cartIconBubble = document.querySelector(".cart-item-bubble > sup");

// Open the cart drawer on click
cartIconBubble.addEventListener("click", () => {
  document.dispatchEvent(new CustomEvent("cart:open"));
});

//Update header count
document.addEventListener("cart:updated", (event) => {
  const newHeader = document.createElement("div");
  const newHtml = event.detail.header;

  newHeader.innerHTML = newHtml;
  cartIconBubble.textContent = newHeader.querySelector(
    ".cart-item-bubble > sup",
  ).textContent;
});
