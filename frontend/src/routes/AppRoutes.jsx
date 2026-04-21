import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import BillingPage from "../pages/billing/BillingPage";
import CreateBill from "../pages/billing/CreateBill";
import BillView from "../pages/billing/BillView";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/billing/create" element={<CreateBill />} />
      <Route path="/billing/:id" element={<BillView />} />
    </Routes>
  );
}


