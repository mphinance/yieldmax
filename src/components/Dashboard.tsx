import React from 'react';
import { DollarSign, TrendingUp, Calendar, Target, ArrowUp, Info, Percent } from 'lucide-react';
import { yieldMaxDividendService } from '../services/yieldMaxDividendService';

export function Dashboard() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get next payment group and upcoming ETFs
  const getUpcomingPaymentGroup = () => {
    const upcomingPayments = yieldMaxDividendService.getUpcomingDividends(20);
    if (upcomingPayments.length === 0) return null;
    
    // Get the next payment date and group
    const nextPayment = upcomingPayments[0];
    const nextPaymentDate = nextPayment.date;
    const nextGroup = nextPayment.group;
    
    // Get all ETFs paying on that date
    const groupETFs = upcomingPayments.filter(p => p.date === nextPaymentDate && p.group === nextGroup);
    
    return {
      group: nextGroup,
      date: nextPaymentDate,
      etfs: groupETFs,
      dayOfWeek: new Date(nextPaymentDate).toLocaleDateString('en-US', { weekday: 'long' })
    };
  };

  // Mock current market data for YieldMax ETFs
  const getETFMarketData = (symbol: string) => {
    const marketData: Record<string, { price: number; change: number; changePercent: number; yield: number; lastDividend: number }> = {
      'ULTY': { price: 28.45, change: 0.23, changePercent: 0.81, yield: 58.7, lastDividend: 0.3405 },
      'MSTY': { price: 22.15, change: -0.18, changePercent: -0.80, yield: 64.2, lastDividend: 0.3570 },
      'NVDY': { price: 31.78, change: 0.45, changePercent: 1.44, yield: 61.2, lastDividend: 0.3906 },
      'OARK': { price: 24.12, change: 0.12, changePercent: 0.50, yield: 52.3, lastDividend: 0.2810 },
      'CONY': { price: 19.87, change: -0.08, changePercent: -0.40, yield: 55.8, lastDividend: 0.2200 },
      'AMZY': { price: 26.34, change: 0.34, changePercent: 1.31, yield: 48.9, lastDividend: 0.2600 },
      'APLY': { price: 25.67, change: 0.21, changePercent: 0.83, yield: 45.6, lastDividend: 0.2400 },
      'GOOY': { price: 23.89, change: 0.15, changePercent: 0.63, yield: 42.1, lastDividend: 0.2100 },
      'NFLY': { price: 21.45, change: -0.12, changePercent: -0.56, yield: 47.3, lastDividend: 0.1900 },
      'MSFY': { price: 27.12, change: 0.18, changePercent: 0.67, yield: 44.8, lastDividend: 0.2500 },
      'PYPY': { price: 18.93, change: -0.05, changePercent: -0.26, yield: 51.2, lastDividend: 0.1800 },
      'SPYY': { price: 29.56, change: 0.28, changePercent: 0.96, yield: 38.7, lastDividend: 0.2200 }
    };
    
    return marketData[symbol] || { price: 25.00, change: 0, changePercent: 0, yield: 50.0, lastDividend: 0.25 };
  };

  const upcomingGroup = getUpcomingPaymentGroup();

  // Get next payment
  const upcomingPayments = yieldMaxDividendService.getUpcomingDividends(1);
  const nextPayment = upcomingPayments[0];

  // Get current month breakdown
  const currentDate = new Date();
  const monthlyBreakdown = yieldMaxDividendService.getMonthlyBreakdown(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Calculate portfolio stats - Fixed calculation
  const holdings = yieldMaxDividendService.getHoldings();
  
  // Safely calculate total shares by checking if holdings exist and have the expected structure
  let totalShares = 0;
  let totalETFs = 0;
  
  if (holdings && typeof holdings === 'object') {
    totalETFs = Object.keys(holdings).length;
    
    // Fix the shares calculation - handle both array and object structures
    totalShares = Object.values(holdings).reduce((sum, holding) => {
      // If holding is an array, flatten it and sum all shares
      if (Array.isArray(holding)) {
        return sum + holding.reduce((arraySum, item) => {
          if (item && typeof item === 'object' && 'shares' in item && typeof item.shares === 'number') {
            return arraySum + item.shares;
          }
          return arraySum;
        }, 0);
      }
      // If holding is an object with shares property
      else if (holding && typeof holding === 'object' && 'shares' in holding && typeof holding.shares === 'number') {
        return sum + holding.shares;
      }
      return sum;
    }, 0);
  }

  const stats = [
    {
      title: 'Monthly Income',
      value: formatCurrency(monthlyBreakdown.total),
      change: `${formatCurrency(monthlyBreakdown.confirmed)} confirmed`,
      changePercent: `${formatCurrency(monthlyBreakdown.estimated)} estimated*`,
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Next Payment',
      value: nextPayment ? yieldMaxDividendService.formatAmount(nextPayment.amount, nextPayment.isEstimate) : 'None scheduled',
      change: nextPayment ? `${nextPayment.symbol} - Group ${nextPayment.group}` : '',
      changePercent: nextPayment ? (nextPayment.isEstimate ? 'Estimated' : 'Confirmed') : '',
      isPositive: true,
      icon: Calendar,
    },
    {
      title: 'YieldMax ETFs',
      value: totalETFs.toString(),
      change: `${totalShares.toLocaleString()} total shares`,
      changePercent: 'Weekly dividends',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'This Month',
      value: monthlyBreakdown.payments.length.toString(),
      change: `${monthlyBreakdown.payments.filter(p => !p.isEstimate).length} confirmed`,
      changePercent: `${monthlyBreakdown.payments.filter(p => p.isEstimate).length} estimated`,
      isPositive: true,
      icon: Target,
    },
  ];

  const recentActivity = [
    { 
      symbol: 'ULTY', 
      amount: '$325.00', 
      date: 'Jun 6', 
      status: 'received',
      isEstimate: false,
      group: 'A'
    },
    { 
      symbol: 'MSTY', 
      amount: '$306.00', 
      date: 'Jun 6', 
      status: 'received',
      isEstimate: false,
      group: 'B'
    },
    { 
      symbol: 'ULTY', 
      amount: '$340.50', 
      date: 'Jun 13', 
      status: 'received',
      isEstimate: false,
      group: 'A'
    },
    { 
      symbol: 'NVDY', 
      amount: '$197.50', 
      date: 'Jun 13', 
      status: 'received',
      isEstimate: false,
      group: 'A'
    },
    { 
      symbol: 'ULTY', 
      amount: '$330.00*', 
      date: 'Jun 27', 
      status: 'pending',
      isEstimate: true,
      group: 'A'
    },
  ];

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'A': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'B': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'C': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'D': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getGroupBorderColor = (group: string) => {
    switch (group) {
      case 'A': return 'border-blue-200 dark:border-blue-800';
      case 'B': return 'border-green-200 dark:border-green-800';
      case 'C': return 'border-purple-200 dark:border-purple-800';
      case 'D': return 'border-orange-200 dark:border-orange-800';
      default: return 'border-gray-200 dark:border-gray-800';
    }
  };

  // Helper function to safely get shares for a symbol
  const getSharesForSymbol = (symbol: string): number => {
    const holding = holdings[symbol as keyof typeof holdings];
    if (!holding) return 0;
    
    // If holding is an array, sum all shares
    if (Array.isArray(holding)) {
      return holding.reduce((sum, item) => {
        if (item && typeof item === 'object' && 'shares' in item && typeof item.shares === 'number') {
          return sum + item.shares;
        }
        return sum;
      }, 0);
    }
    
    // If holding is an object with shares property
    if (holding && typeof holding === 'object' && 'shares' in holding && typeof holding.shares === 'number') {
      return holding.shares;
    }
    
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">YieldMax Dashboard</h1>
          <p className="text-slate-600 dark:text-dark-text-secondary">Your YieldMax ETF portfolio overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 rounded-lg">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowUp className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-1">{stat.value}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-dark-text-muted">{stat.changePercent}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Payment Group - 3x3 Grid */}
      {upcomingGroup && (
        <div className={`bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border-2 ${getGroupBorderColor(upcomingGroup.group)}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getGroupColor(upcomingGroup.group).replace('text-', 'text-white bg-').replace('dark:text-', '').split(' ')[0]}`}>
                <span className="text-xl font-bold text-white">{upcomingGroup.group}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary">
                  Next Payment: Group {upcomingGroup.group} ({upcomingGroup.dayOfWeek})
                </h2>
                <p className="text-slate-600 dark:text-dark-text-secondary">
                  Payment Date: {new Date(upcomingGroup.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Compare yields before ex-date</p>
              <p className="text-lg font-bold text-slate-900 dark:text-dark-text-primary">
                {upcomingGroup.etfs.length} ETFs paying
              </p>
            </div>
          </div>

          {/* 3x3 Grid of ETFs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingGroup.etfs.slice(0, 9).map((etf, index) => {
              const marketData = getETFMarketData(etf.symbol);
              const shares = getSharesForSymbol(etf.symbol);
              const perShareDividend = shares > 0 ? etf.amount / shares : 0;
              
              return (
                <div key={index} className="bg-sepia-100 dark:bg-gunmetal-800 rounded-lg p-4 border border-sepia-200 dark:border-gunmetal-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-dark-text-primary">{etf.symbol}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getGroupColor(etf.group)}`}>
                        {etf.group}
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${marketData.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent.toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {/* Current Price */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Current Price:</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-dark-text-primary">{formatCurrency(marketData.price)}</span>
                        <div className={`text-xs ${marketData.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {marketData.change >= 0 ? '+' : ''}{formatCurrency(marketData.change)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Next Dividend */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Next Dividend:</span>
                      <div className="text-right">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {yieldMaxDividendService.formatAmount(etf.amount, etf.isEstimate)}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-dark-text-muted">
                          ${perShareDividend.toFixed(4)}/share
                        </div>
                      </div>
                    </div>
                    
                    {/* Annual Yield */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Annual Yield:</span>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Percent className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          <span className="font-bold text-blue-600 dark:text-blue-400">{marketData.yield.toFixed(1)}%</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-dark-text-muted">
                          Weekly payer
                        </div>
                      </div>
                    </div>
                    
                    {/* Weekly Yield (for comparison) */}
                    <div className="flex justify-between items-center pt-2 border-t border-sepia-200 dark:border-gunmetal-700">
                      <span className="text-sm font-medium text-slate-700 dark:text-dark-text-primary">Weekly Yield:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {((perShareDividend / marketData.price) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Buy Signal Indicator */}
                  <div className="mt-3 pt-3 border-t border-sepia-200 dark:border-gunmetal-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-dark-text-muted">Buy before ex-date</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${marketData.yield > 50 ? 'bg-green-500' : marketData.yield > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs font-medium text-slate-700 dark:text-dark-text-primary">
                          {marketData.yield > 50 ? 'High Yield' : marketData.yield > 40 ? 'Good Yield' : 'Lower Yield'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Fill empty slots if less than 9 ETFs */}
            {upcomingGroup.etfs.length < 9 && Array.from({ length: 9 - upcomingGroup.etfs.length }).map((_, index) => (
              <div key={`empty-${index}`} className="bg-sepia-100 dark:bg-gunmetal-800 rounded-lg p-4 border border-sepia-200 dark:border-gunmetal-700 opacity-50">
                <div className="flex items-center justify-center h-full">
                  <span className="text-slate-400 dark:text-dark-text-muted text-sm">No ETF</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Group Summary */}
          <div className="mt-4 p-3 bg-sepia-200 dark:bg-gunmetal-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-dark-text-primary">
                  Group {upcomingGroup.group} Total Payment:
                </span>
                <span className="ml-2 text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(upcomingGroup.etfs.reduce((sum, etf) => sum + etf.amount, 0))}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-dark-text-secondary">
                  Best Yield: <span className="font-bold text-blue-600 dark:text-blue-400">
                    {Math.max(...upcomingGroup.etfs.map(etf => getETFMarketData(etf.symbol).yield)).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary">Recent Activity</h2>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-dark-text-muted">
              <Info className="w-4 h-4" />
              <span>* = Estimated</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sepia-100 dark:bg-gunmetal-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'received' ? 'bg-green-500 dark:bg-green-400' : 'bg-yellow-500 dark:bg-yellow-400'
                  }`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-slate-900 dark:text-dark-text-primary">
                        YieldMax Dividend
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getGroupColor(activity.group)}`}>
                        Group {activity.group}
                      </span>
                      {activity.isEstimate && (
                        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium">
                          Est.
                        </span>
                      )}
                      {!activity.isEstimate && activity.status === 'received' && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                          Confirmed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{activity.symbol} • {activity.date}</p>
                  </div>
                </div>
                <span className="font-bold text-green-600 dark:text-green-400">{activity.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* YieldMax Holdings */}
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary mb-4">YieldMax Holdings</h2>
          <div className="space-y-4">
            {Object.entries(holdings).slice(0, 6).map(([symbol, data], index) => {
              // Handle both array and object structures for holdings data
              const holdingData = Array.isArray(data) ? data[0] : data;
              const shares = getSharesForSymbol(symbol);
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-sepia-100 dark:bg-gunmetal-800 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-slate-900 dark:text-dark-text-primary">{symbol}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getGroupColor(holdingData?.group || 'A')}`}>
                        Group {holdingData?.group || 'A'}
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                        Weekly
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary mb-1">YieldMax ETF</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-dark-text-primary">{shares.toLocaleString()} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">Weekly</p>
                    <p className="text-xs text-slate-500 dark:text-dark-text-muted">Dividends</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* YieldMax Info */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-200">YieldMax Investment Strategy</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Compare yields in the upcoming payment group to identify the best buying opportunities before ex-dividend dates. 
              YieldMax ETFs pay weekly dividends with Group A on Thursdays, Group B on Fridays, Group C on Mondays, and Group D on Tuesdays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}