
const db = require('./database.cjs');

// Save a test party with four animatronics
const saveParty = db.prepare(`
  INSERT INTO parties (name, member_ids)
  VALUES (?, ?)
`);

saveParty.run(
  'My First Party',
  JSON.stringify(['freddy', 'bonnie', 'chica', 'foxy'])
);

// Retrieve all saved parties
const parties = db.prepare(`
  SELECT * FROM parties
`).all();

console.log('Saved parties:', parties);
