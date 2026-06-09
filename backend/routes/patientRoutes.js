import { Router } from "express";
import * as c from "../controllers/patientController.js";

const r = Router();
r.get("/", c.listPatients);
r.get("/:id", c.getPatient);
r.post("/", c.createPatient);
r.put("/:id", c.updatePatient);
r.delete("/:id", c.deletePatient);
export default r;
