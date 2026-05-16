import { useState, useEffect } from "react";
import { Search, X, Loader2, User } from "lucide-react";
import { patientService } from "../../services/emrService";

export default function PatientSelector({ isOpen, onClose, onSelect }) {
    const [search, setSearch] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const res = await patientService.getPatients({ search, limit: 20 });
                setPatients(res.data?.patients || []);
            } catch (err) {
                console.error("Failed to fetch patients:", err);
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchPatients, 300);
        return () => clearTimeout(debounce);
    }, [search, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-lg shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#06402B]">Select Patient</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        </div>
                    ) : patients.length === 0 ? (
                        <p className="text-center text-gray-400 py-8 font-medium">No patients found</p>
                    ) : (
                        patients.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => onSelect(p)}
                                className="w-full text-left p-4 rounded-2xl hover:bg-emerald-50 transition-colors flex items-center gap-4"
                            >
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold">
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{p.name}</p>
                                    <p className="text-xs text-gray-400">
                                        {p.patientId} · {p.age}Y · {p.gender}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}