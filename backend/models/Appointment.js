import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // e.g. "A-1001"
    patientId: { type: String, ref: "Patient", required: true },
    doctorName: { type: String, required: true },
    speciality: String,
    date: String, // ISO date
    time: String,
    notes: String,
  },
  { timestamps: true, _id: false }
);

export default mongoose.model("Appointment", AppointmentSchema);
