
const unlockGroups = {
  "Starter": [
    "Freddy", "Bonnie", "Chica", "Foxy",
    "Toy Bonnie", "Toy Chica", "Toy Freddy", "Mangle"
  ],
  "Fazbear Hills": [
    "Balloon Boy", "JJ", "Phantom Freddy", "Phantom Chica"
  ],
  "Choppy's Woods": [
    "Phantom Balloon Boy", "Phantom Foxy",
    "Phantom Mangle", "Withered Bonnie"
  ],
  "Dusting Fields": [
    "Withered Chica", "Withered Freddy",
    "Withered Foxy", "Shadow Freddy"
  ],
  "Lilygear Lake": [
    "Marionette", "Phantom Marionette",
    "Golden Freddy", "Paperpals"
  ],
  "Blacktomb Yard": [
    "Nightmare Freddy", "Nightmare Bonnie",
    "Nightmare Chica", "Nightmare Foxy"
  ],
  "Deep-Metal Mine": [
    "Endo-01", "Endo-02", "Plushtrap", "Endoplush"
  ],
  "Pinwheel Circus": [
    "Springtrap", "RWQFSFASXC",
    "Crying Child", "Funtime Foxy"
  ],
  "Pinwheel Funhouse": [
    "Nightmare Fredbear", "Nightmare",
    "Fredbear", "Spring Bonnie"
  ]
};


const gameGroups = {
  "FNaF 1": [
    "Freddy", "Bonnie", "Chica", "Foxy",
    "Golden Freddy", "Endo-01"
  ],

  "FNaF 2": [
    "Toy Bonnie", "Toy Chica", "Toy Freddy", "Mangle",
    "Balloon Boy", "JJ", "Withered Bonnie",
    "Withered Chica", "Withered Freddy", "Withered Foxy",
    "Shadow Freddy", "Marionette", "Paperpals",
    "RWQFSFASXC", "Endo-02", "Purple Guy"
  ],

  "FNaF 3": [
    "Phantom Freddy", "Phantom Chica",
    "Phantom Balloon Boy", "Phantom Foxy",
    "Phantom Mangle", "Phantom Marionette",
    "Springtrap", "Spring Bonnie"
  ],

  "FNaF 4": [
    "Nightmare Freddy", "Nightmare Bonnie",
    "Nightmare Chica", "Nightmare Foxy",
    "Plushtrap", "Crying Child",
    "Nightmare Fredbear", "Nightmare",
    "Fredbear", "Jack-O-Bonnie", "Jack-O-Chica",
    "Nightmare Balloon Boy", "Nightmarionne"
  ],

  "FNaF World / Other": [
    "Endoplush", "Funtime Foxy", "Animdude"
  ],

  "Miscellaneous Games": [
    "Coffee", "Mr. Chipper"
  ]
};


const minigameUnlocks = {
  "Jack-O-Bonnie": {
    minigame: "FNaF 57: Freddy in Space",
    requirement: "Complete FNaF 57 without collecting all cupcakes."
  },
  "Jack-O-Chica": {
    minigame: "Foxy Fighters",
    requirement: "Complete Foxy Fighters."
  },
  "Animdude": {
    minigame: "Chica's Magic Rainbow",
    requirement: "Finish after the three-minute mark."
  },
  "Mr. Chipper": {
    minigame: "Chica's Magic Rainbow",
    requirement: "Finish in under three minutes."
  },
  "Nightmare Balloon Boy": {
    minigame: "Foxy Fighters",
    requirement: "Earn an A rank."
  },
  "Nightmarionne": {
    minigame: "Foxy.EXE",
    requirement: "Complete Foxy.EXE."
  },
  "Coffee": {
    minigame: "FNaF 57: Freddy in Space",
    requirement: "Complete FNaF 57 without collecting upgrades."
  },
  "Purple Guy": {
    minigame: "FNaF 57: Freddy in Space",
    requirement: "Collect all cupcakes in FNaF 57."
  }
};

function findGroup(name, groups) {
  return Object.entries(groups).find(
    ([, names]) => names.includes(name)
  )?.[0] ?? "Other";
}

export function getCharacterMeta(name) {
  const game = findGroup(name, gameGroups);
  const minigame = minigameUnlocks[name];

  if (minigame) {
    return {
      originalGame: game,
      unlockLocation: "Halloween Backstage",
      unlockMethod: "Minigame",
      unlockBadge: "Unlocked via minigame",
      unlockDetail: minigame.requirement,
      minigame: minigame.minigame
    };
  }

  const location = findGroup(name, unlockGroups);

  if (location === "Starter") {
    return {
      originalGame: game,
      unlockLocation: "Starter",
      unlockMethod: "Starter",
      unlockBadge: "Starter character",
      unlockDetail: "Available at the start.",
      minigame: null
    };
  }

  return {
    originalGame: game,
    unlockLocation: location,
    unlockMethod: "Encounter",
    unlockBadge: `Unlocked in ${location}`,
    unlockDetail: `First available in ${location}.`,
    minigame: null
  };
}
