import { DistanceTier } from "./states";

export type EventType =
  | "House Show - Standard"
  | "House Show - Evening"
  | "Wedding";

export const EVENT_TYPES: EventType[] = [
  "House Show - Standard",
  "House Show - Evening",
  "Wedding"
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
  "Wedding": {
    "0-275": 695,
    "275-500": 845,
    "500-1000": 895,
    "1000+": 1045
  }
};
