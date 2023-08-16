import express from 'express'
import { isAdmin, isLogged } from './auth'
import { signUp, login, getUserById, updateUser, deleteUser, getUsers } from '../controllers/userController'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController'
import { addItemInCart, getCartItems, getCartItemsById, removeCartItem } from '../controllers/cartController'
import { addItemInList, changeItemPosition, getListItems, removeItemFromList } from '../controllers/favoriteListController'
import { deleteCategory, editCategory, getCategories, newCategory } from '../controllers/categoryController'
import { deleteDiscount, getDiscounts, newDiscount, updateDiscountInfos } from '../controllers/discountController'
import { deleteOrder, getOrders } from '../controllers/orderController'
import { createProductPaymentSession, createCartPaymentSession, listenWebhooks } from '../controllers/stripeController'

const router = express.Router()

router.post('/signUp', signUp)
router.post('/login', login)
router.post('/webhook', listenWebhooks)

router.route('/products')
    .get(getProducts)
    .post(isAdmin, createProduct)

router.route('/products/:id')
    .get(getProductById)
    .put(isAdmin, updateProduct)
    .delete(isAdmin, deleteProduct)

router.route('/users')
    .get(getUsers)

router.route('/users/:id') // Talvez tirar esse id e pegar o id pelo token
    .all(isLogged)
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

router.route('/cart')
    .all(isLogged)
    .get(getCartItems)
    .post(addItemInCart)

router.route('/cart/:id')
    .all(isLogged)
    .get(getCartItemsById)
    .delete(removeCartItem)

router.route('/list')
    .all(isLogged)
    .get(getListItems)
    .post(addItemInList)

router.route('/list/:id')
    .all(isLogged)
    .put(changeItemPosition)
    .delete(removeItemFromList)

router.route('/category')
    .get(isLogged, getCategories)
    .post(isAdmin, newCategory)

router.route('/category/:id')
    .all(isAdmin)
    .put(editCategory)
    .delete(deleteCategory)

router.route('/discount')
    .get(getDiscounts)
    .post(isAdmin, newDiscount)

router.route('/discount/:id')
    .all(isAdmin)
    .put(updateDiscountInfos)
    .delete(deleteDiscount)

router.route('/order')
    .get(getOrders)

router.route('/order/:id')
    .delete(deleteOrder)

router.post('/payment', isLogged, createProductPaymentSession)
router.post('/payment/cart', isLogged, createCartPaymentSession)

export default router