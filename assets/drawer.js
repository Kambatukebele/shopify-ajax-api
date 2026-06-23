class Drawer extends HTMLElement {
  connectedCallback() {
    this.drawer = document.querySelector("#cart-drawer");
    this.closeBtn = this.querySelector("#cart-close");
    this.closeBtn.addEventListener("click", () => {
      this.drawer.classList.add("hidden");
    });
  }
}

customElements.define("cart-drawer", Drawer);
