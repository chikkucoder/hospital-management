import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ error: "Email already registered" });
    const user = new User({ name, email, role: role || "billing" });
    await user.setPassword(password);
    await user.save();
    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "email and password required" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await user.checkPassword(password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken(user);
  res.json({ token, user: user.toSafeJSON() });
};

export const me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};
