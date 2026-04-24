import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aarogya_billing";

const ORIGINS = (process.env.CORS_ORIGIN ||
  "http://localhost:5173,http://localhost:8080")
  .split(",")
  .map((s) => s.trim());

const app = express();

// --- middleware ---
app.use(cors({ origin: ORIGINS, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

// debug logger (optional)
app.use((req, _res, next) => {
  console.log("→", req.method, req.url);
  next();
});

// --- health ---
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, time: new Date().toISOString() })
);

// --- routes (no auth anywhere) ---
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/reports", reportRoutes); // removed requireAuth

// --- error handler ---
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal error" });
});

// --- start ---
connectDB(MONGO_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`🚀 API on http://localhost:${PORT}`)
    )
  )
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });

