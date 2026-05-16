const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ["blood", "urine", "imaging", "pathology", "cardiology", "neurology", "other"],
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  normalRange: {
    min: Number,
    max: Number,
    unit: String,
    text: String,
  },
  preparationInstructions: {
    type: String,
  },
  sampleType: {
    type: String,
    enum: ["blood", "urine", "swab", "tissue", "other"],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  department: {
    type: String,
    required: true,
  },
  turnaroundTime: {
    type: String, // e.g., "24 hours", "3-5 days"
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

labTestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

labTestSchema.index({ name: 1 });
labTestSchema.index({ code: 1 });

module.exports = mongoose.model("LabTest", labTestSchema);
