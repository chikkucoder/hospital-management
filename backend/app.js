const express = require("express");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);

app.use(errorMiddleware);

module.exports = app;
