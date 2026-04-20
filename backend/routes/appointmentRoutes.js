const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", appointmentController.listAppointments);
router.post("/", appointmentController.bookAppointment);

module.exports = router;
