"use client";

import { useState, useMemo } from "react";
import { Trade, DateRange } from "@/types";
import {
  formatCurrency,
  formatPercent,
  formatDateTime,
  formatDuration,
} from "@/lib/utils";
import { filterTradesByDateRange, filterTradesBySymbol } from "@/lib/analytics";
import { Edit2, Tag, TrendingUp, TrendingDown, Search } from "lucide-react";
import DateRangeFilter from "./DateRangeFilter";
import SymbolFilter from "./SymbolFilter";

interface TradingJournalProps {
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
}

export default function TradingJournal({
  trades,
  setTrades,
}: TradingJournalProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTrade, setEditingTrade] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");

  const filteredTrades = useMemo(() => {
    let filtered = filterTradesByDateRange(
      trades,
      dateRange.start,
      dateRange.end,
    );
    filtered = filterTradesBySymbol(filtered, selectedSymbol);

    if (searchQuery) {
      filtered = filtered.filter(
        (trade) =>
          trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trade.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trade.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    return filtered;
  }, [trades, dateRange, selectedSymbol, searchQuery]);

  const symbols = useMemo(() => {
    const uniqueSymbols = Array.from(new Set(trades.map((t) => t.symbol)));
    return ["all", ...uniqueSymbols];
  }, [trades]);

  const handleEditClick = (trade: Trade) => {
    setEditingTrade(trade.id);
    setEditNotes(trade.notes || "");
    setEditTags(trade.tags?.join(", ") || "");
  };

  const handleSaveEdit = (tradeId: string) => {
    setTrades(
      trades.map((trade) => {
        if (trade.id === tradeId) {
          return {
            ...trade,
            notes: editNotes || undefined,
            tags: editTags
              ? editTags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : undefined,
          };
        }
        return trade;
      }),
    );
    setEditingTrade(null);
  };

  const handleCancelEdit = () => {
    setEditingTrade(null);
    setEditNotes("");
    setEditTags("");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
        <SymbolFilter
          symbols={symbols}
          selected={selectedSymbol}
          onChange={setSelectedSymbol}
        />

        {/* Search */}
        <div className="flex items-center gap-3 card flex-1 min-w-[250px]">
          <Search size={20} className="text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trades..."
            className="input-field text-sm py-2 border-0 focus:ring-0 p-0 font-medium"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Showing Trades
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {filteredTrades.length}
          </p>
        </div>
        <div className="card bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Total PnL
          </p>
          <p
            className={`text-3xl font-bold ${
              filteredTrades.reduce((sum, t) => sum + t.pnl, 0) >= 0
                ? "text-success-600 dark:text-success-500"
                : "text-danger-600 dark:text-danger-500"
            }`}
          >
            {formatCurrency(filteredTrades.reduce((sum, t) => sum + t.pnl, 0))}
          </p>
        </div>
        <div className="card bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Win Rate
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {filteredTrades.length > 0
              ? (
                  (filteredTrades.filter((t) => t.pnl > 0).length /
                    filteredTrades.length) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
        <div className="card bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            Avg Trade
          </p>
          <p
            className={`text-3xl font-bold ${
              filteredTrades.length > 0 &&
              filteredTrades.reduce((sum, t) => sum + t.pnl, 0) /
                filteredTrades.length >=
                0
                ? "text-success-600 dark:text-success-500"
                : "text-danger-600 dark:text-danger-500"
            }`}
          >
            {filteredTrades.length > 0
              ? formatCurrency(
                  filteredTrades.reduce((sum, t) => sum + t.pnl, 0) /
                    filteredTrades.length,
                )
              : formatCurrency(0)}
          </p>
        </div>
      </div>

      {/* Trades Table */}
      <div className="card overflow-hidden">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Trade History
          </h2>
        </div>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="border-y border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Symbol
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Side
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Entry
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Exit
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Size
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  PnL
                </th>
                <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  PnL %
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Duration
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Type
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Notes
                </th>
                <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr
                  key={trade.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                    {formatDateTime(trade.timestamp)}
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                    {trade.symbol}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        trade.side === "long"
                          ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400"
                          : "bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400"
                      }`}
                    >
                      {trade.side === "long" ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                    ${trade.entryPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                    ${trade.exitPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                    {trade.size.toFixed(4)}
                  </td>
                  <td
                    className={`text-right py-4 px-6 font-bold ${
                      trade.pnl >= 0
                        ? "text-success-600 dark:text-success-500"
                        : "text-danger-600 dark:text-danger-500"
                    }`}
                  >
                    {formatCurrency(trade.pnl)}
                  </td>
                  <td
                    className={`text-right py-4 px-6 font-semibold ${
                      trade.pnlPercent >= 0
                        ? "text-success-600 dark:text-success-500"
                        : "text-danger-600 dark:text-danger-500"
                    }`}
                  >
                    {formatPercent(trade.pnlPercent)}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700 dark:text-slate-300">
                    {formatDuration(trade.duration)}
                  </td>
                  <td className="py-4 px-6 text-sm capitalize text-slate-700 dark:text-slate-300">
                    {trade.orderType}
                  </td>
                  <td className="py-4 px-6 max-w-xs">
                    {editingTrade === trade.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes..."
                          className="input-field text-sm py-2"
                        />
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="Tags (comma-separated)"
                          className="input-field text-sm py-2"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(trade.id)}
                            className="text-xs bg-primary-800 dark:bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-900 dark:hover:bg-primary-600 font-semibold transition-all shadow-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-xs bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-semibold border border-slate-300 dark:border-slate-600 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        {trade.notes && (
                          <p className="text-slate-600 dark:text-slate-400 mb-2">
                            {trade.notes}
                          </p>
                        )}
                        {trade.tags && trade.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {trade.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 rounded-lg text-xs font-medium"
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingTrade !== trade.id && (
                      <button
                        onClick={() => handleEditClick(trade)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                        title="Edit notes and tags"
                      >
                        <Edit2
                          size={16}
                          className="text-slate-500 dark:text-slate-400"
                        />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTrades.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No trades found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
