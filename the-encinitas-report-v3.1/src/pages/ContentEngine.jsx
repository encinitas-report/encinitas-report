import { useState, useMemo } from "react";
import { NEIGHBORHOODS, MARKET, RATES, RECENT_SALES, SCHOOLS, fmt, fmtPrice, calcPayment } from "../data/market";

const TYPES = [
  { id: "market", label: "Weekly Market Update", icon: "📊" },
  { id: "walk", label: "Neighborhood Walk", icon: "🚶" },
  { id: "sold", label: "Just Sold Breakdown", icon: "🏠" },
  { id: "buyer", label: "Buyer Strategy", icon: "🎯" },
  { id: "social", label: "Social Post", icon: "📱" },
];

function getHotCold() {
  const sorted = [...NEIGHBORHOODS].sort((a, b) => b.chg - a.chg);
  return { hot: sorted[0], cold: sorted[sorted.length - 1] };
}

function generateMarketScript() {
  const { hot, cold } = getHotCold();
  const convPmt = Math.round(calcPayment(MARKET.median * 0.8, RATES.conventional30.rate));
  const vaPmt = Math.round(calcPayment(MARKET.median, RATES.va30.rate));
  const soldChg = Math.round((MARKET.sold30 / MARKET.soldPrev - 1) * 100);

  return {
    title: `Encinitas Housing Market Update — February 2026`,
    duration: "8-12 min",
    sections: [
      {
        h: "🎬 HOOK (0:00-0:30)",
        body: `The Encinitas housing market just shifted — and most agents are NOT talking about this. Let me show you what's actually happening neighborhood by neighborhood, with real data, not Zillow guesses.\n\n[Pull up TheEncinitasReport.com on screen]`,
      },
      {
        h: "📊 THE BIG PICTURE (0:30-2:00)",
        body: `Median home price in Encinitas right now: ${fmtPrice(MARKET.median)}. That's down ${Math.abs(MARKET.medianChange)}% from last year. But here's what that headline misses...\n\n${MARKET.sold30} homes sold in the last 30 days — that's UP ${soldChg}% versus last year. More homes are actually moving. Average days on market: ${MARKET.dom} days, up from ${MARKET.domPrev} last year.\n\nPrice per square foot: $${MARKET.ppsf}, actually UP ${MARKET.ppsfChange}%. So while median dropped, the value per foot went up. That tells you the mix of homes selling shifted, not that values crashed.\n\nCompete score: ${MARKET.compete}/100. Homes still getting an average of ${MARKET.offers} offers.`,
      },
      {
        h: "💰 MONTHLY PAYMENT REALITY (2:00-3:30)",
        body: `Let's make this real. Today's 30-year conventional rate: ${RATES.conventional30.rate}%.\n\nOn the median ${fmtPrice(MARKET.median)} home with 20% down, your monthly P&I: $${fmt(convPmt)}\n\nVA buyers — zero down at ${RATES.va30.rate}%: $${fmt(vaPmt)}/month\n\nFHA with 3.5% down at ${RATES.fha30.rate}%: $${fmt(Math.round(calcPayment(MARKET.median * 0.965, RATES.fha30.rate)))}/month\n\nRates have actually dropped from 6.93% in early January to ${RATES.conventional30.rate}% today. That's meaningful — on a $1.5M loan, that saves you about $${fmt(Math.round((calcPayment(1500000, 6.93) - calcPayment(1500000, RATES.conventional30.rate))))} per month.\n\n[Show rate trend chart on screen]`,
      },
      {
        h: "🏘️ NEIGHBORHOOD BREAKDOWN (3:30-7:00)",
        body: NEIGHBORHOODS.map(n => {
          const pmt = Math.round(calcPayment(n.med * 0.8, RATES.conventional30.rate));
          return `**${n.name}** — Median: ${fmtPrice(n.med)} (${n.chg > 0 ? "+" : ""}${n.chg}% YoY)\nDOM: ${n.dom}d | Compete: ${n.score}/100 | $/sqft: $${n.ppsf}\nMonthly: $${fmt(pmt)} (conv 20% down)\n${n.chg > 15 ? "🔥 Hot — prices accelerating" : n.chg > 5 ? "📈 Steady growth" : n.chg > 0 ? "➡️ Flat" : "📉 Softening — buyer opportunity"}`;
        }).join("\n\n"),
      },
      {
        h: "🔥 THE HOTTEST MICRO-MARKET (7:00-8:30)",
        body: `${hot.name} is on fire. Median: ${fmtPrice(hot.med)}. Up ${hot.chg}% year over year.\n\nCompete score of ${hot.score}/100 — homes are selling in just ${hot.hot} days when they're priced right. ${hot.dom} days average.\n\nIf you're a buyer here, you need to be ready to move. Pre-approval in hand, no contingency games.`,
      },
      {
        h: "💡 THE OPPORTUNITY (8:30-10:00)",
        body: `${cold.name} is the contrarian play right now. Prices are ${cold.chg > 0 ? "only up" : "down"} ${Math.abs(cold.chg)}%. DOM is ${cold.dom} days — that means sellers are more motivated and there's room to negotiate.\n\nIf you've been priced out of ${hot.name}, look here. You get ${cold.vibe.toLowerCase()} at a lower entry point.`,
      },
      {
        h: "📣 CTA (10:00-end)",
        body: `I track every single sale in Encinitas at theencinitasreport.com — interactive map, real data, payment calculators. Link in the description.\n\nIf you're thinking about buying or selling in any of these neighborhoods, DM me and I'll send you a custom report for your specific street. Not an algorithm — actual analysis.\n\nDavid with HomeSmart Realty West, DRE# 02168977. See you next week.`,
      },
    ],
  };
}

function generateWalkScript(hoodId) {
  const hood = NEIGHBORHOODS.find(n => n.id === hoodId) || NEIGHBORHOODS[0];
  const sales = RECENT_SALES.filter(s => s.hood === hoodId);
  const schools = SCHOOLS.filter(s => s.hood === hoodId);
  const convPmt = Math.round(calcPayment(hood.med * 0.8, RATES.conventional30.rate));
  const fhaPmt = Math.round(calcPayment(hood.med * 0.965, RATES.fha30.rate));
  const vaPmt = Math.round(calcPayment(hood.med, RATES.va30.rate));
  const ppsfCtx = hood.ppsf > MARKET.ppsf ? `${Math.round((hood.ppsf / MARKET.ppsf - 1) * 100)}% ABOVE` : `${Math.round((1 - hood.ppsf / MARKET.ppsf) * 100)}% BELOW`;

  return {
    title: `${hood.name} Neighborhood Walk — What Your Money Gets You in 2026`,
    duration: "10-15 min",
    sections: [
      {
        h: "🎬 HOOK (0:00-0:30)",
        body: `I'm walking through ${hood.name} right now to show you what homes actually look like at different price points — and the data most agents won't share with you.\n\n[Walking shot, Coast Highway / main street]`,
      },
      {
        h: "🌊 THE VIBE (0:30-2:00)",
        body: `This is ${hood.name}. ${hood.vibe}. It's one of five distinct communities in Encinitas, and it has its own personality you can't get anywhere else.\n\n[Show street scenes, local shops, beach access, etc.]`,
      },
      {
        h: "📊 THE NUMBERS (2:00-4:00)",
        body: `[Pull up TheEncinitasReport.com on phone]\n\nMedian price: ${fmtPrice(hood.med)}. That's ${hood.chg > 0 ? "up" : "down"} ${Math.abs(hood.chg)}% from last year.\n\nAverage days on market: ${hood.dom}. Compete score: ${hood.score}/100.\n\nThere are ${hood.active} homes on the market right now and ${hood.sold30} sold in the last 30 days.\n\nPrice per square foot: $${hood.ppsf} — that's ${ppsfCtx} the Encinitas average of $${MARKET.ppsf}.`,
      },
      {
        h: "🏠 WALK & TALK (4:00-8:00)",
        body: sales.length > 0 ? sales.slice(0, 4).map((s, i) => {
          return `[Walk past ${s.addr}]\n"This one at ${s.addr} — ${fmtPrice(s.price)}, ${s.bd}bd/${s.ba}ba, ${fmt(s.sqft)} sqft. That's $${s.ppsf} per square foot. Status: ${s.st}, ${s.dom} days on market.${s.st === "Price Cut" ? " They've already cut — motivated seller." : ""}${s.st === "Just Listed" ? " Brand new — hasn't hit most agents' radar yet." : ""}"`;
        }).join("\n\n") : "[Walk past 3-4 homes, referencing listings from MLS]",
      },
      {
        h: "💵 MONTHLY PAYMENT REALITY (8:00-10:00)",
        body: `Let's make this real. On the median home here — ${fmtPrice(hood.med)} — with 20% down at today's ${RATES.conventional30.rate}% rate:\n\nConventional: $${fmt(convPmt)}/month\nFHA (3.5% down): $${fmt(fhaPmt)}/month\nVA (0% down): $${fmt(vaPmt)}/month\n\nThat's the REAL number — principal and interest only. Add maybe $${fmt(Math.round(hood.med * 0.011 / 12))} for property tax and $300-400 for insurance.`,
      },
      {
        h: "🏫 SCHOOLS (10:00-11:00)",
        body: schools.length > 0
          ? `Schools matter for values here.\n\n${schools.map(s => `${s.name} — ${s.rating}/10 GreatSchools (${s.grades})`).join("\n")}\n\n${schools.some(s => s.rating >= 9) ? "These are top-tier schools — that's a major value driver." : "Solid schools across the board."}`
          : "Check theencinitasreport.com for the full school ratings breakdown.",
      },
      {
        h: "📣 CTA (11:00-end)",
        body: `Full interactive map with every listing, compete scores, and payment calculators at theencinitasreport.com. Link in bio.\n\nWant a custom report for a specific address in ${hood.name}? DM me — I'll pull real comps, not algorithms.\n\nDavid, HomeSmart Realty West, DRE# 02168977.`,
      },
    ],
  };
}

function generateSoldScript(saleIdx) {
  const sale = RECENT_SALES[saleIdx] || RECENT_SALES[0];
  const hood = NEIGHBORHOODS.find(n => n.id === sale.hood);
  const comps = RECENT_SALES.filter(s => s.hood === sale.hood && s.addr !== sale.addr).slice(0, 3);
  const ppsfCtx = sale.ppsf > hood.ppsf ? `${Math.round((sale.ppsf / hood.ppsf - 1) * 100)}% above` : `${Math.round((1 - sale.ppsf / hood.ppsf) * 100)}% below`;

  return {
    title: `${sale.st === "Pending" ? "Under Contract" : sale.st} in ${hood.name}: ${sale.addr} — Let's Break Down the Numbers`,
    duration: "5-8 min",
    sections: [
      {
        h: "🎬 HOOK (0:00-0:20)",
        body: `This property at ${sale.addr} just hit ${sale.st.toLowerCase()} and the numbers tell an interesting story about where the ${hood.name} market is heading.`,
      },
      {
        h: "🏠 THE PROPERTY (0:20-1:30)",
        body: `${sale.addr}, ${hood.name}\n${sale.bd} bed / ${sale.ba} bath · ${fmt(sale.sqft)} sqft\nListed at ${fmtPrice(sale.price)} — that's $${sale.ppsf}/sqft\nStatus: ${sale.st} · ${sale.dom} days on market\n\n[Show property photos / walk-by if possible]`,
      },
      {
        h: "📊 PRICE PER SQFT ANALYSIS (1:30-3:00)",
        body: `At $${sale.ppsf}/sqft, this is ${ppsfCtx} the ${hood.name} average of $${hood.ppsf}/sqft.\n\n${sale.ppsf > hood.ppsf ? "Premium pricing — could be the location, condition, or lot size driving that." : "Below average for the area — could indicate condition, lot size, or that the market is softening here."}\n\nThe citywide Encinitas average is $${MARKET.ppsf}/sqft for context.`,
      },
      {
        h: "🏘️ COMP CONTEXT (3:00-5:00)",
        body: comps.length > 0
          ? `Let me pull up comps in ${hood.name}:\n\n${comps.map((c, i) => `Comp ${i + 1}: ${c.addr} — ${fmtPrice(c.price)}, $${c.ppsf}/sqft, ${c.bd}/${c.ba}, ${fmt(c.sqft)}sf (${c.st}, ${c.dom} DOM)`).join("\n\n")}\n\n[Show these on the map at theencinitasreport.com]`
          : "Check the interactive map at theencinitasreport.com for nearby comps.",
      },
      {
        h: "💡 WHAT THIS TELLS US (5:00-6:30)",
        body: `DOM was ${sale.dom} days versus the ${hood.name} average of ${hood.dom}. ${sale.dom < hood.dom ? "Faster than average — shows strong demand at this price point." : sale.dom > hood.dom * 1.5 ? "Significantly slower than average — could be priced too high or condition issues." : "Right in line with the market."}\n\nThe compete score in ${hood.name} is ${hood.score}/100. ${hood.score >= 70 ? "Very competitive — multiple offers are common." : hood.score >= 50 ? "Moderately competitive." : "Buyers have negotiating room here."}\n\n${sale.st === "Price Cut" ? "The fact they've cut price tells you sellers are adjusting expectations. Opportunity for buyers." : ""}`,
      },
      {
        h: "📣 CTA (6:30-end)",
        body: `I analyze every sale like this on theencinitasreport.com. If you want to know what YOUR home would sell for based on actual data — DM me.\n\nDavid, HomeSmart Realty West, DRE# 02168977.`,
      },
    ],
  };
}

function generateBuyerScript() {
  const valueHood = [...NEIGHBORHOODS].sort((a, b) => a.ppsf - b.ppsf)[0];
  const risingDom = NEIGHBORHOODS.filter(n => n.dom > 30).map(n => n.name);
  const convPmt = Math.round(calcPayment(MARKET.median * 0.8, RATES.conventional30.rate));
  const vaPmt = Math.round(calcPayment(MARKET.median, RATES.va30.rate));
  const fhaPmt = Math.round(calcPayment(MARKET.median * 0.965, RATES.fha30.rate));

  return {
    title: `How to Buy in Encinitas in 2026 — Data-Driven Strategy`,
    duration: "8-10 min",
    sections: [
      {
        h: "🎬 HOOK (0:00-0:30)",
        body: `Buying in Encinitas at these prices feels impossible. But the data shows there ARE real opportunities if you know where to look. I'm going to show you exactly where.`,
      },
      {
        h: "💰 REALITY CHECK (0:30-2:30)",
        body: `Median price: ${fmtPrice(MARKET.median)}.\n\nConventional 20% down: ${fmtPrice(MARKET.median * 0.2)} cash needed. Monthly P&I: $${fmt(convPmt)}\nFHA 3.5% down: ${fmtPrice(Math.round(MARKET.median * 0.035))} cash. Monthly: $${fmt(fhaPmt)}\nVA 0% down: $0 cash. Monthly: $${fmt(vaPmt)}\n\nBut the median is misleading — it includes $3M+ Leucadia beach houses dragging it up. Let me show you the real entry points.`,
      },
      {
        h: "🎯 THE VALUE PLAY (2:30-4:30)",
        body: `${valueHood.name} has the lowest price per square foot at $${valueHood.ppsf}.\n\nMedian: ${fmtPrice(valueHood.med)}. That's ${Math.round((1 - valueHood.med / MARKET.median) * 100)}% less than the city median.\n\nAnd it has a compete score of ${valueHood.score}/100. Monthly payment with 20% down: $${fmt(Math.round(calcPayment(valueHood.med * 0.8, RATES.conventional30.rate)))}.\n\n${valueHood.vibe}. You get more home for your money here.\n\n[Pull up ${valueHood.name} on theencinitasreport.com map]`,
      },
      {
        h: "⏱️ THE TIMING PLAY (4:30-6:00)",
        body: `${risingDom.length > 0 ? `Neighborhoods with high DOM: ${risingDom.join(", ")}. Higher DOM = more negotiating power.` : "Most neighborhoods are selling quickly."}\n\nThe citywide list-to-sale ratio is ${MARKET.listToSale}% — meaning there IS room to negotiate. You're not paying over asking on average.\n\nAlso watch for price cuts. Right now I'm tracking ${RECENT_SALES.filter(s => s.st === "Price Cut").length} active price reductions. Those are your strongest negotiating positions.`,
      },
      {
        h: "🎖️ VA & FHA REALITY (6:00-8:00)",
        body: `VA rate today: ${RATES.va30.rate}%. Zero down on the median = $${fmt(vaPmt)}/month.\n\nFHA with 3.5% down at ${RATES.fha30.rate}% = $${fmt(fhaPmt)}/month. Plus MIP.\n\nImportant: the conforming loan limit is $766,550. Most Encinitas homes are above that, which means jumbo territory at ${RATES.jumbo30.rate}%. But ${valueHood.name} has some homes near or below that threshold.\n\n[Show payment calculator on theencinitasreport.com]`,
      },
      {
        h: "📣 CTA (8:00-end)",
        body: `Full neighborhood comparison data at theencinitasreport.com. I update it weekly with fresh numbers.\n\nDM me for a custom buyer strategy session — free, no obligation. I'll pull the exact data for your budget and target neighborhoods.\n\nDavid, HomeSmart Realty West, DRE# 02168977.`,
      },
    ],
  };
}

function generateSocialPost(type, hoodId) {
  const hood = hoodId ? NEIGHBORHOODS.find(n => n.id === hoodId) : null;
  const { hot, cold } = getHotCold();

  if (type === "market") {
    const soldChg = Math.round((MARKET.sold30 / MARKET.soldPrev - 1) * 100);
    return `📊 Encinitas Market Update — Feb 2026

Median: ${fmtPrice(MARKET.median)}
${MARKET.medianChange > 0 ? "📈" : "📉"} ${MARKET.medianChange}% YoY
DOM: ${MARKET.dom} days (was ${MARKET.domPrev})
Sold 30d: ${MARKET.sold30} (↑${soldChg}%)
$/sqft: $${MARKET.ppsf} (+${MARKET.ppsfChange}%)
Compete: ${MARKET.compete}/100

🔥 Hottest: ${hot.name} (+${hot.chg}%)
❄️ Cooling: ${cold.name} (${cold.chg}%)

Full data → theencinitasreport.com

#EncinitasRealEstate #MarketData #SanDiego #DRE02168977`;
  }

  if (type === "hood" && hood) {
    const convPmt = Math.round(calcPayment(hood.med * 0.8, RATES.conventional30.rate));
    const vaPmt = Math.round(calcPayment(hood.med, RATES.va30.rate));
    return `🏘️ ${hood.name} Market Snapshot

🏷 Median: ${fmtPrice(hood.med)}
${hood.chg > 0 ? "📈" : "📉"} ${hood.chg > 0 ? "+" : ""}${hood.chg}% YoY
⏱ DOM: ${hood.dom}d | Hot: ${hood.hot}d
🏆 Compete: ${hood.score}/100
💰 $/sqft: $${hood.ppsf}
📊 Active: ${hood.active}

💵 Monthly @ ${RATES.conventional30.rate}%:
Conv (20% down): $${fmt(convPmt)}
VA (0% down): $${fmt(vaPmt)}

Full interactive map → theencinitasreport.com

#Encinitas #${hood.name.replace(/[^a-zA-Z]/g, "")} #RealEstate #DRE02168977`;
  }

  if (type === "rate") {
    const convPmt = Math.round(calcPayment(MARKET.median * 0.8, RATES.conventional30.rate));
    const vaPmt = Math.round(calcPayment(MARKET.median, RATES.va30.rate));
    return `📉 Mortgage Rate Update — ${RATES.updated}

🏠 30-Yr Fixed: ${RATES.conventional30.rate}%
🏠 15-Yr Fixed: ${RATES.conventional15.rate}%
🇺🇸 FHA: ${RATES.fha30.rate}%
🎖 VA: ${RATES.va30.rate}%
💎 Jumbo: ${RATES.jumbo30.rate}%

On Encinitas median (${fmtPrice(MARKET.median)}):
Conv 20% dn: $${fmt(convPmt)}/mo
VA 0% dn: $${fmt(vaPmt)}/mo

Rates dropped from 6.93% → ${RATES.conventional30.rate}% this year 📉

Calculator → theencinitasreport.com

#MortgageRates #Encinitas #HomeBuying #DRE02168977`;
  }

  if (type === "listing") {
    const sale = hoodId ? RECENT_SALES.find(s => s.hood === hoodId) : RECENT_SALES[0];
    if (!sale) return "";
    const h = NEIGHBORHOODS.find(n => n.id === sale.hood);
    const convPmt = Math.round(calcPayment(sale.price * 0.8, RATES.conventional30.rate));
    return `🔑 ${sale.st.toUpperCase()}
📍 ${sale.addr}, ${h?.name || "Encinitas"}

🛏 ${sale.bd}bd | 🛁 ${sale.ba}ba | 📐 ${fmt(sale.sqft)} sqft
💰 ${fmtPrice(sale.price)} ($${sale.ppsf}/sqft)
⏱ ${sale.dom} DOM

${h?.name || ""} median: ${fmtPrice(h?.med || MARKET.median)}
${sale.ppsf > (h?.ppsf || MARKET.ppsf) ? "⬆️ Above" : "⬇️ Below"} neighborhood avg

💵 Monthly @ ${RATES.conventional30.rate}%: $${fmt(convPmt)} (20% dn)

Map → theencinitasreport.com

#JustListed #Encinitas #${(h?.name || "").replace(/[^a-zA-Z]/g, "")} #DRE02168977`;
  }

  return "";
}

export default function ContentEngine() {
  const [type, setType] = useState("market");
  const [hood, setHood] = useState("leucadia");
  const [saleIdx, setSaleIdx] = useState(0);
  const [socialType, setSocialType] = useState("market");
  const [copied, setCopied] = useState(false);

  const script = useMemo(() => {
    if (type === "market") return generateMarketScript();
    if (type === "walk") return generateWalkScript(hood);
    if (type === "sold") return generateSoldScript(saleIdx);
    if (type === "buyer") return generateBuyerScript();
    return null;
  }, [type, hood, saleIdx]);

  const socialPost = useMemo(() => {
    return generateSocialPost(socialType, hood);
  }, [socialType, hood]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyScript = () => {
    if (!script) return;
    const full = `# ${script.title}\n\n${script.sections.map(s => `## ${s.h}\n\n${s.body}`).join("\n\n")}`;
    copyText(full);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Content Engine</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-2px", margin: 0 }}>YouTube Scripts & Social Posts</h1>
        <p style={{ fontSize: 15, color: "#64748b", marginTop: 6 }}>Auto-generated from your live market data. Every number is real.</p>
      </div>

      {/* Type Selector */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setType(t.id)} style={{
            padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: type === t.id ? 700 : 400,
            background: type === t.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
            color: type === t.id ? "#a5b4fc" : "#64748b", transition: "all 0.2s",
            borderColor: type === t.id ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Controls */}
      {(type === "walk" || type === "social") && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Neighborhood</label>
            <select value={hood} onChange={e => setHood(e.target.value)} style={{
              padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "#e2e8f0", fontFamily: "inherit",
            }}>
              {NEIGHBORHOODS.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
          {type === "social" && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Post Type</label>
              <select value={socialType} onChange={e => setSocialType(e.target.value)} style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#e2e8f0", fontFamily: "inherit",
              }}>
                <option value="market">Market Update</option>
                <option value="hood">Neighborhood Spotlight</option>
                <option value="rate">Rate Update</option>
                <option value="listing">Listing Feature</option>
              </select>
            </div>
          )}
        </div>
      )}
      {type === "sold" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Select Listing</label>
          <select value={saleIdx} onChange={e => setSaleIdx(Number(e.target.value))} style={{
            padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#e2e8f0", fontFamily: "inherit", maxWidth: 400,
          }}>
            {RECENT_SALES.map((s, i) => <option key={i} value={i}>{s.addr} — {fmtPrice(s.price)} ({s.st})</option>)}
          </select>
        </div>
      )}

      {/* SCRIPT OUTPUT */}
      {type !== "social" && script && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, overflow: "hidden",
        }}>
          <div style={{
            padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{script.title}</h2>
              <span style={{ fontSize: 12, color: "#64748b" }}>Est. {script.duration}</span>
            </div>
            <button onClick={copyScript} style={{
              padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(99,102,241,0.15)",
              color: copied ? "#22c55e" : "#a5b4fc",
            }}>{copied ? "✓ Copied" : "📋 Copy Script"}</button>
          </div>
          {script.sections.map((s, i) => (
            <div key={i} style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#a5b4fc", marginBottom: 10 }}>{s.h}</div>
              <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{s.body}</div>
            </div>
          ))}
        </div>
      )}

      {/* SOCIAL POST OUTPUT */}
      {type === "social" && (
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 16, overflow: "hidden",
        }}>
          <div style={{
            padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>📱 Ready to Post</span>
            <button onClick={() => copyText(socialPost)} style={{
              padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
              background: copied ? "rgba(34,197,94,0.2)" : "rgba(99,102,241,0.15)",
              color: copied ? "#22c55e" : "#a5b4fc",
            }}>{copied ? "✓ Copied" : "📋 Copy Post"}</button>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <pre style={{
              fontSize: 14, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-wrap",
              fontFamily: "inherit", margin: 0,
            }}>{socialPost}</pre>
          </div>
          <div style={{ padding: "12px 24px 20px", display: "flex", gap: 8 }}>
            {["Instagram", "TikTok", "Facebook", "X/Twitter", "LinkedIn"].map(p => (
              <span key={p} style={{
                fontSize: 10, padding: "4px 10px", borderRadius: 6,
                background: "rgba(255,255,255,0.04)", color: "#64748b", fontWeight: 600,
              }}>{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      <div style={{
        marginTop: 20, padding: "16px 20px", borderRadius: 12,
        background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 6 }}>💡 Pro Tip</div>
        <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          {type === "market" && "Film this as a screen-share + talking head split. Pull up theencinitasreport.com map on screen while you narrate. The data IS the content."}
          {type === "walk" && "Film on location in the neighborhood. Reference specific homes as you walk past them. Pull up the map on your phone to show data. Authenticity > production value."}
          {type === "sold" && "This format works great as a 60-90 second Reel/TikTok. Show the property, overlay the numbers, give your take. Quick and repeatable."}
          {type === "buyer" && "This positions you as the data agent. Share your screen showing the map, payment calculator, and neighborhood comparisons. End with a specific CTA."}
          {type === "social" && "Post the text version with a screenshot of the map or data. Use the carousel format for Instagram — one stat per slide."}
        </div>
      </div>
    </div>
  );
}
