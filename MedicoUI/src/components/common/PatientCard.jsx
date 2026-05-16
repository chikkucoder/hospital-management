import { Link } from "react-router-dom";
import { User, ChevronRight, Phone, Calendar, Activity, Stethoscope } from "lucide-react";
import { cn } from "../../lib/utils";
import StatusBadge from "./StatusBadge";

export default function PatientCard({
    patient,
    onSelect,
    isSelected = false,
    showActions = true,
    compact = false,
    className,
}) {
    const initials = (patient?.name || "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const patientId = patient?.patientId || patient?.id || patient?._id || "N/A";

    if (compact) {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer border",
                    isSelected
                        ? "bg-emerald-50 border-emerald-200 shadow-sm"
                        : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200",
                    className
                )}
                onClick={() => onSelect?.(patient)}
            >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-sm flex-shrink-0">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{patient?.name || "Unknown"}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{patientId}</p>
                </div>
                {patient?.condition && (
                    <StatusBadge status={patient.condition} size="sm" customLabel={patient.condition} />
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "bg-white rounded-[2rem] border p-5 transition-all group",
                isSelected
                    ? "border-emerald-300 shadow-lg shadow-emerald-100/50 ring-2 ring-emerald-100"
                    : "border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200",
                className
            )}
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xl flex-shrink-0 border-2 border-white shadow-md">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-base font-black text-gray-900 tracking-tight truncate">
                        {patient?.name || "Unknown Patient"}
                    </h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {patientId}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {patient?.age || "—"} yrs
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-[10px] font-bold text-gray-500">
                            {patient?.gender || patient?.sex || "—"}
                        </span>
                        {patient?.bloodGroup && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="text-[10px] font-black text-red-500">{patient.bloodGroup}</span>
                            </>
                        )}
                    </div>
                </div>
                {patient?.status && <StatusBadge status={patient.status} size="sm" />}
            </div>

            {/* Info Row */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {patient?.phone && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span className="truncate">{patient.phone}</span>
                    </div>
                )}
                {patient?.condition && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                        <Activity className="w-3 h-3" />
                        <span className="truncate">{patient.condition}</span>
                    </div>
                )}
                {patient?.lastVisit && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 col-span-2">
                        <Calendar className="w-3 h-3" />
                        <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            {showActions && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <Link
                        to={`/emr/${patientId}`}
                        className="flex-1 h-9 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/10"
                    >
                        <Stethoscope className="w-3.5 h-3.5" />
                        EMR
                    </Link>
                    <Link
                        to={`/patients/${patientId}`}
                        className="flex-1 h-9 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors"
                    >
                        <User className="w-3.5 h-3.5" />
                        Profile
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
            )}
        </div>
    );
}