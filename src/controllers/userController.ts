import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import User from "../models/User";

const signUp = async (req: Request, res: Response) => {
    try {
        const user = req.body

        if (Object.keys(user).length === 0) { throw new Error('Informe um usuário') }

        const hashPassword = await bcrypt.hash(user.password, 10)
        user.password = hashPassword

        const exists = await checkIfExists(user.email)
        if (exists) { throw new Error('Esse email já está em uso') }

        await User.create(user)
        res.status(201).send('Usuário criado com sucesso')
    } catch (e: any) {
        res.status(400).send(e.message)
    }
}

const checkIfExists = async (email: string) => {
    const user = await User.findOne({ email: email })

    return user != null? true : false 
}

const login = async (req: Request, res: Response) => {
    // Talvez criptografar o token antes de mandar

    try {
        const body = req.body

        let user: any = await User.findOne({ email: body.email })
        if (user === null) throw new Error('Email ou senha inválidos')

        const matchPassword = await bcrypt.compare(body.password, user.password)
        if (!matchPassword) throw new Error('Email ou senha inválidos')

        delete user._doc.password

        const expireAt = user.admin ? (60 * 60 * 24 * 1) : (60 * 60 * 24 * 30) // Segundo / Minutos / Horas / Dias
        const secretKey = process.env.AUTH_SECRET_KEY || ''
        const token = jwt.sign({ ...user._doc }, secretKey, { expiresIn: expireAt })

        user._doc.token = token

        res.status(200).send(user)
    } catch (e: any) {
        res.status(401).send(e.message)
    }
}

const getUsers = async (req: Request, res: Response) => {
    try {
        const user = await User.find()
        res.status(200).send(user)
    } catch (e: any) {
        res.status(500).send(e.message)
    }
}

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).send(user)
    } catch (e: any) {
        res.status(404).send('Nenhum usuário encontrado')
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const user = req.body
        await User.findByIdAndUpdate(req.params.id, user)

        res.status(201).send()
    } catch (e: any) {
        res.status(500).send(e)
    }
}

const deleteUser = async (req: Request, res: Response) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(201).send()
    } catch (e: any) {
        res.status(404).send('Usuário não encontrado')
    }
}

export {
    signUp,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}