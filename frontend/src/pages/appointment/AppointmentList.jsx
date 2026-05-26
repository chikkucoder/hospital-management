
import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { appointmentService } from "../../services/appointmentService";
import { patientService } from "../../services/patientService";
import { authService } from "../../services/authService";
import { Button } from "../../components/common/Button";
import { cn } from "../../lib/utils";

function BookAppointmentModal({ isOpen, onClose, onBook }) {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: ""
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const p = await patientService.getAll();
      setPatients(p);
      // In a real app we'd fetch actual doctor users
      const allUsers = JSON.parse(localStorage.getItem("medico_registered_users") || "[]");
      setDoctors(allUsers.filter(u => u.role === "Doctor"));
    };
    if (isOpen) fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const startTime = `${formData.date}T${formData.time}`;
      await appointmentService.create({
        ...formData,
        startTime,
        patientName: patients.find(p => p.patientId === formData.patientId)?.name,
        doctorName: doctors.find(d => d.id === formData.doctorId)?.name
      });
      onBook();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-8 bg-primary text-white">
          <h2 className="text-2xl font-bold tracking-tight">Schedule Appointment</h2>
          <p className="text-primary-light/60 text-[10px] font-black uppercase tracking-widest mt-1">Resource Allocation</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Patient</label>
              <select required className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none" value={formData.patientId} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.patientId}>{p.name} ({p.patientId})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Clinician</label>
              <select required className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none" value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                 <input type="date" required className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time Slot</label>
                 <input type="time" required className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
               </div>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultation Reason</label>
               <textarea className="w-full h-24 p-4 bg-gray-50 border-none rounded-xl text-sm outline-none resize-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Describe symptoms or purpose..." />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button type="button" onClick={onClose} className="flex-1 h-14 bg-gray-50 text-gray-400 rounded-2xl font-bold">Cancel</button>
             <button type="submit" disabled={isSubmitting} className="flex-[2] h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Confirm Booking"}
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(a => filter === "all" || a.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary-dark tracking-tighter italic">Clinical Queue</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Appointments & Consultations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-12 px-6 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Book Appointment
        </Button>
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-gray-50 w-max overflow-x-auto">
         {["all", "scheduled", "completed", "cancelled"].map(f => (
           <button 
             key={f}
             onClick={() => setFilter(f)}
             className={cn(
               "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
               filter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:bg-gray-50"
             )}
           >
             {f}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filteredAppointments.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border border-gray-100 italic text-gray-400">
             <CalendarIcon className="w-12 h-12 mb-4 opacity-10" />
             <p className="font-bold">No appointments found matching your criteria.</p>
          </div>
        ) : (
          filteredAppointments.map((app, idx) => (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               key={app.id} 
               className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row md:items-center gap-6 group hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex flex-col items-center justify-center text-primary-dark">
                 <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-50">{new Date(app.startTime).toLocaleString('default', { month: 'short' })}</span>
                 <span className="text-xl font-black">{new Date(app.startTime).getDate()}</span>
              </div>

              <div className="flex-1 space-y-1">
                 <div className="flex items-center gap-2">
                   <h4 className="font-black text-primary-dark text-lg">{app.patientName}</h4>
                   <span className="px-2 py-0.5 bg-gray-50 text-[9px] font-black text-gray-400 rounded transition-colors group-hover:text-primary">ID: {app.patientId}</span>
                 </div>
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs font-bold text-gray-400 italic">
                    <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> Dr. {app.doctorName}</span>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <div className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    app.status === 'scheduled' ? "bg-amber-50 text-amber-600" :
                    app.status === 'completed' ? "bg-emerald-50 text-emerald-600" :
                    "bg-red-50 text-red-600"
                 )}>
                    {app.status}
                 </div>
                 
                 <div className="flex gap-1">
                    {app.status === 'scheduled' && (
                       <>
                         <button onClick={() => handleStatusChange(app.id, 'completed')} className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm"><CheckCircle2 className="w-5 h-5" /></button>
                         <button onClick={() => handleStatusChange(app.id, 'cancelled')} className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors shadow-sm"><XCircle className="w-5 h-5" /></button>
                       </>
                    )}
                 </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && <BookAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onBook={fetchAppointments} />}
      </AnimatePresence>
    </div>
  );
}
