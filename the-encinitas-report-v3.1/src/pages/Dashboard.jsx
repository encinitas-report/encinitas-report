import { useState } from "react";
import { MARKET, NEIGHBORHOODS, RECENT_SALES, RATES, fmt, fmtPrice, calcPayment } from "../data/market";

export default function Dashboard() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Market Dashboard</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-2px", margin: 0 }}>Encinitas Market Data</h1>
        <p style={{ fontSize: 15, color: "#64748b", marginTop: 6 }}>Data sourced from Redfin, Zillow & MLS · Updated February 2026</p>
      </div>

      {/* City-wide stats */}
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          ["Median Price", fmtPrice(MARKET.median), `${MARKET.medianChange}% YoY`, MARKET.medianChange > 0 ? "#22c55e" : "#ef4444"],
          ["Days on Market", `${MARKET.dom}`, `${MARKET.dom - MARKET.domPrev > 0 ? "+" : ""}${MARKET.dom - MARKET.domPrev}d YoY`, "#f59e0b"],
          ["Homes Sold (30d)", `${MARKET.sold30}`, `↑${Math.round((MARKET.sold30 / MARKET.soldPrev - 1) * 100)}% YoY`, "#22c55e"],
          ["$/Sq Ft", `$${MARKET.ppsf}`, `+${MARKET.ppsfChange}% YoY`, "#a5b4fc"],
          ["Compete Score", `${MARKET.compete}/100`, "Somewhat Competitive", "#f59e0b"],
          ["Avg Offers", `${MARKET.offers}`, "Per listing", "#3b82f6"],
          ["List → Sale", `${MARKET.listToSale}%`, "Near asking", "#22c55e"],
          ["Active Listings", `${MARKET.active}`, `Avg Rent: $${fmt(MARKET.rent)}`, "#94a3b8"],
        ].map(([l, v, s, c]) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" }}>{l}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-1.5px", marginTop: 4 }}>{v}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c, marginTop: 4 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Price Trend */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 24, marginBottom: 24,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>12-Month Median Price Trend</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 140 }}>
          {MARKET.trend.map((t, i) => {
            const max = Math.max(...MARKET.trend.map(x => x.p));
            const min = Math.min(...MARKET.trend.map(x => x.p)) * 0.95;
            const pct = ((t.p - min) / (max - min)) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8" }}>{fmtPrice(t.p)}</div>
                <div style={{
                  width: "100%", height: `${pct}%`, minHeight: 8, borderRadius: 6,
                  background: i === MARKET.trend.length - 1
                    ? "linear-gradient(180deg, #6366f1, #4f46e5)"
                    : "rgba(99,102,241,0.15)",
                }} />
                <div style={{ fontSize: 8, color: "#475569" }}>{t.m}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Neighborhood Comparison Table */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden", marginBottom: 24,
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Neighborhood Comparison</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Neighborhood", "Median", "YoY", "DOM", "$/Sqft", "Compete", "Active", "Sold 30d", "Hot DOM", "Conv. P&I/mo"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEIGHBORHOODS.map(n => {
                const pmt = calcPayment(n.med * 0.8, RATES.conventional30.rate);
                return (
                  <tr key={n.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: n.color }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{n.name}</div>
                          <div style={{ fontSize: 10, color: "#475569" }}>{n.vibe}</div>
                        </div>
                      </div>
                    </td>
                    <td style={td}><strong style={{ color: "#f1f5f9" }}>{fmtPrice(n.med)}</strong></td>
                    <td style={td}><span style={{ color: n.chg > 0 ? "#22c55e" : "#ef4444", fontWeight: 700 }}>{n.chg > 0 ? "+" : ""}{n.chg}%</span></td>
                    <td style={td}><span style={{ color: n.dom < 20 ? "#22c55e" : n.dom < 40 ? "#f59e0b" : "#ef4444" }}>{n.dom}d</span></td>
                    <td style={td}>${n.ppsf}</td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 40, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                          <div style={{ width: `${n.score}%`, height: "100%", borderRadius: 3, background: n.score >= 70 ? "#ef4444" : n.score >= 50 ? "#f59e0b" : "#22c55e" }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{n.score}</span>
                      </div>
                    </td>
                    <td style={td}>{n.active}</td>
                    <td style={td}>{n.sold30}</td>
                    <td style={td}><span style={{ color: "#f59e0b" }}>{n.hot}d</span></td>
                    <td style={td}><strong style={{ color: "#a5b4fc" }}>${fmt(Math.round(pmt))}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Listings */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, overflow: "hidden",
      }}>
        <div style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recent Activity</div>
          <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>{RECENT_SALES.length} listings</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Address", "Neighborhood", "Bed/Bath", "Sq Ft", "$/Sqft", "Price", "DOM", "Status"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_SALES.map((s, i) => {
                const n = NEIGHBORHOODS.find(n => n.id === s.hood);
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{s.addr}</td>
                    <td style={td}><span style={{ color: n?.color || "#94a3b8" }}>{n?.name || s.hood}</span></td>
                    <td style={td}>{s.bd}/{s.ba}</td>
                    <td style={td}>{fmt(s.sqft)}</td>
                    <td style={td}>${s.ppsf}</td>
                    <td style={{ ...td, fontWeight: 800, color: "#f1f5f9" }}>{fmtPrice(s.price)}</td>
                    <td style={{ ...td, color: s.dom <= 3 ? "#6366f1" : "#94a3b8", fontWeight: s.dom <= 3 ? 700 : 400 }}>{s.dom}</td>
                    <td style={td}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                        background: s.st === "Active" ? "rgba(34,197,94,0.15)" : s.st === "Pending" ? "rgba(245,158,11,0.15)" : s.st === "Just Listed" ? "rgba(59,130,246,0.15)" : "rgba(239,68,68,0.15)",
                        color: s.st === "Active" ? "#22c55e" : s.st === "Pending" ? "#f59e0b" : s.st === "Just Listed" ? "#3b82f6" : "#ef4444",
                      }}>{s.st}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Migration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Moving IN from</div>
          {MARKET.migration.topFrom.map(c => <div key={c} style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, padding: "4px 0" }}>{c}</div>)}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Moving OUT to</div>
          {MARKET.migration.topTo.map(c => <div key={c} style={{ fontSize: 14, color: "#e2e8f0", fontWeight: 500, padding: "4px 0" }}>{c}</div>)}
        </div>
      </div>
    </div>
  );
}

const td = { padding: "14px 16px", fontSize: 13, color: "#94a3b8" };
