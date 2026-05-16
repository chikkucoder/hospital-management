import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

const COLOR_MAP = {
    emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        glow: "shadow-emerald-100/50",
    },
    blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        glow: "shadow-blue-100/50",
    },
    orange: {
        bg: "bg-orange-50",
        text: "text-orange-600",
        glow: "shadow-orange-100/50",
    },
    purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        glow: "shadow-purple-100/50",
    },
    red: {
        bg: "bg-red-50",
        text: "text-red-600",
        glow: "shadow-red-100/50",
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        glow: "shadow-amber-100/50",
    },
};

export default function DashboardStats({
    title,
    value,
    icon: Icon,
    color = "emerald",
    trend,
    trendValue,
    subtitle,
    onClick,
    className,
}) {
    const colors = COLOR_MAP[color] || COLOR_MAP.emerald;
    const trendUp = trend === "up";
    const trendDown = trend === "down";
    const TrendIcon = trendUp ? TrendingUp : trendDown ? TrendingDown : null;

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300 group",
                "hover:shadow-2xl hover:-translate-y-1",
                onClick && "cursor-pointer",
                className
            )}
        >
            {/* Icon + Trend */}
            <div className="flex items-start justify-between mb-5">
                <div
                    className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                        colors.bg,
                        colors.text
                    )}
                >
                    <Icon className="w-6 h-6" />
                </div>

                {trend && trendValue && (
                    <div className="flex items-center gap-1">
                        {TrendIcon && (
                            <TrendIcon
                                className={cn(
                                    "w-3.5 h-3.5",
                                    trendUp ? "text-emerald-500" : "text-red-500"
                                )}
                            />
                        )}
                        <span
                            className={cn(
                                "text-xs font-black",
                                trendUp ? "text-emerald-600" : trendDown ? "text-red-500" : "text-gray-400"
                            )}
                        >
                            {trendValue}
                        </span>
                    </div>
                )}
            </div>

            {/* Value */}
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {title}
                </p>
                <h3 className="text-3xl font-black text-[#06402B] tracking-tighter">{value}</h3>
                {subtitle && (
                    <p className="text-[10px] font-bold text-gray-400 mt-1">{subtitle}</p>
                )}
            </div>

            {/* Hover glow */}
            <div
                className={cn(
                    "absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    colors.glow
                )}
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${color === "emerald" ? "rgba(16,185,129,0.08)" : color === "blue" ? "rgba(59,130,246,0.08)" : color === "orange" ? "rgba(249,115,22,0.08)" : color === "purple" ? "rgba(139,92,246,0.08)" : color === "red" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)"}, transparent 70%)`,
                }}
            />
        </div>
    );
}

// Pre-built stat card for grid layouts
export function StatCardSimple({ title, value, icon: Icon, color = "emerald", className }) {
    const colors = COLOR_MAP[color] || COLOR_MAP.emerald;

    return (
        <div className={cn("bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4", className)}>
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", colors.bg, colors.text)}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</p>
                <p className="text-xl font-black text-[#06402B] tracking-tight">{value}</p>
            </div>
        </div>
    );
}