export interface StockQuote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  dividendYield?: number;
  trailingAnnualDividendYield?: number;
  dividendRate?: number;
  exDividendDate?: Date;
  dividendDate?: Date;
  volume?: number;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

export interface HistoricalDividend {
  date: Date;
  dividends: number;
}

// Enhanced mock data with realistic values for YieldMax ETFs and dividend stocks
const MOCK_STOCK_DATA: Record<string, StockQuote> = {
  'ULTY': {
    symbol: 'ULTY',
    regularMarketPrice: 28.45,
    regularMarketChange: 0.23,
    regularMarketChangePercent: 0.81,
    dividendYield: 58.7,
    trailingAnnualDividendYield: 58.7,
    dividendRate: 16.70,
    volume: 125000,
    high: 28.89,
    low: 28.12,
    open: 28.34,
    previousClose: 28.22,
    exDividendDate: new Date('2025-01-15'),
    dividendDate: new Date('2025-01-17')
  },
  'MSTY': {
    symbol: 'MSTY',
    regularMarketPrice: 22.15,
    regularMarketChange: -0.18,
    regularMarketChangePercent: -0.80,
    dividendYield: 64.2,
    trailingAnnualDividendYield: 64.2,
    dividendRate: 14.22,
    volume: 98000,
    high: 22.45,
    low: 21.98,
    open: 22.33,
    previousClose: 22.33,
    exDividendDate: new Date('2025-01-15'),
    dividendDate: new Date('2025-01-17')
  },
  'QYLD': {
    symbol: 'QYLD',
    regularMarketPrice: 19.80,
    regularMarketChange: 0.12,
    regularMarketChangePercent: 0.61,
    dividendYield: 11.8,
    trailingAnnualDividendYield: 11.8,
    dividendRate: 2.34,
    volume: 2100000,
    high: 19.95,
    low: 19.67,
    open: 19.75,
    previousClose: 19.68,
    exDividendDate: new Date('2025-01-28'),
    dividendDate: new Date('2025-01-31')
  },
  'JEPI': {
    symbol: 'JEPI',
    regularMarketPrice: 55.25,
    regularMarketChange: 0.34,
    regularMarketChangePercent: 0.62,
    dividendYield: 7.4,
    trailingAnnualDividendYield: 7.4,
    dividendRate: 4.09,
    volume: 1850000,
    high: 55.67,
    low: 54.89,
    open: 55.12,
    previousClose: 54.91,
    exDividendDate: new Date('2025-01-31'),
    dividendDate: new Date('2025-02-03')
  },
  'SCHD': {
    symbol: 'SCHD',
    regularMarketPrice: 78.92,
    regularMarketChange: 0.34,
    regularMarketChangePercent: 0.43,
    dividendYield: 3.47,
    trailingAnnualDividendYield: 3.47,
    dividendRate: 2.74,
    volume: 3200000,
    high: 79.23,
    low: 78.45,
    open: 78.67,
    previousClose: 78.58,
    exDividendDate: new Date('2024-03-15'),
    dividendDate: new Date('2024-03-22')
  },
  'VTI': {
    symbol: 'VTI',
    regularMarketPrice: 267.45,
    regularMarketChange: 1.87,
    regularMarketChangePercent: 0.70,
    dividendYield: 1.32,
    trailingAnnualDividendYield: 1.32,
    dividendRate: 3.53,
    volume: 4500000,
    high: 268.12,
    low: 265.89,
    open: 266.23,
    previousClose: 265.58,
    exDividendDate: new Date('2024-03-20'),
    dividendDate: new Date('2024-03-25')
  },
  'AAPL': {
    symbol: 'AAPL',
    regularMarketPrice: 175.43,
    regularMarketChange: 2.15,
    regularMarketChangePercent: 1.24,
    dividendYield: 0.52,
    trailingAnnualDividendYield: 0.52,
    dividendRate: 0.92,
    volume: 45000000,
    high: 176.89,
    low: 173.45,
    open: 174.12,
    previousClose: 173.28,
    exDividendDate: new Date('2024-02-09'),
    dividendDate: new Date('2024-02-16')
  },
  'MSFT': {
    symbol: 'MSFT',
    regularMarketPrice: 420.55,
    regularMarketChange: -1.23,
    regularMarketChangePercent: -0.29,
    dividendYield: 0.68,
    trailingAnnualDividendYield: 0.68,
    dividendRate: 2.88,
    volume: 28000000,
    high: 422.34,
    low: 418.67,
    open: 421.45,
    previousClose: 421.78,
    exDividendDate: new Date('2024-02-14'),
    dividendDate: new Date('2024-02-22')
  },
  'GOOGL': {
    symbol: 'GOOGL',
    regularMarketPrice: 142.87,
    regularMarketChange: 0.95,
    regularMarketChangePercent: 0.67,
    dividendYield: 0.0,
    trailingAnnualDividendYield: 0.0,
    dividendRate: 0.0,
    volume: 32000000,
    high: 144.23,
    low: 141.56,
    open: 142.12,
    previousClose: 141.92
  },
  'SPY': {
    symbol: 'SPY',
    regularMarketPrice: 598.45,
    regularMarketChange: 3.21,
    regularMarketChangePercent: 0.54,
    dividendYield: 1.23,
    trailingAnnualDividendYield: 1.23,
    dividendRate: 7.36,
    volume: 85000000,
    high: 599.87,
    low: 595.23,
    open: 596.12,
    previousClose: 595.24,
    exDividendDate: new Date('2024-03-15'),
    dividendDate: new Date('2024-03-22')
  },
  'QQQ': {
    symbol: 'QQQ',
    regularMarketPrice: 512.34,
    regularMarketChange: 2.87,
    regularMarketChangePercent: 0.56,
    dividendYield: 0.65,
    trailingAnnualDividendYield: 0.65,
    dividendRate: 3.33,
    volume: 42000000,
    high: 514.56,
    low: 509.78,
    open: 510.45,
    previousClose: 509.47,
    exDividendDate: new Date('2024-03-20'),
    dividendDate: new Date('2024-03-25')
  }
};

export class YahooFinanceService {
  private static instance: YahooFinanceService;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  public static getInstance(): YahooFinanceService {
    if (!YahooFinanceService.instance) {
      YahooFinanceService.instance = new YahooFinanceService();
    }
    return YahooFinanceService.instance;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Add some randomness to mock data to simulate real market movement
  private addMarketVariation(quote: StockQuote): StockQuote {
    const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
    const newPrice = quote.regularMarketPrice * (1 + variation);
    const change = newPrice - quote.regularMarketPrice;
    const changePercent = (change / quote.regularMarketPrice) * 100;

    return {
      ...quote,
      regularMarketPrice: Math.round(newPrice * 100) / 100,
      regularMarketChange: Math.round(change * 100) / 100,
      regularMarketChangePercent: Math.round(changePercent * 100) / 100
    };
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const cacheKey = `quote_${symbol}`;
      const cached = this.getCachedData<StockQuote>(cacheKey);
      if (cached) return cached;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

      const mockData = MOCK_STOCK_DATA[symbol.toUpperCase()];
      if (!mockData) {
        // Generate random data for unknown symbols
        const stockQuote: StockQuote = {
          symbol: symbol.toUpperCase(),
          regularMarketPrice: Math.round((50 + Math.random() * 200) * 100) / 100,
          regularMarketChange: Math.round((Math.random() - 0.5) * 10 * 100) / 100,
          regularMarketChangePercent: Math.round((Math.random() - 0.5) * 5 * 100) / 100,
          dividendYield: Math.random() > 0.5 ? Math.round(Math.random() * 4 * 100) / 100 : undefined,
          trailingAnnualDividendYield: Math.random() > 0.5 ? Math.round(Math.random() * 4 * 100) / 100 : undefined,
          dividendRate: Math.random() > 0.5 ? Math.round(Math.random() * 3 * 100) / 100 : undefined,
          volume: Math.round(Math.random() * 10000000),
          high: Math.round((50 + Math.random() * 200) * 100) / 100,
          low: Math.round((50 + Math.random() * 200) * 100) / 100,
          open: Math.round((50 + Math.random() * 200) * 100) / 100,
          previousClose: Math.round((50 + Math.random() * 200) * 100) / 100,
        };
        this.setCachedData(cacheKey, stockQuote);
        return stockQuote;
      }

      const stockQuote = this.addMarketVariation(mockData);
      this.setCachedData(cacheKey, stockQuote);
      return stockQuote;
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return null;
    }
  }

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
    const quotes = new Map<string, StockQuote>();
    
    // Process in batches to simulate real API behavior
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => this.getQuote(symbol));
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            quotes.set(batch[index], result.value);
          }
        });
        
        // Small delay between batches
        if (i + batchSize < symbols.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error('Error fetching batch quotes:', error);
      }
    }
    
    return quotes;
  }

  async getDividendHistory(symbol: string, period: '1mo' | '3mo' | '6mo' | '1y' | '2y' = '1y'): Promise<HistoricalDividend[]> {
    try {
      const cacheKey = `dividends_${symbol}_${period}`;
      const cached = this.getCachedData<HistoricalDividend[]>(cacheKey);
      if (cached) return cached;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      // Generate mock dividend history based on the stock's characteristics
      const dividends: HistoricalDividend[] = [];
      const now = new Date();
      const monthsBack = period === '1mo' ? 1 : period === '3mo' ? 3 : period === '6mo' ? 6 : period === '1y' ? 12 : 24;
      
      const stockData = MOCK_STOCK_DATA[symbol.toUpperCase()];
      if (!stockData || !stockData.dividendRate) {
        return dividends;
      }

      // Determine frequency based on symbol
      let frequency = 'quarterly'; // Default
      if (['ULTY', 'MSTY'].includes(symbol.toUpperCase())) {
        frequency = 'weekly';
      } else if (['QYLD', 'JEPI'].includes(symbol.toUpperCase())) {
        frequency = 'monthly';
      }

      // Generate dividend payments based on frequency
      const paymentsPerYear = frequency === 'weekly' ? 52 : frequency === 'monthly' ? 12 : 4;
      const paymentAmount = stockData.dividendRate / paymentsPerYear;
      const intervalMonths = frequency === 'weekly' ? 0.25 : frequency === 'monthly' ? 1 : 3;

      for (let i = 0; i < Math.floor(monthsBack / intervalMonths); i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (i * intervalMonths));
        dividends.push({
          date,
          dividends: Math.round(paymentAmount * 100) / 100
        });
      }

      this.setCachedData(cacheKey, dividends);
      return dividends.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error(`Error fetching dividend history for ${symbol}:`, error);
      return [];
    }
  }

  async getCompanyInfo(symbol: string) {
    try {
      const cacheKey = `info_${symbol}`;
      const cached = this.getCachedData(cacheKey);
      if (cached) return cached;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150));

      const stockData = MOCK_STOCK_DATA[symbol.toUpperCase()];
      
      // Mock company info with realistic data
      const info = {
        summaryDetail: {
          marketCap: stockData ? stockData.regularMarketPrice * 1000000000 : Math.round(Math.random() * 1000000000000),
          peRatio: Math.round((10 + Math.random() * 30) * 100) / 100,
          beta: Math.round((0.5 + Math.random() * 1.5) * 100) / 100,
          dividendYield: stockData?.dividendYield,
          trailingAnnualDividendYield: stockData?.trailingAnnualDividendYield,
          dividendRate: stockData?.dividendRate
        },
        defaultKeyStatistics: {
          sharesOutstanding: Math.round(Math.random() * 10000000000),
          bookValue: Math.round((5 + Math.random() * 50) * 100) / 100
        },
        assetProfile: {
          longBusinessSummary: this.getCompanyDescription(symbol),
          sector: this.getCompanySector(symbol),
          industry: this.getCompanyIndustry(symbol)
        }
      };

      this.setCachedData(cacheKey, info);
      return info;
    } catch (error) {
      console.error(`Error fetching company info for ${symbol}:`, error);
      return null;
    }
  }

  private getCompanyDescription(symbol: string): string {
    const descriptions: Record<string, string> = {
      'ULTY': 'YieldMax TSLA Option Income Strategy ETF seeks to generate monthly income through a synthetic covered call strategy on Tesla, Inc.',
      'MSTY': 'YieldMax MSTR Option Income Strategy ETF seeks to generate monthly income through a synthetic covered call strategy on MicroStrategy Incorporated.',
      'QYLD': 'Global X NASDAQ 100 Covered Call ETF seeks to generate income through covered call writing on the NASDAQ 100 Index.',
      'JEPI': 'JPMorgan Equity Premium Income ETF seeks to deliver monthly income and equity appreciation with lower volatility than the broader U.S. equity market.',
      'SCHD': 'Schwab US Dividend Equity ETF tracks an index of high dividend yielding U.S. stocks, excluding REITs.',
      'VTI': 'Vanguard Total Stock Market ETF seeks to track the performance of the CRSP US Total Market Index.',
      'SPY': 'SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield performance of the S&P 500 Index.',
      'QQQ': 'Invesco QQQ Trust seeks to track the performance of the NASDAQ-100 Index.'
    };
    return descriptions[symbol.toUpperCase()] || `Mock company information for ${symbol}. This is demonstration data.`;
  }

  private getCompanySector(symbol: string): string {
    const sectors: Record<string, string> = {
      'ULTY': 'Financial Services',
      'MSTY': 'Financial Services',
      'QYLD': 'Financial Services',
      'JEPI': 'Financial Services',
      'SCHD': 'Financial Services',
      'VTI': 'Financial Services',
      'SPY': 'Financial Services',
      'QQQ': 'Financial Services',
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology'
    };
    return sectors[symbol.toUpperCase()] || 'Technology';
  }

  private getCompanyIndustry(symbol: string): string {
    const industries: Record<string, string> = {
      'ULTY': 'Exchange Traded Fund',
      'MSTY': 'Exchange Traded Fund',
      'QYLD': 'Exchange Traded Fund',
      'JEPI': 'Exchange Traded Fund',
      'SCHD': 'Exchange Traded Fund',
      'VTI': 'Exchange Traded Fund',
      'SPY': 'Exchange Traded Fund',
      'QQQ': 'Exchange Traded Fund',
      'AAPL': 'Consumer Electronics',
      'MSFT': 'Software',
      'GOOGL': 'Internet Content & Information'
    };
    return industries[symbol.toUpperCase()] || 'Technology';
  }
}

export const yahooFinanceService = YahooFinanceService.getInstance();

/*
IMPORTANT: This is currently using enhanced mock data for demonstration purposes.

The mock data now includes realistic values for:
- YieldMax ETFs (ULTY, MSTY) with high dividend yields (58-64%)
- Covered call ETFs (QYLD) with moderate yields (~12%)
- Dividend growth ETFs (JEPI, SCHD) with conservative yields (3-7%)
- Market index ETFs (SPY, QQQ, VTI) with low yields (1-2%)

To implement real stock data, you would need to create a backend API that uses yahoo-finance2:

1. Create a Node.js/Express server or serverless functions
2. Install yahoo-finance2 on the server: npm install yahoo-finance2
3. Create API endpoints like:
   - GET /api/quote/:symbol
   - GET /api/quotes (with symbols as query params)
   - GET /api/dividends/:symbol
   - GET /api/company/:symbol

4. Update this service to call your backend API instead of using mock data.

Example backend endpoint:
```javascript
app.get('/api/quote/:symbol', async (req, res) => {
  try {
    const quote = await yahooFinance.quote(req.params.symbol);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

Example frontend API call:
```javascript
async getQuote(symbol: string): Promise<StockQuote | null> {
  const response = await fetch(`/api/quote/${symbol}`);
  if (!response.ok) throw new Error('Failed to fetch quote');
  return response.json();
}
```
*/