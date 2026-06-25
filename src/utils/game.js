export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const distributeRoles = ({ players, mode, wordPair }) => {
  const shuffled = shuffle([...players]);
  const roles = [];

  if (mode === "undercover") {
    const undercoverCount = players.length >= 7 ? 2 : 1;
    const swap = Math.random() < 0.5;
    const majorityWord = swap ? wordPair.undercover : wordPair.civil;
    const minorityWord = swap ? wordPair.civil : wordPair.undercover;

    for (let i = 0; i < shuffled.length; i++) {
      if (i < undercoverCount) {
        roles.push({ name: shuffled[i], role: "undercover", word: minorityWord });
      } else {
        roles.push({ name: shuffled[i], role: "civil", word: majorityWord });
      }
    }
  } else {
    for (let i = 0; i < shuffled.length; i++) {
      if (i === 0) {
        roles.push({ name: shuffled[i], role: "impostor", word: wordPair.civil, hint: wordPair.undercover });
      } else {
        roles.push({ name: shuffled[i], role: "civil", word: wordPair.civil });
      }
    }
  }
  return players.map((p) => roles.find((r) => r.name === p));
};

export const getRoleDisplay = (role, lang) => {
  const labels = {
    fr: {
      civil: { label: "MOT SECRET", color: "var(--cyan)", desc: "Décris ton mot sans le dire !" },
      undercover: { label: "MOT SECRET", color: "var(--cyan)", desc: "Décris ton mot sans le dire !" },
      impostor: { label: "IMPOSTEUR", color: "var(--yellow)", desc: "Tu sais que tu es l'imposteur. Utilise l'indice pour survivre !" },
    },
    en: {
      civil: { label: "SECRET WORD", color: "var(--cyan)", desc: "Describe your word without saying it!" },
      undercover: { label: "SECRET WORD", color: "var(--cyan)", desc: "Describe your word without saying it!" },
      impostor: { label: "IMPOSTOR", color: "var(--yellow)", desc: "You know you're the impostor. Use the hint to survive!" },
    },
  };
  return labels[lang][role];
};