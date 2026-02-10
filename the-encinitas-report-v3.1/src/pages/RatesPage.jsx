import { useState } from "react";
import { RATES, MARKET, NEIGHBORHOODS, fmt, fmtPrice, calcPayment } from "../data/market";

export default function RatesPage() {
  const [price, setPrice] = useState(MARKET.median);
  const [downPct, setDownPct] = useState(20);
  const down = price * (downPct / 100);
  const loan = price - down;

  const rateList = [
    RATES.conventional30, RATES.conventional15, RATES.fha30,
    RATES.va30, RATES.jumbo30, RATES.arm51,
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 8 }}>Live Mortgage Rates</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-2px", margin: 0 }}>Today's Rates</h1>
        <p style={{ fontSize: 15, color: "#64748b", marginTop: 6 }}>Updated {RATES.updated} · National averages · Freddie Mac PMMS, Bankrate, Veterans United</p>
      </div>

      {/* Rate Cards */}
      <div className="rate-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
        {rateList.map(r => (
          <div key={r.label} style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "20px 22px", transition: "all 0.3s",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>{r.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-2px" }}>{r.rate}%</span>
              <span style={{ fontSize: 13, color: "#64748b" }}>rate</span>
            </div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>APR: {r.apr}%</div>
            {r.note && <div style={{ fontSize: 11, color: "#475569", marginTop: 8, lineHeight: 1.4 }}>{r.note}</div>}
            <div style={{ fontSize: 10, color: "#334155", marginTop: 8 }}>{r.source}</div>
          </div>
        ))}
      </div>

      {/* 30-Year Rate Trend */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 24, marginBottom: 32,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>30-Year Fixed Rate Trend (2026)</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120 }}>
          {RATES.trend.map((t, i) => {
            const maxR = Math.max(...RATES.trend.map(x => x.r));
            const minR = Math.min(...RATES.trend.map(x => x.r)) - 0.5;
            const pct = ((t.r - minR) / (maxR - minR)) * 100;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#f1f5f9" }}>{t.r}%</div>
                <div style={{
                  width: "100%", height: `${pct}%`, minHeight: 8, borderRadius: 6,
                  background: i === RATES.trend.length - 1
                    ? "linear-gradient(180deg, #6366f1, #4f46e5)"
                    : "rgba(255,255,255,0.06)",
                  transition: "height 0.5s ease",
                }} />
                <div style={{ fontSize: 9, color: "#475569", whiteSpace: "nowrap" }}>{t.w}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Calculator */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 20 }}>Payment Calculator</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>Home Price</label>
            <input type="range" min={500000} max={5000000} step={25000} value={price}
              onChange={e => setPrice(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#6366f1" }} />
            <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-1px", marginTop: 4 }}>{fmtPrice(price)}</div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", display: "block", marginBottom: 6 }}>Down Payment</label>
            <input type="range" min={0} max={50} step={1} value={downPct}
              onChange={e => setDownPct(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#6366f1" }} />
            <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-1px", marginTop: 4 }}>{downPct}% <span style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>({fmtPrice(down)})</span></div>
          </div>
        </div>

        {/* Payment Table */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={th}>Loan Type</div>
            <div style={th}>Rate</div>
            <div style={th}>Loan Amt</div>
            <div style={th}>Monthly P&I</div>
          </div>
          {[
            { ...RATES.conventional30, dp: downPct / 100 },
            { ...RATES.conventional15, dp: downPct / 100, yrs: 15 },
            { ...RATES.fha30, dp: Math.max(0.035, downPct / 100) },
            { ...RATES.va30, dp: 0 },
          ].map(r => {
            const dp = r.dp;
            const loanAmt = price * (1 - dp);
            const pmt = calcPayment(loanAmt, r.rate, r.yrs || 30);
            return (
              <div key={r.label} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 8, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>{r.rate}%</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>{fmtPrice(loanAmt)}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#a5b4fc" }}>${fmt(Math.round(pmt))}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "#334155", marginTop: 16 }}>
          Rates as of {RATES.updated}. P&I only — excludes property tax (~1.1%), insurance (~$200-400/mo), HOA, and mortgage insurance (FHA). Actual rates vary by creditworthiness.
        </div>
      </div>

      {/* Neighborhood Payment Comparison */}
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: 28, marginTop: 16,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 16 }}>
          Monthly Payment by Neighborhood (Conv 30yr, {downPct}% down)
        </div>
        {NEIGHBORHOODS.map(n => {
          const loanAmt = n.med * (1 - downPct / 100);
          const pmt = calcPayment(loanAmt, RATES.conventional30.rate);
          return (
            <div key={n.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: n.color }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{n.name}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Median: {fmtPrice(n.med)}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#f1f5f9", letterSpacing: "-0.5px" }}>${fmt(Math.round(pmt))}<span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>/mo</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const th = { fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" };
