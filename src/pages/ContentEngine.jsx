import { useState } from "react";
import { MARKET, fmt, fmtPrice } from "../data";
import { Reveal, GlowCard, Tag, GradientText, Footer } from "../components/ui";

export default function ContentEngine() {
  const [cat, setCat] = useState("Market Update");
  const [plat, setPlat] = useState("Instagram");
  const [out, setOut] = useState(null);
  const [ld, setLd] = useState(false);
  const [copied, setCopied] = useState(false);

  const cats = ["Market Update", "Neighborhood Spotlight", "Just Listed", "Buyer/Seller Tip"];
  const plats = ["Instagram", "Facebook", "LinkedIn", "X"];
  const hot = MARKET.neighborhoods.reduce((a, b) => (a.chg > b.chg ? a : b));

  const tpl = {
    "Market Update": `📊 Encinitas Market Update — Feb 2026\n\nMedian home price: $${fmt(MARKET.median)}\nAvg days on market: ${MARKET.dom}\nHomes sold (last 30 days): ${MARKET.sold30} (↑39% YoY)\nPrice/sqft: $${MARKET.ppsf} (+${MARKET.ppsfChange}% YoY)\nCompete Score: ${MARKET.compete}/100\n\nThe market is somewhat competitive. Hot homes go pending in just ${MARKET.hotDom} days with ${MARKET.offers} avg offers.\n\n${hot.name} leads with +${hot.chg}% YoY growth · $${fmt(hot.med)} median.\n\nThinking about a move? DM me for a personalized analysis.\n\n#EncinitasRealEstate #CoastalLiving #MarketUpdate #SanDiegoHomes #DRE02168977`,

    "Neighborhood Spotlight": `🌊 Neighborhood Spotlight: ${hot.name}\n\n🏷 Median: $${fmt(hot.med)}\n📈 YoY Change: +${hot.chg}%\n⏱ Avg DOM: ${hot.dom} days | Hot: ${hot.hot}d\n🏆 Compete Score: ${hot.score}/100\n🏄 Vibe: ${hot.vibe}\n\n${hot.name} is one of the strongest micro-markets in North County coastal right now. With homes moving in ${hot.dom} days, demand is real.\n\nCurious about values? I track every sale — DM me.\n\n#Encinitas #${hot.name.replace(/[\s-]/g, "")} #CoastalLiving #NorthCounty #DRE02168977`,

    "Just Listed": `🔑 JUST LISTED: ${MARKET.listings[0].addr}\n\n🛏 ${MARKET.listings[0].bd} bed | 🛁 ${MARKET.listings[0].ba} bath | 📐 ${fmt(MARKET.listings[0].sqft)} sqft\n💰 ${fmtPrice(MARKET.listings[0].price)}\n📍 ${MARKET.listings[0].hood}, Encinitas\n\nAt $${Math.round(MARKET.listings[0].price / MARKET.listings[0].sqft)}/sqft. Hot homes in this area go pending in ${MARKET.hotDom} days.\n\nWant early access to listings? DM me.\n\n#JustListed #Encinitas #${MARKET.listings[0].hood.replace(/[\s-]/g, "")} #CoastalProperty #DRE02168977`,

    "Buyer/Seller Tip": `💡 Seller Tip of the Week\n\nEncinitas homes avg ${MARKET.dom} days on market (up from ${MARKET.domPrev} last year). Presentation is everything.\n\n→ Pro photos: sell 32% faster\n→ Pre-inspections: reduce fallout by 50%\n→ Staging: 5-10% higher sale price\n\nList-to-sale ratio: ${MARKET.listToSale}%. You're getting near-asking — but the gap between a quick sale and sitting? Prep.\n\nNeed a custom strategy? DM me.\n\n#RealEstateTips #Encinitas #HomeSelling #DRE02168977`,
  };

  const gen = () => {
    setLd(true);
    setCopied(false);
    setTimeout(() => {
      let c = tpl[cat];
      if (plat === "X") c = c.split("\n").filter((l) => l.trim()).slice(0, 4).join("\n").substring(0, 275) + "...";
      if (plat === "LinkedIn") c = c.replace(/#\w+/g, "").trim() + "\n\n—\nDRE# 02168977 · The Encinitas Report";
      setOut(c);
      setLd(false);
    }, 1300);
  };

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 120px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <Tag color="#f59e0b">AI Content Studio</Tag>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-2.5px", margin: "20px 0 0", lineHeight: 1 }}>
          Content <GradientText>Engine</GradientText>
        </h1>
        <p style={{ fontSize: 17, color: "#64748b", marginTop: 10 }}>Generate ready-to-post social content powered by live market data</p>
      </Reveal>

      <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24, marginTop: 36 }}>
        <Reveal>
          <GlowCard>
            <div style={{ padding: 28, borderRadius: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>Content Type</div>
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} style={{
                  display: "block", width: "100%", padding: "13px 16px", borderRadius: 14,
                  border: "none", cursor: "pointer", textAlign: "left", fontSize: 13.5,
                  fontWeight: cat === c ? 700 : 450, marginBottom: 4,
                  background: cat === c ? "rgba(99,102,241,0.08)" : "transparent",
                  color: cat === c ? "#6366f1" : "#0f172a", transition: "all 0.25s",
                }}>{c}</button>
              ))}

              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginTop: 28, marginBottom: 12 }}>Platform</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {plats.map((p) => (
                  <button key={p} onClick={() => setPlat(p)} style={{
                    padding: "7px 16px", borderRadius: 12, fontSize: 12.5, fontWeight: 700,
                    cursor: "pointer", border: "1.5px solid",
                    borderColor: plat === p ? "#6366f1" : "rgba(0,0,0,0.06)",
                    background: plat === p ? "rgba(99,102,241,0.08)" : "white",
                    color: plat === p ? "#6366f1" : "#64748b", transition: "all 0.25s",
                  }}>{p}</button>
                ))}
              </div>

              <button onClick={gen} disabled={ld} style={{
                width: "100%", padding: "16px", borderRadius: 14, border: "none", marginTop: 28,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
                fontSize: 15, fontWeight: 700, cursor: ld ? "wait" : "pointer",
                boxShadow: "0 6px 24px rgba(99,102,241,0.35)", opacity: ld ? 0.7 : 1,
              }}>{ld ? "Generating..." : "Generate Content"}</button>
            </div>
          </GlowCard>
        </Reveal>

        <Reveal delay={100}>
          <div>
            {out ? (
              <div>
                <GlowCard>
                  <div style={{ padding: 28, borderRadius: 22 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                      <Tag color="#6366f1">{cat} · {plat}</Tag>
                      <button onClick={() => {
                        navigator.clipboard.writeText(out);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }} style={{
                        padding: "8px 18px", borderRadius: 12, border: "none", fontSize: 12.5,
                        fontWeight: 700, cursor: "pointer",
                        background: copied ? "#22c55e" : "rgba(99,102,241,0.08)",
                        color: copied ? "white" : "#6366f1", transition: "all 0.3s",
                        boxShadow: copied ? "0 4px 12px rgba(34,197,94,0.3)" : "none",
                      }}>{copied ? "✓ Copied" : "Copy"}</button>
                    </div>
                    <div style={{
                      whiteSpace: "pre-wrap", fontSize: 14.5, lineHeight: 1.85, color: "#0f172a",
                      background: "rgba(0,0,0,0.02)", borderRadius: 18, padding: 28,
                      fontFamily: "inherit", border: "1px solid rgba(0,0,0,0.04)",
                    }}>{out}</div>
                  </div>
                </GlowCard>
                <button onClick={gen} style={{
                  marginTop: 14, padding: "12px 24px", borderRadius: 14,
                  border: "1.5px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.8)",
                  color: "#0f172a", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                  backdropFilter: "blur(20px)",
                }}>↻ Regenerate</button>
              </div>
            ) : (
              <GlowCard glow={false}>
                <div style={{ textAlign: "center", padding: "100px 32px", borderRadius: 22 }}>
                  <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.15, filter: "blur(1px)" }}>◎</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Pick a type, choose a platform, hit Generate</div>
                  <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>All content uses live Redfin data from the Encinitas market</div>
                </div>
              </GlowCard>
            )}
          </div>
        </Reveal>
      </div>

      <Footer />
    </div>
  );
}
