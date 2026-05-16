import { useState, useEffect, useCallback } from "react";
import {
   User,
   History,
   Clipboard,
   Pill,
   Upload,
   Save,
   Plus,
   Trash2,
   FileText,
   Search,
   Activity,
   Calendar,
   Layers,
   AlertCircle,
   CheckCircle2,
   Loader2,
   ChevronDown,
   X,
   Stethoscope,
   Heart,
   Thermometer,
   Weight,
   Ruler,
} from "lucide-react";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";
import {
   prescriptionService,
   medicalRecordService,
   patientService,
   appointmentService,
} from "../services/emrService";

// ==================== Toast Component ====================
const Toast = ({ message, type, onClose }) => {
   useEffect(() => {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
   }, [onClose]);

   return (
      <div
         className={cn(
            "fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl animate-slide-in font-bold text-sm",
            type === "success" && "bg-emerald-50 text-emerald-800 border border-emerald-200",
            type === "error" && "bg-red-50 text-red-800 border border-red-200"
         )}
      >
         {type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
         {message}
         <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100">
            <X className="w-4 h-4" />
         </button>
      </div>
   );
};

// ==================== Patient Selector Modal ====================
const PatientSelector = ({ isOpen, onClose, onSelect }) => {
   const [search, setSearch] = useState("");
   const [patients, setPatients] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!isOpen) return;
      const fetchPatients = async () => {
         setLoading(true);
         try {
            const res = await patientService.getPatients({ search, limit: 20 });
            setPatients(res.data?.patients || []);
         } catch (err) {
            console.error("Failed to fetch patients:", err);
         } finally {
            setLoading(false);
         }
      };
      const debounce = setTimeout(fetchPatients, 300);
      return () => clearTimeout(debounce);
   }, [search, isOpen]);

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
         <div className="bg-white rounded-[3rem] p-8 w-full max-w-lg shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-[#06402B]">Select Patient</h2>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X className="w-5 h-5" />
               </button>
            </div>
            <div className="relative mb-4">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                  type="text"
                  placeholder="Search by name, ID, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
               />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
               {loading ? (
                  <div className="flex justify-center py-8">
                     <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
               ) : patients.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 font-medium">No patients found</p>
               ) : (
                  patients.map((p) => (
                     <button
                        key={p.id}
                        onClick={() => onSelect(p)}
                        className="w-full text-left p-4 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center gap-4"
                     >
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold">
                           {p.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900">{p.name}</p>
                           <p className="text-xs text-gray-400">
                              {p.patientId} · {p.age}Y · {p.gender}
                           </p>
                        </div>
                     </button>
                  ))
               )}
            </div>
         </div>
      </div>
   );
};

// ==================== Main EMR Component ====================
export default function EMR() {
   // State
   const [selectedPatient, setSelectedPatient] = useState(null);
   const [patientHistory, setPatientHistory] = useState(null);
   const [showPatientSelector, setShowPatientSelector] = useState(false);
   const [loading, setLoading] = useState(false);
   const [saving, setSaving] = useState(false);
   const [toast, setToast] = useState(null);
   const [activeTab, setActiveTab] = useState("consultation"); // consultation | records

   // Consultation form
   const [symptoms, setSymptoms] = useState("");
   const [diagnosis, setDiagnosis] = useState("");
   const [clinicalNotes, setClinicalNotes] = useState("");
   const [treatment, setTreatment] = useState("");

   // Vital signs
   const [vitalSigns, setVitalSigns] = useState({
      bloodPressure: { systolic: "", diastolic: "" },
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
   });

   // Prescriptions
   const [medicines, setMedicines] = useState([
      { id: Date.now(), name: "", dosage: "", duration: "", instructions: "" },
   ]);
   const [followUpDate, setFollowUpDate] = useState("");

   // Medical record form
   const [recordType, setRecordType] = useState("consultation");
   const [recordTitle, setRecordTitle] = useState("");
   const [recordDescription, setRecordDescription] = useState("");
   const [recordDiagnosisPrimary, setRecordDiagnosisPrimary] = useState("");
   const [recordDiagnosisSecondary, setRecordDiagnosisSecondary] = useState([]);
   const [secondaryInput, setSecondaryInput] = useState("");
   const [isConfidential, setIsConfidential] = useState(false);

   const showToast = (message, type = "success") => {
      setToast({ message, type });
   };

   // Fetch patient history when patient is selected
   useEffect(() => {
      if (!selectedPatient) return;
      const fetchHistory = async () => {
         setLoading(true);
         try {
            const res = await medicalRecordService.getPatientMedicalHistory(selectedPatient.id);
            setPatientHistory(res.data);
         } catch (err) {
            console.error("Failed to fetch patient history:", err);
         } finally {
            setLoading(false);
         }
      };
      fetchHistory();
   }, [selectedPatient]);

   // Medicine management
   const addMedicine = () => {
      setMedicines([
         ...medicines,
         { id: Date.now(), name: "", dosage: "", duration: "", instructions: "" },
      ]);
   };

   const removeMedicine = (id) => {
      if (medicines.length <= 1) return;
      setMedicines(medicines.filter((m) => m.id !== id));
   };

   const updateMedicine = (id, field, value) => {
      setMedicines(medicines.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
   };

   // Secondary diagnosis management
   const addSecondaryDiagnosis = () => {
      if (secondaryInput.trim() && !recordDiagnosisSecondary.includes(secondaryInput.trim())) {
         setRecordDiagnosisSecondary([...recordDiagnosisSecondary, secondaryInput.trim()]);
         setSecondaryInput("");
      }
   };

   const removeSecondaryDiagnosis = (index) => {
      setRecordDiagnosisSecondary(recordDiagnosisSecondary.filter((_, i) => i !== index));
   };

   // Save consultation (prescription + medical record)
   const handleSaveConsultation = async () => {
      if (!selectedPatient) {
         showToast("Please select a patient first", "error");
         return;
      }

      if (!diagnosis.trim()) {
         showToast("Diagnosis is required", "error");
         return;
      }

      setSaving(true);
      try {
         // Create prescription
         const validMedicines = medicines.filter((m) => m.name.trim() && m.dosage.trim() && m.duration.trim());

         const prescriptionData = {
            patient: selectedPatient.id,
            doctor: "doctor-1", // Current logged-in doctor
            appointment: patientHistory?.appointments?.[0]?.id || "appt-1",
            diagnosis,
            symptoms: symptoms
               .split(",")
               .map((s) => s.trim())
               .filter(Boolean),
            medicines: validMedicines,
            notes: clinicalNotes,
            vitalSigns: {
               bloodPressure: {
                  systolic: parseInt(vitalSigns.bloodPressure.systolic) || undefined,
                  diastolic: parseInt(vitalSigns.bloodPressure.diastolic) || undefined,
               },
               heartRate: parseInt(vitalSigns.heartRate) || undefined,
               temperature: parseFloat(vitalSigns.temperature) || undefined,
               weight: parseFloat(vitalSigns.weight) || undefined,
               height: parseFloat(vitalSigns.height) || undefined,
            },
            followUpDate: followUpDate || undefined,
         };

         await prescriptionService.createPrescription(prescriptionData);

         // Create medical record
         const recordData = {
            patient: selectedPatient.id,
            doctor: "doctor-1",
            appointment: patientHistory?.appointments?.[0]?.id || "appt-1",
            recordType,
            title: recordTitle || `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} - ${selectedPatient.name}`,
            description: recordDescription || diagnosis,
            clinicalNotes: clinicalNotes,
            diagnosis: {
               primary: recordDiagnosisPrimary || diagnosis,
               secondary: recordDiagnosisSecondary,
            },
            treatment: treatment || "",
            isConfidential,
         };

         await medicalRecordService.createMedicalRecord(recordData);

         showToast("Consultation saved successfully!");

         // Refresh history
         const res = await medicalRecordService.getPatientMedicalHistory(selectedPatient.id);
         setPatientHistory(res.data);

         // Reset forms
         resetForms();
      } catch (err) {
         showToast(err.message || "Failed to save consultation", "error");
      } finally {
         setSaving(false);
      }
   };

   const resetForms = () => {
      setSymptoms("");
      setDiagnosis("");
      setClinicalNotes("");
      setTreatment("");
      setVitalSigns({
         bloodPressure: { systolic: "", diastolic: "" },
         heartRate: "",
         temperature: "",
         weight: "",
         height: "",
      });
      setMedicines([{ id: Date.now(), name: "", dosage: "", duration: "", instructions: "" }]);
      setFollowUpDate("");
      setRecordTitle("");
      setRecordDescription("");
      setRecordDiagnosisPrimary("");
      setRecordDiagnosisSecondary([]);
      setIsConfidential(false);
   };

   const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   };

   return (
      <div className="flex flex-col xl:flex-row gap-8 h-full min-h-[80vh]">
         {/* Toast */}
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

         {/* Patient Selector Modal */}
         <PatientSelector
            isOpen={showPatientSelector}
            onClose={() => setShowPatientSelector(false)}
            onSelect={(patient) => {
               setSelectedPatient(patient);
               setShowPatientSelector(false);
            }}
         />

         {/* Left Panel: Patient Summary */}
         <aside className="xl:w-80 flex-shrink-0 space-y-6">
            {/* Patient Card */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5">
               {selectedPatient ? (
                  <div className="text-center mb-6">
                     <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-700 font-black text-2xl mx-auto mb-4 border-4 border-white shadow-sm">
                        {selectedPatient.name
                           .split(" ")
                           .map((n) => n[0])
                           .join("")}
                     </div>
                     <h2 className="text-xl font-bold text-[#06402B]">{selectedPatient.name}</h2>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {selectedPatient.patientId} · {selectedPatient.age}Y · {selectedPatient.gender}
                     </p>
                  </div>
               ) : (
                  <div className="text-center mb-6">
                     <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-400 mx-auto mb-4 border-4 border-white shadow-sm">
                        <User className="w-10 h-10" />
                     </div>
                     <h2 className="text-xl font-bold text-gray-400">No Patient Selected</h2>
                     <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Search to begin</p>
                  </div>
               )}

               {selectedPatient && (
                  <div className="space-y-4 pt-6 border-t border-gray-50">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">Blood Group</span>
                        <span className="font-bold text-gray-900">{selectedPatient.bloodGroup || "N/A"}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">Phone</span>
                        <span className="font-bold text-gray-900">{selectedPatient.phone || "N/A"}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">Emergency</span>
                        <span className="font-bold text-gray-900 text-xs">{selectedPatient.emergencyContact || "N/A"}</span>
                     </div>
                  </div>
               )}

               <button
                  onClick={() => setShowPatientSelector(true)}
                  className="w-full mt-6 py-3 text-xs font-bold text-emerald-600 border border-emerald-50 bg-emerald-50/20 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
               >
                  <Search className="w-4 h-4" />
                  {selectedPatient ? "Change Patient" : "Select Patient"}
               </button>
            </div>

            {/* Medical History */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
               <div className="flex items-center gap-3 mb-6">
                  <History className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
               </div>

               {loading ? (
                  <div className="flex justify-center py-8">
                     <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
               ) : !selectedPatient ? (
                  <p className="text-center text-gray-400 py-8 text-sm font-medium">Select a patient to view history</p>
               ) : patientHistory?.prescriptions?.length === 0 && patientHistory?.medicalRecords?.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm font-medium">No previous records</p>
               ) : (
                  <div className="space-y-4">
                     {patientHistory?.prescriptions?.slice(0, 5).map((p, i) => (
                        <div key={p.id || i} className="pl-4 border-l-2 border-emerald-100 py-1">
                           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                              {formatDate(p.createdAt)}
                           </p>
                           <p className="text-xs font-bold text-gray-600 truncate">{p.diagnosis}</p>
                           <p className="text-[10px] text-gray-400">
                              {p.medicines?.length || 0} medicine{(p.medicines?.length || 0) !== 1 ? "s" : ""} prescribed
                           </p>
                        </div>
                     ))}
                     {patientHistory?.medicalRecords?.slice(0, 3).map((r, i) => (
                        <div key={r.id || `mr-${i}`} className="pl-4 border-l-2 border-blue-100 py-1">
                           <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                              {formatDate(r.createdAt)}
                           </p>
                           <p className="text-xs font-bold text-gray-600 truncate">{r.title}</p>
                           <p className="text-[10px] text-gray-400 capitalize">{r.recordType?.replace("_", " ")}</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </aside>

         {/* Center Panel: Consultation Notes */}
         <main className="flex-1 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Clipboard className="w-5 h-5" />
                     </div>
                     <h2 className="text-2xl font-bold text-[#06402B] tracking-tight">Active Consultation</h2>
                  </div>
                  <div className="flex gap-2">
                     <button
                        onClick={() => setActiveTab("consultation")}
                        className={cn(
                           "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                           activeTab === "consultation"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                        )}
                     >
                        Consultation
                     </button>
                     <button
                        onClick={() => setActiveTab("records")}
                        className={cn(
                           "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                           activeTab === "records"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-50 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600"
                        )}
                     >
                        Medical Record
                     </button>
                  </div>
               </div>

               {activeTab === "consultation" && (
                  <div className="space-y-6 flex-1">
                     {/* Vital Signs */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">
                           Vital Signs
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                           <div className="relative">
                              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 placeholder="Systolic"
                                 value={vitalSigns.bloodPressure.systolic}
                                 onChange={(e) =>
                                    setVitalSigns({
                                       ...vitalSigns,
                                       bloodPressure: { ...vitalSigns.bloodPressure, systolic: e.target.value },
                                    })
                                 }
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                           <div className="relative">
                              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 placeholder="Diastolic"
                                 value={vitalSigns.bloodPressure.diastolic}
                                 onChange={(e) =>
                                    setVitalSigns({
                                       ...vitalSigns,
                                       bloodPressure: { ...vitalSigns.bloodPressure, diastolic: e.target.value },
                                    })
                                 }
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                           <div className="relative">
                              <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 placeholder="HR (bpm)"
                                 value={vitalSigns.heartRate}
                                 onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                           <div className="relative">
                              <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 step="0.1"
                                 placeholder="Temp (°F)"
                                 value={vitalSigns.temperature}
                                 onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                           <div className="relative">
                              <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 placeholder="Weight (kg)"
                                 value={vitalSigns.weight}
                                 onChange={(e) => setVitalSigns({ ...vitalSigns, weight: e.target.value })}
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                           <div className="relative">
                              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                              <input
                                 type="number"
                                 placeholder="Height (cm)"
                                 value={vitalSigns.height}
                                 onChange={(e) => setVitalSigns({ ...vitalSigns, height: e.target.value })}
                                 className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                           </div>
                        </div>
                     </div>

                     {/* Symptoms */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Symptoms & Complaints
                        </label>
                        <textarea
                           placeholder="Describe patient symptoms... (comma-separated)"
                           value={symptoms}
                           onChange={(e) => setSymptoms(e.target.value)}
                           className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none italic text-gray-600"
                        />
                     </div>

                     {/* Diagnosis */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Diagnosis <span className="text-red-400">*</span>
                        </label>
                        <textarea
                           placeholder="Enter primary diagnosis..."
                           value={diagnosis}
                           onChange={(e) => setDiagnosis(e.target.value)}
                           className="w-full h-28 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        />
                     </div>

                     {/* Clinical Notes */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Clinical Notes
                        </label>
                        <textarea
                           placeholder="Enter detailed clinical findings..."
                           value={clinicalNotes}
                           onChange={(e) => setClinicalNotes(e.target.value)}
                           className="w-full min-h-[120px] p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        />
                     </div>

                     {/* Follow-up Date */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Follow-up Date
                        </label>
                        <div className="relative">
                           <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                           <input
                              type="date"
                              value={followUpDate}
                              onChange={(e) => setFollowUpDate(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                           />
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-50">
                        <button
                           onClick={resetForms}
                           className="flex-1 h-14 bg-gray-50 text-gray-500 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                        >
                           <X className="w-5 h-5" /> Clear Form
                        </button>
                        <button
                           onClick={handleSaveConsultation}
                           disabled={saving || !selectedPatient}
                           className="flex-1 h-14 bg-[#06402B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                           {saving ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                           ) : (
                              <Save className="w-5 h-5" />
                           )}
                           {saving ? "Saving..." : "Finalize Consultation"}
                        </button>
                     </div>
                  </div>
               )}

               {activeTab === "records" && (
                  <div className="space-y-6 flex-1">
                     {/* Record Type */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Record Type
                        </label>
                        <select
                           value={recordType}
                           onChange={(e) => setRecordType(e.target.value)}
                           className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                           <option value="consultation">Consultation</option>
                           <option value="lab_report">Lab Report</option>
                           <option value="imaging">Imaging</option>
                           <option value="discharge_summary">Discharge Summary</option>
                           <option value="follow_up">Follow Up</option>
                        </select>
                     </div>

                     {/* Title */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Title <span className="text-red-400">*</span>
                        </label>
                        <input
                           type="text"
                           placeholder="Record title..."
                           value={recordTitle}
                           onChange={(e) => setRecordTitle(e.target.value)}
                           className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                     </div>

                     {/* Description */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Description <span className="text-red-400">*</span>
                        </label>
                        <textarea
                           placeholder="Describe the medical record..."
                           value={recordDescription}
                           onChange={(e) => setRecordDescription(e.target.value)}
                           className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        />
                     </div>

                     {/* Primary Diagnosis */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Primary Diagnosis
                        </label>
                        <input
                           type="text"
                           placeholder="Primary diagnosis..."
                           value={recordDiagnosisPrimary}
                           onChange={(e) => setRecordDiagnosisPrimary(e.target.value)}
                           className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                     </div>

                     {/* Secondary Diagnosis */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Secondary Diagnosis
                        </label>
                        <div className="flex gap-2 mb-2">
                           <input
                              type="text"
                              placeholder="Add secondary diagnosis..."
                              value={secondaryInput}
                              onChange={(e) => setSecondaryInput(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryDiagnosis())}
                              className="flex-1 p-3 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                           />
                           <button
                              onClick={addSecondaryDiagnosis}
                              className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100"
                           >
                              Add
                           </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {recordDiagnosisSecondary.map((d, i) => (
                              <span
                                 key={i}
                                 className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold"
                              >
                                 {d}
                                 <button onClick={() => removeSecondaryDiagnosis(i)} className="hover:text-blue-900">
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           ))}
                        </div>
                     </div>

                     {/* Treatment */}
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                           Treatment Plan
                        </label>
                        <textarea
                           placeholder="Enter treatment plan..."
                           value={treatment}
                           onChange={(e) => setTreatment(e.target.value)}
                           className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                        />
                     </div>

                     {/* Confidential */}
                     <div className="flex items-center gap-3">
                        <input
                           type="checkbox"
                           checked={isConfidential}
                           onChange={(e) => setIsConfidential(e.target.checked)}
                           className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500"
                        />
                        <label className="text-sm font-bold text-gray-600">Mark as confidential</label>
                     </div>
                  </div>
               )}
            </div>
         </main>

         {/* Right Panel: Prescription Builder */}
         <aside className="xl:w-[400px] flex-shrink-0 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full bg-emerald-50/10 border-dashed border-emerald-200">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                        <Pill className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold text-[#06402B]">Prescriptions</h3>
                  </div>
                  <button
                     onClick={addMedicine}
                     className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center shadow-sm border border-emerald-100 hover:scale-110 transition-transform"
                  >
                     <Plus className="w-5 h-5" />
                  </button>
               </div>

               <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[600px] pr-2">
                  {medicines.map((med, index) => (
                     <div
                        key={med.id}
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group relative"
                     >
                        <button
                           onClick={() => removeMedicine(med.id)}
                           className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="space-y-3">
                           <input
                              type="text"
                              placeholder="Medicine Name"
                              value={med.name}
                              onChange={(e) => updateMedicine(med.id, "name", e.target.value)}
                              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-[#06402B] outline-none"
                           />
                           <div className="grid grid-cols-2 gap-2">
                              <input
                                 type="text"
                                 placeholder="Dosage (e.g. 1-0-1)"
                                 value={med.dosage}
                                 onChange={(e) => updateMedicine(med.id, "dosage", e.target.value)}
                                 className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                              />
                              <input
                                 type="text"
                                 placeholder="Duration (e.g. 5 Days)"
                                 value={med.duration}
                                 onChange={(e) => updateMedicine(med.id, "duration", e.target.value)}
                                 className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                              />
                           </div>
                           <input
                              type="text"
                              placeholder="Instructions (e.g. After meals)"
                              value={med.instructions}
                              onChange={(e) => updateMedicine(med.id, "instructions", e.target.value)}
                              className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-medium outline-none text-gray-500"
                           />
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 pt-8 border-t border-emerald-200">
                  <div className="p-4 bg-white rounded-2xl border border-emerald-100 mb-6 italic text-[10px] text-gray-400 text-center font-medium">
                     "Authorized by Medico Clinical Protocol 2.0"
                  </div>
                  <button
                     onClick={handleSaveConsultation}
                     disabled={saving || !selectedPatient}
                     className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                     {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <FileText className="w-5 h-5" />
                     )}
                     {saving ? "Saving..." : "Save & Print Prescription"}
                  </button>
               </div>
            </div>
         </aside>
      </div>
   );
}
