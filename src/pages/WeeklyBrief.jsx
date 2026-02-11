import { useState } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS, RECENT_SALES, MARKET, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

const PASSCODE = "apex2026";

function BriefInner({onLock}) {
  const [copied, setCopied] = useState(null);
  const copy = (text, id) => { navigator.clipboard?.writeText(text); setCopied(id); setTimeout(()=>setCopied(null), 2000); };

  const sc = Math.round((MARKET.sold30/MARKET.soldPrev-1)*100);
  const cp = Math.round(calcPayment(MARKET.median*0.8, RATES.conventional30.rate));
  const vp = Math.round(calcPayment(MARKET.median, RATES.va30.rate));
  const hottest = [...NEIGHBORHOODS].sort((a,b) => b.chg - a.chg)[0];
  const coolest = [...NEIGHBORHOODS].sort((a,b) => a.chg - b.chg)[0];
  const fastestSelling = [...NEIGHBORHOODS].sort((a,b) => a.dom - b.dom)[0];
  const priceCuts = RECENT_SALES.filter(s => s.st === "Price Cut").length;
  const justListed = RECENT_SALES.filter(s => s.st === "Just Listed").length;
  const pending = RECENT_SALES.filter(s => s.st === "Pending").length;

  const dateStr = new Date().toLocaleDateString("en-US", { month:"long", day:"numeric", year:"numeric" });
  const weekOf = `Week of ${new Date().toLocaleDateString("en-US", { month:"short", day:"numeric" })}`;

  /* ── EMAIL BRIEF ── */
  const emailBrief = `Subject: Encinitas Market Intel — ${weekOf}

${fmtPrice(MARKET.median)} median | ${MARKET.sold30} sold | ${RATES.conventional30.rate}% rates

Hey [Name],

Here's your weekly snapshot of the Encinitas housing market.

THE BIG PICTURE
• Median sale price: ${fmtPrice(MARKET.median)} (${MARKET.medianChange>0?"+":""}${MARKET.medianChange}% YoY)
• Homes sold (30d): ${MARKET.sold30} — up ${sc}% vs last year
• $/sqft: $${MARKET.ppsf} (+${MARKET.ppsfChange}% YoY)
• Days on market: ${MARKET.dom} avg (hot homes: ${MARKET.hotDom}d)
• Compete score: ${MARKET.compete}/100 — somewhat competitive

RATES UPDATE (${RATES.updated})
• 30-Year Fixed: ${RATES.conventional30.rate}% (down from 6.93% in January!)
• VA: ${RATES.va30.rate}% | FHA: ${RATES.fha30.rate}%
• On the Encinitas median with 20% down: $${fmt(cp)}/mo
• Rate drop from 6.93% → ${RATES.conventional30.rate}% saves ~$${fmt(Math.round(calcPayment(1500000,6.93)-calcPayment(1500000,RATES.conventional30.rate)))}/mo on a $1.5M loan

NEIGHBORHOOD BREAKDOWN
${NEIGHBORHOODS.map(n => `${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%) · ${n.dom}d DOM · ${n.score}/100 compete`).join("\n")}

🔥 HOTTEST: ${hottest.name} (+${hottest.chg}% YoY, selling in ${hottest.hot}d)
❄️ OPPORTUNITY: ${coolest.name} (${coolest.chg}%, more negotiating room)
⚡ FASTEST: ${fastestSelling.name} (${fastestSelling.dom}d avg DOM)

THIS WEEK'S ACTIVITY
• ${justListed} just listed | ${pending} went pending | ${priceCuts} price cuts
• ${MARKET.active} total active listings

WHAT THIS MEANS FOR YOU
${MARKET.medianChange < 0
  ? "Median prices are softening, but volume is UP — more transactions at slightly lower price points. If you're a buyer, there's more negotiating room than 6 months ago. If you're a seller, pricing right from day one is critical."
  : "Prices continue to appreciate with strong demand. Sellers are in a good position but overpricing still gets punished. Buyers need to move decisively on well-priced homes."}

See the full interactive map + data: TheEncinitasReport.com

Want a custom report for your specific property or neighborhood? Just reply to this email.

David
The Encinitas Report
HomeSmart Realty West · DRE# 02168977
TheEncinitasReport.com`;

  /* ── SMS VERSION ── */
  const smsBrief = `📊 Encinitas Market ${weekOf}

Median: ${fmtPrice(MARKET.median)} (${MARKET.medianChange}%)
Sold: ${MARKET.sold30} (↑${sc}%)
Rates: ${RATES.conventional30.rate}%
DOM: ${MARKET.dom}d

🔥 ${hottest.name} +${hottest.chg}%
❄️ ${coolest.name} ${coolest.chg}%

Full data → TheEncinitasReport.com`;

  /* ── SOCIAL CAPTION ── */
  const socialBrief = `📊 Encinitas Weekly Market Update — ${weekOf}

The headline: Median at ${fmtPrice(MARKET.median)} (${MARKET.medianChange}% YoY), but ${MARKET.sold30} homes sold — UP ${sc}%.

The real story: More transactions, lower median, but $/sqft is UP ${MARKET.ppsfChange}%. Translation: homes are selling at higher value per foot — the median drop is a mix shift, not a crash.

Rates just dropped to ${RATES.conventional30.rate}% from 6.93% in January. On a $1.5M home, that saves $${fmt(Math.round(calcPayment(1500000,6.93)-calcPayment(1500000,RATES.conventional30.rate)))}/month.

Neighborhood breakdown:
${NEIGHBORHOODS.map(n => `${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%)`).join("\n")}

Interactive map + full data → TheEncinitasReport.com (link in bio)

#Encinitas #EncinitasRealEstate #SanDiegoHomes #MarketData #NorthCounty #CoastalLiving #RealEstateData #DRE02168977`;

  const items = [
    { id:"email", title:"📧 Email Newsletter", subtitle:"Full weekly brief for your database", content:emailBrief },
    { id:"sms", title:"📱 SMS Update", subtitle:"Short update for text campaigns", content:smsBrief },
    { id:"social", title:"📲 Social Caption", subtitle:"For Instagram, LinkedIn, Facebook", content:socialBrief },
  ];

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h1 style={{fontSize:28,fontWeight:900,color:T.text,letterSpacing:"-1px",margin:"0 0 6px"}}>Weekly Market Brief</h1>
          <p style={{fontSize:14,color:T.muted,marginBottom:6}}>Auto-generated from your live market data — copy and send to your database</p>
          <p style={{fontSize:12,color:T.muted,marginBottom:0}}>Generated {dateStr} · Data refreshed weekly</p>
        </div>
        <button onClick={onLock} style={{padding:"8px 16px",borderRadius:8,border:`1px solid ${T.border}`,background:"white",color:T.sec,fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0}}>🔒 Lock</button>
      </div>

      {/* Quick Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:24}}>
        {[
          [fmtPrice(MARKET.median), `${MARKET.medianChange}% YoY`, "Median"],
          [MARKET.sold30, `↑${sc}%`, "Sold 30d"],
          [`${RATES.conventional30.rate}%`, "30yr Fixed", "Rate"],
          [MARKET.dom+"d", `Hot: ${MARKET.hotDom}d`, "DOM"],
          [MARKET.active, `${priceCuts} cuts`, "Active"],
        ].map(([v,s,l],i) => (
          <Card key={i} style={{padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,color:T.text,letterSpacing:"-1px"}}>{v}</div>
            <div style={{fontSize:11,color:T.pos,fontWeight:600}}>{s}</div>
            <div style={{fontSize:10,color:T.muted,marginTop:2}}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Brief Cards */}
      {items.map(item => (
        <Card key={item.id} style={{marginBottom:16,overflow:"hidden"}}>
          <div style={{padding:"16px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:16,fontWeight:800,color:T.text}}>{item.title}</div>
              <div style={{fontSize:12,color:T.muted}}>{item.subtitle}</div>
            </div>
            <button onClick={()=>copy(item.content, item.id)} style={{
              padding:"8px 18px",borderRadius:8,border:`1px solid ${T.border}`,
              background:T.card,fontSize:12,fontWeight:700,cursor:"pointer",
              color:copied===item.id?T.pos:T.sec,
            }}>{copied===item.id?"✓ Copied":"📋 Copy"}</button>
          </div>
          <div style={{padding:"16px 24px",maxHeight:300,overflowY:"auto"}}>
            <pre style={{fontSize:13,color:T.text,lineHeight:1.7,whiteSpace:"pre-wrap",fontFamily:"inherit",margin:0}}>{item.content}</pre>
          </div>
        </Card>
      ))}

      {/* Pro Tips */}
      <Card style={{padding:"20px 24px",background:"#f0fdf4",border:"1px solid #bbf7d0"}}>
        <div style={{fontSize:12,fontWeight:700,color:T.brandDk,marginBottom:8}}>💡 Distribution Strategy</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Monday AM</div>
            <div style={{fontSize:12,color:T.sec,lineHeight:1.5}}>Send email newsletter to your database. Best open rates 8-10am Tuesday.</div>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Wednesday</div>
            <div style={{fontSize:12,color:T.sec,lineHeight:1.5}}>Post social version on Instagram + LinkedIn. Use carousel format with 5 slides.</div>
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:4}}>Friday</div>
            <div style={{fontSize:12,color:T.sec,lineHeight:1.5}}>Film neighborhood walk video using the data as talking points. Post on YouTube + TikTok.</div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default function WeeklyBrief() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  const unlock = () => {
    if (pass === PASSCODE) { setUnlocked(true); setErr(false); }
    else { setErr(true); setPass(""); }
  };

  if (unlocked) {
    return (
      <div style={{maxWidth:1200,margin:"0 auto",padding:"32px 32px 60px"}}>
        <BriefInner onLock={()=>{ setUnlocked(false); setPass(""); }}/>
      </div>
    );
  }

  return (
    <div style={{maxWidth:400,margin:"80px auto",textAlign:"center",padding:"0 20px"}}>
      <div style={{width:64,height:64,borderRadius:16,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28}}>🔒</div>
      <h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:"0 0 8px"}}>Weekly Market Brief</h2>
      <p style={{fontSize:14,color:T.muted,marginBottom:24}}>Enter passcode to access</p>
      <input
        type="password" value={pass}
        onChange={e=>{ setPass(e.target.value); setErr(false); }}
        onKeyDown={e=>e.key==="Enter"&&unlock()}
        placeholder="Passcode"
        style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${err?T.neg:T.border}`,fontSize:15,textAlign:"center",outline:"none",boxSizing:"border-box",fontFamily:"inherit",color:T.text}}
      />
      {err && <div style={{fontSize:13,color:T.neg,marginTop:8}}>Incorrect passcode</div>}
      <button onClick={unlock} style={{
        marginTop:12,padding:"14px",borderRadius:12,border:"none",
        fontSize:15,fontWeight:700,background:T.brand,color:"white",cursor:"pointer",width:"100%",
      }}>Unlock</button>
    </div>
  );
}
