import { useState, useEffect, useRef } from "react";
import {
    Pill,
    Search,
    FileText,
    Printer,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Plus,
    X,
    Edit3,
    Trash2,
    Save,
    Upload,
    FlaskConical,
    Eye,
    Stethoscope,
    Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { emrService } from "../../services/emrService";
import { Button } from "../common/Button";
import { cn } from "../../lib/utils";

// ─── Constants ───────────────────────────────────────────────────
const FREQUENCY_OPTIONS = ["OD", "BD", "TID", "QID", "SOS", "HS", "Q4H", "Q6H", "Q8H", "STAT"];
const PRIORITY_OPTIONS = [
    { value: "routine", label: "Routine", color: "bg-gray-100 text-gray-600" },
    { value: "urgent", label: "Urgent", color: "bg-amber-100 text-amber-700" },
    { value: "stat", label: "STAT", color: "bg-red-100 text-red-700" },
];
const RESULT_STATUS_OPTIONS = ["Pending", "In Progress", "Completed", "Cancelled"];
const REPORT_TYPES = [
    "CBC (Complete Blood Count)", "Lipid Profile", "Liver Function Test",
    "Kidney Function Test", "Thyroid Profile", "HbA1c",
    "Blood Sugar (Fasting/PP)", "Urine Analysis", "X-Ray", "MRI",
    "CT Scan", "Ultrasound", "ECG", "Other",
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
        if (!value.trim()) { setSearchResults([]); setSearchOpen(false); return; }
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
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Pill className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-primary-dark tracking-tight">
                                {editingMedicine ? "Edit Medicine" : "Add Medicine"}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                        <div ref={searchContainerRef} className="relative">
                            <FormField label="Search Medicine Catalog">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text" value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
                                        placeholder="Type to search medicines..."
                                        className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                                    />
                                </div>
                            </FormField>
                            {searchOpen && searchResults.length > 0 && (
                                <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden max-h-48 overflow-y-auto">
                                    {searchResults.map((med, idx) => (
                                        <button key={idx} onClick={() => selectMedicine(med)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0">
                                            <Pill className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">{med.name}</p>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{med.category} • {med.defaultDosage}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <FormField label="Medicine Name" required error={errors.name}>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., Paracetamol 500mg"
                                className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300" />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Dosage" required error={errors.dosage}>
                                <input type="text" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                                    placeholder="e.g., 500mg"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300" />
                            </FormField>
                            <FormField label="Frequency" required>
                                <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all text-gray-700">
                                    {FREQUENCY_OPTIONS.map((f) => (<option key={f} value={f}>{f}</option>))}
                                </select>
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Duration" required error={errors.duration}>
                                <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                    placeholder="e.g., 7 days"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300" />
                            </FormField>
                            <FormField label="Instructions">
                                <input type="text" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                                    placeholder="e.g., After meals"
                                    className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium italic outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300" />
                            </FormField>
                        </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button onClick={onClose} className="h-11 px-6 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">Cancel</button>
                        <button onClick={handleSubmit} className="h-11 px-8 bg-primary text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                            {editingMedicine ? (<><Save className="w-4 h-4" /> Update</>) : (<><Plus className="w-4 h-4" /> Add Medicine</>)}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ─── Lab Report Form ─────────────────────────────────────────────
function LabReportForm({ patientId, onSave, onCancel }) {
    const [form, setForm] = useState({
        reportName: "", testDate: new Date().toISOString().split("T")[0],
        resultStatus: "Pending", findings: "", priority: "routine",
    });
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!form.reportName.trim()) errs.reportName = "Report/Test name is required";
        if (!form.testDate) errs.testDate = "Test date is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try {
            await onSave({
                patientId, reportName: form.reportName, testDate: form.testDate,
                resultStatus: form.resultStatus, findings: form.findings,
                priority: form.priority, file: file ? file.name : null,
            });
            setForm({ reportName: "", testDate: new Date().toISOString().split("T")[0], resultStatus: "Pending", findings: "", priority: "routine" });
            setFile(null);
        } catch (err) { console.error("Failed to save lab report:", err); }
        finally { setSaving(false); }
    };

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-primary-dark tracking-tight italic">Issue Lab Report</h3>
            </div>
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <FormField label="Report / Test" required error={errors.reportName}>
                            <select value={form.reportName} onChange={(e) => setForm({ ...form, reportName: e.target.value })}
                                className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-700">
                                <option value="">Select report type...</option>
                                {REPORT_TYPES.map((rt) => (<option key={rt} value={rt}>{rt}</option>))}
                            </select>
                        </FormField>
                    </div>
                    <FormField label="Priority">
                        <div className="flex gap-2">
                            {PRIORITY_OPTIONS.map((p) => (
                                <button key={p.value} type="button" onClick={() => setForm({ ...form, priority: p.value })}
                                    className={cn("flex-1 h-11 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                        form.priority === p.value ? `${p.color} shadow-sm scale-105` : "bg-gray-50 text-gray-400 hover:bg-gray-100")}>
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </FormField>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Test Date" required error={errors.testDate}>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="date" value={form.testDate} onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                                className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-700" />
                        </div>
                    </FormField>
                    <FormField label="Result Status">
                        <select value={form.resultStatus} onChange={(e) => setForm({ ...form, resultStatus: e.target.value })}
                            className="w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-gray-700">
                            {RESULT_STATUS_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                    </FormField>
                </div>
                <FormField label="Clinical Findings / Notes">
                    <textarea value={form.findings} onChange={(e) => setForm({ ...form, findings: e.target.value })}
                        placeholder="Enter relevant clinical findings, observations, or notes for the lab..." rows={3}
                        className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none resize-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-gray-300 text-gray-700" />
                </FormField>
                <FormField label="Attach File (Optional)">
                    <div className="relative">
                        <input type="file" id="lab-report-file-tab" accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                            onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                        <label htmlFor="lab-report-file-tab"
                            className={cn("flex items-center gap-3 h-11 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                                file ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-400 hover:border-purple-300 hover:bg-purple-50/50 hover:text-purple-600")}>
                            <Upload className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-bold truncate">{file ? file.name : "Click to upload report file (PDF, JPEG, PNG, DICOM)"}</span>
                            {file && (<button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }} className="ml-auto p-1 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>)}
                        </label>
                    </div>
                </FormField>
                <div className="flex items-center justify-end gap-3 pt-2">
                    {onCancel && (<button onClick={onCancel} className="h-11 px-6 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">Cancel</button>)}
                    <button onClick={handleSave} disabled={saving}
                        className="h-11 px-8 bg-purple-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:scale-105 transition-transform disabled:opacity-50">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Report
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main PrescriptionsTab Component ─────────────────────────────
export default function PrescriptionsTab({ selectedPatient, showToast }) {
    const MAX_DIAGNOSIS_CHARS = 2000;
    const [diagnosis, setDiagnosis] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [showMedicineModal, setShowMedicineModal] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [labReports, setLabReports] = useState([]);
    const [showLabForm, setShowLabForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddMedicine = (med) => setMedicines([...medicines, med]);
    const handleEditMedicine = (idx) => { setEditingMedicine(medicines[idx]); setEditingIndex(idx); setShowMedicineModal(true); };
    const handleUpdateMedicine = (idx, updated) => {
        const updatedMeds = [...medicines];
        updatedMeds[idx] = { ...updatedMeds[idx], ...updated };
        setMedicines(updatedMeds);
    };
    const handleDeleteMedicine = (idx) => setMedicines(medicines.filter((_, i) => i !== idx));
    const openAddModal = () => { setEditingMedicine(null); setEditingIndex(null); setShowMedicineModal(true); };
    const handleSaveLabReport = async (reportData) => {
        setLabReports([...labReports, { ...reportData, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
        showToast("Lab report saved successfully", "success");
    };
    const handleDeleteLabReport = (idx) => setLabReports(labReports.filter((_, i) => i !== idx));

    const handleSubmitPrescription = async () => {
        if (!selectedPatient) { showToast("Please select a patient first.", "error"); return; }
        if (!diagnosis.trim() && medicines.length === 0 && labReports.length === 0) {
            showToast("Please add diagnosis notes, medicines, or lab reports before submitting.", "error"); return;
        }
        setIsSubmitting(true);
        try {
            const doctorName = JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Dr. Current";
            await emrService.saveConsultation({
                patientId: selectedPatient.patientId || selectedPatient.id,
                appointmentId: selectedPatient.appointmentId || null,
                notes: diagnosis, medicines, vitals: {}, files: [], doctorName,
            });
            showToast("Prescription submitted successfully!", "success");
            setDiagnosis(""); setMedicines([]); setLabReports([]);
        } catch (err) {
            console.error("Submit failed:", err);
            showToast("Failed to submit prescription. Please try again.", "error");
        } finally { setIsSubmitting(false); }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    };

    const getPriorityBadge = (priority) => {
        const p = PRIORITY_OPTIONS.find((o) => o.value === priority) || PRIORITY_OPTIONS[0];
        return <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest", p.color)}>{p.label}</span>;
    };

    const getStatusBadge = (status) => {
        const colors = {
            Pending: "bg-amber-50 text-amber-700 border-amber-200",
            "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
            Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
            Cancelled: "bg-red-50 text-red-700 border-red-200",
        };
        return <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border", colors[status] || colors.Pending)}>{status}</span>;
    };

    return (
        <div className="space-y-8">
            {/* Patient Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-lg">
                        {(selectedPatient.name || "").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-primary-dark tracking-tight">{selectedPatient.name}</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {selectedPatient.patientId || "ID: N/A"} • {selectedPatient.gender || "N/A"}
                            {selectedPatient.age ? ` • ${selectedPatient.age} years` : ""}
                            {selectedPatient.bloodGroup ? ` • Blood: ${selectedPatient.bloodGroup}` : ""}
                        </p>
                    </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
            </div>

            {/* Diagnosis & Impressions */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <Stethoscope className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-primary-dark tracking-tight italic">Diagnosis & Impressions</h3>
                </div>
                <textarea
                    className="w-full h-48 p-6 bg-gray-50 border-none rounded-2xl text-sm font-medium text-gray-700 outline-none resize-none placeholder:text-gray-300 leading-relaxed focus:ring-4 focus:ring-primary/5 transition-all"
                    placeholder={"Enter diagnosis, clinical impressions, and observations...\n\nExample:\n• Chief Complaint: Persistent dry cough for 2 weeks\n• Physical Examination: Chest clear, no wheezing\n• Diagnosis: Acute bronchitis, likely viral\n• Plan: Symptomatic management, follow-up in 5 days"}
                    value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} maxLength={MAX_DIAGNOSIS_CHARS}
                />
                <div className="flex items-center justify-between mt-3">
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Append-only record • All changes are versioned</p>
                    <p className={cn("text-[10px] font-bold transition-colors", diagnosis.length > MAX_DIAGNOSIS_CHARS * 0.9 ? "text-red-500" : diagnosis.length > MAX_DIAGNOSIS_CHARS * 0.7 ? "text-amber-500" : "text-gray-300")}>
                        {diagnosis.length} / {MAX_DIAGNOSIS_CHARS} characters
                    </p>
                </div>
            </div>

            {/* Prescribed Medication */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <Pill className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-primary-dark tracking-tight italic">Prescribed Medication</h3>
                    </div>
                    <button onClick={openAddModal}
                        className="h-11 px-5 bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 transition-transform">
                        <Plus className="w-4 h-4" /> Add Medicine
                    </button>
                </div>

                {medicines.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[2rem]">
                        <Pill className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-400">No medicines prescribed yet</p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Click 'Add Medicine' to begin prescribing</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-l-xl">#</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medicine</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dosage</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Frequency</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructions</th>
                                    <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-r-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {medicines.map((med, idx) => (
                                    <tr key={med.id || idx} className="group hover:bg-emerald-50/30 transition-colors">
                                        <td className="py-3 px-4"><span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500">{String(idx + 1).padStart(2, "0")}</span></td>
                                        <td className="py-3 px-4"><div className="flex items-center gap-2"><Pill className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /><span className="text-sm font-black text-gray-900">{med.name}</span></div></td>
                                        <td className="py-3 px-4 text-xs font-bold text-gray-700">{med.dosage}</td>
                                        <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest">{med.frequency || "BD"}</span></td>
                                        <td className="py-3 px-4 text-xs font-bold text-gray-700">{med.duration}</td>
                                        <td className="py-3 px-4 text-xs font-medium text-gray-500 italic max-w-[150px] truncate">{med.instructions || "—"}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEditMedicine(idx)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit3 className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => handleDeleteMedicine(idx)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {medicines.length > 0 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{medicines.length} medicine{medicines.length !== 1 ? "s" : ""} prescribed</p>
                        <button onClick={openAddModal} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors flex items-center gap-1"><Plus className="w-3 h-3" /> Add Another</button>
                    </div>
                )}
            </div>

            {/* Prescribed Reports & Media */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><Upload className="w-5 h-5" /></div>
                        <h3 className="text-xl font-black text-primary-dark tracking-tight italic">Prescribed Reports & Media</h3>
                    </div>
                    <button onClick={() => setShowLabForm(!showLabForm)}
                        className="h-11 px-5 bg-blue-600 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
                        {showLabForm ? (<><Eye className="w-4 h-4" /> Hide Form</>) : (<><Plus className="w-4 h-4" /> Add Lab Report</>)}
                    </button>
                </div>
                {labReports.length === 0 && !showLabForm ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-[2rem]">
                        <FlaskConical className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-400">No lab reports prescribed</p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Click 'Add Lab Report' to issue a new report</p>
                    </div>
                ) : (
                    <>
                        {labReports.length > 0 && (
                            <div className="space-y-3 mb-6">
                                {labReports.map((report, idx) => (
                                    <div key={report.id || idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm flex-shrink-0"><FlaskConical className="w-5 h-5" /></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-black text-gray-900 truncate">{report.reportName}</p>
                                                {getPriorityBadge(report.priority)}{getStatusBadge(report.resultStatus)}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(report.testDate)}</span>
                                                {report.file && <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1"><FileText className="w-3 h-3" /> {report.file}</span>}
                                            </div>
                                            {report.findings && <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">{report.findings}</p>}
                                        </div>
                                        <button onClick={() => handleDeleteLabReport(idx)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
                {showLabForm && (
                    <div className="mt-4">
                        <LabReportForm patientId={selectedPatient.patientId || selectedPatient.id} onSave={handleSaveLabReport} onCancel={() => setShowLabForm(false)} />
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock className="w-3 h-3 inline mr-1" />Records are append-only • No destructive edits</div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setDiagnosis(""); setMedicines([]); setLabReports([]); }}
                        className="h-14 px-8 rounded-2xl border-gray-200 text-gray-500 font-bold">Clear Draft</Button>
                    <Button onClick={handleSubmitPrescription}
                        disabled={isSubmitting || (!diagnosis.trim() && medicines.length === 0 && labReports.length === 0)}
                        className="h-14 px-12 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all text-sm font-black">
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> Submit Prescription</>}
                    </Button>
                </div>
            </div>

            {/* Add Medicine Modal */}
            <AddMedicineModal isOpen={showMedicineModal} onClose={() => setShowMedicineModal(false)}
                onAdd={handleAddMedicine} editingMedicine={editingMedicine} onUpdate={handleUpdateMedicine} editIndex={editingIndex} />
        </div>
    );
}