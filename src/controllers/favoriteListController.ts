import { Request, Response } from "express";
import { db } from "../config/db";

const getListItems = (req: Request, res: Response) => {
    db('favorite_list_item')
        .then(items => items.sort((a, b) => a.position - b.position))
        .then(items => res.status(201).send(items))
        .catch(e => res.status(500).send(e))
}

const addItemInList = async (req: Request, res: Response) => {
    const newItem = req.body
    const checkIfExists = await db('favorite_list_item')
        .where({ product_id: newItem.product_id })


    if (checkIfExists.length === 0) {
        const items = await db('favorite_list_item')

        newItem.position = items.length + 1 || 1

        db('favorite_list_item')
            .insert(newItem)
            .then(() => res.status(201).send())
            .catch(e => res.status(500).send(e))
    } else {
        res.send('Este produto já está no carrinho')
    }

}

const changeItemPosition = async (req: Request, res: Response) => {
    const arrayOfItems = await db('favorite_list_item') // Array de todos os items dentro da lista
    const arrayOfIds = arrayOfItems.map(item => item?.id) // Array de ids de cada item da lista
    const id = Number(req.params.id)
    const oldIndex = arrayOfIds.indexOf(id)
    const newIndex = req.body.position - 1

    arrayOfItems.splice(newIndex, 0, arrayOfItems.splice(oldIndex, 1)[0]) // Vai atualizar a ordem dos elementos no array
    const arrayOfItemsPositions = arrayOfItems.map(item => item?.position)

    // Vai atualizar as posições de cada item 
    const updatedArray = arrayOfItems.map(item => {
        const index = arrayOfItemsPositions.indexOf(item.position)
        item.position = index + 1
        return item
    })

    // Vai atualizar o banco de dados
    // Talvez fazer uma mudança mais tarde para atualizar somente os que foram afetados
    updatedArray.forEach(item => {
        db('favorite_list_item')
            .update(item)
            .where({ id: item.id })
            .then(() => res.status(200).send())
            .catch(e => res.status(500).send(e))
    })
}

const removeItemFromList = (req: Request, res: Response) => {
    db('favorite_list_item')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))
}

export {
    getListItems,
    addItemInList,
    changeItemPosition,
    removeItemFromList
}