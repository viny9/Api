import { Request, Response } from "express";
import Category from "../models/Category";

// Adicionar metodo para pegar produtos por categoria 
const getCategories = async (req: Request, res: Response) => {
    try {
        const category = await Category.find()
        res.status(200).send(category)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const newCategory = async (req: Request, res: Response) => {
    try {
        const exists = await checkIfExists(req.body.name)
        if (exists) { throw new Error("Essa categoria já existe") }
        
        const category = await Category.create(req.body)
        res.status(201).send(category)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const checkIfExists = async (categoryName: string) => {
    const category = await Category.findOne({ name: categoryName })
    return category != null ? true : false
}

const editCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).send(category)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const deleteCategory = async (req: Request, res: Response) => {
    try {
        const category = await Category.findByIdAndRemove(req.params.id)
        res.status(200).send(category)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

export {
    newCategory,
    getCategories,
    editCategory,
    deleteCategory
}