
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Waves
} from 'lucide-react';

import fnafData from './fnaf-roster.js';
import { cardPalette, moveEmoji } from './AnimatronicCard.jsx';

import freddyGif from './assets/adventure-freddy.gif';
import freddyStill from './assets/adventure-freddy-still.png';

import './party-analysis.css';

const ROLE_DESCRIPTIONS = {
  Damage: 'Can help defeat enemies',
  Healing: 'Can restore party health',
  Support: 'Can improve or protect the party',
  Control: 'Can interfere with enemies',
  Poison: 'Can apply damage over time',
  Debuff: 'Can weaken enemies',
  Defense: 'Can reduce incoming damage',
  Revival: 'Can revive fallen allies',
  'Instant KO': 'Has a chance to defeat enemies immediately',
  Random: 'Uses unpredictable abilities'
};

/* Automatically load character portraits when you add them. */
const portraitModules = import.meta.glob(
  './assets/characters/*.{png,jpg,jpeg,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
);

const portraitById = Object.fromEntries(
  Object.entries(portraitModules).map(([path, url]) => [
    path
      .split('/')
      .pop()
      .replace(/\.(png|jpg|jpeg|webp)$/i, ''),
    url
  ])
);

/* ==========================================
   COMPACT CHARACTER CARD
   ========================================== */

function AnalysisCharacter({ character }) {
  const [hovered, setHovered] = useState(false);

  const portrait = portraitById[character.id];
  const isFreddy = character.id === 'freddy';

  const initials = character.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2);

  return (
    <article
      className="analysis-character analysis-aero-card"
      style={cardPalette(character)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setHovered(false);
        }
      }}
    >
      {/* Small decorative details */}
      <span
        className="analysis-compact-spark"
        aria-hidden="true"
      >
        ✦
      </span>

      <span
        className="analysis-compact-bubble"
        aria-hidden="true"
      />

      {/* Portrait and name side by side */}
      <div className="analysis-compact-header">
        <div className="analysis-compact-portrait">
          {portrait ? (
            <img src={portrait} alt="" />
          ) : isFreddy ? (
            <img
              src={hovered ? freddyGif : freddyStill}
              alt=""
              draggable="false"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="analysis-compact-heading">
          <h3>{character.name}</h3>
          <small>PARTY MEMBER</small>
        </div>
      </div>

      {/* Roles */}
      <div className="analysis-role-list">
        {(character.fnafWorld?.roles || []).map(role => (
          <span className="role-tag" key={role.label}>
            {role.label}
          </span>
        ))}
      </div>

      {/* Moves */}
      <h4 className="analysis-compact-moves-heading">
        ⚡ Moveset <span aria-hidden="true">✦</span>
      </h4>

      <ul className="analysis-moves">
        {(character.fnafWorld?.moves || []).map(move => (
          <li key={move.name}>
            <span
              className="analysis-move-icon"
              aria-hidden="true"
            >
              {moveEmoji(move.name)}
            </span>

            <div className="analysis-move-text">
              <strong>{move.name}</strong>
              <span>{move.effect}</span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

/* ==========================================
   SWAP CHARACTER PREVIEW
   ========================================== */

function SwapCharacter({ id, name, label }) {
  const character = fnafData.find(item => item.id === id);
  const image = portraitById[id];

  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className="swap-character"
      style={character ? cardPalette(character) : {}}
    >
      <div className="swap-character-portrait">
        {image ? (
          <img src={image} alt={name} />
        ) : id === 'freddy' ? (
          <img src={freddyStill} alt={name} />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      <strong>{name}</strong>
      <small>{label}</small>
    </div>
  );
}

/* ==========================================
   MAIN PARTY ANALYSIS PAGE
   ========================================== */

export default function PartyAnalysis({
  party,
  partyNumber,
  onBack
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [coverageVisible, setCoverageVisible] = useState(false);
  const [coverageProgress, setCoverageProgress] = useState(0);

  const coverageRef = useRef(null);

  const characters = (party?.memberIds || [])
    .map(id =>
      fnafData.find(character => character.id === id)
    )
    .filter(Boolean);

  /* ----------------------------------------
     FETCH PARTY ANALYSIS
     ---------------------------------------- */

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError('');
    setAnalysis(null);
    setCoverageVisible(false);
    setCoverageProgress(0);

    fetch(`/api/parties/${party.id}/analyze`, {
      method: 'POST',
      signal: controller.signal
    })
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || 'Could not analyze this party.'
          );
        }

        return data;
      })
      .then(data => setAnalysis(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(
            err.message ||
            'Could not reach the analysis API.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [party.id]);

  /* ----------------------------------------
     START COVERAGE ANIMATION ON SCROLL
     ---------------------------------------- */

  useEffect(() => {
    if (!analysis || !coverageRef.current) return;

    const element = coverageRef.current;

    if (!('IntersectionObserver' in window)) {
      setCoverageVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCoverageVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [analysis]);

  /* ----------------------------------------
     ANIMATE COVERAGE NUMBERS AND BARS
     ---------------------------------------- */

  useEffect(() => {
    if (!coverageVisible) return;

    if (
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
    ) {
      setCoverageProgress(1);
      return;
    }

    let frame;
    let start;

    const duration = 1150;

    const tick = time => {
      if (start === undefined) start = time;

      const t = Math.min(
        (time - start) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - t, 3);

      setCoverageProgress(eased);

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [coverageVisible]);

  /* ----------------------------------------
     ABILITY COVERAGE DATA
     ---------------------------------------- */

  const roleEntries = Object.entries(
    analysis?.roleCounts || {}
  )
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  /* ========================================
     PAGE
     ======================================== */

  return (
    <main className="page-shell party-analysis-page">

      {/* Back button */}
      <button
        type="button"
        className="text-button back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to parties
      </button>

      {/* Page heading */}
      <div className="page-intro">
        <span className="eyebrow">
          <Sparkles size={15} />
          PARTY ANALYSIS
        </span>

        <h1>
          Party {partyNumber}{' '}
          <em>breakdown.</em>
        </h1>

        <p>
          Explore your team's moves, ability coverage,
          and possible swaps.
        </p>
      </div>

      {/* ====================================
          PARTY MEMBERS
          ==================================== */}

      <section className="analysis-section analysis-roster-section">
        <h2>Your animatronics</h2>

        <div className="analysis-character-grid">
          {characters.map(character => (
            <AnalysisCharacter
              key={character.id}
              character={character}
            />
          ))}
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <section
          className="analysis-section"
          role="status"
        >
          <p>Analyzing your party...</p>
        </section>
      )}

      {/* Error */}
      {error && (
        <section
          className="analysis-section"
          role="alert"
        >
          <h2>Analysis unavailable</h2>

          <p>{error}</p>

          <p>
            Make sure your Express server is
            running on port 3001.
          </p>
        </section>
      )}

      {/* ====================================
          ANALYSIS RESULTS
          ==================================== */}

      {analysis && (
        <>

          {/* Ability coverage */}
          <section className="analysis-section analysis-coverage-section">
            <h2>
              <Waves size={23} aria-hidden="true" />
              Ability coverage
            </h2>

            <p className="helper-text">
              Counts include all three moves for each
              animatronic, not only the two role labels
              shown on its card.
            </p>

            <div
              className="analysis-role-grid"
              ref={coverageRef}
            >
              {roleEntries.map(([role, count]) => {
                const width = characters.length
                  ? Math.min(
                      100,
                      (count / characters.length) * 100
                    )
                  : 0;

                return (
                  <div
                    className="analysis-role-card"
                    key={role}
                  >
                    <span
                      className="analysis-role-spark"
                      aria-hidden="true"
                    >
                      ✧
                    </span>

                    <div className="analysis-role-top">
                      <strong>{role}</strong>

                      <span className="analysis-role-count">
                        {Math.round(
                          count * coverageProgress
                        )}
                        <small>
                          {' '} / {characters.length}
                        </small>
                      </span>
                    </div>

                    <div
                      className="analysis-meter"
                      role="img"
                      aria-label={
                        `${count} of ${characters.length} ` +
                        `animatronics have ${role} abilities`
                      }
                    >
                      <span
                        style={{
                          width: `${width}%`,
                          transform: `scaleX(${coverageProgress})`
                        }}
                      />
                    </div>

                    <p>
                      {ROLE_DESCRIPTIONS[role] ||
                        'A combat ability represented in your party.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ==================================
              STRENGTHS AND WEAKNESSES
              ================================== */}

          <div className="analysis-feedback-grid">

            <section className="analysis-section analysis-strengths">
              <h2>
                <CheckCircle2 size={21} />
                Strengths
              </h2>

              <ul>
                {analysis.strengths.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="analysis-section analysis-weaknesses">
              <h2>
                <AlertCircle size={21} />
                Potential weaknesses
              </h2>

              {analysis.weaknesses.length ? (
                <ul>
                  {analysis.weaknesses.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No major ability-coverage gaps were identified.
                </p>
              )}
            </section>

          </div>

          {/* ==================================
              SUGGESTED PARTY SWAPS
              ================================== */}

          <section className="analysis-section analysis-swaps-section">
            <h2>
              <Sparkles size={22} aria-hidden="true" />
              Suggested party swaps
            </h2>

            <p className="helper-text">
              These suggestions compare ability coverage,
              not actual battle damage or cooldowns.
              A higher-ranked swap isn't guaranteed to
              perform better in combat.
            </p>

            {analysis.suggestions.length ? (
              <div className="analysis-recommendations">
                {analysis.suggestions.map(suggestion => (
                  <article
                    className="analysis-recommendation"
                    key={
                      `${suggestion.removeId}-` +
                      `${suggestion.addId}`
                    }
                  >
                    <h3>
                      Replace {suggestion.removeName}{' '}
                      with {suggestion.addName}
                    </h3>

                    <p>{suggestion.reason}</p>

                    <div
                      className="swap-preview"
                      aria-label={
                        `Swap ${suggestion.removeName} ` +
                        `for ${suggestion.addName}`
                      }
                    >
                      <SwapCharacter
                        id={suggestion.removeId}
                        name={suggestion.removeName}
                        label="Current"
                      />

                      <ArrowRight
                        className="swap-preview-arrow"
                        size={22}
                        aria-hidden="true"
                      />

                      <SwapCharacter
                        id={suggestion.addId}
                        name={suggestion.addName}
                        label="Suggested"
                      />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>
                No simple one-character swap improved
                this team's ability-coverage score.
                Keeping your party is a reasonable option!
              </p>
            )}
          </section>
        </>
      )}

      {/* Footer note */}
      <p className="helper-text below-list">
        Suggestions use a local FNaF World roster and
        simplified move categories. They are not
        verified optimal battle strategies.
      </p>

    </main>
  );
}
