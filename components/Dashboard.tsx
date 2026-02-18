"use client";

import { useState, useMemo } from "react";
import { Trade, DateRange } from "@/types";
import {
  calculateTradeStats,
  getSymbolStats,
  getTimePerformance,
  getFeeBreakdown,
  getOrderTypePerformance,
  filterTradesByDateRange,
  filterTradesBySymbol,
} from "@/lib/analytics";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
  formatDuration,
} from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Target,
  Clock,
  BarChart3,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Marquee from "react-fast-marquee";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Progress from "@radix-ui/react-progress";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DateRangeFilter from "./DateRangeFilter";
import SymbolFilter from "./SymbolFilter";

interface DashboardProps {
  trades: Trade[];
}

export default function Dashboard({ trades }: DashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string>("all");

  const filteredTrades = useMemo(() => {
    let filtered = filterTradesByDateRange(
      trades,
      dateRange.start,
      dateRange.end,
    );
    filtered = filterTradesBySymbol(filtered, selectedSymbol);
    return filtered;
  }, [trades, dateRange, selectedSymbol]);

  const stats = useMemo(
    () => calculateTradeStats(filteredTrades),
    [filteredTrades],
  );
  const symbolStats = useMemo(
    () => getSymbolStats(filteredTrades),
    [filteredTrades],
  );
  const timePerformance = useMemo(
    () => getTimePerformance(filteredTrades, "daily"),
    [filteredTrades],
  );
  const feeBreakdown = useMemo(
    () => getFeeBreakdown(filteredTrades),
    [filteredTrades],
  );
  const orderTypePerf = useMemo(
    () => getOrderTypePerformance(filteredTrades),
    [filteredTrades],
  );

  const winRate = Number.isFinite(stats.winRate)
    ? Math.min(100, Math.max(0, stats.winRate))
    : 0;
  const feeRate = stats.totalVolume
    ? (stats.totalFees / stats.totalVolume) * 100
    : 0;
  const drawdownRisk = stats.totalPnL
    ? Math.min(
        100,
        (Math.abs(stats.maxDrawdown) / (Math.abs(stats.totalPnL) + 1)) * 100,
      )
    : 0;
  const profitFactorScore = Math.min(100, (stats.profitFactor / 2) * 100);

  const symbols = useMemo(() => {
    const uniqueSymbols = Array.from(new Set(trades.map((t) => t.symbol)));
    return ["all", ...uniqueSymbols];
  }, [trades]);

  return (
    <Tooltip.Provider delayDuration={250}>
      <div className="space-y-6">
        {/* Hero */}
        <div className="glass-panel relative overflow-hidden">
          <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25),transparent_55%)]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-[1.4fr,1fr]">
            <div className="space-y-4">
              <div className="badge">
                <Sparkles size={16} />
                <span>Realtime trading command center</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Modern analytics for precision trading
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
                Monitor performance, risk, and momentum with a unified command
                view. Everything updates in real time as your trades stream in.
              </p>
              <div className="flex flex-wrap gap-3">
                <TrendChip
                  icon={<TrendingUp size={16} />}
                  label={`$${formatNumber(stats.totalVolume / 1000, 1)}k volume`}
                  positive
                />
                <TrendChip
                  icon={<Activity size={16} />}
                  label={`${stats.totalTrades} trades logged`}
                />
                <TrendChip
                  icon={<ShieldCheck size={16} />}
                  label={`${formatNumber(stats.sharpeRatio, 2)} Sharpe`}
                  positive={stats.sharpeRatio > 1}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <KpiPulseCard
                title="Total PnL"
                value={stats.totalPnL}
                formatter={(v) => formatCurrency(v)}
                trend={stats.totalPnL}
              />
              <KpiPulseCard
                title="Active Trades"
                value={stats.totalTrades}
                formatter={(v) => formatNumber(v, 0)}
              />
              <KpiPulseCard
                title="Avg Win"
                value={stats.avgWin}
                formatter={(v) => formatCurrency(v)}
                trend={stats.avgWin}
              />
              <div className="card flex flex-col items-center justify-center gap-3">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={winRate}
                    text={`${formatNumber(winRate, 1)}%`}
                    styles={buildStyles({
                      pathColor: winRate >= 50 ? "#22c55e" : "#ef4444",
                      textColor: "currentColor",
                      trailColor: "rgba(148, 163, 184, 0.2)",
                    })}
                  />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Win rate
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Marquee speed={35} gradient={false} pauseOnHover>
              {symbolStats.slice(0, 8).map((symbol) => (
                <div
                  key={symbol.symbol}
                  className="mx-3 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-sm font-semibold"
                >
                  {symbol.symbol} · {formatCurrency(symbol.pnl)}
                </div>
              ))}
            </Marquee>
          </div>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} />
          <SymbolFilter
            symbols={symbols}
            selected={selectedSymbol}
            onChange={setSelectedSymbol}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total PnL"
            value={formatCurrency(stats.totalPnL)}
            change={stats.totalPnL}
            icon={<DollarSign />}
            color={stats.totalPnL >= 0 ? "success" : "danger"}
          />
          <StatCard
            title="Win Rate"
            value={`${formatNumber(stats.winRate, 1)}%`}
            subtitle={`${stats.winningTrades}W / ${stats.losingTrades}L`}
            icon={<Target />}
            color={stats.winRate >= 50 ? "success" : "danger"}
          />
          <StatCard
            title="Total Trades"
            value={stats.totalTrades.toString()}
            subtitle={`Volume: ${formatCurrency(stats.totalVolume, 0)}`}
            icon={<Activity />}
            color="primary"
          />
          <StatCard
            title="Avg Duration"
            value={formatDuration(stats.avgTradeDuration)}
            subtitle={`Fees: ${formatCurrency(stats.totalFees)}`}
            icon={<Clock />}
            color="primary"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Largest Gain"
            value={formatCurrency(stats.largestGain)}
            positive
          />
          <MetricCard
            label="Largest Loss"
            value={formatCurrency(stats.largestLoss)}
            positive={false}
          />
          <MetricCard
            label="Avg Win"
            value={formatCurrency(stats.avgWin)}
            positive
          />
          <MetricCard
            label="Avg Loss"
            value={formatCurrency(stats.avgLoss)}
            positive={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Long/Short Ratio"
            value={`${stats.longTrades}/${stats.shortTrades}`}
            info={`${((stats.longTrades / (stats.longTrades + stats.shortTrades)) * 100).toFixed(1)}% long`}
          />
          <MetricCard
            label="Profit Factor"
            value={formatNumber(stats.profitFactor, 2)}
            positive={stats.profitFactor > 1}
          />
          <MetricCard
            label="Sharpe Ratio"
            value={formatNumber(stats.sharpeRatio, 2)}
            positive={stats.sharpeRatio > 1}
          />
          <MetricCard
            label="Max Drawdown"
            value={formatCurrency(stats.maxDrawdown)}
            positive={false}
          />
        </div>

        {/* Risk & Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Risk Control
              </h2>
              <AlertCircle size={18} className="text-slate-500" />
            </div>
            <div className="space-y-5">
              <ProgressRow
                label="Drawdown Exposure"
                value={drawdownRisk}
                description={`${formatCurrency(stats.maxDrawdown)} max drawdown`}
              />
              <ProgressRow
                label="Fee Efficiency"
                value={Math.min(100, feeRate * 4)}
                description={`${formatNumber(feeRate, 2)}% of volume`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Edge Score
              </h2>
              <BarChart3 size={18} className="text-slate-500" />
            </div>
            <div className="space-y-4">
              <ProgressRow
                label="Profit Factor"
                value={profitFactorScore}
                description={`${formatNumber(stats.profitFactor, 2)}x`}
              />
              <ProgressRow
                label="Win Rate"
                value={winRate}
                description={`${formatNumber(winRate, 1)}%`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Momentum Pulse
              </h2>
              <TrendingUp size={18} className="text-slate-500" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Net PnL
                  </p>
                  <p
                    className={`text-2xl font-bold ${stats.totalPnL >= 0 ? "text-success-600 dark:text-success-500" : "text-danger-600 dark:text-danger-500"}`}
                  >
                    {formatCurrency(stats.totalPnL)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {stats.totalPnL >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {formatNumber(
                    stats.totalPnL / Math.max(1, stats.totalVolume),
                    3,
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Avg trade duration
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {formatDuration(stats.avgTradeDuration)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* PnL Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Cumulative PnL
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timePerformance}>
              <defs>
                <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#334155" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#334155" stopOpacity={0} />
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
                stroke="#94a3b8"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                tickFormatter={(value) => formatCurrency(value, 0)}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  padding: "12px",
                }}
                labelStyle={{
                  fontWeight: 600,
                  color: "#1e293b",
                  marginBottom: "4px",
                }}
                formatter={(value: any) => [formatCurrency(value), "PnL"]}
              />
              <Area
                type="monotone"
                dataKey="cumulativePnl"
                stroke="#1e293b"
                strokeWidth={2.5}
                fill="url(#colorPnl)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily PnL */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Daily PnL
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={timePerformance}>
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
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value, 0)}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                  formatter={(value: any) => [formatCurrency(value), "PnL"]}
                />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {timePerformance.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Symbol Performance */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Top Symbols by PnL
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={symbolStats.slice(0, 5)} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  strokeOpacity={0.5}
                />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  tickFormatter={(value) => formatCurrency(value, 0)}
                />
                <YAxis
                  dataKey="symbol"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickLine={false}
                  width={80}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  labelStyle={{
                    fontWeight: 600,
                    color: "#1e293b",
                    marginBottom: "4px",
                  }}
                  formatter={(value: any) => [formatCurrency(value), "PnL"]}
                />
                <Bar dataKey="pnl" radius={[0, 6, 6, 0]}>
                  {symbolStats.slice(0, 5).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Breakdown */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Fee Breakdown by Order Type
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={feeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) =>
                    `${entry.orderType}: ${entry.percentage.toFixed(1)}%`
                  }
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="amount"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {feeBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    padding: "12px",
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Fees:{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(stats.totalFees)}
                </span>
              </p>
            </div>
          </div>

          {/* Order Type Performance */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Order Type Performance
              </h2>
            </div>
            <div className="space-y-3">
              {orderTypePerf.map((item) => (
                <div
                  key={item.orderType}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white capitalize">
                      {item.orderType}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.trades} trades • {formatNumber(item.winRate, 1)}%
                      win rate
                    </p>
                  </div>
                  <div
                    className={`text-xl font-bold ${item.pnl >= 0 ? "text-success-600 dark:text-success-500" : "text-danger-600 dark:text-danger-500"}`}
                  >
                    {formatCurrency(item.pnl)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Symbol Stats Table */}
        <div className="card overflow-hidden">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Symbol Statistics
            </h2>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-y border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Symbol
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Trades
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Volume
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    PnL
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-sm text-slate-700 dark:text-slate-300">
                    Win Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {symbolStats.map((symbol) => (
                  <tr
                    key={symbol.symbol}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900 dark:text-white">
                      {symbol.symbol}
                    </td>
                    <td className="text-right py-4 px-6 text-slate-700 dark:text-slate-300">
                      {symbol.trades}
                    </td>
                    <td className="text-right py-4 px-6 text-slate-700 dark:text-slate-300">
                      {formatCurrency(symbol.volume, 0)}
                    </td>
                    <td
                      className={`text-right py-4 px-6 font-bold ${symbol.pnl >= 0 ? "text-success-600 dark:text-success-500" : "text-danger-600 dark:text-danger-500"}`}
                    >
                      {formatCurrency(symbol.pnl)}
                    </td>
                    <td className="text-right py-4 px-6 text-slate-700 dark:text-slate-300">
                      {formatNumber(symbol.winRate, 1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}

const COLORS = [
  "#1e293b",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle?: string;
  change?: number;
  icon: React.ReactNode;
  color: "success" | "danger" | "primary";
}) {
  const colorClasses = {
    success:
      "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400",
    danger:
      "bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400",
    primary:
      "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400",
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-xl ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

function MetricCard({
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
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        {label}
      </p>
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
      {info && (
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
          {info}
        </p>
      )}
    </div>
  );
}

function KpiPulseCard({
  title,
  value,
  formatter,
  trend,
}: {
  title: string;
  value: number;
  formatter: (value: number) => string;
  trend?: number;
}) {
  const isPositive = trend === undefined ? true : trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              trend !== undefined
                ? isPositive
                  ? "text-success-600 dark:text-success-500"
                  : "text-danger-600 dark:text-danger-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            <CountUp
              end={Number.isFinite(value) ? value : 0}
              duration={1.1}
              formattingFn={(val) => formatter(val)}
            />
          </p>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive
                ? "text-success-600 dark:text-success-500"
                : "text-danger-600 dark:text-danger-500"
            }`}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {formatPercent((trend / Math.max(1, Math.abs(value))) * 100, 1)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TrendChip({
  icon,
  label,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  positive?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${
        positive === undefined
          ? "bg-white/70 dark:bg-slate-800/70 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300"
          : positive
            ? "bg-success-50/70 dark:bg-success-900/20 border-success-200/60 dark:border-success-800/50 text-success-700 dark:text-success-400"
            : "bg-danger-50/70 dark:bg-danger-900/20 border-danger-200/60 dark:border-danger-800/50 text-danger-700 dark:text-danger-400"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function ProgressRow({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </p>
          <InfoTooltip text={description} />
        </div>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          {formatNumber(value, 0)}%
        </p>
      </div>
      <Progress.Root className="progress-root" value={value}>
        <Progress.Indicator
          className="progress-indicator"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <AlertCircle size={14} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="top"
          className="rounded-lg bg-slate-900 text-white px-3 py-2 text-xs shadow-lg"
        >
          {text}
          <Tooltip.Arrow className="fill-slate-900" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
