import express from "express";
import { getAllMessage, sendMessage, } from "../controllers/messageController.js";
import { isAdminAuth } from "../middlewares/auth.js";
const router = express.Router();
router.post("/send", sendMessage);
router.get("/all",  getAllMessage);
export default router;
