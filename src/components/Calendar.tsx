import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, Info } from 'lucide-react';
import { yieldMaxDividendService, type YieldMaxDividend } from '../services/yieldMaxDividendService';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number): YieldMaxDividend[] => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return yieldMaxDividendService.getDividendsForDate(dateString);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  // Get monthly breakdown
  const monthlyBreakdown = yieldMaxDividendService.getMonthlyBreakdown(
    currentDate.getFullYear(), 
    currentDate.getMonth()
  );

  const upcomingPayments = yieldMaxDividendService.getUpcomingDividends(8);

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'A':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'B':
        return 'bg-green-500 dark:bg-green-600';
      case 'C':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'D':
        return 'bg-orange-500 dark:bg-orange-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
    }
  };

  // Group events by day and calculate totals
  const getGroupedEventsForDate = (day: number) => {
    const events = getEventsForDate(day);
    if (events.length === 0) return null;

    // Group by payment group
    const groupedByGroup = events.reduce((acc, event) => {
      if (!acc[event.group]) {
        acc[event.group] = {
          group: event.group,
          events: [],
          total: 0,
          hasEstimates: false
        };
      }
      acc[event.group].events.push(event);
      acc[event.group].total += event.amount;
      if (event.isEstimate) {
        acc[event.group].hasEstimates = true;
      }
      return acc;
    }, {} as Record<string, { group: string; events: YieldMaxDividend[]; total: number; hasEstimates: boolean }>);

    return Object.values(groupedByGroup);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-dark-text-primary mb-2">YieldMax Calendar</h1>
        <p className="text-slate-600 dark:text-dark-text-secondary">Track your YieldMax ETF dividend payments by group</p>
      </div>

      {/* Monthly Summary */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-200 dark:from-blue-900/30 dark:to-teal-800/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} Income
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(monthlyBreakdown.total)}
              </p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-slate-600 dark:text-dark-text-secondary">
                  Confirmed: {formatCurrency(monthlyBreakdown.confirmed)}
                </span>
                <span className="text-sm text-slate-500 dark:text-dark-text-muted">
                  Estimated: {formatCurrency(monthlyBreakdown.estimated)}*
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-dark-text-secondary">Payment Days</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-dark-text-primary">
              {monthlyBreakdown.payments.reduce((acc, payment) => {
                const date = payment.date;
                if (!acc.includes(date)) acc.push(date);
                return acc;
              }, [] as string[]).length}
            </p>
            <div className="text-xs text-slate-500 dark:text-dark-text-muted mt-1">
              {monthlyBreakdown.payments.filter(p => !p.isEstimate).length} confirmed,{' '}
              {monthlyBreakdown.payments.filter(p => p.isEstimate).length} estimated
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl shadow-sm border border-sepia-200 dark:border-gunmetal-700 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-sepia-200 dark:border-gunmetal-700">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sepia-100 dark:hover:bg-gunmetal-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-dark-text-primary">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-sepia-100 dark:hover:bg-gunmetal-800 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-dark-text-secondary" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-slate-600 dark:text-dark-text-secondary py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-4">
            {/* Empty days */}
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="h-32"></div>
            ))}
            
            {/* Days with events */}
            {days.map(day => {
              const groupedEvents = getGroupedEventsForDate(day);
              const today = new Date();
              const isToday = today.getDate() === day && 
                             today.getMonth() === currentDate.getMonth() && 
                             today.getFullYear() === currentDate.getFullYear();
              
              return (
                <div
                  key={day}
                  className={`h-32 border rounded-lg p-2 ${
                    isToday ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-sepia-200 dark:border-gunmetal-700'
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-dark-text-primary'
                  }`}>
                    {day}
                  </div>
                  
                  {groupedEvents && (
                    <div className="space-y-1">
                      {groupedEvents.slice(0, 2).map((groupData, index) => (
                        <div
                          key={`${groupData.group}-${index}`}
                          className={`text-xs px-2 py-1 rounded text-white ${getGroupColor(groupData.group)}`}
                          title={`Group ${groupData.group}: ${formatCurrency(groupData.total)} from ${groupData.events.length} ETFs${groupData.hasEstimates ? ' (includes estimates)' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Group {groupData.group}</span>
                            {groupData.hasEstimates && (
                              <span className="text-yellow-200 font-bold">*</span>
                            )}
                          </div>
                          <div className="text-xs font-medium">
                            {formatCurrency(groupData.total)}
                          </div>
                          <div className="text-xs opacity-90">
                            {groupData.events.length} ETF{groupData.events.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                      {groupedEvents.length > 2 && (
                        <div className="text-xs text-slate-500 dark:text-dark-text-muted text-center">
                          +{groupedEvents.length - 2} more groups
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-sepia-50 dark:bg-dark-card rounded-xl p-6 shadow-sm border border-sepia-200 dark:border-gunmetal-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary">Upcoming YieldMax Payments</h3>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-dark-text-muted">
            <Info className="w-4 h-4" />
            <span>* = Estimated</span>
          </div>
        </div>
        <div className="space-y-3">
          {upcomingPayments.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-dark-text-muted">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming payments found</p>
              <p className="text-sm mt-1">Check back later for new dividend announcements</p>
            </div>
          ) : (
            upcomingPayments.map((event, index) => (
              <div key={`${event.symbol}-${index}`} className="flex items-center justify-between p-3 bg-sepia-100 dark:bg-gunmetal-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getGroupColor(event.group)}`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-slate-900 dark:text-dark-text-primary">{event.symbol}</p>
                      <span className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800/30">
                        Group {event.group}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                        Weekly
                      </span>
                      {event.isEstimate && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getConfidenceBadge(event.confidence)}`}>
                          Est. ({event.confidence})
                        </span>
                      )}
                      {!event.isEstimate && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-medium">
                          Confirmed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-dark-text-secondary">{event.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {yieldMaxDividendService.formatAmount(event.amount, event.isEstimate)}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* YieldMax Groups Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800/30">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-dark-text-primary mb-4">YieldMax Payment Groups</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-3">Weekly Payment Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-dark-text-secondary">Group A: Thursdays (ULTY, NVDY, OARK)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-dark-text-secondary">Group B: Fridays (MSTY, CONY, AMZY)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-dark-text-secondary">Group C: Mondays (APLY, GOOY, NFLY)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-600 dark:text-dark-text-secondary">Group D: Tuesdays (MSFY, PYPY, SPYY)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-dark-text-primary mb-3">Estimate Confidence</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-dark-text-secondary">High confidence:</span>
                <span className="font-medium text-green-600 dark:text-green-400">Next 2 weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-dark-text-secondary">Medium confidence:</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">Next month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-dark-text-secondary">Low confidence:</span>
                <span className="font-medium text-red-600 dark:text-red-400">Beyond month</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> {yieldMaxDividendService.getEstimateDisclaimer()}
          </p>
        </div>
      </div>
    </div>
  );
}