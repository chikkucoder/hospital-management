import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
    </Routes>
  );
}
