import { useState } from "react";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Clock,
    Stethoscope,
    ChevronLeft,
    X,
    UserCircle,
    IdCard,
    Heart,
    Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * ClinicalProfilePanel — Reusable right-side patient information panel for EMR pages.
 *
 * Behavior:
 *  - Desktop (≥1024px): 320px wide, always visible inline
 *  - Tablet (768–1023px): collapsible, starts collapsed
 *  - Mobile (<768px): hidden drawer, slides in from right when toggled
 *
 * Props:
 *  @param {Object}  patient          — Patient object { name, age, gender, patientId, contact, phone, email, address, bloodGroup, ... }
 *  @param {Object}  appointment      — Optional appointment info { date, time, type, doctorName, doctorSpecialty }
 *  @param {boolean} isOpen           — Controlled open state (default: true on desktop)
 *  @param {Function} onToggle        — Callback when panel is toggled
 *  @param {string}  className        — Additional classes
 */

export default function ClinicalProfilePanel({
    patient,
    appointment = null,
    isOpen: controlledOpen,
    onToggle,
    className,
}) {
    const [internalOpen, setInternalOpen] = useState(true);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const handleToggle = () => {
        if (onToggle) {
            onToggle(!isOpen);
        } else {
            setInternalOpen(!isOpen);
        }
    };

    if (!patient) return null;

    const getInitials = (name) =>
        (name || "")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    const patientId = patient.patientId || patient.id || "N/A";
    const contactNumber = patient.contact || patient.phone || "Not provided";
    const email = patient.email || "Not provided";
    const address = patient.address || "Not on file";
    const bloodGroup = patient.bloodGroup || null;

    // ── Panel Content ──────────────────────────────────────────────
    const panelContent = (
        <div
            className={cn(
                "h-full flex flex-col bg-white border-l border-[#E5E7EB] shadow-sm overflow-hidden",
                className
            )}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]/50 flex-shrink-0">
                <div>
                    <h3 className="text-sm font-black text-[#1F2937] tracking-tight flex items-center gap-2">
                        <UserCircle className="w-4 h-4 text-[#0F6B4B]" />
                        Clinical Profile
                    </h3>
                    <p className="text-[10px] font-medium text-[#6B7280] mt-0.5">Digital Medical Record</p>
                </div>
                <button
                    onClick={handleToggle}
                    className="w-8 h-8 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#6B7280] hover:bg-[#0F6B4B] hover:text-white transition-all md:hidden"
                    title="Close panel"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Avatar & Identity */}
                <div className="p-6 flex flex-col items-center text-center border-b border-[#E5E7EB]/50">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] font-black text-2xl shadow-sm mb-4">
                        {getInitials(patient.name)}
                    </div>
                    <h2 className="text-lg font-black text-[#1F2937] tracking-tight">
                        {patient.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest bg-[#F7F9F8] px-2.5 py-1 rounded-full">
                            {patient.gender || "N/A"}
                        </span>
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest bg-[#F7F9F8] px-2.5 py-1 rounded-full">
                            {patient.age ? `${patient.age} Years` : "? Years"}
                        </span>
                        {bloodGroup && (
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Droplets className="w-3 h-3" />
                                {bloodGroup}
                            </span>
                        )}
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
                            <p className="text-sm font-black text-[#1F2937] tracking-tight truncate">
                                {patientId}
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
                            <p className="text-xs font-bold text-[#1F2937] truncate">
                                {contactNumber}
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Phone</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] truncate">{email}</p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Email</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[#1F2937] leading-relaxed">
                                {address}
                            </p>
                            <p className="text-[9px] font-medium text-[#6B7280]">Address</p>
                        </div>
                    </div>
                </div>

                {/* Appointment Info */}
                <div className="px-6 py-5 border-b border-[#E5E7EB]/50 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        Appointment Details
                    </p>

                    {appointment ? (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#1F2937]">
                                        {appointment.date || "Today"}
                                    </p>
                                    <p className="text-[9px] font-medium text-[#6B7280]">Appointment Date</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500 flex-shrink-0">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#1F2937]">
                                        {appointment.time || "N/A"}
                                    </p>
                                    <p className="text-[9px] font-medium text-[#6B7280]">Time</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 py-2">
                            <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#6B7280] flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#6B7280] italic">
                                    No appointment linked
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assigned Doctor */}
                <div className="px-6 py-5 space-y-4">
                    <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                        Assigned Doctor
                    </p>

                    {appointment?.doctorName ? (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#EAF7F0] flex items-center justify-center text-[#0F6B4B] flex-shrink-0">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1F2937]">
                                    {appointment.doctorName}
                                </p>
                                <p className="text-[9px] font-medium text-[#6B7280]">
                                    {appointment.doctorSpecialty || "General Medicine"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 py-2">
                            <div className="w-9 h-9 rounded-xl bg-[#F7F9F8] flex items-center justify-center text-[#6B7280] flex-shrink-0">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-[#6B7280] italic">
                                    {JSON.parse(localStorage.getItem("medico_session") || "{}")?.name || "Current Doctor"}
                                </p>
                                <p className="text-[9px] font-medium text-[#6B7280]">Attending</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="p-4 border-t border-[#E5E7EB]/50 flex-shrink-0">
                <div className="flex items-center justify-between text-[9px] font-black text-[#6B7280] uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-400" />
                        EMR Active
                    </span>
                    <span>
                        {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Desktop / Tablet: Inline panel ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:block w-80 flex-shrink-0 overflow-hidden"
                    >
                        {panelContent}
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* ── Collapse toggle button (desktop/tablet) ── */}
            {!isOpen && (
                <button
                    onClick={handleToggle}
                    className="hidden md:flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/20 hover:shadow-md transition-all flex-shrink-0 self-start mt-4"
                    title="Open patient profile"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            )}

            {/* ── Mobile: Slide-in drawer overlay ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleToggle}
                            className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-sm md:hidden"
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 z-[100] w-80 h-full md:hidden"
                        >
                            {panelContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* ── Mobile: Floating toggle FAB ── */}
            {!isOpen && patient && (
                <button
                    onClick={handleToggle}
                    className="md:hidden fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-2xl bg-[#0F6B4B] text-white shadow-xl shadow-[#0F6B4B]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                    title="Open patient profile"
                >
                    <User className="w-6 h-6" />
                </button>
            )}
        </>
    );
}