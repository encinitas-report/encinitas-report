/* ═══════════════════════════════════════════
   REAL MARKET DATA — Redfin, Zillow, MLS
   Last updated: February 2026
   ═══════════════════════════════════════════ */

export const MARKET = {
  // Citywide stats (Redfin Dec 2025 / Zillow Feb 2026)
  median: 1865000,
  medianChange: -5.6,
  zillow: 1868425,
  zillowChange: 0.1,
  dom: 45,
  domPrev: 40,
  sold30: 46,
  soldPrev: 33,
  ppsf: 976,
  ppsfChange: 5.1,
  compete: 66,
  offers: 5,
  hotDom: 12,
  listToSale: 98,
  active: 146,
  rent: 2450,
  pop: 59606,

  // 12-month price trend
  trend: [
    { m: "Mar '25", p: 1720000 },
    { m: "Apr", p: 1755000 },
    { m: "May", p: 1810000 },
    { m: "Jun", p: 1880000 },
    { m: "Jul", p: 1920000 },
    { m: "Aug", p: 2000000 },
    { m: "Sep", p: 1960000 },
    { m: "Oct", p: 1920000 },
    { m: "Nov", p: 1890000 },
    { m: "Dec", p: 1900000 },
    { m: "Jan '26", p: 1865000 },
    { m: "Feb", p: 1870000 },
  ],

  // Neighborhood-level data
  neighborhoods: [
    {
      name: "Leucadia",
      med: 2990000,
      chg: 19.6,
      dom: 46,
      score: 52,
      hot: 16,
      vibe: "Surf-town soul, Coast Hwy culture",
    },
    {
      name: "Old Encinitas",
      med: 2100000,
      chg: 5.7,
      dom: 42,
      score: 66,
      hot: 13,
      vibe: "Downtown walkability, village charm",
    },
    {
      name: "New Encinitas",
      med: 1452500,
      chg: 9.2,
      dom: 17,
      score: 72,
      hot: 10,
      vibe: "Family-friendly, great schools",
    },
    {
      name: "Olivenhain",
      med: 1570000,
      chg: 19.3,
      dom: 11,
      score: 86,
      hot: 6,
      vibe: "Equestrian estates, rural luxury",
    },
    {
      name: "Cardiff-by-the-Sea",
      med: 2000000,
      chg: -8.5,
      dom: 39,
      score: 55,
      hot: 8,
      vibe: "Restaurant Row, beach village life",
    },
  ],

  // Sample listings
  listings: [
    { addr: "412 Neptune Ave", hood: "Leucadia", bd: 3, ba: 2, sqft: 1820, price: 2150000, dom: 8, st: "Active" },
    { addr: "225 W D St", hood: "Old Encinitas", bd: 2, ba: 2, sqft: 1450, price: 1650000, dom: 5, st: "Pending" },
    { addr: "1745 Gascony Rd", hood: "New Encinitas", bd: 4, ba: 2.5, sqft: 2100, price: 1520000, dom: 12, st: "Active" },
    { addr: "3455 Lone Hill Ln", hood: "Olivenhain", bd: 5, ba: 4, sqft: 4200, price: 3250000, dom: 42, st: "Price Cut" },
    { addr: "2102 Oxford Ave", hood: "Cardiff-by-the-Sea", bd: 3, ba: 2, sqft: 1680, price: 2450000, dom: 3, st: "Just Listed" },
    { addr: "965 Santa Fe Dr", hood: "Old Encinitas", bd: 3, ba: 2, sqft: 1720, price: 1780000, dom: 1, st: "Just Listed" },
    { addr: "560 Requeza St", hood: "Old Encinitas", bd: 3, ba: 2.5, sqft: 1980, price: 1890000, dom: 21, st: "Active" },
    { addr: "1033 Hermes Ave", hood: "Leucadia", bd: 4, ba: 3, sqft: 2240, price: 1975000, dom: 14, st: "Active" },
  ],

  // Migration data (Redfin Q4 2025)
  migration: {
    stayPct: 74,
    topFrom: ["Los Angeles", "Raleigh", "San Francisco"],
    topTo: ["Portland", "Nashville", "Phoenix"],
  },
};

// Neighborhood accent colors
export const HOOD_COLORS = ["#6366f1", "#0ea5e9", "#22c55e", "#f59e0b", "#f43f5e"];

// Formatting utilities
export const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
export const fmtPrice = (n) =>
  n >= 1e6
    ? `$${(n / 1e6).toFixed(n % 1e5 === 0 ? 1 : 2)}M`
    : n >= 1e3
    ? `$${(n / 1e3).toFixed(0)}K`
    : `$${fmt(n)}`;
