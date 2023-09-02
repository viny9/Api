import mongoose from "mongoose";

const Category = new mongoose.Schema({
    name: { type: String, required: true }
})

export = mongoose.model('category', Category)