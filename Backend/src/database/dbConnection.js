import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
export const dbConnection = () => {
    mongoose
        .connect("mongodb+srv://khandelwalpriyansh878:5lWukDdAOcEQuWrE@cluster0.2rmeqnp.mongodb.net/opd")
        .then(() => {
        console.log("Connected to Database");
    })
        .catch((err) => {
        console.error("Error:", err);
    });
};
