import { Router } from "express";
import * as c from "../controllers/serviceController.js";

const r = Router();
r.get("/", c.listServices);
r.post("/", c.createService);
r.put("/:id", c.updateService);
r.delete("/:id", c.deleteService);
export default r;
