// Role enumeration
export const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  RECEPTIONIST: "RECEPTIONIST",
  LAB: "LAB",
  PHARMACY: "PHARMACY"
};

// In-memory DB for demo
export const users = [
  {
    id: "admin-1",
    name: "System Admin",
    email: "admin.medico",
    phone: "1234567890",
    password: "medicouseradmin",
    role: Role.ADMIN,
    isActive: true,
  },
  {
    id: "doctor-1",
    name: "Dr. Alexander Smith",
    email: "doctor.medico",
    phone: "1234567890",
    password: "medicouserdoctor",
    role: Role.DOCTOR,
    isActive: true,
  },
  {
    id: "reception-1",
    name: "Receptionist",
    email: "reception.medico",
    phone: "1234567890",
    password: "medicouserreception",
    role: Role.RECEPTIONIST,
    isActive: true,
  },
  {
    id: "lab-1",
    name: "Lab Technician",
    email: "lab.medico",
    phone: "1234567890",
    password: "medicouserlab",
    role: Role.LAB,
    isActive: true,
  },
  {
    id: "pharmacy-1",
    name: "Pharmacist",
    email: "pharmacy.medico",
    phone: "1234567890",
    password: "medicouserpharmacy",
    role: Role.PHARMACY,
    isActive: true,
  },
  {
    id: "staff-1",
    name: "Medical Staff",
    email: "staff.medico",
    phone: "1234567890",
    password: "medicouserstaff",
    role: Role.RECEPTIONIST,
    isActive: true,
  }
];

export const initialPatients = [
  { id: "1", name: "Alice Cooper", age: 34, gender: "Female", status: "In-patient", lastVisit: "2024-03-10" },
  { id: "2", name: "Bob Marley", age: 45, gender: "Male", status: "Out-patient", lastVisit: "2024-03-12" },
  { id: "3", name: "Charlie Sheen", age: 52, gender: "Male", status: "Emergency", lastVisit: "2024-03-14" },
  { id: "4", name: "Diana Ross", age: 29, gender: "Female", status: "In-patient", lastVisit: "2024-03-15" },
];
