"use client";

import { Filter } from "lucide-react";

interface SymbolFilterProps {
  symbols: string[];
  selected: string;
  onChange: (symbol: string) => void;
}

export default function SymbolFilter({
  symbols,
  selected,
  onChange,
}: SymbolFilterProps) {
  return (
    <div className="flex items-center gap-3 card min-w-fit">
      <Filter size={20} className="text-slate-500 dark:text-slate-400" />
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="select-field text-sm py-2 min-w-[160px] font-medium"
      >
        {symbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol === "all" ? "All Symbols" : symbol}
          </option>
        ))}
      </select>
    </div>
  );
}
