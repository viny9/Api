import { Request, Response } from "express";
import { db } from "../config/db";
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { storages } from "../config/firebase";

const getImgs = (req: Request, res: Response) => {
    db('image')
        .then(imgs => res.status(200).send(imgs))
        .catch(e => res.status(500).send(e))
}

const fileUpload = async (req: any, res: Response) => {
    const { originalname: name, size, filename: key } = req.file

    const img = {
        name,
        size,
        key,
        url: ''
    }

    const bucket = storages.bucket()
    const storageFile = bucket.file(img.name)

    // Adicionar condicional pra mudar url quando tiver no mode de produção
    img.url = `${process.env.APP_URL}/files/${key}`

    db('image')
        .insert(img)
        .then(() => res.status(201).send())
        .catch(e => res.status(500).send(e))

}

// const deleteImg = (req: Request, res: Response) => {

//     promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'uploads'))

//     db('image')
//         .delete()
//         .where({ id: req.params.id })
//         .then(() => res.status(200).send())
//         .catch(e => res.status(500).send(e))
// }

export {
    getImgs,
    fileUpload,
    // deleteImg
}