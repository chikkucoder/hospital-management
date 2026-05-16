import { useState } from "react";
import {
    History,
    Loader2,
    FileText,
    Pill,
    Calendar,
    ChevronDown,
    ChevronUp,
    Filter,
    Clock,
    Stethoscope,
    FlaskConical,
    Scan,
} from "lucide-react";
import { cn } from "../../lib/utils";

const recordTypeIcons = {
    consultation: <Stethoscope className="w-3.5 h-3.5" />,
    lab_report: <FlaskConical className="w-3.5 h-3.5" />,
    imaging: <Scan className="w-3.5 h-3.5" />,
    discharge_summary: <FileText className="w-3.5 h-3.5" />,
    follow_up: <Calendar className="w-3.5 h-3.5" />,
    procedure: <Stethoscope className="w-3.5 h-3.5" />,
    vaccination: <FlaskConical className="w-3.5 h-3.5" />,
};

const recordTypeColors = {
    consultation: "border-emerald-100 bg-emerald-50/50",
    lab_report: "border-purple-100 bg-purple-50/50",
    imaging: "border-blue-100 bg-blue-50/50",
    discharge_summary: "border-amber-100 bg-amber-50/50",
    follow_up: "border-cyan-100 bg-cyan-50/50",
    procedure: "border-rose-100 bg-rose-50/50",
    vaccination: "border-teal-100 bg-teal-50/50",
};

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export default function MedicalHistoryPanel({ patientHistory, loading, selectedPatient }) {
    const [filter, setFilter] = useState("all"); // all | prescriptions | records
    const [expandedItem, setExpandedItem] = useState(null);

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
                </div>
                <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                </div>
            </div>
        );
    }

    if (!selectedPatient) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
                </div>
                <p className="text-center text-gray-400 py-8 text-sm font-medium">Select a patient to view history</p>
            </div>
        );
    }

    const prescriptions = patientHistory?.prescriptions || [];
    const records = patientHistory?.medicalRecords || [];
    const summary = patientHistory?.summary || {};

    const hasData = prescriptions.length > 0 || records.length > 0;

    if (!hasData) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                    <History className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
                </div>
                <p className="text-center text-gray-400 py-8 text-sm font-medium">No previous records</p>
            </div>
        );
    }

    const filteredItems = [];
    if (filter === "all" || filter === "prescriptions") {
        prescriptions.slice(0, 10).forEach((p) => filteredItems.push({ type: "prescription", data: p }));
    }
    if (filter === "all" || filter === "records") {
        records.slice(0, 10).forEach((r) => filteredItems.push({ type: "record", data: r }));
    }

    // Sort by date
    filteredItems.sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-400">
                        {summary.totalPrescriptions || 0}P / {summary.totalMedicalRecords || 0}R
                    </span>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-emerald-50 rounded-xl p-2 text-center">
                    <p className="text-[10px] font-bold text-emerald-600">{summary.totalPrescriptions || 0}</p>
                    <p className="text-[8px] text-emerald-500 uppercase font-bold">Rx</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-2 text-center">
                    <p className="text-[10px] font-bold text-blue-600">{summary.totalMedicalRecords || 0}</p>
                    <p className="text-[8px] text-blue-500 uppercase font-bold">Records</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-2 text-center">
                    <p className="text-[10px] font-bold text-purple-600">{summary.totalAppointments || 0}</p>
                    <p className="text-[8px] text-purple-500 uppercase font-bold">Visits</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-4">
                {["all", "prescriptions", "records"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                            filter === f
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        )}
                    >
                        {f === "all" ? "All" : f === "prescriptions" ? "Rx" : "Records"}
                    </button>
                ))}
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {filteredItems.length === 0 ? (
                    <p className="text-center text-gray-400 py-4 text-xs">No items for this filter</p>
                ) : (
                    filteredItems.map((item, i) => {
                        const isExpanded = expandedItem === `${item.type}-${item.data.id || i}`;
                        const isPrescription = item.type === "prescription";
                        const d = item.data;

                        return (
                            <div key={`${item.type}-${d.id || i}`}>
                                <button
                                    onClick={() =>
                                        setExpandedItem(isExpanded ? null : `${item.type}-${d.id || i}`)
                                    }
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl border transition-all",
                                        isPrescription
                                            ? "border-emerald-100 hover:bg-emerald-50/50"
                                            : "border-blue-100 hover:bg-blue-50/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className={cn(
                                                "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                                                isPrescription ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                                            )}>
                                                {isPrescription ? <Pill className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-700 truncate">
                                                    {isPrescription ? d.diagnosis : d.title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {formatDate(d.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                                            {isPrescription ? (
                                                <>
                                                    {d.symptoms?.length > 0 && (
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Symptoms</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {d.symptoms.map((s, si) => (
                                                                    <span key={si} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-medium">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {d.medicines?.length > 0 && (
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Medicines</p>
                                                            <div className="space-y-1">
                                                                {d.medicines.map((m, mi) => (
                                                                    <div key={mi} className="flex items-center gap-1 text-[10px]">
                                                                        <Pill className="w-2.5 h-2.5 text-emerald-500" />
                                                                        <span className="font-bold text-gray-700">{m.name}</span>
                                                                        <span className="text-gray-400">{m.dosage}</span>
                                                                        <span className="text-gray-400">· {m.duration}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {d.notes && (
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Notes</p>
                                                            <p className="text-[10px] text-gray-600 italic">{d.notes}</p>
                                                        </div>
                                                    )}
                                                    {d.followUpDate && (
                                                        <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                                                            <Calendar className="w-2.5 h-2.5" />
                                                            <span className="font-bold">Follow-up: {formatDate(d.followUpDate)}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-md text-[9px] font-bold uppercase",
                                                            recordTypeColors[d.recordType] || "bg-gray-100 text-gray-600"
                                                        )}>
                                                            {d.recordType?.replace("_", " ")}
                                                        </span>
                                                        {d.isConfidential && (
                                                            <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-[9px] font-bold">
                                                                Confidential
                                                            </span>
                                                        )}
                                                    </div>
                                                    {d.description && (
                                                        <p className="text-[10px] text-gray-600">{d.description}</p>
                                                    )}
                                                    {d.diagnosis?.primary && (
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Diagnosis</p>
                                                            <p className="text-[10px] font-bold text-gray-700">{d.diagnosis.primary}</p>
                                                            {d.diagnosis.secondary?.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {d.diagnosis.secondary.map((s, si) => (
                                                                        <span key={si} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-medium">
                                                                            {s}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {d.treatment && (
                                                        <div>
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Treatment</p>
                                                            <p className="text-[10px] text-gray-600">{d.treatment}</p>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Last Visit */}
            {summary.lastVisit && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 text-center">
                        Last visit: <span className="font-bold text-gray-600">{formatDate(summary.lastVisit)}</span>
                    </p>
                </div>
            )}
        </div>
    );
}