export const Role = {
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
  RECEPTIONIST: "RECEPTIONIST",
  LAB: "LAB",
  PHARMACY: "PHARMACY"
};

// ==================== EMR Types ====================

export const RecordType = {
  CONSULTATION: "consultation",
  LAB_REPORT: "lab_report",
  IMAGING: "imaging",
  DISCHARGE_SUMMARY: "discharge_summary",
  FOLLOW_UP: "follow_up",
  PROCEDURE: "procedure",
  VACCINATION: "vaccination",
  ALLERGY: "allergy",
};

export const PrescriptionStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};

export const LabTestStatus = {
  ORDERED: "ordered",
  SAMPLE_COLLECTED: "sample_collected",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const AllergySeverity = {
  MILD: "mild",
  MODERATE: "moderate",
  SEVERE: "severe",
  LIFE_THREATENING: "life_threatening",
};

export const FileCategory = {
  LAB_REPORT: "lab_report",
  IMAGING: "imaging",
  PRESCRIPTION: "prescription",
  DISCHARGE_SUMMARY: "discharge_summary",
  CONSENT_FORM: "consent_form",
  OTHER: "other",
};

// ==================== Helper: Empty form templates ====================

export const emptyVitalSigns = () => ({
  bloodPressure: { systolic: "", diastolic: "" },
  heartRate: "",
  temperature: "",
  respiratoryRate: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
  bmi: "",
});

export const emptyMedicine = () => ({
  id: Date.now(),
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
  route: "oral",
});

export const emptyLabTestOrder = () => ({
  id: Date.now(),
  testName: "",
  category: "",
  priority: "routine",
  instructions: "",
});
