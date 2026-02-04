import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://pachuafasmohamed:Ff7yrXJpad3a0rzt@taskflow.mftl35k.mongodb.net/taskflow';
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}
