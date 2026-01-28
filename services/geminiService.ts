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

    Return the data strictly as a valid JSON object with the following structure:
    {
      "indicators": [
        {
          "id": "WTI.Crude.Oil.Spot",
          "data": [{"date": "2024-01", "value": 75.5}, ...]
        },
        ... (repeat for all 6 IDs)
      ]
    }
    
    Ensure the "date" field uses "YYYY-MM" format for monthly and "YYYY-QN" (e.g., 2024-Q1) for quarterly.
    Use only the most recent available real-world data from 2024 and 2025.
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
    
    // Safely extract grounding sources using any cast for deep property access during build
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
        data: fetched && Array.isArray(fetched.data) ? fetched.data : []
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