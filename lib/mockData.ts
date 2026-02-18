import { Trade } from '@/types'

const SYMBOLS = ['SOL/USDC', 'BTC/USDC', 'ETH/USDC', 'JTO/USDC', 'BONK/USDC', 'WIF/USDC', 'JUP/USDC']
const ORDER_TYPES: Array<'market' | 'limit' | 'stop-loss' | 'take-profit'> = ['market', 'limit', 'stop-loss', 'take-profit']

export function generateMockTrades(count: number): Trade[] {
  const trades: Trade[] = []
  const now = Date.now()
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < count; i++) {
    const timestamp = thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo)
    const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    const side: 'long' | 'short' = Math.random() > 0.5 ? 'long' : 'short'
    const orderType = ORDER_TYPES[Math.floor(Math.random() * ORDER_TYPES.length)]
    
    // Generate realistic prices based on symbol
    let basePrice = 100
    if (symbol.startsWith('SOL')) basePrice = 100 + Math.random() * 50
    if (symbol.startsWith('BTC')) basePrice = 45000 + Math.random() * 5000
    if (symbol.startsWith('ETH')) basePrice = 2500 + Math.random() * 500
    if (symbol.startsWith('JTO')) basePrice = 2 + Math.random() * 1
    if (symbol.startsWith('BONK')) basePrice = 0.00001 + Math.random() * 0.00001
    if (symbol.startsWith('WIF')) basePrice = 1.5 + Math.random() * 1
    if (symbol.startsWith('JUP')) basePrice = 0.8 + Math.random() * 0.4

    const entryPrice = basePrice
    const priceChange = (Math.random() - 0.45) * 0.1 // Slight positive bias
    const exitPrice = entryPrice * (1 + priceChange)
    
    const size = Math.random() * 10 + 1
    const volume = size * entryPrice
    
    let pnl: number
    if (side === 'long') {
      pnl = size * (exitPrice - entryPrice)
    } else {
      pnl = size * (entryPrice - exitPrice)
    }
    
    const fees = volume * 0.001 // 0.1% fee
    pnl -= fees
    
    const pnlPercent = (pnl / volume) * 100
    const duration = Math.floor(Math.random() * 86400) + 60 // 1 min to 24 hours

    trades.push({
      id: `trade-${i}-${timestamp}`,
      timestamp,
      symbol,
      side,
      entryPrice,
      exitPrice,
      size,
      pnl,
      pnlPercent,
      fees,
      orderType,
      duration,
      notes: Math.random() > 0.7 ? generateRandomNote() : undefined,
      tags: Math.random() > 0.6 ? generateRandomTags() : undefined,
    })
  }

  return trades.sort((a, b) => b.timestamp - a.timestamp)
}

function generateRandomNote(): string {
  const notes = [
    'Strong breakout pattern',
    'Support level held well',
    'Resistance broken',
    'Followed the trend',
    'Quick scalp opportunity',
    'News-driven move',
    'High volume confirmation',
    'RSI oversold signal',
    'MACD crossover',
    'Fibonacci retracement level',
  ]
  return notes[Math.floor(Math.random() * notes.length)]
}

function generateRandomTags(): string[] {
  const allTags = ['breakout', 'reversal', 'scalp', 'swing', 'news', 'technical', 'momentum']
  const numTags = Math.floor(Math.random() * 3) + 1
  const shuffled = allTags.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numTags)
}
