import { Trade, TradeStats, SymbolStats, TimePerformance, FeeBreakdown } from '@/types'

export function calculateTradeStats(trades: Trade[]): TradeStats {
  if (trades.length === 0) {
    return {
      totalPnL: 0,
      totalVolume: 0,
      totalFees: 0,
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      avgTradeDuration: 0,
      longTrades: 0,
      shortTrades: 0,
      largestGain: 0,
      largestLoss: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
    }
  }

  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)
  const totalVolume = trades.reduce((sum, t) => sum + (t.size * t.entryPrice), 0)
  const totalFees = trades.reduce((sum, t) => sum + t.fees, 0)
  const totalTrades = trades.length

  const winningTrades = trades.filter(t => t.pnl > 0).length
  const losingTrades = trades.filter(t => t.pnl < 0).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

  const avgTradeDuration = trades.reduce((sum, t) => sum + t.duration, 0) / totalTrades

  const longTrades = trades.filter(t => t.side === 'long').length
  const shortTrades = trades.filter(t => t.side === 'short').length

  const largestGain = Math.max(...trades.map(t => t.pnl), 0)
  const largestLoss = Math.min(...trades.map(t => t.pnl), 0)

  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)
  
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) : 0

  const totalWinAmount = wins.reduce((sum, t) => sum + t.pnl, 0)
  const totalLossAmount = Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0))
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : 0

  const sharpeRatio = calculateSharpeRatio(trades)
  const maxDrawdown = calculateMaxDrawdown(trades)

  return {
    totalPnL,
    totalVolume,
    totalFees,
    totalTrades,
    winningTrades,
    losingTrades,
    winRate,
    avgTradeDuration,
    longTrades,
    shortTrades,
    largestGain,
    largestLoss,
    avgWin,
    avgLoss,
    profitFactor,
    sharpeRatio,
    maxDrawdown,
  }
}

export function calculateSharpeRatio(trades: Trade[]): number {
  if (trades.length < 2) return 0

  const returns = trades.map(t => t.pnlPercent)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  const stdDev = Math.sqrt(variance)
  
  return stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0 // Annualized
}

export function calculateMaxDrawdown(trades: Trade[]): number {
  if (trades.length === 0) return 0

  const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp)
  let cumulativePnL = 0
  let peak = 0
  let maxDrawdown = 0

  sortedTrades.forEach(trade => {
    cumulativePnL += trade.pnl
    peak = Math.max(peak, cumulativePnL)
    const drawdown = peak - cumulativePnL
    maxDrawdown = Math.max(maxDrawdown, drawdown)
  })

  return maxDrawdown
}

export function getSymbolStats(trades: Trade[]): SymbolStats[] {
  const symbolMap = new Map<string, Trade[]>()

  trades.forEach(trade => {
    const existing = symbolMap.get(trade.symbol) || []
    symbolMap.set(trade.symbol, [...existing, trade])
  })

  return Array.from(symbolMap.entries()).map(([symbol, symbolTrades]) => {
    const pnl = symbolTrades.reduce((sum, t) => sum + t.pnl, 0)
    const volume = symbolTrades.reduce((sum, t) => sum + (t.size * t.entryPrice), 0)
    const wins = symbolTrades.filter(t => t.pnl > 0).length
    const winRate = (wins / symbolTrades.length) * 100

    return {
      symbol,
      trades: symbolTrades.length,
      pnl,
      winRate,
      volume,
    }
  }).sort((a, b) => b.pnl - a.pnl)
}

export function getTimePerformance(trades: Trade[], interval: 'daily' | 'weekly' | 'monthly' = 'daily'): TimePerformance[] {
  if (trades.length === 0) return []

  const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp)
  const performanceMap = new Map<string, Trade[]>()

  sortedTrades.forEach(trade => {
    const date = new Date(trade.timestamp)
    let key: string

    if (interval === 'daily') {
      key = date.toISOString().split('T')[0]
    } else if (interval === 'weekly') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      key = weekStart.toISOString().split('T')[0]
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }

    const existing = performanceMap.get(key) || []
    performanceMap.set(key, [...existing, trade])
  })

  let cumulativePnL = 0
  return Array.from(performanceMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dateTrades]) => {
      const pnl = dateTrades.reduce((sum, t) => sum + t.pnl, 0)
      cumulativePnL += pnl
      const wins = dateTrades.filter(t => t.pnl > 0).length
      const winRate = (wins / dateTrades.length) * 100

      return {
        date,
        pnl,
        cumulativePnl: cumulativePnL,
        trades: dateTrades.length,
        winRate,
      }
    })
}

export function getFeeBreakdown(trades: Trade[]): FeeBreakdown[] {
  const totalFees = trades.reduce((sum, t) => sum + t.fees, 0)
  const feesByType = new Map<string, number>()

  trades.forEach(trade => {
    const current = feesByType.get(trade.orderType) || 0
    feesByType.set(trade.orderType, current + trade.fees)
  })

  return Array.from(feesByType.entries()).map(([orderType, amount]) => ({
    orderType,
    amount,
    percentage: totalFees > 0 ? (amount / totalFees) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount)
}

export function getOrderTypePerformance(trades: Trade[]): { orderType: string; pnl: number; trades: number; winRate: number }[] {
  const orderTypeMap = new Map<string, Trade[]>()

  trades.forEach(trade => {
    const existing = orderTypeMap.get(trade.orderType) || []
    orderTypeMap.set(trade.orderType, [...existing, trade])
  })

  return Array.from(orderTypeMap.entries()).map(([orderType, typeTrades]) => {
    const pnl = typeTrades.reduce((sum, t) => sum + t.pnl, 0)
    const wins = typeTrades.filter(t => t.pnl > 0).length
    const winRate = (wins / typeTrades.length) * 100

    return {
      orderType,
      pnl,
      trades: typeTrades.length,
      winRate,
    }
  }).sort((a, b) => b.pnl - a.pnl)
}

export function filterTradesByDateRange(trades: Trade[], startDate: Date | null, endDate: Date | null): Trade[] {
  return trades.filter(trade => {
    const tradeDate = trade.timestamp
    if (startDate && tradeDate < startDate.getTime()) return false
    if (endDate && tradeDate > endDate.getTime()) return false
    return true
  })
}

export function filterTradesBySymbol(trades: Trade[], symbol: string): Trade[] {
  if (!symbol || symbol === 'all') return trades
  return trades.filter(trade => trade.symbol === symbol)
}
