import mongoose from "mongoose";

const Product = new mongoose.Schema(
    {
        name: String,
        price: Number,
        category: String,
        img: Array<string>
})

export = mongoose.model('product', Product)