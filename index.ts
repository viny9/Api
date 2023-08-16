import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";
import cors from 'cors'
import router from "./src/config/routes";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
})

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use('/webhook', bodyParser.raw({ type: "*/*" })) // Só para essa rota em especifico
app.use(bodyParser.json())
app.use(cors())
app.use(router)


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})