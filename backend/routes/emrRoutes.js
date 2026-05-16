const express = require("express");
const router = express.Router();
const emrController = require("../controllers/emrController");
const emrFileController = require("../controllers/emrFileController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ==================== Prescription Routes ====================

// POST /api/emr/prescriptions - Create prescription (Doctor/Admin only)
router.post(
  "/prescriptions",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrController.createPrescription
);

// GET /api/emr/prescriptions - Get prescriptions (authenticated users)
router.get(
  "/prescriptions",
  authMiddleware,
  emrController.getPrescriptions
);

// GET /api/emr/prescriptions/:id - Get prescription by ID
router.get(
  "/prescriptions/:id",
  authMiddleware,
  emrController.getPrescriptionById
);

// PUT /api/emr/prescriptions/:id - Update prescription (Doctor/Admin only)
router.put(
  "/prescriptions/:id",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrController.updatePrescription
);

// ==================== Medical Record Routes ====================

// POST /api/emr/medical-records - Create medical record (Doctor/Admin only)
router.post(
  "/medical-records",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrController.createMedicalRecord
);

// POST /api/emr/medical-records/with-files - Create medical record with file uploads
router.post(
  "/medical-records/with-files",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrFileController.uploadMedicalFiles,
  emrFileController.createMedicalRecordWithFiles
);

// GET /api/emr/medical-records - Get medical records
router.get(
  "/medical-records",
  authMiddleware,
  emrFileController.getMedicalRecordsWithAttachments
);

// GET /api/emr/medical-records/:id - Get medical record by ID
router.get(
  "/medical-records/:id",
  authMiddleware,
  emrController.getMedicalRecordById
);

// POST /api/emr/medical-records/:recordId/upload-files - Upload files to existing record
router.post(
  "/medical-records/:recordId/upload-files",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrFileController.uploadMedicalFiles,
  emrFileController.uploadMedicalFilesHandler
);

// DELETE /api/emr/medical-records/:recordId/attachments/:attachmentIndex - Remove attachment
router.delete(
  "/medical-records/:recordId/attachments/:attachmentIndex",
  authMiddleware,
  roleMiddleware(["DOCTOR", "ADMIN"]),
  emrFileController.removeAttachment
);

// ==================== Patient Medical History ====================

// GET /api/emr/patients/:patientId/medical-history - Get full patient medical history
router.get(
  "/patients/:patientId/medical-history",
  authMiddleware,
  emrController.getPatientMedicalHistory
);

module.exports = router;
