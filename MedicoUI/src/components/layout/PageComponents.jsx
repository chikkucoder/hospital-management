import { forwardRef } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

// ─── PageContainer ───────────────────────────────────────────────
// Standard page wrapper with title, actions, and content area
export function PageContainer({ title, subtitle, actions, children, className }) {
    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            {(title || actions) && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        {title && (
                            <h1 className="text-2xl font-black text-[#06402B] tracking-tight">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            {/* Content */}
            {children}
        </div>
    );
}

// ─── SectionCard ─────────────────────────────────────────────────
// Reusable card wrapper for page sections
export const SectionCard = forwardRef(({ title, icon: Icon, actions, children, className, padded = true, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden",
                className
            )}
            {...props}
        >
            {/* Card header */}
            {(title || Icon || actions) && (
                <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        {title && (
                            <h3 className="text-lg font-black text-[#06402B] tracking-tight">
                                {title}
                            </h3>
                        )}
                    </div>
                    {actions && (
                        <div className="flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            {/* Card body */}
            <div className={cn(padded && "p-6 pt-0")}>
                {children}
            </div>
        </motion.div>
    );
});
SectionCard.displayName = "SectionCard";

// ─── TableContainer ──────────────────────────────────────────────
// Wrapper for data tables with search, filters, pagination
export function TableContainer({
    searchPlaceholder = "Search...",
    searchValue,
    onSearchChange,
    filters,
    children,
    pagination,
    className,
}) {
    return (
        <div className={cn("bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden", className)}>
            {/* Controls bar */}
            {(searchPlaceholder || filters) && (
                <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {onSearchChange && (
                        <div className="relative flex-1 max-w-sm">
                            <svg
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchValue || ""}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full h-11 pl-11 pr-4 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-gray-300"
                            />
                        </div>
                    )}
                    {filters && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {filters}
                        </div>
                    )}
                </div>
            )}

            {/* Table content */}
            <div className="overflow-x-auto">
                {children}
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="p-4 border-t border-gray-50 flex items-center justify-between">
                    {pagination}
                </div>
            )}
        </div>
    );
}

// ─── ContentWrapper ──────────────────────────────────────────────
// Main scrollable content area with consistent padding
export function ContentWrapper({ children, className, maxWidth = "max-w-7xl" }) {
    return (
        <div className={cn("flex-1 overflow-y-auto", className)}>
            <div className={cn("p-6 md:p-8 mx-auto", maxWidth)}>
                {children}
            </div>
        </div>
    );
}

// ─── RightPanel ──────────────────────────────────────────────────
// Clinical profile panel for EMR pages (320px, collapsible)
export function RightPanel({ children, isOpen = true, className }) {
    return (
        <motion.aside
            animate={{
                width: isOpen ? 320 : 0,
                opacity: isOpen ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "bg-white border-l border-gray-100 overflow-hidden flex-shrink-0 hidden xl:block",
                isOpen && "shadow-sm",
                className
            )}
            style={{ width: isOpen ? 320 : 0 }}
        >
            <div className="w-[320px] h-full overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </motion.aside>
    );
}

// ─── DashboardGrid ───────────────────────────────────────────────
// Responsive grid for dashboard cards
export function DashboardGrid({ children, cols = 3, className }) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={cn("grid gap-6", gridCols[cols] || gridCols[3], className)}>
            {children}
        </div>
    );
}

// ─── ResponsiveDrawer ────────────────────────────────────────────
// Slide-in drawer for mobile filters/panels
export function ResponsiveDrawer({ isOpen, onClose, title, children, side = "right" }) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                />
            )}

            {/* Drawer */}
            <motion.div
                animate={{
                    x: isOpen ? 0 : side === "right" ? "100%" : "-100%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                    "fixed top-0 bottom-0 w-80 bg-white shadow-2xl z-[100]",
                    side === "right" ? "right-0" : "left-0"
                )}
            >
                <div className="h-full flex flex-col">
                    {title && (
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#06402B]">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </motion.div>
        </>
    );
}

// ─── StatCard ────────────────────────────────────────────────────
// Dashboard stat/metric card
export function StatCard({ label, value, icon: Icon, trend, color = "emerald", className }) {
    const colorMap = {
        emerald: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
        purple: { bg: "bg-purple-50", text: "text-purple-600", iconBg: "bg-purple-100" },
        amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" },
        red: { bg: "bg-red-50", text: "text-red-600", iconBg: "bg-red-100" },
    };
    const c = colorMap[color] || colorMap.emerald;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={cn("bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm", className)}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="text-2xl font-black text-[#06402B] mt-1">{value}</p>
                    {trend && (
                        <p className={cn("text-xs font-bold mt-1", trend > 0 ? "text-emerald-600" : "text-red-500")}>
                            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", c.iconBg)}>
                        <Icon className={cn("w-6 h-6", c.text)} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}