import mongoose from "mongoose";

const Cart = new mongoose.Schema({
    user_id: { type: String, required: true },
    products: [
        {
            _id: false,
            product: { type: String, required: true, ref: 'product' },
            quantity: { type: Number, required: true }
        }
    ]
})

export = mongoose.model('cart', Cart)   