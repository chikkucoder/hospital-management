import { useState, useEffect } from "react";
import { FlaskConical, Search, Plus, X, Loader2, Clock, AlertCircle } from "lucide-react";
import { labTestService } from "../../services/emrService";
import { cn } from "../../lib/utils";

export default function LabTestOrder({ patientId, onOrderComplete }) {
    const [catalog, setCatalog] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedTests, setSelectedTests] = useState([]);
    const [notes, setNotes] = useState("");
    const [ordering, setOrdering] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);

    useEffect(() => {
        if (!showCatalog) return;
        const fetchCatalog = async () => {
            setLoading(true);
            try {
                const params = {};
                if (search.trim()) params.search = search.trim();
                if (selectedCategory) params.category = selectedCategory;
                const res = await labTestService.getCatalog(params);
                setCatalog(res.data?.tests || []);
                if (!selectedCategory && !search.trim()) {
                    setCategories(res.data?.categories || []);
                }
            } catch (err) {
                console.error("Failed to fetch lab catalog:", err);
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchCatalog, 250);
        return () => clearTimeout(debounce);
    }, [search, selectedCategory, showCatalog]);

    const addTest = (test) => {
        if (selectedTests.find((t) => t.testId === test.id)) return;
        setSelectedTests([
            ...selectedTests,
            {
                testId: test.id,
                testName: test.name,
                category: test.category,
                priority: "routine",
                instructions: "",
                price: test.price,
                turnaroundTime: test.turnaroundTime,
                requiresFasting: test.requiresFasting,
            },
        ]);
    };

    const removeTest = (testId) => {
        setSelectedTests(selectedTests.filter((t) => t.testId !== testId));
    };

    const updateTestPriority = (testId, priority) => {
        setSelectedTests(
            selectedTests.map((t) => (t.testId === testId ? { ...t, priority } : t))
        );
    };

    const handleOrder = async () => {
        if (selectedTests.length === 0 || !patientId) return;
        setOrdering(true);
        try {
            await labTestService.createOrders({
                patient: patientId,
                doctor: "doctor-1",
                tests: selectedTests.map((t) => ({
                    testId: t.testId,
                    testName: t.testName,
                    category: t.category,
                    priority: t.priority,
                    instructions: t.instructions,
                })),
                notes,
            });
            setSelectedTests([]);
            setNotes("");
            setShowCatalog(false);
            onOrderComplete?.();
        } catch (err) {
            console.error("Failed to order lab tests:", err);
        } finally {
            setOrdering(false);
        }
    };

    const totalPrice = selectedTests.reduce((sum, t) => sum + (t.price || 0), 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Lab Tests</h4>
                <button
                    onClick={() => setShowCatalog(!showCatalog)}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                    <Plus className="w-3 h-3" />
                    {showCatalog ? "Close Catalog" : "Order Tests"}
                </button>
            </div>

            {/* Selected Tests */}
            {selectedTests.length > 0 && (
                <div className="space-y-2">
                    {selectedTests.map((test) => (
                        <div
                            key={test.testId}
                            className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-xl"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-700 truncate">{test.testName}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-gray-400">{test.category}</span>
                                    {test.requiresFasting && (
                                        <span className="text-[9px] text-amber-600 font-bold flex items-center gap-0.5">
                                            <AlertCircle className="w-2.5 h-2.5" /> Fasting
                                        </span>
                                    )}
                                    <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" /> {test.turnaroundTime}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={test.priority}
                                    onChange={(e) => updateTestPriority(test.testId, e.target.value)}
                                    className="text-[9px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none"
                                >
                                    <option value="routine">Routine</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="stat">STAT</option>
                                </select>
                                <button
                                    onClick={() => removeTest(test.testId)}
                                    className="p-1 hover:bg-red-100 rounded-lg"
                                >
                                    <X className="w-3 h-3 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Notes & Order Button */}
                    <div className="space-y-2 pt-2">
                        <input
                            type="text"
                            placeholder="Clinical notes for lab..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-gray-500">
                                {selectedTests.length} test{selectedTests.length !== 1 ? "s" : ""} · ₹{totalPrice}
                            </span>
                            <button
                                onClick={handleOrder}
                                disabled={ordering || !patientId}
                                className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {ordering ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <FlaskConical className="w-3.5 h-3.5" />
                                )}
                                {ordering ? "Ordering..." : "Place Order"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog */}
            {showCatalog && (
                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tests..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        {categories.length > 0 && !search && (
                            <div className="flex flex-wrap gap-1">
                                <button
                                    onClick={() => setSelectedCategory("")}
                                    className={cn(
                                        "px-2 py-0.5 rounded-lg text-[8px] font-bold transition-colors",
                                        !selectedCategory ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-100"
                                    )}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={cn(
                                            "px-2 py-0.5 rounded-lg text-[8px] font-bold transition-colors",
                                            selectedCategory === cat ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-100"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                            </div>
                        ) : catalog.length === 0 ? (
                            <p className="text-center text-gray-400 py-6 text-xs">No tests found</p>
                        ) : (
                            catalog.map((test) => {
                                const isSelected = selectedTests.find((t) => t.testId === test.id);
                                return (
                                    <button
                                        key={test.id}
                                        onClick={() => !isSelected && addTest(test)}
                                        disabled={isSelected}
                                        className={cn(
                                            "w-full text-left px-4 py-3 border-b border-gray-50 last:border-0 transition-colors flex items-center justify-between",
                                            isSelected
                                                ? "bg-purple-50/50 opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-gray-700 truncate">{test.name}</p>
                                            <p className="text-[9px] text-gray-400">
                                                {test.category} · {test.turnaroundTime}
                                                {test.requiresFasting && " · Fasting required"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="text-[10px] font-bold text-gray-500">₹{test.price}</span>
                                            {isSelected ? (
                                                <span className="text-[9px] font-bold text-purple-600">Added</span>
                                            ) : (
                                                <Plus className="w-3.5 h-3.5 text-purple-500" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}