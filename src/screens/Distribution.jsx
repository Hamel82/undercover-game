import { useState } from "react";
import { TX } from "../translations";
import { getRoleDisplay } from "../utils/game";

const roleColors = { civil: "var(--cyan)", undercover: "var(--cyan)", impostor: "var(--yellow)" };

function CardBack({ playerName, lang, onReveal }) {
    const t = TX.dist[lang];
    const [pressing, setPressing] = useState(false);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 28 }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", letterSpacing: 3, marginBottom: 10 }}>{t.pass}</div>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 20, color: "var(--yellow)", lineHeight: 1.4 }}>{playerName.toUpperCase()}</div>
            </div>
            <div
                onPointerDown={() => setPressing(true)}
                onPointerUp={() => { setPressing(false); onReveal(); }}
                onPointerLeave={() => setPressing(false)}
                style={{ width: 220, height: 290, background: "var(--panel)", border: "3px solid var(--gray)", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 18, transform: pressing ? "scale(0.97) translate(2px,2px)" : "scale(1)", transition: "transform 0.1s", boxShadow: pressing ? "2px 2px 0 var(--gray)" : "6px 6px 0 var(--gray)", userSelect: "none" }}
            >
                <div style={{ fontSize: 52, opacity: 0.2 }}>🂠</div>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)", textAlign: "center", lineHeight: 2 }}>{t.tap}</div>
                <div className="blink" style={{ fontSize: 22, color: "var(--gray)" }}>▼</div>
            </div>
        </div>
    );
}

function CardFront({ playerData, lang, onHide, isForgotReview }) {
    const t = TX.dist[lang];
    const roleInfo = getRoleDisplay(playerData.role, lang);
    const color = roleColors[playerData.role];
    const isImpostor = playerData.role === "impostor";

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 20 }}>
            {isForgotReview && (
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--red)", textAlign: "center", lineHeight: 1.8 }}>⚠ {t.forgotWarning}</div>
            )}
            <div style={{ width: 260, background: "var(--panel)", border: `3px solid ${color}`, borderRadius: 4, boxShadow: `6px 6px 0 ${color}44`, overflow: "hidden" }}>
                <div style={{ background: color, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 10, color: "var(--black)" }}>{roleInfo.label}</span>
                    <span style={{ fontSize: 20 }}>{isImpostor ? "👾" : "🂠"}</span>
                </div>
                <div style={{ padding: 20, textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--gray)", marginBottom: 16, lineHeight: 1.5 }}>{roleInfo.desc}</div>
                    <hr style={{ border: "none", borderTop: `1px solid ${color}44`, marginBottom: 16 }} />
                    {isImpostor ? (
                        <div>
                            <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", letterSpacing: 3, marginBottom: 8 }}>{t.yourHint}</div>
                            <div style={{ fontFamily: "var(--font-pixel)", fontSize: 16, color: "var(--yellow)", lineHeight: 1.5, padding: "12px 16px", border: "2px dashed var(--yellow)", background: "rgba(255,230,0,0.08)" }}>{playerData.hint}</div>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", letterSpacing: 3, marginBottom: 8 }}>{t.yourWord}</div>
                            <div style={{ fontFamily: "var(--font-pixel)", fontSize: 18, color, lineHeight: 1.4, padding: "12px 16px", border: `2px solid ${color}44`, background: `${color}11` }}>{playerData.word}</div>
                        </div>
                    )}
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--red)", marginTop: 16, letterSpacing: 1 }}>{t.warning}</div>
                </div>
            </div>
            <button className="pixel-btn gray" style={{ fontSize: 9, padding: "12px 24px" }} onClick={onHide}>{isForgotReview ? t.rehide : t.hide}</button>
        </div>
    );
}

export function ForgotWordOverlay({ player, lang, onClose }) {
    const [revealed, setRevealed] = useState(false);
    if (!player) return null;
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", maxWidth: 420, padding: 20 }}>
                {revealed
                    ? <CardFront playerData={player} lang={lang} onHide={onClose} isForgotReview={true} />
                    : <CardBack playerName={player.name} lang={lang} onReveal={() => setRevealed(true)} />
                }
            </div>
        </div>
    );
}

export default function Distribution({ roles, mode, lang, onDone, onBack }) {
    const t = TX.dist[lang];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const [allDone, setAllDone] = useState(false);
    const [seenRoles, setSeenRoles] = useState({});
    const [forgotMode, setForgotMode] = useState(null);
    const [forgotRevealed, setForgotRevealed] = useState(false);

    const current = roles[currentIndex];
    const isLast = currentIndex === roles.length - 1;

    const handleReveal = () => { setRevealed(true); setSeenRoles((prev) => ({ ...prev, [current.name]: true })); };
    const handleHide = () => { if (isLast) { setAllDone(true); } else { setRevealed(false); setCurrentIndex((i) => i + 1); } };
    const handleForgotSelect = (name) => { setForgotMode(name); setForgotRevealed(false); };
    const handleForgotHide = () => { setForgotMode(null); setForgotRevealed(false); };

    const seenPlayers = roles.filter((r) => seenRoles[r.name]);

    if (forgotMode) {
        const forgotPlayer = roles.find((r) => r.name === forgotMode);
        return (
            <div className="screen" style={{ gap: 0 }}>
                {forgotRevealed
                    ? <CardFront playerData={forgotPlayer} lang={lang} onHide={handleForgotHide} isForgotReview={true} />
                    : <CardBack playerName={forgotPlayer.name} lang={lang} onReveal={() => setForgotRevealed(true)} />
                }
            </div>
        );
    }

    if (allDone) {
        return (
            <div className="screen" style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 52, marginBottom: 14 }}>🎮</div>
                    <h2 className="pixel-title" style={{ fontSize: 13, color: "var(--green)", marginBottom: 10, lineHeight: 1.6 }}>{t.readyTitle}</h2>
                    <div className="blink" style={{ fontFamily: "var(--font-pixel)", fontSize: 8, color: "var(--gray)" }}>▼ ▼ ▼</div>
                </div>
                {seenPlayers.length > 0 && (
                    <div style={{ width: "100%", maxWidth: 320 }}>
                        <div style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)", letterSpacing: 2, marginBottom: 10, textAlign: "center" }}>👁 {t.forgot}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                            {seenPlayers.map((p) => (
                                <button key={p.name} className="pixel-btn gray" style={{ fontSize: 8, padding: "7px 12px" }} onClick={() => handleForgotSelect(p.name)}>{p.name}</button>
                            ))}
                        </div>
                    </div>
                )}
                <button className="pixel-btn yellow" style={{ fontSize: 11, padding: "16px 32px" }} onClick={onDone}>{t.readyStart}</button>
                <button className="pixel-btn gray" style={{ fontSize: 8 }} onClick={onBack}>{t.back}</button>
            </div>
        );
    }

    return (
        <div className="screen" style={{ gap: 0 }}>
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)" }}>JOUEUR</span>
                    <span style={{ fontFamily: "var(--font-pixel)", fontSize: 7, color: "var(--gray)" }}>{currentIndex + 1} {t.progress} {roles.length}</span>
                </div>
                <div style={{ height: 4, background: "var(--panel)", border: "1px solid var(--gray)" }}>
                    <div style={{ height: "100%", background: mode === "undercover" ? "var(--cyan)" : "var(--magenta)", width: `${((currentIndex + 1) / roles.length) * 100}%`, transition: "width 0.3s" }} />
                </div>
            </div>
            {revealed
                ? <CardFront playerData={current} lang={lang} onHide={handleHide} isForgotReview={false} />
                : <CardBack playerName={current.name} lang={lang} onReveal={handleReveal} />
            }
        </div>
    );
}