import React, { useState } from 'react';
import { Plus, Edit, Trash2, TrendingUp, Calendar, Building2, Shield, DollarSign } from 'lucide-react';
import { yieldMaxDividendService } from '../services/yieldMaxDividendService';

export function Holdings() {
  const [selectedAccountType, setSelectedAccountType] = useState<'all' | 'taxable' | 'tax-sheltered'>('all');
  const holdings = yieldMaxDividendService.getHoldings();
  const accountSummary = yieldMaxDividendService.getAccountSummary();
  
  // Mock current prices for YieldMax ETFs
  const mockPrices: Record<string, { current: number; avg: number }> = {
    'ULTY': { current: 28.45, avg: 28.12 },
    'MSTY': { current: 22.15, avg: 21.89 },
    'NVDY': { current: 31.78, avg: 31.45 },
    'OARK': { current: 24.12, avg: 23.87 },
    'CONY': { current: 19.87, avg: 19.65 },
    'AMZY': { current: 26.34, avg: 26.12 },
    'APLY': { current: 25.67, avg: 25.34 },
    'GOOY': { current: 23.89, avg: 23.67 },
    'NFLY': { current: 21.45, avg: 21.23 },
    'MSFY': { current: 27.12, avg: 26.89 },
    'PYPY': { current: 18.93, avg: 18.78 },
    'SPYY': { current: 29.56, avg: 29.23 }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'A': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'B': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'C': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'D': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  const getAccountTypeColor = (accountType: string) => {
    return accountType === 'taxable' 
      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
  };

  const getAccountTypeIcon = (accountType: string) => {
    return accountType === 'taxable' ? Building2 : Shield;
  };

  const getGroupSchedule = (group: string) => {
    switch (group) {
      case 'A': return 'Thursdays';
      case 'B': return 'Fridays';
      case 'C': return 'Mondays';
      case 'D': return 'Tuesdays';
      default: return 'Unknown';
    }
  };

  const calculateGainLoss = (symbol: string, shares: number) => {
    const prices = mockPrices[symbol];
    if (!prices) return { gainLoss: 0, gainLossPercent: 0, currentPrice: 0, marketValue: 0 };
    
    const marketValue = shares * prices.current;
    const totalCost = shares * prices.avg;
    const gainLoss = marketValue - totalCost;
    const gainLossPercent = (gainLoss / totalCost) * 100;
    
    return { gainLoss, gainLossPercent, currentPrice: prices.current, marketValue };
  };

  // Filter holdings based on selected account type
  const getFilteredHoldings = () => {
    if (selectedAccountType === 'all') {
      return holdings;
    }
    return yieldMaxDividendService.getHoldingsByAccountType(selectedAccountType);
  };

  const filteredHoldings = getFilteredHoldings();

  // Calculate totals for filtered holdings
  const calculateTotals = () => {
    let totalMarketValue = 0;
    let totalGainLoss = 0;
    let totalShares = 0;

    Object.entries(filteredHoldings).forEach(([symbol, accountHoldings]) => {
      const symbolTotalShares = accountHoldings.reduce((sum, h) => sum + h.shares, 0);
      const { marketValue, gainLoss } = calculateGainLoss(symbol, symbolTotalShares);
      totalMarketValue += marketValue;
      totalGainLoss += gainLoss;
      totalShares += symbolTotalShares;
    });

    return { totalMarketValue, totalGainLoss, totalShares };
  };

  const { totalMarketValue, totalGainLoss, totalShares } = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">YieldMax Holdings</h1>
          <p className="text-slate-600 dark:text-dark-text-secondary">Manage your YieldMax ETF investments by account</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* Account Type Filter */}
      <div className="flex space-x-1 bg-sepia-100 dark:bg-gunmetal-800 p-1 rounded-lg">
        <button
          onClick={() => setSelectedAccountType('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedAccountType === 'all'
              ? 'bg-white dark:bg-gunmetal-700 text-slate-900 dark:text-dark-text-primary shadow-sm'
              : 'text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary'
          }`}
        >
          All Accounts
        </button>
        <button
          onClick={() => setSelectedAccountType('taxable')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedAccountType === 'taxable'
              ? 'bg-white dark:bg-gunmetal-700 text-slate-900 dark:text-dark-text-primary shadow-sm'
              : 'text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary'
          }`}
        >
          Taxable Accounts
        </button>
        <button
          onClick={() => setSelectedAccountType('tax-sheltered')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedAccountType === 'tax-sheltered'
              ? 'bg-white dark:bg-gunmetal-700 text-slate-900 dark:text-dark-text-primary shadow-sm'
              : 'text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary'
          }`}
        >
          Tax-Sheltered Accounts
        </button>
      </div>

      {/* Holdings Table */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl shadow-sm border border-sepia-200 dark:border-gunmetal-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sepia-100 dark:bg-gunmetal-800 border-b border-sepia-200 dark:border-gunmetal-700">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Symbol</th>
                <th className="text-center p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Account</th>
                <th className="text-center p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Group</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Shares</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Avg Price</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Current Price</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Market Value</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Gain/Loss</th>
                <th className="text-center p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Schedule</th>
                <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(filteredHoldings).map(([symbol, accountHoldings]) => {
                const prices = mockPrices[symbol];
                
                return accountHoldings.map((holding, index) => {
                  const { gainLoss, gainLossPercent, currentPrice, marketValue } = calculateGainLoss(symbol, holding.shares);
                  const AccountIcon = getAccountTypeIcon(holding.accountType);
                  
                  return (
                    <tr key={`${symbol}-${index}`} className="border-b border-sepia-100 dark:border-gunmetal-700 hover:bg-sepia-100 dark:hover:bg-gunmetal-800">
                      <td className="p-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-slate-900 dark:text-dark-text-primary">{symbol}</p>
                            <span className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800/30">
                              YieldMax
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-dark-text-secondary">YieldMax ETF</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="flex items-center space-x-1">
                            <AccountIcon className="w-4 h-4 text-slate-600 dark:text-dark-text-secondary" />
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAccountTypeColor(holding.accountType)}`}>
                              {holding.accountType === 'taxable' ? 'Taxable' : 'Tax-Sheltered'}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-dark-text-muted">{holding.accountName}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getGroupColor(holding.group)}`}>
                          {holding.group}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-dark-text-primary">
                        {holding.shares.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-dark-text-primary">
                        {formatCurrency(prices?.avg || 0)}
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-dark-text-primary">
                        {formatCurrency(currentPrice)}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-dark-text-primary">
                        {formatCurrency(marketValue)}
                      </td>
                      <td className="p-4 text-right">
                        <div className={`font-medium ${gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(gainLoss)}
                        </div>
                        <div className={`text-sm ${gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Calendar className="w-4 h-4 text-slate-500 dark:text-dark-text-muted" />
                          <span className="text-sm font-medium text-slate-700 dark:text-dark-text-primary">
                            {getGroupSchedule(holding.group)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-slate-600 dark:text-dark-text-muted hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-600 dark:text-dark-text-muted hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-2">
            {selectedAccountType === 'all' ? 'Total' : selectedAccountType === 'taxable' ? 'Taxable' : 'Tax-Sheltered'} Market Value
          </h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary">
            {formatCurrency(totalMarketValue)}
          </p>
        </div>
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Total Gain/Loss</h3>
          <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(totalGainLoss)}
          </p>
        </div>
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Total Shares</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {totalShares.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(accountSummary).map(([accountName, data]) => {
            const AccountIcon = getAccountTypeIcon(data.accountType);
            
            return (
              <div key={accountName} className="p-4 bg-sepia-100 dark:bg-gunmetal-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AccountIcon className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary" />
                  <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary">{accountName}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getAccountTypeColor(data.accountType)}`}>
                    {data.accountType === 'taxable' ? 'Taxable' : 'Tax-Sheltered'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Total Shares:</span>
                    <span className="font-medium text-slate-900 dark:text-dark-text-primary">{data.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-dark-text-secondary">ETFs:</span>
                    <span className="font-medium text-slate-900 dark:text-dark-text-primary">{data.symbols.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 dark:text-dark-text-secondary">Est. Monthly Income:</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(data.estimatedMonthlyIncome)}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-dark-text-muted mt-2">
                    {data.symbols.join(', ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax Implications */}
      <div className="bg-gradient-to-r from-red-50 to-green-50 dark:from-red-900/20 dark:to-green-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800/30">
        <div className="flex items-center space-x-3 mb-4">
          <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Tax Implications</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h4 className="font-semibold text-red-800 dark:text-red-200">Taxable Accounts</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Monthly Income:</span>
                <span className="font-bold text-red-800 dark:text-red-200">
                  {formatCurrency(yieldMaxDividendService.getTaxBreakdown().taxable.monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">Est. Annual Taxes (22%):</span>
                <span className="font-bold text-red-800 dark:text-red-200">
                  {formatCurrency(yieldMaxDividendService.getTaxBreakdown().taxable.estimatedTaxes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-700 dark:text-red-300">After-Tax Income:</span>
                <span className="font-bold text-red-800 dark:text-red-200">
                  {formatCurrency(yieldMaxDividendService.getTaxBreakdown().taxable.afterTaxIncome)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h4 className="font-semibold text-green-800 dark:text-green-200">Tax-Sheltered Accounts</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Monthly Income:</span>
                <span className="font-bold text-green-800 dark:text-green-200">
                  {formatCurrency(yieldMaxDividendService.getTaxBreakdown().taxSheltered.monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Current Taxes:</span>
                <span className="font-bold text-green-800 dark:text-green-200">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700 dark:text-green-300">Tax-Free Income:</span>
                <span className="font-bold text-green-800 dark:text-green-200">
                  {formatCurrency(yieldMaxDividendService.getTaxBreakdown().taxSheltered.afterTaxIncome)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            <strong>Tax Strategy:</strong> YieldMax ETFs generate high dividend income that's taxed as ordinary income in taxable accounts. 
            Consider maximizing tax-sheltered account allocations for these high-yield weekly payers to optimize after-tax returns.
          </p>
        </div>
      </div>
    </div>
  );
}