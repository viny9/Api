import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    telephone: { type: Number },
    password: { type: String },
    admin: { type: Boolean },
})

export = mongoose.model('user', User)