import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FiltersBar from './components/FiltersBar';
import OverviewTab from './components/OverviewTab';
import OperationsTab from './components/OperationsTab';
import DataCleaningTab from './components/DataCleaningTab';
import { LoadingState, ErrorState, EmptyState } from './components/DataStates';
import { rawSalesData, expensesData } from './data/rawOperationalData';
import { cleanData, convertToCSV } from './utils/dataCleaner';
import { Download, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  
  const [cleanSales, setCleanSales] = useState([]);
  const [discardedSales, setDiscardedSales] = useState([]);
  const [etlStats, setEtlStats] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [queryError, setQueryError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    category: 'ALL',
    region: 'ALL'
  });

  // Apply visual theme to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Simulate loading pipeline from data warehouse query
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        const result = cleanData(rawSalesData);
        setCleanSales(result.cleanSales);
        setDiscardedSales(result.discarded);
        setEtlStats(result.stats);
        setIsLoading(false);
      } catch (err) {
        setQueryError('Failed to execute ETL validation scripts on raw ledger input.');
        setIsLoading(false);
      }
    }, 800); // 800ms loading effect

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Reset Filters to defaults
  const handleResetFilters = () => {
    setFilters({
      startDate: '2026-05-01',
      endDate: '2026-05-31',
      category: 'ALL',
      region: 'ALL'
    });
  };

  // 1. Compute dynamic filter option lists from cleaned data
  const uniqueCategories = Array.from(new Set(cleanSales.map(item => item.Category))).sort();
  const uniqueRegions = Array.from(new Set(cleanSales.map(item => item.Region))).sort();

  // 2. Filter transaction arrays based on selected metrics
  const filteredSales = cleanSales.filter(item => {
    // Date filter
    if (filters.startDate && item.Date < filters.startDate) return false;
    if (filters.endDate && item.Date > filters.endDate) return false;
    
    // Category filter
    if (filters.category !== 'ALL' && item.Category !== filters.category) return false;
    
    // Region filter
    if (filters.region !== 'ALL' && item.Region !== filters.region) return false;
    
    return true;
  });

  // Calculate unpaid invoice count for warnings
  const unpaidCount = filteredSales.filter(i => i.Status === 'Unpaid').length;

  // 3. Export to CSV action
  const handleExportCSV = () => {
    const csvContent = convertToCSV(filteredSales);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cleaned_Sales_Data_${filters.startDate}_to_${filters.endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render main tab layouts
  const renderTabContent = () => {
    if (isLoading) {
      return <LoadingState message="Connecting to operational databases and running cleaning pipeline..." />;
    }
    
    if (queryError) {
      return (
        <ErrorState 
          message={queryError} 
          onRetry={() => {
            setQueryError(null);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 500);
          }} 
        />
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab salesData={filteredSales} expensesData={expensesData} />;
      case 'operations':
        return <OperationsTab salesData={filteredSales} expensesData={expensesData} />;
      case 'cleaning':
        return (
          <DataCleaningTab 
            cleanSales={cleanSales} 
            stats={etlStats} 
            discarded={discardedSales} 
          />
        );
      default:
        return <OverviewTab salesData={filteredSales} expensesData={expensesData} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        setFilters={setFilters}
        currentFilters={filters}
      />

      {/* Main reporting panel */}
      <main className="main-content">
        <header className="header-section">
          <div className="header-title-area">
            <h1>Sales & Operations Intelligence</h1>
            <span className="header-subtitle">
              Interactive portfolio demo displaying data cleaning pipelines, business KPIs, and executive ledger reporting.
            </span>
          </div>

          <div className="header-actions">
            {/* Optional Export for Business Stakeholders */}
            <button 
              className="btn btn-primary" 
              onClick={handleExportCSV}
              disabled={isLoading || filteredSales.length === 0}
              title="Download filtered dataset as CSV"
              style={{ opacity: filteredSales.length === 0 ? 0.6 : 1 }}
            >
              <Download size={16} />
              Export Clean CSV
            </button>
          </div>
        </header>

        {/* Dynamic Critical Invoice Alert Banner */}
        {!isLoading && activeTab !== 'cleaning' && unpaidCount > 0 && (
          <div className="alert-banner alert-warning animate-fade-in" role="alert">
            <AlertCircle size={18} style={{ color: 'var(--warning)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div className="alert-title">Pending Balances Detected</div>
              <div className="alert-desc">
                There are {unpaidCount} unpaid transactions within the selected date/category filter range. Check the <strong>Operations Ledger</strong> to audit outstanding accounts receivable.
              </div>
            </div>
          </div>
        )}

        {/* Global Filters Panel - Hidden on Cleaning tab to show full database schema comparison */}
        {activeTab !== 'cleaning' && !isLoading && (
          <FiltersBar 
            filters={filters} 
            setFilters={setFilters} 
            categories={uniqueCategories} 
            regions={uniqueRegions} 
            onReset={handleResetFilters} 
          />
        )}

        {/* Render Selected View */}
        {renderTabContent()}
      </main>
    </div>
  );
}
