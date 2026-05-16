import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Stethoscope,
  Activity,
  Pill,
  FileText,
  Save,
  Plus,
  X,
  History,
  CheckCircle2,
  Loader2,
  Upload,
  Calendar,
  FileSearch,
  ExternalLink,
  Printer,
  AlertTriangle,
  Clock,
  FlaskConical,
  PanelRightOpen,
  PanelRightClose,
  ArrowLeft,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { patientService } from "../services/patientService";
import { emrService } from "../services/emrService";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";
import MedicineSearch from "../components/emr/MedicineSearch";
import FileUploader from "../components/emr/FileUploader";
import PatientMedicalHistory from "../components/emr/PatientMedicalHistory";
import PrescriptionPrint from "../components/emr/PrescriptionPrint";
import PrescriptionsTab from "../components/emr/PrescriptionsTab";
import LabReportsTab from "../components/emr/LabReportsTab";
import UploadReportsTab from "../components/emr/UploadReportsTab";
import ClinicalProfilePanel from "../components/emr/ClinicalProfilePanel";

export default function EMR() {
  const { patientId } = useParams();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeView, setActiveView] = useState("draft"); // "draft" or "history"
  const [toast, setToast] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(window.innerWidth >= 1024);

  // Fetch patient by URL param
  useEffect(() => {
    if (!patientId) return;
    const fetchPatient = async () => {
      setLoadingPatient(true);
      try {
        const p = await patientService.getById(patientId);
        if (p) {
          setSelectedPatient(p);
        }
      } catch (err) {
        console.error("Failed to fetch patient:", err);
      } finally {
        setLoadingPatient(false);
      }
    };
    fetchPatient();
  }, [patientId]);

  // EMR Form State
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [clinicalFindings, setClinicalFindings] = useState({
    bp: "",
    pulse: "",
    temp: "",
    spo2: "",
    weight: "",
    height: "",
  });

  // Report Upload State
  const [reportType, setReportType] = useState("Lab Report");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Print State
  const [printPrescription, setPrintPrescription] = useState(null);

  // Last saved record for confirmation
  const [lastSaved, setLastSaved] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAddMedicine = (med) => {
    setMedicines([...medicines, { ...med, id: Date.now().toString() }]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleUpdateMedicine = (idx, field, value) => {
    const updated = [...medicines];
    updated[idx] = { ...updated[idx], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return;
    if (!notes.trim() && medicines.length === 0 && uploadedFiles.length === 0) {
      showToast("Please add diagnosis notes, medicines, or upload files before saving.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const doctorName =
        JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Current";

      const result = await emrService.saveConsultation({
        patientId: selectedPatient.patientId || selectedPatient.id,
        appointmentId: selectedPatient.appointmentId || null,
        notes,
        medicines,
        vitals: clinicalFindings,
        files: uploadedFiles,
        doctorName,
      });

      setLastSaved({
        prescription: result.prescription,
        timestamp: new Date().toISOString(),
      });

      // Reset Form
      setNotes("");
      setMedicines([]);
      setClinicalFindings({ bp: "", pulse: "", temp: "", spo2: "", weight: "", height: "" });
      setUploadedFiles([]);
      setReportType("Lab Report");

      showToast("Clinical record saved successfully. Records are append-only and immutable.", "success");
      setActiveView("history");
    } catch (err) {
      console.error("Save failed:", err);
      showToast("Failed to save record. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesChange = (newFiles) => {
    setUploadedFiles(newFiles);
  };

  const handleRemoveFile = (idx) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
  };

  const getInitials = (name) =>
    (name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* ─── Toast Notification ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={cn(
              "fixed top-6 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold backdrop-blur-md",
              toast.type === "success"
                ? "bg-emerald-600 text-white shadow-emerald-600/20"
                : "bg-red-600 text-white shadow-red-600/20"
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
        {loadingPatient ? (
          <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="animate-spin text-primary w-10 h-10 mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Loading patient record...
            </p>
          </div>
        ) : !selectedPatient ? (
          <div className="flex-1 bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-6">
              <Stethoscope className="w-10 h-10 text-primary opacity-20" />
            </div>
            <h2 className="text-2xl font-black text-primary-dark tracking-tighter italic">
              Clinical Workplace
            </h2>
            <p className="text-gray-400 font-medium max-w-sm mt-2">
              {patientId
                ? "Patient not found. The record may have been removed."
                : "Select a patient from the Patients page to begin clinical evaluation and prescription drafting."}
            </p>
            <Link
              to="/patients"
              className="mt-6 h-12 px-8 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Browse Patients
            </Link>
            <div className="mt-8 flex gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> Diagnosis Notes
              </span>
              <span className="flex items-center gap-1">
                <Pill className="w-3 h-3" /> Prescriptions
              </span>
              <span className="flex items-center gap-1">
                <Upload className="w-3 h-3" /> File Uploads
              </span>
              <span className="flex items-center gap-1">
                <History className="w-3 h-3" /> Immutable History
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* ─── Patient Header & View Switcher ─── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-dark font-black text-lg">
                  {getInitials(selectedPatient.name)}
                </div>
                <div>
                  <h2 className="text-xl font-black text-primary-dark tracking-tight">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {selectedPatient.patientId || "ID: N/A"} • {selectedPatient.gender || "N/A"}
                    {selectedPatient.age ? ` • ${selectedPatient.age} years` : ""}
                    {selectedPatient.bloodGroup ? ` • Blood: ${selectedPatient.bloodGroup}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1 bg-gray-100 rounded-2xl flex gap-1 flex-wrap">
                  <button
                    onClick={() => setActiveView("draft")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeView === "draft"
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" /> Clinical Draft
                  </button>
                  <button
                    onClick={() => setActiveView("prescriptions")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeView === "prescriptions"
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <Pill className="w-3.5 h-3.5" /> Prescriptions
                  </button>
                  <button
                    onClick={() => setActiveView("labReports")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeView === "labReports"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <FlaskConical className="w-3.5 h-3.5" /> Lab Reports
                  </button>
                  <button
                    onClick={() => setActiveView("uploadReports")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeView === "uploadReports"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Reports
                  </button>
                  <button
                    onClick={() => setActiveView("history")}
                    className={cn(
                      "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeView === "history"
                        ? "bg-white text-purple-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <History className="w-3.5 h-3.5" /> Timeline
                  </button>
                </div>

                {/* Profile Panel Toggle */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-2xl border transition-all flex-shrink-0",
                    isProfileOpen
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-white text-gray-400 border-gray-200 hover:text-primary hover:border-primary/20"
                  )}
                  title={isProfileOpen ? "Hide patient profile" : "Show patient profile"}
                >
                  {isProfileOpen ? (
                    <PanelRightClose className="w-4 h-4" />
                  ) : (
                    <PanelRightOpen className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeView === "draft" && (
                <motion.div
                  key="draft"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* ─── Clinical Findings (Vital Signs) ─── */}
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                        <Activity className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                        Clinical Findings
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {[
                        {
                          label: "Blood Pressure",
                          placeholder: "120/80",
                          value: clinicalFindings.bp,
                          key: "bp",
                          color: "text-primary",
                          unit: "mmHg",
                        },
                        {
                          label: "Heart Rate",
                          placeholder: "72",
                          value: clinicalFindings.pulse,
                          key: "pulse",
                          color: "text-red-500",
                          unit: "BPM",
                        },
                        {
                          label: "Temperature",
                          placeholder: "98.6",
                          value: clinicalFindings.temp,
                          key: "temp",
                          color: "text-amber-500",
                          unit: "°F",
                        },
                        {
                          label: "SpO₂ Level",
                          placeholder: "98",
                          value: clinicalFindings.spo2,
                          key: "spo2",
                          color: "text-blue-500",
                          unit: "%",
                        },
                        {
                          label: "Weight",
                          placeholder: "70",
                          value: clinicalFindings.weight,
                          key: "weight",
                          color: "text-purple-500",
                          unit: "kg",
                        },
                        {
                          label: "Height",
                          placeholder: "170",
                          value: clinicalFindings.height,
                          key: "height",
                          color: "text-teal-500",
                          unit: "cm",
                        },
                      ].map((v) => (
                        <div key={v.key} className="space-y-1">
                          <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                            <Activity className={cn("w-3 h-3", v.color)} /> {v.label}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              className={cn(
                                "w-full text-lg font-black outline-none border-b-2 border-transparent focus:border-gray-100 transition-all placeholder:text-gray-200 pb-1",
                                v.color
                              )}
                              placeholder={v.placeholder}
                              value={v.value}
                              onChange={(e) =>
                                setClinicalFindings({ ...clinicalFindings, [v.key]: e.target.value })
                              }
                            />
                            <span className="absolute right-0 bottom-1 text-[9px] font-bold text-gray-300">
                              {v.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ─── Diagnosis & Clinical Notes ─── */}
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                        Diagnosis & Clinical Impressions
                      </h3>
                    </div>
                    <textarea
                      className="w-full h-44 p-6 bg-gray-50 border-none rounded-2xl text-sm font-medium text-gray-700 outline-none resize-none placeholder:text-gray-300 leading-relaxed focus:ring-4 focus:ring-primary/5 transition-all"
                      placeholder="Summarize patient symptoms, observations, clinical findings, and preliminary diagnosis...&#10;&#10;Example:&#10;• Chief Complaint: Persistent dry cough for 2 weeks&#10;• Physical Examination: Chest clear, no wheezing&#10;• Diagnosis: Acute bronchitis, likely viral&#10;• Plan: Symptomatic management, follow-up in 5 days if no improvement"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        Append-only record • All changes are versioned
                      </p>
                      <p className="text-[10px] font-bold text-gray-300">
                        {notes.length} characters
                      </p>
                    </div>
                  </div>

                  {/* ─── Prescription Builder ─── */}
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <Pill className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                        Prescribed Medication
                      </h3>
                    </div>

                    {/* Medicine Search */}
                    <div className="mb-6">
                      <MedicineSearch
                        onSelect={handleAddMedicine}
                        selectedMedicines={medicines}
                        onRemove={handleRemoveMedicine}
                      />
                    </div>

                    {/* Manual Medicine Entry */}
                    {medicines.map((med, idx) => (
                      <div
                        key={med.id || idx}
                        className="flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-2xl mb-3 group transition-all hover:bg-emerald-50 border border-transparent hover:border-emerald-100"
                      >
                        <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[9px] font-black text-emerald-600 shadow-sm flex-shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <input
                          type="text"
                          className="flex-1 min-w-[120px] bg-white border-none h-10 px-3 rounded-xl text-xs font-bold outline-none"
                          placeholder="Medicine name"
                          value={med.name}
                          onChange={(e) => handleUpdateMedicine(idx, "name", e.target.value)}
                        />
                        <input
                          type="text"
                          className="w-24 bg-white border-none h-10 px-3 rounded-xl text-xs font-bold outline-none"
                          placeholder="Dosage"
                          value={med.dosage}
                          onChange={(e) => handleUpdateMedicine(idx, "dosage", e.target.value)}
                        />
                        <select
                          className="w-20 bg-white border-none h-10 px-2 rounded-xl text-xs font-bold outline-none text-gray-600"
                          value={med.frequency || "BD"}
                          onChange={(e) => handleUpdateMedicine(idx, "frequency", e.target.value)}
                        >
                          <option value="OD">OD</option>
                          <option value="BD">BD</option>
                          <option value="TID">TID</option>
                          <option value="QID">QID</option>
                          <option value="SOS">SOS</option>
                          <option value="HS">HS</option>
                        </select>
                        <input
                          type="text"
                          className="w-24 bg-white border-none h-10 px-3 rounded-xl text-xs font-bold outline-none"
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) => handleUpdateMedicine(idx, "duration", e.target.value)}
                        />
                        <input
                          type="text"
                          className="w-28 bg-white border-none h-10 px-3 rounded-xl text-xs font-medium outline-none italic"
                          placeholder="Instructions"
                          value={med.instructions || ""}
                          onChange={(e) => handleUpdateMedicine(idx, "instructions", e.target.value)}
                        />
                        <button
                          onClick={() => handleRemoveMedicine(idx)}
                          className="p-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    {/* Quick Add Row */}
                    {medicines.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-xs font-medium text-gray-400 italic">
                          Search for medicines above or add them manually using the fields below
                        </p>
                      </div>
                    )}

                    {/* Manual Add Button */}
                    <button
                      onClick={() =>
                        handleAddMedicine({
                          name: "",
                          dosage: "",
                          duration: "",
                          frequency: "BD",
                          instructions: "",
                        })
                      }
                      className="mt-3 w-full h-12 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Medicine Manually
                    </button>
                  </div>

                  {/* ─── File Upload Section ─── */}
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Upload className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                        Reports & Attachments
                      </h3>
                    </div>

                    <FileUploader
                      files={uploadedFiles}
                      onFilesChange={handleFilesChange}
                      onRemove={handleRemoveFile}
                      isUploading={isUploading}
                      reportType={reportType}
                      onReportTypeChange={setReportType}
                    />
                  </div>

                  {/* ─── Save Button ─── */}
                  <div className="flex items-center justify-between bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Records are append-only • No destructive edits
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNotes("");
                          setMedicines([]);
                          setClinicalFindings({
                            bp: "",
                            pulse: "",
                            temp: "",
                            spo2: "",
                            weight: "",
                            height: "",
                          });
                          setUploadedFiles([]);
                        }}
                        className="h-14 px-8 rounded-2xl border-gray-200 text-gray-500 font-bold"
                      >
                        Clear Draft
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={
                          isSubmitting ||
                          (!notes.trim() && medicines.length === 0 && uploadedFiles.length === 0)
                        }
                        className="h-14 px-12 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm font-black"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                          <>
                            <Save className="w-5 h-5" /> Persist Record
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* ─── Last Saved Confirmation ─── */}
                  {lastSaved && (
                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-black text-emerald-700">
                          Record saved successfully
                        </p>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          {new Date(lastSaved.timestamp).toLocaleString("en-IN")} • ID:{" "}
                          {lastSaved.prescription?.id || "N/A"} • Immutable
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          lastSaved.prescription && setPrintPrescription(lastSaved.prescription)
                        }
                        className="h-10 px-4 bg-white text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Printer className="w-4 h-4" /> Print
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeView === "prescriptions" && (
                <motion.div
                  key="prescriptions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PrescriptionsTab selectedPatient={selectedPatient} showToast={showToast} />
                </motion.div>
              )}

              {activeView === "labReports" && (
                <motion.div
                  key="labReports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <LabReportsTab selectedPatient={selectedPatient} showToast={showToast} />
                </motion.div>
              )}

              {activeView === "uploadReports" && (
                <motion.div
                  key="uploadReports"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <UploadReportsTab selectedPatient={selectedPatient} showToast={showToast} />
                </motion.div>
              )}

              {activeView === "history" && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PatientMedicalHistory patient={selectedPatient} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ─── Print Modal ─── */}
      {printPrescription && (
        <PrescriptionPrint
          prescription={printPrescription}
          patient={selectedPatient}
          doctor={{
            name:
              JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Current",
            specializations:
              JSON.parse(localStorage.getItem("medico_session") || "{}")?.specializations ||
              "General Practitioner",
          }}
          onClose={() => setPrintPrescription(null)}
        />
      )}

      {/* ─── Right Sidebar: Clinical Profile Panel ─── */}
      <ClinicalProfilePanel
        patient={selectedPatient}
        appointment={
          selectedPatient?.appointmentDate
            ? {
              date: selectedPatient.appointmentDate,
              time: selectedPatient.appointmentTime || "N/A",
              type: selectedPatient.appointmentType || "Consultation",
              doctorName: selectedPatient.doctorName || null,
              doctorSpecialty: selectedPatient.doctorSpecialty || null,
            }
            : null
        }
        isOpen={isProfileOpen}
        onToggle={setIsProfileOpen}
      />
    </div>
  );
}
