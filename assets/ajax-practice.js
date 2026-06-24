const forms = document.querySelectorAll("form[action$='/cart/add']");

forms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // add to cart
    let URL = window.Shopify.routes.root;
    let form_data = new FormData(form);
    // handle bubble
    let get_header_section_id = document
      .querySelector("[data-header-id]")
      .getAttribute("data-header-id");

    form_data.append("sections", `${get_header_section_id},cart-drawer`);

    const res = await fetch(`${URL}cart/add.js`, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      body: form_data,
    });

    if (!res.ok) {
      throw new Error("Something went wront");
    }
    const data = await res.json();

    if (data) {
      // rendering heading to update the bubble count
      const html = document.createElement("div");
      let new_header = data.sections["sections--19986155733179__header"];
      html.innerHTML = new_header;

      // Updating the bubble
      document.querySelector(".cart-item-bubble > sup").textContent =
        html.querySelector(".cart-item-bubble > sup").textContent;

      // rendering the cart-drawer to update with the new data
      const cart_drawer_html = document.createElement("section");
      let new_cart_drawer = data.sections["cart-drawer"];

      cart_drawer_html.innerHTML = new_cart_drawer;
      document.querySelector("[data-drawer-id]").outerHTML =
        cart_drawer_html.innerHTML;
      document.dispatchEvent(new CustomEvent("cart:open"));
    }
  });
});
