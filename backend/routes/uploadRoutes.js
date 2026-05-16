const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { uploadSingle, uploadMultiple, handleUploadError } = require("../config/cloudinary");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// POST /api/upload - Upload single file (Doctor/Lab role)
router.post(
  "/",
  roleMiddleware("DOCTOR", "LAB"),
  uploadSingle,
  handleUploadError,
  uploadController.uploadFile
);

// POST /api/upload/multiple - Upload multiple files (Doctor/Lab role)
router.post(
  "/multiple",
  roleMiddleware("DOCTOR", "LAB"),
  uploadMultiple,
  handleUploadError,
  uploadController.uploadMultipleFiles
);

// DELETE /api/upload/:publicId - Delete file (Doctor/Lab role)
router.delete(
  "/:publicId",
  roleMiddleware("DOCTOR", "LAB"),
  uploadController.deleteFile
);

// GET /api/upload/info/:publicId - Get file info (Doctor/Lab role)
router.get(
  "/info/:publicId",
  roleMiddleware("DOCTOR", "LAB"),
  uploadController.getFileInfo
);

module.exports = router;
