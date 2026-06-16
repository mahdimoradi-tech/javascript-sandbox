export default class Storage {
  static getCategories() {
    // get categories
    const categories = JSON.parse(localStorage.getItem("categories")) || [];

    // sort descending
    return categories.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  static saveCategory(category) {
    const savedCategories = this.getCategories();

    const existedCategory = savedCategories.find((c) => c.id === category.id);
    if (existedCategory) {
      // edit
      existedCategory.title = category.title;
      existedCategory.description = category.description;
    } else {
      // add new
      category.id = new Date().getTime();
      category.createdAt = new Date().toISOString();
      savedCategories.push(category);
    }

    localStorage.setItem("categories", JSON.stringify(savedCategories));
  }

  static getProducts(sortKey = "newest") {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    return products.sort((a, b) => {
      switch (sortKey) {
        case "oldest":
         return new Date(a.createdAt) - new Date(b.createdAt);

        default:
         return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }

  static saveProducts(product) {
    const savedProducts = this.getProducts();

    const existedProduct = savedProducts.find((p) => parseInt(p.id) === parseInt(product.id));

    if (existedProduct) {
      // edit
      existedProduct.title = product.title;
      existedProduct.quantity = product.quantity;
      existedProduct.category = product.category;
      existedProduct.updatedAt = new Date().toISOString()
    } else {
      // add new
      product.id = new Date().getTime();
      product.createdAt = new Date().toISOString();
      savedProducts.push(product);
    }

    localStorage.setItem("products", JSON.stringify(savedProducts));
  }

  static deleteProduct(id){
    const products = this.getProducts()
    const filteredProducts = products.filter(product => parseInt(id) !== parseInt(product.id))
    localStorage.setItem("products", JSON.stringify(filteredProducts))
  }
}
