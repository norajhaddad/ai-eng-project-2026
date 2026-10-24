
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Puzzle, Star, MapPin,
  Music2, Gift, Pizza, CakeSlice,
  Ghost, Heart, Sparkles, Zap,
  Shield, Swords, Drumstick,
  PartyPopper, Flame, WandSparkles
} from 'lucide-react';

function getMascotType(character) {
  const name = character.name.toLowerCase();

  if (/bonnie|springtrap|plushtrap|rabbit|bunny/.test(name))
    return 'bunny';

  if (/foxy|mangle|lolbit/.test(name))
    return 'fox';

  if (/freddy|fredbear|lefty|nedd bear/.test(name))
    return 'bear';

  if (/chica/.test(name))
    return 'chick';

  return 'other';
}

function getMoveIcon(name) {
  const move = name.toLowerCase();

  if (/pizza|cheese/.test(move)) return Pizza;
  if (/cupcake/.test(move)) return CakeSlice;
  if (/birthday/.test(move)) return Gift;
  if (/jam|song|music/.test(move)) return Music2;
  if (/jumpscare|ghost|haunt/.test(move)) return Ghost;
  if (/heal|regen|giftbox/.test(move)) return Heart;
  if (/party|balloon/.test(move)) return PartyPopper;
  if (/mic|bite|beak|hook/.test(move)) return Drumstick;
  if (/fire|flame/.test(move)) return Flame;
  if (/shield|armor|defense/.test(move)) return Shield;
  if (/speed|quick/.test(move)) return Zap;
  if (/magic|rainbow/.test(move)) return WandSparkles;
  if (/attack|bash|poppers/.test(move)) return Swords;

  return Sparkles;
}

export default function AnimatronicCard({
  character,
  accent,
  icon
}) {
  const { fnafWorld } = character;

  const isMinigame = character.unlockMethod === 'Minigame';
  const isPinwheel =
    character.unlockLocation === 'Pinwheel Funhouse';
  const isStarter = character.unlockMethod === 'Starter';

  const mascotType = getMascotType(character);

  function UnlockIcon() {
    if (isMinigame) return <Puzzle size={12} />;
    if (isPinwheel) return <Star size={12} />;
    return <MapPin size={12} />;
  }

  return (
    <article
      className={`animatronic-card card-${accent} aero-card aero-${mascotType}`}
    >
      <div className="card-banner">
        <div className="aero-banner-gloss" aria-hidden="true" />

        <span className="banner-sparkle" aria-hidden="true">
          ✦
        </span>

        <span className="aero-extra-sparkle" aria-hidden="true">
          ✧
        </span>

        <div className="aero-mascot">
          {mascotType !== 'other' && (
            <div className="aero-ears" aria-hidden="true">
              <span className="aero-ear left" />
              <span className="aero-ear right" />
            </div>
          )}

          <div className="aero-letter-badge">
            {icon}
          </div>
        </div>

        <span className="aero-bubble aero-bubble-one" aria-hidden="true" />
        <span className="aero-bubble aero-bubble-two" aria-hidden="true" />
      </div>

      <div className="card-body">
        <div className="aero-body-decoration" aria-hidden="true">
          {mascotType === 'bear' && '🐾'}
          {mascotType === 'bunny' && '🐰'}
          {mascotType === 'chick' && '🐣'}
          {mascotType === 'fox' && '✦'}
          {mascotType === 'other' && '✧'}
        </div>

        <div className="card-title-line">
          <h3>
            <Link
              to={`/characters/${character.id}`}
              className="character-profile-link"
            >
              {character.name}
            </Link>
          </h3>

          {isStarter && (
            <span className="starter-tag">STARTER</span>
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
            <span className="role-tag" key={role.label}>
              {role.label}
            </span>
          ))}
        </div>

        {isMinigame && character.minigame && (
          <p className="unlock-hint minigame-hint">
            <Puzzle size={14} aria-hidden="true" />
            <span>
              <strong>Minigame:</strong> {character.minigame}
            </span>
          </p>
        )}

        <h4>
          Moveset <span>✦</span>
        </h4>

        <ul className="move-list aero-move-list">
          {fnafWorld.moves.map(move => {
            const MoveIcon = getMoveIcon(move.name);

            return (
              <li key={move.name}>
                <span className="aero-move-icon" aria-hidden="true">
                  <MoveIcon size={19} strokeWidth={2.4} />
                </span>

                <div className="aero-move-text">
                  <strong>{move.name}</strong>
                  <span>{move.effect}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </article>
  );
}
