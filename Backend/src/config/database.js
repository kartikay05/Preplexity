import mongoose from "mongoose";

export async function connectionToDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error In Connected to Server -> ", error)
        process.exit(1);
    }
}

