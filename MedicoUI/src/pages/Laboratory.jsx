import { useState, useEffect, useMemo } from "react";
import {
   FlaskConical,
   Search,
   Plus,
   FileText,
   Upload,
   Download,
   CheckCircle2,
   Clock,
   Filter,
   MoreVertical,
   Activity,
   Layers,
   ChevronRight,
   Eye,
   User,
   Calendar,
   AlertTriangle,
   Loader2,
   ChevronLeft,
   X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/common/Button";
import { labService } from "../services/labService";
import { patientService } from "../services/patientService";
import { cn } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

const getStatusBadge = (status) => {
   switch (status) {
      case "completed":
         return { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 };
      case "in_progress":
         return { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock };
      case "pending":
         return { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertTriangle };
      default:
         return { label: status || "Unknown", className: "bg-gray-50 text-gray-600 border-gray-200", icon: FileText };
   }
};

const formatDate = (dateStr) => {
   if (!dateStr) return "";
   return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
};

const formatTime = (dateStr) =>
   new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
   });

const getInitials = (name) =>
   (name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

export default function Laboratory() {
   const [reports, setReports] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalReports, setTotalReports] = useState(0);
   const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });

   // Status change dropdown
   const [openDropdown, setOpenDropdown] = useState(null);

   // Detail modal
   const [detailReport, setDetailReport] = useState(null);

   // Toast
   const [toast, setToast] = useState(null);

   useEffect(() => {
      loadReports();
      loadStats();
   }, [currentPage, statusFilter]);

   const loadReports = async () => {
      setLoading(true);
      try {
         const params = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
         };
         if (statusFilter !== "all") params.status = statusFilter;

         const res = await labService.getAllLabReports(params);
         const data = res.data || [];
         setReports(data);
         setTotalPages(res.pagination?.totalPages || 1);
         setTotalReports(res.pagination?.totalReports || data.length);
      } catch (err) {
         console.error("Failed to load lab reports:", err);
         // Fallback: try emr service
         try {
            const { emrService } = await import("../services/emrService");
            const allPatients = await patientService.getAll();
            let allReports = [];
            for (const p of (Array.isArray(allPatients) ? allPatients : []).slice(0, 5)) {
               const r = await emrService.getReports(p.patientId || p.id);
               allReports = [...allReports, ...(Array.isArray(r) ? r : [])];
            }
            setReports(allReports);
            setTotalPages(Math.ceil(allReports.length / ITEMS_PER_PAGE));
            setTotalReports(allReports.length);
         } catch {
            setReports([]);
         }
      } finally {
         setLoading(false);
      }
   };

   const loadStats = async () => {
      try {
         const res = await labService.getLabReportsStatistics();
         const s = res.data || {};
         setStats({
            total: s.totalReports || 0,
            pending: s.pendingReports || 0,
            inProgress: s.inProgressReports || 0,
            completed: s.completedReports || 0,
         });
      } catch {
         // Use local data
         setStats({
            total: reports.length,
            pending: reports.filter((r) => r.status === "pending").length,
            inProgress: reports.filter((r) => r.status === "in_progress").length,
            completed: reports.filter((r) => r.status === "completed").length,
         });
      }
   };

   const showToast = (message, type = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
   };

   const handleStatusChange = async (reportId, newStatus) => {
      try {
         await labService.updateLabReportStatus(reportId, newStatus);
         showToast(`Status updated to ${newStatus.replace("_", " ")}`, "success");
         setOpenDropdown(null);
         loadReports();
         loadStats();
      } catch (err) {
         showToast("Failed to update status", "error");
      }
   };

   const filteredReports = useMemo(() => {
      if (!searchTerm) return reports;
      const s = searchTerm.toLowerCase();
      return reports.filter((r) => {
         const searchable =
            (r.fileName || "") +
            (r.type || "") +
            (r.category || "") +
            (r.notes || "") +
            (r.patient?.name || "") +
            (r.uploadedBy || "");
         return searchable.toLowerCase().includes(s);
      });
   }, [reports, searchTerm]);

   return (
      <div className="space-y-8">
         {/* ─── Toast ─── */}
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

         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black text-primary-dark tracking-tighter">Laboratory</h1>
               <p className="text-gray-500 font-medium">Diagnostic services and medical report center.</p>
            </div>
            <div className="flex gap-3">
               <Button className="h-14 px-8 bg-primary-dark text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary-dark/10 hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" /> Book New Test
               </Button>
            </div>
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-dark/5 group text-center">
               <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="w-7 h-7" />
               </div>
               <h3 className="text-2xl font-black text-primary-dark">{stats.total}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total Reports</p>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-dark/5 group text-center">
               <div className="w-16 h-16 bg-orange-50 rounded-[1.5rem] flex items-center justify-center text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7" />
               </div>
               <h3 className="text-2xl font-black text-primary-dark">{stats.pending}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-dark/5 group text-center">
               <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7" />
               </div>
               <h3 className="text-2xl font-black text-primary-dark">{stats.inProgress}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">In Progress</p>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-primary-dark/5 group text-center">
               <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-7 h-7" />
               </div>
               <h3 className="text-2xl font-black text-primary-dark">{stats.completed}</h3>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Completed</p>
            </div>
         </div>

         {/* Reports Table */}
         <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <h3 className="text-xl font-bold text-primary-dark tracking-tight">Diagnostic Reports</h3>
               <div className="flex gap-4 items-center flex-wrap">
                  <div className="relative group flex-1 min-w-[240px]">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                     <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by patient, report name, type..."
                        className="h-10 pl-10 pr-4 bg-gray-50 border-none rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/10 transition-all w-full font-bold"
                     />
                  </div>
                  <div className="flex gap-2">
                     {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "Pending" },
                        { key: "in_progress", label: "In Progress" },
                        { key: "completed", label: "Completed" },
                     ].map((f) => (
                        <button
                           key={f.key}
                           onClick={() => {
                              setStatusFilter(f.key);
                              setCurrentPage(1);
                           }}
                           className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              statusFilter === f.key
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

            <div className="overflow-x-auto">
               {loading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4">
                     <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading reports...</p>
                  </div>
               ) : filteredReports.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-8">
                     <FileText className="w-16 h-16 text-gray-100 mb-4" />
                     <p className="text-gray-400 font-medium">No reports found</p>
                     <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                        {searchTerm ? "Try different search terms" : "Upload reports to get started"}
                     </p>
                  </div>
               ) : (
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-gray-50/50">
                           <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Patient</th>
                           <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Report</th>
                           <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                           <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                           <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {filteredReports.map((report) => {
                           const statusBadge = getStatusBadge(report.status);
                           const StatusIcon = statusBadge.icon;
                           const patientName = report.patient?.name || report.patientName || "Unknown";
                           return (
                              <tr key={report.id || report._id} className="hover:bg-primary/5 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary-forest font-bold text-[10px]">
                                          {getInitials(patientName)}
                                       </div>
                                       <span className="font-bold text-primary-dark text-sm">{patientName}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-gray-600">
                                       {report.fileName || report.type || "Report"}
                                    </p>
                                    <p className="text-[10px] font-black text-gray-300 uppercase">
                                       {report.id || report._id || "N/A"}
                                    </p>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                       <Calendar className="w-3.5 h-3.5" />
                                       {formatDate(report.createdAt)}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="relative">
                                       <button
                                          onClick={() =>
                                             setOpenDropdown(openDropdown === (report.id || report._id) ? null : (report.id || report._id))
                                          }
                                          className={cn(
                                             "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all hover:scale-105",
                                             statusBadge.className
                                          )}
                                       >
                                          <StatusIcon className="w-3 h-3" />
                                          {statusBadge.label}
                                          <ChevronRight className="w-3 h-3 rotate-90" />
                                       </button>
                                       {openDropdown === (report.id || report._id) && (
                                          <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 min-w-[160px]">
                                             {["pending", "in_progress", "completed"]
                                                .filter((s) => s !== report.status)
                                                .map((s) => {
                                                   const sb = getStatusBadge(s);
                                                   const SI = sb.icon;
                                                   return (
                                                      <button
                                                         key={s}
                                                         onClick={() => handleStatusChange(report.id || report._id, s)}
                                                         className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-xs font-bold text-gray-600 whitespace-nowrap w-full transition-colors"
                                                      >
                                                         <SI className="w-3.5 h-3.5" />
                                                         {sb.label}
                                                      </button>
                                                   );
                                                })}
                                          </div>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                       <button
                                          onClick={() => setDetailReport(report)}
                                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                          title="View Details"
                                       >
                                          <Eye className="w-4 h-4" />
                                       </button>
                                       {report.fileUrl && (
                                          <a
                                             href={report.fileUrl}
                                             download
                                             className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                             title="Download Report"
                                          >
                                             <Download className="w-4 h-4" />
                                          </a>
                                       )}
                                       {!report.fileUrl && report.status !== "completed" && (
                                          <button
                                             onClick={() => handleStatusChange(report.id || report._id, "completed")}
                                             className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                             title="Mark Completed"
                                          >
                                             <CheckCircle2 className="w-4 h-4" />
                                          </button>
                                       )}
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
               <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                     Page {currentPage} of {totalPages} • {totalReports} total reports
                  </p>
                  <div className="flex items-center gap-2">
                     <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronLeft className="w-4 h-4" />
                     </button>
                     {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                        const pageNum = start + i;
                        if (pageNum > totalPages) return null;
                        return (
                           <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={cn(
                                 "w-9 h-9 rounded-xl text-xs font-black transition-all",
                                 currentPage === pageNum
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/20"
                              )}
                           >
                              {pageNum}
                           </button>
                        );
                     })}
                     <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            )}

            <div className="p-6 bg-primary/5 border-t border-primary/5 text-center">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {filteredReports.length} report{filteredReports.length !== 1 ? "s" : ""} shown
               </p>
            </div>
         </div>

         {/* ─── Detail Modal ─── */}
         <AnimatePresence>
            {detailReport && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
                  onClick={() => setDetailReport(null)}
               >
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.9, opacity: 0, y: 20 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8"
                  >
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                              <FileText className="w-5 h-5" />
                           </div>
                           <h3 className="text-xl font-black text-primary-dark">Report Details</h3>
                        </div>
                        <button
                           onClick={() => setDetailReport(null)}
                           className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                        >
                           <X className="w-5 h-5" />
                        </button>
                     </div>

                     <div className="space-y-4">
                        <div className="bg-gray-50 rounded-2xl p-5">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Report Name</p>
                           <p className="text-sm font-black text-gray-800">{detailReport.fileName || "N/A"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-[9px] font-bold text-gray-400">Patient</p>
                              <p className="text-sm font-black text-gray-800">
                                 {detailReport.patient?.name || detailReport.patientName || "N/A"}
                              </p>
                           </div>
                           <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-[9px] font-bold text-gray-400">Status</p>
                              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase", getStatusBadge(detailReport.status).className)}>
                                 {detailReport.status?.replace("_", " ") || "N/A"}
                              </span>
                           </div>
                           <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-[9px] font-bold text-gray-400">Date</p>
                              <p className="text-sm font-black text-gray-800">{formatDate(detailReport.createdAt)}</p>
                           </div>
                           <div className="bg-gray-50 rounded-xl p-4">
                              <p className="text-[9px] font-bold text-gray-400">Uploaded By</p>
                              <p className="text-sm font-black text-gray-800">{detailReport.uploadedBy || "N/A"}</p>
                           </div>
                        </div>
                        {detailReport.notes && (
                           <div className="bg-gray-50 rounded-2xl p-5">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Notes</p>
                              <p className="text-sm text-gray-700 font-medium">{detailReport.notes}</p>
                           </div>
                        )}
                        {detailReport.fileUrl && (
                           <div className="flex gap-3">
                              <a
                                 href={detailReport.fileUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex-1 h-12 bg-blue-600 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                              >
                                 <Eye className="w-4 h-4" /> View Report
                              </a>
                              <a
                                 href={detailReport.fileUrl}
                                 download
                                 className="flex-1 h-12 bg-gray-100 text-gray-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                              >
                                 <Download className="w-4 h-4" /> Download
                              </a>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
