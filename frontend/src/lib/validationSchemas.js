import { z } from "zod";

// Medicine schema for prescription builder
export const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required").max(100, "Name too long"),
  dosage: z.string().min(1, "Dosage is required").max(50, "Dosage too long"),
  duration: z.string().min(1, "Duration is required").max(50, "Duration too long"),
});

// Consultation form schema
export const consultationFormSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required").max(1000, "Diagnosis too long"),
  symptoms: z.array(z.string().min(1).max(100)).min(0, "Invalid symptoms"),
  clinicalNotes: z.string().max(2000, "Notes too long").optional(),
});

// Prescription schema
export const prescriptionSchema = z.object({
  diagnosis: z.string().min(1, "Diagnosis is required").max(1000, "Diagnosis too long"),
  symptoms: z.array(z.string().min(1).max(100)).min(0, "Invalid symptoms"),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
  notes: z.string().max(1000, "Notes too long").optional(),
});

// File upload validation
export const fileValidation = {
  allowedTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
};

// Validate file
export const validateFile = (file) => {
  if (!fileValidation.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only PDF, JPEG, and PNG files are allowed.`,
    };
  }
  
  if (file.size > fileValidation.maxSize) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`,
    };
  }
  
  return { valid: true };
};

// Validate multiple files
export const validateFiles = (files) => {
  if (files.length > fileValidation.maxFiles) {
    return {
      valid: false,
      error: `Too many files: ${files.length}. Maximum is ${fileValidation.maxFiles} files.`,
    };
  }
  
  for (const file of files) {
    const validation = validateFile(file);
    if (!validation.valid) {
      return validation;
    }
  }
  
  return { valid: true };
};

// Patient data validation (for form display)
export const patientSchema = z.object({
  _id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.enum(["Male", "Female", "Other"]),
  patientId: z.string().optional(),
  bloodGroup: z.string().optional(),
  emergencyContact: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Appointment data validation
export const appointmentSchema = z.object({
  _id: z.string(),
  patient: z.string(),
  doctor: z.string(),
  scheduledAt: z.string(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  reason: z.string().optional(),
});

// Lab report schema
export const labReportSchema = z.object({
  patient: z.string(),
  appointment: z.string(),
  test: z.string(),
  reportUrl: z.string().url("Invalid URL"),
  status: z.enum(["pending", "completed"]),
});

// Type exports (for TypeScript users)
// export type MedicineSchemaType = z.infer<typeof medicineSchema>;
// export type ConsultationFormType = z.infer<typeof consultationFormSchema>;
// export type PrescriptionType = z.infer<typeof prescriptionSchema>;
// export type PatientType = z.infer<typeof patientSchema>;
// export type AppointmentType = z.infer<typeof appointmentSchema>;
// export type LabReportType = z.infer<typeof labReportSchema>;
