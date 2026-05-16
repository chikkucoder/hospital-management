import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  ClipboardList,
  FlaskConical,
  Pill,
  ReceiptIndianRupee,
  BarChart3,
  ShieldCheck,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Role } from "../../types";
import logoBireena from "../../assets/logobireena.png";

// ─── Constants ───────────────────────────────────────────────────
const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 80;

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY], section: "main" },
  { name: "Patients", path: "/patients", icon: Users, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST], section: "main" },
  { name: "Doctors", path: "/doctors", icon: Stethoscope, roles: [Role.ADMIN, Role.RECEPTIONIST], section: "main" },
  { name: "Appointments", path: "/appointments", icon: ClipboardList, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST], section: "main" },
  { name: "EMR", path: "/emr", icon: FileText, roles: [Role.ADMIN, Role.DOCTOR], section: "clinical" },
  { name: "Prescriptions", path: "/prescriptions", icon: Pill, roles: [Role.ADMIN, Role.DOCTOR], section: "clinical" },
  { name: "Lab Reports", path: "/reports", icon: FlaskConical, roles: [Role.ADMIN, Role.DOCTOR, Role.LAB], section: "clinical" },
  { name: "Patient History", path: "/history", icon: FileText, roles: [Role.ADMIN, Role.DOCTOR], section: "clinical" },
  { name: "Laboratory", path: "/lab", icon: FlaskConical, roles: [Role.ADMIN, Role.LAB], section: "modules" },
  { name: "Pharmacy", path: "/pharmacy", icon: Pill, roles: [Role.ADMIN, Role.PHARMACY], section: "modules" },
  { name: "Billing", path: "/billing", icon: ReceiptIndianRupee, roles: [Role.ADMIN, Role.RECEPTIONIST], section: "modules" },
  { name: "Analytics", path: "/analytics", icon: BarChart3, roles: [Role.ADMIN, Role.DOCTOR], section: "admin" },
  { name: "Admin Panel", path: "/admin/users", icon: ShieldCheck, roles: [Role.ADMIN], section: "admin" },
  { name: "Settings", path: "/settings", icon: Settings, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY], section: "system" },
];

const sectionLabels = {
  main: "Main Menu",
  clinical: "Clinical",
  modules: "Modules",
  admin: "Administration",
  system: "System",
};

// ─── Sidebar Item ────────────────────────────────────────────────
function SidebarItem({ item, isActive, isExpanded, onClick }) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
        isActive
          ? "bg-emerald-50 text-emerald-700 font-bold shadow-sm"
          : "text-gray-500 hover:bg-gray-50 hover:text-[#06402B]"
      )}
      aria-label={item.name}
      aria-current={isActive ? "page" : undefined}
    >
      <item.icon
        className={cn(
          "w-5 h-5 flex-shrink-0 transition-all duration-200",
          isActive ? "text-emerald-600 scale-110" : "group-hover:scale-110"
        )}
      />

      {/* Label */}
      <motion.span
        animate={{
          opacity: isExpanded ? 1 : 0,
          width: isExpanded ? "auto" : 0,
          marginLeft: isExpanded ? 0 : -8,
        }}
        transition={{ duration: 0.2 }}
        className="text-sm font-bold whitespace-nowrap overflow-hidden"
      >
        {item.name}
      </motion.span>

      {/* Active indicator for collapsed state */}
      {isActive && !isExpanded && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-600 rounded-l-full"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}

      {/* Tooltip on collapsed */}
      {!isExpanded && (
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-[100] shadow-lg">
          {item.name}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>
      )}
    </Link>
  );
}

// ─── Main Sidebar Component ──────────────────────────────────────
export default function Sidebar({ user, isSidebarOpen, isCollapsed, onToggleCollapse, onCloseMobile, handleLogout }) {
  const location = useLocation();
  const expanded = !isCollapsed;

  const filteredMenu = menuItems.filter((item) => user && item.roles.includes(user.role));

  // Group items by section
  const sections = {};
  filteredMenu.forEach((item) => {
    const sec = item.section || "main";
    if (!sections[sec]) sections[sec] = [];
    sections[sec].push(item);
  });

  const sidebarWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "bg-white border-r border-gray-100 h-full fixed md:sticky top-0 left-0 z-50 flex-shrink-0 overflow-hidden",
          "flex flex-col",
          // Mobile: slide in/out
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{ width: sidebarWidth }}
        aria-label="Main navigation"
      >
        {/* ─── Logo Area ─── */}
        <div className="h-20 flex items-center px-4 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={logoBireena}
              alt="BIREENA MEDICO"
              className="h-10 w-10 object-contain rounded-xl flex-shrink-0"
            />
            <motion.div
              animate={{
                opacity: expanded ? 1 : 0,
                width: expanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="font-black text-lg tracking-tighter text-[#06402B]">
                BIREENA
              </span>
              <span className="font-bold text-lg tracking-tighter text-emerald-600">
                {" "}MEDICO
              </span>
            </motion.div>
          </div>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex ml-auto p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all flex-shrink-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {Object.entries(sections).map(([sectionKey, items]) => (
            <div key={sectionKey}>
              {/* Section label */}
              <motion.div
                animate={{
                  opacity: expanded ? 1 : 0,
                  height: expanded ? "auto" : 0,
                  marginBottom: expanded ? 4 : 0,
                }}
                transition={{ duration: 0.15 }}
                className="px-4 py-1 overflow-hidden"
              >
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {sectionLabels[sectionKey] || sectionKey}
                </p>
              </motion.div>

              {items.map((item) => (
                <SidebarItem
                  key={item.path}
                  item={item}
                  isActive={location.pathname === item.path || location.pathname.startsWith(item.path + "/")}
                  isExpanded={expanded}
                  onClick={onCloseMobile}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* ─── Footer / Logout ─── */}
        <div className="p-3 border-t border-gray-50 bg-gray-50/30 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
            <motion.span
              animate={{
                opacity: expanded ? 1 : 0,
                width: expanded ? "auto" : 0,
              }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold whitespace-nowrap overflow-hidden"
            >
              Log Out
            </motion.span>
          </button>

          {/* Copyright */}
          <motion.div
            animate={{
              opacity: expanded ? 1 : 0,
              height: expanded ? "auto" : 0,
            }}
            transition={{ duration: 0.15 }}
            className="px-4 mt-3 overflow-hidden"
          >
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
              &copy; 2026 Medico
            </p>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
