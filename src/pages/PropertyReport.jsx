import { useState } from "react";
import { MARKET, fmt, fmtPrice } from "../data";
import { Reveal, GlowCard, Tag, Footer } from "../components/ui";

export default function PropertyReport() {
  const [addr, setAddr] = useState("");
  const [rpt, setRpt] = useState(null);
  const [ld, setLd] = useState(false);

  const gen = () => {
    if (!addr.trim()) return;
    setLd(true);
    setTimeout(() => {
      const n = MARKET.neighborhoods[Math.floor(Math.random() * MARKET.neighborhoods.length)];
      const v = Math.round(n.med * (0.75 + Math.random() * 0.5));
      const sq = 1300 + Math.floor(Math.random() * 1600);
      setRpt({
        addr, hood: n.name, val: v, sqft: sq, ppsf: Math.round(v / sq),
        lot: 4500 + Math.floor(Math.random() * 9000),
        yr: 1952 + Math.floor(Math.random() * 60),
        bd: 2 + Math.floor(Math.random() * 3),
        ba: 1.5 + Math.floor(Math.random() * 2.5),
        nMed: n.med, nDom: n.dom, nChg: n.chg, nScore: n.score,
        walk: 40 + Math.floor(Math.random() * 45),
        bike: 35 + Math.floor(Math.random() * 50),
        comps: MARKET.listings.filter((l) => l.hood === n.name).slice(0, 3),
        eq12: Math.round(v * (0.02 + Math.random() * 0.06)),
        tax: Math.round(v * 0.011),
      });
      setLd(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 120px", position: "relative", zIndex: 1 }}>
      <Reveal>
        <Tag color="#0ea5e9">Property Intelligence</Tag>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-2.5px", margin: "20px 0 0", lineHeight: 1 }}>Property Report</h1>
        <p style={{ fontSize: 17, color: "#64748b", marginTop: 10 }}>Comps, neighborhood context, equity projections, and market position</p>
      </Reveal>

      <Reveal style={{ marginTop: 32 }}>
        <GlowCard>
          <div className="search-bar" style={{ padding: 28, display: "flex", gap: 14, borderRadius: 22 }}>
            <input value={addr} onChange={(e) => setAddr(e.target.value)} onKeyDown={(e) => e.key === "Enter" && gen()}
              placeholder="Enter any Encinitas address..."
              style={{ flex: 1, padding: "16px 20px", borderRadius: 16, border: "1.5px solid rgba(0,0,0,0.07)", fontSize: 16, outline: "none", fontFamily: "inherit", background: "rgba(255,255,255,0.8)", fontWeight: 500, transition: "all 0.3s" }} />
            <button onClick={gen} disabled={ld} style={{
              padding: "16px 36px", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white",
              fontSize: 15, fontWeight: 700, cursor: ld ? "wait" : "pointer",
              boxShadow: "0 6px 24px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.15) inset",
              opacity: ld ? 0.7 : 1, whiteSpace: "nowrap",
            }}>{ld ? "Analyzing..." : "Generate Report"}</button>
          </div>
        </GlowCard>
      </Reveal>

      {rpt && (
        <div style={{ marginTop: 24 }}>
          <Reveal>
            <div style={{
              borderRadius: 24, padding: "clamp(24px, 4vw, 40px)", color: "white", position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
            }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 15%, rgba(139,92,246,0.35), transparent 55%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 85%, rgba(99,102,241,0.2), transparent 50%)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.5, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 10 }}>Property Analysis</div>
                <div style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 4 }}>{rpt.addr}</div>
                <div style={{ fontSize: 16, opacity: 0.55 }}>{rpt.hood}, Encinitas CA 92024</div>
                <div className="report-hero-stats" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24, marginTop: 32 }}>
                  {[["Est. Value", fmtPrice(rpt.val)], ["Sq Ft", fmt(rpt.sqft)], ["$/Sq Ft", `$${rpt.ppsf}`], ["Year Built", rpt.yr], ["Annual Tax", `$${fmt(rpt.tax)}`]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 10, opacity: 0.45, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>{l}</div>
                      <div style={{ fontSize: "clamp(18px, 2.5vw, 28px)", fontWeight: 900, letterSpacing: "-1.5px" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <Reveal delay={100}>
              <GlowCard>
                <div style={{ padding: 28, borderRadius: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20 }}>Property Details</div>
                  {[["Bedrooms", rpt.bd], ["Bathrooms", rpt.ba], ["Living Area", `${fmt(rpt.sqft)} sqft`], ["Lot Size", `${fmt(rpt.lot)} sqft`], ["Year Built", rpt.yr], ["Walk Score", rpt.walk], ["Bike Score", rpt.bike]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <span style={{ fontSize: 14, color: "#64748b" }}>{l}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
            <Reveal delay={200}>
              <GlowCard>
                <div style={{ padding: 28, borderRadius: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20 }}>{rpt.hood} Context</div>
                  {[
                    ["Neighborhood Median", fmtPrice(rpt.nMed)],
                    ["Avg Days on Market", `${rpt.nDom} days`],
                    ["YoY Price Change", `${rpt.nChg > 0 ? "+" : ""}${rpt.nChg}%`],
                    ["Compete Score", `${rpt.nScore}/100`],
                    ["vs Neighborhood", `${((rpt.val - rpt.nMed) / rpt.nMed * 100).toFixed(1)}%`],
                    ["12-Mo Equity Est.", `+${fmtPrice(rpt.eq12)}`],
                    ["Market Temp", rpt.nDom < 15 ? "🔥 Hot" : rpt.nDom < 30 ? "☀️ Warm" : "❄️ Cool"],
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <span style={{ fontSize: 14, color: "#64748b" }}>{l}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </Reveal>
          </div>

          {rpt.comps.length > 0 && (
            <Reveal style={{ marginTop: 16 }}>
              <GlowCard>
                <div style={{ padding: 28, borderRadius: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 18 }}>Comparable Properties</div>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rpt.comps.length, 3)}, 1fr)`, gap: 14 }}>
                    {rpt.comps.map((c, i) => (
                      <div key={i} style={{ padding: 22, borderRadius: 18, background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.03))", border: "1px solid rgba(99,102,241,0.08)" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{c.addr}</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: "#6366f1", letterSpacing: "-1px", marginBottom: 10 }}>{fmtPrice(c.price)}</div>
                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{c.bd}bd / {c.ba}ba · {fmt(c.sqft)} sqft · {c.dom} days</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          )}
        </div>
      )}

      {!rpt && !ld && (
        <Reveal style={{ marginTop: 32 }}>
          <GlowCard glow={false}>
            <div style={{ textAlign: "center", padding: "100px 32px" }}>
              <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.15, filter: "blur(1px)" }}>◫</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>Enter an address to generate a report</div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 8 }}>Comps, neighborhood stats, equity projections, and more</div>
            </div>
          </GlowCard>
        </Reveal>
      )}

      <Footer />
    </div>
  );
}
