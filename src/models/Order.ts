import mongoose from "mongoose";

const Order = new mongoose.Schema({
    user: { type: String, required: true, ref: 'user' },
    products: [
        {
            product: { type: String, required: true, ref: 'product' },
            quantity: { type: Number, required: true, default: 1 }
        }
    ],
    payment_infos: {
        card_last_four_numbers: { type: Number },
        discount: { type: Number },
        shipping: { type: Number },
        amount: { type: Number, required: true },
        payment_method: { type: String },
    },
    payment_id: { type: String },
    status: { type: String, required: true, default: 'unpaid' },
    delivery_status: { type: String }
})

export = mongoose.model('order', Order)