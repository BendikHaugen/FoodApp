import mongoose from "mongoose";
import { MONGO_URI } from "../config";

export default async () => {
  try {
    const result = await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB  \n" + "Host: " + result.connection.host);
  } catch (error) {
    console.log("Error: " + error);
  }
};
