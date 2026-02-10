import { useState } from "react";
import { CanvasAurora, DotGrid, Nav } from "./components/ui";
import Dashboard from "./pages/Dashboard";
import PropertyReport from "./pages/PropertyReport";
import HomeValue from "./pages/HomeValue";
import ContentEngine from "./pages/ContentEngine";

export default function App() {
  const [page, setPage] = useState("dash");

  const pages = {
    dash: <Dashboard />,
    prop: <PropertyReport />,
    val: <HomeValue />,
    eng: <ContentEngine />,
  };

  // Scroll to top on page change
  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafc" }}>
      <CanvasAurora />
      <DotGrid />
      <Nav page={page} setPage={navigate} />
      <div key={page}>{pages[page]}</div>
    </div>
  );
}
