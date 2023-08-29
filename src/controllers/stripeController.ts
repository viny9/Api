import { Request, Response } from "express";
import { newOrder, updateOrderStatus } from "./orderController";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
})

const endpointSecret: string = process.env.STRIPE_ENDPOINT_SECRET!

const createProductPaymentSession = async (req: Request, res: Response) => {
    const body = req.body
    const lineItems = [
        {
            price_data: {
                currency: "brl",
                product_data: {
                    name: body.name,
                    description: 'Isso é um teste',
                },
                unit_amount: body.price * 100,
            },
            quantity: Number(body.quantity),
        },
    ]

    const session = await stripe.checkout.sessions.create({
        customer_email: 'viniolicar2004@gmail.com',
        line_items: lineItems,
        mode: "payment",
        metadata: { product_id: body.id, quantity: body.quantity },
        success_url: "http://127.0.0.1:5500/",
        cancel_url: "http://127.0.0.1:5500/",
        // shipping_options: shippingOptions,
        expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    })

    res.send(session.url)
}

const createCartPaymentSession = async (req: Request, res: Response) => {
    const body = req.body
    const products = body.map((product: any) => {
        return {
            product_id: product.id,
            quantity: product.quantity
        }
    })

    const lineItems = body.map((product: any) => {
        return {
            price_data: {
                currency: "brl",
                product_data: {
                    name: product.name,
                    description: 'Isso é um teste',
                },
                unit_amount: product.price * 100,
            },
            quantity: Number(product.quantity),

        }
    })

    const session = await stripe.checkout.sessions.create({
        customer_email: 'viniolicar2004@gmail.com',
        line_items: lineItems,
        mode: "payment",
        metadata: { products: JSON.stringify(products) },
        success_url: "http://127.0.0.1:5500/",
        cancel_url: "http://127.0.0.1:5500/",
        // shipping_options: shippingOptions,
        expires_at: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
    })

    res.send(session.url)
}

const listenWebhooks = async (req: any, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)!;
    } catch (err: any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    handleStripeEvent(event)

    res.send();
}

const handleStripeEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case 'checkout.session.completed':
            const session: any = event.data.object;
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent)
            const order: any = {
                user_id: 0,
                user_email: session.customer_details.email,
                total: paymentIntent.amount / 100, // Verificar depois se o total ja conta com frete
                status: session.payment_status,
                payment_method: paymentIntent.payment_method_types[0],
                metadata: session.metadata,
                payment_id: paymentIntent.id
            }

            if (paymentIntent.payment_method_types[0] === 'card') { delete order.payment_id }

            newOrder(order)

            break;

        case 'payment_intent.succeeded':
            const paymentIntentSucceeded: any = event.data.object

            if (paymentIntentSucceeded.payment_method_types[0] === 'boleto') {
                updateOrderStatus(paymentIntentSucceeded)
            }

            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }
}

export {
    createProductPaymentSession,
    createCartPaymentSession,
    listenWebhooks
}