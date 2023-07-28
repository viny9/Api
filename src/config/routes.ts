import express from 'express'
import { signUp, login, getUserById, updateUser, deleteUser, getUsers } from '../controllers/userController'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController'
import { isAdmin, isLogged } from './auth'

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

export default router