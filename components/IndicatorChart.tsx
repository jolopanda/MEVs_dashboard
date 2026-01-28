import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { EconomicIndicator } from '../types';
import { exportToCSV } from '../utils/csvExport';

interface Props {
  indicator: EconomicIndicator;
}

const IndicatorChart: React.FC<Props> = ({ indicator }) => {
  const isPercentage = indicator.unit.includes('%');

  const chartMargins = { top: 10, right: 10, left: -20, bottom: 0 };
  const commonXAxis = (
    <XAxis 
      dataKey="date" 
      axisLine={false} 
      tickLine={false} 
      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
    />
  );
  const commonYAxis = (
    <YAxis 
      axisLine={false} 
      tickLine={false} 
      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
    />
  );
  const commonTooltip = (
    <Tooltip 
      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
      itemStyle={{ fontWeight: 700, color: '#2563eb' }}
      cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
    />
  );
  const commonGrid = <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
        <div className="flex-1 pr-4">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{indicator.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${indicator.frequency === 'Monthly' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {indicator.frequency}
            </span>
            <span className="text-xs text-slate-500 font-medium">{indicator.unit}</span>
          </div>
        </div>
        <button 
          onClick={() => exportToCSV(indicator)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold border border-transparent hover:border-blue-100"
          title="Export to CSV"
        >
          <i className="fa-solid fa-download"></i>
          <span>CSV</span>
        </button>
      </div>
      
      <div className="p-5 flex-grow">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {isPercentage ? (
              <AreaChart data={indicator.data} margin={chartMargins}>
                {commonGrid}
                {commonXAxis}
                {commonYAxis}
                {commonTooltip}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  fill="#eff6ff"
                  strokeWidth={3} 
                />
              </AreaChart>
            ) : (
              <LineChart data={indicator.data} margin={chartMargins}>
                {commonGrid}
                {commonXAxis}
                {commonYAxis}
                {commonTooltip}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
            {indicator.description}
          </p>
          
          <div className="flex flex-col gap-1.5 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Official Data Source:</span>
            <a 
              href={indicator.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all"
            >
              <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-700 truncate">{indicator.sourceName}</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px] text-slate-400 group-hover:text-blue-500"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorChart;