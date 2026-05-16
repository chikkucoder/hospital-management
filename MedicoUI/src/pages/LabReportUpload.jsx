import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
    Upload,
    Search,
    FileText,
    FlaskConical,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    User,
    ChevronRight,
    X,
    Image,
    File,
    Plus,
    Save,
    Activity,
    ListFilter,
    ChevronDown,
    PanelRightOpen,
    PanelRightClose,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { patientService } from "../services/patientService";
import { emrService } from "../services/emrService";
import { labService } from "../services/labService";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";
import ClinicalProfilePanel from "../components/emr/ClinicalProfilePanel";

const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/dicom",
    "application/dicom",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const REPORT_CATEGORIES = [
    "Hematology",
    "Radiology",
    "Cardiology",
    "Biochemistry",
    "Microbiology",
    "Lab Report",
    "X-Ray / MRI Scan",
    "CT Scan",
    "Ultrasound",
    "Discharge Summary",
    "Vaccination Record",
    "Consent Form",
    "Prescription Copy",
    "Referral Letter",
    "Other Document",
];

const STATUS_OPTIONS = [
    { key: "pending", label: "Pending", color: "bg-amber-50 text-amber-600 border-amber-200" },
    { key: "in_progress", label: "In Progress", color: "bg-blue-50 text-blue-600 border-blue-200" },
    { key: "completed", label: "Completed", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
];

function formatFileSize(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getFileIcon(fileName) {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "dicom"].includes(ext)) return Image;
    if (["pdf"].includes(ext)) return FileText;
    return File;
}

export default function LabReportUpload() {
    const { patientId } = useParams();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(window.innerWidth >= 1024);

    // Upload State
    const [reportType, setReportType] = useState("Hematology");
    const [reportStatus, setReportStatus] = useState("pending");
    const [reportNotes, setReportNotes] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const [uploadHistory, setUploadHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Pending reports selector
    const [pendingReports, setPendingReports] = useState([]);
    const [selectedPendingReport, setSelectedPendingReport] = useState(null);
    const [showPendingSelector, setShowPendingSelector] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const p = await patientService.getAll();
                setPatients(Array.isArray(p) ? p : []);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Auto-select patient from URL param
    useEffect(() => {
        if (patientId && patients.length > 0 && !selectedPatient) {
            const found = patients.find(
                (p) => (p.patientId || p.id || p._id) === patientId
            );
            if (found) setSelectedPatient(found);
        }
    }, [patientId, patients, selectedPatient]);

    useEffect(() => {
        if (!selectedPatient) return;
        loadUploadHistory();
        loadPendingReports();
    }, [selectedPatient]);

    const loadUploadHistory = async () => {
        setHistoryLoading(true);
        try {
            const patientId = selectedPatient.patientId || selectedPatient.id;
            const data = await emrService.getReports(patientId);
            setUploadHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load upload history:", err);
            setUploadHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const loadPendingReports = async () => {
        try {
            const patientId = selectedPatient.patientId || selectedPatient.id;
            // Try lab service first
            try {
                const res = await labService.getAllLabReports({ patient: patientId, status: "pending" });
                setPendingReports(res.data || []);
            } catch {
                const data = await emrService.getReports(patientId);
                setPendingReports(
                    (Array.isArray(data) ? data : []).filter((r) => r.status === "pending" || !r.status)
                );
            }
        } catch {
            setPendingReports([]);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            setError(`File type "${file.type || "unknown"}" is not supported. Allowed: PDF, JPEG, PNG, DICOM, DOC`);
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError(`File "${file.name}" exceeds 50MB limit (${formatFileSize(file.size)})`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(validateFile);
        if (validFiles.length > 0) {
            setUploadedFiles([...uploadedFiles, ...validFiles]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleInputChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = "";
    };

    const handleRemoveFile = (idx) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
    };

    const handleSelectPendingReport = (report) => {
        setSelectedPendingReport(report);
        setReportType(report.category || report.type || "Hematology");
        setReportNotes(report.notes || "");
        setShowPendingSelector(false);
    };

    const handleUpload = async () => {
        if (!selectedPatient) {
            showToast("Please select a patient first", "error");
            return;
        }
        if (uploadedFiles.length === 0) {
            showToast("Please select files to upload", "error");
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        const patientId = selectedPatient.patientId || selectedPatient.id;
        let successCount = 0;
        let failCount = 0;

        for (const file of uploadedFiles) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("patientId", patientId);
                formData.append("type", reportType);
                formData.append("notes", reportNotes);
                formData.append("status", reportStatus);

                // Use lab service with progress tracking
                await labService.uploadLabReport(formData, (progress) => {
                    setUploadProgress(progress);
                });

                successCount++;
            } catch (err) {
                console.error("Upload failed for:", file.name, err);
                failCount++;
            }
        }

        setIsUploading(false);
        setUploadProgress(0);

        if (successCount > 0) {
            showToast(
                `${successCount} file(s) uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ""}`,
                "success"
            );
            setUploadedFiles([]);
            setReportNotes("");
            setSelectedPendingReport(null);
            loadUploadHistory();
            loadPendingReports();
        } else {
            showToast("Upload failed. Please try again.", "error");
        }
    };

    const filteredPatients = patients.filter(
        (p) =>
            p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p?.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
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
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (dateStr) =>
        new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

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

            {/* ─── Patient Selection Sidebar ─── */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
                    <div className="mb-6 flex-shrink-0">
                        <h3 className="text-xl font-black text-primary-dark tracking-tight mb-4 italic">
                            Patient Registry
                        </h3>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search patients..."
                                className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="animate-spin text-primary opacity-20 w-8 h-8" />
                            </div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="text-center p-8">
                                <User className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-xs font-bold text-gray-400">No patients found</p>
                            </div>
                        ) : (
                            filteredPatients.map((p) => (
                                <button
                                    key={p.id || p._id}
                                    onClick={() => {
                                        setSelectedPatient(p);
                                        setUploadedFiles([]);
                                        setError(null);
                                        setSelectedPendingReport(null);
                                        setReportNotes("");
                                    }}
                                    className={cn(
                                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 group",
                                        selectedPatient?.id === p.id || selectedPatient?._id === p._id
                                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                            : "bg-white border-transparent hover:bg-gray-50 text-gray-600"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center font-black transition-colors text-xs",
                                            selectedPatient?.id === p.id || selectedPatient?._id === p._id
                                                ? "bg-white/20 text-white"
                                                : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                        )}
                                    >
                                        {getInitials(p.name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-black truncate tracking-tight">{p.name}</p>
                                        <p
                                            className={cn(
                                                "text-[9px] font-bold uppercase tracking-widest",
                                                selectedPatient?.id === p.id || selectedPatient?._id === p._id
                                                    ? "text-white/60"
                                                    : "text-gray-300"
                                            )}
                                        >
                                            {p.patientId || "New"} • {p.gender || "N/A"} • {p.age || "?"}y
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4 ml-auto transition-transform",
                                            selectedPatient?.id === p.id || selectedPatient?._id === p._id
                                                ? "text-white/60 rotate-90"
                                                : "text-gray-200 group-hover:text-gray-400 group-hover:translate-x-1"
                                        )}
                                    />
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Main Content Area ─── */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
                {!selectedPatient ? (
                    <div className="flex-1 bg-white rounded-[3rem] border border-dashed border-gray-200 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                            <Upload className="w-10 h-10 text-blue-500 opacity-30" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark tracking-tighter italic">
                            Lab Report Upload Center
                        </h2>
                        <p className="text-gray-400 font-medium max-w-sm mt-2">
                            Select a patient from the registry to upload diagnostic reports, lab results, and medical documents.
                        </p>
                        <div className="mt-8 flex gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                                <Upload className="w-3 h-3" /> Drag & Drop
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" /> PDF/DICOM
                            </span>
                            <span className="flex items-center gap-1">
                                <FlaskConical className="w-3 h-3" /> Lab Reports
                            </span>
                            <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" /> Imaging
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* ─── Patient Header ─── */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg">
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

                        {/* ─── Upload Section ─── */}
                        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Upload className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                                    Upload Reports & Documents
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {/* Pending Report Selector */}
                                {pendingReports.length > 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <ListFilter className="w-3 h-3" />
                                            Select Pending Report (Optional)
                                        </label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowPendingSelector(!showPendingSelector)}
                                                className="w-full h-14 px-6 bg-amber-50 border border-amber-100 rounded-2xl text-sm font-bold outline-none transition-all text-left flex items-center justify-between hover:border-amber-200"
                                            >
                                                <span className={selectedPendingReport ? "text-gray-800" : "text-amber-600"}>
                                                    {selectedPendingReport
                                                        ? `${selectedPendingReport.fileName || selectedPendingReport.type || "Report"} (Pending)`
                                                        : `${pendingReports.length} pending report${pendingReports.length > 1 ? "s" : ""} available`}
                                                </span>
                                                <ChevronDown className={cn("w-4 h-4 text-amber-500 transition-transform", showPendingSelector && "rotate-180")} />
                                            </button>
                                            {showPendingSelector && (
                                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                                                    <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPendingReport(null);
                                                                setReportNotes("");
                                                                setShowPendingSelector(false);
                                                            }}
                                                            className="w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                                                        >
                                                            None (New Report)
                                                        </button>
                                                        {pendingReports.map((r) => (
                                                            <button
                                                                key={r.id || r._id}
                                                                onClick={() => handleSelectPendingReport(r)}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center gap-3",
                                                                    selectedPendingReport?.id === r.id || selectedPendingReport?._id === r._id
                                                                        ? "bg-amber-50 text-amber-700"
                                                                        : "hover:bg-gray-50 text-gray-600"
                                                                )}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 font-black text-[10px]">
                                                                    {(r.fileName || "RPT").slice(0, 2).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs font-bold truncate">
                                                                        {r.fileName || r.type || "Report"}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-gray-400">
                                                                        {formatDate(r.createdAt)}
                                                                    </p>
                                                                </div>
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[9px] font-black uppercase">
                                                                    Pending
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Report Category Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Report Category
                                    </label>
                                    <select
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                        className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-700"
                                    >
                                        {REPORT_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Selector */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Report Status
                                    </label>
                                    <div className="flex gap-2">
                                        {STATUS_OPTIONS.map((s) => (
                                            <button
                                                key={s.key}
                                                type="button"
                                                onClick={() => setReportStatus(s.key)}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                    reportStatus === s.key
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                        : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-200"
                                                )}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes Textarea */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                        Clinical Notes / Observations
                                    </label>
                                    <textarea
                                        value={reportNotes}
                                        onChange={(e) => setReportNotes(e.target.value)}
                                        placeholder="Enter any relevant clinical notes, observations, or findings for this report..."
                                        rows={3}
                                        className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-700 placeholder:text-gray-300 resize-none"
                                    />
                                </div>

                                {/* Drop Zone */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onClick={() => inputRef.current?.click()}
                                    className={cn(
                                        "relative border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 group",
                                        isDragging
                                            ? "border-blue-400 bg-blue-50/50 scale-[1.02] shadow-lg shadow-blue-500/10"
                                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/20",
                                        isUploading && "opacity-50 pointer-events-none"
                                    )}
                                >
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        className="hidden"
                                        multiple
                                        accept=".pdf,.jpg,.jpeg,.png,.dcm,.doc,.docx"
                                        onChange={handleInputChange}
                                        disabled={isUploading}
                                    />

                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                            <div className="w-full max-w-xs">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-bold text-blue-600">Uploading...</p>
                                                    <p className="text-sm font-black text-blue-600">{uploadProgress}%</p>
                                                </div>
                                                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-blue-600 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${uploadProgress}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-300">
                                                <Upload className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-700">
                                                    Drag & drop files here
                                                </p>
                                                <p className="text-xs font-medium text-gray-400 mt-1">
                                                    or <span className="text-blue-500 font-bold">browse</span> to upload
                                                </p>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                PDF, JPEG, PNG, DICOM • Max 50MB
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100">
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <p className="text-xs font-bold text-red-600">{error}</p>
                                        <button onClick={() => setError(null)} className="ml-auto p-1 text-red-400 hover:text-red-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* File List */}
                                {uploadedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""} selected
                                        </p>
                                        <div className="space-y-2">
                                            {uploadedFiles.map((file, idx) => {
                                                const Icon = getFileIcon(file.name);
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                {formatFileSize(file.size)}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveFile(idx);
                                                            }}
                                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="flex items-center justify-between pt-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <Clock className="w-3 h-3 inline mr-1" />
                                        Files are stored securely • Append-only
                                    </p>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={isUploading || uploadedFiles.length === 0}
                                        className="h-14 px-12 rounded-2xl flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-sm font-black"
                                    >
                                        {isUploading ? (
                                            <Loader2 className="animate-spin w-5 h-5" />
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" /> Upload {uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ""}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Upload History Section ─── */}
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FlaskConical className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                                            Upload History
                                        </h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Previously uploaded reports for this patient
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 min-h-[200px]">
                                {historyLoading ? (
                                    <div className="h-32 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Loading history...
                                        </p>
                                    </div>
                                ) : uploadHistory.length === 0 ? (
                                    <div className="h-32 flex flex-col items-center justify-center text-center">
                                        <FileText className="w-12 h-12 text-gray-100 mb-3" />
                                        <p className="text-gray-400 font-medium text-sm">No reports uploaded yet</p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                                            Upload reports using the form above
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {uploadHistory.slice(0, 10).map((report) => {
                                            const Icon = getFileIcon(report.fileName);
                                            const statusBadge = report.status === "completed"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : report.status === "in_progress"
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "bg-amber-50 text-amber-600";
                                            return (
                                                <div
                                                    key={report.id}
                                                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-800 truncate">{report.fileName}</p>
                                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">
                                                                {report.type || "Report"}
                                                            </span>
                                                            <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", statusBadge)}>
                                                                {(report.status || "pending").replace("_", " ")}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400">
                                                                {formatFileSize(report.fileSize)}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-gray-400">
                                                                {formatDate(report.createdAt)} {formatTime(report.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {report.fileUrl && (
                                                        <a
                                                            href={report.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                                            title="View File"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {uploadHistory.length > 10 && (
                                <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Showing 10 of {uploadHistory.length} reports
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Right Sidebar: Clinical Profile Panel ─── */}
            <ClinicalProfilePanel
                patient={selectedPatient}
                isOpen={isProfileOpen}
                onToggle={setIsProfileOpen}
            />
        </div>
    );
}