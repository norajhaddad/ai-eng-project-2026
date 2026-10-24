import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes
} from 'react-router-dom';
import {
  ArrowLeft,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  Trash2,
  X
} from 'lucide-react';

import FilterDropdown from './FilterDropdown.jsx';
import fnafData from './fnaf-roster.js';
import AnimatronicCard from './AnimatronicCard.jsx';
import PartyAnalysis from './PartyAnalysis.jsx';
import CharacterProfile from './CharacterProfile.jsx';
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

function GalleryFilters({
  gameFilter,
  locationFilter,
  methodFilter,
  games,
  locations,
  methods,
  onGameChange,
  onLocationChange,
  onMethodChange,
  onClear
}) {
  return (
    <div className="gallery-filters">
      <FilterDropdown
        label="Original game"
        value={gameFilter}
        options={games}
        onChange={onGameChange}
        allLabel="All games"
        color="lavender"
      />
      <FilterDropdown
        label="Unlock location"
        value={locationFilter}
        options={locations}
        onChange={onLocationChange}
        allLabel="All locations"
        color="peach"
      />
      <FilterDropdown
        label="Unlock method"
        value={methodFilter}
        options={methods}
        onChange={onMethodChange}
        allLabel="All methods"
        color="mint"
      />
      <button
        type="button"
        className="filter-reset"
        onClick={onClear}
      >
        Clear filters
      </button>
    </div>
  );
}

function Gallery() {
  const [gameFilter, setGameFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const activeFilterCount = [
    gameFilter,
    locationFilter,
    methodFilter
  ].filter(value => value !== 'All').length;

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

  function changeGame(value) {
    setGameFilter(value);
    setPage(1);
  }

  function changeLocation(value) {
    setLocationFilter(value);
    setPage(1);
  }

  function changeMethod(value) {
    setMethodFilter(value);
    setPage(1);
  }

  function showCharacters() {
    setMobileFiltersOpen(false);

    requestAnimationFrame(() => {
      document
        .getElementById('character-gallery')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });
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
    <main className="page-shell gallery-page">
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

      <div className="gallery-desktop-filters">
        <GalleryFilters
          gameFilter={gameFilter}
          locationFilter={locationFilter}
          methodFilter={methodFilter}
          games={games}
          locations={locations}
          methods={methods}
          onGameChange={changeGame}
          onLocationChange={changeLocation}
          onMethodChange={changeMethod}
          onClear={clearFilters}
        />
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
              onClick={() => setMobileFiltersOpen(true)}
            >
              Change filters
            </button>
            <button
              type="button"
              className="filter-reset"
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

      <div
        className={`mobile-gallery-filter-panel ${
          mobileFiltersOpen ? 'expanded' : ''
        }`}
      >
        <button
          type="button"
          className="mobile-gallery-filter-toggle"
          onClick={() =>
            setMobileFiltersOpen(current => !current)
          }
          aria-expanded={mobileFiltersOpen}
          aria-controls="mobile-gallery-filter-details"
        >
          <span className="mobile-gallery-filter-title">
            <SlidersHorizontal size={19} />
            <strong>Filters</strong>
            {activeFilterCount > 0 && (
              <span className="mobile-filter-active-count">
                {activeFilterCount} active
              </span>
            )}
          </span>

          <span className="mobile-gallery-filter-right">
            <span>
              {filteredCharacters.length} results
            </span>
            {mobileFiltersOpen ? (
              <ChevronDown size={19} />
            ) : (
              <ChevronUp size={19} />
            )}
          </span>
        </button>

        <div
          id="mobile-gallery-filter-details"
          className="mobile-gallery-filter-details"
          hidden={!mobileFiltersOpen}
        >
          <GalleryFilters
            gameFilter={gameFilter}
            locationFilter={locationFilter}
            methodFilter={methodFilter}
            games={games}
            locations={locations}
            methods={methods}
            onGameChange={changeGame}
            onLocationChange={changeLocation}
            onMethodChange={changeMethod}
            onClear={clearFilters}
          />

          <button
            type="button"
            className="button button-primary mobile-show-characters"
            onClick={showCharacters}
          >
            Show {filteredCharacters.length} characters
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </main>
  );
}

function PartySlots({ selectedCharacters, onRemove }) {
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
                  onClick={() => onRemove(character.id)}
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

function PartyActions({
  selectedCount,
  onClear,
  onCreate,
  saving
}) {
  return (
    <div className="party-preview-actions">
      <button
        className="button button-quiet"
        type="button"
        onClick={onClear}
        disabled={selectedCount === 0 || saving}
      >
        <X size={16} />
        CLEAR
      </button>

      <button
        className="button button-primary"
        type="button"
        disabled={selectedCount !== 4 || saving}
        onClick={onCreate}
      >
        {saving ? 'SAVING...' : 'CREATE PARTY'}
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

function TeamBuilder({
  parties,
  onCreateParty,
  onDeleteParty,
  loading,
  error
}) {
  const [selecting, setSelecting] = useState(false);
  const [analyzingPartyId, setAnalyzingPartyId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [mobilePartyOpen, setMobilePartyOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedPartyIds, setSelectedPartyIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [pendingDeletion, setPendingDeletion] = useState(null);

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

  function removeCharacter(id) {
    setSelected(current =>
      current.filter(value => value !== id)
    );
  }

  function cancel() {
    setSelected([]);
    setSearch('');
    setPage(1);
    setMobilePartyOpen(false);
    setSelecting(false);
  }

  async function create() {
    if (selected.length !== 4 || saving) return;

    setSaving(true);

    try {
      const saved = await onCreateParty([...selected]);

      if (saved) {
        cancel();
      }
    } finally {
      setSaving(false);
    }
  }

  function togglePartySelection(id) {
    setSelectedPartyIds(current =>
      current.includes(id)
        ? current.filter(value => value !== id)
        : [...current, id]
    );
  }

  function exitDeleteMode() {
    setDeleteMode(false);
    setSelectedPartyIds([]);
  }

  function deleteOneParty(party) {
    if (deleting) return;
    setPendingDeletion({ ids: [party.id], label: 'this party' });
  }

  function deleteSelectedParties() {
    if (deleting || selectedPartyIds.length === 0) return;
    setPendingDeletion({
      ids: [...selectedPartyIds],
      label: `${selectedPartyIds.length} selected ${selectedPartyIds.length === 1 ? 'party' : 'parties'}`
    });
  }

  async function confirmDeletion() {
    if (!pendingDeletion || deleting) return;
    const ids = pendingDeletion.ids;
    setDeleting(true);
    try {
      let allDeleted = true;
      for (const id of ids) {
        const deleted = await onDeleteParty(id);
        if (!deleted) allDeleted = false;
      }
      if (allDeleted) {
        exitDeleteMode();
      } else {
        setSelectedPartyIds(current => current.filter(id => !ids.includes(id)));
      }
      setPendingDeletion(null);
    } finally {
      setDeleting(false);
    }
  }

  function clearSearch() {
    setSearch('');
    setPage(1);
  }

  const analyzingIndex = parties.findIndex(
    party => party.id === analyzingPartyId
  );

  if (analyzingIndex !== -1) {
    return (
      <PartyAnalysis
        party={parties[analyzingIndex]}
        partyNumber={analyzingIndex + 1}
        onBack={() => setAnalyzingPartyId(null)}
      />
    );
  }

  if (selecting) {
    return (
      <main className="page-shell party-builder-page">
        <button
          className="text-button back-button"
          onClick={cancel}
          type="button"
          disabled={saving}
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

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            {error}
          </p>
        )}

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
                    disabled={unavailable || saving}
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

            <PartySlots
              selectedCharacters={selectedCharacters}
              onRemove={removeCharacter}
            />

            <PartyActions
              selectedCount={selected.length}
              onClear={() => setSelected([])}
              onCreate={create}
              saving={saving}
            />
          </aside>
        </div>

        <div
          className={`mobile-party-panel ${
            mobilePartyOpen ? 'expanded' : ''
          }`}
        >
          <div className="mobile-party-toggle">
            <div className="mobile-party-heading">
              <strong>Current party</strong>
              <span>{selected.length} / 4</span>
            </div>

            <div className="mobile-party-portraits">
              {Array.from({ length: 4 }, (_, index) => {
                const character = selectedCharacters[index];

                return character ? (
                  <span
                    key={character.id}
                    className="mobile-party-portrait filled"
                    title={character.name}
                  >
                    <CharacterIcon character={character} />
                    <button
                      type="button"
                      className="mobile-portrait-remove-button"
                      onClick={() =>
                        removeCharacter(character.id)
                      }
                      aria-label={`Remove ${character.name} from party`}
                      title={`Remove ${character.name}`}
                      disabled={saving}
                    >
                      <X
                        size={11}
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </button>
                  </span>
                ) : (
                  <span
                    key={`empty-${index}`}
                    className="mobile-party-portrait empty"
                    aria-label={`Empty slot ${index + 1}`}
                  >
                    <Plus size={18} />
                  </span>
                );
              })}
            </div>

            <button
              type="button"
              className="mobile-party-expand-button"
              onClick={() =>
                setMobilePartyOpen(current => !current)
              }
              aria-expanded={mobilePartyOpen}
              aria-controls="mobile-party-details"
            >
              {mobilePartyOpen
                ? 'Hide party details'
                : 'View party details'}

              {mobilePartyOpen ? (
                <ChevronDown size={17} />
              ) : (
                <ChevronUp size={17} />
              )}
            </button>
          </div>

          <div
            id="mobile-party-details"
            className="mobile-party-details"
            hidden={!mobilePartyOpen}
          >
            <PartySlots
              selectedCharacters={selectedCharacters}
              onRemove={removeCharacter}
            />

            <PartyActions
              selectedCount={selected.length}
              onClear={() => setSelected([])}
              onCreate={create}
              saving={saving}
            />
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
          Know who to bring into <em>battle.</em>
        </h1>
        <p>
          Mix and match animatronics to build
          your own parties. Each party holds
          four characters.
        </p>
      </div>

      <div className="section-heading parties-section-heading">
        <h2>
          My parties
          <span className="count-pill">
            {parties.length}
          </span>
        </h2>

        <div className="party-heading-actions">
        <button
          type="button"
          className="button button-secondary"
          style={{ color: '#b42318', borderColor: '#b42318' }}
          onClick={() => deleteMode ? exitDeleteMode() : setDeleteMode(true)}
          disabled={deleting || loading || parties.length === 0}
        >
          <Trash2 size={17} />
          {deleteMode ? 'Cancel' : 'Delete Parties'}
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => setSelecting(true)}
          disabled={deleteMode || deleting}
        >
          <Plus size={18} />
          Create New Party
        </button>
      </div>
      </div>

      {error && (
        <p role="alert" style={{ color: 'crimson' }}>
          {error}
        </p>
      )}

      {deleteMode && !loading && (
      <div className="party-bulk-controls">
        <label className="party-select-all">
          <input
            type="checkbox"
            className="party-checkbox"
            checked={parties.length > 0 && selectedPartyIds.length === parties.length}
            onChange={event => setSelectedPartyIds(event.target.checked ? parties.map(party => party.id) : [])}
            disabled={deleting}
          />
          Select All
        </label>
        <button
          type="button"
          className="button button-secondary"
          style={{ color: '#b42318', borderColor: '#b42318' }}
          disabled={deleting || selectedPartyIds.length === 0}
          onClick={deleteSelectedParties}
        >
          <Trash2 size={16} />
          {deleting ? 'Deleting...' : `Delete Selected (${selectedPartyIds.length})`}
        </button>
      </div>
    )}

    {loading ? (
        <div className="empty-state">
          <p>Loading saved parties...</p>
        </div>
      ) : parties.length === 0 && !error ? (
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
              {deleteMode && (
              <input
                type="checkbox"
                className="party-checkbox"
                aria-label={`Select Party ${index + 1}`}
                checked={selectedPartyIds.includes(party.id)}
                onChange={() => togglePartySelection(party.id)}
                disabled={deleting}
              />
            )}
            <span className="party-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="party-label">
                <strong>Party {index + 1}</strong>
                <small>4 animatronics</small>
              </div>

              <div className="party-row-actions">
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

                <div className="party-action-buttons">
                <button
                  type="button"
                  className="button button-secondary party-analyze-button"
                  onClick={() => setAnalyzingPartyId(party.id)}
                >
                  <ChartNoAxesColumnIncreasing size={16} />
                  Analyze
                </button>
              {!deleteMode && (
                <button
                  type="button"
                  className="button button-secondary party-trash-button"
                  onClick={() => deleteOneParty(party)}
                  disabled={deleting}
                  aria-label={`Delete Party ${index + 1}`}
                  title={`Delete Party ${index + 1}`}
                >
                  <Trash2 size={17} />
                </button>
              )}
                </div>
            </div>
          </div>
        ))}
        </div>
      )}

      <p className="helper-text below-list">
        Parties are saved to your database.
        Analyze a party to explore its strengths and weaknesses.
      </p>

      {pendingDeletion && (
        <div
          className="delete-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget && !deleting) {
              setPendingDeletion(null);
            }
          }}
        >
          <div
            className="delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <div className="delete-modal-icon" aria-hidden="true">
              <Trash2 size={25} />
            </div>
            <h2 id="delete-modal-title">
              {pendingDeletion.ids.length === 1 ? 'Delete this party?' : `Delete ${pendingDeletion.ids.length} parties?`}
            </h2>
            <p id="delete-modal-description">
              {pendingDeletion.ids.length === 1
                ? 'This party will be permanently deleted.'
                : `These ${pendingDeletion.ids.length} parties will be permanently deleted.`}
              {' '}This action cannot be undone.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setPendingDeletion(null)}
                disabled={deleting}
                autoFocus
              >
                Cancel
              </button>
              <button
                type="button"
                className="button delete-modal-confirm"
                onClick={confirmDeletion}
                disabled={deleting}
              >
                <Trash2 size={16} />
                {deleting ? 'Deleting...' : pendingDeletion.ids.length === 1 ? 'Delete Party' : 'Delete Parties'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function App() {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadParties() {
      try {
        setError('');

        const response = await fetch('/api/parties');

        if (!response.ok) {
          throw new Error('Could not load saved parties.');
        }

        const savedParties = await response.json();

        setParties(
          savedParties.map(party => ({
            id: party.id,
            memberIds: party.member_ids
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadParties();
  }, []);

  async function addParty(memberIds) {
    try {
      setError('');

      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Party ${parties.length + 1}`,
          member_ids: memberIds
        })
      });

      if (!response.ok) {
        throw new Error('Could not save party.');
      }

      const savedParty = await response.json();

      setParties(current => [
        ...current,
        {
          id: savedParty.id,
          memberIds: savedParty.member_ids
        }
      ]);

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function deleteParty(id) {
    try {
      setError('');
      const response = await fetch(`/api/parties/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete party.');
      setParties(current => current.filter(party => party.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
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
              onDeleteParty={deleteParty}
                loading={loading}
                error={error}
              />
            }
          />

        <Route
          path="/characters/:characterId"
          element={<CharacterProfile />}
        />

        <Route
          path="*"
          element={<Gallery />}
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
