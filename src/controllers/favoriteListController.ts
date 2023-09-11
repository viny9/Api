import { Request, Response } from "express";
import List from "../models/List";

const getListItems = async (req: Request, res: Response) => {
    try {
        const list = await List.findOne({ user_id: req.params.user_id })
            .populate('products.product', 'product name price name category img')

        res.status(200).send(list)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const addItemInList = async (req: Request, res: Response) => {
    try {
        const item = req.body

        const products: any = (await List.findOne({ user_id: req.params.user_id }))?.products
        item.position = products.length + 1

        const exists = await checkIfExists(req.params.user_id, req.body.product)
        if (exists) { throw new Error('Este produto já está na lista') }

        const list = await List.findOneAndUpdate(
            { user_id: req.params.user_id },
            { $push: { products: item } }
        )

        res.status(201).send(list)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
}


// const changeItemPosition = async (req: Request, res: Response) => {
//     const arrayOfItems = await db('favorite_list_item') // Array de todos os items dentro da lista
//     const arrayOfIds = arrayOfItems.map(item => item?.id) // Array de ids de cada item da lista
//     const id = Number(req.params.user_id)
//     const oldIndex = arrayOfIds.indexOf(id)
//     const newIndex = req.body.position - 1

//     arrayOfItems.splice(newIndex, 0, arrayOfItems.splice(oldIndex, 1)[0]) // Vai atualizar a ordem dos elementos no array
//     const arrayOfItemsPositions = arrayOfItems.map(item => item?.position)

//     // Vai atualizar as posições de cada item 
//     const updatedArray = arrayOfItems.map(item => {
//         const index = arrayOfItemsPositions.indexOf(item.position)
//         item.position = index + 1
//         return item
//     })

//     // Vai atualizar o banco de dados
//     // Talvez fazer uma mudança mais tarde para atualizar somente os que foram afetados
//     updatedArray.forEach(item => {
//         db('favorite_list_item')
//             .update(item)
//             .where({ id: item.id })
//             .then(() => res.status(200).send())
//             .catch(e => res.status(500).send(e))
//     })
// }

const removeItemFromList = async (req: Request, res: Response) => {
    try {
        const { user_id, product_id } = req.params
        const exists = await checkIfExists(user_id, product_id)
        if (!exists) { throw new Error('Não foi possível encontrar esse produto') }

        const product = await List.findOneAndUpdate(
            { user_id: req.params.user_id },
            { $pull: { products: { product: product_id } } }
        )

        res.status(200).send(product)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const checkIfExists = async (user_id: string, product_id: string) => {
    const list = await List.findOne({ user_id: user_id })
    const listProduct = list?.products.find(list => list.product === product_id)

    return listProduct != undefined ? true : false
}


export {
    getListItems,
    addItemInList,
    // changeItemPosition,
    removeItemFromList
}