/**
 * Client-side ETL Pipeline & Data Cleaning Utility
 * Demonstrates data cleansing, format normalization, duplicate removal,
 * outlier correction, and missing value imputation.
 */

export function cleanData(rawSales) {
  const cleanSales = [];
  const discarded = [];
  const seenIds = new Set();

  const stats = {
    initialRows: rawSales.length,
    finalRows: 0,
    duplicatesRemoved: 0,
    datesNormalized: 0,
    nullsImputed: 0,
    anomaliesFixed: 0,
    totalAdjustments: 0
  };

  rawSales.forEach((row) => {
    // 1. Duplicate Detection
    const rawId = row.TransactionID ? String(row.TransactionID).trim() : '';
    if (!rawId) {
      discarded.push({ ...row, rejectionReason: 'Missing Transaction ID' });
      return;
    }

    if (seenIds.has(rawId)) {
      stats.duplicatesRemoved++;
      stats.totalAdjustments++;
      discarded.push({ ...row, rejectionReason: 'Duplicate Transaction ID' });
      return;
    }
    seenIds.add(rawId);

    const cleanRow = { TransactionID: rawId };
    let rowAdjusted = false;

    // 2. Date Format Normalization
    let dateStr = row.Date ? String(row.Date).trim() : '';
    let cleanDate = '';
    
    if (dateStr) {
      // Check for ISO timestamp format e.g. "2026-05-05T14:32:00Z"
      if (dateStr.includes('T')) {
        cleanDate = dateStr.split('T')[0];
        stats.datesNormalized++;
        rowAdjusted = true;
      }
      // Check for slash separators YYYY/MM/DD
      else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts[0].length === 4) {
          // YYYY/MM/DD
          cleanDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        } else {
          // DD/MM/YYYY
          cleanDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        stats.datesNormalized++;
        rowAdjusted = true;
      }
      // Check for dash separators DD-MM-YYYY
      else if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts[0].length === 2) {
          // DD-MM-YYYY
          cleanDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          stats.datesNormalized++;
          rowAdjusted = true;
        } else {
          // YYYY-MM-DD (already clean)
          cleanDate = dateStr;
        }
      } else {
        cleanDate = dateStr;
      }
    } else {
      // Default fallback for missing date
      cleanDate = new Date().toISOString().split('T')[0];
      stats.nullsImputed++;
      rowAdjusted = true;
    }
    cleanRow.Date = cleanDate;

    // 3. Customer Name Imputation & Cleaning
    let nameStr = row.CustomerName ? String(row.CustomerName).trim() : '';
    if (!nameStr) {
      cleanRow.CustomerName = 'Guest Customer';
      stats.nullsImputed++;
      rowAdjusted = true;
    } else {
      // Title Case Formatting
      cleanRow.CustomerName = nameStr
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      if (cleanRow.CustomerName !== row.CustomerName) {
        rowAdjusted = true;
      }
    }

    // 4. Customer Email Sanitization
    let emailStr = row.CustomerEmail ? String(row.CustomerEmail).trim() : '';
    if (!emailStr) {
      cleanRow.CustomerEmail = 'no-email@business.com';
      stats.nullsImputed++;
      rowAdjusted = true;
    } else {
      cleanRow.CustomerEmail = emailStr.toLowerCase();
      if (cleanRow.CustomerEmail !== row.CustomerEmail) {
        rowAdjusted = true;
      }
    }

    // 5. Category Standardization
    let catStr = row.Category ? String(row.Category).trim() : '';
    if (!catStr) {
      cleanRow.Category = 'General';
      stats.nullsImputed++;
      rowAdjusted = true;
    } else {
      // Standardize to Title Case
      cleanRow.Category = catStr.charAt(0).toUpperCase() + catStr.slice(1).toLowerCase();
      if (cleanRow.Category !== row.Category) {
        rowAdjusted = true;
      }
    }

    // 6. Quantity Parsing & Outlier Correction
    let qtyRaw = row.Quantity;
    let qty = parseInt(qtyRaw, 10);
    if (isNaN(qty)) {
      qty = 1;
      stats.anomaliesFixed++;
      rowAdjusted = true;
    } else if (qty <= 0) {
      // Handle negative quantities (convert to positive or default to 1)
      qty = Math.abs(qty) || 1;
      stats.anomaliesFixed++;
      rowAdjusted = true;
    }
    cleanRow.Quantity = qty;

    // 7. Unit Price Parsing, Symbol Stripping & Outlier Correction
    let priceRaw = row.UnitPrice ? String(row.UnitPrice) : '0';
    // Strip symbols: $, spaces, commas
    let priceCleanStr = priceRaw.replace(/[$\s,]/g, '');
    let price = parseFloat(priceCleanStr);
    
    if (isNaN(price)) {
      price = 0.0;
      stats.anomaliesFixed++;
      rowAdjusted = true;
    } else if (price <= 0) {
      price = Math.abs(price) || 10.0; // Correction logic
      stats.anomaliesFixed++;
      rowAdjusted = true;
    }
    cleanRow.UnitPrice = parseFloat(price.toFixed(2));

    // 8. Line Total (Calculated Field)
    cleanRow.TotalSales = parseFloat((cleanRow.Quantity * cleanRow.UnitPrice).toFixed(2));

    // 9. Region Mapping & Imputation
    let regStr = row.Region ? String(row.Region).trim() : '';
    if (!regStr) {
      cleanRow.Region = 'Unknown';
      stats.nullsImputed++;
      rowAdjusted = true;
    } else {
      cleanRow.Region = regStr.charAt(0).toUpperCase() + regStr.slice(1).toLowerCase();
      if (cleanRow.Region !== row.Region) {
        rowAdjusted = true;
      }
    }

    // 10. Status Formatting
    let statusStr = row.Status ? String(row.Status).trim() : 'Paid';
    cleanRow.Status = statusStr.charAt(0).toUpperCase() + statusStr.slice(1).toLowerCase();
    if (cleanRow.Status !== row.Status) {
      rowAdjusted = true;
    }

    if (rowAdjusted) {
      stats.totalAdjustments++;
    }

    cleanSales.push(cleanRow);
  });

  stats.finalRows = cleanSales.length;

  return {
    cleanSales,
    discarded,
    stats
  };
}

/**
 * Generates CSV string from clean table records
 */
export function convertToCSV(dataList) {
  if (!dataList || !dataList.length) return '';
  const headers = Object.keys(dataList[0]);
  const csvRows = [headers.join(',')];
  
  for (const row of dataList) {
    const values = headers.map(header => {
      const val = row[header];
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}
