import { useState, useEffect, useRef } from "react";
import { TX } from "../translations";

function pad(n) { return String(n).padStart(2, "0"); }

function ForgotSection({ roles, onForgot, t }) {
    const [open, setOpen] = useState(false);
    if (!roles || roles.length === 0) return null;
    return (
        <div style={{ width: "100%", maxWidth: 320 }}>
            <button className="pixel-btn gray" style={{ width: "100%", fontSize: 8 }} onClick={() => setOpen((o) => !o)}>{t.forgot}</button>
            {open && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10, justifyContent: "center" }}>
                    {roles.map((p) => (
                        <button key={p.name} className="pixel-btn gray" style={{ fontSize: 8, padding: "7px 12px" }} onClick={() => { onForgot(p.name); setOpen(false); }}>{p.name}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function VoteTimer({ timerSeconds, lang, roles, onDone, onForgot }) {
    const t = TX.vote[lang];
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timerSeconds);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (running && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); setFinished(true); return 0; }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const pct = timerSeconds > 0 ? (timeLeft / timerSeconds) * 100 : 100;
    const timerColor = pct > 50 ? "var(--green)" : pct > 25 ? "var(--yellow)" : "var(--red)";

    if (timerSeconds === 0) {
        return (
            <div className="screen" style={{ justifyContent: "center", alignItems: "center", gap: 32 }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🗳️</div>
                    <h2 className="pixel-title" style={{ fontSize: 14, color: "var(--yellow)", lineHeight: 1.6 }}>{t.title}</h2>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--gray)", marginTop: 10 }}>{t.subtitle}</div>
                </div>
                <ForgotSection roles={roles} onForgot={onForgot} t={t} />
                <button className="pixel-btn yellow" style={{ fontSize: 11, padding: "16px 32px" }} onClick={onDone}>{t.done}</button>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="screen" style={{ justifyContent: "center", alignItems: "center", gap: 32 }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🗳️</div>
                    <h2 className="pixel-title" style={{ fontSize: 14, color: "var(--yellow)", lineHeight: 1.6 }}>{t.title}</h2>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--gray)", marginTop: 10 }}>{t.subtitle}</div>
                </div>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 36, color: "var(--gray)", letterSpacing: 4 }}>{pad(mins)}:{pad(secs)}</div>
                <ForgotSection roles={roles} onForgot={onForgot} t={t} />
                <button className="pixel-btn yellow" style={{ fontSize: 11, padding: "16px 40px" }} onClick={() => { setStarted(true); setRunning(true); }}>{t.start}</button>
                <button className="pixel-btn gray" style={{ fontSize: 9 }} onClick={onDone}>{t.skip}</button>
            </div>
        );
    }

    return (
        <div className="screen" style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-pixel)", fontSize: 9, color: "var(--gray)", letterSpacing: 3, marginBottom: 8 }}>{t.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--gray)" }}>{t.subtitle}</div>
            </div>
            <div style={{ width: 220, height: 220, border: `4px solid ${timerColor}`, borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${timerColor}44, inset 0 0 30px ${timerColor}11`, transition: "border-color 0.5s, box-shadow 0.5s", position: "relative" }}>
                <svg style={{ position: "absolute", top: -4, left: -4, width: 228, height: 228 }} viewBox="0 0 228 228">
                    <circle cx="114" cy="114" r="110" fill="none" stroke={timerColor} strokeWidth="4" strokeOpacity="0.15" />
                    <circle cx="114" cy="114" r="110" fill="none" stroke={timerColor} strokeWidth="4" strokeDasharray={`${2 * Math.PI * 110}`} strokeDashoffset={`${2 * Math.PI * 110 * (1 - pct / 100)}`} strokeLinecap="round" transform="rotate(-90 114 114)" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }} />
                </svg>
                {finished ? (
                    <div className="blink" style={{ fontFamily: "var(--font-pixel)", fontSize: 13, color: "var(--red)", lineHeight: 1.6, textAlign: "center" }}>{t.timeup}</div>
                ) : (
                    <div style={{ fontFamily: "var(--font-pixel)", fontSize: 36, color: timerColor, letterSpacing: 4, transition: "color 0.5s" }}>{pad(mins)}:{pad(secs)}</div>
                )}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
                {!finished && (
                    <button className={running ? "pixel-btn gray" : "pixel-btn yellow"} style={{ fontSize: 9, padding: "12px 20px" }} onClick={() => setRunning((r) => !r)}>
                        {running ? t.pause : t.resume}
                    </button>
                )}
                <button className="pixel-btn gray" style={{ fontSize: 9, padding: "12px 20px" }} onClick={() => { setTimeLeft(timerSeconds); setRunning(false); setFinished(false); }}>{t.restart}</button>
            </div>
            <ForgotSection roles={roles} onForgot={onForgot} t={t} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
                {(finished || !running) && <button className="pixel-btn yellow" style={{ width: "100%", fontSize: 10 }} onClick={onDone}>{t.done}</button>}
                <button className="pixel-btn gray" style={{ width: "100%", fontSize: 9 }} onClick={onDone}>{t.skip}</button>
            </div>
        </div>
    );
}