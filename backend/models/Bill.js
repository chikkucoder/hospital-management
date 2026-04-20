const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  status: String,
});

module.exports = mongoose.model("Bill", billSchema);
