import { Request, Response } from "express";
import { db } from "../config/db";

const getOrders = async (req: Request, res: Response) => {
    try {
        const orders: any = await db
            .select('o.id', 'o.user_id', 'o.status', 'o.total', 'o.payment_method', db.raw('JSON_ARRAYAGG(JSON_OBJECT("product_id", a.product_id, "quantity", a.quantity)) as products'))
            .from('order as o')
            .join('order_item as a', 'o.id', 'a.order_id')
            .groupBy('o.id')

        orders.forEach((order: any) => {
            order.products = JSON.parse(order.products)
        });

        res.status(200).send(orders)
    } catch (e) {
        res.status(500).send(e)
    }

}

const newOrder = async (order: any) => {
    try {
        await db.transaction(async trx => {
            // Adicionar o id do stripe no lugar do increment
            let products

            if (order.metadata.products) {
                // Caso seja uma compra efetuada pelo carrinho
                products = JSON.parse(order.metadata.products)
            } else {
                // Caso seja uma compra de um produto individual
                products = [order.metadata]
            }

            const user = await trx.table('users').where({ email: order.user_email }).first()
            order.user_id = user.id

            delete order.user_email
            delete order.metadata

            await trx.insert(order).table('order')

            const allOrders = await trx.table('order')
            const lastProductIndex = allOrders.length - 1

            await products.forEach(async (product: any) => {
                product.order_id = allOrders[lastProductIndex]?.id || 1

                await trx.insert(product).table('order_item')
            })
        })
    } catch (error) {
        return error
    }
}

const updateOrderStatus = async (paymentIntent: any) => {
    try {
        await db.transaction(async trx => {
            const order = await trx.table('order').where({ payment_id: paymentIntent.id }).first()

            order.status = 'paid'
            order.payment_id = null

            await trx.update(order).table('order').where({ id: order.id })
        })
    } catch (error) {
        console.log(error)
    }
}

const getOrderTotalAmount = async (products: any) => {
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
    getOrderTotalAmount,
    newOrder,
    updateOrderStatus,
    deleteOrder,
}