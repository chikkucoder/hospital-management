const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  doctorId: mongoose.Schema.Types.ObjectId,
  scheduledAt: Date,
});

module.exports = mongoose.model("Appointment", appointmentSchema);
