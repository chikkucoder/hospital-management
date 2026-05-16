import { Printer } from "lucide-react";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function PrescriptionPrint({ prescription, patient, doctor, onClose }) {
    if (!prescription) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
                {/* Print-only header */}
                <div className="print-only hidden print:block mb-6">
                    <div className="text-center border-b-2 border-emerald-600 pb-4 mb-4">
                        <h1 className="text-2xl font-black text-[#06402B]">Medico Clinic</h1>
                        <p className="text-sm text-gray-500">123 Healthcare Ave, Medical District</p>
                        <p className="text-sm text-gray-500">Phone: +1 (555) 123-4567 · Email: info@medico.com</p>
                    </div>
                </div>

                {/* Screen header */}
                <div className="flex items-center justify-between mb-6 no-print">
                    <h2 className="text-xl font-bold text-[#06402B]">Prescription Preview</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" /> Print
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Prescription Content */}
                <div className="border-2 border-emerald-100 rounded-2xl p-6 space-y-4">
                    {/* Patient & Doctor Info */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patient</p>
                            <p className="text-sm font-bold text-gray-900">{patient?.name || "N/A"}</p>
                            <p className="text-xs text-gray-500">{patient?.patientId} · {patient?.age}Y · {patient?.gender}</p>
                            {patient?.bloodGroup && (
                                <p className="text-xs text-gray-500">Blood Group: {patient.bloodGroup}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctor</p>
                            <p className="text-sm font-bold text-gray-900">{doctor?.name || "Dr. Smith"}</p>
                            <p className="text-xs text-gray-500">{doctor?.specialization || "General Medicine"}</p>
                            <p className="text-xs text-gray-500">{formatDate(prescription.createdAt)}</p>
                        </div>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Diagnosis</p>
                        <p className="text-sm font-bold text-[#06402B]">{prescription.diagnosis}</p>
                    </div>

                    {/* Symptoms */}
                    {prescription.symptoms?.length > 0 && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Symptoms</p>
                            <div className="flex flex-wrap gap-1">
                                {prescription.symptoms.map((s, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vital Signs */}
                    {prescription.vitalSigns && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vital Signs</p>
                            <div className="grid grid-cols-4 gap-2">
                                {prescription.vitalSigns.bloodPressure?.systolic && (
                                    <div className="bg-gray-50 rounded-xl p-2 text-center">
                                        <p className="text-[9px] text-gray-400">BP</p>
                                        <p className="text-xs font-bold text-gray-700">
                                            {prescription.vitalSigns.bloodPressure.systolic}/{prescription.vitalSigns.bloodPressure.diastolic}
                                        </p>
                                    </div>
                                )}
                                {prescription.vitalSigns.heartRate && (
                                    <div className="bg-gray-50 rounded-xl p-2 text-center">
                                        <p className="text-[9px] text-gray-400">HR</p>
                                        <p className="text-xs font-bold text-gray-700">{prescription.vitalSigns.heartRate} bpm</p>
                                    </div>
                                )}
                                {prescription.vitalSigns.temperature && (
                                    <div className="bg-gray-50 rounded-xl p-2 text-center">
                                        <p className="text-[9px] text-gray-400">Temp</p>
                                        <p className="text-xs font-bold text-gray-700">{prescription.vitalSigns.temperature}°F</p>
                                    </div>
                                )}
                                {prescription.vitalSigns.weight && (
                                    <div className="bg-gray-50 rounded-xl p-2 text-center">
                                        <p className="text-[9px] text-gray-400">Weight</p>
                                        <p className="text-xs font-bold text-gray-700">{prescription.vitalSigns.weight} kg</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Medicines (Rx) */}
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            <span className="text-2xl mr-1">℞</span> Prescribed Medicines
                        </p>
                        <div className="space-y-2">
                            {prescription.medicines?.map((med, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                    <span className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{med.name}</p>
                                        <p className="text-xs text-gray-600">
                                            {med.dosage && <span>{med.dosage}</span>}
                                            {med.frequency && <span> · {med.frequency}</span>}
                                            {med.duration && <span> · {med.duration}</span>}
                                            {med.route && med.route !== "oral" && <span> · {med.route.toUpperCase()}</span>}
                                        </p>
                                        {med.instructions && (
                                            <p className="text-[10px] text-gray-400 italic mt-0.5">{med.instructions}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {prescription.notes && (
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clinical Notes</p>
                            <p className="text-xs text-gray-600 italic">{prescription.notes}</p>
                        </div>
                    )}

                    {/* Follow-up */}
                    {prescription.followUpDate && (
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                <span className="font-bold">Follow-up Date:</span> {formatDate(prescription.followUpDate)}
                            </p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-4 border-t-2 border-emerald-600 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <div className="border-b border-gray-300 pb-2 mb-1"></div>
                                <p className="text-[10px] text-gray-400">Doctor's Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="border-b border-gray-300 pb-2 mb-1"></div>
                                <p className="text-[10px] text-gray-400">Date</p>
                            </div>
                        </div>
                        <p className="text-[8px] text-gray-300 text-center mt-4">
                            This is a computer-generated prescription. Valid without signature in digital format.
                        </p>
                    </div>
                </div>
            </div>

            {/* Print styles */}
            <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0 { position: static !important; background: none !important; }
          .fixed.inset-0 > div { visibility: visible; position: static !important; max-height: none !important; overflow: visible !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
      `}</style>
        </div>
    );
}