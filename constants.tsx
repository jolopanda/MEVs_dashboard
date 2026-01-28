import { EconomicIndicator } from './types';

export const INDICATOR_CONFIGS: Omit<EconomicIndicator, 'data'>[] = [
  {
    id: 'WTI.Crude.Oil.Spot',
    name: 'West Texas Intermediate (WTI) Crude Oil Spot',
    unit: 'USD/Barrel',
    frequency: 'Monthly',
    sourceName: 'U.S. EIA',
    sourceUrl: 'https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RWTC&f=M',
    description: 'Benchmark price for global crude oil markets (WTI).'
  },
  {
    id: 'CPI.All.Item',
    name: 'Consumer Price Index',
    unit: 'Index (2018=100)',
    frequency: 'Monthly',
    sourceName: 'BSP / PSA',
    sourceUrl: 'https://www.bsp.gov.ph/SitePages/Statistics/Prices.aspx?TabId=1',
    description: 'Measure of the average change over time in the prices paid for a market basket of consumer goods.'
  },
  {
    id: 'Inf.All.Item',
    name: 'Inflation Rate',
    unit: '% YoY',
    frequency: 'Monthly',
    sourceName: 'BSP / PSA',
    sourceUrl: 'https://www.bsp.gov.ph/SitePages/Statistics/Prices.aspx?TabId=1',
    description: 'The annual rate of change in the Consumer Price Index.'
  },
  {
    id: 'GDP.Constant',
    name: 'Gross Domestic Product',
    unit: '% Growth',
    frequency: 'Quarterly',
    sourceName: 'PSA OpenStat',
    sourceUrl: 'https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__2B__NA__QT__1SUM/0012B5CEXQ1.px/?rxid=1cc70d4f-e616-44f7-aec5-5146d51f386f',
    description: 'Real Gross Domestic Product growth reflecting economic volume changes at constant prices.'
  },
  {
    id: 'Unemployment',
    name: 'Unemployment',
    unit: '%',
    frequency: 'Quarterly',
    sourceName: 'BSP',
    sourceUrl: 'https://www.bsp.gov.ph/SitePages/Statistics/OtherRealSectorAccounts.aspx?TabId=6',
    description: 'Percentage of the labor force that is jobless and actively seeking employment.'
  },
  {
    id: 'GNI.GDP.Wholesale.and.Retail',
    name: 'Gross National Income (GNI) and Gross Domestic Product (GDP)',
    unit: 'PHP Millions',
    frequency: 'Quarterly',
    sourceName: 'BSP',
    sourceUrl: 'https://www.bsp.gov.ph/SitePages/Statistics/RealSectorAccounts.aspx?TabId=3',
    description: 'Data covering Gross National Income and GDP with focus on Wholesale and Retail trade sectors.'
  }
];