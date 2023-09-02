import { Request, Response } from "express";
import Cart from "../models/Cart";

const getCartItems = async (req: Request, res: Response) => {
    // db('cart_item')
    //     .join('product', 'product.id', 'cart_item.product_id')
    //     .select('name', 'price', 'quantity', 'img')
    //     .then(items => res.status(200).send(items))
    //     .catch(e => res.status(500).send(e))
}

const getCartItemsById = async (req: Request, res: Response) => {
    const id = req.params.id
    // db('cart_item')
    //     .join('product', 'product.id', 'cart_item.product_id')
    //     .select('name', 'price', 'quantity', 'img')
    //     .where({ product_id: id })
    //     .then(items => res.status(200).send(items))
    //     .catch(e => res.status(500).send(e))
}

const addItemInCart = async (req: Request, res: Response) => {
    // Checar se já existe
    
    try {
        const cart = await Cart.findOneAndUpdate(
            { user_id: req.params.id },
            { $push: { products: req.body } }
        )

        res.status(201).send(cart)
    } catch (e: any) {
        res.status(400).send(e.message)
    }

}

const removeCartItem = async (req: Request, res: Response) => {
    console.log(req.body)
    try {
        const product = await Cart.findOneAndUpdate(
            { user_id: req.params.id },
            { $pull: { products: { product: req.body.product_id } } }
        )

        res.status(200).send(product)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

export {
    getCartItems,
    getCartItemsById,
    addItemInCart,
    removeCartItem
}