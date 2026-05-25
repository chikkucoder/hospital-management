import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  User as UserIcon,
  FlaskConical,
  Pill,
} from "lucide-react";

import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";

const logoBireena = "/src/assets/logo.png";

import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("Admin");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Demo credentials for different users
  const getDemoCredentials = (selectedRole) => {
    switch (selectedRole) {
      case "Admin":
        return {
          email: "admin.medico",
          password: "medicouseradmin",
        };

      case "Doctor":
        return {
          email: "doctor.medico",
          password: "medicouserdoctor",
        };

      case "Lab Assistant":
        return {
          email: "lab.medico",
          password: "medicouserlab",
        };

      case "Appointment":
        return {
          email: "appointment.medico",
          password: "medicouserappointment",
        };

      case "Dispensory / Clinicians":
        return {
          email: "clinic.medico",
          password: "medicouserclinic",
        };

      default:
        return {
          email: "",
          password: "",
        };
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, user: authenticatedUser } = useAuth();

  useEffect(() => {
    if (authenticatedUser) {
      navigate("/dashboard");
    }
  }, [authenticatedUser, navigate]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    const creds = getDemoCredentials(selectedRole);
    setEmail(creds.email);
    setPassword(creds.password);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Role icons
  const roleIcons = {
    Admin: ShieldCheck,
    Doctor: Stethoscope,
    "Lab Assistant": FlaskConical,
    Appointment: UserIcon,
    "Dispensory / Clinicians": Pill,
  };

  const SelectedIcon = roleIcons[role];
  const demoCreds = getDemoCredentials(role);

  return (
<div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden
bg-gradient-to-br from-[#ecfff7] via-[#dffaf0] to-[#c8f5e3]
bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]
text-primary-dark">
      
      {/* HEADER / LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 mb-5 group cursor-pointer"
      >
        <Link
          to="/"
          className="transition-transform hover:-translate-y-2 duration-300"
        >
          <img
            src={logoBireena}
            alt="Logo"
            className="w-80 object-contain rounded-xl"
          />
        </Link>
      </motion.div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass rounded-[2.5rem] shadow-2xl shadow-primary-dark/5 border border-white/20 overflow-hidden"
      >
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">
            Login
          </h2>

          {/* ROLE SELECTOR */}
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full h-12 px-4 flex items-center justify-between bg-bg-primary border border-primary/10 rounded-xl hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                  <SelectedIcon className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </div>

                <span className="font-semibold text-gray-700">
                  Login Options
                </span>
              </div>

              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {/* ADMIN */}
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-bg-primary/50 border-b border-bg-primary">
                    Admin
                  </div>

                  <button
                    onClick={() => handleRoleSelect("Admin")}
                    className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-primary-forest border-b border-bg-primary"
                  >
                    Admin Portal
                  </button>

                  {/* DOCTOR */}
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-bg-primary/50 border-b border-bg-primary">
                    Doctor
                  </div>

                  <button
                    onClick={() => handleRoleSelect("Doctor")}
                    className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-primary-forest border-b border-bg-primary"
                  >
                    Doctor Portal
                  </button>

                  {/* LAB ASSISTANT */}
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-bg-primary/50 border-b border-bg-primary">
                    Lab Assistant
                  </div>

                  <button
                    onClick={() => handleRoleSelect("Lab Assistant")}
                    className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-primary-forest border-b border-bg-primary"
                  >
                    Lab Assistant Portal
                  </button>

                  {/* APPOINTMENT */}
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-bg-primary/50 border-b border-bg-primary">
                    Appointment
                  </div>

                  <button
                    onClick={() => handleRoleSelect("Appointment")}
                    className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-primary-forest border-b border-bg-primary"
                  >
                    Appointment Portal
                  </button>

                  {/* DISPENSORY / CLINICIANS */}
                  <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-bg-primary/50 border-b border-bg-primary">
                    Dispensory / Clinicians
                  </div>

                  <button
                    onClick={() =>
                      handleRoleSelect("Dispensory / Clinicians")
                    }
                    className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-primary-forest"
                  >
                    Dispensory Portal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SELECTED ROLE */}
          <p className="text-sm text-gray-500 mb-8">
            Selected Portal:{" "}
            <strong className="text-primary-dark font-bold">
              {role}
            </strong>
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ERROR */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-dark ml-1">
                Username / ID
              </label>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />

                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full h-14 pl-12 pr-4 bg-bg-primary border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans text-gray-900"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary-dark ml-1">
                Security Key
              </label>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-bg-primary border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-sans text-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-primary hover:text-primary-forest focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary-dark/20 rounded-2xl"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-bg-primary border-t border-primary/10 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600 font-medium">
            Staff access only. For new accounts, please{" "}
            <span className="text-primary-dark font-bold hover:underline cursor-pointer">
              Contact Admin
            </span>
          </p>

          {/* DEMO ACCESS */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.25em]">
              Demo Access
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              <code className="text-[10px] text-primary font-bold bg-bg-secondary px-2 py-1 rounded-md border border-primary/10">
                {demoCreds.email}
              </code>

              <code className="text-[10px] text-primary font-bold bg-bg-secondary px-2 py-1 rounded-md border border-primary/10">
                {demoCreds.password}
              </code>
            </div>
          </div>
        </div>
      </motion.div>

      {/* COPYRIGHT */}
      <div className="mt-8 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
        Copyright © 2026 Medico Health Systems | All Rights Reserved
      </div>
    </div>
  );
}