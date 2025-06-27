import React, { useState } from 'react';
import { Target, DollarSign, Percent, Calendar, Save, RotateCcw, AlertTriangle } from 'lucide-react';

interface Goals {
  annualIncomeTarget: number;
  portfolioYieldTarget: number;
  monthlyIncomeTarget: number;
  maxDrawdownLimit: number;
  earlyCloseThreshold: number; // % of premium to close early
}

interface Settings {
  goals: Goals;
  riskManagement: {
    maxPositionSize: number;
    stopLossPercentage: number;
    profitTakingPercentage: number;
  };
  notifications: {
    dividendReminders: boolean;
    goalProgress: boolean;
    riskAlerts: boolean;
  };
  display: {
    defaultCurrency: string;
    dateFormat: string;
    showAfterHours: boolean;
    compactView: boolean;
  };
  yieldMaxSettings: {
    autoRefreshInterval: number; // minutes
    enableWebScraping: boolean;
    confidenceThreshold: 'high' | 'medium' | 'low';
  };
}

export function Settings() {
  const [settings, setSettings] = useState<Settings>({
    goals: {
      annualIncomeTarget: 35000,
      portfolioYieldTarget: 18.5,
      monthlyIncomeTarget: 2917,
      maxDrawdownLimit: 15,
      earlyCloseThreshold: 50, // Close at 50% of max profit
    },
    riskManagement: {
      maxPositionSize: 5, // % of portfolio
      stopLossPercentage: 8,
      profitTakingPercentage: 20,
    },
    notifications: {
      dividendReminders: true,
      goalProgress: true,
      riskAlerts: true,
    },
    display: {
      defaultCurrency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      showAfterHours: true,
      compactView: false,
    },
    yieldMaxSettings: {
      autoRefreshInterval: 60, // 1 hour
      enableWebScraping: true,
      confidenceThreshold: 'medium',
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateGoals = (field: keyof Goals, value: number) => {
    setSettings(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateRiskManagement = (field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      riskManagement: {
        ...prev.riskManagement,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateDisplay = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      display: {
        ...prev.display,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const updateYieldMaxSettings = (field: string, value: number | boolean | string) => {
    setSettings(prev => ({
      ...prev,
      yieldMaxSettings: {
        ...prev.yieldMaxSettings,
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Saving YieldMax settings:', settings);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('yieldmax_settings', JSON.stringify(settings));
    }
    
    setHasChanges(false);
    // Show success message
  };

  const resetToDefaults = () => {
    // Reset to default values
    setHasChanges(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">YieldMax Settings</h1>
          <p className="text-slate-600 dark:text-dark-text-secondary">Configure your YieldMax tracking preferences and goals</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 bg-sepia-100 dark:bg-gunmetal-800 text-slate-700 dark:text-dark-text-secondary px-4 py-2 rounded-lg hover:bg-sepia-200 dark:hover:bg-gunmetal-700 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* YieldMax Data Settings */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 rounded-lg">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary">YieldMax Data Settings</h2>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Data Source</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                YieldMax dividend data is scraped directly from official YieldMax sources and fund websites. 
                No external API keys required.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Auto Refresh Interval (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="1440"
              value={settings.yieldMaxSettings.autoRefreshInterval}
              onChange={(e) => updateYieldMaxSettings('autoRefreshInterval', Number(e.target.value))}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">
              How often to check for new dividend announcements
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Confidence Threshold
            </label>
            <select
              value={settings.yieldMaxSettings.confidenceThreshold}
              onChange={(e) => updateYieldMaxSettings('confidenceThreshold', e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="high">High - Next 2 weeks only</option>
              <option value="medium">Medium - Next month</option>
              <option value="low">Low - All estimates</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">
              Minimum confidence level for showing estimates
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-dark-text-secondary">
                Enable Web Scraping
              </label>
              <p className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">
                Automatically fetch latest dividend data
              </p>
            </div>
            <button
              onClick={() => updateYieldMaxSettings('enableWebScraping', !settings.yieldMaxSettings.enableWebScraping)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.yieldMaxSettings.enableWebScraping ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gunmetal-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.yieldMaxSettings.enableWebScraping ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Goals & Targets */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary">Income Goals & Targets</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Annual Income Target
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-dark-text-muted" />
              <input
                type="number"
                value={settings.goals.annualIncomeTarget}
                onChange={(e) => updateGoals('annualIncomeTarget', Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Portfolio Yield Target (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-dark-text-muted" />
              <input
                type="number"
                step="0.1"
                value={settings.goals.portfolioYieldTarget}
                onChange={(e) => updateGoals('portfolioYieldTarget', Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Monthly Income Target
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-dark-text-muted" />
              <input
                type="number"
                value={settings.goals.monthlyIncomeTarget}
                onChange={(e) => updateGoals('monthlyIncomeTarget', Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Management */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary mb-6">Risk Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Max Position Size (% of portfolio)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.riskManagement.maxPositionSize}
              onChange={(e) => updateRiskManagement('maxPositionSize', Number(e.target.value))}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Stop Loss (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.riskManagement.stopLossPercentage}
              onChange={(e) => updateRiskManagement('stopLossPercentage', Number(e.target.value))}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Profit Taking (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.riskManagement.profitTakingPercentage}
              onChange={(e) => updateRiskManagement('profitTakingPercentage', Number(e.target.value))}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary mb-6">Notifications</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-dark-text-secondary capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <button
                onClick={() => updateNotifications(key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gunmetal-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary mb-6">Display Preferences</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Default Currency
            </label>
            <select
              value={settings.display.defaultCurrency}
              onChange={(e) => updateDisplay('defaultCurrency', e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-dark-text-secondary mb-2">
              Date Format
            </label>
            <select
              value={settings.display.dateFormat}
              onChange={(e) => updateDisplay('dateFormat', e.target.value)}
              className="w-full px-4 py-2 border border-sepia-200 dark:border-gunmetal-700 rounded-lg bg-white dark:bg-gunmetal-800 text-slate-900 dark:text-dark-text-primary focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text-secondary">
              Show After Hours Data
            </label>
            <button
              onClick={() => updateDisplay('showAfterHours', !settings.display.showAfterHours)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.display.showAfterHours ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gunmetal-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.display.showAfterHours ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-dark-text-secondary">
              Compact View
            </label>
            <button
              onClick={() => updateDisplay('compactView', !settings.display.compactView)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.display.compactView ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gunmetal-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.display.compactView ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Current Goals Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">Current Goals Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(settings.goals.annualIncomeTarget)}</p>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Annual Income Target</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{settings.goals.portfolioYieldTarget}%</p>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Portfolio Yield Target</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(settings.goals.monthlyIncomeTarget)}</p>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Monthly Income Target</p>
          </div>
        </div>
      </div>
    </div>
  );
}