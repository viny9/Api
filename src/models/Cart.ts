import mongoose from "mongoose";

const Cart = new mongoose.Schema({
    product_id: String,

})

export = mongoose.model('cart', Cart)