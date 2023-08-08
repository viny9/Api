import express from 'express'
import { signUp, login, getUserById, updateUser, deleteUser, getUsers } from '../controllers/userController'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController'
import { isAdmin, isLogged } from './auth'
import { addItemInCart, getCartItems, getCartItemsById, removeCartItem } from '../controllers/cartController'
import { addItemInList, changeItemPosition, getListItems, removeItemFromList } from '../controllers/favoriteListController'

const router = express.Router()

// Cadastro e login
router.post('/signUp', signUp)
router.post('/login', login)

// Rotas de produtos
router.route('/products')
    .get(getProducts)
    .post(isAdmin, createProduct)

router.route('/products/:id')
    .get(getProductById)
    .put(isAdmin, updateProduct)
    .delete(isAdmin, deleteProduct)

// Rotas de usuário
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

export default router