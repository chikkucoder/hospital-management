import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    FlaskConical,
    Search,
    FileText,
    Download,
    Upload,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    User,
    ChevronRight,
    Filter,
    Calendar,
    Eye,
    Trash2,
    X,
    Activity,
    PanelRightOpen,
    PanelRightClose,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { patientService } from "../services/patientService";
import { emrService } from "../services/emrService";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";
import ClinicalProfilePanel from "../components/emr/ClinicalProfilePanel";

export default function LabReport() {
    const { patientId } = useParams();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [toast, setToast] = useState(null);
    const [isProfileOpen, setIsProfileOpen] = useState(window.innerWidth >= 1024);

    // Report State
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [reportSearch, setReportSearch] = useState("");

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
        loadReports();
    }, [selectedPatient]);

    const loadReports = async () => {
        setReportsLoading(true);
        try {
            const patientId = selectedPatient.patientId || selectedPatient.id;
            const data = await emrService.getReports(patientId);
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load reports:", err);
            setReports([]);
        } finally {
            setReportsLoading(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDeleteReport = async (fileId) => {
        try {
            await emrService.deleteReport(fileId);
            showToast("Report deleted successfully", "success");
            loadReports();
        } catch (err) {
            showToast("Failed to delete report", "error");
        }
    };

    const filteredPatients = patients.filter(
        (p) =>
            p?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p?.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const filteredReports = reports.filter((r) => {
        if (filterType !== "all" && r.type !== filterType) return false;
        if (reportSearch) {
            const s = reportSearch.toLowerCase();
            const searchable = (r.fileName || "") + (r.type || "") + (r.uploadedBy || "");
            if (!searchable.toLowerCase().includes(s)) return false;
        }
        return true;
    });

    const REPORT_TYPES = [
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

    const formatFileSize = (bytes) => {
        if (!bytes) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileExtIcon = (fileName) => {
        const ext = (fileName || "").split(".").pop()?.toUpperCase() || "FILE";
        return ext.slice(0, 4);
    };

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
                                    onClick={() => setSelectedPatient(p)}
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
                            <FlaskConical className="w-10 h-10 text-blue-500 opacity-30" />
                        </div>
                        <h2 className="text-2xl font-black text-primary-dark tracking-tighter italic">
                            Lab Reports Center
                        </h2>
                        <p className="text-gray-400 font-medium max-w-sm mt-2">
                            Select a patient from the registry to view and manage their diagnostic reports and lab results.
                        </p>
                        <div className="mt-8 flex gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Lab Reports
                            </span>
                            <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" /> Downloads
                            </span>
                            <span className="flex items-center gap-1">
                                <Filter className="w-3 h-3" /> Filtering
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
                            <div className="flex items-center gap-3">
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
                                <Button
                                    onClick={loadReports}
                                    variant="outline"
                                    className="h-11 px-5 rounded-2xl border-gray-200 text-gray-500 font-bold text-xs"
                                >
                                    <Loader2 className={cn("w-4 h-4 mr-2", reportsLoading && "animate-spin")} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* ─── Stats Cards ─── */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-primary-dark">{reports.length}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Reports</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-primary-dark">
                                    {reports.filter((r) => r.type === "Lab Report").length}
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Lab Reports</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-3">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-primary-dark">
                                    {reports.filter((r) => r.type === "X-Ray / MRI Scan" || r.type === "CT Scan" || r.type === "Ultrasound").length}
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Imaging Studies</p>
                            </div>
                        </div>

                        {/* ─── Reports Section ─── */}
                        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <FlaskConical className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-primary-dark tracking-tight italic">
                                        Diagnostic Reports
                                    </h3>
                                </div>

                                {/* Search & Filter Bar */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative group flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={reportSearch}
                                            onChange={(e) => setReportSearch(e.target.value)}
                                            placeholder="Search reports..."
                                            className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => setFilterType("all")}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                filterType === "all"
                                                    ? "bg-primary text-white shadow-sm"
                                                    : "bg-gray-50 text-gray-400 hover:text-gray-600"
                                            )}
                                        >
                                            All
                                        </button>
                                        {REPORT_TYPES.slice(0, 5).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setFilterType(type)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    filterType === type
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "bg-gray-50 text-gray-400 hover:text-gray-600"
                                                )}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reports List */}
                            <div className="p-8 min-h-[300px]">
                                {reportsLoading ? (
                                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            Loading reports...
                                        </p>
                                    </div>
                                ) : filteredReports.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-center">
                                        <FileText className="w-16 h-16 text-gray-100 mb-4" />
                                        <p className="text-gray-400 font-medium">
                                            {reportSearch || filterType !== "all"
                                                ? "No reports match your filters."
                                                : "No diagnostic reports found for this patient."}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                                            Upload reports from the EMR module
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredReports.map((report) => (
                                            <div
                                                key={report.id}
                                                className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0 font-black text-xs">
                                                    {getFileExtIcon(report.fileName)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{report.fileName}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">
                                                            {report.type || "Report"}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            {formatFileSize(report.fileSize)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> {formatDate(report.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {report.fileUrl && (
                                                        <a
                                                            href={report.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                            title="View / Download"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteReport(report.id)}
                                                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete Report"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    Records are append-only • Immutable history
                                </p>
                                <p className="text-[10px] font-bold text-gray-400">
                                    {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found
                                </p>
                            </div>
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