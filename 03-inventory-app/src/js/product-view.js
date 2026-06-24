import Storage from "./storage.js";

let editProductId = null;
let selectedSectionInSortCategory = "all";
let selectedSortValue = "newest";

const productTitle = document.getElementById("product-title");
const productCategory = document.getElementById("product-category");
const productQuantity = document.getElementById("quantity");
const addNewProductBtn = document.getElementById("add-new-product");
const productsList = document.getElementById("products-list");
const searchInput = document.getElementById("search-input");
const sortProducts = document.getElementById("sort-products");
const inventoryCounter = document.getElementById("inventory-counter");
const modalBackDrop = document.getElementById("modal-back-drop");
const modalEditForm = document.getElementById("modal-edit-form");
const closeModalBtn = document.getElementById("close-modal-btn");
const editproductTitle = document.getElementById("edit-product-title");
const editQuantity = document.getElementById("edit-quantity");
const editProductCategory = document.getElementById("edit-product-category");
const editSelectedProduct = document.getElementById("edit-selected-product");
const sortByCategory = document.getElementById("sort-products-by-category");
const emptyFieldToast = document.getElementById("empty-field-toast")

class ProductView {
  constructor() {
    addNewProductBtn.addEventListener("click", (e) => this.addNewProduct(e));
    searchInput.addEventListener("input", (e) => this.searchProducts(e));
    sortProducts.addEventListener("change", (e) => this.sortProducts(e));
    modalBackDrop.addEventListener("click", () => this.closeModal());
    closeModalBtn.addEventListener("click", () => this.closeModal());
    editSelectedProduct.addEventListener("click", (e) =>
      this.updateEditedProduct(e),
    );
    sortByCategory.addEventListener("change", (e) =>
      this.sortProductsByCategory(e),
    );
    this.products = [];
  }

  addNewProduct(e) {
    e.preventDefault();

    const title = productTitle.value;
    const quantity = productQuantity.value;
    const category = productCategory.value;

    // if (!title || !quantity || !category)
    //   return alert("make sure none of product field are empty...");
    this.showToast(title, quantity, category)

    Storage.saveProducts({ title, quantity, category });

    this.setApp();

    productTitle.value = "";
    productQuantity.value = "";

    // show products on DOM
    this.sortProductsByCategoryLogic(selectedSectionInSortCategory);
    this.sortProductsLogic(selectedSortValue);
  }

  // refresh products in localstorage
  setApp() {
    this.products = Storage.getProducts();
  }

  createProductsList() {
    let result = " ";

    this.products.forEach((product) => {
      const selectedCategory = Storage.getCategories().find(
        (category) => parseInt(category.id) === parseInt(product.category),
      );

      result += `<div class="flex items-center justify-between mb-2 gap-x-1">
          <span class="text-slate-400 truncate flex-1 cursor-pointer" title="${product.title}">${product.title}</span>
          <div class="flex items-center gap-x-3">
            <span class="text-slate-400">${new Date(product.createdAt).toLocaleDateString("fa-IR")}</span>
            <span
              class="block px-3 text-slate-400 border-slate-400 text-sm rounded-2xl"
              >${selectedCategory.title}</span
            >
            <span
              class="flex items-center justify-center w-7 h-7 rounded-full bg-slate-500 border-2 border-slate-300 text-slate-300"
              >${product.quantity}</span
            >
            <button
              class="edit-btn border-2 px-2 py-0.5 rounded-2xl border-slate-300 text-slate-300"
              data-product-id = ${product.id}
            >
              edit
            </button>
            <button
              class="remove-btn border-2 px-2 py-0.5 rounded-2xl border-red-500 text-red-400"
              data-product-id = ${product.id}
            >
              delete
            </button>
          </div>
        </div>`;
    });

    productsList.innerHTML = result;

    // delete btns control
    const deleteProductBtns = [...document.querySelectorAll(".remove-btn")];
    deleteProductBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.removeProduct(e));
    });

    // edit btns control
    const editProductBtns = [...document.querySelectorAll(".edit-btn")];
    editProductBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.editProduct(e));
    });

    this.updateNumberOfProducts();
  }

  searchProducts() {
    const inputValue = searchInput.value.trim().toLowerCase();

    const foundedProducts = this.products.filter((product) =>
      product.title.toLowerCase().includes(inputValue),
    );
    this.products = foundedProducts;
    this.createProductsList();

    this.setApp();
  }

  sortProducts(e) {
    selectedSortValue = e.target.value;
    this.sortProductsLogic(selectedSortValue);
  }

  sortProductsLogic(selectedSortValue) {
    this.products = Storage.getProducts(selectedSortValue);
    this.sortProductsByCategoryLogic(selectedSectionInSortCategory);
  }

  sortProductsByCategory(e) {
    selectedSectionInSortCategory = e.target.value;

    this.sortProductsByCategoryLogic(selectedSectionInSortCategory);
    this.sortProductsLogic(selectedSortValue);
  }

  sortProductsByCategoryLogic(selectedSection) {
    if (selectedSection === "all") {
      return this.createProductsList();
    } else {
      const filteredByCategory = this.products.filter(
        (product) => parseInt(product.category) === parseInt(selectedSection),
      );
      this.products = filteredByCategory;

      this.createProductsList();

      this.setApp();
    }
  }

  removeProduct(e) {
    const productId = e.target.dataset.productId;
    Storage.deleteProduct(productId);
    this.setApp();
    this.createProductsList();
  }

  editProduct(e) {
    editProductId = e.target.dataset.productId;
    modalBackDrop.classList.remove("hidden");
    modalEditForm.classList.remove("hidden");

    this.setApp();
    // const categories = Storage.getCategories();
    const selectedProduct = this.products.find(
      (product) => product.id === parseInt(editProductId),
    );

    // const selectedProductCategoryObj = categories.find(category => {
    //   if(category.id === parseInt(selectedProduct.category))
    //     return category;
    // })

    editproductTitle.value = selectedProduct.title;
    editQuantity.value = selectedProduct.quantity;
    editProductCategory.value = selectedProduct.category
  }

  updateEditedProduct(e) {
    e.preventDefault();

    const title = editproductTitle.value;
    const quantity = editQuantity.value;
    const category = editProductCategory.value;
    const id = editProductId;

    Storage.saveProducts({ title, quantity, category, id });

    this.setApp();

    this.closeModal();
    this.createProductsList();

    editProductCategory.value = "";
  }

  closeModal() {
    modalBackDrop.classList.add("hidden");
    modalEditForm.classList.add("hidden");
  }

  updateNumberOfProducts() {
    const nubmerOfProducts = this.products.length;
    inventoryCounter.innerHTML = nubmerOfProducts;
  }

   showToast(title, quantity, category){
    if (!title || !quantity || !category){
      emptyFieldToast.classList.remove("hidden")
      emptyFieldToast.classList.add("animate-slildeDownToast")
    }
    setTimeout(() => {
      emptyFieldToast.classList.remove("animate-slildeDownToast")
      emptyFieldToast.classList.add("hidden")
    }, 2700);
  }
}

export default new ProductView();
