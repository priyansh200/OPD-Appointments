import { Request, Response, NextFunction } from "express";
import { Message } from "../models/messageSchema.js";
import { TryCatch } from "../middlewares/tryCatch.js";
import { ErrorHandler } from "../middlewares/error.js";

export const sendMessage = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    await Message.create({ firstName, lastName, email, phone, message });
    res.status(200).json({
      success: true,
      message: "Message Send Successfully",
    });
  }
);

export const getAllMessage = TryCatch(async (req, res, next) => {
  const message = await Message.find();
  res.status(200).json({
    success: true,
    message,
  });
});
