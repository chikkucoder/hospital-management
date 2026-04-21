const express = require("express");
const router = express.Router();

const {
  createBill,
  getBill,
  getAllBills,
  updateBill
} = require("../controllers/billingController");

router.post("/", createBill);
router.get("/", getAllBills);
router.get("/:id", getBill);
router.put("/:id", updateBill);

module.exports = router;