import { Request, Response } from "express";
import List from "../models/List";

const getListItems = async (req: Request, res: Response) => {
    try {
        // res.status(200).send(products?.list_items)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

const addItemInList = async (req: Request, res: Response) => {
    try {
        // Verificar se já na lista
        const item = req.body

        const products: any = (await List.findOne({ user_id: req.params.id }))?.products
        item.position = products.length + 1

        const cart = await List.findOneAndUpdate(
            { user_id: req.params.id },
            { $push: { products: item } }
        )

        res.status(201).send(cart)
    } catch (e: any) {
        res.status(400).send(e.message)
    }
}

// const newItem = req.body
// const checkIfExists = await db('favorite_list_item')
//     .where({ product_id: newItem.product_id })


// if (checkIfExists.length === 0) {
//     const items = await db('favorite_list_item')

//     newItem.position = items.length + 1 || 1

//     db('favorite_list_item')
//         .insert(newItem)
//         .then(() => res.status(201).send())
//         .catch(e => res.status(500).send(e))
// } else {
//     res.send('Este produto já está no carrinho')
// }


// const changeItemPosition = async (req: Request, res: Response) => {
//     const arrayOfItems = await db('favorite_list_item') // Array de todos os items dentro da lista
//     const arrayOfIds = arrayOfItems.map(item => item?.id) // Array de ids de cada item da lista
//     const id = Number(req.params.id)
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
        const product = await List.findOneAndUpdate(
            { user_id: req.params.id },
            { $pull: { products: { product: req.body.product_id } } }
        )

        res.status(200).send(product)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
}

export {
    getListItems,
    addItemInList,
    // changeItemPosition,
    removeItemFromList
}