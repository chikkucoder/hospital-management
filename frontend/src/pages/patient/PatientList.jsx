import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Loader2,
  X,
  Check
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { cn } from "../../lib/utils";
import { patientService } from "../../services/patientService";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";

function AddPatientModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    contact: "",
    lastVisit: "New Patient"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await patientService.create(formData);
      onAdd();
      onClose();
    } catch (err) {
      console.error("Failed to add patient", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-primary text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add New Patient</h2>
            <p className="text-primary-light/60 text-xs font-bold uppercase tracking-widest mt-1">Patient Registry Entry</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter patient name"
                className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Age</label>
                <input 
                  required
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="E.g. 25"
                  className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-primary/10 outline-none"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
              <input 
                required
                type="tel" 
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="+91 00000 00000"
                className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 h-14 bg-gray-50 text-gray-400 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-14 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> Save Entry</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent"); // "recent" or "oldest"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      console.error("Failed to fetch patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this patient record?")) {
      try {
        await patientService.softDelete(id);
        fetchPatients();
      } catch (err) {
        console.error("Failed to delete patient", err);
      }
    }
  };

  const filteredPatients = patients
    .filter(p => 
      (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase()))) && 
      (filterGender === "all" || p.gender.toLowerCase() === filterGender.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "az") {
        return a.name.localeCompare(b.name);
      }
      
      const dateA = a.lastVisitDate ? new Date(a.lastVisitDate) : new Date(0);
      const dateB = b.lastVisitDate ? new Date(b.lastVisitDate) : new Date(0);
      
      return sortOrder === "recent" 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#06402B] tracking-tight">Patients</h1>
          <p className="text-gray-500">Manage and monitor all registered patients.</p>
        </div>
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="h-12 px-6 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-600/10 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New Patient
        </Button>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <AddPatientModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={fetchPatients} 
          />
        )}
      </AnimatePresence>

      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
             <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Accessing Records...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full h-12 pl-12 pr-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 relative">
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-2"
                >
                  <select 
                    className="h-12 px-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                  >
                    <option value="all">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <select 
                    className="h-12 px-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="recent">Recently Seen</option>
                    <option value="oldest">Longest Since Visit</option>
                    <option value="az">Alphabetical (A-Z)</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "h-12 w-12 p-0 rounded-2xl border-none transition-all",
                showFilters ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-gray-50 text-gray-400 hover:bg-emerald-50"
              )}
            >
              <Filter className={cn("w-5 h-5 transition-transform", showFilters && "rotate-180")} />
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Patient</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Age/Gender</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Visit</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <Link to={`/patients/${patient.patientId || patient.id}`} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs group-hover/item:scale-110 transition-transform">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{patient.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">{patient.patientId || patient.id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {patient.age}Y · {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">
                    {patient.contact || patient.phone}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-gray-100 px-2.5 py-1 rounded-full text-gray-500 uppercase tracking-widest">
                      {patient.lastVisit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/patients/${patient.patientId || patient.id}`} className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(patient.patientId || patient.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="p-12 text-center">
               <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                  <User className="w-10 h-10 text-gray-200" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">No patients found</h3>
               <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-emerald-600">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-xl border-emerald-200 text-emerald-600 shadow-sm shadow-emerald-600/5">
              1
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-emerald-600">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
