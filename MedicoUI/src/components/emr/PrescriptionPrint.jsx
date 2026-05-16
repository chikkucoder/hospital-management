import { Printer, X } from "lucide-react";
import { cn } from "../../lib/utils";

export default function PrescriptionPrint({ prescription, patient, doctor, onClose }) {
    if (!prescription) return null;

    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 print:hidden" onClick={onClose}>
                <div
                    className="bg-white w-full max-w-[210mm] max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl print:shadow-none print:rounded-none print:max-h-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Toolbar */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between rounded-t-[3rem] print:hidden z-10">
                        <h3 className="text-lg font-black text-primary-dark tracking-tight">Prescription Preview</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePrint}
                                className="h-12 px-6 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                            >
                                <Printer className="w-5 h-5" /> Print
                            </button>
                            <button
                                onClick={onClose}
                                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Prescription Content - A4 optimized */}
                    <PrescriptionContent prescription={prescription} patient={patient} doctor={doctor} formatDate={formatDate} />
                </div>
            </div>

            {/* Print-only version */}
            <div className="hidden print:block print:visible">
                <PrescriptionContent prescription={prescription} patient={patient} doctor={doctor} formatDate={formatDate} />
            </div>
        </>
    );
}

function PrescriptionContent({ prescription, patient, doctor, formatDate }) {
    return (
        <div className="p-10 print:p-8" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            {/* Header */}
            <div className="border-b-2 border-gray-900 pb-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Medico Health Systems</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                            123 Healthcare Avenue • Medical District • Reg. No: MCI-2024-001
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-900">Dr. {doctor?.name || "________________"}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {doctor?.specializations || "General Practitioner"}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">
                            Reg. No: {doctor?.registrationNumber || "______________"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rx Symbol */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-4xl font-black text-gray-900">℞</span>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Prescription ID</p>
                        <p className="text-sm font-bold text-gray-900">{prescription.id || "N/A"}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(prescription.createdAt)}</p>
                </div>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Patient Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Name</p>
                        <p className="text-sm font-black text-gray-900">{patient?.name || prescription?.patientName || "______________"}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Patient ID</p>
                        <p className="text-sm font-black text-gray-900">{patient?.patientId || prescription?.patientId || "______________"}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Age / Gender</p>
                        <p className="text-sm font-black text-gray-900">
                            {patient?.age || "__"} Y / {patient?.gender || "__"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">Date</p>
                        <p className="text-sm font-black text-gray-900">{formatDate(prescription.createdAt)}</p>
                    </div>
                </div>
            </div>

            {/* Vital Signs */}
            {prescription.vitals && Object.values(prescription.vitals).some((v) => v) && (
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Clinical Findings</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {prescription.vitals.bp && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">BP</p>
                                <p className="text-sm font-black text-gray-900">{prescription.vitals.bp}</p>
                            </div>
                        )}
                        {prescription.vitals.pulse && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Pulse</p>
                                <p className="text-sm font-black text-gray-900">{prescription.vitals.pulse} BPM</p>
                            </div>
                        )}
                        {prescription.vitals.temp && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">Temp</p>
                                <p className="text-sm font-black text-gray-900">{prescription.vitals.temp}°F</p>
                            </div>
                        )}
                        {prescription.vitals.spo2 && (
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[9px] font-bold text-gray-400 uppercase">SpO₂</p>
                                <p className="text-sm font-black text-gray-900">{prescription.vitals.spo2}%</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Diagnosis */}
            {prescription.notes && (
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Diagnosis & Clinical Notes</h3>
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {prescription.notes}
                        </p>
                    </div>
                </div>
            )}

            {/* Medicines Table */}
            {prescription.medicines?.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Prescribed Medication</h3>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-900">
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">#</th>
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Medicine</th>
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Dosage</th>
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Frequency</th>
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</th>
                                <th className="text-left py-3 px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prescription.medicines.map((med, idx) => (
                                <tr key={idx} className="border-b border-gray-100">
                                    <td className="py-3 px-3 text-sm font-bold text-gray-500">{idx + 1}</td>
                                    <td className="py-3 px-3 text-sm font-black text-gray-900">{med.name}</td>
                                    <td className="py-3 px-3 text-sm font-bold text-gray-700">{med.dosage}</td>
                                    <td className="py-3 px-3 text-sm font-bold text-gray-700">{med.frequency || "BD"}</td>
                                    <td className="py-3 px-3 text-sm font-bold text-gray-700">{med.duration}</td>
                                    <td className="py-3 px-3 text-sm font-medium text-gray-500 italic">
                                        {med.instructions || (med.frequency === "BD" ? "After meals" : "As directed")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Doctor's Signature</p>
                        <div className="w-48 h-16 border-b border-gray-300 flex items-end pb-1">
                            <p className="text-xs font-medium text-gray-400 italic">Dr. {doctor?.name || "________________"}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-gray-400">This is a computer-generated prescription.</p>
                        <p className="text-[9px] font-bold text-gray-400">Valid for 30 days from date of issue.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}