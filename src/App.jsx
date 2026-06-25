import { useState } from "react";
import Home from "./screens/Home";
import Setup from "./screens/Setup";
import Distribution from "./screens/Distribution";
import Summary from "./screens/Summary";
import VoteTimer from "./screens/VoteTimer";
import { distributeRoles } from "./utils/game";
import { ForgotWordOverlay } from "./screens/Distribution";


export default function App() {
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState(null);
  const [lang, setLang] = useState("en");
  const [roles, setRoles] = useState([]);
  const [lastSetup, setLastSetup] = useState(null);
  const [setupPrefill, setSetupPrefill] = useState(null);
  const [forgotPlayer, setForgotPlayer] = useState(null);

  const handleModeSelect = (selectedMode) => { setMode(selectedMode); setSetupPrefill(null); setScreen("setup"); };

  const handleStart = ({ players, wordPair, mode: gameMode, timerSeconds }) => {
    const distributed = distributeRoles({ players, mode: gameMode, wordPair });
    setRoles(distributed);
    setLastSetup({ players, wordPair, mode: gameMode, timerSeconds });
    setScreen("distribution");
  };

  const handleRestart = () => {
    if (lastSetup) {
      setSetupPrefill({ players: lastSetup.players, timerSeconds: lastSetup.timerSeconds });
      setScreen("setup");
    } else {
      setScreen("setup");
    }
  };

  const handleHome = () => { setRoles([]); setMode(null); setLastSetup(null); setSetupPrefill(null); setScreen("home"); };
  const handleForgot = (name) => { setForgotPlayer(roles.find((r) => r.name === name) || null); };

  return (
      <div className="app">
        {screen === "home" && <Home onSelect={handleModeSelect} lang={lang} setLang={setLang} />}
        {screen === "setup" && <Setup mode={mode} lang={lang} onStart={handleStart} onBack={handleHome} prefill={setupPrefill} />}
        {screen === "distribution" && (
            <Distribution roles={roles} mode={mode} lang={lang}
                          onDone={() => setScreen("summary")}
                          onBack={() => setScreen("setup")}
            />
        )}
        {screen === "summary" && (
            <Summary roles={roles} mode={mode} lang={lang}
                     timerSeconds={lastSetup?.timerSeconds || 0}
                     onVote={() => setScreen("vote")}
                     onRestart={handleRestart}
                     onHome={handleHome}
            />
        )}
        {screen === "vote" && (
            <VoteTimer
                timerSeconds={lastSetup?.timerSeconds || 0}
                lang={lang} roles={roles}
                onDone={() => setScreen("summary")}
                onForgot={handleForgot}
            />
        )}
        {forgotPlayer && <ForgotWordOverlay player={forgotPlayer} lang={lang} onClose={() => setForgotPlayer(null)} />}
      </div>
  );
}