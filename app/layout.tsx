import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deriverse Analytics - Professional Trading Dashboard",
  description:
    "Comprehensive trading analytics, portfolio management, and performance tracking for Deriverse traders",
  keywords: [
    "Deriverse",
    "Solana",
    "Trading Analytics",
    "Portfolio Management",
    "DeFi",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>{children}</WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
