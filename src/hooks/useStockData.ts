import { useState, useEffect } from 'react';
import { polygonApiService, StockQuote } from '../services/polygonApi';

export function useStockData(symbols: string[]) {
  const [quotes, setQuotes] = useState<Map<string, StockQuote>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchQuotes = async () => {
    if (symbols.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const quotesMap = await polygonApiService.getMultipleQuotes(symbols);
      setQuotes(quotesMap);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      console.error('Error fetching stock data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
    
    // Set up periodic refresh every 5 minutes during market hours
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      
      // Only refresh during extended market hours (6:00 AM - 8:00 PM ET, Mon-Fri)
      // This accounts for pre-market and after-hours trading
      if (day >= 1 && day <= 5 && hour >= 6 && hour <= 20) {
        fetchQuotes();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  const refreshData = () => {
    setLoading(true);
    fetchQuotes();
  };

  return {
    quotes,
    loading,
    error,
    lastUpdated,
    refreshData
  };
}

export function useStockQuote(symbol: string) {
  const { quotes, loading, error, lastUpdated, refreshData } = useStockData([symbol]);
  
  return {
    quote: quotes.get(symbol) || null,
    loading,
    error,
    lastUpdated,
    refreshData
  };
}