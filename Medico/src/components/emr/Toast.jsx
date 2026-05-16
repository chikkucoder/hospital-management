import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Toast({ message, type = "success", onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
    };

    const styles = {
        success: "bg-emerald-50 text-emerald-800 border-emerald-200",
        error: "bg-red-50 text-red-800 border-red-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
        warning: "bg-amber-50 text-amber-800 border-amber-200",
    };

    return (
        <div
            className={cn(
                "fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl animate-slide-in font-bold text-sm border",
                styles[type] || styles.success
            )}
        >
            {icons[type] || icons.success}
            {message}
            <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}