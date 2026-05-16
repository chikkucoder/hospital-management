const express = require("express");
const router = express.Router();
const labReportController = require("../controllers/labReportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/lab-reports - Create lab report (Doctor/Lab role)
router.post(
  "/",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.createLabReport
);

// GET /api/lab-reports?patient=:id - Get lab reports for patient (Doctor/Lab role)
router.get(
  "/",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.getLabReportsByPatient
);

// GET /api/lab-reports/:id - Get lab report by ID (Doctor/Lab role)
router.get(
  "/:id",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.getLabReportById
);

// PUT /api/lab-reports/:id/status - Update lab report status (Doctor/Lab role)
router.put(
  "/:id/status",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.updateLabReportStatus
);

// GET /api/lab-reports/my-uploads - Get current user's uploaded lab reports
router.get(
  "/my-uploads",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.getLabReportsByUploader
);

// POST /api/lab-reports/search - Search lab reports (Doctor/Lab role)
router.post(
  "/search",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.searchLabReports
);

// GET /api/lab-reports/statistics - Get lab reports statistics (Doctor/Lab role)
router.get(
  "/statistics",
  roleMiddleware("DOCTOR", "LAB"),
  labReportController.getLabReportsStatistics
);

module.exports = router;
