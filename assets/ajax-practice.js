const btns = document.querySelectorAll(".submit-add-to-cart");

btns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#cart-drawer").classList.remove("hidden");
  });
});
