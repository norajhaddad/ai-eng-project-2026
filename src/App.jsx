
import React, { useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes
} from 'react-router-dom';

import {
  ArrowLeft,
  Check,
  ChevronRight,
  Plus,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

import FilterDropdown from './FilterDropdown.jsx';
import fnafData from './fnaf-roster.js';
import AnimatronicCard from './AnimatronicCard.jsx';
import './styles.css';

const accents = ['peach', 'violet', 'gold', 'mint'];

// Character portraits: upload PNG files to
// src/assets/characters/ using character IDs as filenames.
// Example: freddy.png, toy-bonnie.png, jack-o-chica.png.
// Characters without an image display initials instead.
const portraitModules = import.meta.glob(
  './assets/characters/*.{png,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' }
);

const characterImages = {};

Object.entries(portraitModules).forEach(([path, url]) => {
  const filename = path.split('/').pop();
  const id = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  characterImages[id] = url;
});

function CharacterIcon({ character, size = 'normal' }) {
  const initials = character.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2);

  const index = fnafData.findIndex(
    entry => entry.id === character.id
  );

  const accent = accents[
    Math.max(0, index) % accents.length
  ];

  const image = characterImages[character.id];

  return (
    <span
      className={`character-avatar avatar-${accent} avatar-${size}`}
      aria-label={character.name}
      title={character.name}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="character-image"
        />
      ) : (
        initials
      )}
    </span>
  );
}

function Gallery() {
  const [gameFilter, setGameFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const games = [
    'All',
    ...new Set(fnafData.map(c => c.originalGame))
  ];

  const locations = [
    'All',
    ...new Set(fnafData.map(c => c.unlockLocation))
  ];

  const methods = [
    'All',
    ...new Set(fnafData.map(c => c.unlockMethod))
  ];

  const filteredCharacters = fnafData.filter(character => (
    (gameFilter === 'All' ||
      character.originalGame === gameFilter) &&
    (locationFilter === 'All' ||
      character.unlockLocation === locationFilter) &&
    (methodFilter === 'All' ||
      character.unlockMethod === methodFilter)
  ));

  function clearFilters() {
    setGameFilter('All');
    setLocationFilter('All');
    setMethodFilter('All');
  }

  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">
          <Sparkles size={15} />
          THE CHARACTER INDEX
        </span>

        <h1>
          Meet the <em>animatronics.</em>
        </h1>

        <p>
          For those who are tired of the attack names
          that aren't intuitive.
        </p>
      </div>

      <div className="section-heading">
        <h2>
          Character collection
          <span className="count-pill">
            {fnafData.length}
          </span>
        </h2>

        <span className="helper-text">
          Original roster + Update 2
        </span>
      </div>


      <div className="gallery-filters">
        <FilterDropdown
          label="Original game"
          value={gameFilter}
          options={games}
          onChange={setGameFilter}
          allLabel="All games"
          color="lavender"
        />

        <FilterDropdown
          label="Unlock location"
          value={locationFilter}
          options={locations}
          onChange={setLocationFilter}
          allLabel="All locations"
          color="peach"
        />

        <FilterDropdown
          label="Unlock method"
          value={methodFilter}
          options={methods}
          onChange={setMethodFilter}
          allLabel="All methods"
          color="mint"
        />

        <button
          type="button"
          className="filter-reset"
          onClick={clearFilters}
        >
          Clear filters
        </button>
      </div>


      <p className="filter-count">
        Showing {filteredCharacters.length} of{' '}
        {fnafData.length} animatronics
      </p>

      {filteredCharacters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <Sparkles size={36} />
          </div>

          <h3>No matches found!</h3>

          <p>
            Try changing one of your filters.
          </p>

          <button
            type="button"
            className="button button-secondary"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="character-grid">
          {filteredCharacters.map(character => {
            const index = fnafData.findIndex(
              entry => entry.id === character.id
            );

            return (
              <AnimatronicCard
                key={character.id}
                character={character}
                accent={accents[index % accents.length]}
                icon={
                  <CharacterIcon
                    character={character}
                    size="large"
                  />
                }
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

function TeamBuilder({ parties, onCreateParty }) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);

  function toggle(id) {
    setSelected(current => {
      if (current.includes(id)) {
        return current.filter(value => value !== id);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, id];
    });
  }

  function cancel() {
    setSelected([]);
    setSelecting(false);
  }

  function create() {
    if (selected.length !== 4) return;

    onCreateParty([...selected]);
    cancel();
  }

  if (selecting) {
    return (
      <main className="page-shell narrow-page">
        <button
          className="text-button back-button"
          onClick={cancel}
          type="button"
        >
          <ArrowLeft size={17} />
          Back to parties
        </button>

        <div className="page-intro">
          <span className="eyebrow">
            <Users size={15} />
            BUILD YOUR DREAM TEAM
          </span>

          <h1>
            Choose your <em>four.</em>
          </h1>

          <p>
            Pick exactly four unique animatronics to
            create a party. You can use a character in
            more than one party.
          </p>
        </div>

        <div className="selection-top">
          <h2>Available characters</h2>

          <span className="selection-count">
            {selected.length}
            <span> / 4 selected</span>
          </span>
        </div>

        <div className="selection-list">
          {fnafData.map(character => {
            const active = selected.includes(character.id);
            const unavailable =
              selected.length === 4 && !active;

            return (
              <button
                key={character.id}
                type="button"
                aria-pressed={active}
                disabled={unavailable}
                onClick={() => toggle(character.id)}
                className={`selection-row ${
                  active ? 'selected' : ''
                }`}
              >
                <CharacterIcon character={character} />

                <span className="selection-description">
                  <strong>{character.name}</strong>

                  <small>
                    {character.fnafWorld.roles
                      .map(role => role.label)
                      .join(' · ')}
                  </small>
                </span>

                <span className="selection-check">
                  {active ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <Plus size={18} />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="selection-actions">
          <button
            className="button button-quiet"
            type="button"
            onClick={() => setSelected([])}
          >
            <X size={16} />
            CLEAR
          </button>

          <button
            className="button button-primary"
            type="button"
            disabled={selected.length !== 4}
            onClick={create}
          >
            CREATE PARTY
            <ChevronRight size={17} />
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-intro">
        <span className="eyebrow">
          <Users size={15} />
          YOUR TEAM WORKSHOP
        </span>

        <h1>
          Better together. <em>Always.</em>
        </h1>

        <p>
          Mix and match animatronics to build your own
          parties. Each party holds four characters.
        </p>
      </div>

      <div className="section-heading">
        <h2>
          My parties
          <span className="count-pill">
            {parties.length}
          </span>
        </h2>

        <button
          type="button"
          className="button button-primary"
          onClick={() => setSelecting(true)}
        >
          <Plus size={18} />
          Create New Party
        </button>
      </div>

      {parties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <Users size={40} />
          </div>

          <h3>No parties yet!</h3>

          <p>
            Your next great team starts with four friends.
          </p>

          <button
            className="button button-secondary"
            onClick={() => setSelecting(true)}
            type="button"
          >
            <Plus size={17} />
            Make your first party
          </button>
        </div>
      ) : (
        <div className="party-list">
          {parties.map((party, index) => (
            <div className="party-row" key={party.id}>
              <span className="party-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="party-label">
                <strong>Party {index + 1}</strong>
                <small>4 animatronics</small>
              </div>

              <div className="party-members">
                {party.memberIds.map(id => {
                  const character = fnafData.find(
                    entry => entry.id === id
                  );

                  return character ? (
                    <CharacterIcon
                      key={id}
                      character={character}
                    />
                  ) : null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="helper-text below-list">
        Parties are saved for this session only.
        Database saving and battle analysis are
        planned features.
      </p>
    </main>
  );
}

export default function App() {
  const [parties, setParties] = useState([]);

  function addParty(memberIds) {
    setParties(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        memberIds,
      },
    ]);
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <header className="site-header">
          <div className="header-inner">
            <NavLink className="brand" to="/">
              <span className="brand-mark">★</span>

              <span>
                FNaF <strong>WORLD</strong>
                <small>TEAM LAB</small>
              </span>
            </NavLink>

            <nav
              className="main-nav"
              aria-label="Main navigation"
            >
              <NavLink
                end
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Character Gallery
              </NavLink>

              <NavLink
                to="/team-builder"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Team Builder
              </NavLink>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Gallery />} />

          <Route
            path="/team-builder"
            element={
              <TeamBuilder
                parties={parties}
                onCreateParty={addParty}
              />
            }
          />

          <Route path="*" element={<Gallery />} />
        </Routes>

        <footer className="site-footer">
          Made for curious animatronics
          <span>✦</span>
          Unofficial fan project
        </footer>
      </div>
    </BrowserRouter>
  );
}
