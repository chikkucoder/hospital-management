import { Router } from "express";
import * as c from "../controllers/billController.js";
import { requireAuth } from "../middleware/auth.js";

const r = Router();
r.get("/", c.listBills);
r.get("/:id", c.getBill);
r.post("/", requireAuth, c.createBill);
r.put("/:id", requireAuth, c.updateBill);
r.delete("/:id", requireAuth, c.deleteBill);
r.post("/:id/payments", requireAuth, c.recordPayment);
export default r;
