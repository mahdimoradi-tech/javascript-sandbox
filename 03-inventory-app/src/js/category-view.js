import Storage from "./storage.js";

const categoryTitle = document.getElementById("category-title");
const categoryDescription = document.getElementById("category-description");
const addNewCategoryBtn = document.getElementById("add-new-category");
const toggleCategoryFormBtn = document.getElementById("toggle-add-category-form");
const categoryForm = document.getElementById("category-wrapper");
const cancelAddCategoryBtn = document.getElementById("cancel-add-category");
const editProductCategory = document.getElementById("edit-product-category");
const sortByCategory = document.getElementById("sort-products-by-category");
const emptyFieldToast = document.getElementById("empty-field-toast")

class CategoryView {
  constructor() {
    addNewCategoryBtn.addEventListener("click", (e) => this.addNewCategory(e));
    toggleCategoryFormBtn.addEventListener("click", (e) => this.toggleCategoryForm(e));
    cancelAddCategoryBtn.addEventListener("click", (e) => this.cancelAddCategory(e));
    this.categories = [];
  }

  addNewCategory(e) {
    e.preventDefault();

    const title = categoryTitle.value.trim().toLowerCase();
    const description = categoryDescription.value.trim().toLowerCase();
    
    this.showToast(title, description)

    Storage.saveCategory({ title, description });

    this.categories = Storage.getCategories();

    this.createCategoriesList();
    this.createSortByCategoriesList();

    categoryTitle.value = "";
    categoryDescription.value = "";

    categoryForm.classList.add("hidden");
    toggleCategoryFormBtn.classList.remove("hidden");
  }

  // refresh categories in localstorage
  setApp() {
    this.categories = Storage.getCategories();
  }

  createCategoriesList() {
    let result = `<option class="bg-slate-500 text-slate-300" value="">select a category</option>`;

    this.categories.forEach((category) => {
      result += `<option class="bg-slate-500 text-slate-300" value="${category.id}">${category.title}</option>`;
    });

    const productCategoriesList = document.getElementById("product-category");
    productCategoriesList.innerHTML = result;
    editProductCategory.innerHTML = result;
  }

  createSortByCategoriesList() {
    let result = `<option class="bg-slate-500 text-slate-300" value="all">All</option>`;

    this.categories.forEach((category) => {
      result += `<option class="bg-slate-500 text-slate-300" value="${category.id}">${category.title}</option>`;
    });

    sortByCategory.innerHTML = result;
  }

  toggleCategoryForm(e) {
    e.preventDefault();
    categoryForm.classList.remove("hidden");
    toggleCategoryFormBtn.classList.add("hidden");
  }

  cancelAddCategory(e) {
    e.preventDefault();
    categoryForm.classList.add("hidden");
    toggleCategoryFormBtn.classList.remove("hidden");

    categoryDescription.value = "";
    categoryTitle.value = "";
  }

  showToast(title, description){
    if (!title || !description){
      emptyFieldToast.classList.remove("hidden")
      emptyFieldToast.classList.add("animate-slildeDownToast")
    }
    setTimeout(() => {
      emptyFieldToast.classList.remove("animate-slildeDownToast")
      emptyFieldToast.classList.add("hidden")
    }, 2700);
  }
}

export default new CategoryView();
