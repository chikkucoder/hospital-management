import Patient from "../models/Patient.js";

export const listPatients = async (_req, res) => {
  const patients = await Patient.find().sort({ name: 1 });
  res.json(patients);
};

export const getPatient = async (req, res) => {
  const p = await Patient.findById(req.params.id);
  if (!p) return res.status(404).json({ error: "Patient not found" });
  res.json(p);
};

export const createPatient = async (req, res) => {
  const created = await Patient.create(req.body);
  res.status(201).json(created);
};

export const updatePatient = async (req, res) => {
  const updated = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Patient not found" });
  res.json(updated);
};

export const deletePatient = async (req, res) => {
  await Patient.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
