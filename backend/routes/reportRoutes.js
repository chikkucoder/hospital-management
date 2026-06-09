import { Router } from "express";
import * as c from "../controllers/reportController.js";
const r = Router();
r.get("/summary", c.summary);
export default r;
