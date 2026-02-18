# Deriverse Analytics

A comprehensive, next-generation trading analytics solution for the Deriverse Solana trading ecosystem. This professional dashboard provides active traders with powerful tools for tracking performance, analyzing portfolios, and maintaining detailed trading journals.

![Deriverse Analytics](https://img.shields.io/badge/Deriverse-Analytics-blue)
![Solana](https://img.shields.io/badge/Solana-Blockchain-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🎯 Overview

Deriverse Analytics is a fully-featured trading analytics platform designed for professional traders on Deriverse. It offers real-time portfolio tracking, comprehensive performance metrics, risk analysis, and a detailed trading journal with annotation capabilities.

### Key Features

#### 📊 **Dashboard Analytics**
- **Total PnL Tracking** with visual performance indicators
- **Win Rate Statistics** with detailed W/L breakdown
- **Volume & Fee Analysis** across all trading activities
- **Trade Count Metrics** with temporal analysis
- **Long/Short Ratio** analysis with directional bias tracking
- **Largest Gain/Loss** tracking for risk management
- **Average Win/Loss** amount analysis
- **Profit Factor** and risk-adjusted metrics
- **Sharpe Ratio** calculation for performance evaluation
- **Maximum Drawdown** tracking and visualization

#### 📈 **Advanced Visualizations**
- **Cumulative PnL Chart** with area gradients
- **Daily PnL Bar Chart** with color-coded profits/losses
- **Symbol Performance** analysis (top performers)
- **Fee Breakdown** pie charts by order type
- **Order Type Performance** comparison
- **Symbol Statistics Table** with sortable metrics

#### 📝 **Trading Journal**
- **Complete Trade History** with detailed information
- **Annotation Capabilities** - add notes to any trade
- **Tag System** - categorize trades with custom tags
- **Advanced Search** - find trades by symbol, notes, or tags
- **Editable Trade Details** - inline editing of notes and tags
- **Trade Filtering** by date range and symbol
- **Real-time Statistics** based on filtered results

#### 💼 **Portfolio Analysis**
- **Equity Curve** with drawdown visualization
- **Risk-Adjusted Metrics**:
  - Average Return
  - Volatility (Standard Deviation)
  - Value at Risk (95%)
  - Calmar Ratio
  - Sortino Ratio
- **Time-based Performance**:
  - Performance by hour of day
  - Performance by day of week
  - Best trading hours identification
  - Best trading days analysis
- **PnL Distribution** histogram
- **Drawdown Analysis** with real-time tracking

#### 🔍 **Filtering & Analysis**
- **Date Range Selection** with calendar interface
- **Symbol-specific Filtering** for focused analysis
- **Time Interval Selection** (daily, weekly, monthly)
- **Dynamic Recalculation** of all metrics based on filters

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Connect your wallet**
   Click the "Connect Wallet" button and select your Solana wallet

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
deriverse-analytics/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with wallet provider
│   └── page.tsx             # Main application page
├── components/
│   ├── Dashboard.tsx        # Main analytics dashboard
│   ├── TradingJournal.tsx   # Trade history with annotations
│   ├── PortfolioAnalysis.tsx # Advanced portfolio metrics
│   ├── Header.tsx           # Navigation and wallet button
│   ├── WalletProvider.tsx   # Solana wallet integration
│   ├── DateRangeFilter.tsx  # Date filtering component
│   └── SymbolFilter.tsx     # Symbol filtering component
├── lib/
│   ├── analytics.ts         # Core analytics calculations
│   ├── mockData.ts          # Mock trade data generator
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 📊 Features in Detail

### Dashboard

The dashboard provides a comprehensive overview of your trading performance:

- **Key Metrics Cards**: Display total PnL, win rate, trade count, and average duration
- **Additional Metrics**: Show largest gains/losses, average win/loss, long/short ratio, profit factor, Sharpe ratio, and max drawdown
- **Charts**:
  - Cumulative PnL area chart with gradient fill
  - Daily PnL bar chart with color-coded bars
  - Top symbols horizontal bar chart
  - Fee breakdown pie chart
  - Order type performance cards
- **Symbol Statistics Table**: Sortable table showing performance by trading pair

### Trading Journal

A detailed trade-by-trade view with annotation capabilities:

- **Trade Table**: Shows all trade details including entry/exit prices, PnL, duration, and order type
- **Inline Editing**: Click the edit button to add notes and tags to any trade
- **Search & Filter**: Find specific trades using text search, date ranges, or symbol filters
- **Quick Stats**: View filtered statistics at the top of the journal
- **Tag System**: Organize trades with custom tags (e.g., "breakout", "scalp", "news")

### Portfolio Analysis

Advanced risk and performance analysis:

- **Equity Curve**: Visualize your account balance over time
- **Drawdown Chart**: See underwater equity and recovery periods
- **Risk Metrics**:
  - **Average Return**: Mean return per trade
  - **Volatility**: Standard deviation of returns
  - **VaR 95%**: Worst expected loss at 95% confidence
  - **Calmar Ratio**: Return divided by max drawdown
  - **Sortino Ratio**: Risk-adjusted return considering downside deviation
- **Time Analysis**:
  - Identify your most profitable trading hours
  - Find which days of the week perform best
  - Optimize your trading schedule
- **Distribution Analysis**: See the frequency of different PnL ranges

## 🔧 Technical Details

### Analytics Calculations

#### Trade Statistics
- **Win Rate**: `(Winning Trades / Total Trades) × 100`
- **Profit Factor**: `Total Wins / |Total Losses|`
- **Sharpe Ratio**: `(Average Return / Std Dev) × √252` (annualized)
- **Max Drawdown**: Maximum peak-to-trough decline in cumulative PnL
- **Calmar Ratio**: `Total PnL / Max Drawdown`
- **Sortino Ratio**: Similar to Sharpe but only considers downside volatility

#### Risk Metrics
- **Value at Risk (95%)**: 5th percentile of all returns
- **Volatility**: Standard deviation of percentage returns
- **Downside Deviation**: Standard deviation of negative returns only

### Data Flow

1. **Wallet Connection**: User connects Solana wallet via Phantom/Solflare
2. **Trade Loading**: System loads trade history (currently using mock data)
3. **Calculation**: Analytics engine processes trades and calculates metrics
4. **Visualization**: React components render charts and tables
5. **Filtering**: User applies filters, triggering recalculation
6. **Annotation**: Users can edit trades to add notes and tags

### Technologies Used

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for all visualizations
- **Blockchain**: Solana Web3.js
- **Wallet**: Solana Wallet Adapter
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🎨 Design Philosophy

### User Experience
- **Clean & Professional**: Minimalist design focused on data clarity
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode**: Automatic dark mode support
- **Performance**: Optimized calculations with useMemo hooks
- **Accessibility**: Proper ARIA labels and semantic HTML

### Code Quality
- **Type Safety**: Full TypeScript coverage
- **Modularity**: Separated concerns with clean component structure
- **Reusability**: Shared utility functions and components
- **Performance**: Memoized calculations and efficient rendering
- **Documentation**: Comprehensive inline comments

## 🔐 Security Considerations

- **Wallet Security**: Uses official Solana Wallet Adapter
- **No Private Keys**: Never requests or stores private keys
- **Read-Only**: Currently operates in read-only mode
- **Local Processing**: All calculations done client-side
- **No Data Storage**: No user data stored on servers

## 🚦 Roadmap

### Phase 1: Current Features ✅
- [x] Dashboard with comprehensive metrics
- [x] Trading journal with annotations
- [x] Portfolio analysis with risk metrics
- [x] Filtering and search capabilities
- [x] Mock data for demonstration

### Phase 2: Blockchain Integration
- [ ] Real Deriverse protocol integration
- [ ] Live trade data from Solana blockchain
- [ ] Transaction history parsing
- [ ] Position tracking
- [ ] Real-time updates

### Phase 3: Advanced Features
- [ ] Custom alerts and notifications
- [ ] Strategy backtesting
- [ ] Performance comparison (vs benchmarks)
- [ ] Trade replication suggestions
- [ ] AI-powered insights
- [ ] Export functionality (CSV, PDF)
- [ ] Mobile app

### Phase 4: Social & Community
- [ ] Leaderboards
- [ ] Strategy sharing
- [ ] Copy trading
- [ ] Community insights

## 📖 Usage Guide

### Connecting Your Wallet

1. Click "Select Wallet" button in the header
2. Choose your wallet provider (Phantom, Solflare, etc.)
3. Approve the connection in your wallet
4. Dashboard will load with your trading data

### Viewing Analytics

1. **Dashboard Tab**: View overall performance metrics
2. **Journal Tab**: See detailed trade history
3. **Portfolio Tab**: Analyze risk and time-based performance

### Filtering Data

1. Click the date range filter to select specific time periods
2. Use the symbol dropdown to focus on specific trading pairs
3. In the journal, use the search box to find trades by notes or tags

### Adding Notes & Tags

1. Go to the Journal tab
2. Click the edit icon next to any trade
3. Add notes describing your trade rationale
4. Add tags (comma-separated) to categorize the trade
5. Click "Save" to store your annotations

### Interpreting Metrics

- **Profit Factor > 2**: Excellent performance
- **Sharpe Ratio > 1**: Good risk-adjusted returns
- **Win Rate > 50%**: More winners than losers
- **Calmar Ratio > 1**: Returns exceed drawdown

## 🤝 Contributing

This project is built for the Deriverse Hackathon. Contributions, suggestions, and feedback are welcome!

### Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build
```

## 📄 License

This project is built for the Deriverse Hackathon submission.

## 🔗 Links

- **Documentation**: [Deriverse Docs](https://deriverse.io/docs)
- **GitHub**: [Your Repository URL]
- **Social Media**: [Your Twitter/X Handle]

## 👨‍💻 Author

Created for the Deriverse Hackathon 2025

## 🙏 Acknowledgments

- Deriverse team for building an amazing trading platform
- Solana Foundation for the blockchain infrastructure
- Next.js and Vercel for the excellent framework
- The open-source community

---

**Note**: This project currently uses mock data for demonstration purposes. Integration with the actual Deriverse protocol and Solana blockchain will be implemented in the next phase.

For questions or support, please open an issue on GitHub or reach out via social media.
