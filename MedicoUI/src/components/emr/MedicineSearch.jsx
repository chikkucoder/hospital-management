import { useState, useRef, useEffect } from "react";
import { Search, Pill, X, Check } from "lucide-react";
import { emrService } from "../../services/emrService";
import { cn } from "../../lib/utils";

export default function MedicineSearch({ onSelect, selectedMedicines = [], onRemove }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (value) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!value.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            const data = await emrService.searchMedicines(value);
            setResults(data);
            setIsOpen(true);
            setLoading(false);
        }, 250);
    };

    const handleSelect = (medicine) => {
        onSelect({
            name: medicine.name,
            dosage: medicine.defaultDosage || "",
            duration: medicine.defaultDuration || "",
            frequency: "BD",
            instructions: "",
        });
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Selected Medicines Pills */}
            {selectedMedicines.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedMedicines.map((med, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 group transition-all hover:bg-emerald-100"
                        >
                            <Pill className="w-3.5 h-3.5" />
                            <span className="text-xs font-black tracking-tight">{med.name}</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase">
                                {med.dosage} • {med.frequency}
                            </span>
                            <button
                                onClick={() => onRemove?.(idx)}
                                className="ml-1 p-0.5 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Search Input */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder="Search medicine catalog..."
                    className="w-full h-12 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                />
                {loading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden max-h-64 overflow-y-auto">
                    {results.map((med, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelect(med)}
                            className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-primary/5 transition-colors border-b border-gray-50 last:border-0 group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                <Pill className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{med.name}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {med.category} • {med.defaultDosage}
                                </p>
                            </div>
                            <Check className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}