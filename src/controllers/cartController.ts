import { Request, Response } from "express";
import { db } from "../config/db";

const getCartItems = async (req: Request, res: Response) => {
    db('cart_item')
        .join('product', 'product.id', 'cart_item.product_id')
        .select('name', 'price', 'quantity', 'img')
        .then(items => res.status(200).send(items))
        .catch(e => res.status(500).send(e))
}

const getCartItemsById = async (req: Request, res: Response) => {
    const id = req.params.id
    db('cart_item')
        .join('product', 'product.id', 'cart_item.product_id')
        .select('name', 'price', 'quantity', 'img')
        .where({ product_id: id })
        .then(items => res.status(200).send(items))
        .catch(e => res.status(500).send(e))
}

const addItemInCart = async (req: Request, res: Response) => {
    const item = req.body // Talvex mudar para o id passado em rota

    const dbCartItem = await db('cart_item')
        .where({ product_id: item.product_id })
        .first()


    if (dbCartItem) {
        res.status(400).send('Este produto já está no carrinho')
    } else if (dbCartItem === undefined) {
        db('cart_item')
            .insert(item)
            .then(() => res.status(201).send())
            .catch(e => res.status(500).send(e))
    }
}

const removeCartItem = (req: Request, res: Response) => {
    db('cart_item')
        .delete()
        .where({ product_id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))
}

export {
    getCartItems,
    getCartItemsById,
    addItemInCart,
    removeCartItem
}