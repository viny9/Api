import express from 'express'
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/productController'
import { createUser, login } from '../controllers/userController'

const router = express.Router()

// Rotas de produtos
router.get('/', (req, res) => res.send('Hello word'))
router.get('/get', getProducts)
router.get('/getById/:id', getProductById)
router.post('/add', createProduct)
router.put('/update/:id', updateProduct)
router.delete('/delete/:id', deleteProduct)

// Rotas de usuário
router.post('/signUp', createUser)
router.post('/login', login)

export default router