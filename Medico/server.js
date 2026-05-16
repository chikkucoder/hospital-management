import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default-refresh-secret";

// Role enumeration
const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
  RECEPTIONIST: "RECEPTIONIST",
  LAB: "LAB",
  PHARMACY: "PHARMACY"
};

// ==================== In-Memory Database ====================

const users = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin.medico",
    phone: "1234567890",
    passwordHash: bcrypt.hashSync("medicouseradmin", 10),
    role: Role.ADMIN,
    isActive: true,
    lastLoginAt: null
  },
  {
    id: "doctor-1",
    name: "Dr. Smith",
    email: "doctor.medico",
    phone: "0987654321",
    passwordHash: bcrypt.hashSync("medicouserdoctor", 10),
    role: Role.DOCTOR,
    isActive: true,
    lastLoginAt: null
  },
  {
    id: "patient-1",
    name: "John Doe",
    email: "patient.medico",
    phone: "5551234567",
    passwordHash: bcrypt.hashSync("medicouserpatient", 10),
    role: Role.PATIENT,
    isActive: true,
    lastLoginAt: null
  }
];

const patients = [
  {
    id: "patient-1",
    patientId: "PAT-0001",
    name: "John Doe",
    age: 34,
    gender: "Male",
    phone: "5551234567",
    address: "123 Main St, Springfield, IL",
    bloodGroup: "O+",
    emergencyContact: "Jane Doe (Wife) - 5559876543",
    isActive: true,
    createdAt: "2026-01-15T08:00:00Z",
    updatedAt: "2026-01-15T08:00:00Z",
  },
  {
    id: "patient-2",
    patientId: "PAT-0002",
    name: "Alice Cooper",
    age: 34,
    gender: "Female",
    phone: "5551112222",
    address: "456 Oak Ave, Springfield, IL",
    bloodGroup: "A+",
    emergencyContact: "Bob Cooper (Husband) - 5553334444",
    isActive: true,
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-20T09:00:00Z",
  },
];

const doctors = [
  {
    id: "doctor-1",
    user: "doctor-1",
    name: "Dr. Smith",
    specialization: "General Medicine",
    qualification: "MD, Internal Medicine",
    experience: 12,
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "14:00" },
    ],
    isActive: true,
    createdAt: "2026-01-01T08:00:00Z",
    updatedAt: "2026-01-01T08:00:00Z",
  },
];

const appointments = [
  {
    id: "appt-1",
    patient: "patient-1",
    doctor: "doctor-1",
    appointmentDate: "2026-05-12",
    startTime: "10:00",
    endTime: "10:30",
    status: "completed",
    reason: "Sore throat and fever",
    notes: "",
    createdAt: "2026-05-11T14:00:00Z",
    updatedAt: "2026-05-12T10:30:00Z",
  },
  {
    id: "appt-2",
    patient: "patient-2",
    doctor: "doctor-1",
    appointmentDate: "2026-05-13",
    startTime: "11:00",
    endTime: "11:30",
    status: "scheduled",
    reason: "Chronic Gastritis Follow-up",
    notes: "",
    createdAt: "2026-05-12T09:00:00Z",
    updatedAt: "2026-05-12T09:00:00Z",
  },
];

const prescriptions = [
  {
    id: "presc-1",
    patient: "patient-1",
    doctor: "doctor-1",
    appointment: "appt-1",
    diagnosis: "Acute Pharyngitis",
    symptoms: ["Sore throat", "Fever", "Headache"],
    medicines: [
      { name: "Amoxicillin", dosage: "500mg 1-0-1", duration: "7 Days", instructions: "After meals" },
      { name: "Paracetamol", dosage: "650mg SOS", duration: "3 Days", instructions: "If fever > 100°F" },
    ],
    notes: "Patient advised rest and hydration. Follow up in 1 week if symptoms persist.",
    vitalSigns: { bloodPressure: { systolic: 120, diastolic: 80 }, heartRate: 78, temperature: 99.5, weight: 70, height: 170 },
    followUpDate: "2026-05-20",
    status: "active",
    createdAt: "2026-05-12T10:30:00Z",
    updatedAt: "2026-05-12T10:30:00Z",
  },
];

const medicalRecords = [
  {
    id: "mr-1",
    patient: "patient-1",
    doctor: "doctor-1",
    appointment: "appt-1",
    recordType: "consultation",
    title: "Initial Consultation - Sore Throat",
    description: "Patient presented with sore throat and mild fever for 3 days.",
    clinicalNotes: "Throat examination shows mild erythema. No pus points. Lungs clear.",
    diagnosis: { primary: "Acute Pharyngitis", secondary: ["Mild Dehydration"] },
    treatment: "Antibiotics course + supportive care",
    isConfidential: false,
    attachments: [],
    createdAt: "2026-05-12T10:30:00Z",
    updatedAt: "2026-05-12T10:30:00Z",
  },
];

const medicinesDB = [
  { id: "med-1", name: "Amoxicillin", category: "Antibiotic", genericName: "Amoxicillin", brandNames: ["Amoxil", "Trimox", "Moxatag"], strength: "500mg", form: "Capsule", manufacturer: "GSK", price: 12.50 },
  { id: "med-2", name: "Paracetamol", category: "Analgesic/Antipyretic", genericName: "Acetaminophen", brandNames: ["Tylenol", "Panadol", "Crocin"], strength: "650mg", form: "Tablet", manufacturer: "Johnson & Johnson", price: 2.00 },
  { id: "med-3", name: "Azithromycin", category: "Antibiotic", genericName: "Azithromycin", brandNames: ["Zithromax", "Azithral"], strength: "500mg", form: "Tablet", manufacturer: "Pfizer", price: 45.00 },
  { id: "med-4", name: "Omeprazole", category: "PPI", genericName: "Omeprazole", brandNames: ["Prilosec", "Omez"], strength: "20mg", form: "Capsule", manufacturer: "AstraZeneca", price: 8.75 },
  { id: "med-5", name: "Metformin", category: "Antidiabetic", genericName: "Metformin HCl", brandNames: ["Glucophage", "Glycomet"], strength: "500mg", form: "Tablet", manufacturer: "Merck", price: 3.50 },
  { id: "med-6", name: "Cetirizine", category: "Antihistamine", genericName: "Cetirizine", brandNames: ["Zyrtec", "Alerid"], strength: "10mg", form: "Tablet", manufacturer: "UCB Pharma", price: 4.25 },
  { id: "med-7", name: "Ibuprofen", category: "NSAID", genericName: "Ibuprofen", brandNames: ["Advil", "Motrin", "Brufen"], strength: "400mg", form: "Tablet", manufacturer: "Pfizer", price: 3.00 },
  { id: "med-8", name: "Amlodipine", category: "Calcium Channel Blocker", genericName: "Amlodipine Besylate", brandNames: ["Norvasc", "Amlopres"], strength: "5mg", form: "Tablet", manufacturer: "Pfizer", price: 6.50 },
  { id: "med-9", name: "Atorvastatin", category: "Statin", genericName: "Atorvastatin Calcium", brandNames: ["Lipitor", "Atorva"], strength: "10mg", form: "Tablet", manufacturer: "Pfizer", price: 9.00 },
  { id: "med-10", name: "Levothyroxine", category: "Thyroid Hormone", genericName: "Levothyroxine Sodium", brandNames: ["Synthroid", "Eltroxin"], strength: "50mcg", form: "Tablet", manufacturer: "AbbVie", price: 5.50 },
  { id: "med-11", name: "Doxycycline", category: "Antibiotic", genericName: "Doxycycline Hyclate", brandNames: ["Vibramycin", "Doxy-1"], strength: "100mg", form: "Capsule", manufacturer: "Pfizer", price: 15.00 },
  { id: "med-12", name: "Prednisolone", category: "Corticosteroid", genericName: "Prednisolone", brandNames: ["Omnacortil", "Wysolone"], strength: "10mg", form: "Tablet", manufacturer: "Macleods", price: 7.00 },
  { id: "med-13", name: "Ranitidine", category: "H2 Blocker", genericName: "Ranitidine HCl", brandNames: ["Zantac", "Rantac"], strength: "150mg", form: "Tablet", manufacturer: "GSK", price: 4.00 },
  { id: "med-14", name: "Salbutamol", category: "Bronchodilator", genericName: "Salbutamol Sulfate", brandNames: ["Ventolin", "Asthalin"], strength: "100mcg", form: "Inhaler", manufacturer: "GSK", price: 18.00 },
  { id: "med-15", name: "Metronidazole", category: "Antibiotic", genericName: "Metronidazole", brandNames: ["Flagyl", "Metrogyl"], strength: "400mg", form: "Tablet", manufacturer: "Pfizer", price: 6.00 },
  { id: "med-16", name: "Losartan", category: "ARB", genericName: "Losartan Potassium", brandNames: ["Cozaar", "Losar"], strength: "50mg", form: "Tablet", manufacturer: "Merck", price: 7.50 },
  { id: "med-17", name: "Furosemide", category: "Diuretic", genericName: "Furosemide", brandNames: ["Lasix", "Frusenex"], strength: "40mg", form: "Tablet", manufacturer: "Sanofi", price: 3.25 },
  { id: "med-18", name: "Clopidogrel", category: "Antiplatelet", genericName: "Clopidogrel Bisulfate", brandNames: ["Plavix", "Clopivas"], strength: "75mg", form: "Tablet", manufacturer: "Sanofi", price: 11.00 },
  { id: "med-19", name: "Pantoprazole", category: "PPI", genericName: "Pantoprazole Sodium", brandNames: ["Protonix", "Pantocid"], strength: "40mg", form: "Tablet", manufacturer: "Pfizer", price: 9.50 },
  { id: "med-20", name: "Ondansetron", category: "Antiemetic", genericName: "Ondansetron HCl", brandNames: ["Zofran", "Emeset"], strength: "4mg", form: "Tablet", manufacturer: "GSK", price: 8.00 },
];

const labTestsCatalog = [
  { id: "lab-1", name: "Complete Blood Count (CBC)", category: "Hematology", price: 250, turnaroundTime: "2 hours", requiresFasting: false },
  { id: "lab-2", name: "Lipid Profile", category: "Biochemistry", price: 400, turnaroundTime: "4 hours", requiresFasting: true },
  { id: "lab-3", name: "Liver Function Test (LFT)", category: "Biochemistry", price: 500, turnaroundTime: "4 hours", requiresFasting: true },
  { id: "lab-4", name: "Kidney Function Test (KFT)", category: "Biochemistry", price: 450, turnaroundTime: "4 hours", requiresFasting: true },
  { id: "lab-5", name: "Thyroid Profile (T3/T4/TSH)", category: "Endocrinology", price: 600, turnaroundTime: "6 hours", requiresFasting: false },
  { id: "lab-6", name: "HbA1c (Glycated Hemoglobin)", category: "Diabetes", price: 350, turnaroundTime: "4 hours", requiresFasting: false },
  { id: "lab-7", name: "Blood Sugar (Fasting & PP)", category: "Diabetes", price: 150, turnaroundTime: "2 hours", requiresFasting: true },
  { id: "lab-8", name: "Urine Routine & Microscopy", category: "Urinalysis", price: 200, turnaroundTime: "1 hour", requiresFasting: false },
  { id: "lab-9", name: "Chest X-Ray (PA View)", category: "Imaging", price: 350, turnaroundTime: "1 hour", requiresFasting: false },
  { id: "lab-10", name: "ECG (12-Lead)", category: "Cardiology", price: 300, turnaroundTime: "30 minutes", requiresFasting: false },
  { id: "lab-11", name: "Vitamin D3 (25-OH)", category: "Endocrinology", price: 1200, turnaroundTime: "24 hours", requiresFasting: false },
  { id: "lab-12", name: "Vitamin B12", category: "Endocrinology", price: 800, turnaroundTime: "24 hours", requiresFasting: false },
  { id: "lab-13", name: "Dengue NS1 Antigen", category: "Microbiology", price: 600, turnaroundTime: "2 hours", requiresFasting: false },
  { id: "lab-14", name: "Malaria Antigen Test", category: "Microbiology", price: 400, turnaroundTime: "2 hours", requiresFasting: false },
  { id: "lab-15", name: "COVID-19 RT-PCR", category: "Microbiology", price: 500, turnaroundTime: "12 hours", requiresFasting: false },
  { id: "lab-16", name: "Serum Electrolytes", category: "Biochemistry", price: 350, turnaroundTime: "2 hours", requiresFasting: false },
  { id: "lab-17", name: "Serum Iron Studies", category: "Hematology", price: 550, turnaroundTime: "6 hours", requiresFasting: true },
  { id: "lab-18", name: "Ultrasound - Whole Abdomen", category: "Imaging", price: 1200, turnaroundTime: "2 hours", requiresFasting: true },
  { id: "lab-19", name: "CRP (C-Reactive Protein)", category: "Immunology", price: 300, turnaroundTime: "2 hours", requiresFasting: false },
  { id: "lab-20", name: "RA Factor", category: "Immunology", price: 400, turnaroundTime: "4 hours", requiresFasting: false },
];

const labTestOrders = [];
const uploadedFiles = [];
const allergies = [];
const vitalSignsHistory = [];

// ==================== Helper Functions ====================

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

const findById = (collection, id) => collection.find(item => item.id === id);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many login attempts, please try again later." }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.set("trust proxy", 1);

  app.use(helmet({
    contentSecurityPolicy: false
  }));
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // ==================== Auth Middleware ====================

  const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.user = user;
      next();
    });
  };

  const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      next();
    };
  };

  // ==================== Auth Routes ====================

  app.post("/api/auth/login", loginLimiter, (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials or account inactive" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });

  // ==================== Admin Routes ====================

  app.post("/api/admin/users", authenticateToken, authorizeRoles(Role.ADMIN), (req, res) => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string(),
      role: z.string(),
      password: z.string().min(8)
    });

    const validated = schema.safeParse(req.body);
    if (!validated.success) return res.status(400).json(validated.error);

    const { name, email, phone, role, password } = validated.data;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      passwordHash: bcrypt.hashSync(password, 10),
      role,
      isActive: true,
      lastLoginAt: null
    };

    users.push(newUser);
    res.status(201).json({ message: "User created successfully", userId: newUser.id });
  });

  // ==================== Patient Routes ====================

  app.get("/api/patients", authenticateToken, (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    let filtered = [...patients];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.patientId.toLowerCase().includes(s) ||
        p.phone.includes(s)
      );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: {
        patients: paginated,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filtered.length / limit),
          totalPatients: filtered.length,
        },
      },
    });
  });

  app.get("/api/patients/:id", authenticateToken, (req, res) => {
    const patient = findById(patients, req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });
    res.json({ success: true, data: patient });
  });

  app.post("/api/patients", authenticateToken, authorizeRoles(Role.ADMIN, Role.RECEPTIONIST), (req, res) => {
    const { name, age, gender, phone, address, bloodGroup, emergencyContact } = req.body;
    const newPatient = {
      id: generateId("pat"),
      patientId: `PAT-${String(patients.length + 1).padStart(4, "0")}`,
      name,
      age: parseInt(age),
      gender,
      phone,
      address: address || "",
      bloodGroup: bloodGroup || "",
      emergencyContact: emergencyContact || "",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    res.status(201).json({ success: true, data: newPatient, message: "Patient created successfully" });
  });

  // ==================== Doctor Routes ====================

  app.get("/api/doctors", authenticateToken, (req, res) => {
    res.json({ success: true, data: { doctors } });
  });

  app.get("/api/doctors/:id", authenticateToken, (req, res) => {
    const doctor = findById(doctors, req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });
    res.json({ success: true, data: doctor });
  });

  // ==================== Appointment Routes ====================

  app.get("/api/appointments", authenticateToken, (req, res) => {
    const { patient, doctor, status, page = 1, limit = 10 } = req.query;
    let filtered = [...appointments];

    if (patient) filtered = filtered.filter(a => a.patient === patient);
    if (doctor) filtered = filtered.filter(a => a.doctor === doctor);
    if (status) filtered = filtered.filter(a => a.status === status);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));

    res.json({
      success: true,
      data: {
        appointments: paginated,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filtered.length / limit),
          totalAppointments: filtered.length,
        },
      },
    });
  });

  app.get("/api/appointments/:id", authenticateToken, (req, res) => {
    const appointment = findById(appointments, req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const patient = findById(patients, appointment.patient);
    const doctor = findById(doctors, appointment.doctor);

    res.json({
      success: true,
      data: { ...appointment, patient, doctor },
    });
  });

  app.post("/api/appointments", authenticateToken, authorizeRoles(Role.ADMIN, Role.RECEPTIONIST), (req, res) => {
    const { patient, doctor, appointmentDate, startTime, endTime, reason } = req.body;

    // Check for conflicts
    const conflict = appointments.find(a =>
      a.doctor === doctor &&
      a.appointmentDate === appointmentDate &&
      a.startTime === startTime &&
      a.status !== "cancelled"
    );
    if (conflict) {
      return res.status(409).json({ success: false, message: "Time slot already booked for this doctor" });
    }

    const newAppointment = {
      id: generateId("appt"),
      patient,
      doctor,
      appointmentDate,
      startTime,
      endTime,
      status: "scheduled",
      reason: reason || "",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    appointments.push(newAppointment);
    res.status(201).json({ success: true, data: newAppointment, message: "Appointment booked successfully" });
  });

  app.put("/api/appointments/:id", authenticateToken, (req, res) => {
    const appointment = findById(appointments, req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const { status, notes } = req.body;
    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    appointment.updatedAt = new Date().toISOString();

    res.json({ success: true, data: appointment, message: "Appointment updated successfully" });
  });

  // ==================== EMR: Prescription Routes ====================

  // Create prescription
  app.post("/api/emr/prescriptions", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, doctor, appointment, diagnosis, symptoms, medicines, notes, vitalSigns, followUpDate } = req.body;

    if (!patient || !doctor || !appointment || !diagnosis || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient, doctor, appointment, diagnosis, medicines",
      });
    }

    // Check for existing prescription for this appointment
    const existing = prescriptions.find(p => p.appointment === appointment);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists for this appointment",
      });
    }

    const newPrescription = {
      id: generateId("presc"),
      patient,
      doctor,
      appointment,
      diagnosis,
      symptoms: symptoms || [],
      medicines,
      notes: notes || "",
      vitalSigns: vitalSigns || {},
      followUpDate: followUpDate || null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    prescriptions.push(newPrescription);

    // Update appointment status to completed
    const appt = findById(appointments, appointment);
    if (appt) {
      appt.status = "completed";
      appt.updatedAt = new Date().toISOString();
    }

    res.status(201).json({
      success: true,
      data: newPrescription,
      message: "Prescription created successfully",
    });
  });

  // Get prescriptions (with filters)
  app.get("/api/emr/prescriptions", authenticateToken, (req, res) => {
    const { patient, doctor, status, page = 1, limit = 10 } = req.query;
    let filtered = [...prescriptions];

    if (patient) filtered = filtered.filter(p => p.patient === patient);
    if (doctor) filtered = filtered.filter(p => p.doctor === doctor);
    if (status) filtered = filtered.filter(p => p.status === status);

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));

    // Enrich with patient/doctor names
    const enriched = paginated.map(p => {
      const pat = findById(patients, p.patient);
      const doc = findById(doctors, p.doctor);
      return {
        ...p,
        patient: pat ? { id: pat.id, name: pat.name, age: pat.age, gender: pat.gender } : null,
        doctor: doc ? { id: doc.id, name: doc.name, specialization: doc.specialization } : null,
      };
    });

    res.json({
      success: true,
      data: {
        prescriptions: enriched,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filtered.length / limit),
          totalPrescriptions: filtered.length,
        },
      },
    });
  });

  // Get prescription by ID
  app.get("/api/emr/prescriptions/:id", authenticateToken, (req, res) => {
    const prescription = findById(prescriptions, req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });

    const pat = findById(patients, prescription.patient);
    const doc = findById(doctors, prescription.doctor);

    res.json({
      success: true,
      data: {
        ...prescription,
        patient: pat || null,
        doctor: doc || null,
      },
    });
  });

  // Update prescription
  app.put("/api/emr/prescriptions/:id", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const prescription = findById(prescriptions, req.params.id);
    if (!prescription) return res.status(404).json({ success: false, message: "Prescription not found" });

    const allowedFields = ["diagnosis", "symptoms", "medicines", "notes", "vitalSigns", "followUpDate", "status"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        prescription[field] = req.body[field];
      }
    }
    prescription.updatedAt = new Date().toISOString();

    res.json({ success: true, data: prescription, message: "Prescription updated successfully" });
  });

  // ==================== EMR: Medical Record Routes ====================

  // Create medical record
  app.post("/api/emr/medical-records", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, doctor, appointment, recordType, title, description, clinicalNotes, diagnosis, treatment, isConfidential } = req.body;

    if (!patient || !doctor || !appointment || !recordType || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient, doctor, appointment, recordType, title, description",
      });
    }

    const newRecord = {
      id: generateId("mr"),
      patient,
      doctor,
      appointment,
      recordType,
      title,
      description,
      clinicalNotes: clinicalNotes || "",
      diagnosis: diagnosis || { primary: "", secondary: [] },
      treatment: treatment || "",
      isConfidential: isConfidential || false,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    medicalRecords.push(newRecord);

    res.status(201).json({
      success: true,
      data: newRecord,
      message: "Medical record created successfully",
    });
  });

  // Get medical records
  app.get("/api/emr/medical-records", authenticateToken, (req, res) => {
    const { patient, doctor, recordType, page = 1, limit = 10 } = req.query;
    let filtered = [...medicalRecords];

    if (patient) filtered = filtered.filter(r => r.patient === patient);
    if (doctor) filtered = filtered.filter(r => r.doctor === doctor);
    if (recordType) filtered = filtered.filter(r => r.recordType === recordType);

    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + parseInt(limit));

    const enriched = paginated.map(r => {
      const pat = findById(patients, r.patient);
      const doc = findById(doctors, r.doctor);
      return {
        ...r,
        patient: pat ? { id: pat.id, name: pat.name, age: pat.age, gender: pat.gender } : null,
        doctor: doc ? { id: doc.id, name: doc.name, specialization: doc.specialization } : null,
      };
    });

    res.json({
      success: true,
      data: {
        medicalRecords: enriched,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filtered.length / limit),
          totalRecords: filtered.length,
        },
      },
    });
  });

  // Get medical record by ID
  app.get("/api/emr/medical-records/:id", authenticateToken, (req, res) => {
    const record = findById(medicalRecords, req.params.id);
    if (!record) return res.status(404).json({ success: false, message: "Medical record not found" });

    const pat = findById(patients, record.patient);
    const doc = findById(doctors, record.doctor);

    res.json({
      success: true,
      data: { ...record, patient: pat || null, doctor: doc || null },
    });
  });

  // ==================== EMR: Patient Medical History ====================

  app.get("/api/emr/patients/:patientId/medical-history", authenticateToken, (req, res) => {
    const { patientId } = req.params;
    const patient = findById(patients, patientId);

    if (!patient) return res.status(404).json({ success: false, message: "Patient not found" });

    const patientPrescriptions = prescriptions
      .filter(p => p.patient === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const patientRecords = medicalRecords
      .filter(r => r.patient === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const patientAppointments = appointments
      .filter(a => a.patient === patientId)
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    res.json({
      success: true,
      data: {
        patient,
        prescriptions: patientPrescriptions,
        medicalRecords: patientRecords,
        appointments: patientAppointments,
        summary: {
          totalPrescriptions: patientPrescriptions.length,
          totalMedicalRecords: patientRecords.length,
          totalAppointments: patientAppointments.length,
          lastVisit: patientPrescriptions.length > 0 ? patientPrescriptions[0].createdAt : null,
        },
      },
    });
  });

  // ==================== EMR: Patient Search for Consultation ====================

  app.get("/api/emr/patients/search", authenticateToken, (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: patients });

    const query = q.toLowerCase();
    const results = patients.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.patientId.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );

    res.json({ success: true, data: results });
  });

  // ==================== EMR: Medicine Database ====================

  app.get("/api/emr/medicines", authenticateToken, (req, res) => {
    const { search, category, limit = 50 } = req.query;
    let filtered = [...medicinesDB];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.brandNames.some(b => b.toLowerCase().includes(q)) ||
        m.category.toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      data: {
        medicines: filtered.slice(0, parseInt(limit)),
        total: filtered.length,
        categories: [...new Set(medicinesDB.map(m => m.category))],
      },
    });
  });

  app.get("/api/emr/medicines/:id", authenticateToken, (req, res) => {
    const medicine = findById(medicinesDB, req.params.id);
    if (!medicine) return res.status(404).json({ success: false, message: "Medicine not found" });
    res.json({ success: true, data: medicine });
  });

  // ==================== EMR: Lab Test Catalog & Orders ====================

  app.get("/api/emr/lab-tests/catalog", authenticateToken, (req, res) => {
    const { search, category } = req.query;
    let filtered = [...labTestsCatalog];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase());
    }

    res.json({
      success: true,
      data: {
        tests: filtered,
        categories: [...new Set(labTestsCatalog.map(t => t.category))],
      },
    });
  });

  app.post("/api/emr/lab-tests/orders", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, doctor, tests, notes } = req.body;

    if (!patient || !doctor || !tests || !Array.isArray(tests) || tests.length === 0) {
      return res.status(400).json({ success: false, message: "Patient, doctor, and at least one test are required" });
    }

    const orders = tests.map(t => ({
      id: generateId("lab"),
      patient,
      doctor,
      testId: t.testId,
      testName: t.testName,
      category: t.category || "",
      priority: t.priority || "routine",
      instructions: t.instructions || "",
      status: "ordered",
      notes: notes || "",
      orderedAt: new Date().toISOString(),
      completedAt: null,
      results: null,
    }));

    labTestOrders.push(...orders);

    res.status(201).json({
      success: true,
      data: orders,
      message: `${orders.length} lab test(s) ordered successfully`,
    });
  });

  app.get("/api/emr/lab-tests/orders", authenticateToken, (req, res) => {
    const { patient, doctor, status } = req.query;
    let filtered = [...labTestOrders];

    if (patient) filtered = filtered.filter(o => o.patient === patient);
    if (doctor) filtered = filtered.filter(o => o.doctor === doctor);
    if (status) filtered = filtered.filter(o => o.status === status);

    filtered.sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));

    res.json({ success: true, data: filtered });
  });

  app.put("/api/emr/lab-tests/orders/:id", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR, Role.LAB), (req, res) => {
    const order = findById(labTestOrders, req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Lab order not found" });

    if (req.body.status) order.status = req.body.status;
    if (req.body.results) order.results = req.body.results;
    if (req.body.completedAt) order.completedAt = req.body.completedAt;
    if (req.body.notes) order.notes = req.body.notes;

    res.json({ success: true, data: order, message: "Lab order updated" });
  });

  // ==================== EMR: File Uploads ====================

  app.post("/api/emr/files/upload", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, doctor, appointment, fileName, fileType, fileSize, fileData, category, description } = req.body;

    if (!patient || !fileName || !fileData) {
      return res.status(400).json({ success: false, message: "Patient, fileName, and fileData are required" });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (fileSize && fileSize > MAX_SIZE) {
      return res.status(400).json({ success: false, message: "File size exceeds 10MB limit" });
    }

    const newFile = {
      id: generateId("file"),
      patient,
      doctor: doctor || req.user.id,
      appointment: appointment || null,
      fileName,
      fileType: fileType || "application/octet-stream",
      fileSize: fileSize || 0,
      fileData,
      category: category || "other",
      description: description || "",
      uploadedAt: new Date().toISOString(),
    };

    uploadedFiles.push(newFile);

    // Attach to medical record if appointment provided
    if (appointment) {
      const record = medicalRecords.find(r => r.appointment === appointment);
      if (record) {
        record.attachments = record.attachments || [];
        record.attachments.push({ id: newFile.id, fileName, fileType, category });
        record.updatedAt = new Date().toISOString();
      }
    }

    res.status(201).json({
      success: true,
      data: { id: newFile.id, fileName, fileType, fileSize, category, uploadedAt: newFile.uploadedAt },
      message: "File uploaded successfully",
    });
  });

  app.get("/api/emr/files", authenticateToken, (req, res) => {
    const { patient, category } = req.query;
    let filtered = [...uploadedFiles];

    if (patient) filtered = filtered.filter(f => f.patient === patient);
    if (category) filtered = filtered.filter(f => f.category === category);

    filtered.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Return metadata only (no fileData)
    const metadata = filtered.map(({ fileData, ...rest }) => rest);

    res.json({ success: true, data: metadata });
  });

  app.get("/api/emr/files/:id", authenticateToken, (req, res) => {
    const file = findById(uploadedFiles, req.params.id);
    if (!file) return res.status(404).json({ success: false, message: "File not found" });

    res.json({ success: true, data: file });
  });

  app.delete("/api/emr/files/:id", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const idx = uploadedFiles.findIndex(f => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "File not found" });

    uploadedFiles.splice(idx, 1);
    res.json({ success: true, message: "File deleted successfully" });
  });

  // ==================== EMR: Allergies ====================

  app.get("/api/emr/allergies", authenticateToken, (req, res) => {
    const { patient } = req.query;
    let filtered = [...allergies];
    if (patient) filtered = filtered.filter(a => a.patient === patient);
    res.json({ success: true, data: filtered });
  });

  app.post("/api/emr/allergies", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, allergen, reaction, severity, notes } = req.body;

    if (!patient || !allergen) {
      return res.status(400).json({ success: false, message: "Patient and allergen are required" });
    }

    const newAllergy = {
      id: generateId("alg"),
      patient,
      allergen,
      reaction: reaction || "",
      severity: severity || "moderate",
      notes: notes || "",
      recordedBy: req.user.id,
      recordedAt: new Date().toISOString(),
    };

    allergies.push(newAllergy);

    res.status(201).json({
      success: true,
      data: newAllergy,
      message: "Allergy recorded successfully",
    });
  });

  app.delete("/api/emr/allergies/:id", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const idx = allergies.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: "Allergy not found" });

    allergies.splice(idx, 1);
    res.json({ success: true, message: "Allergy removed" });
  });

  // ==================== EMR: Drug Interaction Check ====================

  app.post("/api/emr/drug-interactions/check", authenticateToken, (req, res) => {
    const { medicines } = req.body;

    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
      return res.json({ success: true, data: { hasInteractions: false, interactions: [] } });
    }

    // Known drug interaction pairs (simplified)
    const knownInteractions = [
      { pair: ["Amoxicillin", "Methotrexate"], severity: "moderate", description: "Amoxicillin may increase methotrexate toxicity" },
      { pair: ["Ibuprofen", "Aspirin"], severity: "moderate", description: "Increased risk of GI bleeding" },
      { pair: ["Ibuprofen", "Warfarin"], severity: "severe", description: "Increased risk of bleeding" },
      { pair: ["Omeprazole", "Clopidogrel"], severity: "moderate", description: "Omeprazole may reduce clopidogrel effectiveness" },
      { pair: ["Metformin", "Furosemide"], severity: "mild", description: "Furosemide may increase blood glucose" },
      { pair: ["Amlodipine", "Clarithromycin"], severity: "moderate", description: "Clarithromycin may increase amlodipine levels" },
      { pair: ["Atorvastatin", "Clarithromycin"], severity: "moderate", description: "Increased risk of myopathy" },
      { pair: ["Losartan", "Ibuprofen"], severity: "moderate", description: "NSAIDs may reduce antihypertensive effect" },
      { pair: ["Warfarin", "Aspirin"], severity: "severe", description: "Severe bleeding risk" },
      { pair: ["Levothyroxine", "Omeprazole"], severity: "mild", description: "Omeprazole may reduce levothyroxine absorption" },
      { pair: ["Prednisolone", "Ibuprofen"], severity: "moderate", description: "Increased risk of GI ulceration" },
      { pair: ["Metronidazole", "Warfarin"], severity: "severe", description: "Metronidazole potentiates warfarin effect" },
      { pair: ["Doxycycline", "Warfarin"], severity: "moderate", description: "Doxycycline may enhance anticoagulant effect" },
      { pair: ["Ciprofloxacin", "Theophylline"], severity: "moderate", description: "Ciprofloxacin increases theophylline levels" },
      { pair: ["Salbutamol", "Propranolol"], severity: "severe", description: "Beta-blockers may antagonize bronchodilation" },
    ];

    const medicineNames = medicines.map(m => m.name || m).filter(Boolean);
    const interactions = [];

    for (let i = 0; i < medicineNames.length; i++) {
      for (let j = i + 1; j < medicineNames.length; j++) {
        for (const ki of knownInteractions) {
          if (
            (ki.pair[0].toLowerCase() === medicineNames[i].toLowerCase() && ki.pair[1].toLowerCase() === medicineNames[j].toLowerCase()) ||
            (ki.pair[1].toLowerCase() === medicineNames[i].toLowerCase() && ki.pair[0].toLowerCase() === medicineNames[j].toLowerCase())
          ) {
            interactions.push({
              medicine1: medicineNames[i],
              medicine2: medicineNames[j],
              severity: ki.severity,
              description: ki.description,
            });
          }
        }
      }
    }

    res.json({
      success: true,
      data: {
        hasInteractions: interactions.length > 0,
        interactions,
        checkedCount: medicineNames.length,
      },
    });
  });

  // ==================== EMR: Vital Signs History ====================

  app.post("/api/emr/vital-signs", authenticateToken, authorizeRoles(Role.ADMIN, Role.DOCTOR), (req, res) => {
    const { patient, doctor, appointment, vitalSigns } = req.body;

    if (!patient || !vitalSigns) {
      return res.status(400).json({ success: false, message: "Patient and vitalSigns are required" });
    }

    const record = {
      id: generateId("vs"),
      patient,
      doctor: doctor || req.user.id,
      appointment: appointment || null,
      vitalSigns,
      recordedAt: new Date().toISOString(),
    };

    vitalSignsHistory.push(record);

    res.status(201).json({ success: true, data: record, message: "Vital signs recorded" });
  });

  app.get("/api/emr/vital-signs", authenticateToken, (req, res) => {
    const { patient, limit = 20 } = req.query;
    let filtered = [...vitalSignsHistory];

    if (patient) filtered = filtered.filter(v => v.patient === patient);

    filtered.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

    res.json({
      success: true,
      data: filtered.slice(0, parseInt(limit)),
    });
  });

  // ==================== Health Check ====================

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
  });

  // ==================== Vite Middleware ====================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
