import dotenv from "dotenv";
dotenv.config(); // 1. Load env vars immediately on app start

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";

import messageRouter from "./routers/messageRouter.js";
import userRouter from "./routers/userRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRoutes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

const dbConnection = () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MongoDB URI missing in environment variables");
    process.exit(1);
  }

  mongoose
    .connect(mongoUri)
    .then(() => console.log("Connected to Database"))
    .catch((err) => {
      console.error("Error connecting to Database:", err);
      process.exit(1);
    });
};

// Call the db connection function early on
dbConnection();

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/public/temp", express.static("./public/temp"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("API Working with /api/v1");
});

app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use("/api/v1/meds", productRouter);
app.use("/api/v1/order", orderRouter);

app.use(errorMiddleware);

export default app;
