import { Router } from "express";
import * as c from "../controllers/appointmentController.js";

const r = Router();
r.get("/", c.listAppointments);
r.post("/", c.createAppointment);
r.delete("/:id", c.deleteAppointment);
export default r;
