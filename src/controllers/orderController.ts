import { Request, Response } from "express";
import Order from "../models/Order";
import User from "../models/User";

const getOrders = async (req: Request, res: Response) => {
    // try {
    //     const orders: any = await db
    //         .select('o.id', 'o.user_id', 'o.status', 'o.total', 'o.payment_method', db.raw('JSON_ARRAYAGG(JSON_OBJECT("product_id", a.product_id, "quantity", a.quantity)) as products'))
    //         .from('order as o')
    //         .join('order_item as a', 'o.id', 'a.order_id')
    //         .groupBy('o.id')

    //     orders.forEach((order: any) => {
    //         order.products = JSON.parse(order.products)
    //     });

    //     res.status(200).send(orders)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
}

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
    // Talvez adicionar uma rotina bet 
    try {
        const order = await Order.findByIdAndRemove(req.params.id)
        res.status(200).send(order)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

export {
    getOrders,
    newOrder,
    updateOrderStatus,
    deleteOrder,
}