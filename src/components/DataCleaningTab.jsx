import React, { useState } from 'react';
import { 
  Database, 
  ArrowRight, 
  Terminal, 
  Code, 
  Trash2, 
  Calendar, 
  UserX, 
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { rawSalesData } from '../data/rawOperationalData';

export default function DataCleaningTab({ cleanSales, stats, discarded }) {
  const [activeCodeTab, setActiveCodeTab] = useState('python');
  const [expandedAccordion, setExpandedAccordion] = useState('dedup');

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(val);
  };

  const toggleAccordion = (id) => {
    setExpandedAccordion(expandedAccordion === id ? '' : id);
  };

  // Pipeline documentation content
  const pipelineSteps = [
    {
      id: 'dedup',
      title: '1. Deduplication (Key Integrity)',
      desc: 'Removes double-counted transactions. Identifies rows sharing matching TransactionID keys and keeps the first entry while logging duplicates.',
      python: `# Pandas Deduplication
df.drop_duplicates(subset=["TransactionID"], keep="first", inplace=True)
print(f"Removed {initial_len - len(df)} duplicates")`,
      sql: `-- SQL Deduplication using CTE
WITH deduplicated AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY transaction_id 
      ORDER BY date DESC
    ) as row_num
  FROM raw_sales_staging
)
SELECT * FROM deduplicated WHERE row_num = 1;`
    },
    {
      id: 'date',
      title: '2. Date Standardization (Temporal Consistency)',
      desc: 'Parses multiple dates in strings, standardizing mixed separators (slashes, hyphens) and formats (DD/MM/YYYY, DD-MM-YYYY, ISO strings) into ISO-8601 standard (YYYY-MM-DD).',
      python: `# Python date normalization parser
def parse_date(d):
    if pd.isna(d): return pd.Timestamp.now().strftime("%Y-%m-%d")
    # Toggles formats dynamically
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return pd.to_datetime(d, format=fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return pd.to_datetime(d, errors="coerce").strftime("%Y-%m-%d")

df["Date"] = df["Date"].apply(parse_date)`,
      sql: `-- SQL Date Casting & Standardization
SELECT 
  CASE 
    WHEN date ~ '^\\d{4}-\\d{2}-\\d{2}' THEN CAST(date AS DATE)
    WHEN date ~ '^\\d{2}/\\d{2}/\\d{4}' THEN TO_DATE(date, 'DD/MM/YYYY')
    WHEN date ~ '^\\d{2}-\\d{2}-\\d{2}' THEN TO_DATE(date, 'DD-MM-YYYY')
    ELSE CURRENT_DATE 
  END AS standardized_date
FROM raw_sales_staging;`
    },
    {
      id: 'impute',
      title: '3. Text Normalization & Missing Values Imputation',
      desc: 'Trims leading/trailing whitespace, converts categories to Title Case, and fills blank customer entries with a default fallback (e.g. "Guest Customer").',
      python: `# Clean text fields and fill nulls
df["CustomerName"] = df["CustomerName"].str.strip().str.title().fillna("Guest Customer")
df["Category"] = df["Category"].str.strip().str.title().fillna("General")
df["CustomerEmail"] = df["CustomerEmail"].str.strip().str.lower().fillna("no-email@business.com")`,
      sql: `-- SQL Text Cleaning & Imputation
SELECT 
  COALESCE(INITCAP(NULLIF(TRIM(customer_name), '')), 'Guest Customer') AS customer_name,
  COALESCE(INITCAP(NULLIF(TRIM(category), '')), 'General') AS category,
  COALESCE(LOWER(NULLIF(TRIM(customer_email), '')), 'no-email@business.com') AS customer_email
FROM raw_sales_staging;`
    },
    {
      id: 'numeric',
      title: '4. Outlier Handling & Price Sanitization',
      desc: 'Removes text/currency glyphs ($) from numbers. Injects fallback logic to capture and correct negative outliers (taking absolute values for quantities and prices).',
      python: `# Strip formatting, convert to floats, take absolute value for outliers
df["UnitPrice"] = df["UnitPrice"].astype(str).str.replace(r"[$\\s,]", "", regex=True)
df["UnitPrice"] = pd.to_numeric(df["UnitPrice"], errors="coerce").abs().fillna(10.0)
df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce").abs().fillna(1).astype(int)
df["TotalSales"] = df["Quantity"] * df["UnitPrice"]`,
      sql: `-- SQL Stripping characters and taking absolute values
SELECT 
  ABS(CAST(REGEXP_REPLACE(unit_price, '[$\\s,]', '', 'g') AS NUMERIC)) AS unit_price,
  ABS(COALESCE(quantity::integer, 1)) AS quantity
FROM raw_sales_staging;`
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. ETL Quality Metrics cards */}
      <section className="etl-stats-grid" aria-label="ETL Quality Metrics">
        {/* Initial Rows */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-secondary)' }}>
            <Database size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.initialRows}</span>
            <span className="etl-stat-lbl">Initial Raw Rows</span>
          </div>
        </div>

        {/* Clean Output Rows */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Database size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.finalRows}</span>
            <span className="etl-stat-lbl">Clean Outputs</span>
          </div>
        </div>

        {/* Duplicates Cleaned */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
            <Trash2 size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.duplicatesRemoved}</span>
            <span className="etl-stat-lbl">Duplicates Purged</span>
          </div>
        </div>

        {/* Dates Normalized */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
            <Calendar size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.datesNormalized}</span>
            <span className="etl-stat-lbl">Dates Standardized</span>
          </div>
        </div>

        {/* Missing Values Imputed */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
            <UserX size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.nullsImputed}</span>
            <span className="etl-stat-lbl">Nulls Imputed</span>
          </div>
        </div>

        {/* Numeric Anomalies */}
        <div className="etl-stat-card">
          <div className="etl-stat-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
            <DollarSign size={22} />
          </div>
          <div className="etl-stat-info">
            <span className="etl-stat-val">{stats.anomaliesFixed}</span>
            <span className="etl-stat-lbl">Outliers Corrected</span>
          </div>
        </div>
      </section>

      {/* 2. Side-by-side Tables comparison */}
      <section className="etl-comparison-grid" aria-label="Data Comparison Grid">
        
        {/* LEFT: Raw Messy Data */}
        <div className="table-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3>Messy Raw Data Feed (Staging)</h3>
              <span className="chart-subtitle">Direct, uncleaned stream loaded from transaction dump (anomalies highlighted in red)</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table" aria-label="Staging Data Table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {rawSalesData.map((row, idx) => {
                  // Determine anomalies for highlighting
                  const isDuplicate = rawSalesData.findIndex(r => r.TransactionID === row.TransactionID) !== idx;
                  const isDateDirty = row.Date.includes('/') || row.Date.includes('T') || row.Date.split('-')[0].length === 2;
                  const isNameDirty = !row.CustomerName || row.CustomerName.trim() !== row.CustomerName || row.CustomerName === row.CustomerName.toLowerCase();
                  const isCategoryDirty = row.Category !== row.Category.charAt(0).toUpperCase() + row.Category.slice(1).toLowerCase();
                  const isQtyDirty = parseInt(row.Quantity, 10) <= 0;
                  const isPriceDirty = row.UnitPrice.includes('$') || parseFloat(row.UnitPrice.replace(/[$\s,]/g, '')) <= 0;

                  return (
                    <tr key={idx} className={isDuplicate ? 'dirty-row' : ''}>
                      <td>
                        <span className={isDuplicate ? 'dirty-cell' : ''}>
                          {row.TransactionID}
                        </span>
                      </td>
                      <td className={isDateDirty ? 'dirty-cell' : ''}>{row.Date}</td>
                      <td className={isNameDirty ? 'dirty-cell' : ''}>
                        {row.CustomerName || <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>[NULL]</span>}
                      </td>
                      <td className={isCategoryDirty ? 'dirty-cell' : ''}>{row.Category}</td>
                      <td className={isQtyDirty ? 'dirty-cell' : ''}>{row.Quantity}</td>
                      <td className={isPriceDirty ? 'dirty-cell' : ''}>{row.UnitPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: Cleansed Database Outputs */}
        <div className="table-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3>Cleansed Database Table (Warehouse)</h3>
              <span className="chart-subtitle">Standardized columns, duplicates purged, and keys mapped for analytics processing</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table" aria-label="Warehouse Data Table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Customer Name</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cleanSales.map((row) => (
                  <tr key={row.TransactionID}>
                    <td><code>{row.TransactionID}</code></td>
                    <td>{row.Date}</td>
                    <td>{row.CustomerName}</td>
                    <td>{row.Category}</td>
                    <td>{row.Quantity}</td>
                    <td>{formatCurrency(row.UnitPrice)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(row.TotalSales)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. ETL Pipeline Code Explanation */}
      <section className="table-card">
        <div className="chart-header">
          <div className="chart-title-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Terminal size={20} style={{ color: 'var(--primary)' }} />
              Production Pipeline Code Equivalents
            </h3>
            <span className="chart-subtitle">Equivalent script implementations showing how to achieve this data transformation in Python or SQL</span>
          </div>
          
          <div className="header-actions">
            <button 
              className={`btn ${activeCodeTab === 'python' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCodeTab('python')}
              style={{ height: '32px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              <Code size={14} style={{ marginRight: '4px' }} />
              Python (Pandas)
            </button>
            <button 
              className={`btn ${activeCodeTab === 'sql' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCodeTab('sql')}
              style={{ height: '32px', fontSize: '0.8rem', padding: '0 12px' }}
            >
              <Database size={14} style={{ marginRight: '4px' }} />
              PostgreSQL
            </button>
          </div>
        </div>

        <div className="pipeline-accordion">
          {pipelineSteps.map((step) => (
            <div className="accordion-item" key={step.id}>
              <button className="accordion-trigger" onClick={() => toggleAccordion(step.id)}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{step.title}</span>
                {expandedAccordion === step.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expandedAccordion === step.id && (
                <div className="accordion-content animate-fade-in">
                  <p style={{ fontSize: '0.85rem', marginBottom: '12px' }}>{step.desc}</p>
                  <pre className="code-panel">
                    <code>
                      {activeCodeTab === 'python' ? step.python : step.sql}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
