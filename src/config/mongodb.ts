import mongoose from "mongoose";

const conect = () => {
    try {
        const uri: string = process.env.MONGODB_URI!
        mongoose.connect(uri)
        console.log('Conectado com sucesso ao banco')
    } catch (error) {
        console.log(error)
    }
}

export default conect