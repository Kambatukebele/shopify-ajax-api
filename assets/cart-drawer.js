class CartDrawer extends HTMLElement {
  connectedCallback() {
    // Get header section id to handle bubble
    this.headerSectionId =
      document.querySelector("[data-header-id]").dataset.headerId;

    // Open CartDrawer
    this._openCartDrawer();
    // Close CartDrawer
    this._closeCartDrawer();

    this._handleIncreaseDescreaseBtn();
  }

  _openCartDrawer() {
    document.addEventListener("cart:open", () => {
      this.querySelector("#cart-drawer").classList.add("is-open");
    });
    document.addEventListener("cart:updated", (e) => {
      const newHtml = document.createElement("div");

      let newCartDrawer = e.detail.cartDrawer;

      newHtml.innerHTML = newCartDrawer;

      const drawer = this.querySelector("#cart-drawer");

      const newDrawer = newHtml.querySelector("#cart-drawer");

      drawer.innerHTML = newDrawer.innerHTML;

      drawer.classList.add("is-open");
    });
  }
  _closeCartDrawer() {
    this.addEventListener("click", (e) => {
      if (e.target.closest("#cart-close") !== null) {
        this.querySelector("#cart-drawer").classList.remove("is-open");
      }
    });
  }

  _handleIncreaseDescreaseBtn() {
    this.addEventListener("click", (event) => {
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

    const itemProductItemKey = lineItem.dataset.lineKey;

    const qtyElement = lineItem.querySelector(".qty");

    // let currentQty;
    let currentQty;

    if (btn.dataset.counter === "plus") {
      currentQty = Number(qtyElement.dataset.qty) + 1;
    } else if (btn.dataset.counter === "minus") {
      currentQty = Number(qtyElement.dataset.qty) - 1;
    } else {
      currentQty = 0;
    }
    if (currentQty < 0) return;

    try {
      const res = await fetch(window.Shopify.routes.root + "cart/change.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itemProductItemKey,
          quantity: currentQty,
          sections: `cart-drawer,${this.headerSectionId}`,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.description);
      }
      const data = await res.json();

      if (
        data.sections &&
        data.sections["cart-drawer"] &&
        data.sections[this.headerSectionId]
      ) {
        document.dispatchEvent(
          new CustomEvent("cart:updated", {
            detail: {
              cartDrawer: data.sections["cart-drawer"],
              header: data.sections[this.headerSectionId],
            },
          }),
        );
      }
    } catch (error) {
      if (btn.dataset.counter === "plus") {
        const messageBox = btn
          .closest(".box-item")
          .querySelector(".error-message");

        // Display error message to the use
        messageBox.classList.remove("hidden");
        messageBox.textContent = error.message;
      }
    }
  }
}

customElements.define("cart-drawer", CartDrawer);
