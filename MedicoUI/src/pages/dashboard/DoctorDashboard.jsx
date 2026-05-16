import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  UserCircle,
  Award,
  Settings,
  GraduationCap,
  Briefcase,
  Hash,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

// ─── Dummy Data ───────────────────────────────────────────────────
const DOCTOR_PROFILE = {
  name: "Dr. Alexander Smith",
  role: "GENERAL PRACTITIONER",
  qualification: "MBBS, MD (General Medicine)",
  regNo: "MCI-2018-045621",
  experience: "12 Years",
  department: "General Medicine",
  avatar: null, // uses initials fallback
};

const STATS = [
  {
    title: "Total Appointments",
    value: "28",
    trend: "up",
    trendValue: "12%",
    trendLabel: "from yesterday",
    icon: Calendar,
    color: "emerald",
  },
  {
    title: "Patients Seen",
    value: "12",
    trend: "up",
    trendValue: "8%",
    trendLabel: "from yesterday",
    icon: Users,
    color: "blue",
  },
  {
    title: "Avg. Consultation Time",
    value: "18m",
    trend: "down",
    trendValue: "2m",
    trendLabel: "from yesterday",
    icon: Clock,
    color: "orange",
  },
  {
    title: "Today's Revenue",
    value: "₹18,450",
    trend: "up",
    trendValue: "15%",
    trendLabel: "from yesterday",
    icon: IndianRupee,
    color: "purple",
  },
];

const TODAYS_SCHEDULE = [
  {
    time: "09:00 AM",
    patient: "Alice Cooper",
    age: 34,
    gender: "Female",
    reason: "Follow-up Consultation",
    status: "WAITING",
  },
  {
    time: "09:30 AM",
    patient: "John Doe",
    age: 45,
    gender: "Male",
    reason: "Diabetes Review",
    status: "ARRIVED",
  },
  {
    time: "10:00 AM",
    patient: "Sarah Miller",
    age: 28,
    gender: "Female",
    reason: "Prenatal Checkup",
    status: "IN CONSULTATION",
  },
  {
    time: "10:30 AM",
    patient: "Robert Chen",
    age: 52,
    gender: "Male",
    reason: "Cardiac Follow-up",
    status: "UPCOMING",
  },
  {
    time: "11:00 AM",
    patient: "Emily Watson",
    age: 31,
    gender: "Female",
    reason: "Skin Consultation",
    status: "UPCOMING",
  },
  {
    time: "11:30 AM",
    patient: "Michael Brown",
    age: 60,
    gender: "Male",
    reason: "Blood Pressure Check",
    status: "UPCOMING",
  },
];

// ─── Color Maps ───────────────────────────────────────────────────
const COLOR_MAP = {
  emerald: {
    iconBg: "bg-[#EAF7F0]",
    iconText: "text-[#0F6B4B]",
    trendUp: "text-[#0F6B4B]",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    trendUp: "text-blue-600",
  },
  orange: {
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    trendDown: "text-orange-600",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    trendUp: "text-purple-600",
  },
};

const STATUS_STYLES = {
  WAITING: "bg-amber-50 text-amber-700 border-amber-200",
  ARRIVED: "bg-blue-50 text-blue-700 border-blue-200",
  "IN CONSULTATION": "bg-emerald-50 text-emerald-700 border-emerald-200",
  UPCOMING: "bg-gray-50 text-gray-500 border-gray-200",
};

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ title, value, trend, trendValue, trendLabel, icon: Icon, color }) {
  const c = COLOR_MAP[color] || COLOR_MAP.emerald;
  const isUp = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow duration-300"
    >
      {/* Icon */}
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", c.iconBg, c.iconText)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Value + Title */}
      <div>
        <p className="text-2xl font-bold text-[#1F2937] tracking-tight">{value}</p>
        <p className="text-sm font-medium text-gray-500 mt-0.5">{title}</p>
      </div>

      {/* Trend */}
      <div className="flex items-center gap-1.5">
        {isUp ? (
          <ArrowUpRight className={cn("w-4 h-4", c.trendUp || "text-emerald-600")} />
        ) : (
          <ArrowDownRight className={cn("w-4 h-4", c.trendDown || "text-red-500")} />
        )}
        <span className={cn("text-sm font-semibold", isUp ? (c.trendUp || "text-emerald-600") : (c.trendDown || "text-red-500"))}>
          {isUp ? "↑" : "↓"} {trendValue}
        </span>
        <span className="text-sm text-gray-400">{trendLabel}</span>
      </div>
    </motion.div>
  );
}

// ─── Schedule Row ─────────────────────────────────────────────────
function ScheduleRow({ appointment, index }) {
  const initials = appointment.patient
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const statusStyle = STATUS_STYLES[appointment.status] || STATUS_STYLES.UPCOMING;
  const isActive = appointment.status === "WAITING" || appointment.status === "ARRIVED";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="flex items-center gap-4 py-4 px-2 hover:bg-[#F7F9F8] rounded-xl transition-colors group"
    >
      {/* Time */}
      <div className="w-[72px] flex-shrink-0">
        <p className="text-sm font-semibold text-[#1F2937]">{appointment.time.split(" ")[0]}</p>
        <p className="text-xs font-medium text-gray-400">{appointment.time.split(" ")[1]}</p>
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-[#EAF7F0] flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-[#0F6B4B]">{initials}</span>
      </div>

      {/* Patient Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1F2937] truncate">{appointment.patient}</p>
        <p className="text-xs text-gray-400">
          {appointment.age} yrs, {appointment.gender} · {appointment.reason}
        </p>
      </div>

      {/* Status Badge */}
      <span
        className={cn(
          "px-3 py-1 rounded-lg text-[11px] font-semibold border whitespace-nowrap flex-shrink-0",
          statusStyle
        )}
      >
        {appointment.status}
      </span>

      {/* Action Button */}
      {isActive ? (
        <button className="h-9 px-5 bg-[#0F6B4B] text-white rounded-xl text-xs font-semibold hover:bg-[#0a5a3d] transition-colors shadow-sm flex-shrink-0 opacity-0 group-hover:opacity-100">
          Open
        </button>
      ) : (
        <button className="h-9 px-5 bg-white border border-[#E5E7EB] text-gray-500 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
          View
        </button>
      )}
    </motion.div>
  );
}

// ─── Doctor Profile Sidebar ───────────────────────────────────────
function DoctorProfileSidebar() {
  const initials = DOCTOR_PROFILE.name
    .replace("Dr. ", "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-full xl:w-[320px] flex-shrink-0 space-y-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
      >
        {/* Top Section */}
        <div className="p-6 flex flex-col items-center text-center border-b border-[#E5E7EB]">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-[#EAF7F0] flex items-center justify-center mb-4 ring-4 ring-[#EAF7F0]/50">
            <span className="text-2xl font-bold text-[#0F6B4B]">{initials}</span>
          </div>

          <h3 className="text-lg font-bold text-[#1F2937]">{DOCTOR_PROFILE.name}</h3>
          <span className="inline-block mt-1.5 px-3 py-1 bg-[#EAF7F0] text-[#0F6B4B] text-[11px] font-semibold rounded-lg tracking-wide">
            {DOCTOR_PROFILE.role}
          </span>
        </div>

        {/* Info Grid */}
        <div className="p-5 grid grid-cols-2 gap-3">
          <div className="bg-[#F7F9F8] rounded-xl p-3.5 flex flex-col gap-1">
            <GraduationCap className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Qualification</p>
            <p className="text-xs font-semibold text-[#1F2937] leading-tight">{DOCTOR_PROFILE.qualification}</p>
          </div>
          <div className="bg-[#F7F9F8] rounded-xl p-3.5 flex flex-col gap-1">
            <Hash className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Reg. No.</p>
            <p className="text-xs font-semibold text-[#1F2937] leading-tight">{DOCTOR_PROFILE.regNo}</p>
          </div>
          <div className="bg-[#F7F9F8] rounded-xl p-3.5 flex flex-col gap-1">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Experience</p>
            <p className="text-xs font-semibold text-[#1F2937] leading-tight">{DOCTOR_PROFILE.experience}</p>
          </div>
          <div className="bg-[#F7F9F8] rounded-xl p-3.5 flex flex-col gap-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Department</p>
            <p className="text-xs font-semibold text-[#1F2937] leading-tight">{DOCTOR_PROFILE.department}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 grid grid-cols-3 gap-2">
          <Link
            to="/profile"
            className="flex flex-col items-center gap-1.5 py-3 px-2 bg-[#F7F9F8] rounded-xl hover:bg-[#EAF7F0] transition-colors group"
          >
            <UserCircle className="w-4 h-4 text-gray-400 group-hover:text-[#0F6B4B] transition-colors" />
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-[#0F6B4B] transition-colors">View Profile</span>
          </Link>
          <Link
            to="/analytics"
            className="flex flex-col items-center gap-1.5 py-3 px-2 bg-[#F7F9F8] rounded-xl hover:bg-[#EAF7F0] transition-colors group"
          >
            <Award className="w-4 h-4 text-gray-400 group-hover:text-[#0F6B4B] transition-colors" />
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-[#0F6B4B] transition-colors">My Stats</span>
          </Link>
          <Link
            to="/settings"
            className="flex flex-col items-center gap-1.5 py-3 px-2 bg-[#F7F9F8] rounded-xl hover:bg-[#EAF7F0] transition-colors group"
          >
            <Settings className="w-4 h-4 text-gray-400 group-hover:text-[#0F6B4B] transition-colors" />
            <span className="text-[10px] font-semibold text-gray-500 group-hover:text-[#0F6B4B] transition-colors">Settings</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function DoctorDashboard({ user }) {
  const name = user?.name || "Alexander Smith";
  const [selectedDate, setSelectedDate] = useState("Today");

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* ─── Left: Main Content ─── */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">Doctor's Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Hello Dr. {name}, you have <span className="font-semibold text-[#0F6B4B]">8 patients</span> remaining today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/appointments"
              className="h-10 px-5 bg-[#0F6B4B] text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#0a5a3d] transition-colors shadow-sm"
            >
              Queue
            </Link>

            {/* Date Selector */}
            <div className="relative">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-10 pl-4 pr-10 bg-white border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#1F2937] appearance-none cursor-pointer hover:border-gray-300 transition-colors outline-none focus:ring-2 focus:ring-[#0F6B4B]/20"
              >
                <option>Today</option>
                <option>Yesterday</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
        >
          {/* Schedule Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">Today's Schedule</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-9 px-3 bg-white border border-[#E5E7EB] rounded-lg text-xs font-medium text-gray-500 flex items-center gap-1.5 hover:bg-gray-50 transition-colors">
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className="h-9 w-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="h-9 w-9 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Schedule List */}
          <div className="divide-y divide-[#E5E7EB]/60 px-4">
            {TODAYS_SCHEDULE.map((appointment, i) => (
              <ScheduleRow key={i} appointment={appointment} index={i} />
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#E5E7EB] bg-[#F7F9F8]/50">
            <p className="text-xs text-gray-400 text-center">
              Showing {TODAYS_SCHEDULE.length} appointments for today
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─── Right: Doctor Profile Sidebar ─── */}
      <DoctorProfileSidebar />
    </div>
  );
}
