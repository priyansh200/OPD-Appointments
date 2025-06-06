import express from "express";
import { addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, login, logoutAdmin, logoutPatient, patientRegister, } from "../controllers/userController.js";
import { isAdminAuth, isPatientAuth } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.post("/patient/register", patientRegister);

router.post("/login", login);

router.post("/admin/new", isAdminAuth, addNewAdmin);

router.post(
  "/doctor/new",
  isAdminAuth,
  singleUpload.single("docAvatar"),
  addNewDoctor
);

router.get("/doctors", getAllDoctors);

router.get("/admin/me", isAdminAuth, getUserDetails);

router.get("/patient/me", isPatientAuth, getUserDetails);

router.get("/admin/logout", isAdminAuth, logoutAdmin);

router.get("/patient/logout", isPatientAuth, logoutPatient);
export default router;
