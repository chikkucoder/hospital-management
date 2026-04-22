// data/bill.js
export const PATIENTS = [
  { _id: "P001", name: "John Doe", age: 30, gender: "Male", phone: "555-1234", email: "john@example.com", address: "123 Main St" },
  { _id: "P002", name: "Jane Smith", age: 25, gender: "Female", phone: "555-5678", email: "jane@example.com", address: "456 Elm St" }
];

export const APPOINTMENTS = [
  { _id: "A001", patientId: "P001", doctorName: "Dr. Alice", speciality: "Cardiology", date: "2026-04-20", time: "10:30 AM" },
  { _id: "A002", patientId: "P002", doctorName: "Dr. Bob", speciality: "Orthopedics", date: "2026-04-22", time: "02:00 PM" }
];

export const SERVICE_CATALOG = [
  { id: "S001", type: "Consultation", name: "General Consultation", unitPrice: 500 },
  { id: "S002", type: "Lab", name: "Blood Test", unitPrice: 800 },
  { id: "S003", type: "Procedure", name: "X-Ray", unitPrice: 1200 },
  { id: "S004", type: "Medicine", name: "Paracetamol", unitPrice: 50 },
  { id: "S005", type: "Room", name: "Standard Room (per day)", unitPrice: 2000 }
];

export const TAX_RATE = 0.18;            // 18% GST
export const DEFAULT_DISCOUNT = 0;       // default discount percentage
export const HOSPITAL_INFO = {
  name: "ACME Hospital",
  tagline: "Quality Care, Always",
  address: "123 Wellness Ave, Healthy City",
  phone: "1800-123-456",
  email: "info@acmehospital.com",
  gst: "27ABCDE1234F1Z5",
  logo: "🏥"  // or a URL to an image
};
export const SAVED_BILLS = [];  // initial saved bills (empty)

// Utility to generate sequential invoice numbers
export function generateInvoiceNumber(index) {
  const year = new Date().getFullYear();
  return `INV-${year}-${String(index + 1).padStart(4, "0")}`;
}
