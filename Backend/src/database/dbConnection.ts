import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


export const dbConnection = () => {
  const dbName = process.env.MONGO_URI || "healthcare";
  
  mongoose
    .connect(dbName)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};
