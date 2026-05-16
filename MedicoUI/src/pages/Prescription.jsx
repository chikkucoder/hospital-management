import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Pill,
    Search,
    FileText,
    Printer,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    User,
    ChevronDown,
    Calendar,
    Plus,
    X,
    Edit3,
    Trash2,
    Save,
    Upload,
    FlaskConical,
    Stethoscope,
    FileUp,
    CloudUpload,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { patientService } from "../services/patientService";
import { emrService } from "../services/emrService";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";
import PrescriptionPrint from "../components/emr/PrescriptionPrint";
import ClinicalProfilePanel from "../components/emr/ClinicalProfilePanel";

// ─── Constants ───────────────────────────────────────────────────
const FREQUENCY_OPTIONS = ["OD", "BD", "TID", "QID", "SOS", "HS", "Q4H", "Q6H", "Q8H", "STAT"];
const PRIORITY_OPTIONS = [
    { value: "routine", label: "Routine", color: "bg-amber-100 text-amber-700" },
    { value: "urgent", label: "Urgent", color: "bg-orange-100 text-orange-700" },
    { value: "stat", label: "STAT", color: "bg-red-100 text-red-700" },
];
const RESULT_STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];
const REPORT_TYPES = [
    "CBC (Complete Blood Count)",
    "Lipid Profile",
    "Liver Function Test",
    "Kidney Function Test",
    "Thyroid Profile",
    "HbA1c",
    "Blood Sugar (Fasting/PP)",
    "Urine Analysis",
    "X-Ray",
    "MRI",
    "CT Scan",
    "Ultrasound",
    "ECG",
    "Other",
];

// ─── Reusable Form Field ─────────────────────────────────────────
function FormField({ label, children, required, error }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                {label}
                {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {error}
                </p>
            )}
        </div>
    );
}

// ─── Add Medicine Modal ──────────────────────────────────────────
function AddMedicineModal({ isOpen, onClose, onAdd, editingMedicine, onUpdate, editIndex }) {
    const initialForm = editingMedicine
        ? {
            name: editingMedicine.name || "",
            dosage: editingMedicine.dosage || "",
            frequency: editingMedicine.frequency || "BD",
            duration: editingMedicine.duration || "",
            instructions: editingMedicine.instructions || "",
        }
        : { name: "", dosage: "", frequency: "BD", duration: "", instructions: "" };

    const [form, setForm] = useState(initialForm);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const debounceRef = useRef(null);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (value) => {
        setSearchQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) {
            setSearchResults([]);
            setSearchOpen(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            const data = await emrService.searchMedicines(value);
            setSearchResults(data);
            setSearchOpen(true);
        }, 250);
    };

    const selectMedicine = (med) => {
        setForm({
            name: med.name,
            dosage: med.defaultDosage || "",
            frequency: "BD",
            duration: med.defaultDuration || "",
            instructions: "",
        });
        setSearchQuery("");
        setSearchResults([]);
        setSearchOpen(false);
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Medicine name is required";
        if (!form.dosage.trim()) errs.dosage = "Dosage is required";
        if (!form.duration.trim()) errs.duration = "Duration is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (editingMedicine && onUpdate) {
            onUpdate(editIndex, form);
        } else {
            onAdd({ ...form, id: Date.now().toString() });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Pill className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-primary-dark tracking-tight">
                                {editingMedicine ? "Edit Medicine" : "Add Medicine"}
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                        {/* Medicine Search */}
                        <div ref={searchContainerRef} className="relative">
                            <FormField label="Search Medicine Catalog">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                                        placeholder="Type to search medicines..."
                                        className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </FormField>
                            {searchOpen && searchResults.length > 0 && (
                                <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden max-h-48 overflow-y-auto">
                                    {searchResults.map((med, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectMedicine(med)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <Pill className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{med.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    {med.category} • {med.defaultDosage}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Medicine Name */}
                        <FormField label="Medicine Name" required error={errors.name}>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., Paracetamol 500mg"
                                className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                            />
                        </FormField>

                        {/* Dosage & Frequency Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Dosage" required error={errors.dosage}>
                                <input
                                    type="text"
                                    value={form.dosage}
                                    onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                    placeholder="e.g., 500mg"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                />
                            </FormField>
                            <FormField label="Frequency" required>
                                <select
                                    value={form.frequency}
                                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-700"
                                >
                                    {FREQUENCY_OPTIONS.map((f) => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </FormField>
                        </div>

                        {/* Duration & Instructions Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Duration" required error={errors.duration}>
                                <input
                                    type="text"
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                    placeholder="e.g., 7 days"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                />
                            </FormField>
                            <FormField label="Instructions">
                                <input
                                    type="text"
                                    value={form.instructions}
                                    onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                                    placeholder="e.g., After meals"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium italic outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="h-11 px-6 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="h-11 px-8 bg-primary text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                        >
                            {editingMedicine ? (
                                <><Save className="w-4 h-4" /> Update</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Add Medicine</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Main Prescription Page ──────────────────────────────────────
export default function Prescription() {
    const { patientId } = useParams();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [patientDropdownOpen, setPatientDropdownOpen] = useState(false);
    const [patientSearch, setPatientSearch] = useState("");
    const [toast, setToast] = useState(null);
    const patientDropdownRef = useRef(null);

    // Diagnosis & Impressions
    const [diagnosis, setDiagnosis] = useState("");
    const MAX_DIAGNOSIS_CHARS = 2000;

    // Prescribed Medication — Mock Data
    const MOCK_MEDICINES = [
        { id: "med-1", name: "Amoxicillin 500mg", dosage: "500mg", frequency: "TID", duration: "7 days", instructions: "After meals" },
        { id: "med-2", name: "Paracetamol 650mg", dosage: "650mg", frequency: "SOS", duration: "5 days", instructions: "For fever > 100°F" },
        { id: "med-3", name: "Cetirizine 10mg", dosage: "10mg", frequency: "HS", duration: "14 days", instructions: "At bedtime" },
        { id: "med-4", name: "Omeprazole 20mg", dosage: "20mg", frequency: "BD", duration: "30 days", instructions: "Before meals" },
    ];
    const [medicines, setMedicines] = useState(MOCK_MEDICINES);
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [medicineSearch, setMedicineSearch] = useState("");

    // Reports & Media — Mock Data
    const MOCK_LAB_REPORTS = [
        { id: "lab-1", reportName: "Complete Blood Picture", testDate: "2026-05-20", resultStatus: "Pending", priority: "routine", findings: "" },
        { id: "lab-2", reportName: "Lipid Profile", testDate: "2026-05-18", resultStatus: "Completed", priority: "urgent", findings: "Total Cholesterol: 210 mg/dL, LDL: 140 mg/dL, HDL: 45 mg/dL" },
        { id: "lab-3", reportName: "HbA1c", testDate: "2026-05-22", resultStatus: "In Progress", priority: "routine", findings: "" },
    ];
    const [labReports, setLabReports] = useState(MOCK_LAB_REPORTS);
    const [reportSearch, setReportSearch] = useState("");

    // Section 4: Issue Lab Report
    const [labForm, setLabForm] = useState({
        reportName: "",
        testDate: new Date().toISOString().split("T")[0],
        resultStatus: "Pending",
        findings: "",
        priority: "routine",
    });
    const [labFile, setLabFile] = useState(null);
    const [labFormErrors, setLabFormErrors] = useState({});
    const [savingLab, setSavingLab] = useState(false);

    // Submission
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Print
    const [printPrescription, setPrintPrescription] = useState(null);

    // ─── Effects ─────────────────────────────────────────────
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const p = await patientService.getAll();
                const list = Array.isArray(p) ? p : [];
                setPatients(list);
                // Auto-select first patient if none selected (for clinical profile sidebar)
                if (list.length > 0 && !selectedPatient) {
                    setSelectedPatient(list[0]);
                }
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Auto-select patient from URL param (overrides first-patient auto-select)
    useEffect(() => {
        if (patientId && patients.length > 0) {
            const found = patients.find(
                (p) => (p.patientId || p.id || p._id) === patientId
            );
            if (found && (!selectedPatient || (selectedPatient.patientId || selectedPatient.id || selectedPatient._id) !== patientId)) {
                setSelectedPatient(found);
            }
        }
    }, [patientId, patients, selectedPatient]);

    // Click outside patient dropdown
    useEffect(() => {
        function handleClickOutside(e) {
            if (patientDropdownRef.current && !patientDropdownRef.current.contains(e.target)) {
                setPatientDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ─── Medicine Handlers ──────────────────────────────────
    const handleAddMedicine = (med) => {
        setMedicines([...medicines, med]);
    };

    const handleEditMedicine = (idx) => {
        setEditingMedicine(medicines[idx]);
        setEditingIndex(idx);
        setShowMedicineModal(true);
    };

    const handleUpdateMedicine = (idx, updated) => {
        const updatedMeds = [...medicines];
        updatedMeds[idx] = { ...updatedMeds[idx], ...updated };
        setMedicines(updatedMeds);
    };

    const handleDeleteMedicine = (idx) => {
        setMedicines(medicines.filter((_, i) => i !== idx));
    };

    const openAddModal = () => {
        setEditingMedicine(null);
        setEditingIndex(null);
        setShowMedicineModal(true);
    };

    // ─── Lab Report Handlers ────────────────────────────────
    const handleDeleteLabReport = (idx) => {
        setLabReports(labReports.filter((_, i) => i !== idx));
    };

    const handleEditLabReport = (idx) => {
        const report = labReports[idx];
        setLabForm({
            reportName: report.reportName || "",
            testDate: report.testDate || new Date().toISOString().split("T")[0],
            resultStatus: report.resultStatus || "Pending",
            findings: report.findings || "",
            priority: report.priority || "routine",
        });
        setLabFile(null);
        // Scroll to section 4
        document.getElementById("section-issue-lab")?.scrollIntoView({ behavior: "smooth" });
    };

    const validateLabForm = () => {
        const errs = {};
        if (!labForm.reportName.trim()) errs.reportName = "Report/Test name is required";
        if (!labForm.testDate) errs.testDate = "Test date is required";
        setLabFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleIssueLabReport = async () => {
        if (!validateLabForm()) return;
        setSavingLab(true);
        try {
            const reportData = {
                patientId: selectedPatient?.patientId || selectedPatient?.id,
                reportName: labForm.reportName,
                testDate: labForm.testDate,
                resultStatus: labForm.resultStatus,
                findings: labForm.findings,
                priority: labForm.priority,
                file: labFile ? labFile.name : null,
            };
            setLabReports([...labReports, { ...reportData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
            showToast("Lab report issued successfully!", "success");
            // Reset form
            setLabForm({
                reportName: "",
                testDate: new Date().toISOString().split("T")[0],
                resultStatus: "Pending",
                findings: "",
                priority: "routine",
            });
            setLabFile(null);
            setLabFormErrors({});
        } catch (err) {
            console.error("Failed to issue lab report:", err);
            showToast("Failed to issue lab report.", "error");
        } finally {
            setSavingLab(false);
        }
    };

    // ─── Submit Prescription ────────────────────────────────
    const handleSubmitPrescription = async () => {
        if (!selectedPatient) {
            showToast("Please select a patient first.", "error");
            return;
        }
        if (!diagnosis.trim() && medicines.length === 0 && labReports.length === 0) {
            showToast("Please add diagnosis notes, medicines, or lab reports before submitting.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const doctorName =
                JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Current";

            const result = await emrService.saveConsultation({
                patientId: selectedPatient.patientId || selectedPatient.id,
                appointmentId: selectedPatient.appointmentId || null,
                notes: diagnosis,
                medicines,
                vitals: {},
                files: [],
                doctorName,
            });

            setPrintPrescription({
                ...result.prescription,
                patientName: selectedPatient.name,
                labReports,
            });

            showToast("Prescription submitted successfully!", "success");

            // Reset form
            setDiagnosis("");
            setMedicines([]);
            setLabReports([]);
        } catch (err) {
            console.error("Submit failed:", err);
            showToast("Failed to submit prescription. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Helpers ────────────────────────────────────────────
    const filteredPatients = patients.filter(
        (p) =>
            p?.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
            (p?.patientId && p.patientId.toLowerCase().includes(patientSearch.toLowerCase()))
    );

    const filteredMedicines = medicines.filter((m) =>
        m.name?.toLowerCase().includes(medicineSearch.toLowerCase()) ||
        m.dosage?.toLowerCase().includes(medicineSearch.toLowerCase())
    );

    const filteredReports = labReports.filter((r) =>
        r.reportName?.toLowerCase().includes(reportSearch.toLowerCase())
    );

    const getInitials = (name) =>
        (name || "")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getPriorityBadge = (priority) => {
        const p = PRIORITY_OPTIONS.find((o) => o.value === priority) || PRIORITY_OPTIONS[0];
        return (
            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest", p.color)}>
                {p.label}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const colors = {
            Pending: "bg-amber-50 text-amber-700 border-amber-200",
            "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
            Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            Cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        return (
            <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border", colors[status] || colors.Pending)}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
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

            {/* ─── Left Main Content ─── */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
                >
                    {/* ═══════════ Page Header ═══════════ */}
                    <div className="px-8 pt-8 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">
                                Add Prescription
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    if (!diagnosis.trim() && medicines.length === 0) {
                                        showToast("Please add diagnosis or medicines before printing.", "error");
                                        return;
                                    }
                                    setPrintPrescription({
                                        id: `RX-DRAFT-${Date.now().toString(36).toUpperCase()}`,
                                        patientId: selectedPatient?.patientId || selectedPatient?.id,
                                        patientName: selectedPatient?.name,
                                        notes: diagnosis,
                                        medicines,
                                        labReports,
                                        doctorName: JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Current",
                                        createdAt: new Date().toISOString(),
                                    });
                                }}
                                className="h-11 px-5 bg-white border-2 border-gray-200 text-gray-600 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <Printer className="w-4 h-4" /> Print
                            </button>
                            <button
                                onClick={handleSubmitPrescription}
                                disabled={isSubmitting || (!diagnosis.trim() && medicines.length === 0 && labReports.length === 0)}
                                className="h-11 px-6 bg-[#0F6B4B] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-[#0F6B4B]/20 hover:bg-[#0a5a3d] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                                Submit Prescription
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* ═══════════ Section 1: Diagnosis & Impressions ═══════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="border border-[#E5E7EB] rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B]">
                                    <Stethoscope className="w-4 h-4" />
                                </div>
                                <h3 className="text-base font-black text-[#0F6B4B] tracking-tight">
                                    Diagnosis & Impressions
                                </h3>
                            </div>
                            <textarea
                                className="w-full h-44 p-5 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] outline-none resize-none placeholder:text-[#6B7280] leading-relaxed focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 transition-all"
                                placeholder="Enter diagnosis and clinical impressions..."
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                maxLength={MAX_DIAGNOSIS_CHARS}
                            />
                            <div className="flex items-center justify-end mt-3">
                                <p className={cn(
                                    "text-[11px] font-bold transition-colors",
                                    diagnosis.length > MAX_DIAGNOSIS_CHARS * 0.9
                                        ? "text-red-500"
                                        : diagnosis.length > MAX_DIAGNOSIS_CHARS * 0.7
                                            ? "text-amber-500"
                                            : "text-[#6B7280]"
                                )}>
                                    {diagnosis.length} / {MAX_DIAGNOSIS_CHARS} characters
                                </p>
                            </div>
                        </motion.div>

                        {/* ═══════════ Section 2: Prescribed Medication ═══════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="border border-[#E5E7EB] rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B]">
                                        <Pill className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-black text-[#0F6B4B] tracking-tight">
                                        Prescribed Medication
                                    </h3>
                                </div>
                                <button
                                    onClick={openAddModal}
                                    className="h-10 px-4 bg-[#0F6B4B] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-[#0F6B4B]/15 hover:bg-[#0a5a3d] hover:scale-105 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add New Medicine
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-5">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                                <input
                                    type="text"
                                    value={medicineSearch}
                                    onChange={(e) => setMedicineSearch(e.target.value)}
                                    placeholder="Search medicines by name, brand or composition..."
                                    className="w-full h-11 pl-11 pr-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 transition-all placeholder:text-[#6B7280]"
                                />
                            </div>

                            {/* Medicines Table */}
                            {medicines.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-2xl">
                                    <Pill className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                                    <p className="text-sm font-medium text-[#6B7280]">No medicines prescribed yet</p>
                                    <p className="text-[10px] font-bold text-[#6B7280]/60 uppercase tracking-widest mt-1">
                                        Click 'Add New Medicine' to begin prescribing
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-[#F7F9F8]">
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest rounded-l-xl">Medicine / Composition</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Dosage</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Frequency</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Duration</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Instructions</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest rounded-r-xl">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredMedicines.map((med, idx) => (
                                                <tr key={med.id || idx} className="group hover:bg-[#EAF7F0]/30 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <Pill className="w-4 h-4 text-[#0F6B4B] flex-shrink-0" />
                                                            <div>
                                                                <span className="text-sm font-bold text-[#1F2937]">{med.name}</span>
                                                                <p className="text-[10px] font-medium text-[#6B7280]">Tablet</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-xs font-bold text-[#1F2937]">{med.dosage}</td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="px-2.5 py-1 bg-[#EAF7F0] text-[#0F6B4B] rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                            {med.frequency || "BD"}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-xs font-bold text-[#1F2937]">{med.duration}</td>
                                                    <td className="py-3.5 px-4 text-xs font-medium text-[#6B7280] italic max-w-[150px] truncate">
                                                        {med.instructions || "—"}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleEditMedicine(idx)}
                                                                className="p-2 text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMedicine(idx)}
                                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Add Another Medicine Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={openAddModal}
                                    className="h-10 px-6 border-2 border-dashed border-[#E5E7EB] text-[#6B7280] rounded-xl text-xs font-bold flex items-center gap-2 hover:border-[#0F6B4B] hover:text-[#0F6B4B] hover:bg-[#EAF7F0]/50 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Another Medicine
                                </button>
                            </div>
                        </motion.div>

                        {/* ═══════════ Section 3: Prescribed Reports & Media ═══════════ */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="border border-[#E5E7EB] rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-black text-[#0F6B4B] tracking-tight">
                                        Prescribed Reports & Media
                                    </h3>
                                </div>
                                <button
                                    onClick={() => document.getElementById("section-issue-lab")?.scrollIntoView({ behavior: "smooth" })}
                                    className="h-10 px-4 bg-blue-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-600/15 hover:bg-blue-700 hover:scale-105 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add New Report
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-5">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                                <input
                                    type="text"
                                    value={reportSearch}
                                    onChange={(e) => setReportSearch(e.target.value)}
                                    placeholder="Search reports by name..."
                                    className="w-full h-11 pl-11 pr-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-[#6B7280]"
                                />
                            </div>

                            {/* Reports Table */}
                            {labReports.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-2xl">
                                    <FlaskConical className="w-10 h-10 text-[#E5E7EB] mx-auto mb-3" />
                                    <p className="text-sm font-medium text-[#6B7280]">No lab reports prescribed</p>
                                    <p className="text-[10px] font-bold text-[#6B7280]/60 uppercase tracking-widest mt-1">
                                        Click 'Add New Report' to issue a new report
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-[#F7F9F8]">
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest rounded-l-xl">Report / Investigation</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Suggested Date</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Priority</th>
                                                <th className="text-left py-3 px-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest rounded-r-xl">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredReports.map((report, idx) => (
                                                <tr key={report.id || idx} className="group hover:bg-blue-50/20 transition-colors">
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <FlaskConical className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                                            <div>
                                                                <span className="text-sm font-bold text-[#1F2937]">{report.reportName}</span>
                                                                <p className="text-[10px] font-medium text-[#6B7280]">
                                                                    {report.reportName?.includes("Blood") ? "Blood Test" : "Investigation"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-xs font-bold text-[#1F2937]">
                                                        {formatDate(report.testDate)}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        {getPriorityBadge(report.priority)}
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleEditLabReport(idx)}
                                                                className="p-2 text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLabReport(idx)}
                                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Add Another Report Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => document.getElementById("section-issue-lab")?.scrollIntoView({ behavior: "smooth" })}
                                    className="h-10 px-6 border-2 border-dashed border-[#E5E7EB] text-[#6B7280] rounded-xl text-xs font-bold flex items-center gap-2 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Another Report
                                </button>
                            </div>
                        </motion.div>

                        {/* ═══════════ Section 4: Issue Lab Report to Patient ═══════════ */}
                        <motion.div
                            id="section-issue-lab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="border-2 border-[#0F6B4B]/30 rounded-2xl p-6 bg-[#EAF7F0]/20"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-[#0F6B4B]/10 flex items-center justify-center text-[#0F6B4B]">
                                    <FlaskConical className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-[#0F6B4B] tracking-tight">
                                        Issue Lab Report to Patient
                                    </h3>
                                    <p className="text-[11px] font-medium text-[#6B7280]">
                                        Create and issue a lab report for the selected patient
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-5">
                                {/* Row 1: Report/Test, Test Date, Result Status */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField label="Report / Test" required error={labFormErrors.reportName}>
                                        <select
                                            value={labForm.reportName}
                                            onChange={(e) => setLabForm({ ...labForm, reportName: e.target.value })}
                                            className="w-full h-11 px-4 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/40 transition-all text-[#1F2937]"
                                        >
                                            <option value="">Select report type...</option>
                                            {REPORT_TYPES.map((rt) => (
                                                <option key={rt} value={rt}>{rt}</option>
                                            ))}
                                        </select>
                                    </FormField>
                                    <FormField label="Test Date" required error={labFormErrors.testDate}>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                                            <input
                                                type="date"
                                                value={labForm.testDate}
                                                onChange={(e) => setLabForm({ ...labForm, testDate: e.target.value })}
                                                className="w-full h-11 pl-11 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/40 transition-all text-[#1F2937]"
                                            />
                                        </div>
                                    </FormField>
                                    <FormField label="Result Status">
                                        <select
                                            value={labForm.resultStatus}
                                            onChange={(e) => setLabForm({ ...labForm, resultStatus: e.target.value })}
                                            className="w-full h-11 px-4 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/40 transition-all text-[#1F2937]"
                                        >
                                            {RESULT_STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </FormField>
                                </div>

                                {/* Row 2: Test Result/Findings & Attachment Upload */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField label="Test Result / Findings">
                                        <textarea
                                            value={labForm.findings}
                                            onChange={(e) => setLabForm({ ...labForm, findings: e.target.value })}
                                            placeholder="Enter test results, findings, or clinical observations..."
                                            rows={4}
                                            className="w-full p-4 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/40 transition-all placeholder:text-[#6B7280] text-[#1F2937]"
                                        />
                                    </FormField>
                                    <FormField label="Attachment">
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="lab-file-upload"
                                                accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                                                onChange={(e) => setLabFile(e.target.files[0])}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="lab-file-upload"
                                                className={cn(
                                                    "flex flex-col items-center justify-center gap-3 h-full min-h-[130px] rounded-xl border-2 border-dashed cursor-pointer transition-all p-6",
                                                    labFile
                                                        ? "border-[#0F6B4B] bg-[#EAF7F0] text-[#0F6B4B]"
                                                        : "border-[#E5E7EB] bg-[#F7F9F8] text-[#6B7280] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0]/30"
                                                )}
                                            >
                                                {labFile ? (
                                                    <>
                                                        <FileUp className="w-8 h-8" />
                                                        <span className="text-xs font-bold text-center truncate max-w-full px-2">{labFile.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => { e.preventDefault(); setLabFile(null); }}
                                                            className="text-[10px] font-bold text-red-500 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CloudUpload className="w-8 h-8" />
                                                        <div className="text-center">
                                                            <p className="text-xs font-bold">Upload files or drag & drop</p>
                                                            <p className="text-[10px] font-medium mt-1">PDF, JPG, PNG</p>
                                                        </div>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </FormField>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-2">
                                    <button
                                        onClick={handleIssueLabReport}
                                        disabled={savingLab}
                                        className="h-11 px-8 bg-[#0F6B4B] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-[#0F6B4B]/20 hover:bg-[#0a5a3d] hover:scale-105 transition-all disabled:opacity-50"
                                    >
                                        {savingLab ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Issue & Save Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* ─── Right Sidebar: Clinical Profile ─── */}
            <ClinicalProfilePanel
                patient={selectedPatient}
                isOpen={true}
                className="w-80 flex-shrink-0"
            />

            {/* ─── Add Medicine Modal ─── */}
            <AddMedicineModal
                isOpen={showMedicineModal}
                onClose={() => setShowMedicineModal(false)}
                onAdd={handleAddMedicine}
                editingMedicine={editingMedicine}
                onUpdate={handleUpdateMedicine}
                editIndex={editingIndex}
            />

            {/* ─── Print Modal ─── */}
            {printPrescription && (
                <PrescriptionPrint
                    prescription={printPrescription}
                    patient={selectedPatient}
                    doctor={{
                        name: printPrescription.doctorName || "Dr. Staff",
                        specializations:
                            JSON.parse(localStorage.getItem("medico_session") || "{}")?.specializations ||
                            "General Practitioner",
                    }}
                    onClose={() => setPrintPrescription(null)}
                />
            )}
        </div>
    );
}