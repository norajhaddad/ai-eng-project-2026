
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
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Search,
  Sparkles,
  Users,
  X
} from 'lucide-react';

import FilterDropdown from './FilterDropdown.jsx';
import fnafData from './fnaf-roster.js';
import AnimatronicCard from './AnimatronicCard.jsx';
import './styles.css';

const accents = ['peach', 'violet', 'gold', 'mint'];
const CHARACTERS_PER_PAGE = 12;
const PARTY_CHARACTERS_PER_PAGE = 16;

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
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCharacters.length / CHARACTERS_PER_PAGE
    )
  );

  const currentPage = Math.min(page, totalPages);

  const visibleCharacters = filteredCharacters.slice(
    (currentPage - 1) * CHARACTERS_PER_PAGE,
    currentPage * CHARACTERS_PER_PAGE
  );

  function clearFilters() {
    setGameFilter('All');
    setLocationFilter('All');
    setMethodFilter('All');
    setPage(1);
  }

  function changePage(nextPage) {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);

    document
      .getElementById('character-gallery')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
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
          onChange={value => {
            setGameFilter(value);
            setPage(1);
          }}
          allLabel="All games"
          color="lavender"
        />

        <FilterDropdown
          label="Unlock location"
          value={locationFilter}
          options={locations}
          onChange={value => {
            setLocationFilter(value);
            setPage(1);
          }}
          allLabel="All locations"
          color="peach"
        />

        <FilterDropdown
          label="Unlock method"
          value={methodFilter}
          options={methods}
          onChange={value => {
            setMethodFilter(value);
            setPage(1);
          }}
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

      <div
        id="character-gallery"
        className="gallery-stage"
      >
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
          <>
            <div className="gallery-page-info">
              <span>
                Page {currentPage} of {totalPages}
              </span>

              <span>
                {visibleCharacters.length} characters
                on this page
              </span>
            </div>

            <div className="character-grid">
              {visibleCharacters.map(character => {
                const index = fnafData.findIndex(
                  entry => entry.id === character.id
                );

                return (
                  <AnimatronicCard
                    key={character.id}
                    character={character}
                    accent={
                      accents[index % accents.length]
                    }
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

            {totalPages > 1 && (
              <nav
                className="gallery-pagination"
                aria-label="Character gallery pages"
              >
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={currentPage === 1}
                  onClick={() =>
                    changePage(currentPage - 1)
                  }
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map(pageNumber => (
                    <button
                      key={pageNumber}
                      type="button"
                      className={`pagination-number ${
                        currentPage === pageNumber
                          ? 'active'
                          : ''
                      }`}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={
                        currentPage === pageNumber
                          ? 'page'
                          : undefined
                      }
                      onClick={() =>
                        changePage(pageNumber)
                      }
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    changePage(currentPage + 1)
                  }
                >
                  Next →
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function TeamBuilder({ parties, onCreateParty }) {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [mobilePartyOpen, setMobilePartyOpen] = useState(false);

  const selectedCharacters = selected
    .map(id =>
      fnafData.find(character => character.id === id)
    )
    .filter(Boolean);

  const filteredCharacters = fnafData.filter(character => {
    const query = search.trim().toLowerCase();

    return (
      character.name.toLowerCase().includes(query) ||
      character.fnafWorld.roles.some(role =>
        role.label.toLowerCase().includes(query)
      )
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCharacters.length / PARTY_CHARACTERS_PER_PAGE
    )
  );

  const currentPage = Math.min(page, totalPages);

  const visibleCharacters = filteredCharacters.slice(
    (currentPage - 1) * PARTY_CHARACTERS_PER_PAGE,
    currentPage * PARTY_CHARACTERS_PER_PAGE
  );

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
    setSearch('');
    setPage(1);
    setMobilePartyOpen(false);
    setSelecting(false);
  }

  function create() {
    if (selected.length !== 4) return;

    onCreateParty([...selected]);
    cancel();
  }

  function clearSearch() {
    setSearch('');
    setPage(1);
  }

  function PartySlots() {
    return (
      <div className="party-preview-slots">
        {Array.from({ length: 4 }, (_, index) => {
          const character = selectedCharacters[index];

          return (
            <div
              key={index}
              className={`party-preview-slot ${
                character ? 'filled' : 'empty'
              }`}
            >
              {character ? (
                <>
                  <CharacterIcon character={character} />

                  <span className="party-slot-details">
                    <strong>{character.name}</strong>
                    <small>
                      {character.fnafWorld.roles
                        .map(role => role.label)
                        .join(' · ')}
                    </small>
                  </span>

                  <button
                    type="button"
                    className="party-slot-remove"
                    onClick={() => toggle(character.id)}
                    aria-label={`Remove ${character.name}`}
                    title={`Remove ${character.name}`}
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="party-empty-icon">
                    <Plus size={18} />
                  </span>
                  <span className="party-empty-label">
                    Empty slot {index + 1}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function PartyActions() {
    return (
      <div className="party-preview-actions">
        <button
          className="button button-quiet"
          type="button"
          onClick={() => setSelected([])}
          disabled={selected.length === 0}
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
    );
  }

  if (selecting) {
    return (
      <main className="page-shell party-builder-page">
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
            Pick exactly four unique animatronics
            to create a party. You can use a
            character in more than one party.
          </p>
        </div>

        <div className="party-builder-layout">
          <section className="party-picker">
            <div className="selection-top">
              <h2>Available characters</h2>

              <span className="selection-count">
                {selected.length}
                <span> / 4 selected</span>
              </span>
            </div>

            <label className="party-search">
              <Search size={18} aria-hidden="true" />

              <input
                type="search"
                placeholder="Find an animatronic or role..."
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                aria-label="Search animatronics"
              />

              {search && (
                <button
                  type="button"
                  className="party-search-clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <p className="party-results-count">
              Showing {filteredCharacters.length} of{' '}
              {fnafData.length} animatronics
            </p>

            <div className="party-character-grid">
              {visibleCharacters.map(character => {
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
                    className={`party-character-tile ${
                      active ? 'selected' : ''
                    }`}
                  >
                    <span className="party-tile-check">
                      {active ? (
                        <Check
                          size={15}
                          strokeWidth={3}
                        />
                      ) : (
                        <Plus size={15} />
                      )}
                    </span>

                    <CharacterIcon character={character} />

                    <strong className="party-tile-name">
                      {character.name}
                    </strong>

                    <small className="party-tile-roles">
                      {character.fnafWorld.roles
                        .map(role => role.label)
                        .join(' · ')}
                    </small>
                  </button>
                );
              })}
            </div>

            {filteredCharacters.length === 0 && (
              <div className="party-no-results">
                <Search size={24} />
                <p>No matching animatronics found.</p>
                <button
                  type="button"
                  className="text-button"
                  onClick={clearSearch}
                >
                  Clear search
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <nav
                className="party-pagination"
                aria-label="Party builder character pages"
              >
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage(currentPage - 1)
                  }
                >
                  ← Previous
                </button>

                <span className="party-page-number">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage(currentPage + 1)
                  }
                >
                  Next →
                </button>
              </nav>
            )}
          </section>

          <aside className="party-preview party-preview-desktop">
            <div className="party-preview-heading">
              <h2>Current party</h2>

              <span className="party-preview-count">
                {selected.length} / 4
              </span>
            </div>

            <p className="party-preview-helper">
              Select four animatronics to build your team.
            </p>

            <PartySlots />
            <PartyActions />
          </aside>
        </div>

        <div
          className={`mobile-party-panel ${
            mobilePartyOpen ? 'expanded' : ''
          }`}
        >
          <button
            type="button"
            className="mobile-party-toggle"
            onClick={() =>
              setMobilePartyOpen(current => !current)
            }
            aria-expanded={mobilePartyOpen}
            aria-controls="mobile-party-details"
          >
            <span className="mobile-party-heading">
              <strong>Current party</strong>
              <span>{selected.length} / 4</span>
            </span>

            <span className="mobile-party-portraits">
              {Array.from({ length: 4 }, (_, index) => {
                const character = selectedCharacters[index];

                return (
                  <span
                    key={index}
                    className={`mobile-party-portrait ${
                      character ? 'filled' : 'empty'
                    }`}
                  >
                    {character ? (
                      <CharacterIcon character={character} />
                    ) : (
                      <Plus size={18} />
                    )}
                  </span>
                );
              })}
            </span>

            <span className="mobile-party-expand-label">
              {mobilePartyOpen
                ? 'Hide party details'
                : 'View party details'}

              {mobilePartyOpen ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronUp size={17} />
              )}
            </span>
          </button>

          <div
            id="mobile-party-details"
            className="mobile-party-details"
            hidden={!mobilePartyOpen}
          >
            <PartySlots />
            <PartyActions />
          </div>
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
          Mix and match animatronics to build
          your own parties. Each party holds
          four characters.
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
            Your next great team starts with
            four friends.
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
        Database saving and battle analysis
        are planned features.
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
        memberIds
      }
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
                  `nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                Character Gallery
              </NavLink>

              <NavLink
                to="/team-builder"
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                Team Builder
              </NavLink>
            </nav>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Gallery />}
          />

          <Route
            path="/team-builder"
            element={
              <TeamBuilder
                parties={parties}
                onCreateParty={addParty}
              />
            }
          />

          <Route
            path="*"
            element={<Gallery />}
          />
        </Routes>

        <footer className="site-footer">
          Unofficial fan project
        </footer>
      </div>
    </BrowserRouter>
  );
}
