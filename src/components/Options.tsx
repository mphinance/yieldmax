import React, { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, DollarSign, Flag, Shield, Percent, RotateCcw } from 'lucide-react';

interface OptionTrade {
  id: string;
  type: 'put' | 'call';
  symbol: string;
  strike: number;
  expiration: string;
  premium: number;
  contracts: number;
  dateOpened: string;
  status: 'open' | 'expired' | 'assigned' | 'closed';
  collateral?: number; // For puts
  costBasisReduction?: number; // For covered calls
  closedPremium?: number; // Premium when closed early
  closedDate?: string;
  isWheelStrategy?: boolean;
  assignedShares?: number;
  assignedPrice?: number;
  notes?: string;
}

interface SharePosition {
  id: string;
  symbol: string;
  shares: number;
  originalCostBasis: number;
  adjustedCostBasis: number; // Reduced by premiums
  premiumsReceived: number;
  assignmentDate?: string;
  fromOptionId?: string; // Link to the put that was assigned
}

export function Options() {
  const [optionTrades, setOptionTrades] = useState<OptionTrade[]>([
    {
      id: '1',
      type: 'put',
      symbol: 'SPY',
      strike: 450,
      expiration: '2025-01-19',
      premium: 1.45,
      contracts: 1,
      dateOpened: '2025-01-02',
      status: 'open',
      collateral: 45000,
      isWheelStrategy: true,
    },
    {
      id: '2',
      type: 'call',
      symbol: 'AAPL',
      strike: 185,
      expiration: '2025-01-26',
      premium: 0.89,
      contracts: 2,
      dateOpened: '2025-01-05',
      status: 'open',
      costBasisReduction: 178,
      isWheelStrategy: true,
    },
    {
      id: '3',
      type: 'put',
      symbol: 'MSFT',
      strike: 380,
      expiration: '2025-01-12',
      premium: 2.15,
      contracts: 1,
      dateOpened: '2024-12-29',
      status: 'assigned',
      collateral: 38000,
      isWheelStrategy: true,
      assignedShares: 100,
      assignedPrice: 380,
    },
    {
      id: '4',
      type: 'call',
      symbol: 'SPY',
      strike: 480,
      expiration: '2025-01-05',
      premium: 0.75,
      contracts: 1,
      dateOpened: '2024-12-22',
      status: 'closed',
      closedPremium: 0.25,
      closedDate: '2025-01-03',
      costBasisReduction: 50, // $0.50 profit per share
    },
  ]);

  const [sharePositions, setSharePositions] = useState<SharePosition[]>([
    {
      id: '1',
      symbol: 'MSFT',
      shares: 100,
      originalCostBasis: 380,
      adjustedCostBasis: 377.85, // Reduced by put premium
      premiumsReceived: 215,
      assignmentDate: '2025-01-12',
      fromOptionId: '3',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'options' | 'shares'>('options');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'expired':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'assigned':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'closed':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getDaysToExpiration = (expirationDate: string) => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateAnnualizedReturn = (trade: OptionTrade) => {
    const daysHeld = trade.status === 'closed' && trade.closedDate ? 
      Math.max(1, Math.ceil((new Date(trade.closedDate).getTime() - new Date(trade.dateOpened).getTime()) / (1000 * 60 * 60 * 24))) :
      Math.max(1, Math.ceil((new Date().getTime() - new Date(trade.dateOpened).getTime()) / (1000 * 60 * 60 * 24)));
    
    const totalPremium = trade.premium * trade.contracts * 100;
    const collateralUsed = trade.collateral || (trade.strike * trade.contracts * 100);
    const returnPercent = (totalPremium / collateralUsed) * 100;
    const annualizedReturn = (returnPercent * 365) / daysHeld;
    
    return annualizedReturn;
  };

  const calculateEarlyCloseProfit = (trade: OptionTrade) => {
    if (trade.status !== 'closed' || !trade.closedPremium) return 0;
    const maxProfit = trade.premium * trade.contracts * 100;
    const actualProfit = (trade.premium - trade.closedPremium) * trade.contracts * 100;
    return (actualProfit / maxProfit) * 100;
  };

  const totalPremiumReceived = optionTrades.reduce((sum, trade) => 
    sum + (trade.premium * trade.contracts * 100), 0
  );

  const totalCollateralUsed = optionTrades
    .filter(trade => trade.status === 'open' && trade.type === 'put')
    .reduce((sum, trade) => sum + (trade.collateral || 0), 0);

  const openTrades = optionTrades.filter(trade => trade.status === 'open');
  const assignedTrades = optionTrades.filter(trade => trade.status === 'assigned');
  const wheelTrades = optionTrades.filter(trade => trade.isWheelStrategy);

  const avgAnnualizedReturn = optionTrades.length > 0 ? 
    optionTrades.reduce((sum, trade) => sum + calculateAnnualizedReturn(trade), 0) / optionTrades.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">Options Trading</h1>
          <p className="text-slate-600 dark:text-dark-text-secondary">Advanced options tracking with wheel strategy support</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
          <Plus className="w-4 h-4" />
          <span>Add Trade</span>
        </button>
      </div>

      {/* Enhanced Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-4 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Total Premium</h3>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPremiumReceived)}</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-4 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-2">
            <Percent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Avg Annualized Return</h3>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{avgAnnualizedReturn.toFixed(1)}%</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-4 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Collateral Used</h3>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatCurrency(totalCollateralUsed)}</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-4 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-2">
            <Flag className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Assignments</h3>
          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{assignedTrades.length}</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-4 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-2">
            <RotateCcw className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-xs font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Wheel Trades</h3>
          <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{wheelTrades.length}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-sepia-100 dark:bg-gunmetal-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('options')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'options'
              ? 'bg-white dark:bg-gunmetal-700 text-slate-900 dark:text-dark-text-primary shadow-sm'
              : 'text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary'
          }`}
        >
          Options Trades
        </button>
        <button
          onClick={() => setActiveTab('shares')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'shares'
              ? 'bg-white dark:bg-gunmetal-700 text-slate-900 dark:text-dark-text-primary shadow-sm'
              : 'text-slate-600 dark:text-dark-text-secondary hover:text-slate-900 dark:hover:text-dark-text-primary'
          }`}
        >
          Share Positions ({sharePositions.length})
        </button>
      </div>

      {activeTab === 'options' ? (
        /* Enhanced Options Table */
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl shadow-sm border border-sepia-200 dark:border-gunmetal-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sepia-100 dark:bg-gunmetal-800 border-b border-sepia-200 dark:border-gunmetal-700">
                <tr>
                  <th className="text-left p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Type</th>
                  <th className="text-left p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Symbol</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Strike</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">DTE</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Premium</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Contracts</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Total</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Ann. Return</th>
                  <th className="text-right p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Collateral</th>
                  <th className="text-center p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Status</th>
                  <th className="text-center p-3 font-semibold text-slate-700 dark:text-dark-text-secondary text-sm">Flags</th>
                </tr>
              </thead>
              <tbody>
                {optionTrades.map((trade) => {
                  const daysToExpiration = getDaysToExpiration(trade.expiration);
                  const totalPremium = trade.premium * trade.contracts * 100;
                  const annualizedReturn = calculateAnnualizedReturn(trade);
                  const earlyCloseProfit = calculateEarlyCloseProfit(trade);
                  
                  return (
                    <tr key={trade.id} className="border-b border-sepia-100 dark:border-gunmetal-700 hover:bg-sepia-100 dark:hover:bg-gunmetal-800">
                      <td className="p-3">
                        <div className={`flex items-center space-x-2 ${
                          trade.type === 'put' ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {trade.type === 'put' ? (
                            <TrendingDown className="w-4 h-4" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                          <span className="font-semibold capitalize text-sm">{trade.type}</span>
                        </div>
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-dark-text-primary text-sm">{trade.symbol}</td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-dark-text-primary text-sm">
                        ${trade.strike}
                      </td>
                      <td className="p-3 text-right text-sm">
                        <span className={`font-medium ${
                          daysToExpiration <= 7 ? 'text-red-600 dark:text-red-400' : 
                          daysToExpiration <= 21 ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-900 dark:text-dark-text-primary'
                        }`}>
                          {daysToExpiration > 0 ? `${daysToExpiration}d` : 'Exp'}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-dark-text-primary text-sm">
                        ${trade.premium.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-dark-text-primary text-sm">
                        {trade.contracts}
                      </td>
                      <td className="p-3 text-right font-bold text-green-600 dark:text-green-400 text-sm">
                        {formatCurrency(totalPremium)}
                      </td>
                      <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400 text-sm">
                        {annualizedReturn.toFixed(1)}%
                      </td>
                      <td className="p-3 text-right font-medium text-slate-900 dark:text-dark-text-primary text-sm">
                        {trade.collateral ? formatCurrency(trade.collateral) : '-'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(trade.status)}`}>
                            {trade.status}
                          </span>
                          {trade.status === 'closed' && earlyCloseProfit > 0 && (
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                              {earlyCloseProfit.toFixed(0)}% profit
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center space-x-1">
                          {trade.isWheelStrategy && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300" title="Wheel Strategy">
                              <RotateCcw className="w-3 h-3" />
                            </span>
                          )}
                          {trade.status === 'assigned' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" title="Assigned">
                              <Flag className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Share Positions Table */
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl shadow-sm border border-sepia-200 dark:border-gunmetal-700 overflow-hidden">
          <div className="p-4 border-b border-sepia-200 dark:border-gunmetal-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Share Positions from Assignments</h3>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Tracks cost basis adjustments from option premiums</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sepia-100 dark:bg-gunmetal-800 border-b border-sepia-200 dark:border-gunmetal-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Symbol</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Shares</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Original Basis</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Adjusted Basis</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Premiums Received</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Total Value</th>
                  <th className="text-right p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Unrealized P&L</th>
                  <th className="text-center p-4 font-semibold text-slate-700 dark:text-dark-text-secondary">Assignment Date</th>
                </tr>
              </thead>
              <tbody>
                {sharePositions.map((position) => {
                  const currentPrice = 385; // Mock current price - would come from API
                  const totalValue = position.shares * currentPrice;
                  const totalCost = position.shares * position.adjustedCostBasis;
                  const unrealizedPL = totalValue - totalCost;
                  const unrealizedPercent = (unrealizedPL / totalCost) * 100;
                  
                  return (
                    <tr key={position.id} className="border-b border-sepia-100 dark:border-gunmetal-700 hover:bg-sepia-100 dark:hover:bg-gunmetal-800">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-dark-text-primary">{position.symbol}</p>
                          {position.fromOptionId && (
                            <p className="text-xs text-slate-500 dark:text-dark-text-muted">From put assignment</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-dark-text-primary">
                        {position.shares.toLocaleString()}
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900 dark:text-dark-text-primary">
                        {formatCurrency(position.originalCostBasis)}
                      </td>
                      <td className="p-4 text-right">
                        <div>
                          <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(position.adjustedCostBasis)}</p>
                          <p className="text-xs text-slate-500 dark:text-dark-text-muted">
                            -{formatCurrency(position.originalCostBasis - position.adjustedCostBasis)} reduction
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(position.premiumsReceived)}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-900 dark:text-dark-text-primary">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="p-4 text-right">
                        <div className={`font-bold ${unrealizedPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(unrealizedPL)}
                        </div>
                        <div className={`text-sm ${unrealizedPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {unrealizedPercent >= 0 ? '+' : ''}{unrealizedPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="p-4 text-center font-medium text-slate-900 dark:text-dark-text-primary">
                        {position.assignmentDate ? formatDate(position.assignmentDate) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Strategy Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Put Selling Performance</h3>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Cash-secured puts and wheel strategy</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Active Puts:</span>
              <span className="font-semibold text-slate-900 dark:text-dark-text-primary">{openTrades.filter(t => t.type === 'put').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Total Collateral:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(totalCollateralUsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Assignments:</span>
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">{assignedTrades.filter(t => t.type === 'put').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Premium This Month:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(optionTrades.filter(t => t.type === 'put').reduce((sum, t) => sum + (t.premium * t.contracts * 100), 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Call Selling Performance</h3>
              <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Covered calls and cost basis reduction</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Active Calls:</span>
              <span className="font-semibold text-slate-900 dark:text-dark-text-primary">{openTrades.filter(t => t.type === 'call').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Cost Basis Reduction:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(optionTrades.filter(t => t.type === 'call' && t.costBasisReduction).reduce((sum, t) => sum + (t.costBasisReduction || 0), 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Early Closes:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{optionTrades.filter(t => t.type === 'call' && t.status === 'closed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Premium This Month:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(optionTrades.filter(t => t.type === 'call').reduce((sum, t) => sum + (t.premium * t.contracts * 100), 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}