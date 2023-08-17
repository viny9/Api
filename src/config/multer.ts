import { Request } from "express";
import multer from "multer";
import path from 'path'

const multerConfig = {
    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: multer.diskStorage({
        destination: (req: Request, file: any, cb: any) => {
            cb(null, path.resolve(__dirname, '..', '..', 'uploads'))
        },
        filename: (req: Request, file: any, cb: any) => {
            // Mudar depois
            cb(null, `${Date.now()}_${file.originalname}`)
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024 // Tamanho dos arquivos
    },

    // fileFilter: (req: Request, file: File, cb: any) => {
    // Tipos de arquivos aceitos
    //     const allowedMimes = [
    //         'image/jpeg'
    //     ]
    // }
}

export { multerConfig }
