import { EventType, PRICING_TABLE } from "../data/pricing";
import { getDistanceTier } from "../data/states";

// Cache for CSV pricing data
let csvPricingCache: Record<EventType, Record<0 | 1 | 2 | 3, number>> | null = null;

/**
 * Load pricing from CSV file
 * Returns cached data on subsequent calls
 */
export async function loadPricingFromCSV(): Promise<Record<EventType, Record<0 | 1 | 2 | 3, number>>> {
  if (csvPricingCache) {
    return csvPricingCache;
  }

  try {
    const response = await fetch('/pricing.csv');
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');

    const pricing: Record<string, Record<0 | 1 | 2 | 3, number>> = {};

    // Parse each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const eventType = values[0] as EventType;

      pricing[eventType] = {
        0: parseInt(values[1]),
        1: parseInt(values[2]),
        2: parseInt(values[3]),
        3: parseInt(values[4]),
      };
    }

    csvPricingCache = pricing;
    return pricing;
  } catch (error) {
    console.error('Error loading pricing.csv, falling back to hardcoded pricing:', error);
    throw error;
  }
}

/**
 * Calculate price using either CSV data or hardcoded fallback
 * @param state State code
 * @param eventType Event type
 * @param csvPricing Optional pre-loaded CSV pricing data (to avoid async calls)
 */
export function calculatePrice(
  state: string,
  eventType: EventType,
  csvPricing?: Record<EventType, Record<0 | 1 | 2 | 3, number>>
): number {
  const tier = getDistanceTier(state) as 0 | 1 | 2 | 3;

  // Use CSV pricing if available, otherwise fall back to hardcoded
  if (csvPricing) {
    return csvPricing[eventType][tier];
  }

  return PRICING_TABLE[eventType][tier];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}
