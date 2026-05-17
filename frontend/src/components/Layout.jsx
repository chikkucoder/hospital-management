import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Bell, 
  Search,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  LogOut
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";
import Breadcrumbs from "./Breadcrumbs";
import Sidebar from "./layout/Sidebar";

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

      {/* Sidebar Component */}
      <Sidebar user={user} isSidebarOpen={isSidebarOpen} handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 flex-shrink-0 z-40 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 text-gray-400 hover:text-[#06402B] hover:bg-emerald-50 rounded-xl transition-all md:hidden"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-6 h-12 w-80 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative group">
              <Bell className="w-6 h-6 group-hover:animate-bounce" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="w-px h-8 bg-gray-200" />
            
            {/* User Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 py-1 pr-1 group hover:bg-gray-50 rounded-2xl transition-all"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-600">
                    {user?.role || "Guest"}
                  </p>
                </div>
                <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100 group-hover:scale-105 transition-transform">
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
                     <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">
                        <UserCircle className="w-5 h-5" />
                        <span className="font-bold">Settings</span>
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
          <Breadcrumbs />
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
