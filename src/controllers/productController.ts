import { NextFunction, Request, Response } from 'express'
import Product from '../models/Product'

// Adicionar middleware para indentificar se função tem querys
const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const querysArray = Object.keys(req.query)
        if (querysArray.length > 0) {
            return next()
        }

        const products = await Product.find()
        res.status(200).send(products)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const getProductById = async (req: Request, res: Response) => {
    try {
        const user = await Product.findById(req.params.id)
        res.status(200).send(user)
    } catch (e: any) {
        res.status(404).send('Nenhum produto encontrado')
    }
}

const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const products = await Product.find({ category: req.query.category })
        res.status(200).send(products)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const createProduct = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const exists = await checkIfExists(body.name)
        if (exists) { throw new Error('Já possui um produto com esse nome') }

        await Product.create(body)

        res.status(201).send('Produto Criado com sucesso')
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const checkIfExists = async (productName: string) => {
    const product = await Product.findOne({ name: productName })
    return product != null ? true : false
}

const updateProduct = async (req: Request, res: Response) => {
    try {
        const body = req.body
        await Product.findByIdAndUpdate(req.params.id, body)

        res.status(200).send()
    } catch (e: any) {
        res.status(404).send('Este produto não existe')
    }
}

const deleteProduct = async (req: Request, res: Response) => {
    try {
        await Product.findByIdAndRemove(req.params.id)
        res.status(200).send()
    } catch (e: any) {
        res.status(404).send('Nenhum produto foi encontrado')
    }
}

export {
    getProducts,
    getProductById,
    getProductsByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
}