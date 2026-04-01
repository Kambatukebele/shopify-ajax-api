class FeaturedProduct {
  constructor() {
    /**
     * Inside this constructor we create some variables using event delegation
     * this.featuredProduct => to target the section container
     * this.colors => to target the colors on each card product
     * this sizes => to target the sizes based on the selected color
     * this.the_input => to target the input and to update is value with the variant id
     * this.handleColorSelector() => handle the color selection for each product card
     */

    this.featuredProduct = document.querySelector(".featured-product");
    this.colors = this.featuredProduct.querySelectorAll("[data-color]");
    this.sizes = this.featuredProduct.querySelectorAll(".size-buttons");
    this.the_input = this.featuredProduct.querySelectorAll(".variant-id-input");

    this.handleColorSelector();
  }

  handleColorSelector() {
    /**
     * Use the this.colors to get the selected color by looping
     * We fetch (async await) the corresponding card product using fetch('/products/handle.js')
     * we create the this.handle variable to grab the corresponding product handle
     * we get the this.selectedColor by filtering the selected color data
     * we create this.sizeContainer to target the container that hold the sizes
     * On click, we will replace it span children with the replaceChildren()
     * With the this.currentChild we loop trought and created the this.newChilds
     * and we append the this.sizeContainer with the this.currentChild
     */
    this.colors.forEach((color) => {
      color.addEventListener("click", async (e) => {
        this.handle = color
          .closest("[data-product-handle]")
          .getAttribute("data-product-handle");
        this.URL = `/products/${this.handle}.js`;

        this.req = await fetch(this.URL);
        this.data = await this.req.json();
        this.selectedColor = this.data.variants.filter(
          (variant) =>
            variant.option1.toLowerCase() ===
            e.target.dataset.color.toLowerCase(),
        );

        // target the image
        this.theImage = color
          .closest("[data-product-handle]")
          .querySelector(".product-image");
        this.theImage.src = this.selectedColor[0].featured_image.src;
        this.theImage.srcset = "";
        this.width = 600;
        this.height = 600;

        // target the sizes container
        this.sizeContainer = color
          .closest("[data-product-handle]")
          .querySelector(".size-buttons");

        this.sizeContainer.replaceChildren();

        this.currentChild = this.selectedColor.map((match) => {
          const { id, option2 } = match;
          this.newChilds = document.createElement("span");
          this.newChilds.setAttribute("data-size", option2);
          this.newChilds.setAttribute("data-variant", id);
          this.newChilds.setAttribute(
            "class",
            "size-btn border border-gray-300 px-2 py-0.5 text-xs cursor-pointer",
          );
          this.newChilds.textContent = option2;
          return this.newChilds;
        });

        this.sizeContainer.append(...this.currentChild);
      });
    });
  }

  handlesizeSelector() {}

  addToCart() {}
}

const product = new FeaturedProduct();
