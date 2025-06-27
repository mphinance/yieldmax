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

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange: string;
  type: string;
  active: boolean;
  currency_name: string;
  cik?: string;
  composite_figi?: string;
  share_class_figi?: string;
  market_cap?: number;
  phone_number?: string;
  address?: {
    address1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
  description?: string;
  sic_code?: string;
  sic_description?: string;
  ticker_root?: string;
  homepage_url?: string;
  total_employees?: number;
  list_date?: string;
  branding?: {
    logo_url?: string;
    icon_url?: string;
  };
  share_class_shares_outstanding?: number;
  weighted_shares_outstanding?: number;
}

export interface PolygonAggregateBar {
  c: number; // close
  h: number; // high
  l: number; // low
  n: number; // number of transactions
  o: number; // open
  t: number; // timestamp
  v: number; // volume
  vw: number; // volume weighted average price
}

export interface PolygonDividend {
  cash_amount: number;
  currency: string;
  declaration_date: string;
  dividend_type: string;
  ex_dividend_date: string;
  frequency: number;
  pay_date: string;
  record_date: string;
  ticker: string;
}

export interface PolygonFlatFileData {
  ticker: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
  transactions: number;
}

// Import hardcoded historical data
import { 
  getDividendsForSymbol, 
  calculateAnnualDividendRate, 
  calculateDividendYield,
  getNextDividend,
  getHistoricalPrice,
  getAverageWeeklyDividend,
  getAverageMonthlyDividend,
  isYieldMaxETF,
  isJPMorganETF,
  getAllYieldMaxSymbols,
  getAllJPMorganSymbols
} from './historicalData';

import { 
  YIELDMAX_ETFS, 
  getETFBySymbol 
} from './yieldMaxData';

import {
  JPMORGAN_ETFS,
  getJPMorganETFBySymbol
} from './jpMorganData';

export class PolygonApiService {
  private static instance: PolygonApiService;
  private readonly apiKey: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly baseUrl = 'https://api.polygon.io';
  private readonly flatFilesUrl = 'https://files.polygon.io';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly FLAT_FILE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for flat files
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private readonly REQUEST_DELAY = 20000; // 20 seconds for better rate limiting
  private lastRequestTime = 0;
  private retryAttempts = 3;
  private retryDelay = 5000; // 5 seconds initial retry delay

  // Enhanced mock data with all YieldMax ETFs, JP Morgan ETFs, and other dividend stocks
  private readonly MOCK_STOCK_DATA: Record<string, Partial<StockQuote>> = {
    // YieldMax ETFs - use data from yieldMaxData.ts
    ...Object.fromEntries(
      YIELDMAX_ETFS.map(etf => [
        etf.symbol,
        {
          symbol: etf.symbol,
          regularMarketPrice: etf.currentPrice,
          regularMarketChange: (Math.random() - 0.5) * 2, // ±$1 variation
          regularMarketChangePercent: ((Math.random() - 0.5) * 4), // ±2% variation
          volume: Math.round(50000 + Math.random() * 200000),
          high: etf.currentPrice * 1.02,
          low: etf.currentPrice * 0.98,
          open: etf.currentPrice * (0.995 + Math.random() * 0.01),
          previousClose: etf.currentPrice * (0.995 + Math.random() * 0.01),
        }
      ])
    ),
    // JP Morgan ETFs - use data from jpMorganData.ts
    ...Object.fromEntries(
      JPMORGAN_ETFS.map(etf => [
        etf.symbol,
        {
          symbol: etf.symbol,
          regularMarketPrice: etf.currentPrice,
          regularMarketChange: (Math.random() - 0.5) * 1, // ±$0.50 variation (less volatile)
          regularMarketChangePercent: ((Math.random() - 0.5) * 2), // ±1% variation
          volume: Math.round(100000 + Math.random() * 500000),
          high: etf.currentPrice * 1.01,
          low: etf.currentPrice * 0.99,
          open: etf.currentPrice * (0.998 + Math.random() * 0.004),
          previousClose: etf.currentPrice * (0.998 + Math.random() * 0.004),
        }
      ])
    ),
    // Other dividend stocks
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
    }
  };

  public static getInstance(): PolygonApiService {
    if (!PolygonApiService.instance) {
      PolygonApiService.instance = new PolygonApiService();
    }
    return PolygonApiService.instance;
  }

  constructor() {
    this.apiKey = import.meta.env.VITE_POLYGON_API_KEY;
    this.accessKeyId = import.meta.env.POLYGON_ACCESS_KEY_ID;
    this.secretAccessKey = import.meta.env.POLYGON_SECRET_ACCESS_KEY;
    
    if (!this.apiKey || this.apiKey === 'YOUR_POLYGON_API_KEY_HERE') {
      console.warn('VITE_POLYGON_API_KEY not found. Using hardcoded data for demonstration.');
    }

    if (!this.accessKeyId || !this.secretAccessKey) {
      console.warn('Polygon flat files credentials not found. Using hardcoded historical data.');
    }
  }

  private isCacheValid(timestamp: number, duration: number = this.CACHE_DURATION): boolean {
    return Date.now() - timestamp < duration;
  }

  private getCachedData<T>(key: string, duration?: number): T | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp, duration)) {
      return cached.data as T;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Add some randomness to mock data to simulate real market movement
  private addMarketVariation(quote: Partial<StockQuote>): StockQuote {
    const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
    const basePrice = quote.regularMarketPrice || 50;
    const newPrice = basePrice * (1 + variation);
    const change = newPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol: quote.symbol || 'UNKNOWN',
      regularMarketPrice: Math.round(newPrice * 100) / 100,
      regularMarketChange: Math.round(change * 100) / 100,
      regularMarketChangePercent: Math.round(changePercent * 100) / 100,
      volume: quote.volume,
      high: quote.high,
      low: quote.low,
      open: quote.open,
      previousClose: quote.previousClose,
      dividendYield: quote.dividendYield,
      trailingAnnualDividendYield: quote.trailingAnnualDividendYield,
      dividendRate: quote.dividendRate,
      exDividendDate: quote.exDividendDate,
      dividendDate: quote.dividendDate,
      marketCap: quote.marketCap
    };
  }

  private enhanceWithHistoricalData(symbol: string, quote: StockQuote): StockQuote {
    // Use hardcoded historical data for all tracked ETFs
    if (isYieldMaxETF(symbol) || isJPMorganETF(symbol) || ['QYLD', 'SCHD'].includes(symbol)) {
      const annualDividendRate = calculateAnnualDividendRate(symbol);
      const dividendYield = calculateDividendYield(symbol, quote.regularMarketPrice);
      const nextDividend = getNextDividend(symbol);

      return {
        ...quote,
        dividendRate: annualDividendRate,
        dividendYield: dividendYield,
        trailingAnnualDividendYield: dividendYield,
        exDividendDate: nextDividend ? new Date(nextDividend.exDate) : undefined,
        dividendDate: nextDividend ? new Date(nextDividend.payableDate) : undefined
      };
    }

    return quote;
  }

  async getQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const cacheKey = `quote_${symbol}`;
      const cached = this.getCachedData<StockQuote>(cacheKey);
      if (cached) return cached;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));

      const mockData = this.MOCK_STOCK_DATA[symbol.toUpperCase()];
      let stockQuote: StockQuote;

      if (mockData) {
        stockQuote = this.addMarketVariation(mockData);
      } else {
        // Generate random data for unknown symbols
        stockQuote = {
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
      }

      // Enhance with historical dividend data
      stockQuote = this.enhanceWithHistoricalData(symbol, stockQuote);

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

  async getDividends(symbol: string, period: '1y' | '2y' = '1y'): Promise<PolygonDividend[]> {
    try {
      const cacheKey = `dividends_${symbol}_${period}`;
      const cached = this.getCachedData<PolygonDividend[]>(cacheKey);
      if (cached) return cached;

      // Use hardcoded data for tracked ETFs
      if (isYieldMaxETF(symbol) || isJPMorganETF(symbol) || ['QYLD', 'SCHD'].includes(symbol)) {
        const historicalDividends = getDividendsForSymbol(symbol);
        const polygonDividends: PolygonDividend[] = historicalDividends.map(div => {
          let frequency = 4; // Default quarterly
          
          if (isYieldMaxETF(symbol)) {
            const etf = getETFBySymbol(symbol);
            frequency = etf?.paymentFrequency === 'weekly' ? 52 : 12;
          } else if (isJPMorganETF(symbol)) {
            const etf = getJPMorganETFBySymbol(symbol);
            frequency = etf?.distributionFrequency === 'monthly' ? 12 : 4;
          } else if (['QYLD'].includes(symbol)) {
            frequency = 12; // Monthly
          }

          return {
            cash_amount: div.distributionPerShare,
            currency: 'USD',
            declaration_date: div.declaredDate,
            dividend_type: 'CD', // Cash Dividend
            ex_dividend_date: div.exDate,
            frequency: frequency,
            pay_date: div.payableDate,
            record_date: div.recordDate,
            ticker: symbol
          };
        });

        this.setCachedData(cacheKey, polygonDividends);
        return polygonDividends;
      }

      // Simulate API delay for other symbols
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      // Generate mock dividend history for other symbols
      const dividends: PolygonDividend[] = [];
      const now = new Date();
      const monthsBack = period === '1y' ? 12 : 24;
      
      // Generate quarterly dividends for most stocks
      for (let i = 0; i < Math.floor(monthsBack / 3); i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (i * 3));
        dividends.push({
          cash_amount: Math.round((0.5 + Math.random() * 2) * 100) / 100,
          currency: 'USD',
          declaration_date: date.toISOString().split('T')[0],
          dividend_type: 'CD',
          ex_dividend_date: date.toISOString().split('T')[0],
          frequency: 4,
          pay_date: date.toISOString().split('T')[0],
          record_date: date.toISOString().split('T')[0],
          ticker: symbol
        });
      }

      this.setCachedData(cacheKey, dividends);
      return dividends.sort((a, b) => new Date(b.ex_dividend_date).getTime() - new Date(a.ex_dividend_date).getTime());
    } catch (error) {
      console.error(`Error fetching dividends for ${symbol}:`, error);
      return [];
    }
  }

  async getTickerDetails(symbol: string): Promise<PolygonTickerDetails | null> {
    try {
      const cacheKey = `details_${symbol}`;
      const cached = this.getCachedData<PolygonTickerDetails>(cacheKey);
      if (cached) return cached;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 150));

      // Mock ticker details
      const details: PolygonTickerDetails = {
        ticker: symbol.toUpperCase(),
        name: this.getCompanyName(symbol),
        market: 'stocks',
        locale: 'us',
        primary_exchange: 'XNAS',
        type: (isYieldMaxETF(symbol) || isJPMorganETF(symbol)) ? 'ETF' : 'CS',
        active: true,
        currency_name: 'usd',
        market_cap: Math.round(Math.random() * 10000000000),
        description: this.getCompanyDescription(symbol),
        list_date: '2022-01-01'
      };

      this.setCachedData(cacheKey, details);
      return details;
    } catch (error) {
      console.error(`Error fetching ticker details for ${symbol}:`, error);
      return null;
    }
  }

  private getCompanyName(symbol: string): string {
    if (isYieldMaxETF(symbol)) {
      const etf = getETFBySymbol(symbol);
      return etf?.name || `YieldMax ${symbol} Option Income Strategy ETF`;
    }

    if (isJPMorganETF(symbol)) {
      const etf = getJPMorganETFBySymbol(symbol);
      return etf?.name || `JPMorgan ${symbol} ETF`;
    }

    const names: Record<string, string> = {
      'QYLD': 'Global X NASDAQ 100 Covered Call ETF',
      'SCHD': 'Schwab US Dividend Equity ETF'
    };
    return names[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`;
  }

  private getCompanyDescription(symbol: string): string {
    if (isYieldMaxETF(symbol)) {
      const etf = getETFBySymbol(symbol);
      return etf ? `${etf.name} seeks to generate income through a synthetic covered call strategy on ${etf.underlyingAsset}.` : 
        `YieldMax ${symbol} Option Income Strategy ETF seeks to generate income through option strategies.`;
    }

    if (isJPMorganETF(symbol)) {
      const etf = getJPMorganETFBySymbol(symbol);
      return etf ? `${etf.name} seeks to provide income and/or capital appreciation.` :
        `JPMorgan ${symbol} ETF seeks to provide investment results.`;
    }

    const descriptions: Record<string, string> = {
      'QYLD': 'Global X NASDAQ 100 Covered Call ETF seeks to generate income through covered call writing on the NASDAQ 100 Index.',
      'SCHD': 'Schwab US Dividend Equity ETF tracks an index of high dividend yielding U.S. stocks, excluding REITs.'
    };
    return descriptions[symbol.toUpperCase()] || `Mock company information for ${symbol}. This is demonstration data.`;
  }

  // Legacy methods for compatibility
  async getFlatFileData(ticker: string, date: string): Promise<PolygonFlatFileData | null> {
    console.log(`Using hardcoded data instead of flat files for ${ticker} on ${date}`);
    return null;
  }

  async getHistoricalData(ticker: string, date: string): Promise<PolygonAggregateBar | null> {
    const historicalPrice = getHistoricalPrice(ticker, date);
    if (historicalPrice) {
      return {
        c: historicalPrice.close,
        h: historicalPrice.high,
        l: historicalPrice.low,
        o: historicalPrice.open,
        v: historicalPrice.volume,
        vw: (historicalPrice.high + historicalPrice.low + historicalPrice.close) / 3,
        n: Math.round(Math.random() * 1000),
        t: new Date(historicalPrice.date).getTime()
      };
    }
    return null;
  }

  async getRealTimeQuote(symbol: string): Promise<any> {
    return this.getQuote(symbol);
  }

  async downloadFlatFile(date: string): Promise<boolean> {
    console.log(`Using hardcoded historical data instead of downloading flat file for ${date}`);
    return true;
  }

  private getPreviousBusinessDay(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    
    if (date.getDay() === 0) { // Sunday
      date.setDate(date.getDate() - 2);
    } else if (date.getDay() === 6) { // Saturday
      date.setDate(date.getDate() - 1);
    }
    
    return date;
  }
}

export const polygonApiService = PolygonApiService.getInstance();