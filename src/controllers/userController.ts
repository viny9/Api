import { Request, Response } from "express";
import { db } from "../config/db";

const createUser = async (req: Request, res: Response) => {
    const user = req.body

    if (!user) res.status(404).send('Informe um usuário')

    const usersFromDb = await db('users')
        .where({ email: user.email })
        .orWhere({ telephone: user.telephone })
        .first()

    if (!usersFromDb) {
        db('users')
            .insert(user)
            .then(() => res.status(204).send())
            .catch(e => res.status(500).send(e))
    } else {
        res.status(500).send('Usuário já cadastrado')
    }
}

const login = async (req: Request, res: Response) => {
    const body = req.body

    const user = await db('users')
        .where({ email: body.email })
        .first()

    if (!user) {
        res.status(404).send('Email ou senha inválidos')
    } else {
        user.password != body.password ?
            res.status(401).send('Email ou senha inválidos')
            :
            res.status(200).send('Login')
    }
}

export {
    createUser,
    login
}