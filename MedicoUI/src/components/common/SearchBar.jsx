import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search by Name or Patient ID, Phone, Email...",
    className,
}) {
    return (
        <div className={cn("relative flex-1 group", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] group-focus-within:text-[#0F6B4B] transition-colors" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 pl-12 pr-4 bg-[#F7F9F8] border border-[#E5E7EB] rounded-2xl text-sm font-medium text-[#1F2937] placeholder:text-[#6B7280] focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 outline-none transition-all"
            />
        </div>
    );
}