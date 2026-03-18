import mongoose from "mongoose";

const connectionToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected: ${conn?.connection?.host}`)
    } catch (error) {
        console.log("Error In Connected to Server -> ", error)
        process.exit(1);
    }
}


export default connectionToDB;
