import { useState, useEffect } from "react";
import {
    History,
    FileText,
    Pill,
    FileSearch,
    Loader2,
    ChevronDown,
    ChevronRight,
    Calendar,
    Filter,
    ExternalLink,
    Download,
    Printer,
    X,
    Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { emrService } from "../../services/emrService";
import { cn } from "../../lib/utils";
import PrescriptionPrint from "./PrescriptionPrint";

export default function PatientMedicalHistory({ patient, onClose }) {
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, prescriptions, reports, records
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [printPrescription, setPrintPrescription] = useState(null);

    useEffect(() => {
        if (!patient) return;
        loadTimeline();
    }, [patient]);

    const loadTimeline = async () => {
        setLoading(true);
        const patientId = patient.patientId || patient.id;
        const data = await emrService.getPatientTimeline(patientId);
        setTimeline(data);
        setLoading(false);
    };

    const toggleExpand = (id) => {
        const next = new Set(expandedItems);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedItems(next);
    };

    const filteredTimeline = timeline.filter((entry) => {
        if (filter === "prescriptions" && entry.type !== "prescription") return false;
        if (filter === "reports" && entry.type !== "report") return false;
        if (filter === "records" && entry.type !== "medicalRecord") return false;
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const searchable =
                entry.notes ||
                entry.fileName ||
                entry.clinicalNotes ||
                entry.doctorName ||
                entry.uploadedBy ||
                "";
            if (!searchable.toLowerCase().includes(search)) return false;
        }
        return true;
    });

    const groupedByDate = filteredTimeline.reduce((groups, entry) => {
        const date = new Date(entry.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(entry);
        return groups;
    }, {});

    const formatTime = (dateStr) =>
        new Date(dateStr).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });

    const getEntryIcon = (type) => {
        switch (type) {
            case "prescription":
                return Pill;
            case "report":
                return FileText;
            case "medicalRecord":
                return FileSearch;
            default:
                return FileText;
        }
    };

    const getEntryColor = (type) => {
        switch (type) {
            case "prescription":
                return "bg-primary text-white";
            case "report":
                return "bg-blue-600 text-white";
            case "medicalRecord":
                return "bg-amber-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    const getEntryLabel = (type) => {
        switch (type) {
            case "prescription":
                return "Prescription";
            case "report":
                return "Report / File";
            case "medicalRecord":
                return "Clinical Note";
            default:
                return "Record";
        }
    };

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <History className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-primary-dark tracking-tight">
                                Patient Timeline
                            </h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Immutable Clinical History
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search timeline..."
                            className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[
                            { key: "all", label: "All" },
                            { key: "prescriptions", label: "Prescriptions" },
                            { key: "reports", label: "Reports" },
                            { key: "records", label: "Notes" },
                        ].map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f.key
                                        ? "bg-primary text-white shadow-sm"
                                        : "bg-gray-50 text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Content */}
            <div className="p-8 min-h-[400px]">
                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Loading timeline records...
                        </p>
                    </div>
                ) : filteredTimeline.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                        <FileSearch className="w-16 h-16 text-gray-100 mb-4" />
                        <p className="text-gray-400 font-medium">
                            {searchTerm || filter !== "all"
                                ? "No records match your filters."
                                : "No clinical history found for this patient."}
                        </p>
                    </div>
                ) : (
                    <div className="relative pl-12 space-y-10 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {Object.entries(groupedByDate).map(([date, entries]) => (
                            <div key={date} className="space-y-6">
                                {/* Date Header */}
                                <div className="flex items-center gap-3 -ml-12">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-primary-dark">{date}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {entries.length} record{entries.length > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                {/* Entries for this date */}
                                {entries.map((entry) => {
                                    const Icon = getEntryIcon(entry.type);
                                    const isExpanded = expandedItems.has(entry.id);
                                    return (
                                        <div key={entry.id} className="relative">
                                            {/* Timeline Dot */}
                                            <div
                                                className={cn(
                                                    "absolute -left-12 w-10 h-10 rounded-2xl flex items-center justify-center z-10 border-4 border-white shadow-sm transition-transform hover:scale-110",
                                                    getEntryColor(entry.type)
                                                )}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>

                                            {/* Entry Card */}
                                            <div className="group bg-gray-50 border border-transparent hover:bg-white hover:border-gray-100 p-6 rounded-[2rem] transition-all hover:shadow-lg hover:shadow-gray-200/50">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="text-base font-black text-primary-dark tracking-tight">
                                                            {getEntryLabel(entry.type)}
                                                        </h4>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 rounded-full">
                                                            {formatTime(entry.createdAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                            By {entry.doctorName || entry.uploadedBy || "System"}
                                                        </p>
                                                        <button
                                                            onClick={() => toggleExpand(entry.id)}
                                                            className="p-1.5 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronRight className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Entry Preview (always visible) */}
                                                {entry.type === "prescription" && (
                                                    <div className="space-y-2">
                                                        {entry.notes && (
                                                            <p className="text-sm text-gray-600 font-medium line-clamp-2 italic">
                                                                {entry.notes}
                                                            </p>
                                                        )}
                                                        {entry.medicines?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {entry.medicines.slice(0, 3).map((m, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100"
                                                                    >
                                                                        {m.name}
                                                                    </span>
                                                                ))}
                                                                {entry.medicines.length > 3 && (
                                                                    <span className="px-3 py-1 bg-gray-100 text-gray-400 rounded-lg text-[10px] font-black">
                                                                        +{entry.medicines.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {entry.type === "report" && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                                            {(entry.fileName || "").split(".").pop()?.toUpperCase() || "FILE"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{entry.fileName}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                {entry.type || "Report"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {entry.type === "medicalRecord" && (
                                                    <p className="text-sm text-gray-600 font-medium line-clamp-2 italic">
                                                        {entry.clinicalNotes || entry.notes || "Clinical record"}
                                                    </p>
                                                )}

                                                {/* Expanded Details */}
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                                                                {entry.type === "prescription" && (
                                                                    <>
                                                                        {/* Vitals */}
                                                                        {entry.vitals && Object.values(entry.vitals).some((v) => v) && (
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                                                    Vital Signs
                                                                                </p>
                                                                                <div className="grid grid-cols-4 gap-2">
                                                                                    {entry.vitals.bp && (
                                                                                        <div className="bg-white rounded-xl p-2 text-center border border-gray-50">
                                                                                            <p className="text-[9px] font-bold text-gray-400">BP</p>
                                                                                            <p className="text-xs font-black text-gray-900">{entry.vitals.bp}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {entry.vitals.pulse && (
                                                                                        <div className="bg-white rounded-xl p-2 text-center border border-gray-50">
                                                                                            <p className="text-[9px] font-bold text-gray-400">Pulse</p>
                                                                                            <p className="text-xs font-black text-gray-900">{entry.vitals.pulse}</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {entry.vitals.temp && (
                                                                                        <div className="bg-white rounded-xl p-2 text-center border border-gray-50">
                                                                                            <p className="text-[9px] font-bold text-gray-400">Temp</p>
                                                                                            <p className="text-xs font-black text-gray-900">{entry.vitals.temp}°F</p>
                                                                                        </div>
                                                                                    )}
                                                                                    {entry.vitals.spo2 && (
                                                                                        <div className="bg-white rounded-xl p-2 text-center border border-gray-50">
                                                                                            <p className="text-[9px] font-bold text-gray-400">SpO₂</p>
                                                                                            <p className="text-xs font-black text-gray-900">{entry.vitals.spo2}%</p>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Full Notes */}
                                                                        {entry.notes && (
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                                                    Clinical Notes
                                                                                </p>
                                                                                <p className="text-sm text-gray-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-50 whitespace-pre-wrap">
                                                                                    {entry.notes}
                                                                                </p>
                                                                            </div>
                                                                        )}

                                                                        {/* Full Medicine List */}
                                                                        {entry.medicines?.length > 0 && (
                                                                            <div>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                                                    All Medications
                                                                                </p>
                                                                                <div className="space-y-2">
                                                                                    {entry.medicines.map((m, i) => (
                                                                                        <div
                                                                                            key={i}
                                                                                            className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-50"
                                                                                        >
                                                                                            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black">
                                                                                                {i + 1}
                                                                                            </span>
                                                                                            <span className="text-sm font-bold text-gray-800 flex-1">{m.name}</span>
                                                                                            <span className="text-xs font-bold text-gray-500">{m.dosage}</span>
                                                                                            <span className="text-xs font-bold text-gray-400">{m.frequency || "BD"}</span>
                                                                                            <span className="text-xs font-bold text-gray-400">{m.duration}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Actions */}
                                                                        <div className="flex gap-2 pt-2">
                                                                            <button
                                                                                onClick={() => setPrintPrescription(entry)}
                                                                                className="h-10 px-4 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                                                            >
                                                                                <Printer className="w-4 h-4" /> Print
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {entry.type === "report" && (
                                                                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-50">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                                                                                {(entry.fileName || "").split(".").pop()?.toUpperCase() || "FILE"}
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-gray-800">{entry.fileName}</p>
                                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                                                    {entry.type || "Report"} • {entry.fileSize ? `${(entry.fileSize / 1024).toFixed(1)} KB` : ""}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            {entry.fileUrl && (
                                                                                <a
                                                                                    href={entry.fileUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                                                                                >
                                                                                    <Download className="w-4 h-4" />
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {entry.type === "medicalRecord" && (
                                                                    <div>
                                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                                                            Full Record
                                                                        </p>
                                                                        <p className="text-sm text-gray-700 font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-50 whitespace-pre-wrap">
                                                                            {entry.clinicalNotes || entry.notes || "No details available"}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* Version Info */}
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                                                                    <span>ID: {entry.id}</span>
                                                                    {entry.version && <span>• v{entry.version}</span>}
                                                                    <span>• Append-Only Record</span>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Print Modal */}
            {printPrescription && (
                <PrescriptionPrint
                    prescription={printPrescription}
                    patient={patient}
                    doctor={{ name: printPrescription.doctorName }}
                    onClose={() => setPrintPrescription(null)}
                />
            )}
        </div>
    );
}