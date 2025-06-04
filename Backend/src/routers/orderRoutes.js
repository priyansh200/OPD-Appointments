import express from "express";
import { isAdminAuth } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder, } from "../controllers/orderController.js";
const app = express.Router();
app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/all",  allOrders);
app
    .route("/:id")
    .get(getSingleOrder)
    .put(isAdminAuth, processOrder)
    .delete(isAdminAuth, deleteOrder);
export default app;
