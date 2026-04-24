import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";
import AdminDashboard from "./dashboard/AdminDashboard";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import PatientDashboard from "./dashboard/PatientDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === Role.ADMIN) return <AdminDashboard name={user.name} />;
  if (user?.role === Role.DOCTOR) return <DoctorDashboard name={user.name} />;
  return <PatientDashboard name={user.name} />;
}
