import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  Bell,
  Search,
  User as UserIcon,
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  FileText,
  ChevronDown,
  UserCircle,
  Menu
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";
import { cn } from "../lib/utils";
import Breadcrumbs from "./Breadcrumbs";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close sidebar on navigation for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Handle click outside profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY] },
    { name: "Patients", path: "/patients", icon: Users, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST] },
    { name: "Doctors", path: "/doctors", icon: Stethoscope, roles: [Role.ADMIN, Role.RECEPTIONIST] },
    { name: "Appointments", path: "/appointments", icon: ClipboardList, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.PATIENT] },
    { name: "EMR", path: "/emr", icon: FileText, roles: [Role.ADMIN, Role.DOCTOR] },
    { name: "Admin Panel", path: "/admin/users", icon: ShieldCheck, roles: [Role.ADMIN] },
    { name: "Settings", path: "/settings", icon: Settings, roles: [Role.ADMIN, Role.DOCTOR, Role.PATIENT] },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden">
      {/* Sidebar Backdrop for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-100 transition-all duration-300 h-full fixed md:relative inset-y-0 left-0 z-50",
          "md:translate-x-0 flex-shrink-0",
          isSidebarOpen ? "translate-x-0 w-72 shadow-2xl md:shadow-none" : "-translate-x-full md:translate-x-0 md:w-24"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            <div className={cn(
              "px-4 py-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-opacity duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0"
            )}>
              Main Menu
            </div>
            {filteredMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                  location.pathname === item.path
                    ? "bg-emerald-50 text-emerald-700 font-bold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#06402B]"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-all duration-200",
                  location.pathname === item.path ? "text-emerald-600 scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "transition-all duration-300 whitespace-nowrap",
                  isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 md:opacity-0 w-0 overflow-hidden -translate-x-4"
                )}>
                  {item.name}
                </span>

                {location.pathname === item.path && !isSidebarOpen && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-600 rounded-l-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer / User Profile Brief */}
          <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
              <span className={cn(
                "transition-all duration-300 font-bold",
                isSidebarOpen ? "opacity-100" : "opacity-0 md:opacity-0 w-0 overflow-hidden"
              )}>
                Log Out
              </span>
            </button>
            <div className={cn(
              "mt-4 px-4 text-[10px] text-gray-400 font-medium transition-opacity duration-300",
              isSidebarOpen ? "opacity-100" : "opacity-0"
            )}>
              copyright @bireenainfotech Medico 2026
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-40">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <img src="/logo.svg" alt="Medico" className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-gray-400 hover:text-[#06402B] hover:bg-emerald-50 rounded-xl transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search across Medico..."
                className="bg-gray-50 border-none rounded-2xl pl-12 pr-6 h-12 w-80 text-sm focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group">
              <Bell className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="w-px h-8 bg-gray-100" />

            {/* User Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 py-1 pr-1 group hover:bg-gray-50 rounded-2xl transition-all"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600/60">
                    {user?.role}
                  </p>
                </div>
                <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm border border-white group-hover:scale-105 transition-transform">
                  <UserIcon className="w-6 h-6" />
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isProfileOpen ? "rotate-180" : "")} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden pb-2 pt-2 z-50"
                  >
                    <div className="px-4 py-3 mb-2 border-b border-gray-50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                      <UserCircle className="w-5 h-5" />
                      <span className="font-bold">My Profile</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span className="font-bold">Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 md:p-10 flex-1 overflow-y-auto">
          {/* Breadcrumbs integrated here */}
          <Breadcrumbs />
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
