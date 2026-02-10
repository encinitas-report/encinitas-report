import { T } from "../theme";
import { NEIGHBORHOODS, RECENT_SALES, MARKET, fmt, fmtPrice, calcPayment } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

function StatusBadge({st}) {
  const m = {Active:[T.pos,"#ecfdf5","●"],Pending:[T.warn,"#fffbeb","◆"],"Price Cut":[T.neg,"#fef2f2","↓"],"Just Listed":[T.blue,"#eff6ff","★"]};
  const [c,bg,icon] = m[st]||[T.muted,"#f1f5f9","·"];
  return <span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20,background:bg,color:c,whiteSpace:"nowrap"}}>{icon} {st}</span>;
}

function CompeteRing({score,size=100}) {
  const r=(size-10)/2, circ=2*Math.PI*r, pct=score/100;
  const color = score>=70?T.neg:score>=50?T.warn:T.pos;
  return <svg width={size} height={size} style={{display:"block",margin:"0 auto"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6"/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
      strokeDasharray={`${circ*pct} ${circ*(1-pct)}`} strokeDashoffset={circ*0.25} strokeLinecap="round"/>
    <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
      style={{fontSize:size*0.32,fontWeight:900,fill:T.text}}>{score}</text>
  </svg>;
}

function MiniChart({data}) {
  if(!data||data.length<2) return null;
  const ps=data.map(d=>d.p), mn=Math.min(...ps)*0.97, mx=Math.max(...ps)*1.01;
  const w=320, h=100;
  const pts=data.map((d,i)=>[(i/(data.length-1))*w, (h-8)-((d.p-mn)/(mx-mn))*(h-24)]);
  const pathD=pts.map((p,i)=>i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`).join(" ");
  const areaD=pathD+` L${pts[pts.length-1][0]},${h-8} L${pts[0][0]},${h-8} Z`;
  return <svg width={w} height={h+18} style={{display:"block",width:"100%"}} viewBox={`0 0 ${w} ${h+18}`} preserveAspectRatio="none">
    <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={T.chart} stopOpacity="0.15"/><stop offset="100%" stopColor={T.chart} stopOpacity="0"/>
    </linearGradient></defs>
    <path d={areaD} fill="url(#chartGrad)"/>
    <path d={pathD} fill="none" stroke={T.chart} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===pts.length-1?4:0} fill={T.chart} stroke="white" strokeWidth="2"/>)}
    {data.map((d,i)=><text key={`l${i}`} x={pts[i][0]} y={h+14} textAnchor="middle" style={{fontSize:9,fill:T.muted}}>{d.m}</text>)}
  </svg>;
}

export default function Dashboard() {
  const soldChg = Math.round((MARKET.sold30/MARKET.soldPrev-1)*100);
  // show one sale per neighborhood
  const shown = [];
  const salesByHood = {};
  RECENT_SALES.forEach(s => { if(!salesByHood[s.hood]) salesByHood[s.hood] = s; });
  const tableSales = Object.values(salesByHood).concat(
    RECENT_SALES.filter(s => !Object.values(salesByHood).includes(s))
  ).slice(0, 8);

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>

      {/* ── HERO ── */}
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, background:"#ecfdf5", marginBottom:16 }}>
          <div style={{ width:6, height:6, borderRadius:3, background:T.brand }}/>
          <span style={{ fontSize:11, fontWeight:700, color:T.brandDk, textTransform:"uppercase", letterSpacing:"1px" }}>Live Market Intelligence · February 2026</span>
        </div>
        <h1 style={{ fontSize:48, fontWeight:900, color:T.text, letterSpacing:"-2.5px", margin:0, lineHeight:1 }}>Encinitas</h1>
        <h1 style={{ fontSize:48, fontWeight:900, color:T.brand, letterSpacing:"-2.5px", margin:0, lineHeight:1.1 }}>Real Estate</h1>
        <p style={{ fontSize:16, color:T.sec, marginTop:12, lineHeight:1.5, maxWidth:500 }}>
          Neighborhood-level market data powered by MLS & Redfin.<br/>Updated weekly for buyers, sellers, and investors.
        </p>
      </div>

      {/* ── TOP STATS ── */}
      <div className="stats-top" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:16, marginBottom:16 }}>
        <Card style={{ padding:"24px 28px" }}>
          <Lbl>Median Sale Price</Lbl>
          <div style={{ fontSize:42, fontWeight:900, color:T.text, letterSpacing:"-2px", marginTop:6 }}>{fmtPrice(MARKET.median)}</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
            <span style={{ fontSize:13, fontWeight:700, padding:"2px 10px", borderRadius:8, background:MARKET.medianChange>0?"#ecfdf5":"#fef2f2", color:MARKET.medianChange>0?T.pos:T.neg }}>
              {MARKET.medianChange>0?"↑":"↓"} {Math.abs(MARKET.medianChange)}%
            </span>
            <span style={{ fontSize:13, color:T.muted }}>vs last year · Redfin</span>
          </div>
          <div style={{ marginTop:16 }}><MiniChart data={MARKET.trend}/></div>
        </Card>

        <Card style={{ padding:"28px 20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <CompeteRing score={MARKET.compete}/>
          <Lbl style={{ marginTop:12, textAlign:"center" }}>Compete Score</Lbl>
          <div style={{ fontSize:13, color:T.sec, marginTop:2 }}>Somewhat competitive</div>
        </Card>

        <Card style={{ padding:"24px 28px" }}>
          <Lbl>Homes Sold · 30d</Lbl>
          <div style={{ fontSize:42, fontWeight:900, color:T.text, letterSpacing:"-2px", marginTop:6 }}>{MARKET.sold30}</div>
          <span style={{ fontSize:13, fontWeight:700, color:T.pos }}>↑ {soldChg}% YoY</span>
        </Card>
      </div>

      <div className="stats-2col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:32 }}>
        <Card style={{ padding:"24px 28px" }}>
          <Lbl>Days on Market</Lbl>
          <div style={{ display:"flex", alignItems:"baseline", gap:6, marginTop:6 }}>
            <span style={{ fontSize:42, fontWeight:900, color:T.text, letterSpacing:"-2px" }}>{MARKET.dom}</span>
            <span style={{ fontSize:16, color:T.muted }}>avg</span>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:6 }}>
            <span style={{ fontSize:13, fontWeight:600, color:T.warn }}>↑ {MARKET.dom-MARKET.domPrev} days YoY</span>
            <span style={{ fontSize:13, color:T.muted }}>Hot: {MARKET.hotDom}d</span>
          </div>
        </Card>
        <Card style={{ padding:"24px 28px" }}>
          <Lbl>Price / Sq Ft</Lbl>
          <div style={{ fontSize:42, fontWeight:900, color:T.text, letterSpacing:"-2px", marginTop:6 }}>${MARKET.ppsf}</div>
          <span style={{ fontSize:13, fontWeight:700, color:T.pos }}>↑ {MARKET.ppsfChange}% YoY</span>
        </Card>
      </div>

      {/* ── NEIGHBORHOODS ── */}
      <h2 style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:"0 0 4px" }}>Neighborhoods</h2>
      <p style={{ fontSize:14, color:T.muted, marginBottom:20 }}>Micro-market data · Redfin Compete Scores</p>

      <div className="hood-grid" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:32 }}>
        {NEIGHBORHOODS.map(n => {
          const cc = n.score>=70?T.neg:n.score>=50?T.warn:T.pos;
          return (
            <Card key={n.id} style={{ padding:0, overflow:"hidden" }}>
              <div style={{ height:4, background:n.color }}/>
              <div style={{ padding:"18px 18px 16px" }}>
                <div style={{ fontSize:15, fontWeight:800, color:T.text }}>{n.name}</div>
                <div style={{ fontSize:11, color:T.muted, marginTop:2, minHeight:30 }}>{n.vibe}</div>
                <div style={{ fontSize:26, fontWeight:900, color:T.text, letterSpacing:"-1px", marginTop:10 }}>{fmtPrice(n.med)}</div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:n.chg>0?T.pos:T.neg }}>{n.chg>0?"↑":"↓"} {Math.abs(n.chg)}%</span>
                  <span style={{ fontSize:12, color:T.muted }}>{n.dom}d avg</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
                  <span style={{ fontSize:11, color:T.sec }}>Compete</span>
                  <span style={{ fontSize:13, fontWeight:800, color:cc }}>{n.score}</span>
                </div>
                <div style={{ height:4, borderRadius:2, background:"#f1f5f9", marginTop:4, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${n.score}%`, borderRadius:2, background:cc }}/>
                </div>
                <div style={{ fontSize:11, color:T.muted, marginTop:8 }}>Hot homes: {n.hot}d</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── RECENT LISTINGS TABLE ── */}
      <Card style={{ padding:0, overflow:"hidden", marginBottom:24 }}>
        <div style={{ padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${T.border}` }}>
          <Lbl>Recent Listings</Lbl>
          <span style={{ fontSize:12, fontWeight:700, color:T.brand, padding:"4px 12px", borderRadius:20, background:"#ecfdf5" }}>{MARKET.active} active</span>
        </div>
        <div className="table-wrap">
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                {["Address","Neighborhood","Bed/Bath","Sq Ft","Price","DOM","Status"].map(h =>
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:10, fontWeight:700, color:T.label, textTransform:"uppercase", letterSpacing:"1px" }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tableSales.map((s,i) => (
                <tr key={i} style={{ borderBottom:`1px solid ${T.border}` }}>
                  <td style={{ padding:"14px 16px", fontWeight:700, color:T.text }}>{s.addr}</td>
                  <td style={{ padding:"14px 16px", color:T.sec }}>{NEIGHBORHOODS.find(n=>n.id===s.hood)?.name || s.hood}</td>
                  <td style={{ padding:"14px 16px", color:T.sec }}>{s.bd}/{s.ba}</td>
                  <td style={{ padding:"14px 16px", color:T.sec }}>{fmt(s.sqft)}</td>
                  <td style={{ padding:"14px 16px", fontWeight:800, color:T.text }}>{fmtPrice(s.price)}</td>
                  <td style={{ padding:"14px 16px", color:T.sec }}>{s.dom}</td>
                  <td style={{ padding:"14px 16px" }}><StatusBadge st={s.st}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── BOTTOM STATS ── */}
      <div className="stats-4col" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
        {[["List → Sale",`${MARKET.listToSale}%`,"Near asking",T.sec],["Avg Offers",`${MARKET.offers}`,"Per listing",T.brand],["Hot Home DOM",`${MARKET.hotDom}d`,"Move fast",T.warn],["Avg Rent",`$${fmt(MARKET.rent)}`,"/month",T.sec]].map(([l,v,s,c]) => (
          <Card key={l} style={{ padding:"20px 24px", textAlign:"center" }}>
            <Lbl style={{ textAlign:"center" }}>{l}</Lbl>
            <div style={{ fontSize:36, fontWeight:900, color:T.text, letterSpacing:"-1.5px", marginTop:6 }}>{v}</div>
            <div style={{ fontSize:13, color:c, fontWeight:600, marginTop:2 }}>{s}</div>
          </Card>
        ))}
      </div>

      {/* ── MIGRATION ── */}
      <Card style={{ padding:"24px 28px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <div>
            <Lbl>Migration Trends</Lbl>
            <div style={{ marginTop:8 }}>
              <span style={{ fontSize:36, fontWeight:900, color:T.text, letterSpacing:"-1.5px" }}>{MARKET.migration.stayPct}%</span>
              <span style={{ fontSize:16, color:T.sec }}> of Encinitas buyers stay local</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:40 }}>
            <div>
              <Lbl style={{ color:T.pos }}>Moving In From</Lbl>
              {MARKET.migration.topFrom.map(c => <div key={c} style={{ fontSize:14, color:T.text, marginTop:4 }}>{c}</div>)}
            </div>
            <div>
              <Lbl style={{ color:T.neg }}>Moving Out To</Lbl>
              {MARKET.migration.topTo.map(c => <div key={c} style={{ fontSize:14, color:T.text, marginTop:4 }}>{c}</div>)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
