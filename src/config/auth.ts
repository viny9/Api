import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || ''
    const user: any = jwt.decode(token)

    if (user) {
        if (new Date(user.exp * 1000) > new Date()) {
            user.admin ? next() : res.status(401).send('Não autorizado')
        } else { res.status(401).send('Sua sessão expirou') }
    } else { res.status(401).send('Você precisa fazer login') }
}

const isLogged = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || ''
    const user: any = jwt.decode(token)

    if (user) {
        new Date(user.exp * 1000) > new Date() ? next() : res.status(401).send('Sua sessão expirou')
    } else { res.status(401).send('Você precisa fazer login') }
}

export {
    isAdmin,
    isLogged
}