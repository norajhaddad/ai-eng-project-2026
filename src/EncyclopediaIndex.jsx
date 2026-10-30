import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Sparkles, X } from 'lucide-react';
import fnafData from './fnaf-roster.js';
import './encyclopedia-index.css';
import getCharacterImages from './character-images.js';
import FilterDropdown from './FilterDropdown.jsx';

function EncyclopediaCharacterCard({ character, index }) {
  const image = getCharacterImages(character).still;

  return (
    <Link
      className="encyclopedia-index-card"
      to={`/characters/${character.id}`}
      style={{ '--card-hue': [195, 260, 44, 160][index % 4] }}
    >
      <div className="encyclopedia-index-portrait">
        {image ? (
          <img src={image} alt="" loading="lazy" />
        ) : (
          <span className="encyclopedia-index-initial">
            {character.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
          </span>
        )}
      </div>
      <div className="encyclopedia-index-card-label">
        <strong>{character.name}</strong>
        <small>{character.originalGame}</small>
      </div>
      <span className="encyclopedia-index-card-sparkle" aria-hidden="true">✦</span>
    </Link>
  );
}

export default function EncyclopediaIndex() {
  const [search, setSearch] = useState('');
  const [game, setGame] = useState('All games');
  const games = useMemo(() => ['All games', ...new Set(fnafData.map(c => c.originalGame).filter(Boolean))], []);
  const results = fnafData.filter(c =>
    c.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (game === 'All games' || c.originalGame === game)
  );

  return (
    <main className="page-shell encyclopedia-index-page">
      <header className="encyclopedia-index-header">
        <span className="encyclopedia-index-eyebrow"><Sparkles size={16} /> LORE &amp; MORE</span>
        <h1>Meet the animatronics</h1>
        <p>Choose a character to explore their story, appearances, trivia, moves, and mysteries.</p>
      </header>

      <section className="encyclopedia-index-directory" aria-label="Character directory">
        <div className="encyclopedia-index-toolbar">
          <label className="encyclopedia-index-search">
            <Search size={20} aria-hidden="true" />
            <input type="search" placeholder="Find a character..." value={search} onChange={e => setSearch(e.target.value)} aria-label="Search encyclopedia characters" />
            {search && <button type="button" aria-label="Clear search" onClick={() => setSearch('')}><X size={18}/></button>}
          </label>
          <FilterDropdown
            label="Original game"
            value={game}
            options={games}
            onChange={setGame}
            allLabel="All games"
            color="lavender"
          />
        </div>
        <p className="encyclopedia-index-count">Showing {results.length} of {fnafData.length} characters</p>
        {results.length ? (
          <div className="encyclopedia-index-grid">
            {results.map((character, index) => (
            <EncyclopediaCharacterCard
              key={character.id}
              character={character}
              index={index}
            />
          ))}
          </div>
        ) : (
          <div className="encyclopedia-index-empty"><BookOpen size={30}/><p>No characters match those filters.</p><button type="button" onClick={() => {setSearch('');setGame('All games');}}>Clear filters</button></div>
        )}
      </section>
    </main>
  );
}
