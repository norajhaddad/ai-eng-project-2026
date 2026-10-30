const express = require('express');
const db = require('./database.cjs');

const app = express();
const PORT = 3001;
app.use(express.json());

let rosterPromise;
function getRoster() {
  if (!rosterPromise) {
    rosterPromise = import('../src/fnaf-roster.js').then(module => module.default);
  }
  return rosterPromise;
}

const CATEGORIES = ['Damage', 'Healing', 'Support', 'Control', 'Poison',
  'Debuff', 'Defense', 'Revival', 'Instant KO', 'Random'];
const WEIGHTS = {
  Damage: 1.4, Healing: 3.5, Support: 2, Control: 1.5,
  Poison: 1, Debuff: 1.5, Defense: 3, Revival: 3.5,
  'Instant KO': 1, Random: 0.3
};

function categoryCounts(characters) {
  const counts = Object.fromEntries(CATEGORIES.map(category => [category, 0]));
  for (const character of characters) {
    const categories = new Set(
      (character.fnafWorld?.moves || []).map(move => move.category)
    );
    for (const category of categories) {
      counts[category] = (counts[category] || 0) + 1;
    }
  }
  return counts;
}

function scoreTeam(characters) {
  const counts = categoryCounts(characters);
  let score = 0;
  for (const category of CATEGORIES) {
    const count = counts[category] || 0;
    if (count > 0) score += WEIGHTS[category];
    if (count > 1) score += WEIGHTS[category] * 0.3;
    if (count > 2) score += WEIGHTS[category] * 0.1;
  }
  return score;
}

function analyzeTeam(characters, roster) {
  const counts = categoryCounts(characters);
  const strengths = [];
  const weaknesses = [];
  if (counts.Healing) strengths.push(
    counts.Healing > 1 ? 'Multiple animatronics have healing moves.' :
      'Your party has a healing option.'
  );
  else weaknesses.push('No healing moves are available.');
  if (counts.Damage > 1) strengths.push('Multiple animatronics have damage moves.');
  else if (!counts.Damage) weaknesses.push('No direct damage moves are listed.');
  if (counts.Support) strengths.push('Your party has stat-boosting or support moves.');
  if (counts.Defense) strengths.push('Your party has defensive abilities.');
  else weaknesses.push('No defensive moves are listed.');
  if (counts.Revival) strengths.push('Your party can revive fallen allies.');
  else weaknesses.push('No revival moves are listed.');
  if (counts.Control) strengths.push('Your party has enemy-control options.');
  if (!strengths.length) strengths.push('Your party has four animatronics ready to fight.');

  const existing = new Set(characters.map(c => c.id));
  const baseScore = scoreTeam(characters);
  const suggestions = [];

  for (let slot = 0; slot < characters.length; slot++) {
    const outgoing = characters[slot];
    for (const incoming of roster) {
      if (existing.has(incoming.id)) continue;
      const trial = [...characters];
      trial[slot] = incoming;
      const improvement = scoreTeam(trial) - baseScore;
      if (improvement <= 0.01) continue;

      const before = categoryCounts(characters);
      const after = categoryCounts(trial);
      const gains = CATEGORIES.filter(c => before[c] === 0 && after[c] > 0);
      const losses = CATEGORIES.filter(c => before[c] > 0 && after[c] === 0);
      const extra = CATEGORIES.filter(c => before[c] > 0 && after[c] > before[c]);
      const reasons = [];
      if (gains.length) reasons.push(`Adds ${gains.join(', ')} coverage.`);
      if (extra.length) reasons.push(`Adds another source of ${extra.join(', ')}.`);
      if (losses.length) reasons.push(`Loses ${losses.join(', ')} coverage.`);
      if (!reasons.length) reasons.push('Improves overall ability coverage.');
      suggestions.push({
        removeId: outgoing.id, removeName: outgoing.name,
        addId: incoming.id, addName: incoming.name,
        improvement: Number(improvement.toFixed(2)),
        gains, losses, reason: reasons.join(' ')
      });
    }
  }

  suggestions.sort((a, b) => b.improvement - a.improvement ||
    a.addName.localeCompare(b.addName));
  const picked = [];
  const seen = new Set();
  for (const suggestion of suggestions) {
    if (seen.has(suggestion.addId)) continue;
    seen.add(suggestion.addId);
    picked.push(suggestion);
    if (picked.length === 3) break;
  }
  return { roleCounts: counts, strengths, weaknesses, suggestions: picked };
}

app.get('/api/parties', (req, res) => {
  const parties = db.prepare('SELECT * FROM parties ORDER BY id DESC').all();
  res.json(parties.map(party => ({
    ...party, member_ids: JSON.parse(party.member_ids)
  })));
});

app.post('/api/parties', (req, res) => {
  const { name, member_ids } = req.body || {};
  if (typeof name !== 'string' || !name.trim() ||
      !Array.isArray(member_ids) || member_ids.length !== 4 ||
      !member_ids.every(id => typeof id === 'string') ||
      new Set(member_ids).size !== 4) {
    return res.status(400).json({
      error: 'A party needs a name and four different character IDs.'
    });
  }
  const result = db.prepare(
    'INSERT INTO parties (name, member_ids) VALUES (?, ?)'
  ).run(name.trim(), JSON.stringify(member_ids));
  res.status(201).json({
    id: Number(result.lastInsertRowid), name: name.trim(), member_ids
  });
});

app.patch('/api/parties/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid party ID.' });
  }
  const { name } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 32) {
    return res.status(400).json({ error: 'Party name must be 1 to 32 characters.' });
  }
  const result = db.prepare('UPDATE parties SET name = ? WHERE id = ?')
    .run(name.trim(), id);
  if (!result.changes) return res.status(404).json({ error: 'Party not found.' });
  res.json({ id, name: name.trim() });
});

app.post('/api/parties/:id/analyze', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid party ID.' });
  }
  const party = db.prepare('SELECT * FROM parties WHERE id = ?').get(id);
  if (!party) return res.status(404).json({ error: 'Party not found.' });

  try {
    const roster = await getRoster();
    const byId = new Map(roster.map(character => [character.id, character]));
    const memberIds = JSON.parse(party.member_ids);
    const characters = memberIds.map(memberId => byId.get(memberId));
    if (characters.length !== 4 || characters.some(c => !c)) {
      return res.status(422).json({
        error: 'One or more saved party characters are missing from the roster.'
      });
    }
    res.json({ partyId: id, ...analyzeTeam(characters, roster) });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Could not analyze this party.' });
  }
});

app.delete('/api/parties/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid party ID.' });
  }
  const result = db.prepare('DELETE FROM parties WHERE id = ?').run(id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Party not found.' });
  }
  res.json({ message: 'Party deleted successfully.', id });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});
