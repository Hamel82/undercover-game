import { TX } from "../translations";

export default function Summary({ roles, mode, lang, timerSeconds, onVote, onRestart, onHome }) {
    const t = TX.summary[lang];
    const rules = mode === "undercover" ? t.rules_uc : t.rules_im;
    const accentColor = mode === "undercover" ? "var(--cyan)" : "var(--magenta)";

    return (
        <div className="screen" style={{ gap: 24 }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🎮</div>
                <h1 className="pixel-title" style={{ fontSize: 16, color: "var(--yellow)", lineHeight: 1.4 }}>{t.title}</h1>
            </div>
            <div>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", letterSpacing: 3, marginBottom: 12 }}>📋 RÈGLES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {rules.map((rule, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: accentColor, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--white)", lineHeight: 1.4 }}>{rule}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", letterSpacing: 3, marginBottom: 10 }}>👥 {t.players}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {roles.map((p, i) => (
                        <span key={i} style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--white)", background: "var(--panel)", border: "1px solid var(--gray)", padding: "6px 12px" }}>{p.name}</span>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                <button className="pixel-btn yellow" style={{ width: "100%", fontSize: 10 }} onClick={onVote}>{t.vote}</button>
                <button className={`pixel-btn ${mode === "undercover" ? "cyan" : "magenta"}`} style={{ width: "100%", fontSize: 10 }} onClick={onRestart}>{t.restart}</button>
                <button className="pixel-btn gray" style={{ width: "100%", fontSize: 10 }} onClick={onHome}>{t.home}</button>
            </div>
        </div>
    );
}