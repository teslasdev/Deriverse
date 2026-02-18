"use client";

import { useState, useMemo } from "react";
import { Trade, DateRange } from "@/types";
import {
  calculateTradeStats,
  getTimePerformance,
  filterTradesByDateRange,
} from "@/lib/analytics";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import DateRangeFilter from "./DateRangeFilter";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
  Activity,
  Calendar,
} from "lucide-react";

interface PortfolioAnalysisProps {
  trades: Trade[];
}

export default function PortfolioAnalysis({ trades }: PortfolioAnalysisProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [timeInterval, setTimeInterval] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const filteredTrades = useMemo(() => {
    return filterTradesByDateRange(trades, dateRange.start, dateRange.end);
  }, [trades, dateRange]);

  const stats = useMemo(
    () => calculateTradeStats(filteredTrades),
    [filteredTrades],
  );
  const timePerformance = useMemo(
    () => getTimePerformance(filteredTrades, timeInterval),
    [filteredTrades, timeInterval],
  );

  // Calculate drawdown data
  const drawdownData = useMemo(() => {
    const sortedTrades = [...filteredTrades].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
    let cumulativePnL = 0;
    let peak = 0;

    return sortedTrades.map((trade) => {
      cumulativePnL += trade.pnl;
      peak = Math.max(peak, cumulativePnL);
      const drawdown = peak - cumulativePnL;
      const drawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0;

      return {
        timestamp: trade.timestamp,
        date: new Date(trade.timestamp).toISOString().split("T")[0],
        drawdown: -drawdown,
        drawdownPercent: -drawdownPercent,
        cumulativePnL,
      };
    });
  }, [filteredTrades]);

  // Time of day analysis
  const timeOfDayData = useMemo(() => {
    const hourBuckets = new Array(24).fill(0).map((_, hour) => ({
      hour,
      trades: 0,
      totalPnL: 0,
      wins: 0,
    }));

    filteredTrades.forEach((trade) => {
      const hour = new Date(trade.timestamp).getHours();
      hourBuckets[hour].trades++;
      hourBuckets[hour].totalPnL += trade.pnl;
      if (trade.pnl > 0) hourBuckets[hour].wins++;
    });

    return hourBuckets
      .filter((bucket) => bucket.trades > 0)
      .map((bucket) => ({
        ...bucket,
        hourLabel: `${bucket.hour}:00`,
        avgPnL: bucket.totalPnL / bucket.trades,
        winRate: (bucket.wins / bucket.trades) * 100,
      }));
  }, [filteredTrades]);

  // Day of week analysis
  const dayOfWeekData = useMemo(() => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayBuckets = days.map((day) => ({
      day,
      trades: 0,
      totalPnL: 0,
      wins: 0,
    }));

    filteredTrades.forEach((trade) => {
      const dayIndex = new Date(trade.timestamp).getDay();
      dayBuckets[dayIndex].trades++;
      dayBuckets[dayIndex].totalPnL += trade.pnl;
      if (trade.pnl > 0) dayBuckets[dayIndex].wins++;
    });

    return dayBuckets
      .filter((bucket) => bucket.trades > 0)
      .map((bucket) => ({
        ...bucket,
        avgPnL: bucket.totalPnL / bucket.trades,
        winRate: (bucket.wins / bucket.trades) * 100,
      }));
  }, [filteredTrades]);

  // Win/Loss distribution
  const distributionData = useMemo(() => {
    const buckets: { range: string; count: number; pnl: number }[] = [];
    const ranges = [
      { min: -Infinity, max: -1000, label: "< -$1000" },
      { min: -1000, max: -500, label: "-$1000 to -$500" },
      { min: -500, max: -100, label: "-$500 to -$100" },
      { min: -100, max: 0, label: "-$100 to $0" },
      { min: 0, max: 100, label: "$0 to $100" },
      { min: 100, max: 500, label: "$100 to $500" },
      { min: 500, max: 1000, label: "$500 to $1000" },
      { min: 1000, max: Infinity, label: "> $1000" },
    ];

    ranges.forEach((range) => {
      const tradesInRange = filteredTrades.filter(
        (t) => t.pnl >= range.min && t.pnl < range.max,
      );
      buckets.push({
        range: range.label,
        count: tradesInRange.length,
        pnl: tradesInRange.reduce((sum, t) => sum + t.pnl, 0),
      });
    });

    return buckets.filter((b) => b.count > 0);
  }, [filteredTrades]);

  // Risk-adjusted metrics
  const riskMetrics = useMemo(() => {
    if (filteredTrades.length === 0) return null;

    const returns = filteredTrades.map((t) => t.pnlPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance =
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) /
      returns.length;
    const stdDev = Math.sqrt(variance);

    const sortedReturns = [...returns].sort((a, b) => a - b);
    const var95Index = Math.floor(returns.length * 0.05);
    const valueAtRisk95 = sortedReturns[var95Index] || 0;

    return {
      avgReturn,
      stdDev,
      valueAtRisk95,
      calmarRatio:
        stats.maxDrawdown > 0 ? stats.totalPnL / stats.maxDrawdown : 0,
      sortinoRatio: calculateSortinoRatio(filteredTrades),
    };
  }, [filteredTrades, stats]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />

        <div className="flex items-center gap-3 card min-w-fit">
          <Calendar size={20} className="text-slate-500 dark:text-slate-400" />
          <select
            value={timeInterval}
            onChange={(e) => setTimeInterval(e.target.value as any)}
            className="select-field text-sm py-2 min-w-[140px] font-medium"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Risk Metrics */}
      {riskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <RiskMetricCard
            label="Avg Return"
            value={formatPercent(riskMetrics.avgReturn)}
            positive={riskMetrics.avgReturn >= 0}
          />
          <RiskMetricCard
            label="Volatility (σ)"
            value={formatPercent(riskMetrics.stdDev)}
            info="Standard deviation of returns"
          />
          <RiskMetricCard
            label="VaR (95%)"
            value={formatPercent(riskMetrics.valueAtRisk95)}
            info="95% Value at Risk"
            positive={false}
          />
          <RiskMetricCard
            label="Calmar Ratio"
            value={formatNumber(riskMetrics.calmarRatio, 2)}
            info="Return / Max Drawdown"
            positive={riskMetrics.calmarRatio > 0}
          />
          <RiskMetricCard
            label="Sortino Ratio"
            value={formatNumber(riskMetrics.sortinoRatio, 2)}
            info="Risk-adjusted downside"
            positive={riskMetrics.sortinoRatio > 1}
          />
        </div>
      )}

      {/* Cumulative PnL with Drawdown */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Portfolio Equity Curve & Drawdown
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={drawdownData}>
            <defs>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#334155" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#334155" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDrawdown" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="#94a3b8"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v, 0)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94a3b8"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v, 0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "cumulativePnL")
                  return [formatCurrency(value), "Equity"];
                if (name === "drawdown")
                  return [formatCurrency(value), "Drawdown"];
                return [value, name];
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="cumulativePnL"
              stroke="#0ea5e9"
              strokeWidth={2}
              fill="url(#colorEquity)"
              name="Cumulative PnL"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="drawdown"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorDrawdown)"
              name="Drawdown"
            />
            <ReferenceLine
              yAxisId="left"
              y={0}
              stroke="#64748b"
              strokeDasharray="3 3"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Time-based Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time of Day Performance */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Performance by Hour of Day
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeOfDayData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.1}
              />
              <XAxis
                dataKey="hourLabel"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCurrency(v, 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "avgPnL")
                    return [formatCurrency(value), "Avg PnL"];
                  if (name === "winRate")
                    return [`${formatNumber(value, 1)}%`, "Win Rate"];
                  return [value, name];
                }}
              />
              <Bar dataKey="avgPnL" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Day of Week Performance */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">
            Performance by Day of Week
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dayOfWeekData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                opacity={0.1}
              />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCurrency(v, 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "totalPnL")
                    return [formatCurrency(value), "Total PnL"];
                  if (name === "winRate")
                    return [`${formatNumber(value, 1)}%`, "Win Rate"];
                  return [value, name];
                }}
              />
              <Bar dataKey="totalPnL" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Win/Loss Distribution */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">PnL Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.1}
            />
            <XAxis
              dataKey="range"
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value: any, name: string) => {
                if (name === "count") return [value, "Trades"];
                return [value, name];
              }}
            />
            <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Best Trading Hours</h2>
          <div className="space-y-2">
            {timeOfDayData
              .sort((a, b) => b.avgPnL - a.avgPnL)
              .slice(0, 5)
              .map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.hourLabel}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {item.trades} trades • {formatNumber(item.winRate, 1)}%
                      win rate
                    </p>
                  </div>
                  <div
                    className={`text-lg font-semibold ${item.avgPnL >= 0 ? "text-success-600" : "text-danger-600"}`}
                  >
                    {formatCurrency(item.avgPnL)}
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Best Trading Days
            </h2>
          </div>
          <div className="space-y-3">
            {dayOfWeekData
              .sort((a, b) => b.totalPnL - a.totalPnL)
              .map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.day}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.trades} trades • {formatNumber(item.winRate, 1)}%
                      win rate
                    </p>
                  </div>
                  <div
                    className={`text-xl font-bold ${item.totalPnL >= 0 ? "text-success-600 dark:text-success-500" : "text-danger-600 dark:text-danger-500"}`}
                  >
                    {formatCurrency(item.totalPnL)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskMetricCard({
  label,
  value,
  info,
  positive,
}: {
  label: string;
  value: string;
  info?: string;
  positive?: boolean;
}) {
  return (
    <div className="card bg-slate-50/50 dark:bg-slate-800/50">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {label}
        </p>
        {info && (
          <div className="group relative">
            <AlertTriangle size={14} className="text-slate-400 cursor-help" />
            <div className="absolute right-0 top-6 w-48 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
              {info}
            </div>
          </div>
        )}
      </div>
      <p
        className={`text-2xl font-bold ${
          positive !== undefined
            ? positive
              ? "text-success-600 dark:text-success-500"
              : "text-danger-600 dark:text-danger-500"
            : "text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function calculateSortinoRatio(trades: Trade[]): number {
  if (trades.length < 2) return 0;

  const returns = trades.map((t) => t.pnlPercent);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  const negativeReturns = returns.filter((r) => r < 0);
  if (negativeReturns.length === 0) return avgReturn > 0 ? Infinity : 0;

  const downsideVariance =
    negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) /
    negativeReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);

  return downsideDeviation > 0
    ? (avgReturn / downsideDeviation) * Math.sqrt(252)
    : 0;
}
