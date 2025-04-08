import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  getPatientAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";
import { isAdminAuth, isPatientAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuth, postAppointment);

router.get("/get", isAdminAuth, getAllAppointments);

router.get("/getPatientAppointments", isPatientAuth, getPatientAppointments);

router.put("/update/:id", isAdminAuth, updateAppointmentStatus);

router.delete("/delete/:id", isAdminAuth, deleteAppointment);

export default router;
