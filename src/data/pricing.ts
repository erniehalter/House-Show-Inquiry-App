import { DistanceTier } from "./states";

export type EventType =
  | "House Show - Standard"
  | "House Show - Evening"
  | "Wedding Ceremony (1 hour)"
  | "Wedding Cocktail (1-2 hours)"
  | "Wedding Dinner Reception (2-3 hours)"
  | "Wedding Ceremony + Cocktail Reception"
  | "Wedding 3-Piece Band (4 hours)";

export const EVENT_TYPES: EventType[] = [
  "House Show - Standard",
  "House Show - Evening",
  "Wedding Ceremony (1 hour)",
  "Wedding Cocktail (1-2 hours)",
  "Wedding Dinner Reception (2-3 hours)",
  "Wedding Ceremony + Cocktail Reception",
  "Wedding 3-Piece Band (4 hours)"
];

export const PRICING_TABLE: Record<EventType, Record<DistanceTier, number>> = {
  "House Show - Standard": {
    "0-275": 475,
    "275-500": 600,
    "500-1000": 675,
    "1000+": 775
  },
  "House Show - Evening": {
    "0-275": 600,
    "275-500": 775,
    "500-1000": 825,
    "1000+": 875
  },
  "Wedding Ceremony (1 hour)": {
    "0-275": 799,
    "275-500": 972,
    "500-1000": 1029,
    "1000+": 1202
  },
  "Wedding Cocktail (1-2 hours)": {
    "0-275": 914,
    "275-500": 1087,
    "500-1000": 1144,
    "1000+": 1317
  },
  "Wedding Dinner Reception (2-3 hours)": {
    "0-275": 1029,
    "275-500": 1202,
    "500-1000": 1259,
    "1000+": 1432
  },
  "Wedding Ceremony + Cocktail Reception": {
    "0-275": 1144,
    "275-500": 1317,
    "500-1000": 1374,
    "1000+": 1547
  },
  "Wedding 3-Piece Band (4 hours)": {
    "0-275": 3421,
    "275-500": 3651,
    "500-1000": 3766,
    "1000+": 3996
  }
};
