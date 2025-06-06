import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import appointmentRouter from "./routers/appointmentRouter.js";
import messageRouter from "./routers/messageRouter.js";
import orderRouter from "./routers/orderRoutes.js";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
config({
    path: "./config/.env",
});
const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));


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
dbConnection();
app.use(errorMiddleware);
export default app;
