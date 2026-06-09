import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  X,
  Check,
  Users,
  UserCheck,
  UserPlus,
  Clock,
  FileText,
  Calendar,
  MoreHorizontal,
  ArrowUpDown,
  List,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { cn } from "../../lib/utils";
import { patientService } from "../../services/patientService";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

//  ─────────────────────────────────────────────
//  ADD NEW PATIENT MODAL — full form like screenshot
// ───────────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold text-gray-600">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const initialFormData = {
  // Personal
  name: "",
  dob: "",
  age: "",
  gender: "",
  maritalStatus: "",
  bloodGroup: "",
  nationality: "Indian",
  language: "",
  religion: "",
  occupation: "",
  phone: "",
  altPhone: "",
  email: "",
  aadhaar: "",
  pan: "",
  // Address
  address1: "",
  address2: "",
  city: "",
  state: "",
  pin: "",
  country: "India",
  // Emergency
  emergencyName: "",
  relationship: "",
  emergencyPhone: "",
  emergencyAltPhone: "",
  emergencyAddress: "",
  sameAsPatient: false,
  // Medical
  allergies: "",
  chronicConditions: "",
  pastSurgeries: "",
  currentMedications: "",
  familyHistory: "",
  smokingStatus: "",
  alcoholConsumption: "",
  insuranceProvider: "",
  insuranceNumber: "",
  // Additional
  patientId: `PAT-${Date.now()}`,
  registrationDate: new Date().toISOString().split("T")[0],
  referredBy: "",
  notes: "",
};
export function AddPatientModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const set = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  if (!isOpen) return null;

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age > 0 ? age : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await patientService.create(formData);
      onAdd();
      onClose();
    } catch (err) {
      console.error("Failed to add patient", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
  ];

  const inp =
    "h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white placeholder:text-gray-300";
  const sel =
    "h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 bg-white text-gray-600";

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-5xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Dashboard › Patients › Add New Patient
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              12 May 2025 - 18 May 2025
            </div> */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Patients
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Personal Information */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-1">
                <Field label="Full Name" required>
                  <input
                    className={inp}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => set("name", e.target.value)}
                    required
                  />
                </Field>
              </div>
              <Field label="Date of Birth" required>
                <input
                  type="date"
                  className={inp}
                  placeholder="dd/mm/yyyy"
                  value={formData.dob}
                  onChange={(e) => {
                    const dob = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      dob,
                      age: calculateAge(dob),
                    }));
                  }}
                  required
                />
              </Field>
              <Field label="Age (Auto)">
                <input
                  className={inp}
                  placeholder="—"
                  value={formData.age}
                  readOnly
                />
              </Field>
              <Field label="Gender" required>
                <select
                  className={sel}
                  value={formData.gender}
                  onChange={(e) => set("gender", e.target.value)}
                  required
                >
                  <option value="">Select gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Marital Status">
                <select
                  className={sel}
                  value={formData.maritalStatus}
                  onChange={(e) => set("maritalStatus", e.target.value)}
                >
                  <option value="">Select status</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Field label="Blood Group">
                <select
                  className={sel}
                  value={formData.bloodGroup}
                  onChange={(e) => set("bloodGroup", e.target.value)}
                >
                  <option value="">Select blood group</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                    (g) => (
                      <option key={g}>{g}</option>
                    ),
                  )}
                </select>
              </Field>
              <Field label="Nationality">
                <select
                  className={sel}
                  value={formData.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                >
                  <option value="Indian">Indian</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Preferred Language">
                <select
                  className={sel}
                  value={formData.language}
                  onChange={(e) => set("language", e.target.value)}
                >
                  <option value="">Select language</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                  <option>Tamil</option>
                </select>
              </Field>
              <Field label="Religion">
                <select
                  className={sel}
                  value={formData.religion}
                  onChange={(e) => set("religion", e.target.value)}
                >
                  <option value="">Select religion</option>
                  <option>Hindu</option>
                  <option>Muslim</option>
                  <option>Christian</option>
                  <option>Sikh</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Occupation">
                <input
                  className={inp}
                  placeholder="Enter occupation"
                  value={formData.occupation}
                  onChange={(e) => set("occupation", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Field label="Phone Number" required>
                <div className="flex gap-1">
                  <span className="h-9 px-2 border border-gray-200 rounded-lg text-sm flex items-center gap-1 bg-white text-gray-500">
                    🇮🇳 +91
                  </span>
                  <input
                    className={inp + " flex-1 min-w-0"}
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    required
                  />
                </div>
              </Field>
              <Field label="Alternate Phone">
                <div className="flex gap-1">
                  <span className="h-9 px-2 border border-gray-200 rounded-lg text-sm flex items-center gap-1 bg-white text-gray-500">
                    🇮🇳 +91
                  </span>
                  <input
                    className={inp + " flex-1 min-w-0"}
                    placeholder="Enter alternate number"
                    value={formData.altPhone}
                    onChange={(e) => set("altPhone", e.target.value)}
                  />
                </div>
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  className={inp}
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>
              <Field label="Aadhaar Number">
                <input
                  className={inp}
                  placeholder="Enter aadhaar number"
                  value={formData.aadhaar}
                  onChange={(e) => set("aadhaar", e.target.value)}
                />
              </Field>
              <Field label="PAN Number">
                <input
                  className={inp}
                  placeholder="Enter PAN number"
                  value={formData.pan}
                  onChange={(e) => set("pan", e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Address */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Field label="Address Line 1" required>
                  <input
                    className={inp}
                    placeholder="House no., Building, Street"
                    value={formData.address1}
                    onChange={(e) => set("address1", e.target.value)}
                    required
                  />
                </Field>
              </div>
              <Field label="Address Line 2">
                <input
                  className={inp}
                  placeholder="Area, Landmark (Optional)"
                  value={formData.address2}
                  onChange={(e) => set("address2", e.target.value)}
                />
              </Field>
              <Field label="City">
                <input
                  className={inp}
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => set("city", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="State" required>
                <select
                  className={sel}
                  value={formData.state}
                  onChange={(e) => set("state", e.target.value)}
                  required
                >
                  <option value="">Select state</option>
                  {indianStates.map((state, index) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="PIN Code">
                <input
                  className={inp}
                  placeholder="Enter PIN code"
                  value={formData.pin}
                  onChange={(e) => set("pin", e.target.value)}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Country" required>
                  <select
                    className={sel}
                    value={formData.country}
                    onChange={(e) => set("country", e.target.value)}
                  >
                    <option>India</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* Emergency Contact + Medical Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Contact Person Name" required>
                  <input
                    className={inp}
                    placeholder="Enter contact person name"
                    value={formData.emergencyName}
                    onChange={(e) => set("emergencyName", e.target.value)}
                    required
                  />
                </Field>
                <Field label="Relationship" required>
                  <select
                    className={sel}
                    value={formData.relationship}
                    onChange={(e) => set("relationship", e.target.value)}
                    required
                  >
                    <option value="">Select relationship</option>
                    <option>Spouse</option>
                    <option>Parent</option>
                    <option>Child</option>
                    <option>Sibling</option>
                    <option>Friend</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone Number">
                  <div className="flex gap-1">
                    <span className="h-9 px-2 border border-gray-200 rounded-lg text-sm flex items-center gap-1 bg-white text-gray-500">
                      🇮🇳 +91
                    </span>
                    <input
                      className={inp + " flex-1 min-w-0"}
                      placeholder="Enter phone number"
                      value={formData.emergencyPhone}
                      onChange={(e) => set("emergencyPhone", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Alternate Phone">
                  <div className="flex gap-1">
                    <span className="h-9 px-2 border border-gray-200 rounded-lg text-sm flex items-center gap-1 bg-white text-gray-500">
                      🇮🇳 +91
                    </span>
                    <input
                      className={inp + " flex-1 min-w-0"}
                      placeholder="Enter alternate number"
                      value={formData.emergencyAltPhone}
                      onChange={(e) => set("emergencyAltPhone", e.target.value)}
                    />
                  </div>
                </Field>
              </div>
              <Field label="Address (if different from above)">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-emerald-600"
                      checked={formData.sameAsPatient}
                      onChange={(e) => set("sameAsPatient", e.target.checked)}
                    />
                    Same as patient address
                  </label>
                  {!formData.sameAsPatient && (
                    <textarea
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
                      rows={2}
                      placeholder="Enter address"
                      value={formData.emergencyAddress}
                      onChange={(e) => set("emergencyAddress", e.target.value)}
                    />
                  )}
                </div>
              </Field>
            </section>

            <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
              <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Medical Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Known Allergies">
                  <input
                    className={inp}
                    placeholder="Enter allergies (if any)"
                    value={formData.allergies}
                    onChange={(e) => set("allergies", e.target.value)}
                  />
                </Field>
                <Field label="Chronic Conditions">
                  <input
                    className={inp}
                    placeholder="Enter chronic conditions (if any)"
                    value={formData.chronicConditions}
                    onChange={(e) => set("chronicConditions", e.target.value)}
                  />
                </Field>
                <Field label="Past Surgeries">
                  <input
                    className={inp}
                    placeholder="Enter past surgeries (if any)"
                    value={formData.pastSurgeries}
                    onChange={(e) => set("pastSurgeries", e.target.value)}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Current Medications">
                  <input
                    className={inp}
                    placeholder="Enter current medications"
                    value={formData.currentMedications}
                    onChange={(e) => set("currentMedications", e.target.value)}
                  />
                </Field>
                <Field label="Family Medical History">
                  <input
                    className={inp}
                    placeholder="Enter family medical history"
                    value={formData.familyHistory}
                    onChange={(e) => set("familyHistory", e.target.value)}
                  />
                </Field>
                <Field label="Smoking Status">
                  <select
                    className={sel}
                    value={formData.smokingStatus}
                    onChange={(e) => set("smokingStatus", e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option>Never</option>
                    <option>Former</option>
                    <option>Current</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Field label="Alcohol Consumption">
                  <select
                    className={sel}
                    value={formData.alcoholConsumption}
                    onChange={(e) => set("alcoholConsumption", e.target.value)}
                  >
                    <option value="">Select status</option>
                    <option>Never</option>
                    <option>Occasional</option>
                    <option>Moderate</option>
                    <option>Heavy</option>
                  </select>
                </Field>
                <Field label="Insurance Provider">
                  <input
                    className={inp}
                    placeholder="Enter insurance provider"
                    value={formData.insuranceProvider}
                    onChange={(e) => set("insuranceProvider", e.target.value)}
                  />
                </Field>
                <Field label="Insurance Number">
                  <input
                    className={inp}
                    placeholder="Enter insurance number"
                    value={formData.insuranceNumber}
                    onChange={(e) => set("insuranceNumber", e.target.value)}
                  />
                </Field>
              </div>
            </section>
          </div>

          {/* Additional Information */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-sm font-bold text-emerald-700 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Additional Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field label="Patient ID (Auto)">
                <input
                  className={inp + " bg-gray-50 text-gray-400"}
                  value={formData.patientId}
                  readOnly
                />
              </Field>
              <Field label="Registration Date">
                <input
                  type="date"
                  className={inp}
                  value={formData.registrationDate}
                  onChange={(e) => set("registrationDate", e.target.value)}
                />
              </Field>
              <Field label="Referred By (Doctor)">
                <select
                  className={sel}
                  value={formData.referredBy}
                  onChange={(e) => set("referredBy", e.target.value)}
                >
                  <option value="">Select doctor (optional)</option>
                </select>
              </Field>
              <Field label="Notes">
                <input
                  className={inp}
                  placeholder="Enter any additional notes"
                  value={formData.notes}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </Field>
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-2">
            <button
              type="button"
              onClick={() => setFormData(initialFormData)}
              className="px-6 h-10 rounded-lg active:scale-95 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors active:scale-95"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 h-10 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 h-10 bg-emerald-700 text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-emerald-700/20"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Save Patient
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
