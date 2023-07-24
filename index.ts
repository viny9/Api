import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from 'cors'
import router from "./src/config/routes";

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())
app.use(router)

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})
