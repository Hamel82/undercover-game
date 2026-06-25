import { useState, useEffect } from "react";
import { TX } from "../translations";
import { wordData, getRandomPair } from "../data/words";

export default function Setup({ mode, lang, onStart, onBack, prefill }) {
  const t = TX.setup[lang];
  const themeList = wordData[lang].themes;
  const accentColor = mode === "undercover" ? "var(--cyan)" : "var(--magenta)";
  const btnClass = mode === "undercover" ? "pixel-btn cyan" : "pixel-btn magenta";

  const [players, setPlayers] = useState(prefill?.players?.map((p) => p) || ["", "", ""]);
  const [selectedTheme, setSelectedTheme] = useState("food");
  const [customCivil, setCustomCivil] = useState("");
  const [customUndercover, setCustomUndercover] = useState("");
  const [confirmedPair, setConfirmedPair] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(prefill?.timerSeconds || 0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (prefill) {
      setPlayers(prefill.players || ["", "", ""]);
      setTimerSeconds(prefill.timerSeconds || 0);
      setCustomCivil("");
      setCustomUndercover("");
      setConfirmedPair(null);
    }
  }, [prefill]);

  const updatePlayer = (i, val) => { const p = [...players]; p[i] = val; setPlayers(p); };
  const addPlayer = () => setPlayers([...players, ""]);
  const removePlayer = (i) => { if (players.length > 3) setPlayers(players.filter((_, idx) => idx !== i)); };

  const pickRandom = () => {
    const pair = getRandomPair(lang, selectedTheme);
    setCustomCivil(pair.civil);
    setCustomUndercover(pair.undercover);
    setConfirmedPair(null);
  };

  const confirmWords = () => {
    if (!customCivil.trim() || !customUndercover.trim()) { setError(t.fillWords); return; }
    setConfirmedPair({ civil: customCivil.trim(), undercover: customUndercover.trim() });
    setError("");
  };

  const handleStart = () => {
    const validPlayers = players.filter((p) => p.trim());
    if (validPlayers.length < 3) { setError(t.minPlayers); return; }
    if (!confirmedPair) { setError(t.fillWords); return; }
    setError("");
    onStart({ players: validPlayers, wordPair: confirmedPair, mode, timerSeconds });
  };

  const timerOptions = [
    { val: 0, label: t.timerOff }, { val: 60, label: t.timer60 },
    { val: 90, label: t.timer90 }, { val: 120, label: t.timer120 }, { val: 180, label: t.timer180 },
  ];

  return (
      <div className="screen" style={{ gap: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <button className="pixel-btn gray" style={{ fontSize: 8, padding: "8px 12px" }} onClick={onBack}>{t.back}</button>
          <h2 className="pixel-title" style={{ fontSize: 13, color: accentColor }}>{t[`title_${mode}`]}</h2>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", letterSpacing: 3, marginBottom: 12 }}>👥 {t.players}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {players.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: accentColor, width: 22 }}>{String(i + 1).padStart(2, "0")}</span>
                  <input className="pixel-input" value={p} onChange={(e) => updatePlayer(i, e.target.value)} placeholder={`${t.playerPlaceholder} ${i + 1}`} maxLength={20} />
                  {players.length > 3 && (
                      <button onClick={() => removePlayer(i)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>{t.removePlayer}</button>
                  )}
                </div>
            ))}
          </div>
          <button className="pixel-btn gray" style={{ marginTop: 10, fontSize: 8, padding: "8px 14px" }} onClick={addPlayer}>{t.addPlayer}</button>
        </div>

        <hr className="divider" />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", letterSpacing: 3, marginBottom: 12 }}>🔤 {t.wordSection}</div>
          {confirmedPair ? (
              <div style={{ background: "var(--panel)", border: "2px solid var(--green)", padding: 16, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: "var(--green)", marginBottom: 6 }}>{t.wordConfirmed}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gray)" }}>{t.wordHidden}</div>
                <button className="pixel-btn gray" style={{ marginTop: 12, fontSize: 8, padding: "6px 12px" }} onClick={() => setConfirmedPair(null)}>✎ MODIFIER</button>
              </div>
          ) : (
              <>
                <div style={{ marginBottom: 10 }}>
                  <select className="pixel-select" value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
                    {themeList.map((th) => <option key={th.id} value={th.id}>{th.label}</option>)}
                  </select>
                </div>
                <button className={btnClass} style={{ width: "100%", marginBottom: 14, fontSize: 9 }} onClick={pickRandom}>{t.randomPair}</button>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", textAlign: "center", marginBottom: 10, letterSpacing: 2 }}>— {t.orCustom} —</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                  <input className="pixel-input" placeholder={t.civilWord} value={customCivil} onChange={(e) => { setCustomCivil(e.target.value); setConfirmedPair(null); }} />
                  <input className="pixel-input" placeholder={mode === "impostor" ? t.impostorHint : t.undercoverWord} value={customUndercover} onChange={(e) => { setCustomUndercover(e.target.value); setConfirmedPair(null); }} />
                </div>
                <button className={btnClass} style={{ width: "100%", fontSize: 9 }} onClick={confirmWords}>✓ CONFIRMER</button>
              </>
          )}
        </div>

        <hr className="divider" />

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", letterSpacing: 3, marginBottom: 12 }}>⏱ {t.timerSection}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {timerOptions.map((opt) => (
                <button key={opt.val} onClick={() => setTimerSeconds(opt.val)} style={{ fontFamily: "var(--font-pixel)", fontSize: 8, padding: "8px 12px", border: `2px solid ${timerSeconds === opt.val ? accentColor : "var(--gray)"}`, background: timerSeconds === opt.val ? `${accentColor}22` : "transparent", color: timerSeconds === opt.val ? accentColor : "var(--gray)", cursor: "pointer" }}>
                  {opt.label}
                </button>
            ))}
          </div>
        </div>

        {error && <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--red)", marginBottom: 14, textAlign: "center" }}>⚠ {error}</div>}
        <button className={btnClass} style={{ width: "100%", fontSize: 11 }} onClick={handleStart}>{t.start}</button>
      </div>
  );
}