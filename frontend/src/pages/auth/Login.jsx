import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle, 
  ChevronDown, 
  ShieldCheck, 
  Stethoscope,
  User as UserIcon
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

export default function Login() {
  const [role, setRole] = useState("Admin");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Set demo credentials based on role
  const getDemoCredentials = (selectedRole) => {
    switch(selectedRole) {
      case "Admin": return { email: "admin.medico", password: "medicouseradmin" };
      case "Doctor": return { email: "doctor.medico", password: "medicouserdoctor" };
      case "Patient": return { email: "patient.medico", password: "medicouserpatient" };
      case "Receptionist": return { email: "receptionist.medico", password: "medicouserreceptionist" };
      default: return { email: "", password: "" };
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
    setShowDropdown(false);
    // Remove auto-fill logic as per user request
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

  const roleIcons = {
    Admin: ShieldCheck,
    Doctor: Stethoscope,
    Patient: UserIcon,
    Receptionist: Mail
  };

  const SelectedIcon = roleIcons[role];
  const demoCreds = getDemoCredentials(role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative text-[#06402B]">
      
      {/* Header / Logo Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="w-16 h-16">
          <img src="/logo.svg" alt="Medico Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Medico</h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">Login</h2>

          {/* Role Dropdown */}
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full h-12 px-4 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-500 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <SelectedIcon className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <span className="font-semibold text-gray-700">Login Options</span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  {["Admin", "Doctor", "Patient", "Receptionist"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleRoleSelect(opt)}
                      className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors flex items-center gap-3 font-medium text-gray-600 hover:text-emerald-700 border-b border-gray-50 last:border-0"
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-sm text-gray-500 mb-8">
            Selected Portal: <strong className="text-emerald-900 font-bold">{role}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-800 ml-1">Username / ID</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-emerald-800 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-sans text-gray-900"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600 hover:text-emerald-700 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-bold shadow-xl shadow-emerald-600/20 rounded-2xl"
            >
              {isSubmitting ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600 font-medium">
            New staff member?{" "}
            <Link to="/register" className="text-emerald-900 font-bold hover:underline cursor-pointer">
              Create Account
            </Link>
          </p>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.25em]">Demo Access</p>
            <div className="flex gap-4">
               <code className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-1 rounded-md border border-gray-100">{demoCreds.email}</code>
               <code className="text-[10px] text-emerald-600 font-bold bg-white px-2 py-1 rounded-md border border-gray-100">{demoCreds.password}</code>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-8 text-gray-400 text-xs font-medium tracking-tight">
        copyright @bireenainfotech Medico 2026
      </div>
    </div>
  );
}
