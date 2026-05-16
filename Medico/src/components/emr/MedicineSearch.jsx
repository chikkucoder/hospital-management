import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Pill, X } from "lucide-react";
import { medicineService } from "../../services/emrService";

export default function MedicineSearch({ onSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!showDropdown) return;
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                const params = { limit: 15 };
                if (query.trim()) params.search = query.trim();
                if (selectedCategory) params.category = selectedCategory;
                const res = await medicineService.searchMedicines(params);
                setResults(res.data?.medicines || []);
                if (!selectedCategory && !query.trim()) {
                    setCategories(res.data?.categories || []);
                }
            } catch (err) {
                console.error("Failed to search medicines:", err);
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchMedicines, 250);
        return () => clearTimeout(debounce);
    }, [query, selectedCategory, showDropdown]);

    const handleSelect = (med) => {
        onSelect(med);
        setQuery("");
        setShowDropdown(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search medicine database..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-emerald-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setShowDropdown(false); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                        <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className="absolute z-30 mt-1 w-full bg-white rounded-2xl border border-gray-100 shadow-xl max-h-72 overflow-hidden">
                    {/* Category Filter */}
                    {categories.length > 0 && !query && (
                        <div className="p-2 border-b border-gray-50 flex flex-wrap gap-1">
                            <button
                                onClick={() => setSelectedCategory("")}
                                className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-colors ${!selectedCategory ? "bg-emerald-100 text-emerald-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                All
                            </button>
                            {categories.slice(0, 8).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-colors ${selectedCategory === cat ? "bg-emerald-100 text-emerald-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Results */}
                    <div className="max-h-56 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                            </div>
                        ) : results.length === 0 ? (
                            <p className="text-center text-gray-400 py-6 text-xs">No medicines found</p>
                        ) : (
                            results.map((med) => (
                                <button
                                    key={med.id}
                                    onClick={() => handleSelect(med)}
                                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                                >
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Pill className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-gray-800 truncate">{med.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">
                                            {med.genericName} · {med.strength} · {med.form}
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md flex-shrink-0">
                                        {med.category}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}