const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LabTest",
    required: true,
  },
  reportUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for performance
labReportSchema.index({ patient: 1 });
labReportSchema.index({ appointment: 1 });
labReportSchema.index({ status: 1 });
labReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("LabReport", labReportSchema);
