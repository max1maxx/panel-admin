import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/powertesis");
        console.log("DB connection established");
    } catch (e) {
        console.log("This error: " + e);
    }
};
