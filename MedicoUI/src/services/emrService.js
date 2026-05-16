const API_BASE = "/api/emr";

// In-memory fallback when backend is unavailable
const getLocalEMR = () => {
  try {
    return JSON.parse(localStorage.getItem("medico_emr") || '{"prescriptions":[],"reports":[],"medicalRecords":[]}');
  } catch {
    return { prescriptions: [], reports: [], medicalRecords: [] };
  }
};
const saveLocalEMR = (data) => localStorage.setItem("medico_emr", JSON.stringify(data));

const apiCall = async (url, options = {}) => {
  const token = JSON.parse(localStorage.getItem("medico_session") || "{}")?.token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
};

// ─── Prescriptions ───────────────────────────────────────────────
const createPrescription = async (data) => {
  try {
    return await apiCall(`${API_BASE}/prescriptions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Fallback to localStorage
    const emr = getLocalEMR();
    const record = {
      ...data,
      id: `RX-${Date.now().toString(36).toUpperCase()}`,
      type: "prescription",
      createdAt: new Date().toISOString(),
      version: 1,
    };
    emr.prescriptions.push(record);
    saveLocalEMR(emr);
    return record;
  }
};

const getPrescriptions = async (patientId) => {
  try {
    return await apiCall(`${API_BASE}/prescriptions/${patientId}`);
  } catch {
    const emr = getLocalEMR();
    return emr.prescriptions
      .filter((p) => p.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// ─── Medical Records (Diagnosis Notes) ───────────────────────────
const createMedicalRecord = async (data) => {
  try {
    return await apiCall(`${API_BASE}/medical-records`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const emr = getLocalEMR();
    const record = {
      ...data,
      id: `MR-${Date.now().toString(36).toUpperCase()}`,
      type: "medicalRecord",
      createdAt: new Date().toISOString(),
      version: 1,
    };
    emr.medicalRecords.push(record);
    saveLocalEMR(emr);
    return record;
  }
};

const getMedicalRecords = async (patientId) => {
  try {
    return await apiCall(`${API_BASE}/medical-records/${patientId}`);
  } catch {
    const emr = getLocalEMR();
    return emr.medicalRecords
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// ─── File Upload / Reports ───────────────────────────────────────
const uploadReport = async (formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("medico_session") || "{}")?.token;
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  } catch {
    // Fallback: simulate upload with a data URL or placeholder
    const file = formData.get("file");
    const patientId = formData.get("patientId");
    const reportType = formData.get("type") || "General Report";
    const emr = getLocalEMR();
    const record = {
      id: `REP-${Date.now().toString(36).toUpperCase()}`,
      patientId,
      fileName: file?.name || "uploaded-file",
      fileUrl: URL.createObjectURL(file),
      type: reportType,
      uploadedBy: JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Staff",
      createdAt: new Date().toISOString(),
      fileSize: file?.size || 0,
    };
    emr.reports.push(record);
    saveLocalEMR(emr);
    return record;
  }
};

const getReports = async (patientId) => {
  try {
    return await apiCall(`${API_BASE}/files/${patientId}`);
  } catch {
    const emr = getLocalEMR();
    return emr.reports
      .filter((r) => r.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

const deleteReport = async (fileId) => {
  try {
    return await apiCall(`${API_BASE}/files/${fileId}`, { method: "DELETE" });
  } catch {
    const emr = getLocalEMR();
    emr.reports = emr.reports.filter((r) => r.id !== fileId);
    saveLocalEMR(emr);
    return { success: true };
  }
};

// ─── Medicine Search ─────────────────────────────────────────────
const MEDICINE_CATALOG = [
  { name: "Paracetamol 500mg", category: "Analgesic", defaultDosage: "500mg", defaultDuration: "5 days" },
  { name: "Ibuprofen 400mg", category: "NSAID", defaultDosage: "400mg", defaultDuration: "5 days" },
  { name: "Amoxicillin 250mg", category: "Antibiotic", defaultDosage: "250mg", defaultDuration: "7 days" },
  { name: "Amoxicillin 500mg", category: "Antibiotic", defaultDosage: "500mg", defaultDuration: "7 days" },
  { name: "Azithromycin 500mg", category: "Antibiotic", defaultDosage: "500mg", defaultDuration: "3 days" },
  { name: "Ciprofloxacin 500mg", category: "Antibiotic", defaultDosage: "500mg", defaultDuration: "7 days" },
  { name: "Metformin 500mg", category: "Antidiabetic", defaultDosage: "500mg", defaultDuration: "30 days" },
  { name: "Metformin 850mg", category: "Antidiabetic", defaultDosage: "850mg", defaultDuration: "30 days" },
  { name: "Glibenclamide 5mg", category: "Antidiabetic", defaultDosage: "5mg", defaultDuration: "30 days" },
  { name: "Insulin Glargine", category: "Antidiabetic", defaultDosage: "10 units", defaultDuration: "30 days" },
  { name: "Amlodipine 5mg", category: "Antihypertensive", defaultDosage: "5mg", defaultDuration: "30 days" },
  { name: "Amlodipine 10mg", category: "Antihypertensive", defaultDosage: "10mg", defaultDuration: "30 days" },
  { name: "Losartan 50mg", category: "Antihypertensive", defaultDosage: "50mg", defaultDuration: "30 days" },
  { name: "Enalapril 10mg", category: "ACE Inhibitor", defaultDosage: "10mg", defaultDuration: "30 days" },
  { name: "Atenolol 50mg", category: "Beta Blocker", defaultDosage: "50mg", defaultDuration: "30 days" },
  { name: "Atorvastatin 10mg", category: "Statin", defaultDosage: "10mg", defaultDuration: "30 days" },
  { name: "Atorvastatin 20mg", category: "Statin", defaultDosage: "20mg", defaultDuration: "30 days" },
  { name: "Omeprazole 20mg", category: "PPI", defaultDosage: "20mg", defaultDuration: "14 days" },
  { name: "Pantoprazole 40mg", category: "PPI", defaultDosage: "40mg", defaultDuration: "14 days" },
  { name: "Ranitidine 150mg", category: "H2 Blocker", defaultDosage: "150mg", defaultDuration: "14 days" },
  { name: "Cetirizine 10mg", category: "Antihistamine", defaultDosage: "10mg", defaultDuration: "7 days" },
  { name: "Loratadine 10mg", category: "Antihistamine", defaultDosage: "10mg", defaultDuration: "7 days" },
  { name: "Montelukast 10mg", category: "Leukotriene Inhibitor", defaultDosage: "10mg", defaultDuration: "30 days" },
  { name: "Salbutamol Inhaler", category: "Bronchodilator", defaultDosage: "2 puffs", defaultDuration: "As needed" },
  { name: "Prednisolone 5mg", category: "Corticosteroid", defaultDosage: "5mg", defaultDuration: "7 days" },
  { name: "Levothyroxine 50mcg", category: "Thyroid Hormone", defaultDosage: "50mcg", defaultDuration: "30 days" },
  { name: "Furosemide 40mg", category: "Diuretic", defaultDosage: "40mg", defaultDuration: "7 days" },
  { name: "Aspirin 75mg", category: "Antiplatelet", defaultDosage: "75mg", defaultDuration: "30 days" },
  { name: "Clopidogrel 75mg", category: "Antiplatelet", defaultDosage: "75mg", defaultDuration: "30 days" },
  { name: "Warfarin 5mg", category: "Anticoagulant", defaultDosage: "5mg", defaultDuration: "30 days" },
  { name: "Metronidazole 400mg", category: "Antibiotic", defaultDosage: "400mg", defaultDuration: "7 days" },
  { name: "Fluconazole 150mg", category: "Antifungal", defaultDosage: "150mg", defaultDuration: "Single dose" },
  { name: "Diclofenac 50mg", category: "NSAID", defaultDosage: "50mg", defaultDuration: "5 days" },
  { name: "Tramadol 50mg", category: "Opioid Analgesic", defaultDosage: "50mg", defaultDuration: "5 days" },
  { name: "Gabapentin 300mg", category: "Anticonvulsant", defaultDosage: "300mg", defaultDuration: "14 days" },
  { name: "Sertraline 50mg", category: "SSRI", defaultDosage: "50mg", defaultDuration: "30 days" },
  { name: "Fluoxetine 20mg", category: "SSRI", defaultDosage: "20mg", defaultDuration: "30 days" },
  { name: "Alprazolam 0.5mg", category: "Benzodiazepine", defaultDosage: "0.5mg", defaultDuration: "7 days" },
  { name: "Calcium + Vitamin D3", category: "Supplement", defaultDosage: "1 tablet", defaultDuration: "30 days" },
  { name: "Iron + Folic Acid", category: "Supplement", defaultDosage: "1 tablet", defaultDuration: "30 days" },
  { name: "Multivitamin", category: "Supplement", defaultDosage: "1 tablet", defaultDuration: "30 days" },
  { name: "Dextromethorphan Syrup", category: "Cough Suppressant", defaultDosage: "10ml", defaultDuration: "5 days" },
  { name: "Ondansetron 4mg", category: "Antiemetic", defaultDosage: "4mg", defaultDuration: "3 days" },
  { name: "Domperidone 10mg", category: "Antiemetic", defaultDosage: "10mg", defaultDuration: "5 days" },
  { name: "Loperamide 2mg", category: "Antidiarrheal", defaultDosage: "2mg", defaultDuration: "3 days" },
  { name: "Hydrocortisone Cream 1%", category: "Topical Steroid", defaultDosage: "Apply thin layer", defaultDuration: "7 days" },
  { name: "Mupirocin Ointment 2%", category: "Topical Antibiotic", defaultDosage: "Apply TID", defaultDuration: "7 days" },
  { name: "Artificial Tears", category: "Ophthalmic", defaultDosage: "1-2 drops", defaultDuration: "As needed" },
];

const searchMedicines = async (query) => {
  try {
    return await apiCall(`${API_BASE}/medicines/search?q=${encodeURIComponent(query)}`);
  } catch {
    if (!query || query.length < 1) return MEDICINE_CATALOG.slice(0, 10);
    const q = query.toLowerCase();
    return MEDICINE_CATALOG.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
    ).slice(0, 10);
  }
};

// ─── Patient Timeline (combined) ─────────────────────────────────
const getPatientTimeline = async (patientId) => {
  try {
    return await apiCall(`${API_BASE}/timeline/${patientId}`);
  } catch {
    const [prescriptions, reports, records] = await Promise.all([
      getPrescriptions(patientId),
      getReports(patientId),
      getMedicalRecords(patientId),
    ]);
    return [...prescriptions, ...reports, ...records].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
};

// ─── Save Full Consultation ──────────────────────────────────────
const saveConsultation = async ({ patientId, appointmentId, notes, medicines, vitals, files, doctorName }) => {
  const results = { prescription: null, records: [], reports: [] };

  // 1. Save prescription (append-only)
  if (medicines?.length > 0 || notes) {
    results.prescription = await createPrescription({
      patientId,
      appointmentId,
      notes,
      medicines: medicines || [],
      vitals: vitals || {},
      doctorName,
    });
  }

  // 2. Save diagnosis as medical record
  if (notes) {
    const record = await createMedicalRecord({
      patientId,
      appointmentId,
      recordType: "consultation",
      title: "Clinical Consultation",
      clinicalNotes: notes,
      diagnosis: { primary: notes.split("\n")[0] || "", secondary: [] },
      doctorName,
    });
    results.records.push(record);
  }

  // 3. Upload files
  if (files?.length > 0) {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patientId", patientId);
      formData.append("appointmentId", appointmentId || "");
      formData.append("type", "Consultation Report");
      const report = await uploadReport(formData);
      results.reports.push(report);
    }
  }

  return results;
};

export const emrService = {
  // Prescriptions
  createPrescription,
  getPrescriptions,
  // Medical Records
  createMedicalRecord,
  getMedicalRecords,
  // Reports / Files
  uploadReport,
  getReports,
  deleteReport,
  // Medicine Search
  searchMedicines,
  // Timeline
  getPatientTimeline,
  // Full Consultation
  saveConsultation,
};

export default emrService;
