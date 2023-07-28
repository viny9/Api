import { Request, Response } from "express";
import { db } from "../config/db";

const signUp = async (req: Request, res: Response) => {
    const user = req.body

    if (!user) res.status(400).send('Informe um usuário')

    const usersFromDb = await db('users')
        .where({ email: user.email })
        .orWhere({ telephone: user.telephone })
        .first()

    if (!usersFromDb) {
        db('users')
            .insert(user)
            .then(() => res.status(201).send('Usuário criado com sucesso'))
            .catch(e => res.status(500).send(e))
    } else {
        res.status(400).send('Usuário já cadastrado')
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

const getUsers = (req: Request, res: Response) => {
    db('users')
        .then(users => res.status(200).send(users))
        .catch(e => res.status(500).send(e))
}

const getUserById = (req: Request, res: Response) => {
    db('users')
        .where({ id: req.params.id })
        .first()
        .then(user => res.status(200).send(user))
        .catch(e => res.status(500).send(e))

    // Adicionar tratamento 404 para quando não econtrar nada 
}

const updateUser = (req: Request, res: Response) => {
    const user = req.body

    db('users')
        .update(user)
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

const deleteUser = (req: Request, res: Response) => {
    db('users')
        .delete()
        .where({ id: req.params.id })
        .then(() => res.status(204).send())
        .catch(e => res.status(500).send(e))
}

export {
    signUp,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}