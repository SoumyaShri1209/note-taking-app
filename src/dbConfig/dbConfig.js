
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI; 

export const connect = async () => {
  if (mongoose.connections[0].readyState) return; 
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
