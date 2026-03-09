import { getDistanceTier as getDistanceTierFromStates } from "../data/states";

export function getDistanceTier(state: string): string {
  return getDistanceTierFromStates(state);
}

export function getTravelInfo(state: string): string {
  return "I'll bring my Bose PA system—great for house shows to events with 300-400 people.";
}
