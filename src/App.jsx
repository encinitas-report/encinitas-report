import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Home, MapPin, Clock, DollarSign, BarChart3, ArrowRight, ChevronRight, Menu, X, Building, Minus, Layers, Target, Zap, Eye, Check } from "lucide-react";

// ============================================
// DATA
// ============================================
const ZIP_DATA = {
  "92007": {
    name: "Cardiff-by-the-Sea", short: "Cardiff",
    tagline: "Coastal village charm with premium surf culture",
    medianPrice: 2000000, priceChange: -5.5, avgPricePerSqft: 1542, sqftChange: -3.2,
    daysOnMarket: 56, domChange: 10, activeListings: 18, listingsChange: 12.5,
    homesSold: 27, soldChange: 8.0, avgRent: 5955, rentChange: 4.2,
    population: 11680, medianIncome: 142000, ownerOccupied: 62,
    color: "#635BFF",
    priceHistory: [
      { month: "Mar", price: 2120000 }, { month: "Apr", price: 2085000 }, { month: "May", price: 2150000 },
      { month: "Jun", price: 2200000 }, { month: "Jul", price: 2175000 }, { month: "Aug", price: 2100000 },
      { month: "Sep", price: 2050000 }, { month: "Oct", price: 2100000 }, { month: "Nov", price: 2000000 },
      { month: "Dec", price: 1980000 }, { month: "Jan", price: 2010000 }, { month: "Feb", price: 2000000 },
    ],
    inventoryHistory: [
      { month: "Mar", listings: 14 }, { month: "Apr", listings: 16 }, { month: "May", listings: 19 },
      { month: "Jun", listings: 22 }, { month: "Jul", listings: 21 }, { month: "Aug", listings: 20 },
      { month: "Sep", listings: 18 }, { month: "Oct", listings: 17 }, { month: "Nov", listings: 19 },
      { month: "Dec", listings: 15 }, { month: "Jan", listings: 16 }, { month: "Feb", listings: 18 },
    ],
    domHistory: [
      { month: "Mar", days: 42 }, { month: "Apr", days: 44 }, { month: "May", days: 38 },
      { month: "Jun", days: 35 }, { month: "Jul", days: 40 }, { month: "Aug", days: 48 },
      { month: "Sep", days: 52 }, { month: "Oct", days: 52 }, { month: "Nov", days: 56 },
      { month: "Dec", days: 58 }, { month: "Jan", days: 55 }, { month: "Feb", days: 56 },
    ],
    neighborhoods: [
      { name: "Composer District", medianPrice: 2400000, sqft: 1680, character: "Classic streets named after composers — Mozart, Beethoven, Handel" },
      { name: "Walking District", medianPrice: 2800000, sqft: 1720, character: "Steps to Restaurant Row & Cardiff State Beach" },
      { name: "Birmingham District", medianPrice: 1850000, sqft: 1450, character: "British-named streets, family oriented" },
      { name: "Oceanfront", medianPrice: 4200000, sqft: 2100, character: "Direct beach access, premium ocean views" },
    ],
    recentSales: [
      { address: "2265 Manchester Ave", price: 2199000, sqft: 2232, dom: 43, date: "Dec '25" },
      { address: "835 Cathy Ln", price: 1999990, sqft: 1748, dom: 36, date: "Dec '25" },
      { address: "2386 Newport Ave", price: 3175000, sqft: 1100, dom: 31, date: "Dec '25" },
      { address: "119 Mozart Ave", price: 3465000, sqft: 2229, dom: 59, date: "Nov '25" },
    ],
  },
  "92024": {
    name: "Encinitas / Leucadia", short: "Encinitas",
    tagline: "Eclectic coastal living meets family neighborhoods",
    medianPrice: 1750000, priceChange: -2.8, avgPricePerSqft: 1085, sqftChange: -1.5,
    daysOnMarket: 48, domChange: 6, activeListings: 42, listingsChange: 18.0,
    homesSold: 45, soldChange: 5.0, avgRent: 4200, rentChange: 3.8,
    population: 32500, medianIncome: 128000, ownerOccupied: 58,
    color: "#00A67E",
    priceHistory: [
      { month: "Mar", price: 1800000 }, { month: "Apr", price: 1820000 }, { month: "May", price: 1850000 },
      { month: "Jun", price: 1875000 }, { month: "Jul", price: 1840000 }, { month: "Aug", price: 1810000 },
      { month: "Sep", price: 1790000 }, { month: "Oct", price: 1770000 }, { month: "Nov", price: 1760000 },
      { month: "Dec", price: 1740000 }, { month: "Jan", price: 1745000 }, { month: "Feb", price: 1750000 },
    ],
    inventoryHistory: [
      { month: "Mar", listings: 32 }, { month: "Apr", listings: 35 }, { month: "May", listings: 40 },
      { month: "Jun", listings: 45 }, { month: "Jul", listings: 48 }, { month: "Aug", listings: 44 },
      { month: "Sep", listings: 42 }, { month: "Oct", listings: 38 }, { month: "Nov", listings: 40 },
      { month: "Dec", listings: 35 }, { month: "Jan", listings: 38 }, { month: "Feb", listings: 42 },
    ],
    domHistory: [
      { month: "Mar", days: 38 }, { month: "Apr", days: 40 }, { month: "May", days: 35 },
      { month: "Jun", days: 32 }, { month: "Jul", days: 36 }, { month: "Aug", days: 42 },
      { month: "Sep", days: 45 }, { month: "Oct", days: 46 }, { month: "Nov", days: 48 },
      { month: "Dec", days: 50 }, { month: "Jan", days: 47 }, { month: "Feb", days: 48 },
    ],
    neighborhoods: [
      { name: "Leucadia", medianPrice: 1650000, sqft: 1380, character: "Funky beach town vibes along Hwy 101" },
      { name: "Old Encinitas", medianPrice: 1900000, sqft: 1520, character: "Downtown dining, shops & Moonlight Beach" },
      { name: "Village Park", medianPrice: 1550000, sqft: 1650, character: "Established family neighborhood" },
      { name: "West Encinitas", medianPrice: 2100000, sqft: 1480, character: "Ocean views, beach proximity" },
    ],
    recentSales: [
      { address: "745 Neptune Ave", price: 2350000, sqft: 1820, dom: 28, date: "Dec '25" },
      { address: "1422 Hymettus Ave", price: 1675000, sqft: 1560, dom: 42, date: "Dec '25" },
      { address: "562 Leucadia Blvd", price: 1480000, sqft: 1380, dom: 55, date: "Nov '25" },
      { address: "891 Cornish Dr", price: 1925000, sqft: 2100, dom: 33, date: "Nov '25" },
    ],
  },
  "92009": {
    name: "New Encinitas / La Costa", short: "La Costa",
    tagline: "Master-planned luxury with resort amenities",
    medianPrice: 1580000, priceChange: -1.2, avgPricePerSqft: 785, sqftChange: -0.8,
    daysOnMarket: 42, domChange: 4, activeListings: 55, listingsChange: 22.0,
    homesSold: 58, soldChange: 10.0, avgRent: 3800, rentChange: 3.5,
    population: 38000, medianIncome: 135000, ownerOccupied: 68,
    color: "#FF7A59",
    priceHistory: [
      { month: "Mar", price: 1600000 }, { month: "Apr", price: 1610000 }, { month: "May", price: 1630000 },
      { month: "Jun", price: 1650000 }, { month: "Jul", price: 1640000 }, { month: "Aug", price: 1620000 },
      { month: "Sep", price: 1600000 }, { month: "Oct", price: 1590000 }, { month: "Nov", price: 1585000 },
      { month: "Dec", price: 1575000 }, { month: "Jan", price: 1578000 }, { month: "Feb", price: 1580000 },
    ],
    inventoryHistory: [
      { month: "Mar", listings: 40 }, { month: "Apr", listings: 45 }, { month: "May", listings: 52 },
      { month: "Jun", listings: 58 }, { month: "Jul", listings: 60 }, { month: "Aug", listings: 56 },
      { month: "Sep", listings: 54 }, { month: "Oct", listings: 50 }, { month: "Nov", listings: 52 },
      { month: "Dec", listings: 48 }, { month: "Jan", listings: 50 }, { month: "Feb", listings: 55 },
    ],
    domHistory: [
      { month: "Mar", days: 35 }, { month: "Apr", days: 36 }, { month: "May", days: 32 },
      { month: "Jun", days: 30 }, { month: "Jul", days: 34 }, { month: "Aug", days: 38 },
      { month: "Sep", days: 40 }, { month: "Oct", days: 41 }, { month: "Nov", days: 42 },
      { month: "Dec", days: 44 }, { month: "Jan", days: 43 }, { month: "Feb", days: 42 },
    ],
    neighborhoods: [
      { name: "La Costa Valley", medianPrice: 1450000, sqft: 2200, character: "Family-oriented, top-rated schools" },
      { name: "La Costa Oaks", medianPrice: 1680000, sqft: 2800, character: "Newer builds, resort-style living" },
      { name: "Olivenhain", medianPrice: 2200000, sqft: 3200, character: "Equestrian estates, rural luxury" },
      { name: "Rancho Encinitas", medianPrice: 1350000, sqft: 1850, character: "Established, excellent value" },
    ],
    recentSales: [
      { address: "3142 Levante St", price: 1625000, sqft: 2450, dom: 38, date: "Dec '25" },
      { address: "7580 Circulo Sequoia", price: 1780000, sqft: 2680, dom: 29, date: "Dec '25" },
      { address: "2945 Camino Serbal", price: 1420000, sqft: 2100, dom: 44, date: "Nov '25" },
      { address: "1688 Rancho Encinitas Dr", price: 1550000, sqft: 2350, dom: 35, date: "Nov '25" },
    ],
  },
  "92075": {
    name: "Solana Beach", short: "Solana Beach",
    tagline: "Upscale coastal sophistication with village charm",
    medianPrice: 1950000, priceChange: -3.1, avgPricePerSqft: 1220, sqftChange: -2.0,
    daysOnMarket: 50, domChange: 8, activeListings: 22, listingsChange: 15.0,
    homesSold: 20, soldChange: 5.0, avgRent: 4800, rentChange: 4.0,
    population: 13000, medianIncome: 138000, ownerOccupied: 55,
    color: "#FFB224",
    priceHistory: [
      { month: "Mar", price: 2010000 }, { month: "Apr", price: 2030000 }, { month: "May", price: 2060000 },
      { month: "Jun", price: 2080000 }, { month: "Jul", price: 2050000 }, { month: "Aug", price: 2020000 },
      { month: "Sep", price: 1990000 }, { month: "Oct", price: 1970000 }, { month: "Nov", price: 1960000 },
      { month: "Dec", price: 1950000 }, { month: "Jan", price: 1948000 }, { month: "Feb", price: 1950000 },
    ],
    inventoryHistory: [
      { month: "Mar", listings: 16 }, { month: "Apr", listings: 18 }, { month: "May", listings: 22 },
      { month: "Jun", listings: 25 }, { month: "Jul", listings: 24 }, { month: "Aug", listings: 22 },
      { month: "Sep", listings: 20 }, { month: "Oct", listings: 19 }, { month: "Nov", listings: 21 },
      { month: "Dec", listings: 18 }, { month: "Jan", listings: 20 }, { month: "Feb", listings: 22 },
    ],
    domHistory: [
      { month: "Mar", days: 40 }, { month: "Apr", days: 42 }, { month: "May", days: 36 },
      { month: "Jun", days: 34 }, { month: "Jul", days: 38 }, { month: "Aug", days: 44 },
      { month: "Sep", days: 48 }, { month: "Oct", days: 49 }, { month: "Nov", days: 50 },
      { month: "Dec", days: 52 }, { month: "Jan", days: 51 }, { month: "Feb", days: 50 },
    ],
    neighborhoods: [
      { name: "Del Mar Heights", medianPrice: 2300000, sqft: 1600, character: "Ocean views, premium location" },
      { name: "Lomas Santa Fe", medianPrice: 1800000, sqft: 2100, character: "Country club living" },
      { name: "Cedros District", medianPrice: 1650000, sqft: 1350, character: "Arts, design, walkable village" },
      { name: "Via de la Valle", medianPrice: 2800000, sqft: 3400, character: "Equestrian estates" },
    ],
    recentSales: [
      { address: "418 S Nardo Ave", price: 2150000, sqft: 1680, dom: 45, date: "Dec '25" },
      { address: "765 Stevens Ave", price: 1825000, sqft: 1520, dom: 38, date: "Dec '25" },
      { address: "222 S Cedros Ave", price: 1680000, sqft: 1400, dom: 52, date: "Nov '25" },
      { address: "1033 Lomas Santa Fe Dr", price: 2400000, sqft: 2800, dom: 41, date: "Nov '25" },
    ],
  },
  "92011": {
    name: "South Carlsbad", short: "S. Carlsbad",
    tagline: "Beachfront access meets master-planned living",
    medianPrice: 1320000, priceChange: -0.8, avgPricePerSqft: 720, sqftChange: -0.5,
    daysOnMarket: 38, domChange: 3, activeListings: 48, listingsChange: 20.0,
    homesSold: 52, soldChange: 12.0, avgRent: 3500, rentChange: 3.2,
    population: 28000, medianIncome: 125000, ownerOccupied: 65,
    color: "#0EA5E9",
    priceHistory: [
      { month: "Mar", price: 1330000 }, { month: "Apr", price: 1340000 }, { month: "May", price: 1360000 },
      { month: "Jun", price: 1380000 }, { month: "Jul", price: 1370000 }, { month: "Aug", price: 1350000 },
      { month: "Sep", price: 1340000 }, { month: "Oct", price: 1330000 }, { month: "Nov", price: 1325000 },
      { month: "Dec", price: 1318000 }, { month: "Jan", price: 1320000 }, { month: "Feb", price: 1320000 },
    ],
    inventoryHistory: [
      { month: "Mar", listings: 35 }, { month: "Apr", listings: 38 }, { month: "May", listings: 44 },
      { month: "Jun", listings: 50 }, { month: "Jul", listings: 52 }, { month: "Aug", listings: 48 },
      { month: "Sep", listings: 46 }, { month: "Oct", listings: 42 }, { month: "Nov", listings: 45 },
      { month: "Dec", listings: 40 }, { month: "Jan", listings: 44 }, { month: "Feb", listings: 48 },
    ],
    domHistory: [
      { month: "Mar", days: 32 }, { month: "Apr", days: 33 }, { month: "May", days: 30 },
      { month: "Jun", days: 28 }, { month: "Jul", days: 31 }, { month: "Aug", days: 35 },
      { month: "Sep", days: 36 }, { month: "Oct", days: 37 }, { month: "Nov", days: 38 },
      { month: "Dec", days: 40 }, { month: "Jan", days: 39 }, { month: "Feb", days: 38 },
    ],
    neighborhoods: [
      { name: "Aviara", medianPrice: 1650000, sqft: 2600, character: "Golf resort, luxury amenities" },
      { name: "La Costa", medianPrice: 1280000, sqft: 2100, character: "Spa resort adjacent, families" },
      { name: "Poinsettia", medianPrice: 1150000, sqft: 1800, character: "Newer builds, beach proximity" },
      { name: "South Coastal", medianPrice: 1800000, sqft: 1650, character: "State beach, ocean views" },
    ],
    recentSales: [
      { address: "7142 Aviara Dr", price: 1680000, sqft: 2500, dom: 32, date: "Dec '25" },
      { address: "6835 Batiquitos Dr", price: 1350000, sqft: 2200, dom: 28, date: "Dec '25" },
      { address: "2944 Luciernaga St", price: 1180000, sqft: 1750, dom: 40, date: "Nov '25" },
      { address: "7215 Wisteria Way", price: 1420000, sqft: 2350, dom: 35, date: "Nov '25" },
    ],
  },
};

const ZIP_CODES = Object.keys(ZIP_DATA);
const formatPrice = (p) => p >= 1e6 ? `$${(p/1e6).toFixed(2)}M` : `$${(p/1e3).toFixed(0)}K`;
const formatFull = (p) => `$${p.toLocaleString()}`;

// ============================================
// COMPONENTS
// ============================================
const Trend = ({ value, suffix = "%", inverse = false }) => {
  const pos = inverse ? value < 0 : value > 0;
  return (
    <span className={`trend ${pos ? "trend-pos" : "trend-neg"}`}>
      {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(value)}{suffix}
    </span>
  );
};

const ChartTip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((e, i) => (
        <p key={i} style={{ color: e.color || "#0a2540", fontWeight: 700, fontSize: "14px" }}>
          {formatter ? formatter(e.value) : e.value}
        </p>
      ))}
    </div>
  );
};

// ============================================
// NAV — white bg like Stripe's content pages
// ============================================
const Nav = ({ setSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 60); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const items = ["Market Data", "Compare", "Neighborhoods", "Trends", "Get Report"];
  const ids = ["overview", "compare", "neighborhoods", "trends", "contact"];
  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-inner">
        <span className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>The Encinitas Report</span>
        <div className="nav-links">
          {items.map((l, i) => (
            <button key={l} onClick={() => { document.getElementById(ids[i])?.scrollIntoView({ behavior: "smooth" }); }} className="nav-link">{l}</button>
          ))}
        </div>
        <button className="nav-mobile-toggle" onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="nav-mobile-dropdown">
          {items.map((l, i) => (
            <button key={l} onClick={() => { document.getElementById(ids[i])?.scrollIntoView({ behavior: "smooth" }); setOpen(false); }} className="nav-link nav-link-mobile">{l}</button>
          ))}
        </div>
      )}
    </nav>
  );
};

// ============================================
// HERO — Dark with Stripe gradient sweep
// ============================================
const Hero = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  return (
    <section className="hero">
      <div className="hero-gradient" />
      <div className="hero-gradient-2" />
      <div className="hero-overlay" />
      <div className="hero-fade" />
      <div className={`hero-content ${vis ? "hero-visible" : ""}`}>
        <p className="hero-eyebrow">Live market data · Updated weekly</p>
        <h1 className="hero-title">
          <em>Market intelligence for North County Coastal.</em>
        </h1>
        <p className="hero-sub">
          Real-time data, neighborhood-level insights, and pricing intelligence for 
          Encinitas, Cardiff, Solana Beach, and South Carlsbad.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })}>
            Explore the data <ArrowRight size={16} />
          </button>
          <button className="btn-secondary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Get your property report
          </button>
        </div>
      </div>
      <div className={`hero-stats ${vis ? "hero-visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
        {[
          { label: "Median Price", value: "$1.72M", sub: "Across 5 ZIPs" },
          { label: "Days on Market", value: "47", sub: "+8 days YoY" },
          { label: "Active Listings", value: "185", sub: "+18% YoY" },
          { label: "YoY Change", value: "−2.7%", sub: "Market adjusting" },
        ].map((s, i) => (
          <div key={i} className="hero-stat">
            <p className="hero-stat-label">{s.label}</p>
            <p className="hero-stat-value">{s.value}</p>
            <p className="hero-stat-sub">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// OVERVIEW — Light cards
// ============================================
const Overview = ({ zip, setZip }) => {
  const d = ZIP_DATA[zip];
  const [chart, setChart] = useState("price");
  const chartData = chart === "price" ? d.priceHistory : chart === "inventory" ? d.inventoryHistory : d.domHistory;
  const chartKey = chart === "price" ? "price" : chart === "inventory" ? "listings" : "days";

  return (
    <section id="overview" className="section">
      <div className="container">
        <p className="section-eyebrow" style={{ color: "#635BFF" }}>Market Data</p>
        <h2 className="section-title">Choose your market</h2>
        <div className="zip-pills">
          {ZIP_CODES.map(z => (
            <button key={z} onClick={() => setZip(z)} className={`zip-pill ${zip === z ? "zip-pill-active" : ""}`}>
              {z} · {ZIP_DATA[z].short}
            </button>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: d.color }} />
                <span style={{ fontSize: "13px", fontWeight: 700, color: d.color }}>{zip}</span>
              </div>
              <h3 className="card-title">{d.name}</h3>
              <p className="card-sub">{d.tagline}</p>
            </div>
            <div className="toggle-group">
              {[{ id: "price", l: "Price" }, { id: "inventory", l: "Inventory" }, { id: "dom", l: "DOM" }].map(t => (
                <button key={t.id} onClick={() => setChart(t.id)} className={`toggle-btn ${chart === t.id ? "toggle-active" : ""}`}>{t.l}</button>
              ))}
            </div>
          </div>

          <div className="metrics-row">
            {[
              { l: "Median Price", v: formatPrice(d.medianPrice), c: d.priceChange },
              { l: "$/Sq Ft", v: `$${d.avgPricePerSqft}`, c: d.sqftChange },
              { l: "Days on Market", v: d.daysOnMarket, c: d.domChange, inv: true },
              { l: "Active Listings", v: d.activeListings, c: d.listingsChange },
              { l: "Sold/Month", v: d.homesSold, c: d.soldChange },
              { l: "Avg Rent", v: `$${d.avgRent.toLocaleString()}`, c: d.rentChange },
            ].map((s, i) => (
              <div key={i} className="metric">
                <p className="metric-label">{s.l}</p>
                <p className="metric-value">{s.v}</p>
                <Trend value={s.c} suffix="%" inverse={s.inv} />
              </div>
            ))}
          </div>

          <div style={{ padding: "24px 32px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id={`g-${zip}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.12} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                <XAxis dataKey="month" tick={{ fill: "#8898aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8898aa", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={chart === "price" ? v => `$${(v/1e6).toFixed(1)}M` : undefined} />
                <Tooltip content={<ChartTip formatter={chart === "price" ? formatPrice : v => v} />} />
                <Area type="monotone" dataKey={chartKey} stroke={d.color} strokeWidth={2.5} fill={`url(#g-${zip})`} dot={false} activeDot={{ r: 5, fill: d.color, stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="card" style={{ marginTop: "16px" }}>
          <div style={{ padding: "20px 32px 12px" }}>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0a2540" }}>Recent Sales</h4>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead><tr>{["Address", "Price", "Sq Ft", "$/Sq Ft", "DOM", "Date"].map(h => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>
                {d.recentSales.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: "#0a2540" }}>{s.address}</td>
                    <td style={{ fontWeight: 700, color: d.color }}>{formatFull(s.price)}</td>
                    <td>{s.sqft.toLocaleString()}</td>
                    <td>${Math.round(s.price/s.sqft)}</td>
                    <td style={{ color: s.dom > 50 ? "#e25950" : undefined }}>{s.dom}d</td>
                    <td style={{ color: "#8898aa" }}>{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// COMPARE
// ============================================
const Compare = () => {
  const barData = ZIP_CODES.map(z => ({ name: ZIP_DATA[z].short, price: ZIP_DATA[z].medianPrice, sqft: ZIP_DATA[z].avgPricePerSqft, dom: ZIP_DATA[z].daysOnMarket, inv: ZIP_DATA[z].activeListings, color: ZIP_DATA[z].color }));
  return (
    <section id="compare" className="section section-alt">
      <div className="container">
        <p className="section-eyebrow" style={{ color: "#00A67E" }}>Compare</p>
        <h2 className="section-title">Side-by-side analysis</h2>
        <div className="grid-2">
          {[
            { title: "Median Price", key: "price", fmt: v => `$${(v/1e6).toFixed(1)}M` },
            { title: "Price Per Sq Ft", key: "sqft", fmt: v => `$${v}` },
            { title: "Days on Market", key: "dom", fmt: v => v },
            { title: "Active Listings", key: "inv", fmt: v => v },
          ].map((c, ci) => (
            <div key={ci} className="card" style={{ padding: "24px" }}>
              <h4 className="card-sub" style={{ marginBottom: "16px" }}>{c.title}</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis dataKey="name" tick={{ fill: "#8898aa", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8898aa", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={c.fmt} />
                  <Tooltip content={<ChartTip formatter={c.fmt} />} />
                  <Bar dataKey={c.key} radius={[6, 6, 0, 0]}>{barData.map((e, i) => <rect key={i} fill={e.color} />)}</Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// NEIGHBORHOODS
// ============================================
const Neighborhoods = () => {
  const [zip, setZip] = useState("92007");
  const d = ZIP_DATA[zip];
  return (
    <section id="neighborhoods" className="section">
      <div className="container">
        <p className="section-eyebrow" style={{ color: "#FFB224" }}>Neighborhoods</p>
        <h2 className="section-title">Micro-market breakdown</h2>
        <p className="section-sub">Every neighborhood tells a different story. Drill down beyond the ZIP code.</p>
        <div className="zip-pills" style={{ marginBottom: "32px" }}>
          {ZIP_CODES.map(z => (
            <button key={z} onClick={() => setZip(z)} className={`zip-pill ${zip === z ? "zip-pill-active" : ""}`} style={zip === z ? { background: d.color, color: "#fff", borderColor: d.color } : {}}>
              {ZIP_DATA[z].short}
            </button>
          ))}
        </div>
        <div className="grid-4">
          {d.neighborhoods.map((n, i) => (
            <div key={i} className="card" style={{ padding: "28px" }}>
              <div style={{ width: "40px", height: "3px", borderRadius: "2px", background: d.color, marginBottom: "18px" }} />
              <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#0a2540", marginBottom: "6px" }}>{n.name}</h4>
              <p style={{ fontSize: "13px", color: "#8898aa", marginBottom: "20px", lineHeight: 1.55 }}>{n.character}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <p className="metric-label">Median</p>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#0a2540" }}>{formatPrice(n.medianPrice)}</p>
                </div>
                <div>
                  <p className="metric-label">$/Sq Ft</p>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#0a2540" }}>${Math.round(n.medianPrice / n.sqft)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// TRENDS
// ============================================
const Trends = () => {
  const [metric, setMetric] = useState("price");
  const key = metric === "price" ? "price" : metric === "inventory" ? "listings" : "days";
  const months = ZIP_DATA["92007"].priceHistory.map(d => d.month);
  const overlay = months.map((m, i) => {
    const pt = { month: m };
    ZIP_CODES.forEach(z => {
      const src = metric === "price" ? ZIP_DATA[z].priceHistory : metric === "inventory" ? ZIP_DATA[z].inventoryHistory : ZIP_DATA[z].domHistory;
      pt[z] = src[i][key];
    });
    return pt;
  });
  return (
    <section id="trends" className="section section-alt">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "16px", marginBottom: "36px" }}>
          <div>
            <p className="section-eyebrow" style={{ color: "#FF7A59" }}>Trends</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>12-month overlay</h2>
          </div>
          <div className="toggle-group">
            {[{ id: "price", l: "Price" }, { id: "inventory", l: "Inventory" }, { id: "dom", l: "DOM" }].map(t => (
              <button key={t.id} onClick={() => setMetric(t.id)} className={`toggle-btn ${metric === t.id ? "toggle-active" : ""}`}>{t.l}</button>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: "32px" }}>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={overlay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="month" tick={{ fill: "#8898aa", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#8898aa", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={metric === "price" ? v => `$${(v/1e6).toFixed(1)}M` : undefined} />
              <Tooltip content={<ChartTip formatter={metric === "price" ? formatPrice : v => v} />} />
              {ZIP_CODES.map(z => (
                <Line key={z} type="monotone" dataKey={z} stroke={ZIP_DATA[z].color} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: ZIP_DATA[z].color, stroke: "#fff", strokeWidth: 2 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "24px", marginTop: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            {ZIP_CODES.map(z => (
              <div key={z} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "14px", height: "3px", borderRadius: "2px", background: ZIP_DATA[z].color }} />
                <span style={{ fontSize: "12px", color: "#8898aa" }}>{ZIP_DATA[z].short}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-3" style={{ marginTop: "20px" }}>
          {[
            { tag: "Pricing", color: "#635BFF", title: "Prices Softening Across the Board", body: "All five ZIPs showing YoY declines from -0.8% to -5.5%. Cardiff's premium segment feeling the most pressure." },
            { tag: "Supply", color: "#00A67E", title: "Inventory Rising — Buyers Have Leverage", body: "Active listings up 15-22% YoY. South Carlsbad and La Costa seeing the biggest jumps." },
            { tag: "Demand", color: "#FFB224", title: "Days on Market Stretching", body: "Homes sitting 8-10 days longer than last year. Price it right or prepare to wait." },
          ].map((ins, i) => (
            <div key={i} className="card" style={{ padding: "24px" }}>
              <span className="tag" style={{ color: ins.color, background: `${ins.color}12`, borderColor: `${ins.color}30` }}>{ins.tag}</span>
              <h5 style={{ fontSize: "15px", fontWeight: 700, color: "#0a2540", marginTop: "14px", marginBottom: "8px" }}>{ins.title}</h5>
              <p style={{ fontSize: "14px", color: "#697386", lineHeight: 1.6 }}>{ins.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT
// ============================================
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "", type: "homeowner", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="card" style={{ overflow: "hidden" }}>
          <div className="contact-grid">
            <div className="contact-info">
              <p className="section-eyebrow" style={{ color: "#635BFF" }}>Free Intelligence Report</p>
              <h2 style={{ fontSize: "30px", fontWeight: 700, color: "#0a2540", lineHeight: 1.2, marginBottom: "16px" }}>
                Know exactly where your property stands
              </h2>
              <p style={{ fontSize: "15px", color: "#697386", lineHeight: 1.7, marginBottom: "36px" }}>
                Get a custom analysis with neighborhood-level detail that Zillow can't match.
              </p>
              {[
                { icon: Target, t: "Micro-Neighborhood Analysis" },
                { icon: BarChart3, t: "Adjusted Comparable Sales" },
                { icon: Zap, t: "Optimal Pricing Strategy" },
                { icon: Eye, t: "Local Market Forecast" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                  <div className="feature-icon"><f.icon size={16} /></div>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: "#0a2540", lineHeight: "36px" }}>{f.t}</p>
                </div>
              ))}
            </div>
            <div className="contact-form-wrap">
              {sent ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                  <div className="feature-icon" style={{ width: "56px", height: "56px", borderRadius: "14px", marginBottom: "16px", background: "#e6f9f1", color: "#00A67E" }}><Check size={24} /></div>
                  <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0a2540", marginBottom: "8px" }}>You're on the list</h3>
                  <p style={{ fontSize: "14px", color: "#697386" }}>Your custom report arrives within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0a2540", marginBottom: "24px" }}>Request your report</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input className="input" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    <input className="input" placeholder="Phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    <select className="input" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} style={{ color: form.zip ? "#0a2540" : "#8898aa" }}>
                      <option value="">Your ZIP code</option>
                      {ZIP_CODES.map(z => <option key={z} value={z}>{z} — {ZIP_DATA[z].name}</option>)}
                    </select>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {["homeowner", "buyer", "investor"].map(t => (
                        <button key={t} onClick={() => setForm({...form, type: t})} className={`type-btn ${form.type === t ? "type-btn-active" : ""}`}>{t}</button>
                      ))}
                    </div>
                    <textarea className="input" placeholder="Property address or questions" value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} style={{ resize: "vertical" }} />
                    <button className="btn-primary" onClick={() => setSent(true)} style={{ width: "100%", justifyContent: "center" }}>
                      Get my free report <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => (
  <footer className="footer">
    <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#0a2540", marginBottom: "4px" }}>The Encinitas Report</p>
        <p style={{ fontSize: "12px", color: "#8898aa", lineHeight: 1.6 }}>
          David · HomeSmart Realty West · DRE# [LICENSE]<br />
          Data sources: Redfin, SD County Assessor, CRMLS · Updated weekly
        </p>
      </div>
      <p style={{ fontSize: "11px", color: "#adbdcc" }}>© {new Date().getFullYear()} The Encinitas Report</p>
    </div>
  </footer>
);

// ============================================
// APP
// ============================================
export default function App() {
  const [zip, setZip] = useState("92007");
  return (
    <div className="app">
      <style>{`
        /* ===== RESET & BASE ===== */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        .app { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #425466; -webkit-font-smoothing: antialiased; background: #fff; }
        ::selection { background: rgba(99,91,255,0.15); }

        /* ===== NAV ===== */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; transition: all 0.3s; background: transparent; }
        .nav-scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #e3e8ee; }
        .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .nav-brand { font-size: 16px; font-weight: 700; color: #fff; cursor: pointer; letter-spacing: -0.02em; transition: color 0.3s; }
        .nav-scrolled .nav-brand { color: #0a2540; }
        .nav-links { display: flex; gap: 4px; }
        .nav-link { padding: 6px 14px; border-radius: 6px; border: none; background: none; cursor: pointer; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.65); transition: all 0.2s; font-family: inherit; }
        .nav-scrolled .nav-link { color: #425466; }
        .nav-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .nav-scrolled .nav-link:hover { color: #0a2540; background: #f6f9fc; }
        .nav-mobile-toggle { display: none; background: none; border: none; color: #fff; cursor: pointer; padding: 8px; }
        .nav-scrolled .nav-mobile-toggle { color: #0a2540; }
        .nav-mobile-dropdown { padding: 8px 32px 16px; background: #fff; border-top: 1px solid #e3e8ee; }
        .nav-link-mobile { display: block; width: 100%; text-align: left; padding: 12px 14px; color: #425466 !important; }
        @media(max-width: 768px) {
          .nav-links { display: none; }
          .nav-mobile-toggle { display: block; }
        }
        @media(min-width: 769px) { .nav-mobile-dropdown { display: none; } }

        /* ===== HERO ===== */
        .hero { position: relative; min-height: 100vh; background: #0a2540; overflow: hidden; }
        .hero-gradient {
          position: absolute; top: -20%; right: -10%; width: 75%; height: 140%;
          background: conic-gradient(from 220deg at 65% 45%, #ff6900, #ff4f00 30deg, #ff2d6f 60deg, #e8368f 90deg, #d946ba 120deg, #a855f7 150deg, #635BFF 200deg, #3b82f6 260deg, #06b6d4 310deg, #ff6900 360deg);
          filter: blur(50px) saturate(1.4); opacity: 0.85;
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          transform: rotate(-12deg);
          animation: morphBlob 25s ease-in-out infinite alternate;
        }
        .hero-gradient-2 {
          position: absolute; top: 5%; right: -5%; width: 50%; height: 75%;
          background: linear-gradient(135deg, #ff6900, #ff2d6f, #d946ba, #a855f7);
          filter: blur(35px) saturate(1.6); opacity: 0.55;
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          transform: rotate(-5deg);
          animation: morphBlob2 20s ease-in-out infinite alternate;
        }
        @keyframes morphBlob {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(-12deg) scale(1); }
          50% { border-radius: 50% 50% 30% 70% / 40% 60% 40% 60%; transform: rotate(-8deg) scale(1.04); }
          100% { border-radius: 40% 60% 60% 40% / 50% 40% 60% 50%; transform: rotate(-16deg) scale(0.98); }
        }
        @keyframes morphBlob2 {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: rotate(-5deg); }
          100% { border-radius: 40% 60% 70% 30% / 40% 60% 30% 70%; transform: rotate(-15deg); }
        }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, #0a2540 0%, #0a2540 30%, transparent 65%); }
        .hero-fade { position: absolute; bottom: 0; left: 0; right: 0; height: 120px; background: linear-gradient(to bottom, transparent, #fff); }
        .hero-content { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 160px 32px 0; max-width: 560px; margin-left: max(32px, calc((100% - 1200px) / 2 + 32px)); opacity: 0; transform: translateY(20px); transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-visible { opacity: 1 !important; transform: translateY(0) !important; }
        .hero-eyebrow { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.45); margin-bottom: 20px; }
        .hero-title { font-size: clamp(36px, 5.5vw, 68px); font-weight: 700; color: #fff; line-height: 1.08; letter-spacing: -0.04em; margin-bottom: 24px; }
        .hero-title em { font-style: italic; }
        .hero-sub { font-size: clamp(15px, 1.6vw, 19px); color: rgba(255,255,255,0.55); line-height: 1.65; margin-bottom: 36px; }
        .hero-buttons { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-stats { position: relative; z-index: 10; max-width: 1200px; margin: 0 auto; padding: 80px 32px 100px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1px; background: rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; opacity: 0; transform: translateY(20px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
        .hero-stat { padding: 28px 24px; background: rgba(10,37,64,0.65); backdrop-filter: blur(12px); }
        .hero-stat-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.3); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px; }
        .hero-stat-value { font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -0.03em; margin-bottom: 4px; }
        .hero-stat-sub { font-size: 13px; color: rgba(255,255,255,0.35); }

        /* ===== BUTTONS ===== */
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 999px; border: none; background: #635BFF; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; box-shadow: 0 2px 8px rgba(99,91,255,0.25); }
        .btn-primary:hover { background: #5851ea; box-shadow: 0 4px 16px rgba(99,91,255,0.35); }
        .btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 999px; background: transparent; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; border: 1px solid rgba(255,255,255,0.25); transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); }

        /* ===== LAYOUT ===== */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
        .section { padding: 80px 0; }
        .section-alt { background: #f6f9fc; }
        .section-eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; margin-bottom: 10px; }
        .section-title { font-size: clamp(26px, 3.5vw, 42px); font-weight: 700; color: #0a2540; letter-spacing: -0.03em; margin-bottom: 40px; }
        .section-sub { font-size: 16px; color: #697386; margin-bottom: 32px; max-width: 480px; line-height: 1.6; margin-top: -28px; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }

        /* ===== CARDS ===== */
        .card { background: #fff; border: 1px solid #e3e8ee; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03); }
        .card-header { padding: 28px 32px 20px; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
        .card-title { font-size: 26px; font-weight: 700; color: #0a2540; letter-spacing: -0.02em; margin-bottom: 4px; }
        .card-sub { font-size: 14px; color: #8898aa; }

        /* ===== METRICS ===== */
        .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); border-bottom: 1px solid #e9ecef; }
        .metric { padding: 16px 20px; border-right: 1px solid #f0f3f7; }
        .metric-label { font-size: 10px; font-weight: 600; color: #8898aa; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px; }
        .metric-value { font-size: 22px; font-weight: 800; color: #0a2540; letter-spacing: -0.02em; margin-bottom: 4px; }

        /* ===== TREND BADGES ===== */
        .trend { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .trend-pos { background: #e6f9f1; color: #00875a; }
        .trend-neg { background: #fef0f0; color: #e25950; }

        /* ===== TOGGLES ===== */
        .toggle-group { display: flex; gap: 2px; background: #f6f9fc; border-radius: 8px; padding: 3px; border: 1px solid #e3e8ee; }
        .toggle-btn { padding: 7px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; background: transparent; color: #8898aa; transition: all 0.2s; font-family: inherit; }
        .toggle-active { background: #fff; color: #0a2540; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

        /* ===== ZIP PILLS ===== */
        .zip-pills { display: flex; gap: 8px; margin-bottom: 36px; flex-wrap: wrap; }
        .zip-pill { padding: 9px 18px; border-radius: 999px; border: 1px solid #e3e8ee; background: #fff; cursor: pointer; font-size: 13px; font-weight: 600; color: #697386; transition: all 0.2s; font-family: inherit; }
        .zip-pill:hover { border-color: #c1c9d2; color: #0a2540; }
        .zip-pill-active { background: #0a2540; color: #fff; border-color: #0a2540; }

        /* ===== TABLE ===== */
        .table { width: 100%; border-collapse: collapse; }
        .table th { padding: 10px 24px; text-align: left; font-size: 10px; font-weight: 600; color: #8898aa; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #e9ecef; }
        .table td { padding: 14px 24px; font-size: 14px; color: #697386; border-bottom: 1px solid #f0f3f7; }

        /* ===== TOOLTIP ===== */
        .chart-tooltip { background: #fff; border: 1px solid #e3e8ee; border-radius: 8px; padding: 10px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .chart-tooltip-label { font-size: 11px; color: #8898aa; margin-bottom: 4px; }

        /* ===== TAGS ===== */
        .tag { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; border: 1px solid; }

        /* ===== CONTACT ===== */
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; }
        @media(max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
        .contact-info { padding: 48px 40px; border-right: 1px solid #e9ecef; }
        @media(max-width: 768px) { .contact-info { border-right: none; border-bottom: 1px solid #e9ecef; } }
        .contact-form-wrap { padding: 48px 40px; }
        .input { padding: 12px 16px; border-radius: 8px; width: 100%; border: 1px solid #e3e8ee; background: #fff; color: #0a2540; font-size: 14px; outline: none; transition: border-color 0.2s; font-family: inherit; }
        .input:focus { border-color: #635BFF; box-shadow: 0 0 0 3px rgba(99,91,255,0.1); }
        .input::placeholder { color: #8898aa; }
        select.input option { background: #fff; color: #0a2540; }
        .type-btn { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; text-transform: capitalize; transition: all 0.2s; font-family: inherit; background: #f6f9fc; color: #697386; border: 1px solid #e3e8ee; }
        .type-btn-active { background: #eff0ff; color: #635BFF; border-color: #c7c4ff; }
        .feature-icon { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; background: #eff0ff; color: #635BFF; display: flex; align-items: center; justify-content: center; }

        /* ===== FOOTER ===== */
        .footer { padding: 40px 0; border-top: 1px solid #e3e8ee; }

        /* ===== SCROLLBAR ===== */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d0d5dd; border-radius: 3px; }
      `}</style>

      <Nav />
      <Hero />
      <Overview zip={zip} setZip={setZip} />
      <Compare />
      <Neighborhoods />
      <Trends />
      <Contact />
      <Footer />
    </div>
  );
}
