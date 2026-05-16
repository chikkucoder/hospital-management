const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescriptionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/prescriptions - Create prescription (Doctor role only)
router.post(
  "/",
  roleMiddleware("DOCTOR"),
  prescriptionController.createPrescription
);

// GET /api/prescriptions?patient=:id - Get prescriptions for patient (Doctor role only)
router.get(
  "/",
  roleMiddleware("DOCTOR"),
  prescriptionController.getPrescriptionsByPatient
);

// GET /api/prescriptions/:id - Get prescription by ID (Doctor role only)
router.get(
  "/:id",
  roleMiddleware("DOCTOR"),
  prescriptionController.getPrescriptionById
);

// GET /api/prescriptions/doctor/my-prescriptions - Get current doctor's prescriptions
router.get(
  "/doctor/my-prescriptions",
  roleMiddleware("DOCTOR"),
  prescriptionController.getPrescriptionsByDoctor
);

// POST /api/prescriptions/search - Search prescriptions (Doctor role only)
router.post(
  "/search",
  roleMiddleware("DOCTOR"),
  prescriptionController.searchPrescriptions
);

module.exports = router;
