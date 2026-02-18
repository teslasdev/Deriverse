"use client";

import { DateRange } from "@/types";
import { Calendar } from "lucide-react";

interface DateRangeFilterProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

export default function DateRangeFilter({
  dateRange,
  setDateRange,
}: DateRangeFilterProps) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      start: e.target.value ? new Date(e.target.value) : null,
    });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange({
      ...dateRange,
      end: e.target.value ? new Date(e.target.value) : null,
    });
  };

  const handleClear = () => {
    setDateRange({ start: null, end: null });
  };

  return (
    <div className="flex items-center gap-3 card min-w-fit">
      <Calendar size={20} className="text-slate-500 dark:text-slate-400" />
      <input
        type="date"
        value={
          dateRange.start ? dateRange.start.toISOString().split("T")[0] : ""
        }
        onChange={handleStartChange}
        className="input-field text-sm py-2 min-w-[140px] font-medium"
        placeholder="Start date"
      />
      <span className="text-slate-500 dark:text-slate-400 font-medium">to</span>
      <input
        type="date"
        value={dateRange.end ? dateRange.end.toISOString().split("T")[0] : ""}
        onChange={handleEndChange}
        className="input-field text-sm py-2 min-w-[140px] font-medium"
        placeholder="End date"
      />
      {(dateRange.start || dateRange.end) && (
        <button
          onClick={handleClear}
          className="text-sm text-primary-700 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-semibold px-3 py-1 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
        >
          Clear
        </button>
      )}
    </div>
  );
}
