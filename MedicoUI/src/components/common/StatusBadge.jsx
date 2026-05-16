import { cn } from "../../lib/utils";
import { CheckCircle2, Clock, XCircle, AlertCircle, Loader2, Circle, UserCheck, UserX, Stethoscope } from "lucide-react";

const STATUS_CONFIG = {
    // Appointment statuses
    confirmed: { label: "Confirmed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    pending: { label: "Pending", icon: Clock, className: "bg-amber-50 text-amber-700 border-amber-200" },
    completed: { label: "Completed", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
    // Lab report statuses
    in_progress: { label: "In Progress", icon: Loader2, className: "bg-blue-50 text-blue-700 border-blue-200" },
    approved: { label: "Approved", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Rejected", icon: XCircle, className: "bg-red-50 text-red-700 border-red-200" },
    // Generic
    active: { label: "Active", icon: CheckCircle2, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    inactive: { label: "Inactive", icon: Circle, className: "bg-gray-50 text-gray-500 border-gray-200" },
    urgent: { label: "Urgent", icon: AlertCircle, className: "bg-red-50 text-red-700 border-red-200 animate-pulse" },
    // Patient visit statuses
    waiting: { label: "Waiting", icon: Clock, className: "bg-orange-50 text-orange-600 border-orange-200" },
    arrived: { label: "Arrived", icon: UserCheck, className: "bg-blue-50 text-blue-600 border-blue-200" },
    in_consultation: { label: "In Consultation", icon: Stethoscope, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    upcoming: { label: "Upcoming", icon: Clock, className: "bg-purple-50 text-purple-600 border-purple-200" },
    no_show: { label: "No Show", icon: UserX, className: "bg-red-50 text-red-600 border-red-200" },
};

const SIZES = {
    sm: "px-2.5 py-0.5 text-[9px] gap-1 rounded-full",
    md: "px-3 py-1 text-[10px] gap-1.5 rounded-full",
    lg: "px-4 py-1.5 text-xs gap-2 rounded-full",
};

export default function StatusBadge({ status, size = "md", className, customLabel, customIcon: CustomIcon }) {
    const config = STATUS_CONFIG[status?.toLowerCase()] || {
        label: customLabel || status || "Unknown",
        icon: Circle,
        className: "bg-gray-50 text-gray-500 border-gray-200",
    };

    const Icon = CustomIcon || config.icon;
    const label = customLabel || config.label;

    return (
        <span
            className={cn(
                "inline-flex items-center font-black uppercase tracking-wider border transition-colors",
                config.className,
                SIZES[size] || SIZES.md,
                status === "in_progress" && "[&_svg]:animate-spin",
                className
            )}
        >
            <Icon className={cn("flex-shrink-0", size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5")} />
            {label}
        </span>
    );
}