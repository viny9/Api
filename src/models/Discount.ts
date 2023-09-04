import mongoose from "mongoose";

const Discount = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    start_at: { type: String, required: true },
    end_at: { type: String, required: true },
    activate: { type: Boolean, required: true, default: false },
    products: [
        {
            product: { type: String, required: true, ref: 'product' }
        }
    ]
})

export = mongoose.model('discount', Discount)