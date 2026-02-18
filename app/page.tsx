"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import TradingJournal from "@/components/TradingJournal";
import PortfolioAnalysis from "@/components/PortfolioAnalysis";
import { generateMockTrades } from "@/lib/mockData";
import { Trade } from "@/types";
import { motion } from "framer-motion";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "journal" | "portfolio"
  >("dashboard");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      loadTrades();
    }
  }, [connected]);

  const loadTrades = async () => {
    setLoading(true);
    // Simulate loading trades from blockchain
    setTimeout(() => {
      const mockTrades = generateMockTrades(100);
      setTrades(mockTrades);
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="bg-orb bg-orb-blue" />
        <div className="bg-orb bg-orb-pink" />
        <div className="bg-orb bg-orb-emerald" />
        <div className="bg-grid" />
      </div>

      <div className="container mx-auto px-6 py-12 pl-24 md:pl-72">
        {!connected ? (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="card max-w-4xl mx-auto relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-hero-glow" />
              <div className="relative z-10">
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-5xl font-bold mb-6 text-primary-900 dark:text-white tracking-tight"
                >
                  Welcome to{" "}
                  <span className="text-primary-700 dark:text-primary-400">
                    Deriverse
                  </span>{" "}
                  Analytics
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                  Comprehensive trading analytics and portfolio management for
                  professional traders
                </motion.p>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <FeatureCard
                    title="Trading Journal"
                    description="Track all your trades with detailed annotations and insights"
                    delay={0.25}
                  />
                  <FeatureCard
                    title="PnL Analytics"
                    description="Visualize your performance with comprehensive charts and metrics"
                    delay={0.35}
                  />
                  <FeatureCard
                    title="Risk Management"
                    description="Monitor drawdowns, win rates, and risk-adjusted returns"
                    delay={0.45}
                  />
                </div>

                <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white/85 dark:bg-slate-800/80 p-6 backdrop-blur"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_55%)]" />
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Live Performance Snapshot
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Track real-time momentum with layered signals and
                        adaptive risk overlays.
                      </p>
                      <div className="flex items-end gap-3">
                        {[32, 52, 38, 66, 44, 72, 58].map((value, index) => (
                          <div
                            key={value + index}
                            className="flex-1 rounded-full bg-gradient-to-t from-primary-700 via-primary-500 to-emerald-400/70"
                            style={{ height: `${value}px` }}
                          />
                        ))}
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            $2.48M
                          </p>
                          <p>Net volume</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            +4.2%
                          </p>
                          <p>Weekly trend</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            31
                          </p>
                          <p>Open positions</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65, duration: 0.7 }}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-white"
                  >
                    <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.35),transparent_55%)]" />
                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold mb-2">Risk Radar</h3>
                      <p className="text-sm text-slate-200/80 mb-6">
                        Adaptive safeguards highlight drawdown pressure and
                        exposure.
                      </p>
                      <div className="space-y-4">
                        {[
                          { label: "Exposure", value: 72 },
                          { label: "Volatility", value: 48 },
                          { label: "Liquidity", value: 86 },
                        ].map((metric) => (
                          <div key={metric.label}>
                            <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-200/70">
                              <span>{metric.label}</span>
                              <span>{metric.value}%</span>
                            </div>
                            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                                style={{ width: `${metric.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-lg text-slate-600 dark:text-slate-400 font-medium"
                >
                  Connect your wallet to get started
                </motion.p>
              </div>
            </motion.div>
          </div>
        ) : loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-800 dark:border-primary-600"></div>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 font-medium">
              Loading your trading data...
            </p>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && <Dashboard trades={trades} />}
            {activeTab === "journal" && (
              <TradingJournal trades={trades} setTrades={setTrades} />
            )}
            {activeTab === "portfolio" && <PortfolioAnalysis trades={trades} />}
          </>
        )}
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  delay,
}: {
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="p-8 bg-white/90 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all backdrop-blur"
    >
      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
