import { useState } from "react";
import { 
  User, 
  History, 
  Clipboard, 
  Pill, 
  Upload, 
  Save, 
  Plus, 
  Trash2,
  FileText,
  Search,
  Activity,
  Calendar,
  Layers
} from "lucide-react";
import { Button } from "../components/common/Button";
import { cn } from "../lib/utils";

export default function EMR() {
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, name: "", dosage: "", duration: "" }
  ]);

  const addMed = () => {
    setPrescriptions([...prescriptions, { id: Date.now(), name: "", dosage: "", duration: "" }]);
  };

  const removeMed = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full min-h-[80vh]">
      {/* Left Panel: Patient Summary */}
      <aside className="xl:w-80 flex-shrink-0 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-700 font-black text-2xl mx-auto mb-4 border-4 border-white shadow-sm">
              AC
            </div>
            <h2 className="text-xl font-bold text-[#06402B]">Alice Cooper</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">P-4412 · 34Y · Female</p>
          </div>
          
          <div className="space-y-4 pt-6 border-t border-gray-50">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Blood Group</span>
              <span className="font-bold text-gray-900">A Positive</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Weight</span>
              <span className="font-bold text-gray-900">62 kg</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Height</span>
              <span className="font-bold text-gray-900">165 cm</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-black text-[#06402B] uppercase tracking-widest">Medical History</h3>
          </div>
          <div className="space-y-4">
            {[
              { date: "Mar 12, 2026", text: "Chronic Gastritis Follow-up" },
              { date: "Jan 10, 2026", text: "Standard Health Screening" },
              { date: "Nov 22, 2025", text: "Viral Fever Consultation" },
            ].map((h, i) => (
              <div key={i} className="pl-4 border-l-2 border-emerald-100 py-1">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{h.date}</p>
                <p className="text-xs font-bold text-gray-600 truncate">{h.text}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-xs font-bold text-emerald-600 border border-emerald-50 bg-emerald-50/20 rounded-xl hover:bg-emerald-50 transition-colors">
            View All Records
          </button>
        </div>
      </aside>

      {/* Center Panel: Consultation Notes */}
      <main className="flex-1 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Clipboard className="w-5 h-5" />
                 </div>
                 <h2 className="text-2xl font-bold text-[#06402B] tracking-tight">Active Consultation</h2>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <History className="w-5 h-5" />
                 </button>
                 <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <Layers className="w-5 h-5" />
                 </button>
              </div>
           </div>

           <div className="space-y-6 flex-1">
              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Symptoms & Complaints</label>
                 <textarea 
                    placeholder="Describe patient symptoms..."
                    className="w-full h-32 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none italic text-gray-600"
                 />
              </div>

              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Diagnosis & Examination Notes</label>
                 <textarea 
                    placeholder="Enter detailed clinical findings..."
                    className="w-full min-h-[250px] p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                 />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-50">
                 <button className="flex-1 h-14 bg-emerald-50 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors">
                    <Upload className="w-5 h-5" /> Attachment (Lab/Images)
                 </button>
                 <button className="flex-1 h-14 bg-[#06402B] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20 hover:scale-105 transition-transform">
                    <Save className="w-5 h-5" /> Finalize Consultation
                 </button>
              </div>
           </div>
        </div>
      </main>

      {/* Right Panel: Prescription Builder */}
      <aside className="xl:w-[400px] flex-shrink-0 space-y-6">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full bg-emerald-50/10 border-dashed border-emerald-200">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                    <Pill className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold text-[#06402B]">Prescriptions</h3>
              </div>
              <button 
                onClick={addMed}
                className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center shadow-sm border border-emerald-100 hover:scale-110 transition-transform"
              >
                 <Plus className="w-5 h-5" />
              </button>
           </div>

           <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[600px] pr-2">
              {prescriptions.map((med, index) => (
                <div key={med.id} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group relative">
                   <button 
                      onClick={() => removeMed(med.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <Trash2 className="w-3.5 h-3.5" />
                   </button>
                   <div className="space-y-3">
                      <input 
                        type="text" 
                        placeholder="Medicine Name" 
                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-[#06402B] outline-none"
                      />
                      <div className="grid grid-cols-2 gap-2">
                         <input 
                            type="text" 
                            placeholder="Dosage (e.g. 1-0-1)" 
                            className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                         />
                         <input 
                            type="text" 
                            placeholder="Duration (e.g. 5 Days)" 
                            className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                         />
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-8 pt-8 border-t border-emerald-200">
              <div className="p-4 bg-white rounded-2xl border border-emerald-100 mb-6 italic text-[10px] text-gray-400 text-center font-medium">
                 "Authorized by Medico Clinical Protocol 2.0"
              </div>
              <button className="w-full h-14 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                 <FileText className="w-5 h-5" /> Print Prescription
              </button>
           </div>
        </div>
      </aside>
    </div>
  );
}
