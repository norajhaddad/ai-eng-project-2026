
import { getCharacterMeta } from './fnaf-character-meta.js';

/*
  FNaF World roster — original game + Update 2.
  Roles are simplified website categories, not official classes.
  Move descriptions are intentionally short.
*/

const moveInfo = {
  "Mic Toss": ["Hits one enemy.", "Damage"],
  "Pizza Wheel": ["Multi-hit attack on enemies.", "Damage"],
  "Pizza Wheel 2": ["Stronger multi-hit pizza attack.", "Damage"],
  "Birthday": ["Boosts attack, defense, and speed.", "Support"],
  "Bite": ["Low damage to an enemy.", "Damage"],
  "Bite 2": ["Stronger bite attack.", "Damage"],
  "Toxic Bite": ["Bite damage plus poison.", "Poison"],
  "Toxic Bite 2": ["Stronger bite plus poison.", "Poison"],
  "Mega Bite": ["Very powerful bite attack.", "Damage"],
  "Bash Jam": ["Damages all enemies.", "Damage"],
  "Happy Jam": ["Heals the party.", "Healing"],
  "Happy Jam 2": ["Stronger party healing.", "Healing"],
  "Cupcake": ["Heals the party.", "Healing"],
  "Waterhose": ["Defeats enemies below 30% HP.", "Instant KO"],
  "Waterhose 2": ["Defeats enemies below 50% HP.", "Instant KO"],
  "Hook": ["Low damage to an enemy.", "Damage"],
  "Poppers": ["Sets off damaging explosions.", "Damage"],
  "Prize Ball": ["Uses a random basic attack.", "Random"],
  "Prize Ball 2": ["Uses a random stronger attack.", "Random"],
  "Munchies": ["Damages enemies over time.", "Damage"],
  "Party Favors": ["Damages enemies and heals allies.", "Healing"],
  "Regen Song": ["Gradually restores party HP.", "Healing"],
  "Jumpscare": ["Temporarily stuns enemies.", "Control"],
  "Hot Cheese": ["Damages enemies over time.", "Damage"],
  "Hot Cheese 2": ["Stronger damage over time.", "Damage"],
  "Sludge": ["Slows enemies.", "Debuff"],
  "Unscrew": ["30% chance to defeat one enemy.", "Instant KO"],
  "Unscrew 2": ["50% chance to defeat one enemy.", "Instant KO"],
  "Balloons": ["Three random-damage hits.", "Damage"],
  "Gloom Song": ["Lowers enemy attack.", "Debuff"],
  "Rainy Day": ["Lowers enemy defense.", "Debuff"],
  "Rainy Day 2": ["Lowers defense and deals damage.", "Debuff"],
  "Toxic Balloon": ["Poisons enemies.", "Poison"],
  "Gloom Balloon": ["Lowers enemy attack.", "Debuff"],
  "Mystery Box": ["Randomly replaces party members.", "Random"],
  "Mystery Box 2": ["Replaces party with random characters.", "Random"],
  "Eye Beam": ["Damage with a critical-hit chance.", "Damage"],
  "Esc Key": ["Chance to defeat multiple enemies.", "Instant KO"],
  "Haunting": ["May turn an enemy to stone.", "Control"],
  "Mimic Ball": ["Repeats your party's attacks.", "Support"],
  "Freddles": ["Summons Freddles for heavy damage.", "Damage"],
  "Bad Pizza": ["Heavy damage to all enemies.", "Damage"],
  "Power Song": ["Boosts party attack.", "Support"],
  "Armor Song": ["Boosts party defense.", "Support"],
  "Speed Song": ["Boosts party speed.", "Support"],
  "Endo Army": ["Summons three attacking Endos.", "Damage"],
  "Neon Wall": ["Blocks half of incoming damage.", "Defense"],
  "Springlocks": ["Powerful area damage.", "Damage"],
  "Cosmic Song": ["Summons damaging comets.", "Damage"],
  "Gift Boxes": ["Automatically revives fallen allies.", "Revival"],

  // Update 2
  "Jack-O-Bomb": ["Bombards enemies with pumpkins.", "Damage"],
  "Slasher": ["Small chance of enormous damage.", "Damage"],
  "Buzzsaw": ["Deals extremely high damage.", "Damage"],
  "Mega Virus": ["Drains enemy HP over time.", "Damage"],
  "4th Wall": ["Heavy damage that ignores defense.", "Damage"],
  "Hocus Pocus": ["May transform enemies into weaker ones.", "Control"],
  "Bubble Breath": ["Protects against toxic cave air.", "Defense"],
  "Balloons 2": ["Many powerful balloon hits.", "Damage"],
  "Neon Wall 2": ["Makes the party briefly invincible.", "Defense"]
};

const roster = [
  ["Freddy", "Mic Toss", "Pizza Wheel", "Birthday"],
  ["Bonnie", "Bite", "Bash Jam", "Happy Jam"],
  ["Chica", "Cupcake", "Party Favors", "Regen Song"],
  ["Foxy", "Hook", "Jumpscare", "Hot Cheese"],

  ["Toy Bonnie", "Bash Jam", "Munchies", "Prize Ball"],
  ["Toy Chica", "Cupcake", "Birthday", "Waterhose"],
  ["Toy Freddy", "Mic Toss", "Party Favors", "Speed Song"],
  ["Mangle", "Hook", "Poppers", "Prize Ball"],

  ["Balloon Boy", "Balloons", "Hot Cheese", "Munchies"],
  ["JJ", "Balloons", "Poppers", "Unscrew"],
  ["Phantom Freddy", "Gloom Song", "Sludge", "Rainy Day"],
  ["Phantom Chica", "Toxic Bite", "Sludge", "Unscrew"],

  ["Phantom Balloon Boy", "Toxic Balloon", "Gloom Balloon", "Rainy Day"],
  ["Phantom Foxy", "Jumpscare", "Toxic Bite", "Unscrew"],
  ["Phantom Mangle", "Toxic Bite", "Mystery Box", "Pizza Wheel 2"],
  ["Withered Bonnie", "Eye Beam", "Pizza Wheel", "Unscrew 2"],

  ["Withered Chica", "Bite", "Cupcake", "Prize Ball 2"],
  ["Withered Freddy", "Mic Toss", "Gloom Song", "Esc Key"],
  ["Withered Foxy", "Hook", "Rainy Day", "Hot Cheese 2"],
  ["Shadow Freddy", "Unscrew", "Esc Key", "Waterhose"],

  ["Marionette", "Prize Ball 2", "Mystery Box", "Esc Key"],
  ["Phantom Marionette", "Jumpscare", "Hot Cheese 2", "Mystery Box 2"],
  ["Golden Freddy", "Jumpscare", "Rainy Day 2", "Haunting"],
  ["Paperpals", "Prize Ball 2", "Mystery Box 2", "Mimic Ball"],

  ["Nightmare Freddy", "Bite 2", "Sludge", "Freddles"],
  ["Nightmare Bonnie", "Bite 2", "Rainy Day 2", "Pizza Wheel 2"],
  ["Nightmare Chica", "Bite 2", "Bad Pizza", "Waterhose"],
  ["Nightmare Foxy", "Bite 2", "Unscrew 2", "Hot Cheese 2"],

  ["Endo-01", "Power Song", "Armor Song", "Endo Army"],
  ["Endo-02", "Speed Song", "Endo Army", "Neon Wall"],
  ["Plushtrap", "Toxic Bite", "Bad Pizza", "Sludge"],
  ["Endoplush", "Neon Wall", "Eye Beam", "Waterhose 2"],

  ["Springtrap", "Bite 2", "Springlocks", "Rainy Day"],
  ["RWQFSFASXC", "Haunting", "Mimic Ball", "Gift Boxes"],
  ["Crying Child", "Power Song", "Armor Song", "Gift Boxes"],
  ["Funtime Foxy", "Happy Jam 2", "Cosmic Song", "Gift Boxes"],

  ["Nightmare Fredbear", "Toxic Bite 2", "Bad Pizza", "Mega Bite"],
  ["Nightmare", "Toxic Bite 2", "Rainy Day 2", "Mega Bite"],
  ["Fredbear", "Mega Bite", "Regen Song", "Mimic Ball"],
  ["Spring Bonnie", "Springlocks", "Happy Jam 2", "Cosmic Song"],

  // Update 2
  ["Jack-O-Bonnie", "Haunting", "Jack-O-Bomb", "Slasher"],
  ["Jack-O-Chica", "Haunting", "Jack-O-Bomb", "Buzzsaw"],
  ["Animdude", "Neon Wall", "Mega Virus", "4th Wall"],
  ["Mr. Chipper", "Mimic Ball", "Buzzsaw", "Hocus Pocus"],

  ["Nightmare Balloon Boy", "Mega Bite", "Bubble Breath", "Balloons 2"],
  ["Nightmarionne", "Prize Ball 2", "Bubble Breath", "4th Wall"],
  ["Coffee", "Gift Boxes", "Mega Virus", "Neon Wall 2"],
  ["Purple Guy", "Springlocks", "Slasher", "Hocus Pocus"]
];

const rolePriority = [
  "Revival",
  "Healing",
  "Defense",
  "Support",
  "Poison",
  "Debuff",
  "Control",
  "Instant KO",
  "Damage",
  "Random"
];

function getRoles(attackNames) {
  const categories = [
    ...new Set(attackNames.map(name => moveInfo[name][1]))
  ];

  return categories
    .sort((a, b) =>
      rolePriority.indexOf(a) - rolePriority.indexOf(b)
    )
    .slice(0, 2)
    .map(label => ({
      label,
      basis: "Based on available attacks",
      status: "inferred"
    }));
}

function makeId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const fnafData = roster.map(([name, ...attackNames], index) => {
  const meta = getCharacterMeta(name);

  return {
    id: makeId(name),
    name,
    game: "FNaF World",
    risk: "Not rated",
    jumpscare: false,
    update: index >= 40 ? 2 : 1,
    ...meta,

    fnafWorld: {
      characterName: name,
      moves: attackNames.map(moveName => ({
        name: moveName,
        effect: moveInfo[moveName][0],
        category: moveInfo[moveName][1]
      })),
      roles: getRoles(attackNames),
      unlock: {
        method: meta.unlockMethod.toLowerCase(),
        earliestArea: meta.unlockLocation,
        recommendedArea: null,
        status: "reference-data"
      }
    }
  };
});

export default fnafData;
