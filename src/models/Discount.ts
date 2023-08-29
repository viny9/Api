import mongoose from "mongoose";

const Discount = new mongoose.Schema({
    product_id: String,

})

export = mongoose.model('discount', Discount)