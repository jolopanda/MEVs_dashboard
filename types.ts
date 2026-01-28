
export interface DataPoint {
  date: string;
  value: number;
}

export interface EconomicIndicator {
  id: string;
  name: string;
  unit: string;
  frequency: 'Monthly' | 'Quarterly';
  sourceName: string;
  sourceUrl: string;
  data: DataPoint[];
  description: string;
}

export interface DashboardState {
  indicators: EconomicIndicator[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  groundingSources: Array<{ title: string; uri: string }>;
}
