import { Request, Response } from "express";
import Discount from "../models/Discount";
import Product from "../models/Product";

// Adicionar uma rotina para 
const getDiscounts = async (req: Request, res: Response) => {
    // try {
    //     let discounts = await db('discount')

    //     discounts = discounts.map(async discount => {
    //         const products = await db('product_discount')
    //             .where({ discount_id: discount.id })

    //         discount.products = products
    //         return discount
    //     })

    //     discounts = await Promise.all(discounts)
    //     res.status(200).send(discounts)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
}

const newDiscount = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const discount = await Discount.create(body)

        addProductPromotion(body.products, discount._id)

        res.status(201).send(discount)
    } catch (e: any) {
        res.status(200).send(e.message)
    }
}

const updateDiscountInfos = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const discount = await Discount.findByIdAndUpdate(req.params.id, body)
        const removedElements = await getRemovedProducts(body.products, req.params.id)

        if (body.products) {
            addProductPromotion(body.products, req.params.id)
        }

        if (removedElements.length > 0) {
            removeProductPromotion(removedElements)
        }

        res.status(200).send(discount)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

// Vai pegar todos os produtos que  dados com eliminados
const getRemovedProducts = async (products: Array<Object>, discount_id: Object) => {
    const productsIdArray = products.map((product: any) => product.product)
    let dbProducts: any = await Discount.findById(discount_id)
    dbProducts = dbProducts.products.map((product: any) => product.product)

    const removedElements = dbProducts?.filter((element: any) => !productsIdArray.includes(element))
    return removedElements
}

// Vai remover todos foramos produtos que  dados com eliminados
const removeProductPromotion = async (products: Array<Object>) => {
    products.forEach(async product => {
        await Product.findByIdAndUpdate(
            product,
            { promotionInfos: null }
        )
    })
}

const addProductPromotion = async (products: any, discount_id: Object) => {
    try {
        await products.forEach(async (product: any) => {
            product.discount_id = discount_id

            const product_id = product.product
            delete product.product

            await Product.findByIdAndUpdate(
                product_id,
                { promotionInfos: product }
            )
        });

    } catch (e: any) {
        throw new Error(e.message)
    }
}

const deleteDiscount = async (req: Request, res: Response) => {
    try {
        await Discount.findByIdAndRemove(req.params.id)
        await Product.updateMany(
            { 'promotionInfos.discount_id': req.params.id },
            { promotionInfos: null }
        )

        res.status(200).send()
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

export {
    getDiscounts,
    newDiscount,
    updateDiscountInfos,
    deleteDiscount
}