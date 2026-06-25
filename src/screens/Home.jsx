import { useState, useEffect } from "react";
import { TX } from "../translations";

export default function Home({ onSelect, lang, setLang }) {
  const [tick, setTick] = useState(0);
  const t = TX.home[lang];

  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 80);
    return () => clearInterval(id);
  }, []);

  const chars = "!@#$%^&*<>?/|\\~";
  const scramble = (str) =>
      str.split("").map((c) => (tick % 20 < 3 && Math.random() > 0.85 ? chars[Math.floor(Math.random() * chars.length)] : c)).join("");

  return (
      <div className="screen" style={{ justifyContent: "center", alignItems: "center", gap: 32 }}>
        <button className="pixel-btn gray" style={{ position: "absolute", top: 24, right: 20, fontSize: 9, padding: "8px 14px" }} onClick={() => setLang(lang === "fr" ? "en" : "fr")}>
          {t.lang}
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: "var(--gray)", marginBottom: 12, letterSpacing: 4 }}>▶ ▶ ▶</div>
          <h1 className="pixel-title glitch" style={{ fontSize: 22, color: "var(--yellow)", lineHeight: 1.4 }}>WORD GAMES</h1>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: "var(--magenta)", marginTop: 8, letterSpacing: 2 }}>{scramble("BY YOUR CREW")}</div>
        </div>
        <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", letterSpacing: 3 }}>— {t.subtitle} —</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", maxWidth: 320 }}>
          <button className="pixel-btn cyan" onClick={() => onSelect("undercover")} style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>🕵️ {t.undercover}</div>
            <div style={{ fontSize: 8, color: "rgba(0,245,255,0.6)", fontFamily: "var(--font-mono)", textTransform: "none" }}>{t.undercoverDesc}</div>
          </button>
          <button className="pixel-btn magenta" onClick={() => onSelect("impostor")} style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}>👾 {t.impostor}</div>
            <div style={{ fontSize: 8, color: "rgba(255,0,110,0.6)", fontFamily: "var(--font-mono)", textTransform: "none" }}>{t.impostorDesc}</div>
          </button>
        </div>
        <div className="blink" style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", marginTop: 16, letterSpacing: 2 }}>{t.credits}</div>
      </div>
  );
}