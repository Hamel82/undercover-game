export const wordData = {
  fr: {
    themes: [
      { id: "food", label: "🍕 Nourriture" },
      { id: "sport", label: "⚽ Sport" },
      { id: "nature", label: "🌿 Nature" },
      { id: "tech", label: "💻 Tech" },
    ],
    pairs: {
      food: [["Sushi", "Sashimi"], ["Café", "Expresso"], ["Glace", "Sorbet"], ["Crêpe", "Gaufre"], ["Pizza", "Focaccia"]],
      sport: [["Football", "Rugby"], ["Tennis", "Badminton"], ["Natation", "Plongée"], ["Vélo", "Trottinette"], ["Boxe", "Karaté"]],
      nature: [["Forêt", "Jungle"], ["Rivière", "Ruisseau"], ["Montagne", "Colline"], ["Lune", "Étoile"], ["Rose", "Tulipe"]],
      tech: [["Téléphone", "Tablette"], ["Internet", "Wifi"], ["Robot", "Drone"], ["Clavier", "Souris"], ["Écran", "Moniteur"]],
    },
  },
  en: {
    themes: [
      { id: "food", label: "🍕 Food" },
      { id: "sport", label: "⚽ Sport" },
      { id: "nature", label: "🌿 Nature" },
      { id: "tech", label: "💻 Tech" },
    ],
    pairs: {
      food: [["Sushi", "Sashimi"], ["Coffee", "Espresso"], ["Ice cream", "Sorbet"], ["Pancake", "Waffle"], ["Pizza", "Focaccia"]],
      sport: [["Football", "Rugby"], ["Tennis", "Badminton"], ["Swimming", "Diving"], ["Bike", "Scooter"], ["Boxing", "Karate"]],
      nature: [["Forest", "Jungle"], ["River", "Stream"], ["Mountain", "Hill"], ["Moon", "Star"], ["Rose", "Tulip"]],
      tech: [["Phone", "Tablet"], ["Internet", "Wifi"], ["Robot", "Drone"], ["Keyboard", "Mouse"], ["Screen", "Monitor"]],
    },
  },
};

export const getRandomPair = (lang, theme) => {
  const pairs = wordData[lang].pairs[theme];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  return { civil: pair[0], undercover: pair[1] };
};