import { Route, Routes } from "react-router-dom";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import EMRConsultation from "../pages/emr/EMRConsultation";
import EMRConsultationEnhanced from "../pages/emr/EMRConsultationEnhanced";
import PatientMedicalHistory from "../pages/emr/PatientMedicalHistory";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/emr/consultation/:appointmentId" element={<EMRConsultation />} />
      <Route path="/emr/consultation-enhanced/:appointmentId" element={<EMRConsultationEnhanced />} />
      <Route path="/emr/patient/:patientId/history" element={<PatientMedicalHistory />} />
    </Routes>
  );
}
