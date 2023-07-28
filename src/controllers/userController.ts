import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const signUp = async (req: Request, res: Response) => {
    // Transforma a senha em hash e salva o usuário no db
    const user = req.body

    const hashPassword = await bcrypt.hash(user.password, 10)
    user.password = hashPassword

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

// Talvez criptografar o token antes de mandar
const login = async (req: Request, res: Response) => {
    // Salva as infos do usuário em um token e retorna o usuário mais o token
    try {
        const body = req.body

        const user = await db('users')
            .where({ email: body.email })
            .first()

        user.admin === 1 ? user.admin = true : user.admin = false

        if (!user) res.status(401).send('Email ou senha inválidos')

        const matchPassword = await bcrypt.compare(body.password, user.password)

        if (matchPassword) {
            delete user.password

            const secretKey = process.env.AUTH_SECRET_KEY || ''
            const token = jwt.sign({ ...user }, secretKey)
            res.status(200).send({ ...user, token })

        } else {
            res.status(401).send('Email ou senha inválidos')
        }

    } catch (e) {
        res.status(500).send(e)
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