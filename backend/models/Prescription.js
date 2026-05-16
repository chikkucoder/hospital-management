const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
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
  diagnosis: {
    type: String,
    required: true,
  },
  symptoms: [{
    type: String,
  }],
  medicines: [{
    name: {
      type: String,
      required: true,
    },
    dosage: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
  }],
  notes: {
    type: String,
  },
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
  },
  followUpDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
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

prescriptionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for performance
prescriptionSchema.index({ patient: 1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Prescription", prescriptionSchema);
