import { X } from "lucide-react";

export default function MedicalRecordForm({
    recordType,
    setRecordType,
    recordTitle,
    setRecordTitle,
    recordDescription,
    setRecordDescription,
    recordDiagnosisPrimary,
    setRecordDiagnosisPrimary,
    recordDiagnosisSecondary,
    secondaryInput,
    setSecondaryInput,
    addSecondaryDiagnosis,
    removeSecondaryDiagnosis,
    treatment,
    setTreatment,
    isConfidential,
    setIsConfidential,
}) {
    return (
        <div className="space-y-6 flex-1">
            {/* Record Type */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Record Type
                </label>
                <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                    <option value="consultation">Consultation</option>
                    <option value="lab_report">Lab Report</option>
                    <option value="imaging">Imaging</option>
                    <option value="discharge_summary">Discharge Summary</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="procedure">Procedure</option>
                    <option value="vaccination">Vaccination</option>
                </select>
            </div>

            {/* Title */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    placeholder="Record title..."
                    value={recordTitle}
                    onChange={(e) => setRecordTitle(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Description <span className="text-red-400">*</span>
                </label>
                <textarea
                    placeholder="Describe the medical record..."
                    value={recordDescription}
                    onChange={(e) => setRecordDescription(e.target.value)}
                    className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
            </div>

            {/* Primary Diagnosis */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Primary Diagnosis
                </label>
                <input
                    type="text"
                    placeholder="Primary diagnosis..."
                    value={recordDiagnosisPrimary}
                    onChange={(e) => setRecordDiagnosisPrimary(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
            </div>

            {/* Secondary Diagnosis */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Secondary Diagnosis
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Add secondary diagnosis..."
                        value={secondaryInput}
                        onChange={(e) => setSecondaryInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSecondaryDiagnosis())}
                        className="flex-1 p-3 bg-gray-50 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                        onClick={addSecondaryDiagnosis}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {recordDiagnosisSecondary.map((d, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold"
                        >
                            {d}
                            <button onClick={() => removeSecondaryDiagnosis(i)} className="hover:text-blue-900">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Treatment */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Treatment Plan
                </label>
                <textarea
                    placeholder="Enter treatment plan..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
            </div>

            {/* Confidential */}
            <div className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={isConfidential}
                    onChange={(e) => setIsConfidential(e.target.checked)}
                    className="w-5 h-5 rounded-lg text-emerald-600 focus:ring-emerald-500"
                />
                <label className="text-sm font-bold text-gray-600">Mark as confidential</label>
            </div>
        </div>
    );
}