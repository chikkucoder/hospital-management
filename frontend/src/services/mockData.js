// ======================================================
// ROLE ENUMERATION
// ======================================================

export const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  LAB: "LAB",
  APPOINTMENT: "APPOINTMENT",
  CLINIC: "CLINIC",
};

// ======================================================
// MOCK USERS DATABASE
// ======================================================

export const users = [

  // ======================================================
  // ADMIN
  // ======================================================

  {
    id: "admin-1",
    name: "System Admin",
    email: "admin.medico",
    phone: "1234567890",
    password: "medicouseradmin",
    role: Role.ADMIN,
    isActive: true,
  },

  // ======================================================
  // DOCTOR
  // ======================================================

  {
    id: "doctor-1",
    name: "Dr. Alexander Smith",
    email: "doctor.medico",
    phone: "1234567890",
    password: "medicouserdoctor",
    role: Role.DOCTOR,
    isActive: true,
  },

  // ======================================================
  // LAB
  // ======================================================

  {
    id: "lab-1",
    name: "Lab Technician",
    email: "lab.medico",
    phone: "1234567890",
    password: "medicouserlab",
    role: Role.LAB,
    isActive: true,
  },

  // ======================================================
  // APPOINTMENT
  // ======================================================

  {
    id: "appointment-1",
    name: "Appointment Manager",
    email: "appointment.medico",
    phone: "1234567890",
    password: "medicouserappointment",
    role: Role.APPOINTMENT,
    isActive: true,
  },

  // ======================================================
  // CLINIC / DISPENSORY
  // ======================================================

  {
    id: "clinic-1",
    name: "Clinic Staff",
    email: "clinic.medico",
    phone: "1234567890",
    password: "medicouserclinic",
    role: Role.CLINIC,
    isActive: true,
  },

];

// ======================================================
// PATIENTS
// ======================================================

export const initialPatients = [
   {
    id: "1",
    name: "Alice Cooper",
    age: 34,
    gender: "Female",
    phone: "9876543210",
    email: "alice@example.com",
    doctor: "Dr. Sharma",
    specialty: "Cardiology",
    status: "Active",
    lastVisit: "10/03/2024",
    lastVisitTime: "10:30 AM",
  },
  {
    id: "2",
    name: "Bob Marley",
    age: 45,
    gender: "Male",
    phone: "9123456780",
    email: "bob@example.com",
    doctor: "Dr. Mehta",
    specialty: "Neurology",
    status: "Follow-up Due",
    lastVisit: "12/03/2024",
    lastVisitTime: "11:15 AM",
  },
  {
    id: "3",
    name: "Charlie Sheen",
    age: 52,
    gender: "Male",
    phone: "9988776655",
    email: "charlie@example.com",
    doctor: "Dr. Khan",
    specialty: "Emergency",
    status: "Emergency",
    lastVisit: "14/03/2024",
    lastVisitTime: "02:45 PM",
  },
  {
    id: "4",
    name: "Diana Ross",
    age: 29,
    gender: "Female",
    phone: "9012345678",
    email: "diana@example.com",
    doctor: "Dr. Patel",
    specialty: "Orthopedic",
    status: "In-patient",
    lastVisit: "15/03/2024",
    lastVisitTime: "09:20 AM",
  },
  {
    id: "5",
    name: "Ethan Hunt",
    age: 38,
    gender: "Male",
    phone: "9090909090",
    email: "ethan@example.com",
    doctor: "Dr. Roy",
    specialty: "Dermatology",
    status: "Out-patient",
    lastVisit: "16/03/2024",
    lastVisitTime: "01:10 PM",
  },
  {
    id: "6",
    name: "Fiona Green",
    age: 31,
    gender: "Female",
    phone: "8888888888",
    email: "fiona@example.com",
    doctor: "Dr. Singh",
    specialty: "Gynecology",
    status: "In-patient",
    lastVisit: "17/03/2024",
    lastVisitTime: "04:00 PM",
  },
  {
    id: "7",
    name: "George Martin",
    age: 47,
    gender: "Male",
    phone: "7777777777",
    email: "george@example.com",
    doctor: "Dr. Das",
    specialty: "ENT",
    status: "Emergency",
    lastVisit: "18/03/2024",
    lastVisitTime: "06:20 PM",
  },
  {
    id: "8",
    name: "Hannah White",
    age: 26,
    gender: "Female",
    phone: "7666666666",
    email: "hannah@example.com",
    doctor: "Dr. Joshi",
    specialty: "Pediatrics",
    status: "Out-patient",
    lastVisit: "19/03/2024",
    lastVisitTime: "08:45 AM",
  },
  {
    id: "9",
    name: "Ian Somerhalder",
    age: 41,
    gender: "Male",
    phone: "7555555555",
    email: "ian@example.com",
    doctor: "Dr. Kumar",
    specialty: "Cardiology",
    status: "In-patient",
    lastVisit: "20/03/2024",
    lastVisitTime: "12:00 PM",
  },
  {
    id: "10",
    name: "Julia Roberts",
    age: 36,
    gender: "Female",
    phone: "7444444444",
    email: "julia@example.com",
    doctor: "Dr. Nair",
    specialty: "Neurology",
    status: "Emergency",
    lastVisit: "21/03/2024",
    lastVisitTime: "03:30 PM",
  },
  {
    id: "11",
    name: "Kevin Hart",
    age: 39,
    gender: "Male",
    phone: "7333333333",
    email: "kevin@example.com",
    doctor: "Dr. Verma",
    specialty: "Orthopedic",
    status: "Out-patient",
    lastVisit: "22/03/2024",
    lastVisitTime: "05:15 PM",
  },
  {
    id: "12",
    name: "Lily Collins",
    age: 27,
    gender: "Female",
    phone: "7222222222",
    email: "lily@example.com",
    doctor: "Dr. Ali",
    specialty: "Gynecology",
    status: "In-patient",
    lastVisit: "23/03/2024",
    lastVisitTime: "09:40 AM",
  },
  {
    id: "13",
    name: "Michael Jordan",
    age: 50,
    gender: "Male",
    phone: "7111111111",
    email: "michael@example.com",
    doctor: "Dr. Thomas",
    specialty: "Cardiology",
    status: "Emergency",
    lastVisit: "24/03/2024",
    lastVisitTime: "11:55 AM",
  },
  {
    id: "14",
    name: "Nina Dobrev",
    age: 30,
    gender: "Female",
    phone: "7000000000",
    email: "nina@example.com",
    doctor: "Dr. Gupta",
    specialty: "Dermatology",
    status: "Out-patient",
    lastVisit: "25/03/2024",
    lastVisitTime: "02:25 PM",
  },
  {
    id: "15",
    name: "Oscar Isaac",
    age: 44,
    gender: "Male",
    phone: "6999999999",
    email: "oscar@example.com",
    doctor: "Dr. Chawla",
    specialty: "ENT",
    status: "In-patient",
    lastVisit: "26/03/2024",
    lastVisitTime: "07:10 PM",
  },
];