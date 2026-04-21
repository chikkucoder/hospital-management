const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },

  patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },

  items: [
    {
      type: { type: String },
      name: String,
      quantity: Number,
      unitPrice: Number,
      amount: Number,
    }
  ],

  subtotal: Number,
  tax: Number,
  discount: Number,
  totalAmount: Number,

  status: {
    type: String,
    enum: ["draft", "pending", "paid", "failed"],
    default: "pending"
  },

  paymentSummary: {
    paidAmount: { type: Number, default: 0 },
    dueAmount: Number
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);