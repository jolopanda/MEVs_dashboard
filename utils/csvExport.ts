
import { EconomicIndicator } from '../types';

export const exportToCSV = (indicator: EconomicIndicator) => {
  const headers = ['Date', `Value (${indicator.unit})`];
  const rows = indicator.data.map(dp => [dp.date, dp.value.toString()]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${indicator.id}_data_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
