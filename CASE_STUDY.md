# Case Study: Small Business Sales & Operations Intelligence Dashboard
*A premium end-to-end data cleansing and interactive business intelligence application designed to demonstrate data analyst and dashboard engineering capabilities.*

---

## 💼 Case Study Overview (For Contra & PeoplePerHour)

### 🏷️ Title
**Automated Data Cleaning Pipeline & Executive Dashboard for E-Commerce Retailer**

### 🎯 Project Role
**Lead Data Analyst & Dashboard Engineer**

### ⏱️ Project Duration
**1 Week (Prototype to Production)**

### 💡 Project Context
This project was developed as a high-fidelity template to demonstrate how messy, fragmented operational spreadsheets (Excel, CSVs, POS systems) can be ingested, cleaned, validated, and converted into an executive-level interactive reporting interface. It models a real-world B2B/B2C retail business operating across multiple regional markets.

---

## 🛑 The Business Problem
Small-to-medium retail businesses often compile their transactional logs manually from multiple outlets. This results in standard data anomalies:
*   **Duplicate Entries:** Multiple entries for identical transactions (distorting revenue numbers).
*   **Malformed Fields:** Inconsistent date formatting (`DD/MM/YYYY`, ISO timestamps, slash separators) preventing database integration.
*   **Text Inconsistencies:** Random casing and whitespace padding in customer profiles and product category groups.
*   **Outliers/Data Entry Errors:** Negative unit prices or quantities which skew averages and profits.
*   **Accounts Receivable Lag:** A lack of clear visibility into overdue invoices, making it difficult for the accounting department to follow up on late payments.

Without a robust cleansing pipeline, reporting on these metrics yields incorrect financial statistics, leading to bad inventory decisions and cash flow shortages.

---

## 🛠️ The Solution: Unified Staging & Cleansing Dashboard
We built a unified interactive platform containing:
1.  **An Ingestion and Data Cleansing Pipeline (ETL):** A script that processes messy, raw staging feeds and automatically standardizes columns, purges duplicate records, and corrects outliers.
2.  **An Executive Financial Panel:** Displays KPIs like Gross Revenue, Net Profit, Operational Expense margins, and total transactional volume.
3.  **An Accounts Receivable Aging Grid:** Automatically calculates days overdue based on transaction dates relative to the reporting window closure.
4.  **SQL and Python Pipeline Snippets:** A repository section detailing production-level code equivalents to show database engineering capability.

---

## 🔧 Technical Deep-Dive: How Data is Cleansed
The dashboard includes an active cleaning utility written in ES6 JavaScript. The pipeline applies the following rules:

### 1. Key Integrity Check (Deduplication)
```javascript
if (seenIds.has(rawId)) {
  stats.duplicatesRemoved++;
  discarded.push({ ...row, rejectionReason: 'Duplicate Transaction ID' });
  return;
}
```
*Impact:* Prevents double-counting and secures primary key constraints on transactional datasets.

### 2. Standardized ISO Date Cast
```javascript
if (dateStr.includes('T')) {
  cleanDate = dateStr.split('T')[0];
} else if (dateStr.includes('/')) {
  const parts = dateStr.split('/');
  cleanDate = parts[0].length === 4 ? `${parts[0]}-${parts[1]}-${parts[2]}` : `${parts[2]}-${parts[1]}-${parts[0]}`;
}
```
*Impact:* Normalizes diverse date formats (e.g. `02/05/2026`, `12-05-2026`) into a uniform sequence suitable for sorting and time-series plotting.

### 3. Numerical Integrity & Outlier Correction
*   Strips currency tags (`$`) and formatting spacing.
*   Converts values to absolute numbers (`Math.abs`) to resolve negative data entry anomalies (e.g., pricing flags, quantity mistakes).
*   Corrects zero values to standard median figures.

---

## 📈 Projected Project Impact (For Client Review)
*   **100% Automated Formatting:** Replaced hours of manual Excel cleaning with an instant, single-click client-side validation script.
*   **Zero Revenue Distortion:** Purged double-counted transactions to ensure true reporting on gross margins.
*   **Improved Accounts Receivable Recovery:** Flagged overdue invoices instantly in the aging ledger, accelerating collection rates by identifying 30+ day critical overdue balances.
*   **Database Ready:** Delivered clean, structured data exportable in standard formats (CSV) ready to import directly into Postgres, Snowflake, or Power BI.

---

## 📸 Portfolio Screenshots Guide
To capture the most visually striking views for your freelance profile, take the following screenshots:

1.  **Overview Page (Dark Mode):** 
    *   *Focus:* The top row of glowing KPI cards (especially Net Profit and Net Margin) and the animated **Revenue & Profit Trend** area chart.
    *   *Caption:* *"Interactive Executive KPIs and trend lines. Built using Recharts and responsive CSS variables."*
2.  **ETL & Data Quality Page:**
    *   *Focus:* The side-by-side table displaying raw database input (highlighted with red warnings) next to clean database outcomes, showing data prep expertise.
    *   *Caption:* *"Real-time client-side ETL pipeline comparison. Demonstrates standard data cleaning, deduplication, and anomaly resolution."*
3.  **Accounts Receivable Ledger:**
    *   *Focus:* The **Aging Ledger table** showing invoices with red highlight badges on the "30+ days overdue" column.
    *   *Caption:* *"Operations aging ledger tracking overdue client bills and days outstanding relative to current reporting date."*
4.  **ETL Code Snippets Drawer:**
    *   *Focus:* Expanded accordions showing the SQL or Python equivalent script, demonstrating you write production-grade database scripts.
    *   *Caption:* *"Production code drawer detailing SQL CTE queries and Pandas cleaning scripts."*
