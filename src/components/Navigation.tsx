import React from 'react';
import { BarChart3, Briefcase, Calendar, PieChart, Settings } from 'lucide-react';

type ActiveTab = 'dashboard' | 'holdings' | 'calendar' | 'analytics' | 'settings';

interface NavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'holdings' as const, label: 'Holdings', icon: Briefcase },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'analytics' as const, label: 'Analytics', icon: PieChart },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-sepia-50 dark:bg-gunmetal-900 border-r border-sepia-200 dark:border-gunmetal-700 min-h-screen shadow-sm">
      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-dark-text-secondary hover:bg-sepia-100 dark:hover:bg-gunmetal-800 hover:text-slate-900 dark:hover:text-dark-text-primary'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-dark-text-muted'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}