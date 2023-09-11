import mongoose from "mongoose";

const List = new mongoose.Schema({
    user_id: { type: String, required: true },
    products: [
        {
            _id: false,
            product: { type: String, required: true, ref: 'product' },
            position: { type: Number, required: true }
        }
    ]
})

export = mongoose.model('list', List)