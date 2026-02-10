import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import { NEIGHBORHOODS, RECENT_SALES, SCHOOLS, METRICS, MARKET, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

function getColor(hood, metricKey) {
  const val = hood[metricKey];
  if (metricKey === "chg") {
    if (val > 15) return "#22c55e";
    if (val > 5) return "#86efac";
    if (val > 0) return "#fde047";
    if (val > -5) return "#fb923c";
    return "#ef4444";
  }
  if (metricKey === "dom") {
    if (val < 15) return "#22c55e";
    if (val < 25) return "#86efac";
    if (val < 35) return "#fde047";
    if (val < 45) return "#fb923c";
    return "#ef4444";
  }
  if (metricKey === "score") {
    if (val >= 80) return "#ef4444";
    if (val >= 60) return "#fb923c";
    if (val >= 40) return "#fde047";
    return "#86efac";
  }
  const allVals = NEIGHBORHOODS.map(n => n[metricKey]);
  const min = Math.min(...allVals), max = Math.max(...allVals);
  const pct = max === min ? 0.5 : (val - min) / (max - min);
  return `rgb(${Math.round(34+pct*205)},${Math.round(197-pct*150)},${Math.round(94-pct*50)})`;
}

function getStatusColor(st) {
  return { Active:"#22c55e", Pending:"#f59e0b", "Just Listed":"#3b82f6", "Price Cut":"#ef4444" }[st] || "#94a3b8";
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const pts = NEIGHBORHOODS.flatMap(n => n.boundary);
    if (pts.length) map.fitBounds(pts, { padding: [30, 30] });
  }, [map]);
  return null;
}

function MiniTrend({ data, color }) {
  if (!data || data.length < 2) return null;
  const prices = data.map(d => d.p);
  const min = Math.min(...prices) * 0.95, max = Math.max(...prices);
  const w = 160, h = 40;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.p - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h + 16} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d.p - min) / (max - min)) * h;
        return <circle key={i} cx={x} cy={y} r={i === data.length - 1 ? 4 : 2} fill={i === data.length - 1 ? color : "transparent"} stroke={color} strokeWidth="1" />;
      })}
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        return <text key={`l${i}`} x={x} y={h + 12} textAnchor="middle" fontSize="7" fill="#475569">{d.m.replace(" '25","").replace(" '26","")}</text>;
      })}
    </svg>
  );
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
    <div style={{ height: "calc(100vh - 56px)", display: "flex", position: "relative" }}>

      {/* Left Controls */}
      <div style={{ position:"absolute",top:16,left:16,zIndex:1000,display:"flex",flexDirection:"column",gap:8 }}>
        <div style={{ background:"rgba(15,23,42,0.92)",backdropFilter:"blur(20px)",borderRadius:14,border:"1px solid rgba(255,255,255,0.08)",padding:6,display:"flex",flexDirection:"column",gap:2 }}>
          {METRICS.map(m => (
            <button key={m.id} onClick={() => setMetric(m.id)} style={{
              padding:"8px 14px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,
              fontWeight:metric===m.id?700:400,textAlign:"left",
              background:metric===m.id?"rgba(99,102,241,0.2)":"transparent",
              color:metric===m.id?"#a5b4fc":"#94a3b8",transition:"all 0.2s",
            }}>{m.label}</button>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
          {[
            { on: showSales, set: () => setShowSales(!showSales), label: "Sales Pins", c: "#22c55e" },
            { on: showSchools, set: () => setShowSchools(!showSchools), label: "Schools", c: "#f59e0b" },
          ].map(t => (
            <button key={t.label} onClick={t.set} style={{
              background:"rgba(15,23,42,0.92)",backdropFilter:"blur(20px)",borderRadius:10,
              border:"1px solid rgba(255,255,255,0.08)",padding:"8px 14px",cursor:"pointer",
              fontSize:12,color:t.on?"#a5b4fc":"#64748b",fontWeight:600,
              display:"flex",alignItems:"center",gap:6,
            }}>
              <span style={{ width:8,height:8,borderRadius:4,background:t.on?t.c:"#475569" }} />
              {t.label} {t.on?"ON":"OFF"}
            </button>
          ))}
        </div>
      </div>

      {/* Rate Ticker */}
      <div style={{
        position:"absolute",top:16,left:"50%",transform:"translateX(-50%)",zIndex:1000,
        background:"rgba(15,23,42,0.92)",backdropFilter:"blur(20px)",borderRadius:12,
        border:"1px solid rgba(255,255,255,0.08)",padding:"8px 20px",
        display:"flex",gap:20,alignItems:"center",
      }}>
        {[RATES.conventional30, RATES.fha30, RATES.va30].map(r => (
          <div key={r.label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:9,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px" }}>{r.label}</div>
            <div style={{ fontSize:16,fontWeight:900,color:"#f1f5f9",letterSpacing:"-0.5px" }}>{r.rate}%</div>
          </div>
        ))}
        <div style={{ fontSize:9,color:"#475569",maxWidth:60,lineHeight:1.2 }}>{RATES.updated}</div>
      </div>

      {/* Legend */}
      <div style={{
        position:"absolute",bottom:24,left:16,zIndex:1000,
        background:"rgba(15,23,42,0.92)",backdropFilter:"blur(20px)",borderRadius:12,
        border:"1px solid rgba(255,255,255,0.08)",padding:"10px 16px",
      }}>
        <div style={{ fontSize:10,color:"#64748b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6 }}>{currentMetric.label}</div>
        {NEIGHBORHOODS.map(n => (
          <div key={n.id} onClick={() => setSelected(selected===n.id?null:n.id)} style={{ display:"flex",alignItems:"center",gap:8,padding:"3px 0",cursor:"pointer",borderRadius:4 }}>
            <div style={{ width:14,height:14,borderRadius:4,background:getColor(n,metric),opacity:0.8,border:selected===n.id?"2px solid #f1f5f9":"2px solid transparent" }} />
            <span style={{ fontSize:11,color:selected===n.id?"#f1f5f9":"#cbd5e1",fontWeight:selected===n.id?700:500 }}>{n.name}</span>
            <span style={{ fontSize:11,color:"#94a3b8",fontWeight:700,marginLeft:"auto" }}>{currentMetric.fmt(n[metric])}</span>
          </div>
        ))}
      </div>

      {/* MAP */}
      <div style={{ flex:1 }}>
        <MapContainer center={[33.050,-117.265]} zoom={13} style={{ height:"100%",width:"100%" }} zoomControl={false}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
          <FitBounds />
          {NEIGHBORHOODS.map(n => (
            <Polygon key={n.id} positions={n.boundary}
              pathOptions={{
                color:selected===n.id?"#f1f5f9":getColor(n,metric),
                weight:selected===n.id?3:2,
                fillColor:getColor(n,metric),
                fillOpacity:selected===n.id?0.45:0.25,
                dashArray:selected===n.id?null:"6,4",
              }}
              eventHandlers={{ click:()=>setSelected(selected===n.id?null:n.id) }}
            >
              <Tooltip direction="center" permanent className="custom-tooltip">
                <div style={{ textAlign:"center",fontFamily:"inherit" }}>
                  <div style={{ fontSize:12,fontWeight:800,color:"#f1f5f9" }}>{n.name}</div>
                  <div style={{ fontSize:14,fontWeight:900,color:getColor(n,metric) }}>{currentMetric.fmt(n[metric])}</div>
                </div>
              </Tooltip>
            </Polygon>
          ))}
          {showSales && RECENT_SALES.map((s,i) => (
            <CircleMarker key={`s${i}`} center={[s.lat,s.lng]} radius={6}
              pathOptions={{ color:getStatusColor(s.st),fillColor:getStatusColor(s.st),fillOpacity:0.85,weight:2 }}>
              <Popup>
                <div style={{ fontFamily:"inherit",minWidth:200 }}>
                  <div style={{ fontSize:13,fontWeight:800,color:"#0f172a",marginBottom:4 }}>{s.addr}</div>
                  <div style={{ fontSize:18,fontWeight:900,color:"#6366f1",letterSpacing:"-0.5px" }}>{fmtPrice(s.price)}</div>
                  <div style={{ fontSize:12,color:"#64748b",marginTop:4 }}>{s.bd}bd / {s.ba}ba · {fmt(s.sqft)} sqft · ${s.ppsf}/sqft</div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:8 }}>
                    <span style={{ fontSize:11,padding:"2px 8px",borderRadius:6,background:`${getStatusColor(s.st)}20`,color:getStatusColor(s.st),fontWeight:700 }}>{s.st}</span>
                    <span style={{ fontSize:11,color:"#94a3b8" }}>{s.dom} DOM</span>
                  </div>
                  <div style={{ fontSize:11,color:"#94a3b8",marginTop:6,borderTop:"1px solid #e2e8f0",paddingTop:6 }}>
                    Monthly @ {RATES.conventional30.rate}%: <strong style={{color:"#0f172a"}}>${fmt(Math.round(calcPayment(s.price*0.8,RATES.conventional30.rate)))}</strong>
                    <span style={{ color:"#94a3b8" }}> (20% dn)</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {showSchools && SCHOOLS.map((s,i) => (
            <CircleMarker key={`sch${i}`} center={[s.lat,s.lng]} radius={8}
              pathOptions={{ color:"#f59e0b",fillColor:"#fbbf24",fillOpacity:0.9,weight:2 }}>
              <Popup>
                <div style={{ fontFamily:"inherit",minWidth:160 }}>
                  <div style={{ fontSize:13,fontWeight:800,color:"#0f172a" }}>{s.name}</div>
                  <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>{s.grades}</div>
                  <div style={{ marginTop:6,display:"flex",alignItems:"center",gap:6 }}>
                    <div style={{ width:40,height:6,borderRadius:3,background:"#e2e8f0",overflow:"hidden" }}>
                      <div style={{ width:`${s.rating*10}%`,height:"100%",borderRadius:3,background:s.rating>=9?"#22c55e":s.rating>=7?"#f59e0b":"#ef4444" }} />
                    </div>
                    <span style={{ fontSize:14,fontWeight:900,color:s.rating>=9?"#16a34a":s.rating>=7?"#d97706":"#dc2626" }}>{s.rating}/10</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* SIDEBAR */}
      {hood && (
        <div className="map-sidebar" style={{
          width:380,background:"rgba(15,23,42,0.97)",backdropFilter:"blur(20px)",
          borderLeft:"1px solid rgba(255,255,255,0.06)",overflowY:"auto",padding:0,
        }}>
          {/* Header */}
          <div style={{ padding:"24px 24px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                  <div style={{ width:12,height:12,borderRadius:4,background:hood.color }} />
                  <span style={{ fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"1px" }}>Neighborhood</span>
                </div>
                <h2 style={{ fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px",margin:0 }}>{hood.name}</h2>
                <p style={{ fontSize:13,color:"#64748b",marginTop:4 }}>{hood.vibe}</p>
              </div>
              <button onClick={()=>setSelected(null)} style={{
                background:"rgba(255,255,255,0.06)",border:"none",borderRadius:8,
                width:32,height:32,cursor:"pointer",color:"#94a3b8",fontSize:16,
                display:"flex",alignItems:"center",justifyContent:"center",
              }}>✕</button>
            </div>
          </div>

          {/* Key Stats */}
          <div style={{ padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:36,fontWeight:900,color:"#f1f5f9",letterSpacing:"-2px" }}>{fmtPrice(hood.med)}</div>
            <div style={{ display:"flex",gap:12,marginTop:8 }}>
              <span style={{
                fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:6,
                background:hood.chg>0?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",
                color:hood.chg>0?"#22c55e":"#ef4444",
              }}>{hood.chg>0?"↑":"↓"} {Math.abs(hood.chg)}% YoY</span>
              <span style={{ fontSize:12,color:"#64748b" }}>Median Sale Price</span>
            </div>
          </div>

          {/* Trend Chart */}
          {hood.trend && (
            <div style={{ padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10 }}>Price Trend</div>
              <MiniTrend data={hood.trend} color={hood.color} />
            </div>
          )}

          {/* Stats Grid */}
          <div className="hood-stats-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",padding:"16px 24px",gap:0,borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            {[
              ["DOM",`${hood.dom}d`,hood.dom<20?"#22c55e":hood.dom<40?"#f59e0b":"#ef4444"],
              ["Compete",`${hood.score}`,hood.score>=70?"#ef4444":hood.score>=50?"#f59e0b":"#22c55e"],
              ["$/Sqft",`$${hood.ppsf}`,"#a5b4fc"],
              ["Active",hood.active,"#3b82f6"],
              ["Sold 30d",hood.sold30,"#22c55e"],
              ["L/S Ratio",`${hood.listToSale}%`,"#f59e0b"],
            ].map(([l,v,c]) => (
              <div key={l} style={{ padding:"10px 0",textAlign:"center" }}>
                <div style={{ fontSize:9,color:"#475569",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px" }}>{l}</div>
                <div style={{ fontSize:18,fontWeight:900,color:c,letterSpacing:"-0.5px",marginTop:2 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Schools */}
          {hoodSchools.length > 0 && (
            <div style={{ padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10 }}>🏫 Schools</div>
              {hoodSchools.map((s,i) => (
                <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0" }}>
                  <div>
                    <div style={{ fontSize:12,fontWeight:600,color:"#e2e8f0" }}>{s.name}</div>
                    <div style={{ fontSize:10,color:"#475569" }}>{s.grades}</div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                    <div style={{ width:30,height:5,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden" }}>
                      <div style={{ width:`${s.rating*10}%`,height:"100%",borderRadius:3,background:s.rating>=9?"#22c55e":s.rating>=7?"#f59e0b":"#ef4444" }} />
                    </div>
                    <span style={{ fontSize:13,fontWeight:800,color:s.rating>=9?"#22c55e":s.rating>=7?"#f59e0b":"#ef4444" }}>{s.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Monthly Payment */}
          <div style={{ padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10 }}>Monthly Payment at Median</div>
            {[
              { ...RATES.conventional30, down:0.20, label:"Conv (20% down)" },
              { ...RATES.fha30, down:0.035, label:"FHA (3.5% down)" },
              { ...RATES.va30, down:0, label:"VA (0% down)" },
            ].map(r => {
              const principal = hood.med*(1-r.down);
              const pmt = calcPayment(principal,r.rate);
              return (
                <div key={r.label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                  <div>
                    <div style={{ fontSize:12,color:"#cbd5e1",fontWeight:600 }}>{r.label}</div>
                    <div style={{ fontSize:10,color:"#475569" }}>{r.rate}% · ${fmt(Math.round(principal))} loan</div>
                  </div>
                  <div style={{ fontSize:18,fontWeight:900,color:"#f1f5f9",letterSpacing:"-0.5px" }}>${fmt(Math.round(pmt))}</div>
                </div>
              );
            })}
            <div style={{ fontSize:10,color:"#475569",marginTop:8 }}>P&I only. Excl. tax, insurance, HOA.</div>
          </div>

          {/* Hot Home Stats */}
          <div style={{ padding:"16px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8 }}>🔥 Hot Homes</div>
            <div style={{ fontSize:13,color:"#cbd5e1",lineHeight:1.6 }}>
              Hot homes in {hood.name} sell in <strong style={{ color:"#f59e0b" }}>{hood.hot} days</strong> with
              avg <strong style={{ color:"#f59e0b" }}>{MARKET.offers} offers</strong>.
              {hood.score >= 70 ? " Very competitive — expect bidding wars." :
                hood.score >= 50 ? " Moderate competition." : " Buyers have negotiating room."}
            </div>
          </div>

          {/* Recent Sales */}
          {hoodSales.length > 0 && (
            <div style={{ padding:"16px 24px" }}>
              <div style={{ fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10 }}>
                Recent Activity ({hoodSales.length})
              </div>
              {hoodSales.map((s,i) => (
                <div key={i} style={{ padding:"12px 0",borderBottom:i<hoodSales.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div style={{ fontSize:13,fontWeight:700,color:"#e2e8f0" }}>{s.addr}</div>
                    <span style={{ fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${getStatusColor(s.st)}20`,color:getStatusColor(s.st) }}>{s.st}</span>
                  </div>
                  <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
                    <span style={{ fontSize:15,fontWeight:900,color:"#a5b4fc" }}>{fmtPrice(s.price)}</span>
                    <span style={{ fontSize:12,color:"#64748b" }}>{s.bd}/{s.ba} · {fmt(s.sqft)}sf · ${s.ppsf}/sf</span>
                  </div>
                  <div style={{ fontSize:11,color:"#475569",marginTop:2 }}>{s.dom} DOM · {s.date}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{ padding:"16px 24px 24px" }}>
            <button style={{
              width:"100%",padding:"14px",borderRadius:12,border:"none",
              background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"white",
              fontSize:14,fontWeight:700,cursor:"pointer",
              boxShadow:"0 4px 20px rgba(99,102,241,0.4)",
            }}>Get Custom {hood.name} Report</button>
          </div>
        </div>
      )}

      <style>{`
        .custom-tooltip { background:rgba(15,23,42,0.9)!important; border:1px solid rgba(255,255,255,0.1)!important; border-radius:8px!important; padding:6px 10px!important; box-shadow:0 4px 20px rgba(0,0,0,0.4)!important; }
        .custom-tooltip::before { border-top-color:rgba(15,23,42,0.9)!important; }
        .leaflet-popup-content-wrapper { border-radius:14px!important; box-shadow:0 8px 30px rgba(0,0,0,0.3)!important; }
        .leaflet-popup-tip { display:none; }
      `}</style>
    </div>
  );
}
