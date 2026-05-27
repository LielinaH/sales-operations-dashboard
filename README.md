# Small Business Sales & Operations Intelligence Dashboard

🔗 **Live Demo:** [https://sales-operations-dashboard.vercel.app](https://sales-operations-dashboard.vercel.app)

An executive-level analytics dashboard designed for small-to-medium businesses (SMBs) to demonstrate end-to-end data cleaning (ETL), financial KPI engineering, accounts receivable aging, and premium interactive web visualization.

This project serves as a **portfolio-ready case study** for freelance clients on **PeoplePerHour** and **Contra** who are looking for analysts capable of cleaning messy spreadsheets, building automated reporting systems, and delivering executive insights.

---

## 🌟 Services This Project Demonstrates
When sharing this project with prospective freelance clients, it highlights expertise in the following high-paying service areas:
1. **Spreadsheet & Database Cleanup (ETL):** Taking raw, unstructured, or "dirty" transaction logs and programmatically resolving duplicates, formatting dates, correcting negative outliers, and imputing missing records.
2. **Business Intelligence (BI) & KPI Design:** Developing executive financial metrics like Gross Revenue, Net Profit, Operational Expense margins, and Average Order Values.
3. **Accounts Receivable (A/R) Aging Auditing:** Building aging schedules (0-15, 16-30, 30+ days overdue) from transactional invoices to help business owners recover outstanding balances and improve cash flow.
4. **Custom Dashboard Engineering (React/Vite):** Creating modern, responsive dashboards with dark/light themes, smooth responsive grids, and animated charts.
5. **SQL & Python Data Engineering:** Converting UI-based data cleaning steps into production-grade Python (Pandas) and SQL (PostgreSQL) script equivalents.

---

## 🚀 Getting Started & Running Locally

This dashboard is built on **React (Vite)** and compiles into a static asset package with zero backend dependencies. 

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Setup Steps
1. **Clone the repository and open the project directory:**
   ```bash
   cd sales-operations-dashboard
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   *The application will start running. Open your browser and navigate to the local URL (usually `http://localhost:5173`).*

4. **Compile production build (Optional):**
   ```bash
   npm run build
   ```
   *Generates minified, optimized production assets in the `dist/` directory.*

---

## 📊 Dashboard Modules

*   **Executive Overview:** Features high-impact KPI cards tracking Revenue, Net Profit, OpEx, and Net Margin. Renders animated historical trend lines and donut breakdowns of category revenues using Recharts. Includes interactive filters by date range, product category, and region.
*   **Operations Ledger:** Tracks top clients ranked by transaction volume, details operational cash outflows (expenses), and computes an active **A/R Aging Ledger** tracking overdue client payments and outstanding balances.
*   **ETL & Data Quality Pipeline:** Displays raw, messy incoming data side-by-side with cleaned database outputs. Lists pipeline statistics (nulls imputed, duplicates purged, outliers corrected) and provides equivalent, production-grade **Python (Pandas)** and **SQL** script implementations for clients who require database integrations.

---

## 🛠️ Technical Stack
*   **Frontend Framework:** React (Vite environment)
*   **Styling System:** Modern Vanilla CSS (utilizing variable theme swaps, glassmorphism, responsive grids, and CSS transitions)
*   **Icons Library:** Lucide React
*   **Data Analysis & Charts:** Recharts (SVG-based responsive plotting engine)
*   **Data Export Helper:** Native JavaScript CSV Blob exporter
