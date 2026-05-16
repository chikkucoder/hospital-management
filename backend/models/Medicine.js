const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ["tablet", "capsule", "syrup", "injection", "ointment", "drops", "inhaler", "other"],
    required: true,
  },
  manufacturer: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  threshold: {
    type: Number,
    required: true,
    min: 0,
    default: 10,
  },
  unit: {
    type: String,
    enum: ["mg", "g", "ml", "units", "pieces"],
    required: true,
  },
  strength: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  requiresPrescription: {
    type: Boolean,
    default: true,
  },
  sideEffects: [{
    type: String,
  }],
  contraindications: [{
    type: String,
  }],
  dosageForm: {
    type: String,
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

medicineSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

medicineSchema.index({ name: 1 });
medicineSchema.index({ sku: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
