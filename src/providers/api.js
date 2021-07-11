const API_URL = 'http://192.168.1.53:5000/api'

//PRODUCTS
export const API_PRODUCTS = `${API_URL}/products`
export const API_PRODUCT_ID = (id) => `${API_URL}/products/${id}`
export const API_PRODUCTS_CATEGORY = (id) => `${API_URL}/products/category/${id}`
export const API_CATEGORIES_PRODUCT = (id) => `${API_URL}/products/${id}/categories`
export const API_PRODUCT_IMAGE = (id, name_image) => `${API_URL}/products/img/${id}${name_image ? `/${name_image}` : ''}`
export const API_PRODUCT_NEW = `${API_URL}/products/new`
export const API_PRODUCT_IMAGE_NEW = (id) => `${API_URL}/products/new/image/${id}`

//CATEGORIES
export const API_CATEGORIES = `${API_URL}/categories`