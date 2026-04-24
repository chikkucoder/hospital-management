import Service from "../models/Service.js";

export const listServices = async (_req, res) => {
  const services = await Service.find({ active: true }).sort({ type: 1, name: 1 });
  res.json(services);
};

export const createService = async (req, res) => {
  const created = await Service.create(req.body);
  res.status(201).json(created);
};

export const updateService = async (req, res) => {
  const updated = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Service not found" });
  res.json(updated);
};

export const deleteService = async (req, res) => {
  await Service.findOneAndDelete({ id: req.params.id });
  res.json({ ok: true });
};
