import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Percent, 
  Clock, 
  Users 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { EmptyState } from './DataStates';

export default function OverviewTab({ salesData, expensesData }) {
  // If no filtered data is available, return empty state
  if (!salesData.length) {
    return <EmptyState />;
  }

  // 1. KPI Calculations
  const grossRevenue = salesData.reduce((sum, item) => sum + item.TotalSales, 0);
  const totalOpEx = expensesData.reduce((sum, item) => sum + item.Amount, 0);
  const netProfit = grossRevenue - totalOpEx;
  const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
  const totalOrders = salesData.length;
  
  const unpaidSales = salesData
    .filter(item => item.Status === 'Unpaid')
    .reduce((sum, item) => sum + item.TotalSales, 0);

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatPercent = (val) => `${val.toFixed(1)}%`;

  // 2. Chart Aggregations
  // A. Daily Trend (Revenue & Cumulative Profit)
  // Let's group sales by date
  const salesByDate = {};
  salesData.forEach(item => {
    salesByDate[item.Date] = (salesByDate[item.Date] || 0) + item.TotalSales;
  });

  // Also include expenses grouped by date (or amortize them if needed, but grouping by date is realistic)
  const expensesByDate = {};
  expensesData.forEach(item => {
    expensesByDate[item.Date] = (expensesByDate[item.Date] || 0) + item.Amount;
  });

  // Combine dates
  const allDates = Array.from(new Set([...Object.keys(salesByDate), ...Object.keys(expensesByDate)])).sort();
  let cumulativeRevenue = 0;
  let cumulativeExpenses = 0;

  const trendData = allDates.map(date => {
    const revenue = salesByDate[date] || 0;
    const expense = expensesByDate[date] || 0;
    cumulativeRevenue += revenue;
    cumulativeExpenses += expense;
    
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      Revenue: parseFloat(revenue.toFixed(2)),
      Expense: parseFloat(expense.toFixed(2)),
      NetProfit: parseFloat((cumulativeRevenue - cumulativeExpenses).toFixed(2))
    };
  });

  // B. Category Distribution
  const categoryTotals = {};
  salesData.forEach(item => {
    categoryTotals[item.Category] = (categoryTotals[item.Category] || 0) + item.TotalSales;
  });
  
  const categoryData = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    value: parseFloat(categoryTotals[cat].toFixed(2))
  })).sort((a, b) => b.value - a.value);

  // C. Regional Sales
  const regionTotals = {};
  salesData.forEach(item => {
    regionTotals[item.Region] = (regionTotals[item.Region] || 0) + item.TotalSales;
  });

  const regionData = Object.keys(regionTotals).map(reg => ({
    region: reg,
    Sales: parseFloat(regionTotals[reg].toFixed(2))
  })).sort((a, b) => b.Sales - a.Sales);

  // Color Palettes
  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Executive KPI Cards */}
      <section className="kpi-grid" aria-label="Executive KPIs">
        {/* Gross Revenue */}
        <div className="kpi-card kpi-revenue">
          <div className="kpi-header">
            <span className="kpi-title">Gross Revenue</span>
            <div className="kpi-icon-wrapper">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(grossRevenue)}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-badge trend-up">
                <TrendingUp size={12} style={{ marginRight: '2px' }} />
                +14.2%
              </span>
              <span className="kpi-subtitle">vs last period</span>
            </div>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="kpi-card kpi-expenses">
          <div className="kpi-header">
            <span className="kpi-title">Operating Expenses</span>
            <div className="kpi-icon-wrapper">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatCurrency(totalOpEx)}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-badge trend-neutral">
                0.0%
              </span>
              <span className="kpi-subtitle">aligned to budget</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="kpi-card kpi-profit">
          <div className="kpi-header">
            <span className="kpi-title">Net Profit</span>
            <div className="kpi-icon-wrapper">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value" style={{ color: netProfit >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
              {formatCurrency(netProfit)}
            </div>
            <div className="kpi-footer">
              <span className={`kpi-trend-badge ${netProfit >= 0 ? 'trend-up' : 'trend-down'}`}>
                {netProfit >= 0 ? <TrendingUp size={12} style={{ marginRight: '2px' }} /> : <TrendingDown size={12} style={{ marginRight: '2px' }} />}
                {netProfit >= 0 ? '+18.5%' : '-4.2%'}
              </span>
              <span className="kpi-subtitle">vs last period</span>
            </div>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="kpi-card kpi-margin">
          <div className="kpi-header">
            <span className="kpi-title">Net Margin</span>
            <div className="kpi-icon-wrapper">
              <Percent size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{formatPercent(profitMargin)}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-badge trend-up">
                <TrendingUp size={12} style={{ marginRight: '2px' }} />
                +2.4%
              </span>
              <span className="kpi-subtitle">points expansion</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="kpi-card kpi-orders">
          <div className="kpi-header">
            <span className="kpi-title">Orders Processed</span>
            <div className="kpi-icon-wrapper">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value">{totalOrders}</div>
            <div className="kpi-footer">
              <span className="kpi-trend-badge trend-up">
                <TrendingUp size={12} style={{ marginRight: '2px' }} />
                +8.3%
              </span>
              <span className="kpi-subtitle">transaction volume</span>
            </div>
          </div>
        </div>

        {/* Unpaid Invoice Value */}
        <div className="kpi-card kpi-unpaid">
          <div className="kpi-header">
            <span className="kpi-title">Outstanding Receivables</span>
            <div className="kpi-icon-wrapper">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <div className="kpi-value" style={{ color: unpaidSales > 0 ? '#ec4899' : 'var(--text-primary)' }}>
              {formatCurrency(unpaidSales)}
            </div>
            <div className="kpi-footer">
              <span className="kpi-trend-badge trend-down">
                +11.2%
              </span>
              <span className="kpi-subtitle">aging balances</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visualizations Layout */}
      <section className="charts-grid" aria-label="Visualizations">
        {/* Trend Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3>Revenue & Profit Trend</h3>
              <span className="chart-subtitle">Daily cash flow inflows compared against cumulative operational profit</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} tickFormatter={formatCurrency} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                  formatter={(val) => [formatCurrency(val), null]}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area 
                  type="monotone" 
                  name="Daily Inflow (Revenue)"
                  dataKey="Revenue" 
                  stroke="var(--primary)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  name="Cumulative Profit"
                  dataKey="NetProfit" 
                  stroke="var(--success)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category breakdown donut */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3>Revenue by Category</h3>
              <span className="chart-subtitle">Sales volume breakdown by product group</span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-card)', 
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                  formatter={(val) => [formatCurrency(val), 'Sales']}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '11px', marginTop: '10px' }}
                  iconSize={10}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* 3. Geographical Sales section */}
      <section className="chart-card">
        <div className="chart-header">
          <div className="chart-title-area">
            <h3>Regional Performance</h3>
            <span className="chart-subtitle">Direct comparison of gross revenues generated across regional nodes</span>
          </div>
        </div>
        <div className="chart-container" style={{ height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} tickFormatter={formatCurrency} />
              <YAxis dataKey="region" type="category" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
                formatter={(val) => [formatCurrency(val), 'Revenue']}
              />
              <Bar 
                dataKey="Sales" 
                fill="var(--primary)" 
                radius={[0, 4, 4, 0]}
                barSize={20}
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.Sales > 4000 ? 'var(--primary)' : 'var(--info)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
