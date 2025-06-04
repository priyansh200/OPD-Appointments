import mongoose from "mongoose";
import validator from "validator";
const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name Is Required!"],
        minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name Is Required!"],
        minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Email Is Required!"],
        validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    dob: {
        type: Date,
        required: [true, "DOB Is Required!"],
    },
    appointment_date: {
        type: String,
        required: [true, "Appointment Date Is Required!"],
    },
    appointment_time: {
        type: String,
        required: [true, "Appointment Time Is Required!"],
    },
    department: {
        type: String,
        required: [true, "Department Name Is Required!"],
    },
    doctor: {
        firstName: {
            type: String,
            required: [true, "Doctor First Name Is Required!"],
        },
        lastName: {
            type: String,
            required: [true, "Doctor Last Name Is Required!"],
        },
    },
    address: {
        type: String,
        required: [true, "Address Is Required!"],
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Doctor Id Is Invalid!"],
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Patient Id Is Required!"],
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
});
export const Appointment = mongoose.model("Appointment", appointmentSchema);
