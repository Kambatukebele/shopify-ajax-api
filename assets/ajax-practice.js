const forms = document.querySelectorAll("form[action$='/cart/add']");

forms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button
    form.querySelector(".submit-add-to-cart").disabled = true;
    form.querySelector(".submit-add-to-cart").classList.remove("bg-blue-800");
    form.querySelector(".submit-add-to-cart").classList.remove("text-white");
    form.querySelector(".submit-add-to-cart").classList.add("bg-gray-100");
    form.querySelector(".submit-add-to-cart").classList.add("text-black");
    form.querySelector(".submit-add-to-cart").textContent = "Adding ...";

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
      body: form_data,
    });

    if (!res.ok) {
      throw new Error("Something went wront");
    }
    const data = await res.json();

    if (data) {
      //Restoring disabled button
      form.querySelector(".submit-add-to-cart").disabled = false;
      form.querySelector(".submit-add-to-cart").classList.add("bg-blue-800");
      form.querySelector(".submit-add-to-cart").classList.add("text-white");
      form.querySelector(".submit-add-to-cart").classList.remove("bg-gray-100");
      form.querySelector(".submit-add-to-cart").classList.remove("text-black");
      form.querySelector(".submit-add-to-cart").textContent = "Add to cart";

      document.dispatchEvent(
        new CustomEvent("cart:updated", {
          bubbles: true,
          detail: {
            data_header: data.sections[get_header_section_id],
            data_cart_drawer: data.sections["cart-drawer"],
          },
        }),
      );
    }
  });
});
