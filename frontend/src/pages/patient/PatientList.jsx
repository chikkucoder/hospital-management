import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  X,
  Check,
  Users,
  UserCheck,
  UserPlus,
  Clock,
  FileText,
  Calendar,
  MoreHorizontal,
  ArrowUpDown,
  List,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { cn } from "../../lib/utils";
import { patientService } from "../../services/patientService";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { AddPatientModal } from "./AddPatient";

/* ─────────────────────────────────────────────
    PATIENT LIST PAGE
  ───────────────────────────────────────────── */
export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // table | grid
  const [currentPage, setCurrentPage] = useState(1);

  const patientsPerPage = 10;

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
    if (
      window.confirm("Are you sure you want to deactivate this patient record?")
    ) {
      try {
        await patientService.softDelete(id);
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient", err);
      }
    }
  };

  const filteredPatients = patients
    .filter(
      (p) =>
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.patientId &&
            p.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ((p.phone || p.contact) &&
            (p.phone || p.contact)
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (p.email &&
            p.email.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterGender === "all" || p.gender?.toLowerCase() === filterGender) &&
        (filterStatus === "all" ||
          (p.status || "active").toLowerCase() === filterStatus) &&
        (filterDoctor === "all" || p.doctor === filterDoctor),
    )
    .sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      const dateA = a.lastVisitDate ? new Date(a.lastVisitDate) : new Date(0);
      const dateB = b.lastVisitDate ? new Date(b.lastVisitDate) : new Date(0);
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

  // pagination
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const startIndex = (currentPage - 1) * patientsPerPage;

  const endIndex = startIndex + patientsPerPage;

  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  // this is for stats
  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (p) => (p.status || "active").toLowerCase() === "active",
  ).length;

  const newThisWeek = patients.filter((p) => {
    if (!p.createdAt) return false;

    const created = new Date(p.createdAt);
    const now = new Date();

    const diffTime = now - created;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  }).length;

  const followUpsDue = patients.filter(
    (p) => (p.status || "").toLowerCase() === "follow-up due",
  ).length;

  const reportsThisWeek = patients.filter((p) => {
    if (!p.lastVisitDate) return false;

    const visit = new Date(p.lastVisitDate);
    const now = new Date();

    const diffTime = now - visit;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  }).length;

  const activePercentage =
    totalPatients > 0 ? ((activePatients / totalPatients) * 100).toFixed(1) : 0;

  const newThisWeekPercentage =
    totalPatients > 0 ? ((newThisWeek / totalPatients) * 100).toFixed(1) : 0;

  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      sub: "All time",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Patients",
      value: activePatients,
      sub: `${activePercentage}% of total`,
      icon: UserCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "New This Week",
      value: newThisWeek,
      sub: `${newThisWeekPercentage}% from last week`,
      icon: UserPlus,
      color: "text-purple-600",
      bg: "bg-purple-50",
      highlight: true,
    },
    {
      label: "Follow-ups Due",
      value: followUpsDue,
      sub: "View follow-up list",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
      link: true,
    },
    {
      label: "Reports This Week",
      value: reportsThisWeek,
      sub: "View reports",
      icon: FileText,
      color: "text-rose-500",
      bg: "bg-rose-50",
      link: true,
    },
  ];

  const StatusBadge = ({ status }) => {
    const s = (status || "active").toLowerCase();
    const map = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      "follow-up due": "bg-orange-50 text-orange-600 border-orange-200",
      inactive: "bg-gray-100 text-gray-500 border-gray-200",
    };
    return (
      <span
        className={cn(
          "text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize",
          map[s] || map.active,
        )}
      >
        {s === "follow-up due"
          ? "Follow-up Due"
          : s.charAt(0).toUpperCase() + s.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View and manage all registered patients.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              12 May 2025 - 18 May 2025
              <ChevronRight className="w-3.5 h-3.5 rotate-90" />
            </div> */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="h-9 px-4 bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-emerald-800 active:scale-95 transition-all shadow-lg shadow-emerald-700/20"
          >
            <Plus className="w-4 h-4" /> Add New Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-md transition-shadow"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                s.bg,
              )}
            >
              <s.icon className={cn("w-5 h-5", s.color)} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">
                {s.value}
              </p>
              <p
                className={cn(
                  "text-[11px] mt-0.5",
                  s.link
                    ? "text-emerald-600 cursor-pointer hover:underline"
                    : s.highlight
                      ? "text-emerald-600"
                      : "text-gray-400",
                )}
              >
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 text-emerald-600 animate-spin" />
            <p className="text-sm font-medium text-gray-400">
              Loading patients...
            </p>
          </div>
        ) : (
          <>
            {/* Filters bar */}
            <div className="p-4 border-b border-gray-50 flex flex-col gap-3">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search by name, phone, email or ID..."
                    className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter dropdowns */}
                <select
                  className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white "
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  <option value="all">All Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select
                  className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="follow-up due">Follow-up Due</option>
                  <option value="">Emergency</option>
                </select>
                <select
                  className="h-9 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                >
                  <option value="all">All Doctors</option>
                </select>

                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterGender("all");
                    setFilterStatus("all");
                    setFilterDoctor("all");
                    setCurrentPage(1);
                  }}
                  className="h-9 px-4 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors active:scale-95"
                >
                  Reset
                </button>
                {/* <div className="ml-auto flex items-center gap-2">
                  <button className="h-9 px-4 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors">
                    Apply Filters
                  </button>
                </div> */}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredPatients.length)} of{" "}
                  {filteredPatients.length} patients
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 mr-1">Sort by:</span>
                  <select
                    className="h-7 px-2 border border-gray-200 rounded-md text-xs text-gray-600 focus:outline-none bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="recent">Last Visit</option>
                    <option value="oldest">Oldest Visit</option>
                    <option value="az">Name A-Z</option>
                  </select>

                  {/* for view */}
                  {/* <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-1.5 transition-colors",
                        viewMode === "list"
                          ? "bg-emerald-600 text-white"
                          : "text-gray-400 hover:bg-gray-50",
                      )}
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={cn(
                        "p-1.5 transition-colors",
                        viewMode === "table"
                          ? "bg-emerald-600 text-white"
                          : "text-gray-400 hover:bg-gray-50",
                      )}
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-1.5 transition-colors",
                        viewMode === "grid"
                          ? "bg-emerald-600 text-white"
                          : "text-gray-400 hover:bg-gray-50",
                      )}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    {/* <th className="px-4 py-3 w-8">
                        <input type="checkbox" className="rounded border-gray-300 text-emerald-600" />
                        </th> */}
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Patient <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Age / Gender
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Contact <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Last Visit <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      <button className="flex items-center gap-1 hover:text-gray-700">
                        Doctor <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50/60 transition-colors group"
                    >
                      {/* <td className="px-4 py-3.5">
                          <input type="checkbox" className="rounded border-gray-300 text-emerald-600" />
                          </td> */}
                      <td className="px-4 py-3.5">
                        <Link
                          to={`/patients/${patient.patientId || patient.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {patient.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors leading-tight">
                              {patient.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              PID: {patient.patientId || patient.id}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {patient.age} Years
                        <br />
                        <span className="text-[11px] text-gray-400">
                          {patient.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-gray-700">
                          {patient.contact || patient.phone}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {patient.email}
                        </p>
                      </td>
                      <td className="px-4  py-3.5">
                        <p className="text-sm text-gray-700">
                          {patient.lastVisit ||
                            new Date(
                              patient.lastVisitDate || patient.registrationDate,
                            ).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {patient.lastVisitTime
                            ? patient.lastVisitTime
                            : patient.registrationDate?.includes("T")
                              ? new Date(
                                  patient.registrationDate,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "--"}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-gray-700">
                          {patient.doctor || "—"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {patient.specialty}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={patient.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/patients/${patient.patientId || patient.id}`}
                            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(patient.patientId || patient.id)
                            }
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPatients.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <User className="w-7 h-7 text-gray-200" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    No patients found
                  </h3>
                  <p className="text-xs text-gray-400">
                    Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {currentPatients.length} of {filteredPatients.length}{" "}
                patients
              </p>

              <div className="flex gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border transition-colors",
                        currentPage === page
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600",
                      )}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <AddPatientModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={fetchPatients}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
