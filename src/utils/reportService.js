/**
 * AutoTracker Fiscal Manifest Generator
 * Service for exporting high-fidelity financial telemetry.
 */

export const generateCSVReport = (expenses) => {
  if (!expenses || expenses.length === 0) return null;

  // Header Payload
  const headers = [
    'Sequence ID',
    'Fiscal Magnitude (AED)',
    'Category Cluster',
    'Sub-Node',
    'Deployment Date',
    'Vendor Identifier',
    'Asset Node',
    'Status'
  ];

  // Map expenses to CSV rows
  const rows = expenses.map(e => [
    e.id,
    e.amount,
    e.category,
    e.subcategory || 'N/A',
    e.date,
    `"${e.vendor || 'Unknown'}"`,
    `"${e.vehicles?.name || 'Unassigned'}"`,
    e.status || 'Cleared'
  ]);

  // Join into CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create downloadable blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `AUTOTRACK_FISCAL_MANIFEST_${timestamp}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
