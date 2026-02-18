export interface Trade {
  id: string
  timestamp: number
  symbol: string
  side: 'long' | 'short'
  entryPrice: number
  exitPrice: number
  size: number
  pnl: number
  pnlPercent: number
  fees: number
  orderType: 'market' | 'limit' | 'stop-loss' | 'take-profit'
  duration: number // in seconds
  notes?: string
  tags?: string[]
}

export interface TradeStats {
  totalPnL: number
  totalVolume: number
  totalFees: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  avgTradeDuration: number
  longTrades: number
  shortTrades: number
  largestGain: number
  largestLoss: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  sharpeRatio: number
  maxDrawdown: number
}

export interface SymbolStats {
  symbol: string
  trades: number
  pnl: number
  winRate: number
  volume: number
}

export interface TimePerformance {
  date: string
  pnl: number
  cumulativePnl: number
  trades: number
  winRate: number
}

export interface FeeBreakdown {
  orderType: string
  amount: number
  percentage: number
}

export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface ChartDataPoint {
  date: string
  value: number
  cumulative?: number
}
