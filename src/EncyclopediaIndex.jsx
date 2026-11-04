
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { AlertTriangle, BookOpen, Search, Sparkles, X } from 'lucide-react';
import fnafData from './fnaf-roster.js';
import './encyclopedia-index.css';
import getCharacterImages from './character-images.js';
import FilterDropdown from './FilterDropdown.jsx';
import DriftWall from './DriftWall.jsx';

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
  const [view, setView] = useState('grid');
  const [showMotionWarning, setShowMotionWarning] = useState(false);
  const [motionConfirmed, setMotionConfirmed] = useState(false);
  const dialogRef = useRef(null);
  const driftButtonRef = useRef(null);
  const [motionPreferenceLoaded, setMotionPreferenceLoaded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      if (query.matches) {
        setView('grid');
        setShowMotionWarning(false);
      }
    };
    update();
    setMotionPreferenceLoaded(true);
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (!showMotionWarning) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll('button');
    focusable?.[0]?.focus({ preventScroll: true });

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowMotionWarning(false);
      }
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [showMotionWarning]);

  const requestDriftWall = () => {
    if (view === 'wall') return;
    if (motionConfirmed) {
      setView('wall');
    } else {
      setShowMotionWarning(true);
    }
  };

  const enableDriftWall = () => {
    setMotionConfirmed(true);
    setView('wall');
    setShowMotionWarning(false);
  };

  const wallLayout = viewportWidth <= 480
    ? { columns: 2, tileWidth: 120, tileHeight: 180, gap: 12, tilt: 8, turn: -6, depth: 60 }
    : viewportWidth <= 700
      ? { columns: 2, tileWidth: 145, tileHeight: 190, gap: 14, tilt: 10, turn: -8, depth: 80 }
      : viewportWidth <= 1000
        ? { columns: 3, tileWidth: 155, tileHeight: 205, gap: 16, tilt: 12, turn: -10, depth: 100 }
        : { columns: 5, tileWidth: 180, tileHeight: 220, gap: 18, tilt: 16, turn: -14, depth: 120 };

  const games = useMemo(
    () => ['All games', ...new Set(fnafData.map(c => c.originalGame).filter(Boolean))],
    [],
  );
  const results = fnafData.filter(character =>
    character.name.toLowerCase().includes(search.trim().toLowerCase()) &&
    (game === 'All games' || character.originalGame === game),
  );

  const renderCharacter = (character, index) => (
    <EncyclopediaCharacterCard character={character} index={index} />
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
            <input
              type="search"
              placeholder="Find a character..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              aria-label="Search encyclopedia characters"
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => setSearch('')}>
                <X size={18} />
              </button>
            )}
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

        <div className="encyclopedia-index-view-settings" aria-label="Gallery view settings">
          <h2 className="encyclopedia-index-view-heading">Choose your gallery view</h2>
          <div className="encyclopedia-index-view-toggle" role="group" aria-label="Character gallery view">
            <button
              type="button"
              className={view === 'grid' ? 'is-active' : ''}
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
            >
              Classic Grid
            </button>
            <button
              type="button"
              className={view === 'wall' ? 'is-active' : ''}
              aria-pressed={view === 'wall'}
              ref={driftButtonRef}
              onClick={requestDriftWall}
            >
              Drift Wall (Animated)
            </button>
          </div>
        </div>

        {showMotionWarning && createPortal(
          <div className="encyclopedia-index-motion-backdrop">
            <div
              ref={dialogRef}
              className="encyclopedia-index-motion-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="encyclopedia-motion-title"
              aria-describedby="encyclopedia-motion-description"
            >
              <div className="encyclopedia-index-motion-dialog-heading">
                <AlertTriangle size={26} aria-hidden="true" />
                <h2 id="encyclopedia-motion-title">Motion warning</h2>
              </div>
              <p id="encyclopedia-motion-description">
                Drift Wall features continuous scrolling and 3D movement. This may cause
                dizziness or discomfort if you're sensitive to motion.
              </p>
              <div className="encyclopedia-index-motion-actions">
                <button type="button" className="motion-stay" onClick={() => setShowMotionWarning(false)}>
                  Stay on Classic Grid
                </button>
                <button type="button" className="motion-enable" onClick={enableDriftWall}>
                  Enable Drift Wall
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
        <p className="encyclopedia-index-count">Showing {results.length} of {fnafData.length} characters</p>

        {results.length ? (
          view === 'wall' && motionPreferenceLoaded && results.length >= 5 ? (
            <DriftWall
              key={`${search}-${game}`}
              items={results}
              renderItem={renderCharacter}
              columns={Math.min(wallLayout.columns, results.length)}
              tileWidth={wallLayout.tileWidth}
              tileHeight={wallLayout.tileHeight}
              gap={wallLayout.gap}
              tilt={wallLayout.tilt}
              turn={wallLayout.turn}
              perspective={1200}
              depth={wallLayout.depth}
              speed={42}
              direction="up"
              variance={0.45}
              parallax={0.6}
              lift={64}
              fade={0.6}
              pauseOnHover
            />
          ) : (
            <div className="encyclopedia-index-grid">
              {results.map((character, index) => (
                <EncyclopediaCharacterCard key={character.id} character={character} index={index} />
              ))}
            </div>
          )
        ) : (
          <div className="encyclopedia-index-empty">
            <BookOpen size={30} />
            <p>No characters match those filters.</p>
            <button type="button" onClick={() => { setSearch(''); setGame('All games'); }}>
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
