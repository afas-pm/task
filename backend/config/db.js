import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://pachuafasmohamed:Ff7yrXJpad3a0rzt@taskflow.mftl35k.mongodb.net/taskflow')
    .then(() => console.log("MongoDB connected successfully"))
    }
