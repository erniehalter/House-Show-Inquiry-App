import { DistanceTier } from "./states";

export type EventType =
  | "Weekend Evening (Friday-Sunday)"
  | "All Other Times"
  | "Wedding Ceremony (1 hour)"
  | "Wedding Cocktail (1-2 hours)"
  | "Wedding Dinner Reception (2-3 hours)"
  | "Wedding Ceremony + Cocktail Reception"
  | "Wedding 3-Piece Band (4 hours)";

export const EVENT_TYPES: EventType[] = [
  "Weekend Evening (Friday-Sunday)",
  "All Other Times",
  "Wedding Ceremony (1 hour)",
  "Wedding Cocktail (1-2 hours)",
  "Wedding Dinner Reception (2-3 hours)",
  "Wedding Ceremony + Cocktail Reception",
  "Wedding 3-Piece Band (4 hours)"
];

export const PRICING_TABLE: Record<EventType, Record<DistanceTier, number>> = {
  "All Other Times": {
    "0-275": 475,
    "275-500": 600,
    "500-1000": 675,
    "1000+": 775
  },
  "Weekend Evening (Friday-Sunday)": {
    "0-275": 600,
    "275-500": 775,
    "500-1000": 825,
    "1000+": 875
  },
  "Wedding Ceremony (1 hour)": {
    "0-275": 695,
    "275-500": 845,
    "500-1000": 895,
    "1000+": 1045
  },
  "Wedding Cocktail (1-2 hours)": {
    "0-275": 795,
    "275-500": 945,
    "500-1000": 995,
    "1000+": 1145
  },
  "Wedding Dinner Reception (2-3 hours)": {
    "0-275": 895,
    "275-500": 1045,
    "500-1000": 1095,
    "1000+": 1245
  },
  "Wedding Ceremony + Cocktail Reception": {
    "0-275": 995,
    "275-500": 1145,
    "500-1000": 1195,
    "1000+": 1345
  },
  "Wedding 3-Piece Band (4 hours)": {
    "0-275": 2975,
    "275-500": 3175,
    "500-1000": 3275,
    "1000+": 3475
  }
};
