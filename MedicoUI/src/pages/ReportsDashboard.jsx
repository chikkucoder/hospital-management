import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Eye,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Upload,
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ChevronDown,
    User,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    IdCard,
    Heart,
    Droplets,
    UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════

const CATEGORY_COLORS = {
    Hematology: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    Biochemistry: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    Radiology: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Cardiology: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    Microbiology: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
};

const STATUS_COLORS = {
    Pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock },
    Completed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    "In Progress": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: AlertTriangle },
};

const REPORTS_DATA = [
    {
        id: 1,
        name: "Complete Blood Count (CBC)",
        subtitle: "Lab Report",
        category: "Hematology",
        prescribedOn: "10 May 2025",
        status: "Pending",
    },
    {
        id: 2,
        name: "Liver Function Test (LFT)",
        subtitle: "Lab Report",
        category: "Biochemistry",
        prescribedOn: "10 May 2025",
        status: "Pending",
    },
    {
        id: 3,
        name: "Chest X-Ray",
        subtitle: "Radiology Report",
        category: "Radiology",
        prescribedOn: "08 May 2025",
        status: "Completed",
    },
    {
        id: 4,
        name: "Electrocardiogram (ECG)",
        subtitle: "Cardiology Report",
        category: "Cardiology",
        prescribedOn: "08 May 2025",
        status: "Completed",
    },
    {
        id: 5,
        name: "Urine Routine Examination",
        subtitle: "Microbiology Report",
        category: "Microbiology",
        prescribedOn: "05 May 2025",
        status: "In Progress",
    },
];

const ITEMS_PER_PAGE = 5;

// ═══════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════

function CategoryBadge({ category }) {
    const colors = CATEGORY_COLORS[category] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                colors.bg,
                colors.text,
                colors.border
            )}
        >
            {category}
        </span>
    );
}

function StatusBadge({ status }) {
    const config = STATUS_COLORS[status] || { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", icon: Clock };
    const Icon = config.icon;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                config.bg,
                config.text,
                config.border
            )}
        >
            <Icon className="w-3 h-3" />
            {status}
        </span>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 2) end = Math.min(4, totalPages - 1);
            if (currentPage >= totalPages - 1) start = Math.max(totalPages - 3, 2);
            if (start > 2) pages.push("...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 pt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                    <span key={`dots-${idx}`} className="w-9 h-9 flex items-center justify-center text-xs font-bold text-[#6B7280] select-none">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all select-none",
                            page === currentPage
                                ? "border-2 border-[#0F6B4B] text-[#0F6B4B] bg-[#EAF7F0] shadow-sm"
                                : "border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0]"
                        )}
                    >
                        {page}
                    </button>
                )
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// Clinical Profile Sidebar (inline for ReportsDashboard)
// ═══════════════════════════════════════════════════════════════════

function ClinicalProfileSidebar() {
    return (
        <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden sticky top-4">
                {/* Header */}
                <div className="p-5 border-b border-[#E5E7EB]/50">
                    <h3 className="text-sm font-black text-[#1F2937] tracking-tight flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-[#0F6B4B]" />
                        Clinical Profile
                    </h3>
                    <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">Digital Medical Record</p>
                </div>

                {/* Avatar & Identity */}
                <div className="p-6 flex flex-col items-center text-center border-b border-[#E5E7EB]/50">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] font-black text-2xl shadow-sm mb-4">
                        AC
                    </div>
                    <h2 className="text-lg font-black text-[#1F2937] tracking-tight">Alice Cooper</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest bg-[#F7F9F8] px-2.5 py-1 rounded-full">
                            Female
                        </span>
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest bg-[#F7F9F8] px-2.5 py-1 rounded-full">
                            34 Years
                        </span>
                    </div>
                </div>

                {/* Patient ID */}
                <div className="px-6 py-4 border-b border-[#E5E7EB]/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                            <IdCard className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">Patient ID</p>
                            <p className="text-sm font-black text-[#1F2937] tracking-tight">PAT-0001</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="px-6 py-5 border-b border-[#E5E7EB]/50 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">Contact Information</p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">+1 (555) 123-4567</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Phone</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] truncate">alice.cooper@email.com</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Email</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] leading-relaxed">123 Main Street, Springfield, IL 62701</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Address</p>
                        </div>
                    </div>
                </div>

                {/* Appointment Information */}
                <div className="px-6 py-5 border-b border-[#E5E7EB]/50 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">Appointment Details</p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">Tuesday, 12 May 2025</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Appointment Date</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">10:30 AM</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Time</p>
                        </div>
                    </div>
                </div>

                {/* Assigned Doctor */}
                <div className="px-6 py-5 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">Assigned Doctor</p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                            <Stethoscope className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">Dr. Michael Brown</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">General Physician</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E5E7EB]/50">
                    <div className="flex items-center justify-between text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-rose-400" />
                            EMR Active
                        </span>
                        <span>12 May 2025</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════

export default function ReportsDashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Tuesday, 12 May 2025");

    // Issue Lab Report form state
    const [reportForm, setReportForm] = useState({
        testName: "",
        testDate: "",
        resultStatus: "",
        findings: "",
    });
    const [charCount, setCharCount] = useState(0);

    // Filter reports by search
    const filteredReports = useMemo(() => {
        if (!searchTerm.trim()) return REPORTS_DATA;
        const s = searchTerm.toLowerCase();
        return REPORTS_DATA.filter(
            (r) =>
                r.name.toLowerCase().includes(s) ||
                r.category.toLowerCase().includes(s) ||
                r.status.toLowerCase().includes(s) ||
                r.subtitle.toLowerCase().includes(s)
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFindingsChange = (e) => {
        const val = e.target.value;
        if (val.length <= 2000) {
            setReportForm({ ...reportForm, findings: val });
            setCharCount(val.length);
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)]">
            {/* ═══════════════════════════════════════════════════════
                LEFT: Reports Dashboard
                ═══════════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10 space-y-6">
                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-black text-[#1F2937] tracking-tight">Reports</h1>
                        <p className="text-sm font-medium text-[#6B7280] mt-1">
                            View and manage all prescribed reports and test results.
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#1F2937] hover:border-[#0F6B4B]/30 hover:bg-[#F7F9F8] transition-all"
                        >
                            <Calendar className="w-4 h-4 text-[#6B7280]" />
                            {selectedDate}
                            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                        </button>
                    </div>
                </motion.div>

                {/* ── Search & Filter Row ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="flex items-center gap-3"
                >
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0F6B4B] transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder="Search reports by name or test type..."
                            className="w-full h-11 pl-11 pr-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "h-11 px-4 flex items-center gap-2 rounded-xl border text-sm font-bold transition-all",
                            showFilters
                                ? "bg-[#EAF7F0] border-[#0F6B4B]/30 text-[#0F6B4B]"
                                : "bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F9F8] hover:border-[#0F6B4B]/20 hover:text-[#1F2937]"
                        )}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </motion.div>

                {/* ── Reports Table ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden"
                >
                    {/* Section Title */}
                    <div className="px-8 pt-8 pb-4">
                        <h2 className="text-lg font-black text-[#1F2937] tracking-tight">Prescribed Reports</h2>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]/50">
                                    <th className="px-8 py-3.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Report / Test Name
                                    </th>
                                    <th className="px-8 py-3.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Category
                                    </th>
                                    <th className="px-8 py-3.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Prescribed On
                                    </th>
                                    <th className="px-8 py-3.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Status
                                    </th>
                                    <th className="px-8 py-3.5 text-[10px] font-black text-[#6B7280] uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/30">
                                {paginatedReports.map((report, idx) => (
                                    <motion.tr
                                        key={report.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                                        className="hover:bg-[#F7F9F8] transition-colors group"
                                    >
                                        {/* Report Name */}
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-[#1F2937] truncate max-w-[220px]">
                                                        {report.name}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-[#6B7280]">
                                                        {report.subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-8 py-4">
                                            <CategoryBadge category={report.category} />
                                        </td>

                                        {/* Prescribed On */}
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280]">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {report.prescribedOn}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="px-8 py-4">
                                            <StatusBadge status={report.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Eye preview icon */}
                                                <button
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0] transition-all"
                                                    title="Preview Report"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Add Result / View Result button */}
                                                {report.status === "Completed" ? (
                                                    <button
                                                        className="h-9 px-4 flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-xs font-bold hover:text-[#0F6B4B] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0] transition-all"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Result
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="h-9 px-4 flex items-center gap-1.5 rounded-xl bg-[#0F6B4B] text-white text-xs font-bold hover:bg-[#0A3E2A] shadow-sm shadow-[#0F6B4B]/20 transition-all active:scale-95"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                        Add Result
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-8 pb-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}

                    {/* Footer info */}
                    <div className="px-8 py-4 bg-[#F7F9F8]/50 border-t border-[#E5E7EB]/50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Showing {paginatedReports.length} of {filteredReports.length} reports
                        </p>
                        <p className="text-[10px] font-bold text-[#6B7280]">
                            Page {currentPage} of {Math.max(totalPages, 1)}
                        </p>
                    </div>
                </motion.div>

                {/* ── Issue Lab Report Section ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden"
                >
                    {/* Section Header */}
                    <div className="px-8 pt-8 pb-2">
                        <h2 className="text-lg font-black text-[#1F2937] tracking-tight">
                            Issue Lab Report to Patient
                        </h2>
                        <p className="text-sm font-medium text-[#6B7280] mt-1">
                            Enter test results and issue report for the patient...
                        </p>
                    </div>

                    {/* Form */}
                    <div className="p-8 space-y-6">
                        {/* Row 1: 3-column fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Report / Test dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                                    Report / Test
                                </label>
                                <div className="relative">
                                    <select
                                        value={reportForm.testName}
                                        onChange={(e) => setReportForm({ ...reportForm, testName: e.target.value })}
                                        className="w-full h-11 px-4 pr-10 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Select Report / Test</option>
                                        <option value="cbc">Complete Blood Count (CBC)</option>
                                        <option value="lft">Liver Function Test (LFT)</option>
                                        <option value="xray">Chest X-Ray</option>
                                        <option value="ecg">Electrocardiogram (ECG)</option>
                                        <option value="ur">Urine Routine Examination</option>
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                </div>
                            </div>

                            {/* Test Date picker */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                                    Test Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={reportForm.testDate}
                                        onChange={(e) => setReportForm({ ...reportForm, testDate: e.target.value })}
                                        className="w-full h-11 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 transition-all [color-scheme:light]"
                                    />
                                </div>
                            </div>

                            {/* Result Status dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                                    Result Status
                                </label>
                                <div className="relative">
                                    <select
                                        value={reportForm.resultStatus}
                                        onChange={(e) => setReportForm({ ...reportForm, resultStatus: e.target.value })}
                                        className="w-full h-11 px-4 pr-10 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Textarea + Upload */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Test Result / Findings textarea */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                                    Test Result / Findings
                                </label>
                                <textarea
                                    value={reportForm.findings}
                                    onChange={handleFindingsChange}
                                    placeholder="Enter test result or findings..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none resize-none transition-all"
                                />
                                <p className="text-[10px] font-bold text-[#6B7280] text-right">
                                    {charCount} / 2000
                                </p>
                            </div>

                            {/* Attachment Upload Box */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                                    Attachment
                                </label>
                                <div className="flex flex-col items-center justify-center h-full min-h-[140px] border-2 border-dashed border-[#E5E7EB] rounded-xl bg-[#F7F9F8] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0]/30 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-[#6B7280] group-hover:text-[#0F6B4B] transition-colors">
                                        Drag & drop files here
                                    </p>
                                    <p className="text-[10px] font-medium text-[#6B7280] mt-1">
                                        Supported formats: PDF, JPG, PNG (Max 10MB)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Button */}
                        <div className="flex justify-center pt-2">
                            <button
                                className="h-12 px-8 flex items-center gap-2 rounded-xl bg-[#0F6B4B] text-white text-sm font-bold hover:bg-[#0A3E2A] shadow-lg shadow-[#0F6B4B]/20 transition-all active:scale-95"
                            >
                                <FileText className="w-4 h-4" />
                                Issue & Save Report
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                RIGHT: Clinical Profile Sidebar
                ═══════════════════════════════════════════════════ */}
            <div className="hidden xl:block">
                <ClinicalProfileSidebar />
            </div>
        </div>
    );
}