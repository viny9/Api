import express from 'express'
import { isAdmin, isLogged } from './auth'
import { signUp, login, getUserById, updateUser, deleteUser, getUsers } from '../controllers/userController'
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, updateProduct } from '../controllers/productController'
import { addItemInCart, getCartItems, removeCartItem } from '../controllers/cartController'
import { addItemInList, getListItems, removeItemFromList } from '../controllers/favoriteListController'
import { deleteCategory, editCategory, getCategories, newCategory } from '../controllers/categoryController'
import { deleteDiscount, getDiscounts, newDiscount, updateDiscountInfos } from '../controllers/discountController'
import { deleteOrder, getOrderById, getAllOrders, getUserOrders } from '../controllers/orderController'
import { createProductPaymentSession, createCartPaymentSession, listenWebhooks } from '../controllers/stripeController'

const router = express.Router()

router.post('/signUp', signUp)
router.post('/login', login)
router.post('/webhook', listenWebhooks)
router.post('/payment', isLogged, createProductPaymentSession)
router.post('/payment/cart', isLogged, createCartPaymentSession)

router.route('/products')
    .get(getProducts)
    .get(getProductsByCategory)
    .post(isAdmin, createProduct)

router.route('/products/:id')
    .get(getProductById)
    .put(isAdmin, updateProduct)
    .delete(isAdmin, deleteProduct)

router.route('/users')
    .get(getUsers)

router.route('/users/:id')
    .all(isLogged)
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

router.route('/cart/:user_id')
    .all(isLogged)
    .get(getCartItems)
    .post(addItemInCart)

router.delete('/cart/:user_id/:product_id', isLogged, removeCartItem)

router.route('/list/:user_id')
    .all(isLogged)
    .get(getListItems)
    .post(addItemInList)
// .put(changeItemPosition)
router.delete('/list/:user_id/:product_id', isLogged, removeItemFromList)

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
    .get(isLogged, getUserOrders)
    .get(isAdmin, getAllOrders)

router.route('/order/:id')
    .get(isLogged, getOrderById)
    .delete(isAdmin, deleteOrder)

export default router