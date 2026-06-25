class CartDrawer extends HTMLElement {
  connectedCallback() {
    // target delegation
    this.cart_drawer = this;

    // Open CartDrawer
    this._openCartDrawer();
    // Close CartDrawer
    this._closeCartDrawer();

    this._handleIncreaseDescreaseBtn();
  }

  _openCartDrawer() {
    document.addEventListener("cart:open", (e) => {
      this.cart_drawer.querySelector("#cart-drawer").classList.add("is-open");
    });
    document.addEventListener("cart:updated", (e) => {
      const new_html = document.createElement("div");
      let new_cart_drawer = e.detail.dataCartDrawer;

      new_html.innerHTML = new_cart_drawer;

      const current_cart_drawer =
        this.cart_drawer.querySelector("#cart-drawer");
      const new_drawer = new_html.querySelector("#cart-drawer");

      current_cart_drawer.innerHTML = new_drawer.innerHTML;

      this.cart_drawer.querySelector("#cart-drawer").classList.add("is-open");
    });
  }
  _closeCartDrawer() {
    this.cart_drawer.addEventListener("click", (e) => {
      if (e.target.closest("#cart-close") !== null) {
        this.cart_drawer
          .querySelector("#cart-drawer")
          .classList.remove("is-open");
      }
    });
  }

  _handleIncreaseDescreaseBtn() {
    this.cart_drawer.addEventListener("click", (event) => {
      const plus = event.target.closest("[data-counter='plus']");
      const minus = event.target.closest("[data-counter='minus']");
      const remove = event.target.closest(".btn-to-remove");

      if (plus) {
        this._changeCountItem(plus);
        return;
      }

      if (minus) {
        this._changeCountItem(minus);
        return;
      }

      if (remove) {
        this._changeCountItem(remove);
        return;
      }
    });
  }

  async _changeCountItem(btn) {
    const lineItem = btn.closest("[data-line-key]");

    const item_product_item_key = lineItem.getAttribute("data-line-key");

    const qtyElement = lineItem.querySelector(".qty");

    let new_updated_qty;

    if (btn.dataset.counter === "plus") {
      new_updated_qty = Number(qtyElement.textContent) + 1;
    } else if (btn.dataset.counter === "minus") {
      new_updated_qty = Number(qtyElement.textContent) - 1;
    } else {
      new_updated_qty = 0;
    }
    if (new_updated_qty < 0) return;
    const res = await fetch(window.Shopify.routes.root + "cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: item_product_item_key,
        quantity: new_updated_qty,
        sections: "cart-drawer",
      }),
    });
    const data = await res.json();

    document.dispatchEvent(
      new CustomEvent("cart:updated", {
        detail: {
          dataCartDrawer: data.sections["cart-drawer"],
        },
      }),
    );
  }
}

customElements.define("cart-drawer", CartDrawer);
