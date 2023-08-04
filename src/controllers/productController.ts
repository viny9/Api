import { Request, Response } from 'express'
import { db } from '../config/db'

const getProducts = (req: Request, res: Response) => {
    db('product')
        .then(products => res.status(200).send(products))
        .catch(e => res.status(500).send(e))
}

const getProductById = async (req: Request, res: Response) => {
    db('product')
        .where({ id: req.params.id })
        .then(product => res.status(200).send(product))
        .catch(e => res.status(500).send(e))
}

const createProduct = (req: Request, res: Response) => {
    const product = req.body

    db('product')
        .insert(product)
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

const updateProduct = (req: Request, res: Response) => {
    const product = req.body

    db('product')
        .update(product)
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

const deleteProduct = (req: Request, res: Response) => {
    db('product')
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