import { useState, useEffect } from "react";
import {
    FlaskConical,
    Search,
    FileText,
    Download,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Filter,
    Calendar,
    Eye,
    Trash2,
    Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { emrService } from "../../services/emrService";
import { Button } from "../common/Button";
import { cn } from "../../lib/utils";

const REPORT_TYPES = [
    "Lab Report", "X-Ray / MRI Scan", "CT Scan", "Ultrasound",
    "Discharge Summary", "Vaccination Record", "Consent Form",
    "Prescription Copy", "Referral Letter", "Other Document",
];

export default function LabReportsTab({ selectedPatient, showToast }) {
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [filterType, setFilterType] = useState("all");
    const [reportSearch, setReportSearch] = useState("");

    useEffect(() => { loadReports(); }, [selectedPatient]);

    const loadReports = async () => {
        setReportsLoading(true);
        try {
            const patientId = selectedPatient.patientId || selectedPatient.id;
            const data = await emrService.getReports(patientId);
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load reports:", err);
            setReports([]);
        } finally { setReportsLoading(false); }
    };

    const handleDeleteReport = async (fileId) => {
        try {
            await emrService.deleteReport(fileId);
            showToast("Report deleted successfully", "success");
            loadReports();
        } catch (err) { showToast("Failed to delete report", "error"); }
    };

    const filteredReports = reports.filter((r) => {
        if (filterType !== "all" && r.type !== filterType) return false;
        if (reportSearch) {
            const s = reportSearch.toLowerCase();
            const searchable = (r.fileName || "") + (r.type || "") + (r.uploadedBy || "");
            if (!searchable.toLowerCase().includes(s)) return false;
        }
        return true;
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
        <div className="space-y-8">
            {/* Patient Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-lg">
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
                <Button onClick={loadReports} variant="outline" className="h-11 px-5 rounded-2xl border-gray-200 text-gray-500 font-bold text-xs">
                    <Loader2 className={cn("w-4 h-4 mr-2", reportsLoading && "animate-spin")} /> Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-3"><FileText className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black text-primary-dark">{reports.length}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Reports</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3"><CheckCircle2 className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black text-primary-dark">{reports.filter((r) => r.type === "Lab Report").length}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Lab Reports</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-3"><Activity className="w-6 h-6" /></div>
                    <h3 className="text-2xl font-black text-primary-dark">{reports.filter((r) => r.type === "X-Ray / MRI Scan" || r.type === "CT Scan" || r.type === "Ultrasound").length}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Imaging Studies</p>
                </div>
            </div>

            {/* Reports Section */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><FlaskConical className="w-5 h-5" /></div>
                        <h3 className="text-xl font-black text-primary-dark tracking-tight italic">Diagnostic Reports</h3>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative group flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="text" value={reportSearch} onChange={(e) => setReportSearch(e.target.value)}
                                placeholder="Search reports..."
                                className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => setFilterType("all")}
                                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filterType === "all" ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-400 hover:text-gray-600")}>All</button>
                            {REPORT_TYPES.slice(0, 5).map((type) => (
                                <button key={type} onClick={() => setFilterType(type)}
                                    className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        filterType === type ? "bg-blue-600 text-white shadow-sm" : "bg-gray-50 text-gray-400 hover:text-gray-600")}>{type}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 min-h-[300px]">
                    {reportsLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading reports...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <FileText className="w-16 h-16 text-gray-100 mb-4" />
                            <p className="text-gray-400 font-medium">{reportSearch || filterType !== "all" ? "No reports match your filters." : "No diagnostic reports found for this patient."}</p>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Upload reports from the Upload tab</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredReports.map((report) => (
                                <div key={report.id} className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl border border-gray-100 group hover:bg-blue-50/50 hover:border-blue-100 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0 font-black text-xs">{getFileExtIcon(report.fileName)}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">{report.fileName}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg">{report.type || "Report"}</span>
                                            <span className="text-[10px] font-bold text-gray-400">{formatFileSize(report.fileSize)}</span>
                                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(report.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {report.fileUrl && (
                                            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer"
                                                className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all" title="View / Download"><Eye className="w-4 h-4" /></a>
                                        )}
                                        <button onClick={() => handleDeleteReport(report.id)}
                                            className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100" title="Delete Report"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest"><Clock className="w-3 h-3 inline mr-1" />Records are append-only • Immutable history</p>
                    <p className="text-[10px] font-bold text-gray-400">{filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} found</p>
                </div>
            </div>
        </div>
    );
}