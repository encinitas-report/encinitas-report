import { useState } from "react";

const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
const fmtPrice = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${fmt(n)}`;
const calcPayment = (p, r, y=30) => { const mr=r/100/12, n=y*12; return mr===0?p/n:p*(mr*Math.pow(1+mr,n))/(Math.pow(1+mr,n)-1); };

const T = {
  bg:"#f8fafc",card:"#ffffff",border:"#e8ecf1",
  shadow:"0 1px 3px rgba(0,0,0,0.04),0 1px 2px rgba(0,0,0,0.02)",
  text:"#1e293b",sec:"#64748b",muted:"#94a3b8",
  label:"#0891b2",brand:"#10b981",brandDk:"#059669",
  chart:"#6366f1",pos:"#10b981",neg:"#ef4444",warn:"#f59e0b",blue:"#3b82f6",
};

const RATES = {updated:"Feb 10, 2026",conv30:{rate:6.11,label:"30-Yr Fixed"},conv15:{rate:5.50,label:"15-Yr Fixed"},fha30:{rate:5.75,label:"FHA 30-Yr",note:"3.5% min down"},va30:{rate:5.375,label:"VA 30-Yr",note:"0% down"},jumbo30:{rate:6.25,label:"Jumbo 30-Yr"},arm51:{rate:5.63,label:"5/1 ARM"},
  trend:[{w:"Jan 2",r:6.91},{w:"Jan 9",r:6.93},{w:"Jan 16",r:6.89},{w:"Jan 23",r:6.87},{w:"Jan 30",r:6.63},{w:"Feb 6",r:6.11}]};

const MKT = {median:1865000,chg:-5.6,dom:45,domPrev:40,sold30:46,soldPrev:33,ppsf:976,ppsfChg:5.1,compete:66,offers:5,hotDom:12,listToSale:98,active:146,rent:2450,
  trend:[{m:"Mar '25",p:1720000},{m:"May",p:1810000},{m:"Jul",p:1920000},{m:"Sep",p:1960000},{m:"Nov",p:1890000},{m:"Jan '26",p:1865000}],
  migration:{stayPct:74,from:["Los Angeles","Raleigh","San Francisco"],to:["Portland","Nashville","Phoenix"]}};

const HOODS = [
  {id:"leucadia",name:"Leucadia",med:2990000,chg:19.6,dom:46,score:52,hot:16,ppsf:1285,active:28,sold30:8,vibe:"Surf-town soul, Coast Hwy culture",color:"#6366f1",schools:[{n:"Paul Ecke Central",r:8},{n:"Capri Elementary",r:7}]},
  {id:"old-encinitas",name:"Old Encinitas",med:2100000,chg:5.7,dom:42,score:66,hot:13,ppsf:1120,active:31,sold30:11,vibe:"Downtown walkability, village charm",color:"#0ea5e9",schools:[{n:"Flora Vista",r:8},{n:"San Dieguito Academy",r:9}]},
  {id:"new-encinitas",name:"New Encinitas",med:1452500,chg:9.2,dom:17,score:72,hot:10,ppsf:780,active:38,sold30:14,vibe:"Family-friendly, great schools",color:"#10b981",schools:[{n:"Park Dale Lane",r:9},{n:"San Dieguito Academy",r:9}]},
  {id:"olivenhain",name:"Olivenhain",med:1570000,chg:19.3,dom:11,score:86,hot:6,ppsf:690,active:22,sold30:8,vibe:"Equestrian estates, rural luxury",color:"#f59e0b",schools:[{n:"Olivenhain Pioneer",r:9}]},
  {id:"cardiff",name:"Cardiff-by-the-Sea",med:2000000,chg:-8.5,dom:39,score:55,hot:8,ppsf:1050,active:27,sold30:5,vibe:"Restaurant Row, beach village life",color:"#ef4444",schools:[{n:"Cardiff Elementary",r:8},{n:"Ada Harris",r:7}]},
];

const SALES = [
  {addr:"412 Neptune Ave",hood:"Leucadia",price:2150000,bd:3,ba:2,sqft:1820,dom:8,st:"Active"},
  {addr:"225 W D St",hood:"Old Encinitas",price:1650000,bd:2,ba:2,sqft:1450,dom:5,st:"Pending"},
  {addr:"1745 Gascony Rd",hood:"New Encinitas",price:1520000,bd:4,ba:2.5,sqft:2100,dom:12,st:"Active"},
  {addr:"3455 Lone Hill Ln",hood:"Olivenhain",price:3250000,bd:5,ba:4,sqft:4200,dom:42,st:"Price Cut"},
  {addr:"2102 Oxford Ave",hood:"Cardiff-by-the-Sea",price:2450000,bd:3,ba:2,sqft:1680,dom:3,st:"Just Listed"},
  {addr:"965 Santa Fe Dr",hood:"Old Encinitas",price:1780000,bd:3,ba:2,sqft:1720,dom:1,st:"Just Listed"},
  {addr:"560 Requeza St",hood:"Old Encinitas",price:1890000,bd:3,ba:2.5,sqft:1980,dom:21,st:"Active"},
  {addr:"1033 Hermes Ave",hood:"Leucadia",price:1975000,bd:4,ba:3,sqft:2240,dom:14,st:"Active"},
];

const Lbl = ({children,s})=><div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Crd = ({children,s,...r})=><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

function Badge({st}){
  const m={Active:[T.pos,"#ecfdf5","●"],Pending:[T.warn,"#fffbeb","◆"],"Price Cut":[T.neg,"#fef2f2","↓"],"Just Listed":[T.blue,"#eff6ff","★"]};
  const [c,bg,i]=m[st]||[T.muted,"#f1f5f9","·"];
  return <span style={{fontSize:12,fontWeight:700,padding:"4px 12px",borderRadius:20,background:bg,color:c,whiteSpace:"nowrap"}}>{i} {st}</span>;
}

function Ring({score,sz=100}){
  const r=(sz-10)/2,c=2*Math.PI*r,p=score/100;
  const col=score>=70?T.neg:score>=50?T.warn:T.pos;
  return <svg width={sz} height={sz}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6"/>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth="6" strokeDasharray={`${c*p} ${c*(1-p)}`} strokeDashoffset={c*0.25} strokeLinecap="round"/>
    <text x={sz/2} y={sz/2+1} textAnchor="middle" dominantBaseline="middle" style={{fontSize:sz*0.32,fontWeight:900,fill:T.text}}>{score}</text></svg>;
}

function Chart({data,w=320,h=100,color=T.chart}){
  if(!data||data.length<2)return null;
  const ps=data.map(d=>d.p),mn=Math.min(...ps)*0.97,mx=Math.max(...ps)*1.01;
  const pts=data.map((d,i)=>[(i/(data.length-1))*w,(h-8)-((d.p-mn)/(mx-mn))*(h-24)]);
  const pD=pts.map((p,i)=>i===0?`M${p[0]},${p[1]}`:`L${p[0]},${p[1]}`).join(" ");
  const aD=pD+` L${pts[pts.length-1][0]},${h-8} L${pts[0][0]},${h-8} Z`;
  return <svg width={w} height={h+18} style={{display:"block",width:"100%"}} viewBox={`0 0 ${w} ${h+18}`} preserveAspectRatio="none">
    <defs><linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.15"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
    <path d={aD} fill="url(#cg1)"/><path d={pD} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i===pts.length-1?4:0} fill={color} stroke="white" strokeWidth="2"/>)}
    {data.map((d,i)=><text key={`l${i}`} x={pts[i][0]} y={h+14} textAnchor="middle" style={{fontSize:9,fill:T.muted}}>{d.m}</text>)}
  </svg>;
}

function Dash(){
  const sc=Math.round((MKT.sold30/MKT.soldPrev-1)*100);
  return <>
    <div style={{marginBottom:32}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 16px",borderRadius:20,background:"#ecfdf5",marginBottom:16}}>
        <div style={{width:6,height:6,borderRadius:3,background:T.brand}}/><span style={{fontSize:11,fontWeight:700,color:T.brandDk,textTransform:"uppercase",letterSpacing:"1px"}}>Live Market Intelligence · February 2026</span>
      </div>
      <h1 style={{fontSize:48,fontWeight:900,color:T.text,letterSpacing:"-2.5px",margin:0,lineHeight:1}}>Encinitas</h1>
      <h1 style={{fontSize:48,fontWeight:900,color:T.brand,letterSpacing:"-2.5px",margin:0,lineHeight:1.1}}>Real Estate</h1>
      <p style={{fontSize:16,color:T.sec,marginTop:12,lineHeight:1.5,maxWidth:500}}>Neighborhood-level market data powered by MLS & Redfin.<br/>Updated weekly for buyers, sellers, and investors.</p>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:16,marginBottom:16}}>
      <Crd s={{padding:"24px 28px"}}><Lbl>Median Sale Price</Lbl>
        <div style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px",marginTop:6}}>{fmtPrice(MKT.median)}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
          <span style={{fontSize:13,fontWeight:700,padding:"2px 10px",borderRadius:8,background:"#fef2f2",color:T.neg}}>↓ {Math.abs(MKT.chg)}%</span>
          <span style={{fontSize:13,color:T.muted}}>vs last year · Redfin</span>
        </div>
        <div style={{marginTop:16}}><Chart data={MKT.trend}/></div>
      </Crd>
      <Crd s={{padding:"28px 20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <Ring score={MKT.compete}/><Lbl s={{marginTop:12,textAlign:"center"}}>Compete Score</Lbl>
        <div style={{fontSize:13,color:T.sec,marginTop:2}}>Somewhat competitive</div>
      </Crd>
      <Crd s={{padding:"24px 28px"}}><Lbl>Homes Sold · 30d</Lbl>
        <div style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px",marginTop:6}}>{MKT.sold30}</div>
        <span style={{fontSize:13,fontWeight:700,color:T.pos}}>↑ {sc}% YoY</span>
      </Crd>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:32}}>
      <Crd s={{padding:"24px 28px"}}><Lbl>Days on Market</Lbl>
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:6}}><span style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px"}}>{MKT.dom}</span><span style={{fontSize:16,color:T.muted}}>avg</span></div>
        <div style={{display:"flex",gap:16,marginTop:6}}><span style={{fontSize:13,fontWeight:600,color:T.warn}}>↑ {MKT.dom-MKT.domPrev} days YoY</span><span style={{fontSize:13,color:T.muted}}>Hot: {MKT.hotDom}d</span></div>
      </Crd>
      <Crd s={{padding:"24px 28px"}}><Lbl>Price / Sq Ft</Lbl>
        <div style={{fontSize:42,fontWeight:900,color:T.text,letterSpacing:"-2px",marginTop:6}}>${MKT.ppsf}</div>
        <span style={{fontSize:13,fontWeight:700,color:T.pos}}>↑ {MKT.ppsfChg}% YoY</span>
      </Crd>
    </div>

    <h2 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 4px"}}>Neighborhoods</h2>
    <p style={{fontSize:14,color:T.muted,marginBottom:20}}>Micro-market data · Redfin Compete Scores</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:32}}>
      {HOODS.map(n=>{const cc=n.score>=70?T.neg:n.score>=50?T.warn:T.pos;
        return <Crd key={n.id} s={{padding:0,overflow:"hidden"}}><div style={{height:4,background:n.color}}/>
          <div style={{padding:"18px 18px 16px"}}><div style={{fontSize:15,fontWeight:800,color:T.text}}>{n.name}</div>
            <div style={{fontSize:11,color:T.muted,marginTop:2,minHeight:30}}>{n.vibe}</div>
            <div style={{fontSize:26,fontWeight:900,color:T.text,letterSpacing:"-1px",marginTop:10}}>{fmtPrice(n.med)}</div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:12,fontWeight:700,color:n.chg>0?T.pos:T.neg}}>{n.chg>0?"↑":"↓"} {Math.abs(n.chg)}%</span>
              <span style={{fontSize:12,color:T.muted}}>{n.dom}d avg</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}><span style={{fontSize:11,color:T.sec}}>Compete</span><span style={{fontSize:13,fontWeight:800,color:cc}}>{n.score}</span></div>
            <div style={{height:4,borderRadius:2,background:"#f1f5f9",marginTop:4,overflow:"hidden"}}><div style={{height:"100%",width:`${n.score}%`,borderRadius:2,background:cc}}/></div>
            <div style={{fontSize:11,color:T.muted,marginTop:8}}>Hot homes: {n.hot}d</div>
          </div></Crd>;})}
    </div>

    <Crd s={{padding:0,overflow:"hidden",marginBottom:24}}>
      <div style={{padding:"18px 24px",display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${T.border}`}}>
        <Lbl>Recent Listings</Lbl><span style={{fontSize:12,fontWeight:700,color:T.brand,padding:"4px 12px",borderRadius:20,background:"#ecfdf5"}}>{MKT.active} active</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
        <thead><tr style={{borderBottom:`1px solid ${T.border}`}}>
          {["Address","Neighborhood","Bed/Bath","Sq Ft","Price","DOM","Status"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:10,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1px"}}>{h}</th>)}
        </tr></thead>
        <tbody>{SALES.map((s,i)=><tr key={i} style={{borderBottom:`1px solid ${T.border}`}}>
          <td style={{padding:"14px 16px",fontWeight:700,color:T.text}}>{s.addr}</td>
          <td style={{padding:"14px 16px",color:T.sec}}>{s.hood}</td>
          <td style={{padding:"14px 16px",color:T.sec}}>{s.bd}/{s.ba}</td>
          <td style={{padding:"14px 16px",color:T.sec}}>{fmt(s.sqft)}</td>
          <td style={{padding:"14px 16px",fontWeight:800,color:T.text}}>{fmtPrice(s.price)}</td>
          <td style={{padding:"14px 16px",color:T.sec}}>{s.dom}</td>
          <td style={{padding:"14px 16px"}}><Badge st={s.st}/></td>
        </tr>)}</tbody>
      </table>
    </Crd>

    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
      {[["List → Sale","98%","Near asking",T.sec],["Avg Offers","5","Per listing",T.brand],["Hot Home DOM","12d","Move fast",T.warn],["Avg Rent","$2,450","/month",T.sec]].map(([l,v,s,c])=>
        <Crd key={l} s={{padding:"20px 24px",textAlign:"center"}}><Lbl s={{textAlign:"center"}}>{l}</Lbl>
          <div style={{fontSize:36,fontWeight:900,color:T.text,letterSpacing:"-1.5px",marginTop:6}}>{v}</div>
          <div style={{fontSize:13,color:c,fontWeight:600,marginTop:2}}>{s}</div></Crd>)}
    </div>

    <Crd s={{padding:"24px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div><Lbl>Migration Trends</Lbl>
          <div style={{marginTop:8}}><span style={{fontSize:36,fontWeight:900,color:T.text,letterSpacing:"-1.5px"}}>{MKT.migration.stayPct}%</span> <span style={{fontSize:16,color:T.sec}}>of Encinitas buyers stay local</span></div>
        </div>
        <div style={{display:"flex",gap:40}}>
          <div><Lbl s={{color:T.pos}}>Moving In From</Lbl>{MKT.migration.from.map(c=><div key={c} style={{fontSize:14,color:T.text,marginTop:4}}>{c}</div>)}</div>
          <div><Lbl s={{color:T.neg}}>Moving Out To</Lbl>{MKT.migration.to.map(c=><div key={c} style={{fontSize:14,color:T.text,marginTop:4}}>{c}</div>)}</div>
        </div>
      </div>
    </Crd>
  </>;
}

function Report(){
  const [price,setPrice]=useState(MKT.median),[dp,setDp]=useState(20);
  return <>
    <h1 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 6px"}}>Property Report</h1>
    <p style={{fontSize:14,color:T.muted,marginBottom:24}}>Rates updated {RATES.updated}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
      {[RATES.conv30,RATES.conv15,RATES.fha30,RATES.va30,RATES.jumbo30,RATES.arm51].map(r=>
        <Crd key={r.label} s={{padding:"20px 24px"}}><Lbl>{r.label}</Lbl>
          <div style={{fontSize:36,fontWeight:900,color:T.text,letterSpacing:"-2px",marginTop:6}}>{r.rate}%</div>
          {r.note&&<div style={{fontSize:11,color:T.muted,marginTop:6}}>{r.note}</div>}</Crd>)}
    </div>
    <Crd s={{padding:"24px 28px",marginBottom:24}}><Lbl s={{marginBottom:14}}>30-Year Fixed Trend (2026)</Lbl>
      <div style={{display:"flex",alignItems:"flex-end",gap:10,height:100}}>
        {RATES.trend.map((t,i)=>{const mx=Math.max(...RATES.trend.map(x=>x.r)),mn=Math.min(...RATES.trend.map(x=>x.r))-0.5,pct=((t.r-mn)/(mx-mn))*100;
          return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontSize:12,fontWeight:700,color:T.text}}>{t.r}%</div>
            <div style={{width:"100%",maxWidth:50,height:`${pct}%`,minHeight:6,borderRadius:8,background:i===RATES.trend.length-1?T.chart:"#e8ecf1"}}/>
            <div style={{fontSize:9,color:T.muted}}>{t.w}</div></div>;})}
      </div>
    </Crd>
    <Crd s={{padding:"24px 28px"}}><Lbl s={{marginBottom:16}}>Payment Calculator</Lbl>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
        <div><div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:6}}>Home Price</div>
          <input type="range" min={500000} max={5000000} step={25000} value={price} onChange={e=>setPrice(+e.target.value)} style={{width:"100%",accentColor:T.brand}}/>
          <div style={{fontSize:24,fontWeight:900,color:T.text}}>{fmtPrice(price)}</div></div>
        <div><div style={{fontSize:12,fontWeight:700,color:T.sec,marginBottom:6}}>Down Payment</div>
          <input type="range" min={0} max={50} step={1} value={dp} onChange={e=>setDp(+e.target.value)} style={{width:"100%",accentColor:T.brand}}/>
          <div style={{fontSize:24,fontWeight:900,color:T.text}}>{dp}% <span style={{fontSize:14,color:T.muted}}>({fmtPrice(price*dp/100)})</span></div></div>
      </div>
      {[{...RATES.conv30,d:dp/100},{...RATES.conv15,d:dp/100,y:15},{...RATES.fha30,d:Math.max(.035,dp/100)},{...RATES.va30,d:0}].map(r=>{
        const ln=price*(1-r.d),pm=calcPayment(ln,r.rate,r.y||30);
        return <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${T.border}`}}>
          <div><div style={{fontSize:14,fontWeight:700,color:T.text}}>{r.label}</div><div style={{fontSize:12,color:T.muted}}>{r.rate}% · {fmtPrice(ln)}</div></div>
          <div style={{fontSize:22,fontWeight:900,color:T.text}}>${fmt(Math.round(pm))}<span style={{fontSize:12,color:T.muted,fontWeight:400}}>/mo</span></div></div>;})}
      <div style={{fontSize:11,color:T.muted,marginTop:12}}>P&I only. Excludes tax, insurance, HOA.</div>
    </Crd>
  </>;
}

function HomeVal(){
  const [step,setStep]=useState(1),[addr,setAddr]=useState("");
  const inp={width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${T.border}`,fontSize:15,fontFamily:"inherit",outline:"none",boxSizing:"border-box",color:T.text};
  const btn={marginTop:12,padding:"14px",borderRadius:12,border:"none",fontSize:15,fontWeight:700,background:T.brand,color:"white",cursor:"pointer",width:"100%"};
  return <>
    <h1 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 6px"}}>What's Your Home Worth?</h1>
    <p style={{fontSize:14,color:T.muted,marginBottom:24}}>Data-driven estimate using real Encinitas comps</p>
    <Crd s={{padding:32,maxWidth:550}}>
      {step===1&&<><Lbl s={{marginBottom:12}}>Enter Your Address</Lbl><input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="e.g. 412 Neptune Ave, Encinitas" style={inp}/><button onClick={()=>addr&&setStep(2)} style={btn}>Get Estimate</button></>}
      {step===2&&<><Lbl s={{marginBottom:12}}>Where should we send the report?</Lbl>{["Full Name","Email","Phone (optional)"].map(p=><input key={p} placeholder={p} style={{...inp,marginBottom:10}}/>)}<button onClick={()=>setStep(3)} style={btn}>See My Estimate</button></>}
      {step===3&&<div style={{textAlign:"center"}}><div style={{fontSize:12,fontWeight:700,color:T.brand,marginBottom:8}}>ESTIMATED VALUE</div>
        <div style={{fontSize:48,fontWeight:900,color:T.text,letterSpacing:"-2px"}}>{fmtPrice(MKT.median)}</div>
        <div style={{fontSize:14,color:T.muted,marginTop:4}}>Based on comparable sales within 0.5 mi</div>
        <div style={{marginTop:20,padding:"16px 20px",background:"#f0fdf4",borderRadius:12,textAlign:"left"}}><div style={{fontSize:13,color:T.sec}}>Want a walkthrough? I'll break down exactly how we got here.</div></div>
        <button onClick={()=>setStep(1)} style={{...btn,background:"transparent",border:`2px solid ${T.brand}`,color:T.brand}}>Request Free CMA</button>
        <div style={{fontSize:10,color:T.muted,marginTop:16}}>DRE# 02168977 · Estimates are approximate.</div></div>}
    </Crd>
  </>;
}

function Content({onLock}){
  const [hood,setHood]=useState("leucadia"),[copied,setCopied]=useState(null);
  const h=HOODS.find(n=>n.id===hood)||HOODS[0];
  const cp=Math.round(calcPayment(MKT.median*0.8,RATES.conv30.rate)),vp=Math.round(calcPayment(MKT.median,RATES.va30.rate));
  const hp=Math.round(calcPayment(h.med*0.8,RATES.conv30.rate)),hv=Math.round(calcPayment(h.med,RATES.va30.rate));
  const sc=Math.round((MKT.sold30/MKT.soldPrev-1)*100);
  const copy=(t,id)=>{navigator.clipboard?.writeText(t);setCopied(id);setTimeout(()=>setCopied(null),2000);};
  const social=`🏘️ ${h.name} Market Snapshot\n\n🏷 Median: ${fmtPrice(h.med)}\n${h.chg>0?"📈":"📉"} ${h.chg>0?"+":""}${h.chg}% YoY\n⏱ DOM: ${h.dom}d | Hot: ${h.hot}d\n🏆 Compete: ${h.score}/100\n💰 $/sqft: $${h.ppsf}\n📊 Active: ${h.active}\n\n💵 Monthly @ ${RATES.conv30.rate}%:\nConv (20% down): $${fmt(hp)}\nVA (0% down): $${fmt(hv)}\n\nFull map → theencinitasreport.com\n\n#Encinitas #${h.name.replace(/[^a-zA-Z]/g,"")} #RealEstate #DRE02168977`;

  return <>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
      <div><h1 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 4px"}}>Content Engine</h1><p style={{fontSize:14,color:T.muted,margin:0}}>YouTube scripts & social posts from live data</p></div>
      <button onClick={onLock} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"white",color:T.sec,fontSize:12,fontWeight:600,cursor:"pointer"}}>🔒 Lock</button>
    </div>
    <div style={{marginBottom:20}}><Lbl s={{marginBottom:6}}>Neighborhood</Lbl>
      <select value={hood} onChange={e=>setHood(e.target.value)} style={{padding:"10px 16px",borderRadius:10,fontSize:14,background:"white",border:`1px solid ${T.border}`,color:T.text,fontFamily:"inherit",fontWeight:600}}>
        {HOODS.map(n=><option key={n.id} value={n.id}>{n.name}</option>)}</select>
    </div>

    <Crd s={{marginBottom:16,overflow:"hidden"}}>
      <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:16,fontWeight:800,color:T.text}}>📊 Weekly Market Update</div><div style={{fontSize:12,color:T.muted}}>8-12 min</div></div>
        <button onClick={()=>copy(`HOOK: Median ${fmtPrice(MKT.median)}, down ${Math.abs(MKT.chg)}%. ${MKT.sold30} sold—UP ${sc}%. Rates ${RATES.conv30.rate}%.\n\nPAYMENT: Conv: $${fmt(cp)}/mo. VA: $${fmt(vp)}/mo.\n\nHOODS:\n${HOODS.map(n=>`${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%) ${n.dom}d ${n.score}/100`).join("\n")}\n\nCTA: theencinitasreport.com · DRE# 02168977`,"mkt")}
          style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"white",fontSize:11,fontWeight:700,color:copied==="mkt"?T.pos:T.sec,cursor:"pointer"}}>{copied==="mkt"?"✓ Copied":"📋 Copy"}</button>
      </div>
      {[{h:"🎬 HOOK",b:`Median ${fmtPrice(MKT.median)}, down ${Math.abs(MKT.chg)}% YoY. But ${MKT.sold30} sold—UP ${sc}%. $/sqft UP ${MKT.ppsfChg}%.`},
        {h:"💰 RATES",b:`Conv ${RATES.conv30.rate}% (was 6.93% in Jan). Median w/ 20% dn: $${fmt(cp)}/mo. VA: $${fmt(vp)}/mo.`},
        {h:"🏘️ NEIGHBORHOODS",b:HOODS.map(n=>`${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%) · ${n.dom}d · ${n.score}/100`).join("\n")},
        {h:"📣 CTA",b:`theencinitasreport.com — DM for custom report. DRE# 02168977.`}
      ].map((s,i)=><div key={i} style={{padding:"14px 24px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:12,fontWeight:800,color:T.label,marginBottom:4}}>{s.h}</div>
        <div style={{fontSize:14,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{s.b}</div></div>)}
    </Crd>

    <Crd s={{marginBottom:16,overflow:"hidden"}}>
      <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:16,fontWeight:800,color:T.text}}>🚶 {h.name} Walk Script</div><div style={{fontSize:12,color:T.muted}}>10-15 min on-location</div></div>
        <button onClick={()=>copy(`${h.name}: ${fmtPrice(h.med)} (${h.chg>0?"+":""}${h.chg}%) · ${h.dom}d · ${h.score}/100 · $${h.ppsf}/sf\nConv: $${fmt(hp)}/mo · VA: $${fmt(hv)}/mo\nSchools: ${h.schools.map(s=>`${s.n} ${s.r}/10`).join(", ")}`,"walk")}
          style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"white",fontSize:11,fontWeight:700,color:copied==="walk"?T.pos:T.sec,cursor:"pointer"}}>{copied==="walk"?"✓ Copied":"📋 Copy"}</button>
      </div>
      {[{h:"📊 NUMBERS",b:`Median: ${fmtPrice(h.med)} (${h.chg>0?"+":""}${h.chg}% YoY) · DOM: ${h.dom}d · Compete: ${h.score}/100\n$/sqft: $${h.ppsf} (${h.ppsf>MKT.ppsf?"above":"below"} city avg $${MKT.ppsf})\nActive: ${h.active} · Sold 30d: ${h.sold30}`},
        {h:"💵 PAYMENTS",b:`Conv (20% dn) @ ${RATES.conv30.rate}%: $${fmt(hp)}/mo\nVA (0% dn) @ ${RATES.va30.rate}%: $${fmt(hv)}/mo`},
        {h:"🏫 SCHOOLS",b:h.schools.map(s=>`${s.n}: ${s.r}/10 GreatSchools`).join("\n")}
      ].map((s,i)=><div key={i} style={{padding:"14px 24px",borderBottom:`1px solid ${T.border}`}}>
        <div style={{fontSize:12,fontWeight:800,color:T.label,marginBottom:4}}>{s.h}</div>
        <div style={{fontSize:14,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap"}}>{s.b}</div></div>)}
    </Crd>

    <Crd s={{overflow:"hidden"}}>
      <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:16,fontWeight:800,color:T.text}}>📱 Social Post — {h.name}</div>
        <button onClick={()=>copy(social,"soc")} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"white",fontSize:11,fontWeight:700,color:copied==="soc"?T.pos:T.sec,cursor:"pointer"}}>{copied==="soc"?"✓ Copied":"📋 Copy"}</button>
      </div>
      <div style={{padding:"16px 24px"}}><pre style={{fontSize:14,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:0}}>{social}</pre></div>
      <div style={{padding:"8px 24px 16px",display:"flex",gap:6}}>
        {["Instagram","TikTok","Facebook","X","LinkedIn"].map(p=><span key={p} style={{fontSize:10,padding:"4px 10px",borderRadius:6,background:"#f1f5f9",color:T.sec,fontWeight:600}}>{p}</span>)}
      </div>
    </Crd>
  </>;
}

export default function App(){
  const [tab,setTab]=useState("dash"),[unlocked,setUnlocked]=useState(false),[pass,setPass]=useState(""),[err,setErr]=useState(false);
  const unlock=()=>{if(pass==="apex2026"){setUnlocked(true);setErr(false);}else{setErr(true);setPass("");}};

  return <div style={{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif"}}>
    <nav style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"0 32px",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <div onClick={()=>setTab("dash")} style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
        <div style={{width:36,height:36,borderRadius:10,background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:13,fontWeight:900}}>ER</div>
        <div><div style={{fontSize:16,fontWeight:800,color:T.text,letterSpacing:"-0.3px",lineHeight:1.1}}>The Encinitas Report</div>
          <div style={{fontSize:10,color:T.muted,fontWeight:600}}>DRE# 02168977</div></div>
      </div>
      <div style={{display:"flex",gap:4}}>
        {[{id:"dash",l:"Dashboard"},{id:"report",l:"Property Report"},{id:"value",l:"Home Value"},{id:"content",l:"Content Engine"}].map(t=>
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",borderRadius:10,fontSize:13,fontWeight:tab===t.id?700:500,cursor:"pointer",background:"transparent",border:tab===t.id?`1.5px solid ${T.text}`:"1.5px solid transparent",color:tab===t.id?T.text:T.sec}}>{t.l}</button>)}
      </div>
    </nav>
    <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 80px"}}>
      {tab==="dash"&&<Dash/>}
      {tab==="report"&&<Report/>}
      {tab==="value"&&<HomeVal/>}
      {tab==="content"&&(unlocked?<Content onLock={()=>{setUnlocked(false);setPass("");}}/>:
        <div style={{maxWidth:400,margin:"80px auto",textAlign:"center"}}>
          <div style={{width:64,height:64,borderRadius:16,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>🔒</div>
          <h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:"0 0 8px"}}>Content Engine</h2>
          <p style={{fontSize:14,color:T.muted,marginBottom:24}}>Enter passcode to access scripts & social posts</p>
          <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&unlock()}
            placeholder="Passcode" style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${err?T.neg:T.border}`,fontSize:15,fontFamily:"inherit",textAlign:"center",outline:"none",boxSizing:"border-box",color:T.text}}/>
          {err&&<div style={{fontSize:13,color:T.neg,marginTop:8}}>Incorrect passcode</div>}
          <button onClick={unlock} style={{marginTop:12,padding:"14px",borderRadius:12,border:"none",fontSize:15,fontWeight:700,background:T.brand,color:"white",cursor:"pointer",width:"100%"}}>Unlock</button>
        </div>)}
    </div>
    <div style={{borderTop:`1px solid ${T.border}`,padding:"24px 32px",display:"flex",justifyContent:"space-between",maxWidth:1200,margin:"0 auto",flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:20,height:20,borderRadius:6,background:T.brand,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:7,fontWeight:900}}>ER</div>
        <span style={{fontSize:12,color:T.muted}}>© 2026 The Encinitas Report · DRE# 02168977</span></div>
      <span style={{fontSize:11,color:"#cbd5e1"}}>Data sourced from Redfin, Zillow & MLS. For informational purposes only.</span>
    </div>
  </div>;
}
