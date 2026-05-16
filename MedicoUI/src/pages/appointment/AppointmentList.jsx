import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Stethoscope,
  RefreshCw,
  CalendarDays,
  List,
  Grid3X3,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { appointmentService } from "../../services/appointmentService";
import { patientService } from "../../services/patientService";
import { authService } from "../../services/authService";
import { Button } from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ModalSystem, { ConfirmModal } from "../../components/common/ModalSystem";
import PatientCard from "../../components/common/PatientCard";
import { cn } from "../../lib/utils";

// ─── Constants ────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { key: "all", label: "All", color: "bg-gray-100 text-gray-600" },
  { key: "confirmed", label: "Confirmed", color: "bg-emerald-50 text-emerald-700" },
  { key: "pending", label: "Pending", color: "bg-amber-50 text-amber-700" },
  { key: "completed", label: "Completed", color: "bg-blue-50 text-blue-700" },
  { key: "cancelled", label: "Cancelled", color: "bg-red-50 text-red-700" },
];

const VIEWS = [
  { key: "list", label: "List", icon: List },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "compact", label: "Compact", icon: Grid3X3 },
];

const ITEMS_PER_PAGE = 8;

// ─── Calendar Mini Component ──────────────────────────────────────
function MiniCalendar({ selectedDate, onSelectDate, appointments }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth.getMonth() &&
    today.getFullYear() === currentMonth.getFullYear();

  const isSelected = (day) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === currentMonth.getMonth() &&
    selectedDate?.getFullYear() === currentMonth.getFullYear();

  const hasAppointment = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.some((a) => {
      const aDate = new Date(a.startTime || a.date);
      return aDate.toISOString().slice(0, 10) === dateStr;
    });
  };

  const handleDayClick = (day) => {
    onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-5">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-black text-[#06402B] tracking-tight">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[9px] font-black text-gray-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "aspect-square rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all relative",
                isToday(day) && "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20",
                isSelected(day) && !isToday(day) && "bg-emerald-100 text-emerald-700",
                !isToday(day) && !isSelected(day) && "hover:bg-gray-50 text-gray-700"
              )}
            >
              {day}
              {hasAppointment(day) && (
                <div
                  className={cn(
                    "w-1 h-1 rounded-full mt-0.5",
                    isToday(day) ? "bg-white" : "bg-emerald-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-3 gap-2">
        <div className="text-center">
          <p className="text-lg font-black text-[#06402B]">{appointments.filter(a => a.status === "confirmed" || a.status === "scheduled").length}</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Upcoming</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#06402B]">{appointments.filter(a => a.status === "completed").length}</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-[#06402B]">{appointments.filter(a => a.status === "pending").length}</p>
          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
        </div>
      </div>
    </div>
  );
}

// ─── Patient Quick Preview ────────────────────────────────────────
function PatientPreview({ patient, isOpen, onClose }) {
  if (!patient) return null;

  return (
    <ModalSystem isOpen={isOpen} onClose={onClose} title="Patient Preview" size="md" icon={User}>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-2xl">
            {(patient.name || "P")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h4 className="text-lg font-black text-gray-900">{patient.name || patient.patientName}</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              ID: {patient.patientId || patient.id}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-gray-500">{patient.age || "—"} yrs</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-[10px] font-bold text-gray-500">{patient.gender || patient.sex || "—"}</span>
            </div>
          </div>
        </div>

        {patient.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400" />
            {patient.phone}
          </div>
        )}
        {patient.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            {patient.email}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Link
            to={`/emr/${patient.patientId || patient.id}`}
            className="flex-1 h-10 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Start Consultation
          </Link>
          <Link
            to={`/patients/${patient.patientId || patient.id}`}
            className="flex-1 h-10 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Full Profile
          </Link>
        </div>
      </div>
    </ModalSystem>
  );
}

// ─── Book Appointment Modal ───────────────────────────────────────
function BookAppointmentModal({ isOpen, onClose, onBook }) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const p = await patientService.getAll();
      setPatients(Array.isArray(p) ? p : []);
      const allUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
      setDoctors(allUsers.filter((u) => u.role === "Doctor"));
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const startTime = `${formData.date}T${formData.time}`;
      await appointmentService.create({
        ...formData,
        startTime,
        patientName: patients.find((p) => p.patientId === formData.patientId)?.name,
        doctorName: doctors.find((d) => d.id === formData.doctorId)?.name,
      });
      onBook();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalSystem isOpen={isOpen} onClose={onClose} title="Schedule Appointment" subtitle="Resource Allocation" icon={CalendarIcon} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
            <select
              required
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id || p._id} value={p.patientId || p.id}>
                  {p.name} ({p.patientId || p.id})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinician</label>
            <select
              required
              className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  Dr. {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                required
                className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Slot</label>
              <input
                type="time"
                required
                className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultation Reason</label>
            <textarea
              className="w-full h-24 p-4 bg-gray-50 border-none rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500/20"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Describe symptoms or purpose..."
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onClose} className="flex-1 h-14 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-14 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Confirm Booking"}
          </button>
        </div>
      </form>
    </ModalSystem>
  );
}

// ─── Main Appointment List ────────────────────────────────────────
export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Patient preview
  const [previewPatient, setPreviewPatient] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Confirm cancel
  const [cancelTarget, setCancelTarget] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAll();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelClick = (app) => {
    setCancelTarget(app);
    setShowCancelConfirm(true);
  };

  const handleConfirmCancel = async () => {
    if (cancelTarget) {
      await handleStatusChange(cancelTarget.id || cancelTarget._id, "cancelled");
      setShowCancelConfirm(false);
      setCancelTarget(null);
    }
  };

  const handlePreview = async (app) => {
    try {
      const patientId = app.patientId || app.patient;
      if (patientId) {
        const p = await patientService.getById(patientId);
        setPreviewPatient(p || { name: app.patientName, patientId, id: patientId });
      } else {
        setPreviewPatient({ name: app.patientName, patientId: "N/A", id: "N/A" });
      }
      setShowPreview(true);
    } catch {
      setPreviewPatient({ name: app.patientName, patientId: app.patientId || "N/A", id: app.patientId || "N/A" });
      setShowPreview(true);
    }
  };

  // Filtering & Searching
  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => {
        const s = (a.status || "").toLowerCase();
        // Map "scheduled" to "confirmed" for filter matching
        if (statusFilter === "confirmed") return s === "confirmed" || s === "scheduled";
        return s === statusFilter;
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          (a.patientName || "").toLowerCase().includes(q) ||
          (a.doctorName || "").toLowerCase().includes(q) ||
          (a.patientId || "").toLowerCase().includes(q) ||
          (a.notes || "").toLowerCase().includes(q)
      );
    }

    // Date filter
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      result = result.filter((a) => {
        const aDate = new Date(a.startTime || a.date);
        return aDate.toISOString().slice(0, 10) === dateStr;
      });
    }

    // Sort
    result.sort((a, b) => {
      const aTime = new Date(a.startTime || a.date || 0).getTime();
      const bTime = new Date(b.startTime || b.date || 0).getTime();
      return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
    });

    return result;
  }, [appointments, statusFilter, searchQuery, selectedDate, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAppointments, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, selectedDate]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#06402B] tracking-tighter">Appointments</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
            {filteredAppointments.length} appointments · {appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length} upcoming
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAppointments}
            className="h-11 px-4 bg-white border border-gray-200 text-gray-500 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Button onClick={() => setIsModalOpen(true)} className="h-11 px-5 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-600/20">
            <Plus className="w-4 h-4" /> Book Appointment
          </Button>
        </div>
      </div>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* ─── Left: Calendar Sidebar ─── */}
        <div className="w-full xl:w-80 flex-shrink-0">
          <MiniCalendar
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(selectedDate?.toDateString() === d.toDateString() ? null : d)}
            appointments={appointments}
          />

          {/* Quick Stats */}
          <div className="mt-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-[#06402B] tracking-tight mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-xs font-bold text-emerald-700">Confirmed</span>
                <span className="text-sm font-black text-emerald-700">
                  {appointments.filter((a) => a.status === "scheduled" || a.status === "confirmed").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-xs font-bold text-amber-700">Pending</span>
                <span className="text-sm font-black text-amber-700">
                  {appointments.filter((a) => a.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-xs font-bold text-blue-700">Completed</span>
                <span className="text-sm font-black text-blue-700">
                  {appointments.filter((a) => a.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <span className="text-xs font-bold text-red-700">Cancelled</span>
                <span className="text-sm font-black text-red-700">
                  {appointments.filter((a) => a.status === "cancelled").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right: Appointments List ─── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by patient, doctor, or ID..."
                  className="w-full h-11 bg-gray-50 border-none rounded-2xl pl-11 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-50 rounded-2xl p-1">
                {VIEWS.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setViewMode(v.key)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all",
                      viewMode === v.key
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    <v.icon className="w-3.5 h-3.5" />
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="h-11 px-4 bg-gray-50 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-2 hover:bg-gray-100 transition-all"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {sortOrder === "asc" ? "Earliest" : "Latest"}
              </button>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all",
                    statusFilter === f.key
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  )}
                >
                  {f.label}
                  {f.key !== "all" && (
                    <span className="ml-1.5 opacity-70">
                      ({appointments.filter((a) => {
                        const s = (a.status || "").toLowerCase();
                        if (f.key === "confirmed") return s === "confirmed" || s === "scheduled";
                        return s === f.key;
                      }).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Appointments */}
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-white rounded-[2.5rem] border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
          ) : paginatedAppointments.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border border-gray-100">
              <CalendarIcon className="w-12 h-12 mb-4 text-gray-200" />
              <p className="font-bold text-gray-400">No appointments found</p>
              <p className="text-xs text-gray-300 mt-1">Try adjusting your filters or search</p>
            </div>
          ) : viewMode === "compact" ? (
            /* ─── Compact Grid View ─── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedAppointments.map((app, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={app.id || app._id || idx}
                  className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex flex-col items-center justify-center text-emerald-700">
                      <span className="text-[9px] font-black uppercase leading-none opacity-50">
                        {new Date(app.startTime || app.date).toLocaleString("default", { month: "short" })}
                      </span>
                      <span className="text-lg font-black">{new Date(app.startTime || app.date).getDate()}</span>
                    </div>
                    <StatusBadge status={app.status === "scheduled" ? "confirmed" : app.status} size="sm" />
                  </div>
                  <h4 className="font-black text-gray-900 text-sm truncate">{app.patientName}</h4>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5">{formatTime(app.startTime || app.date)}</p>
                  <p className="text-[10px] font-medium text-gray-400">Dr. {app.doctorName}</p>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handlePreview(app)}
                      className="flex-1 h-8 bg-gray-50 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-gray-100 transition-colors"
                    >
                      Preview
                    </button>
                    {(app.status === "scheduled" || app.status === "confirmed") && (
                      <Link
                        to={`/emr/${app.patientId || app.patient}`}
                        className="flex-1 h-8 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center hover:bg-emerald-700 transition-colors"
                      >
                        Consult
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* ─── List View ─── */
            <div className="space-y-3">
              {paginatedAppointments.map((app, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={app.id || app._id || idx}
                  className="bg-white p-5 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center gap-4 group hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 transition-all"
                >
                  {/* Date Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex flex-col items-center justify-center text-emerald-700 flex-shrink-0">
                    <span className="text-[9px] font-black uppercase tracking-tighter leading-none opacity-50">
                      {new Date(app.startTime || app.date).toLocaleString("default", { month: "short" })}
                    </span>
                    <span className="text-xl font-black">{new Date(app.startTime || app.date).getDate()}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-[#06402B] text-base truncate">{app.patientName}</h4>
                      <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 rounded-lg transition-colors group-hover:text-emerald-600">
                        ID: {app.patientId || app.patient || "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatTime(app.startTime || app.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3" />
                        Dr. {app.doctorName}
                      </span>
                      {app.notes && (
                        <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                          <FileTextIcon className="w-3 h-3" />
                          {app.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={app.status === "scheduled" ? "confirmed" : app.status} size="md" />

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handlePreview(app)}
                        className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 transition-all"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {(app.status === "scheduled" || app.status === "confirmed") && (
                        <>
                          <Link
                            to={`/emr/${app.patientId || app.patient}`}
                            className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all"
                            title="Start Consultation"
                          >
                            <Stethoscope className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleStatusChange(app.id || app._id, "completed")}
                            className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all"
                            title="Mark Complete"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelClick(app)}
                            className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-all"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {app.status === "completed" && (
                        <Link
                          to={`/history/${app.patientId || app.patient}`}
                          className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all"
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Page {currentPage} of {totalPages} · {filteredAppointments.length} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-9 px-4 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-wider hover:bg-gray-100 disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-[10px] font-black transition-all",
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-9 px-4 bg-gray-50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-wider hover:bg-gray-100 disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {isModalOpen && (
          <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBook={fetchAppointments} />
        )}
      </AnimatePresence>

      <PatientPreview patient={previewPatient} isOpen={showPreview} onClose={() => setShowPreview(false)} />

      <ConfirmModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel the appointment for ${cancelTarget?.patientName || "this patient"}? This action cannot be undone.`}
        confirmLabel="Yes, Cancel"
        cancelLabel="Keep It"
        variant="danger"
      />
    </div>
  );
}

// Small helper icon component
function FileTextIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
