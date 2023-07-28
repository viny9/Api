import express from 'express'
import { signUp, login, getUserById, updateUser, deleteUser, getUsers } from '../controllers/userController'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController'

const router = express.Router()

// Cadastro e login
router.post('/signUp', signUp)
router.post('/login', login)

// Rotas de produtos
router.route('/products')
    .get(getProducts)
    .post(createProduct)

router.route('/products/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct)

// Rotas de usuário

router.route('/users')
    .get(getUsers)

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

export default router