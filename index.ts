import dotenv from 'dotenv'
dotenv.config()

import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import router from "./src/config/routes";
import conect from "./src/config/mongodb";

const app = express()
const port = process.env.PORT 

app.use('/webhook', bodyParser.raw({ type: "*/*" })) // Só para essa rota em especifico
app.use(bodyParser.json())
app.use(cors())
app.use(router)
conect()

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})