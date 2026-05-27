import React from 'react';
import { Loader2, AlertTriangle, Database } from 'lucide-react';

export function LoadingState({ message = 'Loading intelligence modules...' }) {
  return (
    <div className="state-container animate-fade-in">
      <Loader2 className="spinner" size={40} style={{ color: 'var(--primary)' }} />
      <h3 className="state-title">Processing Queries</h3>
      <p className="state-desc">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  title = 'No Records Found', 
  message = 'Try adjusting your filters or date ranges to find relevant transactions.' 
}) {
  return (
    <div className="state-container animate-fade-in">
      <Database size={44} style={{ color: 'var(--text-muted)' }} />
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
    </div>
  );
}

export function ErrorState({ 
  title = 'Execution Failed', 
  message = 'An error occurred while compiling the dashboard KPIs. Please try again.',
  onRetry
}) {
  return (
    <div className="state-container animate-fade-in" style={{ borderColor: 'var(--danger)' }}>
      <AlertTriangle size={44} style={{ color: 'var(--danger)' }} />
      <h3 className="state-title" style={{ color: 'var(--danger)' }}>{title}</h3>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry} style={{ marginTop: '12px' }}>
          Retry Queries
        </button>
      )}
    </div>
  );
}
