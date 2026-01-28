import React, { useState, useEffect } from 'react';
import { DashboardState } from './types';
import { fetchEconomicData } from './services/geminiService';
import IndicatorChart from './components/IndicatorChart';
import { INDICATOR_CONFIGS } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    indicators: [],
    loading: true,
    error: null,
    lastUpdated: null,
    groundingSources: []
  });

  const loadData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetchEconomicData();
      setState({
        indicators: result.indicators,
        loading: false,
        error: null,
        lastUpdated: new Date().toLocaleString(),
        groundingSources: result.groundingSources
      });
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.message || "Failed to load dashboard data. Please check your API key and try again."
      }));
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fa-solid fa-chart-column text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Macroeconomic Indicators</h1>
              <p className="text-xs text-slate-500 font-medium tracking-tight">Real-time Economic Intelligence Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Last Updated</span>
              <span className="text-xs text-slate-600 font-medium">{state.lastUpdated || 'Updating...'}</span>
            </span>
            <button 
              onClick={loadData}
              disabled={state.loading}
              className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <i className={`fa-solid fa-arrows-rotate ${state.loading ? 'animate-spin' : ''}`}></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Indicator Visualizations</h2>
          <p className="text-slate-500 mt-1">Comprehensive tracking of the latest 12 months (or quarters) of critical economic data.</p>
        </div>

        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        {state.loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-96 animate-pulse">
                <div className="h-6 w-3/4 bg-slate-100 rounded mb-4"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded mb-8"></div>
                <div className="h-48 w-full bg-slate-50 rounded mb-4"></div>
                <div className="h-4 w-full bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.indicators.map(indicator => (
                <IndicatorChart key={indicator.id} indicator={indicator} />
              ))}
            </div>

            {/* Official Primary Sources Section */}
            <div className="mt-12 p-8 bg-slate-900 rounded-2xl shadow-xl text-white">
              <div className="flex items-center gap-3 mb-6">
                <i className="fa-solid fa-building-columns text-blue-400 text-xl"></i>
                <h3 className="text-xl font-bold">Verified Data Sources</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INDICATOR_CONFIGS.map((config, idx) => (
                  <a 
                    key={idx} 
                    href={config.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">{config.frequency}</span>
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{config.name}</span>
                    </div>
                    <i className="fa-solid fa-external-link text-slate-500 group-hover:text-blue-400 text-sm"></i>
                  </a>
                ))}
              </div>
            </div>

            {/* Grounding Sources Listing (Intelligence) */}
            <div className="mt-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-2 mb-4">
                <i className="fa-brands fa-google text-blue-600"></i>
                <h3 className="font-semibold text-slate-800">Search Intelligence (Real-time Grounding)</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                These sources were used by the AI model to verify the absolute latest data points currently available on the public web.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {state.groundingSources.length > 0 ? (
                  state.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                    >
                      <i className="fa-solid fa-link text-slate-400 group-hover:text-blue-500"></i>
                      <span className="text-xs font-medium text-slate-700 truncate">{source.title}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Historical data verified via primary sources above.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 pt-8 pb-12 text-center px-4">
        <p className="text-sm text-slate-500">
          Data provided for informational purposes only. Values are sourced from EIA, PSA, and BSP.
        </p>
        <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">
          Macroeconomic Indicators Dashboard &copy; 2024 • Powered by Gemini AI
        </p>
      </footer>
    </div>
  );
};

export default App;