class CartDrawer extends HTMLElement {
  connectedCallback() {
    this.cart_drawer = document.querySelector("cart-drawer");
    this.close_cart_drawer = this.cart_drawer.querySelector("#cart-close");

    // Open CartDrawer
    this._openCartDrawer();
    // Close CartDrawer
    this._closeCartDrawer();

    //
    this._handleIncreaseDescreaseBtn();
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

  _handleIncreaseDescreaseBtn() {
    this.pluses = this.cart_drawer.querySelectorAll("[data-counter=plus]");
    this.minuses = this.cart_drawer.querySelectorAll("[data-counter=minus]");
    this.remove_items = this.cart_drawer.querySelectorAll(".btn-to-remove");
    this.pluses.forEach((plus, index) => {
      plus.addEventListener("click", () => {
        this._changeCountItem(plus, index);
      });
    });
    this.minuses.forEach((minus, index) => {
      minus.addEventListener("click", () => {
        this._changeCountItem(minus, index);
      });
    });
    this.remove_items.forEach((remove_item, index) => {
      remove_item.addEventListener("click", () => {
        this._changeCountItem(remove_item, index);
      });
    });
  }

  async _changeCountItem(btn, index) {
    let item_product_item_key = `${this.cart_drawer
      .querySelectorAll("[data-line-key]")
      [index].getAttribute("data-line-key")}`;
    let get_current_qty = this.cart_drawer
      .querySelectorAll("[data-line-key]")
      [index].querySelector(".qty");

    let new_updated_qty;

    if (btn.getAttribute("data-counter") === "plus") {
      new_updated_qty = ++get_current_qty.textContent;
    } else if (btn.getAttribute("data-counter") === "minus") {
      new_updated_qty = --get_current_qty.textContent;
    } else {
      new_updated_qty = 0;
    }

    const res = await fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item_product_item_key,
        quantity: new_updated_qty,
        sections: "cart-drawer-header,cart-drawer-footer,cart-drawer-items",
      }),
    });
    const data = await res.json();

    // Handle cart drawer header
    let new_cart_drawer_header = document.createElement("div");
    new_cart_drawer_header.innerHTML = data.sections["cart-drawer-header"];

    const current_cart_drawer_header = this.cart_drawer.querySelector(
      ".cart-drawer-header",
    );

    current_cart_drawer_header.querySelector(
      ".cart-drawer-header-count",
    ).textContent = new_cart_drawer_header.querySelector(
      ".cart-drawer-header-count",
    ).textContent;

    //Handle cart drawer footer
    let new_cart_drawer_footer = document.createElement("div");
    new_cart_drawer_footer.innerHTML = data.sections["cart-drawer-footer"];
    const current_cart_drawer_footer = this.cart_drawer.querySelector(
      ".cart-drawer-footer",
    );
    current_cart_drawer_footer.querySelector(
      ".cart-drawer-footer-total",
    ).innerHTML = new_cart_drawer_footer.querySelector(
      ".cart-drawer-footer-total",
    ).innerHTML;

    // handle cart items

    const parser = new DOMParser();
    const new_cart_drawer_items = parser.parseFromString(
      data.sections["cart-drawer-items"],
      "text/html",
    );

    const current_cart_drawer_items =
      this.cart_drawer.querySelector(".cart-drawer-item ");

    current_cart_drawer_items.outerHTML =
      new_cart_drawer_items.querySelector(".cart-drawer-item").outerHTML;
  }
}

customElements.define("cart-drawer", CartDrawer);
