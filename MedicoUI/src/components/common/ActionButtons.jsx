import { Eye, Edit2, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export default function ActionButtons({
    onView,
    onEdit,
    onDelete,
    viewLink,
    size = "md",
    className,
}) {
    const sizeClasses = {
        sm: "w-8 h-8 rounded-lg [&_svg]:w-3.5 [&_svg]:h-3.5",
        md: "w-9 h-9 rounded-xl [&_svg]:w-4 [&_svg]:h-4",
        lg: "w-10 h-10 rounded-xl [&_svg]:w-4.5 [&_svg]:h-4.5",
    };

    const buttonBase = cn(
        "inline-flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] bg-white transition-all",
        sizeClasses[size] || sizeClasses.md
    );

    const ViewButton = viewLink ? "a" : "button";

    return (
        <div className={cn("flex items-center gap-1.5", className)}>
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onView}
                className={cn(buttonBase, "hover:text-[#0F6B4B] hover:border-[#0F6B4B]/40 hover:bg-[#EAF7F0]")}
                title="View"
            >
                <Eye />
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onEdit}
                className={cn(buttonBase, "hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50")}
                title="Edit"
            >
                <Edit2 />
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onDelete}
                className={cn(buttonBase, "text-red-500 border-red-200 bg-red-50 hover:text-red-700 hover:border-red-400 hover:bg-red-100")}
                title="Delete"
            >
                <Trash2 />
            </motion.button>
        </div>
    );
}