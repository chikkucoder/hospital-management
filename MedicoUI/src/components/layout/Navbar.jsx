import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  User as UserIcon,
  Menu,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import NotificationCenter from "./NotificationCenter";

export default function Navbar({
  user,
  isSidebarOpen,
  onToggleSidebar,
  handleLogout,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAvailable, setIsAvailable] = useState(() => {
    return localStorage.getItem("medico_doctor_available") !== "false";
  });
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleAvailability = () => {
    const next = !isAvailable;
    setIsAvailable(next);
    localStorage.setItem("medico_doctor_available", String(next));
  };

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = 3; // Could be dynamic

  return (
    <header className="sticky top-0 z-40 h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 flex items-center justify-between px-4 md:px-8 flex-shrink-0 shadow-sm shadow-gray-900/[0.02]">
      {/* ─── Left Section ─── */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="p-2.5 text-gray-400 hover:text-[#06402B] hover:bg-emerald-50 rounded-xl transition-all"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global search */}
        <div className="relative group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, records, medicines..."
            className="bg-gray-50 border-none rounded-2xl pl-11 pr-6 h-11 w-64 lg:w-80 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none placeholder:text-gray-300"
            aria-label="Global search"
          />
        </div>
      </div>

      {/* ─── Right Section ─── */}
      <div className="flex items-center gap-2 md:gap-5">
        {/* Availability Toggle (Doctor only) */}
        {(user?.role === "DOCTOR" || user?.role === "Doctor") && (
          <button
            onClick={toggleAvailability}
            className={cn(
              "hidden sm:flex items-center gap-2 h-10 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
              isAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                : "bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
            )}
            title={isAvailable ? "You are available for appointments" : "You are currently unavailable"}
          >
            <Circle className={cn("w-2 h-2", isAvailable ? "fill-emerald-500 text-emerald-500" : "fill-red-400 text-red-400")} />
            {isAvailable ? "Available" : "Unavailable"}
          </button>
        )}

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={cn(
              "p-2.5 rounded-xl transition-all relative group",
              isNotificationsOpen
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
            )}
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                className={cn(
                  "absolute top-2 right-2 min-w-[18px] h-[18px] rounded-full text-[9px] font-black flex items-center justify-center border-2",
                  isNotificationsOpen
                    ? "bg-white text-emerald-600 border-emerald-600"
                    : "bg-red-500 text-white border-white"
                )}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationCenter
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            role={user?.role}
          />
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-100 hidden sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 py-1 pr-1 group hover:bg-gray-50 rounded-2xl transition-all"
            aria-label="User menu"
            aria-expanded={isProfileOpen}
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight leading-tight">
                {user?.name || "User"}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-black text-emerald-600/60">
                {user?.role || "Staff"}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shadow-sm border border-white group-hover:scale-105 transition-transform flex-shrink-0">
              <UserIcon className="w-5 h-5" />
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gray-400 transition-transform hidden sm:block",
                isProfileOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    {user?.role || "Staff"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span className="font-bold">My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-bold">Settings</span>
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="font-bold">Help & Support</span>
                  </Link>
                </div>

                <div className="border-t border-gray-50 py-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
