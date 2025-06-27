import React from 'react';
import { TrendingUp, DollarSign, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-sepia-50 dark:bg-gunmetal-900 border-b border-sepia-200 dark:border-gunmetal-700 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary">YieldMax Tracker</h1>
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">YieldMax ETF Dividend Manager</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-sepia-100 dark:bg-gunmetal-800 hover:bg-sepia-200 dark:hover:bg-gunmetal-700 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-800/30">
            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">YieldMax Portfolio</span>
          </div>
        </div>
      </div>
    </header>
  );
}