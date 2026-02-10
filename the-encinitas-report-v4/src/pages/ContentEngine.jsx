import { useState, useMemo } from "react";
import { T } from "../theme";
import { NEIGHBORHOODS, MARKET, RATES, RECENT_SALES, SCHOOLS, fmt, fmtPrice, calcPayment } from "../data/market";

const PASSCODE = "apex2026";
const Lbl = ({children,style:s}) => <div style={{fontSize:11,fontWeight:700,color:T.label,textTransform:"uppercase",letterSpacing:"1.2px",...s}}>{children}</div>;
const Card = ({children,style:s,...r}) => <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,boxShadow:T.shadow,...s}} {...r}>{children}</div>;

function Section({h,b}) {
  return (
    <div style={{ padding:"14px 24px", borderBottom:`1px solid ${T.border}` }}>
      <div style={{ fontSize:12, fontWeight:800, color:T.label, marginBottom:4 }}>{h}</div>
      <div style={{ fontSize:14, color:T.text, lineHeight:1.7, whiteSpace:"pre-wrap" }}>{b}</div>
    </div>
  );
}

function CopyBtn({text,id,copied,onCopy}) {
  return (
    <button onClick={()=>onCopy(text,id)} style={{
      padding:"6px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.card,
      fontSize:11, fontWeight:700, color:copied===id?T.pos:T.sec, cursor:"pointer",
    }}>{copied===id?"✓ Copied":"📋 Copy"}</button>
  );
}

function ScriptCard({title,subtitle,sections,copyText,copyId,copied,onCopy}) {
  return (
    <Card style={{ marginBottom:16, overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:T.text }}>{title}</div>
          <div style={{ fontSize:12, color:T.muted }}>{subtitle}</div>
        </div>
        <CopyBtn text={copyText} id={copyId} copied={copied} onCopy={onCopy}/>
      </div>
      {sections.map((s,i) => <Section key={i} h={s.h} b={s.b}/>)}
    </Card>
  );
}

function EngineInner({onLock}) {
  const [hood, setHood] = useState("leucadia");
  const [copied, setCopied] = useState(null);

  const h = NEIGHBORHOODS.find(n => n.id === hood) || NEIGHBORHOODS[0];
  const hSales = RECENT_SALES.filter(s => s.hood === hood);
  const hSchools = SCHOOLS.filter(s => s.hood === hood);
  const cp = Math.round(calcPayment(MARKET.median*0.8, RATES.conventional30.rate));
  const vp = Math.round(calcPayment(MARKET.median, RATES.va30.rate));
  const hp = Math.round(calcPayment(h.med*0.8, RATES.conventional30.rate));
  const hv = Math.round(calcPayment(h.med, RATES.va30.rate));
  const sc = Math.round((MARKET.sold30/MARKET.soldPrev-1)*100);

  const copy = (text, id) => { navigator.clipboard?.writeText(text); setCopied(id); setTimeout(()=>setCopied(null),2000); };

  const marketScript = [
    {h:"🎬 HOOK (0:00-0:30)", b:`The Encinitas housing market just shifted — median at ${fmtPrice(MARKET.median)}, down ${Math.abs(MARKET.medianChange)}% YoY. But here's what the headline misses: ${MARKET.sold30} homes sold last month — UP ${sc}%. $/sqft UP ${MARKET.ppsfChange}%. More homes moving at higher value per foot.\n\n[Pull up TheEncinitasReport.com on screen]`},
    {h:"💰 RATES (0:30-2:00)", b:`Conv 30yr: ${RATES.conventional30.rate}% — down from 6.93% in January. On the median with 20% down: $${fmt(cp)}/mo.\nVA at ${RATES.va30.rate}%: $${fmt(vp)}/mo with zero down.\nFHA at ${RATES.fha30.rate}%: $${fmt(Math.round(calcPayment(MARKET.median*0.965, RATES.fha30.rate)))}/mo.\n\nRate drop from 6.93% → ${RATES.conventional30.rate}% on a $1.5M loan saves ~$${fmt(Math.round(calcPayment(1500000,6.93)-calcPayment(1500000,RATES.conventional30.rate)))}/month.`},
    {h:"🏘️ NEIGHBORHOOD BREAKDOWN (2:00-6:00)", b:NEIGHBORHOODS.map(n => {
      const pm = Math.round(calcPayment(n.med*0.8, RATES.conventional30.rate));
      return `${n.name}: ${fmtPrice(n.med)} (${n.chg>0?"+":""}${n.chg}%) · ${n.dom}d DOM · ${n.score}/100 compete · $${fmt(pm)}/mo\n${n.chg>15?"🔥 Hot — prices accelerating":n.chg>5?"📈 Steady growth":n.chg>0?"➡️ Flat":"📉 Softening — buyer opportunity"}`;
    }).join("\n\n")},
    {h:"🔥 HOT MARKET (6:00-7:30)", b:`Olivenhain — compete score ${NEIGHBORHOODS[3].score}/100, selling in ${NEIGHBORHOODS[3].hot} days. Up ${NEIGHBORHOODS[3].chg}% YoY. If you're a buyer here, pre-approval in hand, no contingency games.`},
    {h:"💡 THE OPPORTUNITY (7:30-9:00)", b:`Cardiff — prices down ${Math.abs(NEIGHBORHOODS[4].chg)}%, DOM at ${NEIGHBORHOODS[4].dom}d. Sellers are more motivated, room to negotiate. ${NEIGHBORHOODS[4].vibe} at a lower entry point.`},
    {h:"📣 CTA (9:00-end)", b:`I track every sale in Encinitas at theencinitasreport.com — interactive map, payment calculators, neighborhood data. Link in the description.\n\nDM me for a custom report for your specific street. Not an algorithm — actual analysis.\n\nDavid with HomeSmart Realty West, DRE# 02168977.`},
  ];

  const walkScript = [
    {h:"🎬 HOOK (0:00-0:30)", b:`Walking through ${h.name} right now — ${h.vibe.toLowerCase()}. Let me show you what homes actually look like at different price points, with the real data most agents won't share.`},
    {h:"📊 THE NUMBERS (0:30-2:30)", b:`[Pull up TheEncinitasReport.com on phone]\n\nMedian: ${fmtPrice(h.med)} (${h.chg>0?"+":""}${h.chg}% YoY)\nDOM: ${h.dom}d · Compete: ${h.score}/100\n$/sqft: $${h.ppsf} — ${h.ppsf>MARKET.ppsf?`${Math.round((h.ppsf/MARKET.ppsf-1)*100)}% ABOVE`:`${Math.round((1-h.ppsf/MARKET.ppsf)*100)}% BELOW`} the city avg of $${MARKET.ppsf}\nActive: ${h.active} listings · ${h.sold30} sold last 30 days`},
    {h:"🏠 WALK & TALK (2:30-6:00)", b:hSales.length>0 ? hSales.slice(0,4).map(s =>
      `[Walk past ${s.addr}]\n"${s.addr} — ${fmtPrice(s.price)}, ${s.bd}bd/${s.ba}ba, ${fmt(s.sqft)}sf. That's $${s.ppsf}/sqft. ${s.st}, ${s.dom} days on market.${s.st==="Price Cut"?" They've already cut — motivated seller.":""}${s.st==="Just Listed"?" Brand new — hasn't hit most agents' radar yet.":""}"`
    ).join("\n\n") : "[Walk past 3-4 homes, reference listings from MLS]"},
    {h:"💵 PAYMENT REALITY (6:00-7:30)", b:`On the median here — ${fmtPrice(h.med)} — with 20% down:\n\nConventional: $${fmt(hp)}/mo @ ${RATES.conventional30.rate}%\nVA (0% down): $${fmt(hv)}/mo @ ${RATES.va30.rate}%\n\nAdd ~$${fmt(Math.round(h.med*0.011/12))}/mo for property tax + $300-400 for insurance.`},
    {h:"🏫 SCHOOLS (7:30-8:30)", b:hSchools.length>0 ? `${hSchools.map(s => `${s.name}: ${s.rating}/10 GreatSchools (${s.grades})`).join("\n")}\n\n${hSchools.some(s=>s.rating>=9)?"Top-tier schools — major value driver.":"Solid schools across the board."}` : "Full school ratings at theencinitasreport.com."},
    {h:"📣 CTA (8:30-end)", b:`Map + data → theencinitasreport.com. DM me for a custom ${h.name} report — real comps, not algorithms.\n\nDavid, HomeSmart Realty West, DRE# 02168977.`},
  ];

  const soldScript = hSales.length > 0 ? (() => {
    const sale = hSales[0];
    const comps = hSales.filter(s => s.addr !== sale.addr).slice(0,3);
    const ppsfCtx = sale.ppsf > h.ppsf ? `${Math.round((sale.ppsf/h.ppsf-1)*100)}% above` : `${Math.round((1-sale.ppsf/h.ppsf)*100)}% below`;
    return [
      {h:"🎬 HOOK", b:`${sale.addr} just hit ${sale.st.toLowerCase()} in ${h.name}. Let's break down the numbers.`},
      {h:"🏠 THE PROPERTY", b:`${sale.addr} · ${sale.bd}bd/${sale.ba}ba · ${fmt(sale.sqft)}sf\n${fmtPrice(sale.price)} ($${sale.ppsf}/sqft) · ${sale.dom} DOM · ${sale.st}`},
      {h:"📊 ANALYSIS", b:`At $${sale.ppsf}/sqft, this is ${ppsfCtx} the ${h.name} avg of $${h.ppsf}/sqft.\n\n${comps.length>0?"Nearby comps:\n"+comps.map((c,i)=>`${i+1}. ${c.addr} — ${fmtPrice(c.price)}, $${c.ppsf}/sqft (${c.st})`).join("\n"):""}`},
      {h:"📣 CTA", b:`Analysis on every sale → theencinitasreport.com. DRE# 02168977.`},
    ];
  })() : [{h:"Select a neighborhood with active sales",b:""}];

  const buyerScript = (() => {
    const valueHood = [...NEIGHBORHOODS].sort((a,b) => a.ppsf - b.ppsf)[0];
    return [
      {h:"🎬 HOOK", b:`Buying in Encinitas at ${fmtPrice(MARKET.median)} median feels impossible. But the data shows real opportunities.`},
      {h:"💰 ENTRY POINTS", b:`${valueHood.name}: lowest $/sqft at $${valueHood.ppsf}. Median ${fmtPrice(valueHood.med)} — ${Math.round((1-valueHood.med/MARKET.median)*100)}% less than city median.\nConv 20% dn: $${fmt(Math.round(calcPayment(valueHood.med*0.8,RATES.conventional30.rate)))}/mo`},
      {h:"⏱️ TIMING", b:`City list-to-sale: ${MARKET.listToSale}%. Room to negotiate.\n${RECENT_SALES.filter(s=>s.st==="Price Cut").length} active price cuts right now.`},
      {h:"🎖️ VA/FHA", b:`VA: ${RATES.va30.rate}% zero down → $${fmt(Math.round(calcPayment(MARKET.median,RATES.va30.rate)))}/mo on median\nFHA: ${RATES.fha30.rate}% → $${fmt(Math.round(calcPayment(MARKET.median*0.965,RATES.fha30.rate)))}/mo`},
      {h:"📣 CTA", b:`theencinitasreport.com for neighborhood comparisons. DM for free buyer strategy. DRE# 02168977.`},
    ];
  })();

  const socialPost = `🏘️ ${h.name} Market Snapshot\n\n🏷 Median: ${fmtPrice(h.med)}\n${h.chg>0?"📈":"📉"} ${h.chg>0?"+":""}${h.chg}% YoY\n⏱ DOM: ${h.dom}d | Hot: ${h.hot}d\n🏆 Compete: ${h.score}/100\n💰 $/sqft: $${h.ppsf}\n📊 Active: ${h.active}\n\n💵 Monthly @ ${RATES.conventional30.rate}%:\nConv (20% down): $${fmt(hp)}\nVA (0% down): $${fmt(hv)}\n\nFull map → theencinitasreport.com\n\n#Encinitas #${h.name.replace(/[^a-zA-Z]/g,"")} #RealEstate #DRE02168977`;

  const ratePost = `📉 Mortgage Rate Update — ${RATES.updated}\n\n🏠 30-Yr Fixed: ${RATES.conventional30.rate}%\n🏠 15-Yr Fixed: ${RATES.conventional15.rate}%\n🇺🇸 FHA: ${RATES.fha30.rate}%\n🎖 VA: ${RATES.va30.rate}%\n💎 Jumbo: ${RATES.jumbo30.rate}%\n\nOn Encinitas median (${fmtPrice(MARKET.median)}):\nConv 20% dn: $${fmt(cp)}/mo\nVA 0% dn: $${fmt(vp)}/mo\n\nRates dropped from 6.93% → ${RATES.conventional30.rate}% this year 📉\n\nCalculator → theencinitasreport.com\n\n#MortgageRates #Encinitas #HomeBuying #DRE02168977`;

  const marketPost = `📊 Encinitas Market Update — Feb 2026\n\nMedian: ${fmtPrice(MARKET.median)}\n${MARKET.medianChange>0?"📈":"📉"} ${MARKET.medianChange}% YoY\nDOM: ${MARKET.dom} days\nSold 30d: ${MARKET.sold30} (↑${sc}%)\n$/sqft: $${MARKET.ppsf} (+${MARKET.ppsfChange}%)\nCompete: ${MARKET.compete}/100\n\n🔥 Hottest: Olivenhain (+${NEIGHBORHOODS[3].chg}%)\n❄️ Cooling: Cardiff (${NEIGHBORHOODS[4].chg}%)\n\nFull data → theencinitasreport.com\n\n#EncinitasRealEstate #MarketData #SanDiego #DRE02168977`;

  const [scriptType, setScriptType] = useState("market");
  const [socialType, setSocialType] = useState("hood");

  return <>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
      <div>
        <h1 style={{ fontSize:28, fontWeight:900, color:T.text, letterSpacing:"-1px", margin:"0 0 4px" }}>Content Engine</h1>
        <p style={{ fontSize:14, color:T.muted, margin:0 }}>YouTube scripts & social posts generated from your live market data</p>
      </div>
      <button onClick={onLock} style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${T.border}`, background:T.card, color:T.sec, fontSize:12, fontWeight:600, cursor:"pointer" }}>🔒 Lock</button>
    </div>

    {/* Controls */}
    <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap", alignItems:"flex-end" }}>
      <div>
        <Lbl style={{ marginBottom:6 }}>Neighborhood</Lbl>
        <select value={hood} onChange={e=>setHood(e.target.value)} style={{ padding:"10px 16px", borderRadius:10, fontSize:14, background:T.card, border:`1px solid ${T.border}`, color:T.text, fontFamily:"inherit", fontWeight:600 }}>
          {NEIGHBORHOODS.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
        </select>
      </div>
      <div>
        <Lbl style={{ marginBottom:6 }}>Script Type</Lbl>
        <div style={{ display:"flex", gap:4 }}>
          {[{id:"market",l:"📊 Market"},{id:"walk",l:"🚶 Walk"},{id:"sold",l:"🏠 Sold"},{id:"buyer",l:"🎯 Buyer"}].map(t => (
            <button key={t.id} onClick={()=>setScriptType(t.id)} style={{
              padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:scriptType===t.id?700:400, cursor:"pointer",
              border:`1px solid ${scriptType===t.id?T.brand:T.border}`,
              background:scriptType===t.id?"#ecfdf5":T.card,
              color:scriptType===t.id?T.brandDk:T.sec,
            }}>{t.l}</button>
          ))}
        </div>
      </div>
    </div>

    {/* YouTube Script */}
    <ScriptCard
      title={scriptType==="market"?"Weekly Market Update":scriptType==="walk"?`${h.name} Neighborhood Walk`:scriptType==="sold"?"Just Sold Breakdown":"Buyer Strategy Guide"}
      subtitle={scriptType==="market"?"8-12 min · Screen share":scriptType==="walk"?"10-15 min · On-location":scriptType==="sold"?"5-8 min · Property spotlight":"8-10 min · Data-driven"}
      sections={scriptType==="market"?marketScript:scriptType==="walk"?walkScript:scriptType==="sold"?soldScript:buyerScript}
      copyText={(scriptType==="market"?marketScript:scriptType==="walk"?walkScript:scriptType==="sold"?soldScript:buyerScript).map(s=>`${s.h}\n${s.b}`).join("\n\n")}
      copyId="script" copied={copied} onCopy={copy}
    />

    {/* Social Posts */}
    <div style={{ marginTop:32, marginBottom:16 }}>
      <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:"0 0 12px" }}>Social Posts</h2>
      <div style={{ display:"flex", gap:4, marginBottom:16 }}>
        {[{id:"hood",l:"Neighborhood"},{id:"market",l:"Market Update"},{id:"rate",l:"Rate Update"}].map(t => (
          <button key={t.id} onClick={()=>setSocialType(t.id)} style={{
            padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:socialType===t.id?700:400, cursor:"pointer",
            border:`1px solid ${socialType===t.id?T.brand:T.border}`,
            background:socialType===t.id?"#ecfdf5":T.card,
            color:socialType===t.id?T.brandDk:T.sec,
          }}>{t.l}</button>
        ))}
      </div>
    </div>

    <Card style={{ overflow:"hidden" }}>
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:14, fontWeight:700, color:T.text }}>📱 Ready to Post</div>
        <CopyBtn text={socialType==="hood"?socialPost:socialType==="market"?marketPost:ratePost} id="social" copied={copied} onCopy={copy}/>
      </div>
      <div style={{ padding:"16px 24px" }}>
        <pre style={{ fontSize:14, color:T.text, lineHeight:1.7, whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0 }}>
          {socialType==="hood"?socialPost:socialType==="market"?marketPost:ratePost}
        </pre>
      </div>
      <div style={{ padding:"8px 24px 16px", display:"flex", gap:6 }}>
        {["Instagram","TikTok","Facebook","X","LinkedIn"].map(p =>
          <span key={p} style={{ fontSize:10, padding:"4px 10px", borderRadius:6, background:"#f1f5f9", color:T.sec, fontWeight:600 }}>{p}</span>
        )}
      </div>
    </Card>

    {/* Pro Tips */}
    <Card style={{ marginTop:20, padding:"16px 20px", background:"#f0fdf4", border:`1px solid #bbf7d0` }}>
      <div style={{ fontSize:12, fontWeight:700, color:T.brandDk, marginBottom:6 }}>💡 Pro Tips</div>
      <div style={{ fontSize:13, color:T.sec, lineHeight:1.6 }}>
        {scriptType==="market" && "Film as screen-share + talking head split. Pull up theencinitasreport.com map on screen while you narrate. The data IS the content."}
        {scriptType==="walk" && "Film on location in the neighborhood. Reference specific homes as you walk past. Pull up the map on your phone. Authenticity > production value."}
        {scriptType==="sold" && "This format works as a 60-90 second Reel/TikTok. Show the property, overlay numbers, give your take. Quick and repeatable."}
        {scriptType==="buyer" && "Position yourself as the data agent. Screen-share the map, payment calculator, neighborhood comparisons. End with a specific CTA."}
      </div>
    </Card>
  </>;
}

export default function ContentEngine() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  const unlock = () => {
    if (pass === PASSCODE) { setUnlocked(true); setErr(false); }
    else { setErr(true); setPass(""); }
  };

  if (unlocked) {
    return (
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
        <EngineInner onLock={()=>{ setUnlocked(false); setPass(""); }}/>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"32px 32px 60px" }}>
      <div style={{ maxWidth:400, margin:"80px auto", textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:16, background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>🔒</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:T.text, margin:"0 0 8px" }}>Content Engine</h2>
        <p style={{ fontSize:14, color:T.muted, marginBottom:24 }}>Enter your passcode to access YouTube scripts & social posts</p>
        <input
          type="password" value={pass}
          onChange={e=>{ setPass(e.target.value); setErr(false); }}
          onKeyDown={e=>e.key==="Enter"&&unlock()}
          placeholder="Passcode"
          style={{
            width:"100%", padding:"14px 16px", borderRadius:12,
            border:`1.5px solid ${err?T.neg:T.border}`,
            fontSize:15, fontFamily:"inherit", textAlign:"center",
            outline:"none", boxSizing:"border-box", color:T.text,
          }}
        />
        {err && <div style={{ fontSize:13, color:T.neg, marginTop:8 }}>Incorrect passcode</div>}
        <button onClick={unlock} style={{
          marginTop:12, padding:"14px 32px", borderRadius:12, border:"none",
          fontSize:15, fontWeight:700, background:T.brand, color:"white",
          cursor:"pointer", width:"100%",
        }}>Unlock</button>
      </div>
    </div>
  );
}
