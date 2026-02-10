# The Encinitas Report

Premium real estate market intelligence platform for Encinitas, CA.  
**DRE# 02168977**

## Tech Stack
- **Vite** + **React 18**
- Canvas-driven aurora background
- Glass morphism UI with mouse-tracking glow borders
- Scroll-triggered reveal animations
- Interactive bezier charts with tooltips
- Real Redfin/Zillow/MLS market data

## Pages
1. **Dashboard** — Bento grid with median price, compete score, DOM, neighborhood breakdowns, listings table, migration data
2. **Property Report** — Address-based analysis with comps, neighborhood context, equity projections
3. **Home Value Estimator** — 2-step lead capture form with instant estimate results
4. **Content Engine** — Generate platform-specific social content using live market data

## Deploy to Vercel

### Option A: Push to existing repo
```bash
# Replace the contents of your existing repo
git add .
git commit -m "v2.0 — premium redesign"
git push
```
Vercel will auto-deploy from your connected repo.

### Option B: Fresh deploy
```bash
npm install
npm run build
npx vercel --prod
```

### Build Settings (Vercel Dashboard)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## Local Development
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173`

## Updating Market Data
Edit `src/data.js` — all market stats, neighborhood data, and listings are centralized there. Update monthly with fresh Redfin/MLS numbers.

## File Structure
```
src/
├── main.jsx          # Entry point
├── App.jsx           # Router + layout
├── index.css         # Global styles + responsive
├── data.js           # All market data (edit this monthly)
├── components/
│   └── ui.jsx        # Shared components (aurora, cards, charts, nav)
└── pages/
    ├── Dashboard.jsx
    ├── PropertyReport.jsx
    ├── HomeValue.jsx
    └── ContentEngine.jsx
```
