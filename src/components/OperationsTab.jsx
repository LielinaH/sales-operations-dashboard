import React from 'react';
import { 
  Users, 
  CreditCard, 
  Clock, 
  TrendingDown, 
  ExternalLink 
} from 'lucide-react';
import { EmptyState } from './DataStates';

export default function OperationsTab({ salesData, expensesData }) {
  if (!salesData.length && !expensesData.length) {
    return <EmptyState />;
  }

  // Formatting helpers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  // 1. Top Customers Aggregation
  const customerMap = {};
  salesData.forEach(txn => {
    const name = txn.CustomerName;
    const email = txn.CustomerEmail;
    if (!customerMap[name]) {
      customerMap[name] = { name, email, count: 0, total: 0 };
    }
    customerMap[name].count++;
    customerMap[name].total += txn.TotalSales;
  });

  const topCustomers = Object.values(customerMap)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5); // Top 5

  // 2. Unpaid Invoices Ledger (Accounts Receivable Aging)
  // Current local date is: 2026-05-27T14:28:07+03:00 (i.e. 2026-05-27)
  const currentDate = new Date('2026-05-27');
  
  const unpaidInvoices = salesData
    .filter(txn => txn.Status === 'Unpaid')
    .map(txn => {
      const txnDate = new Date(txn.Date);
      const timeDiff = currentDate.getTime() - txnDate.getTime();
      const daysOutstanding = Math.max(0, Math.floor(timeDiff / (1000 * 3600 * 24)));
      
      let agingCategory = '0-15 days';
      if (daysOutstanding > 30) {
        agingCategory = '30+ days (Critical)';
      } else if (daysOutstanding > 15) {
        agingCategory = '16-30 days';
      }

      return {
        id: txn.TransactionID,
        date: txn.Date,
        customer: txn.CustomerName,
        amount: txn.TotalSales,
        days: daysOutstanding,
        category: agingCategory
      };
    })
    .sort((a, b) => b.days - a.days); // Longest outstanding first

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Accounts Receivable Ledger */}
      <section className="table-card">
        <div className="chart-header">
          <div className="chart-title-area">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} style={{ color: 'var(--danger)' }} />
              Accounts Receivable (A/R) Aging Ledger
            </h3>
            <span className="chart-subtitle">Aging invoices that are overdue, indexed from target close date (May 27, 2026)</span>
          </div>
        </div>

        {unpaidInvoices.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            All invoices fully cleared. Outstanding balances: $0.00
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table" aria-label="Overdue Invoices Table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Invoice Date</th>
                  <th>Customer Name</th>
                  <th>Balance Due</th>
                  <th>Days Overdue</th>
                  <th>Status Bracket</th>
                </tr>
              </thead>
              <tbody>
                {unpaidInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td><code>{inv.id}</code></td>
                    <td>{new Date(inv.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</td>
                    <td>{inv.customer}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(inv.amount)}</td>
                    <td>
                      <span style={{ 
                        color: inv.days > 20 ? 'var(--danger)' : 'var(--warning)', 
                        fontWeight: 'bold' 
                      }}>
                        {inv.days} days
                      </span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ 
                        backgroundColor: inv.days > 20 ? 'var(--danger-light)' : 'var(--warning-light)', 
                        color: inv.days > 20 ? 'var(--danger)' : 'var(--warning)' 
                      }}>
                        {inv.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 2. Top Customers & Expenses Ledger Grid */}
      <section className="table-section" aria-label="Customer and Expense Ledgers">
        {/* Top Customers */}
        <div className="table-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} style={{ color: 'var(--primary)' }} />
                Top Customer Profiles
              </h3>
              <span className="chart-subtitle">Top 5 clients ranked by total transaction value</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table" aria-label="Top Customer Profiles Table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Orders</th>
                  <th>Total Billing</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((cust, i) => (
                  <tr key={cust.name}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{cust.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cust.email}</span>
                      </div>
                    </td>
                    <td>{cust.count} transactions</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(cust.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Ledger */}
        <div className="table-card">
          <div className="chart-header">
            <div className="chart-title-area">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} style={{ color: 'var(--danger)' }} />
                Operating Expenses (OpEx)
              </h3>
              <span className="chart-subtitle">Detailed ledger of fixed/variable expenses</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table" aria-label="Expenses Ledger Table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expensesData.map((exp) => (
                  <tr key={exp.ExpenseID}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{exp.Category}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(exp.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{exp.Recipient}</td>
                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{formatCurrency(exp.Amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
