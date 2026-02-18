"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { BarChart3, BookOpen, Wallet, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  activeTab: "dashboard" | "journal" | "portfolio";
  setActiveTab: (tab: "dashboard" | "journal" | "portfolio") => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { connected } = useWallet();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-20 md:w-64 border-r border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white shadow-xl">
      <div className="relative flex h-full flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.25),transparent_55%)]" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-3 px-4 pt-6 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
              <Sparkles size={18} />
            </div>
            <div className="hidden md:block">
              <p className="text-sm uppercase tracking-[0.2em] text-primary-200">
                Deriverse
              </p>
              <p className="text-lg font-semibold">Analytics</p>
            </div>
          </div>

          {connected && (
            <nav className="mt-6 flex flex-1 flex-col gap-2 px-3">
              <TabButton
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
                icon={<BarChart3 size={20} />}
                label="Dashboard"
              />
              <TabButton
                active={activeTab === "journal"}
                onClick={() => setActiveTab("journal")}
                icon={<BookOpen size={20} />}
                label="Journal"
              />
              <TabButton
                active={activeTab === "portfolio"}
                onClick={() => setActiveTab("portfolio")}
                icon={<Wallet size={20} />}
                label="Portfolio"
              />
            </nav>
          )}

          <div className="mt-auto flex flex-col gap-2 px-4 pb-6">
            <ThemeToggle />
            <WalletMultiButton className="w-full justify-center md:justify-start" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3 py-3 font-semibold transition-all ${
        active
          ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-900/30"
          : "text-slate-200/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
        {icon}
      </span>
      <span className="hidden md:inline text-sm">{label}</span>
    </button>
  );
}
