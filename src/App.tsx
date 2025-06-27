import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Holdings } from './components/Holdings';
import { Calendar } from './components/Calendar';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';

type ActiveTab = 'dashboard' | 'holdings' | 'calendar' | 'analytics' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'holdings':
        return <Holdings />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-sepia-gradient dark:bg-dark-gradient">
      <Header />
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;