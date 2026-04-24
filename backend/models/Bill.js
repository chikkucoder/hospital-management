import mongoose from "mongoose";
import { SERVICE_TYPES } from "./Service.js";

const BillItemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: SERVICE_TYPES, default: "OTHER" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    adjustment: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PaymentSummarySchema = new mongoose.Schema(
  {
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const BillSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    patient: { type: String, ref: "Patient", required: true },
    appointment: { type: String, ref: "Appointment", default: null },

    items: { type: [BillItemSchema], default: [] },

    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    insuranceProvider: String,
    policyNumber: String,
    coveragePercent: { type: Number, default: 0, min: 0, max: 100 },
    insuranceDeduction: { type: Number, default: 0 },

    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["draft", "pending", "partial", "paid", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentSummary: { type: PaymentSummarySchema, default: () => ({}) },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card", "Online", "Insurance", "Other"], default: "Cash" },

    visitType: { type: String, enum: ["OPD", "IPD", "Emergency", "Follow-up"], default: "OPD" },
    roomNumber: String,

    dueDate: Date,
    issuedAt: { type: Date, default: Date.now },
    paidAt: Date,
    createdBy: { type: String, default: "system" },
  },
  { timestamps: true }
);

BillSchema.index({ patient: 1, issuedAt: -1 });

export default mongoose.model("Bill", BillSchema);
