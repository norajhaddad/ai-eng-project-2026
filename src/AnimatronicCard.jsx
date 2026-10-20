import React from 'react';

export default function AnimatronicCard({
  character,
  accent,
  icon,
}) {
  const { fnafWorld } = character;

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

          <span className="starter-tag">
            STARTER
          </span>
        </div>

        <p className="character-subtitle">
          {fnafWorld.characterName}
        </p>

        <div className="role-tags">
          {fnafWorld.roles.map((role) => (
            <span className="role-tag" key={role.label}>
              {role.label}
            </span>
          ))}
        </div>

        <h4>
          Moveset <span>✦</span>
        </h4>

        <ul className="move-list">
          {fnafWorld.moves.map((move) => (
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
