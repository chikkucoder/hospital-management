import { Plus, Trash2, Pill, AlertTriangle } from "lucide-react";
import MedicineSearch from "./MedicineSearch";

export default function PrescriptionBuilder({
    medicines,
    onAddMedicine,
    onRemoveMedicine,
    onUpdateMedicine,
    drugInteractions,
    onCheckInteractions,
}) {
    return (
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col h-full bg-emerald-50/10 border-dashed border-emerald-200">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                        <Pill className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-[#06402B]">Prescriptions</h3>
                </div>
                <div className="flex items-center gap-2">
                    {medicines.length >= 2 && (
                        <button
                            onClick={onCheckInteractions}
                            className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100 hover:bg-amber-100 transition-colors"
                            title="Check drug interactions"
                        >
                            <AlertTriangle className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={onAddMedicine}
                        className="w-8 h-8 bg-white text-emerald-600 rounded-lg flex items-center justify-center shadow-sm border border-emerald-100 hover:scale-110 transition-transform"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Drug Interaction Warnings */}
            {drugInteractions?.hasInteractions && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Drug Interactions Detected
                    </p>
                    <div className="space-y-1.5">
                        {drugInteractions.interactions.map((interaction, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5",
                                    interaction.severity === "severe" ? "bg-red-100 text-red-700" :
                                        interaction.severity === "moderate" ? "bg-amber-100 text-amber-700" :
                                            "bg-yellow-100 text-yellow-700"
                                )}>
                                    {interaction.severity}
                                </span>
                                <p className="text-[10px] text-amber-800">
                                    <span className="font-bold">{interaction.medicine1}</span> + <span className="font-bold">{interaction.medicine2}</span>: {interaction.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Medicine Search */}
            <MedicineSearch onSelect={(med) => {
                onAddMedicine();
                const lastIdx = medicines.length;
                onUpdateMedicine(medicines[lastIdx]?.id || Date.now(), "name", med.name);
                onUpdateMedicine(medicines[lastIdx]?.id || Date.now(), "dosage", med.strength || "");
            }} />

            {/* Medicine List */}
            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[500px] pr-2 mt-4">
                {medicines.map((med, index) => (
                    <div
                        key={med.id}
                        className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group relative"
                    >
                        <button
                            onClick={() => onRemoveMedicine(med.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Medicine Name"
                                value={med.name}
                                onChange={(e) => onUpdateMedicine(med.id, "name", e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-[#06402B] outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Dosage (e.g. 1-0-1)"
                                    value={med.dosage}
                                    onChange={(e) => onUpdateMedicine(med.id, "dosage", e.target.value)}
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Duration (e.g. 5 Days)"
                                    value={med.duration}
                                    onChange={(e) => onUpdateMedicine(med.id, "duration", e.target.value)}
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="text"
                                    placeholder="Frequency (e.g. TID)"
                                    value={med.frequency || ""}
                                    onChange={(e) => onUpdateMedicine(med.id, "frequency", e.target.value)}
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                                />
                                <select
                                    value={med.route || "oral"}
                                    onChange={(e) => onUpdateMedicine(med.id, "route", e.target.value)}
                                    className="bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none"
                                >
                                    <option value="oral">Oral</option>
                                    <option value="iv">IV</option>
                                    <option value="im">IM</option>
                                    <option value="topical">Topical</option>
                                    <option value="sublingual">Sublingual</option>
                                    <option value="inhalation">Inhalation</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                placeholder="Instructions (e.g. After meals)"
                                value={med.instructions}
                                onChange={(e) => onUpdateMedicine(med.id, "instructions", e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-medium outline-none text-gray-500"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-emerald-200">
                <div className="p-4 bg-white rounded-2xl border border-emerald-100 mb-6 italic text-[10px] text-gray-400 text-center font-medium">
                    "Authorized by Medico Clinical Protocol 2.0"
                </div>
            </div>
        </div>
    );
}

// Helper for cn
function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}