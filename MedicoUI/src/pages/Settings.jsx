import React, { useState } from "react";
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Lock, 
  Stethoscope, 
  GraduationCap, 
  Clock, 
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Activity
} from "lucide-react";
import { motion } from "motion/react";
import { Role } from "../types";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";

export default function Settings() {
  const user = JSON.parse(localStorage.getItem("medico_session") || "{}");
  const [activeTab, setActiveTab] = useState(user.role === Role.DOCTOR ? "clinical" : "general");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    specialization: user.specialization || "Senior Resident",
    qualification: user.qualification || "MBBS, MD (General Medicine)",
    experience: user.experience || "8 Years",
    bio: user.bio || "Dedicated clinical professional with a focus on comprehensive patient care and healthcare optimization.",
    availability: user.availability || "Mon - Fri, 09:00 - 17:00",
    notificationSettings: {
      appointments: true,
      labResults: true,
      inventory: true,
      system: true
    },
    twoFactor: false
  });

  const toggleNotification = (key) => {
    setFormData({
      ...formData,
      notificationSettings: {
        ...formData.notificationSettings,
        [key]: !formData.notificationSettings[key]
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      // Persist to local storage
      const session = JSON.parse(localStorage.getItem("medico_session") || "{}");
      const updatedUser = { ...session, ...formData };
      localStorage.setItem("medico_session", JSON.stringify(updatedUser));
      
      // Also update in registered users list if needed
      const registeredUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
      const updatedList = registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem("medico_registered_users", JSON.stringify(updatedList));

      setIsSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  if (user.role === Role.DOCTOR) {
    tabs.unshift({ id: "clinical", label: "Clinical Profile", icon: Stethoscope });
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-primary-dark tracking-tighter italic">System Settings</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Global Configuration • {user.role}</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full xl:w-72 flex-shrink-0">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm h-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all mb-1",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-primary"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 md:p-12">
            <div className="max-w-3xl">
              {activeTab === "clinical" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-primary-dark tracking-tight mb-2">Practice Details</h2>
                    <p className="text-gray-400 text-sm font-medium italic">Update your professional credentials and clinical focus.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                      <div className="relative">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <input 
                          type="text" 
                          value={formData.specialization}
                          onChange={e => setFormData({...formData, specialization: e.target.value})}
                          className="w-full h-14 pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Experience</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                        <input 
                          type="text" 
                          value={formData.experience}
                          onChange={e => setFormData({...formData, experience: e.target.value})}
                          className="w-full h-14 pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Qualifications</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <input 
                        type="text" 
                        value={formData.qualification}
                        onChange={e => setFormData({...formData, qualification: e.target.value})}
                        className="w-full h-14 pl-12 pr-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Practice Bio</label>
                    <textarea 
                      rows={4}
                      value={formData.bio}
                      onChange={e => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-6 bg-gray-50 border-none rounded-[2rem] text-sm font-medium italic text-gray-600 outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "general" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-primary-dark tracking-tight mb-2">Account Registry</h2>
                    <p className="text-gray-400 text-sm font-medium italic">Basic details associated with your Medico login.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full h-14 px-6 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={formData.email}
                        className="w-full h-14 px-6 bg-gray-100 border-none rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-primary-dark tracking-tight mb-2">Access Security</h2>
                    <p className="text-gray-400 text-sm font-medium italic">Protect your clinical data with advanced authentication.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between border border-transparent hover:border-emerald-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                             <Shield className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-primary-dark">Two-Factor Authentication</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Highly Recommended</p>
                          </div>
                       </div>
                       <button 
                        onClick={() => setFormData({...formData, twoFactor: !formData.twoFactor})}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          formData.twoFactor ? "bg-emerald-600" : "bg-gray-200"
                        )}
                       >
                         <div className={cn(
                           "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                           formData.twoFactor ? "left-7" : "left-1"
                         )} />
                       </button>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between border border-transparent hover:border-blue-100 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                             <Lock className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-primary-dark">Password Management</p>
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last changed 3 months ago</p>
                          </div>
                       </div>
                       <button className="px-6 py-2 bg-white text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-blue-50 hover:bg-blue-50 transition-all">Change</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-black text-primary-dark tracking-tight mb-2">Notification Center</h2>
                    <p className="text-gray-400 text-sm font-medium italic">Configure which activities trigger in-app alerts.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "appointments", label: "Appointment Requests", desc: "Alerts for new, modified or cancelled consultations.", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
                      { key: "labResults", label: "Lab Result Alerts", desc: "Notifications when diagnostic reports are uploaded.", icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                      { key: "inventory", label: "Low Stock Warnings", desc: "Critical alerts for pharmacy inventory levels.", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
                      { key: "system", label: "System Maintenance", desc: "Updates about platform upgrades and feature releases.", icon: SettingsIcon, color: "text-emerald-600", bg: "bg-emerald-50" }
                    ].map((item) => (
                      <div key={item.key} className="p-6 bg-gray-50 rounded-[2rem] flex items-center justify-between border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.bg, item.color)}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-primary-dark">{item.label}</p>
                            <p className="text-xs font-medium text-gray-400 italic">{item.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleNotification(item.key)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all relative",
                            formData.notificationSettings[item.key] ? "bg-primary" : "bg-gray-200"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                            formData.notificationSettings[item.key] ? "left-7" : "left-1"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div>
                   {success && (
                     <div className="flex items-center gap-2 text-emerald-600 font-bold animate-in fade-in slide-in-from-left-4">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm">Configuration Persisted!</span>
                     </div>
                   )}
                </div>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-16 px-12 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? "Persisting..." : "Save Configuration"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
