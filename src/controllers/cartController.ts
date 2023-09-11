import { Request, Response } from "express";
import Cart from "../models/Cart";

const getCartItems = async (req: Request, res: Response) => {
    try {
        const cart = await Cart.findOne({ user_id: req.params.user_id }, { __v: 0 })
            .populate('products.product', 'product name price name category img')

        res.status(200).send(cart)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const addItemInCart = async (req: Request, res: Response) => {
    try {
        const { body, params } = req
        const exists = await checkIfExists(params.user_id, body.product)
        if (exists) { throw new Error('Este produto já está no carrinho') }

        const cart = await Cart.findOneAndUpdate(
            { user_id: req.params.user_id },
            { $push: { products: req.body } }
        )

        res.status(201).send(cart)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
}

const removeCartItem = async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.params
        const exists = await checkIfExists(user_id, product_id)
        if (!exists) { throw new Error('Não foi possível encontrar esse produto') }

        const product = await Cart.findOneAndUpdate(
            { user_id: user_id },
            { $pull: { products: { product: product_id } } }
        )

        res.status(200).send(product)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const checkIfExists = async (user_id: string, product_id: string) => {
    const cart = await Cart.findOne({ user_id: user_id })
    const cartProduct = cart?.products.find(product => product.product === product_id)
    return cartProduct != undefined ? true : false
}
export {
    getCartItems,
    addItemInCart,
    removeCartItem
}