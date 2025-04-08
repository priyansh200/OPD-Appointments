import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { dbConnection } from "./database/dbConnection.js";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.js";

import messageRouter from "./routers/messageRouter.js";
import userRouter from "./routers/userRouter.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import productRouter from "./routers/productRouter.js";
import orderRouter from "./routers/orderRoutes.js";

config({
  path: "./config/.env",
});

const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL as string,
      process.env.DASHBOARD_URL as string,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

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

dbConnection();

// app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware);

export default app;
