const forms = document.querySelectorAll("form[action$='/cart/add']");

forms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector(".submit-add-to-cart");

    // Disable button
    submitButton.disabled = true;
    submitButton.classList.remove("bg-blue-800");
    submitButton.classList.remove("text-white");
    submitButton.classList.add("bg-gray-100");
    submitButton.classList.add("text-black");
    submitButton.textContent = "Adding ...";

    try {
      // add to cart
      const URL = window.Shopify.routes.root;
      const formData = new FormData(form);
      // handle bubble
      const getHeaderSectionId = document
        .querySelector("[data-header-id]")
        .getAttribute("data-header-id");

      formData.append("sections", `${getHeaderSectionId},cart-drawer`);
      const res = await fetch(`${URL}cart/add.js`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const errorMessage = await res.json();

        throw new Error(errorMessage.description);
      }
      const data = await res.json();

      // Verify that sections is not returned as null
      if (
        data.sections &&
        data.sections["cart-drawer"] &&
        data.sections[getHeaderSectionId]
      ) {
        document.dispatchEvent(
          new CustomEvent("cart:updated", {
            detail: {
              header: data.sections[getHeaderSectionId],
              cartDrawer: data.sections["cart-drawer"],
            },
          }),
        );
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      //Restoring disabled button
      submitButton.disabled = false;
      submitButton.classList.add("bg-blue-800");
      submitButton.classList.add("text-white");
      submitButton.classList.remove("bg-gray-100");
      submitButton.classList.remove("text-black");
      submitButton.textContent = "Add to cart";
    }
  });
});
