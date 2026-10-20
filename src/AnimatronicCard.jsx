
import React from 'react';
import { Puzzle, Star, MapPin } from 'lucide-react';

export default function AnimatronicCard({
  character,
  accent,
  icon,
}) {
  const { fnafWorld } = character;

  const isMinigame = character.unlockMethod === 'Minigame';
  const isPinwheel =
    character.unlockLocation === 'Pinwheel Funhouse';
  const isStarter = character.unlockMethod === 'Starter';

  function UnlockIcon() {
    if (isMinigame) return <Puzzle size={12} />;
    if (isPinwheel) return <Star size={12} />;
    return <MapPin size={12} />;
  }

  return (
    <article className={`animatronic-card card-${accent}`}>
      <div className="card-banner">
        <span className="banner-sparkle" aria-hidden="true">
          ✦
        </span>

        {icon}

        <span className="banner-dot" aria-hidden="true">
          ●
        </span>
      </div>

      <div className="card-body">
        <div className="card-title-line">
          <h3>{character.name}</h3>

          {isStarter && (
            <span className="starter-tag">
              STARTER
            </span>
          )}
        </div>

        <p className="character-subtitle">
          {character.originalGame}
          {character.update === 2 ? ' · Update 2' : ''}
        </p>

        <div className="character-badges">
          <span
            className={`unlock-badge ${
              isMinigame
                ? 'unlock-minigame'
                : isPinwheel
                  ? 'unlock-pinwheel'
                  : 'unlock-normal'
            }`}
            title={character.unlockDetail}
          >
            <UnlockIcon />
            {character.unlockBadge}
          </span>

          {fnafWorld.roles.map(role => (
            <span
              className="role-tag"
              key={role.label}
            >
              {role.label}
            </span>
          ))}
        </div>

        {isMinigame && character.minigame && (
          <p className="unlock-hint">
            {character.minigame}
          </p>
        )}

        <h4>
          Moveset <span>✦</span>
        </h4>

        <ul className="move-list">
          {fnafWorld.moves.map(move => (
            <li key={move.name}>
              <strong>{move.name}</strong>
              <span>{move.effect}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
