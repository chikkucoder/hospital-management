import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

export default function ModalSystem({
    isOpen,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    footer,
    size = "md",
    className,
    closeOnBackdrop = true,
    showClose = true,
}) {
    const contentRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleEsc = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] max-h-[95vh]",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={closeOnBackdrop ? onClose : undefined}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        ref={contentRef}
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={cn(
                            "relative w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden",
                            sizeClasses[size],
                            className
                        )}
                    >
                        {/* Header */}
                        {(title || Icon || showClose) && (
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    {Icon && (
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div>
                                        {title && (
                                            <h3 className="text-lg font-black text-[#06402B] tracking-tight">{title}</h3>
                                        )}
                                        {subtitle && (
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{subtitle}</p>
                                        )}
                                    </div>
                                </div>
                                {showClose && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        aria-label="Close modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">{children}</div>

                        {/* Footer */}
                        {footer && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Confirmation Modal variant
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger", loading = false }) {
    const variantStyles = {
        danger: {
            iconBg: "bg-red-50 text-red-600",
            confirmClass: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20",
        },
        warning: {
            iconBg: "bg-amber-50 text-amber-600",
            confirmClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20",
        },
        primary: {
            iconBg: "bg-emerald-50 text-emerald-600",
            confirmClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20",
        },
    };

    const styles = variantStyles[variant] || variantStyles.primary;

    return (
        <ModalSystem isOpen={isOpen} onClose={onClose} size="sm">
            <div className="text-center py-4">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4", styles.iconBg)}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
                <p className="text-sm font-medium text-gray-500">{message}</p>
            </div>
            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 h-11 bg-gray-100 text-gray-600 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                    {cancelLabel}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        "flex-1 h-11 rounded-2xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
                        styles.confirmClass
                    )}
                >
                    {loading && (
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    )}
                    {confirmLabel}
                </button>
            </div>
        </ModalSystem>
    );
}