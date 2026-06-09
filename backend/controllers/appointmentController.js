import Appointment from "../models/Appointment.js";

export const listAppointments = async (req, res) => {
  const filter = {};
  if (req.query.patient) filter.patientId = req.query.patient;
  const data = await Appointment.find(filter).sort({ date: -1 });
  res.json(data);
};

export const createAppointment = async (req, res) => {
  const created = await Appointment.create(req.body);
  res.status(201).json(created);
};

export const deleteAppointment = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
