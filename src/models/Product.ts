import mongoose from "mongoose";

const Product = new mongoose.Schema(
    {
        name: { type: String },
        price: { type: Number },
        category: { type: String },
        img: { type: Array<String> },
        promotionInfos: {
            discount_id: { type: String, ref: 'discount' },
            percentage: { type: Number },
        }
    })

export = mongoose.model('product', Product)