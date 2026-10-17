"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { PaginationInfo } from "@/lib/types";

interface PaginationProps {
  pagination?: PaginationInfo;
  currentPage: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  pagination,
  currentPage,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  const lastPage = pagination?.lastPage || Math.max(currentPage, 1);
  const total = pagination?.total;

  if (lastPage <= 1) return null;

  // Generate page numbers window (e.g. current +/- 2)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible + 2) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      if (start > 2) pages.push("...");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < lastPage - 1) pages.push("...");
      pages.push(lastPage);
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page === currentPage || isLoading || page < 1 || page > lastPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 mt-6 border-t border-white/[0.06]">
      {/* Page status text in pure English */}
      <div className="text-xs text-slate-400">
        Page <span className="text-white font-bold">{currentPage}</span> of{" "}
        <span className="text-white font-bold">{lastPage.toLocaleString()}</span>
        {total ? ` • Total ${total.toLocaleString()} anime` : ""}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* First page */}
        <button
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="First page"
          className="p-2 rounded-xl bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 disabled:opacity-30 disabled:hover:bg-[#0e1224]/90 border border-white/[0.08] transition cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          aria-label="Previous page"
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 disabled:opacity-30 disabled:hover:bg-[#0e1224]/90 border border-white/[0.08] text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 text-xs text-slate-500 font-bold">
                  ...
                </span>
              );
            }
            const pageNum = Number(p);
            const isActive = pageNum === currentPage;
            return (
              <button
                key={`page-${pageNum}`}
                onClick={() => handlePageClick(pageNum)}
                disabled={isLoading}
                className={`min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/35 ring-1 ring-rose-400/40 scale-105"
                    : "bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 hover:text-white border border-white/[0.08]"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next page */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage >= lastPage || isLoading}
          aria-label="Next page"
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 disabled:opacity-30 disabled:hover:bg-[#0e1224]/90 border border-white/[0.08] text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => handlePageClick(lastPage)}
          disabled={currentPage >= lastPage || isLoading}
          aria-label="Last page"
          className="p-2 rounded-xl bg-[#0e1224]/90 hover:bg-[#161d38] text-slate-300 disabled:opacity-30 disabled:hover:bg-[#0e1224]/90 border border-white/[0.08] transition cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
