import React from 'react';
import { TrendingUp, PieChart, BarChart3, Target, Calendar, DollarSign, Building2, Shield } from 'lucide-react';
import { yieldMaxDividendService } from '../services/yieldMaxDividendService';

export function Analytics() {
  const monthlyData = [
    { month: 'Jan', income: 2340, confirmed: 1890, estimated: 450, taxable: 1404, taxSheltered: 936 },
    { month: 'Feb', income: 2567, confirmed: 2100, estimated: 467, taxable: 1540, taxSheltered: 1027 },
    { month: 'Mar', income: 2234, confirmed: 1834, estimated: 400, taxable: 1340, taxSheltered: 894 },
    { month: 'Apr', income: 2789, confirmed: 2234, estimated: 555, taxable: 1673, taxSheltered: 1116 },
    { month: 'May', income: 2945, confirmed: 2398, estimated: 547, taxable: 1767, taxSheltered: 1178 },
    { month: 'Jun', income: 2847, confirmed: 2234, estimated: 613, taxable: 1708, taxSheltered: 1139 },
  ];

  // Account-based breakdown with tax implications
  const accountBreakdown = [
    { 
      name: 'Brokerage Account', 
      type: 'taxable',
      percentage: 60, 
      amount: 119400, 
      color: 'bg-red-500 dark:bg-red-600',
      monthlyIncome: 1708,
      estimatedTaxes: 4500,
      afterTaxIncome: 15840
    },
    { 
      name: 'Roth IRA', 
      type: 'tax-sheltered',
      percentage: 25, 
      amount: 49750, 
      color: 'bg-green-500 dark:bg-green-600',
      monthlyIncome: 711,
      estimatedTaxes: 0,
      afterTaxIncome: 8532
    },
    { 
      name: 'Traditional IRA', 
      type: 'tax-sheltered',
      percentage: 15, 
      amount: 29850, 
      color: 'bg-blue-500 dark:bg-blue-600',
      monthlyIncome: 428,
      estimatedTaxes: 0,
      afterTaxIncome: 5136
    },
  ];

  // YieldMax Group breakdown with account allocation
  const yieldMaxGroupBreakdown = [
    { 
      group: 'A', 
      name: 'Group A (Thursdays)', 
      etfs: ['ULTY', 'NVDY', 'OARK'],
      percentage: 45, 
      amount: 89250, 
      color: 'bg-blue-500 dark:bg-blue-600',
      schedule: 'Thursday payments',
      weeklyAverage: 675,
      taxableShares: 1350,
      taxSheltered: 900
    },
    { 
      group: 'B', 
      name: 'Group B (Fridays)', 
      etfs: ['MSTY', 'CONY', 'AMZY'],
      percentage: 32, 
      amount: 63480, 
      color: 'bg-green-500 dark:bg-green-600',
      schedule: 'Friday payments',
      weeklyAverage: 485,
      taxableShares: 1150,
      taxSheltered: 650
    },
    { 
      group: 'C', 
      name: 'Group C (Mondays)', 
      etfs: ['APLY', 'GOOY', 'NFLY'],
      percentage: 15, 
      amount: 29775, 
      color: 'bg-purple-500 dark:bg-purple-600',
      schedule: 'Monday payments',
      weeklyAverage: 225,
      taxableShares: 750,
      taxSheltered: 350
    },
    { 
      group: 'D', 
      name: 'Group D (Tuesdays)', 
      etfs: ['MSFY', 'PYPY', 'SPYY'],
      percentage: 8, 
      amount: 15870, 
      color: 'bg-orange-500 dark:bg-orange-600',
      schedule: 'Tuesday payments',
      weeklyAverage: 120,
      taxableShares: 620,
      taxSheltered: 330
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalPortfolioValue = accountBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const currentMonthIncome = monthlyData[monthlyData.length - 1].income;
  const annualizedIncome = currentMonthIncome * 12;
  const portfolioYield = (annualizedIncome / totalPortfolioValue) * 100;

  // Get current month breakdown from service
  const currentDate = new Date();
  const monthlyBreakdown = yieldMaxDividendService.getMonthlyBreakdown(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  // Get tax breakdown
  const taxBreakdown = yieldMaxDividendService.getTaxBreakdown();

  // Get recent dividend data with per-share amounts
  const recentDividends = yieldMaxDividendService.getAllDividends()
    .filter(div => !div.isEstimate)
    .slice(-8)
    .reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">YieldMax Analytics</h1>
        <p className="text-slate-600 dark:text-dark-text-secondary">Account-based performance analysis with tax implications</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Portfolio Yield</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{portfolioYield.toFixed(1)}%</p>
          <p className="text-sm text-slate-500 dark:text-dark-text-muted">Annualized</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">After-Tax Income</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(taxBreakdown.taxable.afterTaxIncome + taxBreakdown.taxSheltered.afterTaxIncome)}
          </p>
          <p className="text-sm text-slate-500 dark:text-dark-text-muted">Annual</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Building2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Tax Burden</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(taxBreakdown.taxable.estimatedTaxes)}
          </p>
          <p className="text-sm text-slate-500 dark:text-dark-text-muted">Annual</p>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500 dark:text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-600 dark:text-dark-text-secondary mb-1">Tax-Sheltered %</h3>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
            {((accountBreakdown.filter(a => a.type === 'tax-sheltered').reduce((sum, a) => sum + a.percentage, 0))).toFixed(0)}%
          </p>
          <p className="text-sm text-slate-500 dark:text-dark-text-muted">Of portfolio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income with Tax Breakdown */}
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Monthly Income by Account Type</h3>
          </div>
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const maxIncome = Math.max(...monthlyData.map(d => d.income));
              const widthPercentage = (data.income / maxIncome) * 100;
              const taxablePercentage = (data.taxable / data.income) * 100;
              
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-dark-text-secondary">{data.month}</span>
                    <span className="font-bold text-slate-900 dark:text-dark-text-primary">{formatCurrency(data.income)}</span>
                  </div>
                  <div className="w-full bg-sepia-200 dark:bg-gunmetal-700 rounded-full h-3 relative">
                    {/* Taxable portion */}
                    <div
                      className="bg-red-500 dark:bg-red-600 h-3 rounded-l-full transition-all duration-1000"
                      style={{ width: `${(data.taxable / maxIncome) * 100}%` }}
                    ></div>
                    {/* Tax-sheltered portion */}
                    <div
                      className="bg-green-500 dark:bg-green-600 h-3 rounded-r-full transition-all duration-1000 absolute top-0"
                      style={{ 
                        left: `${(data.taxable / maxIncome) * 100}%`,
                        width: `${(data.taxSheltered / maxIncome) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-dark-text-muted">
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Taxable: {formatCurrency(data.taxable)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Tax-Sheltered: {formatCurrency(data.taxSheltered)}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Allocation */}
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <div className="flex items-center space-x-3 mb-6">
            <PieChart className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Account Allocation</h3>
          </div>
          <div className="space-y-4">
            {accountBreakdown.map((account, index) => {
              const AccountIcon = account.type === 'taxable' ? Building2 : Shield;
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <AccountIcon className="w-4 h-4 text-slate-600 dark:text-dark-text-secondary" />
                      <span className="font-medium text-slate-900 dark:text-dark-text-primary">{account.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        account.type === 'taxable' 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {account.type === 'taxable' ? 'Taxable' : 'Tax-Sheltered'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-dark-text-primary">{account.percentage}%</div>
                      <div className="text-sm text-slate-500 dark:text-dark-text-muted">{formatCurrency(account.amount)}</div>
                    </div>
                  </div>
                  <div className="w-full bg-sepia-200 dark:bg-gunmetal-700 rounded-full h-2">
                    <div
                      className={`${account.color} h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${account.percentage}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 dark:text-dark-text-secondary">
                    <div>Monthly Income: <span className="font-medium text-slate-900 dark:text-dark-text-primary">{formatCurrency(account.monthlyIncome)}</span></div>
                    <div>Annual Taxes: <span className="font-medium text-slate-900 dark:text-dark-text-primary">{formatCurrency(account.estimatedTaxes)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-sepia-200 dark:border-gunmetal-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900 dark:text-dark-text-primary">Total Portfolio</span>
              <span className="font-bold text-xl text-slate-900 dark:text-dark-text-primary">{formatCurrency(totalPortfolioValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Optimization Analysis */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-6">Tax Optimization Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-red-200 dark:bg-red-800/50 rounded-full mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Taxable Impact</h4>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">{formatCurrency(taxBreakdown.taxable.estimatedTaxes)}</p>
            <p className="text-sm text-slate-500 dark:text-dark-text-muted mb-2">Annual tax burden</p>
            <div className="text-xs text-red-700 dark:text-red-300">
              <p>Effective Rate: 22%</p>
              <p>After-Tax Yield: {((taxBreakdown.taxable.afterTaxIncome / (totalPortfolioValue * 0.6)) * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-green-200 dark:bg-green-800/50 rounded-full mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Tax-Sheltered Benefit</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">{formatCurrency(taxBreakdown.taxSheltered.annualIncome)}</p>
            <p className="text-sm text-slate-500 dark:text-dark-text-muted mb-2">Tax-free income</p>
            <div className="text-xs text-green-700 dark:text-green-300">
              <p>Tax Savings: {formatCurrency(taxBreakdown.taxSheltered.annualIncome * 0.22)}</p>
              <p>Effective Yield: {((taxBreakdown.taxSheltered.annualIncome / (totalPortfolioValue * 0.4)) * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-200 dark:bg-blue-800/50 rounded-full mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Optimization Potential</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {formatCurrency((totalPortfolioValue * 0.6 * 0.22 * (portfolioYield / 100)) - taxBreakdown.taxable.estimatedTaxes)}
            </p>
            <p className="text-sm text-slate-500 dark:text-dark-text-muted mb-2">Additional tax savings</p>
            <div className="text-xs text-blue-700 dark:text-blue-300">
              <p>Move to tax-sheltered</p>
              <p>Increase allocation by 20%</p>
            </div>
          </div>
        </div>
      </div>

      {/* YieldMax Groups with Account Breakdown */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-6">YieldMax Groups by Account Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {yieldMaxGroupBreakdown.map((group, index) => (
            <div key={index} className="text-center p-4 bg-sepia-100 dark:bg-gunmetal-800 rounded-lg">
              <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${group.color.replace('bg-', 'bg-').replace('dark:bg-', 'dark:bg-')}`}>
                <span className="text-2xl font-bold text-white">{group.group}</span>
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-2">Group {group.group}</h4>
              <p className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary mb-1">{formatCurrency(group.weeklyAverage)}</p>
              <p className="text-sm text-slate-500 dark:text-dark-text-muted mb-3">Weekly average</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-dark-text-secondary">Taxable:</span>
                  <span className="font-medium text-slate-900 dark:text-dark-text-primary">{group.taxableShares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-dark-text-secondary">Tax-Sheltered:</span>
                  <span className="font-medium text-slate-900 dark:text-dark-text-primary">{group.taxSheltered}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-sepia-200 dark:border-gunmetal-700">
                  <p className="font-medium text-slate-700 dark:text-dark-text-primary">{group.schedule}</p>
                  <p className="text-slate-600 dark:text-dark-text-secondary">{group.etfs.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics with Tax Considerations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Tax-Adjusted Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Gross Annual Yield</span>
              <span className="font-semibold text-slate-900 dark:text-dark-text-primary">{portfolioYield.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Tax-Adjusted Yield</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {(((taxBreakdown.taxable.afterTaxIncome + taxBreakdown.taxSheltered.afterTaxIncome) / totalPortfolioValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Tax Efficiency</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {(((taxBreakdown.taxable.afterTaxIncome + taxBreakdown.taxSheltered.afterTaxIncome) / (taxBreakdown.taxable.annualIncome + taxBreakdown.taxSheltered.annualIncome)) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-dark-text-secondary">Weekly Income Consistency</span>
              <span className="font-semibold text-green-600 dark:text-green-400">98.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Account Optimization Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 dark:text-dark-text-secondary">Tax-Sheltered Target (50%)</span>
                <span className="font-semibold text-slate-900 dark:text-dark-text-primary">40%</span>
              </div>
              <div className="w-full bg-sepia-200 dark:bg-gunmetal-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 h-3 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 dark:text-dark-text-secondary">Roth IRA Allocation</span>
                <span className="font-semibold text-slate-900 dark:text-dark-text-primary">25%</span>
              </div>
              <div className="w-full bg-sepia-200 dark:bg-gunmetal-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 h-3 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 dark:text-dark-text-secondary">Tax Efficiency Target</span>
                <span className="font-semibold text-green-600 dark:text-green-400">85%</span>
              </div>
              <div className="w-full bg-sepia-200 dark:bg-gunmetal-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 h-3 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Strategy Recommendations */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Tax Optimization Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-3">🎯 Priority Actions</h4>
            <ul className="text-sm text-slate-600 dark:text-dark-text-secondary space-y-2">
              <li>• Maximize Roth IRA contributions for YieldMax ETFs</li>
              <li>• Consider Traditional IRA for immediate tax deduction</li>
              <li>• Rebalance to increase tax-sheltered allocation</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-3">💡 Tax Efficiency Tips</h4>
            <ul className="text-sm text-slate-600 dark:text-dark-text-secondary space-y-2">
              <li>• YieldMax dividends are taxed as ordinary income</li>
              <li>• Tax-sheltered accounts eliminate current tax burden</li>
              <li>• Consider tax-loss harvesting in taxable accounts</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-3">📊 Potential Savings</h4>
            <ul className="text-sm text-slate-600 dark:text-dark-text-secondary space-y-2">
              <li>• Annual tax savings: {formatCurrency(taxBreakdown.taxSheltered.annualIncome * 0.22)}</li>
              <li>• Increase tax-sheltered to 50%: {formatCurrency(1200)}</li>
              <li>• 10-year compound benefit: {formatCurrency(15000)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}