import { EventType, PRICING_TABLE } from "../data/pricing";
import { getDistanceTier, type DistanceTier } from "../data/states";

// Cache for CSV pricing data
let csvPricingCache: Record<EventType, Record<DistanceTier, number>> | null = null;

/**
 * Load pricing from CSV file
 * Returns cached data on subsequent calls
 */
export async function loadPricingFromCSV(): Promise<Record<EventType, Record<DistanceTier, number>>> {
  if (csvPricingCache) {
    return csvPricingCache;
  }

  try {
    const response = await fetch('/pricing.csv');
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');

    const pricing: Record<string, Record<DistanceTier, number>> = {};
    const tierMap: Record<number, DistanceTier> = {
      0: '0-275',
      1: '275-500',
      2: '500-1000',
      3: '1000+'
    };

    // Parse each row (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      const eventType = values[0] as EventType;

      pricing[eventType] = {
        [tierMap[0]]: parseInt(values[1]),
        [tierMap[1]]: parseInt(values[2]),
        [tierMap[2]]: parseInt(values[3]),
        [tierMap[3]]: parseInt(values[4]),
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
  csvPricing?: Record<EventType, Record<DistanceTier, number>>
): number {
  const tier = getDistanceTier(state);
  let price: number;

  // For House Show - Standard, derive from evening price at 80% (20% reduction)
  if (eventType === 'House Show - Standard') {
    const eveningPrice = csvPricing
      ? csvPricing['House Show - Evening'][tier]
      : PRICING_TABLE['House Show - Evening'][tier];
    price = Math.round(eveningPrice * 0.8);
  } else {
    // Use CSV pricing if available, otherwise fall back to hardcoded
    if (csvPricing) {
      price = csvPricing[eventType][tier];
    } else {
      price = PRICING_TABLE[eventType][tier];
    }
  }

  // Round to nearest $25
  return roundToNearest25(price);
}

export function roundToNearest25(amount: number): number {
  return Math.round(amount / 25) * 25;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}
