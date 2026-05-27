// Mock "dirty" sales transactions data with realistic business anomalies.
// This is used to demonstrate the dashboard's data-cleaning and transformation capabilities.
export const rawSalesData = [
  {
    "TransactionID": "TXN-0001",
    "Date": "2026-05-01",
    "CustomerName": "Acme Corp",
    "CustomerEmail": "contact@acme.com",
    "Category": "Software",
    "Quantity": "3",
    "UnitPrice": "$150.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0002",
    "Date": "02/05/2026", // Inconsistent date format (DD/MM/YYYY)
    "CustomerName": "  baker enterprises  ", // Leading/trailing spaces and lower case
    "CustomerEmail": "info@bakerent.com",
    "Category": "Consulting",
    "Quantity": 1,
    "UnitPrice": "1200.00",
    "Region": "West",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0003",
    "Date": "2026-05-03",
    "CustomerName": "", // Missing customer name
    "CustomerEmail": "anonymous@guest.com",
    "Category": "Support",
    "Quantity": "2",
    "UnitPrice": "75.00",
    "Region": "East",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0004",
    "Date": "2026/05/04", // Slash separator
    "CustomerName": "Acme Corp",
    "CustomerEmail": "contact@acme.com",
    "Category": "SOFTWARE", // Inconsistent casing
    "Quantity": 2,
    "UnitPrice": "$150.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0004", // Duplicate TransactionID and contents (Duplicate Record)
    "Date": "2026/05/04",
    "CustomerName": "Acme Corp",
    "CustomerEmail": "contact@acme.com",
    "Category": "SOFTWARE",
    "Quantity": 2,
    "UnitPrice": "$150.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0005",
    "Date": "2026-05-05T14:32:00Z", // ISO string format
    "CustomerName": "John Doe",
    "CustomerEmail": "john.doe@gmail.com",
    "Category": "Hardware",
    "Quantity": -1, // Negative quantity outlier
    "UnitPrice": "450.00",
    "Region": "", // Missing region
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0006",
    "Date": "2026-05-06",
    "CustomerName": "Delta Inc",
    "CustomerEmail": "billing@deltainc.com",
    "Category": "Software",
    "Quantity": "5",
    "UnitPrice": "$150.00",
    "Region": "South",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0007",
    "Date": "07/05/2026",
    "CustomerName": "Baker Enterprises",
    "CustomerEmail": "info@bakerent.com",
    "Category": "Consulting",
    "Quantity": 4,
    "UnitPrice": "1200.00",
    "Region": "West",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0008",
    "Date": "2026-05-08",
    "CustomerName": "Echo Services",
    "CustomerEmail": "", // Missing email
    "Category": "Support",
    "Quantity": 10,
    "UnitPrice": "75.00",
    "Region": "East",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0009",
    "Date": "2026-05-10",
    "CustomerName": "Fox Solutions",
    "CustomerEmail": "fox@solutions.co",
    "Category": "Hardware",
    "Quantity": 2,
    "UnitPrice": "$ -350.00", // Negative price outlier
    "Region": "West",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0010",
    "Date": "12-05-2026", // DD-MM-YYYY format
    "CustomerName": "Giga Corp",
    "CustomerEmail": "admin@gigacorp.net",
    "Category": "Software",
    "Quantity": "10",
    "UnitPrice": "150.00",
    "Region": "North",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0011",
    "Date": "2026-05-13",
    "CustomerName": "Acme Corp",
    "CustomerEmail": "contact@acme.com",
    "Category": "Support",
    "Quantity": 5,
    "UnitPrice": "75.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0012",
    "Date": "2026-05-14",
    "CustomerName": "Helix Ltd",
    "CustomerEmail": "hello@helix.io",
    "Category": "  Hardware  ", // Leading/trailing spaces
    "Quantity": 3,
    "UnitPrice": "450.00",
    "Region": "South",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0013",
    "Date": "2026-05-15",
    "CustomerName": "Delta Inc",
    "CustomerEmail": "billing@deltainc.com",
    "Category": "Software",
    "Quantity": 1,
    "UnitPrice": "150.00",
    "Region": "South",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0013", // Direct Duplicate of TXN-0013
    "Date": "2026-05-15",
    "CustomerName": "Delta Inc",
    "CustomerEmail": "billing@deltainc.com",
    "Category": "Software",
    "Quantity": 1,
    "UnitPrice": "150.00",
    "Region": "South",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0014",
    "Date": "16/05/2026",
    "CustomerName": "Ivan Capital",
    "CustomerEmail": "ivan@capital.com",
    "Category": "Consulting",
    "Quantity": 8,
    "UnitPrice": "1000.00",
    "Region": "East",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0015",
    "Date": "2026-05-18",
    "CustomerName": "Giga Corp",
    "CustomerEmail": "admin@gigacorp.net",
    "Category": "Software",
    "Quantity": "4",
    "UnitPrice": "$150.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0016",
    "Date": "19-05-2026",
    "CustomerName": "Kilo Brand",
    "CustomerEmail": "contact@kilobrand.com",
    "Category": "Support",
    "Quantity": 6,
    "UnitPrice": "80.00",
    "Region": "West",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0017",
    "Date": "2026-05-20",
    "CustomerName": "Baker Enterprises",
    "CustomerEmail": "info@bakerent.com",
    "Category": "Consulting",
    "Quantity": 2,
    "UnitPrice": "1200.00",
    "Region": "West",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0018",
    "Date": "2026-05-21",
    "CustomerName": "Luna Agency",
    "CustomerEmail": "luna@agency.co",
    "Category": "Hardware",
    "Quantity": 2,
    "UnitPrice": "450.00",
    "Region": "East",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0019",
    "Date": "22/05/2026",
    "CustomerName": "Nova Tech",
    "CustomerEmail": "sales@novatech.com",
    "Category": "Software",
    "Quantity": "3",
    "UnitPrice": "150.00",
    "Region": "South",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0020",
    "Date": "2026-05-24",
    "CustomerName": "Opal Shop",
    "CustomerEmail": "orders@opalshop.com",
    "Category": "Hardware",
    "Quantity": 1,
    "UnitPrice": "$450.00",
    "Region": "North",
    "Status": "Unpaid"
  },
  {
    "TransactionID": "TXN-0021",
    "Date": "2026-05-25",
    "CustomerName": "Acme Corp",
    "CustomerEmail": "contact@acme.com",
    "Category": "Software",
    "Quantity": "8",
    "UnitPrice": "150.00",
    "Region": "North",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0022",
    "Date": "2026-05-26",
    "CustomerName": "Prime Retail",
    "CustomerEmail": "support@primeretail.com",
    "Category": "Support",
    "Quantity": 12,
    "UnitPrice": "75.00",
    "Region": "West",
    "Status": "Paid"
  },
  {
    "TransactionID": "TXN-0023",
    "Date": "27/05/2026",
    "CustomerName": "Quantum Co",
    "CustomerEmail": "contact@quantum.io",
    "Category": "Consulting",
    "Quantity": 5,
    "UnitPrice": "1500.00",
    "Region": "East",
    "Status": "Unpaid"
  }
];

// Operational Expenses (OpEx) - Cleanly structured as they would represent bank feed data
export const expensesData = [
  { "ExpenseID": "EXP-01", "Date": "2026-05-01", "Category": "Rent", "Amount": 2500, "Recipient": "Commercial Properties Inc" },
  { "ExpenseID": "EXP-02", "Date": "2026-05-03", "Category": "Utilities", "Amount": 420.50, "Recipient": "Grid Power & Water" },
  { "ExpenseID": "EXP-03", "Date": "2026-05-05", "Category": "Software Subscriptions", "Amount": 380, "Recipient": "AWS & Slack & GitHub" },
  { "ExpenseID": "EXP-04", "Date": "2026-05-10", "Category": "Marketing", "Amount": 1200, "Recipient": "Meta & Google Ads" },
  { "ExpenseID": "EXP-05", "Date": "2026-05-12", "Category": "Salaries", "Amount": 8500, "Recipient": "Employee Bank Transfers" },
  { "ExpenseID": "EXP-06", "Date": "2026-05-15", "Category": "Office Supplies", "Amount": 145.80, "Recipient": "Staples Supplies" },
  { "ExpenseID": "EXP-07", "Date": "2026-05-20", "Category": "Marketing", "Amount": 650, "Recipient": "Content Creator Network" },
  { "ExpenseID": "EXP-08", "Date": "2026-05-25", "Category": "Insurance", "Amount": 350.00, "Recipient": "SafeBiz Mutual" }
];
