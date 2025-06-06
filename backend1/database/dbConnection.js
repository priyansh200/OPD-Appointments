import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const dbConnection = () => {
    mongoose
        .connect("mongodb+srv://khandelwalpriyansh878:etcP8O1HaOMVOUc3@cluster0.2rmeqnp.mongodb.net/opd")
        .then(() => {
        console.log("Connected to Database");
    })
        .catch((err) => {
        console.error("Error:", err);
    });
};
