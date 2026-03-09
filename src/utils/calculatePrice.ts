import { EventType, PRICING_TABLE } from "../data/pricing";
import { getDistanceTier } from "../data/states";

export function calculatePrice(state: string, eventType: EventType): number {
  const tier = getDistanceTier(state);
  return PRICING_TABLE[eventType][tier];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}
