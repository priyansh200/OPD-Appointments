import { error } from "console";
import { Request, Response, NextFunction } from "express";

export class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "CastError") err.message = "Invalid ID/type";

  if (err.statusCode === 11000) err.message = `Duplicate Object Entered`;

  if (err.name === "JsonWebTokenError")
    err.message = "Json Web Token is invalid, Try Again.";

  if (err.name === "TokenExpiredError")
    err.message = "Json Web Token is invalid, Try Again.";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
