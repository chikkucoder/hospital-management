import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Loader2,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { patientService } from "../../services/patientService";
import PatientAvatar from "../../components/common/PatientAvatar";
import StatusBadge from "../../components/common/StatusBadge";
import Pagination from "../../components/common/Pagination";
import ActionButtons from "../../components/common/ActionButtons";
import SearchBar from "../../components/common/SearchBar";
import FilterButton from "../../components/common/FilterButton";

// ─── Add Patient Modal ───────────────────────────────────────────
function AddPatientModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "Male",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await patientService.create({
        ...formData,
        status: "upcoming",
        lastAppointment: null,
        nextAppointment: null,
        lastVisit: "New Patient",
        lastVisitDate: new Date().toISOString(),
      });
      onAdd();
      onClose();
    } catch (err) {
      console.error("Failed to add patient", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-[#0F6B4B] text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add New Patient</h2>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
              Patient Registry Entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                Full Name
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient name"
                className="w-full h-12 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@email.com"
                className="w-full h-12 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                  Age
                </label>
                <input
                  required
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="E.g. 25"
                  className="w-full h-12 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-12 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#1F2937] focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest ml-1">
                Phone Number
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full h-12 px-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 bg-[#F7F9F8] text-[#6B7280] rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-[#0F6B4B] text-white rounded-2xl font-bold shadow-xl shadow-[#0F6B4B]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Entry
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Sort Dropdown ───────────────────────────────────────────────
function SortDropdown({ isOpen, onClose, onSelect, currentSort }) {
  if (!isOpen) return null;

  const options = [
    { value: "recent", label: "Recently Seen" },
    { value: "oldest", label: "Longest Since Visit" },
    { value: "az", label: "Alphabetical (A-Z)" },
    { value: "za", label: "Alphabetical (Z-A)" },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 z-50">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xl shadow-gray-200/50 p-2 min-w-[200px]"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onSelect(opt.value);
              onClose();
            }}
            className={cn(
              "w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors",
              currentSort === opt.value
                ? "bg-[#EAF7F0] text-[#0F6B4B]"
                : "text-[#1F2937] hover:bg-[#F7F9F8]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main PatientList Component ──────────────────────────────────
export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this patient record?")) {
      try {
        await patientService.softDelete(id);
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient", err);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedPatients.size === filteredPatients.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(filteredPatients.map((p) => p.patientId || p.id)));
    }
  };

  const toggleSelectPatient = (id) => {
    const next = new Set(selectedPatients);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedPatients(next);
  };

  // Filtering
  const filteredPatients = useMemo(() => {
    let result = patients.filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        !term ||
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.patientId && p.patientId.toLowerCase().includes(term)) ||
        (p.email && p.email.toLowerCase().includes(term)) ||
        (p.phone && p.phone.toLowerCase().includes(term))
      );
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);

      const dateA = a.lastVisitDate ? new Date(a.lastVisitDate) : new Date(0);
      const dateB = b.lastVisitDate ? new Date(b.lastVisitDate) : new Date(0);

      return sortOrder === "recent"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    return result;
  }, [patients, searchTerm, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPatients = filteredPatients.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    return timeStr || "—";
  };

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════
          Page Header
          ══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        {/* Left: Title + Subtitle */}
        <div>
          <h1 className="text-[28px] font-black text-[#06402B] tracking-tight leading-tight">
            Patients
          </h1>
          <p className="text-sm font-medium text-[#6B7280] mt-0.5">
            Manage and monitor all registered patients.
          </p>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Date dropdown */}
          <button className="h-10 px-4 flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#6B7280] hover:bg-[#F7F9F8] hover:text-[#1F2937] transition-all">
            <Calendar className="w-4 h-4" />
            All Dates
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Sort By button */}
          <div className="relative">
            <FilterButton
              label="Sort By"
              isActive={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
            />
            <AnimatePresence>
              <SortDropdown
                isOpen={isSortOpen}
                onClose={() => setIsSortOpen(false)}
                onSelect={setSortOrder}
                currentSort={sortOrder}
              />
            </AnimatePresence>
          </div>

          {/* Add New Patient button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 px-5 flex items-center gap-2 bg-[#0F6B4B] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0F6B4B]/15 hover:bg-[#0A5A3D] transition-all"
          >
            <Plus className="w-4 h-4" />
            + Add New Patient
          </motion.button>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          Add Patient Modal
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddPatientModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={fetchPatients}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          Main White Container
          ══════════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="bg-white rounded-[2rem] border border-[#E5E7EB] shadow-sm overflow-hidden"
      >
        {/* ── Search & Filter Row ── */}
        <div className="p-6 pb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Name or Patient ID, Phone, Email..."
          />
          <div className="flex items-center gap-2 flex-shrink-0">
            <FilterButton
              label="Filters"
              onClick={() => { }}
            />
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-[#0F6B4B] animate-spin" />
            <p className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">
              Loading Patient Records...
            </p>
          </div>
        ) : (
          <>
            {/* ── Patients Table ── */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    {/* Checkbox */}
                    <th className="pl-6 pr-2 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={
                          filteredPatients.length > 0 &&
                          selectedPatients.size === filteredPatients.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded-md border-[#D1D5DB] text-[#0F6B4B] focus:ring-[#0F6B4B]/20 cursor-pointer"
                      />
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Patient ID
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Patient Name
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Age / Gender
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Phone
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Last Appointment
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Next Appointment
                    </th>
                    <th className="px-3 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                      Status
                    </th>
                    <th className="px-3 pr-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#6B7280] text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {paginatedPatients.map((patient, idx) => {
                    const pid = patient.patientId || patient.id;
                    const isSelected = selectedPatients.has(pid);

                    return (
                      <motion.tr
                        key={pid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className={cn(
                          "group transition-colors",
                          isSelected
                            ? "bg-[#EAF7F0]/50"
                            : "hover:bg-[#F7F9F8]"
                        )}
                      >
                        {/* Checkbox */}
                        <td className="pl-6 pr-2 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectPatient(pid)}
                            className="w-4 h-4 rounded-md border-[#D1D5DB] text-[#0F6B4B] focus:ring-[#0F6B4B]/20 cursor-pointer"
                          />
                        </td>

                        {/* Patient ID */}
                        <td className="px-3 py-4">
                          <span className="text-xs font-bold text-[#6B7280] tracking-wider">
                            {pid}
                          </span>
                        </td>

                        {/* Patient Name + Email */}
                        <td className="px-3 py-4">
                          <Link
                            to={`/patients/${pid}`}
                            className="flex items-center gap-3 group/row"
                          >
                            <PatientAvatar
                              name={patient.name}
                              size="md"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-[#1F2937] group-hover/row:text-[#0F6B4B] transition-colors truncate">
                                {patient.name}
                              </p>
                              <p className="text-[11px] font-medium text-[#6B7280] truncate">
                                {patient.email || "—"}
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Age / Gender */}
                        <td className="px-3 py-4">
                          <div className="text-sm">
                            <span className="font-bold text-[#1F2937]">
                              {patient.age} Years
                            </span>
                            <br />
                            <span className="text-xs font-medium text-[#6B7280]">
                              {patient.gender}
                            </span>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-3 py-4">
                          <span className="text-sm font-medium text-[#6B7280]">
                            {patient.phone || "—"}
                          </span>
                        </td>

                        {/* Last Appointment */}
                        <td className="px-3 py-4">
                          {patient.lastAppointment ? (
                            <div>
                              <p className="text-sm font-bold text-[#1F2937]">
                                {formatDate(patient.lastAppointment.date)}
                              </p>
                              <p className="text-[11px] font-medium text-[#6B7280]">
                                {formatTime(patient.lastAppointment.time)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-[#6B7280]">—</span>
                          )}
                        </td>

                        {/* Next Appointment */}
                        <td className="px-3 py-4">
                          {patient.nextAppointment ? (
                            <div>
                              <p className="text-sm font-bold text-[#1F2937]">
                                {formatDate(patient.nextAppointment.date)}
                              </p>
                              <p className="text-[11px] font-medium text-[#6B7280]">
                                {formatTime(patient.nextAppointment.time)}
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-[#6B7280]">—</span>
                          )}
                        </td>

                        {/* Status Badge */}
                        <td className="px-3 py-4">
                          <StatusBadge
                            status={patient.status || "upcoming"}
                            size="md"
                          />
                        </td>

                        {/* Actions */}
                        <td className="px-3 pr-6 py-4 text-right">
                          <div className="flex items-center justify-end">
                            <ActionButtons
                              onView={() => {
                                window.location.href = `/patients/${pid}`;
                              }}
                              onEdit={() => {
                                window.location.href = `/patients/${pid}/edit`;
                              }}
                              onDelete={() => handleDelete(pid)}
                              size="md"
                            />
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>

              {/* ── Empty State ── */}
              {filteredPatients.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-[#F7F9F8] rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-[#E5E7EB]">
                    <svg className="w-10 h-10 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2937] mb-1">No patients found</h3>
                  <p className="text-sm text-[#6B7280]">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>

            {/* ── Footer Pagination ── */}
            <div className="border-t border-[#E5E7EB]">
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredPatients.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(n) => {
                  setItemsPerPage(n);
                  setCurrentPage(1);
                }}
              />
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
