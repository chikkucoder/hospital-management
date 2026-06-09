const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bill: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" },

  method: { type: String, enum: ["CASH", "ONLINE"] },

  amount: Number,
  status: { type: String, enum: ["created", "success", "failed"] },

  orderId: String,
  paymentId: String,
  signature: String,

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);