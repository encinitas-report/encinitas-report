import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import { T } from "../theme";
import { NEIGHBORHOODS, RECENT_SALES, SCHOOLS, METRICS, MARKET, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

function getColor(hood, key) {
  const val = hood[key];
  if (key === "chg") return val > 15 ? "#10b981" : val > 5 ? "#86efac" : val > 0 ? "#fde047" : val > -5 ? "#fb923c" : "#ef4444";
  if (key === "dom") return val < 15 ? "#10b981" : val < 25 ? "#86efac" : val < 35 ? "#fde047" : val < 45 ? "#fb923c" : "#ef4444";
  if (key === "score") return val >= 80 ? "#ef4444" : val >= 60 ? "#f59e0b" : val >= 40 ? "#fde047" : "#86efac";
  const all = NEIGHBORHOODS.map(n => n[key]), mn = Math.min(...all), mx = Math.max(...all);
  const pct = mx === mn ? 0.5 : (val - mn) / (mx - mn);
  return `hsl(${(1-pct)*120}, 70%, 45%)`;
}

function getStatusColor(st) {
  return { Active:"#10b981", Pending:"#f59e0b", "Just Listed":"#3b82f6", "Price Cut":"#ef4444" }[st] || "#94a3b8";
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const pts = NEIGHBORHOODS.flatMap(n => n.boundary);
    if (pts.length) map.fitBounds(pts, { padding: [30, 30] });
  }, [map]);
  return null;
}

export default function MapView() {
  const [metric, setMetric] = useState("med");
  const [selected, setSelected] = useState(null);
  const [showSales, setShowSales] = useState(true);
  const [showSchools, setShowSchools] = useState(false);

  const currentMetric = METRICS.find(m => m.id === metric);
  const hood = selected ? NEIGHBORHOODS.find(n => n.id === selected) : null;
  const hoodSales = selected ? RECENT_SALES.filter(s => s.hood === selected) : [];
  const hoodSchools = selected ? SCHOOLS.filter(s => s.hood === selected) : [];

  return (
    <div style={{ height:"calc(100vh - 64px)", display:"flex", position:"relative" }}>

      {/* Left Controls */}
      <div style={{ position:"absolute", top:16, left:16, zIndex:1000, display:"flex", flexDirection:"column", gap:8 }}>
        <div style={{ background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)", borderRadius:14, border:`1px solid ${T.border}`, padding:6, display:"flex", flexDirection:"column", gap:2, boxShadow:T.shadow }}>
          {METRICS.map(m => (
            <button key={m.id} onClick={() => setMetric(m.id)} style={{
              padding:"8px 14px", borderRadius:10, border:"none", cursor:"pointer", fontSize:12,
              fontWeight: metric===m.id ? 700 : 400, textAlign:"left",
              background: metric===m.id ? "#ecfdf5" : "transparent",
              color: metric===m.id ? T.brandDk : T.sec, transition:"all 0.2s",
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
          {[
            { on:showSales, set:()=>setShowSales(!showSales), label:"Sales Pins", c:T.pos },
            { on:showSchools, set:()=>setShowSchools(!showSchools), label:"Schools", c:T.warn },
          ].map(t => (
            <button key={t.label} onClick={t.set} style={{
              background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)", borderRadius:10,
              border:`1px solid ${T.border}`, padding:"8px 14px", cursor:"pointer",
              fontSize:12, color:t.on?T.text:T.muted, fontWeight:600, boxShadow:T.shadow,
              display:"flex", alignItems:"center", gap:6,
            }}>
              <span style={{ width:8, height:8, borderRadius:4, background:t.on?t.c:"#cbd5e1" }}/>
              {t.label} {t.on?"ON":"OFF"}
            </button>
          ))}
        </div>
      </div>

      {/* Rate Ticker */}
      <div style={{
        position:"absolute", top:16, left:"50%", transform:"translateX(-50%)", zIndex:1000,
        background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)", borderRadius:12,
        border:`1px solid ${T.border}`, padding:"8px 20px", boxShadow:T.shadow,
        display:"flex", gap:20, alignItems:"center",
      }}>
        {[RATES.conventional30, RATES.fha30, RATES.va30].map(r => (
          <div key={r.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:9, color:T.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{r.label}</div>
            <div style={{ fontSize:16, fontWeight:900, color:T.text }}>{r.rate}%</div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        position:"absolute", bottom:24, left:16, zIndex:1000,
        background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)", borderRadius:12,
        border:`1px solid ${T.border}`, padding:"10px 16px", boxShadow:T.shadow,
      }}>
        <div style={{ fontSize:10, color:T.label, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>{currentMetric.label}</div>
        {NEIGHBORHOODS.map(n => (
          <div key={n.id} onClick={() => setSelected(selected===n.id?null:n.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"3px 0", cursor:"pointer" }}>
            <div style={{ width:14, height:14, borderRadius:4, background:n.color, opacity:0.8, border:selected===n.id?`2px solid ${T.text}`:"2px solid transparent" }}/>
            <span style={{ fontSize:11, color:selected===n.id?T.text:T.sec, fontWeight:selected===n.id?700:500 }}>{n.name}</span>
            <span style={{ fontSize:11, color:T.text, fontWeight:700, marginLeft:"auto" }}>{currentMetric.fmt(n[metric])}</span>
          </div>
        ))}
      </div>

      {/* MAP */}
      <div style={{ flex:1 }}>
        <MapContainer center={[33.050,-117.265]} zoom={13} style={{ height:"100%", width:"100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
          <FitBounds />
          {NEIGHBORHOODS.map(n => (
            <Polygon key={n.id} positions={n.boundary}
              pathOptions={{
                color: selected===n.id ? T.text : n.color,
                weight: selected===n.id ? 3 : 2,
                fillColor: n.color,
                fillOpacity: selected===n.id ? 0.35 : 0.18,
                dashArray: selected===n.id ? null : "6,4",
              }}
              eventHandlers={{ click:()=>setSelected(selected===n.id?null:n.id) }}
            >
              <Tooltip direction="center" permanent className="custom-tooltip">
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:12, fontWeight:800, color:T.text }}>{n.name}</div>
                  <div style={{ fontSize:14, fontWeight:900, color:n.color }}>{currentMetric.fmt(n[metric])}</div>
                </div>
              </Tooltip>
            </Polygon>
          ))}
          {showSales && RECENT_SALES.map((s,i) => (
            <CircleMarker key={`s${i}`} center={[s.lat,s.lng]} radius={6}
              pathOptions={{ color:getStatusColor(s.st), fillColor:getStatusColor(s.st), fillOpacity:0.85, weight:2 }}>
              <Popup>
                <div style={{ minWidth:200 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.text, marginBottom:4 }}>{s.addr}</div>
                  <div style={{ fontSize:18, fontWeight:900, color:T.chart }}>{fmtPrice(s.price)}</div>
                  <div style={{ fontSize:12, color:T.sec, marginTop:4 }}>{s.bd}bd / {s.ba}ba · {fmt(s.sqft)} sqft · ${s.ppsf}/sqft</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:6, background:`${getStatusColor(s.st)}15`, color:getStatusColor(s.st), fontWeight:700 }}>{s.st}</span>
                    <span style={{ fontSize:11, color:T.muted }}>{s.dom} DOM</span>
                  </div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:6, borderTop:`1px solid ${T.border}`, paddingTop:6 }}>
                    Monthly @ {RATES.conventional30.rate}%: <strong style={{color:T.text}}>${fmt(Math.round(calcPayment(s.price*0.8, RATES.conventional30.rate)))}</strong> (20% dn)
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {showSchools && SCHOOLS.map((s,i) => (
            <CircleMarker key={`sch${i}`} center={[s.lat,s.lng]} radius={8}
              pathOptions={{ color:"#f59e0b", fillColor:"#fbbf24", fillOpacity:0.9, weight:2 }}>
              <Popup>
                <div style={{ minWidth:160 }}>
                  <div style={{ fontSize:13, fontWeight:800, color:T.text }}>{s.name}</div>
                  <div style={{ fontSize:12, color:T.sec, marginTop:2 }}>{s.grades}</div>
                  <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ width:40, height:6, borderRadius:3, background:"#f1f5f9", overflow:"hidden" }}>
                      <div style={{ width:`${s.rating*10}%`, height:"100%", borderRadius:3, background:s.rating>=9?T.pos:s.rating>=7?T.warn:T.neg }}/>
                    </div>
                    <span style={{ fontSize:14, fontWeight:900, color:s.rating>=9?T.pos:s.rating>=7?T.warn:T.neg }}>{s.rating}/10</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* ── SIDEBAR ── */}
      {hood && (
        <div className="map-sidebar" style={{
          width:380, background:T.card, borderLeft:`1px solid ${T.border}`, overflowY:"auto", padding:0,
        }}>
          <div style={{ padding:"24px 24px 20px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <div style={{ width:12, height:12, borderRadius:4, background:hood.color }}/>
                  <span style={{ fontSize:10, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"1px" }}>Neighborhood</span>
                </div>
                <h2 style={{ fontSize:24, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:0 }}>{hood.name}</h2>
                <p style={{ fontSize:13, color:T.sec, marginTop:4 }}>{hood.vibe}</p>
              </div>
              <button onClick={()=>setSelected(null)} style={{
                background:"#f1f5f9", border:"none", borderRadius:8,
                width:32, height:32, cursor:"pointer", color:T.sec, fontSize:16,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>✕</button>
            </div>
          </div>

          {/* Key Stats */}
          <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:36, fontWeight:900, color:T.text, letterSpacing:"-2px" }}>{fmtPrice(hood.med)}</div>
            <span style={{ fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:6, background:hood.chg>0?"#ecfdf5":"#fef2f2", color:hood.chg>0?T.pos:T.neg }}>
              {hood.chg>0?"↑":"↓"} {Math.abs(hood.chg)}% YoY
            </span>
          </div>

          {/* Stats Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"16px 24px", borderBottom:`1px solid ${T.border}` }}>
            {[
              ["DOM",`${hood.dom}d`,hood.dom<20?T.pos:hood.dom<40?T.warn:T.neg],
              ["Compete",`${hood.score}`,hood.score>=70?T.neg:hood.score>=50?T.warn:T.pos],
              ["$/Sqft",`$${hood.ppsf}`,T.chart],
              ["Active",hood.active,T.blue],
              ["Sold 30d",hood.sold30,T.pos],
              ["L/S",`${hood.listToSale}%`,T.warn],
            ].map(([l,v,c]) => (
              <div key={l} style={{ padding:"10px 0", textAlign:"center" }}>
                <div style={{ fontSize:9, color:T.label, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>{l}</div>
                <div style={{ fontSize:18, fontWeight:900, color:c, marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Schools */}
          {hoodSchools.length > 0 && (
            <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontSize:9, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>🏫 Schools</div>
              {hoodSchools.map((s,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0" }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>{s.name}</div>
                    <div style={{ fontSize:10, color:T.muted }}>{s.grades}</div>
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:s.rating>=9?T.pos:s.rating>=7?T.warn:T.neg }}>{s.rating}/10</span>
                </div>
              ))}
            </div>
          )}

          {/* Monthly Payment */}
          <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontSize:9, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>Monthly Payment at Median</div>
            {[
              { ...RATES.conventional30, down:0.20, label:"Conv (20% down)" },
              { ...RATES.fha30, down:0.035, label:"FHA (3.5% down)" },
              { ...RATES.va30, down:0, label:"VA (0% down)" },
            ].map(r => {
              const principal = hood.med*(1-r.down);
              const pmt = calcPayment(principal, r.rate);
              return (
                <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid #f1f5f9` }}>
                  <div>
                    <div style={{ fontSize:12, color:T.text, fontWeight:600 }}>{r.label}</div>
                    <div style={{ fontSize:10, color:T.muted }}>{r.rate}%</div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:T.text }}>${fmt(Math.round(pmt))}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Sales */}
          {hoodSales.length > 0 && (
            <div style={{ padding:"16px 24px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:10 }}>
                Recent Activity ({hoodSales.length})
              </div>
              {hoodSales.map((s,i) => (
                <div key={i} style={{ padding:"12px 0", borderBottom:i<hoodSales.length-1?`1px solid #f1f5f9`:"none" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{s.addr}</div>
                    <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:6, background:`${getStatusColor(s.st)}15`, color:getStatusColor(s.st) }}>{s.st}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    <span style={{ fontSize:15, fontWeight:900, color:T.chart }}>{fmtPrice(s.price)}</span>
                    <span style={{ fontSize:12, color:T.sec }}>{s.bd}/{s.ba} · {fmt(s.sqft)}sf</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{ padding:"16px 24px 24px" }}>
            <button style={{
              width:"100%", padding:"14px", borderRadius:12, border:"none",
              background:T.brand, color:"white", fontSize:14, fontWeight:700, cursor:"pointer",
            }}>Get Custom {hood.name} Report</button>
          </div>
        </div>
      )}
    </div>
  );
}
