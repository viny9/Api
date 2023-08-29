import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: String,
    email: String,
    telephone: Number,
    password: String,
    admin: Boolean,
})

export = mongoose.model('user', User)