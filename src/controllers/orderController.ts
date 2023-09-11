import { NextFunction, Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const order = await Order.find()
            .populate('user', '_id name email telephone')
            .populate('products.product', 'product name price name category img')

        res.status(200).send(order)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const querysArray = Object.keys(req.query)

        if (querysArray.length === 0) {
            return next()
        }

        const order = await Order.find({ user: req.query.user_id })
            .populate('user', '_id name email telephone')
            .populate('products.product', 'product name price name category img')

        res.status(200).send(order)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const getOrderById = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', '_id name email telephone')
            .populate('products.product', 'product name price name category img')

        res.status(200).send(order)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

// getLastMounthOrders
// Adicionar um filtro pra dizer de quando vai pegar os produtos

const newOrder = async (order: any) => {
    try {
        const user = await User.findOne({ email: order.user })
        order.user = user?.id

        await Order.create(order)
    } catch (error) {
        return error
    }
}

const updateOrderStatus = async (paymentIntent: any) => {
    // Talvez enviar um email tanto em caso de sucesso quanto de error
    try {
        await Order.findOneAndUpdate(
            { payment_id: paymentIntent.id },
            { status: 'paid', payment_id: null },
        )
    } catch (error) {
        console.log(error)
    }
}

const deleteOrder = async (req: Request, res: Response) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id)
        res.status(200).send(order)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

export {
    getUserOrders,
    getAllOrders,
    getOrderById,
    newOrder,
    updateOrderStatus,
    deleteOrder,
}