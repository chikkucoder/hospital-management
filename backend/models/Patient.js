import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // UHID e.g. "P-4412"
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 0 },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
    phone: String,
    email: String,
    address: String,
  },
  { timestamps: true, _id: false }
);

export default mongoose.model("Patient", PatientSchema);
