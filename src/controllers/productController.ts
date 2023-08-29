import { Request, Response } from 'express'
import Product from '../models/Product'

const getProducts = async (req: Request, res: Response) => {
    try {
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

const createProduct = async (req: Request, res: Response) => {
    try {
        const body = req.body
        await Product.create(body)

        res.status(201).send('Produto Criado com sucesso')
    } catch (e: any) {
        res.status(500).send(e)
    }
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
    createProduct,
    updateProduct,
    deleteProduct,
}