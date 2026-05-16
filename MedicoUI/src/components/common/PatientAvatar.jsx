import { cn } from "../../lib/utils";

const PASTEL_COLORS = [
    "bg-rose-100 text-rose-600",
    "bg-sky-100 text-sky-600",
    "bg-amber-100 text-amber-600",
    "bg-emerald-100 text-emerald-600",
    "bg-violet-100 text-violet-600",
    "bg-cyan-100 text-cyan-600",
    "bg-pink-100 text-pink-600",
    "bg-lime-100 text-lime-600",
    "bg-indigo-100 text-indigo-600",
    "bg-teal-100 text-teal-600",
    "bg-orange-100 text-orange-600",
    "bg-fuchsia-100 text-fuchsia-600",
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export default function PatientAvatar({ name, size = "md", className }) {
    const initials = (name || "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const colorIndex = hashString(name || "") % PASTEL_COLORS.length;
    const colorClass = PASTEL_COLORS[colorIndex];

    const sizeClasses = {
        sm: "w-8 h-8 text-[10px] rounded-lg",
        md: "w-10 h-10 text-xs rounded-xl",
        lg: "w-12 h-12 text-sm rounded-2xl",
        xl: "w-14 h-14 text-base rounded-2xl",
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center font-black flex-shrink-0",
                colorClass,
                sizeClasses[size] || sizeClasses.md,
                className
            )}
            title={name}
        >
            {initials || "?"}
        </div>
    );
}