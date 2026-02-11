/* ══════════════════════════════════════════════════════════════
   ENCINITAS INTELLIGENCE DATA — VERIFIED PUBLIC DATA
   Last Updated: February 2026
   
   Sources: SANDAG, GreatSchools, City of Encinitas, FEMA, Chalet
   ⚠️ ALL DATA IS REAL AND SOURCED. No fabricated data.
   ══════════════════════════════════════════════════════════════ */

// ── 1. SHORT-TERM RENTAL REGULATIONS & MARKET DATA ──
export const STR_PERMITS = [];

export const STR_STATS = {
  totalPermitted: 478,
  activeListings: 918,
  capCitywide: 2.5,
  capCoastal: 4.0,
  maxPermitsCitywide: 665,
  avgDailyRate: 370,
  avgAnnualRevenue: 64832,
  totRate: 10,
  minStayNonHosted: 3,
  proximityRestriction: 200,
  permitFee: 425,
  businessRegFee: 39,
  prohibitedInADUs: true,
  seaBluffsExempt: true,
  topGuestOrigins: [
    { city: "Los Angeles, CA", pct: 21.55 },
    { city: "San Diego, CA", pct: 5.05 },
    { city: "New York, NY", pct: 4.12 },
  ],
  dataSource: "City of Encinitas (Apr 2022 count), Chalet.com (Oct 2024 market data)",
};

// ── 2. DEVELOPMENT PROJECTS ──
export const SB9_PROJECTS = [
  { addr: "774 Melba Rd", hood: "old-encinitas", type: "Attached ADU", status: "Approved", caseNo: "CDPNF-006513-2023", date: "Oct 7, 2025" },
  { addr: "1314 Hymettus Ave", hood: "leucadia", type: "Attached ADU", status: "Approved", caseNo: "CDPNF-007906-2025", date: "Oct 13, 2025" },
  { addr: "862 Passiflora Ave", hood: "new-encinitas", type: "Attached ADU", status: "Approved", caseNo: "CDPNF-008393-2025", date: "Oct 16, 2025" },
  { addr: "817 Woodley Pl", hood: "new-encinitas", type: "Detached ADU", status: "Under Review", caseNo: "CDPNF-007980-2025", date: null },
  { addr: "2137 Cambridge Ave", hood: "cardiff", type: "Attached ADU", status: "Under Review", caseNo: "CDPNF-007964-2025", date: null },
  { addr: "216 Neptune Ave", hood: "leucadia", type: "SFR", status: "Continued", caseNo: "MULTI-007176-2024", date: "Nov 2025 hearing" },
  { addr: "2215 Edinburg Ave", hood: "cardiff", type: "Two-Unit Duplex", status: "Approved", caseNo: "MULTI-006456-2023", date: "2025" },
  { addr: "2180 Edinburg Ave", hood: "cardiff", type: "New SFR + Lot Consolidation", status: "Approved", caseNo: "MULTI-007697-2024", date: "2025" },
  { addr: "211 Neptune Ave", hood: "leucadia", type: "Residences + ADUs", status: "Under Review", caseNo: "MULTI-8280-2025", date: null },
  { addr: "501 Ocean Bluff Way", hood: "leucadia", type: "Residential Project", status: "EIR Phase", caseNo: "MULTI-006443-2023", date: null },
];

// ── 3. FORECLOSURE / PRE-FORECLOSURE ──
export const FORECLOSURE_DATA = {
  status: "requires-subscription",
  service: "PropertyRadar",
  description: "Foreclosure data (NODs, NTS, REO) requires paid service. Free trial available (5 days).",
};

// ── 4. FLOOD ZONE DATA ──
export const FLOOD_DATA = {
  byHood: {
    leucadia: {
      zone: "X (Minimal)",
      risk: "Low",
      keyAreas: "Small area near Batiquitos Lagoon in AE zone",
      insurance: "Not required in Zone X",
    },
    "old-encinitas": {
      zone: "X (Minimal)",
      risk: "Low",
      keyAreas: "Primary risk is coastal bluff erosion, not riverine flooding. Moonlight Beach vulnerable to sea level rise.",
      insurance: "Not required in Zone X",
    },
    "new-encinitas": {
      zone: "X with AE along Cottonwood Creek",
      risk: "Low-Moderate",
      keyAreas: "Cottonwood Creek corridor carries AE (100-year flood) designation. City CIP drainage project planned.",
      insurance: "Required in AE zone along Cottonwood Creek",
    },
    olivenhain: {
      zone: "X with A zones along Escondido Creek",
      risk: "Low-Moderate",
      keyAreas: "Escondido Creek and tributaries. Wohlford Dam and Dixon Reservoir Dam failure risk rated low.",
      insurance: "Required in A/AE zones along creek systems",
    },
    cardiff: {
      zone: "X with significant AE along San Elijo Lagoon",
      risk: "Moderate (highest in city)",
      keyAreas: "San Elijo Lagoon/creek system, Restaurant Row, Manchester Ave. Dam inundation path threatens major arterials and city infrastructure.",
      insurance: "Required in AE zone near lagoon",
    },
  },
  dataSource: "FEMA NFHL, City of Encinitas Hazard Mitigation Plan",
};

// ── 5. CRIME STATS ──
export const CRIME_DATA = {
  period: "Calendar Year 2024",
  population: 61254,
  trends: {
    overallGroupA: { change1yr: -5, change3yr: -13 },
    personsOffenses: { change1yr: 22, change3yr: 0, note: "+22% vs 2023 but flat vs 2021" },
    propertyOffenses: { change1yr: -12, change3yr: -23 },
    societyOffenses: { change1yr: -6, change3yr: -11 },
  },
  personsDetail: {
    aggravatedAssault: 118,
    simpleAssault: 319,
    intimidation: 24,
    sexOffenses: 18,
    kidnapping: 4,
    murder: 1,
  },
  propertyDetail: {
    larcenyTheft: 465,
    shoplifting: 170,
    fraud: 165,
  },
  societyDetail: {
    drugNarcotic: 289,
    drugEquipment: 232,
  },
  context: "Encinitas remains one of the safer cities in SD County. Property crimes down significantly. SD region violent crime rate: 4.3/1,000 (among lowest major US cities).",
  dataSource: "SANDAG 2024 Bulletin, North Coast Current (Aug 2025)",
};

// ── 6. SCHOOL DATA ──
export const SCHOOL_DATA = {
  districtRanking: "EUSD ranked #230 of 11,687 nationally, #24 of 699 in CA",
  elementary: [
    { name: "Olivenhain Pioneer", gs: 8, niche: "A", students: 549, math: 76, read: 76, hood: "olivenhain", note: "Top 5% math & reading in CA" },
    { name: "El Camino Creek", gs: 8, niche: "A", students: 420, math: 80, read: 80, hood: "new-encinitas", note: "Highest test scores in EUSD" },
    { name: "Ada W. Harris", gs: 8, niche: "A", students: 368, math: 71, read: 73, hood: "cardiff", note: "Gifted & Talented. Grades 3-6." },
    { name: "Capri Elementary", gs: 8, niche: "A", students: 638, math: 62, read: 67, hood: "new-encinitas", note: "Largest EUSD school." },
    { name: "Flora Vista", gs: null, niche: "A", students: 383, math: 65, read: 72, hood: "new-encinitas", note: "CA Distinguished School 4x. Top 10% in CA." },
    { name: "Park Dale Lane", gs: null, niche: "A", students: 434, math: null, read: null, hood: "new-encinitas", note: "National Blue Ribbon." },
    { name: "Paul Ecke-Central", gs: 7, niche: "A", students: 583, math: 55, read: 63, hood: "leucadia", note: "Dual language immersion (Spanish)." },
    { name: "Ocean Knoll", gs: null, niche: null, students: 558, math: null, read: null, hood: "new-encinitas", note: "IB World School." },
    { name: "Cardiff Elementary", gs: null, niche: "A", students: null, math: null, read: null, hood: "cardiff", note: "K-3. Feeds into Ada W. Harris." },
  ],
  secondary: [
    { name: "San Dieguito Academy", gs: 10, type: "High", note: "Top-rated in region" },
    { name: "La Costa Canyon High", gs: 9, type: "High", note: "National Blue Ribbon. IB." },
    { name: "Oak Crest Middle", gs: 8, type: "Middle" },
    { name: "Diegueno Middle", gs: null, type: "Middle" },
  ],
  byHood: {
    leucadia: "Paul Ecke-Central (GS 7) → Diegueno → La Costa Canyon (GS 9)",
    "old-encinitas": "Paul Ecke-Central / Flora Vista → Diegueno → San Dieguito Academy (GS 10)",
    "new-encinitas": "Flora Vista / Park Dale / Capri / Ocean Knoll → Diegueno / Oak Crest → LCC / SDA",
    olivenhain: "Olivenhain Pioneer (GS 8) → Diegueno → La Costa Canyon (GS 9)",
    cardiff: "Cardiff Elem → Ada W. Harris (GS 8) → Earl Warren → San Dieguito Academy (GS 10)",
  },
  dataSource: "GreatSchools.org, Niche.com, Homes.com, SchoolDigger (2024-2025)",
};

// ── 7. INFRASTRUCTURE ──
export const INFRASTRUCTURE = [
  { name: "Leucadia Streetscape Phase 2", status: "In Progress", impact: "Leucadia", desc: "Roundabouts, protected bike lanes, wider sidewalks along N Coast Hwy 101" },
  { name: "Rail Quiet Zone", status: "Planned", impact: "Leucadia, Old Encinitas, Cardiff", desc: "Grade crossing improvements to eliminate routine train horn sounding" },
  { name: "Cottonwood Creek Drainage", status: "CIP", impact: "New Encinitas", desc: "Flood control improvements along Cottonwood Creek corridor" },
  { name: "Cardiff Pedestrian Crossings", status: "Planned", impact: "Cardiff", desc: "New pedestrian crossings and safety improvements" },
];

// ── 8. ROAD CONDITIONS ──
export const ROAD_DATA = {
  status: "not-available",
  description: "Road PCI scores require City engineering reports. Not publicly available.",
};

// ── 9. ZONING ──
export const ZONING_DATA = {
  byHood: {
    leucadia: { primary: "R-3/R-8", coastal: true, overlay: "North 101 Specific Plan, Scenic/Visual Corridor", strEligible: true },
    "old-encinitas": { primary: "R-3/R-8/DT-SP", coastal: true, overlay: "Downtown Specific Plan, Scenic/Visual Corridor", strEligible: true },
    "new-encinitas": { primary: "R-3/R-5/R-8", coastal: false, overlay: "Encinitas Ranch Specific Plan", strEligible: true },
    olivenhain: { primary: "RR-1/RR-2", coastal: false, overlay: "Rural Overlay, Special Study Area", strEligible: true },
    cardiff: { primary: "R-3/R-8", coastal: true, overlay: "Cardiff Specific Plan", strEligible: true },
  },
  dataSource: "City of Encinitas Municipal Code, E-Zoning Map (ArcGIS)",
};

// ── 10. PROPERTY TAX / ASSESSOR ──
export const TAX_DATA = {
  status: "requires-subscription",
  service: "PropertyRadar ($119/mo) or ParcelQuest",
  freeOption: "SD County Assessor: 25 free lookups per 30 days via ParcelQuest",
  prop13Note: "CA Prop 13 caps assessed value increases at 2%/yr.",
};

// ── 11. OWNER INSIGHTS ──
export const OWNER_INSIGHTS = {
  status: "requires-subscription",
  service: "PropertyRadar ($119/mo)",
  description: "Owner tenure, absentee owners, equity estimates require paid service.",
};

// ── 12. NEIGHBORHOOD INTEL SUMMARY ──
export const HOOD_INTEL = {
  leucadia: {
    signal: "Active Development",
    narrative: "Multiple ADU/SB 9 projects in pipeline (Neptune Ave corridor). Streetscape Phase 2 improving walkability along Hwy 101. STR-heavy (coastal 4% cap). Paul Ecke-Central offers dual language immersion. Rail quiet zone coming.",
    keyFacts: ["4% STR coastal cap", "Streetscape Phase 2 underway", "GS 7 elementary / GS 9 high school", "Low flood risk (Zone X)"],
  },
  "old-encinitas": {
    signal: "Stable Premium",
    narrative: "Downtown Specific Plan allows highest density in city. Strong walkability. Coastal bluff erosion is primary hazard. Access to San Dieguito Academy (GS 10 — top-rated high school in region).",
    keyFacts: ["Downtown SP density", "GS 10 high school access", "Coastal bluff erosion risk", "Zone X flood (minimal)"],
  },
  "new-encinitas": {
    signal: "Family Value Play",
    narrative: "Most school choice — 4+ elementary options including El Camino Creek (80% math/reading, highest in EUSD). Cottonwood Creek flood zone is main risk but CIP drainage project planned. Park Dale Lane is National Blue Ribbon.",
    keyFacts: ["El Camino Creek: 80% proficiency", "Cottonwood Creek AE flood zone", "National Blue Ribbon school", "CIP drainage project planned"],
  },
  olivenhain: {
    signal: "Trophy Rural",
    narrative: "Olivenhain Pioneer ranks top 5% statewide (76% proficiency). Equestrian lifestyle, multi-acre lots. Escondido Creek flood zones through some properties. Rural Overlay limits density.",
    keyFacts: ["GS 8, top 5% statewide", "RR-1/RR-2 zoning", "Escondido Creek flood zones", "Equestrian community"],
  },
  cardiff: {
    signal: "Watch: Highest Flood Exposure",
    narrative: "Highest flood risk in Encinitas — significant AE zone along San Elijo Lagoon affecting Restaurant Row, Manchester Ave, and critical infrastructure. Ada W. Harris (GS 8) has Gifted & Talented. Feeds into SDA (GS 10).",
    keyFacts: ["Highest flood exposure (San Elijo Lagoon)", "GS 8 elementary / GS 10 high school", "Restaurant Row flood risk", "Dam inundation path"],
  },
};

// ── DATA SOURCES REGISTRY ──
export const DATA_SOURCES = [
  { name: "STR Regulations", source: "City of Encinitas", freq: "As updated", status: "live", cost: "Free" },
  { name: "Development Notices", source: "City Dev Services", freq: "As filed", status: "live", cost: "Free" },
  { name: "Building Permits", source: "City of Encinitas", freq: "Weekly", status: "live", cost: "Free" },
  { name: "Flood Zones", source: "FEMA NFHL", freq: "As updated", status: "live", cost: "Free" },
  { name: "Crime Stats", source: "SANDAG", freq: "Annual", status: "live", cost: "Free" },
  { name: "School Ratings", source: "GreatSchools", freq: "Annual", status: "live", cost: "Free" },
  { name: "Zoning", source: "City E-Zoning Map", freq: "Continuous", status: "live", cost: "Free" },
  { name: "Infrastructure", source: "City CIP", freq: "As approved", status: "partial", cost: "Free" },
  { name: "Foreclosures", source: "PropertyRadar", freq: "Daily", status: "requires-subscription", cost: "$119/mo" },
  { name: "Tax/Assessor", source: "PropertyRadar", freq: "Annual roll", status: "requires-subscription", cost: "$119/mo" },
  { name: "Owner Insights", source: "PropertyRadar", freq: "Daily", status: "requires-subscription", cost: "$119/mo" },
  { name: "Road Conditions", source: "City Engineering", freq: "Biennial", status: "not-available", cost: "N/A" },
];
