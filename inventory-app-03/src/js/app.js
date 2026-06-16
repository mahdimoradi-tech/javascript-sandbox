import CategoryView from './category-view.js'
import ProductView from './product-view.js'

document.addEventListener('DOMContentLoaded', () => {
    CategoryView.setApp()
    ProductView.setApp()
    
    CategoryView.createSortByCategoriesList()
    CategoryView.createCategoriesList()
    ProductView.createProductsList()
})


