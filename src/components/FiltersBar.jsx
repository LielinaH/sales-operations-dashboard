import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function FiltersBar({ 
  filters, 
  setFilters, 
  categories, 
  regions, 
  onReset 
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="filters-bar animate-fade-in">
      <div className="filter-group">
        <label htmlFor="startDate">Start Date</label>
        <input 
          type="date" 
          id="startDate"
          name="startDate"
          className="filter-control" 
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="endDate">End Date</label>
        <input 
          type="date" 
          id="endDate"
          name="endDate"
          className="filter-control" 
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Product Category</label>
        <select 
          id="category"
          name="category"
          className="filter-control"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="ALL">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="region">Sales Region</label>
        <select 
          id="region"
          name="region"
          className="filter-control"
          value={filters.region}
          onChange={handleChange}
        >
          <option value="ALL">All Regions</option>
          {regions.map(reg => (
            <option key={reg} value={reg}>{reg}</option>
          ))}
        </select>
      </div>

      <button className="reset-filters-btn" onClick={onReset} aria-label="Reset Filters">
        <RefreshCw size={14} />
        Reset
      </button>
    </div>
  );
}
