const MedicalRecord = require("../models/MedicalRecord");
const { upload, processMultipleUploads } = require("../services/fileUploadService");

// Upload files for medical record
exports.uploadMedicalFiles = async (req, res) => {
  try {
    const { recordId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Process file uploads
    const uploadedFiles = await processMultipleUploads(req.files, "medical-records");

    // Find and update medical record with new attachments
    const medicalRecord = await MedicalRecord.findById(recordId);
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    // Add new attachments to existing ones
    medicalRecord.attachments.push(...uploadedFiles);
    await medicalRecord.save();

    res.status(200).json({
      success: true,
      data: {
        uploadedFiles,
        totalAttachments: medicalRecord.attachments.length,
      },
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading medical files:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    });
  }
};

// Handler for the route that uploads files to an existing record (separate from middleware)
exports.uploadMedicalFilesHandler = async (req, res) => {
  try {
    const { recordId } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = await processMultipleUploads(req.files, "medical-records");

    const medicalRecord = await MedicalRecord.findById(recordId);
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    medicalRecord.attachments.push(...uploadedFiles);
    await medicalRecord.save();

    res.status(200).json({
      success: true,
      data: {
        uploadedFiles,
        totalAttachments: medicalRecord.attachments.length,
      },
      message: "Files uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading medical files:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error: error.message,
    });
  }
};

// Create medical record with files
exports.createMedicalRecordWithFiles = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      appointment,
      recordType,
      title,
      description,
      clinicalNotes,
      diagnosis,
      treatment,
      isConfidential,
    } = req.body;

    // Process uploaded files if any
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = await processMultipleUploads(req.files, "medical-records");
    }

    // Create medical record
    const medicalRecord = new MedicalRecord({
      patient,
      doctor,
      appointment,
      recordType,
      title,
      description,
      clinicalNotes,
      diagnosis,
      treatment,
      isConfidential,
      attachments,
    });

    await medicalRecord.save();

    // Populate related data for response
    await medicalRecord.populate([
      { path: "patient", select: "name age gender" },
      { path: "doctor", select: "name specialty" },
      { path: "appointment", select: "scheduledAt" },
    ]);

    res.status(201).json({
      success: true,
      data: medicalRecord,
      message: "Medical record created successfully with files",
    });
  } catch (error) {
    console.error("Error creating medical record with files:", error);
    res.status(500).json({
      success: false,
      message: "Error creating medical record",
      error: error.message,
    });
  }
};

// Remove attachment from medical record
exports.removeAttachment = async (req, res) => {
  try {
    const { recordId, attachmentIndex } = req.params;

    const medicalRecord = await MedicalRecord.findById(recordId);
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: "Medical record not found",
      });
    }

    const idx = parseInt(attachmentIndex, 10);
    if (isNaN(idx) || idx >= medicalRecord.attachments.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid attachment index",
      });
    }

    const removedAttachment = medicalRecord.attachments.splice(idx, 1)[0];
    await medicalRecord.save();

    res.json({
      success: true,
      data: {
        removedAttachment,
        remainingAttachments: medicalRecord.attachments.length,
      },
      message: "Attachment removed successfully",
    });
  } catch (error) {
    console.error("Error removing attachment:", error);
    res.status(500).json({
      success: false,
      message: "Error removing attachment",
      error: error.message,
    });
  }
};

// Get medical records with attachments
exports.getMedicalRecordsWithAttachments = async (req, res) => {
  try {
    const { patient, doctor, recordType, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (recordType) filter.recordType = recordType;

    const medicalRecords = await MedicalRecord.find(filter)
      .populate("patient", "name age gender")
      .populate("doctor", "name specialty")
      .populate("appointment", "scheduledAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(filter);

    res.json({
      success: true,
      data: {
        medicalRecords,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};

// Multer middleware for handling multiple file uploads (max 10 files)
const uploadMedicalFilesMiddleware = upload.array("files", 10);

module.exports = {
  uploadMedicalFiles: uploadMedicalFilesMiddleware,
  uploadMedicalFilesHandler: exports.uploadMedicalFilesHandler,
  createMedicalRecordWithFiles: exports.createMedicalRecordWithFiles,
  removeAttachment: exports.removeAttachment,
  getMedicalRecordsWithAttachments: exports.getMedicalRecordsWithAttachments,
};
