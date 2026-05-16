import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export default function FilterButton({
    label = "Sort By",
    onClick,
    isActive = false,
    className,
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "h-10 px-4 flex items-center gap-2 rounded-xl border text-sm font-bold transition-all",
                isActive
                    ? "bg-[#EAF7F0] border-[#0F6B4B]/30 text-[#0F6B4B]"
                    : "bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F7F9F8] hover:border-[#0F6B4B]/20 hover:text-[#1F2937]",
                className
            )}
        >
            {label}
            <ChevronDown className={cn("w-4 h-4 transition-transform", isActive && "rotate-180")} />
        </button>
    );
}