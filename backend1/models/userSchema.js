import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name must be at least 3 characters long"],
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last Name must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone Number must be exactly 10 digits long"],
        maxLength: [10, "Phone Number must be exactly 10 digits long"],
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Non-Binary"],
    },
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters long"],
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "Patient", "Doctor", "Lab"],
    },
    startTime: String,
    endTime: String,
    doctorDepartment: String,
    workingDays: String,
    photo: {
        type: String,
        required: [false, "Please enter Photo"],
    },
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};
userSchema.methods.generateJsonWebToken = function () {
    const secretKey = String('your_jwt_secret_key');
    return jwt.sign({ id: this._id }, secretKey, {
        expiresIn: "7d",
    });
};
userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = new Date(this.dob);
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = mongoose.model("User", userSchema);
