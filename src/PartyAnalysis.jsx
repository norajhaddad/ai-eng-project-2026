import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import fnafData from './fnaf-roster.js';

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

// Reuse the same portrait filenames as the character gallery.
const portraitModules = import.meta.glob(
  './assets/characters/*.{png,jpg,jpeg,webp}',
  { eager: true, query: '?url', import: 'default' }
);

const portraitById = Object.fromEntries(
  Object.entries(portraitModules).map(([path, url]) => [
    path.split('/').pop().replace(/\.(png|jpg|jpeg|webp)$/i, ''),
    url
  ])
);

function SwapCharacter({ id, name, label }) {
  const image = portraitById[id];
  const initials = name.split(' ').map(word => word[0]).join('').slice(0, 2);

  return (
    <div className="swap-character">
      <div className="swap-character-portrait">
        {image ? <img src={image} alt={name} /> : <span>{initials}</span>}
      </div>
      <strong>{name}</strong>
      <small>{label}</small>
    </div>
  );
}

export default function PartyAnalysis({ party, partyNumber, onBack }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const characters = party.memberIds
    .map(id => fnafData.find(character => character.id === id))
    .filter(Boolean);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setAnalysis(null);

    fetch(`/api/parties/${party.id}/analyze`, {
      method: 'POST',
      signal: controller.signal
    })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Could not analyze this party.');
        }
        return data;
      })
      .then(data => setAnalysis(data))
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Could not reach the analysis API.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [party.id]);

  const roleEntries = Object.entries(analysis?.roleCounts || {})
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <main className="page-shell party-analysis-page">
      <button
        type="button"
        className="text-button back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Back to parties
      </button>

      <div className="page-intro">
        <span className="eyebrow">
          <Sparkles size={15} />
          PARTY ANALYSIS
        </span>
        <h1>Party {partyNumber} <em>breakdown.</em></h1>
        <p>Explore your team's moves, ability coverage, and possible swaps.</p>
      </div>

      <section className="analysis-section">
        <h2>Your animatronics</h2>
        <div className="analysis-character-grid">
          {characters.map(character => (
            <article className="analysis-character" key={character.id}>
              <h3>{character.name}</h3>
              <div className="analysis-role-list">
                {(character.fnafWorld?.roles || []).map(role => (
                  <span className="role-tag" key={role.label}>
                    {role.label}
                  </span>
                ))}
              </div>
              <h4>Moves</h4>
              <ul>
                {(character.fnafWorld?.moves || []).map(move => (
                  <li key={move.name}>
                    <strong>{move.name}</strong>
                    <span>{move.effect}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {loading && (
        <section className="analysis-section" role="status">
          <p>Analyzing your party...</p>
        </section>
      )}
      {error && (
        <section className="analysis-section" role="alert">
          <h2>Analysis unavailable</h2>
          <p>{error}</p>
          <p>Make sure your Express server is running on port 3001.</p>
        </section>
      )}

      {analysis && (
        <>
          <section className="analysis-section">
            <h2>Ability coverage</h2>
            <p className="helper-text">
              Counts include all three moves for each animatronic, not only
              the two role labels shown on its card.
            </p>
            <div className="analysis-role-grid">
              {roleEntries.map(([role, count]) => (
                <div className="analysis-role-card" key={role}>
                  <strong>{role}</strong>
                  <span className="analysis-role-count">
                    {count} / {characters.length}
                  </span>
                  <p>
                    {ROLE_DESCRIPTIONS[role] ||
                      'A combat ability represented in your party.'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="analysis-feedback-grid">
            <section className="analysis-section analysis-strengths">
              <h2><CheckCircle2 size={21} /> Strengths</h2>
              <ul>
                {analysis.strengths.map(item => <li key={item}>{item}</li>)}
              </ul>
            </section>
            <section className="analysis-section analysis-weaknesses">
              <h2><AlertCircle size={21} /> Potential weaknesses</h2>
              {analysis.weaknesses.length ? (
                <ul>
                  {analysis.weaknesses.map(item => <li key={item}>{item}</li>)}
                </ul>
              ) : (
                <p>No major ability-coverage gaps were identified.</p>
              )}
            </section>
          </div>

          <section className="analysis-section">
            <h2>Suggested party swaps</h2>
            <p className="helper-text">
              These suggestions compare ability coverage, not actual
              battle damage or cooldowns. A higher-ranked swap isn't
              guaranteed to perform better in combat.
            </p>
            {analysis.suggestions.length ? (
              <div className="analysis-recommendations">
                {analysis.suggestions.map(suggestion => (
                  <article
                    className="analysis-recommendation"
                    key={`${suggestion.removeId}-${suggestion.addId}`}
                  >
                    <h3>
                      Replace {suggestion.removeName} with {suggestion.addName}
                    </h3>
                    <p>{suggestion.reason}</p>
                    <div className="swap-preview" aria-label={`Swap ${suggestion.removeName} for ${suggestion.addName}`}>
                      <SwapCharacter
                        id={suggestion.removeId}
                        name={suggestion.removeName}
                        label="Current"
                      />
                      <ArrowRight className="swap-preview-arrow" size={22} aria-hidden="true" />
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
                No simple one-character swap improved this team's
                ability-coverage score. Keeping your party is a reasonable option!
              </p>
            )}
          </section>
        </>
      )}

      <p className="helper-text below-list">
        Suggestions use a local FNaF World roster and simplified move
        categories. They are not verified optimal battle strategies.
      </p>
    </main>
  );
}
