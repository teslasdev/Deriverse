# Deriverse Analytics - Technical Documentation

## Architecture Overview

This document provides detailed technical information about the Deriverse Analytics platform architecture, design decisions, and implementation details.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Application                       │
│                      (Next.js 14)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Journal    │  │  Portfolio   │     │
│  │  Component   │  │  Component   │  │  Component   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                          │                                  │
│              ┌───────────▼──────────┐                      │
│              │  Analytics Engine    │                      │
│              │  (lib/analytics.ts)  │                      │
│              └───────────┬──────────┘                      │
│                          │                                  │
│              ┌───────────▼──────────┐                      │
│              │   Trade Data Store   │                      │
│              │   (React State)      │                      │
│              └───────────┬──────────┘                      │
│                          │                                  │
├──────────────────────────┼──────────────────────────────────┤
│                          │                                  │
│              ┌───────────▼──────────┐                      │
│              │  Solana Integration  │                      │
│              │  (Wallet Adapter)    │                      │
│              └───────────┬──────────┘                      │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                ┌──────────▼──────────┐
                │  Solana Blockchain  │
                │  (Devnet/Mainnet)   │
                └─────────────────────┘
```

## Core Modules

### 1. Analytics Engine (`lib/analytics.ts`)

The analytics engine is the heart of the application, responsible for all calculations and statistical analysis.

#### Key Functions

**`calculateTradeStats(trades: Trade[]): TradeStats`**
- Calculates comprehensive trading statistics
- Processes all trades to generate aggregate metrics
- Time complexity: O(n) where n is number of trades

**`calculateSharpeRatio(trades: Trade[]): number`**
- Computes risk-adjusted returns
- Formula: `(Average Return / Standard Deviation) × √252`
- Annualized for yearly comparison

**`calculateMaxDrawdown(trades: Trade[]): number`**
- Finds maximum peak-to-trough decline
- Uses cumulative PnL tracking
- Time complexity: O(n)

**`getSymbolStats(trades: Trade[]): SymbolStats[]`**
- Groups trades by symbol
- Calculates per-symbol metrics
- Returns sorted array by PnL

**`getTimePerformance(trades: Trade[], interval): TimePerformance[]`**
- Aggregates performance by time intervals
- Supports daily, weekly, monthly grouping
- Returns chronologically sorted data

**`getFeeBreakdown(trades: Trade[]): FeeBreakdown[]`**
- Analyzes fee distribution
- Groups by order type
- Returns percentage breakdown

### 2. Component Architecture

#### Dashboard Component
```typescript
Dashboard
├── Filters (Date Range, Symbol)
├── Key Metrics Cards
│   ├── Total PnL
│   ├── Win Rate
│   ├── Total Trades
│   └── Average Duration
├── Additional Metrics Grid
│   ├── Largest Gain/Loss
│   ├── Average Win/Loss
│   ├── Long/Short Ratio
│   └── Risk Metrics
├── Charts
│   ├── Cumulative PnL (Area Chart)
│   ├── Daily PnL (Bar Chart)
│   ├── Symbol Performance (Horizontal Bar)
│   ├── Fee Breakdown (Pie Chart)
│   └── Order Type Performance (Custom)
└── Symbol Statistics Table
```

#### Trading Journal Component
```typescript
TradingJournal
├── Filters & Search
│   ├── Date Range Filter
│   ├── Symbol Filter
│   └── Text Search
├── Summary Statistics
├── Trade Table
│   ├── Trade Row
│   │   ├── Trade Details
│   │   ├── PnL Display
│   │   ├── Notes Section
│   │   ├── Tags Section
│   │   └── Edit Controls
│   └── Empty State
└── Pagination (future)
```

#### Portfolio Analysis Component
```typescript
PortfolioAnalysis
├── Filters (Date Range, Interval)
├── Risk Metrics Cards
│   ├── Average Return
│   ├── Volatility
│   ├── Value at Risk
│   ├── Calmar Ratio
│   └── Sortino Ratio
├── Equity & Drawdown Chart
├── Time-Based Analysis
│   ├── Hour of Day Chart
│   └── Day of Week Chart
├── PnL Distribution
└── Performance Tables
    ├── Best Hours
    └── Best Days
```

## Data Flow

### 1. Trade Data Loading

```
User Connects Wallet
       │
       ▼
Wallet Provider Initializes
       │
       ▼
Connection Detected (useWallet hook)
       │
       ▼
loadTrades() Called
       │
       ▼
Mock Data Generated (temporary)
       │
       ▼
trades State Updated
       │
       ▼
Components Re-render with Data
```

### 2. Filter Application

```
User Applies Filter
       │
       ▼
Filter State Updated
       │
       ▼
useMemo Hook Triggered
       │
       ▼
filterTradesByDateRange() or filterTradesBySymbol()
       │
       ▼
Filtered Trades Array Created
       │
       ▼
Analytics Recalculated (memoized)
       │
       ▼
Charts & Tables Re-render
```

### 3. Trade Annotation

```
User Clicks Edit Button
       │
       ▼
Edit State Activated for Trade
       │
       ▼
Input Fields Displayed
       │
       ▼
User Enters Notes/Tags
       │
       ▼
User Clicks Save
       │
       ▼
setTrades() Updates State
       │
       ▼
Trade Object Modified
       │
       ▼
Component Re-renders with New Data
```

## Performance Optimizations

### 1. Memoization Strategy

All expensive calculations are memoized using `useMemo`:

```typescript
const stats = useMemo(() => calculateTradeStats(filteredTrades), [filteredTrades])
const timePerformance = useMemo(() => getTimePerformance(filteredTrades, 'daily'), [filteredTrades])
```

Benefits:
- Calculations only run when dependencies change
- Prevents unnecessary re-renders
- Maintains smooth UI performance with large datasets

### 2. Filtering Optimization

Filters are applied in sequence with short-circuit evaluation:

```typescript
const filteredTrades = useMemo(() => {
  let filtered = filterTradesByDateRange(trades, dateRange.start, dateRange.end)
  filtered = filterTradesBySymbol(filtered, selectedSymbol)
  return filtered
}, [trades, dateRange, selectedSymbol])
```

### 3. Chart Rendering

- ResponsiveContainer ensures optimal sizing
- Minimal re-renders through React.memo (where applicable)
- Efficient data transformation before passing to charts

## State Management

### Global State
- Managed via React Context (WalletProvider)
- Wallet connection state
- Network configuration

### Local State
- Trade data array (main page)
- Filter states (each component)
- Edit states (journal component)
- UI states (loading, modals, etc.)

### Why No External State Library?

The application uses React's built-in state management because:
1. State is mostly component-local
2. Prop drilling is minimal (max 2 levels)
3. No complex async state coordination
4. Simpler debugging and maintenance
5. Smaller bundle size

## Type System

### Core Types

```typescript
interface Trade {
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
  duration: number
  notes?: string
  tags?: string[]
}

interface TradeStats {
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
```

## Styling System

### Tailwind Configuration

Custom color palette:
- **Primary**: Blue tones for CTAs and emphasis
- **Success**: Green for positive PnL
- **Danger**: Red for negative PnL
- **Slate**: Neutral grays for backgrounds and text

### Component Classes

Reusable utility classes:
- `.card`: Standard card styling
- `.stat-card`: Metric card with hover effects
- `.btn-primary`: Primary button styling
- `.input-field`: Form input styling
- `.select-field`: Select dropdown styling

### Dark Mode

Automatic dark mode support using Tailwind's dark mode:
```css
.card {
  @apply bg-white dark:bg-slate-800 ...;
}
```

## Testing Strategy

### Unit Tests (Recommended)
- Test analytics calculation functions
- Test utility functions (formatting, date handling)
- Test filter functions

### Integration Tests (Recommended)
- Test component rendering with different data
- Test filter application
- Test annotation workflow

### E2E Tests (Recommended)
- Test wallet connection flow
- Test navigation between tabs
- Test data filtering and search

## Security Considerations

### Wallet Integration
- Uses official @solana/wallet-adapter packages
- Never requests private keys
- Only requests public key and signature permissions
- All transactions user-initiated

### Data Privacy
- No server-side data storage
- All processing client-side
- No analytics tracking (optional for production)
- No third-party data sharing

### XSS Prevention
- React automatically escapes content
- No dangerouslySetInnerHTML usage
- User input sanitized in annotations

## Deployment

### Environment Variables
```bash
# Optional: Custom RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_HOST=https://api.devnet.solana.com

# Optional: Network selection
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### Build Process
```bash
npm run build  # Creates optimized production build
npm start      # Starts production server
```

### Hosting Recommendations
- **Vercel**: Zero-config deployment (recommended)
- **Netlify**: Good alternative
- **AWS Amplify**: For AWS integration
- **Self-hosted**: Docker container available

## Browser Compatibility

Supported browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance Benchmarks

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Future Enhancements

### Blockchain Integration
- Parse Deriverse protocol transactions
- Real-time position tracking
- Historical trade reconstruction
- Multi-wallet support

### Advanced Analytics
- Monte Carlo simulations
- Strategy backtesting
- Correlation analysis
- Benchmarking vs market

### Performance
- Virtual scrolling for large datasets
- Web Workers for heavy calculations
- IndexedDB for local caching
- Progressive Web App (PWA)

## Debugging

### Common Issues

**Wallet won't connect**
- Check network (devnet vs mainnet)
- Clear browser cache
- Update wallet extension

**Charts not rendering**
- Check console for errors
- Verify data format
- Check responsive container sizing

**Slow performance**
- Check number of trades
- Disable unnecessary filters
- Clear browser data

### Development Tools

Recommended VS Code extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive variable names

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- PR reviews before merge
- Semantic versioning

### Documentation
- Update README for new features
- Add JSDoc comments to functions
- Update technical docs
- Include usage examples

---

For questions or clarifications, please open an issue on GitHub.
