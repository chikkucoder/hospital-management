import { User, Phone, AlertCircle, Search } from "lucide-react";

export default function PatientSummaryCard({ patient, onSelectClick }) {
    if (!patient) {
        return (
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5">
                <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-400 mx-auto mb-4 border-4 border-white shadow-sm">
                        <User className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-400">No Patient Selected</h2>
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Search to begin</p>
                </div>
                <button
                    onClick={onSelectClick}
                    className="w-full mt-6 py-3 text-xs font-bold text-emerald-600 border border-emerald-50 bg-emerald-50/20 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Select Patient
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-900/5">
            <div className="text-center mb-6">
                <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-700 font-black text-2xl mx-auto mb-4 border-4 border-white shadow-sm">
                    {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                </div>
                <h2 className="text-xl font-bold text-[#06402B]">{patient.name}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {patient.patientId} · {patient.age}Y · {patient.gender}
                </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Blood Group</span>
                    <span className="font-bold text-gray-900">{patient.bloodGroup || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Phone</span>
                    <span className="font-bold text-gray-900">{patient.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 font-medium">Emergency</span>
                    <span className="font-bold text-gray-900 text-xs">{patient.emergencyContact || "N/A"}</span>
                </div>
                {patient.address && (
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">Address</span>
                        <span className="font-bold text-gray-900 text-xs text-right max-w-[140px] truncate">{patient.address}</span>
                    </div>
                )}
            </div>

            <button
                onClick={onSelectClick}
                className="w-full mt-6 py-3 text-xs font-bold text-emerald-600 border border-emerald-50 bg-emerald-50/20 rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
                <Search className="w-4 h-4" />
                Change Patient
            </button>
        </div>
    );
}