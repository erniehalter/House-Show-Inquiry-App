export const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA",
  "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY",
  "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX",
  "UT", "VT", "VA", "WA", "WV", "WI", "WY", "Outside The US"
];

export const STATE_NAMES: Record<string, string> = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District of Columbia",
  "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois",
  "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana",
  "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota",
  "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada",
  "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York",
  "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma",
  "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin",
  "WY": "Wyoming", "Outside The US": "Outside The US"
};

export type DistanceTier = "0-275" | "275-500" | "500-1000" | "1000+";

export function getDistanceTier(state: string): DistanceTier {
  const tier0 = ["IN", "IL", "OH", "KY", "IA"];
  const tier1 = ["MO", "MI", "WI", "MN", "TN", "AR", "MS", "GA", "PA", "WV", "VA", "MD", "DE", "DC", "NJ"];
  const tier2 = ["AL", "FL", "LA", "OK", "KS", "NE", "CO", "TX", "NY", "CT", "MA", "NH", "ME", "VT", "RI", "NC", "SC", "ND", "SD"];
  const tier3 = ["AK", "HI", "AZ", "CA", "ID", "MT", "NV", "NM", "OR", "UT", "WA", "WY", "Outside The US"];

  if (tier0.includes(state)) return "0-275";
  if (tier1.includes(state)) return "275-500";
  if (tier2.includes(state)) return "500-1000";
  return "1000+";
}
