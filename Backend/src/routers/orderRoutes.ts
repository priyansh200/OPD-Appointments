import express from "express";
import { isAdminAuth } from "../middlewares/auth.js";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/orderController.js";

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newOrder);

// route - /api/v1/order/my
app.get("/my", myOrders);

// route - /api/v1/order/my
app.get("/all", isAdminAuth, allOrders);

// route - /api/v1/order/:id
app
  .route("/:id")
  .get(getSingleOrder)
  .put(isAdminAuth, processOrder)
  .delete(isAdminAuth, deleteOrder);

export default app;
