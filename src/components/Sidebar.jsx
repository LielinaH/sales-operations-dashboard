import React from 'react';
import { LayoutDashboard, ScrollText, Database, Sun, Moon, Briefcase, Bookmark, ChevronRight } from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme,
  setFilters,
  currentFilters
}) {
  
  // Dynamic bookmarks / saved views
  const presets = [
    {
      id: 'default',
      name: 'Default Executive View',
      filters: { startDate: '2026-05-01', endDate: '2026-05-31', category: 'ALL', region: 'ALL' },
      tab: 'overview'
    },
    {
      id: 'north_software',
      name: 'North Software Performance',
      filters: { startDate: '2026-05-01', endDate: '2026-05-31', category: 'Software', region: 'North' },
      tab: 'overview'
    },
    {
      id: 'west_consulting',
      name: 'West Consulting Pipeline',
      filters: { startDate: '2026-05-01', endDate: '2026-05-31', category: 'Consulting', region: 'West' },
      tab: 'overview'
    },
    {
      id: 'east_overdue',
      name: 'East Overdue Accounts',
      filters: { startDate: '2026-05-01', endDate: '2026-05-31', category: 'ALL', region: 'East' },
      tab: 'operations'
    }
  ];

  const handleApplyPreset = (preset) => {
    setFilters(preset.filters);
    setActiveTab(preset.tab);
  };

  // Helper to check if preset filters match current state
  const isPresetActive = (preset) => {
    return (
      activeTab === preset.tab &&
      currentFilters.startDate === preset.filters.startDate &&
      currentFilters.endDate === preset.filters.endDate &&
      currentFilters.category === preset.filters.category &&
      currentFilters.region === preset.filters.region
    );
  };

  return (
    <aside className="sidebar">
      {/* Brand logo section with high realism (custom nested SVG logo mark) */}
      <div className="brand-section">
        <div className="brand-logo" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.15)" />
            <path d="M2 17l10 5 10-5" stroke="var(--info)" />
            <path d="M2 12l10 5 10-5" stroke="currentColor" />
          </svg>
        </div>
        <div className="brand-name-group">
          <div className="brand-name">BizInsight</div>
          <span className="brand-sub">ANALYTICS ENGINE</span>
        </div>
      </div>

      {/* Core navigation */}
      <nav aria-label="Main Navigation">
        <ul className="nav-menu">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
              aria-label="Overview Tab"
            >
              <LayoutDashboard size={18} className="nav-icon" />
              <span className="nav-text">Overview</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'operations' ? 'active' : ''}`}
              onClick={() => setActiveTab('operations')}
              aria-label="Operations Ledger Tab"
            >
              <ScrollText size={18} className="nav-icon" />
              <span className="nav-text">Operations Ledger</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'cleaning' ? 'active' : ''}`}
              onClick={() => setActiveTab('cleaning')}
              aria-label="ETL and Data Quality Tab"
            >
              <Database size={18} className="nav-icon" />
              <span className="nav-text">ETL & Data Quality</span>
              <ChevronRight size={14} className="nav-arrow" />
            </button>
          </li>
        </ul>
      </nav>

      {/* Bookmarks / Saved Views section to fill out the sidebar and show animation controls */}
      <div className="bookmarks-section">
        <span className="bookmarks-header">Saved Views</span>
        <ul className="bookmarks-list">
          {presets.map((preset) => {
            const active = isPresetActive(preset);
            return (
              <li key={preset.id}>
                <button
                  className={`bookmark-link ${active ? 'active' : ''}`}
                  onClick={() => handleApplyPreset(preset)}
                  aria-label={`Apply saved view: ${preset.name}`}
                >
                  <Bookmark size={12} className="bookmark-icon" />
                  <span className="bookmark-text">{preset.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer controls */}
      <div className="sidebar-footer">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} className="theme-icon" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon size={16} className="theme-icon" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        <div className="portfolio-badge">
          <Briefcase size={14} className="badge-icon" />
          <div className="badge-content">
            <strong>BI Portfolio</strong>
            <span>ETL pipeline & cash flow ledger active.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
