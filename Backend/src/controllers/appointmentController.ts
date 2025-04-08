import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../middlewares/error.js";
import { TryCatch } from "../middlewares/tryCatch.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";

const daysOfWeekMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export const postAppointment = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender, // Add gender field
      appointment_date,
      appointment_time,
      department,
      doctor_firstName,
      doctor_lastName,
      address,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dob ||
      !gender || // Check if gender is provided
      !appointment_date ||
      !appointment_time ||
      !department ||
      !doctor_firstName ||
      !doctor_lastName ||
      !address
    ) {
      return next(new ErrorHandler("Please enter all fields!", 400));
    }

    const doctor = await User.findOne({
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      role: "Doctor",
      doctorDepartment: department,
    });

    if (!doctor) {
      return next(new ErrorHandler("Doctor not found!", 404));
    }

    // Check if doctor's working days and hours are defined
    if (!doctor.workingDays || !doctor.startTime || !doctor.endTime) {
      return next(
        new ErrorHandler("Doctor working hours information is incomplete!", 400)
      );
    }

    // Check for conflicting appointments
    const isConflict = await Appointment.findOne({
      doctorId: doctor._id,
      appointment_date,
      appointment_time,
      status: { $in: ["Accepted", "Pending"] },
    });

    if (isConflict) {
      return next(new ErrorHandler("Time slot is already booked!", 400));
    }

    // Check if doctor is available on the appointment day
    const workingDaysSplit = doctor.workingDays.split(",");
    const doctorAvailability = workingDaysSplit.some(
      (day) => daysOfWeekMap[day] === new Date(appointment_date).getDay()
    );

    if (!doctorAvailability) {
      return next(
        new ErrorHandler("Doctor is not available on this day!", 400)
      );
    }

    // Check if appointment time is within doctor's working hours
    const startTime = new Date(`${appointment_date}T${doctor.startTime}`);
    const endTime = new Date(`${appointment_date}T${doctor.endTime}`);
    const appointmentTime = new Date(`${appointment_date}T${appointment_time}`);
    const appointmentEndTime = new Date(appointmentTime.getTime() + 30 * 60000); // 30 minutes later

    if (appointmentTime < startTime || appointmentEndTime > endTime) {
      return next(
        new ErrorHandler("Appointment time is outside working hours!", 400)
      );
    }

    // Check if appointment time is in 30-minute intervals
    if (
      appointmentTime.getMinutes() % 30 !== 0 ||
      appointmentTime.getSeconds() !== 0 ||
      appointmentTime.getMilliseconds() !== 0
    ) {
      return next(
        new ErrorHandler("Appointments must start at 30-minute intervals!", 400)
      );
    }

    // Create the appointment
    const patientId = req.user?._id;
    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender, // Include gender field
      appointment_date,
      appointment_time,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      address,
      doctorId: doctor._id,
      patientId,
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Appointment sent successfully!",
      appointment,
    });
  }
);

export const getPatientAppointments = TryCatch(async (req, res, next) => {
  const patientId = req.user;
  const appointments = await Appointment.find({ patientId });
  res.status(200).json(appointments);
});

export const getAllAppointments = TryCatch(async (req, res, next) => {
  const appointment = await Appointment.find();
  res.status(200).json({
    success: true,
    appointment,
  });
});

export const updateAppointmentStatus = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);

  if (!appointment) return next(new ErrorHandler("Appointment Not Found", 400));

  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Appointment Status Updated",
    appointment,
  });
});

export const deleteAppointment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment Not Found", 400));

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment Deleted",
  });
});
