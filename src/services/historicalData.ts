// Historical dividend data for YieldMax ETFs and other dividend-paying stocks
// This data is hardcoded to avoid API rate limiting and access issues

import { 
  generateYieldMaxDividends, 
  getETFBySymbol, 
  isYieldMaxETF,
  YIELDMAX_ETFS,
  type DividendPayment as YieldMaxDividendPayment 
} from './yieldMaxData';

import {
  generateJPMorganDistributions,
  getJPMorganETFBySymbol,
  isJPMorganETF,
  JPMORGAN_ETFS,
  type JPMorganDistribution
} from './jpMorganData';

export interface DividendPayment {
  symbol: string;
  distributionPerShare: number;
  declaredDate: string;
  exDate: string;
  recordDate: string;
  payableDate: string;
}

export interface HistoricalPrice {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Legacy ULTY and MSTY data (keeping for backward compatibility)
export const ULTY_DIVIDENDS_2025: DividendPayment[] = [
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0875,
    declaredDate: '06/18/2025',
    exDate: '06/20/2025',
    recordDate: '06/20/2025',
    payableDate: '06/23/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0950,
    declaredDate: '06/11/2025',
    exDate: '06/12/2025',
    recordDate: '06/12/2025',
    payableDate: '06/13/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0945,
    declaredDate: '06/04/2025',
    exDate: '06/05/2025',
    recordDate: '06/05/2025',
    payableDate: '06/06/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0954,
    declaredDate: '05/28/2025',
    exDate: '05/29/2025',
    recordDate: '05/29/2025',
    payableDate: '05/30/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0979,
    declaredDate: '05/21/2025',
    exDate: '05/22/2025',
    recordDate: '05/22/2025',
    payableDate: '05/23/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.1059,
    declaredDate: '05/14/2025',
    exDate: '05/15/2025',
    recordDate: '05/15/2025',
    payableDate: '05/16/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.1181,
    declaredDate: '05/07/2025',
    exDate: '05/08/2025',
    recordDate: '05/08/2025',
    payableDate: '05/09/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0936,
    declaredDate: '04/30/2025',
    exDate: '05/01/2025',
    recordDate: '05/01/2025',
    payableDate: '05/02/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0836,
    declaredDate: '04/23/2025',
    exDate: '04/24/2025',
    recordDate: '04/24/2025',
    payableDate: '04/25/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0852,
    declaredDate: '04/16/2025',
    exDate: '04/17/2025',
    recordDate: '04/17/2025',
    payableDate: '04/21/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0822,
    declaredDate: '04/09/2025',
    exDate: '04/10/2025',
    recordDate: '04/10/2025',
    payableDate: '04/11/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0916,
    declaredDate: '04/02/2025',
    exDate: '04/03/2025',
    recordDate: '04/03/2025',
    payableDate: '04/04/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0986,
    declaredDate: '03/26/2025',
    exDate: '03/27/2025',
    recordDate: '03/27/2025',
    payableDate: '03/28/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.0977,
    declaredDate: '03/19/2025',
    exDate: '03/20/2025',
    recordDate: '03/20/2025',
    payableDate: '03/21/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.1025,
    declaredDate: '03/12/2025',
    exDate: '03/13/2025',
    recordDate: '03/13/2025',
    payableDate: '03/14/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.4653,
    declaredDate: '03/05/2025',
    exDate: '03/06/2025',
    recordDate: '03/06/2025',
    payableDate: '03/07/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.5369,
    declaredDate: '02/05/2025',
    exDate: '02/06/2025',
    recordDate: '02/06/2025',
    payableDate: '02/07/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.5715,
    declaredDate: '01/07/2025',
    exDate: '01/08/2025',
    recordDate: '01/08/2025',
    payableDate: '01/10/2025'
  },
  {
    symbol: 'ULTY',
    distributionPerShare: 0.7092,
    declaredDate: '12/11/2024',
    exDate: '12/12/2024',
    recordDate: '12/12/2024',
    payableDate: '12/13/2024'
  }
];

export const MSTY_DIVIDENDS_2025: DividendPayment[] = [
  {
    symbol: 'MSTY',
    distributionPerShare: 1.4707,
    declaredDate: '06/04/2025',
    exDate: '06/05/2025',
    recordDate: '06/05/2025',
    payableDate: '06/06/2025'
  },
  {
    symbol: 'MSTY',
    distributionPerShare: 2.3734,
    declaredDate: '05/07/2025',
    exDate: '05/08/2025',
    recordDate: '05/08/2025',
    payableDate: '05/09/2025'
  },
  {
    symbol: 'MSTY',
    distributionPerShare: 1.3356,
    declaredDate: '04/09/2025',
    exDate: '04/10/2025',
    recordDate: '04/10/2025',
    payableDate: '04/11/2025'
  },
  {
    symbol: 'MSTY',
    distributionPerShare: 1.3775,
    declaredDate: '03/12/2025',
    exDate: '03/13/2025',
    recordDate: '03/13/2025',
    payableDate: '03/14/2025'
  },
  {
    symbol: 'MSTY',
    distributionPerShare: 2.0216,
    declaredDate: '02/12/2025',
    exDate: '02/13/2025',
    recordDate: '02/13/2025',
    payableDate: '02/14/2025'
  },
  {
    symbol: 'MSTY',
    distributionPerShare: 2.2792,
    declaredDate: '01/15/2025',
    exDate: '01/16/2025',
    recordDate: '01/16/2025',
    payableDate: '01/17/2025'
  }
];

// Generate all YieldMax dividends
const ALL_YIELDMAX_DIVIDENDS = generateYieldMaxDividends();

// Generate all JP Morgan distributions
const ALL_JPMORGAN_DISTRIBUTIONS = generateJPMorganDistributions();

// Convert YieldMax dividends to our format
const YIELDMAX_DIVIDENDS_CONVERTED: DividendPayment[] = ALL_YIELDMAX_DIVIDENDS.map(div => ({
  symbol: div.symbol,
  distributionPerShare: div.distributionPerShare,
  declaredDate: div.declaredDate,
  exDate: div.exDate,
  recordDate: div.recordDate,
  payableDate: div.payableDate
}));

// Convert JP Morgan distributions to our format
const JPMORGAN_DIVIDENDS_CONVERTED: DividendPayment[] = ALL_JPMORGAN_DISTRIBUTIONS.map(dist => ({
  symbol: dist.symbol,
  distributionPerShare: dist.distributionPerShare,
  declaredDate: dist.exDate, // Use ex-date as declared date for simplicity
  exDate: dist.exDate,
  recordDate: dist.recordDate,
  payableDate: dist.payableDate
}));

// Combined dividend data - prioritize specific data for tracked ETFs
export const ALL_DIVIDENDS_2025: DividendPayment[] = [
  ...YIELDMAX_DIVIDENDS_CONVERTED,
  ...JPMORGAN_DIVIDENDS_CONVERTED,
  // Add other non-YieldMax, non-JP Morgan dividend stocks here
];

// Mock historical price data
export const HISTORICAL_PRICES: HistoricalPrice[] = [
  // YieldMax ETF prices
  ...YIELDMAX_ETFS.map(etf => ({
    symbol: etf.symbol,
    date: '2025-06-20',
    open: etf.currentPrice * 0.995,
    high: etf.currentPrice * 1.015,
    low: etf.currentPrice * 0.985,
    close: etf.currentPrice,
    volume: Math.round(50000 + Math.random() * 200000)
  })),
  // JP Morgan ETF prices
  ...JPMORGAN_ETFS.map(etf => ({
    symbol: etf.symbol,
    date: '2025-06-20',
    open: etf.currentPrice * 0.995,
    high: etf.currentPrice * 1.015,
    low: etf.currentPrice * 0.985,
    close: etf.currentPrice,
    volume: Math.round(100000 + Math.random() * 500000)
  })),
  // Legacy data
  {
    symbol: 'QYLD',
    date: '2025-06-20',
    open: 19.75,
    high: 19.95,
    low: 19.67,
    close: 19.80,
    volume: 2100000
  }
];

// Helper functions
export function getDividendsForSymbol(symbol: string): DividendPayment[] {
  if (isYieldMaxETF(symbol)) {
    return YIELDMAX_DIVIDENDS_CONVERTED.filter(dividend => dividend.symbol === symbol);
  }
  if (isJPMorganETF(symbol)) {
    return JPMORGAN_DIVIDENDS_CONVERTED.filter(dividend => dividend.symbol === symbol);
  }
  return ALL_DIVIDENDS_2025.filter(dividend => dividend.symbol === symbol);
}

export function getDividendsForDateRange(symbol: string, startDate: string, endDate: string): DividendPayment[] {
  const symbolDividends = getDividendsForSymbol(symbol);
  return symbolDividends.filter(dividend => {
    const exDate = new Date(dividend.exDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return exDate >= start && exDate <= end;
  });
}

export function getLatestDividend(symbol: string): DividendPayment | null {
  const dividends = getDividendsForSymbol(symbol);
  if (dividends.length === 0) return null;
  
  return dividends.reduce((latest, current) => {
    return new Date(current.exDate) > new Date(latest.exDate) ? current : latest;
  });
}

export function getNextDividend(symbol: string): DividendPayment | null {
  const dividends = getDividendsForSymbol(symbol);
  const today = new Date();
  
  const futureDividends = dividends.filter(dividend => new Date(dividend.exDate) > today);
  if (futureDividends.length === 0) return null;
  
  return futureDividends.reduce((earliest, current) => {
    return new Date(current.exDate) < new Date(earliest.exDate) ? current : earliest;
  });
}

export function calculateAnnualDividendRate(symbol: string): number {
  if (isYieldMaxETF(symbol)) {
    const etf = getETFBySymbol(symbol);
    if (etf) {
      const dividends = getDividendsForSymbol(symbol);
      return dividends.reduce((sum, dividend) => sum + dividend.distributionPerShare, 0);
    }
  }
  
  if (isJPMorganETF(symbol)) {
    const etf = getJPMorganETFBySymbol(symbol);
    if (etf) {
      const distributions = getDividendsForSymbol(symbol);
      return distributions.reduce((sum, dist) => sum + dist.distributionPerShare, 0);
    }
  }
  
  const dividends = getDividendsForSymbol(symbol);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  const recentDividends = dividends.filter(dividend => 
    new Date(dividend.exDate) >= oneYearAgo
  );
  
  return recentDividends.reduce((sum, dividend) => sum + dividend.distributionPerShare, 0);
}

export function calculateDividendYield(symbol: string, currentPrice: number): number {
  const annualRate = calculateAnnualDividendRate(symbol);
  return (annualRate / currentPrice) * 100;
}

// Get historical price for a specific date
export function getHistoricalPrice(symbol: string, date: string): HistoricalPrice | null {
  return HISTORICAL_PRICES.find(price => 
    price.symbol === symbol && price.date === date
  ) || null;
}

// Calculate average weekly dividend for weekly payers
export function getAverageWeeklyDividend(symbol: string): number {
  const dividends = getDividendsForSymbol(symbol);
  if (dividends.length === 0) return 0;
  
  if (isYieldMaxETF(symbol)) {
    const etf = getETFBySymbol(symbol);
    if (etf && etf.paymentFrequency === 'weekly') {
      const recentDividends = dividends.slice(0, 12); // Last 12 payments
      const total = recentDividends.reduce((sum, div) => sum + div.distributionPerShare, 0);
      return total / recentDividends.length;
    }
  }
  
  // Legacy calculation for ULTY
  const recentDividends = dividends.slice(0, 12);
  const total = recentDividends.reduce((sum, div) => sum + div.distributionPerShare, 0);
  return total / recentDividends.length;
}

// Calculate average monthly dividend for monthly payers
export function getAverageMonthlyDividend(symbol: string): number {
  const dividends = getDividendsForSymbol(symbol);
  if (dividends.length === 0) return 0;
  
  if (isYieldMaxETF(symbol)) {
    const etf = getETFBySymbol(symbol);
    if (etf && etf.paymentFrequency === 'monthly') {
      const recentDividends = dividends.slice(0, 6); // Last 6 payments
      const total = recentDividends.reduce((sum, div) => sum + div.distributionPerShare, 0);
      return total / recentDividends.length;
    }
  }
  
  if (isJPMorganETF(symbol)) {
    const recentDividends = dividends.slice(0, 6); // Last 6 payments
    const total = recentDividends.reduce((sum, div) => sum + div.distributionPerShare, 0);
    return total / recentDividends.length;
  }
  
  // Legacy calculation for MSTY
  const recentDividends = dividends.slice(0, 6);
  const total = recentDividends.reduce((sum, div) => sum + div.distributionPerShare, 0);
  return total / recentDividends.length;
}

// Get all YieldMax ETF symbols
export function getAllYieldMaxSymbols(): string[] {
  return YIELDMAX_ETFS.map(etf => etf.symbol);
}

// Get all JP Morgan ETF symbols
export function getAllJPMorganSymbols(): string[] {
  return JPMORGAN_ETFS.map(etf => etf.symbol);
}

// Check if symbol is YieldMax ETF (re-export for convenience)
export { isYieldMaxETF };

// Check if symbol is JP Morgan ETF (re-export for convenience)
export { isJPMorganETF };