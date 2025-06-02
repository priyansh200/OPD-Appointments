import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import { TryCatch } from "./tryCatch.js";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date;
  gender: "Male" | "Female" | "Non-Binary";
  password: string;
  role: "Patient" | "Admin" | "Doctor";
}

export const isAdminAuth = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.adminToken;

    if (!token) return next(new ErrorHandler("Unauthorized Admin!", 401));

    const jwtSecret = process.env.JWT_SECRET_KEY as string;
    const decoded: any = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "Admin") {
      return next(
        new ErrorHandler(
          `${user ? user.role : "User"} not authorized for this resource!`,
          401
        )
      );
    }

    const typedUser = user as (Document & IUser);
    req.user = {
      ...typedUser.toObject(),
      _id: typedUser._id.toString(),
    } as IUser;

    next();
  }
);
