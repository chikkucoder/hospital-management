import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    totalItems = 0,
    itemsPerPage = 10,
    onItemsPerPageChange,
    className,
}) {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 2) {
                end = Math.min(4, totalPages - 1);
            }
            if (currentPage >= totalPages - 1) {
                start = Math.max(totalPages - 3, 2);
            }

            if (start > 2) pages.push("...");
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4", className)}>
            {/* Left: Showing records + rows per page */}
            <div className="flex items-center gap-5">
                <p className="text-xs font-bold text-[#6B7280] whitespace-nowrap">
                    Showing <span className="text-[#1F2937]">{startItem}–{endItem}</span> of{" "}
                    <span className="text-[#1F2937]">{totalItems}</span> records
                </p>
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                            Rows per page
                        </span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="h-9 px-3 pr-8 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#1F2937] outline-none focus:ring-2 focus:ring-[#0F6B4B]/20 focus:border-[#0F6B4B]/30 cursor-pointer appearance-none transition-all"
                        >
                            {[5, 10, 20, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Right: Pagination controls */}
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
                    title="Previous"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={`dots-${idx}`}
                            className="w-9 h-9 flex items-center justify-center text-xs font-bold text-[#6B7280] select-none"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange?.(page)}
                            className={cn(
                                "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all select-none",
                                page === currentPage
                                    ? "border-2 border-[#0F6B4B] text-[#0F6B4B] bg-[#EAF7F0] shadow-sm"
                                    : "border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0]"
                            )}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:text-[#0F6B4B] hover:border-[#0F6B4B]/30 hover:bg-[#EAF7F0] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-[#E5E7EB] disabled:hover:text-[#6B7280]"
                    title="Next"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}