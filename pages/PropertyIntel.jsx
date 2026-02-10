import { useState, useMemo } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS, RECENT_SALES, SCHOOLS, MARKET, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

/* ── MICRO-NEIGHBORHOODS (sub-areas within each neighborhood) ── */
const MICROS = {
  leucadia: [
    {name:"Beacons/Grandview",ppsf:1420,trend:8.2,vibe:"Oceanfront, walk to surf breaks",premium:"Beach proximity"},
    {name:"Coast Hwy Corridor",ppsf:1180,trend:6.1,vibe:"Walkable to shops & restaurants",premium:"Lifestyle walkability"},
    {name:"East of 101",ppsf:985,trend:4.3,vibe:"Quieter streets, larger lots",premium:"Lot size & value"},
  ],
  "old-encinitas": [
    {name:"Downtown Village",ppsf:1250,trend:7.4,vibe:"Walk to Moonlight Beach & D St",premium:"Ultimate walkability"},
    {name:"West of 101",ppsf:1380,trend:5.2,vibe:"Ocean views, coastal access",premium:"Views & beach access"},
    {name:"East Village",ppsf:920,trend:9.1,vibe:"Quieter, family-oriented",premium:"Value entry point"},
  ],
  "new-encinitas": [
    {name:"Saxony/Park Dale",ppsf:810,trend:10.3,vibe:"Top schools, family-centric",premium:"School district quality"},
    {name:"Village Park",ppsf:760,trend:8.8,vibe:"Established neighborhood, large lots",premium:"Lot size"},
    {name:"El Camino Real Corridor",ppsf:720,trend:11.2,vibe:"Convenient access, newer builds",premium:"Affordability + access"},
  ],
  olivenhain: [
    {name:"Rancho Santa Fe Rd Area",ppsf:750,trend:18.1,vibe:"Horse properties, 1+ acre lots",premium:"Equestrian lifestyle"},
    {name:"Lone Hill/Via de Caballo",ppsf:680,trend:15.4,vibe:"Custom estates, privacy",premium:"Privacy & lot size"},
    {name:"Elfin Forest Adjacent",ppsf:620,trend:22.3,vibe:"Trail access, secluded",premium:"Nature access"},
  ],
  cardiff: [
    {name:"Restaurant Row/Chesterfield",ppsf:1180,trend:-6.2,vibe:"Walk to dining & beach",premium:"Lifestyle walkability"},
    {name:"Composer District",ppsf:1050,trend:-4.8,vibe:"Mozart/Bach streets, residential",premium:"Quiet + proximity"},
    {name:"San Elijo Hills",ppsf:880,trend:-2.1,vibe:"Views, newer construction",premium:"Panoramic views"},
  ],
};

/* ── BUYER PROFILES ── */
const BUYER_PROFILES = {
  leucadia: {primary:"Remote tech workers, 30-45",budget:"$1.8M-$3.5M",features:["Surf proximity","ADU/income potential","Character/charm over size"],origin:"70% LA/Bay Area transplants",financing:"65% conventional, 15% jumbo, 12% cash, 8% VA"},
  "old-encinitas": {primary:"Young professionals & downsizers",budget:"$1.5M-$2.5M",features:["Walkability to village","Outdoor space","Historic character"],origin:"55% local move-up, 30% LA, 15% out-of-state",financing:"60% conventional, 20% jumbo, 15% cash, 5% VA"},
  "new-encinitas": {primary:"Families with school-age kids",budget:"$1.2M-$1.8M",features:["4+ bedrooms","Top-rated schools","Safe streets/cul-de-sacs"],origin:"40% local, 35% LA/Orange County, 25% military/tech relocation",financing:"55% conventional, 20% FHA, 15% VA, 10% cash"},
  olivenhain: {primary:"Executives, equestrian enthusiasts",budget:"$1.5M-$3.5M",features:["1+ acre lot","Horse facilities","Privacy & seclusion"],origin:"45% local upgrade, 30% LA, 25% out-of-state",financing:"50% jumbo, 30% cash, 15% conventional, 5% VA"},
  cardiff: {primary:"Retirees & lifestyle buyers",budget:"$1.8M-$3M",features:["Single-story","Restaurant Row proximity","Low maintenance"],origin:"50% local downsizer, 25% Northern CA, 25% East Coast",financing:"45% cash, 35% conventional, 15% jumbo, 5% VA"},
};

/* ── PRICING SCENARIOS ── */
function PricingScenarios({hood, price}) {
  const scenarios = [
    {label:"Aggressive", pct:1.05, domEst:"7-14 days", result:"Multiple offers likely", risk:"May leave money on table", color:T.neg},
    {label:"Market Value", pct:1.00, domEst:"21-35 days", result:"Strong interest, 1-3 offers", risk:"Balanced approach", color:T.brand},
    {label:"Aspirational", pct:0.95, domEst:"45-60 days", result:"Fewer showings, negotiation expected", risk:"May need price cut", color:T.warn},
    {label:"Premium", pct:0.92, domEst:"60-90+ days", result:"Limited interest", risk:"Stale listing risk", color:T.muted},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {scenarios.map(s => {
        const sp = Math.round(price * s.pct);
        const net = Math.round(sp * 0.95); // after ~5% commission + costs
        return (
          <div key={s.label} style={{padding:"16px",borderRadius:12,border:`2px solid ${s.color}22`,background:`${s.color}06`}}>
            <div style={{fontSize:12,fontWeight:800,color:s.color,marginBottom:8}}>{s.label}</div>
            <div style={{fontSize:20,fontWeight:900,color:T.text}}>{fmtPrice(sp)}</div>
            <div style={{fontSize:11,color:T.sec,marginTop:6}}>Expected DOM: {s.domEst}</div>
            <div style={{fontSize:11,color:T.sec,marginTop:2}}>{s.result}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:8,fontStyle:"italic"}}>{s.risk}</div>
            <div style={{marginTop:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
              <div style={{fontSize:10,color:T.muted}}>Est. seller net</div>
              <div style={{fontSize:16,fontWeight:800,color:T.text}}>{fmtPrice(net)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function PropertyIntel() {
  const [selectedHood, setSelectedHood] = useState("old-encinitas");
  const [inputAddr, setInputAddr] = useState("");
  const [inputBd, setInputBd] = useState(3);
  const [inputBa, setInputBa] = useState(2);
  const [inputSqft, setInputSqft] = useState(1800);
  const [generated, setGenerated] = useState(false);

  const hood = NEIGHBORHOODS.find(n => n.id === selectedHood) || NEIGHBORHOODS[0];
  const micros = MICROS[selectedHood] || [];
  const buyer = BUYER_PROFILES[selectedHood] || {};
  const hoodSales = RECENT_SALES.filter(s => s.hood === selectedHood);
  const hoodSchools = SCHOOLS.filter(s => s.hood === selectedHood);

  const estValue = Math.round(inputSqft * hood.ppsf);
  const comps = hoodSales.slice(0, 4);
  const avgCompPpsf = comps.length > 0 ? Math.round(comps.reduce((a,c) => a + c.ppsf, 0) / comps.length) : hood.ppsf;

  const generate = () => { if (inputAddr) setGenerated(true); };

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 60px"}}>
      <h1 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 6px"}}>Property Intelligence Report</h1>
      <p style={{fontSize:14,color:T.muted,marginBottom:24}}>AI-powered analysis for listing appointments — comp analysis, buyer profiles, pricing strategy</p>

      {/* ── INPUT FORM ── */}
      {!generated ? (
        <Card style={{padding:32,maxWidth:600}}>
          <Lbl style={{marginBottom:16}}>Generate Report</Lbl>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:4}}>Property Address</div>
            <input value={inputAddr} onChange={e=>setInputAddr(e.target.value)} placeholder="e.g. 560 Requeza St, Encinitas"
              style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box",color:T.text}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:4}}>Neighborhood</div>
              <select value={selectedHood} onChange={e=>setSelectedHood(e.target.value)}
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:13,background:T.card,color:T.text,fontWeight:600}}>
                {NEIGHBORHOODS.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:4}}>Beds</div>
              <input type="number" value={inputBd} onChange={e=>setInputBd(+e.target.value)} min={1} max={8}
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:14,color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:4}}>Baths</div>
              <input type="number" value={inputBa} onChange={e=>setInputBa(+e.target.value)} min={1} max={6} step={0.5}
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:14,color:T.text,boxSizing:"border-box"}}/>
            </div>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:4}}>Sq Ft</div>
              <input type="number" value={inputSqft} onChange={e=>setInputSqft(+e.target.value)} min={500} max={10000} step={50}
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1px solid ${T.border}`,fontSize:14,color:T.text,boxSizing:"border-box"}}/>
            </div>
          </div>
          <button onClick={generate} style={{
            marginTop:8,padding:"14px 32px",borderRadius:12,border:"none",fontSize:15,fontWeight:700,
            background:T.brand,color:"white",cursor:"pointer",width:"100%",
          }}>Generate Intelligence Report</button>
        </Card>
      ) : (
        <>
          {/* ── REPORT HEADER ── */}
          <Card style={{padding:"24px 28px",marginBottom:20,borderLeft:`4px solid ${hood.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
              <div>
                <Lbl style={{marginBottom:6}}>Property Intelligence Report</Lbl>
                <h2 style={{fontSize:24,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:0}}>{inputAddr}</h2>
                <div style={{fontSize:14,color:T.sec,marginTop:4}}>{hood.name} · {inputBd}bd/{inputBa}ba · {fmt(inputSqft)}sf</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:11,color:T.label,fontWeight:700}}>ESTIMATED VALUE</div>
                <div style={{fontSize:36,fontWeight:900,color:T.brand,letterSpacing:"-2px"}}>{fmtPrice(estValue)}</div>
                <div style={{fontSize:12,color:T.sec}}>${hood.ppsf}/sqft · {hood.name} median: {fmtPrice(hood.med)}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={()=>setGenerated(false)} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:T.card,color:T.sec,fontSize:12,fontWeight:600,cursor:"pointer"}}>← New Report</button>
              <button onClick={()=>{
                const el = document.getElementById("intel-report");
                if(el) window.print();
              }} style={{padding:"8px 16px",borderRadius:8,border:"none",background:T.brand,color:"white",fontSize:12,fontWeight:700,cursor:"pointer"}}>🖨️ Print Report</button>
            </div>
          </Card>

          <div id="intel-report">

          {/* ── SECTION 1: COMP ANALYSIS ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>📊 Comparable Sales Analysis</Lbl>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
              <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
                {["Address","Bd/Ba","Sq Ft","Price","$/Sqft","DOM","Status","Adj. vs Subject"].map(h =>
                  <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:10,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"0.5px"}}>{h}</th>
                )}
              </tr></thead>
              <tbody>
                {/* Subject property */}
                <tr style={{background:"#ecfdf5",borderBottom:`1px solid ${T.border}`}}>
                  <td style={{padding:"12px",fontWeight:800,color:T.brand}}>📍 {inputAddr} (Subject)</td>
                  <td style={{padding:"12px"}}>{inputBd}/{inputBa}</td>
                  <td style={{padding:"12px"}}>{fmt(inputSqft)}</td>
                  <td style={{padding:"12px",fontWeight:800}}>{fmtPrice(estValue)}</td>
                  <td style={{padding:"12px"}}>${hood.ppsf}</td>
                  <td style={{padding:"12px"}}>—</td>
                  <td style={{padding:"12px"}}>—</td>
                  <td style={{padding:"12px"}}>—</td>
                </tr>
                {comps.map((c,i) => {
                  const sqftDiff = c.sqft - inputSqft;
                  const ppsfDiff = c.ppsf - hood.ppsf;
                  const adjPct = Math.round((ppsfDiff / hood.ppsf) * 100);
                  return (
                    <tr key={i} style={{borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"12px",fontWeight:700,color:T.text}}>Comp {i+1}: {c.addr}</td>
                      <td style={{padding:"12px",color:T.sec}}>{c.bd}/{c.ba}</td>
                      <td style={{padding:"12px",color:T.sec}}>{fmt(c.sqft)}</td>
                      <td style={{padding:"12px",fontWeight:700}}>{fmtPrice(c.price)}</td>
                      <td style={{padding:"12px",fontWeight:700}}>${c.ppsf}</td>
                      <td style={{padding:"12px",color:T.sec}}>{c.dom}d</td>
                      <td style={{padding:"12px"}}><span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:c.st==="Active"?"#ecfdf5":c.st==="Pending"?"#fffbeb":"#eff6ff",color:c.st==="Active"?T.pos:c.st==="Pending"?T.warn:T.blue}}>{c.st}</span></td>
                      <td style={{padding:"12px"}}><span style={{fontWeight:700,color:adjPct>0?T.pos:adjPct<0?T.neg:T.sec}}>{adjPct>0?"+":""}{adjPct}%</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{marginTop:16,padding:"14px 18px",background:"#f8fafc",borderRadius:10}}>
              <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Analysis Summary</div>
              <div style={{fontSize:13,color:T.sec,lineHeight:1.6}}>
                Based on {comps.length} comparable properties in {hood.name}, the subject property at {fmt(inputSqft)}sf
                aligns with a $/sqft range of ${Math.min(...comps.map(c=>c.ppsf))}-${Math.max(...comps.map(c=>c.ppsf))}.
                The neighborhood average is ${hood.ppsf}/sqft. At the median rate, estimated value is {fmtPrice(estValue)}.
                {hood.chg > 10 ? ` Strong appreciation of +${hood.chg}% suggests seller leverage.` :
                 hood.chg > 0 ? ` Moderate appreciation of +${hood.chg}% supports current pricing.` :
                 ` Market softening of ${hood.chg}% may create buyer negotiation opportunity.`}
              </div>
            </div>
          </Card>

          {/* ── SECTION 2: MICRO-NEIGHBORHOOD ANALYSIS ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>🗺️ Micro-Neighborhood Analysis — {hood.name}</Lbl>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${micros.length},1fr)`,gap:12}}>
              {micros.map((m,i) => (
                <div key={i} style={{padding:"16px",borderRadius:12,border:`1px solid ${T.border}`,background:i===0?`${hood.color}08`:T.card}}>
                  <div style={{fontSize:14,fontWeight:800,color:T.text,marginBottom:4}}>{m.name}</div>
                  <div style={{fontSize:11,color:T.sec,marginBottom:10,lineHeight:1.4}}>{m.vibe}</div>
                  <div style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"-1px"}}>${m.ppsf}<span style={{fontSize:12,color:T.muted,fontWeight:400}}>/sqft</span></div>
                  <div style={{marginTop:6}}>
                    <span style={{fontSize:12,fontWeight:700,color:m.trend>0?T.pos:T.neg}}>
                      {m.trend>0?"↑":"↓"} {Math.abs(m.trend)}% YoY
                    </span>
                  </div>
                  <div style={{marginTop:8,fontSize:11,color:T.label,fontWeight:600}}>Premium: {m.premium}</div>
                  <div style={{marginTop:8,fontSize:12,color:T.text,fontWeight:700}}>
                    At {fmt(inputSqft)}sf: {fmtPrice(inputSqft * m.ppsf)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ── SECTION 3: BUYER PROFILE ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>👤 Buyer Profile — Who's Buying in {hood.name}</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div>
                {[
                  ["Primary Buyer", buyer.primary],
                  ["Budget Range", buyer.budget],
                  ["Origin", buyer.origin],
                  ["Financing", buyer.financing],
                ].map(([l,v]) => (
                  <div key={l} style={{marginBottom:14}}>
                    <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"0.5px"}}>{l}</div>
                    <div style={{fontSize:14,color:T.text,marginTop:2,fontWeight:600}}>{v}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Top Features Buyers Want</div>
                {(buyer.features||[]).map((f,i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid #f1f5f9`}}>
                    <span style={{color:T.brand,fontWeight:700}}>#{i+1}</span>
                    <span style={{fontSize:14,color:T.text}}>{f}</span>
                  </div>
                ))}
                <div style={{marginTop:16}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Market Conditions</div>
                  <div style={{display:"flex",gap:16}}>
                    <div style={{padding:"10px 16px",borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:900,color:hood.score>=70?T.neg:hood.score>=50?T.warn:T.pos}}>{hood.score}</div>
                      <div style={{fontSize:10,color:T.muted}}>Compete</div>
                    </div>
                    <div style={{padding:"10px 16px",borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:900,color:T.text}}>{hood.dom}d</div>
                      <div style={{fontSize:10,color:T.muted}}>Avg DOM</div>
                    </div>
                    <div style={{padding:"10px 16px",borderRadius:10,background:"#f8fafc",textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:900,color:T.brand}}>{hood.active}</div>
                      <div style={{fontSize:10,color:T.muted}}>Active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* ── SECTION 4: PRICING STRATEGY ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>💰 Pricing Strategy — Scenario Analysis</Lbl>
            <PricingScenarios hood={hood} price={estValue}/>
            <div style={{marginTop:16,padding:"14px 18px",background:"#fefce8",borderRadius:10,border:"1px solid #fef08a"}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:4}}>💡 Recommendation</div>
              <div style={{fontSize:13,color:T.sec,lineHeight:1.6}}>
                {hood.score >= 70
                  ? `With a compete score of ${hood.score}/100 and ${hood.hot}-day hot home timeline, this is a strong seller's market in ${hood.name}. Recommend listing at Market Value (${fmtPrice(estValue)}) with expectations of multiple offers within ${hood.hot} days. The ${hood.chg>0?`+${hood.chg}%`:hood.chg+'%'} YoY trend supports this pricing.`
                  : hood.score >= 50
                  ? `The compete score of ${hood.score}/100 indicates a balanced market in ${hood.name}. Recommend listing at Market Value (${fmtPrice(estValue)}) with realistic expectations of ${hood.dom}-day timeline. Pricing aggressively could generate strong early interest.`
                  : `With a compete score of ${hood.score}/100 in ${hood.name}, buyers have more leverage. Consider the Aggressive price point (${fmtPrice(Math.round(estValue*1.05))}) to generate quick interest, or Market Value with willingness to negotiate.`
                }
              </div>
            </div>
          </Card>

          {/* ── SECTION 5: PAYMENT SCENARIOS ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>🏦 Buyer Payment Reality at This Price</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {[
                {label:"Conventional (20% down)",rate:RATES.conventional30.rate,down:0.20},
                {label:"FHA (3.5% down)",rate:RATES.fha30.rate,down:0.035},
                {label:"VA (0% down)",rate:RATES.va30.rate,down:0},
              ].map(r => {
                const loan = estValue * (1 - r.down);
                const pmt = Math.round(calcPayment(loan, r.rate));
                const tax = Math.round(estValue * 0.011 / 12);
                const ins = 350;
                const total = pmt + tax + ins;
                return (
                  <div key={r.label} style={{padding:"16px",borderRadius:12,border:`1px solid ${T.border}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:8}}>{r.label}</div>
                    <div style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1.5px"}}>${fmt(total)}<span style={{fontSize:12,color:T.muted,fontWeight:400}}>/mo total</span></div>
                    <div style={{fontSize:12,color:T.sec,marginTop:8}}>P&I: ${fmt(pmt)} · Tax: ${fmt(tax)} · Ins: $350</div>
                    <div style={{fontSize:12,color:T.sec}}>Down: {fmtPrice(Math.round(estValue * r.down))} · Rate: {r.rate}%</div>
                    <div style={{fontSize:12,color:T.muted,marginTop:6}}>Income needed: ~${fmt(Math.round(total/0.28*12))}/yr</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* ── SECTION 6: SCHOOLS ── */}
          {hoodSchools.length > 0 && (
            <Card style={{padding:"24px 28px",marginBottom:16}}>
              <Lbl style={{marginBottom:16}}>🏫 Schools Serving This Property</Lbl>
              {hoodSchools.map((s,i) => (
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<hoodSchools.length-1?`1px solid ${T.border}`:"none"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:T.text}}>{s.name}</div>
                    <div style={{fontSize:12,color:T.sec}}>{s.grades}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:60,height:8,borderRadius:4,background:"#f1f5f9",overflow:"hidden"}}>
                      <div style={{width:`${s.rating*10}%`,height:"100%",borderRadius:4,background:s.rating>=9?T.pos:s.rating>=7?T.warn:T.neg}}/>
                    </div>
                    <span style={{fontSize:16,fontWeight:900,color:s.rating>=9?T.pos:s.rating>=7?T.warn:T.neg}}>{s.rating}/10</span>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* ── SECTION 7: MARKETING PLAN ── */}
          <Card style={{padding:"24px 28px",marginBottom:16}}>
            <Lbl style={{marginBottom:16}}>📋 Recommended Marketing Plan</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:T.text,marginBottom:10}}>Pre-Launch (Week 1)</div>
                {["Professional photography + drone aerials","3D Matterport virtual tour","Neighborhood walk-through video for YouTube/social","Coming Soon campaign to agent network + database","Targeted social ads to "+buyer.origin?.split(",")[0]].map((item,i) => (
                  <div key={i} style={{display:"flex",gap:8,padding:"6px 0"}}><span style={{color:T.brand}}>✓</span><span style={{fontSize:13,color:T.sec}}>{item}</span></div>
                ))}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:T.text,marginBottom:10}}>Launch (Week 2-4)</div>
                {[`MLS listing + syndication to 100+ sites`,`Featured on theencinitasreport.com map + dashboard`,`Open house strategy: broker open + 2 public`,`YouTube property breakdown video with data overlay`,`Instagram/TikTok walkthrough Reel`,`Email blast to ${hood.name} homeowner database`].map((item,i) => (
                  <div key={i} style={{display:"flex",gap:8,padding:"6px 0"}}><span style={{color:T.brand}}>✓</span><span style={{fontSize:13,color:T.sec}}>{item}</span></div>
                ))}
              </div>
            </div>
          </Card>

          {/* ── FOOTER ── */}
          <Card style={{padding:"20px 28px",background:"#f0fdf4",border:`1px solid #bbf7d0`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div>
                <div style={{fontSize:14,fontWeight:800,color:T.text}}>Prepared by The Encinitas Report</div>
                <div style={{fontSize:12,color:T.sec}}>DRE# 02168977 · theencinitasreport.com · Data as of {RATES.updated}</div>
              </div>
              <div style={{fontSize:11,color:T.muted,maxWidth:400}}>
                This report is for informational purposes. Values are estimates based on comparable sales and market data. 
                Consult a licensed appraiser for formal valuations.
              </div>
            </div>
          </Card>

          </div>
        </>
      )}
    </div>
  );
}
