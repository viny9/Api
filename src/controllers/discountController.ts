import { Request, Response } from "express";
import { db } from "../config/db";

const getDiscounts = async (req: Request, res: Response) => {
    try {
        let discounts = await db('discount')

        discounts = discounts.map(async discount => {
            const products = await db('product_discount')
                .where({ discount_id: discount.id })

            discount.products = products
            return discount
        })

        discounts = await Promise.all(discounts)
        res.status(200).send(discounts)
    } catch (e) {
        res.status(500).send(e)
    }
}

const newDiscount = async (req: Request, res: Response) => {
    const discount = req.body
    const products = discount.products

    delete discount.products

    await db('discount')
        .insert(discount)
        .catch(e => res.status(500).send(e))

    const allDiscounts = await db('discount')
    const lastProductIndex = allDiscounts.length - 1

    await products.forEach(async (product: any) => {
        product.discount_id = allDiscounts[lastProductIndex]?.id || 1

        db('product_discount')
            .insert(product)
            .then(() => res.status(200).send())
            .catch(e => res.status(500).send(e))
    });
}

const updateDiscountInfos = async (req: Request, res: Response) => {
    const body = req.body
    const dbProducts: any = await db('product_discount')
        .where({ discount_id: req.params.id })

    updateDiscountProducts(body.products, dbProducts)
        .catch(e => res.status(500).send(e))

    delete body.products
    db('discount')
        .update(body)
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))
}

const updateDiscountProducts = (products: any, dbProducts: any) => {
    return new Promise((resolve, reject) => {
        const productIdArray = products.map((product: any) => product.product_id)
        const dbProductsIdArray = dbProducts.map((product: any) => product.product_id)

        // Adiciona os novos produtos na promoção
        products.forEach((product: any) => {
            if (dbProductsIdArray.includes(product.product_id) === false) {
                db('product_discount')
                    .insert(product)
                    .catch(e => reject(e))
            }
        });

        // Vai deletar os produtos que foram removidos da promoção
        // Talvez terar que ajustar futuramente
        const deleteArray = dbProducts.map((product: any) => {
            if (productIdArray.includes(product.product_id) === false) {
                return product
            }
        });

        deleteArray.forEach(async (product: any) => {
            if (product != undefined) {

                db('product_discount')
                    .delete()
                    .where({ product_id: product.product_id })
                    .catch(e => reject(e))
            }
        });

        resolve(null)
    })
}

const deleteDiscount = (req: Request, res: Response) => {
    db('product_discount')
        .delete()
        .where({ discount_id: req.params.id })
        .catch(e => res.status(500).send(e))

    db('discount')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))
}

export {
    getDiscounts,
    newDiscount,
    updateDiscountInfos,
    deleteDiscount
}