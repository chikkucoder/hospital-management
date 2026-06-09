import mongoose from "mongoose";

export const SERVICE_TYPES = [
  "CONSULTATION", "LAB", "MEDICINE", "PROCEDURE",
  "ROOM", "NURSING", "EQUIPMENT", "OTHER",
];

const ServiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // catalog id e.g. "s1"
    type: { type: String, enum: SERVICE_TYPES, default: "OTHER" },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);
