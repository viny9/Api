import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || ''
    const user = jwt.decode(token) as JwtPayload
    if (user) {
        user.admin ? next() : res.status(401).send('Não autorizado')
    } else {
        res.status(401).send('Você precisa fazer login')
    }
}

const isLogged = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization || ''
    const user = jwt.decode(token) as JwtPayload
    user != null ? next() : res.status(401).send('Você precisa fazer login')
}

export {
    isAdmin,
    isLogged
}