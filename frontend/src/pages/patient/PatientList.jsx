import { useState } from "react";
import { 
  Search, 
  Plus, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { cn } from "../../lib/utils";

const MOCK_PATIENTS = [
  { id: "P-4412", name: "Alice Cooper", age: 34, gender: "Female", contact: "+1 234-567-8901", lastVisit: "2026-04-12" },
  { id: "P-4413", name: "Bob Marley", age: 45, gender: "Male", contact: "+1 345-678-9012", lastVisit: "2026-04-20" },
  { id: "P-4414", name: "Charlie Sheen", age: 52, gender: "Male", contact: "+1 456-789-0123", lastVisit: "2026-03-28" },
  { id: "P-4415", name: "Diana Ross", age: 28, gender: "Female", contact: "+1 567-890-1234", lastVisit: "2026-04-15" },
  { id: "P-4416", name: "Elvis Presley", age: 60, gender: "Male", contact: "+1 678-901-2345", lastVisit: "2026-04-21" },
];

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");

  const filteredPatients = MOCK_PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (filterGender === "all" || p.gender.toLowerCase() === filterGender.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#06402B] tracking-tight">Patients</h1>
          <p className="text-gray-500">Manage and monitor all registered patients.</p>
        </div>
        <Button className="h-12 px-6 rounded-2xl flex items-center gap-2 shadow-xl shadow-emerald-600/10 transition-transform active:scale-95">
          <Plus className="w-5 h-5" /> Add New Patient
        </Button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
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
          <div className="flex gap-2">
            <select 
              className="h-12 px-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <Button variant="outline" className="h-12 w-12 p-0 rounded-2xl border-none bg-gray-50 hover:bg-emerald-50">
              <Filter className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
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
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{patient.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold tracking-wider">{patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {patient.age}Y · {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">
                    {patient.contact}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-gray-100 px-2.5 py-1 rounded-full text-gray-500 uppercase tracking-widest">
                      {patient.lastVisit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
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
            Showing {filteredPatients.length} of {MOCK_PATIENTS.length} patients
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
      </div>
    </div>
  );
}
