import { Calendar } from "lucide-react";

export default function ConsultationForm({
    symptoms,
    setSymptoms,
    diagnosis,
    setDiagnosis,
    clinicalNotes,
    setClinicalNotes,
    followUpDate,
    setFollowUpDate,
}) {
    return (
        <div className="space-y-6 flex-1">
            {/* Symptoms */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Symptoms & Complaints
                </label>
                <textarea
                    placeholder="Describe patient symptoms... (comma-separated)"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full h-24 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none italic text-gray-600"
                />
            </div>

            {/* Diagnosis */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Diagnosis <span className="text-red-400">*</span>
                </label>
                <textarea
                    placeholder="Enter primary diagnosis..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full h-28 p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
            </div>

            {/* Clinical Notes */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Clinical Notes
                </label>
                <textarea
                    placeholder="Enter detailed clinical findings..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full min-h-[120px] p-6 bg-gray-50 border-none rounded-3xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
            </div>

            {/* Follow-up Date */}
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Follow-up Date
                </label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>
            </div>
        </div>
    );
}