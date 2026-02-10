import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   SHARED UI COMPONENTS
   ═══════════════════════════════════════════ */

// ─── Canvas Aurora Background ───
export function CanvasAurora() {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, t = 0, raf;
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const blobs = [
      { x: 0.2, y: 0.3, r: 0.4, vx: 0.0003, vy: 0.0002, c1: [120, 80, 220, 0.08], c2: [120, 80, 220, 0] },
      { x: 0.7, y: 0.5, r: 0.35, vx: -0.0002, vy: 0.0003, c1: [220, 100, 120, 0.06], c2: [220, 100, 120, 0] },
      { x: 0.5, y: 0.7, r: 0.45, vx: 0.0001, vy: -0.0002, c1: [80, 180, 200, 0.06], c2: [80, 180, 200, 0] },
      { x: 0.3, y: 0.6, r: 0.3, vx: 0.00025, vy: 0.00015, c1: [180, 120, 255, 0.05], c2: [180, 120, 255, 0] },
    ];
    const draw = () => {
      t++;
      ctx.clearRect(0, 0, w, h);
      blobs.forEach((b, i) => {
        const cx = (b.x + Math.sin(t * b.vx * 10 + i) * 0.15) * w;
        const cy = (b.y + Math.cos(t * b.vy * 10 + i * 2) * 0.12) * h;
        const r = b.r * Math.min(w, h);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${b.c1.join(",")})`);
        g.addColorStop(1, `rgba(${b.c2.join(",")})`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

// ─── Dot Grid Overlay ───
export function DotGrid() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.3,
      backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }} />
  );
}

// ─── Scroll Reveal ───
export function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Glow Card (mouse-tracking gradient border) ───
export function GlowCard({ children, style = {}, glow = true, ...props }) {
  const [h, setH] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const ref = useRef();
  const move = useCallback((e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  }, []);

  return (
    <div ref={ref} onMouseMove={move} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", borderRadius: 22, ...style }} {...props}>
      {glow && (
        <div style={{
          position: "absolute", inset: -1, borderRadius: 23, zIndex: 0,
          background: h
            ? `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(99,102,241,0.2), rgba(168,85,247,0.08), transparent 60%)`
            : "none",
          transition: "opacity 0.4s", opacity: h ? 1 : 0,
        }} />
      )}
      <div style={{
        position: "relative", zIndex: 1, borderRadius: 22,
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
        border: `1px solid ${h ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.7)"}`,
        boxShadow: h
          ? "0 24px 80px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.5) inset, 0 0 40px rgba(99,102,241,0.04)"
          : "0 2px 20px rgba(0,0,0,0.03), 0 0 0 1px rgba(255,255,255,0.5) inset",
        transform: h ? "translateY(-4px) scale(1.005)" : "none",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Animated Number Counter ───
export function Num({ end, pre = "", suf = "", dec = 0, dur = 1500 }) {
  const [v, setV] = useState(0);
  const ref = useRef();
  const fmt = (n) => new Intl.NumberFormat("en-US").format(n);
  useEffect(() => {
    const s = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - s) / dur, 1);
      setV((1 - Math.pow(1 - p, 5)) * end);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [end, dur]);
  const display = dec > 0 ? v.toFixed(dec) : end >= 1000 ? fmt(Math.round(v)) : Math.round(v);
  return <>{pre}{display}{suf}</>;
}

// ─── Interactive Bezier Chart ───
export function Chart({ data, height = 160, color = "#6366f1" }) {
  const w = 500, pad = 20;
  const max = Math.max(...data.map((d) => d.p));
  const min = Math.min(...data.map((d) => d.p));
  const rng = max - min || 1;
  const fmtPrice = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${(n / 1e3).toFixed(0)}K`;

  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (d.p - min) / rng) * (height - pad * 2 - 10),
    ...d,
  }));

  const bezier = pts.map((p, i) => {
    if (i === 0) return `M${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) * 0.4;
    const cpx2 = p.x - (p.x - prev.x) * 0.4;
    return `C${cpx1},${prev.y} ${cpx2},${p.y} ${p.x},${p.y}`;
  }).join(" ");

  const area = `${bezier} L${pts[pts.length - 1].x},${height - 10} L${pts[0].x},${height - 10} Z`;
  const [hov, setHov] = useState(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setTimeout(() => setDrawn(true), 300); }, []);

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}
      onMouseLeave={() => setHov(null)}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" /><stop offset="50%" stopColor="#6366f1" /><stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#cg)" style={{ opacity: drawn ? 1 : 0, transition: "opacity 1s ease 0.3s" }} />
      <path d={bezier} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#glow2)"
        style={{ strokeDasharray: 1500, strokeDashoffset: drawn ? 0 : 1500, transition: "stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)" }} />
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHov(i)} style={{ cursor: "crosshair" }}>
          <rect x={p.x - 20} y={0} width={40} height={height} fill="transparent" />
          <circle cx={p.x} cy={p.y} r={hov === i ? 6 : 3} fill={hov === i ? "white" : "rgba(99,102,241,0.6)"}
            stroke={color} strokeWidth={hov === i ? 3 : 0}
            style={{ transition: "all 0.2s", filter: hov === i ? "drop-shadow(0 0 8px rgba(99,102,241,0.5))" : "none" }} />
          {hov === i && <>
            <line x1={p.x} y1={pad} x2={p.x} y2={height - 10} stroke="rgba(99,102,241,0.15)" strokeWidth="1" strokeDasharray="4,4" />
            <g style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}>
              <rect x={p.x - 44} y={p.y - 36} width={88} height={28} rx={10} fill="#1e1b4b" />
              <text x={p.x} y={p.y - 18} fill="white" fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="inherit">{fmtPrice(p.p)}</text>
            </g>
          </>}
        </g>
      ))}
      {pts.filter((_, i) => i % 2 === 0).map((p) => (
        <text key={p.m} x={p.x} y={height} fill="#94a3b8" fontSize="9.5" textAnchor="middle" fontFamily="inherit" fontWeight="500">{p.m}</text>
      ))}
    </svg>
  );
}

// ─── Animated Score Ring ───
export function Ring({ score, size = 90, label, sub }) {
  const r = (size - 12) / 2, c = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { setTimeout(() => setDrawn(true), 400); }, []);
  const color = score >= 80 ? "#ef4444" : score >= 60 ? "#f59e0b" : score >= 40 ? "#22c55e" : "#3b82f6";
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="6" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={drawn ? c - (score / 100) * c : c} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1) 0.5s", filter: `drop-shadow(0 0 6px ${color}40)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: size / 3, fontWeight: 800, color: "#0f172a", letterSpacing: "-1.5px", lineHeight: 1 }}>{score}</div>
        </div>
      </div>
      {label && <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginTop: 8 }}>{label}</div>}
      {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── Status Pill ───
export function Pill({ s }) {
  const m = {
    Active: ["#dcfce7", "#16a34a", "●"],
    Pending: ["#fef3c7", "#d97706", "◐"],
    "Just Listed": ["#dbeafe", "#2563eb", "★"],
    "Price Cut": ["#fee2e2", "#dc2626", "↓"],
  };
  const [bg, fg, icon] = m[s] || ["#f1f5f9", "#64748b", "·"];
  return (
    <span style={{
      padding: "4px 10px 4px 8px", borderRadius: 100, fontSize: 11, fontWeight: 600,
      background: bg, color: fg, display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ fontSize: 8 }}>{icon}</span>{s}
    </span>
  );
}

// ─── Tag ───
export function Tag({ children, color = "#6366f1" }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100,
      background: `${color}12`, border: `1px solid ${color}18`,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}60` }} />
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.5px", textTransform: "uppercase" }}>{children}</span>
    </div>
  );
}

// ─── Animated Gradient Text ───
export function GradientText({ children, style = {} }) {
  return (
    <span style={{
      background: "linear-gradient(135deg, #6366f1 0%, #a855f7 25%, #ec4899 50%, #6366f1 75%, #a855f7 100%)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      animation: "shimmer 4s linear infinite", ...style,
    }}>
      {children}
    </span>
  );
}

// ─── Nav ───
export function Nav({ page, setPage }) {
  const [mob, setMob] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { id: "dash", l: "Dashboard" },
    { id: "prop", l: "Property Report" },
    { id: "val", l: "Home Value" },
    { id: "eng", l: "Content Engine" },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: scrolled ? "rgba(250,250,252,0.75)" : "rgba(250,250,252,0.4)",
      backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div onClick={() => setPage("dash")} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", userSelect: "none" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 12, fontWeight: 900,
              boxShadow: "0 4px 16px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.2) inset",
            }}>ER</div>
            <div style={{
              position: "absolute", inset: -2, borderRadius: 13,
              background: "conic-gradient(from 0deg, #6366f1, #a855f7, #ec4899, #6366f1)",
              opacity: 0.15, filter: "blur(4px)", zIndex: -1, animation: "spin 8s linear infinite",
            }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", lineHeight: 1.1 }}>The Encinitas Report</div>
            <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, letterSpacing: "1px" }}>DRE# 02168977</div>
          </div>
        </div>

        <div className="desktop-nav" style={{ display: "flex", gap: 2, background: "rgba(0,0,0,0.03)", borderRadius: 14, padding: 3 }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              padding: "8px 18px", borderRadius: 12, border: "none", cursor: "pointer",
              fontSize: 12.5, fontWeight: page === l.id ? 650 : 450,
              background: page === l.id ? "white" : "transparent",
              color: page === l.id ? "#6366f1" : "#64748b",
              boxShadow: page === l.id ? "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)" : "none",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}>{l.l}</button>
          ))}
        </div>

        <button className="mobile-nav-btn" onClick={() => setMob(!mob)} style={{
          display: "none", background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#0f172a", padding: 8,
        }}>{mob ? "✕" : "☰"}</button>
      </div>

      {mob && (
        <div style={{ padding: "4px 32px 20px", background: "rgba(250,250,252,0.97)", backdropFilter: "blur(40px)" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => { setPage(l.id); setMob(false); }} style={{
              display: "block", width: "100%", padding: "16px 0", border: "none",
              borderBottom: "1px solid rgba(0,0,0,0.04)", background: "none",
              textAlign: "left", cursor: "pointer", fontSize: 16,
              fontWeight: page === l.id ? 700 : 400, color: page === l.id ? "#6366f1" : "#0f172a",
            }}>{l.l}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Footer ───
export function Footer() {
  return (
    <div style={{
      marginTop: 80, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.05)",
      display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6,
          background: "linear-gradient(135deg, #6366f1, #a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 7, fontWeight: 900,
        }}>ER</div>
        <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>© 2026 The Encinitas Report · DRE# 02168977</span>
      </div>
      <span style={{ fontSize: 11, color: "#c4c4c8" }}>Data sourced from Redfin, Zillow & MLS. For informational purposes only.</span>
    </div>
  );
}
