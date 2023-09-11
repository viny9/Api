import { Request, Response } from "express";
import Discount from "../models/Discount";
import Product from "../models/Product";

// Adicionar uma rotina para executar as promoção quando a data chegar
const getDiscounts = async (req: Request, res: Response) => {
    try {
        const discount = await Discount.find()
            .populate('products.product', 'product name price name category img')

        res.status(200).send(discount)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const newDiscount = async (req: Request, res: Response) => {
    try {
        const body = req.body
        const exists = await checkIfExists(body.name)
        if (exists) { throw new Error('Já existe uma promoção com esse nome') }

        const discount = await Discount.create(body)
        addProductPromotion(body.products, discount._id)

        res.status(201).send(discount)
    } catch (e: any) {
        res.status(200).send(e.message)
    }
}

const checkIfExists = async (discountName: string) => {
    const discount = await Discount.findOne({ name: discountName })
    return discount != null ? true : false
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

// Vai pegar todos os produtos que dados com eliminados
const getRemovedProducts = async (products: Array<Object>, discount_id: Object) => {
    try {
        const productsIdArray = products.map((product: any) => product.product)
        let dbProducts: any = await Discount.findById(discount_id)
        dbProducts = dbProducts.products.map((product: any) => product.product)

        const removedElements = dbProducts?.filter((element: any) => !productsIdArray.includes(element))
        return removedElements
    } catch (e: any) {
        throw new Error(e.message)
    }
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

// Vai remover todos os produtos que foram dados como eliminados
const removeProductPromotion = async (products: Array<Object>) => {
    products.forEach(async product => {
        await Product.findByIdAndUpdate(
            product,
            { promotionInfos: null }
        )
    })
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
        res.status(404).send(e.message)
    }
}

export {
    getDiscounts,
    newDiscount,
    updateDiscountInfos,
    deleteDiscount
}