import { useState } from "react";
import { MARKET, HOOD_COLORS, fmt, fmtPrice } from "../data";
import { Reveal, GlowCard, Num, Chart, Ring, Pill, Tag, GradientText, Footer } from "../components/ui";

export default function Dashboard() {
  const hot = MARKET.neighborhoods.reduce((a, b) => (a.chg > b.chg ? a : b));

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "56px 32px 120px", position: "relative", zIndex: 1 }}>
      {/* HERO */}
      <Reveal>
        <Tag color="#6366f1">Live Market Intelligence · February 2026</Tag>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-3px", margin: "20px 0 0", lineHeight: 1 }}>
          Encinitas<br /><GradientText>Real Estate</GradientText>
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", marginTop: 14, maxWidth: 520, lineHeight: 1.6 }}>
          Neighborhood-level market data powered by MLS &amp; Redfin. Updated weekly for buyers, sellers, and investors.
        </p>
      </Reveal>

      {/* BENTO GRID */}
      <div className="bento-grid" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginTop: 48 }}>
        {/* Big Price Card */}
        <Reveal style={{ gridColumn: "span 5" }}>
          <GlowCard>
            <div style={{ padding: "30px 30px 0" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Median Sale Price</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: "#0f172a", letterSpacing: "-3px", lineHeight: 1 }}>
                <Num end={1.87} pre="$" suf="M" dec={2} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 700, background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>↓ 5.6%</span>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>vs last year · Redfin</span>
              </div>
            </div>
            <div style={{ height: 170, padding: "16px 8px 0" }}>
              <Chart data={MARKET.trend} height={160} />
            </div>
          </GlowCard>
        </Reveal>

        {/* Score + DOM */}
        <div style={{ gridColumn: "span 3", display: "flex", flexDirection: "column", gap: 16 }}>
          <Reveal delay={80}>
            <GlowCard>
              <div style={{ padding: 28, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 130 }}>
                <Ring score={MARKET.compete} size={110} label="Compete Score" sub="Somewhat competitive" />
              </div>
            </GlowCard>
          </Reveal>
          <Reveal delay={160}>
            <GlowCard>
              <div style={{ padding: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 10 }}>Days on Market</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", letterSpacing: "-2px" }}><Num end={45} /></span>
                  <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>avg</span>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>↑ 5 days YoY</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>Hot: {MARKET.hotDom}d</span>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        </div>

        {/* Stats */}
        <div style={{ gridColumn: "span 4", display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
          <Reveal delay={120}>
            <GlowCard>
              <div style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Homes Sold · 30d</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", letterSpacing: "-2px" }}><Num end={46} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>↑ 39% YoY</span>
                </div>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🏠</div>
              </div>
            </GlowCard>
          </Reveal>
          <Reveal delay={200}>
            <GlowCard>
              <div style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 8 }}>Price / Sq Ft</div>
                  <div style={{ fontSize: 38, fontWeight: 900, color: "#0f172a", letterSpacing: "-2px" }}>$<Num end={976} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>↑ 5.1% YoY</span>
                </div>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>📐</div>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </div>

      {/* NEIGHBORHOODS */}
      <Reveal style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: 0 }}>Neighborhoods</h2>
        <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>Micro-market data · Redfin Compete Scores</p>
      </Reveal>
      <div className="hood-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginTop: 20 }}>
        {MARKET.neighborhoods.map((n, i) => (
          <Reveal key={n.name} delay={i * 80}>
            <GlowCard>
              <div style={{ overflow: "hidden", borderRadius: 22 }}>
                <div style={{ height: 5, background: `linear-gradient(90deg, ${HOOD_COLORS[i]}, ${HOOD_COLORS[i]}88)` }} />
                <div style={{ padding: "22px 20px 24px" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{n.name}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 16, lineHeight: 1.4 }}>{n.vibe}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", marginBottom: 6 }}>{fmtPrice(n.med)}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: n.chg > 0 ? "#22c55e" : "#ef4444" }}>{n.chg > 0 ? "↑" : "↓"} {Math.abs(n.chg)}%</span>
                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{n.dom}d avg</span>
                  </div>
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>
                      <span>Compete</span><span style={{ color: HOOD_COLORS[i] }}>{n.score}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.04)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 3, width: `${n.score}%`, background: `linear-gradient(90deg, ${HOOD_COLORS[i]}, ${HOOD_COLORS[i]}88)`, transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)" }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 10 }}>Hot homes: <strong style={{ color: "#0f172a" }}>{n.hot}d</strong></div>
                </div>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      {/* LISTINGS TABLE */}
      <Reveal style={{ marginTop: 48 }}>
        <GlowCard glow={false}>
          <div style={{ borderRadius: 22, overflow: "hidden" }}>
            <div style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px" }}>Recent Listings</span>
              <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, background: "rgba(99,102,241,0.06)", padding: "4px 12px", borderRadius: 8 }}>{MARKET.active} active</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Address", "Neighborhood", "Bed/Bath", "Sq Ft", "Price", "DOM", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 18px", fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MARKET.listings.map((l, i) => (
                    <tr key={i} style={{ cursor: "pointer", transition: "background 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <td style={{ padding: "16px 18px", fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{l.addr}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: "#64748b" }}>{l.hood}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: "#64748b" }}>{l.bd}/{l.ba}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: "#64748b" }}>{fmt(l.sqft)}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>{fmtPrice(l.price)}</td>
                      <td style={{ padding: "16px 18px", fontSize: 13, color: l.dom <= 3 ? "#6366f1" : "#64748b", fontWeight: l.dom <= 3 ? 700 : 400 }}>{l.dom}</td>
                      <td style={{ padding: "16px 18px" }}><Pill s={l.st} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </GlowCard>
      </Reveal>

      {/* QUICK STATS */}
      <div className="quick-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 16 }}>
        {[
          { l: "List → Sale", v: "98%", s: "Near asking", c: "#6366f1" },
          { l: "Avg Offers", v: "5", s: "Per listing", c: "#0ea5e9" },
          { l: "Hot Home DOM", v: "12d", s: "Move fast", c: "#f59e0b" },
          { l: "Avg Rent", v: "$2,450", s: "/month", c: "#22c55e" },
        ].map((s, i) => (
          <Reveal key={s.l} delay={i * 60}>
            <GlowCard>
              <div style={{ padding: 22, textAlign: "center" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.l}</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: s.c, fontWeight: 600, marginTop: 4 }}>{s.s}</div>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>

      {/* MIGRATION */}
      <Reveal style={{ marginTop: 16 }}>
        <GlowCard>
          <div style={{ padding: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 6 }}>Migration Trends</div>
              <div style={{ fontSize: 15, color: "#0f172a", fontWeight: 500, lineHeight: 1.6 }}>
                <strong style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1px", color: "#6366f1" }}>{MARKET.migration.stayPct}%</strong> of Encinitas buyers stay local
              </div>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Moving In From</div>
                {MARKET.migration.topFrom.map((c) => <div key={c} style={{ fontSize: 13, color: "#0f172a", fontWeight: 500, padding: "2px 0" }}>{c}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Moving Out To</div>
                {MARKET.migration.topTo.map((c) => <div key={c} style={{ fontSize: 13, color: "#0f172a", fontWeight: 500, padding: "2px 0" }}>{c}</div>)}
              </div>
            </div>
          </div>
        </GlowCard>
      </Reveal>

      <Footer />
    </div>
  );
}
