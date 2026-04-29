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
  Menu,
  X,
  Plus,
  ArrowRight,
  ClipboardList,
  FlaskConical,
  Pill,
  ReceiptIndianRupee,
  BarChart3,
  ShieldCheck,
  FileText,
  ChevronDown,
  UserCircle
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";
import { cn } from "../lib/utils";
import Breadcrumbs from "./Breadcrumbs";
const logoBireena = "/src/assets/logobireena.jpeg";

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
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST, Role.LAB, Role.PHARMACY] },
    { name: "Patients", path: "/patients", icon: Users, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST] },
    { name: "Doctors", path: "/doctors", icon: Stethoscope, roles: [Role.ADMIN, Role.RECEPTIONIST] },
    { name: "Appointments", path: "/appointments", icon: ClipboardList, roles: [Role.ADMIN, Role.DOCTOR, Role.RECEPTIONIST] },
    { name: "EMR", path: "/emr", icon: FileText, roles: [Role.ADMIN, Role.DOCTOR] },
    { name: "Laboratory", path: "/lab", icon: FlaskConical, roles: [Role.ADMIN, Role.LAB, Role.DOCTOR] },
    { name: "Pharmacy", path: "/pharmacy", icon: Pill, roles: [Role.ADMIN, Role.PHARMACY, Role.DOCTOR] },
    { name: "Billing", path: "/billing", icon: ReceiptIndianRupee, roles: [Role.ADMIN, Role.RECEPTIONIST] },
    { name: "Analytics", path: "/analytics", icon: BarChart3, roles: [Role.ADMIN] },
    { name: "Admin Panel", path: "/admin/users", icon: ShieldCheck, roles: [Role.ADMIN] },
    { name: "Settings", path: "/settings", icon: Settings, roles: [Role.ADMIN, Role.DOCTOR] },
  ];

  const filteredMenu = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="h-screen bg-bg-primary flex overflow-hidden">
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
          "bg-bg-secondary/70 backdrop-blur-xl border-r border-primary/10 transition-all duration-300 h-full fixed md:relative inset-y-0 left-0 z-50 w-72 flex-shrink-0",
          !isSidebarOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-primary/10 flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group transition-transform hover:-translate-y-1">
              <img src={logoBireena} alt="Logo" className="w-60 object-contain rounded-xl" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
             <div className="px-4 py-2 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Main Menu
             </div>
            {filteredMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary-forest font-bold shadow-sm border border-primary/5 backdrop-blur-sm" 
                    : "text-gray-500 hover:bg-primary/5 hover:text-primary-dark hover:translate-x-1"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-all duration-300",
                  location.pathname === item.path ? "text-primary scale-110" : "group-hover:scale-110 group-hover:text-primary"
                )} />
                <span className="transition-all duration-300 whitespace-nowrap">
                  {item.name}
                </span>
                
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" 
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer / User Profile Brief */}
          <div className="p-4 border-t border-primary/10 bg-primary/5 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50/50 hover:backdrop-blur-sm rounded-2xl transition-all group"
            >
              <LogOut className="w-5 h-5 flex-shrink-0 group-hover:rotate-180 transition-transform duration-500" />
              <span className="transition-all duration-300 font-bold">
                Log Out
              </span>
            </button>
            <div className="mt-4 px-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Copyright © 2026 Medico Health Systems
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-bg-secondary/40 backdrop-blur-2xl border-b border-primary/10 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-40 shadow-sm shadow-primary-dark/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-gray-400 hover:text-primary-dark hover:bg-primary/5 rounded-xl transition-all md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search across Medico..." 
                className="bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-2xl pl-12 pr-6 h-12 w-80 text-sm focus:ring-4 focus:ring-primary/10 focus:bg-white/80 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative group">
              <Bell className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="w-px h-8 bg-gray-100" />
            
            {/* User Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 py-1 pr-1 group hover:bg-bg-primary rounded-2xl transition-all"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-primary-dark group-hover:text-primary transition-colors uppercase tracking-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-primary/60">
                    {user?.role}
                  </p>
                </div>
                <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center text-primary-forest shadow-sm border border-white group-hover:scale-105 transition-transform">
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
