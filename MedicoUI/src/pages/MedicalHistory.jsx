import { useState, useMemo } from "react";
import {
    History,
    Search,
    Filter,
    Eye,
    Download,
    ChevronLeft,
    ChevronRight,
    Calendar,
    ChevronDown,
    Pill,
    FileText,
    Stethoscope,
    FileSearch,
    Clipboard,
    Activity,
    UserCircle,
    Phone,
    Mail,
    MapPin,
    Clock,
    IdCard,
    Heart,
    Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

// ═══════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════

const TABS = [
    { key: "all", label: "All History" },
    { key: "prescriptions", label: "Prescriptions" },
    { key: "diagnoses", label: "Diagnoses" },
    { key: "reports", label: "Reports" },
    { key: "notes", label: "Notes" },
];

const TYPE_CONFIG = {
    prescription: {
        label: "Prescription",
        icon: Pill,
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    "lab-report": {
        label: "Lab Report",
        icon: Clipboard,
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
    },
    diagnosis: {
        label: "Diagnosis",
        icon: Stethoscope,
        bg: "bg-orange-50",
        text: "text-orange-700",
        border: "border-orange-200",
    },
    "imaging-report": {
        label: "Imaging Report",
        icon: Activity,
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
    },
    "clinical-note": {
        label: "Clinical Note",
        icon: FileSearch,
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
    },
};

const HISTORY_DATA = [
    {
        id: 1,
        date: "12 May 2025",
        time: "09:30 AM",
        type: "prescription",
        details: "2 Medicines",
        subtext: "Amoxicillin 500mg, Paracetamol 650mg",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
    {
        id: 2,
        date: "12 May 2025",
        time: "10:15 AM",
        type: "lab-report",
        details: "Complete Blood Count (CBC)",
        subtext: "Report Completed",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
    {
        id: 3,
        date: "11 May 2025",
        time: "02:00 PM",
        type: "diagnosis",
        details: "Fever & Cold",
        subtext: "Acute upper respiratory infection",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
    {
        id: 4,
        date: "10 May 2025",
        time: "11:00 AM",
        type: "prescription",
        details: "2 Medicines",
        subtext: "Cetirizine 10mg, Paracetamol 650mg",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
    {
        id: 5,
        date: "09 May 2025",
        time: "03:30 PM",
        type: "imaging-report",
        details: "Chest X-Ray",
        subtext: "No abnormality detected",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
    {
        id: 6,
        date: "08 May 2025",
        time: "04:45 PM",
        type: "clinical-note",
        details: "Patient advised rest and hydration.",
        subtext: "Follow up in 5 days.",
        doctor: "Dr. Michael Brown",
        doctorSubtitle: "General Physician",
    },
];

const ITEMS_PER_PAGE = 6;
const TOTAL_RECORDS = 24;

// ═══════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════

function TypeBadge({ type }) {
    const config = TYPE_CONFIG[type] || TYPE_CONFIG["clinical-note"];
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
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}

function PaginationFooter({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    totalItems,
}) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4">
            {/* Left: Showing records + rows per page */}
            <div className="flex items-center gap-5">
                <p className="text-xs font-bold text-[#6B7280] whitespace-nowrap">
                    Showing{" "}
                    <span className="text-[#1F2937]">
                        {startItem} to {endItem}
                    </span>{" "}
                    of <span className="text-[#1F2937]">{totalItems}</span> records
                </p>
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                            Rows per page
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="h-9 px-3 pr-8 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 cursor-pointer appearance-none transition-all"
                        >
                            {[5, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Pagination controls */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
                    title="Previous"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`dots-${idx}`}
                            className="w-9 h-9 flex items-center justify-center text-xs font-bold text-[#6B7280] select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange?.(page)}
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
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
                    title="Next"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════
// Clinical Profile Sidebar
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
                    <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
                        Digital Medical Record
                    </p>
                </div>

                {/* Avatar & Identity */}
                <div className="p-6 flex flex-col items-center text-center border-b border-[#E5E7EB]/50">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] font-black text-2xl shadow-sm mb-4">
                        AC
                    </div>
                    <h2 className="text-lg font-black text-[#1F2937] tracking-tight">
                        Alice Cooper
                    </h2>
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
                            <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                                Patient ID
                            </p>
                            <p className="text-sm font-black text-[#1F2937] tracking-tight">
                                PAT-0001
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="px-6 py-5 border-b border-[#E5E7EB]/50 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        Contact Information
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                            <Phone className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">
                                +1 (555) 123-4567
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Phone</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] truncate">
                                alice.cooper@email.com
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Email</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] leading-relaxed">
                                123 Main Street, Springfield, IL 62701
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Address</p>
                        </div>
                    </div>
                </div>

                {/* Appointment Information */}
                <div className="px-6 py-5 border-b border-[#E5E7EB]/50 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        Appointment Details
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">
                                Tuesday, 12 May 2025
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">
                                Appointment Date
                            </p>
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
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        Assigned Doctor
                    </p>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                            <Stethoscope className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937]">
                                Dr. Michael Brown
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">
                                General Physician
                            </p>
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

export default function MedicalHistory() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [selectedDate, setSelectedDate] = useState("Tuesday, 12 May 2025");

    // Filter by tab
    const filteredByTab = useMemo(() => {
        if (activeTab === "all") return HISTORY_DATA;
        if (activeTab === "prescriptions") return HISTORY_DATA.filter((r) => r.type === "prescription");
        if (activeTab === "diagnoses") return HISTORY_DATA.filter((r) => r.type === "diagnosis");
        if (activeTab === "reports")
            return HISTORY_DATA.filter((r) => r.type === "lab-report" || r.type === "imaging-report");
        if (activeTab === "notes") return HISTORY_DATA.filter((r) => r.type === "clinical-note");
        return HISTORY_DATA;
    }, [activeTab]);

    // Filter by search
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return filteredByTab;
        const s = searchTerm.toLowerCase();
        return filteredByTab.filter(
            (r) =>
                r.details.toLowerCase().includes(s) ||
                r.subtext.toLowerCase().includes(s) ||
                r.doctor.toLowerCase().includes(s) ||
                r.type.toLowerCase().includes(s) ||
                r.date.toLowerCase().includes(s)
        );
    }, [filteredByTab, searchTerm]);

    const totalPages = Math.ceil(TOTAL_RECORDS / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)]">
            {/* ═══════════════════════════════════════════════════════
                LEFT: History Timeline Section
                ═══════════════════════════════════════════════════ */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
                {/* ── History Section Container ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden"
                >
                    {/* ── Page Header ── */}
                    <div className="px-8 pt-8 pb-6 border-b border-[#E5E7EB]/50">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            {/* Left: Title & Subtitle */}
                            <div>
                                <h1 className="text-2xl font-black text-[#1F2937] tracking-tight flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B]">
                                        <History className="w-5 h-5" />
                                    </div>
                                    History
                                </h1>
                                <p className="text-sm font-medium text-[#6B7280] mt-1.5 ml-[52px]">
                                    View and manage patient history and past prescriptions.
                                </p>
                            </div>

                            {/* Right: Date selector + Submit button */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 h-10 px-4 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#1F2937] hover:border-[#0F6B4B]/30 hover:bg-[#F7F9F8] transition-all"
                                    >
                                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                                        {selectedDate}
                                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                                    </button>
                                </div>
                                <button
                                    className="h-10 px-5 flex items-center gap-2 rounded-xl bg-[#0F6B4B] text-white text-sm font-bold hover:bg-[#0A3E2A] shadow-sm shadow-[#0F6B4B]/20 transition-all active:scale-95"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Search & Filter Row ── */}
                    <div className="px-8 py-5 border-b border-[#E5E7EB]/50">
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#0F6B4B] transition-colors" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search history by visit, diagnosis, doctor or note..."
                                    className="w-full h-11 pl-11 pr-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
                                />
                            </div>
                            <button
                                className="h-11 px-4 flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#6B7280] hover:bg-[#F7F9F8] hover:border-[#0F6B4B]/20 hover:text-[#1F2937] transition-all"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* ── Navigation Tabs ── */}
                    <div className="px-8 pt-5 pb-0">
                        <div className="flex gap-1 border-b border-[#E5E7EB]/50">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setActiveTab(tab.key);
                                        setCurrentPage(1);
                                    }}
                                    className={cn(
                                        "relative px-5 py-3 text-sm font-bold transition-all",
                                        activeTab === tab.key
                                            ? "text-[#0F6B4B]"
                                            : "text-[#6B7280] hover:text-[#1F2937]"
                                    )}
                                >
                                    {tab.label}
                                    {activeTab === tab.key && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6B4B] rounded-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── History Table ── */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Date & Time
                                    </th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Type
                                    </th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Details
                                    </th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                                        Doctor
                                    </th>
                                    <th className="px-8 py-4 text-[10px] font-black text-[#6B7280] uppercase tracking-widest text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E7EB]/30">
                                {paginatedData.map((row, idx) => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.05 * idx }}
                                        className="hover:bg-[#F7F9F8] transition-colors group"
                                    >
                                        {/* Date & Time */}
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2.5">
                                                <Calendar className="w-4 h-4 text-[#6B7280]" />
                                                <div>
                                                    <p className="text-sm font-bold text-[#1F2937]">
                                                        {row.date}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-[#6B7280]">
                                                        {row.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Type */}
                                        <td className="px-8 py-5">
                                            <TypeBadge type={row.type} />
                                        </td>

                                        {/* Details */}
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-[#1F2937]">
                                                {row.details}
                                            </p>
                                            <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
                                                {row.subtext}
                                            </p>
                                        </td>

                                        {/* Doctor */}
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-[#1F2937]">
                                                {row.doctor}
                                            </p>
                                            <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">
                                                {row.doctorSubtitle}
                                            </p>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.92 }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#0F6B4B] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0] transition-all shadow-sm"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.92 }}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] bg-white hover:text-[#0F6B4B] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0] transition-all shadow-sm"
                                                    title="Download"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Footer Pagination Section ── */}
                    <div className="border-t border-[#E5E7EB]/50">
                        <PaginationFooter
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(n) => {
                                setItemsPerPage(n);
                                setCurrentPage(1);
                            }}
                            totalItems={TOTAL_RECORDS}
                        />
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