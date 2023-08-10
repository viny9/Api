import { Request, Response } from "express";
import { db } from "../config/db";

const getOrders = async (req: Request, res: Response) => {
    try {
        let orders = await db('order')

        orders = orders.map(async order => {
            const orderProducts = await db('order_item')
                .where({ order_id: order.id })
            order.products = orderProducts
            return order
        })

        orders = await Promise.all(orders)

        res.status(200).send(orders)
    } catch (e) {
        res.status(500).send(e)
    }

}

const newOrder = async (req: Request, res: Response) => {
    const body = req.body
    const products = body.products

    delete body.products

    const t = await getOrderTotal(products)
    body.total = t

    await db('order')
        .insert(body)
        .catch(e => res.status(500).send(e))

    const allOrders = await db('order')
    const lastProductIndex = allOrders.length - 1

    await products.forEach((product: any) => {
        product.order_id = allOrders[lastProductIndex]?.id || 1

        db('order_item')
            .insert(product)
            .then(() => res.status(201).send())
            .catch(e => res.status(500).send(e))
    });
}

const getOrderTotal = async (products: any) => {
    let total = 0;

    let dbProducts = products.map(async (product: any) => {
        const dbProduct = await db('product')
            .where({ id: product.product_id })
            .first()

        dbProduct.quantity = product.quantity

        return dbProduct
    })

    dbProducts = await Promise.all(dbProducts)
    dbProducts.forEach((product: any) => {
        let calc = product.price * product.quantity
        total += calc
    });

    return total
}

const deleteOrder = (req: Request, res: Response) => {
    db('order_item')
        .delete()
        .where({ order_id: req.params.id })
        .catch(e => res.status(500).send(e))

    db('order')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(200).send(e))
}

export {
    getOrders,
    newOrder,
    deleteOrder
}