import { GoogleGenAI } from "@google/genai";
import { INDICATOR_CONFIGS } from "../constants";
import { EconomicIndicator } from "../types";

export const fetchEconomicData = async () => {
  // Use type assertion for process.env to satisfy tsc
  const apiKey = (process.env as any).API_KEY as string;
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Find the latest 12 months (or last 4-6 available quarters) of data for the following economic indicators:
    1. WTI.Crude.Oil.Spot (Monthly)
    2. CPI.All.Item (Monthly, Philippines)
    3. Inf.All.Item (Monthly, Philippines)
    4. GDP.Constant (Quarterly, Philippines)
    5. Unemployment (Quarterly, Philippines)
    6. GNI.GDP.Wholesale.and.Retail (Quarterly, Philippines)

    Additionally, provide a short-term forecast (next 3-6 months or 1-2 quarters) for each indicator based on current global and local economic events (e.g., OPEC+ decisions, BSP interest rate outlook, geopolitical tensions).

    Return the data strictly as a valid JSON object with the following structure:
    {
      "indicators": [
        {
          "id": "WTI.Crude.Oil.Spot",
          "data": [{"date": "2024-01", "value": 75.5}, ...],
          "forecastData": [{"date": "2025-04", "value": 82.0}, ...],
          "forecastSources": [{"title": "Reuters: Oil Price Outlook", "uri": "https://..."}]
        },
        ... (repeat for all 6 IDs)
      ]
    }
    
    Ensure:
    1. The "date" field uses "YYYY-MM" format for monthly and "YYYY-QN" (e.g., 2024-Q1) for quarterly.
    2. Use only the most recent available real-world data from 2024 and 2025.
    3. The first point of "forecastData" should be the next period immediately following the last point in "data".
    4. Provide at least 2 credible sources for each forecast in "forecastSources".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse indicator data from Gemini response.");
    }

    const rawData = JSON.parse(jsonMatch[0]);
    
    // Safely extract grounding sources
    const candidates = (response as any).candidates;
    const groundingChunks = candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const groundingSources = Array.isArray(groundingChunks) 
      ? groundingChunks.map((chunk: any) => ({
          title: chunk.web?.title || "Search Result",
          uri: chunk.web?.uri || "#"
        })) 
      : [];

    const indicators: EconomicIndicator[] = INDICATOR_CONFIGS.map(config => {
      const fetched = rawData.indicators?.find((ind: any) => ind.id === config.id);
      return {
        ...config,
        data: fetched && Array.isArray(fetched.data) ? fetched.data : [],
        forecastData: fetched && Array.isArray(fetched.forecastData) ? fetched.forecastData : [],
        forecastSources: fetched && Array.isArray(fetched.forecastSources) ? fetched.forecastSources : []
      } as EconomicIndicator;
    });

    return {
      indicators,
      groundingSources
    };
  } catch (error) {
    console.error("Error fetching data from Gemini:", error);
    throw error;
  }
};