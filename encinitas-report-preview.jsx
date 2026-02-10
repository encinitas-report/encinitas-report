import { useState, useMemo } from "react";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
const fmtPrice = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(n%1e5===0?1:2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${fmt(n)}`;
const calcPayment = (p, r, y=30) => { const mr=r/100/12, n=y*12; return mr===0?p/n:p*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1); };

const RATES = {
  updated:"Feb 10, 2026",
  conv30:{rate:6.11,label:"30-Yr Fixed"},conv15:{rate:5.50,label:"15-Yr Fixed"},
  fha30:{rate:5.75,label:"FHA 30-Yr",note:"3.5% min down"},
  va30:{rate:5.375,label:"VA 30-Yr",note:"0% down"},
  jumbo30:{rate:6.25,label:"Jumbo 30-Yr"},arm51:{rate:5.63,label:"5/1 ARM"},
  trend:[{w:"Jan 2",r:6.91},{w:"Jan 9",r:6.93},{w:"Jan 16",r:6.89},{w:"Jan 23",r:6.87},{w:"Jan 30",r:6.63},{w:"Feb 6",r:6.11}],
};

const MARKET = { median:1865000,medianChange:-5.6,dom:45,domPrev:40,sold30:46,soldPrev:33,ppsf:976,ppsfChange:5.1,compete:66,offers:5,listToSale:98,active:146,
  trend:[{m:"Mar '25",p:1720000},{m:"Apr",p:1755000},{m:"May",p:1810000},{m:"Jun",p:1880000},{m:"Jul",p:1920000},{m:"Aug",p:2000000},{m:"Sep",p:1960000},{m:"Oct",p:1920000},{m:"Nov",p:1890000},{m:"Dec",p:1900000},{m:"Jan '26",p:1865000},{m:"Feb",p:1870000}],
  migration:{topFrom:["Los Angeles","Raleigh","San Francisco"],topTo:["Portland","Nashville","Phoenix"]},
};

const HOODS = [
  {id:"leucadia",name:"Leucadia",med:2990000,chg:19.6,dom:46,score:52,hot:16,ppsf:1285,active:28,sold30:8,listToSale:96,vibe:"Surf-town soul, Coast Hwy",color:"#8b5cf6",schools:[{n:"Paul Ecke Central",r:8},{n:"Capri Elementary",r:7}],
    trend:[{m:"Mar",p:2500000},{m:"Jun",p:2750000},{m:"Sep",p:2850000},{m:"Dec",p:2990000}]},
  {id:"old-encinitas",name:"Old Encinitas",med:2100000,chg:5.7,dom:42,score:66,hot:13,ppsf:1120,active:31,sold30:11,listToSale:97,vibe:"Downtown, village charm",color:"#0ea5e9",schools:[{n:"Flora Vista",r:8},{n:"San Dieguito Academy",r:9}],
    trend:[{m:"Mar",p:1950000},{m:"Jun",p:2020000},{m:"Sep",p:2080000},{m:"Dec",p:2100000}]},
  {id:"new-encinitas",name:"New Encinitas",med:1452500,chg:9.2,dom:17,score:72,hot:10,ppsf:780,active:38,sold30:14,listToSale:99,vibe:"Family-friendly, great schools",color:"#22c55e",schools:[{n:"Park Dale Lane",r:9},{n:"San Dieguito Academy",r:9}],
    trend:[{m:"Mar",p:1310000},{m:"Jun",p:1380000},{m:"Sep",p:1420000},{m:"Dec",p:1452500}]},
  {id:"olivenhain",name:"Olivenhain",med:1570000,chg:19.3,dom:11,score:86,hot:6,ppsf:690,active:22,sold30:8,listToSale:101,vibe:"Equestrian estates, rural luxury",color:"#f59e0b",schools:[{n:"Olivenhain Pioneer",r:9}],
    trend:[{m:"Mar",p:1280000},{m:"Jun",p:1400000},{m:"Sep",p:1500000},{m:"Dec",p:1570000}]},
  {id:"cardiff",name:"Cardiff-by-the-Sea",med:2000000,chg:-8.5,dom:39,score:55,hot:8,ppsf:1050,active:27,sold30:5,listToSale:97,vibe:"Restaurant Row, beach village",color:"#f43f5e",schools:[{n:"Cardiff Elementary",r:8},{n:"Ada Harris",r:7}],
    trend:[{m:"Mar",p:2180000},{m:"Jun",p:2150000},{m:"Sep",p:2080000},{m:"Dec",p:2000000}]},
];

const SALES = [
  {addr:"412 Neptune Ave",hood:"Leucadia",price:2150000,bd:3,ba:2,sqft:1820,dom:8,st:"Active",ppsf:1181},
  {addr:"547 Neptune Ave",hood:"Leucadia",price:3485000,bd:4,ba:3.5,sqft:2400,dom:22,st:"Active",ppsf:1452},
  {addr:"820 Diana Ave",hood:"Leucadia",price:1680000,bd:2,ba:2,sqft:1280,dom:2,st:"Just Listed",ppsf:1313},
  {addr:"965 Santa Fe Dr",hood:"Old Encinitas",price:1780000,bd:3,ba:2,sqft:1720,dom:1,st:"Just Listed",ppsf:1035},
  {addr:"154 W Jason St",hood:"Old Encinitas",price:2280000,bd:3,ba:3,sqft:1950,dom:3,st:"Just Listed",ppsf:1169},
  {addr:"355 W E St",hood:"Old Encinitas",price:2450000,bd:4,ba:3,sqft:2200,dom:9,st:"Active",ppsf:1114},
  {addr:"802 Saxony Rd",hood:"New Encinitas",price:1180000,bd:3,ba:2.5,sqft:1437,dom:7,st:"Active",ppsf:821},
  {addr:"1580 Village Park Way",hood:"New Encinitas",price:1050000,bd:3,ba:2.5,sqft:1437,dom:3,st:"Just Listed",ppsf:731},
  {addr:"3020 Via de Caballo",hood:"Olivenhain",price:2100000,bd:4,ba:3,sqft:3100,dom:9,st:"Pending",ppsf:677},
  {addr:"3660 Manchester Ave",hood:"Olivenhain",price:2650000,bd:5,ba:4.5,sqft:4800,dom:8,st:"Active",ppsf:552},
  {addr:"2102 Oxford Ave",hood:"Cardiff",price:2450000,bd:3,ba:2,sqft:1680,dom:3,st:"Just Listed",ppsf:1458},
  {addr:"2478 Cambridge Ave",hood:"Cardiff",price:3100000,bd:4,ba:3,sqft:2400,dom:2,st:"Just Listed",ppsf:1292},
];

const TABS = [{id:"dash",label:"Dashboard"},{id:"rates",label:"Rates"},{id:"hoods",label:"Neighborhoods"},{id:"content",label:"Content"}];

function MiniTrend({data,color,h=50}){
  if(!data||data.length<2) return null;
  const ps=data.map(d=>d.p), mn=Math.min(...ps)*0.95, mx=Math.max(...ps);
  const w=180;
  const pts=data.map((d,i)=>`${(i/(data.length-1))*w},${h-((d.p-mn)/(mx-mn))*h}`).join(" ");
  return <svg width={w} height={h+14} style={{display:"block"}}>
    <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    {data.map((d,i)=>{const x=(i/(data.length-1))*w,y=h-((d.p-mn)/(mx-mn))*h;
      return <circle key={i} cx={x} cy={y} r={i===data.length-1?4:2} fill={i===data.length-1?color:"transparent"} stroke={color} strokeWidth="1"/>})}
    {data.map((d,i)=><text key={`l${i}`} x={(i/(data.length-1))*w} y={h+11} textAnchor="middle" fontSize="8" fill="#64748b">{d.m}</text>)}
  </svg>;
}

function StatusBadge({st}){
  const c = {Active:"#22c55e",Pending:"#f59e0b","Just Listed":"#3b82f6","Price Cut":"#ef4444"}[st]||"#94a3b8";
  return <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6,background:`${c}20`,color:c}}>{st}</span>;
}

export default function App() {
  const [tab, setTab] = useState("dash");
  const [selectedHood, setSelectedHood] = useState(null);
  const [price, setPrice] = useState(MARKET.median);
  const [downPct, setDownPct] = useState(20);
  const [scriptType, setScriptType] = useState("market");
  const [scriptHood, setScriptHood] = useState("leucadia");

  const hood = selectedHood ? HOODS.find(h=>h.id===selectedHood) : null;

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",color:"#e2e8f0",fontFamily:"-apple-system,system-ui,sans-serif"}}>
      {/* NAV */}
      <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:11,fontWeight:900,boxShadow:"0 2px 12px rgba(99,102,241,0.4)"}}>ER</div>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:"#f1f5f9",letterSpacing:"-0.3px"}}>The Encinitas Report</div>
            <div style={{fontSize:8.5,color:"#475569",fontWeight:600,letterSpacing:"0.8px"}}>DRE# 02168977 · HomeSmart Realty West</div>
          </div>
        </div>
        <div style={{display:"flex",gap:2,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>{setTab(t.id);setSelectedHood(null)}} style={{
              padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:tab===t.id?700:400,
              background:tab===t.id?"rgba(99,102,241,0.15)":"transparent",color:tab===t.id?"#a5b4fc":"#64748b",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* RATE TICKER */}
      <div style={{display:"flex",gap:16,padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)",flexWrap:"wrap"}}>
        {[RATES.conv30,RATES.fha30,RATES.va30,RATES.jumbo30].map(r=>(
          <div key={r.label} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:9,color:"#475569",fontWeight:700,textTransform:"uppercase"}}>{r.label}:</span>
            <span style={{fontSize:13,fontWeight:900,color:"#f1f5f9"}}>{r.rate}%</span>
          </div>
        ))}
        <span style={{fontSize:9,color:"#334155",marginLeft:"auto"}}>{RATES.updated}</span>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 20px 60px"}}>

      {/* ═══ DASHBOARD ═══ */}
      {tab==="dash" && <>
        <h1 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1.5px",margin:"0 0 6px"}}>Encinitas Market Data</h1>
        <p style={{fontSize:13,color:"#64748b",marginBottom:24}}>Real data from Redfin, Zillow & MLS · Updated February 2026</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
          {[
            ["Median Price",fmtPrice(MARKET.median),`${MARKET.medianChange}% YoY`,MARKET.medianChange>0?"#22c55e":"#ef4444"],
            ["Days on Market",`${MARKET.dom}`,`+${MARKET.dom-MARKET.domPrev}d YoY`,"#f59e0b"],
            ["Sold (30d)",`${MARKET.sold30}`,`↑${Math.round((MARKET.sold30/MARKET.soldPrev-1)*100)}% YoY`,"#22c55e"],
            ["$/Sq Ft",`$${MARKET.ppsf}`,`+${MARKET.ppsfChange}% YoY`,"#a5b4fc"],
            ["Compete",`${MARKET.compete}/100`,"Somewhat Competitive","#f59e0b"],
            ["Avg Offers",`${MARKET.offers}`,"Per listing","#3b82f6"],
            ["List → Sale",`${MARKET.listToSale}%`,"Near asking","#22c55e"],
            ["Active",`${MARKET.active}`,"Listings","#94a3b8"],
          ].map(([l,v,s,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"14px 16px"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px"}}>{l}</div>
              <div style={{fontSize:22,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px",marginTop:3}}>{v}</div>
              <div style={{fontSize:11,fontWeight:600,color:c,marginTop:2}}>{s}</div>
            </div>
          ))}
        </div>

        {/* Price Trend */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>12-Month Median Price Trend</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:5,height:120}}>
            {MARKET.trend.map((t,i)=>{
              const mx=Math.max(...MARKET.trend.map(x=>x.p)),mn=Math.min(...MARKET.trend.map(x=>x.p))*0.95;
              const pct=((t.p-mn)/(mx-mn))*100;
              return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <div style={{fontSize:8,fontWeight:700,color:"#94a3b8"}}>{fmtPrice(t.p)}</div>
                <div style={{width:"100%",height:`${pct}%`,minHeight:6,borderRadius:5,background:i===MARKET.trend.length-1?"linear-gradient(180deg,#6366f1,#4f46e5)":"rgba(99,102,241,0.15)"}}/>
                <div style={{fontSize:7,color:"#475569"}}>{t.m}</div>
              </div>;
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>Recent Activity</span>
            <span style={{fontSize:11,color:"#6366f1",fontWeight:600}}>{SALES.length} listings</span>
          </div>
          {SALES.map((s,i)=>(
            <div key={i} style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
              <div style={{minWidth:160}}>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{s.addr}</div>
                <div style={{fontSize:11,color:"#64748b"}}>{s.hood} · {s.bd}/{s.ba} · {fmt(s.sqft)}sf · ${s.ppsf}/sf</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:11,color:"#64748b"}}>{s.dom}d</span>
                <StatusBadge st={s.st}/>
                <span style={{fontSize:15,fontWeight:900,color:"#f1f5f9",minWidth:80,textAlign:"right"}}>{fmtPrice(s.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </>}

      {/* ═══ RATES ═══ */}
      {tab==="rates" && <>
        <h1 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1.5px",margin:"0 0 6px"}}>Today's Mortgage Rates</h1>
        <p style={{fontSize:13,color:"#64748b",marginBottom:24}}>Updated {RATES.updated} · Freddie Mac, Bankrate, Veterans United</p>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
          {[RATES.conv30,RATES.conv15,RATES.fha30,RATES.va30,RATES.jumbo30,RATES.arm51].map(r=>(
            <div key={r.label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 18px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>{r.label}</div>
              <div style={{fontSize:32,fontWeight:900,color:"#f1f5f9",letterSpacing:"-2px",marginTop:6}}>{r.rate}%</div>
              {r.note && <div style={{fontSize:10,color:"#475569",marginTop:6}}>{r.note}</div>}
            </div>
          ))}
        </div>

        {/* Rate Trend */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20,marginBottom:24}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>30-Year Fixed Trend (2026)</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:8,height:100}}>
            {RATES.trend.map((t,i)=>{
              const mx=Math.max(...RATES.trend.map(x=>x.r)),mn=Math.min(...RATES.trend.map(x=>x.r))-0.5;
              const pct=((t.r-mn)/(mx-mn))*100;
              return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{fontSize:10,fontWeight:700,color:"#f1f5f9"}}>{t.r}%</div>
                <div style={{width:"100%",height:`${pct}%`,minHeight:6,borderRadius:5,background:i===RATES.trend.length-1?"linear-gradient(180deg,#6366f1,#4f46e5)":"rgba(255,255,255,0.06)"}}/>
                <div style={{fontSize:8,color:"#475569"}}>{t.w}</div>
              </div>;
            })}
          </div>
        </div>

        {/* Payment Calculator */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:22}}>
          <div style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:16}}>Payment Calculator</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>Home Price</div>
              <input type="range" min={500000} max={5000000} step={25000} value={price} onChange={e=>setPrice(+e.target.value)} style={{width:"100%",accentColor:"#6366f1"}}/>
              <div style={{fontSize:20,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px"}}>{fmtPrice(price)}</div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#94a3b8",marginBottom:4}}>Down Payment</div>
              <input type="range" min={0} max={50} step={1} value={downPct} onChange={e=>setDownPct(+e.target.value)} style={{width:"100%",accentColor:"#6366f1"}}/>
              <div style={{fontSize:20,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px"}}>{downPct}% <span style={{fontSize:13,color:"#64748b"}}>({fmtPrice(price*downPct/100)})</span></div>
            </div>
          </div>
          {[{...RATES.conv30,dp:downPct/100},{...RATES.conv15,dp:downPct/100,y:15},{...RATES.fha30,dp:Math.max(0.035,downPct/100)},{...RATES.va30,dp:0}].map(r=>{
            const loan=price*(1-r.dp),pmt=calcPayment(loan,r.rate,r.y||30);
            return <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{r.label}</div><div style={{fontSize:10,color:"#475569"}}>{r.rate}% · {fmtPrice(loan)} loan</div></div>
              <div style={{fontSize:18,fontWeight:900,color:"#a5b4fc"}}>${fmt(Math.round(pmt))}<span style={{fontSize:11,color:"#475569"}}>/mo</span></div>
            </div>;
          })}
          <div style={{fontSize:10,color:"#334155",marginTop:12}}>P&I only. Excludes tax (~1.1%), insurance, HOA, MIP.</div>
        </div>
      </>}

      {/* ═══ NEIGHBORHOODS ═══ */}
      {tab==="hoods" && !selectedHood && <>
        <h1 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1.5px",margin:"0 0 6px"}}>Neighborhood Comparison</h1>
        <p style={{fontSize:13,color:"#64748b",marginBottom:24}}>Click any neighborhood for deep-dive data</p>
        {HOODS.map(n=>{
          const pmt=Math.round(calcPayment(n.med*0.8,RATES.conv30.rate));
          return <div key={n.id} onClick={()=>setSelectedHood(n.id)} style={{
            background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20,marginBottom:10,cursor:"pointer",
            transition:"all 0.2s",
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{width:12,height:12,borderRadius:4,background:n.color}}/>
                  <span style={{fontSize:18,fontWeight:900,color:"#f1f5f9",letterSpacing:"-0.5px"}}>{n.name}</span>
                  <span style={{fontSize:12,fontWeight:700,padding:"2px 8px",borderRadius:6,background:n.chg>0?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",color:n.chg>0?"#22c55e":"#ef4444"}}>{n.chg>0?"+":""}{n.chg}%</span>
                </div>
                <div style={{fontSize:12,color:"#64748b"}}>{n.vibe}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1px"}}>{fmtPrice(n.med)}</div>
                <div style={{fontSize:11,color:"#64748b"}}>${fmt(pmt)}/mo (conv 20%)</div>
              </div>
            </div>
            <div style={{display:"flex",gap:16,marginTop:14,flexWrap:"wrap"}}>
              {[["DOM",`${n.dom}d`,n.dom<20?"#22c55e":n.dom<40?"#f59e0b":"#ef4444"],["Compete",`${n.score}/100`,n.score>=70?"#ef4444":n.score>=50?"#f59e0b":"#22c55e"],["$/sqft",`$${n.ppsf}`,"#a5b4fc"],["Active",n.active,"#3b82f6"],["Sold 30d",n.sold30,"#22c55e"],["Hot DOM",`${n.hot}d`,"#f59e0b"]].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{fontSize:8,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px"}}>{l}</div>
                  <div style={{fontSize:15,fontWeight:900,color:c,marginTop:1}}>{v}</div>
                </div>
              ))}
            </div>
          </div>;
        })}
      </>}

      {/* Neighborhood Detail */}
      {tab==="hoods" && hood && <>
        <button onClick={()=>setSelectedHood(null)} style={{background:"none",border:"none",color:"#6366f1",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:16,padding:0}}>← All Neighborhoods</button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:16,height:16,borderRadius:5,background:hood.color}}/>
          <h1 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1.5px",margin:0}}>{hood.name}</h1>
        </div>
        <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>{hood.vibe}</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20}}>
            <div style={{fontSize:36,fontWeight:900,color:"#f1f5f9",letterSpacing:"-2px"}}>{fmtPrice(hood.med)}</div>
            <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:6,background:hood.chg>0?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.15)",color:hood.chg>0?"#22c55e":"#ef4444"}}>{hood.chg>0?"↑":"↓"} {Math.abs(hood.chg)}% YoY</span>
            <div style={{marginTop:14}}><MiniTrend data={hood.trend} color={hood.color}/></div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:20}}>
            <div style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Monthly Payment at Median</div>
            {[{l:"Conv (20% dn)",r:RATES.conv30.rate,d:0.2},{l:"FHA (3.5% dn)",r:RATES.fha30.rate,d:0.035},{l:"VA (0% dn)",r:RATES.va30.rate,d:0}].map(x=>{
              const pmt=calcPayment(hood.med*(1-x.d),x.r);
              return <div key={x.l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                <div><div style={{fontSize:12,color:"#cbd5e1",fontWeight:600}}>{x.l}</div><div style={{fontSize:10,color:"#475569"}}>{x.r}%</div></div>
                <div style={{fontSize:18,fontWeight:900,color:"#f1f5f9"}}>${fmt(Math.round(pmt))}</div>
              </div>;
            })}
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
          {[["DOM",`${hood.dom}d`,hood.dom<20?"#22c55e":hood.dom<40?"#f59e0b":"#ef4444"],["Compete",`${hood.score}/100`,hood.score>=70?"#ef4444":hood.score>=50?"#f59e0b":"#22c55e"],["$/Sqft",`$${hood.ppsf}`,"#a5b4fc"],["Active",hood.active,"#3b82f6"],["Sold 30d",hood.sold30,"#22c55e"],["Hot DOM",`${hood.hot}d`,"#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase"}}>{l}</div>
              <div style={{fontSize:22,fontWeight:900,color:c,marginTop:3}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Schools */}
        {hood.schools.length>0 && <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:18,marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>🏫 Schools</div>
          {hood.schools.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}>
            <span style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>{s.n}</span>
            <span style={{fontSize:14,fontWeight:900,color:s.r>=9?"#22c55e":s.r>=7?"#f59e0b":"#ef4444"}}>{s.r}/10</span>
          </div>)}
        </div>}

        {/* Hood Sales */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <span style={{fontSize:10,fontWeight:700,color:"#475569",textTransform:"uppercase"}}>Recent Activity</span>
          </div>
          {SALES.filter(s=>s.hood===hood.name).map((s,i)=>(
            <div key={i} style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.03)",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <div><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{s.addr}</div><div style={{fontSize:11,color:"#64748b"}}>{s.bd}/{s.ba} · {fmt(s.sqft)}sf · ${s.ppsf}/sf · {s.dom}d</div></div>
              <div style={{display:"flex",alignItems:"center",gap:10}}><StatusBadge st={s.st}/><span style={{fontSize:15,fontWeight:900,color:"#f1f5f9"}}>{fmtPrice(s.price)}</span></div>
            </div>
          ))}
        </div>
      </>}

      {/* ═══ CONTENT ENGINE ═══ */}
      {tab==="content" && <>
        <h1 style={{fontSize:28,fontWeight:900,color:"#f1f5f9",letterSpacing:"-1.5px",margin:"0 0 6px"}}>Content Engine</h1>
        <p style={{fontSize:13,color:"#64748b",marginBottom:20}}>YouTube scripts & social posts generated from your live market data</p>

        <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
          {[{id:"market",l:"📊 Market Update"},{id:"hood",l:"🚶 Neighborhood Walk"},{id:"social",l:"📱 Social Post"}].map(t=>(
            <button key={t.id} onClick={()=>setScriptType(t.id)} style={{
              padding:"8px 14px",borderRadius:8,border:"1px solid",cursor:"pointer",fontSize:12,fontWeight:scriptType===t.id?700:400,
              borderColor:scriptType===t.id?"rgba(99,102,241,0.3)":"rgba(255,255,255,0.06)",
              background:scriptType===t.id?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.03)",
              color:scriptType===t.id?"#a5b4fc":"#64748b",
            }}>{t.l}</button>
          ))}
        </div>

        {(scriptType==="hood"||scriptType==="social") && <div style={{marginBottom:16}}>
          <select value={scriptHood} onChange={e=>setScriptHood(e.target.value)} style={{padding:"8px 12px",borderRadius:8,fontSize:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#e2e8f0",fontFamily:"inherit"}}>
            {HOODS.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>}

        {/* Generated Content */}
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,overflow:"hidden"}}>
          {scriptType==="market" && <>
            <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{fontSize:16,fontWeight:800,color:"#f1f5f9"}}>Encinitas Housing Market Update — February 2026</div>
              <div style={{fontSize:11,color:"#64748b"}}>Est. 8-12 min</div>
            </div>
            {[
              {h:"🎬 HOOK",b:`The Encinitas housing market just shifted — median at ${fmtPrice(MARKET.median)}, down ${Math.abs(MARKET.medianChange)}% YoY. But ${MARKET.sold30} homes sold last month — UP ${Math.round((MARKET.sold30/MARKET.soldPrev-1)*100)}%. Let me show you what's really happening.`},
              {h:"💰 RATES",b:`Conv 30yr: ${RATES.conv30.rate}% (down from 6.93% in Jan). On the median with 20% down: $${fmt(Math.round(calcPayment(MARKET.median*0.8,RATES.conv30.rate)))}/mo. VA at ${RATES.va30.rate}%: $${fmt(Math.round(calcPayment(MARKET.median,RATES.va30.rate)))}/mo.`},
              {h:"🏘️ NEIGHBORHOODS",b:HOODS.map(n=>`${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%) · ${n.dom}d DOM · ${n.score}/100 compete`).join("\n")},
              {h:"🔥 HOT",b:`${HOODS[3].name} — compete score ${HOODS[3].score}/100, selling in ${HOODS[3].hot} days. Up ${HOODS[3].chg}% YoY.`},
              {h:"💡 OPPORTUNITY",b:`${HOODS[4].name} — prices down ${Math.abs(HOODS[4].chg)}%, DOM at ${HOODS[4].dom}d. Room to negotiate.`},
              {h:"📣 CTA",b:`Full data at theencinitasreport.com. DM me for a custom street-level report. DRE# 02168977.`},
            ].map((s,i)=><div key={i} style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{fontSize:12,fontWeight:800,color:"#a5b4fc",marginBottom:6}}>{s.h}</div>
              <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{s.b}</div>
            </div>)}
          </>}

          {scriptType==="hood" && (()=>{
            const h=HOODS.find(n=>n.id===scriptHood)||HOODS[0];
            const sales=SALES.filter(s=>s.hood===h.name);
            return <>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontSize:16,fontWeight:800,color:"#f1f5f9"}}>{h.name} Walk — What Your Money Gets You in 2026</div>
                <div style={{fontSize:11,color:"#64748b"}}>Est. 10-15 min</div>
              </div>
              {[
                {h:"🎬 HOOK",b:`Walking through ${h.name} right now — ${h.vibe.toLowerCase()}. Let me show you the real data.`},
                {h:"📊 NUMBERS",b:`Median: ${fmtPrice(h.med)} (${h.chg>0?"+":""}${h.chg}% YoY) · DOM: ${h.dom}d · Compete: ${h.score}/100 · $/sqft: $${h.ppsf} (${h.ppsf>MARKET.ppsf?"above":"below"} city avg of $${MARKET.ppsf})`},
                {h:"🏠 WALK & TALK",b:sales.length>0?sales.map(s=>`${s.addr} — ${fmtPrice(s.price)}, ${s.bd}/${s.ba}, $${s.ppsf}/sf [${s.st}]`).join("\n"):"[Reference 3-4 homes from MLS]"},
                {h:"💵 PAYMENTS",b:`Conv 20% dn: $${fmt(Math.round(calcPayment(h.med*0.8,RATES.conv30.rate)))}/mo\nVA 0% dn: $${fmt(Math.round(calcPayment(h.med,RATES.va30.rate)))}/mo`},
                {h:"🏫 SCHOOLS",b:h.schools.map(s=>`${s.n}: ${s.r}/10`).join(" · ")},
                {h:"📣 CTA",b:`Map + data → theencinitasreport.com. DM for custom ${h.name} report. DRE# 02168977.`},
              ].map((s,i)=><div key={i} style={{padding:"14px 20px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                <div style={{fontSize:12,fontWeight:800,color:"#a5b4fc",marginBottom:6}}>{s.h}</div>
                <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{s.b}</div>
              </div>)}
            </>;
          })()}

          {scriptType==="social" && (()=>{
            const h=HOODS.find(n=>n.id===scriptHood)||HOODS[0];
            const pmt=Math.round(calcPayment(h.med*0.8,RATES.conv30.rate));
            const post=`🏘️ ${h.name} Market Snapshot\n\n🏷 Median: ${fmtPrice(h.med)}\n${h.chg>0?"📈":"📉"} ${h.chg>0?"+":""}${h.chg}% YoY\n⏱ DOM: ${h.dom}d | Hot: ${h.hot}d\n🏆 Compete: ${h.score}/100\n💰 $/sqft: $${h.ppsf}\n📊 Active: ${h.active}\n\n💵 Monthly @ ${RATES.conv30.rate}%:\nConv (20% down): $${fmt(pmt)}\nVA (0% down): $${fmt(Math.round(calcPayment(h.med,RATES.va30.rate)))}\n\nFull map → theencinitasreport.com\n\n#Encinitas #${h.name.replace(/[^a-zA-Z]/g,"")} #RealEstate #DRE02168977`;
            return <>
              <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:14,fontWeight:700,color:"#f1f5f9"}}>📱 Ready to Post</span>
                <button onClick={()=>{navigator.clipboard?.writeText(post)}} style={{padding:"6px 14px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:"rgba(99,102,241,0.15)",color:"#a5b4fc"}}>📋 Copy</button>
              </div>
              <div style={{padding:"16px 20px"}}><pre style={{fontSize:13,color:"#cbd5e1",lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:0}}>{post}</pre></div>
              <div style={{padding:"8px 20px 16px",display:"flex",gap:6}}>
                {["Instagram","TikTok","Facebook","X","LinkedIn"].map(p=><span key={p} style={{fontSize:9,padding:"3px 8px",borderRadius:5,background:"rgba(255,255,255,0.04)",color:"#64748b",fontWeight:600}}>{p}</span>)}
              </div>
            </>;
          })()}
        </div>

        <div style={{marginTop:16,padding:"14px 18px",borderRadius:12,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#a5b4fc",marginBottom:4}}>💡 Pro Tip</div>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.5}}>
            {scriptType==="market"?"Film as screen-share + talking head. Pull up theencinitasreport.com map while you narrate. The data IS the content.":
             scriptType==="hood"?"Film on location. Walk past homes, pull up data on phone. Authenticity > production value.":
             "Post with a screenshot of the map or data. Carousel format for Instagram — one stat per slide."}
          </div>
        </div>
      </>}
      </div>

      {/* Footer */}
      <div style={{padding:"20px",borderTop:"1px solid rgba(255,255,255,0.04)",textAlign:"center"}}>
        <span style={{fontSize:10,color:"#334155"}}>© 2026 The Encinitas Report · DRE# 02168977 · HomeSmart Realty West · Data: Redfin, Zillow, Freddie Mac, MLS</span>
      </div>
    </div>
  );
}
