import { connect } from "mongoose";
import { env } from "./env";

const dbConnect = async () => {
    try {
    if (!env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined");
    }

    await connect(env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

export default dbConnect;