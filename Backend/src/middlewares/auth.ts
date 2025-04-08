import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema.js";
import { ErrorHandler } from "./error.js";
import { TryCatch } from "./tryCatch.js";
import jwt from "jsonwebtoken";

export interface User extends Document {
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

    if (!token) {
      return next(new ErrorHandler("Unauthorized Admin!", 401));
    }
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

    req.user = {
      ...user.toJSON(),
      _id: user._id.toString(),
    } as User;

    next();
  }
);

export const isPatientAuth = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.patientToken;

    if (!token) {
      return next(new ErrorHandler("Unauthorized Patient!", 401));
    }
    const jwtSecret = process.env.JWT_SECRET_KEY as string;

    const decoded: any = jwt.verify(token, jwtSecret);

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "Patient") {
      return next(
        new ErrorHandler(
          `${user ? user.role : "User"} not authorized for this resource!`,
          401
        )
      );
    }

    req.user = {
      ...user.toJSON(),
      _id: user._id.toString(),
    } as User;

    next();
  }
);
