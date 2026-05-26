import jwt from "jsonwebtoken";
import User from "../models/User.js";

// still used by login/register if you want
export const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "7d" }
  );
};

// NO-OP auth: always allow
export const requireAuth = (req, _res, next) => {
  // attach a fake user so controllers relying on req.user don’t crash
  req.user = {
    _id: "dev-user",
    role: "admin",
    toSafeJSON: () => ({ id: "dev-user", role: "admin" }),
  };
  next();
};