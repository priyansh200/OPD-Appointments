import { TryCatch } from "../middlewares/tryCatch.js";
import { ErrorHandler } from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { rm } from "fs";
export const patientRegister = TryCatch(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob, role } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !role)
        return next(new ErrorHandler("Please Enter all Fields", 400));
    let user = await User.findOne({ email });
    if (user)
        return next(new ErrorHandler("User already exists", 400));
    user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        role,
    });
    generateToken(user, `Welcome ${user.firstName}`, 200, res);
});
export const login = TryCatch(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
        return next(new ErrorHandler("Please Provide all Fields", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user)
        return next(new ErrorHandler("Invalid Password or Email", 400));
    const authenticate = await user.comparePassword(password);
    if (!authenticate)
        return next(new ErrorHandler("Invalid Password", 400));
    if (role != user.role)
        return next(new ErrorHandler("User with this role does not exist", 400));
    generateToken(user, `Welcome ${user.firstName}`, 200, res);
});
export const addNewAdmin = TryCatch(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, gender, dob } = req.body;
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob)
        return next(new ErrorHandler("Please Enter all Fields", 400));
    let isRegistered = await User.findOne({ email });
    if (isRegistered)
        return next(new ErrorHandler(`${isRegistered.role} with this email already exists`, 400));
    const admin = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        role: "Admin",
    });
    res.status(200).json({
        success: true,
        message: `${admin.firstName} ${admin.lastName} registered as a new ${admin.role}.`,
    });
});
export const getAllDoctors = TryCatch(async (req, res, next) => {

    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
        success: true,
        doctors: doctors,
    });
});
export const getUserDetails = TryCatch(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});
export const logoutAdmin = TryCatch(async (req, res, next) => {
    res
        .status(200)
        .cookie("adminToken", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
        .json({
        success: true,
        message: "User logged out successfully 😊",
    });
});
export const logoutPatient = TryCatch(async (req, res, next) => {
    res
        .status(200)
        .cookie("patientToken", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
        .json({
        success: true,
        message: "User logged out successfully 😊",
    });
});
export const addNewDoctor = TryCatch(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, dob, gender, workingDays, doctorDepartment, startTime, endTime, } = req.body;
    const docAvatar = req.file;
    if (!docAvatar)
        return next(new ErrorHandler("Please Add Photo", 400));
    if (!firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !dob ||
        !gender ||
        !doctorDepartment ||
        !workingDays ||
        !startTime ||
        !endTime) {
        rm(docAvatar.path, () => {
            console.log("Deleted");
        });
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} already exists with this email`, 400));
    }
    const doctor = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        dob,
        gender,
        role: "Doctor",
        doctorDepartment,
        workingDays,
        startTime,
        endTime,
        photo: docAvatar?.path,
    });
    res.status(200).json({
        success: true,
        message: `${doctor.firstName} ${doctor.lastName} registered as new ${doctor.role}`,
    });
});
