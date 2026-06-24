class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.cart_drawer = document.querySelector("cart-drawer");
    this.close_cart_drawer = this.cart_drawer.querySelector("#cart-close");
    // Open CartDrawer
    this._openCartDrawer();
    // Close CartDrawer
    this._closeCartDrawer();
  }

  _openCartDrawer() {
    document.addEventListener("cart:open", (e) => {
      if (e.type === "cart:open") {
        this.cart_drawer.querySelector("#cart-drawer").classList.add("is-open");
      }
    });
  }
  _closeCartDrawer() {
    this.close_cart_drawer.addEventListener("click", () => {
      this.cart_drawer
        .querySelector("#cart-drawer")
        .classList.remove("is-open");
    });
  }
}

customElements.define("cart-drawer", CartDrawer);
