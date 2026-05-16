const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  recordType: {
    type: String,
    enum: ["consultation", "lab_report", "imaging", "discharge_summary", "follow_up"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachments: [{
    filename: String,
    originalName: String,
    fileUrl: String, // Cloudinary URL
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  clinicalNotes: {
    type: String,
  },
  diagnosis: {
    primary: String,
    secondary: [String],
  },
  treatment: {
    type: String,
  },
  isConfidential: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

medicalRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
