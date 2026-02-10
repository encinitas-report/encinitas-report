/* THE ENCINITAS REPORT — Market Data v3.1
   Sources: Redfin, Zillow, Freddie Mac, Bankrate, MLS, GreatSchools
   Updated: February 10, 2026 */

export const RATES = {
  updated: "Feb 10, 2026",
  conventional30: { rate: 6.11, apr: 6.24, label: "30-Yr Fixed", source: "Freddie Mac PMMS" },
  conventional15: { rate: 5.50, apr: 5.68, label: "15-Yr Fixed", source: "Freddie Mac PMMS" },
  fha30:          { rate: 5.75, apr: 6.42, label: "FHA 30-Yr", source: "Rocket Mortgage", note: "3.5% min down, MIP included" },
  va30:           { rate: 5.375, apr: 5.71, label: "VA 30-Yr", source: "Veterans United", note: "0% down, funding fee applies" },
  jumbo30:        { rate: 6.25, apr: 6.38, label: "Jumbo 30-Yr", source: "Bankrate", note: "Loans > $766,550" },
  arm51:          { rate: 5.63, apr: 6.89, label: "5/1 ARM", source: "Bankrate", note: "Fixed 5 yrs, then adjusts" },
  trend: [
    { w: "Jan 2", r: 6.91 },{ w: "Jan 9", r: 6.93 },{ w: "Jan 16", r: 6.89 },
    { w: "Jan 23", r: 6.87 },{ w: "Jan 30", r: 6.63 },{ w: "Feb 6", r: 6.11 },
  ],
};

export const MARKET = {
  city: "Encinitas", state: "CA", zip: "92024",
  median: 1865000, medianChange: -5.6, zillow: 1868425, zillowChange: 0.1,
  dom: 45, domPrev: 40, sold30: 46, soldPrev: 33,
  ppsf: 976, ppsfChange: 5.1, compete: 66, offers: 5, hotDom: 12,
  listToSale: 98, active: 146, rent: 2450, pop: 62007,
  unemployment: 4.3, medianIncome: 142506, homeOwnership: 65.2,
  trend: [
    { m: "Mar '25", p: 1720000 },{ m: "Apr", p: 1755000 },{ m: "May", p: 1810000 },
    { m: "Jun", p: 1880000 },{ m: "Jul", p: 1920000 },{ m: "Aug", p: 2000000 },
    { m: "Sep", p: 1960000 },{ m: "Oct", p: 1920000 },{ m: "Nov", p: 1890000 },
    { m: "Dec", p: 1900000 },{ m: "Jan '26", p: 1865000 },{ m: "Feb", p: 1870000 },
  ],
  migration: { stayPct: 74, topFrom: ["Los Angeles","Raleigh","San Francisco"], topTo: ["Portland","Nashville","Phoenix"] },
};

export const NEIGHBORHOODS = [
  {
    id: "leucadia", name: "Leucadia",
    med: 2990000, chg: 19.6, dom: 46, score: 52, hot: 16,
    ppsf: 1285, active: 28, sold30: 8, listToSale: 96,
    vibe: "Surf-town soul, Coast Hwy culture", color: "#8b5cf6",
    center: [33.069, -117.295],
    schools: [{ name: "Paul Ecke Central", rating: 8 },{ name: "Capri Elementary", rating: 7 }],
    boundary: [
      [33.0815,-117.322],[33.0810,-117.310],[33.0790,-117.298],[33.0780,-117.289],
      [33.0775,-117.280],[33.0770,-117.273],[33.0760,-117.268],[33.0740,-117.265],
      [33.0700,-117.264],[33.0660,-117.264],[33.0600,-117.265],[33.0585,-117.266],
      [33.0580,-117.268],[33.0575,-117.285],[33.0570,-117.295],[33.0565,-117.318],[33.0565,-117.322],
    ],
    trend: [
      { m: "Mar '25", p: 2500000 },{ m: "Jun", p: 2750000 },{ m: "Sep", p: 2850000 },{ m: "Dec", p: 2990000 },
    ],
  },
  {
    id: "old-encinitas", name: "Old Encinitas",
    med: 2100000, chg: 5.7, dom: 42, score: 66, hot: 13,
    ppsf: 1120, active: 31, sold30: 11, listToSale: 97,
    vibe: "Downtown walkability, village charm", color: "#0ea5e9",
    center: [33.047, -117.292],
    schools: [{ name: "Flora Vista Elementary", rating: 8 },{ name: "San Dieguito Academy", rating: 9 }],
    boundary: [
      [33.0565,-117.322],[33.0570,-117.295],[33.0575,-117.285],[33.0580,-117.268],
      [33.0585,-117.266],[33.0580,-117.264],[33.0500,-117.264],[33.0440,-117.264],
      [33.0400,-117.265],[33.0380,-117.268],[33.0365,-117.285],[33.0360,-117.295],
      [33.0355,-117.318],[33.0355,-117.322],
    ],
    trend: [
      { m: "Mar '25", p: 1950000 },{ m: "Jun", p: 2020000 },{ m: "Sep", p: 2080000 },{ m: "Dec", p: 2100000 },
    ],
  },
  {
    id: "new-encinitas", name: "New Encinitas",
    med: 1452500, chg: 9.2, dom: 17, score: 72, hot: 10,
    ppsf: 780, active: 38, sold30: 14, listToSale: 99,
    vibe: "Family-friendly, great schools", color: "#22c55e",
    center: [33.055, -117.250],
    schools: [{ name: "Park Dale Lane", rating: 9 },{ name: "Diegueno Middle", rating: 8 },{ name: "San Dieguito Academy", rating: 9 }],
    boundary: [
      [33.0760,-117.265],[33.0755,-117.250],[33.0740,-117.238],[33.0680,-117.232],
      [33.0580,-117.232],[33.0480,-117.233],[33.0440,-117.238],[33.0440,-117.255],
      [33.0440,-117.264],[33.0500,-117.264],[33.0580,-117.264],[33.0600,-117.265],
      [33.0700,-117.264],[33.0740,-117.265],
    ],
    trend: [
      { m: "Mar '25", p: 1310000 },{ m: "Jun", p: 1380000 },{ m: "Sep", p: 1420000 },{ m: "Dec", p: 1452500 },
    ],
  },
  {
    id: "olivenhain", name: "Olivenhain",
    med: 1570000, chg: 19.3, dom: 11, score: 86, hot: 6,
    ppsf: 690, active: 22, sold30: 8, listToSale: 101,
    vibe: "Equestrian estates, rural luxury", color: "#f59e0b",
    center: [33.055, -117.215],
    schools: [{ name: "Olivenhain Pioneer", rating: 9 }],
    boundary: [
      [33.0720,-117.234],[33.0710,-117.215],[33.0700,-117.195],[33.0640,-117.188],
      [33.0560,-117.188],[33.0460,-117.192],[33.0440,-117.205],[33.0440,-117.225],
      [33.0440,-117.232],[33.0480,-117.233],[33.0580,-117.232],[33.0680,-117.232],
    ],
    trend: [
      { m: "Mar '25", p: 1280000 },{ m: "Jun", p: 1400000 },{ m: "Sep", p: 1500000 },{ m: "Dec", p: 1570000 },
    ],
  },
  {
    id: "cardiff", name: "Cardiff-by-the-Sea",
    med: 2000000, chg: -8.5, dom: 39, score: 55, hot: 8,
    ppsf: 1050, active: 27, sold30: 5, listToSale: 97,
    vibe: "Restaurant Row, beach village life", color: "#f43f5e",
    center: [33.022, -117.280],
    schools: [{ name: "Cardiff Elementary", rating: 8 },{ name: "Ada Harris", rating: 7 }],
    boundary: [
      [33.0355,-117.322],[33.0360,-117.295],[33.0365,-117.285],[33.0380,-117.268],
      [33.0400,-117.265],[33.0380,-117.258],[33.0300,-117.258],[33.0220,-117.262],
      [33.0140,-117.268],[33.0090,-117.280],[33.0080,-117.300],[33.0090,-117.318],[33.0095,-117.322],
    ],
    trend: [
      { m: "Mar '25", p: 2180000 },{ m: "Jun", p: 2150000 },{ m: "Sep", p: 2080000 },{ m: "Dec", p: 2000000 },
    ],
  },
];

export const RECENT_SALES = [
  { addr:"412 Neptune Ave",hood:"leucadia",lat:33.0735,lng:-117.3105,price:2150000,bd:3,ba:2,sqft:1820,dom:8,st:"Active",date:"2026-02-02",ppsf:1181 },
  { addr:"1033 Hermes Ave",hood:"leucadia",lat:33.0682,lng:-117.3075,price:1975000,bd:4,ba:3,sqft:2240,dom:14,st:"Active",date:"2026-01-27",ppsf:882 },
  { addr:"547 Neptune Ave",hood:"leucadia",lat:33.0748,lng:-117.3112,price:3485000,bd:4,ba:3.5,sqft:2400,dom:22,st:"Active",date:"2026-01-19",ppsf:1452 },
  { addr:"135 Leucadia Blvd",hood:"leucadia",lat:33.0588,lng:-117.3020,price:1850000,bd:3,ba:2,sqft:1650,dom:31,st:"Price Cut",date:"2026-01-10",ppsf:1121 },
  { addr:"1640 Hymettus Ave",hood:"leucadia",lat:33.0700,lng:-117.2920,price:1425000,bd:3,ba:2,sqft:1380,dom:6,st:"Pending",date:"2026-02-04",ppsf:1033 },
  { addr:"475 Orpheus Ave",hood:"leucadia",lat:33.0718,lng:-117.3060,price:2750000,bd:3,ba:3,sqft:2080,dom:11,st:"Active",date:"2026-01-30",ppsf:1322 },
  { addr:"820 Diana Ave",hood:"leucadia",lat:33.0650,lng:-117.3048,price:1680000,bd:2,ba:2,sqft:1280,dom:2,st:"Just Listed",date:"2026-02-08",ppsf:1313 },
  { addr:"225 W D St",hood:"old-encinitas",lat:33.0490,lng:-117.2960,price:1650000,bd:2,ba:2,sqft:1450,dom:5,st:"Pending",date:"2026-02-05",ppsf:1138 },
  { addr:"965 Santa Fe Dr",hood:"old-encinitas",lat:33.0515,lng:-117.2900,price:1780000,bd:3,ba:2,sqft:1720,dom:1,st:"Just Listed",date:"2026-02-09",ppsf:1035 },
  { addr:"560 Requeza St",hood:"old-encinitas",lat:33.0470,lng:-117.2890,price:1890000,bd:3,ba:2.5,sqft:1980,dom:21,st:"Active",date:"2026-01-20",ppsf:955 },
  { addr:"154 W Jason St",hood:"old-encinitas",lat:33.0508,lng:-117.2940,price:2280000,bd:3,ba:3,sqft:1950,dom:3,st:"Just Listed",date:"2026-02-07",ppsf:1169 },
  { addr:"740 2nd St",hood:"old-encinitas",lat:33.0460,lng:-117.2950,price:1920000,bd:3,ba:2,sqft:1600,dom:18,st:"Active",date:"2026-01-23",ppsf:1200 },
  { addr:"355 W E St",hood:"old-encinitas",lat:33.0485,lng:-117.2975,price:2450000,bd:4,ba:3,sqft:2200,dom:9,st:"Active",date:"2026-02-01",ppsf:1114 },
  { addr:"818 Cornish Dr",hood:"old-encinitas",lat:33.0530,lng:-117.2870,price:1540000,bd:3,ba:2,sqft:1520,dom:35,st:"Price Cut",date:"2026-01-06",ppsf:1013 },
  { addr:"1745 Gascony Rd",hood:"new-encinitas",lat:33.0575,lng:-117.2580,price:1520000,bd:4,ba:2.5,sqft:2100,dom:12,st:"Active",date:"2026-01-29",ppsf:724 },
  { addr:"1801 Amalfi Dr",hood:"new-encinitas",lat:33.0530,lng:-117.2620,price:1350000,bd:2,ba:2,sqft:1860,dom:18,st:"Pending",date:"2026-01-23",ppsf:726 },
  { addr:"802 Saxony Rd",hood:"new-encinitas",lat:33.0560,lng:-117.2550,price:1180000,bd:3,ba:2.5,sqft:1437,dom:7,st:"Active",date:"2026-02-03",ppsf:821 },
  { addr:"2130 Summerhill Dr",hood:"new-encinitas",lat:33.0620,lng:-117.2480,price:1395000,bd:3,ba:2,sqft:1780,dom:4,st:"Just Listed",date:"2026-02-06",ppsf:784 },
  { addr:"1155 Via Escalante",hood:"new-encinitas",lat:33.0500,lng:-117.2520,price:1625000,bd:4,ba:3,sqft:2350,dom:16,st:"Active",date:"2026-01-25",ppsf:691 },
  { addr:"440 Park Dale Ln",hood:"new-encinitas",lat:33.0545,lng:-117.2460,price:1285000,bd:3,ba:2,sqft:1620,dom:10,st:"Pending",date:"2026-01-31",ppsf:793 },
  { addr:"1580 Village Park Way",hood:"new-encinitas",lat:33.0600,lng:-117.2540,price:1050000,bd:3,ba:2.5,sqft:1437,dom:3,st:"Just Listed",date:"2026-02-07",ppsf:731 },
  { addr:"3455 Lone Hill Ln",hood:"olivenhain",lat:33.0580,lng:-117.2250,price:3250000,bd:5,ba:4,sqft:4200,dom:42,st:"Price Cut",date:"2026-01-01",ppsf:774 },
  { addr:"3020 Via de Caballo",hood:"olivenhain",lat:33.0520,lng:-117.2180,price:2100000,bd:4,ba:3,sqft:3100,dom:9,st:"Pending",date:"2026-02-01",ppsf:677 },
  { addr:"1501 Rancho Encinitas",hood:"olivenhain",lat:33.0480,lng:-117.2300,price:1820000,bd:4,ba:3,sqft:2800,dom:15,st:"Active",date:"2026-01-26",ppsf:650 },
  { addr:"2860 Calle Rancho Vista",hood:"olivenhain",lat:33.0560,lng:-117.2100,price:1450000,bd:3,ba:2,sqft:2200,dom:5,st:"Active",date:"2026-02-05",ppsf:659 },
  { addr:"1210 Rancho Encinitas Dr",hood:"olivenhain",lat:33.0500,lng:-117.2220,price:1980000,bd:4,ba:3.5,sqft:3400,dom:28,st:"Active",date:"2026-01-13",ppsf:582 },
  { addr:"3660 Manchester Ave",hood:"olivenhain",lat:33.0460,lng:-117.2050,price:2650000,bd:5,ba:4.5,sqft:4800,dom:8,st:"Active",date:"2026-02-02",ppsf:552 },
  { addr:"2102 Oxford Ave",hood:"cardiff",lat:33.0220,lng:-117.2830,price:2450000,bd:3,ba:2,sqft:1680,dom:3,st:"Just Listed",date:"2026-02-07",ppsf:1458 },
  { addr:"2145 Montgomery Ave",hood:"cardiff",lat:33.0200,lng:-117.2800,price:1985000,bd:3,ba:2,sqft:1540,dom:28,st:"Active",date:"2026-01-13",ppsf:1289 },
  { addr:"520 Liverpool Dr",hood:"cardiff",lat:33.0270,lng:-117.2750,price:2680000,bd:4,ba:3,sqft:2200,dom:6,st:"Active",date:"2026-02-04",ppsf:1218 },
  { addr:"1232 San Mario Dr",hood:"cardiff",lat:33.0250,lng:-117.2720,price:1750000,bd:3,ba:2,sqft:1460,dom:20,st:"Active",date:"2026-01-21",ppsf:1199 },
  { addr:"960 Mozart Ave",hood:"cardiff",lat:33.0180,lng:-117.2780,price:2200000,bd:3,ba:2.5,sqft:1820,dom:14,st:"Pending",date:"2026-01-27",ppsf:1209 },
  { addr:"2478 Cambridge Ave",hood:"cardiff",lat:33.0210,lng:-117.2760,price:3100000,bd:4,ba:3,sqft:2400,dom:2,st:"Just Listed",date:"2026-02-08",ppsf:1292 },
];

export const SCHOOLS = [
  { name:"Paul Ecke Central",lat:33.068,lng:-117.290,rating:8,grades:"K-6",hood:"leucadia" },
  { name:"Capri Elementary",lat:33.075,lng:-117.275,rating:7,grades:"K-6",hood:"leucadia" },
  { name:"Flora Vista Elementary",lat:33.050,lng:-117.278,rating:8,grades:"K-6",hood:"old-encinitas" },
  { name:"Park Dale Lane Elementary",lat:33.055,lng:-117.248,rating:9,grades:"K-6",hood:"new-encinitas" },
  { name:"Olivenhain Pioneer",lat:33.055,lng:-117.218,rating:9,grades:"K-6",hood:"olivenhain" },
  { name:"Cardiff Elementary",lat:33.020,lng:-117.275,rating:8,grades:"K-6",hood:"cardiff" },
  { name:"Ada Harris Elementary",lat:33.028,lng:-117.268,rating:7,grades:"K-6",hood:"cardiff" },
  { name:"Diegueno Middle",lat:33.050,lng:-117.252,rating:8,grades:"7-8",hood:"new-encinitas" },
  { name:"Oak Crest Middle",lat:33.060,lng:-117.255,rating:7,grades:"7-8",hood:"new-encinitas" },
  { name:"San Dieguito Academy",lat:33.048,lng:-117.262,rating:9,grades:"9-12",hood:"new-encinitas" },
];

export const METRICS = [
  { id:"med",label:"Median Price",fmt:(n)=>fmtPrice(n),key:"med" },
  { id:"chg",label:"YoY Change",fmt:(n)=>`${n>0?"+":""}${n}%`,key:"chg" },
  { id:"dom",label:"Days on Market",fmt:(n)=>`${n}d`,key:"dom" },
  { id:"score",label:"Compete Score",fmt:(n)=>`${n}/100`,key:"score" },
  { id:"ppsf",label:"$/Sq Ft",fmt:(n)=>`$${n}`,key:"ppsf" },
  { id:"active",label:"Active Listings",fmt:(n)=>`${n}`,key:"active" },
];

export const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
export const fmtPrice = (n) =>
  n >= 1e6 ? `$${(n/1e6).toFixed(n%1e5===0?1:2)}M`
  : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K`
  : `$${fmt(n)}`;

export function calcPayment(principal, annualRate, years=30) {
  const r = annualRate/100/12, n = years*12;
  if (r===0) return principal/n;
  return principal*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
}
