const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Lab Test Routes
router.post(
  "/lab-tests",
  authMiddleware,
  roleMiddleware(["LAB", "ADMIN"]),
  labController.createLabTest
);

router.get(
  "/lab-tests",
  authMiddleware,
  labController.getLabTests
);

router.get(
  "/lab-tests/:id",
  authMiddleware,
  labController.getLabTestById
);

// Lab Report Routes
router.post(
  "/lab-reports",
  authMiddleware,
  roleMiddleware(["LAB", "ADMIN"]),
  labController.createLabReport
);

router.get(
  "/lab-reports",
  authMiddleware,
  labController.getLabReports
);

router.get(
  "/lab-reports/:id",
  authMiddleware,
  labController.getLabReportById
);

router.put(
  "/lab-reports/:id/status",
  authMiddleware,
  roleMiddleware(["LAB", "DOCTOR", "ADMIN"]),
  labController.updateLabReportStatus
);

router.get(
  "/patients/:patientId/lab-reports",
  authMiddleware,
  labController.getPatientLabReports
);

module.exports = router;
