// cart
const cartBtn = document.querySelector(".cart-btns");
const cartTotal = document.querySelector(".cart-badge"); // => badge for counting add carts
const cartContent = document.querySelector(".cart-modal");
const clearCart = document.querySelector(".clear-cart-btn");
const totalPrice = document.querySelector(".total-price");
// modal
const cartModal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".close-modal");
// products container
const productsDom = document.querySelector(".products-grid");
// nav desktop
const desktopNav = document.querySelector(".desktop-nav");
// category tags
const categoryTags = document.querySelector(".category-tags");
// size options
const sizeOptions = document.querySelector(".size-options");
// sidebar
const mobileFilterToggle = document.querySelector(".mobile-filter-toggle");
const sidebar = document.querySelector(".sidebar");
const toggleGroups = document.querySelectorAll(".toggle-group");

let carts = [];
let buttonsDOM = [];

//1. get products
class Products {
  async getProducts() {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    return data;
  }
}

//2. display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<article class="product-card">
              <div class="product-card__image-wrapper">
                <img
                  src="${product.image}"
                  alt="Basic Slim Fit T-Shirt"
                />
              </div>

              <div class="product-card__info">
                <div class="info-top">
                  <span class="brand"
                    >${product.title}</span
                  >
                </div>
                <div class="info-bottom">
                  <h3 class="product-name">${product.description}</h3>
                  <span class="product-price">$ ${product.price}</span>
                </div>
                <button class="add-to-cart-btn" data-id=${product.id}>
                  <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                </button>
              </div>
            </article>`;
    });

    productsDom.innerHTML = result;
  }

  getAddToCartId() {
    const addToCartbtns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addToCartbtns;

    addToCartbtns.forEach((btn) => {
      const id = btn.dataset.id;

      //check if this product id is in cart or not
      const isInCarts = carts.find((p) => p.id === parseInt(id));
      if (isInCarts) {
        btn.innerText = "This cart added!";
        btn.disabled = true;
      }

      btn.addEventListener("click", (event) => {
        event.target.innerText = "This cart added!";
        event.target.disabled = true;
        // get product from products
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        // add to carts
        carts = [...carts, addedProduct];

        // save cart to local storage
        Storage.saveCarts(carts);

        // set cart values
        this.setCartValue(carts);

        // display cart items
        this.displayCartItem(addedProduct);
      });
    });
  }

  setCartValue(carts) {
    let itemsTotal = 0;
    const tempTotal = carts.reduce((acc, curr) => {
      itemsTotal += curr.quantity;
      return acc + curr.price * curr.quantity;
    }, 0);
    cartTotal.innerText = itemsTotal;
    totalPrice.innerText = parseFloat(tempTotal.toFixed(2));
  }

  displayCartItem(product) {
    cartContent.innerHTML += `<div class="cart__item">
          <div class="cart__item-image">
            <img src=${product.imageUrl} alt="" />
          </div>
          <div class="product__text">
            <div class="price">
              <span class="price__amount">${product.price}</span>
              <span class="price__unit">$</span>
            </div>
            <p>${product.title}</p>
          </div>
          <div class="amount-item" data-id=${product.id}>
            <i class="fa-solid fa-chevron-up increment" data-id=${product.id}></i>
            <span>${product.quantity}</span>
            <i class="fa-solid fa-chevron-down decrement" data-id=${product.id}></i>
          </div>
              <i class="fa-solid fa-trash-can delete" data-id=${product.id}></i>  
        </div> `;
  }

  setUpApp() {
    // get carts and update carts array from storage
    carts = Storage.getCarts() || [];

    // display carts array in modal
    carts.forEach((cartItem) => this.displayCartItem(cartItem));

    // set cart values
    this.setCartValue(carts);
  }

  cartLogic() {
    // clear cart
    clearCart.addEventListener("click", () => this.clearCart());

    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("increment")) {
        const addQuantity = event.target;
        const id = addQuantity.dataset.id;

        const addedItem = carts.find(
          (cartItem) => parseInt(cartItem.id) === parseInt(id),
        );
        addedItem.quantity++;

        this.setCartValue(carts);

        Storage.saveCarts(carts);

        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (event.target.classList.contains("delete")) {
        const removeQuantity = event.target;
        const id = removeQuantity.dataset.id;

        this.removeItem(parseInt(id));

        Storage.saveCarts(carts);

        removeQuantity.parentElement.remove();
      } else if (event.target.classList.contains("decrement")) {
        const lowerQuantity = event.target;
        const id = lowerQuantity.dataset.id;

        const lowerItem = carts.find(
          (cartItem) => parseInt(cartItem.id) === parseInt(id),
        );

        if (lowerItem.quantity === 1) {
          this.removeItem(lowerItem.id);
          lowerQuantity.parentElement.parentElement.remove();
          return;
        }
        lowerItem.quantity--;
        this.setCartValue(carts);
        Storage.saveCarts(carts);
        lowerQuantity.previousElementSibling.innerText = lowerItem.quantity;
      }
    });
  }

  clearCart() {
    // remove all items from cartContent
    carts.forEach((cartItem) => this.removeItem(cartItem.id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    closeModalFunction();
  }

  removeItem(id) {
    // update carts array
    carts = carts.filter((cartItem) => cartItem.id !== id);

    // set cart values and total price
    this.setCartValue(carts);

    // save updated carts array to local storage
    Storage.saveCarts(carts);

    // enable the "add to cart" button again
    const button = this.getSingleButton(id);
    button.innerText = "add cart";
    button.disabled = false;
  }

  getSingleButton(id) {
    return buttonsDOM.find((btn) => parseInt(btn.dataset.id) === id);
  }
}

//3. storage => local
class Storage {
  static saveData(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }

  static saveCarts(carts) {
    localStorage.setItem("carts", JSON.stringify(carts));
  }

  static getCarts() {
    return JSON.parse(localStorage.getItem("carts"));
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const products = new Products();
  const productsData = await products.getProducts();

  const ui = new UI();

  //setUpApp function for reloading and keep modal closed
  ui.setUpApp();

  //cart logic
  ui.cartLogic();

  //display products
  ui.displayProducts(productsData);
  ui.getAddToCartId();
  Storage.saveData(productsData);
});

// toggle sidebar on mobile
if (mobileFilterToggle && sidebar) {
  mobileFilterToggle.addEventListener("click", () => {
    sidebar.classList.toggle("show-sidebar");
  });
}

// rotate filter titles chevron icons
toggleGroups.forEach((group) => {
  group.addEventListener("click", () => {
    const icon = group.querySelector("i");

    if (icon) {
      icon.classList.toggle("rotate-up-90");
    }
  });
});

//cart item modal
function showModalFunction() {
  backdrop.classList.remove("hidden");
  cartModal.classList.remove("hidden");
}

function closeModalFunction() {
  backdrop.classList.add("hidden");
  cartModal.classList.add("hidden");
}

// toggel active class
function setupActiveToggle(container, targetSelector) {
  if (!container) return;

  container.addEventListener("click", (e) => {
    const clickedItem = e.target.closest(targetSelector);
    if (!clickedItem) return;

    if (clickedItem.tagName === "A") {
      e.preventDefault();
    }

    if (clickedItem.classList.contains("active")) {
      clickedItem.classList.remove("active");
      return;
    }

    const currentActive = container.querySelector(".active");
    if (currentActive) {
      currentActive.classList.remove("active");
    }

    clickedItem.classList.add("active");
  });
}

cartBtn.addEventListener("click", showModalFunction);
backdrop.addEventListener("click", closeModalFunction);
closeModal.addEventListener("click", closeModalFunction);
setupActiveToggle(desktopNav, "a");
setupActiveToggle(categoryTags, ".tag-btn");
setupActiveToggle(sizeOptions, ".size-btn");
