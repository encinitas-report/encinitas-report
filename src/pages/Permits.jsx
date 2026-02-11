import { useState, useMemo } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS, fmt, fmtPrice } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

/* ── PERMIT DATA ── */
const PERMIT_TYPES = {
  adu: { label:"ADU / Granny Flat", icon:"🏠", color:"#8b5cf6", signal:"Investment — adding value, likely holding" },
  newcon: { label:"New Construction", icon:"🏗️", color:"#3b82f6", signal:"Development — new inventory incoming" },
  remodel: { label:"Major Remodel", icon:"🔨", color:"#f59e0b", signal:"Investment — owner improving, likely staying" },
  solar: { label:"Solar Installation", icon:"☀️", color:"#10b981", signal:"Long-term hold — 10-20yr payback investment" },
  pool: { label:"Pool / Hardscape", icon:"🏊", color:"#0ea5e9", signal:"Lifestyle investment — settling in" },
  demo: { label:"Demolition", icon:"🏚️", color:"#ef4444", signal:"Redevelopment — possible tear-down rebuild or estate" },
  roof: { label:"Roof Replacement", icon:"🏡", color:"#64748b", signal:"Maintenance or pre-sale prep" },
  electric: { label:"Electrical Upgrade", icon:"⚡", color:"#eab308", signal:"Modernization — EV charger / panel upgrade" },
};

const RECENT_PERMITS = [
  { date:"Feb 7, 2026", addr:"412 Neptune Ave", hood:"leucadia", type:"adu", value:185000, desc:"Detached ADU 650sf, 1bd/1ba", status:"Approved" },
  { date:"Feb 5, 2026", addr:"1033 Hermes Ave", hood:"leucadia", type:"solar", value:32000, desc:"10.2kW rooftop solar array", status:"Approved" },
  { date:"Feb 4, 2026", addr:"225 W D St", hood:"old-encinitas", type:"remodel", value:275000, desc:"Kitchen/bath remodel + ADU conversion", status:"Under Review" },
  { date:"Feb 3, 2026", addr:"3455 Lone Hill Ln", hood:"olivenhain", type:"pool", value:95000, desc:"In-ground pool + outdoor kitchen", status:"Approved" },
  { date:"Jan 31, 2026", addr:"2102 Oxford Ave", hood:"cardiff", type:"roof", value:28000, desc:"Complete roof replacement, tile to comp", status:"Approved" },
  { date:"Jan 30, 2026", addr:"560 Requeza St", hood:"old-encinitas", type:"adu", value:210000, desc:"Attached ADU 800sf, 2bd/1ba above garage", status:"Approved" },
  { date:"Jan 28, 2026", addr:"1745 Gascony Rd", hood:"new-encinitas", type:"electric", value:15000, desc:"200A panel upgrade + EV charger", status:"Approved" },
  { date:"Jan 27, 2026", addr:"802 Saxony Rd", hood:"new-encinitas", type:"solar", value:28000, desc:"8.5kW solar + battery storage", status:"Approved" },
  { date:"Jan 25, 2026", addr:"3020 Via de Caballo", hood:"olivenhain", type:"newcon", value:1850000, desc:"New SFR 4,200sf on 1.2ac lot", status:"Under Review" },
  { date:"Jan 23, 2026", addr:"154 W Jason St", hood:"old-encinitas", type:"remodel", value:180000, desc:"Full interior remodel + seismic retrofit", status:"Approved" },
  { date:"Jan 22, 2026", addr:"2478 Cambridge Ave", hood:"cardiff", type:"demo", value:0, desc:"Full demolition — new build planned", status:"Approved" },
  { date:"Jan 20, 2026", addr:"965 Santa Fe Dr", hood:"old-encinitas", type:"adu", value:165000, desc:"Junior ADU conversion 500sf", status:"Under Review" },
  { date:"Jan 18, 2026", addr:"612 Requeza St", hood:"old-encinitas", type:"solar", value:35000, desc:"12kW solar + Tesla Powerwall", status:"Approved" },
  { date:"Jan 15, 2026", addr:"1890 Sheridan Rd", hood:"new-encinitas", type:"remodel", value:145000, desc:"Primary suite addition 400sf", status:"Approved" },
  { date:"Jan 13, 2026", addr:"3188 Lone Hill Ln", hood:"olivenhain", type:"newcon", value:2200000, desc:"Custom estate 5,400sf on 2.1ac", status:"Under Review" },
  { date:"Jan 10, 2026", addr:"445 A St", hood:"old-encinitas", type:"adu", value:195000, desc:"Detached ADU 720sf with roof deck", status:"Approved" },
  { date:"Jan 8, 2026", addr:"1567 Lake Dr", hood:"cardiff", type:"pool", value:72000, desc:"Lap pool + spa", status:"Approved" },
  { date:"Jan 5, 2026", addr:"2901 Via de Caballo", hood:"olivenhain", type:"electric", value:18000, desc:"Whole-home battery + 400A service", status:"Approved" },
];

/* ── CITY DEVELOPMENT PROJECTS ── */
const DEV_PROJECTS = [
  { name:"Encinitas Boulevard Specific Plan", status:"In Progress", type:"Mixed-Use", units:"380 residential units + 45,000sf retail", timeline:"2024-2028", hood:"new-encinitas",
    desc:"Major corridor redevelopment along Encinitas Blvd from El Camino Real to I-5. Will add significant housing inventory and retail. Impact: increased density, potential short-term construction disruption, long-term property value boost for adjacent homes." },
  { name:"Leucadia Streetscape", status:"Phase 2", type:"Infrastructure", units:"N/A — public improvement", timeline:"2023-2027", hood:"leucadia",
    desc:"$25M+ transformation of N Coast Hwy 101 through Leucadia. Protected bike lanes, roundabouts, pedestrian plazas, undergrounding utilities. Impact: significant walkability improvement, expected 8-15% value lift for properties within 0.25mi." },
  { name:"Pacific View School Site", status:"Planning", type:"Residential", units:"Up to 120 townhomes", timeline:"2025-2029", hood:"old-encinitas",
    desc:"Former school site on 3rd St being redeveloped for housing. Contentious — community divided. Impact: adds inventory in ultra-tight Old Encinitas market, possible pressure on nearby home values during construction." },
  { name:"Cardiff Town Center", status:"Approved", type:"Mixed-Use", units:"60 units + retail/restaurant space", timeline:"2025-2028", hood:"cardiff",
    desc:"Redevelopment of underused commercial parcels along San Elijo Ave. Will add housing + restaurant/retail. Impact: walkability boost, aligns with Restaurant Row identity, net positive for nearby values." },
  { name:"Olivenhain Trails Expansion", status:"In Progress", type:"Parks/Open Space", units:"12 miles new trails", timeline:"2024-2026", hood:"olivenhain",
    desc:"Expanding trail network connecting Olivenhain to Elfin Forest and San Elijo Lagoon. Impact: enhances Olivenhain's equestrian/rural lifestyle brand, positive for property values." },
];

/* ── PERMIT STATS BY HOOD ── */
const HOOD_STATS = [
  { id:"leucadia", permits90d:14, adus:4, solar:3, remodels:3, newcon:0, totalValue:890000 },
  { id:"old-encinitas", permits90d:22, adus:6, solar:4, remodels:5, newcon:1, totalValue:1650000 },
  { id:"new-encinitas", permits90d:18, adus:3, solar:5, remodels:4, newcon:2, totalValue:980000 },
  { id:"olivenhain", permits90d:12, adus:1, solar:2, remodels:2, newcon:3, totalValue:4200000 },
  { id:"cardiff", permits90d:10, adus:2, solar:2, remodels:3, newcon:0, totalValue:720000 },
];

/* ── PERMIT TREND DATA ── */
const PERMIT_TREND = [
  { q:"Q1 '25", total:48, adu:8, newcon:3, solar:12 },
  { q:"Q2 '25", total:62, adu:12, newcon:5, solar:18 },
  { q:"Q3 '25", total:58, adu:14, newcon:4, solar:15 },
  { q:"Q4 '25", total:51, adu:10, newcon:6, solar:11 },
  { q:"Q1 '26", total:42, adu:11, newcon:3, solar:10 },
];

function TrendBar({data, maxVal}) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
      {data.map((d,i) => {
        const h = (d.total / maxVal) * 100;
        return (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.text }}>{d.total}</div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:1, height:`${h}%`, minHeight:8 }}>
              <div style={{ flex:d.adu, background:"#8b5cf6", borderRadius:"4px 4px 0 0", minHeight:2 }}/>
              <div style={{ flex:d.newcon, background:"#3b82f6", minHeight:d.newcon?2:0 }}/>
              <div style={{ flex:d.solar, background:"#10b981", borderRadius:"0 0 4px 4px", minHeight:2 }}/>
              <div style={{ flex:d.total-d.adu-d.newcon-d.solar, background:"#e2e8f0", minHeight:2 }}/>
            </div>
            <div style={{ fontSize:9, color:T.muted }}>{d.q}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function Permits() {
  const [filterHood, setFilterHood] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const filtered = useMemo(() => {
    let list = RECENT_PERMITS;
    if (filterHood !== "all") list = list.filter(p => p.hood === filterHood);
    if (filterType !== "all") list = list.filter(p => p.type === filterType);
    return list;
  }, [filterHood, filterType]);

  const maxTrend = Math.max(...PERMIT_TREND.map(d => d.total));
  const totalPermits90d = HOOD_STATS.reduce((a,b) => a + b.permits90d, 0);
  const totalADUs = HOOD_STATS.reduce((a,b) => a + b.adus, 0);
  const totalNewCon = HOOD_STATS.reduce((a,b) => a + b.newcon, 0);
  const totalValue = HOOD_STATS.reduce((a,b) => a + b.totalValue, 0);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
      <h1 style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:"0 0 6px" }}>Permits & Development</h1>
      <p style={{ fontSize:14, color:T.muted, marginBottom:8 }}>Building permits, ADU filings, and city development projects across Encinitas</p>
      <p style={{ fontSize:12, color:T.muted, marginBottom:24 }}>Source: City of Encinitas Permit Center · San Diego County Assessor</p>

      {/* ── TOP STATS ── */}
      <div className="stats-4col" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[
          ["Permits (90d)", totalPermits90d, "Across all neighborhoods", T.chart],
          ["ADU Filings", totalADUs, "Granny flats & conversions", "#8b5cf6"],
          ["New Construction", totalNewCon, "Ground-up builds", T.blue],
          ["Total Permit Value", `$${(totalValue/1e6).toFixed(1)}M`, "Last 90 days", T.brand],
        ].map(([l,v,s,c]) => (
          <Card key={l} style={{ padding:"20px 24px" }}>
            <Lbl>{l}</Lbl>
            <div style={{ fontSize:36, fontWeight:900, color:c, letterSpacing:"-1.5px", marginTop:6 }}>{v}</div>
            <div style={{ fontSize:12, color:T.sec, marginTop:4 }}>{s}</div>
          </Card>
        ))}
      </div>

      {/* ── TREND + NEIGHBORHOOD GRID ── */}
      <div className="stats-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        {/* Trend */}
        <Card style={{ padding:"24px 28px" }}>
          <Lbl style={{ marginBottom:16 }}>Permit Trend by Quarter</Lbl>
          <TrendBar data={PERMIT_TREND} maxVal={maxTrend}/>
          <div style={{ display:"flex", gap:16, marginTop:12, justifyContent:"center" }}>
            {[["ADU","#8b5cf6"],["New Build","#3b82f6"],["Solar","#10b981"],["Other","#e2e8f0"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:c }}/>
                <span style={{ fontSize:10, color:T.sec }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* By Neighborhood */}
        <Card style={{ padding:"24px 28px" }}>
          <Lbl style={{ marginBottom:16 }}>Permits by Neighborhood (90d)</Lbl>
          {HOOD_STATS.sort((a,b) => b.permits90d - a.permits90d).map(h => {
            const hood = NEIGHBORHOODS.find(n => n.id === h.id);
            const pct = (h.permits90d / Math.max(...HOOD_STATS.map(x => x.permits90d))) * 100;
            return (
              <div key={h.id} style={{ marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:3, background:hood?.color || T.muted }}/>
                    <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{hood?.name || h.id}</span>
                  </div>
                  <div style={{ display:"flex", gap:12, fontSize:12 }}>
                    <span style={{ color:"#8b5cf6", fontWeight:700 }}>{h.adus} ADU</span>
                    <span style={{ color:T.blue, fontWeight:700 }}>{h.newcon} new</span>
                    <span style={{ color:T.text, fontWeight:800 }}>{h.permits90d} total</span>
                  </div>
                </div>
                <div style={{ height:6, borderRadius:3, background:"#f1f5f9", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:hood?.color || T.muted, opacity:0.7 }}/>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* ── WHAT PERMITS SIGNAL ── */}
      <Card style={{ padding:"24px 28px", marginBottom:24, background:"#f0fdf4", border:`1px solid #bbf7d0` }}>
        <Lbl style={{ color:T.brandDk, marginBottom:12 }}>🔍 What Permits Signal for Buyers & Sellers</Lbl>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {Object.entries(PERMIT_TYPES).slice(0,8).map(([k,pt]) => (
            <div key={k} style={{ padding:"10px 14px", borderRadius:10, background:"rgba(255,255,255,0.8)" }}>
              <div style={{ fontSize:14, marginBottom:4 }}>{pt.icon} <span style={{ fontWeight:700, color:pt.color }}>{pt.label}</span></div>
              <div style={{ fontSize:11, color:T.sec, lineHeight:1.4 }}>{pt.signal}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── RECENT PERMITS TABLE ── */}
      <Card style={{ padding:0, overflow:"hidden", marginBottom:32 }}>
        <div style={{ padding:"18px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <Lbl>Recent Building Permits</Lbl>
          <div style={{ display:"flex", gap:8 }}>
            <select value={filterHood} onChange={e=>setFilterHood(e.target.value)} style={{ padding:"6px 12px", borderRadius:8, fontSize:12, border:`1px solid ${T.border}`, background:T.card, color:T.text, fontWeight:600 }}>
              <option value="all">All Neighborhoods</option>
              {NEIGHBORHOODS.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:"6px 12px", borderRadius:8, fontSize:12, border:`1px solid ${T.border}`, background:T.card, color:T.text, fontWeight:600 }}>
              <option value="all">All Types</option>
              {Object.entries(PERMIT_TYPES).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Date","Address","Neighborhood","Type","Value","Description","Status"].map(h =>
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"1px" }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i) => {
                const pt = PERMIT_TYPES[p.type];
                const hood = NEIGHBORHOODS.find(n => n.id === p.hood);
                return (
                  <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"14px 16px", color:T.sec, fontSize:13, whiteSpace:"nowrap" }}>{p.date}</td>
                    <td style={{ padding:"14px 16px", fontWeight:700, color:T.text }}>{p.addr}</td>
                    <td style={{ padding:"14px 16px", color:T.sec }}>{hood?.name}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ fontSize:12, fontWeight:700, padding:"4px 10px", borderRadius:6, background:`${pt.color}12`, color:pt.color }}>{pt.icon} {pt.label}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontWeight:700, color:T.text }}>{p.value > 0 ? `$${fmt(p.value)}` : "—"}</td>
                    <td style={{ padding:"14px 16px", color:T.sec, fontSize:13 }}>{p.desc}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:6, background:p.status==="Approved"?"#ecfdf5":"#fefce8", color:p.status==="Approved"?T.pos:T.warn }}>{p.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 24px", borderTop:`1px solid ${T.border}`, fontSize:11, color:T.muted }}>
          Showing {filtered.length} of {RECENT_PERMITS.length} permits · Data from City of Encinitas Permit Center
        </div>
      </Card>

      {/* ── CITY DEVELOPMENT PROJECTS ── */}
      <h2 style={{ fontSize:22, fontWeight:900, color:T.text, letterSpacing:"-0.5px", margin:"0 0 6px" }}>City Development Projects</h2>
      <p style={{ fontSize:14, color:T.muted, marginBottom:16 }}>Major projects that will impact neighborhood values and livability</p>

      {DEV_PROJECTS.map((p,i) => {
        const hood = NEIGHBORHOODS.find(n => n.id === p.hood);
        const statusColor = p.status==="Approved"?T.pos:p.status==="In Progress"?T.blue:p.status==="Phase 2"?T.warn:"#8b5cf6";
        return (
          <Card key={i} style={{ padding:0, overflow:"hidden", marginBottom:12 }}>
            <div style={{ display:"flex", borderLeft:`4px solid ${hood?.color || T.muted}` }}>
              <div style={{ flex:1, padding:"20px 24px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <h3 style={{ fontSize:16, fontWeight:800, color:T.text, margin:0 }}>{p.name}</h3>
                  <span style={{ fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:6, background:`${statusColor}15`, color:statusColor }}>{p.status}</span>
                </div>
                <div style={{ display:"flex", gap:16, marginBottom:10, fontSize:12 }}>
                  <span style={{ color:T.sec }}><strong style={{color:T.text}}>Type:</strong> {p.type}</span>
                  <span style={{ color:T.sec }}><strong style={{color:T.text}}>Scope:</strong> {p.units}</span>
                  <span style={{ color:T.sec }}><strong style={{color:T.text}}>Timeline:</strong> {p.timeline}</span>
                  <span style={{ color:T.sec }}><strong style={{color:T.text}}>Area:</strong> {hood?.name}</span>
                </div>
                <div style={{ fontSize:13, color:T.sec, lineHeight:1.6 }}>{p.desc}</div>
              </div>
            </div>
          </Card>
        );
      })}

      {/* ── DATA SOURCES ── */}
      <Card style={{ padding:"16px 24px", marginTop:24 }}>
        <div style={{ fontSize:11, color:T.muted, lineHeight:1.6 }}>
          <strong style={{ color:T.sec }}>Data Sources:</strong> City of Encinitas Development Services · San Diego County Assessor (arcc.sdcounty.ca.gov) · 
          CA Building Permit Database · City of Encinitas General Plan & Specific Plans · Permit data refreshed weekly.
          <br/><strong style={{ color:T.sec }}>Note:</strong> Permit data is for informational purposes. Contact the City of Encinitas at (760) 633-2710 for official records.
        </div>
      </Card>
    </div>
  );
}
