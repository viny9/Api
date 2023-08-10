import { Request, Response } from "express";
import { db } from "../config/db";

const getCategories = (req: Request, res: Response) => {
    db('product_category')
        .then(categories => res.status(200).send(categories))
        .catch(e => res.status(500).send(e))
}

const newCategory = async (req: Request, res: Response) => {
    const body = req.body

    const categories = await db('product_category')
        .where({ name: body.name })

    if (categories.length === 0) {
        db('product_category')
            .insert(body)
            .then(() => res.status(201).send())
            .catch(e => res.status(500).send(e))
    } else {
        res.status(400).send('Está categoria já existe')
    }

}

const editCategory = (req: Request, res: Response) => {
    const body = req.body

    db('product_category')
        .update(body)
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))
}

const deleteCategory = async (req: Request, res: Response) => {
    db('product_category')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(200).send())
        .catch(e => res.status(500).send(e))


}

export {
    newCategory,
    getCategories,
    editCategory,
    deleteCategory
}