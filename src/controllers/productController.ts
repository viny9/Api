import { Request, Response } from 'express'
import { db } from '../config/db'

const getProducts = (req: Request, res: Response) => {
    db('products')
        .then(products => res.status(200).send(products))
        .catch(e => res.status(500).send(e))
}

const getProductById = (req: Request, res: Response) => {
    db('products')
        .where({ id: req.params.id })
        .then(product => res.status(200).send(product))
        .catch(e => res.status(500).send(e))
}

const createProduct = (req: Request, res: Response) => {
    const product = req.body

    db('products')
        .insert(product)
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

const updateProduct = (req: Request, res: Response) => {
    const product = req.body

    db('products')
        .update(product)
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

const deleteProduct = (req: Request, res: Response) => {
    const product = req.body

    db('products')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}