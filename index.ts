import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from 'cors'
import router from "./src/config/routes";
import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(router)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/webhook', bodyParser.raw({ type: "*/*" })) // Só para essa rota em especifico
app.use('/files', express.static(path.resolve(__dirname, 'uploads')))

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})